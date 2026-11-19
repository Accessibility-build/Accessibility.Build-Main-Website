import Image from "next/image"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { createMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"
import {
  currentDesktopRelease,
  desktopAppStore,
  desktopDmgUrl,
  DESKTOP_RELEASES_REPO,
} from "@/lib/desktop-release"

// Every fact on this page about the shipped app (version, size, minimum macOS,
// dates, store link) comes from lib/desktop-release.ts, which mirrors Apple's
// listing. The page once advertised a version whose installer had never been
// uploaded, so nothing here is typed in by hand.
const store = desktopAppStore
const minimumMacOS = store.minimumSystemVersion.replace(/\.0$/, "")
const sizeLabel = `${(store.fileSizeBytes / 1_000_000).toFixed(1)} MB`
const pageUrl = "https://accessibility.build/desktop"

export const metadata = createMetadata({
  title: "Accessibility Build for Mac: WCAG Contrast Picker",
  path: "/desktop",
  description:
    "Free Mac App Store app: pick any two colors on screen for WCAG 2.2 and APCA results, preview color blindness with a live lens, and log captures for audits.",
  keywords: [
    "mac contrast checker",
    "macOS color contrast app",
    "WCAG contrast picker",
    "color blindness simulator mac",
    "APCA contrast mac",
    "accessibility app mac",
  ],
})

const linkClass = "font-medium text-primary underline underline-offset-2 hover:decoration-2"

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

function AppStoreButton({ className }: { className?: string }) {
  return (
    <a
      href={store.url}
      className={cn(
        "inline-flex items-center gap-3 rounded-xl bg-slate-950 px-6 py-3 text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
        className
      )}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
        <path d="M12 15V3" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-xs font-medium opacity-80">Free on the</span>
        <span className="block text-base font-semibold">Mac App Store</span>
      </span>
    </a>
  )
}

const shortcuts = {
  picker: { keys: "⌃⌥⌘C", label: "Control Option Command C" },
  lens: { keys: "⌃⌥⌘L", label: "Control Option Command L" },
  capture: { keys: "⌃⌥⌘R", label: "Control Option Command R" },
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <kbd aria-label={label} className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
      {keys}
    </kbd>
  )
}

const features = [
  {
    id: "picker",
    eyebrow: "Contrast picker",
    title: "Pick any two colors on screen, in any app",
    shortcut: shortcuts.picker,
    image: "/images/desktop/1-picker.webp",
    alt: "The contrast picker over a sample analytics dashboard. A magnified loupe sits on an orange gradient banner with a readout of #E48C62 at 2.55:1, and a bar at the bottom says Pick the background, with keys for Pick, Back and Cancel.",
    points: [
      "The screen freezes and a magnified loupe shows the exact pixel you are on",
      "Pick by mouse, or entirely by keyboard: arrow keys move one pixel, Return picks",
      "Drag across a gradient or photo to measure its lowest-contrast pixel",
      "A three-second delay keeps hover states, menus and tooltips open",
    ],
  },
  {
    id: "results",
    eyebrow: "Results",
    title: "WCAG 2.2 and APCA verdicts the moment you pick",
    image: "/images/desktop/2-check-colors.webp",
    alt: "The Check Colors window for white text on #E8743B: 3.00:1, Large text and UI only. WCAG 2.2 rows show normal text failing AA and AAA, large text passing AA, and UI components passing AA. Below are the APCA Lc value, four color-vision previews with their ratios, and the nearest passing colors.",
    points: [
      "Normal text, large text and UI components, each with the success criterion it tests",
      "The APCA Lc value, labelled as guidance from the WCAG 3 working draft",
      "The pair as people with protanopia, deuteranopia, tritanopia or achromatopsia may see it",
      "The nearest colors that pass, ready to copy or apply",
    ],
  },
  {
    id: "lens",
    eyebrow: "Color-vision lens",
    title: "See your interface through a live color-blindness filter",
    shortcut: shortcuts.lens,
    image: "/images/desktop/3-lens.webp",
    alt: "The color-vision lens in split view over a bar chart. The left half shows the original red and green bars; the right half, labelled Deuteranopia, shows them as similar olive tones. A toolbar offers Protan, Deutan, Tritan, Mono and Off.",
    points: [
      "Protanopia, deuteranopia, tritanopia and achromatopsia, with a severity slider",
      "Blur and contrast-loss filters to approximate low vision",
      "A split before-and-after view to show a team exactly what changes",
    ],
  },
  {
    id: "log",
    eyebrow: "Captures and session log",
    title: "Keep a record you can paste into the audit report",
    shortcut: shortcuts.capture,
    image: "/images/desktop/4-log-and-privacy.webp",
    alt: "The Session Log window listing two contrast checks with their ratios and results, a window capture of Safari and a region captured after a three-second delay. Beside it, the Privacy settings show Screen Recording status, a button to clear recent colors, and a note that the app makes no network requests.",
    points: [
      "Capture a region, the front window or a whole display, to the clipboard or as PNG",
      "Every check and capture lands in a session log, exported as Markdown",
      "Copy a finding sentence that cites the WCAG 2.2 success criterion",
    ],
  },
]

