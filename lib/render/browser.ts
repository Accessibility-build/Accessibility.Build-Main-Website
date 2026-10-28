import "server-only"
import { existsSync } from "node:fs"
import type { Browser, CDPSession, HTTPRequest, Page } from "puppeteer-core"
import { PublicUrlError, assertPublicUrl, createHostGuard } from "@/lib/public-url"

/**
 * One headless Chromium for the tools that look at a visitor's page as it renders: the vision
 * simulator, screen reader preview, alt text checker and focus order checker.
 *
 * On Vercel it uses @sparticuz/chromium-min; anywhere else (including a local `next start`) it uses
 * the full puppeteer package and its bundled Chrome, the same split as the overlay detector.
 *
 * Every request the page makes, including redirects and subresources, goes through a DNS-resolving
 * host check, so a public page cannot reach a private address through the browser. Service workers
 * are bypassed so they cannot make requests outside that check.
 */

const CHROMIUM_REMOTE_URL = "https://github.com/Sparticuz/chromium/releases/download/v143.0.0/chromium-v143.0.0-pack.x64.tar"

const BASE_ARGS = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--force-color-profile=srgb", "--hide-scrollbars"]

export async function launchBrowser(): Promise<Browser> {
  if (process.env.NODE_ENV === "production" && process.env.VERCEL === "1") {
    const chromiumModule = await import("@sparticuz/chromium-min")
    const chromium = (chromiumModule.default ?? chromiumModule) as typeof import("@sparticuz/chromium-min").default
    const puppeteer = await import("puppeteer-core")
    return puppeteer.default.launch({
      args: [...chromium.args, ...BASE_ARGS],
      executablePath: await chromium.executablePath(CHROMIUM_REMOTE_URL),
      headless: true,
      timeout: 30_000,
    })
  }
  const puppeteer = await import("puppeteer")
  return puppeteer.default.launch({ headless: true, args: BASE_ARGS, timeout: 30_000, executablePath: localChromePath() }) as unknown as Promise<Browser>
}

/** Puppeteer's own Chrome download is often missing on a dev machine; an installed Chrome works as well. */
function localChromePath(): string | undefined {
  const configured = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH
  if (configured) return configured
  if (process.platform !== "darwin") return undefined
  const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  return existsSync(macChrome) ? macChrome : undefined
}

export interface RenderOptions {
  /** isMobile and hasTouch emulate a phone: the meta viewport applies and touch media queries match. */
  viewport?: { width: number; height: number; deviceScaleFactor?: number; isMobile?: boolean; hasTouch?: boolean }
  /** Overrides the user agent, for sites that pick a mobile layout from it. */
  userAgent?: string
  /** Abort images, video and audio. Faster, for tools that only read the DOM or tree. */
  blockMedia?: boolean
  /** Extra wait after the load event and network idle, for late scripts. Default 800 ms. */
  settleMs?: number
  /** Emulate prefers-reduced-motion: reduce. Stops most carousels and transitions. */
  reducedMotion?: boolean
  /** Total navigation budget. Default 25 s, leaving the rest of a 60 s function for the work. */
  navigationTimeoutMs?: number
}

export interface RenderedPage {
  page: Page
  /** Lazily created CDP session for Accessibility.*, Emulation.* and similar domains. */
  cdp: () => Promise<CDPSession>
  finalUrl: string
  title: string
  status: number | null
}

const MEDIA_TYPES = new Set(["image", "media", "font"])
const RETRY_STATUSES = new Set([404, 429, 500, 502, 503, 504])

/**
 * Renders a public URL and hands the loaded page to `work`. The browser is always closed afterwards.
 * Throws PublicUrlError with a message fit to show the visitor when the page cannot be checked.
 */
