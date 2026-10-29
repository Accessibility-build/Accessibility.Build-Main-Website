import type { Metadata } from "next";
import Link from "next/link";
import { clampDescription } from "@/lib/metadata"
import {
  currentDesktopRelease,
  desktopDmgUrl,
  desktopReleases,
  DESKTOP_RELEASES_REPO,
  type DesktopRelease,
} from "@/lib/desktop-release"

// Everything on this page that describes a build (version, size, download,
// JSON-LD, changelog) comes from lib/desktop-release.ts. Until that list has
// an entry the page says the app is in development: it once advertised a
// version whose installer had never been uploaded, and the download link
// ended in a 404.
const release = currentDesktopRelease()

export const metadata: Metadata = release
  ? {
      title: "Accessibility Build for Mac: Contrast Picker and Lens",
      description: clampDescription(
        "Free macOS menu-bar app: pick any two colors on screen for WCAG 2.2 and APCA results, see them through a live color-vision lens, and capture regions. Runs on your Mac."
      ),
      alternates: { canonical: "https://accessibility.build/desktop" },
    }
  : {
      title: "Accessibility Build for Mac (in development)",
      description: clampDescription(
        "A free macOS menu-bar app for checking color contrast and color-vision accessibility anywhere on screen is in development. Use the free web tools today."
      ),
      alternates: { canonical: "https://accessibility.build/desktop" },
    };

const linkClass = "font-medium text-primary underline underline-offset-2 hover:decoration-2"

