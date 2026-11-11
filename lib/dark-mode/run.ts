import "server-only"
import type { Page } from "puppeteer-core"
import axe from "axe-core"
import { detectBotWall, mediaFeatures, type RenderedPage } from "@/lib/render/browser"
import { assertPublicUrl } from "@/lib/public-url"
import { decodePng } from "@/lib/focus-order/png"
import type {
  AdaptiveDarkMode,
  ContrastFinding,
  ContrastItem,
  DarkModeResult,
  DarkTheme,
  Declaration,
  InvisibleItem,
  LinkItem,
  ReviewItem,
  Risk,
  RiskGroup,
  RiskKind,
  Scheme,
  Shot,
  Support,
  Where,
} from "@/lib/dark-mode/types"

// The dark mode contrast checker. One page load in headless Chrome, three looks at it:
//
// 1. Light: prefers-color-scheme light (set by withRenderedPage). Reads the color-scheme
//    declaration, scans the stylesheets for dark rules, lists Adaptive Dark Mode risks, runs axe
//    color-contrast and link-in-text-block.
// 2. Dark: the emulated preference is switched live first, so the same elements can be compared
//    (does the page respond at all?), then the page is reloaded so theme scripts that read
//    matchMedia only at load run again, and axe runs a second time.
// 3. Chromium's automatic dark theme, combined with the dark preference so it skips pages that
//    declare light dark or opt out, as Safari's Adaptive Dark Mode does. Screenshot only: it is
//    applied at paint time, so computed styles (and axe) never see it.
//
// Two traps handled here. page.emulateMediaFeatures replaces the whole emulated set, so the
// dark switch passes reduced motion again (mediaFeatures()). And axe assumes a white page when
// html and body are both transparent (axe-core issue #4608), which hides dark text on Chrome's
// dark canvas; setting html's background to the Canvas system colour first is visually a no-op
// and lets axe see the real background.

const SAMPLE_SIZE = 300
const LIST_CAP = 30
const SMALL_CAP = 15
const RISK_CAP = 8
const SHOT_HEIGHT = 1600
const SHOT_SCALE = 0.5
const AXE_RULES = ["color-contrast", "link-in-text-block"]
/** Nodes per rule brought back from the page, to keep the comparison and response small. */
const AXE_NODE_CAP = 200
/** Mean luminance below which a dark render counts as already dark. */
const DARK_PAGE_LUMINANCE = 0.25

interface AxeNode {
  selector: string
  text: string
  fg: string | null
  bg: string | null
  ratio: number | null
  required: number | null
  reason: string | null
}

interface AxePass {
  /** color-contrast violations before the cap. */
  total: number
  contrast: AxeNode[]
  incomplete: AxeNode[]
  links: AxeNode[]
  canvas: string
  timedOut: boolean
}

interface SchemeRun {
  axe: AxePass | null
  screenshot: Shot | null
  luminance: number | null
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Resolves to `fallback` when `promise` takes longer than `ms`. */
function within<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), Math.max(0, ms))
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      () => {
        clearTimeout(timer)
        resolve(fallback)
      },
    )
  })
}

// A selector and text helper defined in the page as a string, so it survives the __name wrapping
// that test runners add to functions, and is shared by every evaluate below.
const PAGE_HELPERS = `(() => {
  if (window.__a11yDm) return
  const sel = (el) => {
    if (!el || el.nodeType !== 1) return ""
    if (el.id && /^[A-Za-z][\\w-]*$/.test(el.id)) return "#" + el.id
    const parts = []
    let node = el
    while (node && node.nodeType === 1 && parts.length < 4 && node !== document.documentElement) {
      let part = node.tagName.toLowerCase()
      if (node.id && /^[A-Za-z][\\w-]*$/.test(node.id)) { parts.unshift("#" + node.id); break }
      const cls = [...node.classList].filter((c) => /^[A-Za-z][\\w-]*$/.test(c) && c.length < 30).slice(0, 2)
      if (cls.length) part += "." + cls.join(".")
      const parent = node.parentElement
      if (parent) {
        const same = [...parent.children].filter((c) => c.tagName === node.tagName)
        if (same.length > 1) part += ":nth-of-type(" + (same.indexOf(node) + 1) + ")"
      }
      parts.unshift(part)
      node = parent
    }
    return parts.join(" > ")
  }
  const text = (el, max = 90) => {
    const raw = (el && (el.innerText || el.textContent || el.getAttribute?.("aria-label") || el.getAttribute?.("value") || "")) || ""
    const clean = raw.replace(/\\s+/g, " ").trim()
    return clean.length > max ? clean.slice(0, max - 1) + "\\u2026" : clean
  }
  const transparent = (c) => !c || c === "transparent" || /rgba\\(.*,\\s*0\\)$/.test(c)
  const effectiveBg = (el) => {
    let node = el
    while (node && node.nodeType === 1) {
      const c = getComputedStyle(node).backgroundColor
      if (!transparent(c)) return c
      node = node.parentElement
    }
    return "canvas"
  }
  const canvasColour = () => {
    const d = document.createElement("div")
    d.style.cssText = "position:absolute;width:0;height:0;background-color:Canvas"
    document.documentElement.append(d)
    const c = getComputedStyle(d).backgroundColor
    d.remove()
    return c
  }
  window.__a11yDm = { sel, text, transparent, effectiveBg, canvasColour }
})()`

