import { NextRequest, NextResponse } from "next/server"
import { AxePuppeteer } from "@axe-core/puppeteer"

export const runtime = "nodejs"
export const maxDuration = 60

// Known overlay vendors and their detection signatures
const OVERLAY_VENDORS: Record<string, {
  name: string
  scriptPatterns: string[]
  domPatterns: string[]
  globalVars: string[]
  website: string
}> = {
  accessibe: {
    name: "accessiBe",
    scriptPatterns: ["accessibe.com", "acsbapp.com", "acsbap.com", "acsb.js"],
    domPatterns: ["acsb-trigger", "acsb-widget", "accessibe"],
    globalVars: ["acsbJS", "AccessiBe", "acsb"],
    website: "accessibe.com",
  },
  userway: {
    name: "UserWay",
    scriptPatterns: ["userway.org", "cdn.userway.org"],
    domPatterns: ["userway", "userwayAccessibilityWidget"],
    globalVars: ["UserWay", "userway"],
    website: "userway.org",
  },
  audioeye: {
    name: "AudioEye",
    scriptPatterns: ["audioeye.com", "ws.audioeye.com", "audioeye-client"],
    domPatterns: ["audioeye", "ae-compliance"],
    globalVars: ["AudioEye", "ae_compliance"],
    website: "audioeye.com",
  },
  equalweb: {
    name: "EqualWeb",
    scriptPatterns: ["equalweb.com", "nagich.com", "nagich.co.il"],
    domPatterns: ["equalweb", "nagich", "INDmenu"],
    globalVars: ["__equalweb", "nagich"],
    website: "equalweb.com",
  },
  maxaccess: {
    name: "MaxAccess",
    scriptPatterns: ["maxaccess.io"],
    domPatterns: ["maxaccess"],
    globalVars: ["MaxAccess"],
    website: "maxaccess.io",
  },
  truabilities: {
    name: "TruAbilities",
    scriptPatterns: ["truabilities.com"],
    domPatterns: ["truabilities"],
    globalVars: ["TruAbilities"],
    website: "truabilities.com",
  },
  faciliti: {
    name: "Facil'iti",
    scriptPatterns: ["facil-iti.com", "faciliti.com"],
    domPatterns: ["facil-iti", "faciliti"],
    globalVars: ["faciliti"],
    website: "facil-iti.com",
  },
  reciteme: {
    name: "Recite Me",
    scriptPatterns: ["reciteme.com", "api.reciteme.com"],
    domPatterns: ["recite-me", "reciteme"],
    globalVars: ["reciteMe", "ReciteMe"],
    website: "reciteme.com",
  },
  user1st: {
    name: "User1st",
    scriptPatterns: ["user1st.info"],
    domPatterns: ["user1st"],
    globalVars: ["User1st"],
    website: "user1st.info",
  },
  adacompliance: {
    name: "ADA Compliance",
    scriptPatterns: ["adacompliance.org", "adacomplianceforwebsites.com"],
    domPatterns: ["adacomplia"],
    globalVars: ["adaCompliance"],
    website: "adacompliance.org",
  },
}

// SSRF protection - block private/internal IPs
function isPrivateUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr)
    const hostname = url.hostname.toLowerCase()
    const blocked = [
      "localhost", "127.", "0.0.0.0", "10.", "192.168.", "169.254.",
      "::1", "fc00:", "fe80:", "[::1]",
    ]
    if (blocked.some((b) => hostname.startsWith(b))) return true
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return true
    if (!["http:", "https:"].includes(url.protocol)) return true
    return false
  } catch {
    return true
  }
}

// Dynamically import chromium for serverless
let chromiumModule: any = null

async function loadChromium() {
  if (chromiumModule) return chromiumModule
  try {
    const mod = await import("@sparticuz/chromium")
    chromiumModule = mod.default || mod
    return chromiumModule
  } catch {
    return null
  }
}

