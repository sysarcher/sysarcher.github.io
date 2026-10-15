import { exportToSvg } from "@excalidraw/excalidraw";

window.runExports = async (scenes) => {
  const done = [];
  for (const [name, elements] of Object.entries(scenes)) {
    const svg = await exportToSvg({
      elements,
      appState: { exportBackground: true, viewBackgroundColor: "#ffffff" },
      files: null,
    });
    const str = new XMLSerializer().serializeToString(svg);
    await fetch(`/save?name=${encodeURIComponent(name)}`, { method: "POST", body: str });
    done.push(name);
  }
  return done;
};
