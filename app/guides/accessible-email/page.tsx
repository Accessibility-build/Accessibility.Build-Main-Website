import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, ListChecks } from "lucide-react"

const pageTitle = "Accessible Email HTML: Build Emails That Everyone Can Read"
const pageDescription =
  "Email clients force you into the nested-table, inline-CSS layouts the web spent twenty years escaping, so email accessibility is really about making that table soup read as a clean linear document. Learn role=\"presentation\" on layout tables, real semantic content inside them, the lang attribute email templates forget, alt text that survives blocked images, bulletproof accessible buttons, single-column reflow, dark-mode contrast, an accessible preheader, and how to test an email with a screen reader. Copy-ready HTML mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible email",
    "email accessibility",
    "accessible html email",
    "accessible email design",
    "email accessibility best practices",
    "role presentation email table",
    "email layout table accessibility",
    "email alt text",
    "accessible email button",
    "bulletproof button accessibility",
    "email lang attribute",
    "email dark mode accessibility",
    "email preheader accessibility",
    "screen reader email",
    "wcag email",
    "accessible newsletter",
    "accessible marketing email",
    "email screen reader testing",
  ],
  alternates: {
    canonical: "/guides/accessible-email",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-email",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Email HTML",
    url: "https://accessibility.build/guides/accessible-email",
  },
]

const faqs = [
  {
    question: "Do accessibility rules like WCAG and the ADA apply to email?",
    answer:
      "Yes. An email is content an organization publishes and sends, and where that organization is covered by the ADA, Section 508, or the European Accessibility Act, its transactional and marketing emails fall within the same accessibility obligations as its website. WCAG 2.2 is the practical standard those laws point to, and its success criteria map cleanly onto email. Even setting law aside, an inaccessible email quietly loses real customers: a blind subscriber who cannot read your receipt, or a low-vision reader who cannot make out pale text on a colored button, simply does not act on the message. Accessibility in email is both a compliance question and a conversion one.",
  },
  {
    question: "Why do accessible emails still use table layouts when the web abandoned them?",
    answer:
      "Because email clients are far behind browsers. Outlook on Windows renders with Microsoft Word's engine, not a browser engine, and many clients strip out or ignore modern CSS layout such as flexbox, grid, floats, and positioning, external stylesheets, and JavaScript entirely. Nested tables with inline CSS are the only layout method that renders consistently across the whole range of clients. The accessibility answer is not to rip the tables out, which would break the email everywhere, but to mark every layout table with role=\"presentation\" so assistive technology ignores the grid and reads the content as a normal linear flow of text.",
  },
  {
    question: "What does role=\"presentation\" do on an email table?",
    answer:
      "It removes the table's grid semantics from the accessibility tree. Without it, a screen reader announces a layout scaffold as data: \"table, three columns, row two of eight, column one,\" for markup that only exists to position a logo next to a headline. That turns a simple message into a navigation puzzle. With role=\"presentation\" on the table, the screen reader ignores the rows and cells and reads the contents in source order as ordinary text. Put it on every table used purely for layout. The one exception is a table that genuinely presents data, such as an order summary or a receipt: that table keeps its real semantics, with th, scope, and a caption, exactly as a data table on the web would.",
  },
  {
    question: "Why does alt text matter even more in email than on the web?",
    answer:
      "Because a large share of email clients block images by default. Outlook, Gmail with images turned off, and many corporate email gateways show the alt text in place of the image until the reader chooses to load it, so the alt text is frequently the only thing anyone sees, sighted or not. The worst case is an email built as one big sliced image with no live text: in an images-off inbox it renders as a blank rectangle, and a screen reader has nothing to read. Write alt text that carries the actual message for meaningful images, and give spacer and purely decorative images an empty alt attribute (alt=\"\") so they are skipped rather than announced by file name.",
  },
  {
    question: "How do I build an accessible email button?",
    answer:
      "Use a real anchor element styled with padding and a background color, the pattern the email industry calls a bulletproof button, so it is a genuine link with an accessible name and a link role, reachable and operable, and it still renders as a styled call to action when images are switched off. For Outlook on Windows you wrap the same link in a VML roundrect so the rounded shape and fill render in Word's engine too. What you must not use is an image of a button, which disappears the moment images are blocked, or a div or table cell with a JavaScript onclick, because email clients do not run JavaScript and such an element has no link role, no keyboard operability, and no accessible name. The visible link text should describe the action, for example \"Confirm your order\" rather than \"Click here.\"",
  },
  {
    question: "What is preheader text and how do I make it accessible?",
    answer:
      "The preheader is the short preview line an inbox shows after the subject. In the HTML it is a visually hidden element placed at the very top of the body. Make it a real, useful summary of the email, because if you leave it empty the client pulls in whatever text comes first, often a \"view in browser\" URL or an image alt string, which reads as noise. A screen reader announces the preheader as the first content of the message, so a clear one also orients the user before the layout begins. Hide the trailing spacer characters that stop the client from spilling body text into the preview, using zero-width and non-breaking space entities inside the same hidden container, so they are not read aloud.",
  },
  {
    question: "Does dark mode break accessible emails?",
    answer:
      "It can, and email dark mode is genuinely harder than web dark mode. Some clients respect the prefers-color-scheme media query, but others, including Outlook.com and some Gmail apps, force-invert your colors regardless of your CSS. Forced inversion can drop text below the required contrast, or turn a dark logo invisible against a background that just became dark. Declare your intent with the color-scheme and supported-color-schemes meta tags, avoid pure black and pure white extremes that invert most violently, give logos a small padded or outlined background so they survive an inverted backdrop, and always test in a force-inverting client to confirm text contrast holds in both modes rather than assuming your light-mode design carries over.",
  },
  {
    question: "How do I test whether an email is accessible?",
    answer:
      "Do not rely on an automated checker alone; an email is only truly testable once a real client has rendered it. Work in layers. First validate the source for alt attributes, role=\"presentation\" on layout tables, a lang attribute, and a sound heading structure. Then send real test messages and open them in the major clients, since Outlook, Gmail, and Apple Mail each render differently. Turn images off and confirm the message still makes sense. Run a screen reader on the rendered email, VoiceOver in Apple Mail on macOS or iOS, NVDA reading an email in Outlook or a browser, TalkBack in Gmail on Android, and listen to the linear read. On a phone, confirm the layout reflows to a single column with comfortable tap targets, and open the email once in a force-inverting dark-mode client to check contrast.",
  },
]

