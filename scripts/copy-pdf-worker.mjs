// Copies the pdf.js worker into public/ so the in-browser PDF check on
// /compliance/title-ii loads it from our own origin (no CDN, and the file
// being checked never leaves the browser). Runs before every build so the
// worker always matches the installed pdfjs-dist version; the copy is also
// committed so `next dev` works without a build.
import { copyFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const from = join(root, "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs")
const to = join(root, "public/vendor/pdfjs/pdf.worker.min.mjs")
mkdirSync(dirname(to), { recursive: true })
copyFileSync(from, to)
console.log("pdf.js worker copied to public/vendor/pdfjs/")
