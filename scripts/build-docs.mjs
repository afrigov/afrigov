// site/ -> docs/. A page is an HTML fragment with a JSON comment at the top:
//   <!-- { "title": "Button", "section": "components", "description": "...", "order": 10 } -->
// The generator wraps it in site/layout.html, builds the top navigation and the
// section sidebar, expands <docs-example> blocks into a preview plus escaped
// code, and generates the pack and token pages from the token build.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { dirname, join, relative } from "node:path";
import { ROOT, cssVarName, loadCore, toCssValue } from "./tokens.mjs";

const SITE = join(ROOT, "site");
const DOCS = join(ROOT, "docs");
const BUILD = join(ROOT, "build");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

// Figures quoted on the docs site come from the build, so they cannot fall behind the code.
const coreMin = join(ROOT, "dist", "core.min.css");
const cssKB = existsSync(coreMin) ? `${Math.round(gzipSync(readFileSync(coreMin)).length / 1024)} KB` : "under 20 KB";
const componentCount = String(
  readdirSync(join(SITE, "pages", "components")).filter((f) => f.endsWith(".html") && f !== "index.html").length,
);
const fillStats = (s) => s.replace(/\{\{cssKB\}\}/g, cssKB).replace(/\{\{componentCount\}\}/g, componentCount);

