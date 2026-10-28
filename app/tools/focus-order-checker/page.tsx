import type { Metadata } from "next"
import Link from "next/link"
import FocusOrderChecker from "@/components/tools/focus-order-checker"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/tools/focus-order-checker"
const pageTitle = "Keyboard Focus Order Checker: Tab Through Any Web Page"
const pageDescription =
  "Tab through any public page in a real browser and see every focus stop numbered. Finds invisible focus, focus hidden by sticky headers, and keyboard traps."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "focus order checker",
    "tab order checker",
    "keyboard accessibility test",
    "keyboard navigation test",
    "focus indicator checker",
    "focus visible test",
    "keyboard trap test",
    "WCAG 2.4.7 focus visible",
    "WCAG 2.4.11 focus not obscured",
    "WCAG 2.5.8 target size checker",
    "target size checker",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Keyboard Focus Order Checker")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Keyboard focus order checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Keyboard Focus Order Checker")}&section=Free tool`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Keyboard Focus Order Checker", url: `https://accessibility.build${ROUTE}` },
]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"

const CRITERIA: { number: string; name: string; level: string; check: string }[] = [
  {
    number: "2.1.1",
    name: "Keyboard",
    level: "A",
    check:
      "Shows everything Tab reaches. A control that is missing from the list may only work with a mouse; the tool does not press anything, so confirm it by hand.",
  },
  {
    number: "2.1.2",
    name: "No Keyboard Trap",
    level: "A",
    check:
      "Flags focus that stays on one element or cycles through a few, then tries Escape and Shift+Tab to see whether either gets out.",
  },
  {
    number: "2.4.3",
    name: "Focus Order",
    level: "A",
    check:
      "Flags positive tabindex, focus that is dropped to the page mid-way, and big jumps back up the page. Whether the order makes sense is for you to judge from the numbered screenshot.",
  },
  {
    number: "2.4.7",
    name: "Focus Visible",
    level: "AA",
    check:
      "Compares each element focused and unfocused, pixel by pixel. If nothing changes, there is no visible indicator. Also flags focus landing on invisible, zero-size or off-screen elements.",
  },
  {
    number: "2.4.11",
    name: "Focus Not Obscured (Minimum)",
    level: "AA",
    check:
      "Samples points across each focused element to see whether a sticky header, cookie banner or other layer covers it completely. Partly covered is noted against 2.4.12 (AAA).",
  },
  {
    number: "2.5.8",
    name: "Target Size (Minimum)",
    level: "AA",
    check:
      "Target size mode measures every link, button and control against 24 by 24 pixels and applies the spacing, inline and browser-default exceptions.",
  },
]

const FAQS = [
  {
    question: "Can an automated tool tell whether my focus order is logical?",
    answer:
      "No. A logical order depends on what the page means, which only a person can judge. The checker records the order Tab actually follows and flags the patterns that usually signal a problem: positive tabindex, focus that jumps far back up the page, focus dropped mid-way, and loops. Use the numbered screenshot to read the order against the visual layout.",
  },
  {
    question: "How does it decide whether focus is visible?",
    answer:
      "For every stop it captures the element and a small margin around it while focused, removes focus and captures again, then counts the pixels that changed. No meaningful change means no visible indicator, which fails WCAG 2.4.7. If nothing changes in the tight capture it looks again over a wider area, so indicators drawn on a surrounding card are not missed. It records which styles changed as supporting evidence, but the pixels decide, because an outline in the same colour as the background changes the styles and not the screen.",
  },
  {
    question: "Does it check focus indicator contrast or thickness?",
    answer:
      "No. It checks that an indicator exists and can be seen, which is what 2.4.7 (AA) requires. How strong the indicator is belongs to 2.4.13 Focus Appearance, a AAA criterion, and needs a contrast and area measurement this tool does not make. A faint colour change on link text will pass here and may still be hard to see.",
  },
  {
    question: "Why did the check stop inside a cookie banner or dialog?",
    answer:
      "A modal dialog is supposed to keep focus inside it until it is closed. When that dialog is a cookie banner, the checker closes it once with its reject button where it has one, and carries on with the page. Other dialogs end the run, with a note on whether Escape released focus. The tool always loads the page as a first-time visitor with no cookies, so you see what a new visitor sees.",
  },
  {
    question: "What is the WCAG 2.5.8 target size rule?",
    answer:
      "Pointer targets such as links, buttons and checkboxes must be at least 24 by 24 CSS pixels, with exceptions: a smaller target passes if a 24 pixel circle centred on it does not touch any other target or another small target's circle; links inside a sentence are exempt; controls left at the browser's default size are exempt; and so are targets where another control does the same job at full size, or where the size is essential. The tool applies the first three and tells you to check the last two by hand.",
  },
  {
    question: "Which pages can it check?",
    answer:
      "Public pages that load without signing in. It uses Chrome at 1280 by 800 pixels, follows up to 80 Tab stops within about 25 seconds, and does not follow focus into embedded frames such as videos and maps. Some sites block automated browsers; when that happens you will see an error rather than a misleading result.",
  },
]

