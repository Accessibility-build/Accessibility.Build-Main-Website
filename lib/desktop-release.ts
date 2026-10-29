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
