// Assembles src/css into dist/core.css (readable) and dist/core.min.css, wrapping
// each part in its cascade layer. Copies packs to dist/<cc>.css. Enforces the
// size budget: core.min.css must gzip to 20 KB or less.
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { transform } from "esbuild";
import { ROOT } from "./tokens.mjs";

const SRC = join(ROOT, "src", "css");
const BUILD = join(ROOT, "build");
const DIST = join(ROOT, "dist");
const BUDGET_BYTES = 20 * 1024;

// Order matters inside the components layer only for readability; specificity
// is flat because every selector is a single class.
const COMPONENTS = [
  "skip-link",
  "banner",
  "header",
  "footer",
  "button",
  "breadcrumb",
  "pagination",
  "form",
  "error-summary",
  "date-input",
  "phone",
  "id-input",
  "money",
  "char-count",
  "card",
  "details",
  "lang",
  "back-link",
  "list",
  "image",
  "download",
  "empty",
  "hero",
  "statement",
  "social",
  "alert",
  "accordion",
  "table",
  "badge",
  "panel",
];

const read = (p) => readFileSync(p, "utf8");
const layer = (name, css) => `@layer ${name} {\n${css.trim()}\n}\n`;

const pkg = JSON.parse(read(join(ROOT, "package.json")));
const header = `/*! afrigov v${pkg.version} | MIT | https://github.com/omoyolab/afrigov */\n`;

const parts = [
  header,
  "@layer reset, tokens, base, components, utilities;\n",
  layer("reset", read(join(SRC, "reset.css"))),
  layer("tokens", read(join(BUILD, "tokens.css"))),
  layer("base", read(join(SRC, "base.css"))),
  layer("components", COMPONENTS.map((c) => read(join(SRC, "components", `${c}.css`))).join("\n")),
  layer("utilities", read(join(SRC, "utilities.css"))),
];

mkdirSync(DIST, { recursive: true });
const core = parts.join("\n");
writeFileSync(join(DIST, "core.css"), core);

const min = await transform(core, { loader: "css", minify: true, legalComments: "inline" });
writeFileSync(join(DIST, "core.min.css"), min.code);

const gz = gzipSync(min.code).length;
console.log(
  `core.css ${(core.length / 1024).toFixed(1)} KB, core.min.css ${(min.code.length / 1024).toFixed(1)} KB, gzip ${(gz / 1024).toFixed(1)} KB (budget ${BUDGET_BYTES / 1024} KB)`,
);
if (gz > BUDGET_BYTES) {
  console.error(`Size budget exceeded by ${gz - BUDGET_BYTES} bytes gzipped.`);
  process.exit(1);
}

if (existsSync(join(BUILD, "packs", "flags"))) {
  cpSync(join(BUILD, "packs", "flags"), join(DIST, "flags"), { recursive: true });
}
for (const f of readdirSync(join(BUILD, "packs")).filter((f) => f !== "flags")) {
  const src = join(BUILD, "packs", f);
  if (f.endsWith(".css")) {
    const css = read(src);
    writeFileSync(join(DIST, f), css);
    const packMin = await transform(css, { loader: "css", minify: true });
    writeFileSync(join(DIST, f.replace(".css", ".min.css")), packMin.code);
  } else {
    copyFileSync(src, join(DIST, f));
  }
}
console.log(
  `packs: ${readdirSync(join(BUILD, "packs"))
    .filter((f) => f.endsWith(".css"))
    .join(", ")}`,
);