const faqs: FaqItem[] = [
  {
    question: "Is Accessibility Build for Mac free?",
    answer:
      "Yes. It is free on the Mac App Store, with no account, subscription or in-app purchases.",
  },
  {
    question: "Which Macs does it run on?",
    answer: `macOS ${minimumMacOS} (Sonoma) or later, on Apple Silicon and Intel Macs. The download is ${sizeLabel}.`,
  },
  {
    question: "Where is the app after I install it?",
    answer:
      "In the menu bar at the top right of your screen, next to the clock. It has no Dock icon. The first time you open it, a Welcome window points to the icon, and opening the app again from Finder or Launchpad shows that window again.",
  },
  {
    question: "Why does it need Screen Recording permission?",
    answer:
      "The picker, the lens and captures read pixel colors from other apps' windows, which macOS only allows with Screen Recording permission. The app explains this before macOS asks, and you can turn it off in System Settings under Privacy & Security at any time.",
  },
  {
    question: "Can I use it without granting Screen Recording?",
    answer:
      "Yes. The Check Colors window takes typed hex values and gives the same WCAG 2.2, APCA and color-vision results without any permission.",
  },
  {
    question: "Does it send my screen anywhere?",
    answer:
      "No. Screen pixels are processed on your Mac and never uploaded. The Mac App Store version has no network access at all: no account, analytics, tracking or crash reporting. Apple lists it as Data Not Collected.",
  },
  {
    question: "Do its ratios match the website's contrast checker?",
    answer:
      "Yes. The app uses the same contrast, APCA and color-vision maths as the free contrast checker on accessibility.build, so a pair gives the same result in both.",
  },
]

const steps = [
  { title: "Install", body: "Get Accessibility Build free from the Mac App Store and open it." },
  { title: "Find the icon", body: "A Welcome window shows where its icon sits in the menu bar." },
  {
    title: "Allow Screen Recording",
    body: "Choose Allow Screen Recording, turn on Accessibility Build in System Settings, then choose Quit and Reopen.",
  },
  { title: "Pick a pair", body: "Press Control-Option-Command-C, click any text, then its background. The results open straight away." },
]

