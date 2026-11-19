/**
 * Single source of truth for the Accessibility Build macOS app's releases.
 *
 * The /desktop page, its JSON-LD, the download redirect and the Sparkle
 * update feed all read from this list, so the version on the page and the
 * file people download can never drift apart. Add one entry per release
 * (newest first) using the values the app repo's release script prints.
 *
 * The list was empty until the first signed release: the page previously
 * advertised a version whose installer had never been uploaded, and the
 * download link ended in a 404.
 */

export interface DesktopRelease {
  /** Marketing version, e.g. "1.0.0" (CFBundleShortVersionString). */
  version: string
  /** Build number Sparkle compares (CFBundleVersion). */
  build: string
  /** ISO date the release was published. */
  date: string
  /** Lowest macOS the build runs on, e.g. "14.0". */
  minimumSystemVersion: string
  /** DMG size in bytes, as uploaded. */
  length: number
  /** Sparkle EdDSA signature of the DMG (sign_update output). */
  edSignature: string
  /** SHA-256 of the DMG, shown for manual verification. */
  sha256: string
  /** Plain-language notes, one item per user-visible change. */
  notes: string[]
}

/**
 * The Mac App Store listing. This is how the app is distributed today: the
 * direct (Developer ID) download below stays empty until a DMG is published
 * on GitHub Releases. Values come from Apple's lookup API
 * (https://itunes.apple.com/lookup?id=6828445898); refresh them when a new
 * version goes live in the store.
 */
export const desktopAppStore = {
  id: "6828445898",
  url: "https://apps.apple.com/app/accessibility-build/id6828445898",
  version: "1.0.0",
  /** First release date in the store (ISO). */
  releaseDate: "2026-11-19",
  /** Date the current version went live (ISO). */
  currentVersionDate: "2026-11-19",
  minimumSystemVersion: "14.0",
  /** Download size Apple reports, in bytes. */
  fileSizeBytes: 1_736_251,
  category: "Developer Tools",
  ageRating: "4+",
  /** Plain-language notes for the current store version. */
  notes: [
    "First release: contrast picker, color-vision lens, captures and session log.",
    "WCAG 2.2 results for normal text, large text and UI components, plus APCA Lc.",
    "Check Colors window for typed hex values, usable without Screen Recording permission.",
  ],
} as const

export const DESKTOP_RELEASES_REPO = "Accessibility-build/accessibility-build-desktop"

export const desktopReleases: DesktopRelease[] = []

export function currentDesktopRelease(): DesktopRelease | null {
  return desktopReleases[0] ?? null
}

export function desktopDmgName(version: string): string {
  return `Accessibility-Build-${version}.dmg`
}

export function desktopDmgUrl(release: DesktopRelease): string {
  return `https://github.com/${DESKTOP_RELEASES_REPO}/releases/download/v${release.version}/${desktopDmgName(release.version)}`
}
