#!/usr/bin/env node
/**
 * indexnow.mjs — instant URL submission to Bing (and Yandex, Seznam, Naver) via
 * the IndexNow protocol. Google does NOT use IndexNow, so this is Bing-side only.
 *
 * IndexNow needs a key file publicly hosted on the domain. This script:
 *   - with --init : generates a key, writes public/<key>.txt (commit + deploy it),
 *   - otherwise   : finds the key, verifies the key file is live, then submits URLs.
 *
 * Usage:
 *   node scripts/seo/indexnow.mjs --init         # one-time: create the key file
 *   #   ... commit public/<key>.txt and let Vercel deploy it, then:
 *   node scripts/seo/indexnow.mjs                # submit the default 5 URLs
 *   node scripts/seo/indexnow.mjs --url https://accessibility.build/blog/foo
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', '..', 'public')
const HOST = 'accessibility.build'
const ORIGIN = `https://${HOST}`
const DEFAULT_URLS = [
  `${ORIGIN}/blog/missouri-sb-907-accessibility-litigation-safe-harbor`,
  `${ORIGIN}/blog/web-accessibility-lawsuits-2026-midyear-numbers`,
  `${ORIGIN}/blog/apple-intelligence-image-descriptions-alt-text-obligation`,
  `${ORIGIN}/blog/eaa-auchan-ruling-threshold-loophole`,
  `${ORIGIN}/blog/en-301-549-v4-1-1-wcag-2-2-eaa`,
]

const has = (name) => process.argv.includes(`--${name}`)
const val = (name) => {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`))
  if (eq) return eq.slice(`--${name}=`.length)
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 ? process.argv[i + 1] : null
}

// An IndexNow key is 8-128 hex chars; the file is named <key>.txt and contains the key.
function findKey() {
  if (!existsSync(PUBLIC_DIR)) return null
  const f = readdirSync(PUBLIC_DIR).find((n) => /^[a-f0-9]{16,128}\.txt$/i.test(n))
  return f ? f.replace(/\.txt$/i, '') : null
}

async function main() {
  if (has('init')) {
    if (findKey()) { console.log(`Key file already exists: public/${findKey()}.txt`); return }
    const key = randomBytes(16).toString('hex') // 32 hex chars
    if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true })
    writeFileSync(join(PUBLIC_DIR, `${key}.txt`), key)
    console.log(`Created public/${key}.txt`)
    console.log('Next: commit this file and let Vercel deploy it, then run this script again to submit URLs.')
    console.log(`It must be reachable at ${ORIGIN}/${key}.txt before submission will be accepted.`)
    return
  }

  const key = findKey()
  if (!key) {
    console.error('No IndexNow key file found in public/. Run with --init first.')
    process.exit(1)
  }
  const keyLocation = `${ORIGIN}/${key}.txt`

  // Verify the key file is live before submitting (IndexNow will reject otherwise).
  try {
    const check = await fetch(keyLocation)
    const body = (await check.text()).trim()
    if (!check.ok || body !== key) {
      console.error(`Key file not live/correct at ${keyLocation} (status ${check.status}). Deploy it first.`)
      process.exit(1)
    }
    console.log(`Key file verified live: ${keyLocation}`)
  } catch (e) {
    console.error(`Could not fetch ${keyLocation}: ${e.message}. Deploy the key file first.`)
    process.exit(1)
  }

  const single = val('url')
  const urlList = single ? [single] : DEFAULT_URLS

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
  })
  const text = await res.text()
  console.log(`\nIndexNow response: ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`)
  if (res.status === 200 || res.status === 202) {
    console.log(`Submitted ${urlList.length} URL(s) to IndexNow (Bing, Yandex, Seznam, Naver):`)
    urlList.forEach((u) => console.log(`  + ${u}`))
  } else {
    console.error('Submission not accepted. 403 usually means the key file is not reachable at keyLocation.')
  }
}

main().catch((e) => { console.error(e.message || e); process.exit(1) })
