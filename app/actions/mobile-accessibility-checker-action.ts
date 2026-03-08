"use server"

import { AxePuppeteer } from '@axe-core/puppeteer'
import chromium from '@sparticuz/chromium'
import puppeteerCore, { Page } from 'puppeteer-core'
import { currentUser } from "@clerk/nextjs/server"
import { creditTransactions, db, toolUsage, users } from "@/lib/db"
import { and, eq, gte, sql } from "drizzle-orm"
import { checkTrialLimit, recordTrialUsage } from "@/lib/trial-usage"
import { hasServerUnlimitedAccess } from "@/lib/unlimited-access-server"

import { 
  AccessibilityImpact,
  AccessibilityIssue,
  DeviceConfig, 
  MOBILE_ACCESSIBILITY_AUDIT_DEVICES, 
  MobileFriendlyIssue,
  MobileAccessibilityAuditResult,
} from '@/lib/mobile-accessibility-checker-types'

const CREDIT_COST = 2
const AXE_IMPACT_WEIGHTS: Record<AccessibilityImpact, number> = {
  critical: 12,
  serious: 8,
  moderate: 4,
  minor: 2,
}

/**
 * Create and launch a Puppeteer Browser instance appropriate for the runtime environment.
 *
 * In production this connects to Sparticuz Chromium via puppeteer-core; in development it dynamically imports
 * the locally installed Puppeteer package and launches a browser with sandbox flags.
 *
 * @returns A Puppeteer `Browser` connected to the selected Chromium executable.
 * @throws If the local Puppeteer package cannot be imported in development, an error is thrown.
 */

async function getBrowser(): Promise<any> {
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    } as any)
  }

  // Development: dynamic import to avoid bundling local puppeteer
  try {
    const puppeteer = (await import('puppeteer')).default
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    } as any)
  } catch (error) {
    console.error("Failed to load local puppeteer for development:", error)
    throw new Error("Puppeteer not found. Make sure it's installed in devDependencies.")
  }
}

/**
 * Configure a Puppeteer page for a mobile device and inject runtime performance observers for CLS and LCP.
 *
 * Sets viewport and mobile user agent based on the provided device configuration, and installs a
 * PerformanceObserver in each new document that populates `window.__perfMetrics` with `cls` and `lcp`.
 *
 * @param page - The Puppeteer `Page` to configure.
 * @param deviceConfig - Device settings used to set viewport and touch/mobile flags (`width`, `height`, `isMobile`, `hasTouch`, etc.).
 */

async function setupPage(page: Page, deviceConfig: DeviceConfig) {
  await page.setViewport({
    width: deviceConfig.width,
    height: deviceConfig.height,
    isMobile: deviceConfig.isMobile,
    hasTouch: deviceConfig.hasTouch,
    deviceScaleFactor: 2,
  })
  
  // Use a modern iOS User Agent as default for high compatibility
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  )

  // Inject PerformanceObserver to capture CLS and LCP dynamically
  await page.evaluateOnNewDocument(() => {
    (window as any).__perfMetrics = {
      cls: 0,
      lcp: 0
    };

    // Monitor Layout Shifts
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            (window as any).__perfMetrics.cls += (entry as any).value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS Observer failed', e);
    }

    // Monitor Largest Contentful Paint
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          (window as any).__perfMetrics.lcp = lastEntry.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
        console.warn('LCP Observer failed', e);
    }
  });
}

/**
 * Evaluates a page's accessibility using Axe (WCAG 2.2 and best-practice tags), extracts violations, and reports a simple screen-reader compatibility indicator.
 *
 * @param page - Puppeteer Page instance to analyze
 * @returns An object with:
 *  - `score`: numeric accessibility score (0–100)
 *  - `issues`: array of Axe violation help strings
 *  - `screenReaderCompatibility`: `true` if `score` is greater than 85 and common semantic landmarks are present, `false` otherwise
 */
