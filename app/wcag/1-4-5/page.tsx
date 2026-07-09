import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 1.4.5 Images of Text — Use Real Text Instead",
  description:
    "WCAG 1.4.5 Images of Text explained: use real text instead of pictures of text, with the customizable, essential, and logotype exceptions. Examples and tests.",
  keywords: [
    "WCAG 1.4.5",
    "Images of Text",
    "text in images accessibility",
    "logotype exception",
    "real text vs image",
    "web fonts accessibility",
    "banner image text",
    "1.4.5 test",
    "Level AA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-4-5",
  },
  openGraph: {
    type: "website",
    title: "WCAG 1.4.5 Images of Text — Use Real Text Instead",
    description:
      "If the technology can render it as text, it must be text — not a picture of text. The customizable, essential, and logotype exceptions, code examples, and testing.",
    url: "/wcag/1-4-5",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.4.5%20Images%20of%20Text&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.5 Images of Text guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.5 Images of Text — Use Real Text Instead",
    description:
      "If the technology can render it as text, it must be text — not a picture of text. The customizable, essential, and logotype exceptions, code examples, and testing.",
    images: ["/api/og?title=WCAG%201.4.5%20Images%20of%20Text&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.4.5 Images of Text require?",
    a: "It requires that if the technologies you are using can achieve the visual presentation, you use real text to convey information rather than images of text. There are two exceptions in the normative text: Customizable (the image of text can be visually customized to the user's requirements) and Essential (a particular presentation of text is essential to the information being conveyed). A note in the criterion adds that logotypes — text that is part of a logo or brand name — are considered essential. It is a Level AA criterion in WCAG 2.0, 2.1, and 2.2.",
  },
  {
    q: "Why are images of text an accessibility problem?",
    a: "Because the user loses all control over the text. Real text can be enlarged without pixelating, re-colored for contrast, restyled with a preferred font, given wider letter and line spacing, reflowed at high zoom, read by screen readers, translated, and selected or copied. Text baked into a bitmap can do none of that: it blurs when enlarged, ignores high-contrast modes and user stylesheets, and is invisible to translation tools. Alt text mitigates the screen reader problem but does nothing for a low-vision user looking at the pixelated image itself.",
  },
  {
    q: "Is a logo an automatic pass under 1.4.5?",
    a: "Yes. The criterion explicitly notes that logotypes — text that is part of a logo or brand name — are considered essential, so an image logo passes 1.4.5. Be careful about scope, though: the exception covers the logo itself, not adjacent content. A tagline, address, or navigation baked into the same image as the logo is not part of the logotype and still needs to be real text. And the logo image still needs an appropriate text alternative under 1.1.1.",
  },
  {
    q: "What does the 'customizable' exception actually mean?",
    a: "It means the image of text can be visually customized to the user's requirements — the user can adjust things like font family, size, color, and background to suit their needs, and the image re-renders accordingly. In practice this describes systems that generate the 'image' from text on demand with user-controlled settings. It is rarely met by ordinary websites; a static PNG export from a design tool is never customizable. If you find yourself reaching for this exception, the honest answer is almost always to use real text instead.",
  },
  {
    q: "Do screenshots, charts, and diagrams fail 1.4.5?",
    a: "Generally no. A screenshot whose point is to show exactly how a particular interface looks is a case where the specific presentation is essential — you cannot demonstrate a UI without picturing it. Charts, graphs, and diagrams are treated primarily as non-text content: their labels are part of a larger visual, and they are covered by 1.1.1's requirement for text alternatives. What fails 1.4.5 is using an image where the text itself is the content — a paragraph, a promotion, a menu, a quote — and the pictured styling could have been achieved with CSS and web fonts.",
  },
  {
    q: "How does 1.4.5 relate to 1.4.9 Images of Text (No Exception)?",
    a: "1.4.9 is the Level AAA version of the same idea. At AA, 1.4.5 lets you use images of text when the presentation is essential or customizable (with logotypes explicitly essential). At AAA, 1.4.9 removes the general 'essential presentation' latitude: images of text may be used only for pure decoration or where the particular presentation of text is essential to the information conveyed — which the criterion again notes includes logotypes. For most teams, conforming to 1.4.5 by simply not shipping text as images gets you nearly all the way to 1.4.9 too.",
  },
]

