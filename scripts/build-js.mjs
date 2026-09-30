// src/js/afrigov.js -> dist/afrigov.js (ESM) and dist/afrigov.iife.js (script tag, window.AfriGov)
import { build } from "esbuild";
import { join } from "node:path";
import { readFileSync, statSync } from "node:fs";
import { ROOT } from "./tokens.mjs";

const entry = join(ROOT, "src", "js", "afrigov.js");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const banner = { js: `/*! afrigov v${pkg.version} | MIT | https://github.com/omoyolab/afrigov */` };

await build({
  entryPoints: [entry],
  bundle: true,
  format: "esm",
  target: "es2019",
  outfile: join(ROOT, "dist", "afrigov.js"),
  banner,
});
await build({
  entryPoints: [entry],
  bundle: true,
  format: "iife",
  globalName: "AfriGov",
  target: "es2019",
  minify: true,
  outfile: join(ROOT, "dist", "afrigov.iife.js"),
  banner,
  footer: { js: "AfriGov.init();" },
});

const size = statSync(join(ROOT, "dist", "afrigov.iife.js")).size;
console.log(`afrigov.iife.js ${size} bytes`);
