// Writes the exact package version into the CDN links of the README and the page templates.
// An exact version is cached for good and changes address with each release, so a fix reaches
// every visitor at once. A range such as @0.13 is cached in browsers for up to seven days.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./tokens.mjs";

const { version } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const files = [
  join(ROOT, "README.md"),
  ...readdirSync(join(ROOT, "site", "templates"))
    .filter((f) => f.endsWith(".html"))
    .map((f) => join(ROOT, "site", "templates", f)),
];
let changed = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = before.replace(
    /cdn\.jsdelivr\.net\/npm\/afrigov@[^/]+\/dist\//g,
    `cdn.jsdelivr.net/npm/afrigov@${version}/dist/`,
  );
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`CDN links at afrigov@${version} (${changed} files updated)`);
