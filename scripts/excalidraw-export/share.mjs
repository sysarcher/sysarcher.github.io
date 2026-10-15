#!/usr/bin/env node
// Publish .excalidraw scenes to excalidraw.com and print shareable links.
//
// Replicates the upload format of the upstream `export_to_excalidraw` MCP tool
// (v2 concat-buffers + zlib deflate + AES-GCM-128) — but from a scene *file*,
// and with a round-trip verification (fetch + decrypt) so a link is only
// printed once the stored scene is confirmed to decode.
//
//   node share.mjs path/to/diagram.excalidraw [...]
//   node share.mjs --verify https://excalidraw.com/#json=<id>,<key>

import { deflateSync, inflateSync } from "node:zlib";
import fs from "node:fs";

const JSON_BACKEND = "https://json.excalidraw.com/api/v2";

const concatBuffers = (...bufs) => {
  let total = 4;
  for (const b of bufs) total += 4 + b.length;
  const out = new Uint8Array(total);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, 1);
  let off = 4;
  for (const b of bufs) {
    dv.setUint32(off, b.length);
    off += 4;
    out.set(b, off);
    off += b.length;
  }
  return out;
};

const parseConcatBuffers = payload => {
  const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  let off = 4; // version
  const parts = [];
  while (off < payload.length) {
    const len = dv.getUint32(off);
    off += 4;
    parts.push(payload.subarray(off, off + len));
    off += len;
  }
  return parts;
};

const sceneToJson = scene =>
  JSON.stringify({
    type: "excalidraw",
    version: 2,
    source: "database",
    elements: scene.elements,
    appState: { gridSize: null, viewBackgroundColor: "#ffffff" },
    files: {},
  });

const publish = async jsonString => {
  const te = new TextEncoder();
  const inner = concatBuffers(te.encode("{}"), te.encode(jsonString));
  const compressed = deflateSync(Buffer.from(inner));
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 128 }, true, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, compressed);
  const encodingMeta = te.encode(JSON.stringify({ version: 2, compression: "pako@1", encryption: "AES-GCM" }));
  const payload = Buffer.from(concatBuffers(encodingMeta, iv, new Uint8Array(encrypted)));

  const res = await fetch(`${JSON_BACKEND}/post/`, { method: "POST", body: payload });
  if (!res.ok) throw new Error(`upload failed: HTTP ${res.status}`);
  const { id } = await res.json();

  const jwk = await crypto.subtle.exportKey("jwk", key);
  return `https://excalidraw.com/#json=${id},${jwk.k}`;
};

const verify = async url => {
  const fragment = url.split("#json=")[1];
  if (!fragment) throw new Error("not an excalidraw share URL");
  const [id, keyPart] = fragment.split(",");
  const res = await fetch(`${JSON_BACKEND}/${id}`);
  if (!res.ok) throw new Error(`fetch failed: HTTP ${res.status}`);
  const payload = new Uint8Array(await res.arrayBuffer());

  const [metaBytes, iv, encrypted] = parseConcatBuffers(payload);
  const meta = JSON.parse(new TextDecoder().decode(metaBytes));
  if (meta.encryption !== "AES-GCM") throw new Error(`unexpected encryption ${meta.encryption}`);

  const key = await crypto.subtle.importKey("raw", Buffer.from(keyPart, "base64url"), { name: "AES-GCM" }, false, [
    "decrypt",
  ]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
  const innerParts = parseConcatBuffers(new Uint8Array(inflateSync(Buffer.from(decrypted))));
  const scene = JSON.parse(new TextDecoder().decode(innerParts[1]));

  return { id, type: scene.type, elements: scene.elements?.length ?? 0 };
};

const args = process.argv.slice(2);
if (args[0] === "--verify") {
  const info = await verify(args[1]);
  console.log(`verified: type=${info.type} elements=${info.elements}`);
  process.exit(info.type === "excalidraw" && info.elements > 0 ? 0 : 1);
}

for (const file of args) {
  const scene = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(scene.elements) || scene.elements.length === 0) {
    console.error(`${file}: not an excalidraw scene with elements`);
    process.exitCode = 1;
    continue;
  }
  const url = await publish(sceneToJson(scene));
  const info = await verify(url);
  if (info.elements !== scene.elements.length) {
    console.error(`${file}: verification mismatch (${info.elements} of ${scene.elements.length} elements)`);
    process.exitCode = 1;
    continue;
  }
  console.log(`${file}\n  ${url}\n  verified: ${info.elements} elements`);
}