function megabytes(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`
}

export default function DesktopPage() {
  return release ? <ReleasedPage release={release} /> : <InDevelopmentPage />
}

const tools = [
  {
    name: "Contrast picker",
    hotkey: "⌃⌥⌘C",
    hotkeyLabel: "Control Option Command C",
    description:
      "Freeze the screen and pick text and background colors with a magnified pixel loupe, by mouse or entirely by keyboard. See WCAG 2.2 results for normal text, large text and UI components, the APCA Lc value, the nearest passing colors, and the pair as four color-vision deficiencies may see it.",
  },
  {
    name: "Color-vision lens",
    hotkey: "⌃⌥⌘L",
    hotkeyLabel: "Control Option Command L",
    description:
      "A floating lens that shows whatever is beneath it as protanopia, deuteranopia, tritanopia or achromatopsia, with a severity slider, blur and contrast-loss filters for low vision, and a split before and after view.",
  },
  {
    name: "Quick capture",
    hotkey: "⌃⌥⌘R",
    hotkeyLabel: "Control Option Command R",
    description:
      "Capture a region, the front window or a whole display, optionally after a three-second delay so hover states, menus and tooltips stay open. Captures go to the clipboard and can be saved as PNG.",
  },
];

function ReleasedPage({ release }: { release: DesktopRelease }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Accessibility Build",
    operatingSystem: `macOS ${release.minimumSystemVersion.replace(/\.0$/, "")} or later`,
    applicationCategory: "DeveloperApplication",
    softwareVersion: release.version,
    datePublished: release.date,
    fileSize: megabytes(release.length),
    downloadUrl: "https://accessibility.build/api/desktop/download",
    releaseNotes: "https://accessibility.build/desktop#changes",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": "https://accessibility.build/#organization" },
  };
  const minimum = release.minimumSystemVersion.replace(/\.0$/, "")
  const githubRelease = `https://github.com/${DESKTOP_RELEASES_REPO}/releases/tag/v${release.version}`

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Free macOS app</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Accessibility checks, anywhere on your screen
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          A menu-bar toolkit for designers, developers and auditors: WCAG 2.2 and
          APCA contrast picking, a live color-vision lens, and quick captures.
          Your screen is processed on your Mac and never uploaded.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/api/desktop/download"
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
            Version {release.version}, {megabytes(release.length)}, macOS {minimum} or later, Apple Silicon and Intel
          </span>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">Tools</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {tools.map((tool) => (
            <div key={tool.name} className="rounded-xl border bg-card p-6 text-left shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">{tool.name}</h3>
                <kbd aria-label={tool.hotkeyLabel} className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                  {tool.hotkey}
                </kbd>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-2xl border bg-card p-8" aria-labelledby="audit-heading">
        <h2 id="audit-heading" className="text-xl font-semibold">Built for real audit work</h2>
        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <li>Drag across a gradient or photo to use its lowest-contrast pixel</li>
          <li>Pick with the keyboard: arrow keys move one pixel, Return picks</li>
          <li>Three-second delay for hover states, menus and tooltips</li>
          <li>Session log of every check and capture, exported as Markdown</li>
          <li>Copy a finding sentence that cites the WCAG 2.2 success criterion</li>
          <li>Shortcuts you can change, and every display supported</li>
          <li>Signed and notarized by Apple, with signed automatic updates</li>
          <li>Ratios match the website&apos;s contrast checker exactly</li>
        </ul>
      </section>

      <section className="mt-20 grid gap-10 md:grid-cols-2">
        <div aria-labelledby="privacy-heading">
          <h2 id="privacy-heading" className="text-xl font-semibold">Privacy</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Screen pixels are processed on your Mac and never uploaded. There is
            no account, no analytics and no tracking. The only network requests
            are the update check, which fetches a small file from
            accessibility.build, and the update download from GitHub when you
            choose to install one. The app runs in Apple&apos;s App Sandbox.
          </p>
        </div>
        <div aria-labelledby="a11y-heading">
          <h2 id="a11y-heading" className="text-xl font-semibold">Accessibility of the app</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The menu, results, settings and lens controls are standard macOS
            controls that work with VoiceOver, Full Keyboard Access and Voice
            Control. The picker works from the keyboard and reads colors aloud on
            request. The picker and lens are visual tools; anyone can check a
            pair without them by typing the hex values into Check Colors.
          </p>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-xl font-semibold">Questions</h2>
        <dl className="mt-6 space-y-6">
          <div>
            <dt className="font-medium">Is it free?</dt>
            <dd className="mt-1 text-sm text-muted-foreground">Yes, with no account.</dd>
          </div>
          <div>
            <dt className="font-medium">Why does it need Screen Recording permission?</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              The picker, the lens and captures read pixels from your screen, which
              macOS only allows with that permission. The first time you use a tool,
              the app explains the steps. You can revoke it in System Settings at
              any time.
            </dd>
          </div>
          <div>
            <dt className="font-medium">What does it run on?</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              macOS {minimum} or later, on Apple Silicon and Intel Macs.
            </dd>
          </div>
          <div>
            <dt className="font-medium">How can I check the download?</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              The DMG is signed with our Developer ID and notarized by Apple. Its
              SHA-256 is <code className="break-all font-mono text-xs">{release.sha256}</code>, also
              listed on the{" "}
              <a href={githubRelease} className={linkClass}>GitHub release</a>.
            </dd>
          </div>
        </dl>
      </section>

      <section id="changes" className="mt-20 scroll-mt-24" aria-labelledby="changes-heading">
        <h2 id="changes-heading" className="text-xl font-semibold">Changes</h2>
        <div className="mt-6 space-y-8">
          {desktopReleases.map((r) => (
            <div key={r.version}>
              <h3 className="font-medium">
                Version {r.version}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {new Date(`${r.date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                </span>
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {r.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm">
                <a href={desktopDmgUrl(r)} className={linkClass}>Download version {r.version}</a>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
        Prefer the browser? The{" "}
        <Link href="/tools/contrast-checker" className={linkClass}>contrast checker</Link>{" "}
        and the other{" "}
        <Link href="/tools" className={linkClass}>free web tools</Link>{" "}
        run in any browser.
      </section>
    </div>
  );
}

const plannedTools = [
  {
    name: "Contrast picker",
    description:
      "Pick text and background colors from anything on your screen with a magnified pixel loupe, then see the WCAG 2.2 contrast ratio, APCA Lc, and the nearest colors that pass.",
  },
  {
    name: "Color-vision lens",
    description:
      "A floating lens that shows whatever is beneath it as people with protanopia, deuteranopia, tritanopia or achromatopsia may see it, with blur and low-contrast filters for low vision.",
  },
  {
    name: "Quick capture",
    description:
      "Capture a region, a window or a whole display, with an optional three-second delay so hover states, menus and tooltips stay open.",
  },
];

function InDevelopmentPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
          In development
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Accessibility Build for Mac
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          A free menu-bar app for checking color contrast and color-vision
          accessibility anywhere on your screen. It is not available to
          download yet. We will publish it on this page once the first signed
          and notarized release has passed testing.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/tools/contrast-checker"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Check contrast in your browser
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            See all free tools
          </Link>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="planned-heading">
        <h2 id="planned-heading" className="text-xl font-semibold">
          What the first release will include
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {plannedTools.map((tool) => (
            <div key={tool.name} className="rounded-xl border bg-card p-6 text-left shadow-sm">
              <h3 className="mb-3 text-base font-semibold">{tool.name}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-2xl border bg-card p-8" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading" className="text-xl font-semibold">
          Built to stay on your Mac
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The app is being designed to work without an account. Screen pixels
          are processed on your Mac and never uploaded. The only network
          request it will make is the check for updates.
        </p>
      </section>

      <section className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
        Until then, the{" "}
        <Link href="/tools/contrast-checker" className={linkClass}>
          contrast checker
        </Link>{" "}
        and the other{" "}
        <Link href="/tools" className={linkClass}>
          free web tools
        </Link>{" "}
        run in your browser.
      </section>
    </div>
  );
}
