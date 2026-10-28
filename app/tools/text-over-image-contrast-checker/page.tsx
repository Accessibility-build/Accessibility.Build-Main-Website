import type { Metadata } from "next"
import Link from "next/link"
import TextOverImageContrastChecker from "@/components/tools/text-over-image-contrast-checker"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/tools/text-over-image-contrast-checker"
const pageTitle = "Text Over Image Contrast Checker: Every Pixel, WCAG 1.4.3"
const pageDescription =
  "Check text on photos, gradients and hero images. Mark the text and see the worst contrast ratio across every background pixel, a heatmap of what fails, and the overlay opacity that fixes it. The image never leaves your browser."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "text over image contrast checker",
    "text on image contrast",
    "background image contrast checker",
    "hero image text contrast",
    "gradient contrast checker",
    "contrast checker for images",
    "text on photo accessibility",
    "image overlay opacity for contrast",
    "WCAG 1.4.3 background image",
    "colour contrast text over picture",
    "color contrast text over image",
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
        url: `/api/og?title=${encodeURIComponent("Text Over Image Contrast Checker")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Text over image contrast checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Text Over Image Contrast Checker")}&section=Free tool`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Text Over Image Contrast Checker", url: `https://accessibility.build${ROUTE}` },
]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"

const FAQS = [
  {
    question: "Why does the tool report the worst point instead of an average?",
    answer:
      "WCAG 1.4.3 has no averaging rule. Text needs the minimum ratio against the background it sits on, so when the background is a photo or a gradient, the part with the least contrast decides the result. An average can pass while a third of a headline is unreadable over a bright patch of sky. The tool still shows the share of the background that passes and the 5th percentile, which tell you whether a failure is a small spot or most of the area.",
  },
  {
    question: "Is my image uploaded anywhere?",
    answer:
      "No. The image is read by your browser and measured there. Nothing is sent to our servers, so it is safe to check unreleased designs and screenshots of private pages.",
  },
  {
    question: "Why are the pixels right next to the letters skipped?",
    answer:
      "Text is drawn with anti-aliasing: the pixels along each letter's edge are a blend of the text colour and the background. They are not background, and counting them would make almost any text look as if it fails. The tool skips background pixels within 2 pixels of a text pixel and measures everything else in the marked area.",
  },
  {
    question: "How is the overlay opacity worked out?",
    answer:
      "The tool composites a black and a white overlay over every distinct background colour in the area, one percent of opacity at a time, exactly as a browser blends a semi-transparent layer, and reports the lowest opacity at which every point passes the threshold you chose. It assumes the words are live text on top of the overlay. If the words are part of the image file, the overlay darkens them too and the figure does not apply.",
  },
  {
    question: "Does a text-shadow count towards contrast?",
    answer:
      "It can. W3C's guidance on 1.4.3 treats a wide border or halo that surrounds the letters as their background, so a dark halo can supply the contrast. A faint, blurred or offset shadow leaves parts of each letter against the image, which usually still fails. Take a screenshot with the shadow applied and measure it here.",
  },
  {
    question: "Which ratio should I check against?",
    answer:
      "4.5:1 for normal text and 3:1 for large text (at least 24 px, or 18.66 px bold) under 1.4.3 at Level AA, and 7:1 and 4.5:1 under 1.4.6 at Level AAA. Icons and other graphics that carry meaning need 3:1 under 1.4.11. Logos and text that is purely decorative are exempt from 1.4.3.",
  },
]

export default function TextOverImageContrastCheckerPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Text Over Image Contrast Checker"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="DesignApplication"
        operatingSystem="Any"
      />
      <HowToStructuredData
        name="How to check the contrast of text over an image"
        description="Load a screenshot, mark the text, and read the worst contrast ratio against every background pixel."
        steps={[
          { name: "Load the image", text: "Choose, drop or paste a screenshot or design export. It stays in your browser." },
          { name: "Mark the text", text: "Drag a box around the text, or set the area with the number fields and arrow keys." },
          { name: "Read the worst point", text: "The worst ratio decides pass or fail. The heatmap and summary show where the background fails." },
          { name: "Apply the fix", text: "Copy the overlay CSS with the smallest opacity that passes, or use a panel or halo behind the text." },
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
                <li className="text-slate-900 dark:text-white">Text Over Image Contrast Checker</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; Runs in your browser
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Contrast for text over images, measured at every pixel
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              A colour picker samples one point of a photo. Text over an image has to pass against all of them. Mark the
              text in a screenshot and this tool scores it against every background pixel, shows where it fails, and works
              out the overlay that fixes it. The image is measured in your browser and never uploaded.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <TextOverImageContrastChecker />

            <section aria-labelledby="why-heading" className="mt-14 max-w-[68ch]">
              <h2 id="why-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Why the worst point decides it
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <Link href="/wcag/1-4-3" className={linkClass}>
                    WCAG 1.4.3 Contrast (Minimum)
                  </Link>{" "}
                  asks for a ratio between the text and its background: 4.5:1 for normal text, 3:1 for large text. It has no
                  rule for averaging. On a flat colour there is one background, so one number. On a photo or a gradient the
                  background changes under every letter, and the text has to meet the ratio against all of it. The part of
                  the image with the least contrast is the part someone cannot read, so that is the number that passes or fails.
                </p>
                <p>
                  W3C documents this as a named failure, F83: background images that do not give foreground text enough
                  contrast. It is an easy failure to miss: a design can pass a colour check because the text was checked against
                  the image&apos;s average colour, or against the part of the image that shows at one screen width.
                </p>
                <p>
                  That is why the tool leads with the worst ratio. The share of the background that passes and the 5th
                  percentile are there to show the size of the problem: a worst point of 2:1 with 98% passing is a small
                  bright spot to cover; a 5th percentile below the threshold means the whole design needs an overlay or a
                  different image.
                </p>
              </div>
            </section>

            <section aria-labelledby="how-heading" className="mt-12 max-w-[68ch]">
              <h2 id="how-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How the measurement works
              </h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-700 dark:text-slate-300">
                <li>
                  The marked area is read at the image&apos;s own resolution. Areas over 4 megapixels are scaled down to 4
                  megapixels first, and the results say so. Transparent pixels are treated as white.
                </li>
                <li>
                  The text colour is detected or set by you. Detection splits the area into light and dark groups and takes
                  the most common colour of the group that is shaped like text: thin strokes that stay inside the area. Every
                  pixel within the tolerance of the text colour counts as text.
                </li>
                <li>
                  Background pixels within 2 pixels of the text are skipped, because anti-aliasing blends them with the letters.
                </li>
                <li>
                  Every remaining pixel is scored with the WCAG 2 formula, the same one our{" "}
                  <Link href="/tools/contrast-checker" className={linkClass}>
                    contrast checker
                  </Link>{" "}
                  uses. The tool reports the worst ratio, the 5th percentile, the share that passes each threshold, where the
                  failures are, and the APCA value at the worst point for reference.
                </li>
              </ol>
            </section>

            <section aria-labelledby="fix-heading" className="mt-12 max-w-[68ch]">
              <h2 id="fix-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Ways to fix text that fails over an image
              </h2>
              <div
                role="region"
                aria-label="Fixes table, scrolls sideways on small screens"
                tabIndex={0}
                className="mt-6 overflow-x-auto rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800"
              >
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">Fixes for text over images and when each one fits</caption>
                  <thead>
                    <tr>
                      {["Fix", "How", "Good to know"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {[
                      ["Overlay (scrim)", "A semi-transparent black or white layer between the image and the text", "The tool gives the smallest opacity that passes. A gradient scrim that is darkest behind the text keeps more of the photo."],
                      ["Panel behind the text", "A solid or semi-opaque background on the text element itself", "The same opacity as the overlay works, and the rest of the image is untouched."],
                      ["Halo", "A wide, dark text-shadow that surrounds every letter", "Counts as the background only if it surrounds the letters fully. Measure a screenshot."],
                      ["Move or recrop", "Place the text over a calm, even part of the image", "Check every breakpoint: background-size: cover crops differently at each width."],
                      ["Change the text colour", "White or near-black text", "Mid-tone text leaves no room: no overlay can rescue it on a busy image."],
                    ].map(([fix, how, note]) => (
                      <tr key={fix} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                          {fix}
                        </th>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{how}</td>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The{" "}
                <Link href="/guides/text-over-images" className={linkClass}>
                  text over images guide
                </Link>{" "}
                sets out each of these fixes with CSS you can copy. The criteria are{" "}
                <Link href="/wcag/1-4-3" className={linkClass}>
                  1.4.3 Contrast (Minimum)
                </Link>{" "}
                (AA),{" "}
                <Link href="/wcag/1-4-6" className={linkClass}>
                  1.4.6 Contrast (Enhanced)
                </Link>{" "}
                (AAA) and, for icons and graphics over images,{" "}
                <Link href="/wcag/1-4-11" className={linkClass}>
                  1.4.11 Non-text Contrast
                </Link>{" "}
                (AA). To see how a page looks with colour vision deficiency or blur, try the{" "}
                <Link href="/tools/website-vision-simulator" className={linkClass}>
                  website vision simulator
                </Link>
                .
              </p>
            </section>

            <section aria-labelledby="limits-heading" className="mt-12 max-w-[68ch]">
              <h2 id="limits-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What the tool cannot tell you
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-700 dark:text-slate-300">
                <li>
                  It separates text from background by colour. Where the background contains the text colour itself, those
                  pixels count as text and are left out, so the result can be optimistic. Turn on the text tint to check.
                </li>
                <li>
                  Text in more than one colour, gradient text and text with an outline need to be checked one colour at a
                  time: set each colour and mark the letters that use it.
                </li>
                <li>
                  It measures the screenshot you give it. A responsive page shows different parts of the image at different
                  widths, and a carousel or video shows different frames, so check each one that carries text.
                </li>
                <li>
                  Heavy JPEG compression adds noise around letters. Raise the tolerance if the letter edges show as failing,
                  and prefer a PNG screenshot.
                </li>
                <li>
                  Contrast is one requirement among several. Text that is part of the image file also needs to meet{" "}
                  <Link href="/wcag/1-4-5" className={linkClass}>
                    1.4.5 Images of Text
                  </Link>{" "}
                  and have a text alternative.
                </li>
              </ul>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="text over image contrast background image overlay hero WCAG 1.4.3 colour contrast gradient"
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
