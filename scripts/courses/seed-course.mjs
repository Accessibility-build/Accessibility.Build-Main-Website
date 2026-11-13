// Load a course's content into the database from the owner's PRIVATE build output.
// Course text and questions must never be committed to this public repo.
//
//   node --env-file=.env.local scripts/courses/seed-course.mjs ~/accessibility-build-products/cpacc/build/out/course.json
//   (add --dry-run to check the file without writing)
//
// Upserts meta, chapters, questions and flashcards for the course slug in the file, then deletes
// rows for keys no longer present, inside one transaction.
import fs from "node:fs"
import postgres from "postgres"

const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith("--"))
const dry = args.includes("--dry-run")
if (!file) {
  console.error("usage: seed-course.mjs <course.json> [--dry-run]")
  process.exit(1)
}
const course = JSON.parse(fs.readFileSync(file, "utf8"))
const slug = course.slug
const edition = String(course.edition)
const rows = []
// Reading time for the course outline: about 200 words a minute, at least one minute.
const words = (v) => (typeof v === "string" ? v.split(/\s+/).filter(Boolean).length : Array.isArray(v) ? v.reduce((n, x) => n + words(x), 0) : v && typeof v === "object" ? Object.values(v).reduce((n, x) => n + words(x), 0) : 0)
const index = course.chapters.map(({ blocks, ...rest }) => ({ ...rest, readingMinutes: Math.max(1, Math.round(words(blocks) / 200)) }))
rows.push({
  kind: "meta",
  key: "meta",
  position: 0,
  data: {
    slug,
    edition,
    built: course.built,
    parts: course.parts,
    chapters: index,
    sections: course.sections,
    questionCount: course.questions.length,
    flashcardCount: course.flashcards.length,
  },
})
course.chapters.forEach((c, i) => rows.push({ kind: "chapter", key: c.key, position: i, data: c }))
course.questions.forEach((q, i) => rows.push({ kind: "question", key: q.id, position: i, data: q }))
course.flashcards.forEach((f, i) => rows.push({ kind: "flashcard", key: String(i), position: i, data: f }))

// Sanity checks before touching the database
const keys = new Set()
for (const r of rows) {
  const k = `${r.kind}:${r.key}`
  if (keys.has(k)) throw new Error(`duplicate ${k}`)
  keys.add(k)
}
for (const q of course.questions) {
  if (!Array.isArray(q.options) || q.options.length !== 4 || q.answer < 0 || q.answer > 3) throw new Error(`bad question ${q.id}`)
}
const counts = rows.reduce((m, r) => ((m[r.kind] = (m[r.kind] || 0) + 1), m), {})
console.log(`course ${slug} edition ${edition}:`, counts)
if (dry) process.exit(0)

const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: "require" })
try {
  await sql.begin(async (tx) => {
    // Batched upserts: one round trip per 100 rows.
    for (let i = 0; i < rows.length; i += 100) {
      const batch = rows.slice(i, i + 100).map((r) => ({
        course_slug: slug,
        kind: r.kind,
        key: r.key,
        position: r.position,
        data: tx.json(r.data),
        edition,
      }))
      await tx`
        INSERT INTO course_content ${tx(batch, "course_slug", "kind", "key", "position", "data", "edition")}
        ON CONFLICT (course_slug, kind, key)
        DO UPDATE SET position = EXCLUDED.position, data = EXCLUDED.data, edition = EXCLUDED.edition, updated_at = now()`
    }
    const del = await tx`DELETE FROM course_content WHERE course_slug = ${slug} AND edition <> ${edition} RETURNING kind, key`
    const stale = await tx`SELECT kind, key FROM course_content WHERE course_slug = ${slug}`
    const keep = new Set(rows.map((r) => `${r.kind}:${r.key}`))
    const extra = stale.filter((s) => !keep.has(`${s.kind}:${s.key}`))
    for (const e of extra) await tx`DELETE FROM course_content WHERE course_slug = ${slug} AND kind = ${e.kind} AND key = ${e.key}`
    console.log(`upserted ${rows.length}; removed ${del.length + extra.length} stale rows`)
  })
} finally {
  await sql.end()
}
