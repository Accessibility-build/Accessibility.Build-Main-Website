# Build with Accessibility for Android: design language

This document is the only reference the Android codebase has to the Accessibility.build brand. The Android app is a standalone product in its own repository; it does not share code, CSS or assets with the website. Everything the app needs to look and sound like part of Accessibility.build is written here, with values converted from the website's tokens on 30 October 2026. When this document and your own taste disagree, follow this document.

Spelling note for the UI: use US English (color, center, gray), matching the website's tool names such as "Color Contrast Checker".

## 1. What the brand feels like

Accessibility.build is a founder-run, independent accessibility practice based in India with an international audience of developers, designers and auditors. The website reads like a careful colleague, not a marketing site. The app should feel the same.

- **Plain and precise.** Short sentences. Technical nouns used correctly (success criterion, content description, touch target). No exclamation marks, no hype words ("powerful", "seamless", "revolutionary").
- **Honest about limits.** The website repeatedly says things like "A baseline is not an accessibility approval" and "a prompt is not a WCAG determination". The app must do the same: automated checks find some problems; a clean scan is never called "accessible" or "compliant".
- **Calm visual tone.** White or near-black surfaces, slate neutrals, one blue for actions, one teal for labels, colored tints only for callouts and status. Flat, bordered cards instead of shadows and gradients. Generous whitespace.
- **Accessibility is the proof.** The app audits other apps, so its own UI must be flawless under TalkBack, Switch Access, 200 percent font scale, dark mode and keyboard. A visible defect in our own UI costs more trust than a missing feature.

Voice samples from the website, for calibration:

- Home page heading: "WCAG audits and accessibility work that holds up." Sub-line: "Founder-led audits, remediation, and training with reproducible evidence, clear ownership, and reporting in the format your team uses."
- Eyebrow above the home heading: a small teal square, then "Accessibility.build", then "Independent accessibility practice" in muted text.
- WordPress plugin page heading: "Accessibility work continues after launch." Feature copy: "A baseline is not an accessibility approval."

**Signature motif.** The home heading highlights its last two words in a filled `primary` box with `onPrimary` text and four small L-shaped corner brackets in the foreground color, like a selection handle around an element. The app may reuse this motif once, on the first-run screen heading (for example "Audit any Android app, **on the device**." with the bold phrase in the box). Do not use it anywhere else; it is a signature, not a component.

## 2. Naming

| Item | Value |
|---|---|
| Product name | Build with Accessibility |
| Maker | Accessibility.build |
| Short name (launcher, under 12 characters) | Build with A11y |
| Eyebrow line on first screen and About | `Build with Accessibility · Android auditor` (middle dot U+00B7 with spaces around it, as the website uses for "Build with Accessibility · WordPress plugin") |
| Application ID | `build.accessibility.auditor` |
| Website links from the app | `https://accessibility.build`, `https://accessibility.build/tools`, `https://accessibility.build/wcag/{criterion-slug}` for criterion explanations (see the product plan for slug rules) |
| Support email | contact@accessibility.build |

The word "Accessibility.build" is always written with the capital A and the dot, never "accessibility build" or "A11y Build" in copy. The launcher short name is the one exception, forced by length.

## 3. Logo and app icon

The website mark is a filled circle containing a stylized "A" with two curved "sound wave" strokes crossing it. It is theme-driven: a foreground-colored disc with the glyph cut out in the background color, so it flips naturally between light and dark.

Reference SVG (48 x 48 viewBox), with the website's variables resolved to light-mode values:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
  <circle cx="24" cy="24" r="22" fill="#020817"/>
  <path d="M24 10 L14 38 L18 38 L20 32 L28 32 L30 38 L34 38 L24 10 Z" fill="#ffffff" stroke-linejoin="round"/>
  <path d="M21 28 L27 28 L24 19 L21 28 Z" fill="#020817"/>
  <path d="M14 22 Q24 16 34 22" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M14 26 Q24 32 34 26" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>
```

Rules:

- In the app bar and About screen, draw the mark with the current `onSurface` color for the disc and `surface` for the glyph, exactly as the website does. 32 dp tall in the top app bar, 64 dp on the About screen. Mark it decorative (`contentDescription = null`); the adjacent text "Build with Accessibility" carries the name.
- **Adaptive launcher icon**: background layer solid `#020817` (slate 950); foreground layer the white "A" glyph and waves, scaled so the glyph sits inside the 66 dp safe zone of the 108 dp canvas; monochrome layer the same glyph path for themed icons (Android 13+). Do not put the circle in the foreground layer; the system mask supplies the shape.
- Never recolor the mark with the blue or teal accents. Never add a drop shadow or gradient.

