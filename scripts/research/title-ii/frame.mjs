/**
 * frame.mjs: build the Title II study sampling frame from the 2020 Census P.L. 94-171 files.
 *
 *   node scripts/research/title-ii/fetch-sources.mjs --only=pl   (once)
 *   node scripts/research/title-ii/frame.mjs
 *
 * Population is POP100 from the P.L. 94-171 geographic header, i.e. the 2020 decennial count
 * that 28 CFR 35.104 ("Total population") points to. Not the Vintage estimates.
 *
 * Writes (all gitignored):
 *   research-data/title-ii/frame.csv      every in-scope entity (main census + flagged townships)
 *   research-data/title-ii/excluded.csv   every 50,000+ Census record left out, with the reason
 *
 * The rules are documented in README.md next to this file. Change them there too.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { SRC, DATA, writeCsv } from "./common.mjs";

const THRESHOLD = 50000;

// P.L. 94-171 (2020) geographic header field order, from the 2020 PL technical documentation.
const GEO_FIELDS = (
  "FILEID STUSAB SUMLEV GEOVAR GEOCOMP CHARITER CIFSN LOGRECNO GEOID GEOCODE REGION DIVISION STATE " +
  "STATENS COUNTY COUNTYCC COUNTYNS COUSUB COUSUBCC COUSUBNS SUBMCD SUBMCDCC SUBMCDNS ESTATE ESTATECC " +
  "ESTATENS CONCIT CONCITCC CONCITNS PLACE PLACECC PLACENS TRACT BLKGRP BLOCK AIANHH AIHHTLI AIANHHFP " +
  "AIANHHCC AIANHHNS AITS AITSFP AITSCC AITSNS TTRACT TBLKGRP ANRC ANRCCC ANRCNS CBSA MEMI CSA METDIV " +
  "NECTA NMEMI CNECTA NECTADIV CBSAPCI NECTAPCI UA UATYPE UR CD116 CD118 CD119 CD120 CD121 SLDU18 " +
  "SLDU22 SLDU24 SLDU26 SLDU28 SLDL18 SLDL22 SLDL24 SLDL26 SLDL28 VTD VTDI ZCTA SDELM SDSEC SDUNI PUMA " +
  "AREALAND AREAWATR BASENAME NAME FUNCSTAT GCUNI POP100 HU100 INTPTLAT INTPTLON LSADC PARTFLAG UGA"
).split(" ");

// Townships in these states are treated as limited-function (owner decision: separate appendix).
const LIMITED_TOWNSHIP_STATES = new Set(["IL", "IN", "OH"]);

const STATE_NAMES = {};

async function loadGeo() {
  const dir = path.join(SRC, "pl");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith("geo2020.subset.pl"));
  if (files.length !== 51) throw new Error(`expected 51 state geo files, found ${files.length}; run fetch-sources.mjs`);
  const recs = [];
  for (const f of files) {
    const text = await fs.readFile(path.join(dir, f), "utf8");
    for (const line of text.split("\n")) {
      if (!line) continue;
      const v = line.split("|");
      const r = Object.fromEntries(GEO_FIELDS.map((k, i) => [k, (v[i] ?? "").trim()]));
      r.POP100 = Number(r.POP100);
      recs.push(r);
    }
  }
  return recs;
}

const placeType = (lsad, name) =>
  lsad === "47" ? "village" : lsad === "43" ? "town" : lsad === "21" ? "borough" : "city";
const mcdType = (lsad) => (lsad === "43" ? "town" : "township"); // 44 township, 49 charter township

const recs = await loadGeo();
for (const r of recs) if (r.SUMLEV === "040") STATE_NAMES[r.STATE] = r.NAME;

const big = recs.filter((r) => r.POP100 >= THRESHOLD);
const frame = [];
const excluded = [];
const exclude = (r, reason) =>
  excluded.push({ sumlev: r.SUMLEV, geoid: r.GEOID.replace(/^.*US/, ""), name: r.NAME, state: r.STUSAB, pop2020: r.POP100, funcstat: r.FUNCSTAT, reason });

// Counties whose government is consolidated with a city (FUNCSTAT C) are counted through the
// city. Place and consolidated-city rows in the PL geo header carry no county code, so the pairs
// are listed explicitly (state, county name, city name) and checked: every 50k+ FUNCSTAT C county
// must appear here, and every named city must exist, or the script stops.
const CITY_COUNTY = [
  ["AK", "Anchorage Municipality", "Anchorage municipality"],
  ["CA", "San Francisco County", "San Francisco city"],
  ["CO", "Broomfield County", "Broomfield city"],
  ["CO", "Denver County", "Denver city"],
  ["FL", "Duval County", "Jacksonville city"],
  ["GA", "Bibb County", "Macon-Bibb County"],
  ["GA", "Clarke County", "Athens-Clarke County unified government"],
  ["GA", "Muscogee County", "Columbus city"],
  ["GA", "Richmond County", "Augusta-Richmond County consolidated government"],
  ["IN", "Marion County", "Indianapolis city"],
  ["KS", "Wyandotte County", "Kansas City city"],
  ["KY", "Fayette County", "Lexington-Fayette urban county"],
  ["KY", "Jefferson County", "Louisville/Jefferson County metro government"],
  ["LA", "Orleans Parish", "New Orleans city"],
  ["NY", "Bronx County", "New York city"],
  ["NY", "Kings County", "New York city"],
  ["NY", "New York County", "New York city"],
  ["NY", "Queens County", "New York city"],
  ["NY", "Richmond County", "New York city"],
  ["PA", "Philadelphia County", "Philadelphia city"],
  ["TN", "Davidson County", "Nashville-Davidson metropolitan government"],
];
const consolidatedCounties = big.filter((r) => r.SUMLEV === "050" && r.FUNCSTAT === "C");
for (const c of consolidatedCounties) {
  if (!CITY_COUNTY.some(([st, co]) => st === c.STUSAB && co === c.NAME)) throw new Error(`unmapped FUNCSTAT C county: ${c.NAME}, ${c.STUSAB}`);
}
/** The consolidated counties for a place or consolidated-city row, by the table above. */
const countiesFor = (r) =>
  CITY_COUNTY.filter(([st, , city]) => st === r.STUSAB && city === r.NAME).map(([, co]) => co);
