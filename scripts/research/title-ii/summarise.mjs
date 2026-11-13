/**
 * summarise.mjs: operational summary of a scan run (timings, outcomes, block rate, indicator counts).
 *
 *   node scripts/research/title-ii/summarise.mjs [--in=raw/pilot.jsonl] [--json]
 *
 * Uses the latest line per entity. Prints aggregate counts only, by stratum. This is a run report
 * for checking the scanner, not the study's aggregation step (aggregate.mjs, phase 3).
 */
import path from "node:path";
import { DATA, readCsv, readJsonl } from "./common.mjs";

const inArg = process.argv.find((a) => a.startsWith("--in="));
const rows = await readJsonl(path.join(DATA, inArg ? inArg.slice(5) : "raw/scan.jsonl"));
const frame = new Map((await readCsv(path.join(DATA, "frame.csv"))).map((f) => [f.entity_id, f]));
const latest = new Map();
for (const r of rows) latest.set(r.entity_id, r);
const recs = [...latest.values()];

const stratum = (f) => {
  if (!f) return "?";
  const p = Number(f.pop2020);
  if (f.type === "state") return "states";
  if (f.group === "limited_township") return "limited townships";
  if (f.entity_id.startsWith("cs-")) return "towns/townships";
  if (f.type === "county") return p >= 250000 ? "counties 250k+" : "counties 50k-250k";
  return p >= 250000 ? "cities 250k+" : p >= 100000 ? "cities 100k-250k" : "cities 50k-100k";
};
const median = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(0)}%` : "n/a");

const by = {};
for (const r of recs) (by[stratum(frame.get(r.entity_id))] ??= []).push(r);
by["ALL"] = recs;

const table = {};
for (const [k, rs] of Object.entries(by)) {
  const ok = rs.filter((r) => r.measurable);
  const homeAxe = ok.map((r) => r.pages?.find((p) => p.role === "home")?.axe).filter((a) => a && !a.error);
  table[k] = {
    n: rs.length,
    measurable: ok.length,
    "not measurable": rs.length - ok.length,
    "med s/entity": +(median(rs.map((r) => (r.ms ?? 0) / 1000)) ?? 0).toFixed(1),
    "med loads": median(rs.map((r) => r.pageLoads ?? 0)),
    "home >=1 axe fail": `${homeAxe.filter((a) => a.violationRules > 0).length}/${homeAxe.length}`,
    "stmt found": `${ok.filter((r) => r.statement?.found).length}/${ok.length}`,
    "stmt names 2.1+": ok.filter((r) => r.statement?.found && (r.statement.wcagVersions ?? []).some((v) => v === "2.1" || v === "2.2")).length,
    overlay: ok.filter((r) => r.overlayVendors?.length).length,
    "svc page": ok.filter((r) => r.serviceLink).length,
    "svc off-domain": ok.filter((r) => r.serviceLink?.offDomain).length,
    "med home PDFs": median(ok.map((r) => r.pages?.find((p) => p.role === "home")?.pdfLinks ?? 0)),
  };
}
console.table(table);

const outcomes = {};
for (const r of recs) outcomes[r.homeOutcome] = (outcomes[r.homeOutcome] ?? 0) + 1;
console.log("home-page outcomes:", outcomes);
const pageOutcomes = {};
for (const r of recs) for (const p of r.pages ?? []) pageOutcomes[`${p.role}:${p.outcome}`] = (pageOutcomes[`${p.role}:${p.outcome}`] ?? 0) + 1;
console.log("page outcomes:", pageOutcomes);
const axeVersions = [...new Set(recs.flatMap((r) => (r.pages ?? []).map((p) => p.axe?.version).filter(Boolean)))];
console.log("axe versions:", axeVersions, " chrome:", [...new Set(recs.map((r) => r.chromeVersion).filter(Boolean))]);
const all = recs.map((r) => (r.ms ?? 0) / 1000);
const loads = recs.reduce((n, r) => n + (r.pageLoads ?? 0), 0);
console.log(`entities ${recs.length}; mean ${(all.reduce((a, b) => a + b, 0) / all.length).toFixed(1)} s/entity; median ${median(all)?.toFixed(1)}; max ${Math.max(...all).toFixed(1)}; page loads ${loads} (${(loads / recs.length).toFixed(2)}/entity); not measurable ${pct(recs.filter((r) => !r.measurable).length, recs.length)}`);
const axeErr = recs.flatMap((r) => (r.pages ?? []).filter((p) => p.axe?.error).map((p) => `${r.entity_id} ${p.role}: ${p.axe.error}`));
if (axeErr.length) console.log("axe errors:", axeErr);
const topRules = {};
for (const r of recs.filter((x) => x.measurable)) for (const v of r.pages?.find((p) => p.role === "home")?.axe?.violations ?? []) topRules[v.id] = (topRules[v.id] ?? 0) + 1;
console.log("home-page rules (entities with >=1 node):", Object.entries(topRules).sort((a, b) => b[1] - a[1]).slice(0, 12));
const ovl = {};
for (const r of recs) for (const v of r.overlayVendors ?? []) ovl[v] = (ovl[v] ?? 0) + 1;
console.log("overlay detections (aggregate, vendor names internal only):", ovl);
