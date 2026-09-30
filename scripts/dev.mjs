// Rebuilds on change and serves docs/ on http://localhost:4321 with no dependencies.
import { watch } from "node:fs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { spawn } from "node:child_process";
import { ROOT } from "./tokens.mjs";

const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

let building = false;
let queued = false;
function rebuild() {
  if (building) {
    queued = true;
    return;
  }
  building = true;
  const p = spawn("pnpm", ["build"], { stdio: "inherit", cwd: ROOT });
  p.on("exit", () => {
    building = false;
    if (queued) {
      queued = false;
      rebuild();
    }
  });
}

for (const dir of ["src", "tokens"]) {
  watch(join(ROOT, dir), { recursive: true }, () => rebuild());
}
rebuild();

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith("/")) path += "index.html";
  // Serve docs/ at root and dist/ at /dist so docs can use relative links either way.
  const file = path.startsWith("/dist/") ? join(ROOT, normalize(path)) : join(ROOT, "docs", normalize(path));
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(4321, () => console.log("docs: http://localhost:4321"));