async function analyzeAccessibility(page: Page) {
  // Use WCAG 2.2 tags explicitly
  // @ts-ignore - AxePuppeteer type compatibility
  const axeResults = await new AxePuppeteer(page)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()

  const issues: AccessibilityIssue[] = axeResults.violations
    .map((violation) => {
      const impact = (violation.impact || 'moderate') as AccessibilityImpact
      const sampleNodes = violation.nodes.slice(0, 3).map((node) => ({
        selector: node.target.join(', ') || 'Unavailable selector',
        htmlSnippet: (node.html || '').replace(/\s+/g, ' ').slice(0, 180),
        failureSummary: node.failureSummary || 'Review this element in context.',
      }))

      return {
        id: violation.id,
        impact,
        title: violation.help,
        description: violation.description,
        recommendation: violation.help,
        helpUrl: violation.helpUrl,
        wcagCriteria: violation.tags.filter((tag) => tag.startsWith('wcag')),
        affectedNodes: violation.nodes.length,
        sampleNodes,
      }
    })
    .sort((left, right) => {
      const leftWeight = AXE_IMPACT_WEIGHTS[left.impact]
      const rightWeight = AXE_IMPACT_WEIGHTS[right.impact]
      if (leftWeight !== rightWeight) {
        return rightWeight - leftWeight
      }

      return right.affectedNodes - left.affectedNodes
    })

  const summary = issues.reduce(
    (acc, issue) => {
      acc.total += 1
      acc[issue.impact] += 1
      return acc
    },
    {
      total: 0,
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    }
  )

  const penalty = issues.reduce((sum, issue) => {
    return sum + (AXE_IMPACT_WEIGHTS[issue.impact] * Math.min(issue.affectedNodes, 5))
  }, 0)
  const score = Math.max(0, 100 - penalty)

  // Check for critical semantic structures for slightly more "dynamic" compatibility check
  const hasLandmarks = await page.evaluate(() => {
    const roles = ['main', 'navigation', 'banner', 'contentinfo', 'search'];
    return roles.some(role => document.querySelector(`[role="${role}"]`) !== null) || 
           document.querySelector('main, nav, header, footer') !== null;
  });

  return { 
    score, 
    summary,
    issues, 
    screenReaderCompatibility: score >= 85 && hasLandmarks && summary.critical === 0
  }
}

/**
 * Analyzes interactive elements on the page for touch target size issues.
 *
 * Flags elements that are not visible or have zero area as ignored, marks targets smaller than 44×44 CSS pixels as warnings, and marks targets smaller than 24×24 CSS pixels as errors.
 *
 * @returns An object with:
 *  - `total`: number of interactive targets inspected,
 *  - `passing`: number of targets meeting the recommended size,
 *  - `failing`: number of targets below the recommended size,
 *  - `issues`: array of detected issues where each item includes `element` (identifier), `size` (`width`/`height` in CSS pixels), `position` (`x`/`y`), `severity` (`'warning'` or `'error'`), and `recommendation`.
 */