export const SECTIONS = [
  { id: "get-started", title: "Get started", href: "get-started.html" },
  { id: "styles", title: "Styles", href: "styles/index.html" },
  { id: "components", title: "Components", href: "components/index.html" },
  { id: "patterns", title: "Patterns", href: "patterns/index.html" },
  { id: "packs", title: "Country packs", href: "packs/index.html" },
  { id: "tools", title: "Tools", href: "tools/index.html" },
  { id: "use-cases", title: "Use cases", href: "use-cases.html" },
  { id: "scoreboard", title: "Accessibility check", href: "scoreboard.html" },
  // Community is in the footer, not the top menu, so the menu fits beside the logo on one row.
  { id: "community", title: "Community", href: "community/index.html", inMenu: false },
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
    const flagStyle = `--ag-flag-direction: ${p.flagDirection ?? "row"}; ${p.flag.map((c, i) => `--ag-flag-${i + 1}: ${c}`).join("; ")}; --ag-flag-image: ${p.flagSvg ? `url(../dist/flags/${p.flagSvg})` : "none"}`;
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
<p>Source: <a href="https://github.com/afrigov/afrigov/blob/main/tokens/packs/${p.code}.tokens.json"><code>tokens/packs/${p.code}.tokens.json</code></a>.</p>

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
  <div class="ag-summary__row"><dt class="ag-summary__key">Currency</dt><dd class="ag-summary__value">${p.currency?.code ?? "not set"}, <code>${p.currency?.symbol ?? ""}</code> ${p.currency?.position === "suffix" ? "after the amount" : "before the amount"}</dd></div>
  <div class="ag-summary__row"><dt class="ag-summary__key">National ID</dt><dd class="ag-summary__value">${p.id?.name ?? "not set"}${p.id?.document ? ` on the ${p.id.document}` : ""}${p.id?.length ? `, ${p.id.length} characters` : ""}${p.id?.authority ? `. Issued by ${p.id.authority}.` : ""}</dd></div>
  <div class="ag-summary__row"><dt class="ag-summary__key">${p.regions?.label ?? "Regions"}</dt><dd class="ag-summary__value">${(p.regions?.items ?? []).join(", ")}</dd></div>
  <div class="ag-summary__row"><dt class="ag-summary__key">Time zone</dt><dd class="ag-summary__value">${p.examples?.timezone ?? "not set"}</dd></div>
</dl>

<h2>Help wanted</h2>
<p>Open issues for this pack: <a href="https://github.com/afrigov/afrigov/issues?q=is%3Aissue+is%3Aopen+${encodeURIComponent(p.country)}">search the tracker</a>. Translations need a native speaker; see <a href="${"../community/index.html"}">Community</a>.</p>
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
  const flagOf = (p, root = "../") =>
    `<span class="ag-flag" aria-hidden="true" style="--ag-flag-direction: ${p.flagDirection ?? "row"}; ${p.flag
      .map((c, i) => `--ag-flag-${i + 1}: ${c}`)
      .join(
        "; ",
      )}; --ag-flag-image: ${p.flagSvg ? `url(${root}dist/flags/${p.flagSvg})` : "none"}"><span></span><span></span><span></span></span>`;
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

const GRADE_WORDS = { A: "accessible", B: "nearly", C: "partly", D: "mostly not", F: "not yet" };

/** The scoreboard block from scoreboard/results/*.json. Grouped by country, alphabetical, fix first. */
function scoreboardBlock(root) {
  const dir = join(ROOT, "scoreboard", "results");
  const files = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
        .sort()
    : [];
  if (!files.length) return `<p>No results yet. The first check runs when the monthly workflow is first triggered.</p>`;
  const latest = JSON.parse(readFileSync(join(dir, files[files.length - 1]), "utf8"));
  const previous = files.length > 1 ? JSON.parse(readFileSync(join(dir, files[files.length - 2]), "utf8")) : null;
  const prevByUrl = new Map((previous?.rows ?? []).map((r) => [r.url, r]));
  const packs = Object.fromEntries(
    readdirSync(join(BUILD, "packs"))
      .filter((f) => /^[a-z]{2}\.json$/.test(f))
      .map((f) => {
        const p = JSON.parse(readFileSync(join(BUILD, "packs", f), "utf8"));
        return [p.code, p];
      }),
  );
  const ok = latest.rows.filter((r) => r.status === "ok");
  const avg = ok.length ? (ok.reduce((a, r) => a + r.score, 0) / ok.length).toFixed(0) : "n/a";
  const countries = [...new Set(latest.rows.map((r) => r.country))].sort((a, b) =>
    (packs[a]?.country ?? a).localeCompare(packs[b]?.country ?? b),
  );
  const grade = (g) => g;
  const trend = (r) => {
    const prev = prevByUrl.get(r.url);
    if (!prev || prev.status !== "ok" || r.status !== "ok") return "";
    const d = Math.round(r.score - prev.score);
    if (d > 2) return ` <span class="docs-trend docs-trend--up">up ${d} since last month</span>`;
    if (d < -2) return ` <span class="docs-trend docs-trend--down">down ${-d} since last month</span>`;
    return ` <span class="docs-trend">no change</span>`;
  };
  const sections = countries.map((code) => {
    const rows = latest.rows
      .filter((r) => r.country === code)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((r) => {
        if (r.status !== "ok") {
          const why = /403/.test(r.error ?? "")
            ? "blocks automated browsers"
            : /CERT/.test(r.error ?? "")
              ? "invalid TLS certificate"
              : /NAME_NOT_RESOLVED/.test(r.error ?? "")
                ? "address did not resolve"
                : /HTTP 5/.test(r.error ?? "")
                  ? "server error"
                  : /Timeout/.test(r.error ?? "")
                    ? "did not load within 45 seconds"
                    : "could not be loaded";
          return `<tr><th scope="row"><a href="${r.url}">${r.name}</a></th><td colspan="3"><span class="ag-badge ag-badge--neutral">Not checked</span> ${why}</td></tr>`;
        }
        const g = grade(r.grade);
        const badge =
          g === "A"
            ? "ag-badge--success"
            : g === "B" || g === "C"
              ? "ag-badge--info"
              : g === "D"
                ? "ag-badge--warning"
                : "ag-badge--error";
        const fix = r.top?.fix
          ? `<a href="${root}${r.top.fix.url.replace(/^https:\/\/(omoyolab\.github\.io\/afrigov|afrigov\.dev)\//, "")}">${r.top.fix.component}</a>: ${r.top.fix.advice}`
          : r.top
            ? `<a href="${r.top.id.startsWith("ag-") ? root + "get-started.html" : `https://dequeuniversity.com/rules/axe/4.10/${r.top.id}`}">See the rule</a>`
            : "Nothing to fix from automated checks";
        const problem = r.top ? `${r.top.help}${r.top.nodes > 1 ? ` (${r.top.nodes} elements)` : ""}` : "none found";
        return `<tr><th scope="row"><a href="${r.url}">${r.name}</a>${trend(r)}</th><td><span class="ag-badge ${badge}">${g}</span> <span class="docs-grade-word">${GRADE_WORDS[g]}</span><br><span class="docs-fine">${r.score} / 100, ${r.problems} problem${r.problems === 1 ? "" : "s"}</span></td><td>${problem}</td><td>${fix}</td></tr>`;
      })
      .join("");
    const flag = packs[code]
      ? `<span class="ag-flag" aria-hidden="true" style="--ag-flag-direction: ${packs[code].flagDirection ?? "row"}; ${packs[code].flag.map((c, i) => `--ag-flag-${i + 1}: ${c}`).join("; ")}; --ag-flag-image: ${packs[code].flagSvg ? `url(${root}dist/flags/${packs[code].flagSvg})` : "none"}"><span></span><span></span><span></span></span> `
      : "";
    return `<h2 id="${code}">${flag}${packs[code]?.country ?? code}</h2>
<div class="ag-table-wrap" role="region" aria-label="${packs[code]?.country ?? code} sites" tabindex="0"><table class="ag-table docs-scoreboard"><thead><tr><th scope="col">Site</th><th scope="col">Grade</th><th scope="col">Biggest problem</th><th scope="col">Fix first</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  });
  return `<p class="docs-fine">Last checked ${latest.date}. ${ok.length} of ${latest.rows.length} sites loaded. Average score ${avg} out of 100. <a href="https://github.com/afrigov/afrigov/tree/main/scoreboard/results">Raw results</a>.</p>
${sections.join("\n")}`;
}

function hasScoreboardResults() {
  const dir = join(ROOT, "scoreboard", "results");
  return existsSync(dir) && readdirSync(dir).some((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
}

export function buildDocs() {
  const layout = readFileSync(join(SITE, "layout.html"), "utf8");
  // The accessibility check page exists only once results are committed.
  const showScoreboard = hasScoreboardResults();
  const sections = SECTIONS.filter((s) => showScoreboard || s.id !== "scoreboard");
  if (!showScoreboard) rmSync(join(DOCS, "scoreboard.html"), { force: true });
  // Cache-busting: a short hash of everything the layout loads, so a deploy
  // never pairs new HTML with a stale cached script or stylesheet.
  const hash = createHash("sha1");
  for (const f of [
    "dist/core.min.css",
    "dist/afrigov.iife.js",
    "docs/dist/packs.js",
    "site/docs.css",
    "site/docs.js",
  ]) {
    hash.update(readFileSync(join(ROOT, f)));
  }
  for (const f of readdirSync(join(ROOT, "dist")).filter((f) => /^[a-z]{2}\.min\.css$/.test(f))) {
    hash.update(readFileSync(join(ROOT, "dist", f)));
  }
  const assetVersion = hash.digest("hex").slice(0, 8);
  const packs = packPages();
  const pages = [...readPages(), ...packs.pages].filter((p) => showScoreboard || p.section !== "scoreboard");

  for (const page of pages) {
    const depth = page.path.split("/").length - 1;
    const root = depth ? "../".repeat(depth) : "./";
    const section = sections.find((s) => s.id === page.section);
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
    const topnav = sections
      .filter((s) => s.inMenu !== false)
      .map(
        (s) =>
          `<li><a class="ag-nav__link" href="${root}${s.href}"${s.id === page.section ? ' aria-current="true"' : ""}>${s.title}</a></li>`,
      )
      .join("");

    let body = expandExamples(page.body)
      .replace(/\{\{scoreboard\}\}/g, () => scoreboardBlock(root))
      .replace(
        /\{\{scoreboardCard\}\}/g,
        showScoreboard
          ? `<a class="docs-card docs-card--link" href="${root}scoreboard.html"><h2>Accessibility check</h2><p>A monthly automated check of public government sites, with the fix for each one's biggest problem.</p></a>`
          : "",
      )
      .replace(/\{\{packsTable\}\}/g, packs.table)
      .replace(/\{\{packCards\}\}/g, packs.cards)
      .replace(/\{\{packCount\}\}/g, String(packs.count))
      .replace(/\{\{tokensTable\}\}/g, tokensTable)
      .replace(/\{\{version\}\}/g, pkg.version)
      .replace(/\{\{root\}\}/g, root);
    body = fillStats(body);

    const html = layout
      .replace(
        /\{\{title\}\}/g,
        page.path === "index.html"
          ? "afrigov: open-source components for accessible African public-service websites"
          : `${page.title} – afrigov`,
      )
      .replace(/\{\{description\}\}/g, fillStats(page.description ?? ""))
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

  // Templates: complete pages. The docs copy uses local assets and follows the
  // previewed pack; the source in site/templates stays plain for copying.
  const tplDir = join(SITE, "templates");
  if (existsSync(tplDir)) {
    mkdirSync(join(DOCS, "templates"), { recursive: true });
    const packScript = `<script>
      (function () {
        var packs = ${JSON.stringify(packs.codes)};
        var pack = new URL(location.href).searchParams.get("pack");
        if (pack === "core") { try { localStorage.removeItem("afrigov-pack"); } catch (e) { /* private mode */ } }
        if (!pack) { try { pack = localStorage.getItem("afrigov-pack"); } catch (e) { pack = null; } }
        var link = document.getElementById("pack-css");
        if (packs.indexOf(pack) === -1) { pack = "core"; link.parentNode.removeChild(link); }
        else { link.href = "../dist/" + pack + ".min.css"; document.documentElement.setAttribute("data-ag-pack", pack); }
        document.documentElement.setAttribute("data-docs-pack", pack);
      })();
    </script>`;
    for (const f of readdirSync(tplDir).filter((f) => f.endsWith(".html"))) {
      let html = readFileSync(join(tplDir, f), "utf8")
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/afrigov@[0-9.]+\/dist\//g, "../dist/")
        .replace(/(<link[^>]*id="pack-css"[^>]*>)/, `$1\n    ${packScript}`)
        .replace(
          "</body>",
          `  <script src="../dist/packs.js"></script>\n    <script src="../docs.js"></script>\n  </body>`,
        );
      writeFileSync(join(DOCS, "templates", f), html);
    }
  }
  cpSync(join(SITE, "docs.css"), join(DOCS, "docs.css"));
  cpSync(join(SITE, "docs.js"), join(DOCS, "docs.js"));
  cpSync(join(SITE, "favicon.svg"), join(DOCS, "favicon.svg"));
  cpSync(join(SITE, "logo.svg"), join(DOCS, "logo.svg"));
  console.log(`docs: ${pages.length} pages`);
  return pages;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) buildDocs();