async function ensureHelpers(page: Page): Promise<void> {
  await page.evaluate(PAGE_HELPERS)
}

/** Reads the declaration signals Safari and the spec look at. */
async function readDeclaration(page: Page): Promise<Declaration> {
  const raw = await page.evaluate(() => {
    const metas = [...document.querySelectorAll('meta[name="color-scheme" i]')] as HTMLMetaElement[]
    const meta = metas.map((m) => (m.content || "").trim()).find((c) => c.length > 0) ?? null
    const darkPictureSources = [...document.querySelectorAll("picture source[media]")].filter((s) =>
      /prefers-color-scheme\s*:\s*dark/i.test(s.getAttribute("media") || ""),
    ).length
    const themeColorByScheme = !!document.querySelector('meta[name="theme-color" i][media*="prefers-color-scheme" i]')
    return {
      meta,
      rootColorScheme: getComputedStyle(document.documentElement).colorScheme || "normal",
      bodyColorScheme: document.body ? getComputedStyle(document.body).colorScheme || "normal" : "normal",
      darkPictureSources,
      themeColorByScheme,
    }
  })
  // The root element's computed color-scheme overrides the meta tag when it is set (Chromium
  // adapts a page whose meta says light dark but whose :root says light). color-scheme: light dark
  // on body also makes Safari and Chromium skip the page.
  const rootSet = raw.rootColorScheme !== "normal"
  let source: Declaration["source"] = rootSet ? "html" : raw.meta ? "meta" : null
  let supports: Support = parseScheme(rootSet ? raw.rootColorScheme : raw.meta)
  if (supports === "none") source = null
  if (supports !== "light-dark" && supports !== "light-only" && parseScheme(raw.bodyColorScheme) === "light-dark") {
    supports = "light-dark"
    source = "body"
  }
  const metaParsed = parseScheme(raw.meta)
  const metaOverridden = rootSet && metaParsed !== "none" && metaParsed !== parseScheme(raw.rootColorScheme)
  return { ...raw, supports, source, metaOverridden }
}

function parseScheme(value: string | null): Support {
  if (!value) return "none"
  const tokens = value.toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0 || tokens.includes("normal")) return "none"
  const light = tokens.includes("light")
  const dark = tokens.includes("dark")
  if (light && dark) return "light-dark"
  if (tokens.includes("only") && light) return "light-only"
  if (dark) return "dark"
  if (light) return "light"
  return "none"
}

/**
 * Counts @media (prefers-color-scheme: dark) blocks and light-dark() in every stylesheet. CDP
 * reads cross-origin sheets, where CSSOM cssRules throws a SecurityError.
 */