## 4. Color

### 4.1 Core tokens

These are the website's CSS variables converted to hex. The light set is what visitors see on the site; the dark set is the `.dark` theme. Material 3 role names on the right are how they map into a Compose `ColorScheme`.

| Token | Light | Dark | Material 3 role |
|---|---|---|---|
| background | `#FFFFFF` | `#020817` | `background`, `surface` |
| foreground | `#020817` | `#F8FAFC` | `onBackground`, `onSurface` |
| card | `#FFFFFF` | `#020817` | `surfaceContainerLowest` (cards use a border, not tone) |
| secondary / muted / accent surface | `#F1F5F9` | `#1E293B` | `surfaceContainer`, `secondaryContainer` |
| muted-foreground | `#5A687D` | `#94A3B8` | `onSurfaceVariant` |
| border / input | `#E2E8F0` | `#1E293B` | `outlineVariant` |
| primary | `#2563EB` | `#3B82F6` | `primary` |
| primary-foreground | `#F8FAFC` | `#020817` | `onPrimary` |
| primary-hover (pressed) | `#1D4ED8` | `#60A5FA` | pressed state of `primary` |
| ring (focus) | `#2563EB` | `#E4EAFB` | focus indicator color |
| destructive | `#B91C1C` | `#F87171` | `error` |
| destructive-foreground | `#F8FAFC` | `#020817` | `onError` |
| destructive-hover | `#991B1B` | `#FCA5A5` | pressed state of `error` |

Note on `primary` in light mode: `#2563EB` with white text is 5.17:1, which passes AA for text. The website's marketing pages prefer the darker `#1D4ED8` (blue 700, 6.70:1 with white) for primary buttons. **Use `#1D4ED8` as the light-mode `primary` in the app** so every filled button clears 4.5:1 with margin, and `#1E40AF` (blue 800) as its pressed state. Keep `#2563EB` for the focus ring and for link text on tinted backgrounds.

### 4.2 Neutrals (Tailwind slate scale, used everywhere on the site)

| Step | Hex | Typical use on the site |
|---|---|---|
| slate 50 | `#F8FAFC` | tinted panels in light mode, body text in dark mode |
| slate 100 | `#F1F5F9` | muted surfaces, inline code background |
| slate 200 | `#E2E8F0` | borders, dividers (light) |
| slate 300 | `#CBD5E1` | secondary text in dark mode (12.0:1 on slate 900) |
| slate 400 | `#94A3B8` | muted text in dark mode (6.96:1 on slate 900) |
| slate 500 | `#64748B` | not used for text on white (4.76:1 is too close); icons only |
| slate 600 | `#475569` | secondary body text, light mode (7.58:1 on white) |
| slate 700 | `#334155` | body text, light mode (10.35:1 on white) |
| slate 800 | `#1E293B` | dark surfaces, borders in dark mode |
| slate 900 | `#0F172A` | dark cards and panels |
| slate 950 | `#020617` | darkest page background, launcher icon background |

### 4.3 Accents

| Role | Light | Dark | Where it appears |
|---|---|---|---|
| Action blue (buttons, primary links) | `#1D4ED8` blue 700 | `#60A5FA` blue 400 on dark surfaces (7.0:1 on slate 900) | filled buttons, link text, list bullets, progress |
| Link text | `#1D4ED8` with underline | `#93C5FD` blue 300 | inline links, always underlined |
| Label teal (eyebrows, section labels, "ongoing practice" callouts) | `#0F766E` teal 700 (5.47:1 on white) | `#5EEAD4` teal 300 (12.1:1 on slate 900) | small semibold eyebrow text above headings, left border of informational callouts |
| Teal deep | `#115E59` teal 800 | `#2DD4BF` teal 400 | eyebrow text on tinted panels |

The website also defines five brand accent colors used sparingly on illustrations and charts: purple `#366EF2` / dark `#5182F6`, teal `#18B1B4` / `#15D2D5`, coral `#F36249` / `#FA806B`, yellow `#FAC72E` / `#FDD55D`, gray `#738296` / `#A9B0BC`. Use them only for data visualization fills and decorative illustration, never for text, never to convey status.

### 4.4 Status and severity