const antiPatterns = [
  {
    bad: "The entire email is one big sliced image with no live text.",
    why: "Clients that block images by default show a blank rectangle, and a screen reader has nothing to read, so the whole message is lost (fails 1.1.1 and 1.4.5).",
    fix: "Build the email from live HTML text. Use images only for content that is genuinely visual, and give each one alt text that carries its meaning.",
  },
  {
    bad: "Layout tables with no role=\"presentation\".",
    why: "A screen reader announces the positioning grid as data, reading out rows and columns, which turns a short message into a confusing table to navigate (fails 1.3.1).",
    fix: "Add role=\"presentation\" to every table used only for layout, so assistive technology reads the cell contents as a normal linear flow.",
  },
  {
    bad: "No lang attribute on the html element.",
    why: "The screen reader falls back to its default voice and pronounces the content with the wrong language rules, which is hard to follow (fails 3.1.1).",
    fix: "Set the language on the root element, for example a lang value of \"en\", matching the language the email is written in.",
  },
  {
    bad: "Spacer and decorative images with a missing alt attribute or alt=\"spacer\".",
    why: "The screen reader announces the file name or the word spacer for images that carry no meaning, cluttering the read with noise.",
    fix: "Give every decorative or spacer image an empty alt attribute (alt=\"\") so assistive technology skips it entirely.",
  },
  {
    bad: "The call to action is an image of a button, or a div or cell with an onclick.",
    why: "A blocked image leaves no visible or readable CTA, and an onclick element has no link role, no keyboard operability, and does nothing because email clients run no JavaScript (fails 1.1.1, 2.1.1, and 4.1.2).",
    fix: "Use a real anchor styled as a bulletproof button, with descriptive text and, for Outlook, a VML roundrect fallback around the same link.",
  },
  {
    bad: "\"Click here\" or \"Read more\" repeated as link text.",
    why: "A screen reader user pulling up the list of links hears a wall of identical, meaningless labels and cannot tell where any of them lead (fails 2.4.4).",
    fix: "Write link text that names the destination or action, so each link makes sense read on its own, out of the surrounding sentence.",
  },
]