async function scanStylesheets(rendered: RenderedPage, budgetMs: number): Promise<{ darkMediaRules: number; usesLightDarkFunction: boolean; read: number }> {
  const empty = { darkMediaRules: 0, usesLightDarkFunction: false, read: 0 }
  const work = async () => {
    const cdp = await rendered.cdp()
    const ids: string[] = []
    const onAdded = (event: { header: { styleSheetId: string; origin: string } }) => {
      if (event.header.origin === "regular") ids.push(event.header.styleSheetId)
    }
    cdp.on("CSS.styleSheetAdded", onAdded)
    try {
      await cdp.send("DOM.enable")
      await cdp.send("CSS.enable")
      await sleep(100)
      let darkMediaRules = 0
      let usesLightDarkFunction = false
      let read = 0
      for (const styleSheetId of ids.slice(0, 60)) {
        const { text } = await cdp.send("CSS.getStyleSheetText", { styleSheetId }).catch(() => ({ text: "" }))
        if (!text) continue
        read += 1
        darkMediaRules += (text.match(/@media[^{]*prefers-color-scheme\s*:\s*dark/gi) ?? []).length
        if (/light-dark\(/i.test(text)) usesLightDarkFunction = true
      }
      return { darkMediaRules, usesLightDarkFunction, read }
    } finally {
      cdp.off("CSS.styleSheetAdded", onAdded)
      await cdp.send("CSS.disable").catch(() => {})
      await cdp.send("DOM.disable").catch(() => {})
    }
  }
  return within(work(), budgetMs, empty)
}

interface LogoCandidate {
  selector: string
  src: string
  alt: string
  width: number
  height: number
  /** From drawing the image in the page; null when the image is cross-origin. */
  transparentShare: number | null
  inkLuminance: number | null
}

interface RawRisks {
  logos: LogoCandidate[]
  canvas: { selector: string; width: number; height: number }[]
  canvasTotal: number
  masks: { selector: string; value: string }[]
  maskTotal: number
  blends: { selector: string; value: string }[]
  blendTotal: number
  tiles: { selector: string; value: string }[]
  tileTotal: number
}

/** Lists what Safari's Adaptive Dark Mode leaves alone or may switch off. */
async function scanRisks(page: Page): Promise<RawRisks> {
  return page.evaluate((cap: number) => {
    const h = (window as unknown as { __a11yDm: { sel: (el: Element) => string } }).__a11yDm
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"
    }
    const isSvg = (src: string) => /^data:image\/svg/i.test(src) || /\.svg(?:[?#]|$)/i.test(src)

    const logos: LogoCandidate[] = []
    for (const img of [...document.images]) {
      if (logos.length >= 12) break
      const src = img.currentSrc || img.src || ""
      if (!src || isSvg(src) || !visible(img)) continue
      // Logo-sized images in the header or navigation, or named as a logo. The size cap keeps out
      // photos whose alt text happens to mention a logo.
      const r = img.getBoundingClientRect()
      if (r.width > 400 || r.height > 240) continue
      const named = /logo|brand/i.test(`${img.className} ${img.id} ${src}`) || /\blogo\b/i.test(img.alt)
      if (!img.closest("header, nav, [role=banner]") && !named) continue
      let transparentShare: number | null = null
      let inkLuminance: number | null = null
      try {
        if (img.complete && img.naturalWidth > 0) {
          const scale = Math.min(1, 64 / Math.max(img.naturalWidth, img.naturalHeight))
          const w = Math.max(1, Math.round(img.naturalWidth * scale))
          const hgt = Math.max(1, Math.round(img.naturalHeight * scale))
          const c = document.createElement("canvas")
          c.width = w
          c.height = hgt
          const g = c.getContext("2d")
          if (g) {
            g.drawImage(img, 0, 0, w, hgt)
            const data = g.getImageData(0, 0, w, hgt).data
            let clear = 0
            let ink = 0
            let lum = 0
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] < 250) clear += 1
              if (data[i + 3] > 128) {
                const lin = (v: number) => {
                  const s = v / 255
                  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
                }
                lum += 0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2])
                ink += 1
              }
            }
            transparentShare = clear / (data.length / 4)
            inkLuminance = ink > 0 ? lum / ink : null
          }
        }
      } catch {
        // Cross-origin image without CORS: the canvas is tainted. The server checks the file instead.
      }
      logos.push({
        selector: h.sel(img),
        src: src.startsWith("data:") ? src.slice(0, 40) : src,
        alt: img.alt || "",
        width: Math.round(r.width),
        height: Math.round(r.height),
        transparentShare,
        inkLuminance,
      })
    }

    const canvases = [...document.querySelectorAll("canvas")].filter((c) => {
      const r = c.getBoundingClientRect()
      return r.width >= 50 && r.height >= 50 && visible(c)
    })

    const masks: { selector: string; value: string }[] = []
    const blends: { selector: string; value: string }[] = []
    const tiles: { selector: string; value: string }[] = []
    let maskTotal = 0
    let blendTotal = 0
    let tileTotal = 0
    const all = document.body ? [document.body, ...document.body.querySelectorAll("*")].slice(0, 6000) : []
    for (const el of all) {
      const cs = getComputedStyle(el)
      const style = cs as CSSStyleDeclaration & { webkitMaskImage?: string }
      const mask = style.maskImage && style.maskImage !== "none" ? style.maskImage : style.webkitMaskImage && style.webkitMaskImage !== "none" ? style.webkitMaskImage : ""
      const blend = cs.mixBlendMode && cs.mixBlendMode !== "normal" ? cs.mixBlendMode : ""
      // A layer tiles when it is a bitmap url() that repeats and is not stretched to fit. Only
      // boxes big enough for a pattern count: an icon in a 10 pixel box "repeats" in name only.
      let tiled = false
      if (cs.backgroundImage.includes("url(")) {
        const layers = cs.backgroundImage.split(/,(?![^(]*\))/)
        const repeats = cs.backgroundRepeat.split(",")
        const sizes = cs.backgroundSize.split(",")
        const r = el.getBoundingClientRect()
        const bigEnough = Math.max(r.width, r.height) >= 120 && Math.min(r.width, r.height) >= 24
        tiled =
          bigEnough &&
          layers.some((layer, i) => {
            const repeat = (repeats[i % repeats.length] || "").trim()
            const size = (sizes[i % sizes.length] || "").trim()
            return /url\(/.test(layer) && !/\.svg|image\/svg/i.test(layer) && repeat !== "no-repeat" && !/cover|contain|100%/.test(size)
          })
      }
      if (!mask && !blend && !tiled) continue
      if (!visible(el)) continue
      if (mask) {
        maskTotal += 1
        if (masks.length < cap) masks.push({ selector: h.sel(el), value: mask.slice(0, 80) })
      }
      if (blend) {
        blendTotal += 1
        if (blends.length < cap) blends.push({ selector: h.sel(el), value: blend })
      }
      if (tiled) {
        tileTotal += 1
        const file = (cs.backgroundImage.match(/url\(["']?([^"')]+)/)?.[1] ?? "").split(/[?#]/)[0]
        if (tiles.length < cap) {
          tiles.push({ selector: h.sel(el), value: `${file.startsWith("data:") ? "inline image" : file.split("/").pop() || "image"}, ${cs.backgroundRepeat}` })
        }
      }
    }

    return {
      logos,
      canvas: canvases.slice(0, cap).map((c) => {
        const r = c.getBoundingClientRect()
        return { selector: h.sel(c), width: Math.round(r.width), height: Math.round(r.height) }
      }),
      canvasTotal: canvases.length,
      masks,
      maskTotal,
      blends,
      blendTotal,
      tiles,
      tileTotal,
    }
  }, RISK_CAP)
}

interface FileCheck {
  format: string
  transparent: boolean | null
  inkLuminance: number | null
}

/**
 * For cross-origin logos the page cannot read: fetch the file (public addresses only, no
 * redirects) and read transparency from the header, and the ink colour when it is a plain RGBA PNG.
 */
async function checkImageFile(src: string): Promise<FileCheck | null> {
  let url: URL
  try {
    url = new URL(src)
    await assertPublicUrl(url)
  } catch {
    return null
  }
  try {
    const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(3_000), headers: { Accept: "image/*" } })
    if (!response.ok) return null
    if (Number(response.headers.get("content-length") || 0) > 1_500_000) return null
    const bytes = new Uint8Array(await response.arrayBuffer())
    if (bytes.length > 1_500_000) return null
    const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end))
    if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") {
      const colourType = bytes[25]
      const hasTrns = ascii(0, Math.min(bytes.length, 4096)).includes("tRNS")
      const transparent = colourType === 4 || colourType === 6 || hasTrns
      let inkLuminance: number | null = null
      const decoded = colourType === 6 ? decodePng(bytes) : null
      if (decoded && decoded.channels === 4) {
        let sum = 0
        let count = 0
        const step = Math.max(1, Math.floor((decoded.width * decoded.height) / 20_000))
        for (let i = 0; i < decoded.width * decoded.height; i += step) {
          const o = i * 4
          if (decoded.data[o + 3] > 128) {
            sum += luminance(decoded.data[o], decoded.data[o + 1], decoded.data[o + 2])
            count += 1
          }
        }
        inkLuminance = count > 0 ? sum / count : null
      }
      return { format: "PNG", transparent, inkLuminance }
    }
    if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
      const chunk = ascii(12, 16)
      return { format: "WebP", transparent: chunk === "VP8L" ? null : chunk === "VP8X" ? (bytes[20] & 0x10) !== 0 : false, inkLuminance: null }
    }
    if (ascii(0, 3) === "GIF") return { format: "GIF", transparent: null, inkLuminance: null }
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return { format: "JPEG", transparent: false, inkLuminance: null }
    return null
  } catch {
    return null
  }
}

