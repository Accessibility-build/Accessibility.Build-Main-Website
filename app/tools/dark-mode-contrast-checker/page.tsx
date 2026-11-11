import type { Metadata } from "next"
import Link from "next/link"
import DarkModeContrastChecker from "@/components/tools/dark-mode-contrast-checker"
import { BreadcrumbStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

// Dark mode contrast checker: renders a page with a light and a dark colour scheme, runs axe-core
// contrast in each, and reports how Safari's Adaptive Dark Mode will treat it. The engine is in
// lib/dark-mode/run.ts and app/api/tools/dark-mode-contrast-checker.

const ROUTE = "/tools/dark-mode-contrast-checker"
const pageTitle = "Dark Mode Contrast Checker: Test Light and Dark Themes"
const pageDescription =
  "Test a live page's contrast in light and dark mode, find text that fails or vanishes only in dark, and see if Safari's Adaptive Dark Mode will change it."

const ogImage = `/api/og?title=${encodeURIComponent("Dark Mode Contrast Checker")}&section=Free tool`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "dark mode contrast checker",
    "dark mode accessibility checker",
    "dark mode test website",
    "dark mode accessibility contrast",
    "dark mode wcag",
    "is dark mode a wcag requirement",
    "safari adaptive dark mode",
    "adaptive dark mode safari",
    "color-scheme light dark",
    "prefers-color-scheme contrast",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    siteName: "Accessibility.build",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Dark mode contrast checker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [ogImage],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Dark Mode Contrast Checker", url: `https://accessibility.build${ROUTE}` },
]

const FEATURES = [
  "Renders the page with prefers-color-scheme set to light, then dark, in one headless Chrome session",
  "Runs axe-core colour contrast in each scheme and sorts failures into dark only, light only and both",
  "Catches hard-coded text on the browser's dark default background, which axe-core misses when html and body are transparent",
  "Reports invisible text (1:1 contrast) that axe-core files under needs review",
  "Checks links distinguished by colour alone (link-in-text-block) in both schemes",
  "Reads the color-scheme meta tag and the computed color-scheme on html and body",
  "Finds prefers-color-scheme: dark rules and light-dark() in the page's stylesheets",
  "Gives a Safari Adaptive Dark Mode verdict with a Chromium automatic dark theme preview",
  "Lists bitmap logos, canvas elements, masks, blend modes and repeating background images at risk",
]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"
const extLinkProps = { target: "_blank", rel: "noopener noreferrer", className: linkClass } as const
const h2Class = "font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl"
const strong = "font-semibold text-slate-900 dark:text-white"

const SOURCES = [
  { label: "WebKit blog: Introducing Adaptive Dark Mode (3 November 2026)", href: "https://webkit.org/blog/18541/introducing-adaptive-dark-mode/" },
  { label: "W3C: CSS Color Adjustment Module Level 1, the color-scheme property", href: "https://www.w3.org/TR/css-color-adjust-1/" },
  { label: "W3C: WCAG 2.2, definition of contrast ratio (Note 6)", href: "https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio" },
  { label: "w3c/wcag issue 2889: dark mode and alternative themes in contrast audits", href: "https://github.com/w3c/wcag/issues/2889" },
  { label: "w3c/wcag issue 4317: does every theme need to meet Contrast (Minimum)?", href: "https://github.com/w3c/wcag/issues/4317" },
  { label: "axe-core issue 4608: transparent page background assumed to be white", href: "https://github.com/dequelabs/axe-core/issues/4608" },
  { label: "Chrome for Developers: Auto Dark Theme", href: "https://developer.chrome.com/blog/auto-dark-theme" },
]