export default function AccessibleEmailGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Accessible Email HTML
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Implementation Guide &bull; Updated August 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Email HTML
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Email clients force you into the nested-table, inline-CSS layouts
                the web spent twenty years escaping. So the real work of email
                accessibility is making that table soup read as a clean linear
                document: layout tables marked so assistive technology ignores
                them, real semantic content inside them, a language the email
                forgets to declare, and alt text that survives the many clients
                that block images. This guide covers all of it end to end, mapped
                to WCAG 2.2, with copy-ready HTML.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Email Is Its Own Accessibility Problem
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Everything you know about building an accessible web page still
                  matters in email, but the ground rules change underneath it.
                  Email is not rendered by a browser. Outlook on Windows uses
                  Microsoft Word&rsquo;s rendering engine. Other clients strip the{" "}
                  <code>&lt;head&gt;</code>, drop <code>&lt;style&gt;</code>{" "}
                  blocks, ignore <code>flexbox</code>, <code>grid</code>,
                  positioning, and <code>float</code>, refuse external
                  stylesheets, and run no JavaScript at all. To render the same in
                  that whole zoo of clients, the entire email industry settled
                  decades ago on one layout method: nested{" "}
                  <code>&lt;table&gt;</code> elements with every style written
                  inline.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  That creates a direct collision with web accessibility.{" "}
                  <Link href="/guides/accessible-data-tables" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Tables on the web are for data
                  </Link>
                  , and using them purely for layout is a long-standing
                  anti-pattern, because a screen reader announces every table as a
                  grid of rows and columns. In email you have no choice but to lay
                  out with tables. So the defining move of email accessibility is
                  not to avoid the tables, it is to{" "}
                  <strong className="text-slate-900 dark:text-white">
                    tell assistive technology to ignore them
                  </strong>
                  , so the message reads as the linear document it really is.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The reframe that decides everything
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    An accessible email is a linear document wearing a table
                    costume. Your job is to make a screen reader read straight
                    down the content, one heading, paragraph, image, and link
                    after another, and never announce the scaffolding that
                    positions it. That single goal drives almost every technique
                    in this guide: mark the layout tables as presentational, keep
                    the content inside them genuinely semantic, and make sure the
                    source order is the reading order.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is not a niche concern. Email reaches people at the moments
                  that matter most, the order confirmation, the password reset,
                  the appointment reminder, the invoice. And it is squarely within
                  legal scope: where an organization is covered by the ADA,
                  Section 508, or the European Accessibility Act, its emails carry
                  the same obligations as its website. An inaccessible receipt is
                  not a smaller problem than an inaccessible checkout page; it is
                  the same problem, delivered to the inbox.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The rest of this guide works through the email-specific
                  techniques in order, starting with the one that carries the most
                  weight: making the layout tables disappear from the
                  accessibility tree.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How Email Accessibility Maps to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The highlighted row,{" "}
                <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.1.1 Non-text Content
                </Link>
                , is the criterion email fails most often, because clients block
                images and the message ends up living in alt text that was never
                written. The rest are the criteria a well-built email must also
                satisfy, from declaring its language to holding contrast when a
                client force-inverts to dark mode.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to HTML email, their
                    conformance level, and how each one applies to building an
                    accessible email
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Criterion
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        How it applies to email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.1.1 Non-text Content
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every meaningful image needs alt text that carries its message, since clients block images by default; spacer and decorative images need an empty alt.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Headings, lists, and paragraphs must be real elements; layout tables must carry role=&quot;presentation&quot; so their grid is not announced as structure.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.2 Meaningful Sequence
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Because tables drive layout, the source order must match the intended reading order; screen readers and mobile linearization follow the markup, not the visual grid.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.1.1 Language of Page
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The email needs a lang attribute so the screen reader pronounces it correctly; email templates routinely ship without one.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.4 Link Purpose (In Context)
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Link and button text must describe the destination or action; a list of &quot;click here&quot; links is unusable by screen reader.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Links and calls to action must be distinguishable without relying on color alone; underline text links rather than only coloring them.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.3 Contrast (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Text, including text on colored backgrounds and on buttons, needs 4.5:1 (3:1 for large text), and must still meet it after a client force-inverts to dark mode.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The email must reflow to a single readable column on a narrow screen, without forcing horizontal scrolling or pinch-zoom.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Links and buttons must expose a real name and role; a bulletproof button is a genuine anchor, and role=&quot;presentation&quot; removes the misleading table role.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                Each criterion links to its full reference and interactive demo.
                The complete{" "}
                <Link
                  href="/wcag"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 criteria
                </Link>{" "}
                are one click away.
              </p>
            </div>
          </section>

          {/* 1. Layout tables and role=presentation */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. Layout Tables and role=&quot;presentation&quot;
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the single most important technique in the guide, and it
                  is one line per table. Every <code>&lt;table&gt;</code> you use
                  only to position content, which in a typical email is nearly all
                  of them, must be marked as presentational so a screen reader
                  ignores its rows and columns and reads the contents as ordinary
                  text.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Without it, the reader hears the scaffolding. A two-column band
                  holding a logo beside a headline gets announced as{" "}
                  <em>
                    &ldquo;table, two columns, row one of one, column one, image,
                    column two, heading&rdquo;
                  </em>
                  , and a multi-row newsletter becomes a grid the user has to
                  navigate cell by cell. Mark the table presentational and all of
                  that vanishes; the logo and headline are simply read in order.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- A layout table: role="presentation" removes it from the a11y tree -->
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <img src="logo.png" alt="Acme" width="120" height="40">
    </td>
    <td>
      <h1 style="margin:0;font-size:24px;">Your order is confirmed</h1>
    </td>
  </tr>
</table>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A few details make this reliable across clients:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Put it on every layout table, including nested ones.
                    </strong>{" "}
                    Emails nest tables several levels deep; each layout table needs
                    its own <code>role=&quot;presentation&quot;</code>. Marking
                    only the outer table still leaves the inner grids announced.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Keep the old presentational attributes too.
                    </strong>{" "}
                    <code>border=&quot;0&quot;</code>,{" "}
                    <code>cellpadding=&quot;0&quot;</code>, and{" "}
                    <code>cellspacing=&quot;0&quot;</code> are still worth setting
                    for consistent rendering in older clients, alongside the role.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      <code>role=&quot;presentation&quot;</code> and{" "}
                      <code>role=&quot;none&quot;</code> mean the same thing here.
                    </strong>{" "}
                    Both strip the table semantics.{" "}
                    <code>presentation</code> has the widest client and
                    assistive-technology support, so prefer it for email.
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    The exception: a real data table keeps its semantics
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If a table in your email genuinely presents data, an order
                    summary with columns for item, quantity, and price, or a
                    statement of charges, then it is a data table, not a layout
                    table, and it must keep its real structure: a{" "}
                    <code>&lt;caption&gt;</code>, header cells with{" "}
                    <code>&lt;th scope=&quot;col&quot;&gt;</code>, and no{" "}
                    <code>role=&quot;presentation&quot;</code>. The test is the
                    same as on the web: is this table conveying relationships
                    between rows and columns, or just positioning things? Data
                    keeps its semantics; positioning gets{" "}
                    <code>presentation</code>. The{" "}
                    <Link href="/guides/accessible-data-tables" className="text-blue-600 dark:text-blue-400 hover:underline">
                      accessible data tables guide
                    </Link>{" "}
                    covers how to build that data table correctly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Semantic content */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. Real Semantic Content Inside the Tables
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Making the tables presentational solves the container. The
                  content inside those cells still has to be real, meaningful HTML,
                  because that is what a screen reader reads once the grid is out of
                  the way. This is where most emails quietly fail{" "}
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.1 Info and Relationships
                  </Link>
                  : the design has a clear visual hierarchy, but it is built from
                  styled <code>&lt;span&gt;</code> and{" "}
                  <code>&lt;font&gt;</code> tags and double{" "}
                  <code>&lt;br&gt;</code> line breaks, so none of that hierarchy
                  exists in the markup.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<td>
  <!-- Real heading, not a big bold span -->
  <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;">
    Your March statement is ready
  </h1>

  <!-- Real paragraph, not text separated by <br><br> -->
  <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">
    Here is a summary of your account activity for March.
  </p>

  <!-- Real list, not a line of bullet characters -->
  <ul style="margin:0 0 16px;padding-left:20px;font-size:16px;">
    <li>3 payments received</li>
    <li>1 payment due on April 15</li>
  </ul>
</td>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The rules are the same ones that make a web page navigable, and
                  screen reader users lean on them just as heavily in an email:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Use real headings.
                    </strong>{" "}
                    A screen reader user navigates an email heading by heading, so
                    the main message should be an <code>&lt;h1&gt;</code> and
                    section titles should be <code>&lt;h2&gt;</code> and{" "}
                    <code>&lt;h3&gt;</code> in order, never a bold{" "}
                    <code>&lt;span&gt;</code> that only looks like a heading.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Use real paragraphs and lists.
                    </strong>{" "}
                    Wrap prose in <code>&lt;p&gt;</code> and bulleted content in{" "}
                    <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code>. Two{" "}
                    <code>&lt;br&gt;</code> tags look like a paragraph break but
                    convey no structure, and a line starting with a bullet glyph
                    is not a list.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not skip heading levels.
                    </strong>{" "}
                    Go from <code>&lt;h1&gt;</code> to <code>&lt;h2&gt;</code> in
                    order so the outline holds together, the same discipline
                    covered in the{" "}
                    <Link href="/guides/skip-links" className="text-blue-600 dark:text-blue-400 hover:underline">
                      headings and bypass-blocks guide
                    </Link>
                    .
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You still write every style inline, because most clients drop a{" "}
                  <code>&lt;style&gt;</code> block, but inline styles do not stop
                  an element from being semantic. A{" "}
                  <code>&lt;h1 style=&quot;...&quot;&gt;</code> is still a heading
                  to a screen reader, no matter how it is styled.
                </p>
              </div>
            </div>
          </section>

          {/* 3. lang + document basics */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. The lang Attribute and Email Document Basics
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  On the web you rarely forget the language, because your framework
                  or CMS sets <code>&lt;html lang&gt;</code> for you. Email
                  templates routinely ship without it, and the result is that a
                  screen reader reads the whole message in its default voice, using
                  the wrong pronunciation rules, which is genuinely hard to follow.
                  Setting the language is a one-attribute fix for{" "}
                  <Link href="/wcag/3-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.1.1 Language of Page
                  </Link>
                  :
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Your order is confirmed</title>
  </head>
  <body>
    <!-- email content -->
  </body>
</html>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A few document-level basics belong here too:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Declare the character set.
                    </strong>{" "}
                    <code>&lt;meta charset=&quot;utf-8&quot;&gt;</code> stops
                    smart quotes and accented characters from turning into garbled
                    symbols that a screen reader then reads aloud.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Give it a real <code>&lt;title&gt;</code>.
                    </strong>{" "}
                    The title is used by the &ldquo;view in browser&rdquo; version
                    and by some assistive setups, so make it describe the email
                    rather than leaving it empty or generic.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Mark a change of language in part of the email.
                    </strong>{" "}
                    If a mostly-English email includes a paragraph in another
                    language, wrap it in an element with its own{" "}
                    <code>lang</code> attribute so that passage is pronounced
                    correctly (3.1.2 Language of Parts).
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Images and alt text */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Images, Alt Text, and Blocked Images
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Images are the area email fails most, and the reason is unique to
                  the medium: a large share of clients block images by default.
                  Outlook, Gmail with images turned off, and many corporate
                  gateways show your alt text in place of the image until the
                  reader chooses to load it. So the alt text is not just for screen
                  reader users; it is frequently the only thing{" "}
                  <em>anyone</em> sees. That reframes{" "}
                  <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.1.1 Non-text Content
                  </Link>{" "}
                  from a checkbox into a core content decision.
                </p>
                <div className="not-prose rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
                    Never build the whole email as one image
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The most damaging email pattern is a single sliced graphic
                    with all the text baked into it and no live HTML. In an
                    images-off inbox it renders as a blank rectangle, a screen
                    reader finds nothing to read, and the text inside it also fails{" "}
                    <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.5 Images of Text
                    </Link>{" "}
                    and cannot reflow or resize. Build the message from live text.
                    Use images only for content that is genuinely a picture.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Alt text in email follows the same meaningful-versus-decorative
                  split as the web, with one addition: you can style the alt text
                  so that, when the image is blocked, the fallback still looks
                  intentional.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Meaningful image: alt carries the message -->
<img src="hero.png" alt="Summer sale, up to 40% off shoes"
     width="600" style="display:block;font-size:16px;color:#1f2937;">

<!-- Decorative or spacer image: empty alt so it is skipped -->
<img src="spacer.gif" alt="" width="1" height="20"
     style="display:block;">

<!-- Logo: the brand name, not "logo" -->
<img src="logo.png" alt="Acme" width="120" height="40"
     style="display:block;">`}</code></pre>
                </div>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Meaningful images get descriptive alt.
                    </strong>{" "}
                    Describe what the image communicates, not that it is an image.
                    A promotional banner&rsquo;s alt should say the offer.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Decorative and spacer images get <code>alt=&quot;&quot;</code>.
                    </strong>{" "}
                    An empty alt attribute tells assistive technology to skip the
                    image. A missing alt attribute is different: many clients then
                    read the file name aloud. And never use{" "}
                    <code>alt=&quot;spacer&quot;</code>.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Style the alt text.
                    </strong>{" "}
                    Setting <code>font-size</code> and <code>color</code> on the{" "}
                    <code>&lt;img&gt;</code> controls how the alt text looks when
                    the image is blocked, so a broken-image fallback still reads
                    cleanly rather than as tiny default text.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Background images need a real fallback.
                    </strong>{" "}
                    Always set a solid <code>background-color</code> behind a
                    background image and keep the important text as live HTML on
                    top, so the content survives when the background does not load
                    (in Outlook this is the VML background technique).
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Buttons and links */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Bulletproof Buttons and Descriptive Links
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The call to action is the whole point of most marketing and
                  transactional email, and it is easy to build in a way that
                  excludes people. The accessible pattern is a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    bulletproof button
                  </strong>
                  : a real <code>&lt;a&gt;</code> element styled with padding and a
                  background color, so it is a genuine link with a name and a role,
                  it is reachable and operable, and it renders as a styled button
                  even when images are off. For Outlook on Windows you wrap the
                  same link in a VML roundrect so the shape and fill render in
                  Word&rsquo;s engine too.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Bulletproof button: a real link, styled, with a VML fallback for Outlook -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" bgcolor="#1d4ed8" style="border-radius:6px;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
        href="https://acme.example/confirm"
        style="height:44px;v-text-anchor:middle;width:220px;"
        arcsize="14%" fillcolor="#1d4ed8" strokecolor="#1d4ed8">
        <center style="color:#ffffff;font-family:sans-serif;font-size:16px;">
          Confirm your order
        </center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="https://acme.example/confirm"
         style="display:inline-block;padding:12px 28px;font-size:16px;
                color:#ffffff;text-decoration:none;font-family:sans-serif;">
        Confirm your order
      </a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two things separate an accessible CTA from an inaccessible one:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      It is a link, never an image or an onclick.
                    </strong>{" "}
                    An image of a button disappears when images are blocked. A{" "}
                    <code>&lt;div&gt;</code> or <code>&lt;td&gt;</code> with a
                    JavaScript <code>onclick</code> does nothing at all, because
                    clients run no JavaScript, and it has no link role, no
                    keyboard operability, and no accessible name. Only a real{" "}
                    <code>&lt;a href&gt;</code> is a working, accessible button
                    (4.1.2).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The text says what it does.
                    </strong>{" "}
                    <code>Confirm your order</code> or{" "}
                    <code>Download your invoice</code> tells a screen reader user
                    exactly where the link goes.{" "}
                    <Link href="/wcag/2-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.4.4 Link Purpose
                    </Link>{" "}
                    is failed by a page or email full of{" "}
                    <code>Click here</code> and <code>Read more</code> links that
                    are meaningless in the screen reader&rsquo;s list of links.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For text links in body copy, do not rely on color alone to mark
                  them, which fails{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>
                  . Underline them, so a reader who does not perceive the link
                  color can still tell text from link. And when you have several
                  &ldquo;Read the article&rdquo; style links, give each one
                  distinguishing text, for example the article&rsquo;s title, so
                  they are not identical out of context.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Reading order and reflow */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Reading Order and Single-Column Reflow
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Because tables control the layout, the order the content appears
                  in the markup is the order a screen reader reads it, and the
                  order most email clients use when they linearize the layout into
                  a single column on a phone. If you use table cells to place
                  something visually before content that comes earlier in the
                  source, the read order and the visual order diverge, which fails{" "}
                  <Link href="/wcag/1-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.2 Meaningful Sequence
                  </Link>
                  . The rule is simple:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    write the content in the order it should be read
                  </strong>
                  , and let the layout follow, not the other way around.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The other half of this section is reflow. An email that forces
                  horizontal scrolling or pinch-zoom on a phone fails{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.10 Reflow
                  </Link>{" "}
                  and is miserable for everyone. The practical constraints:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Cap the width and go single-column on mobile.
                    </strong>{" "}
                    Keep the main container around 600px wide, and let multi-column
                    bands stack into one column on narrow screens so nothing
                    requires sideways scrolling.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not depend on media queries alone.
                    </strong>{" "}
                    Some clients, historically including parts of Gmail, ignore{" "}
                    <code>@media</code> rules, so a robust email uses a fluid or
                    hybrid layout (percentage widths with{" "}
                    <code>max-width</code> caps) that reflows even without the media
                    query, and treats the media query as an enhancement.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Keep body text at a readable size.
                    </strong>{" "}
                    Use a base font size of at least 14 to 16px. Tiny type is a
                    common email failing and hurts low-vision readers most.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Give buttons room to be tapped.
                    </strong>{" "}
                    On a touch screen the tappable area of a button and of adjacent
                    links should be large enough to hit reliably, comfortably above
                    a 44px target.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 7. Color, contrast, dark mode */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Color, Contrast, and Dark Mode
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Email leans heavily on colored backgrounds, tinted bands, and
                  filled buttons, so contrast needs deliberate attention.{" "}
                  <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.3 Contrast (Minimum)
                  </Link>{" "}
                  asks for 4.5:1 for normal text and 3:1 for large text, measured
                  against the actual background behind it. The place teams miss it
                  is button label against button fill, and body text sitting on a
                  colored section rather than on white.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Then there is dark mode, which is harder in email than anywhere
                  else. There is no single behavior. Some clients respect{" "}
                  <code>prefers-color-scheme</code>. Others, including Outlook.com
                  and some Gmail apps, <em>force-invert</em> your colors whether you
                  ask for it or not, and partial-invert clients may recolor some
                  elements and not others. Forced inversion can quietly break
                  contrast, and a dark logo on a transparent background can vanish
                  the moment the backdrop becomes dark. A workable strategy:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Declare your color-scheme support.
                    </strong>{" "}
                    The <code>color-scheme</code> and{" "}
                    <code>supported-color-schemes</code> meta tags, plus a{" "}
                    <code>color-scheme</code> style on key elements, tell clients
                    that respect them to use your dark styles instead of a blunt
                    inversion.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Avoid pure black and pure white.
                    </strong>{" "}
                    Extremes invert most aggressively. Slightly off-black text and
                    off-white backgrounds tend to survive inversion with their
                    contrast closer to intact.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Protect logos and dark artwork.
                    </strong>{" "}
                    Give a dark logo a small padded light background or an outline
                    so it does not disappear on an inverted dark backdrop.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Never signal with color alone.
                    </strong>{" "}
                    Inversion can swap the very colors you used to mean something,
                    so follow{" "}
                    <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.1
                    </Link>{" "}
                    and back color up with text, an underline, or an icon.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The only way to know is to look: open the email in a
                  force-inverting client and confirm the text still meets contrast
                  and nothing has disappeared.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Preheader + plain text */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. The Preheader and the Plain-Text Alternative
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two small pieces of an email do quiet accessibility work that is
                  easy to skip. The first is the{" "}
                  <strong className="text-slate-900 dark:text-white">
                    preheader
                  </strong>
                  , the short preview line the inbox shows after the subject. In
                  the HTML it is a visually hidden element at the very top of the
                  body, and because a screen reader reads it as the first content
                  of the message, it should be a real, useful summary, not an
                  afterthought.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<body>
  <!-- Preheader: shown in the inbox preview, read first by a screen reader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Your order #2041 is confirmed and ships tomorrow.
    <!-- Spacer entities keep body text from spilling into the preview -->
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- visible email content follows -->
</body>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Get two things right. Make the preheader a genuine summary,
                  because an empty one lets the client pull in whatever text comes
                  first, often a &ldquo;view in browser&rdquo; URL or an image alt
                  string, which reads as noise both in the inbox and to a screen
                  reader. And hide the trailing spacer characters, the zero-width
                  non-joiner and non-breaking space entities that stop body text
                  from spilling into the preview, inside the same hidden container
                  so they are not announced.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The second piece is the{" "}
                  <strong className="text-slate-900 dark:text-white">
                    plain-text alternative
                  </strong>
                  . A well-formed email is sent as{" "}
                  <code>multipart/alternative</code>, with an HTML part and a real{" "}
                  <code>text/plain</code> part. That plain-text version is a
                  deliverability signal, but it is also an accessibility and
                  robustness feature: it is what some setups, minimal clients, and
                  users who prefer plain text actually read. Make it mirror the
                  content of the HTML email, with the real links written out, not a
                  stub that only says &ldquo;view this email in your
                  browser.&rdquo; Offer that browser view as well, as a genuine
                  fallback, but do not let it be the only readable form of the
                  message.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                9. Testing an Accessible Email
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You cannot fully test an email the way you test a web page,
                  because the same source renders differently in every client and
                  an automated checker only sees the source, not the rendered
                  result. Test in layers, from cheapest to most revealing.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Validate the source
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Before sending anything, check the HTML for the fundamentals: a{" "}
                  <code>lang</code> attribute, <code>role=&quot;presentation&quot;</code>{" "}
                  on every layout table, an <code>alt</code> attribute on every{" "}
                  image (empty for decorative ones), real heading elements in
                  order, and descriptive link text. Email-focused platforms such as
                  Litmus and Email on Acid now include accessibility checks that
                  flag several of these automatically.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Send real test emails
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Send the email to yourself and open it in the clients your
                  audience actually uses. Outlook on Windows, Gmail on the web and
                  in its apps, and Apple Mail on macOS and iOS render very
                  differently, so a design that reads well in one can break in
                  another. Then <strong className="text-slate-900 dark:text-white">turn images off</strong>{" "}
                  and confirm the message still makes complete sense from the live
                  text and alt text alone.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Run a screen reader on the rendered email
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the test that proves the linear read works. Open the
                  delivered email and listen to it with a screen reader:{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>{" "}
                  in Apple Mail on macOS or iOS,{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  reading the email in Outlook or a browser view, or{" "}
                  <Link href="/guides/talkback-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    TalkBack
                  </Link>{" "}
                  in Gmail on Android. Confirm it reads straight down the content
                  with no layout-grid announcements, that headings let you jump
                  through the email, and that the links make sense in the links
                  list.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Check mobile and dark mode
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  On a phone, confirm the layout reflows to a single column with
                  comfortable tap targets and readable text size, and open the
                  email once in a force-inverting dark-mode client to confirm
                  contrast survives. For where this fits in a wider process, see
                  the{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessibility audit guide
                  </Link>{" "}
                  and the{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>
                  , which explains why the manual pass is the one that catches what
                  matters here.
                </p>
              </div>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Email Accessibility Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the errors that turn up most in real email audits. Every
                one is a small decision with an outsized effect on whether the
                message reaches everyone who receives it.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common email accessibility anti-patterns, why each one fails,
                    and the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Anti-pattern</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {antiPatterns.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The Accessible Email Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Live text, not images of text.</strong>{" "}
                  The message is built from real HTML text; images carry only
                  genuinely visual content, and the email is never one big graphic.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Layout tables are presentational.</strong>{" "}
                  Every table used for positioning carries{" "}
                  <code>role=&quot;presentation&quot;</code>; only genuine data
                  tables keep <code>th</code>, <code>scope</code>, and a caption.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The language is declared.</strong>{" "}
                  <code>&lt;html lang=&quot;...&quot;&gt;</code> is set so the
                  screen reader pronounces the content correctly.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Structure is real.</strong>{" "}
                  Headings (a single <code>&lt;h1&gt;</code>, logical order),
                  paragraphs, and lists are real elements, not styled spans or
                  double line breaks.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Images are described or emptied.</strong>{" "}
                  Meaningful images have descriptive alt; spacer and decorative
                  images have <code>alt=&quot;&quot;</code> so they are skipped.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">CTAs are real links.</strong>{" "}
                  Buttons are bulletproof <code>&lt;a&gt;</code> elements with
                  descriptive text, not images of buttons or onclick elements.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Links make sense out of context.</strong>{" "}
                  No &ldquo;click here&rdquo;; link text names the destination, and
                  body links are underlined, not color-only.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Reading order equals source order.</strong>{" "}
                  The markup order matches the intended reading order, and the
                  email reflows to a single column on mobile.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Contrast holds in light and dark.</strong>{" "}
                  Text meets 4.5:1 on its background, buttons included, and survives
                  a force-inverting dark-mode client.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">A real preheader and plain-text part.</strong>{" "}
                  The preheader summarizes the email, and a genuine{" "}
                  <code>text/plain</code> alternative mirrors the content.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Get the Foundations Right
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Email accessibility rests on two techniques the rest of the web
                  uses too: correct alt text, and knowing when a table is data
                  versus layout. Start there.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/wcag/1-1-1">
                      WCAG 1.1.1 Non-text Content
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-data-tables">
                      Accessible Data Tables Guide
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details key={i} className="group border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessible email html email accessibility role presentation layout table alt text blocked images bulletproof button descriptive link text lang attribute language of page preheader plain text alternative dark mode contrast reflow single column semantic headings meaningful sequence non-text content 1.1.1 1.3.1 1.3.2 3.1.1 2.4.4 1.4.3 1.4.10 4.1.2 data table screen reader testing pdf accessibility document accessibility"
                title="Related Guides & References"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
