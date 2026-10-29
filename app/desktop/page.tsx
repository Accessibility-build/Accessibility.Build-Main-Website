import type { Metadata } from "next";
import Link from "next/link";
import { clampDescription } from "@/lib/metadata"

// The app is not released yet. This page used to advertise a version and a
// download that had never been published (the button ended in a 404), so it
// now says plainly what is coming and points to tools that work today. When
// lib/desktop-release.ts gets its first entry, this page is rewritten around
// the shipped build.
export const metadata: Metadata = {
  title: "Accessibility Build for Mac (in development)",
  description: clampDescription(
    "A free macOS menu-bar app for checking color contrast and color-vision accessibility anywhere on screen is in development. Use the free web tools today."
  ),
  alternates: { canonical: "https://accessibility.build/desktop" },
};

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

export default function DesktopPage() {
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
        <Link href="/tools/contrast-checker" className="font-medium text-primary underline underline-offset-2 hover:decoration-2">
          contrast checker
        </Link>{" "}
        and the other{" "}
        <Link href="/tools" className="font-medium text-primary underline underline-offset-2 hover:decoration-2">
          free web tools
        </Link>{" "}
        run in your browser.
      </section>
    </div>
  );
}