export default function FocusOrderCheckerPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Keyboard Focus Order Checker"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
      />
      <HowToStructuredData
        name="How to check a page's keyboard focus order"
        description="Tab through a public page in a real browser, then review every focus stop for a visible indicator, hidden focus and traps."
        steps={[
          { name: "Enter the page address", text: "Type or paste the address of a public page." },
          { name: "Choose what to check", text: "Pick focus order and visibility to press Tab through the page, or target size to measure every link and control against 24 by 24 pixels." },
          { name: "Read the screenshot", text: "Each focus stop or undersized target is numbered on a screenshot of the page. Square badges mark problems." },
          { name: "Work through the list", text: "The list gives each stop's role, name and problems with the WCAG criterion. Select Show on screenshot to find it on the page, then fix the source." },
        ]}
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
                <li className="text-slate-900 dark:text-white">Keyboard Focus Order Checker</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; No sign-up
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Tab through any page and see where focus goes
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Keyboard users, switch users and many screen reader users move through a page with the
              Tab key. This checker loads your page in Chrome, presses Tab the way they do, and
              numbers every stop on a screenshot. It flags stops with no visible focus, focus hidden
              behind sticky headers and cookie banners, and keyboard traps. A second mode measures
              every link and button against the 24 pixel minimum in WCAG 2.5.8.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <FocusOrderChecker />

            <section aria-labelledby="checks-heading" className="mt-14 max-w-[68ch]">
              <h2 id="checks-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What it checks
              </h2>
              <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">WCAG success criteria and what the checker does for each</caption>
                  <thead>
                    <tr>
                      {["Criterion", "Level", "What the checker does"].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {CRITERIA.map((criterion) => (
                      <tr key={criterion.number} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                          <Link href={`/wcag/${criterion.number.replace(/\./g, "-")}`} className={linkClass}>
                            {criterion.number} {criterion.name}
                          </Link>
                        </th>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{criterion.level}</td>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{criterion.check}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="limits-heading" className="mt-12 max-w-[68ch]">
              <h2 id="limits-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What automated tabbing cannot tell you
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  The checker reports what happens when Tab is pressed. That finds the most common
                  keyboard failures quickly, but it is not a keyboard audit, and a clean result does
                  not mean a page works from the keyboard.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">It cannot judge whether the order is logical.</strong>{" "}
                    It flags likely problems; reading the numbered screenshot against the layout is your job.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">It does not press Enter, Space or arrow keys.</strong>{" "}
                    Menus, tabs, sliders, grids and other widgets that use arrow keys inside a single Tab stop are not tested, and
                    neither are custom keyboard shortcuts or whether controls actually work when activated.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">It checks that focus is visible, not that it is clear.</strong>{" "}
                    Indicator contrast and thickness (2.4.13, AAA) are not measured.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">It sees one state of the page.</strong>{" "}
                    A first visit, on a 1280 by 800 desktop window, with motion reduced. Mobile layouts, signed-in pages and content
                    that opens only after a click are not covered, and focus inside embedded frames is not followed.
                  </li>
                </ul>
                <p>
                  Treat the results as a map of where to look, then confirm with a keyboard yourself. Our{" "}
                  <Link href="/guides/keyboard-accessibility" className={linkClass}>
                    keyboard accessibility guide
                  </Link>{" "}
                  covers manual testing step by step.
                </p>
              </div>
            </section>

            <section aria-labelledby="method-heading" className="mt-12 max-w-[68ch]">
              <h2 id="method-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How the focus tests work
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Computed styles cannot tell you whether focus is visible: an outline the same colour
                  as the background changes the styles but not the screen, and an indicator drawn on a
                  parent card or a pseudo-element does not show up on the element at all. So the
                  checker looks at pixels. At each stop it captures the element while focused, removes
                  focus, captures again, and restores focus. Chrome keeps the keyboard focus style when
                  focus is restored by script after a key press, so both captures are of the real
                  keyboard state. Transitions and animations are switched off first, so indicators are
                  captured in their final state, and the text cursor is hidden so it cannot pass for
                  an indicator.
                </p>
                <p>
                  When something changed, a third capture checks that the area is not changing on its
                  own, as videos and carousels do. Those stops are marked as unknown rather than
                  passed. To decide whether focus is hidden, the checker asks the browser which element
                  is on top at five points across the focused element, after the browser has scrolled
                  it into view. If something else is on top at every point, focus is entirely hidden.
                </p>
              </div>
            </section>

            <section aria-labelledby="targets-heading" className="mt-12 max-w-[68ch]">
              <h2 id="targets-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Target size and its exceptions
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <Link href="/wcag/2-5-8" className={linkClass}>
                    2.5.8 Target Size (Minimum)
                  </Link>{" "}
                  asks for pointer targets of at least 24 by 24 CSS pixels. A target can be smaller and
                  still pass in five ways, and the checker handles them as follows.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Spacing:</strong> a 24 pixel circle centred on
                    the small target must not touch any other target, or another small target&apos;s circle. Measured.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Inline:</strong> a link inside a sentence of
                    text. Detected from the surrounding text.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">User agent:</strong> a native control the
                    browser sizes, such as an unstyled checkbox. Detected by comparing it with the same control on a blank page.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Equivalent:</strong> another control on the
                    page does the same thing and is large enough. Not detected; check failures for this.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Essential:</strong> the size is essential to
                    the information, as with pins on a map. Not detected; check failures for this.
                  </li>
                </ul>
                <p>
                  The enhanced AAA criterion,{" "}
                  <Link href="/wcag/2-5-5" className={linkClass}>
                    2.5.5 Target Size (Enhanced)
                  </Link>
                  , asks for 44 by 44 pixels. The checker reports against the AA minimum only. To
                  measure targets on a phone screen, where they matter most, use the{" "}
                  <Link href="/tools/target-size-checker" className={linkClass}>
                    Target Size Checker
                  </Link>
                  , which opens on a 390 pixel phone viewport.
                </p>
              </div>
            </section>

            <section aria-labelledby="fix-heading" className="mt-12 max-w-[68ch]">
              <h2 id="fix-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Fixing what it finds
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">No visible focus:</strong> never remove the
                    outline without putting something in its place. A <code className="font-mono text-sm">:focus-visible</code>{" "}
                    rule shows it to keyboard users without showing it on mouse clicks.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Hidden behind a sticky header:</strong> set{" "}
                    <code className="font-mono text-sm">scroll-padding-top</code> on the page to the header&apos;s height, so the
                    browser scrolls focused elements clear of it. Cookie banners that cover content need the same space at the bottom,
                    or should not cover content at all.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Positive tabindex:</strong> replace it with{" "}
                    <code className="font-mono text-sm">tabindex=&quot;0&quot;</code> and change the source order instead.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Focus on hidden things:</strong> closed menus
                    and off-canvas panels should be <code className="font-mono text-sm">hidden</code> or{" "}
                    <code className="font-mono text-sm">inert</code>, not just moved off-screen. Skip links should appear when focused.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Traps and dialogs:</strong> keep focus in a
                    modal dialog only while it is open, close it with Escape, and send focus back to the control that opened it.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Small targets:</strong> add padding or a{" "}
                    <code className="font-mono text-sm">min-height</code> and <code className="font-mono text-sm">min-width</code>{" "}
                    of 24 pixels to icon buttons, or space them apart.
                  </li>
                </ul>
                <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 dark:border-slate-800">
                  <code>{`:focus-visible {
  outline: 3px solid #0f766e;
  outline-offset: 2px;
}

html {
  /* Height of the sticky header */
  scroll-padding-top: 5rem;
}`}</code>
                </pre>
                <p>
                  For more depth, see the guides to{" "}
                  <Link href="/guides/focus-management" className={linkClass}>
                    focus management
                  </Link>
                  ,{" "}
                  <Link href="/guides/skip-links" className={linkClass}>
                    skip links
                  </Link>
                  ,{" "}
                  <Link href="/guides/accessible-dialog" className={linkClass}>
                    accessible dialogs
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/accessible-menu" className={linkClass}>
                    accessible menus
                  </Link>
                  .
                </p>
              </div>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="keyboard accessibility focus order tab order focus visible focus indicator keyboard trap sticky header target size WCAG 2.4.7 2.4.11 2.5.8"
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
