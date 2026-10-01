import { readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import { PACKS_DIR, listPacks } from "../scripts/tokens.mjs";

const schema = JSON.parse(readFileSync(join(PACKS_DIR, "pack.schema.json"), "utf8"));
const ajv = new Ajv({ allErrors: true, strict: true });
const validate = ajv.compile(schema);

const describeErrors = () => (validate.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message}`).join("\n");

describe("pack schema", () => {
  it("is itself a valid JSON Schema", () => {
    expect(ajv.validateSchema(schema)).toBe(true);
  });

  it.each(listPacks())("pack %s validates", (code) => {
    const pack = JSON.parse(readFileSync(join(PACKS_DIR, `${code}.tokens.json`), "utf8"));
    const ok = validate(pack);
    expect(ok, describeErrors()).toBe(true);
  });

  it.each(listPacks())("pack %s declares its default language in strings", (code) => {
    const pack = JSON.parse(readFileSync(join(PACKS_DIR, `${code}.tokens.json`), "utf8"));
    const meta = pack.$extensions.afrigov;
    expect(Object.keys(meta.strings)).toContain(meta.language ?? "en");
    expect(meta.strings[meta.language ?? "en"].banner, "default language banner").toBeTruthy();
  });

  it("rejects a pack with a missing phone block and a bad domain", () => {
    const bad = {
      $extensions: {
        afrigov: {
          code: "xx",
          country: "Example",
          government: "Example",
          domain: "gov.xx",
          flag: ["{official.a}", "{official.b}"],
          strings: { en: { banner: "x" } },
          currency: { code: "XXX", symbol: "X", hint: "x" },
          id: { name: "x", short: "x", document: "x", hint: "x" },
          regions: { label: "x", choose: "x", items: ["x"] },
          examples: { timezone: "x", refPrefix: "XX" },
        },
      },
      official: { $type: "color", a: { $value: "#000000" }, b: { $value: "#ffffff" } },
      color: { $type: "color", primary: { $value: "{official.a}" } },
    };
    expect(validate(bad)).toBe(false);
    const messages = describeErrors();
    expect(messages).toMatch(/phone/);
    expect(messages).toMatch(/domain/);
  });
});
