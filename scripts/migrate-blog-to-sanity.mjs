// One-off migration: import the hardcoded static blog posts into Sanity so every
// post renders through the single /blog/[slug] template.
//
// Post content lives in scripts/blog-migration/<slug>.mjs (one default-exported
// object each). This runner resolves category/author references, injects the
// _key values Portable Text requires, and upserts each post with a deterministic
// _id (migrated-<slug>) so it is safe to re-run.
//
// Usage:
//   node scripts/migrate-blog-to-sanity.mjs --check   # dry run, no writes
//   node scripts/migrate-blog-to-sanity.mjs           # write to Sanity

import { createClient } from '@sanity/client'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--check')

// --- read SANITY_WRITE_TOKEN from .env.local (not committed) ---
function readEnv(name) {
  for (const file of ['.env.local', '.env']) {
    try {
      const line = readFileSync(join(__dirname, '..', file), 'utf8')
        .split('\n')
        .find((l) => l.startsWith(name + '='))
      if (line) return line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '')
    } catch {}
  }
  return process.env[name]
}

const token = readEnv('SANITY_WRITE_TOKEN')
if (!token && !DRY_RUN) {
  console.error('Missing SANITY_WRITE_TOKEN in .env.local'); process.exit(1)
}

const client = createClient({
  projectId: 'pcyg59i7',
  dataset: 'accessibilityblogs',
  apiVersion: '2021-06-07',
  token,
  useCdn: false,
})

// Deterministic _key generator per document.
function keyer() {
  let n = 0
  return () => `k${(n++).toString(36)}`
}

// Walk Portable Text and add _key everywhere the format requires one.
function withKeys(body) {
  const key = keyer()
  return body.map((block) => {
    const b = { _key: key(), ...block }
    if (Array.isArray(b.children)) {
      b.children = b.children.map((c) => ({ _key: key(), marks: [], ...c }))
    }
    if (Array.isArray(b.markDefs)) {
      b.markDefs = b.markDefs.map((m) => ({ _key: m._key || key(), ...m }))
    } else if (b._type === 'block') {
      b.markDefs = []
    }
    return b
  })
}

async function main() {
  const AUTHOR_ID = 'author-accessibility-build-team' // "The Accessibility.build Team"

  // Map category title -> _id from the live dataset.
  const cats = await client.fetch('*[_type=="category"]{_id,title}')
  const catByTitle = new Map(cats.map((c) => [c.title.toLowerCase(), c._id]))

  const dir = join(__dirname, 'blog-migration')
  const files = readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort()
  console.log(`${files.length} post modules found. Mode: ${DRY_RUN ? 'DRY RUN' : 'WRITE'}\n`)

  const docs = []
  for (const file of files) {
    const mod = (await import(pathToFileURL(join(dir, file)).href)).default
    const catRefs = (mod.categoryTitles || []).map((t, i) => {
      const id = catByTitle.get(t.toLowerCase())
      if (!id) throw new Error(`${file}: unknown category "${t}" (have: ${[...catByTitle.keys()].join(', ')})`)
      return { _type: 'reference', _ref: id, _key: `cat${i}` }
    })
    const doc = {
      _id: `migrated-${mod.slug}`,
      _type: 'post',
      title: mod.title,
      slug: { _type: 'slug', current: mod.slug },
      author: { _type: 'reference', _ref: AUTHOR_ID },
      categories: catRefs,
      publishedAt: mod.publishedAt,
      excerpt: mod.excerpt,
      body: withKeys(mod.body),
      ...(mod.seo ? { seo: mod.seo } : {}),
    }
    docs.push(doc)
    const words = mod.body.filter((b) => b._type === 'block').flatMap((b) => b.children || []).map((c) => c.text || '').join(' ').split(/\s+/).length
    console.log(`  ${mod.slug}  [${(mod.categoryTitles || []).join(', ')}]  ~${words} words, ${mod.body.length} blocks`)
  }

  if (DRY_RUN) {
    console.log('\nDry run complete — no writes performed.')
    return
  }

  let tx = client.transaction()
  for (const doc of docs) tx = tx.createOrReplace(doc)
  const res = await tx.commit()
  console.log(`\n✓ Upserted ${docs.length} posts. Transaction ${res.transactionId}`)
}

main().catch((e) => { console.error(e.message || e); process.exit(1) })
