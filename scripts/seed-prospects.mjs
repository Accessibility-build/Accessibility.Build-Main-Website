#!/usr/bin/env node
/**
 * seed-prospects.mjs — load researched sales leads into the `prospects` table.
 *
 * The source JSON names real companies, their accessibility failings and their
 * published email addresses. This repository is public, so the data file is
 * gitignored (see .gitignore) and only data/prospects.example.json — two
 * invented companies documenting the shape — is committed.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-prospects.mjs
 *   node --env-file=.env.local scripts/seed-prospects.mjs --file ./data/prospects.seed.json
 *   node --env-file=.env.local scripts/seed-prospects.mjs --dry-run
 *
 * Idempotent: rows are upserted on `company`, so re-running refreshes the
 * research fields rather than duplicating rows. `status` and `notes` belong to
 * the operator and are deliberately left untouched on update.
 *
 * This script never sends anything. It only writes rows.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import postgres from 'postgres'

const DEFAULT_FILE = './data/prospects.seed.json'

const VALID_TIERS = new Set(['send-now', 'send-careful', 'linkedin-only', 'hold'])
const VALID_STATUSES = new Set(['new', 'sent', 'replied', 'won', 'dead'])

function parseArgs(argv) {
  const options = { file: DEFAULT_FILE, dryRun: false }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--file') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('--file needs a path, e.g. --file ./data/prospects.seed.json')
      }
      options.file = value
      i += 1
    } else if (arg.startsWith('--file=')) {
      options.file = arg.slice('--file='.length)
    } else if (arg === '--help' || arg === '-h') {
      options.help = true
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return options
}

function printHelp() {
  console.log(`
Load researched prospects into the prospects table.

  --file <path>   JSON file to read (default: ${DEFAULT_FILE})
  --dry-run       Report what would change, write nothing
  -h, --help      Show this message

DATABASE_URL must be set. The simplest way locally:
  node --env-file=.env.local scripts/seed-prospects.mjs --file ./data/prospects.seed.json
`)
}

/** Trim a value to a string, or null when it is absent/blank. */
function str(value) {
  if (value === undefined || value === null) return null
  const text = String(value).trim()
  return text.length > 0 ? text : null
}

function bool(value, fallback = false) {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'boolean') return value
  const text = String(value).trim().toLowerCase()
  if (['true', 'yes', '1'].includes(text)) return true
  if (['false', 'no', '0'].includes(text)) return false
  return fallback
}