function luminance(r: number, g: number, b: number): number {
  const lin = (v: number) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function formatFromSrc(src: string): string {
  const inline = src.match(/^data:image\/([a-z]+)/i)?.[1]?.toLowerCase()
  const ext = inline ?? src.split(/[?#]/)[0].split(".").pop()?.toLowerCase() ?? ""
  if (ext === "png") return "PNG"
  if (ext === "webp") return "WebP"
  if (ext === "gif") return "GIF"
  if (ext === "jpg" || ext === "jpeg") return "JPEG"
  if (ext === "avif") return "AVIF"
  return "bitmap"
}

async function logoRisks(logos: LogoCandidate[], budgetMs: number): Promise<Risk[]> {
  const checks = await within(
    Promise.all(logos.slice(0, 6).map((logo) => (logo.transparentShare === null ? checkImageFile(logo.src) : Promise.resolve(null)))),
    budgetMs,
    [] as (FileCheck | null)[],
  )
  return logos.map((logo, i) => {
    const file = checks[i] ?? null
    const format = file?.format ?? formatFromSrc(logo.src)
    const transparent = logo.transparentShare !== null ? logo.transparentShare > 0.05 : (file?.transparent ?? null)
    const ink = logo.inkLuminance ?? file?.inkLuminance ?? null
    const name = logo.alt ? `"${logo.alt.slice(0, 60)}"` : "Image with no alt text"
    let detail = `${name}, ${format}, ${logo.width} by ${logo.height} pixels`
    if (transparent && ink !== null && ink < 0.1) {
      detail += ". Dark artwork on a transparent background: it may disappear on a dark page."
    } else if (transparent) {
      detail += ". Transparent background: check the artwork stays visible on a dark page."
    } else if (transparent === false) {
      detail += ". No transparency: its own background stays, and can show as a box on a dark page."
    } else {
      detail += ". Bitmap logo: check it in dark mode, or replace it with SVG."
    }
    return { kind: "bitmap-logo" as const, selector: logo.selector, detail }
  })
}

/** Runs axe color-contrast and link-in-text-block in the page as it stands, with the canvas fix. */
async function runAxe(page: Page, budgetMs: number): Promise<AxePass | null> {
  const loaded = await within(
    page.evaluate(`typeof window.axe === "object" && typeof window.axe.run === "function"`).then(async (present) => {
      if (!present) await page.evaluate(axe.source)
      return true
    }),
    Math.min(5_000, budgetMs),
    false,
  )
  if (!loaded) return null
  const timedOut: AxePass = { total: 0, contrast: [], incomplete: [], links: [], canvas: "", timedOut: true }
  return within(
    page.evaluate(async (rules: string[], cap: number) => {
      const w = window as unknown as {
        __a11yDm: { text: (el: Element | null) => string; transparent: (c: string) => boolean; canvasColour: () => string }
        axe: {
          run: (context: Document, options: object) => Promise<{
            violations: { id: string; nodes: AxeRawNode[] }[]
            incomplete: { id: string; nodes: AxeRawNode[] }[]
          }>
        }
      }
      interface AxeRawNode {
        target: (string | string[])[]
        html: string
        any: { data?: Record<string, unknown> | null }[]
        all: { data?: Record<string, unknown> | null }[]
        none: { data?: Record<string, unknown> | null }[]
      }
      const html = document.documentElement
      const body = document.body
      // axe-core #4608: with both transparent, axe assumes white, so dark text on a dark canvas passes.
      if (body && w.__a11yDm.transparent(getComputedStyle(html).backgroundColor) && w.__a11yDm.transparent(getComputedStyle(body).backgroundColor)) {
        html.style.setProperty("background-color", "Canvas")
      }
      const result = await w.axe.run(document, {
        runOnly: { type: "rule", values: rules },
        resultTypes: ["violations", "incomplete"],
        iframes: false,
        elementRef: false,
        ancestry: false,
        xpath: false,
      })
      const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 100) / 100 : null)
      const str = (v: unknown) => (typeof v === "string" && v ? v : null)
      const map = (node: AxeRawNode) => {
        const last = node.target[node.target.length - 1]
        const selector = node.target.map((t) => (Array.isArray(t) ? t.join(" >>> ") : t)).join(" ")
        let el: Element | null = null
        try {
          el = typeof last === "string" ? document.querySelector(last) : null
        } catch {
          el = null
        }
        const text = w.__a11yDm.text(el) || node.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 90)
        const data = [...node.any, ...node.all, ...node.none].find((check) => check.data && typeof check.data === "object")?.data ?? {}
        const expected = str(data.expectedContrastRatio)
        return {
          selector: selector.slice(0, 200),
          text,
          fg: str(data.fgColor) ?? str(data.nodeColor),
          bg: str(data.bgColor) ?? str(data.parentColor),
          ratio: num(data.contrastRatio),
          required: expected ? num(parseFloat(expected)) : num(data.requiredContrastRatio),
          reason: str(data.messageKey),
        }
      }
      const pick = (list: { id: string; nodes: AxeRawNode[] }[], id: string) =>
        list.filter((rule) => rule.id === id).flatMap((rule) => rule.nodes.slice(0, cap).map(map))
      return {
        total: result.violations.filter((rule) => rule.id === "color-contrast").reduce((sum, rule) => sum + rule.nodes.length, 0),
        contrast: pick(result.violations, "color-contrast"),
        incomplete: pick(result.incomplete, "color-contrast"),
        links: pick(result.violations, "link-in-text-block"),
        canvas: w.__a11yDm.canvasColour(),
        timedOut: false,
      }
    }, AXE_RULES, AXE_NODE_CAP),
    budgetMs,
    timedOut,
  )
}

