import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import AltTextDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.1.1 Non-text Content - Complete Guide",
  path: "/wcag/1-1-1",
  description:
    "Comprehensive guide to WCAG 1.1.1 Non-text Content success criterion. Interactive examples, screen reader demos, testing methods, and implementation code.",
  keywords: ["WCAG 1.1.1", "non-text content", "alt text", "accessibility", "text alternatives", "images", "screen reader"],
  type: "article",
  image: "/api/og?title=WCAG%201.1.1%20Non-text%20Content&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 1.1.1 Non-text Content require?",
    a: "It requires that all non-text content presented to the user has a text alternative that serves the equivalent purpose. In practice that means every meaningful image, chart, icon, audio clip, and control rendered as a graphic needs text that conveys the same information or function. The criterion lists specific exceptions: controls and inputs need only a descriptive name; time-based media needs only descriptive identification (full alternatives are covered by the 1.2.x criteria); tests and sensory experiences need descriptive identification; CAPTCHAs need alternatives in different modalities; and purely decorative content should be implemented so assistive technology can ignore it. It is a Level A criterion, part of WCAG since 2.0.",
  },
  {
    q: "When should an image have an empty alt attribute (alt=\"\")?",
    a: "Use an empty alt attribute when the image is purely decorative, is used only for visual formatting, or repeats information already available in adjacent text. An empty alt tells screen readers to skip the image entirely, which is exactly what a user wants for a background flourish or a spacer. Never omit the alt attribute altogether: without it, many screen readers fall back to announcing the file name, which is worse than silence. The decision is contextual — the same photo can be informative on one page and decorative on another.",
  },
  {
    q: "How long should alt text be?",
    a: "There is no normative character limit, but a widely used guideline is to keep alt text concise — usually under about 125 characters — and focused on conveying the same information as the image in its context. Do not start with 'Image of' or 'Picture of'; screen readers already announce the element as an image. When an image is too complex to summarize briefly (charts, diagrams, infographics), give it short alt text that identifies it and provide the full detail in nearby text, a data table, or a linked long description.",
  },
  {
    q: "What alt text does a functional image (like an icon button) need?",
    a: "Functional images take their text alternative from the action they perform, not from what they look like. A magnifying-glass icon inside a search button should be named 'Search', not 'magnifying glass'. If the icon sits inside a button or link that already has visible text, the icon itself should usually be decorative (empty alt or aria-hidden) so the accessible name is just the action. An icon-only control with no text alternative at all is one of the most common and most serious 1.1.1 failures.",
  },
  {
    q: "How do I handle complex images like charts and diagrams?",
    a: "Complex images need two layers: a concise alt text that identifies what the image is ('Line graph showing website traffic trends over 12 months'), plus a complete alternative that carries the actual data or relationships — a data table, a structured text description near the image, or a link to a long description. The test is equivalence: a user who cannot see the chart should be able to extract the same conclusions from the alternative. The obsolete longdesc attribute is poorly supported; visible adjacent text or an expandable description is more reliable.",
  },
  {
    q: "Does CSS background imagery need a text alternative?",
    a: "Only if it conveys information. CSS background images used for decoration are already invisible to assistive technology, which is fine. But if a background image carries meaning — a hero graphic containing text, an icon that is the only indicator of state — that information must also exist as real text in the page or as an accessible name on the element. As a rule, content belongs in HTML (img with alt) and decoration belongs in CSS.",
  },
]

