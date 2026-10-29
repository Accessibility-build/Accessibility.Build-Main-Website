import type { Metadata } from "next"
import Link from "next/link"
import FocusOrderChecker from "@/components/tools/focus-order-checker"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

// The target size mode of the focus order checker, given its own page because people search for
// a target size or touch target checker by that name. Same component and route, opened on target
// size with the phone viewport, and copy about target size rather than focus.

const ROUTE = "/tools/target-size-checker"
const pageTitle = "Target Size Checker: WCAG 2.5.8 Touch Target Test"
const pageDescription =
  "Measure every link, button and control on a live page against the WCAG 2.5.8 minimum of 24 by 24 pixels, on a phone or desktop viewport, with the spacing and inline exceptions applied."

const ogImage = `/api/og?title=${encodeURIComponent("Target Size Checker")}&section=Free tool`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "target size checker",
    "touch target size checker",
    "tap target size checker",
    "WCAG 2.5.8 target size",
    "wcag target size",
    "wcag touch target size mobile",
    "minimum touch target size",
    "44 by 44 touch target",
    "24 by 24 target size",
    "target size minimum",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    siteName: "Accessibility.build",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Target size checker" }],
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
  { name: "Target Size Checker", url: `https://accessibility.build${ROUTE}` },
]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"

const SIZES: { source: string; minimum: string; status: string }[] = [
  { source: "WCAG 2.2, 2.5.8 Target Size (Minimum)", minimum: "24 by 24 CSS pixels, or enough spacing", status: "Level AA, the usual legal benchmark" },
  { source: "WCAG 2.1 and 2.2, 2.5.5 Target Size (Enhanced)", minimum: "44 by 44 CSS pixels", status: "Level AAA, a stretch goal" },
  { source: "Apple Human Interface Guidelines", minimum: "44 by 44 points", status: "Platform design guidance for iOS" },
  { source: "Material Design (Android)", minimum: "48 by 48 density-independent pixels", status: "Platform design guidance for Android" },
]

const FAQS = [
  {
    question: "What is the minimum target size in WCAG?",
    answer:
      "WCAG 2.2 success criterion 2.5.8 Target Size (Minimum), Level AA, asks for pointer targets of at least 24 by 24 CSS pixels. A smaller target still passes if it has enough space around it, if it is a link inside a sentence, if the browser sets its size, if another control does the same job at full size, or if the small size is essential. 2.5.5 Target Size (Enhanced), Level AAA, asks for 44 by 44 CSS pixels.",
  },
  {
    question: "Is the WCAG touch target size 44 by 44 or 24 by 24?",
    answer:
      "Both, at different levels. 24 by 24 CSS pixels is the AA minimum added in WCAG 2.2, and AA is what most laws and contracts point to. 44 by 44 is the AAA enhanced level from WCAG 2.1. Apple recommends 44 by 44 points and Material Design 48 by 48 density-independent pixels for touch screens, so on mobile, designing to 44 or 48 and testing against 24 is a sensible approach.",
  },
  {
    question: "How does the spacing exception work?",
    answer:
      "Imagine a circle 24 pixels across centred on each target that is smaller than 24 by 24. The target passes if its circle does not touch any other target, or the circle of another small target. In practice a row of 16 pixel icons spaced 24 pixels apart, centre to centre, passes; the same icons packed together fail. The checker draws these circles and tests every pair.",
  },
  {
    question: "Why check on a phone viewport?",
    answer:
      "Responsive pages often shrink controls, stack them closer together or swap in icon-only buttons on small screens, and touch is less precise than a mouse pointer. A page can pass at desktop width and fail on a phone. The phone option loads the page at 390 by 844 pixels with touch emulation and a mobile user agent, so you see the layout a phone gets.",
  },
  {
    question: "Does the checker count the clickable area or the visible size?",
    answer:
      "The clickable area: the element's box as the browser lays it out, including padding. An icon that looks 16 pixels wide inside a button with 4 pixels of padding on each side is a 24 pixel target, and passes. A transparent ::before or ::after that extends the hit area past the box counts too, unless it overlaps another target (overlapping area does not count) or a container clips it.",
  },
  {
    question: "What can it not check?",
    answer:
      "Whether a small target is essential, as with pins on a map, and whether another control on the page does the same thing at full size. Both are exceptions in 2.5.8, so check any failures against them by hand. It also measures one state of the page, as a first-time visitor, so targets that appear only after a click are not included.",
  },
]

