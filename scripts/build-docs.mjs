// site/ -> docs/. A page is an HTML fragment with a JSON comment at the top:
//   <!-- { "title": "Button", "section": "components", "description": "...", "order": 10 } -->
// The generator wraps it in site/layout.html, builds the top navigation and the
// section sidebar, expands <docs-example> blocks into a preview plus escaped
// code, and generates the pack and token pages from the token build.
import { cpSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative } from "node:path";
import { ROOT, cssVarName, loadCore, toCssValue } from "./tokens.mjs";

const SITE = join(ROOT, "site");
const DOCS = join(ROOT, "docs");
const BUILD = join(ROOT, "build");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

export const SECTIONS = [
  { id: "get-started", title: "Get started", href: "get-started.html" },
  { id: "styles", title: "Styles", href: "styles/index.html" },
  { id: "components", title: "Components", href: "components/index.html" },
  { id: "patterns", title: "Patterns", href: "patterns/index.html" },
  { id: "packs", title: "Country packs", href: "packs/index.html" },
  { id: "community", title: "Community", href: "community/index.html" },
];

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function dedent(html) {
  const lines = html.replace(/^\n+|\s+$/g, "").split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
  return lines.map((l) => l.slice(indent)).join("\n");
}

/** <docs-example [flush] [label="..."]>markup</docs-example> -> preview + code */
function expandExamples(html) {
  return html.replace(/<docs-example([^>]*)>([\s\S]*?)<\/docs-example>/g, (_, attrs, inner) => {
    const flush = /\bflush\b/.test(attrs);
    const label = (attrs.match(/label="([^"]*)"/) || [])[1];
    const code = dedent(inner);
    return (
      `<div class="docs-example">` +
      (label ? `<p class="docs-example__label">${label}</p>` : "") +
      `<div class="docs-example__preview${flush ? " docs-example__preview--flush" : ""}">${inner}</div>` +
      `<details class="docs-example__code"><summary>Show HTML</summary><pre tabindex="0"><code>${escape(code)}</code></pre></details>` +
      `</div>`
    );
  });
}

function readPages() {
  const pages = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".html")) {
        const src = readFileSync(full, "utf8");
        const m = src.match(/^\s*<!--\s*(\{[\s\S]*?\})\s*-->/);
        if (!m) throw new Error(`${relative(ROOT, full)} has no JSON front matter comment`);
        const meta = JSON.parse(m[1]);
        pages.push({ ...meta, path: relative(join(SITE, "pages"), full), body: src.slice(m[0].length) });
      }
    }
  };
  walk(join(SITE, "pages"));
  return pages;
}