Findings use the same four-level impact scale as the website's audit engine (axe-core's scale): **Critical, Serious, Moderate, Minor**, plus **Needs review** for things a human must judge and **Passed** for checks that ran clean. Colors carry the status, but a label or icon always accompanies the color (WCAG 1.4.1).

| Status | Light: text on tint | Light: tint background | Dark: text | Dark: tint background | Icon (Lucide) |
|---|---|---|---|---|---|
| Critical | `#7F1D1D` red 900 | `#FEE2E2` red 100 (8.2:1) | `#FCA5A5` red 300 | `#450A0A` red 950 | `octagon-alert` |
| Serious | `#7C2D12` orange 900 | `#FFEDD5` orange 100 | `#FDBA74` orange 300 | `#431407` orange 950 | `triangle-alert` |
| Moderate | `#78350F` amber 900 | `#FEF3C7` amber 100 (8.2:1) | `#FCD34D` amber 300 | `#451A03` amber 950 | `circle-alert` |
| Minor | `#1E3A8A` blue 900 | `#DBEAFE` blue 100 (8.5:1) | `#93C5FD` blue 300 | `#172554` blue 950 | `info` |
| Needs review | `#334155` slate 700 | `#F1F5F9` slate 100 | `#CBD5E1` slate 300 | `#1E293B` slate 800 | `eye` |
| Passed | `#064E3B` emerald 900 | `#D1FAE5` emerald 100 (8.6:1) | `#6EE7B7` emerald 300 | `#022C22` emerald 950 | `circle-check` |

Solid status fills (for counters and chart segments) use the 700 step in light mode (`#B91C1C` red, `#C2410C` orange, `#B45309` amber, `#1D4ED8` blue, `#047857` emerald), each at least 5.0:1 with white text, and the 300 or 400 step with slate 900 text in dark mode.

### 4.5 Dynamic color

Do **not** enable Material You dynamic color. The palette above has verified contrast; a wallpaper-derived palette would not. Offer no "use system colors" option in version 1.

### 4.6 Compose color scheme

```kotlin
val LightColors = lightColorScheme(
    primary = Color(0xFF1D4ED8),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFDBEAFE),
    onPrimaryContainer = Color(0xFF1E3A8A),
    secondary = Color(0xFF0F766E),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFF1F5F9),
    onSecondaryContainer = Color(0xFF020817),
    tertiary = Color(0xFF115E59),
    onTertiary = Color(0xFFFFFFFF),
    error = Color(0xFFB91C1C),
    onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFFEE2E2),
    onErrorContainer = Color(0xFF7F1D1D),
    background = Color(0xFFFFFFFF),
    onBackground = Color(0xFF020817),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF020817),
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = Color(0xFF475569),
    surfaceContainerLowest = Color(0xFFFFFFFF),
    surfaceContainerLow = Color(0xFFF8FAFC),
    surfaceContainer = Color(0xFFF1F5F9),
    surfaceContainerHigh = Color(0xFFE2E8F0),
    surfaceContainerHighest = Color(0xFFCBD5E1),
    outline = Color(0xFF94A3B8),
    outlineVariant = Color(0xFFE2E8F0),
    inverseSurface = Color(0xFF0F172A),
    inverseOnSurface = Color(0xFFF8FAFC),
    inversePrimary = Color(0xFF60A5FA),
    scrim = Color(0xFF020617),
)

val DarkColors = darkColorScheme(
    primary = Color(0xFF60A5FA),
    onPrimary = Color(0xFF0F172A),
    primaryContainer = Color(0xFF1E3A8A),
    onPrimaryContainer = Color(0xFFDBEAFE),
    secondary = Color(0xFF5EEAD4),
    onSecondary = Color(0xFF0F172A),
    secondaryContainer = Color(0xFF1E293B),
    onSecondaryContainer = Color(0xFFF8FAFC),
    tertiary = Color(0xFF2DD4BF),
    onTertiary = Color(0xFF0F172A),
    error = Color(0xFFF87171),
    onError = Color(0xFF0F172A),
    errorContainer = Color(0xFF450A0A),
    onErrorContainer = Color(0xFFFCA5A5),
    background = Color(0xFF020817),
    onBackground = Color(0xFFF8FAFC),
    surface = Color(0xFF020817),
    onSurface = Color(0xFFF8FAFC),
    surfaceVariant = Color(0xFF1E293B),
    onSurfaceVariant = Color(0xFFCBD5E1),
    surfaceContainerLowest = Color(0xFF020617),
    surfaceContainerLow = Color(0xFF0F172A),
    surfaceContainer = Color(0xFF1E293B),
    surfaceContainerHigh = Color(0xFF334155),
    surfaceContainerHighest = Color(0xFF475569),
    outline = Color(0xFF64748B),
    outlineVariant = Color(0xFF1E293B),
    inverseSurface = Color(0xFFF8FAFC),
    inverseOnSurface = Color(0xFF0F172A),
    inversePrimary = Color(0xFF1D4ED8),
    scrim = Color(0xFF020617),
)
```