const passFailExamples = [
  {
    verdict: "pass" as const,
    t: "Styled heading with a web font",
    d: "A marketing hero uses a brand typeface loaded with @font-face, a gradient background, and a text-shadow — all applied to a real <h1>. The distinctive look is achieved without a single pixel of rasterized text.",
  },
  {
    verdict: "pass" as const,
    t: "Company logo as an image",
    d: "The site header shows the company's wordmark as an SVG image with alt text. Logotypes are explicitly considered essential, so this passes 1.4.5.",
  },
  {
    verdict: "pass" as const,
    t: "Screenshot in documentation",
    d: "A help article includes a screenshot of a settings dialog to show users exactly what they will see. The particular presentation is essential to the instruction, and the surrounding steps repeat the important text as real text.",
  },
  {
    verdict: "fail" as const,
    t: "Promotional banner with baked-in text",
    d: "The homepage hero is a JPEG containing the headline 'Summer sale — 50% off everything' in a stylized font. The same look was achievable with web fonts and CSS, so an image of text is not permitted.",
  },
  {
    verdict: "fail" as const,
    t: "Opening hours as a picture",
    d: "A restaurant uploads its menu and opening hours as photos of a designed flyer. Users cannot enlarge, search, translate, or copy the text, and the styling could have been recreated with real text.",
  },
]

