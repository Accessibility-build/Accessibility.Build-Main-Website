#!/usr/bin/env node
/**
 * indexnow.mjs - instant URL submission via the IndexNow protocol.
 *
 * One ping reaches every participating engine (Bing, Yandex, Seznam, Naver).
 * Google does NOT participate, so this is Bing-side only and complements, rather
 * than replaces, the sitemap. Bing feeds Microsoft Copilot, so this is also an
 * AI-answer distribution channel.
 *
 * URLs come from the LIVE sitemap at /sitemap.xml, which is the single source of
 * truth (lib/site-routes.ts plus Sanity blog posts). There is deliberately no
 * hardcoded URL list to drift out of date.
 *
 * IndexNow is for telling engines what CHANGED. Mass-submitting URLs that have
 * not moved wastes crawl budget and Bing explicitly advises against it, so the
 * default is "everything with a lastmod in the past 7 days".
 *
 * Usage:
 *   node scripts/seo/indexnow.mjs --init          # one-time: write public/<key>.txt
 *   node scripts/seo/indexnow.mjs --dry-run       # show what would be sent
 *   node scripts/seo/indexnow.mjs                 # submit last 7 days of changes
 *   node scripts/seo/indexnow.mjs --days 30       # widen the window
 *   node scripts/seo/indexnow.mjs --all           # whole sitemap (use sparingly)
 *   node scripts/seo/indexnow.mjs --url https://accessibility.build/blog/foo
 *
 * The key is NOT a secret. IndexNow works by hosting it publicly at the domain
 * root, which is how an engine proves the submitter controls the domain.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', '..', 'public')
const HOST = 'accessibility.build'
const ORIGIN = `https://${HOST}`
const SITEMAP = `${ORIGIN}/sitemap.xml`
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_PER_REQUEST = 10000 // protocol limit
const DEFAULT_DAYS = 7

const has = (name) => process.argv.includes(`--${name}`)
const val = (name) => {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`))
  if (eq) return eq.slice(`--${name}=`.length)
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : null
}
// --url may be repeated
const allVals = (name) =>
  process.argv.reduce((acc, a, i) => {
    if (a === `--${name}` && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
      acc.push(process.argv[i + 1])
    } else if (a.startsWith(`--${name}=`)) {
      acc.push(a.slice(`--${name}=`.length))
    }
    return acc
  }, [])

/** An IndexNow key is 8-128 hex chars; the file is named <key>.txt and contains only the key. */
function findKey() {
  if (!existsSync(PUBLIC_DIR)) return null
  const f = readdirSync(PUBLIC_DIR).find((n) => /^[a-f0-9]{8,128}\.txt$/i.test(n))
  return f ? f.replace(/\.txt$/i, '') : null
}

/** Pull <loc>/<lastmod> pairs out of the live sitemap. */
async function fetchSitemap() {
  const res = await fetch(SITEMAP, { headers: { 'User-Agent': 'accessibility.build-indexnow/1.0' } })
  if (!res.ok) throw new Error(`Could not fetch ${SITEMAP} (HTTP ${res.status})`)
  const xml = await res.text()
  const entries = []
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim()
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim()
    if (loc) entries.push({ loc, lastmod: lastmod ? new Date(lastmod) : null })
  }
  if (!entries.length) throw new Error('Sitemap parsed to zero URLs; refusing to continue.')
  return entries
}

async function verifyKeyLive(key, keyLocation) {
  const res = await fetch(keyLocation, { headers: { 'User-Agent': 'accessibility.build-indexnow/1.0' } })
  const body = (await res.text()).trim()
  if (!res.ok) throw new Error(`Key file returned HTTP ${res.status} at ${keyLocation}. Deploy it first.`)
  if (body !== key) throw new Error(`Key file at ${keyLocation} does not contain the key. Found: "${body.slice(0, 60)}"`)
}

async function submit(batch, key, keyLocation) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList: batch }),
  })
  const text = await res.text().catch(() => '')
  return { status: res.status, statusText: res.statusText, text }
}

const EXPLAIN = {
  200: 'OK, URLs submitted.',
  202: 'Accepted. URLs received, key validation pending.',
  400: 'Bad request (invalid format).',
  403: 'Forbidden. The key file is not reachable, or does not match.',
  422: 'Unprocessable. URLs do not belong to this host, or the key does not match the schema.',
  429: 'Too many requests (treated as potential spam). Back off and retry later.',
}

