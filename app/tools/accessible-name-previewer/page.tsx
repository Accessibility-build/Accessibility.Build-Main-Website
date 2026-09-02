import type { Metadata } from "next"
import Link from "next/link"
import AccessibleNamePreviewer from "@/components/tools/accessible-name-previewer"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/tools/accessible-name-previewer"
const pageTitle = "Accessible Name Previewer: What Screen Readers and AI Agents Announce"
const pageDescription =
  "Paste HTML and see the accessible name, role and description every control exposes, the way a screen reader or a browser-use AI agent receives them. Finds unnamed buttons, links and fields before they fail WCAG 4.1.2 or an agent."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessible name",
    "accessible name calculator",
    "what will a screen reader announce",
    "accname",
    "aria-label checker",
    "button has no accessible name",
    "link name checker",
    "accessibility tree viewer",
    "AI agent accessibility",
    "WCAG 4.1.2 name role value",
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
        url: `/api/og?title=${encodeURIComponent("Accessible Name Previewer")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Accessible name previewer",
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessible Name Previewer", url: `https://accessibility.build${ROUTE}` },
]

const FAQS = [
  {
    question: "What is an accessible name?",
    answer:
      "The text assistive technology uses to identify an element: what a screen reader announces for a button, link or field, and what an AI agent reads in the accessibility tree. It is computed from the markup by the W3C accessible name algorithm, in a fixed order: aria-labelledby, then aria-label, then native sources such as a label element, alt text or the control's own text, then the title attribute.",
  },
  {
    question: "Why does an AI agent care about accessible names?",
    answer:
      "Browser-use agents from Anthropic, OpenAI and Google operate pages through the accessibility tree rather than the pixels. Each control reaches the agent as a role and a name. A button with no name arrives as just 'button', indistinguishable from every other unnamed button on the page, so the agent cannot reliably act on it. The same failure is why a screen reader user cannot use it.",
  },
  {
    question: "Which WCAG criteria does this relate to?",
    answer:
      "4.1.2 Name, Role, Value requires that user interface components expose a name and role. 1.1.1 Non-text Content requires text alternatives for images, which become link and button names when an image is the only content. 2.4.4 Link Purpose requires link text that makes the purpose clear. 3.3.2 Labels or Instructions requires labels for form fields. Missing names are among the five most common failures in WebAIM's annual evaluation of a million home pages.",
  },
  {
    question: "Is this the same as what a screen reader says?",
    answer:
      "It is the name part. A screen reader adds the role and state in its own words, for example 'Add to basket, button', and different screen readers phrase things differently. This tool uses dom-accessibility-api, the accname implementation used by Testing Library and jsdom, so the names match what those tools and most browsers compute. Always confirm important flows with a real screen reader.",
  },
  {
    question: "Why does a div with onclick show as not in the tree?",
    answer:
      "A div has no role, so it is not exposed as a control at all. A screen reader user cannot tab to it and an agent does not see it as something that can be pressed. Use a button element, or add role=\"button\", tabindex=\"0\" and keyboard handling.",
  },
]

export default function AccessibleNamePreviewerPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Accessible Name Previewer"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
      />
      <HowToStructuredData
        name="How to check what a screen reader or AI agent will call your controls"
        description="Paste markup, run the accessible name computation, and fix every interactive element that has no name."
        steps={[
          { name: "Paste the markup", text: "Paste the HTML of the component or page section into the box, or pick an example." },
          { name: "Run the computation", text: "Select Show what gets announced. The markup is rendered in a sandboxed frame and every element with a role is listed with its accessible name." },
          { name: "Read the agent view", text: "The right-hand panel shows the flat role-and-name list an AI agent or screen reader receives. Any control that appears without a name is the problem." },
          { name: "Fix the source", text: "The table says where each name came from. Add alt text, a label element, visible text or aria-label as appropriate, then run again." },
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
                <li className="text-slate-900 dark:text-white">Accessible Name Previewer</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; Runs in your browser
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              What will a screen reader, or an AI agent, call this?
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Paste HTML and see the accessible name and role of every control, computed the way
              browsers do it and shown the way a browser-use agent receives it. Unnamed buttons,
              image links without alt text and fields without labels are the failures screen reader
              users hit first, and since agents read the same tree, they are the failures that make a
              site unusable by automation too.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <AccessibleNamePreviewer />

            <section aria-labelledby="why-heading" className="mt-14 max-w-[68ch]">
              <h2 id="why-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Why the name is the whole thing
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Every control on a page reaches assistive technology as a role and a name. The
                  role says what it is (button, link, checkbox); the name says which one. Sighted
                  users get the name from a label, an icon or its position. Everyone and everything
                  else gets it from the accessibility tree, and if the tree has no name for it, there
                  is nothing to announce and nothing for an agent to target.
                </p>
                <p>
                  This is why missing names are what litigation turns on. The complaint in{" "}
                  <Link href="/cases/robles-v-dominos" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    Robles v. Domino&apos;s
                  </Link>{" "}
                  pleaded buttons with no accessible name; the plaintiff in{" "}
                  <Link href="/cases/gil-v-winn-dixie" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    Gil v. Winn-Dixie
                  </Link>{" "}
                  testified that nine in ten controls did nothing for his screen reader; the{" "}
                  <Link href="/cases/nfb-v-target" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    Target
                  </Link>{" "}
                  site read out file names because its images had no alt text. WebAIM&apos;s 2026
                  evaluation found empty links on 46.3% of the top million home pages and empty
                  buttons on 30.6%.
                </p>
                <p>
                  Browser-use agents changed the audience for this without changing the fix.
                  Anthropic&apos;s browser tool, OpenAI&apos;s computer-using agent and
                  Google&apos;s Mariner all ground their actions in the accessibility tree, the same
                  names and roles a screen reader uses. A site that cannot be used by a blind
                  customer cannot be used by an agent acting for a sighted one.
                </p>
              </div>
            </section>

            <section aria-labelledby="fix-heading" className="mt-12 max-w-[68ch]">
              <h2 id="fix-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How to give a control a name
              </h2>
              <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">Common controls, the failure, and the fix that gives them a name</caption>
                  <thead>
                    <tr>
                      {["Control", "What fails", "Fix"].map((h) => (
                        <th key={h} scope="col" className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {[
                      ["Icon-only button", "SVG or icon font with no text", "Visible text, or aria-label on the button, with the icon aria-hidden"],
                      ["Image link", "img without alt inside a link", "alt text that names the destination, not the picture"],
                      ["Form field", "placeholder used as the label", "A label element, visible, associated by for and id"],
                      ["Custom control", "div or span with a click handler", "A button element, or role plus tabindex plus keyboard handling"],
                      ["Repeated links", "Several links that all say Read more", "Make the visible text specific, or add aria-label with the subject"],
                      ["Embedded frame", "iframe with no title", "A title attribute that says what the frame contains"],
                    ].map(([c, f, x]) => (
                      <tr key={c} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">{c}</th>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{f}</td>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{x}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The relevant criteria are{" "}
                <Link href="/wcag/4-1-2" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">4.1.2 Name, Role, Value</Link>,{" "}
                <Link href="/wcag/1-1-1" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">1.1.1 Non-text Content</Link>,{" "}
                <Link href="/wcag/2-4-4" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">2.4.4 Link Purpose</Link> and{" "}
                <Link href="/wcag/3-3-2" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">3.3.2 Labels or Instructions</Link>, all Level A.
                For the full rules see the{" "}
                <Link href="/guides/using-aria" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">guide to using ARIA</Link>.
              </p>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="accessible name aria-label screen reader button link label WCAG 4.1.2 accessibility tree agent"
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