async function analyzeTouchTargets(page: Page) {
  return page.evaluate(() => {
    const interactiveSelectors = 'a, button, input, select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';
    const elements = Array.from(document.querySelectorAll(interactiveSelectors)) as HTMLElement[];

    const getSelector = (el: HTMLElement) => {
      if (el.id) return `#${el.id}`;
      const classNames = Array.from(el.classList).slice(0, 2);
      if (classNames.length > 0) {
        return `${el.tagName.toLowerCase()}.${classNames.join('.')}`;
      }
      return el.tagName.toLowerCase();
    };

    const getLabel = (el: HTMLElement) => {
      const ariaLabel = el.getAttribute('aria-label');
      const ariaLabelledBy = el.getAttribute('aria-labelledby');
      const title = el.getAttribute('title');
      const placeholder = el.getAttribute('placeholder');
      const text = el.textContent?.replace(/\s+/g, ' ').trim();

      return ariaLabel || ariaLabelledBy || title || placeholder || text || null;
    };
    
    let total = 0;
    let passing = 0;
    let failing = 0;
    let errorCount = 0;
    let warningCount = 0;
    const issues: any[] = [];

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      
      // Strict WCAG 2.5.5 compliance check: Target Size (Enhanced) is 44x44 CSS pixels
      // Note: WCAG 2.2 SC 2.5.8 Target Size (Minimum) is 24x24 px. 
      // We will flag < 24px as error (WCAG 2.2 AA) and < 44px as warning (AAA / Best Practice).
      
      const isVisuallyHidden =
        rect.width <= 1 ||
        rect.height <= 1 ||
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0' ||
        style.pointerEvents === 'none';

      if (isVisuallyHidden) {
        continue;
      }

      total++;
      
      const width = rect.width;
      const height = rect.height;
      const minimalSize = 24; // WCAG 2.2 AA SC 2.5.8
      const recommendedSize = 44; // WCAG 2.1 AAA SC 2.5.5

      if (width < recommendedSize || height < recommendedSize) {
        failing++;
        const selector = getSelector(el);
        const label = getLabel(el);
        const name = label ? `${selector} "${label.slice(0, 30)}"` : selector;
        const severity = (width < minimalSize || height < minimalSize) ? 'error' : 'warning';
        const reason =
          width < minimalSize && height < minimalSize
            ? 'Both dimensions are below the 24x24px WCAG 2.2 AA minimum.'
            : width < minimalSize
              ? 'Width is below the 24px WCAG 2.2 AA minimum.'
              : height < minimalSize
                ? 'Height is below the 24px WCAG 2.2 AA minimum.'
                : 'Target is usable but below the recommended 44x44px mobile target size.';
        const recommendation = severity === 'error' 
          ? 'Must be at least 24x24px (WCAG 2.2 AA).' 
          : 'Should be at least 44x44px (WCAG AAA / Apple HIG).';

        if (severity === 'error') errorCount++;
        else warningCount++;

        issues.push({
          selector,
          element: name,
          label,
          size: { width: Math.round(width), height: Math.round(height) },
          position: { x: Math.round(rect.x), y: Math.round(rect.y) },
          severity,
          reason,
          recommendation
        });
      } else {
        passing++;
      }
    }

    issues.sort((left, right) => {
      if (left.severity !== right.severity) {
        return left.severity === 'error' ? -1 : 1;
      }

      return (left.size.width * left.size.height) - (right.size.width * right.size.height);
    });

    return { total, passing, failing, errorCount, warningCount, issues };
  });
}

/**
 * Collects page performance metrics (CLS and LCP/FCP) and returns aggregated timing values.
 *
 * @param page - Puppeteer page instance from which metrics are retrieved
 * @param loadTime - Navigation duration in milliseconds used as a fallback for missing paint timings
 * @returns An object with:
 *  - `loadTime`: the provided navigation duration in milliseconds,
 *  - `cumulativeLayoutShift`: the page's cumulative layout shift (CLS) value,
 *  - `firstContentfulPaint`: the largest-contentful/first-contentful paint time in milliseconds (falls back to `loadTime` if no paint timing is available)
 */
async function analyzePerformance(page: Page, loadTime: number) {
  // Retrieve captured metrics
  const metrics = await page.evaluate(() => {
    return (window as any).__perfMetrics || { cls: 0, lcp: 0 };
  });

  // Calculate First Contentful Paint if not captured via observer (fallback to Paint Timing API)
  if (!metrics.lcp) {
    const fcp = await page.evaluate(() => {
        const paint = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
        return paint ? paint.startTime : 0;
    });
    metrics.lcp = fcp; 
  }

  return {
    loadTime,
    cumulativeLayoutShift: metrics.cls || 0,
    firstContentfulPaint: metrics.lcp || loadTime // Use loadTime as worst-case fallback if no paint detected
  }
}

/**
 * Evaluates whether a page is mobile-friendly by checking viewport meta, content fit, text readability, and link clickability.
 *
 * @param page - Puppeteer `Page` to inspect
 * @param touchFailingCount - Number of touch targets that failed size checks; used to determine link clickability
 * @returns An object with:
 *  - `hasViewportMeta`: `true` if a `<meta name="viewport">` is present on the page.
 *  - `textReadable`: `true` if inspected text elements have a computed font size of at least 12px.
 *  - `linksClickable`: `true` if `touchFailingCount` equals 0 (strict: any failing touch target marks links as not clickable).
 *  - `contentFitsViewport`: `true` if the document width is less than or equal to the window inner width (allows a 2px rounding tolerance).
 */
