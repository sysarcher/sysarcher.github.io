# excalidraw-export

Headless `.excalidraw` → `.svg` export for the blog's diagrams.

The SVGs in `content/posts/examination-at-scale/` were produced with this
script. It runs the real Excalidraw export pipeline in headless Chrome, so
fonts are subsetted to the used glyphs and embedded in the SVG — the files are
self-contained and render identically everywhere.

## Setup

```sh
cd scripts/excalidraw-export
npm install
```

Requires Node 20+ and a Chrome/Chromium binary on `PATH` (or set `CHROME`).

## Usage

```sh
node export.mjs ../../content/posts/examination-at-scale/old-architecture.excalidraw
```

Writes `old-architecture.svg` next to the input and prints the path.

## Sharing (excalidraw.com links)

```sh
node share.mjs path/to/diagram.excalidraw [...]
```

Uploads each scene and prints a shareable `https://excalidraw.com/#json=...`
link, then verifies it by fetching the stored payload back and decrypting it —
a link is only printed once the scene round-trips with the expected element
count.

> Caveat: opencode's built-in `export_to_excalidraw` MCP tool uploads the given
> string verbatim. It expects a **full scene JSON** (what the app's Share button
> sends via `serializeAsJSON`), not a bare elements array — passing an array
> produces a link that opens an empty canvas. `share.mjs` builds the scene
> wrapper itself.

## Notes

- Scenes can also be edited visually: drag the `.excalidraw` file into
  <https://excalidraw.com>, or restore it through the `excalidraw` MCP server
  configured in `opencode.jsonc` (`read_checkpoint` / the app UI).
- The export always uses a white background so diagrams stay readable in both
  light and dark blog themes.
- Font subsetting falls back to Chrome's main thread; the console may log
  `Failed to use workers for subsetting` — harmless.