export default function WCAG111Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.1.1: Non-text Content"
        description="All non-text content that is presented to the user has a text alternative that serves the equivalent purpose."
        criteria="1.1.1"
        level="A"
        principle="Perceivable"
        guideline="1.1 Text Alternatives"
        url="https://accessibility.build/wcag/1-1-1"
        category="Text Alternatives"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.1.1 Non-text Content", url: "https://accessibility.build/wcag/1-1-1" },
        ]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/wcag"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    WCAG Success Criteria
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    1.1.1 Non-text Content
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                The foundation of screen reader access
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.1.1: Non-text Content
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A screen reader cannot describe a photo, a braille display cannot render a
              chart, and a search engine cannot index an icon. This criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                every piece of non-text content has a text alternative that serves the
                equivalent purpose
              </strong>
              . Get this one right and images, charts, icons, and graphical buttons stop
              being dead ends for the people and technologies that rely on text.
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
              All non-text content that is presented to the user has a text alternative
              that serves the equivalent purpose, except for the situations listed
              below. <strong>Controls, Input:</strong> If non-text content is a control
              or accepts user input, then it has a name that describes its purpose.{" "}
              <strong>Time-Based Media:</strong> If non-text content is time-based
              media, then text alternatives at least provide descriptive identification
              of the non-text content. <strong>Test:</strong> If non-text content is a
              test or exercise that would be invalid if presented in text, then text
              alternatives at least provide descriptive identification of the non-text
              content. <strong>Sensory:</strong> If non-text content is primarily
              intended to create a specific sensory experience, then text alternatives
              at least provide descriptive identification of the non-text content.{" "}
              <strong>CAPTCHA:</strong> If the purpose of non-text content is to confirm
              that content is being accessed by a person rather than a computer, then
              text alternatives that identify and describe the purpose of the non-text
              content are provided, and alternative forms of CAPTCHA using output modes
              for different types of sensory perception are provided to accommodate
              different disabilities. <strong>Decoration, Formatting, Invisible:</strong>{" "}
              If non-text content is pure decoration, is used only for visual
              formatting, or is not presented to users, then it is implemented in a way
              that it can be ignored by assistive technology.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The core rule is one sentence; the rest is a list of situations where a
              full equivalent is impossible or unnecessary, and what is required
              instead. Note that decorative content is not exempt from the criterion —
              it must be actively implemented so assistive technology can skip it.
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
                <a className="hover:underline" href="#who-it-helps">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  What the requirement covers
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#demo">
                  Interactive demo
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

          {/* Who it helps */}
          <section aria-labelledby="who-it-helps" className="mb-12">
            <h2
              id="who-it-helps"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Text is the most adaptable format on the web: it can be spoken aloud,
              rendered in braille, enlarged, translated, restyled, and indexed. A text
              alternative lets non-text content reach everyone that text reaches:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Blind users",
                  d: "Screen readers and refreshable braille displays can only present text. Without alt text, an image is announced as nothing at all — or worse, as a meaningless file name like 'IMG_4032.jpg'.",
                },
                {
                  t: "Low vision users",
                  d: "People who zoom heavily or use screen readers alongside magnification may not be able to make out details in an image; the text alternative fills the gap.",
                },
                {
                  t: "People with cognitive and learning disabilities",
                  d: "Text alternatives can be read aloud by text-to-speech tools and provide a clearer, more explicit statement of what a complex graphic shows.",
                },
                {
                  t: "Users on slow or unreliable connections",
                  d: "When images fail to load or are disabled to save data, browsers show the alt text in their place — the page keeps working.",
                },
                {
                  t: "Deafblind users",
                  d: "Braille output is the only channel available; every image without a text alternative is simply gone from the page.",
                },
                {
                  t: "Search engines and automation",
                  d: "Crawlers, AI assistants, and voice interfaces understand your images only through their text alternatives — good alt text is also good SEO.",
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
              What the requirement covers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              &ldquo;Non-text content&rdquo; is broader than photographs. It includes
              raster and vector images, icons, charts, diagrams, infographics, images of
              text, image maps, graphical buttons and inputs, ASCII art, emoji used as
              content, audio and video files, and CAPTCHAs. The right alternative
              depends on the <em>purpose</em> the content serves, so the practical
              first step is always classification:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Informative images",
                  d: "Convey information: photos, illustrations, charts. Alt text must communicate the same information the image does, in its context.",
                },
                {
                  t: "Functional images",
                  d: "Perform an action: icon buttons, linked logos, image inputs. The text alternative describes the function ('Search', 'Go to homepage'), never the appearance.",
                },
                {
                  t: "Complex images",
                  d: "Charts, graphs, diagrams, maps. Short alt text identifies the image; a full alternative nearby (data table, structured description) carries the detail.",
                },
                {
                  t: "Images of text",
                  d: "The alt text must contain the same words shown in the image. (Also see 1.4.5 Images of Text, which asks you to avoid these entirely where possible.)",
                },
                {
                  t: "Decorative images",
                  d: "Purely aesthetic: backgrounds, flourishes, spacers, icons that duplicate adjacent text. Implement them so assistive technology ignores them — empty alt=\"\", CSS backgrounds, or aria-hidden.",
                },
              ].map((item) => (
                <li
                  key={item.t}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{item.t}.</strong>{" "}
                    {item.d}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The exceptions, briefly
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Where a full text equivalent is impossible, the criterion scales the
              requirement down rather than dropping it. Audio and video need at least a{" "}
              <em>descriptive identification</em> here (the full alternatives are
              required by the{" "}
              <Link href="/wcag/1-2-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.x Time-based Media criteria
              </Link>
              ). A color-perception test or a music sample only needs to be identified
              for what it is — describing it fully would defeat its purpose. CAPTCHAs
              must state their purpose and offer alternative modalities (for example an
              audio CAPTCHA alongside the visual one) so no single disability locks a
              user out.
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
              <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                  ✓ Passes 1.1.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>A product photo with alt text describing the product shown.</li>
                  <li>
                    A bar chart with brief alt text plus the underlying data in an
                    adjacent table.
                  </li>
                  <li>
                    An icon-only search button whose accessible name is
                    &ldquo;Search&rdquo;.
                  </li>
                  <li>
                    A decorative divider image with <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">alt=&quot;&quot;</code>.
                  </li>
                  <li>
                    A CAPTCHA labelled for its purpose, with an audio alternative
                    offered.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.1.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    An informative image with no alt attribute — screen readers
                    announce the file name.
                  </li>
                  <li>
                    Alt text that names the file or the format (&ldquo;chart.png&rdquo;,
                    &ldquo;photo&rdquo;) instead of the content.
                  </li>
                  <li>
                    An icon-only button with no accessible name at all.
                  </li>
                  <li>
                    An infographic whose data exists nowhere in text form.
                  </li>
                  <li>
                    A decorative image with verbose alt text that adds noise
                    (&ldquo;beautiful abstract blue swirl background&rdquo;).
                  </li>
                </ul>
              </div>
            </div>
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
              Informative vs. useless alt text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Alt text should convey the information the image carries in its context —
              not label the image as an image.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Missing, redundant, or meaningless alternatives -->
<img src="q4-sales.png">
<img src="q4-sales.png" alt="chart">
<img src="q4-sales.png" alt="Image of a picture of a chart">

<!-- ✓ Conveys the same information as the image -->
<img src="q4-sales.png"
     alt="Bar chart: quarterly sales grew from $2.3M in Q1
          to $3.6M in Q4, a 57% year-over-year increase">`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Decorative and functional images
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Decorative images get an explicitly empty <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">alt=&quot;&quot;</code>{" "}
              so screen readers skip them. Functional images are named for what they{" "}
              <em>do</em>.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Decorative image announced as noise; icon button unnamed -->
<img src="divider-swirl.png" alt="decorative blue swirl divider">
<button><img src="magnifier.svg"></button>

<!-- ✓ Decoration skipped; function named -->
<img src="divider-swirl.png" alt="" role="presentation">
<button>
  <img src="magnifier.svg" alt="Search">
</button>

<!-- ✓ Or: visible text carries the name, icon hidden -->
<button>
  <svg aria-hidden="true" focusable="false"><!-- icon --></svg>
  Search
</button>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Complex images: short alt + full alternative
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A chart cannot be equivalently described in one attribute. Identify it
              briefly, then provide the data as real, visible content.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<figure>
  <img src="traffic-trend.png"
       alt="Line graph of website traffic over 12 months,
            described in the table below">
  <figcaption>Monthly visitors, January–December</figcaption>
</figure>

<table>
  <caption>Monthly visitors (thousands)</caption>
  <thead>
    <tr><th scope="col">Month</th><th scope="col">Visitors</th></tr>
  </thead>
  <tbody>
    <tr><td>January</td><td>45</td></tr>
    <tr><td>February</td><td>52</td></tr>
    <!-- … remaining months … -->
    <tr><td>December</td><td>94</td></tr>
  </tbody>
</table>`}</code>
            </pre>
          </section>

          {/* Interactive demo */}
          <section aria-labelledby="demo" className="mb-12">
            <h2
              id="demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Interactive demo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Toggle the alt text on the examples below to compare weak and strong text
              alternatives across the four image categories — informative, decorative,
              functional, and complex.
            </p>
            <AltTextDemo />
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
                "Omitting the alt attribute entirely, so screen readers announce the raw file name or path.",
                "Placeholder alt text like 'image', 'photo', 'graphic', 'logo', or the file name — present but meaningless.",
                "Icon-only buttons and links with no accessible name (a bare magnifying glass, hamburger, or close ✕).",
                "Charts, graphs, and infographics whose data exists only in pixels, with no text or table equivalent anywhere.",
                "Starting alt text with 'Image of…' or 'Picture of…', which screen readers duplicate ('image, image of…').",
                "Giving decorative images descriptive alt text, forcing screen reader users to listen to visual noise.",
                "CSS background images that carry meaning (state icons, text baked into hero graphics) with no text equivalent in the page.",
                "A visual-only CAPTCHA with no audio or alternative modality, which locks out blind users entirely.",
                "Stale alt text left behind after the image was swapped for something different.",
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
              How to test for 1.1.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Run an automated scan first",
                  d: "Tools like axe DevTools, WAVE, and Lighthouse reliably catch images with a missing alt attribute and unnamed image buttons. Treat this as the floor: automation finds absent alternatives, not bad ones.",
                },
                {
                  t: "Inspect every image's alternative in context",
                  d: "For each img, SVG, icon, and graphical control, read the accessible name and ask: does this convey the same information or function as the visual? 'chart' on a revenue chart passes a scanner and fails the criterion.",
                },
                {
                  t: "Verify decorative images are silenced",
                  d: "Check that purely decorative images use alt=\"\" (or aria-hidden / CSS backgrounds) rather than describing themselves. In a screen reader, the page should read cleanly without decorative interruptions.",
                },
                {
                  t: "Listen to the page with a screen reader",
                  d: "Navigate by graphics (e.g. G in NVDA/JAWS, or the VoiceOver rotor's images list). Every announced image should make sense on its own; any 'unlabelled graphic' or file-name announcement is a failure.",
                },
                {
                  t: "Disable images and reload",
                  d: "Turn images off in the browser (or throttle and block them in DevTools). The page should remain fully understandable and operable using the alt text that appears in place of each image.",
                },
                {
                  t: "Check complex images for full equivalents",
                  d: "For every chart, diagram, and infographic, confirm a complete text alternative exists — a data table or structured description — and that it actually contains the same conclusions a sighted user would draw.",
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
              For a structured audit, work through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <CriterionLinks number="1.1.1" />

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
        </article>
      </div>
    </>
  )
}