const cityRowsNamed = new Set();

function add(r, extra) {
  const geoid = r.GEOID.replace(/^.*US/, "");
  frame.push({
    entity_id: `${extra.prefix}-${geoid}`,
    geoid,
    sumlev: r.SUMLEV,
    name: r.NAME,
    type: extra.type,
    lsad: r.LSADC,
    state: r.STUSAB,
    state_fips: r.STATE,
    county_fips: r.COUNTY || "",
    pop2020: r.POP100,
    funcstat: r.FUNCSTAT,
    group: extra.group,
    limited_function_township: extra.group === "limited_township" ? 1 : 0,
    ansi_ns: (r.PLACENS || r.COUSUBNS || r.COUNTYNS || r.STATENS || "").replace(/^0+/, ""),
    pop_band: r.POP100 >= 500000 ? "500k+" : r.POP100 >= 250000 ? "250k-500k" : r.POP100 >= 100000 ? "100k-250k" : "50k-100k",
    note: extra.note || "",
  });
}

for (const r of big) {
  switch (r.SUMLEV) {
    case "040":
      // 50 states + DC. DC is a "State" in 28 CFR 35.104; its county and place rows are excluded below.
      add(r, { prefix: "st", type: "state", group: "main" });
      break;

    case "050": {
      if (r.FUNCSTAT === "A") add(r, { prefix: "co", type: "county", group: "main" });
      else if (r.FUNCSTAT === "B" && r.STUSAB === "LA") {
        // East Baton Rouge and Lafayette: parish and city are both FUNCSTAT B (partially
        // consolidated) and run by one consolidated government. Counted once, as the parish.
        add(r, { prefix: "co", type: "consolidated", group: "main", note: "city-parish consolidated government; the FUNCSTAT B city is counted here, not separately" });
      } else if (r.FUNCSTAT === "C") exclude(r, "county consolidated with a city (FUNCSTAT C): counted through the city");
      else if (r.FUNCSTAT === "F" && r.STUSAB === "DC") exclude(r, "DC county-equivalent: DC counted once as a State");
      else if (r.FUNCSTAT === "F") exclude(r, "independent city shown as a county-equivalent (FUNCSTAT F): counted as a place");
      else if (r.FUNCSTAT === "N") exclude(r, "nonfunctioning county (FUNCSTAT N: CT, MA, RI): no county government");
      else exclude(r, `county FUNCSTAT ${r.FUNCSTAT}`);
      break;
    }

    case "160": {
      if (r.FUNCSTAT === "A") {
        const cos = countiesFor(r);
        if (cos.length) cityRowsNamed.add(r.STUSAB + r.NAME);
        add(r, {
          prefix: "pl",
          type: cos.length ? "consolidated" : placeType(r.LSADC, r.NAME),
          group: "main",
          note: cos.length ? `city-county consolidated with ${cos.join(", ")} (not counted separately)` : "",
        });
      } else if (r.FUNCSTAT === "B" && r.STUSAB === "LA") exclude(r, "city in a city-parish consolidated government: counted through the parish");
      else if (r.FUNCSTAT === "F") exclude(r, "balance of a consolidated city (FUNCSTAT F): counted through the consolidated city (SUMLEV 170)");
      else if (r.FUNCSTAT === "N" && r.STUSAB === "DC") exclude(r, "Washington city, DC (FUNCSTAT N): DC counted once as a State");
      else if (r.FUNCSTAT === "N") exclude(r, "nonfunctioning place (FUNCSTAT N)");
      else if (r.FUNCSTAT === "S") exclude(r, "census designated place (statistical, no government)");
      else exclude(r, `place FUNCSTAT ${r.FUNCSTAT}`);
      break;
    }

    case "170": {
      // Consolidated cities (Indianapolis, Louisville, Nashville, Athens-Clarke, Augusta-Richmond,
      // Milford CT). The government's population is the consolidated-city total.
      if (r.FUNCSTAT === "A") {
        const cos = countiesFor(r);
        if (cos.length) cityRowsNamed.add(r.STUSAB + r.NAME);
        add(r, {
          prefix: "cc",
          type: cos.length ? "consolidated" : "city",
          group: "main",
          note: cos.length
            ? `consolidated city; ${cos.join(", ")} (FUNCSTAT C) and the FUNCSTAT F balance not counted separately`
            : "consolidated city-town (the FUNCSTAT C town and the FUNCSTAT F balance are not counted separately)",
        });
      } else exclude(r, `consolidated city FUNCSTAT ${r.FUNCSTAT}`);
      break;
    }

    case "172":
      exclude(r, "place within a consolidated city (SUMLEV 172): duplicate tabulation of a place");
      break;

    case "060": {
      if (r.FUNCSTAT === "A") {
        const limited = LIMITED_TOWNSHIP_STATES.has(r.STUSAB);
        add(r, {
          prefix: "cs",
          type: mcdType(r.LSADC),
          group: limited ? "limited_township" : "main",
          note: limited ? "limited-function township (IL/IN/OH): appendix group" : "",
        });
      } else if (r.FUNCSTAT === "B") exclude(r, "township partially consolidated with a city (FUNCSTAT B, IL): limited-function, not in the 88; owner may add to the appendix");
      else if (r.FUNCSTAT === "C") exclude(r, "town/township consolidated with a city (FUNCSTAT C): counted through the city");
      else if (r.FUNCSTAT === "F") exclude(r, "county subdivision coextensive with an incorporated place (FUNCSTAT F): counted as the place");
      else if (r.FUNCSTAT === "G" && r.STUSAB === "NY") exclude(r, "NYC borough (FUNCSTAT G, subordinate): part of New York city");
      else if (r.FUNCSTAT === "G") exclude(r, "subordinate township government (FUNCSTAT G, IA)");
      else if (r.FUNCSTAT === "N") exclude(r, "nonfunctioning county subdivision (FUNCSTAT N)");
      else if (r.FUNCSTAT === "S") exclude(r, "statistical county subdivision (CCD/unorganized, no government)");
      else exclude(r, `county subdivision FUNCSTAT ${r.FUNCSTAT}`);
      break;
    }
  }
}