/** JPEG of the top of the page at half size, for the side-by-side view. */
async function screenshot(page: Page): Promise<Shot | null> {
  try {
    const viewport = page.viewport() ?? { width: 1280, height: 800 }
    const pageHeight = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)).catch(() => viewport.height)
    const height = Math.max(1, Math.min(pageHeight, SHOT_HEIGHT))
    const base64 = await page.screenshot({
      type: "jpeg",
      quality: 60,
      encoding: "base64",
      clip: { x: 0, y: 0, width: viewport.width, height, scale: SHOT_SCALE },
      captureBeyondViewport: true,
    })
    return { dataUrl: `data:image/jpeg;base64,${base64}`, width: Math.round(viewport.width * SHOT_SCALE), height: Math.round(height * SHOT_SCALE) }
  } catch {
    return null
  }
}

/** Mean relative luminance of the first screen, from a tiny PNG decoded on the server. */
async function meanLuminance(page: Page): Promise<number | null> {
  try {
    const viewport = page.viewport() ?? { width: 1280, height: 800 }
    const bytes = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: viewport.width, height: viewport.height, scale: 0.1 } })
    const png = decodePng(new Uint8Array(bytes))
    if (!png) return null
    let sum = 0
    const total = png.width * png.height
    for (let i = 0; i < total; i += 1) {
      const o = i * png.channels
      sum += luminance(png.data[o], png.data[o + 1], png.data[o + 2])
    }
    return Math.round((sum / total) * 1000) / 1000
  } catch {
    return null
  }
}

/** Marks a sample of visible text elements and returns their colours, so the same nodes can be compared after the switch. */
async function sampleColours(page: Page, mark: boolean): Promise<{ pairs: string[]; background: string; canvas: string } | null> {
  return page
    .evaluate(
      (max: number, fresh: boolean) => {
        const w = window as unknown as { __a11yDm: { effectiveBg: (el: Element) => string; canvasColour: () => string }; __a11yDmSample?: Element[] }
        if (fresh || !w.__a11yDmSample) {
          const els: Element[] = []
          const seen = new Set<Element>()
          if (document.body) {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
            while (walker.nextNode() && els.length < max) {
              const node = walker.currentNode
              if (!node.textContent || !node.textContent.trim()) continue
              const el = node.parentElement
              if (!el || seen.has(el) || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) continue
              seen.add(el)
              const r = el.getBoundingClientRect()
              if (r.width === 0 || r.height === 0 || getComputedStyle(el).visibility === "hidden") continue
              els.push(el)
            }
          }
          w.__a11yDmSample = els
        }
        // The browser's own default colours (Canvas, CanvasText) change with the scheme on a page
        // that declares light dark, without any author styling. Compare them as tokens, so only
        // colours the page itself sets count as a dark theme.
        const probe = document.createElement("div")
        probe.style.cssText = "position:absolute;width:0;height:0;color:CanvasText"
        document.documentElement.append(probe)
        const canvasText = getComputedStyle(probe).color
        probe.remove()
        const canvas = w.__a11yDm.canvasColour()
        const token = (c: string) => (c === canvasText ? "canvastext" : c === canvas ? "canvas" : c)
        return {
          pairs: w.__a11yDmSample.map((el) => (el.isConnected ? `${token(getComputedStyle(el).color)}|${token(w.__a11yDm.effectiveBg(el))}` : "")),
          background: document.body ? token(w.__a11yDm.effectiveBg(document.body)) : "canvas",
          canvas,
        }
      },
      SAMPLE_SIZE,
      mark,
    )
    .catch(() => null)
}