async function getBrowserConfig() {
  const isProduction = process.env.NODE_ENV === "production"
  const isVercel = process.env.VERCEL === "1"

  if (isProduction && isVercel) {
    const chromium = await loadChromium()
    if (chromium) {
      return {
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-web-security",
          "--memory-pressure-off",
          "--max_old_space_size=512",
          "--force-color-profile=srgb",
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        timeout: 30000,
      }
    }
  }

  return {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--memory-pressure-off",
      "--force-color-profile=srgb",
    ],
    timeout: 30000,
  }
}

export async function POST(request: NextRequest) {
  let browser = null

  try {
    const body = await request.json()
    let { url } = body as { url: string }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid URL" },
        { status: 400 }
      )
    }

    // Normalize URL
    url = url.trim()
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
    }

    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      )
    }

    if (isPrivateUrl(url)) {
      return NextResponse.json(
        { error: "URLs pointing to private or internal networks are not allowed" },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    // Launch browser — use puppeteer-core on Vercel, full puppeteer locally
    const isVercel = process.env.VERCEL === "1"
    const config = await getBrowserConfig()
    let puppeteerModule: any
    if (isVercel) {
      puppeteerModule = await import("puppeteer-core")
    } else {
      puppeteerModule = await import("puppeteer")
    }
    browser = await puppeteerModule.default.launch(config)
    const page = await browser.newPage()

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    await page.setViewport({ width: 1280, height: 800 })

    // Navigate to URL
    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      })
    } catch (navErr: any) {
      if (navErr.message?.includes("net::ERR_")) {
        return NextResponse.json(
          { error: `Could not load the URL. The site may be down or blocking automated access.` },
          { status: 422 }
        )
      }
      throw navErr
    }

    // Wait a bit for overlay widgets to inject themselves
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Detect overlays via page.evaluate
    const detectionResults = await page.evaluate((vendors) => {
      const detected: Array<{
        vendorKey: string
        scriptUrl: string | null
        widgetFound: boolean
        domPatterns: string[]
        globalVarsFound: string[]
      }> = []

      // 1. Check all script sources
      const scripts = Array.from(document.querySelectorAll("script[src]"))
      const scriptSrcs = scripts.map((s) => (s as HTMLScriptElement).src.toLowerCase())

      // 2. Check inline scripts
      const inlineScripts = Array.from(document.querySelectorAll("script:not([src])"))
      const inlineContent = inlineScripts.map((s) => s.textContent?.toLowerCase() || "").join(" ")

      for (const [vendorKey, vendor] of Object.entries(vendors)) {
        let matchedScriptUrl: string | null = null
        let widgetFound = false
        const matchedDomPatterns: string[] = []
        const matchedGlobalVars: string[] = []

        // Check script sources
        for (const src of scriptSrcs) {
          for (const pattern of vendor.scriptPatterns) {
            if (src.includes(pattern.toLowerCase())) {
              matchedScriptUrl = scripts.find(
                (s) => (s as HTMLScriptElement).src.toLowerCase().includes(pattern.toLowerCase())
              )?.getAttribute("src") || src
              break
            }
          }
          if (matchedScriptUrl) break
        }

        // Check inline scripts for vendor references
        if (!matchedScriptUrl) {
          for (const pattern of vendor.scriptPatterns) {
            if (inlineContent.includes(pattern.toLowerCase())) {
              matchedScriptUrl = `inline (contains "${pattern}")`
              break
            }
          }
        }

        // Check DOM patterns (IDs, classes, data attributes)
        for (const pattern of vendor.domPatterns) {
          const lowerPattern = pattern.toLowerCase()
          const byId = document.getElementById(pattern)
          const byClass = document.querySelector(`.${pattern}`)
          const byDataAttr = document.querySelector(`[data-${lowerPattern}]`)
          const byIdContains = document.querySelector(`[id*="${lowerPattern}"]`)
          const byClassContains = document.querySelector(`[class*="${lowerPattern}"]`)

          if (byId || byClass || byDataAttr || byIdContains || byClassContains) {
            matchedDomPatterns.push(pattern)
            widgetFound = true
          }
        }

        // Check for fixed-position widget elements (common overlay pattern)
        if (!widgetFound) {
          const fixedElements = document.querySelectorAll("*")
          for (const el of fixedElements) {
            const style = window.getComputedStyle(el)
            const zIndex = parseInt(style.zIndex) || 0
            if (
              (style.position === "fixed" || style.position === "absolute") &&
              zIndex > 999999
            ) {
              const elHtml = el.outerHTML.toLowerCase()
              for (const pattern of vendor.domPatterns) {
                if (elHtml.includes(pattern.toLowerCase())) {
                  matchedDomPatterns.push(`high-z-index widget (${pattern})`)
                  widgetFound = true
                  break
                }
              }
            }
            if (widgetFound) break
          }
        }

        // Check global variables
        for (const varName of vendor.globalVars) {
          try {
            if ((window as any)[varName] !== undefined) {
              matchedGlobalVars.push(varName)
            }
          } catch {
            // Ignore access errors
          }
        }

        // If any signal was found, add to detected
        if (matchedScriptUrl || matchedDomPatterns.length > 0 || matchedGlobalVars.length > 0) {
          detected.push({
            vendorKey,
            scriptUrl: matchedScriptUrl,
            widgetFound,
            domPatterns: matchedDomPatterns,
            globalVarsFound: matchedGlobalVars,
          })
        }
      }

      return detected
    }, OVERLAY_VENDORS)

    // Map detection results to response format
    const overlays = detectionResults.map((d) => ({
      vendor: OVERLAY_VENDORS[d.vendorKey]?.name || d.vendorKey,
      vendorWebsite: OVERLAY_VENDORS[d.vendorKey]?.website || "",
      scriptUrl: d.scriptUrl,
      widgetFound: d.widgetFound,
      domPatterns: d.domPatterns,
      globalVarsFound: d.globalVarsFound,
    }))

    // Run axe-core accessibility scan
    let violations = { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 }
    let topViolations: Array<{
      id: string
      impact: string
      description: string
      help: string
      helpUrl: string
      count: number
    }> = []
    let accessibilityScore = 0
    let totalPasses = 0

    try {
      const axeResults = await new AxePuppeteer(page)
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()

      // Count violations by severity
      for (const v of axeResults.violations) {
        const impact = v.impact as "critical" | "serious" | "moderate" | "minor"
        if (impact in violations) {
          violations[impact] += v.nodes.length
        }
        violations.total += v.nodes.length
      }

      totalPasses = axeResults.passes.length

      // Calculate score
      const totalChecks = axeResults.violations.length + axeResults.passes.length
      if (totalChecks > 0) {
        const weightedViolations =
          violations.critical * 10 +
          violations.serious * 5 +
          violations.moderate * 2 +
          violations.minor * 1
        accessibilityScore = Math.max(
          0,
          Math.round(100 - (weightedViolations / (totalChecks + weightedViolations)) * 100)
        )
      }

      // Get top 5 violations
      topViolations = axeResults.violations
        .sort((a, b) => {
          const impactOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 }
          return (impactOrder[a.impact as keyof typeof impactOrder] ?? 4) -
            (impactOrder[b.impact as keyof typeof impactOrder] ?? 4)
        })
        .slice(0, 5)
        .map((v) => ({
          id: v.id,
          impact: v.impact || "moderate",
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          count: v.nodes.length,
        }))
    } catch {
      // axe-core may fail on some pages
    }

    const scanDuration = Date.now() - startTime

    // Get page title
    const pageTitle = await page.title()

    await browser.close()
    browser = null

    return NextResponse.json(
      {
        url,
        pageTitle,
        overlayDetected: overlays.length > 0,
        overlays,
        accessibilityScore,
        totalPasses,
        violations,
        topViolations,
        scanDuration,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    )
  } catch (error) {
    console.error("[Overlay Detector] Scan failed:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: `Scan failed: ${message}`,
        details: message,
      },
      { status: 500 }
    )
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
