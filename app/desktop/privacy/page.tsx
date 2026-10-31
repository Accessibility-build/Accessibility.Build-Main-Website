import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { company } from "@/lib/company"

// The privacy policy for the macOS app. The Mac App Store requires one URL
// for it in App Store Connect and a link to it inside the app (guideline
// 5.1.1); the app links here from Settings and the About window. Keep it in
// step with the app's docs/PRIVACY.md.
const lastUpdated = "29 October 2026"

export const metadata = createMetadata({
  title: "Mac App Privacy Policy | Accessibility.build",
  path: "/desktop/privacy",
  description:
    "Accessibility Build for Mac processes your screen on your Mac and collects no personal data: no account, analytics or tracking. What it reads, stores and sends.",
  keywords: ["Accessibility Build privacy", "macOS contrast checker privacy", "screen recording privacy"],
})

const linkClass = "font-medium text-primary underline underline-offset-2 hover:decoration-2"

export default function DesktopPrivacyPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={[{ name: "Home", url: "https://accessibility.build" }, { name: "Desktop App", url: "https://accessibility.build/desktop" }, { name: "Mac App Privacy Policy", url: "https://accessibility.build/desktop/privacy" }]} />
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <p className="text-sm font-semibold uppercase text-primary">Accessibility Build for Mac</p>
          <h1 className="mt-3 text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            The app collects no personal data. It reads your screen only while
            you use one of its tools, processes what it reads on your Mac, and
            never uploads it.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </header>

        <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
          <h2>What the app reads</h2>
          <p>
            With the Screen Recording permission you grant in macOS System
            Settings, the app reads pixels from your screen only while you use
            a tool:
          </p>
          <ul>
            <li>The contrast picker and region capture take one still image of each display when you start them and discard it when you finish.</li>
            <li>The color-vision lens reads only the area under its own window while it is open and keeps no frames.</li>
            <li>The app&apos;s own windows are left out of everything it reads.</li>
          </ul>
          <p>
            This happens on your Mac. Screen contents are never sent to us or
            to anyone else. You can turn the permission off at any time in
            System Settings, under Privacy &amp; Security.
          </p>

          <h2>What the app stores</h2>
          <ul>
            <li>Your settings, keyboard shortcuts and the last ten color pairs you checked, inside the app&apos;s private container on your Mac. Settings has a button to clear the color pairs.</li>
            <li>The session log stays in memory and is gone when you quit, unless you save it.</li>
            <li>Captures and logs are saved only where you choose, when you choose.</li>
          </ul>
          <p>Deleting the app removes its container and everything in it.</p>

          <h2>What the app sends</h2>
          <ul>
            <li>
              <strong>Mac App Store version:</strong> nothing. It makes no
              network requests. The App Store delivers its updates, under{" "}
              <a href="https://www.apple.com/legal/privacy/" className={linkClass}>Apple&apos;s privacy policy</a>.
            </li>
            <li>
              <strong>Version downloaded from this website:</strong> one update
              check that fetches a small file from accessibility.build. Like
              any web request it reveals your IP address to our hosting
              provider, and it includes the app&apos;s version number. When you
              choose to install an update, it is downloaded from GitHub, under{" "}
              <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" className={linkClass}>GitHub&apos;s privacy statement</a>.
            </li>
          </ul>
          <p>
            There is no account, no analytics, no advertising, no tracking, no
            crash reporting and no AI service in the app.
          </p>

          <h2>Children</h2>
          <p>The app collects no information from anyone, including children.</p>

          <h2>This website</h2>
          <p>
            Visiting accessibility.build or downloading the app from it is
            covered by the <Link href="/privacy" className={linkClass}>website privacy policy</Link>,
            not this one.
          </p>

          <h2>Changes and contact</h2>
          <p>
            If the app ever starts handling data differently, this page will
            change first and the date above will move. The app is published by{" "}
            {company.legalOperator}, who operates {company.brandName}. Questions
            go to <a href={`mailto:${company.privacyEmail}`} className={linkClass}>{company.privacyEmail}</a>.
          </p>
        </div>
      </article>
    </div>
    </>
  )
}