const NO_TRANSITIONS_ID = "__a11y-dm-no-transitions"

async function setTransitions(page: Page, enabled: boolean): Promise<void> {
  await page
    .evaluate(
      (id: string, on: boolean) => {
        document.getElementById(id)?.remove()
        if (on) return
        const style = document.createElement("style")
        style.id = id
        style.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}"
        document.documentElement.append(style)
      },
      NO_TRANSITIONS_ID,
      enabled,
    )
    .catch(() => {})
}

/** Pairs the two renders' failures by selector, then by text, into dark only, light only and both. */
function diffContrast(light: AxeNode[], dark: AxeNode[]): ContrastFinding[] {
  const toItem = (node: AxeNode): ContrastItem => ({ selector: node.selector, text: node.text, fg: node.fg, bg: node.bg, ratio: node.ratio, required: node.required })
  const unmatched = new Map(light.map((node, i) => [i, node]))
  const bySelector = new Map<string, number>()
  light.forEach((node, i) => bySelector.set(node.selector, i))
  const findings: ContrastFinding[] = []
  for (const node of dark) {
    let index = bySelector.get(node.selector)
    if (index === undefined || !unmatched.has(index)) {
      index = undefined
      if (node.text) {
        for (const [i, candidate] of unmatched) {
          if (candidate.text === node.text) {
            index = i
            break
          }
        }
      }
    }
    if (index !== undefined && unmatched.has(index)) {
      const match = unmatched.get(index)!
      unmatched.delete(index)
      findings.push({ where: "both", selector: node.selector, text: node.text || match.text, light: toItem(match), dark: toItem(node), hint: null })
    } else {
      findings.push({ where: "dark-only", selector: node.selector, text: node.text, light: null, dark: toItem(node), hint: null })
    }
  }
  for (const node of unmatched.values()) {
    findings.push({ where: "light-only", selector: node.selector, text: node.text, light: toItem(node), dark: null, hint: null })
  }
  return findings
}

function mergeWhere<T extends { selector: string }>(light: T[], dark: T[], key: (item: T) => string = (item) => item.selector): (T & { where: Where })[] {
  const darkKeys = new Set(dark.map(key))
  const lightKeys = new Set(light.map(key))
  return [
    ...dark.map((item) => ({ ...item, where: (lightKeys.has(key(item)) ? "both" : "dark") as Where })),
    ...light.filter((item) => !darkKeys.has(key(item))).map((item) => ({ ...item, where: "light" as Where })),
  ]
}

function adaptiveVerdict(declaration: Declaration, darkLuminance: number | null): Omit<AdaptiveDarkMode, "preview"> {
  const base = baseVerdict(declaration, darkLuminance)
  if (!declaration.metaOverridden) return base
  return {
    ...base,
    reason: `${base.reason} Note that the color-scheme meta tag says "${declaration.meta}" but CSS on the root element says "${declaration.rootColorScheme}". Browsers apply the CSS value, and Chromium adapts the page on that basis; WebKit has not said which one Safari's check reads.`,
  }
}

function baseVerdict(declaration: Declaration, darkLuminance: number | null): Omit<AdaptiveDarkMode, "preview"> {
  const where = declaration.source === "meta" ? "the color-scheme meta tag" : declaration.source === "body" ? "CSS on body" : "CSS on the root element"
  switch (declaration.supports) {
    case "light-dark":
      return {
        verdict: "skipped-declares-light-dark",
        reason: `The page declares light dark in ${where}, so Safari's Adaptive Dark Mode leaves it alone. What dark mode visitors see is your own dark styling, which the contrast results below test.`,
        darkRenderLuminance: darkLuminance,
      }
    case "dark":
      return {
        verdict: "skipped-declares-dark",
        reason: `The page declares a dark colour scheme only, in ${where}. The WebKit announcement does not cover this case; Chromium's automatic dark theme leaves such pages alone, and a page that is already dark is not adapted.`,
        darkRenderLuminance: darkLuminance,
      }
    case "light-only":
      return {
        verdict: "opted-out-light-only",
        reason: `The page opts out with light only, in ${where}. Safari will leave it light, but WebKit notes that the only keyword is not supported in Safari 27.3 beta 1, so that beta still adapts the page.`,
        darkRenderLuminance: darkLuminance,
      }
    default: {
      const declared = declaration.supports === "light" ? "The page declares light without only, which does not opt out" : "The page does not declare a colour scheme"
      if (darkLuminance !== null && darkLuminance < DARK_PAGE_LUMINANCE) {
        return {
          verdict: "already-dark",
          reason: `${declared}, but with dark mode on it already renders mostly dark. Safari says it changes nothing on a page with a dark background and light text. Its test is not documented, so declare color-scheme: light dark to be certain.`,
          darkRenderLuminance: darkLuminance,
        }
      }
      return {
        verdict: "will-adapt",
        reason: `${declared}${darkLuminance === null ? "" : ", and it renders mostly light with dark mode on"}. When a visitor has turned on Adaptive Dark Mode, Safari will darken it with its own colour algorithm.`,
        darkRenderLuminance: darkLuminance,
      }
    }
  }
}

