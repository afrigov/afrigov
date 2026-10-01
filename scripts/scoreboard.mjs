// Audits every site in scoreboard/sites.json with afrigov-audit and writes
// build/scoreboard/<date>.json plus a Markdown summary to stdout.
// Sequential and polite: one page per site, one real browser, a user agent
// that names the tool. A site that cannot be loaded is recorded, not retried.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { audit } from "afrigov-audit";
import { ROOT } from "./tokens.mjs";

const { sites } = JSON.parse(readFileSync(join(ROOT, "scoreboard", "sites.json"), "utf8"));
const date = new Date().toISOString().slice(0, 10);
const outDir = join(ROOT, "build", "scoreboard");
mkdirSync(outDir, { recursive: true });

const rows = [];
for (const site of sites) {
  const started = Date.now();
  process.stderr.write(`auditing ${site.url} … `);
  try {
    const r = await audit(site.url, { timeout: 45_000 });
    const top = r.findings[0];
    rows.push({
      ...site,
      status: "ok",
      finalUrl: r.finalUrl,
      score: r.score,
      grade: r.grade,
      problems: r.findings.length,
      summary: r.summary,
      top: top ? { id: top.id, help: top.help, impact: top.impact, nodes: top.nodes, fix: top.fix ?? null } : null,
      facts: r.viewports[0]?.facts ?? null,
      findings: r.findings.map((f) => ({ id: f.id, impact: f.impact, nodes: f.nodes, wcag: f.wcag })),
      ms: Date.now() - started,
    });
    process.stderr.write(`${r.score} (${r.grade}) in ${((Date.now() - started) / 1000).toFixed(0)}s\n`);
  } catch (err) {
    rows.push({
      ...site,
      status: "unreachable",
      error: err.message?.split("\n")[0] ?? String(err),
      ms: Date.now() - started,
    });
    process.stderr.write(`could not load: ${err.message?.split("\n")[0]}\n`);
  }
}

writeFileSync(join(outDir, `${date}.json`), JSON.stringify({ date, tool: "afrigov-audit", rows }, null, 2));

const ok = rows.filter((r) => r.status === "ok");
const avg = ok.length ? (ok.reduce((s, r) => s + r.score, 0) / ok.length).toFixed(1) : "n/a";
console.log(`\n# Scoreboard ${date}\n\n${ok.length} of ${rows.length} sites loaded. Average score ${avg}.\n`);
console.log("| Country | Site | Score | Grade | Problems | Top problem |");
console.log("| --- | --- | ---: | :---: | ---: | --- |");
for (const r of rows) {
  if (r.status !== "ok") {
    console.log(`| ${r.country} | ${r.name} | n/a | n/a | n/a | could not load: ${r.error} |`);
    continue;
  }
  console.log(
    `| ${r.country} | ${r.name} | ${r.score} | ${r.grade} | ${r.problems} | ${r.top ? `${r.top.help} (${r.top.impact}, ${r.top.nodes})` : "none"} |`,
  );
}