async function analyzeMobileFriendliness(page: Page, touchFailingCount: number) {
  const viewportContent = await page.$eval(
    'meta[name="viewport"]',
    (node) => node.getAttribute('content'),
  ).catch(() => null)
  const hasViewportMeta = !!viewportContent
  
  const {
    contentFitsViewport,
    textReadable,
    minFontSize,
    smallTextExamples,
    smallFormControlExamples,
    documentWidth,
    viewportWidth,
  } = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const windowWidth = window.innerWidth;
    // Allow small rounding errors
    const fits = docWidth <= windowWidth + 2; 
    
    const visibleTextSelectors = 'p, li, label, a, button, td, th, small, span, div';
    const textNodes = Array.from(document.querySelectorAll(visibleTextSelectors)) as HTMLElement[];
    const smallTextExamples: string[] = [];
    let minFontSize = Number.POSITIVE_INFINITY;

    for (const el of textNodes) {
      if (!el.textContent?.trim()) continue;

      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (
        rect.width === 0 ||
        rect.height === 0 ||
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'
      ) {
        continue;
      }

      const pxSize = parseFloat(style.fontSize);
      if (!Number.isFinite(pxSize)) continue;
      minFontSize = Math.min(minFontSize, pxSize);

      if (pxSize < 12 && smallTextExamples.length < 5) {
        const text = el.textContent.replace(/\s+/g, ' ').trim().slice(0, 60);
        smallTextExamples.push(`${el.tagName.toLowerCase()} (${Math.round(pxSize)}px): ${text}`);
      }
    }

    const formControls = Array.from(document.querySelectorAll('input, select, textarea, button')) as HTMLElement[];
    const smallFormControlExamples: string[] = [];

    for (const el of formControls) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (
        rect.width === 0 ||
        rect.height === 0 ||
        style.display === 'none' ||
        style.visibility === 'hidden'
      ) {
        continue;
      }

      const pxSize = parseFloat(style.fontSize);
      if (!Number.isFinite(pxSize) || pxSize >= 16 || smallFormControlExamples.length >= 5) {
        continue;
      }

      const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.textContent?.trim() || el.tagName.toLowerCase();
      smallFormControlExamples.push(`${el.tagName.toLowerCase()} (${Math.round(pxSize)}px): ${label.slice(0, 60)}`);
    }
    
    return {
      contentFitsViewport: fits,
      textReadable: smallTextExamples.length === 0,
      minFontSize: Number.isFinite(minFontSize) ? minFontSize : null,
      smallTextExamples,
      smallFormControlExamples,
      documentWidth: docWidth,
      viewportWidth: windowWidth,
    }
  })

  const issues: MobileFriendlyIssue[] = []

  if (!hasViewportMeta) {
    issues.push({
      id: 'viewport-meta-missing',
      title: 'Viewport meta tag is missing',
      severity: 'error',
      details: 'Mobile browsers will not size the layout correctly without a viewport declaration.',
      recommendation: 'Add `<meta name="viewport" content="width=device-width, initial-scale=1">`.',
    })
  } else if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:\.0)?/i.test(viewportContent)) {
    issues.push({
      id: 'viewport-zoom-disabled',
      title: 'Viewport settings disable or restrict zoom',
      severity: 'error',
      details: `Viewport content: ${viewportContent}`,
      recommendation: 'Allow pinch zoom by removing `user-scalable=no` and restrictive `maximum-scale` values.',
    })
  }

  if (!contentFitsViewport) {
    issues.push({
      id: 'horizontal-overflow',
      title: 'Content overflows the mobile viewport',
      severity: 'error',
      details: `Document width is ${Math.round(documentWidth)}px while the viewport is ${Math.round(viewportWidth)}px.`,
      recommendation: 'Prevent horizontal scrolling by constraining wide content and reviewing fixed-width elements.',
    })
  }

  if (!textReadable) {
    issues.push({
      id: 'small-text',
      title: 'Text is too small on mobile',
      severity: 'warning',
      details: smallTextExamples.join(' | '),
      recommendation: 'Increase text to at least 12px for general readability on mobile screens.',
    })
  }

  if (smallFormControlExamples.length > 0) {
    issues.push({
      id: 'small-form-controls',
      title: 'Form controls use text below 16px',
      severity: 'warning',
      details: smallFormControlExamples.join(' | '),
      recommendation: 'Use at least 16px font size for interactive form controls to avoid iOS auto-zoom and improve readability.',
    })
  }

  if (touchFailingCount > 0) {
    issues.push({
      id: 'unclickable-targets',
      title: 'Some interactive targets are too small for reliable tapping',
      severity: 'warning',
      details: `${touchFailingCount} touch target issue(s) fell below the WCAG minimum.`,
      recommendation: 'Increase control hit areas and add spacing around dense tap targets.',
    })
  }

  return {
    hasViewportMeta,
    textReadable,
    linksClickable: touchFailingCount === 0, // Strict: Fail if ANY touch target is too small (below minimum)
    contentFitsViewport,
    viewportContent,
    minFontSize,
    smallTextExamples,
    smallFormControlExamples,
    issues,
  }
}

