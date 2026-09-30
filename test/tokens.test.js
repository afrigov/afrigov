import { describe, expect, it } from "vitest";
import { cssVarName, flatten, listPacks, loadCore, loadPack, resolveAliases, toCssValue } from "../scripts/tokens.mjs";

const HEX = /^#[0-9a-f]{6}$/;

describe("token flattening", () => {
  it("flattens nested groups and inherits $type", () => {
    const flat = flatten({ color: { $type: "color", ink: { $value: "#000" }, deep: { er: { $value: "#111" } } } });
    expect(flat["color.ink"]).toEqual({ value: "#000", type: "color", description: undefined });
    expect(flat["color.deep.er"].type).toBe("color");
  });

  it("resolves aliases, including chains", () => {
    const flat = resolveAliases(flatten({ a: { $value: "#123456" }, b: { $value: "{a}" }, c: { $value: "{b}" } }));
    expect(flat.c.value).toBe("#123456");
  });

  it("rejects unknown and circular aliases", () => {
    expect(() => resolveAliases(flatten({ a: { $value: "{nope}" } }))).toThrow(/Unknown/);
    expect(() => resolveAliases(flatten({ a: { $value: "{b}" }, b: { $value: "{a}" } }))).toThrow(/Circular/);
  });

  it("names CSS variables with the ag prefix", () => {
    expect(cssVarName("color.primary-hover")).toBe("--ag-color-primary-hover");
    expect(cssVarName("space.4")).toBe("--ag-space-4");
  });

  it("quotes multi-word font families", () => {
    expect(toCssValue({ type: "fontFamily", value: ["system-ui", "Noto Sans", "Arial"] })).toBe(
      'system-ui, "Noto Sans", Arial',
    );
  });
});

describe("core tokens", () => {
  const core = loadCore();

  it("defines the colours every component relies on", () => {
    for (const key of [
      "color.ink",
      "color.ink-muted",
      "color.paper",
      "color.paper-alt",
      "color.primary",
      "color.on-primary",
      "color.link",
      "color.focus",
      "color.error",
      "size.target",
      "size.measure",
      "font.family-sans",
    ]) {
      expect(core[key], key).toBeDefined();
    }
  });

  it("uses six-digit lowercase hex for every colour", () => {
    for (const [k, t] of Object.entries(core)) {
      if (t.type === "color") expect(t.value, k).toMatch(HEX);
    }
  });

  it("keeps body text at 16px or larger and touch targets at 48px", () => {
    expect(core["font.size-sm"].value).toBe("1rem");
    expect(core["size.target"].value).toBe("3rem");
  });

  it("names Noto Sans before Arial so African Latin diacritics have coverage", () => {
    const fams = core["font.family-sans"].value;
    expect(fams.indexOf("Noto Sans")).toBeGreaterThan(-1);
    expect(fams.indexOf("Noto Sans")).toBeLessThan(fams.indexOf("Arial"));
  });
});

describe("country packs", () => {
  const core = loadCore();
  const packs = listPacks();

  it("ships at least Nigeria and Kenya", () => {
    expect(packs).toContain("ng");
    expect(packs).toContain("ke");
  });

  it.each(packs)("pack %s has metadata, official colours and an English banner string", (code) => {
    const pack = loadPack(code, core);
    expect(pack.meta.code).toBe(code);
    expect(pack.meta.country).toBeTruthy();
    expect(pack.meta.domain).toMatch(/^\./);
    expect(pack.meta.strings?.en?.banner).toBeTruthy();
    expect(Object.keys(pack.official).length).toBeGreaterThan(0);
    expect(pack.meta.flag.length).toBeGreaterThanOrEqual(2);
    for (const v of pack.meta.flag) expect(v).toMatch(HEX);
  });

  it.each(packs)("pack %s carries currency, national ID and region data for the docs examples", (code) => {
    const { meta } = loadPack(code, core);
    expect(meta.currency?.symbol, "currency.symbol").toBeTruthy();
    expect(meta.currency?.code, "currency.code").toMatch(/^[A-Z]{3}$/);
    expect(meta.id?.name, "id.name").toBeTruthy();
    expect(meta.id?.hint, "id.hint").toBeTruthy();
    expect(meta.regions?.label, "regions.label").toBeTruthy();
    expect(meta.regions?.items?.length, "regions.items").toBeGreaterThan(0);
  });

  it.each(packs)("pack %s derives every primary-related override as valid hex", (code) => {
    const pack = loadPack(code, core);
    for (const key of [
      "color.primary",
      "color.primary-hover",
      "color.on-primary",
      "color.primary-tint",
      "color.link",
      "color.link-hover",
    ]) {
      expect(pack.overrides[key], key).toMatch(HEX);
    }
  });
});
