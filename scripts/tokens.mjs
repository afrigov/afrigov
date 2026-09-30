// Shared token loading and flattening. Used by the build and by tests.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { contrast, ensureContrast, shiftLightness, textOn, tint } from "./color.mjs";

export const PREFIX = "ag";
export const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const TOKENS_DIR = join(ROOT, "tokens");
export const PACKS_DIR = join(TOKENS_DIR, "packs");

/** Flatten a DTCG token tree into { "color.ink": { value, type, description } }. */
export function flatten(tree, path = [], inheritedType, out = {}) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;
    const type = node.$type ?? inheritedType;
    if (node && typeof node === "object" && "$value" in node) {
      out[[...path, key].join(".")] = { value: node.$value, type, description: node.$description };
    } else if (node && typeof node === "object") {
      flatten(node, [...path, key], type, out);
    }
  }
  return out;
}

/** Resolve {a.b} aliases in place. Throws on unknown or circular references. */
export function resolveAliases(flat) {
  const resolve = (value, seen = new Set()) => {
    if (typeof value !== "string") return value;
    const m = value.match(/^\{([^}]+)\}$/);
    if (!m) return value;
    const ref = m[1];
    if (seen.has(ref)) throw new Error(`Circular token alias: ${ref}`);
    if (!(ref in flat)) throw new Error(`Unknown token alias: ${ref}`);
    seen.add(ref);
    return resolve(flat[ref].value, seen);
  };
  for (const key of Object.keys(flat)) flat[key].value = resolve(flat[key].value);
  return flat;
}

export function toCssValue(token) {
  const { value, type } = token;
  if (type === "fontFamily" && Array.isArray(value)) {
    return value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ");
  }
  return String(value);
}

export function cssVarName(key) {
  return `--${PREFIX}-${key.replace(/\./g, "-")}`;
}

export function loadCore() {
  const tree = JSON.parse(readFileSync(join(TOKENS_DIR, "core.tokens.json"), "utf8"));
  return resolveAliases(flatten(tree));
}

export function listPacks() {
  return readdirSync(PACKS_DIR)
    .filter((f) => f.endsWith(".tokens.json"))
    .map((f) => f.replace(".tokens.json", ""))
    .sort();
}

/**
 * Load a pack and derive the full set of colour overrides it needs.
 * A pack only has to declare `official.*` and `color.primary` (and optionally
 * `color.accent`). Everything else is derived and checked here:
 *  - primary is darkened until it meets 4.5:1 on paper
 *  - primary-hover is a darker step of primary
 *  - on-primary is white or ink, whichever reads better
 *  - primary-tint is a light wash of primary
 *  - link and link-hover follow primary
 */
export function loadPack(code, core = loadCore()) {
  const file = join(PACKS_DIR, `${code}.tokens.json`);
  const tree = JSON.parse(readFileSync(file, "utf8"));
  const meta = tree.$extensions?.afrigov ?? {};
  const flat = resolveAliases(flatten(tree));
  const paper = core["color.paper"].value;
  // Primary is used as text on both paper and paper-alt, so it must pass on the
  // darker of the two. That is what turns an "official" colour into a "usable" one.
  const paperAlt = core["color.paper-alt"].value;
  const ink = core["color.ink"].value;

  const overrides = {};
  const notes = [];

  const official = Object.fromEntries(
    Object.entries(flat)
      .filter(([k]) => k.startsWith("official."))
      .map(([k, t]) => [k, t.value]),
  );

  const declaredPrimary = flat["color.primary"]?.value;
  if (!declaredPrimary) throw new Error(`Pack ${code} must declare color.primary`);

  const primary = ensureContrast(declaredPrimary, paperAlt, 4.5);
  if (primary.adjusted) {
    notes.push(
      `color.primary derived from official ${declaredPrimary} to ${primary.hex} so it meets WCAG AA (4.5:1) as text on paper and paper-alt. The flag stripe still uses the exact official colour.`,
    );
  }
  overrides["color.primary"] = primary.hex;
  overrides["color.primary-hover"] = flat["color.primary-hover"]?.value ?? shiftLightness(primary.hex, -0.08);
  overrides["color.on-primary"] = textOn(primary.hex, ink);
  overrides["color.primary-tint"] = flat["color.primary-tint"]?.value ?? tint(primary.hex);
  overrides["color.link"] = flat["color.link"]?.value ?? primary.hex;
  overrides["color.link-hover"] = flat["color.link-hover"]?.value ?? overrides["color.primary-hover"];

  if (flat["color.accent"]) {
    // Accent is decorative by default, so it keeps the exact official value.
    overrides["color.accent"] = flat["color.accent"].value;
  }

  // Any other explicit color.* override a pack sets is passed through untouched.
  for (const [k, t] of Object.entries(flat)) {
    if (k.startsWith("color.") && !(k in overrides)) overrides[k] = t.value;
  }

  const flag = (meta.flag ?? []).map((v) => {
    const m = String(v).match(/^\{([^}]+)\}$/);
    return m ? official[m[1]] : v;
  });

  return { code, meta: { ...meta, flag }, official, overrides, notes, contrastOnPaper: contrast(primary.hex, paper) };
}

/** Pairs every pack and the core must satisfy. [foreground, background, minimum ratio, why] */
export const CONTRAST_PAIRS = [
  ["color.ink", "color.paper", 4.5, "body text"],
  ["color.ink-muted", "color.paper", 4.5, "hint text"],
  ["color.ink", "color.paper-alt", 4.5, "text on alt background"],
  ["color.ink-muted", "color.paper-alt", 4.5, "hints on alt background"],
  ["color.ink-inverse", "color.paper-dark", 4.5, "footer text"],
  ["color.primary", "color.paper", 4.5, "primary as text and outlines"],
  ["color.on-primary", "color.primary", 4.5, "button labels"],
  ["color.link", "color.paper", 4.5, "links"],
  ["color.link", "color.paper-alt", 4.5, "links on alt background"],
  ["color.link-visited", "color.paper", 4.5, "visited links"],
  ["color.border-strong", "color.paper", 3, "form control borders (non-text)"],
  ["color.success", "color.paper", 4.5, "success text"],
  ["color.warning", "color.paper", 4.5, "warning text"],
  ["color.error", "color.paper", 4.5, "error text"],
  ["color.info", "color.paper", 4.5, "info text"],
  ["color.success", "color.success-tint", 4.5, "success text on its tint"],
  ["color.warning", "color.warning-tint", 4.5, "warning text on its tint"],
  ["color.error", "color.error-tint", 4.5, "error text on its tint"],
  ["color.info", "color.info-tint", 4.5, "info text on its tint"],
  ["color.ink", "color.success-tint", 4.5, "body text and links inside a success alert"],
  ["color.ink", "color.warning-tint", 4.5, "body text and links inside a warning alert"],
  ["color.ink", "color.error-tint", 4.5, "body text and links inside an error alert"],
  ["color.ink", "color.info-tint", 4.5, "body text and links inside an info alert"],
  ["color.ink", "color.primary-tint", 4.5, "selected navigation item"],
  ["color.focus", "color.ink", 3, "focus ring against its own ink outer ring"],
];

/** Merge core values with a pack's overrides into a plain { key: hex } map. */
export function mergedColors(core, pack) {
  const out = {};
  for (const [k, t] of Object.entries(core)) if (k.startsWith("color.")) out[k] = t.value;
  if (pack) Object.assign(out, pack.overrides);
  return out;
}
