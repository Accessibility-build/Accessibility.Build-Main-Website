import "server-only"
import { AxePuppeteer } from "@axe-core/puppeteer"
import type { AxeResults } from "axe-core"
import type { Page } from "puppeteer-core"
import { scrollThrough, withRenderedPage } from "@/lib/render/browser"
import { runFocusOrder, type FocusRun } from "@/lib/focus-order/focus-run"
import { OVERLAY_VENDORS } from "@/lib/overlay-vendors"
import { collectPageChecks, probeReflow, probeTextSpacing, type RawPageChecks } from "@/lib/url-audit/page-checks"
import {
  EXPERIMENTAL_AXE_RULES,
  MAX_NODES_PER_FINDING,
  axeFindings,
  buildCoverage,
  buildManualChecks,
  custom,
  domFindings,
  keyboardFindings,
  sortFindings,
  titleFinding,
} from "@/lib/url-audit/report"
import type { AuditExtras, AuditFinding, EngineCheck, KeyboardSummary, LayoutSummary, PageFacts } from "@/lib/url-audit/types"

// The URL Accessibility Auditor's scan. One headless Chrome page (lib/render/browser: SSRF-guarded
// requests, bot-wall and error-page detection), then, in this order so that no step disturbs the
// one before it:
//
//   1. axe-core, on the page as loaded, with five experimental rules turned on.
//   2. Our DOM checks (lib/url-audit/page-checks), for patterns axe does not test.
//   3. Reduced motion: count looping animations, turn on prefers-reduced-motion, count again.
//   4. A screenshot of the first screen, for the report.
//   5. The keyboard pass from the focus order checker: Tab through the page, comparing pixels to
//      find stops with no visible focus, stops hidden behind sticky content, and traps.
//   6. Text spacing (1.4.12): apply the criterion's spacing and look for text that gets cut off.
//   7. Reflow (1.4.10): narrow the window to 320 CSS px and look for sideways scrolling.
//
// Steps 3 and 5 to 7 are skipped when the deadline is near, and the report says which ran.

export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]

/** Criteria our own checks examine, by step, for the coverage map. */
const DOM_CHECK_CRITERIA = ["1.1.1", "1.3.1", "1.3.5", "2.1.1", "2.4.2", "2.4.4", "3.3.2"]
const KEYBOARD_CRITERIA = ["2.1.2", "2.4.3", "2.4.7", "2.4.11"]

