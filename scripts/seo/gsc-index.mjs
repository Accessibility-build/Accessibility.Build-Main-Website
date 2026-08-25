#!/usr/bin/env node
/**
 * gsc-index.mjs — Google Search Console automation for new content.
 *
 * What it CAN do (this is the full extent of what Google's API allows for
 * ordinary pages):
 *   1. Submit / resubmit the sitemap, so every URL in it is registered.
 *   2. Inspect each URL's live index status (URL Inspection API), so you can
 *      monitor when Google actually indexes them.
 *
 * What it CANNOT do: force per-URL indexing. Google exposes no "Request
 * Indexing" API for normal content (the Indexing API is JobPosting /
 * BroadcastEvent only). That button stays manual in the Search Console UI.
 *
 * Auth: a Google service-account JSON. The service account must be added as an
 * OWNER (Full) user on the accessibility.build property in Search Console, and
 * the "Google Search Console API" must be enabled in its Cloud project.
 *
 * Usage:
 *   node scripts/seo/gsc-index.mjs --creds ./secrets/gsc-service-account.json --submit-sitemap
 *   node scripts/seo/gsc-index.mjs --creds ./secrets/gsc-service-account.json   # inspect only
 *   node scripts/seo/gsc-index.mjs --creds ... --url https://accessibility.build/blog/foo
 *
 * The creds file is gitignored (secrets/, *service-account*.json). Never commit it.
 */
import { readFileSync } from 'node:fs'
import { createSign } from 'node:crypto'

const SITE_HINT = 'accessibility.build'
const SITEMAP = 'https://accessibility.build/sitemap.xml'
const DEFAULT_URLS = [
  'https://accessibility.build/blog/missouri-sb-907-accessibility-litigation-safe-harbor',
  'https://accessibility.build/blog/web-accessibility-lawsuits-2026-midyear-numbers',
  'https://accessibility.build/blog/apple-intelligence-image-descriptions-alt-text-obligation',
  'https://accessibility.build/blog/eaa-auchan-ruling-threshold-loophole',
  'https://accessibility.build/blog/en-301-549-v4-1-1-wcag-2-2-eaa',
]

function arg(name, fallback = null) {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`))
  if (eq) return eq.slice(`--${name}=`.length)
  const i = process.argv.indexOf(`--${name}`)
  if (i !== -1) {
    const next = process.argv[i + 1]
    return next && !next.startsWith('--') ? next : true
  }
  return fallback
}

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function getAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64url(JSON.stringify({
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: creds.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${claims}`)
  const signature = signer.sign(creds.private_key).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const assertion = `${header}.${claims}.${signature}`

  const res = await fetch(creds.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Token exchange failed (${res.status}): ${JSON.stringify(json)}`)
  return json.access_token
}

async function api(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const text = await res.text()
  let body
  try { body = text ? JSON.parse(text) : {} } catch { body = { raw: text } }
  return { ok: res.ok, status: res.status, body }
}

async function main() {
  const credsPath = arg('creds', './secrets/gsc-service-account.json')
  let creds
  try {
    creds = JSON.parse(readFileSync(credsPath, 'utf8'))
  } catch (e) {
    console.error(`Could not read service-account JSON at ${credsPath}: ${e.message}`)
    console.error('Pass --creds <path> or place it at secrets/gsc-service-account.json (gitignored).')
    process.exit(1)
  }
  console.log(`Service account: ${creds.client_email}`)

  const token = await getAccessToken(creds)
  console.log('Access token acquired.\n')

  // Discover the exact property siteUrl this SA can see.
  const sites = await api(token, 'https://www.googleapis.com/webmasters/v3/sites')
  if (!sites.ok) {
    console.error(`sites.list failed (${sites.status}): ${JSON.stringify(sites.body)}`)
    console.error('Most likely the service account is not yet added as a user on the property,')
    console.error('or the Search Console API is not enabled in its Cloud project.')
    process.exit(1)
  }
  const entries = sites.body.siteEntry || []
  console.log('Properties visible to this service account:')
  entries.forEach((s) => console.log(`  ${s.siteUrl}  (${s.permissionLevel})`))
  const site = entries.find((s) => s.siteUrl.includes(SITE_HINT))
  if (!site) {
    console.error(`\nNo property matching "${SITE_HINT}" is visible. Add ${creds.client_email} as a user`)
    console.error('on the accessibility.build property in Search Console (Owner/Full for sitemap submit).')
    process.exit(1)
  }
  const siteUrl = site.siteUrl
  console.log(`\nUsing property: ${siteUrl} (${site.permissionLevel})\n`)

  // 1) Submit the sitemap (needs Owner permission).
  if (arg('submit-sitemap')) {
    const enc = encodeURIComponent(siteUrl)
    const encMap = encodeURIComponent(SITEMAP)
    const r = await api(token, `https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps/${encMap}`, { method: 'PUT' })
    if (r.ok || r.status === 204) console.log(`Sitemap submitted: ${SITEMAP}`)
    else console.error(`Sitemap submit failed (${r.status}): ${JSON.stringify(r.body)} — needs Owner permission.`)
    console.log('')
  }

  // 2) Inspect each URL's current index status (read-only monitoring).
  const urlArg = arg('url')
  const urls = typeof urlArg === 'string' ? [urlArg] : DEFAULT_URLS
  console.log('URL index status:')
  for (const inspectionUrl of urls) {
    const r = await api(token, 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      body: JSON.stringify({ inspectionUrl, siteUrl, languageCode: 'en-US' }),
    })
    if (!r.ok) {
      console.log(`  ? ${inspectionUrl}\n      inspect failed (${r.status}): ${JSON.stringify(r.body).slice(0, 160)}`)
      continue
    }
    const idx = r.body.inspectionResult?.indexStatusResult || {}
    console.log(`  ${idx.verdict === 'PASS' ? '✓' : '·'} ${inspectionUrl}`)
    console.log(`      verdict=${idx.verdict || '-'}  coverage="${idx.coverageState || '-'}"  crawledAs=${idx.crawledAs || '-'}  lastCrawl=${(idx.lastCrawlTime || '-')}`)
  }
  console.log('\nNote: Google offers no API to force indexing of articles. Sitemap + internal links do the work;')
  console.log('to nudge a specific URL, use Request Indexing in the Search Console UI (manual).')
}

main().catch((e) => { console.error(e.message || e); process.exit(1) })