const FAQS = [
  {
    question: "Is dark mode a WCAG requirement?",
    answer:
      "No. WCAG does not require a dark mode. If you offer one, the open question is whether it has to meet the contrast criteria too. W3C has not ruled: issues 2889 and 4317 on the WCAG repository are still open. Many auditors test every theme an author provides, because a dark theme is the author's own code, and that is the safe approach.",
  },
  {
    question: "Does Safari's Adaptive Dark Mode affect my WCAG conformance?",
    answer:
      "Not directly. WCAG 2.2 says authors need not consider colour changes made by the user agent unless the author's code caused them, and Adaptive Dark Mode is a change Safari makes when a visitor turns it on. It still shapes what those visitors see, which is why the checker reports it as readiness rather than as failures.",
  },
  {
    question: "How do I stop Safari adapting my page?",
    answer:
      "Declare that you support both schemes with <meta name=\"color-scheme\" content=\"light dark\"> or color-scheme: light dark on :root, and provide your own dark styles. To keep a page light, WebKit describes light only as the opt-out, but notes that the only keyword is not supported in Safari 27.3 beta 1.",
  },
  {
    question: "Why does my page fail only in dark mode when I have no dark theme?",
    answer:
      "Usually because the page declares light dark, or a framework adds it, while hard-coding some colours. In dark mode the browser makes the default background dark (rgb 18, 18, 18 in Chrome) and the default text white, but any colour you set yourself stays. Dark grey text then sits on a near-black background, or white default text on your white card.",
  },
  {
    question: "Is the dark preview what Safari will show?",
    answer:
      "No. It uses Chromium's automatic dark theme, turned on together with a dark preference so that it skips the same pages Safari skips. Safari uses its own colour transform, inspects SVGs and inverts simple black and white logos, and may switch off masks and blend modes, so its result will differ. No browser lets a page read Safari's adapted colours.",
  },
  {
    question: "Does it test the dark mode toggle on my site?",
    answer:
      "No. It tests the system preference (prefers-color-scheme), which is what operating system dark mode and Safari use. A theme switch that sets a class or data attribute when clicked is not exercised. To test that theme, check a URL that forces it, if your site has one.",
  },
]

export default function DarkModeContrastCheckerPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Dark Mode Contrast Checker"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
        featureList={FEATURES}
      />

      <div className="bg-white pb-20 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/tools" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Tools
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">Dark Mode Contrast Checker</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-600 dark:text-slate-400">Free tool &middot; No sign-up</p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Does your page still read well in dark mode?
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Text that passes on white can fade to nothing on a dark background. This checker loads a live page in Chrome twice, with a
              light colour scheme and then a dark one, tests the contrast of every piece of text in each, and shows what breaks only in
              dark. It also tells you whether Safari&apos;s new Adaptive Dark Mode will repaint the page.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <DarkModeContrastChecker />

            <section aria-labelledby="checks-heading" className="mt-14 max-w-[68ch]">
              <h2 id="checks-heading" className={h2Class}>
                What the checker tests
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className={strong}>Contrast in each scheme.</strong> axe-core&apos;s colour contrast rule runs once in light
                    and once in dark, and every failure is labelled dark only, light only or both, with the colours and ratio for each.
                  </li>
                  <li>
                    <strong className={strong}>Invisible text.</strong> Text the same colour as its background, a 1:1 ratio, is pulled
                    out as its own finding.
                  </li>
                  <li>
                    <strong className={strong}>Links lost in text.</strong> Links that differ from the words around them only by colour
                    must reach 3:1 against that text, under{" "}
                    <Link href="/wcag/1-4-1" className={linkClass}>
                      WCAG 1.4.1
                    </Link>
                    . A link colour chosen for white often fails on dark.
                  </li>
                  <li>
                    <strong className={strong}>Dark mode signals.</strong> The color-scheme meta tag, the CSS color-scheme on html and
                    body, prefers-color-scheme rules and light-dark() in the stylesheets, and whether any colour the page sets actually
                    changes between the two modes.
                  </li>
                  <li>
                    <strong className={strong}>Adaptive Dark Mode readiness.</strong> Whether Safari will adapt the page, and the
                    images, canvases and effects it may not handle well.
                  </li>
                </ul>
              </div>
            </section>

            <section aria-labelledby="blindspot-heading" className="mt-12 max-w-[68ch]">
              <h2 id="blindspot-heading" className={h2Class}>
                The dark mode blind spot in automated testing
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  The most common dark mode bug is a page that declares <code className="font-mono text-[0.95em]">color-scheme: light dark</code>{" "}
                  but hard-codes its text colour. In dark mode the browser paints the page background near-black (rgb 18, 18, 18 in
                  Chrome) while your dark grey text stays dark grey. In our tests that pair measured 1.17:1.
                </p>
                <p>
                  axe-core, the engine behind most automated checkers, reports no failure here. When the html and body backgrounds are
                  transparent it assumes the page is white, so it measures dark grey against white and passes it. This is an open axe-core
                  issue,{" "}
                  <a href="https://github.com/dequelabs/axe-core/issues/4608" {...extLinkProps}>
                    number 4608
                  </a>
                  . Before running axe, this checker sets the root background to the browser&apos;s own Canvas colour, which changes
                  nothing on screen but gives axe the real background to measure against.
                </p>
                <p>
                  The reverse case, a white card with the default text colour, turns into white on white. axe-core reports that as
                  needing review rather than as a failure, so the checker lists it separately as invisible text.
                </p>
              </div>
            </section>

            <section aria-labelledby="safari-heading" className="mt-12 max-w-[68ch]">
              <h2 id="safari-heading" className={h2Class}>
                Safari Adaptive Dark Mode and the color-scheme signals
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Safari 27.3 beta adds Adaptive Dark Mode. When a visitor turns it on, Safari darkens light pages itself, using a colour
                  transform that WebKit says aims for 4.5:1 contrast. WebKit gives the reason: almost 40% of page loads come from people
                  in dark mode, but only 10% of page loads support it.
                </p>
                <p>What decides whether your page is changed:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className={strong}>light dark declared:</strong> in the meta tag or as color-scheme on :root or body, and
                    Safari leaves the page alone. WebKit advises declaring it in the HTML or CSS, not later from JavaScript.
                  </li>
                  <li>
                    <strong className={strong}>light only:</strong> the opt-out. WebKit notes that the only keyword is not supported in
                    Safari 27.3 beta 1.
                  </li>
                  <li>
                    <strong className={strong}>Nothing declared:</strong> Safari estimates whether the page is mostly light or dark,
                    and adapts it if it is light.
                  </li>
                </ul>
                <p>
                  Safari leaves most images and all canvas content unchanged, inverts simple black and white logos, and may turn off masks
                  and blend modes. The preview in the results uses Chromium&apos;s automatic dark theme, which follows the same skip rules
                  in our tests but uses a different colour algorithm, so treat it as a rough guide. Read more in{" "}
                  <Link href="/blog/safari-adaptive-dark-mode-accessibility" className={linkClass}>
                    what Safari&apos;s Adaptive Dark Mode means for accessibility
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section aria-labelledby="wcag-heading" className="mt-12 max-w-[68ch]">
              <h2 id="wcag-heading" className={h2Class}>
                Does dark mode have to pass WCAG?
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <Link href="/wcag/1-4-3" className={linkClass}>
                    WCAG 1.4.3 Contrast (Minimum)
                  </Link>{" "}
                  asks for 4.5:1 for normal text and 3:1 for large text, and{" "}
                  <Link href="/wcag/1-4-11" className={linkClass}>
                    1.4.11 Non-text Contrast
                  </Link>{" "}
                  asks for 3:1 for controls and meaningful graphics. Note 6 of the WCAG 2.2 contrast ratio definition says authors need
                  not consider &quot;color changes made by the user agent, except where caused by authors&apos; code&quot;.
                </p>
                <p>
                  So Safari&apos;s Adaptive Dark Mode and Chrome&apos;s automatic dark theme are outside your conformance: the checker
                  reports them as readiness, not failures. A dark theme you wrote, or the dark canvas your color-scheme declaration
                  switches on, is caused by your code. Whether every theme an author provides must conform is still an open W3C question
                  (issues{" "}
                  <a href="https://github.com/w3c/wcag/issues/2889" {...extLinkProps}>
                    2889
                  </a>{" "}
                  and{" "}
                  <a href="https://github.com/w3c/wcag/issues/4317" {...extLinkProps}>
                    4317
                  </a>
                  ). Many auditors test both, and fixing dark-only failures is the safe course.
                </p>
              </div>
            </section>

            <section aria-labelledby="fix-heading" className="mt-12 max-w-[68ch]">
              <h2 id="fix-heading" className={h2Class}>
                How to fix dark mode contrast
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className={strong}>Set colours in pairs.</strong> Whenever you set a text colour, set its background too,
                    and give both a dark value. The CSS spec itself warns that mixing default colours with author colours cannot
                    guarantee contrast.
                  </li>
                  <li>
                    <strong className={strong}>Use light-dark() or prefers-color-scheme.</strong> light-dark() picks a value from the
                    used colour scheme; a prefers-color-scheme media query swaps custom properties.
                  </li>
                  <li>
                    <strong className={strong}>Declare it early.</strong> Put the color-scheme meta tag in the head so form controls,
                    scrollbars and the page background match from the first paint.
                  </li>
                  <li>
                    <strong className={strong}>Give images a dark version.</strong> Use SVG logos that draw with currentColor, or a
                    picture element with a source for prefers-color-scheme: dark.
                  </li>
                  <li>
                    <strong className={strong}>Check focus indicators.</strong> A dark blue focus ring vanishes on a dark page. The{" "}
                    <Link href="/recipes/two-tone-focus-ring" className={linkClass}>
                      two-tone focus ring recipe
                    </Link>{" "}
                    works on any background.
                  </li>
                </ul>
                <pre
                  tabIndex={0}
                  role="region"
                  aria-label="Code example: declaring dark mode support"
                  className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800"
                >
                  <code>{`<meta name="color-scheme" content="light dark">

:root {
  color-scheme: light dark;
  --text: light-dark(#1f2937, #e5e7eb);
  --surface: light-dark(#ffffff, #111827);
}
body { color: var(--text); background: var(--surface); }

<picture>
  <source srcset="logo-dark.png" media="(prefers-color-scheme: dark)">
  <img src="logo.png" alt="Acme">
</picture>`}</code>
                </pre>
                <p>
                  To build a palette that holds up in both modes, see the{" "}
                  <Link href="/guides/oklch-apca-color-systems" className={linkClass}>
                    guide to OKLCH and APCA colour systems
                  </Link>
                  , and check single colour pairs with the{" "}
                  <Link href="/tools/contrast-checker" className={linkClass}>
                    contrast checker
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section aria-labelledby="limits-heading" className="mt-12 max-w-[68ch]">
              <h2 id="limits-heading" className={h2Class}>
                Limitations
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <ul className="list-disc space-y-2 pl-6">
                  <li>One page, at 1280 by 800 pixels, as a first-time visitor with no cookies. Content inside iframes is not tested.</li>
                  <li>
                    Only the system preference is tested. A theme toggle on your site that sets a class when clicked is not exercised.
                  </li>
                  <li>
                    Text over images and gradients cannot be measured automatically, so it is listed for checking by eye. Non-text
                    contrast and focus indicators are not measured.
                  </li>
                  <li>
                    The dark canvas colour differs between browsers; Chrome&apos;s is rgb 18, 18, 18. A ratio near the threshold may come
                    out slightly differently in Safari or Firefox.
                  </li>
                  <li>
                    The Adaptive Dark Mode verdict follows WebKit&apos;s published rules. Safari&apos;s test for whether a page is mostly
                    light is not documented, and nothing a page or tool can measure shows Safari&apos;s adapted colours.
                  </li>
                </ul>
              </div>
            </section>

            <section aria-labelledby="sources-heading" className="mt-12 max-w-[68ch]">
              <h2 id="sources-heading" className={h2Class}>
                Sources
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-slate-700 dark:text-slate-300">
                {SOURCES.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} {...extLinkProps}>
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="dark mode contrast color-scheme prefers-color-scheme Safari Adaptive Dark Mode WCAG 1.4.3 contrast checker light dark theme"
                title="Related reading"
                maxItems={4}
                showDescriptions
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
