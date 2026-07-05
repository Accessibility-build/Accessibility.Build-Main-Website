import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Build for macOS — instant contrast checks, annotated captures, colorblind lens",
  description:
    "A free menu-bar app for designers and developers: pick any two colors on screen for WCAG + APCA contrast verdicts, capture and annotate issues mapped to WCAG criteria, and view your screen through color-blindness simulation. Everything runs locally.",
  alternates: { canonical: "https://accessibility.build/desktop" },
};

const DMG_URL = "/downloads/desktop/Accessibility%20Build_1.3.0_aarch64.dmg";
const VERSION = "1.3.0";

const tools = [
  {
    name: "Contrast picker",
    hotkey: "⌥⌘P",
    description:
      "Freeze the screen, pick text and background with a magnified pixel loupe, and get WCAG AA/AAA and APCA verdicts instantly. Drag across gradients to find the worst-case pixel, get one-click passing color fixes, and see how the pair holds up under four kinds of color-vision deficiency.",
  },
  {
    name: "Capture & annotate",
    hotkey: "⌥⌘S",
    description:
      "Grab a region, drop numbered issue badges mapped to WCAG success criteria with severity levels, measure touch targets against the 24×24px minimum, redact anything sensitive, then export a GitHub- or Jira-ready issue list in one click.",
  },
  {
    name: "Colorblind lens",
    hotkey: "⌥⌘L",
    description:
      "A floating lens that shows whatever is behind it through protanopia, deuteranopia, tritanopia or achromatopsia simulation — with a severity slider, low-vision blur and low-contrast filters, and a split before/after view for screenshots.",
  },
];

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. The three tools are free with no account. A paid tier with full-page WCAG scans and PDF audit reports is planned.",
  },
  {
    q: "Why does it need Screen Recording permission?",
    a: "The color picker, captures and lens all read pixels from your screen. Everything is processed locally on your Mac — nothing is uploaded, ever.",
  },
  {
    q: "What does it run on?",
    a: "macOS 12 or later on Apple Silicon. A Windows version is on the roadmap.",
  },
];

export default function DesktopPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
          Free macOS app
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Accessibility checks, anywhere on your screen
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          A menu-bar toolkit for designers, developers and auditors: WCAG + APCA
          contrast picking, annotated issue captures, and live color-blindness
          simulation. 100% local — your screen never leaves your Mac.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={DMG_URL}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="m7 10 5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            Download for macOS
          </a>
          <span className="text-sm text-muted-foreground">
            v{VERSION} · Apple Silicon · macOS 12+
          </span>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {tools.map((tool) => (
          <div key={tool.name} className="rounded-xl border bg-card p-6 text-left shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">{tool.name}</h2>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                {tool.hotkey}
              </kbd>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 rounded-2xl border bg-card p-8">
        <h2 className="text-xl font-semibold">Built for real audit work</h2>
        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <li>Delayed capture (3s) for hover states, menus and tooltips</li>
          <li>Session log — every check compiled into an exportable Markdown summary</li>
          <li>Issue types mapped to WCAG 2.2 success criteria with severity levels</li>
          <li>Fully customizable global shortcuts</li>
          <li>Multi-monitor support</li>
          <li>Auto-updates, ~5MB download, native performance</li>
        </ul>
      </section>

      <section className="mt-20">
        <h2 className="text-xl font-semibold">Questions</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="font-medium">{faq.q}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
        Prefer the browser? Try our{" "}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          free web tools
        </Link>{" "}
        — contrast checker, alt-text review and more.
      </section>
    </main>
  );
}