export async function withRenderedPage<T>(url: URL, options: RenderOptions, work: (rendered: RenderedPage) => Promise<T>): Promise<T> {
  await assertPublicUrl(url)
  const guard = createHostGuard()
  const browser = await launchBrowser().catch((error) => {
    console.error("Headless browser failed to launch:", error)
    throw new PublicUrlError("Our page renderer is unavailable right now. Please try again in a minute.", 503)
  })

  try {
    const page = await browser.newPage()
    const { width = 1280, height = 800, deviceScaleFactor = 1, isMobile = false, hasTouch = false } = options.viewport ?? {}
    await page.setViewport({ width, height, deviceScaleFactor, isMobile, hasTouch })
    if (options.userAgent) await page.setUserAgent(options.userAgent)
    await page.setBypassServiceWorker(true)
    // esbuild-based runners (tsx, used to test these tools outside Next) wrap functions passed to
    // page.evaluate in __name(); without this no-op they throw inside the page.
    await page.evaluateOnNewDocument("globalThis.__name = globalThis.__name || ((fn) => fn)")
    if (options.reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    page.setDefaultTimeout(15_000)

    await page.setRequestInterception(true)
    page.on("request", (request: HTTPRequest) => {
      if (request.isInterceptResolutionHandled()) return
      const abort = () => request.abort("blockedbyclient").catch(() => {})
      let target: URL
      try {
        target = new URL(request.url())
      } catch {
        return void abort()
      }
      if (target.protocol === "data:" || target.protocol === "blob:") return void request.continue().catch(() => {})
      if (target.protocol !== "http:" && target.protocol !== "https:") return void abort()
      if (options.blockMedia && MEDIA_TYPES.has(request.resourceType())) return void abort()
      guard(target.hostname).then(
        (ok) => (ok ? request.continue().catch(() => {}) : abort()),
        () => abort(),
      )
    })

    let response
    let navigationError = ""
    const navigationStarted = Date.now()
    try {
      response = await page.goto(url.toString(), { waitUntil: "load", timeout: options.navigationTimeoutMs ?? 25_000 })
    } catch (error) {
      navigationError = error instanceof Error ? error.message : String(error)
    }
    // A failed navigation leaves Chrome on its own error page, which reports itself as loaded. The
    // frame's URL switches to chrome-error:// a moment after goto settles, so this runs again below.
    const assertNotErrorPage = async () => {
      const href = await page.evaluate(() => location.href).catch(() => page.url())
      if (!href.startsWith("chrome-error:") && !page.url().startsWith("chrome-error:")) return
      const code =
        navigationError.match(/net::(ERR_[A-Z0-9_]+)/)?.[1] ??
        (await page.$eval(".error-code", (el) => el.textContent ?? "").catch(() => ""))
      throw navigationFailure(url, code)
    }
    await assertNotErrorPage()
    if (navigationError) {
      // A page that never fires load (endless trackers) can still be usable once the DOM is there.
      const ready = await page.evaluate(() => document.readyState).catch(() => null)
      if (ready !== "interactive" && ready !== "complete") {
        throw navigationFailure(url, navigationError.match(/net::(ERR_[A-Z0-9_]+)/)?.[1] ?? "TIMEOUT")
      }
    }

    // Bot protection sometimes answers a headless browser with a brief 404, 429 or 5xx that a
    // second request a moment later does not get. One quick retry, only when the first answer was
    // fast enough to leave time for the tool's own work.
    if (response && RETRY_STATUSES.has(response.status()) && Date.now() - navigationStarted < 10_000) {
      await new Promise((resolve) => setTimeout(resolve, 1_500))
      response = (await page.goto(url.toString(), { waitUntil: "load", timeout: 15_000 }).catch(() => null)) ?? response
      await assertNotErrorPage()
    }

    const status = response?.status() ?? null
    if (status !== null && status >= 400) {
      throw new PublicUrlError(
        status === 403 || status === 429
          ? `The site refused our automated browser (HTTP ${status}). Some sites block automated checks.`
          : status === 404 || status === 410
            ? `The site answered HTTP ${status} (not found). If the page opens for you, the site may be turning away automated browsers; try again in a minute.`
            : `The site returned an error (HTTP ${status}). Try again in a minute.`,
        502,
      )
    }

    await page.waitForNetworkIdle({ idleTime: 500, timeout: 5_000 }).catch(() => {})
    await new Promise((resolve) => setTimeout(resolve, options.settleMs ?? 800))
    await assertNotErrorPage()

    const wall = await detectBotWall(page)
    if (wall) {
      throw new PublicUrlError(
        `The site showed our automated browser a bot check (${wall}) instead of the page, so the results would describe the check, not your page.`,
        502,
      )
    }

    let session: CDPSession | null = null
    return await work({
      page,
      cdp: async () => (session ??= await page.createCDPSession()),
      finalUrl: page.url(),
      title: (await page.title().catch(() => "")) || "",
      status,
    })
  } finally {
    await browser.close().catch(() => {})
  }
}

/** A sentence for the visitor from Chrome's net error code (ERR_NAME_NOT_RESOLVED and so on). */
function navigationFailure(url: URL, code: string): PublicUrlError {
  const host = url.hostname
  if (/NAME_NOT_RESOLVED|NAME_RESOLUTION/.test(code)) return new PublicUrlError(`We couldn't find ${host}. Check the address.`)
  if (/BLOCKED_BY_CLIENT/.test(code)) return new PublicUrlError("That page sends the browser to a private or local address, so it can't be checked.")
  if (/CERT|SSL/.test(code)) return new PublicUrlError(`The HTTPS certificate for ${host} isn't valid, so the page couldn't be loaded.`, 502)
  if (/CONNECTION_REFUSED|CONNECTION_RESET|CONNECTION_CLOSED|EMPTY_RESPONSE|HTTP2_PROTOCOL|ABORTED/.test(code)) {
    return new PublicUrlError(`${host} closed the connection to our automated browser (${code}). Some sites refuse automated checks.`, 502)
  }
  if (/TIMED_OUT|TIMEOUT/.test(code)) return new PublicUrlError(`${host} didn't finish loading in time. Try again, or try a lighter page.`, 504)
  return new PublicUrlError(`${host} couldn't be loaded${code ? ` (${code})` : ""}. Check the address and try again.`, 502)
}

/**
 * Bot-check interstitials often return 200, and a scan of one reads as a clean page. The title and
 * a thin body give them away.
 */
async function detectBotWall(page: Page): Promise<string | null> {
  return page
    .evaluate(() => {
      const title = (document.title || "").toLowerCase()
      const text = (document.body?.innerText || "").slice(0, 3000).toLowerCase()
      const links = document.querySelectorAll("a[href]").length
      if (/just a moment|attention required|access denied|pardon our interruption|are you a robot|security check/.test(title)) return document.title
      if (links < 5 && /verify you are (a )?human|checking your browser|enable javascript and cookies to continue|captcha|press (and|&) hold|try deleting your cookies/.test(text)) {
        return "a human verification page"
      }
      // A challenge that renders nothing at all: no links, no headings, almost no text.
      if (links < 2 && !document.querySelector("h1, h2, main, [role=main]") && text.trim().length < 60) return "an empty page"
      return null
    })
    .catch(() => null)
}

/**
 * Scrolls the page in steps so lazy-loaded content renders, then returns to the top. A consent
 * dialog that locks scrolling (overflow hidden on html or body) would stop lazy images loading,
 * so with `unlock` the lock is lifted while scrolling and put back afterwards.
 */
export async function scrollThrough(page: Page, maxHeight = 6000, { unlock = false } = {}): Promise<void> {
  await page
    .evaluate(
      async (limit: number, lift: boolean) => {
        const roots = [document.documentElement, document.body].filter(Boolean)
        const saved = roots.map((el) => el.style.getPropertyValue("overflow"))
        if (lift) roots.forEach((el) => el.style.setProperty("overflow", "visible", "important"))
        const step = Math.max(400, Math.floor(window.innerHeight * 0.9))
        const end = Math.min(document.documentElement.scrollHeight, limit)
        for (let y = 0; y < end; y += step) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 120))
        }
        window.scrollTo(0, 0)
        if (lift) roots.forEach((el, i) => (saved[i] ? el.style.setProperty("overflow", saved[i]) : el.style.removeProperty("overflow")))
      },
      maxHeight,
      unlock,
    )
    .catch(() => {})
  await page.waitForNetworkIdle({ idleTime: 400, timeout: 3_000 }).catch(() => {})
}

export interface Screenshot {
  /** data:image/jpeg;base64,... */
  dataUrl: string
  width: number
  height: number
  /** True when the page was taller than maxHeight and the capture stops there. */
  truncated: boolean
}

/** JPEG of the page from the top, up to maxHeight CSS pixels tall. Keeps the JSON response well under Vercel's 4.5 MB cap. */
export async function captureScreenshot(page: Page, { fullPage = true, maxHeight = 5000, quality = 60 } = {}): Promise<Screenshot> {
  const viewport = page.viewport() ?? { width: 1280, height: 800 }
  const pageHeight = fullPage
    ? await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)).catch(() => viewport.height)
    : viewport.height
  const height = Math.max(1, Math.min(pageHeight, maxHeight))
  const base64 = await page.screenshot({
    type: "jpeg",
    quality,
    encoding: "base64",
    clip: { x: 0, y: 0, width: viewport.width, height },
    captureBeyondViewport: fullPage,
  })
  return { dataUrl: `data:image/jpeg;base64,${base64}`, width: viewport.width, height, truncated: pageHeight > maxHeight }
}
