import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.4.9 Images of Text (No Exception) Guide",
  description:
    "Guide to WCAG 1.4.9 Images of Text (No Exception): why real text beats pictures of text, the only two exceptions, pass/fail examples, CSS techniques, and testing.",
  keywords: [
    "WCAG 1.4.9",
    "Images of Text No Exception",
    "images of text",
    "text in images accessibility",
    "real text vs image text",
    "web fonts accessibility",
    "CSS text styling",
    "logotype exception",
    "Level AAA",
    "WCAG 2.2",
    "distinguishable",
  ],
  alternates: {
    canonical: "/wcag/1-4-9",
  },
  openGraph: {
    title: "WCAG 1.4.9 Images of Text (No Exception) — Level AAA Guide",
    description:
      "The definitive guide to WCAG 1.4.9: text must be real text, never an image of text, unless it is pure decoration or the presentation is essential. Examples, CSS techniques, and testing.",
    url: "/wcag/1-4-9",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.4.9%20Images%20of%20Text%20(No%20Exception)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.9 Images of Text (No Exception) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.9 Images of Text (No Exception) — Level AAA",
    description:
      "Images of text are only used for pure decoration or where a particular presentation of text is essential. What that means, how it differs from 1.4.5, and how to test.",
    images: [
      {
        url: "/api/og?title=WCAG%201.4.9%20Images%20of%20Text%20(No%20Exception)&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.4.9 Images of Text (No Exception) require?",
    a: "It requires that images of text are only used for pure decoration or where a particular presentation of text is essential to the information being conveyed. In every other case, the text must be actual text — characters rendered by the browser that users can restyle, resize, recolor, and have read aloud. It is a Level AAA success criterion under Guideline 1.4 Distinguishable, introduced in WCAG 2.0 and unchanged in WCAG 2.1 and 2.2.",
  },
  {
    q: "How is 1.4.9 different from 1.4.5 Images of Text (Level AA)?",
    a: "1.4.5 (AA) allows images of text in two situations: when the image is customizable to the user's requirements, or when the particular presentation is essential. 1.4.9 (AAA) removes the 'customizable' allowance entirely — the name 'No Exception' refers to removing that general-use allowance. At AAA only two narrow cases remain: pure decoration, and presentations that are essential, such as logotypes. If you meet 1.4.9 you automatically meet 1.4.5.",
  },
  {
    q: "Are logos exempt from WCAG 1.4.9?",
    a: "Yes. WCAG explicitly states that logotypes — text that is part of a logo or brand name — are considered essential, so a logo containing stylized text passes both 1.4.5 and 1.4.9. The exemption covers the logo itself, not everything near it: a tagline, navigation label, or heading rendered as an image next to the logo still fails. The logo image still needs a text alternative under 1.1.1 Non-text Content.",
  },
  {
    q: "Why are images of text an accessibility problem at all?",
    a: "Because pixels are frozen. Users with low vision cannot resize image text without blur, cannot change its font, color, letter spacing, or line height, and cannot apply a high-contrast theme to it. People with dyslexia often rely on custom fonts and spacing that images ignore. Screen readers cannot read the pixels — only the alt text, which can silently drift out of date. Text in images also breaks translation tools, text search, and copy-paste, and looks blurry on high-density screens.",
  },
  {
    q: "Do screenshots and photos containing text fail 1.4.9?",
    a: "Usually not. A screenshot in documentation shows what a user interface actually looks like — the particular presentation is the information, which makes it essential. A photo of a street scene that happens to include a shop sign is not being 'used to present text' at all. What fails is using an image as a substitute for content text: headings exported from a design tool, banners with promotional copy baked in, or menus rendered as images.",
  },
  {
    q: "With web fonts and modern CSS, is there ever a reason to use images of text?",
    a: "Almost never — and that is exactly why this AAA criterion is more achievable today than when it was written. Web fonts (@font-face, variable fonts), CSS text-shadow, gradients with background-clip: text, transforms, and SVG <text> elements can reproduce nearly any visual treatment while keeping the characters real, selectable, and restylable. The practical rule: if you can achieve the effect in CSS or SVG text, 1.4.9 says you must.",
  },
]

export default function WCAG149Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.9: Images of Text (No Exception)"
        description="Images of text are only used for pure decoration or where a particular presentation of text is essential to the information being conveyed"
        criteria="1.4.9"
        level="AAA"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-9"
        category="Distinguishable"
        relatedCriteria={["1.4.5", "1.1.1", "1.4.3", "1.4.12"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.4.9 Images of Text (No Exception)" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Stricter sibling of 1.4.5
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.9: Images of Text (No Exception)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              When text is baked into an image, users lose every control they have over
              how text looks — size, font, spacing, colors, contrast. This Level AAA
              criterion draws the hardest line WCAG has on the subject:{" "}
              <strong className="text-slate-900 dark:text-white">
                use images of text only for pure decoration or where that exact visual
                presentation is essential
              </strong>
              . Everything else must be real, live, restylable text.
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
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-purple-500 pl-4">
              Images of text are only used for pure decoration or where a particular
              presentation of text is essential to the information being conveyed.
              <br />
              <span className="block mt-2 text-sm text-slate-500 dark:text-slate-400">
                Note: Logotypes (text that is part of a logo or brand name) are
                considered essential.
              </span>
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Despite the &ldquo;No Exception&rdquo; in the name, two narrow allowances
              remain: decorative images of text, and presentations that are truly
              essential. What disappears at AAA — compared to{" "}
              <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                1.4.5 Images of Text
              </Link>{" "}
              at AA — is the general permission to use images of text when they are
              user-customizable.
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
                  Who this helps and why
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  The requirement and its two allowances
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code: real text instead of images
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#failures">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#siblings">
                  Relationship to 1.4.5 and friends
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
              Who this helps and why
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Real text is infinitely adaptable: a browser can enlarge it, reflow it,
              swap its font, recolor it, add letter spacing, or hand it to a screen
              reader or translator. An image of text is a photograph of words — every
              one of those adaptations is impossible, and zooming just produces bigger,
              blurrier pixels.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with low vision",
                  d: "Need to enlarge text far beyond 200%, change foreground/background colors, or apply high-contrast themes. Image text ignores all of it and degrades into blur when magnified.",
                },
                {
                  t: "People with dyslexia and reading disabilities",
                  d: "Often rely on specific fonts, wider letter and line spacing, and tinted backgrounds to read comfortably — adjustments covered by 1.4.12 Text Spacing that only work on real text.",
                },
                {
                  t: "Screen reader and braille users",
                  d: "Can only access the alt attribute of an image, which frequently drifts out of sync with the pixels. Real text is always exactly what it says.",
                },
                {
                  t: "Everyone else, too",
                  d: "Real text can be searched, selected, copied, translated, and rendered crisply on any screen density. Search engines index it; text in images is invisible to Find-in-page.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This criterion dates from an era when web typography was so limited that
              designers exported headlines as GIFs. With web fonts, variable fonts, and
              modern CSS, the visual argument for image text has essentially vanished —
              which makes this one of the easier AAA criteria to meet in a new build.
            </p>
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The requirement and its two allowances
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              An <em>image of text</em> is text that has been rendered in a non-text
              form — pixels in a PNG, JPEG, WebP, or a canvas — in order to achieve a
              particular visual effect. The rule is simple: if the words carry
              information, they must be real text. Only two situations are exempt:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  1
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Pure decoration.
                  </strong>{" "}
                  Text that serves only an aesthetic purpose, provides no information,
                  and has no function — letterforms scattered across a hero background
                  as texture, for example. If nobody needs to read it, it may be an
                  image (with empty <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">alt=&quot;&quot;</code>).
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  2
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Essential presentation.
                  </strong>{" "}
                  The specific visual form of the text <em>is</em> the information:
                  logotypes and brand names (explicitly named as essential), samples of
                  typefaces on a font foundry site, a scan of a historical letter where
                  the handwriting matters, or a screenshot showing what a UI actually
                  looks like.
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Note what is <em>not</em> on that list: &ldquo;the designer preferred
              this font,&rdquo; &ldquo;the CMS made it easy,&rdquo; and &ldquo;the
              image is customizable&rdquo; — that last one is the AA-level allowance in
              1.4.5 that this criterion deliberately removes. Essential means the
              information would be lost or changed if the text were presented any other
              way, not that the presentation is preferred.
            </p>
          </section>

          {/* Pass / fail */}
          <section aria-labelledby="pass-fail" className="mb-12">
            <h2
              id="pass-fail"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                  ✓ Passes 1.4.9
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A hero headline styled with a web font, CSS gradient fill, and
                    text-shadow — visually rich, but real text underneath.
                  </li>
                  <li>
                    The company logo as an SVG with stylized lettering, with an
                    accessible name — logotypes are essential.
                  </li>
                  <li>
                    A font foundry showing specimen images of its typefaces — the
                    letterform rendering is the content.
                  </li>
                  <li>
                    A screenshot of an app in a tutorial, with the key text repeated in
                    the surrounding prose.
                  </li>
                  <li>
                    Faded dictionary-page letterforms used as a purely decorative
                    background texture with <code className="font-mono">alt=&quot;&quot;</code>.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.4.9
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Section headings exported from a design tool as PNGs to preserve a
                    brand font.
                  </li>
                  <li>
                    A promotional banner with the offer text (&ldquo;20% off until
                    Friday&rdquo;) baked into the image.
                  </li>
                  <li>
                    A restaurant menu uploaded as a JPEG scan instead of marked-up
                    text.
                  </li>
                  <li>
                    Pull quotes rendered as images so they keep fancy quotation-mark
                    styling.
                  </li>
                  <li>
                    An image of text that users can customize (font/size picker
                    regenerates the image) — passes 1.4.5 at AA, but still fails 1.4.9
                    at AAA.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code: real text instead of images
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Replace an image headline with styled text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Almost any &ldquo;we needed the brand look&rdquo; image can be
              reproduced with a web font and CSS — including gradient fills that once
              required Photoshop.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Text frozen into pixels -->
<img src="/img/headline-summer-sale.png" alt="Summer sale — up to 40% off" />

<!-- ✓ Real text with the same visual treatment -->
<h2 class="promo-headline">Summer sale — up to 40% off</h2>

<style>
  @font-face {
    font-family: "BrandDisplay";
    src: url("/fonts/brand-display.woff2") format("woff2");
    font-display: swap;
  }
  .promo-headline {
    font-family: "BrandDisplay", system-ui, sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    background: linear-gradient(90deg, #7c3aed, #db2777);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: none;
  }
</style>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Use SVG text for lockups that need precise shapes
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When text must follow a path or sit inside artwork, SVG{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;text&gt;</code>{" "}
              keeps the characters real and readable by assistive technology while
              giving you full geometric control.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Selectable, scalable, announced by screen readers -->
<svg viewBox="0 0 600 120" role="img" aria-labelledby="badge-title">
  <title id="badge-title">Certified accessible — 2026 audit</title>
  <path id="arc" d="M 50 100 Q 300 20 550 100" fill="none" />
  <text font-size="28" fill="currentColor">
    <textPath href="#arc" startOffset="10%">
      Certified accessible — 2026 audit
    </textPath>
  </text>
</svg>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The two legitimate image cases, marked up correctly
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Essential: a logotype (still needs a text alternative per 1.1.1) -->
<a href="/">
  <img src="/img/acme-logo.svg" alt="Acme Corporation home" />
</a>

<!-- ✓ Pure decoration: letterforms as background texture -->
<img src="/img/type-texture.png" alt="" role="presentation" />`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="failures" className="mb-12">
            <h2
              id="failures"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Headings, navigation labels, or buttons exported as images to preserve a corporate typeface instead of loading it as a web font.",
                "Marketing banners and social cards reused on the page itself, with dates, prices, and offer terms readable only in the pixels.",
                "Menus, price lists, schedules, or infographics uploaded as scans or exported charts with no equivalent text version.",
                "Email-style HTML reused on the web, where entire paragraphs are sliced images — a legacy email technique that fails badly on the web.",
                "Text rendered into <canvas> without an accessible text equivalent, freezing it just as thoroughly as a PNG.",
                "Relying on the 1.4.5 'customizable' allowance — an image-of-text generator with font settings — which no longer counts at the AAA level.",
                "Stretching the 'essential' exception to cover brand preference: a tagline or campaign slogan is not a logotype just because it sits near the logo.",
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
              How to test for 1.4.9
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Try to select the text with your cursor",
                  d: "Drag across every heading, banner, and label. Real text highlights character by character; an image selects as a single block. Anything you cannot select character-by-character is a candidate image of text.",
                },
                {
                  t: "Zoom to 400% and look for blur",
                  d: "Real text stays razor sharp at any zoom level. Raster image text softens and pixelates. This catches image text that visually blends in at 100%.",
                },
                {
                  t: "Disable images and see what disappears",
                  d: "Turn images off in the browser (or block them in DevTools). Every piece of information that vanishes — rather than being replaced by equivalent text — was living in an image.",
                },
                {
                  t: "Audit each remaining image against the two allowances",
                  d: "For every image containing words, ask: is it purely decorative (conveys nothing), or is this exact presentation essential (logotype, type specimen, historically significant rendering, UI screenshot)? If neither, it fails 1.4.9 — even if a customization mechanism exists.",
                },
                {
                  t: "Check the survivors for text alternatives",
                  d: "Legitimate essential images of text still need a correct alt under 1.1.1, and decorative ones need alt=\"\". While you are there, confirm contrast of any essential image text against 1.4.3.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
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
              Automated scanners cannot reliably tell whether an image contains text,
              so this is a visual, manual check. Fold it into your full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              review.
            </p>
          </section>

          {/* Relationship */}
          <section aria-labelledby="siblings" className="mb-12">
            <h2
              id="siblings"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Relationship to 1.4.5 and friends
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              1.4.9 is the AAA tightening of{" "}
              <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.5 Images of Text
              </Link>{" "}
              (AA). Both share the decoration and essential allowances; 1.4.5
              additionally permits images of text that the user can customize to their
              own requirements, and — in practice — tolerates them wherever the visual
              presentation cannot be achieved with technology. 1.4.9 deletes that
              flexibility. A team already meeting AA gets to AAA here mostly by
              replacing legacy image headlines with web fonts.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Three neighbors complete the picture:{" "}
              <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.1.1 Non-text Content
              </Link>{" "}
              (A) requires the images of text you legitimately keep — logos, specimens
              — to carry a proper text alternative.{" "}
              <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.3 Contrast (Minimum)
              </Link>{" "}
              (AA) applies its contrast ratios to image text just as it does to real
              text. And{" "}
              <Link href="/wcag/1-4-12" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.12 Text Spacing
              </Link>{" "}
              (AA) is a big part of the <em>why</em>: users must be able to override
              spacing without loss of content — an adaptation only real text can honor.
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

          <CriterionLinks number="1.4.9" />
        </article>
      </div>
    </>
  )
}