/**
 * Run a headless-browser mobile accessibility audit for the given URL and return a consolidated report.
 *
 * Validates the URL, enforces credit or trial limits (unless bypassed), navigates the page using a device
 * configuration, performs accessibility, touch target, performance, and mobile-friendliness audits, computes
 * a composite accessibility score, records usage/credits or trial consumption, and ensures browser cleanup.
 *
 * @param url - The target page URL to audit; must be a valid absolute URL
 * @param deviceName - The key identifying the device configuration to emulate (falls back to "iPhone 14" if unknown)
 * @param unlimitedAccess - When true, bypasses authentication, credit checks, and trial limits for this run
 * @returns The aggregated mobile accessibility audit result containing device, viewport, touchTargets, performance, accessibility (composite), and mobileFriendly data
 */

export async function runMobileAccessibilityChecker(
  url: string, 
  deviceName: string,
  unlimitedAccess: boolean = false
): Promise<MobileAccessibilityAuditResult> {
  let browser: any = null
  
  try {
    // 1. Validation & Auth Logic
    try {
      new URL(url)
    } catch {
      throw new Error("Invalid URL provided")
    }

    const user = await currentUser();
    const hasUnlimitedAccess = await hasServerUnlimitedAccess();
    const effectiveUnlimitedAccess = unlimitedAccess && hasUnlimitedAccess;
    let userRecord = null;
    let currentCredits = 0;

    if (effectiveUnlimitedAccess) {
      console.log("🚀 Unlimited access active - bypassing limits for mobile checker");
    } else {
      if (user) {
        [userRecord] = await db
          .select()
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        if (!userRecord) {
           throw new Error("User record not found");
        }

        currentCredits = userRecord.credits;

        if (currentCredits < CREDIT_COST) {
          throw new Error(`Insufficient credits. You need ${CREDIT_COST} credits.`);
        }
      } else {
        const trialStatus = await checkTrialLimit("mobile_accessibility_checker");
        if (!trialStatus.allowed) {
          throw new Error(`Trial limit exceeded. ${trialStatus.message}`);
        }
      }
    }

    // 2. Browser Setup
    browser = await getBrowser()
    const page = await browser.newPage()
    
    // Set a default navigation timeout for all page operations
    page.setDefaultNavigationTimeout(30000)
    
    const deviceConfig = MOBILE_ACCESSIBILITY_AUDIT_DEVICES[deviceName] || MOBILE_ACCESSIBILITY_AUDIT_DEVICES["iPhone 14"]
    await setupPage(page, deviceConfig)

    const startTime = performance.now()
    
    // 3. Robust Navigation
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 25000 })
    } catch (navError) {
      console.warn(`Network idle timeout for ${url}, falling back to domcontentloaded`, navError)
      // Fallback: if networkidle0 fails, try to salvage if DOM is ready
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
      } catch (fallbackError) {
         throw new Error(`Failed to load page: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown navigation error'}`)
      }
    }
    
    const loadTime = performance.now() - startTime

    // 4. Defensive Audit Execution
    // Wrap each audit in try-catch so one failure doesn't crash the whole report
    
    // Accessibility (Critical)
    let accessibility: MobileAccessibilityAuditResult["accessibility"]
    try {
      accessibility = await analyzeAccessibility(page)
    } catch (e) {
      console.error("Accessibility audit failed", e)
      accessibility = {
        score: 0,
        summary: { total: 1, critical: 1, serious: 0, moderate: 0, minor: 0 },
        issues: [{
          id: 'accessibility-audit-failed',
          impact: 'critical' as const,
          title: 'Failed to run accessibility checks',
          description: 'The automated accessibility audit could not complete.',
          recommendation: 'Retry the scan and review server logs for the underlying runtime error.',
          helpUrl: '',
          wcagCriteria: [],
          affectedNodes: 0,
          sampleNodes: [],
        }],
        screenReaderCompatibility: false,
      }
    }

    // Touch Targets (Critical)
    let touchTargets: MobileAccessibilityAuditResult["touchTargets"]
    try {
      touchTargets = await analyzeTouchTargets(page)
    } catch (e) {
      console.error("Touch target audit failed", e)
      touchTargets = { total: 0, passing: 0, failing: 0, errorCount: 0, warningCount: 0, issues: [] }
    }

    // Performance (Non-critical)
    let perfMetrics: MobileAccessibilityAuditResult["performance"]
    try {
      perfMetrics = await analyzePerformance(page, loadTime)
    } catch (e) {
      console.warn("Performance audit failed", e)
      perfMetrics = { loadTime, cumulativeLayoutShift: 0, firstContentfulPaint: loadTime }
    }
    
    // Mobile Friendly (Composite)
    let mobileFriendly: MobileAccessibilityAuditResult["mobileFriendly"]
    try {
      const strictTouchFailures = touchTargets.errorCount;
      mobileFriendly = await analyzeMobileFriendliness(page, strictTouchFailures)
    } catch (e) {
      console.error("Mobile friendliness check failed", e)
      mobileFriendly = {
        hasViewportMeta: false,
        textReadable: false,
        linksClickable: false,
        contentFitsViewport: false,
        viewportContent: null,
        minFontSize: null,
        smallTextExamples: [],
        smallFormControlExamples: [],
        issues: [{
          id: 'mobile-friendly-check-failed',
          title: 'Failed to evaluate mobile-specific requirements',
          severity: 'error' as const,
          details: 'The mobile heuristic checks did not complete.',
          recommendation: 'Retry the scan and inspect the page for script/runtime errors.',
        }],
      }
    }

    // --- Composite Scoring Logic ---
    const axeScore = accessibility.score;
    const touchScore = touchTargets.total > 0 
      ? (touchTargets.passing / touchTargets.total) * 100 
      : 100;
      
    const compositeScore = Math.round((axeScore * 0.6) + (touchScore * 0.4));
    
    const finalAccessibility = {
      ...accessibility,
      score: compositeScore 
    };

    // 5. Post-Audit Logging & Credit Deduction (if successful)
    
    if (effectiveUnlimitedAccess) {
       console.log("🚀 Unlimited access active - bypassing all limits");
    } else {
        if (user && userRecord) {
          await db.transaction(async (tx) => {
            const [updatedUser] = await tx
              .update(users)
              .set({
                credits: sql`${users.credits} - ${CREDIT_COST}`,
                totalCreditsUsed: sql`${users.totalCreditsUsed} + ${CREDIT_COST}`,
                updatedAt: new Date()
              })
              .where(and(eq(users.id, user.id), gte(users.credits, CREDIT_COST)))
              .returning({ credits: users.credits })

            if (!updatedUser) {
              throw new Error(`Insufficient credits. You need ${CREDIT_COST} credits.`);
            }

            const newBalance = updatedUser.credits
            const balanceBefore = newBalance + CREDIT_COST

            await tx.insert(creditTransactions).values({
              userId: userRecord.id,
              type: 'usage',
              amount: -CREDIT_COST,
              balanceBefore,
              balanceAfter: newBalance,
              description: `Mobile Accessibility Checker`,
              toolUsed: 'mobile_accessibility_checker',
              metadata: { url, deviceName }
            })

            await tx.insert(toolUsage).values({
              userId: userRecord.id,
              tool: 'mobile_accessibility_checker',
              creditsUsed: CREDIT_COST,
              inputData: { url, deviceName },
              success: true
            })
          })
        } else {
          await recordTrialUsage("mobile_accessibility_checker");
        }
    }

    return {
      device: deviceName,
      viewport: deviceConfig,
      touchTargets,
      performance: perfMetrics,
      accessibility: finalAccessibility,
      mobileFriendly
    }

  } catch (error) {
    console.error("Mobile Audit Critical Failure:", error)
    const message = error instanceof Error ? error.message : "Unknown error occurred"
    throw new Error(`Audit failed: ${message}`)
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error("Error closing browser:", closeError)
      }
    }
  }
}