export default function TargetSizeCheckerPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Target Size Checker"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
      />
      <HowToStructuredData
        name="How to check a page's touch target sizes against WCAG 2.5.8"
        description="Measure every link, button and control on a live page against 24 by 24 CSS pixels, with the spacing exception applied."
        steps={[
          { name: "Enter the page address", text: "Type or paste the address of a public page." },
          { name: "Choose the screen size", text: "Phone loads the page at 390 by 844 pixels with touch emulation; desktop loads it at 1280 by 800." },
          { name: "Read the results", text: "Every undersized target is outlined on a screenshot of the page and listed with its size, and failures name the nearest target it is too close to." },
          { name: "Fix and recheck", text: "Add padding or a minimum size to failing targets, or space them apart, then run the check again." },
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
                <li className="text-slate-900 dark:text-white">Target Size Checker</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; No sign-up
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Are your buttons and links big enough to tap?
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Small, crowded targets are hard to hit for people with tremors, limited dexterity or low
              vision, and for anyone using a phone one-handed. This checker loads a live page in
              Chrome, on a phone or desktop screen, and measures every link, button and control
              against the 24 by 24 pixel minimum in WCAG 2.5.8, with the spacing and inline
              exceptions worked out for you.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <FocusOrderChecker initialMode="targets" initialDevice="mobile" source="target_size_checker" />

            <section aria-labelledby="sizes-heading" className="mt-14 max-w-[68ch]">
              <h2 id="sizes-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Which target size applies
              </h2>
              <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
                The figure people quote depends on who they are reading. WCAG sets the requirement you
                can be held to; the platform guidelines are design advice for touch screens.
              </p>
              <div tabIndex={0} role="region" aria-label="Target size minimums from WCAG and platform design guidelines" className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">Target size minimums from WCAG and platform design guidelines</caption>
                  <thead>
                    <tr>
                      {["Source", "Minimum", "Status"].map((heading) => (
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
                    {SIZES.map((row) => (
                      <tr key={row.source} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                          {row.source}
                        </th>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{row.minimum}</td>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Read the criteria in full:{" "}
                <Link href="/wcag/2-5-8" className={linkClass}>
                  2.5.8 Target Size (Minimum)
                </Link>{" "}
                and{" "}
                <Link href="/wcag/2-5-5" className={linkClass}>
                  2.5.5 Target Size (Enhanced)
                </Link>
                .
              </p>
            </section>

            <section aria-labelledby="exceptions-heading" className="mt-12 max-w-[68ch]">
              <h2 id="exceptions-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                The exceptions, and which ones the checker applies
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  A target smaller than 24 by 24 pixels is not automatically a failure. 2.5.8 has five
                  exceptions, and most undersized targets on a typical page pass through one of them.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Spacing (measured):</strong>{" "}a 24 pixel circle
                    centred on the small target does not touch any other target, or another small target&apos;s circle.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Inline (detected):</strong> the target is a
                    link in a sentence or block of text, where the line height sets its size.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">User agent control (detected):</strong> the
                    browser decides the size and the author has not changed it, as with an unstyled checkbox.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Equivalent (check by hand):</strong> another
                    control on the same page does the same thing and meets the size.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Essential (check by hand):</strong> the size is
                    part of the information, as with pins on a map or a legally required presentation.
                  </li>
                </ul>
                <p>
                  The results separate targets that pass by spacing from those that fail, so you can see
                  where a redesign that tightens the spacing would tip a page into failure.
                </p>
              </div>
            </section>

            <section aria-labelledby="fix-heading" className="mt-12 max-w-[68ch]">
              <h2 id="fix-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How to fix small targets
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Icon buttons:</strong> keep the icon small if
                    you like, and give the button padding or a minimum size so the clickable box reaches 24 pixels, or 44 on touch
                    screens.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Rows of links:</strong> social icons, pagination
                    and footer links fail most often because they sit close together. Add a gap so their centres are at least 24
                    pixels apart.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Close buttons and dismiss icons:</strong> a 12
                    pixel cross in a corner is a classic failure on cookie banners and modal dialogs. Make the button the size of a
                    finger, not the size of the glyph.
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900 dark:text-white">Custom checkboxes and radios:</strong> make the
                    label clickable and large, so the whole row is the target.
                  </li>
                </ul>
                <pre tabIndex={0} role="region" aria-label="Code example" className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                  <code>{`/* A 16px icon in a 44px touch target */
.icon-button {
  display: inline-grid;
  place-items: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
}

/* Space a row of small links so each 24px circle stays clear */
.social-links {
  display: flex;
  gap: 12px;
}`}</code>
                </pre>
                <p>
                  Targets are one part of mobile accessibility. The{" "}
                  <Link href="/guides/mobile-accessibility" className={linkClass}>
                    mobile accessibility guide
                  </Link>{" "}
                  covers orientation, reflow, gestures and zoom, and the{" "}
                  <Link href="/tools/focus-order-checker" className={linkClass}>
                    keyboard focus order checker
                  </Link>{" "}
                  uses the same engine to tab through the page and check focus.
                </p>
                <p>
                  To grow a small icon button without changing its look, see the{" "}
                  <Link href="/recipes/invisible-hit-area" className={linkClass}>
                    invisible hit area recipe
                  </Link>
                  . This checker counts a hit area added with an absolutely positioned ::before or ::after, so a 16 pixel
                  icon with a 24 pixel hit area passes here, unless the hit area overlaps a neighbour or a container clips it.
                </p>
              </div>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="target size touch target tap target mobile accessibility WCAG 2.5.8 2.5.5 button size spacing"
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
