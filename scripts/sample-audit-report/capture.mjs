#!/usr/bin/env node
/**
 * Renders the evidence screens for /sample-audit-report.
 *
 *   node scripts/sample-audit-report/capture.mjs
 *
 * Reads screens.html next to this file, captures every <section data-shot> at
 * 2x, and writes public/images/sample-audit-report/<id>.webp (1600 px wide or
 * the natural width, whichever is smaller). Prints each file's size and
 * dimensions so lib/sample-audit-report.ts can carry the right width/height.
 */
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { mkdir } from "node:fs/promises"
import puppeteer from "puppeteer"
import sharp from "sharp"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, "../..")
const outDir = path.join(root, "public/images/sample-audit-report")
const MAX_WIDTH = 1600

await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  // Falls back to an installed Chrome when Puppeteer has not downloaded its own.
  executablePath:
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.CHROME_PATH ||
    (process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : undefined),
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1300, height: 900, deviceScaleFactor: 2 })
  await page.goto(pathToFileURL(path.join(here, "screens.html")).href, {
    waitUntil: "load",
  })

  const ids = await page.$$eval("[data-shot]", (els) => els.map((el) => el.dataset.shot))
  for (const id of ids) {
    const el = await page.$(`[data-shot="${id}"]`)
    const png = await el.screenshot({ type: "png" })
    const img = sharp(png)
    const meta = await img.metadata()
    const width = Math.min(MAX_WIDTH, meta.width)
    const file = path.join(outDir, `${id}.webp`)
    const info = await img.resize({ width }).webp({ quality: 82 }).toFile(file)
    console.log(`${id}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
  }
} finally {
  await browser.close()
}
