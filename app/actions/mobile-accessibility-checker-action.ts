"use server"

import { AxePuppeteer } from '@axe-core/puppeteer'
import chromium from '@sparticuz/chromium'
import puppeteerCore, { Page, Browser } from 'puppeteer-core'
import { currentUser } from "@clerk/nextjs/server"
import { creditTransactions, db, toolUsage, users } from "@/lib/db"
import { eq } from "drizzle-orm"
import { checkTrialLimit, recordTrialUsage } from "@/lib/trial-usage"

import { 
  DeviceConfig, 
  MOBILE_ACCESSIBILITY_AUDIT_DEVICES, 
  MobileAccessibilityAuditResult,
} from '@/lib/mobile-accessibility-checker-types'

const CREDIT_COST = 2

/**
 * Create and launch a Puppeteer Browser instance appropriate for the runtime environment.
 *
 * In production this connects to Sparticuz Chromium via puppeteer-core; in development it dynamically imports
 * the locally installed Puppeteer package and launches a browser with sandbox flags.
 *
 * @returns A Puppeteer `Browser` connected to the selected Chromium executable.
 * @throws If the local Puppeteer package cannot be imported in development, an error is thrown.
 */

async function getBrowser(): Promise<Browser> {
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

  const totalChecks = axeResults.passes.length + axeResults.violations.length + axeResults.incomplete.length
  const score = totalChecks === 0 ? 100 : Math.max(0, Math.round(((totalChecks - axeResults.violations.length) / totalChecks) * 100))
  const issues = axeResults.violations.map(v => v.help)

  // Check for critical semantic structures for slightly more "dynamic" compatibility check
  const hasLandmarks = await page.evaluate(() => {
    const roles = ['main', 'navigation', 'banner', 'contentinfo', 'search'];
    return roles.some(role => document.querySelector(`[role="${role}"]`) !== null) || 
           document.querySelector('main, nav, header, footer') !== null;
  });

  return { 
    score, 
    issues, 
    screenReaderCompatibility: score > 85 && hasLandmarks 
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
    const interactiveSelectors = 'a, button, input, select, textarea, [role="button"]';
    const elements = Array.from(document.querySelectorAll(interactiveSelectors));
    
    let total = 0;
    let passing = 0;
    let failing = 0;
    const issues: any[] = [];

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      
      // Strict WCAG 2.5.5 compliance check: Target Size (Enhanced) is 44x44 CSS pixels
      // Note: WCAG 2.2 SC 2.5.8 Target Size (Minimum) is 24x24 px. 
      // We will flag < 24px as error (WCAG 2.2 AA) and < 44px as warning (AAA / Best Practice).
      
      if (rect.width === 0 || rect.height === 0 || style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        continue;
      }

      total++;
      
      const width = rect.width;
      const height = rect.height;
      const minimalSize = 24; // WCAG 2.2 AA SC 2.5.8
      const recommendedSize = 44; // WCAG 2.1 AAA SC 2.5.5

      if (width < recommendedSize || height < recommendedSize) {
        failing++;
        
        let name = el.tagName.toLowerCase();
        if (el.id) name += `#${el.id}`;
        else if (el.className) name += `.${el.className.split(' ')[0]}`;
        else if (el.textContent) name += ` "${el.textContent.substring(0, 15)}..."`;

        const severity = (width < minimalSize || height < minimalSize) ? 'error' : 'warning';
        const recommendation = severity === 'error' 
          ? 'Must be at least 24x24px (WCAG 2.2 AA).' 
          : 'Should be at least 44x44px (WCAG AAA / Apple HIG).';

        issues.push({
          element: name,
          size: { width: Math.round(width), height: Math.round(height) },
          position: { x: Math.round(rect.x), y: Math.round(rect.y) },
          severity,
          recommendation
        });
      } else {
        passing++;
      }
    }

    return { total, passing, failing, issues };
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
  const hasViewportMeta = !!(await page.$('meta[name="viewport"]'))
  
  const [contentFitsViewport, textReadable] = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const windowWidth = window.innerWidth;
    // Allow small rounding errors
    const fits = docWidth <= windowWidth + 2; 
    
    // Check for readable text size
    // Checking strict readability
    const textNodes = Array.from(document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, span, div'));
    let unreadableFound = false;

    for (const el of textNodes) {
       // Only check direct text content
       if (!el.textContent?.trim()) continue;
       
       const style = window.getComputedStyle(el);
       if (style.display === 'none' || style.visibility === 'hidden') continue;

       const pxSize = parseFloat(style.fontSize);
       // 12px is generally considered the absolute minimum for body text on mobile.
       // 10px might be used for strict captions/metadata, but generally 12px+ is safe for "readable".
       if (pxSize < 12) {
         unreadableFound = true;
         break;
       }
    }
    
    return [fits, !unreadableFound]
  })

  return {
    hasViewportMeta,
    textReadable,
    linksClickable: touchFailingCount === 0, // Strict: Fail if ANY touch target is too small (below minimum)
    contentFitsViewport
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
  let browser: Browser | null = null
  
  try {
    // 1. Validation & Auth Logic
    try {
      new URL(url)
    } catch {
      throw new Error("Invalid URL provided")
    }

    const user = await currentUser();
    let userRecord = null;
    let currentCredits = 0;

    // Check for unlimited access first - bypass all other checks
    if (unlimitedAccess) {
      console.log("🚀 Unlimited access active - bypassing limits for mobile checker");
    } else {
      // Logic for standard users (credits or trial)
      if (user) {
        // Authenticated user: check credits
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
        // Guest user: check trial limits
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
    let accessibility
    try {
      accessibility = await analyzeAccessibility(page)
    } catch (e) {
      console.error("Accessibility audit failed", e)
      accessibility = { score: 0, issues: ["Failed to run accessibility checks"], screenReaderCompatibility: false }
    }

    // Touch Targets (Critical)
    let touchTargets
    try {
      touchTargets = await analyzeTouchTargets(page)
    } catch (e) {
      console.error("Touch target audit failed", e)
      touchTargets = { total: 0, passing: 0, failing: 0, issues: [] }
    }

    // Performance (Non-critical)
    let perfMetrics
    try {
      perfMetrics = await analyzePerformance(page, loadTime)
    } catch (e) {
      console.warn("Performance audit failed", e)
      perfMetrics = { loadTime, cumulativeLayoutShift: 0, firstContentfulPaint: loadTime }
    }
    
    // Mobile Friendly (Composite)
    let mobileFriendly
    try {
      const strictTouchFailures = touchTargets.issues.filter((i: any) => i.severity === 'error').length;
      mobileFriendly = await analyzeMobileFriendliness(page, strictTouchFailures)
    } catch (e) {
      console.error("Mobile friendliness check failed", e)
      mobileFriendly = { hasViewportMeta: false, textReadable: false, linksClickable: false, contentFitsViewport: false }
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
    
    if (unlimitedAccess) {
       console.log("🚀 Unlimited access active - bypassing all limits");
    } else {
        if (user && userRecord) {
          // Deduct credits
          const newBalance = currentCredits - CREDIT_COST;
          
          await Promise.all([
            // Update user credits
             db.update(users)
               .set({ 
                 credits: newBalance,
                 totalCreditsUsed: userRecord.totalCreditsUsed + CREDIT_COST,
                 updatedAt: new Date()
               })
               .where(eq(users.id, user.id)),
             
            // Record credit transaction
             db.insert(creditTransactions).values({
               userId: userRecord.id,
               type: 'usage',
               amount: -CREDIT_COST,
               balanceBefore: currentCredits,
               balanceAfter: newBalance,
               description: `Mobile Accessibility Checker`,
               toolUsed: 'mobile_accessibility_checker',
               metadata: { url, deviceName }
             }),
            // Record tool usage
             db.insert(toolUsage).values({
               userId: userRecord.id,
               tool: 'mobile_accessibility_checker',
               creditsUsed: CREDIT_COST,
               inputData: { url, deviceName },
               success: true
             })
          ]);
        } else {
          // Record trial usage for non-authenticated users without unlimited access
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