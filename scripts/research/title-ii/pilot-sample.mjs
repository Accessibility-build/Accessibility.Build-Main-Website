/**
 * pilot-sample.mjs: draw the stratified pilot sample (seeded, reproducible).
 *
 *   node scripts/research/title-ii/pilot-sample.mjs [--seed=20261111]
 *
 * Writes research-data/title-ii/pilot-ids.txt (one entity_id per line). Only entities with a
 * resolved URL are eligible; the draw is a seeded shuffle within each stratum.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { DATA, readCsv } from "./common.mjs";

const seedArg = process.argv.find((a) => a.startsWith("--seed="));
let seed = Number(seedArg ? seedArg.slice(7) : 20261111);
// mulberry32
const rand = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const urls = (await readCsv(path.join(DATA, "urls.csv"))).filter((r) => r.url);
const muni = new Set(["city", "village", "consolidated", "town", "borough"]);
const isPlace = (r) => muni.has(r.type) && !r.entity_id.startsWith("cs-");
const pop = (r) => Number(r.pop2020);
const STRATA = [
  ["states", 6, (r) => r.type === "state"],
  ["counties 250k+", 6, (r) => r.type === "county" && pop(r) >= 250000],
  ["counties 50k-250k", 6, (r) => r.type === "county" && pop(r) < 250000],
  ["cities 250k+ (incl. consolidated)", 6, (r) => isPlace(r) && pop(r) >= 250000],
  ["cities 100k-250k", 5, (r) => isPlace(r) && pop(r) >= 100000 && pop(r) < 250000],
  ["cities 50k-100k", 6, (r) => isPlace(r) && pop(r) < 100000],
  ["towns/townships (general purpose)", 3, (r) => r.entity_id.startsWith("cs-") && r.group === "main"],
  ["limited-function townships", 2, (r) => r.group === "limited_township"],
];
const out = [];
for (const [label, n, test] of STRATA) {
  const pool = urls.filter(test).sort((a, b) => a.entity_id.localeCompare(b.entity_id));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const pick = pool.slice(0, n);
  console.log(`${label}: ${pick.length} of ${pool.length}`);
  out.push(...pick.map((r) => r.entity_id));
}
await fs.writeFile(path.join(DATA, "pilot-ids.txt"), out.join("\n") + "\n");
console.log(`pilot: ${out.length} entities -> research-data/title-ii/pilot-ids.txt`);
