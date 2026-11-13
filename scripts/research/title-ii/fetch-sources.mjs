/**
 * fetch-sources.mjs: download the public source files the Title II study needs.
 *
 *   node scripts/research/title-ii/fetch-sources.mjs [--only=pl,dotgov]
 *
 * 1. 2020 Census P.L. 94-171 redistricting summary files, one zip per state plus DC
 *    (www2.census.gov). Only the geographic header file (xx geo2020.pl) is kept: it carries
 *    POP100, the 2020 decennial total population, for every summary level. The zips
 *    (about 1.3 GB in total) are deleted after extraction.
 * 2. CISA dotgov-data current-full.csv (the .gov domain registry).
 * 3. With --only=popest: Census Vintage 2025 sub-est2025.csv, for reconcile.mjs only.
 *
 * Everything lands in research-data/title-ii/source/ (gitignored). Files already present are
 * skipped, so the script is safe to re-run.
 */
import fs from "node:fs/promises";
import { existsSync, createWriteStream } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const SRC = path.join(ROOT, "research-data/title-ii/source");
const PL_BASE = "https://www2.census.gov/programs-surveys/decennial/2020/data/01-Redistricting_File--PL_94-171";
const DOTGOV = "https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-full.csv";

// Folder name on www2.census.gov and USPS code. Puerto Rico is out of scope (owner decision).
export const STATES = [
  ["Alabama", "al"], ["Alaska", "ak"], ["Arizona", "az"], ["Arkansas", "ar"], ["California", "ca"],
  ["Colorado", "co"], ["Connecticut", "ct"], ["Delaware", "de"], ["District_of_Columbia", "dc"],
  ["Florida", "fl"], ["Georgia", "ga"], ["Hawaii", "hi"], ["Idaho", "id"], ["Illinois", "il"],
  ["Indiana", "in"], ["Iowa", "ia"], ["Kansas", "ks"], ["Kentucky", "ky"], ["Louisiana", "la"],
  ["Maine", "me"], ["Maryland", "md"], ["Massachusetts", "ma"], ["Michigan", "mi"],
  ["Minnesota", "mn"], ["Mississippi", "ms"], ["Missouri", "mo"], ["Montana", "mt"],
  ["Nebraska", "ne"], ["Nevada", "nv"], ["New_Hampshire", "nh"], ["New_Jersey", "nj"],
  ["New_Mexico", "nm"], ["New_York", "ny"], ["North_Carolina", "nc"], ["North_Dakota", "nd"],
  ["Ohio", "oh"], ["Oklahoma", "ok"], ["Oregon", "or"], ["Pennsylvania", "pa"],
  ["Rhode_Island", "ri"], ["South_Carolina", "sc"], ["South_Dakota", "sd"], ["Tennessee", "tn"],
  ["Texas", "tx"], ["Utah", "ut"], ["Vermont", "vt"], ["Virginia", "va"], ["Washington", "wa"],
  ["West_Virginia", "wv"], ["Wisconsin", "wi"], ["Wyoming", "wy"],
];

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

// Summary levels kept from the geo file: state, county, county subdivision, place,
// consolidated city, and place within consolidated city. GEOCOMP 00 (whole entity) only.
const KEEP_SUMLEV = new Set(["040", "050", "060", "160", "170", "172"]);

/** Reduce a full geo file (block level, hundreds of MB) to the summary levels the frame uses. */
async function subsetGeo(full, subset) {
  const { createReadStream } = await import("node:fs");
  const readline = await import("node:readline");
  const out = [];
  const rl = readline.createInterface({ input: createReadStream(full, { encoding: "latin1" }), crlfDelay: Infinity });
  for await (const line of rl) {
    const f = line.split("|", 6);
    if (KEEP_SUMLEV.has(f[2]) && f[4] === "00") out.push(line);
  }
  await fs.writeFile(subset, out.join("\n") + "\n", "utf8");
}

async function fetchPl() {
  const dir = path.join(SRC, "pl");
  await fs.mkdir(dir, { recursive: true });
  const queue = [...STATES];
  async function worker() {
    while (queue.length) {
      const [folder, ab] = queue.shift();
      const subset = path.join(dir, `${ab}geo2020.subset.pl`);
      if (existsSync(subset)) continue;
      const geo = path.join(dir, `${ab}geo2020.pl`);
      if (!existsSync(geo)) {
        const zip = path.join(dir, `${ab}2020.pl.zip`);
        await download(`${PL_BASE}/${folder}/${ab}2020.pl.zip`, zip);
        execFileSync("unzip", ["-o", "-q", zip, `${ab}geo2020.pl`, "-d", dir]);
        await fs.unlink(zip);
      }
      await subsetGeo(geo, subset);
      await fs.unlink(geo);
      console.error(`pl ${ab} ok`);
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
}

// Vintage 2025 subcounty estimates. Used only by reconcile.mjs to explain the difference from the
// design document's count (which used ESTIMATESBASE2020 from this file). Not the legal population.
const POPEST = "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/cities/totals/sub-est2025.csv";
async function fetchPopest() {
  const dest = path.join(SRC, "sub-est2025.csv");
  if (existsSync(dest)) return;
  await download(POPEST, dest);
  console.error("popest ok");
}

async function fetchDotgov() {
  const dest = path.join(SRC, "dotgov-current-full.csv");
  await download(DOTGOV, dest);
  await fs.writeFile(dest + ".fetched", new Date().toISOString() + "\n");
  console.error("dotgov ok");
}

const only = (process.argv.find((a) => a.startsWith("--only=")) || "--only=pl,dotgov").slice(7).split(",");
await fs.mkdir(SRC, { recursive: true });
if (only.includes("dotgov")) await fetchDotgov();
if (only.includes("pl")) await fetchPl();
if (only.includes("popest")) await fetchPopest();
