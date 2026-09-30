// tokens/*.json -> build/tokens.css and build/packs/<cc>.css
// Fails the build if any colour pair in CONTRAST_PAIRS misses its ratio.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { contrast } from "./color.mjs";
import {
  CONTRAST_PAIRS,
  ROOT,
  cssVarName,
  listPacks,
  loadCore,
  loadPack,
  mergedColors,
  toCssValue,
} from "./tokens.mjs";

const BUILD = join(ROOT, "build");
mkdirSync(join(BUILD, "packs"), { recursive: true });

const core = loadCore();

function checkPairs(colors, label) {
  const failures = [];
  for (const [fg, bg, min, why] of CONTRAST_PAIRS) {
    const ratio = contrast(colors[fg], colors[bg]);
    if (ratio < min) failures.push(`${label}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1, needs ${min}:1 (${why})`);
  }
  return failures;
}

// --- core ---------------------------------------------------------------
const coreLines = Object.entries(core).map(([k, t]) => `  ${cssVarName(k)}: ${toCssValue(t)};`);
const coreCss = `/* Generated from tokens/core.tokens.json. Do not edit. */\n:root {\n${coreLines.join("\n")}\n}\n`;
writeFileSync(join(BUILD, "tokens.css"), coreCss);

let failures = checkPairs(mergedColors(core), "core");

// --- packs --------------------------------------------------------------
const packs = listPacks().map((code) => loadPack(code, core));
for (const pack of packs) {
  const merged = mergedColors(core, pack);
  failures = failures.concat(checkPairs(merged, `pack ${pack.code}`));

  const lines = [];
  for (const [k, v] of Object.entries(pack.overrides)) lines.push(`  ${cssVarName(k)}: ${v};`);
  for (const [k, v] of Object.entries(pack.official)) lines.push(`  ${cssVarName(k)}: ${v};`);
  pack.meta.flag?.forEach((v, i) => lines.push(`  ${cssVarName(`flag.${i + 1}`)}: ${v};`));
  lines.push(`  ${cssVarName("flag.count")}: ${pack.meta.flag?.length ?? 0};`);
  lines.push(`  ${cssVarName("flag.direction")}: ${pack.meta.flagDirection ?? "row"};`);

  const notes = pack.notes.length ? pack.notes.map((n) => ` * ${n}`).join("\n") + "\n" : "";
  const css =
    `/* afrigov country pack: ${pack.meta.country ?? pack.code} (${pack.code}). Generated from tokens/packs/${pack.code}.tokens.json. */\n` +
    (notes ? `/*\n${notes} */\n` : "") +
    `:root,\n[data-ag-pack="${pack.code}"] {\n${lines.join("\n")}\n}\n`;
  writeFileSync(join(BUILD, "packs", `${pack.code}.css`), css);

  // A JSON sidecar with the resolved values and strings, for docs and tooling.
  writeFileSync(
    join(BUILD, "packs", `${pack.code}.json`),
    JSON.stringify(
      { code: pack.code, ...pack.meta, official: pack.official, colors: pack.overrides, notes: pack.notes },
      null,
      2,
    ),
  );

  const adj = pack.notes.length ? ` (${pack.notes.length} colour derived for AA)` : "";
  console.log(
    `pack ${pack.code}: primary ${pack.overrides["color.primary"]} at ${pack.contrastOnPaper.toFixed(2)}:1${adj}`,
  );
}

if (failures.length) {
  console.error("\nContrast check failed:\n" + failures.map((f) => "  " + f).join("\n"));
  process.exit(1);
}
console.log(`tokens: ${Object.keys(core).length} core tokens, ${packs.length} packs, all contrast pairs pass`);
