import type { Metadata } from "next"
import Link from "next/link"
import WebsiteVisionSimulator from "@/components/tools/website-vision-simulator"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/tools/website-vision-simulator"
const pageTitle = "Website Vision Simulator: Colour Blindness and Low Vision"
const pageDescription =
  "See a web page as it might look with protanopia, deuteranopia, tritanopia, achromatopsia, blurred vision or low contrast sensitivity. Enter a URL or upload a screenshot, compare with the original, and find information carried by colour alone."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "website colour blindness simulator",
    "color blindness simulator website",
    "colour blind website checker",
    "vision simulator",
    "low vision simulator",
    "deuteranopia simulator",
    "protanopia simulator",
    "tritanopia simulator",
    "achromatopsia simulator",
    "blurred vision simulator",
    "WCAG 1.4.1 use of colour",
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
        url: `/api/og?title=${encodeURIComponent("Website Vision Simulator")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Website vision simulator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Website Vision Simulator")}&section=Free tool`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Website Vision Simulator", url: `https://accessibility.build${ROUTE}` },
]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"

const FAQS = [
  {
    question: "How accurate is a colour blindness simulation?",
    answer:
      "It is a model, not a recording of anyone's sight. The colour vision filters use the Machado, Oliveira and Fernandes (2009) model, which is widely used for this, and show a typical result for each type. Two people with the same diagnosis can see differently, and the model does not include things like viewing conditions or how a person has learned to use the cues they have. Use the simulation to spot designs that depend on colour, then fix them so they no longer depend on it.",
  },
  {
    question: "Which conditions does it simulate?",
    answer:
      "Protan, deutan and tritan colour vision deficiency, each from a mild anomalous form up to the full loss of one cone type (protanopia, deuteranopia, tritanopia); achromatopsia, shown as lightness only; blurred vision at three illustrative levels; and low contrast sensitivity, shown as halved contrast with slight softening. Low vision covers far more than blur, including field loss and light sensitivity, which a screenshot filter cannot represent.",
  },
  {
    question: "Does a page that looks fine in every simulation meet WCAG?",
    answer:
      "Not on its own. WCAG 1.4.1 Use of Color asks that colour is never the only way information is conveyed, which a simulation helps you find, but 1.4.3 and 1.4.11 set measured contrast ratios that only a contrast check can confirm. Many other criteria have nothing to do with vision at all. Run an automated scan and check contrast with a contrast checker as well.",
  },
  {
    question: "Why does the screenshot look different from the page in my browser?",
    answer:
      "Our server loads the page once, 1280 pixels wide, as a new signed-out visitor with reduced motion turned on, so you may see a cookie banner, a different hero image or a paused carousel. The screenshot stops at 4,000 pixels. Some sites block automated browsers altogether; for those, and for pages behind a login, take a screenshot yourself and upload it.",
  },
  {
    question: "Is my page or image stored?",
    answer:
      "An uploaded image never leaves your browser. For a web address, our server loads the page, sends the screenshot back to your browser and does not keep it. As with our other URL tools, we log the site that was checked and whether the capture worked.",
  },
  {
    question: "Why not just switch on a colour blindness filter in the operating system?",
    answer:
      "Operating system colour filters are designed to help people with colour vision deficiency tell colours apart, so they shift colours rather than simulate the deficiency. Browser developer tools do include vision deficiency emulation, which is a good way to check a page you are building. This tool works on any public page or image without developer tools, compares the result with the original side by side, and adds severity levels, blur and low contrast sensitivity.",
  },
]

export default function WebsiteVisionSimulatorPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Website Vision Simulator"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="DesignApplication"
        operatingSystem="Any"
      />
      <HowToStructuredData
        name="How to check a web page for colour-only meaning with a vision simulator"
        description="Capture a page or upload a screenshot, apply each simulation, and look for information that disappears."
        steps={[
          { name: "Load the page", text: "Enter a public web address, or upload a screenshot or design." },
          { name: "Choose a condition", text: "Pick protan, deutan or tritan colour vision deficiency, achromatopsia, blurred vision or low contrast sensitivity." },
          { name: "Compare with the original", text: "Use the split or side-by-side view to see what changes." },
          { name: "Fix what disappears", text: "Anything you can only tell apart by colour needs text, an icon, a pattern or an underline as well." },
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
                <li className="text-slate-900 dark:text-white">Website Vision Simulator</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; No sign-up
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Does your page still make sense without colour or sharp vision?
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Enter a web address or upload a screenshot and see it through simulations of colour vision deficiency,
              achromatopsia, blurred vision and low contrast sensitivity, next to the original. It is the quickest way to
              find links, errors and charts that only colour tells apart.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <WebsiteVisionSimulator />

            <section aria-labelledby="can-heading" className="mt-14 max-w-[68ch]">
              <h2 id="can-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What a simulation can and cannot show
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Colour vision deficiency is common. Colour Blind Awareness estimates it affects about 1 in 12 men and 1 in 200
                  women, most often as a reduced ability to tell reds and greens apart. Simulations make that easy to design
                  for: if two states of a control, two lines on a chart or an error and a success message become the same
                  colour in the filter, you have found information carried by colour alone. The{" "}
                  <Link href="/guides/color-blind-friendly-design" className={linkClass}>
                    colour blind friendly design guide
                  </Link>{" "}
                  shows how to fix it for links, form errors, status messages and charts.
                </p>
                <p>
                  What a simulation cannot do is show you what a particular person sees. The filters here apply a published
                  model of typical cone loss, an illustrative blur and a flat loss of contrast. Real vision varies with the
                  person, the condition, the screen and the light, and many forms of low vision, such as field loss or
                  sensitivity to glare, cannot be shown on a screenshot at all. Treat a simulation as a way to find problems,
                  never as proof that a design works for someone.
                </p>
                <p>
                  A simulation also cannot measure contrast. If text fades badly under blur or low contrast sensitivity, check
                  the actual ratio with the{" "}
                  <Link href="/tools/contrast-checker" className={linkClass}>
                    contrast checker
                  </Link>
                  , or for text over photos the{" "}
                  <Link href="/tools/text-over-image-contrast-checker" className={linkClass}>
                    text over image contrast checker
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section aria-labelledby="criteria-heading" className="mt-12 max-w-[68ch]">
              <h2 id="criteria-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                The WCAG criteria it helps with
              </h2>
              <div
                role="region"
                aria-label="Criteria table, scrolls sideways on small screens"
                tabIndex={0}
                className="mt-6 overflow-x-auto rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800"
              >
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">WCAG criteria, what each asks for, and what to look for in a simulation</caption>
                  <thead>
                    <tr>
                      {["Criterion", "What it asks", "What to look for"].map((h) => (
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
                    <tr className="align-top">
                      <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                        <Link href="/wcag/1-4-1" className={linkClass}>
                          1.4.1 Use of Color
                        </Link>{" "}
                        (A)
                      </th>
                      <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                        Colour is not the only way information, actions or responses are shown.
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                        Links in text with no underline, red-only errors, required fields marked only in colour, chart series and
                        status badges that differ only by hue.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                        <Link href="/wcag/1-4-3" className={linkClass}>
                          1.4.3 Contrast (Minimum)
                        </Link>{" "}
                        (AA)
                      </th>
                      <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                        Text has at least 4.5:1 contrast with its background, or 3:1 when large.
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                        Grey body text, placeholder text and text over images that fade first under blur and low contrast
                        sensitivity. Then measure them.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                        <Link href="/wcag/1-4-11" className={linkClass}>
                          1.4.11 Non-text Contrast
                        </Link>{" "}
                        (AA)
                      </th>
                      <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                        Control boundaries, focus indicators and meaningful graphics have at least 3:1 contrast.
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                        Pale input borders, icon-only buttons and chart lines that vanish, especially under low contrast
                        sensitivity.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="how-heading" className="mt-12 max-w-[68ch]">
              <h2 id="how-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How the simulations work
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-700 dark:text-slate-300">
                <li>
                  For a web address, our server opens the page in a headless Chrome at 1280 by 800 with reduced motion, scrolls
                  through it so lazy images load, and returns one screenshot up to 4,000 pixels tall. Every filter is then
                  applied in your browser, so switching between them is instant.
                </li>
                <li>
                  Protan, deutan and tritan simulations apply the Machado, Oliveira and Fernandes (2009) matrices in linear
                  light. At 100% they model the full loss of one cone type; lower severities blend the matrix with normal
                  vision, which approximates the anomalous forms rather than reproducing the paper&apos;s separate values for
                  each step.
                </li>
                <li>Achromatopsia replaces every colour with a grey of the same relative luminance.</li>
                <li>
                  Blurred vision applies a Gaussian blur at three levels, scaled with the screenshot so it stays the same
                  relative to the page. The levels are illustrative and not calibrated to a measure of acuity.
                </li>
                <li>Low contrast sensitivity halves contrast around mid-grey and softens the image slightly.</li>
              </ul>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="colour blindness simulator vision deficiency use of colour WCAG 1.4.1 contrast low vision"
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