async function main() {
  if (has('init')) {
    const existing = findKey()
    if (existing) {
      console.log(`Key file already exists: public/${existing}.txt`)
      console.log(`It must be live at ${ORIGIN}/${existing}.txt before submissions are accepted.`)
      return
    }
    // Allow an explicit key (e.g. one generated in the Bing portal) or mint one.
    const supplied = val('key')
    if (supplied && !/^[a-f0-9]{8,128}$/i.test(supplied)) {
      throw new Error('--key must be 8 to 128 hexadecimal characters.')
    }
    const key = (supplied || randomBytes(16).toString('hex')).toLowerCase()
    if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true })
    writeFileSync(join(PUBLIC_DIR, `${key}.txt`), key)
    console.log(`Created public/${key}.txt`)
    console.log('')
    console.log('Next steps:')
    console.log('  1. Commit the key file and deploy, so it is served at the domain root.')
    console.log(`  2. Confirm ${ORIGIN}/${key}.txt returns the key as text/plain.`)
    console.log('  3. Run this script again to submit URLs.')
    return
  }

  const key = findKey()
  if (!key) {
    console.error('No IndexNow key file found in public/. Run with --init first.')
    process.exit(1)
  }
  const keyLocation = `${ORIGIN}/${key}.txt`
  const dryRun = has('dry-run')

  // Work out the URL list.
  const explicit = allVals('url')
  let urlList
  let source

  if (explicit.length) {
    urlList = explicit
    source = 'explicit --url arguments'
  } else {
    const entries = await fetchSitemap()
    if (has('all')) {
      urlList = entries.map((e) => e.loc)
      source = `entire sitemap (${entries.length} URLs)`
    } else {
      const days = Number(val('days') ?? DEFAULT_DAYS)
      if (!Number.isFinite(days) || days <= 0) throw new Error('--days must be a positive number.')
      const cutoff = Date.now() - days * 86400000
      urlList = entries.filter((e) => e.lastmod && e.lastmod.getTime() >= cutoff).map((e) => e.loc)
      source = `sitemap entries with lastmod in the past ${days} day(s), out of ${entries.length} total`
    }
  }

  // Everything must be on the declared host, or IndexNow returns 422.
  const offHost = urlList.filter((u) => {
    try { return new URL(u).host !== HOST } catch { return true }
  })
  if (offHost.length) {
    console.error(`These URLs are not on ${HOST} and would be rejected with 422:`)
    offHost.forEach((u) => console.error(`  ! ${u}`))
    process.exit(1)
  }

  urlList = [...new Set(urlList)]

  console.log(`Host        : ${HOST}`)
  console.log(`Key location: ${keyLocation}`)
  console.log(`Source      : ${source}`)
  console.log(`URLs        : ${urlList.length}`)

  if (!urlList.length) {
    console.log('\nNothing has changed in that window, so there is nothing to submit.')
    console.log('Use --days N to widen the window, or --all to resubmit everything.')
    return
  }

  if (dryRun) {
    console.log('\nDry run, nothing was sent. URLs that would be submitted:')
    urlList.forEach((u) => console.log(`  + ${u}`))
    return
  }

  // IndexNow rejects the whole submission if the key file is not reachable.
  await verifyKeyLive(key, keyLocation)
  console.log('Key file verified live.')

  let failed = false
  for (let i = 0; i < urlList.length; i += MAX_PER_REQUEST) {
    const batch = urlList.slice(i, i + MAX_PER_REQUEST)
    const { status, statusText, text } = await submit(batch, key, keyLocation)
    const note = EXPLAIN[status] || 'Unexpected response.'
    console.log(`\nIndexNow response: ${status} ${statusText}${text ? ` ${text}` : ''}`)
    console.log(note)
    if (status === 200 || status === 202) {
      console.log(`Submitted ${batch.length} URL(s):`)
      batch.forEach((u) => console.log(`  + ${u}`))
    } else {
      failed = true
    }
  }

  if (failed) {
    console.error('\nAt least one batch was not accepted.')
    process.exit(1)
  }
  console.log('\nVerify receipt in Bing Webmaster Tools under Indexing > IndexNow.')
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