Every text-on-surface pair above was checked against WCAG 1.4.3: body text pairs are at least 7:1, `onPrimary` on `primary` is 6.7:1 (light) and 7.0:1 (dark), `onError` on `error` is 6.5:1 (light) and 6.45:1 (dark). Keep a unit test in the app that recomputes these ratios from the scheme so a palette edit cannot regress them silently.

## 5. Typography

### 5.1 Typeface

The website uses **Mona Sans**, GitHub's open-source variable sans, served through next/font. Bundle it in the app.

- Source: `https://github.com/github/mona-sans/releases/latest` (variable TTF; licence SIL Open Font License 1.1, which permits bundling in a commercial app; include the licence text in the app's open-source notices).
- Put the variable TTF in `res/font/mona_sans.ttf` and declare a `FontFamily` with `FontVariation.Settings(FontVariation.weight(...))` for weights 400, 500, 600 and 700. Variable fonts work from API 26, which is below the app's minimum SDK.
- Fallback: if the font fails to load, the system default sans is acceptable; never fall back to a serif.
- Monospace for element IDs, resource names and hex values: the system monospace (`FontFamily.Monospace`) is fine. The website uses the platform monospace too.

### 5.2 Scale

Sizes are in sp so they scale with the user's font size setting. Line heights are in sp as well. Letter spacing on large headings is slightly tight, as on the site (`tracking-tight`).

| Material 3 slot | Size / line height | Weight | Use |
|---|---|---|---|
| displaySmall | 36 / 40 sp, letter spacing -0.5 sp | 600 | first-run screen title only |
| headlineLarge | 30 / 36 sp, -0.4 sp | 700 | screen titles on large layouts |
| headlineMedium | 24 / 30 sp, -0.3 sp | 700 | screen titles on phones |
| headlineSmall | 20 / 26 sp | 600 | section headings in reports |
| titleLarge | 18 / 24 sp | 600 | card titles, finding titles |
| titleMedium | 16 / 22 sp | 600 | list item titles |
| titleSmall | 14 / 20 sp | 600 | eyebrow labels (teal), tab labels |
| bodyLarge | 16 / 24 sp | 400 | body copy, explanations |
| bodyMedium | 14 / 20 sp | 400 | secondary text, table cells |
| bodySmall | 12 / 16 sp | 400 | captions, timestamps (never for essential content) |
| labelLarge | 14 / 20 sp | 600 | buttons |
| labelMedium | 12 / 16 sp | 600 | badges, chips |
| labelSmall | 11 / 16 sp | 600 | avoid; only for dense overlays |

Rules:

- Never set `maxLines` with ellipsis on finding titles, criterion names or explanations. Wrap instead. Truncation is itself an accessibility failure the app reports in other apps.
- Test every screen at font scale 2.0 (and Android 14's non-linear scaling). Layouts must reflow vertically; no horizontal scrolling of text.
- Body copy measure: cap text width at about 640 dp on tablets, matching the website's reading column.
- Headings use `Modifier.semantics { heading() }` so TalkBack users can jump by heading.

## 6. Shape, spacing and elevation

- **Radius.** Base radius is 8 dp (the website's `--radius: 0.5rem`). Cards and panels 8 dp, buttons and inputs 6 dp, badges and chips fully rounded, dialogs and bottom sheets 12 dp (top corners for sheets), tiny elements 4 dp. Compose `Shapes(extraSmall = 4.dp, small = 6.dp, medium = 8.dp, large = 12.dp, extraLarge = 16.dp)`.
- **Spacing.** 4 dp grid. Screen gutters 16 dp on phones and 24 dp from 600 dp width. Card padding 16 dp on phones, 24 dp on larger widths (the site's `p-6`). Vertical rhythm between stacked cards 12 dp, between sections 32 dp, between an eyebrow and its heading 8 dp, between a heading and its paragraph 12 dp.
- **Borders over shadows.** Cards are `surface` with a 1 dp `outlineVariant` border and no elevation (the site uses `shadow-sm`, which is almost invisible). Use tonal `surfaceContainer` fills only for panels that must stand apart from a list of bordered cards. No elevation above 1 dp except dialogs, sheets and the floating scan control.
- **Callouts.** Informational and warning asides copy the site's pattern: a 4 dp left border in teal 700 (info), amber 700 (caution) or red 700 (blocking), on a slate 50 (light) or slate 900 (dark) background, 24 dp padding, eyebrow in the border color, then a heading and body.
- **Dividers.** 1 dp `outlineVariant`. Prefer whitespace to dividers in lists.

## 7. Components

Build on Material 3 Compose components and restyle them; do not hand-roll controls that Material already provides accessibly.

| Component | Specification |
|---|---|
| Primary button | Filled `primary`, `onPrimary` label in labelLarge, min height 48 dp (the site uses `min-h-12`), horizontal padding 20 dp, radius 6 dp, optional 16 dp leading icon with 12 dp gap. Pressed: blue 800 (light) or blue 300 (dark). |
| Secondary button | 1 dp `outline` border, `surface` fill, `onSurface` label; pressed fill `surfaceContainer`. |
| Text button | `primary` label, underline on focus/press only. For "learn more" style actions. |
| Destructive button | `error` fill with `onError` label, used only for delete and discard. Always confirm. |
| Link in body text | `primary` color, underlined, 3 dp underline offset. Links are never distinguished by color alone. |
| Eyebrow label | titleSmall, teal 700 / teal 300, sentence case, optionally with a middle dot between two parts. Placed 8 dp above a heading. |
| Card | See section 6. Title in titleLarge, meta line in bodySmall `onSurfaceVariant`. Entire card is one focusable item when it navigates; otherwise only its controls are focusable. |
| Badge | Fully rounded, labelMedium, 10 dp horizontal padding, 2 dp vertical, 1 dp border for outline variant. Status badges use section 4.4 colors plus the icon. |
| Chip (filter) | Material `FilterChip` with the same radius as badges; selected state uses `secondaryContainer` plus a check icon, never color alone. |
| Top app bar | `surface` background, 1 dp bottom border, title in titleLarge, back arrow 48 dp target, actions as icon buttons with `contentDescription`. No large collapsing titles. |
| Bottom navigation | Material `NavigationBar`, labels always visible, icons from Lucide at 24 dp. |
| Tabs | Primary tabs with a 2 dp `primary` indicator; inactive labels in `onSurfaceVariant` (5.2:1 or better). |
| Lists | `ListItem` with leading status icon, titleMedium headline, bodyMedium supporting text, trailing chevron when it navigates. Minimum row height 56 dp. |
| Text fields | Material outlined fields, label always visible above or as a floating label, helper and error text below, error in `error` color with an icon. |
| Switches and checkboxes | Material defaults with a visible text label; the label is part of the toggle's touch target. |
| Dialogs | 12 dp radius, titleLarge heading, body, actions right-aligned; focus moves to the dialog and returns to the trigger. |
| Bottom sheet | For finding details and quick actions; drag handle visible; full-screen alternative when content is long. |
| Snackbar | Short status only; never the sole place an error appears. |
| Progress | Linear indicator in `primary`; always paired with text ("Scanning screen 3 of 8"). Announce milestones through a polite live region. |
| Empty state | Lucide icon at 40 dp in `onSurfaceVariant`, titleMedium heading, one bodyMedium sentence, one primary action. No illustrations in version 1. |

## 8. States, focus and interaction

- **Focus ring.** Every focusable element draws a 2 dp ring in the focus color (`#2563EB` light, `#E4EAFB` dark) with a 2 dp gap (the website uses `outline-2` with `outline-offset-2` or `4`). Apply it to keyboard, d-pad, Switch Access and TalkBack focus through the same focused state. Minimum 3:1 against adjacent colors.
- **Touch targets.** 48 x 48 dp minimum for every interactive element, including icon buttons inside list rows. Spacing between adjacent small targets at least 8 dp.
- **Pressed and selected.** Pressed darkens or lightens by one palette step (see buttons). Selected rows use `secondaryContainer` plus an icon or text change.
- **Disabled.** 38 percent opacity (Material default) is acceptable for disabled controls, but the control's label must still explain why in adjacent text when it matters ("Enable the accessibility service to start scanning").
- **Loading.** Skeletons in `surfaceContainer`; respect reduce motion.

## 9. Iconography

The website uses **Lucide** (ISC licence). Use Lucide on Android as well, either through a Compose Lucide package from Maven Central (verify the current coordinates when the project is set up; `io.github.ardasoyturk.compose.icons:lucide` was published at version 2.0.7 in 2026) or by converting the needed SVGs to vector drawables at build time.

- Default size 24 dp in bars and lists, 20 dp inline with text, 16 dp inside buttons and badges. Stroke width stays at Lucide's default 2.
- Icons next to text are decorative: `contentDescription = null`. Icon-only buttons must have a `contentDescription` that names the action, not the icon ("Share report", not "share icon").
- Suggested mapping: scan `scan-line`, findings `list-checks`, history `history`, settings `settings`, device conditions `sliders-horizontal`, screen reader `audio-lines`, focus order `route`, touch target `pointer`, contrast `contrast`, text scaling `type`, headings `heading`, export `download`, share `share-2`, learn `book-open`, external link `external-link`.

## 10. Motion

- Durations 150 to 300 ms with ease-out curves, matching the site's `fade-in` and `fade-up` (10 dp rise). No bounce, no parallax, no auto-playing animation.
- Honor the system "Remove animations" setting (`Settings.Global.ANIMATOR_DURATION_SCALE` equal to 0) and `Settings.Global.TRANSITION_ANIMATION_SCALE`: when animations are off, state changes are instant.
- Progress indicators are the only continuous motion, and they stop when the work stops.

## 11. Voice and microcopy

- Sentence case everywhere, including buttons and tab labels. No title case, no all caps (TalkBack may spell capitals).
- Verbs first on buttons: "Start scan", "Export report", "Open in Settings".
- Say what the app did, not how it feels: "Scanned 6 screens, 23 findings" rather than "Great job!".
- Explain every permission before the system dialog, in two sentences: what it enables and what the app never does with it. Example: "The accessibility service lets this app read the screen layout of the app you are auditing. It never sends screen content anywhere; everything stays on this device."
- Every finding has: a plain title ("Button has no accessible name"), what a user experiences ("TalkBack reads this as 'button' with no purpose"), where it is (screen, element id or path), the WCAG 2.2 criterion with level, and a fix for Views and for Compose.
- Hedge where the check is a heuristic: "Possibly decorative image. Confirm it conveys no information before marking it decorative."
- Never label a result "accessible", "compliant" or "WCAG certified". Use "No issues found by automated checks" and always pair it with the number of manual checks still open.
- Dates in the format "30 Oct 2026", times in the device's 12 or 24 hour setting.

## 12. Dark mode

Follows the system setting by default, with an in-app override (System, Light, Dark). Use the dark scheme in section 4.6. Status tints in dark mode use the 950 step backgrounds with 300 step text (section 4.4). Screenshots of the audited app are shown as captured, never tinted. The logo flips to a light disc with a dark glyph.

## 13. Accessibility bar for the app itself

The app is judged by the same rules it applies to others. Acceptance criteria for every screen:

- Passes the app's own rule set with zero findings, and passes Google's Accessibility Scanner with zero suggestions.
- TalkBack: every control has a name, role and state; headings are marked; lists announce position; custom actions are exposed for swipe-able items; live regions announce scan progress politely; dialogs and sheets move focus in and restore it.
- Switch Access and keyboard: full operation, logical focus order, visible focus ring, no traps.
- Text scaling: usable at 200 percent with non-linear scaling; nothing truncated or clipped; no fixed heights around text.
- Color: never the only carrier of meaning; all text at least 4.5:1; non-text indicators and focus rings at least 3:1.
- Motion: respects Remove animations; no flashing.
- Orientation: portrait and landscape both supported; no locked orientation.
- Targets: at least 48 x 48 dp with 8 dp spacing.
- Timeouts: none, except user-initiated scan timers that are adjustable.
- RTL: layouts mirror correctly (test with "Force RTL layout direction" in developer options).

## 14. Screen anatomy (consistency rules)

1. Top app bar: back or menu, title, at most two actions.
2. Optional eyebrow and heading block with 16 dp gutters.
3. Content area: cards or a list, 12 dp between cards.
4. Primary action: a full-width primary button pinned above the navigation bar on phones when the screen has one main action (for example "Start scan"); otherwise actions live in cards.
5. Bottom navigation: Scan, Findings, Checklist, Sessions, Settings (the product plan, section 6, defines each tab). Learning content lives inside finding details and under Settings, not in its own tab.

Tablets and foldables (600 dp and wider) use a two-pane layout with the list on the left and detail on the right, following Material's canonical list-detail pattern.
