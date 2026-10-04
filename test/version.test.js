import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT } from "../scripts/tokens.mjs";

// The install snippets name the exact version, so a fix is not held back by a week of browser cache.
const { version } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const files = [
  "README.md",
  ...readdirSync(join(ROOT, "site", "templates"))
    .filter((f) => f.endsWith(".html"))
    .map((f) => join("site", "templates", f)),
];

describe("CDN links", () => {
  for (const file of files) {
    it(`${file} uses afrigov@${version}`, () => {
      const links = readFileSync(join(ROOT, file), "utf8").match(/afrigov@[^/]+\/dist\//g) ?? [];
      for (const link of links) expect(link).toBe(`afrigov@${version}/dist/`);
    });
  }
});