function packPages() {
  const packs = readdirSync(join(BUILD, "packs"))
    .filter((f) => /^[a-z]{2}\.json$/.test(f))
    .map((f) => JSON.parse(readFileSync(join(BUILD, "packs", f), "utf8")))
    .sort((a, b) => a.country.localeCompare(b.country));

  const swatch = (hex, name) =>
    `<li><div class="docs-swatch" style="--_docs-swatch: ${hex}"></div><code>${name}</code><code>${hex}</code></li>`;

  const pages = packs.map((p) => {
    const flagStyle = `--ag-flag-direction: ${p.flagDirection ?? "row"}; ${p.flag.map((c, i) => `--ag-flag-${i + 1}: ${c}`).join("; ")}`;
    const flag = `<span class="ag-flag ag-flag--lg" aria-hidden="true" style="${flagStyle}"><span></span><span></span><span></span></span>`;
    const langs = Object.entries(p.strings ?? {}).map(([code, s]) => {
      const rows = ["banner", "banner-how", "banner-domain", "banner-secure"]
        .map(
          (k) =>
            `<tr><th scope="row"><code>${k}</code></th><td${code !== "en" && s[k] ? ` lang="${code}"` : ""}>${s[k] ?? "<em>wanted</em>"}</td></tr>`,
        )
        .join("");
      const note = s.$note
        ? `<p class="docs-fine">${s.$note}</p>`
        : s.$todo
          ? `<p class="docs-fine">${s.$todo}</p>`
          : "";
      return `<h3>${code}${code === (p.language ?? "en") ? " (default)" : ""}</h3><div class="ag-table-wrap" role="region" aria-label="${code} strings" tabindex="0"><table class="ag-table"><tbody>${rows}</tbody></table></div>${note}`;
    });
    const derived = p.notes?.length
      ? `<p>${p.notes.join(" ")}</p>`
      : `<p>The official primary passes WCAG AA as text on paper and on the grey panel, so it is used unchanged.</p>`;
    const body = `
<p class="docs-eyebrow">Country pack</p>
<h1>${flag} ${p.country}</h1>
<p class="ag-lead">${p.government}. Official websites use <code>${p.domain}</code>.</p>
<pre class="docs-code" tabindex="0"><code>&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/afrigov@${pkg.version.split(".").slice(0, 2).join(".")}/dist/${p.code}.min.css"&gt;</code></pre>
<p>Source: <a href="https://github.com/omoyolab/afrigov/blob/main/tokens/packs/${p.code}.tokens.json"><code>tokens/packs/${p.code}.tokens.json</code></a>.</p>

<h2>Colours</h2>
<h3>Official</h3>
<ul class="docs-swatches">${Object.entries(p.official)
      .map(([k, v]) => swatch(v, k))
      .join("")}</ul>
<h3>Derived for use</h3>
${derived}
<ul class="docs-swatches">${["color.primary", "color.primary-hover", "color.primary-tint", "color.link", "color.accent"]
      .filter((k) => p.colors[k])
      .map((k) => swatch(p.colors[k], cssVarName(k)))
      .join("")}</ul>

<h2>Banner strings</h2>
${langs.join("")}

<h2>Country data</h2>
<dl class="ag-summary">
  <div class="ag-summary__row"><dt class="ag-summary__key">Currency</dt><dd class="ag-summary__value">${p.currency?.code ?? "—"}, <code>${p.currency?.symbol ?? ""}</code> ${p.currency?.position === "suffix" ? "after the amount" : "before the amount"}</dd></div>
  <div class="ag-summary__row"><dt class="ag-summary__key">National ID</dt><dd class="ag-summary__value">${p.id?.name ?? "—"}${p.id?.document ? ` on the ${p.id.document}` : ""}${p.id?.length ? `, ${p.id.length} characters` : ""}${p.id?.authority ? `. Issued by ${p.id.authority}.` : ""}</dd></div>
  <div class="ag-summary__row"><dt class="ag-summary__key">${p.regions?.label ?? "Regions"}</dt><dd class="ag-summary__value">${(p.regions?.items ?? []).join(", ")}</dd></div>
  <div class="ag-summary__row"><dt class="ag-summary__key">Time zone</dt><dd class="ag-summary__value">${p.examples?.timezone ?? "—"}</dd></div>
</dl>

<h2>Help wanted</h2>
<p>Open issues for this pack: <a href="https://github.com/omoyolab/afrigov/issues?q=is%3Aissue+is%3Aopen+${encodeURIComponent(p.country)}">search the tracker</a>. Translations need a native speaker; see <a href="${"../community/index.html"}">Community</a>.</p>
`;
    return {
      title: p.country,
      section: "packs",
      description: `The ${p.country} country pack: colours, banner strings and country data.`,
      order: 10,
      path: `packs/${p.code}.html`,
      body,
    };
  });

  const table = packs
    .map(
      (p) =>
        `<tr><th scope="row"><a href="${p.code}.html">${p.country}</a></th><td><code>${p.code}.css</code></td><td><code>${Object.values(p.official)[0]}</code></td><td><code>${p.colors["color.primary"]}</code> ${p.notes?.length ? "derived" : "unchanged"}</td><td>${Object.entries(
          p.strings ?? {},
        )
          .map(([c, s]) => (s.banner ? c : `<em>${c} wanted</em>`))
          .join(", ")}</td></tr>`,
    )
    .join("");
  const codes = packs.map((p) => p.code);
  const flagOf = (p) =>
    `<span class="ag-flag" aria-hidden="true" style="--ag-flag-direction: ${p.flagDirection ?? "row"}; ${p.flag
      .map((c, i) => `--ag-flag-${i + 1}: ${c}`)
      .join("; ")}"><span></span><span></span><span></span></span>`;
  const cards =
    `<li class="docs-pack-card"><span class="docs-pack__neutral docs-pack-card__flag" aria-hidden="true"></span><h3 class="docs-pack-card__title">Neutral core</h3><p>No country. The blue nobody uses.</p><a class="ag-button ag-button--secondary" href="?pack=core">Preview</a></li>` +
    packs
      .map(
        (p) =>
          `<li class="docs-pack-card">${flagOf(p).replace('class="ag-flag"', 'class="ag-flag ag-flag--lg docs-pack-card__flag"')}<h3 class="docs-pack-card__title">${p.country}</h3><p><a href="${p.code}.html">About this pack</a></p><a class="ag-button ag-button--secondary" href="?pack=${p.code}">Preview</a></li>`,
      )
      .join("");
  return { pages, table, count: packs.length, codes, cards };
}

