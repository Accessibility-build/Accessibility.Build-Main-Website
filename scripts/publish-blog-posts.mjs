// Publish researched news/opinion blog posts (scripts/blog-new/<slug>.mjs) into
// Sanity. Same shape and idempotence as the migration runner, but keyed with
// news-<slug> ids and honoring each module's own publishedAt.
//
//   node scripts/publish-blog-posts.mjs --check   # dry run
//   node scripts/publish-blog-posts.mjs           # write

import { createClient } from '@sanity/client'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--check')

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
if (!token && !DRY_RUN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }

const client = createClient({
  projectId: 'pcyg59i7', dataset: 'accessibilityblogs',
  apiVersion: '2021-06-07', token, useCdn: false,
})

function keyer() { let n = 0; return () => `k${(n++).toString(36)}` }
function withKeys(body) {
  const key = keyer()
  return body.map((block) => {
    const b = { _key: key(), ...block }
    if (Array.isArray(b.children)) b.children = b.children.map((c) => ({ _key: key(), marks: [], ...c }))
    if (Array.isArray(b.markDefs)) b.markDefs = b.markDefs.map((m) => ({ _key: m._key || key(), ...m }))
    else if (b._type === 'block') b.markDefs = []
    return b
  })
}

async function main() {
  const AUTHOR_ID = 'author-accessibility-build-team'
  const cats = await client.fetch('*[_type=="category"]{_id,title}')
  const catByTitle = new Map(cats.map((c) => [c.title.toLowerCase(), c._id]))

  const dir = join(__dirname, 'blog-new')
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
    docs.push({
      _id: `news-${mod.slug}`,
      _type: 'post',
      title: mod.title,
      slug: { _type: 'slug', current: mod.slug },
      author: { _type: 'reference', _ref: AUTHOR_ID },
      categories: catRefs,
      publishedAt: mod.publishedAt,
      excerpt: mod.excerpt,
      body: withKeys(mod.body),
      ...(mod.seo ? { seo: mod.seo } : {}),
    })
    const words = mod.body.filter((b) => b._type === 'block').flatMap((b) => b.children || []).map((c) => c.text || '').join(' ').split(/\s+/).length
    console.log(`  ${mod.publishedAt.slice(0,10)}  ${mod.slug}  [${(mod.categoryTitles||[]).join(', ')}]  ~${words} words`)
  }

  if (DRY_RUN) { console.log('\nDry run complete — no writes.'); return }
  let tx = client.transaction()
  for (const doc of docs) tx = tx.createOrReplace(doc)
  const res = await tx.commit()
  console.log(`\n✓ Published ${docs.length} posts. Transaction ${res.transactionId}`)
}

main().catch((e) => { console.error(e.message || e); process.exit(1) })
