/** Shared helpers for the Title II study scripts: paths, CSV read/write, JSONL. */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const DATA = path.join(ROOT, "research-data/title-ii");
export const SRC = path.join(DATA, "source");

/** RFC 4180 CSV parser (quotes, embedded commas and newlines). Returns objects keyed by header. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ""])));
}

export async function readCsv(file) {
  return parseCsv(await fs.readFile(file, "utf8"));
}

const esc = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function writeCsv(file, rows, columns) {
  const cols = columns ?? Object.keys(rows[0] ?? {});
  const text = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
  await fs.writeFile(file, text);
}

export async function readJsonl(file) {
  if (!existsSync(file)) return [];
  const text = await fs.readFile(file, "utf8");
  return text.split("\n").filter(Boolean).map((l) => JSON.parse(l));
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------------------------
// Per-network politeness. Many local governments share one hosting provider (the pilot found a
// single provider's /21 and /22 refusing connections after URL resolution had sent it many
// requests across different client domains). A per-domain delay does not protect the provider, so
// requests are also spaced per network: the first two octets of the resolved IPv4 address, or the
// first three groups of an IPv6 address.
import dns from "node:dns/promises";
const netLast = new Map();
const ipCache = new Map();
export async function netKey(hostname) {
  if (ipCache.has(hostname)) return ipCache.get(hostname);
  let key = `host:${hostname}`;
  try {
    const { address, family } = await dns.lookup(hostname);
    key = family === 6 ? address.split(":").slice(0, 3).join(":") : address.split(".").slice(0, 2).join(".");
  } catch {}
  ipCache.set(hostname, key);
  return key;
}
export async function netGate(hostname, gapMs) {
  const key = await netKey(hostname);
  for (;;) {
    const wait = (netLast.get(key) ?? 0) + gapMs - Date.now();
    if (wait <= 0) break;
    await sleep(wait + Math.floor(Math.random() * 200));
  }
  netLast.set(key, Date.now());
  return key;
}
