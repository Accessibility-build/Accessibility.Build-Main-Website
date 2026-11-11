// Result shape of the dark mode contrast checker, shared by the API route and the client page.

export type Scheme = "light" | "dark"

export interface Shot {
  /** data:image/jpeg;base64,... */
  dataUrl: string
  width: number
  height: number
}

export interface ContrastItem {
  selector: string
  /** Visible text of the element, trimmed. */
  text: string
  fg: string | null
  bg: string | null
  ratio: number | null
  /** Required ratio, 4.5 or 3 (large text). */
  required: number | null
}

/** A contrast failure matched across the two renders. */
export interface ContrastFinding {
  where: "dark-only" | "light-only" | "both"
  selector: string
  text: string
  light: ContrastItem | null
  dark: ContrastItem | null
  /** Why it broke, when the two renders make it clear (for example a text colour with no dark value). */
  hint: string | null
}

/** Which render a finding appeared in. */
export type Where = Scheme | "both"

export interface InvisibleItem extends ContrastItem {
  where: Where
}

export interface ReviewItem {
  where: Where
  selector: string
  text: string
  /** axe's reason code, for example bgImage or bgGradient. */
  reason: string
}

export interface LinkItem {
  where: Where
  selector: string
  text: string
  /** Contrast between the link colour and the surrounding text, when axe reports it. */
  ratio: number | null
}

export type Support = "none" | "light" | "light-dark" | "dark" | "light-only"

export interface Declaration {
  /** content of the first <meta name="color-scheme">, or null. */
  meta: string | null
  /** Computed color-scheme on html and body ("normal" when not set). */
  rootColorScheme: string
  bodyColorScheme: string
  supports: Support
  /** Where the deciding value came from. */
  source: "meta" | "html" | "body" | null
  /** The meta tag and the root element's CSS disagree; the CSS wins. */
  metaOverridden: boolean
  /** <picture><source media="(prefers-color-scheme: dark)"> elements. */
  darkPictureSources: number
  /** <meta name="theme-color" media="(prefers-color-scheme: ...)"> present. */
  themeColorByScheme: boolean
}

export interface DarkTheme {
  /** Computed text or background colours changed between the two schemes. */
  respondsToPreference: boolean
  /** Share of sampled text elements whose colour or background changed (0 to 1). */
  changedShare: number
  sampled: number
  /** The page background (html or body) changed. */
  backgroundChanged: boolean
  /** @media (prefers-color-scheme: dark) blocks found in the stylesheets we could read. */
  darkMediaRules: number
  usesLightDarkFunction: boolean
  stylesheetsRead: number
  /** Light and dark page background colours, as computed. */
  lightBackground: string
  darkBackground: string
}

export type RiskKind = "bitmap-logo" | "canvas" | "mask" | "blend-mode" | "tiled-background"

export interface Risk {
  kind: RiskKind
  selector: string
  detail: string
}

export interface RiskGroup {
  kind: RiskKind
  total: number
  items: Risk[]
}

export type AdaptiveVerdict = "skipped-declares-light-dark" | "skipped-declares-dark" | "opted-out-light-only" | "already-dark" | "will-adapt"

export interface AdaptiveDarkMode {
  verdict: AdaptiveVerdict
  reason: string
  /** Mean relative luminance of the dark render, 0 (black) to 1 (white). */
  darkRenderLuminance: number | null
  /** Chromium's automatic dark theme, as an approximation. Null when the page would be skipped. */
  preview: Shot | null
}

export interface SchemeSummary {
  failures: number
  invisible: number
  links: number
  review: number
  /** Canvas system colour for this scheme, as computed. */
  canvas: string
  screenshot: Shot | null
}

export interface DarkModeResult {
  url: string
  finalUrl: string
  title: string
  durationMs: number
  declaration: Declaration
  darkTheme: DarkTheme
  light: SchemeSummary
  /** Null only when the dark render could not be completed. */
  dark: SchemeSummary | null
  counts: { darkOnly: number; lightOnly: number; both: number; invisible: number; links: number; review: number }
  contrast: ContrastFinding[]
  invisible: InvisibleItem[]
  links: LinkItem[]
  review: ReviewItem[]
  adaptive: AdaptiveDarkMode
  risks: RiskGroup[]
  /** Lists cut short to keep the response small. */
  truncated: boolean
  notes: string[]
}
