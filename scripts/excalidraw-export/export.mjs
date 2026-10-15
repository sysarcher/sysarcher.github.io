#!/usr/bin/env node
// Export .excalidraw scenes to self-contained SVGs (fonts subsetted and
// embedded) by running the real Excalidraw export pipeline in headless Chrome.
//
//   node export.mjs path/to/diagram.excalidraw [...]
//
// Writes diagram.svg next to each diagram.excalidraw.

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const inputs = process.argv.slice(2).map(p => path.resolve(p));
if (inputs.length === 0) {
  console.error("usage: node export.mjs <diagram.excalidraw> [...]");
  process.exit(1);
}

const pkgDist = path.join(here, "node_modules", "@excalidraw", "excalidraw", "dist", "prod");
if (!fs.existsSync(pkgDist)) {
  console.error(`Missing ${pkgDist}.\nRun \`npm install\` in ${here} first.`);
  process.exit(1);
}

const scenes = {};
const outputs = {};
for (const input of inputs) {
  const scene = JSON.parse(fs.readFileSync(input, "utf8"));
  if (!Array.isArray(scene.elements)) {
    console.error(`${input}: not an excalidraw scene (missing elements[])`);
    process.exit(1);
  }
  const name = path.basename(input).replace(/\.excalidraw$/, "");
  scenes[name] = scene.elements;
  outputs[name] = path.join(path.dirname(input), `${name}.svg`);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "excalidraw-export-"));
const bundlePath = path.join(tmp, "entry.bundle.js");
const esbuild = path.join(here, "node_modules", ".bin", "esbuild");
const build = spawnSync(
  esbuild,
  [
    path.join(here, "entry.mjs"),
    "--bundle",
    "--platform=browser",
    "--format=esm",
    `--outfile=${bundlePath}`,
    '--define:process.env.NODE_ENV="production"',
  ],
  { stdio: "inherit" }
);
if (build.status !== 0) process.exit(build.status ?? 1);

const port = 8731 + Math.floor(Math.random() * 200);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
};

const sceneNames = Object.keys(scenes);
let savedCount = 0;
let chromeProc = null;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);

  if (req.method === "POST" && url.pathname === "/save") {
    const name = url.searchParams.get("name");
    if (!name || !(name in outputs)) {
      res.writeHead(400);
      res.end("unknown scene");
      return;
    }
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => {
      fs.writeFileSync(outputs[name], Buffer.concat(chunks));
      savedCount += 1;
      console.log(`wrote ${path.relative(process.cwd(), outputs[name])}`);
      res.writeHead(200);
      res.end("ok");
      if (savedCount === sceneNames.length && chromeProc) {
        setTimeout(() => chromeProc.kill("SIGTERM"), 250);
      }
    });
    return;
  }

  if (url.pathname === "/scenes.json") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(scenes));
    return;
  }

  let file;
  if (url.pathname === "/" || url.pathname === "/page.html") {
    file = path.join(here, "page.html");
  } else if (url.pathname === "/entry.bundle.js") {
    file = bundlePath;
  } else if (url.pathname.startsWith("/fonts/")) {
    file = path.join(pkgDist, decodeURIComponent(url.pathname));
  } else {
    res.writeHead(404);
    res.end("not found");
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
    res.end(data);
  });
});

await new Promise(resolve => server.listen(port, resolve));

const chrome = process.env.CHROME || "google-chrome";
const virtualTimeBudget = process.env.EXPORT_VIRTUAL_TIME_BUDGET || "180000";
const chromeArgs = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  `--virtual-time-budget=${virtualTimeBudget}`,
  "--dump-dom",
  `http://localhost:${port}/page.html`,
];
if (process.env.DEBUG_EXPORT) {
  chromeArgs.push("--enable-logging=stderr", "--v=0");
}
chromeProc = spawn(chrome, chromeArgs, { stdio: ["ignore", "pipe", "inherit"] });

let stdout = "";
chromeProc.stdout.on("data", chunk => {
  stdout += chunk;
});

const exitCode = await new Promise(resolve => {
  const timer = setTimeout(() => {
    chromeProc.kill("SIGKILL");
  }, 60000);
  chromeProc.on("close", code => {
    clearTimeout(timer);
    resolve(code);
  });
});

server.close();
fs.rmSync(tmp, { recursive: true, force: true });

if (savedCount !== sceneNames.length) {
  const title = /<title>([^<]*)<\/title>/.exec(stdout)?.[1] ?? "missing";
  console.error(`export failed: saved ${savedCount}/${sceneNames.length} scenes (exit ${exitCode}, page title: ${title})`);
  process.exit(1);
}
