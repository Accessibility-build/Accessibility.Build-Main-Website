import type { Metadata } from "next"
import Link from "next/link"
import AltTextChecker from "@/components/tools/alt-text-checker"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/tools/alt-text-checker"
const pageTitle = "Alt Text Checker: Audit Every Image on a Page"
const pageDescription =
  "Check the alt text of every image on a web page: missing alt, image links with no name, file names, placeholders and redundant text, plus an optional AI review that suggests better alt text."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "alt text checker",
    "alt tag checker",
    "image alt text checker",
    "check alt text on a website",
    "missing alt text",
    "alt attribute checker",
    "image accessibility checker",
    "decorative image alt",
    "AI alt text review",
    "WCAG 1.1.1 non-text content",
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
        url: `/api/og?title=${encodeURIComponent("Alt Text Checker")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Alt text checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Alt Text Checker")}&section=Free tool`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Alt Text Checker", url: `https://accessibility.build${ROUTE}` },
]

const FAQS = [
  {
    question: "What does the alt text checker check?",
    answer:
      "Every img (including those inside picture), image button, image map area, element with role=\"img\" and inline SVG that a visitor can see. It fails images with no alt attribute, links and buttons whose only content is an image without a text alternative, file names and placeholder words used as alt, and role=\"img\" with no name. It flags for review alt text over 150 characters, alt that repeats the caption or the link's own text, the same alt on different images, \"click here\" or \"link to\" in alt, SVGs with no name that are not hidden, and images named only by a title attribute. Hidden images and tracking pixels are skipped.",
  },
  {
    question: "When should an image have an empty alt attribute?",
    answer:
      "When it adds nothing a screen reader user needs: a decorative flourish, a divider, a background-style photo, or an image whose meaning is already in the text right next to it, such as a product photo beside the product name inside the same link. alt=\"\" tells assistive technology to skip it. Never leave the attribute out instead, because many screen readers then read the file name. And never use alt=\"\" on an image that is the only content of a link or button, because the control is then left with no name.",
  },
  {
    question: "What should the alt text of a linked image or icon button say?",
    answer:
      "What the control does, not what the picture looks like. A logo that links to the home page should say something like \"Acme home page\" or just \"Acme\"; a magnifying glass button should say \"Search\". If the link or button already has visible text, give the image alt=\"\" so the name is not read twice. WCAG 2.4.4 Link Purpose and 4.1.2 Name, Role, Value both depend on this.",
  },
  {
    question: "How long should alt text be?",
    answer:
      "WCAG sets no limit. Most good alt text is a short phrase or sentence, because a screen reader user cannot skim it or jump back a few words. This checker flags anything over 150 characters for review rather than failing it: long descriptions usually belong in a visible caption or nearby text, and complex images such as charts need a short alt plus a fuller description elsewhere on the page.",
  },
  {
    question: "How does the AI review work, and what does it cost?",
    answer:
      "Tick the AI review box and the checker picks up to eight images, starting with those missing alt, then images that are the only content of a link or button, then large images. Each is captured as a screenshot on its own and sent, with its current alt and nearby text, to a third-party vision model, which judges whether the alt fits and suggests better text. Without an account you get two reviews a day; signed in, a review costs 2 credits. Nothing is charged if the review does not complete. The rule checks are always free.",
  },
  {
    question: "Does a clean result mean the page meets WCAG 1.1.1?",
    answer:
      "No. Rules can find alt text that is missing or malformed, but not alt text that is wrong: \"Two people at a desk\" passes every rule even if the photo shows a bridge. The AI review is a second opinion and can be wrong too. Whether each image's text alternative serves the same purpose is a judgement a person has to make, and 1.1.1 also covers CSS background images, canvas, icon fonts, audio and video, which this tool does not check.",
  },
]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200"

