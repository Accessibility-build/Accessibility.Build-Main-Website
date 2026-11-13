/**
 * reconcile.mjs: explain the difference between frame.csv (2020 decennial POP100) and the
 * design document's estimate (Vintage 2025 file, ESTIMATESBASE2020, rules: places SUMLEV 162
 * FUNCSTAT A/B, counties 050 A, towns/townships 061 A).
 *
 *   node scripts/research/title-ii/fetch-sources.mjs --only=popest
 *   node scripts/research/title-ii/reconcile.mjs
 *
 * Prints the entities that are in one frame and not the other, with both population figures,
 * and writes research-data/title-ii/reconcile.csv.
 */
import path from "node:path";
import { DATA, SRC, readCsv, writeCsv } from "./common.mjs";

const frame = await readCsv(path.join(DATA, "frame.csv"));
const pop = await readCsv(path.join(SRC, "sub-est2025.csv"));

const key = (sumlev, r) =>
  sumlev === "040" ? `st-${r.STATE}` :
  sumlev === "050" ? `co-${r.STATE}${r.COUNTY}` :
  sumlev === "061" ? `cs-${r.STATE}${r.COUNTY}${r.COUSUB}` :
  sumlev === "170" ? `cc-${r.STATE}${r.CONCIT}` : `pl-${r.STATE}${r.PLACE}`;

const design = new Map();
for (const r of pop) {
  const b = Number(r.ESTIMATESBASE2020);
  if (b < 50000) continue;
  const ok =
    (r.SUMLEV === "040") ||
    (r.SUMLEV === "050" && r.FUNCSTAT === "A") ||
    (r.SUMLEV === "162" && (r.FUNCSTAT === "A" || r.FUNCSTAT === "B")) ||
    (r.SUMLEV === "061" && r.FUNCSTAT === "A");
  if (!ok) continue;
  design.set(key(r.SUMLEV, r), { name: r.NAME, state: r.STNAME, base2020: b, sumlev: r.SUMLEV, funcstat: r.FUNCSTAT });
}
// Base-2020 lookup for every row, to show the other figure for frame-only entities.
const baseAny = new Map();
for (const r of pop) {
  const lvl = r.SUMLEV === "162" ? "160" : r.SUMLEV;
  if (["040", "050", "061", "160", "170"].includes(lvl)) baseAny.set(key(r.SUMLEV, r), Number(r.ESTIMATESBASE2020));
}

const ours = new Map(frame.map((f) => [f.entity_id, f]));
const rows = [];
for (const [id, f] of ours) {
  if (!design.has(id)) rows.push({ entity_id: id, name: f.name, state: f.state, in: "frame only", pop2020_decennial: f.pop2020, estimatesbase2020: baseAny.get(id) ?? "", reason: "" });
}
for (const [id, d] of design) {
  if (!ours.has(id)) rows.push({ entity_id: id, name: d.name, state: d.state, in: "design only", pop2020_decennial: "", estimatesbase2020: d.base2020, reason: `SUMLEV ${d.sumlev} FUNCSTAT ${d.funcstat}` });
}
await writeCsv(path.join(DATA, "reconcile.csv"), rows);
console.log(`frame ${ours.size} (incl. ${frame.filter((f) => f.group !== "main").length} flagged townships), design-rule set ${design.size}`);
console.table(rows);
