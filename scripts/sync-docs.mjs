// Copies dist/ into docs/dist/ so the docs site works from a plain file, the
// dev server, GitHub Pages, and the Playwright a11y tests without any rewriting.
import { cpSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./tokens.mjs";

const target = join(ROOT, "docs", "dist");
rmSync(target, { recursive: true, force: true });
cpSync(join(ROOT, "dist"), target, { recursive: true });

// Pack metadata as a script, so the docs can read strings when opened from a
// plain file (fetch is blocked on file://) and no network round trip is needed.
const packs = {};
for (const f of readdirSync(target).filter((f) => /^[a-z]{2}\.json$/.test(f))) {
  packs[f.replace(".json", "")] = JSON.parse(readFileSync(join(target, f), "utf8"));
}
writeFileSync(join(target, "packs.js"), `window.AFRIGOV_PACKS = ${JSON.stringify(packs)};\n`);
console.log(`docs/dist synced (${Object.keys(packs).join(", ")})`);
