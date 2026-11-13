// Load paid template files into the database from the owner's PRIVATE folder (never commit them).
//   node --env-file=.env.local scripts/billing/load-product-files.mjs <product-slug> <version> <file> [<file> ...]
// e.g. node --env-file=.env.local scripts/billing/load-product-files.mjs wcag-audit-workbook 1.0 ~/accessibility-build-products/dist/release/WCAG-Audit-Workbook-v1.0.zip
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import postgres from "postgres"

const [slug, version, ...files] = process.argv.slice(2)
if (!slug || !version || !files.length) {
  console.error("usage: load-product-files.mjs <product-slug> <version> <file>...")
  process.exit(1)
}
const TYPES = { ".zip": "application/zip", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".pdf": "application/pdf" }
const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: "require" })
try {
  for (const f of files) {
    const data = fs.readFileSync(f)
    const filename = path.basename(f)
    const sha256 = crypto.createHash("sha256").update(data).digest("hex")
    const contentType = TYPES[path.extname(f).toLowerCase()] || "application/octet-stream"
    await sql`
      INSERT INTO product_files (product_slug, filename, content_type, version, size_bytes, sha256, data, updated_at)
      VALUES (${slug}, ${filename}, ${contentType}, ${version}, ${data.length}, ${sha256}, ${data}, now())
      ON CONFLICT (product_slug, filename) DO UPDATE SET content_type = EXCLUDED.content_type, version = EXCLUDED.version,
        size_bytes = EXCLUDED.size_bytes, sha256 = EXCLUDED.sha256, data = EXCLUDED.data, updated_at = now()`
    console.log(`loaded ${slug}/${filename} (${data.length} bytes, ${sha256.slice(0, 12)})`)
  }
} finally {
  await sql.end()
}