function contrastHint(finding: ContrastFinding): string | null {
  const { dark, light } = finding
  if (!dark || dark.ratio === null) return null
  if (dark.ratio < 1.5) return "Almost invisible in dark mode: usually a colour hard-coded for light mode meeting a dark default background, or the reverse."
  if (light && light.fg === dark.fg && light.bg !== dark.bg) return "The text colour is the same in both modes while the background changed: give the text a dark-mode value."
  if (light && light.bg === dark.bg && light.fg !== dark.fg) return "The background is the same in both modes while the text changed: give the background a dark-mode value."
  return null
}

export interface RunOptions {
  /** Absolute time (ms) by which the work must be finished, browser close excluded. */
  deadline: number
}

export async function runDarkModeCheck(rendered: RenderedPage, { deadline }: RunOptions): Promise<Omit<DarkModeResult, "url" | "durationMs">> {
  const { page } = rendered
  const left = () => deadline - Date.now()
  const notes: string[] = []

  // Light render. A slow page leaves no time for a second load, so the dark render then uses the
  // live switch alone, which re-evaluates the CSS but not scripts that read the preference once.
  const canReload = left() > 30_000
  await ensureHelpers(page)
  const declaration = await readDeclaration(page)
  const sheets = left() > 25_000 ? await scanStylesheets(rendered, 3_000) : { darkMediaRules: 0, usesLightDarkFunction: false, read: 0 }
  const rawRisks = await within(scanRisks(page), 3_000, null)
  const logoRiskList = rawRisks ? await logoRisks(rawRisks.logos, left() > 25_000 ? 3_000 : 0) : []
  const light: SchemeRun = { axe: await runAxe(page, Math.min(12_000, left() - 14_000)), screenshot: null, luminance: null }
  if (!light.axe || light.axe.timedOut) notes.push("The contrast check in light mode did not finish in time, so light-mode results are incomplete.")
  light.screenshot = await screenshot(page)

  // Live switch to dark: same elements, so their colours can be compared directly.
  await setTransitions(page, false)
  const lightSample = await sampleColours(page, true)
  await page.emulateMediaFeatures(mediaFeatures({ reducedMotion: true, colorScheme: "dark" }))
  await sleep(250)
  const darkSample = await sampleColours(page, false)
  await setTransitions(page, true)

  // Reload in dark, so theme scripts that read the preference only at load run again.
  let darkReady = true
  if (canReload && left() > 22_000) {
    try {
      await page.reload({ waitUntil: "load", timeout: Math.min(15_000, left() - 14_000) })
    } catch {
      // Endless trackers: carry on if the DOM is there.
    }
    const state = await page.evaluate(() => ({ href: location.href, ready: document.readyState })).catch(() => null)
    if (state && !state.href.startsWith("chrome-error:") && (state.ready === "interactive" || state.ready === "complete")) {
      await page.waitForNetworkIdle({ idleTime: 500, timeout: Math.max(500, Math.min(4_000, left() - 12_000)) }).catch(() => {})
      await sleep(600)
      const wall = await detectBotWall(page)
      if (wall) {
        darkReady = false
        notes.push(`On the second load the site showed a bot check (${wall}), so the dark-mode contrast results are missing.`)
      }
    } else {
      darkReady = false
      notes.push("The page did not load a second time in dark mode, so the dark-mode contrast results are missing.")
    }
  } else {
    notes.push("The page loaded slowly, so dark mode was tested by switching the preference without reloading. Scripts that pick a theme only when the page loads may not have run.")
  }

  let dark: SchemeRun | null = null
  if (darkReady) {
    await ensureHelpers(page)
    dark = { axe: await runAxe(page, Math.min(12_000, left() - 3_000)), screenshot: await screenshot(page), luminance: await meanLuminance(page) }
    if (!dark.axe || dark.axe.timedOut) notes.push("The contrast check in dark mode did not finish in time, so dark-mode results are incomplete.")
  }

  // Own dark theme: did anything change between the two schemes?
  let changed = 0
  let compared = 0
  if (lightSample && darkSample) {
    lightSample.pairs.forEach((pair, i) => {
      const other = darkSample.pairs[i]
      if (!pair || !other) return
      compared += 1
      if (pair !== other) changed += 1
    })
  }
  const backgroundChanged = !!lightSample && !!darkSample && lightSample.background !== darkSample.background
  const changedShare = compared > 0 ? Math.round((changed / compared) * 100) / 100 : 0
  const darkTheme: DarkTheme = {
    respondsToPreference: changed > 0 || backgroundChanged,
    changedShare,
    sampled: compared,
    backgroundChanged,
    darkMediaRules: sheets.darkMediaRules,
    usesLightDarkFunction: sheets.usesLightDarkFunction,
    stylesheetsRead: sheets.read,
    lightBackground: lightSample ? (lightSample.background === "canvas" ? lightSample.canvas : lightSample.background) : "",
    darkBackground: darkSample ? (darkSample.background === "canvas" ? darkSample.canvas : darkSample.background) : "",
  }

  // Safari Adaptive Dark Mode, and Chromium's automatic dark theme as the preview.
  const verdict = adaptiveVerdict(declaration, dark?.luminance ?? null)
  let preview: Shot | null = null
  if (verdict.verdict === "will-adapt" && darkReady && left() > 2_500) {
    try {
      const cdp = await rendered.cdp()
      await cdp.send("Emulation.setAutoDarkModeOverride", { enabled: true })
      await sleep(400)
      preview = await screenshot(page)
      await cdp.send("Emulation.setAutoDarkModeOverride", {}).catch(() => {})
    } catch {
      preview = null
    }
  }

  // Findings.
  const lightAxe = light.axe ?? { total: 0, contrast: [], incomplete: [], links: [], canvas: "", timedOut: true }
  const darkAxe = dark?.axe ?? { total: 0, contrast: [], incomplete: [], links: [], canvas: "", timedOut: true }
  if (lightAxe.total > lightAxe.contrast.length || darkAxe.total > darkAxe.contrast.length) {
    notes.push(`axe-core found ${Math.max(lightAxe.total, darkAxe.total)} contrast failures in one mode. The comparison and counts cover the first ${AXE_NODE_CAP} in each mode.`)
  }
  const contrastAll = diffContrast(lightAxe.contrast, darkAxe.contrast).map((finding) => ({ ...finding, hint: contrastHint(finding) }))
  const order = { "dark-only": 0, both: 1, "light-only": 2 }
  const worst = (f: ContrastFinding) => Math.min(f.dark?.ratio ?? 99, f.light?.ratio ?? 99)
  contrastAll.sort((a, b) => order[a.where] - order[b.where] || worst(a) - worst(b))
  const counts = {
    darkOnly: contrastAll.filter((f) => f.where === "dark-only").length,
    lightOnly: contrastAll.filter((f) => f.where === "light-only").length,
    both: contrastAll.filter((f) => f.where === "both").length,
    invisible: 0,
    links: 0,
    review: 0,
  }
  const capped = (["dark-only", "both", "light-only"] as const).flatMap((where) => contrastAll.filter((f) => f.where === where).slice(0, LIST_CAP))

  const strip = (n: AxeNode): ContrastItem => ({ selector: n.selector, text: n.text, fg: n.fg, bg: n.bg, ratio: n.ratio, required: n.required })
  const invisibleAll: InvisibleItem[] = mergeWhere(
    lightAxe.incomplete.filter((n) => n.reason === "equalRatio").map(strip),
    darkAxe.incomplete.filter((n) => n.reason === "equalRatio").map(strip),
  )
  const reviewOf = (nodes: AxeNode[]) =>
    nodes.filter((n) => n.reason && n.reason !== "equalRatio").map((n) => ({ selector: n.selector, text: n.text, reason: n.reason as string }))
  const reviewAll: ReviewItem[] = mergeWhere(reviewOf(lightAxe.incomplete), reviewOf(darkAxe.incomplete), (item) => `${item.selector}|${item.reason}`)
  const linksAll: LinkItem[] = mergeWhere(
    lightAxe.links.map((n) => ({ selector: n.selector, text: n.text, ratio: n.ratio })),
    darkAxe.links.map((n) => ({ selector: n.selector, text: n.text, ratio: n.ratio })),
  )
  counts.invisible = invisibleAll.length
  counts.links = linksAll.length
  counts.review = reviewAll.length

  const groups: RiskGroup[] = []
  const group = (kind: RiskKind, total: number, items: Risk[]) => {
    if (total > 0) groups.push({ kind, total, items: items.slice(0, RISK_CAP) })
  }
  if (rawRisks) {
    group("bitmap-logo", logoRiskList.length, logoRiskList)
    group("canvas", rawRisks.canvasTotal, rawRisks.canvas.map((c) => ({ kind: "canvas", selector: c.selector, detail: `${c.width} by ${c.height} pixels` })))
    group("mask", rawRisks.maskTotal, rawRisks.masks.map((m) => ({ kind: "mask", selector: m.selector, detail: m.value })))
    group("blend-mode", rawRisks.blendTotal, rawRisks.blends.map((m) => ({ kind: "blend-mode", selector: m.selector, detail: `mix-blend-mode: ${m.value}` })))
    group("tiled-background", rawRisks.tileTotal, rawRisks.tiles.map((m) => ({ kind: "tiled-background", selector: m.selector, detail: m.value })))
  } else {
    notes.push("The scan for images, canvases and effects at risk did not finish in time.")
  }

  const summary = (run: SchemeRun, scheme: Scheme) => {
    const axe = run.axe
    const failures = scheme === "light" ? counts.lightOnly + counts.both : counts.darkOnly + counts.both
    const tally = <T extends { where: Where }>(list: T[]) => list.filter((item) => item.where === scheme || item.where === "both").length
    return {
      failures,
      invisible: tally(invisibleAll),
      links: tally(linksAll),
      review: tally(reviewAll),
      canvas: axe?.canvas ?? "",
      screenshot: run.screenshot,
    }
  }

  const truncated =
    capped.length < contrastAll.length || invisibleAll.length > SMALL_CAP || reviewAll.length > SMALL_CAP || linksAll.length > SMALL_CAP

  return {
    finalUrl: rendered.finalUrl,
    title: rendered.title,
    declaration,
    darkTheme,
    light: summary(light, "light"),
    dark: dark ? summary(dark, "dark") : null,
    counts,
    contrast: capped,
    invisible: invisibleAll.slice(0, SMALL_CAP),
    links: linksAll.slice(0, SMALL_CAP),
    review: reviewAll.slice(0, SMALL_CAP),
    adaptive: { ...verdict, preview },
    risks: groups,
    truncated,
    notes,
  }
}
