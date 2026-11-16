// Copies the web app into www/, which Capacitor bundles into the iOS app.
import { cpSync, rmSync, mkdirSync } from "node:fs";
const root = new URL("..", import.meta.url).pathname, out = root + "www";
rmSync(out, { recursive: true, force: true }); mkdirSync(out);
for (const f of ["index.html", "manifest.webmanifest", "icon.svg", "icon-180.png", "icon-512.png", "css", "js", "content"])
  cpSync(root + f, `${out}/${f}`, { recursive: true });
console.log("Built www/");