export default function WCAG145Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.5: Images of Text"
        description="Text is used instead of images of text, except for customizable or essential images."
        criteria="1.4.5"
        level="AA"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-5"
        category="Distinguishable"
        relatedCriteria={["1.1.1", "1.4.4", "1.4.9"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.4.5 Images of Text" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 1.4 Distinguishable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.5: Images of Text
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A picture of a paragraph looks identical to a paragraph — until a
              user tries to enlarge it, recolor it, translate it, or listen to
              it. This criterion draws a clear line:{" "}
              <strong className="text-slate-900 dark:text-white">
                if the technology can render it as real text, it must be real
                text
              </strong>
              . Images of text are allowed only when the user can customize them
              or when that exact visual presentation is essential — which
              includes logos.
            </p>
          </header>

          {/* Official text callout */}
          <section
            aria-labelledby="official-text"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6"
          >
            <h2
              id="official-text"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3"
            >
              The success criterion, in full
            </h2>
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-blue-500 pl-4">
              If the technologies being used can achieve the visual
              presentation, text is used to convey information rather than
              images of text except for the following:{" "}
              <strong>Customizable:</strong> The image of text can be visually
              customized to the user&rsquo;s requirements;{" "}
              <strong>Essential:</strong> A particular presentation of text is
              essential to the information being conveyed.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The criterion carries a normative note: <em>logotypes (text that
              is part of a logo or brand name) are considered essential.</em>{" "}
              And the opening condition matters — on the modern web, with web
              fonts, CSS transforms, gradients, and shadows, the technology can
              achieve almost any visual presentation, so the exceptions are
              narrow.
            </p>
          </section>

          {/* On this page */}
          <nav
            aria-label="On this page"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              On this page
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-blue-600 dark:text-blue-400">
              <li>
                <a className="hover:underline" href="#who">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  The requirement and its exceptions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#examples">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Who this helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2
              id="who"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Real text is infinitely adaptable; a bitmap is frozen. The people
              who depend on that adaptability include:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with low vision",
                  d: "They enlarge text, and real text stays crisp at any size. An image of text turns into a blur of pixels at 200% zoom — precisely when the user needs it most.",
                },
                {
                  t: "People who need specific colors or contrast",
                  d: "High-contrast modes, dark themes, and user stylesheets can recolor real text on the fly. Text inside an image keeps whatever colors the designer exported, however unreadable.",
                },
                {
                  t: "People with dyslexia and reading disabilities",
                  d: "Many readers swap in a preferred font, widen letter spacing, or increase line height to keep their place. None of those adjustments can reach text trapped in an image.",
                },
                {
                  t: "Screen reader and translation users",
                  d: "Real text is directly readable, searchable, translatable, and copyable. An image of text depends entirely on someone remembering to write complete alt text — and even perfect alt text cannot be translated word for word or selected.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The requirement and its exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              An <em>image of text</em> is text rendered in a non-text format —
              a PNG, JPEG, SVG raster, or canvas drawing — to achieve a
              particular look. The default rule is simple: when your technology
              stack can produce the desired presentation with real text (and
              HTML plus CSS almost always can), you must use real text. Only two
              exceptions exist:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Customizable.
                  </strong>{" "}
                  The image of text can be visually customized to the
                  user&rsquo;s requirements — font, size, color, and background
                  adjust to the user&rsquo;s settings. Genuinely rare in
                  practice; a static export never qualifies.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Essential.
                  </strong>{" "}
                  A particular presentation of the text is essential to the
                  information being conveyed. This covers{" "}
                  <strong className="text-slate-900 dark:text-white">
                    logotypes
                  </strong>{" "}
                  (explicitly, per the criterion&rsquo;s note), plus cases like
                  screenshots of interfaces, specimens of a typeface, and
                  scanned historical documents where the rendering itself is the
                  point.
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Two boundaries worth knowing. First, this criterion is about text
              used to <em>convey information</em> — purely decorative text (say,
              faint words in a background texture) is instead handled by 1.1.1
              as decoration. Second, even when an image of text is legitimately
              essential, it still needs a text alternative under{" "}
              <Link
                href="/wcag/1-1-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.1.1 Non-text Content
              </Link>{" "}
              and sufficient contrast under 1.4.3, which applies to images of
              text too.
            </p>
          </section>

          {/* Pass / fail examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2
              id="examples"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <ul className="space-y-3">
              {passFailExamples.map((ex) => (
                <li
                  key={ex.t}
                  className={
                    ex.verdict === "pass"
                      ? "flex gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4"
                      : "flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      ex.verdict === "pass"
                        ? "text-emerald-600 font-bold"
                        : "text-rose-500 font-bold"
                    }
                  >
                    {ex.verdict === "pass" ? "✓" : "✗"}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">
                      {ex.verdict === "pass" ? "Pass — " : "Fail — "}
                      {ex.t}.
                    </strong>{" "}
                    {ex.d}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Replace the text-in-a-banner image with styled real text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The classic failure is a designed headline exported as an image.
              The same visual can nearly always be built with markup and CSS.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Failing: the headline is pixels, not text -->
<img src="/img/summer-sale-hero.jpg"
     alt="Summer sale — 50% off everything. Ends Sunday." />

<!-- ✓ Passing: real text, styled to match the design -->
<section class="hero">
  <h1 class="hero-title">Summer sale — 50% off everything</h1>
  <p class="hero-sub">Ends Sunday</p>
</section>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Web fonts and CSS reproduce the &ldquo;designed&rdquo; look
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Teams usually reach for images because they want a brand typeface
              and decorative effects.{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                @font-face
              </code>{" "}
              plus modern CSS delivers both while the text stays selectable,
              scalable, and restylable.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`@font-face {
  font-family: "Brand Display";
  src: url("/fonts/brand-display.woff2") format("woff2");
  font-display: swap;
}

.hero-title {
  font-family: "Brand Display", Georgia, serif;
  font-size: clamp(2rem, 1rem + 4vw, 4rem);
  background: linear-gradient(90deg, #7c3aed, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;             /* gradient-filled text, still real text */
  text-shadow: none;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The logotype exception — and its limits
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A logo may be an image, but do not smuggle content into it. Keep
              the wordmark as the image and everything around it as text.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Passing: logotype is essential; tagline is real text -->
<a href="/" class="brand">
  <img src="/img/acme-logo.svg" alt="Acme Corporation" />
</a>
<p class="tagline">Accessible tools for every team</p>

<!-- ✗ Failing: tagline and phone number baked into the logo image -->
<img src="/img/acme-logo-with-tagline-and-phone.png"
     alt="Acme Corporation — Accessible tools for every team — Call 555-0100" />`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Hero banners, promos, and CTAs exported from design tools with the headline text baked into the image.",
                "Menus, price lists, and opening hours uploaded as photos or PDFs-rendered-as-images of a printed flyer.",
                "Quotes, testimonials, or social media posts embedded as screenshots when the text could simply be quoted in HTML.",
                "Email-campaign images reused on the web page, carrying entire paragraphs of pixel text.",
                "Stylized section headings rendered as images because the brand font 'wasn't available' — @font-face has made this unnecessary for well over a decade.",
                "Buttons built as images with the label inside the bitmap, instead of a real <button> with styled text.",
                "Extending the logo exception too far: navigation, taglines, or addresses baked into the 'logo' image.",
                "Relying on alt text as the fix — alt text helps screen reader users but does nothing for the low-vision user staring at pixelated text.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.4.5
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Try to select the text with your cursor",
                  d: "The fastest manual check: drag-select across every piece of visible text. Real text highlights; an image of text selects as a single block or not at all. Do this on heroes, banners, badges, and buttons — the usual hiding places.",
                },
                {
                  t: "Zoom to 200–400% and look for pixelation",
                  d: "Enlarge the page. Real text stays razor sharp; images of text go soft and blocky. Anything that blurs is a candidate failure — then ask whether it is a logotype or genuinely essential.",
                },
                {
                  t: "Audit the page's images",
                  d: "In DevTools or a crawler, list every <img>, background-image, and <canvas>. For each one containing readable words, apply the test: could this presentation be achieved with real text and CSS? If yes, it fails unless customizable or essential.",
                },
                {
                  t: "Check each exception claim",
                  d: "For every image of text that remains, name its exception explicitly: logotype, screenshot where the exact rendering matters, font specimen, scanned document. 'The designer preferred it' and 'we didn't have the font' are not exceptions.",
                },
                {
                  t: "Verify the fallbacks on legitimate images of text",
                  d: "Where an image of text passes (a logo, a screenshot), confirm it still has an accurate text alternative (1.1.1) and, if the pictured text is informative, sufficient contrast (1.4.3 applies to images of text as well).",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {step.t}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Automated scanners cannot reliably tell an image of text from a
              photo, so this is a manual review. Fold it into your image audit
              alongside alt-text checks, and work through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2
              id="faq"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <CriterionLinks number="1.4.5" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="images of text real text web fonts logotype exception essential presentation customizable banner image text alt text pixelated zoom font-face styled headings WCAG 1.4.5 Level AA distinguishable"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