export interface AuditRun {
  title: string
  finalUrl: string
  findings: AuditFinding[]
  extras: AuditExtras
  /** data:image/jpeg;base64 of the first screen at 1280 by 800. Not stored. */
  screenshot: string | null
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function runAudit(url: URL, { deadline }: { deadline: number }): Promise<AuditRun> {
  const started = Date.now()
  return withRenderedPage(url, { viewport: { width: 1280, height: 800 }, settleMs: 1000, navigationTimeoutMs: 25_000 }, async ({ page, cdp, finalUrl, title }) => {
    const checks: EngineCheck[] = []
    const findings: AuditFinding[] = []
    const timeLeft = () => deadline - Date.now()

    // Lazy sections load as the page scrolls; without this axe sees only the first screen.
    await scrollThrough(page, 5000)

    // 1. axe-core
    const axe = (await new AxePuppeteer(page as unknown as ConstructorParameters<typeof AxePuppeteer>[0])
      .options({
        resultTypes: ["violations", "incomplete"],
        rules: Object.fromEntries(EXPERIMENTAL_AXE_RULES.map((id) => [id, { enabled: true }])),
      })
      .withTags(AXE_TAGS)
      .analyze()) as AxeResults
    findings.push(...axeFindings(axe))
    const rulesRun = axe.violations.length + axe.passes.length + axe.incomplete.length
    const confirmed = axe.violations.filter((rule) => !rule.tags.includes("experimental")).length
    const experimentalFails = axe.violations.length - confirmed
    checks.push({
      id: "axe",
      label: `axe-core ${axe.testEngine?.version ?? ""}`.trim(),
      status: "ok",
      detail: `${rulesRun} rules applied to this page: ${confirmed} failed, ${axe.incomplete.length + experimentalFails} need review${experimentalFails ? ` (including ${experimentalFails} from rules axe marks experimental)` : ""}, ${axe.passes.length} passed.`,
    })

    // 2. DOM checks
    const raw = (await page.evaluate(collectPageChecks, MAX_NODES_PER_FINDING, Object.values(OVERLAY_VENDORS))) as RawPageChecks
    findings.push(...domFindings(raw.checks))
    const generic = titleFinding(title || raw.facts.title, url.hostname)
    if (generic) findings.push(generic)
    checks.push({
      id: "dom",
      label: "accessibility.build page checks",
      status: "ok",
      detail: "Alt text quality, keyboard reach of clickable elements, form labels, autocomplete, required fields, link text, captions, autoplay, small and justified text, fake lists.",
    })

    // 3. Reduced motion
    let respectsReducedMotion: boolean | null = null
    if (raw.facts.runningAnimations > 0 && timeLeft() > 40_000) {
      const still = await reducedMotionProbe(page)
      respectsReducedMotion = still.count === 0
      if (still.count > 0) {
        findings.push(
          custom("ab-motion-ignored", still.nodes, still.count, {
            description: `${raw.facts.runningAnimations} animation${raw.facts.runningAnimations === 1 ? "" : "s"} looped forever when the page loaded, and ${still.count} kept running after we turned on the operating system's "reduce motion" preference. Movement can trigger nausea and dizziness for people with vestibular disorders, and distracts people with attention difficulties.`,
          }),
        )
      }
      checks.push({ id: "motion", label: "Reduced motion", status: "ok", detail: `${raw.facts.runningAnimations} looping animations; ${still.count} still running with prefers-reduced-motion: reduce.` })
    } else {
      checks.push({ id: "motion", label: "Reduced motion", status: "skipped", detail: raw.facts.runningAnimations > 0 ? "Skipped to stay within the time limit." : "No looping animations on the page." })
    }

    // 4. Screenshot of the first screen
    let screenshot: string | null = null
    try {
      await page.evaluate(() => window.scrollTo(0, 0))
      const base64 = await page.screenshot({ type: "jpeg", quality: 55, encoding: "base64", clip: { x: 0, y: 0, width: 1280, height: 800 } })
      screenshot = `data:image/jpeg;base64,${base64}`
    } catch {
      screenshot = null
    }

    // 5. Keyboard pass
    let focus: FocusRun | null = null
    if (timeLeft() > 30_000) {
      try {
        focus = await runFocusOrder(page, await cdp(), { deadline: Math.min(Date.now() + 16_000, deadline - 18_000) })
      } catch (error) {
        console.error("URL audit keyboard pass failed:", error)
      }
    }
    if (focus) {
      findings.push(...keyboardFindings(focus))
      checks.push({ id: "keyboard", label: "Keyboard pass", status: "ok", detail: `Pressed Tab through ${focus.stops.length} stops. ${focus.endNote}` })
    } else {
      checks.push({ id: "keyboard", label: "Keyboard pass", status: "skipped", detail: "The page took too long to load to leave time for it, or did not accept keyboard focus." })
    }

    // 6. Text spacing
    let textSpacingChecked = false
    let textSpacingClipped = 0
    if (timeLeft() > 12_000) {
      try {
        await page.evaluate(probeTextSpacing, "before" as const, MAX_NODES_PER_FINDING)
        await wait(400)
        const spacing = await page.evaluate(probeTextSpacing, "after" as const, MAX_NODES_PER_FINDING)
        textSpacingChecked = true
        textSpacingClipped = spacing.count
        if (spacing.count > 0) findings.push(custom("ab-text-spacing", spacing.clipped, spacing.count))
      } catch (error) {
        console.error("URL audit text spacing probe failed:", error)
      }
    }
    checks.push({
      id: "text-spacing",
      label: "Text spacing",
      status: textSpacingChecked ? "ok" : "skipped",
      detail: textSpacingChecked ? `${textSpacingClipped} text container${textSpacingClipped === 1 ? "" : "s"} cut off with WCAG 1.4.12 spacing applied.` : "Skipped to stay within the time limit.",
    })

    // 7. Reflow at 320 CSS px
    let reflowScrollWidth: number | null = null
    if (timeLeft() > 8_000) {
      try {
        await page.setViewport({ width: 320, height: 640 })
        await wait(900)
        const reflow = await page.evaluate(probeReflow, MAX_NODES_PER_FINDING)
        reflowScrollWidth = reflow.scrollWidth
        const overflow = reflow.scrollWidth - reflow.viewport
        if (overflow > 8 && reflow.count > 0) {
          findings.push(
            custom("ab-reflow", reflow.culprits, reflow.count, {
              outcome: reflow.textual && overflow > 20 ? "violation" : "review",
              description: `At a 320 CSS pixel wide window, the width of a phone or a desktop zoomed to 400%, the page is ${reflow.scrollWidth} pixels wide, so it scrolls sideways by ${overflow} pixels. People who zoom have to scroll in two directions to read each line.`,
            }),
          )
        } else if (reflow.clippedByRoot && reflow.count > 0 && reflow.textual) {
          findings.push(custom("ab-reflow-clipped", reflow.culprits, reflow.count))
        }
      } catch (error) {
        console.error("URL audit reflow probe failed:", error)
      }
    }
    checks.push({
      id: "reflow",
      label: "Reflow at 320 px",
      status: reflowScrollWidth !== null ? "ok" : "skipped",
      detail: reflowScrollWidth !== null ? `Page width at a 320 px window: ${reflowScrollWidth} px.` : "Skipped to stay within the time limit.",
    })

    const facts: PageFacts = { ...raw.facts, title: title || raw.facts.title, finalUrl, respectsReducedMotion }
    const keyboard: KeyboardSummary = focus
      ? {
          ran: true,
          stops: focus.stops.length,
          noIndicator: focus.summary.noIndicator,
          obscured: focus.summary.obscured,
          trap: focus.summary.trap,
          endNote: focus.endNote,
          firstStops: focus.stops.slice(0, 40).map((stop) => ({ index: stop.index, name: stop.name.slice(0, 80), role: stop.role || stop.tag, indicator: stop.indicator, covered: stop.covered })),
        }
      : { ran: false, stops: 0, noIndicator: 0, obscured: 0, trap: false, endNote: "", firstStops: [] }
    const layout: LayoutSummary = { reflowChecked: reflowScrollWidth !== null, reflowScrollWidth, textSpacingChecked, textSpacingClipped }

    const testedBy = [
      ...DOM_CHECK_CRITERIA,
      ...(focus ? KEYBOARD_CRITERIA : []),
      ...(textSpacingChecked ? ["1.4.12"] : []),
      ...(reflowScrollWidth !== null ? ["1.4.10"] : []),
      ...(respectsReducedMotion !== null ? ["2.2.2"] : []),
    ]
    const sorted = sortFindings(findings)

    return {
      title: facts.title || finalUrl,
      finalUrl,
      findings: sorted,
      screenshot,
      extras: {
        version: 2,
        facts,
        keyboard,
        layout,
        coverage: buildCoverage(sorted, axe.passes, testedBy),
        manualChecks: buildManualChecks(raw.facts, !!focus),
        engine: {
          axeVersion: axe.testEngine?.version ?? "",
          checks,
          durationMs: Date.now() - started,
          rulesRun,
          rulesPassed: axe.passes.length,
        },
      },
    }
  })
}

/** Turns on prefers-reduced-motion and lists the looping animations that keep running. */
async function reducedMotionProbe(page: Page): Promise<{ count: number; nodes: { selector: string; html: string; note?: string }[] }> {
  try {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await wait(700)
    return await page.evaluate((max: number) => {
      const running = document.getAnimations().filter((animation) => animation.playState === "running" && animation.effect?.getComputedTiming().iterations === Infinity)
      const seen = new Set<Element>()
      const nodes: { selector: string; html: string; note?: string }[] = []
      for (const animation of running) {
        const target = (animation.effect as KeyframeEffect | null)?.target
        if (!target || seen.has(target)) continue
        seen.add(target)
        if (nodes.length >= max) continue
        const classes = typeof target.className === "string" ? target.className.trim().split(/\s+/).slice(0, 2).filter(Boolean) : []
        const selector = target.id ? `#${target.id}` : `${target.tagName.toLowerCase()}${classes.map((name) => `.${name}`).join("")}`
        const html = (target.outerHTML.match(/^<[^>]{0,240}>/)?.[0] ?? target.tagName.toLowerCase()) + "…"
        const name = animation instanceof CSSAnimation ? animation.animationName : "script animation"
        nodes.push({ selector, html, note: `Animation "${name}" keeps looping` })
      }
      return { count: seen.size, nodes }
    }, MAX_NODES_PER_FINDING)
  } catch {
    return { count: 0, nodes: [] }
  } finally {
    await page.emulateMediaFeatures([]).catch(() => {})
  }
}