function tokensTable() {
  const core = loadCore();
  const groups = {};
  for (const [k, t] of Object.entries(core)) {
    const g = k.split(".")[0];
    (groups[g] ??= []).push([k, t]);
  }
  return Object.entries(groups)
    .map(([g, rows]) => {
      const body = rows
        .map(([k, t]) => {
          const v = toCssValue(t);
          const sw =
            t.type === "color"
              ? `<span class="docs-swatch docs-swatch--inline" style="--_docs-swatch: ${v}" aria-hidden="true"></span>`
              : "";
          return `<tr><th scope="row"><code>${cssVarName(k)}</code></th><td>${sw}<code>${escape(v)}</code></td><td>${t.description ?? ""}</td></tr>`;
        })
        .join("");
      return `<h2 id="${g}">${g[0].toUpperCase() + g.slice(1)}</h2><div class="ag-table-wrap" role="region" aria-label="${g} tokens" tabindex="0"><table class="ag-table"><thead><tr><th scope="col">Property</th><th scope="col">Value</th><th scope="col">Notes</th></tr></thead><tbody>${body}</tbody></table></div>`;
    })
    .join("");
}

export function buildDocs() {
  const layout = readFileSync(join(SITE, "layout.html"), "utf8");
  // Cache-busting: a short hash of everything the layout loads, so a deploy
  // never pairs new HTML with a stale cached script or stylesheet.
  const hash = createHash("sha1");
  for (const f of ["dist/core.min.css", "dist/afrigov.iife.js", "dist/packs.js", "site/docs.css", "site/docs.js"]) {
    hash.update(readFileSync(join(ROOT, f)));
  }
  for (const f of readdirSync(join(ROOT, "dist")).filter((f) => /^[a-z]{2}\.min\.css$/.test(f))) {
    hash.update(readFileSync(join(ROOT, "dist", f)));
  }
  const assetVersion = hash.digest("hex").slice(0, 8);
  const packs = packPages();
  const pages = [...readPages(), ...packs.pages];

  for (const page of pages) {
    const depth = page.path.split("/").length - 1;
    const root = depth ? "../".repeat(depth) : "./";
    const section = SECTIONS.find((s) => s.id === page.section);
    const siblings = pages
      .filter((p) => p.section === page.section)
      .sort((a, b) => (a.order ?? 50) - (b.order ?? 50) || a.title.localeCompare(b.title));
    const sidebar =
      section && siblings.length > 1
        ? `<nav class="docs-sidebar" aria-label="${section.title}"><p class="docs-sidebar__heading">${section.title}</p><ul class="docs-sidebar__list">${siblings
            .map(
              (p) =>
                `<li><a href="${root}${p.path}"${p.path === page.path ? ' aria-current="page"' : ""}>${p.navTitle ?? p.title}</a></li>`,
            )
            .join("")}</ul></nav>`
        : "";
    const topnav = SECTIONS.map(
      (s) =>
        `<li><a class="ag-nav__link" href="${root}${s.href}"${s.id === page.section ? ' aria-current="true"' : ""}>${s.title}</a></li>`,
    ).join("");

    let body = expandExamples(page.body)
      .replace(/\{\{packsTable\}\}/g, packs.table)
      .replace(/\{\{packCards\}\}/g, packs.cards)
      .replace(/\{\{packCount\}\}/g, String(packs.count))
      .replace(/\{\{tokensTable\}\}/g, tokensTable)
      .replace(/\{\{version\}\}/g, pkg.version)
      .replace(/\{\{root\}\}/g, root);

    const html = layout
      .replace(
        /\{\{title\}\}/g,
        page.path === "index.html"
          ? "afrigov — open-source components for accessible African public-service websites"
          : `${page.title} – afrigov`,
      )
      .replace(/\{\{description\}\}/g, page.description ?? "")
      .replace(/\{\{root\}\}/g, root)
      .replace(/\{\{packList\}\}/g, JSON.stringify(packs.codes))
      .replace(/\{\{assetVersion\}\}/g, assetVersion)
      .replace(/\{\{topnav\}\}/g, topnav)
      .replace(/\{\{sidebar\}\}/g, sidebar)
      .replace(/\{\{layoutClass\}\}/g, sidebar ? "docs-layout docs-layout--sidebar" : "docs-layout")
      .replace(/\{\{content\}\}/g, body)
      .replace(/\{\{version\}\}/g, pkg.version);

    const out = join(DOCS, page.path);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
  }

  cpSync(join(SITE, "docs.css"), join(DOCS, "docs.css"));
  cpSync(join(SITE, "docs.js"), join(DOCS, "docs.js"));
  console.log(`docs: ${pages.length} pages`);
  return pages;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) buildDocs();