export default function AltTextCheckerPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Alt Text Checker"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
      />
      <HowToStructuredData
        name="How to check the alt text of every image on a web page"
        description="Load the page in the checker, read what the rules and the optional AI review found, and fix each image's text alternative."
        steps={[
          { name: "Enter the page address", text: "Type or paste the address of a public page. The checker loads it in a real browser and scrolls it so lazy images load." },
          { name: "Choose the AI review if you want it", text: "Tick the box to have a vision model judge up to eight images in context and suggest alt text. The rule checks run either way." },
          { name: "Work through the results", text: "Start with Failures, then Needs review. Each image shows its current alt exactly as the page has it, what the rules found and the WCAG criteria involved." },
          { name: "Fix and check again", text: "Change the alt text in your site, using the suggestions as a starting point, then run the check again. Download the CSV to track the work." },
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
                <li className="text-slate-900 dark:text-white">Alt Text Checker</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; No sign-up
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Check the alt text of every image on a page
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Enter a page address and every image a visitor can see is checked: missing alt attributes,
              linked images and image buttons that leave the control with no name, file names and
              placeholder words used as alt, and alt text that repeats the caption or link beside it. Turn
              on the AI review and a vision model looks at up to eight images in context and suggests
              better text.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <AltTextChecker />

            <section aria-labelledby="context-heading" className="mt-14 max-w-[68ch]">
              <h2 id="context-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Good alt text depends on what the image is doing
              </h2>
              <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
                The same photo can need a full sentence on one page and nothing at all on another. Before
                writing alt text, decide what the image does there.
              </p>
              <div tabIndex={0} role="region" aria-label="Kinds of image, what their alt text should say, and an example" className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">Kinds of image, what their alt text should say, and an example</caption>
                  <thead>
                    <tr>
                      {["Kind of image", "What the alt should say", "Example"].map((h) => (
                        <th key={h} scope="col" className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {[
                      ["Informative", "What it shows that matters here, in a phrase or a sentence", "Volunteers planting trees along the canal towpath"],
                      ["Functional (links and buttons)", "Where the link goes or what the button does", "Acme home page; Search; Next photo"],
                      ["Decorative", "Nothing: alt=\"\", so screen readers skip it", "A wave divider; a photo beside the same words in the same link"],
                      ["Complex (charts, diagrams, maps)", "The point it makes, with the detail in nearby text or a linked description", "Bar chart: sales doubled between 2023 and 2025"],
                      ["Text in images", "The words shown, when they matter", "Summer sale: 30% off all lamps"],
                    ].map(([kind, say, example]) => (
                      <tr key={kind} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">{kind}</th>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{say}</td>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Avoid starting with &ldquo;image of&rdquo; or &ldquo;picture of&rdquo;: screen readers already
                  say it is an image. Text in images is better as real text where possible, which{" "}
                  <Link href="/wcag/1-4-5" className={linkClass}>1.4.5 Images of Text</Link> asks for at Level
                  AA, and logos are the exception. For charts, the{" "}
                  <Link href="/guides/accessible-charts" className={linkClass}>accessible charts guide</Link>{" "}
                  covers the data table that makes the real text alternative. Our guide on{" "}
                  <Link href="/guides/how-to-write-alt-text" className={linkClass}>how to write alt text</Link>{" "}
                  shows good alt text for each kind of image, with examples.
                </p>
                <p>
                  Need a first draft for a single image? The{" "}
                  <Link href="/tools/alt-text-generator" className={linkClass}>AI alt text generator</Link>{" "}
                  writes one from an upload or an image address. To see the name every control on a page
                  exposes, not only the images, use the{" "}
                  <Link href="/tools/accessible-name-previewer" className={linkClass}>accessible name previewer</Link>.
                </p>
              </div>
            </section>

            <section aria-labelledby="checks-heading" className="mt-12 max-w-[68ch]">
              <h2 id="checks-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What the checker looks for
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="text-slate-900 dark:text-white">Failures</strong>{" "}are problems a rule can
                  be sure of: no alt attribute, a link or button whose only content is an image with no text
                  alternative (including an icon hidden with aria-hidden), a file name such as IMG_2041.jpg
                  used as alt, placeholder text such as &ldquo;image&rdquo; or &ldquo;logo&rdquo; on its own,
                  and role=&quot;img&quot; with no name. These fail{" "}
                  <Link href="/wcag/1-1-1" className={linkClass}>1.1.1 Non-text Content</Link>, and for links
                  and buttons{" "}
                  <Link href="/wcag/2-4-4" className={linkClass}>2.4.4 Link Purpose</Link> or{" "}
                  <Link href="/wcag/4-1-2" className={linkClass}>4.1.2 Name, Role, Value</Link> as well.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Needs review</strong>{" "}covers things that
                  are usually wrong but need a person to confirm: alt over 150 characters, alt that repeats
                  the caption or the link&apos;s own text, the same alt on images of different files,
                  &ldquo;click here&rdquo; or &ldquo;link to&rdquo; in alt, an SVG with no name that is not
                  hidden, and an image named only by its title attribute.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Decorative and fine</strong>{" "}means
                  alt=&quot;&quot; (or an equivalent) on an image that is not the only content of a link or
                  button. The rules accept it; whether the image really is decorative is a judgement, which
                  is one thing the AI review looks at.
                </p>
              </div>
            </section>

            <section aria-labelledby="limits-heading" className="mt-12 max-w-[68ch]">
              <h2 id="limits-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What it cannot tell you
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-slate-700 dark:text-slate-300">
                <li>
                  Whether alt text is accurate. A rule cannot see the picture. The AI review can, but it
                  works from a screenshot and a little nearby text, and it makes mistakes. A person who
                  knows what the page is for decides.
                </li>
                <li>
                  Images it does not reach: CSS background images (counted, not checked), images inside
                  frames, canvas drawings, icon fonts, and images that appear only after a click or a
                  form step.
                </li>
                <li>
                  More than one page at a time, or more than the first 300 images on a page. Some sites
                  block automated browsers, and those cannot be checked at all.
                </li>
              </ul>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="alt text image accessibility alt attribute decorative images WCAG 1.1.1 non-text content link purpose screen reader"
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
