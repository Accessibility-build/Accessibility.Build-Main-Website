import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import Link from "next/link"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Android App Walkthrough | Accessibility.build",
  path: "/android/review",
  description: "Watch Build with Accessibility for Android: screen-access disclosure, consent choices, on-device capture, and audit findings. Captions and transcript included.",
  keywords: ["Android accessibility auditor", "Build with Accessibility walkthrough"],
})

const mediaPath = "/android/review"
const linkClass = "font-medium text-primary underline underline-offset-4 hover:decoration-2"
const transcript = [
  ["00:00", "Build with Accessibility: opening the signed Android 1.0.0 release."],
  ["00:08", "The full disclosure explains screen content, screenshots, local storage, and auditing. Continue is disabled until consent."],
  ["00:22", "Choose Not now. The auditor opens with screen access disabled."],
  ["00:27", "Open Accessibility settings returns to the disclosure. Consent is still unchecked."],
  ["00:32", "Agree to screen access, then open Android Accessibility settings and select Build with Accessibility."],
  ["00:54", "Android asks for confirmation before enabling the accessibility service."],
  ["01:01", "Choose the optional floating capture control, then open a synthetic test screen and trigger a capture."],
  ["01:14", "The service captures screen evidence and runs accessibility checks locally."],
  ["01:21", "The predicted reading order is approximate. Actual TalkBack testing remains necessary."],
  ["01:29", "Review captured conditions and findings with confidence, severity, and fix guidance."],
  ["01:37", "Finding details identify the affected control in the captured screen."],
  ["01:44", "Use the manual checklist for tests that automation cannot complete."],
  ["01:50", "Saved sessions keep audit captures and results together."],
  ["01:54", "Keyboard focus is visibly outlined. Audits stay on the device until the user exports them."],
] as const

export default function AndroidReviewPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={[{ name: "Home", url: "https://accessibility.build" }, { name: "Build with Accessibility for Android: Release walkthrough", url: "https://accessibility.build/android/review" }]} />
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <p className="text-sm font-semibold uppercase text-primary">Build with Accessibility for Android</p>
          <h1 className="mt-3 text-4xl font-semibold">Release walkthrough</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            See how version 1.0.0 explains screen access, respects your consent choices,
            and captures evidence for an accessibility audit.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Android 11 and later · 2 minutes · Recorded <time dateTime="2026-10-31">31 October 2026</time>
          </p>
        </header>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: "Build with Accessibility for Android: Release walkthrough",
              description: "How version 1.0.0 explains screen access, respects consent choices, and captures evidence for an accessibility audit.",
              thumbnailUrl: `https://accessibility.build${mediaPath}/poster-1.0.0.png`,
              contentUrl: `https://accessibility.build${mediaPath}/walkthrough-1.0.0.mp4`,
              uploadDate: "2026-10-31",
              duration: "PT1M59S",
            }),
          }}
        />

        <section className="mt-8" aria-labelledby="video-heading">
          <h2 id="video-heading" className="text-2xl font-semibold">Watch the app in use</h2>
          <p id="video-description" className="mt-3 leading-7 text-muted-foreground">
            This silent recording shows the signed release using synthetic test data.
            It includes the full disclosure, declining access and reopening consent,
            Android service activation, a user-triggered capture, and the audit workflow.
            English captions and a transcript describe the steps.
          </p>
          <video
            controls
            playsInline
            preload="metadata"
            width={1080}
            height={1920}
            poster={`${mediaPath}/poster-1.0.0.png`}
            aria-label="Build with Accessibility version 1.0.0 walkthrough"
            aria-describedby="video-description"
            className="mt-6 max-h-[75vh] w-full rounded-xl bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <source src={`${mediaPath}/walkthrough-1.0.0.mp4`} type="video/mp4" />
            <track src={`${mediaPath}/captions-1.0.0.vtt`} kind="captions" srcLang="en" label="English" default />
            Your browser does not support embedded video. Use the download link below or read the transcript.
          </video>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <li><a href={`${mediaPath}/walkthrough-1.0.0.mp4`} download className={linkClass}>Download video (MP4, 8 MB)</a></li>
            <li><a href={`${mediaPath}/captions-1.0.0.vtt`} download className={linkClass}>Download English captions</a></li>
            <li><a href="#transcript" className={linkClass}>Read the transcript</a></li>
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="transcript">
          <h2 id="transcript" className="scroll-mt-24 text-2xl font-semibold">Transcript</h2>
          <ol className="mt-5 space-y-5">
            {transcript.map(([time, text]) => (
              <li key={time} className="flex flex-col gap-1 leading-7 sm:flex-row sm:gap-5">
                <span className="shrink-0 font-semibold tabular-nums">{time}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <aside className="mt-12 border-t pt-6 leading-7">
          <p>Automated findings and reading-order predictions support manual testing; they do not certify accessibility conformance.</p>
          <p className="mt-3">
            Read the <Link href="/android/privacy" className={linkClass}>Android app privacy policy</Link>{" "}
            or <Link href="/contact" className={linkClass}>contact Accessibility.build</Link>.
          </p>
        </aside>
      </article>
    </div>
    </>
  )
}