function int(value, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function date(value) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Findings are stored as [{ n, text }]. Accept that shape, a bare array of
 * strings, or a single string, so a hand-edited file does not fail the run.
 */
function normaliseFindings(value) {
  if (!value) return []
  const list = Array.isArray(value) ? value : [value]

  return list
    .map((entry, index) => {
      if (typeof entry === 'string') {
        return { n: index + 1, text: entry.trim() }
      }
      if (entry && typeof entry === 'object') {
        const text = str(entry.text ?? entry.finding ?? entry.description)
        if (!text) return null
        return { n: int(entry.n, index + 1), text }
      }
      return null
    })
    .filter(Boolean)
}

function normaliseRow(raw, index) {
  const company = str(raw?.company)
  if (!company) {
    throw new Error(`Record ${index + 1} has no "company" — that is the upsert key, so it is required.`)
  }

  const tier = str(raw.tier)
  const status = str(raw.status)

  const warnings = []
  if (tier && !VALID_TIERS.has(tier)) {
    warnings.push(`unknown tier "${tier}" (expected one of ${[...VALID_TIERS].join(', ')})`)
  }
  if (status && !VALID_STATUSES.has(status)) {
    warnings.push(`unknown status "${status}" (expected one of ${[...VALID_STATUSES].join(', ')})`)
  }

  return {
    warnings,
    row: {
      company,
      website: str(raw.website ?? raw.url),
      country: str(raw.country),
      sector: str(raw.sector),
      tier,
      sendability: str(raw.sendability),
      email_address: str(raw.emailAddress ?? raw.email_address ?? raw.email),
      address_source: str(raw.addressSource ?? raw.address_source),
      contact_role: str(raw.contactRole ?? raw.contact_role),
      overlay: str(raw.overlay),
      has_statement: bool(raw.hasStatement ?? raw.has_statement, false),
      statement_note: str(raw.statementNote ?? raw.statement_note),
      findings: normaliseFindings(raw.findings),
      evidence: str(raw.evidence),
      subject: str(raw.subject),
      email_body: str(raw.emailBody ?? raw.email_body ?? raw.body),
      caution: str(raw.caution),
      score: int(raw.score, 0),
      // Only used on INSERT. An existing row keeps whatever the operator set.
      status: status ?? 'new',
      notes: str(raw.notes),
      scanned_at: date(raw.scannedAt ?? raw.scanned_at),
    },
  }
}

async function main() {
  let options
  try {
    options = parseArgs(process.argv.slice(2))
  } catch (error) {
    console.error(`Error: ${error.message}`)
    printHelp()
    process.exitCode = 1
    return
  }

  if (options.help) {
    printHelp()
    return
  }

  const filePath = path.resolve(process.cwd(), options.file)

  let parsed
  try {
    parsed = JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: no such file: ${filePath}`)
      console.error('The real data file is gitignored. Copy your researched JSON to')
      console.error(`  ${path.resolve(process.cwd(), DEFAULT_FILE)}`)
      console.error('or pass --file <path>. See data/prospects.example.json for the shape.')
    } else {
      console.error(`Error reading ${filePath}: ${error.message}`)
    }
    process.exitCode = 1
    return
  }

  if (!Array.isArray(parsed)) {
    console.error(`Error: ${filePath} must contain a JSON array of prospect objects.`)
    process.exitCode = 1
    return
  }

  const rows = []
  const seen = new Map()
  try {
    parsed.forEach((raw, index) => {
      const { row, warnings } = normaliseRow(raw, index)
      warnings.forEach((warning) => console.warn(`Warning: ${row.company}: ${warning}`))

      if (seen.has(row.company)) {
        console.warn(`Warning: "${row.company}" appears more than once; the last record wins.`)
        rows[seen.get(row.company)] = row
        return
      }

      seen.set(row.company, rows.length)
      rows.push(row)
    })
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exitCode = 1
    return
  }

  if (rows.length === 0) {
    console.log('Nothing to do: the file contains no records.')
    return
  }

  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set.')
    console.error('Try: node --env-file=.env.local scripts/seed-prospects.mjs')
    process.exitCode = 1
    return
  }

  const sql = postgres(process.env.DATABASE_URL, {
    prepare: false,
    max: 1,
    connect_timeout: 30,
  })

  try {
    const companies = rows.map((row) => row.company)
    const existing = await sql`SELECT company FROM prospects WHERE company IN ${sql(companies)}`
    const existingCompanies = new Set(existing.map((record) => record.company))

    const toUpdate = rows.filter((row) => existingCompanies.has(row.company))
    const toInsert = rows.filter((row) => !existingCompanies.has(row.company))

    console.log(`File:   ${filePath}`)
    console.log(`Read:   ${rows.length} record(s)`)
    console.log(`Insert: ${toInsert.length}`)
    console.log(`Update: ${toUpdate.length} (status and notes preserved)`)

    if (options.dryRun) {
      if (toInsert.length > 0) {
        console.log('\nWould insert:')
        toInsert.forEach((row) => console.log(`  + ${row.company}${row.tier ? ` [${row.tier}]` : ''}`))
      }
      if (toUpdate.length > 0) {
        console.log('\nWould update:')
        toUpdate.forEach((row) => console.log(`  ~ ${row.company}${row.tier ? ` [${row.tier}]` : ''}`))
      }
      console.log('\nDry run: nothing was written.')
      return
    }

    const columns = [
      'company', 'website', 'country', 'sector', 'tier', 'sendability',
      'email_address', 'address_source', 'contact_role', 'overlay',
      'has_statement', 'statement_note', 'findings', 'evidence', 'subject',
      'email_body', 'caution', 'score', 'status', 'notes', 'scanned_at',
    ]

    // Everything except company (the key), status and notes (the operator's).
    const refreshable = columns.filter(
      (column) => !['company', 'status', 'notes'].includes(column),
    )

    const updateClause = refreshable
      .map((column) => `"${column}" = excluded."${column}"`)
      .concat('"updated_at" = now()')
      .join(', ')

    // Chunked so a large file stays well inside the parameter limit.
    const CHUNK_SIZE = 25
    let written = 0

    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      // findings is jsonb: tag it explicitly so postgres.js sends a JSON array
      // rather than inferring a Postgres array from the JS one.
      const chunk = rows
        .slice(i, i + CHUNK_SIZE)
        .map((row) => ({ ...row, findings: sql.json(row.findings) }))
      const result = await sql`
        INSERT INTO prospects ${sql(chunk, ...columns)}
        ON CONFLICT ("company") DO UPDATE SET ${sql.unsafe(updateClause)}
        RETURNING company
      `
      written += result.length
    }

    console.log(`\nDone: ${written} row(s) written.`)
    console.log('Review them at /admin/prospects')
  } catch (error) {
    console.error(`\nDatabase error: ${error.message}`)
    if (/relation "prospects" does not exist/i.test(error.message)) {
      console.error('Apply drizzle/0012_prospects.sql to this database first.')
    }
    process.exitCode = 1
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main()