export default function DesktopPage() {
  const directRelease = currentDesktopRelease()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Accessibility Build",
    alternateName: "Accessibility Build for Mac",
    description:
      "A free macOS menu-bar app for checking WCAG 2.2 and APCA color contrast anywhere on screen, previewing color-vision deficiencies with a live lens, and logging captures for accessibility audits.",
    url: pageUrl,
    operatingSystem: `macOS ${store.minimumSystemVersion} or later`,
    applicationCategory: "DeveloperApplication",
    softwareVersion: store.version,
    datePublished: store.releaseDate,
    dateModified: store.currentVersionDate,
    fileSize: sizeLabel,
    installUrl: store.url,
    downloadUrl: store.url,
    image: "https://accessibility.build/images/desktop/app-icon.webp",
    screenshot: features.map((f) => `https://accessibility.build${f.image}`),
    contentRating: store.ageRating,
    inLanguage: "en",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    publisher: { "@id": "https://accessibility.build/#organization" },
    sameAs: [store.url],
  }

  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Mac App", url: pageUrl },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="overflow-x-clip">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-slate-50 to-background dark:from-slate-900/60" aria-labelledby="desktop-heading">
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <Image
                src="/images/desktop/app-icon.webp"
                alt=""
                width={96}
                height={96}
                priority
                unoptimized
                className="mx-auto h-20 w-20 sm:h-24 sm:w-24"
              />
              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
                Free for macOS
              </p>
              <h1 id="desktop-heading" className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Accessibility checks, anywhere on your screen
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Accessibility Build is a menu-bar app for designers, developers and
                auditors. Pick any two colors in any app for WCAG 2.2 and APCA results,
                see your interface through a color-vision lens, and keep a log for the
                audit report. Your screen never leaves your Mac.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4">
                <AppStoreButton />
                <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground" aria-label="App details">
                  <li>Version {store.version}</li>
                  <li aria-hidden="true">·</li>
                  <li>macOS {minimumMacOS} or later</li>
                  <li aria-hidden="true">·</li>
                  <li>Apple Silicon and Intel</li>
                  <li aria-hidden="true">·</li>
                  <li>{sizeLabel}</li>
                  <li aria-hidden="true">·</li>
                  <li>No data collected</li>
                </ul>
              </div>
            </div>

            <div className="relative mx-auto mt-14 max-w-5xl">
              <Image
                src="/images/desktop/2-check-colors.webp"
                alt="Accessibility Build's Check Colors window beside a sample dashboard, showing white text on orange at 3.00:1 with WCAG 2.2 pass and fail results, the APCA value and four color-vision previews."
                width={1600}
                height={1000}
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="w-full rounded-2xl border shadow-2xl shadow-slate-900/10"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {features.map((feature, index) => (
            <section
              key={feature.id}
              aria-labelledby={`${feature.id}-heading`}
              className="grid items-center gap-10 border-b py-16 last:border-b-0 lg:grid-cols-5 lg:gap-14 lg:py-20"
            >
              <div className={cn("lg:col-span-2", index % 2 === 1 && "lg:order-2")}>
                <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-primary">
                  {feature.eyebrow}
                  {feature.shortcut ? <Shortcut {...feature.shortcut} /> : null}
                </p>
                <h2 id={`${feature.id}-heading`} className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {feature.title}
                </h2>
                <ul className="mt-6 space-y-3 text-muted-foreground">
                  {feature.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <svg className="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={cn("lg:col-span-3", index % 2 === 1 && "lg:order-1")}>
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="w-full rounded-xl border shadow-lg shadow-slate-900/5"
                />
              </div>
            </section>
          ))}
        </div>

        {/* Getting started */}
        <section className="border-y bg-muted/40" aria-labelledby="start-heading">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <h2 id="start-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
                Up and running in a minute
              </h2>
              <ol className="mt-8 space-y-6">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <Image
              src="/images/desktop/5-welcome.webp"
              alt="The Welcome window: it explains that the app lives in the menu bar, highlights its icon next to the clock, lists Pick contrast, Color-vision lens and Capture with their shortcuts, and offers Allow Screen Recording and Check Colors by Hex buttons."
              width={1600}
              height={1000}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="w-full rounded-xl border shadow-lg shadow-slate-900/5"
            />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Privacy and accessibility */}
          <section className="grid gap-6 py-16 md:grid-cols-2 lg:py-20" aria-label="Privacy and accessibility">
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-xl font-semibold">Private by design</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Screen pixels are processed on your Mac and never uploaded. The Mac
                App Store version has no network access at all: no account, no
                analytics, no tracking and no crash reporting. It runs in Apple&apos;s
                App Sandbox, and its own windows are left out of everything it reads.
                Updates come from the App Store.
              </p>
              <p className="mt-4 text-sm">
                <Link href="/desktop/privacy" className={linkClass}>Read the app&apos;s privacy policy</Link>
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-8">
              <h2 className="text-xl font-semibold">Accessible itself</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                The menu, results, settings and lens controls are built from standard
                macOS controls for VoiceOver, Full Keyboard Access and Voice Control.
                The picker works entirely from the keyboard, every shortcut can be
                changed, and anyone can check a pair without the visual tools by
                typing hex values into Check Colors.
              </p>
              <p className="mt-4 text-sm">
                <Link href="/contact" className={linkClass}>Report an accessibility problem with the app</Link>
              </p>
            </div>
          </section>

          {/* What's new */}
          <section id="changes" className="scroll-mt-24 border-t py-16" aria-labelledby="changes-heading">
            <h2 id="changes-heading" className="text-2xl font-bold tracking-tight">What&apos;s new</h2>
            <h3 className="mt-6 font-semibold">
              Version {store.version}{" "}
              <span className="text-sm font-normal text-muted-foreground">{formatDate(store.currentVersionDate)}</span>
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {store.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            {directRelease ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Prefer a direct download? Version {directRelease.version} is also available as a{" "}
                <a href={desktopDmgUrl(directRelease)} className={linkClass}>signed and notarized DMG</a>{" "}
                (SHA-256 <code className="break-all font-mono text-xs">{directRelease.sha256}</code>), listed on{" "}
                <a href={`https://github.com/${DESKTOP_RELEASES_REPO}/releases`} className={linkClass}>GitHub Releases</a>.
              </p>
            ) : null}
          </section>

          {/* FAQ */}
          <FaqSection faqs={faqs} title="Questions" className="border-t py-16" />

          {/* Closing CTA */}
          <section className="mb-20 mt-4 rounded-3xl bg-slate-950 px-6 py-14 text-center text-white sm:px-12" aria-labelledby="cta-heading">
            <h2 id="cta-heading" className="text-3xl font-bold tracking-tight">
              Check contrast without leaving the app you are in
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Free, private and {sizeLabel}. Prefer the browser? The{" "}
              <Link href="/tools/contrast-checker" className="font-medium text-white underline underline-offset-2 hover:decoration-2">
                contrast checker
              </Link>{" "}
              and the other{" "}
              <Link href="/tools" className="font-medium text-white underline underline-offset-2 hover:decoration-2">
                free web tools
              </Link>{" "}
              run anywhere.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={store.url}
                className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get it on the Mac App Store
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