for (const [st, co, city] of CITY_COUNTY) {
  if (!cityRowsNamed.has(st + city)) throw new Error(`consolidated city not found in frame: ${city}, ${st} (for ${co})`);
}

frame.sort((a, b) => (a.group === b.group ? 0 : a.group === "main" ? -1 : 1) || a.state_fips.localeCompare(b.state_fips) || b.pop2020 - a.pop2020);
const ids = new Set();
for (const f of frame) {
  if (ids.has(f.entity_id)) throw new Error(`duplicate id ${f.entity_id}`);
  ids.add(f.entity_id);
}

await fs.mkdir(DATA, { recursive: true });
await writeCsv(path.join(DATA, "frame.csv"), frame);
await writeCsv(path.join(DATA, "excluded.csv"), excluded);

const tally = {};
for (const f of frame) {
  const k = `${f.group}/${f.type}`;
  tally[k] ??= { n: 0, "50k-100k": 0, "100k-250k": 0, "250k-500k": 0, "500k+": 0 };
  tally[k].n++;
  tally[k][f.pop_band]++;
}
console.table(tally);
console.log(`main census: ${frame.filter((f) => f.group === "main").length}; limited-function townships: ${frame.filter((f) => f.group === "limited_township").length}; excluded 50k+ records: ${excluded.length}`);
