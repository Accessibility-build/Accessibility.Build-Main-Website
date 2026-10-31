# Build with Accessibility for Android: product and implementation plan

Status: written 30 October 2026 from the research in `01-market-research.md`, `02-android-platform-capabilities.md` and `06-standards-and-audit-workflow.md`. The visual and verbal identity is in `04-design-language.md`. This document is the specification the coding agent builds from; where it says "must", that is an acceptance criterion.

## 1. The product in one paragraph

Build with Accessibility is a free Android app from Accessibility.build that helps accessibility auditors audit other Android apps on the same device. It runs an accessibility service that reads the screen structure of the app being audited, captures the pixels, runs automated checks that map every finding to WCAG 2.2 and EN 301 549, predicts what TalkBack will read and in what order, records what TalkBack actually said during a session, switches the device into the test conditions an audit needs (font scale, animations, dark theme, bold text and more), guides the auditor through the manual checks that automation cannot make, keeps a history per app so retests show what changed, and exports reports in the formats auditors deliver. Nothing leaves the device unless the auditor exports it.

## 2. Why this product, in three sentences

The only free on-device auditor with reach is Google's Accessibility Scanner, which checks four categories, maps nothing to WCAG, exports screenshots and text, keeps no comparable history, and was measured at 31 percent recall against expert-found screen reader errors. Every tool with real WCAG coverage, headings, orientation, keyboard and resize checks, or structured export runs in the cloud or on a desktop and sells to enterprises. Auditors' most repeated requests, in reviews and in regulator reports, are exactly the things an on-device app can do and no one has done: show what the screen reader says, check what regulators actually fail apps for, and produce a report a client can read.

## 3. Who it is for

| Persona | Situation | What they need from the app |
|---|---|---|
| **Independent or agency auditor** (primary) | Audits client apps, often production builds with no source access, against WCAG 2.2 AA or EN 301 549, per screen and per flow, and writes a report with evidence | Findings mapped to criteria with severity and confidence, screenshots with highlights, a predicted and recorded screen reader transcript, a manual checklist with the Android procedure for each criterion, device-condition control, and HTML, CSV, JSON and Markdown export; a session per app version so the retest shows what changed |
| **In-house developer or QA** | Checks their own app before release; today runs Accessibility Scanner | Fast single-screen scans, fix guidance for Views and Compose, re-scan diffs, fewer false positives than Scanner, the same categories the Play pre-launch report uses |
| **Blind or low-vision tester** | Audits apps with TalkBack as a daily user | An app that is itself fully usable with TalkBack, triggers that do not depend on finding a floating button, results readable as text, and a recorder that captures what TalkBack said without a sighted colleague |
| **Compliance or procurement reviewer** (secondary) | Needs a readable summary for a decision | The HTML report's summary page and the ACR skeleton; no need to operate the scanner |

## 4. Principles

1. **Say what you know, and how sure you are.** Every finding carries a confidence: Definite (programmatically certain), Likely (a heuristic with high precision) or Needs review (a human must judge). Only Definite and Likely count in totals. Scanner's false-positive complaints came from presenting heuristics as failures.
2. **Map, do not invent.** Every rule cites the WCAG 2.2 criterion and level and the EN 301 549 clause it supports. Platform guidance that is stricter than WCAG (48 dp targets, for example) is labelled as platform guidance, not as a WCAG failure.
3. **Automation is a third of the audit.** The manual checklist is a first-class feature, not an afterthought, and the report always shows how many manual checks are still open next to the automated results.
4. **On-device, offline, private.** No account, no network calls in version 1, no analytics. Screenshots may contain personal data and are stored only in app-private storage, deleted with the session.
5. **The app passes its own rules.** Zero findings from the app's own engine and from Accessibility Scanner on every screen, full TalkBack and Switch Access operability, usable at 200 percent font scale. A defect here costs more trust than a missing feature.
6. **Follow Play policy to the letter.** Non-tool accessibility service declaration, prominent disclosure with consent, user-initiated actions only, no FLAG_SECURE workarounds, deep links before privileged settings writes.

## 5. Scope by release

### 5.1 Version 1.0: Scan

- Onboarding with the prominent disclosure, consent and the Settings hand-off; restricted-settings guidance for APK installs.
- Triggers: floating bubble, system accessibility button or shortcut, Quick Settings tile, notification action.
- Single-screen scan of the foreground app: node tree plus screenshot plus OCR, Accessibility Test Framework checks plus the custom rule set in section 7, findings with severity, confidence, WCAG and EN mapping, highlight overlay on the screenshot, fix guidance for Views and Compose.
- Reading preview: predicted TalkBack order and utterances for the captured screen, numbered on the screenshot.
- Device conditions panel: read every relevant setting, switch font scale and animations directly, deep links for the rest, a test-condition matrix per session.
- Sessions per app and app version with screen history; a retest diff (new, still present, resolved) against a chosen baseline session.
- Exports: HTML (self-contained), CSV, JSON (documented schema), Markdown; share a single finding as image plus text.
- Standard profiles: WCAG 2.2 AA (default), WCAG 2.1 AA, EN 301 549 V3.2.1 clause 11, Section 508 (WCAG 2.0 AA), Android platform guidance. Profiles change thresholds, which criteria are listed as not applicable, and report headings.
- Manual checklist: the criterion table from `06-standards-and-audit-workflow.md` with the Android procedure per criterion, and status, notes and evidence per session. (The ACR export built from it arrives in 1.2.)
- Light and dark themes, tablet two-pane layout, full accessibility of the app itself.

### 5.2 Version 1.1: Record

- TalkBack session recorder: a timestamped transcript of accessibility focus moves, announcements, window and pane changes and speech state, with the predicted utterance beside each actual focus event.
- Dynamic checks that need a session: focus not moved after a screen change, live regions that never fire, auto-advancing content, suspected flashing.
- Flow recording: capture several screens in sequence and treat them as one flow in the report.
- Full-page capture: scroll-and-rescan with dispatched gestures, merged into one screen record.
- Colour tools: eyedropper on the captured screenshot with WCAG and APCA ratios; colour-vision simulation of the captured screen (protanopia, deuteranopia, tritanopia, achromatopsia); auto-fix suggestions for failing text colours.

### 5.3 Version 1.2: Audit

- ACR skeleton export in the VPAT 2.5 WCAG edition structure, pre-filled from automated results and manual check statuses, with the auditor's conformance-level choice per criterion.
- GOV.UK-style accessibility statement draft for apps (version and publication date fields included).
- Keyboard testing helper on API 33 and later: d-pad traversal through global actions with a focus trace, plus the manual Bluetooth keyboard procedure.
- Advanced test-condition switcher through Shizuku or an adb-granted WRITE_SECURE_SETTINGS (bold text, high contrast or outline text, colour correction, inversion, display size, dark theme, enable TalkBack), strictly opt-in.
- Issue export templates for GitHub and Jira (Markdown and CSV import formats).

### 5.4 Later, not planned in detail

- Optional sync to an Accessibility.build account for team sharing and the website's tracker.
- A website page at `accessibility.build/android` with the release feed.
- Localised UI (the engine's English-only heuristics are gated on the audited app's locale from the start).

### 5.5 Not in scope

iOS; auditing websites (the website's tools do that); auditing without the accessibility service; a CI SDK compiled into the audited app; Appium drivers; a cloud dashboard; any claim of "compliance" or "certification"; overlays that remediate the audited app.

## 6. Information architecture and screens

Bottom navigation (phones) or navigation rail (600 dp and wider): **Scan, Findings, Checklist, Sessions, Settings**. The design language document fixes the visual rules; this section fixes the content of each screen.

### 6.1 Scan

- Service status card: enabled or not, with the one-tap path to Settings; on APK installs, the restricted-settings explanation.
- Target card: the app in the foreground at last check (icon, name, version), or "Open the app you want to audit, then use a trigger".
- Session card: current session name (app plus version plus profile), screens captured, findings by severity, manual checks open; "Start new session" and "Switch session".
- Conditions summary: font scale, theme, animations, TalkBack state, with a link to the full panel.
- Trigger settings: bubble on or off, accessibility button, tile, notification; the bubble's position and size.
- Primary action: "Capture this screen" is only meaningful from the trigger, so the screen's pinned button is "Open device conditions" or "Resume auditing" (which minimises the app and shows the bubble).

### 6.2 Findings

- Header: session name, profile, screen count, totals by severity and the Needs review count shown separately.
- Group by: screen (default), rule, criterion. Filters: severity, confidence, status (open, fixed, false positive, ignored), text search.
- Finding row: status icon with severity colour, title, screen name, criterion chip, confidence chip.
- Finding detail (bottom sheet on phones, right pane on tablets): screenshot crop with the element outlined; "What a user experiences"; "Where" (view id, class, bounds in dp, text or label, path in the tree); "Why" (criterion with level and link, EN clause, platform guidance note); "How to fix" with tabs Views and Compose, plus a note for Flutter and React Native where the fix differs; actions: mark fixed, mark false positive (with reason), add note, share.
- Reading preview tab for the selected screen: numbered list in predicted traversal order with the utterance text, role and state; tap a row to outline it on the screenshot; a banner that says "Predicted from TalkBack 16.2 rules; record a session to see actual output".

### 6.3 Checklist

- The criterion list for the active profile, grouped by WCAG principle, with Void or not-applicable criteria shown greyed with the reason (for example "EN 301 549 11.2.4.1: void for single programs").
- Each row: status (Not tested, Pass, Fail, Not applicable, Blocked), the Android test procedure, assistive technology used, notes, linked screens as evidence, and automated findings already mapped to that criterion.
- A progress line: "22 of 50 criteria tested".
- Quick procedures: "TalkBack full traversal", "Switch Access run", "Font size 200 percent", "Both orientations", "External keyboard", each a saved set of criteria that it tests, so the auditor can tick a whole procedure for a screen.

### 6.4 Sessions

- List by app, then by session (date, version, profile, counts). Actions: open, rename, set as baseline, compare, export, delete (with confirmation and a reminder that screenshots are deleted too).
- Compare view: baseline against current; findings grouped as New, Still present, Resolved, Not comparable (screen not recaptured). Matching rules are in section 10.3.
- Export sheet: format, what to include (screenshots, reading previews, transcripts, manual checks, device conditions), anonymise option (blur screenshots to 8 px blocks except highlighted regions), destination (save as file, share).

### 6.5 Settings

- Profile and thresholds: active standard profile; large-text thresholds; target size regime (platform 48 dp, WCAG 24 dp floor with spacing); contrast strictness (AA, AAA).
- Triggers and overlay: as in Scan.
- Engine: OCR on or off, enhanced contrast evaluation, include not-important views, screenshot retention (full resolution or half), English-only heuristics gate.
- Privacy: everything stored on device; delete all data; export of the privacy notice; the disclosure text again.
- About: version, open-source notices (Apache 2.0 for ATF and the TalkBack port, OFL for Mona Sans, ISC for Lucide, ML Kit terms), links to accessibility.build, contact.
- Learn: short explanations of each check and criterion with links to `https://accessibility.build/wcag/{x-y-z}` (for example `/wcag/1-4-3`), `/guides/mobile-accessibility` and `/guides/talkback-screen-reader-testing`.

### 6.6 The overlay

- Bubble: 48 dp, the brand mark on a `surface` disc with a 1 dp border, draggable, snaps to an edge, hidden automatically during capture. Tap captures; long press opens a small menu (capture, start or stop recording, open the app, hide). Named for TalkBack ("Build with Accessibility: capture this screen").
- After capture: a compact result chip near the bubble ("23 findings, 4 critical") that opens Findings; optional live highlight layer that outlines findings over the audited app with a non-touchable window, toggled from the chip, never shown during capture.
- Everything the bubble does is also reachable from the accessibility button or shortcut, the tile and the notification, because some apps hide overlays and some users cannot see the bubble.

### 6.7 Onboarding and disclosure

1. Welcome: what the app does, what it does not do ("It does not make your app compliant and it cannot find every issue"), and that nothing leaves the device.
2. Prominent disclosure (its own screen, required by Play): "Build with Accessibility reads the on-screen content and layout of the app you choose to audit through the Android accessibility service, and captures screenshots of that app, to run accessibility checks. This data is stored only on this device and is never transmitted. It is used for nothing else." A checkbox and a "Continue" button; the service cannot be enabled before consent.
3. Enable the service: deep link to Accessibility settings; on APK installs an extra card about "Allow restricted settings".
4. Optional permissions, each explained: display over other apps (bubble), notifications (notification trigger), modify system settings (font scale switch).
5. Pick a trigger and try the built-in demo screen (section 12.4).

## 7. Rule catalog

Conventions: **Source** is ATF (vendored Accessibility Test Framework check), Custom (our rule on our node model), Manifest (package info), Session (needs the recorder, 1.1) or Pixels (needs the screenshot). **Confidence** is the default; a rule may downgrade a specific result (for example to Needs review when the node is a WebView child). **Severity** uses axe-core's scale (Critical, Serious, Moderate, Minor); Advisory marks platform guidance that is not a WCAG failure. EN clauses are EN 301 549 V3.2.1 numbering, which V4.1.1 keeps for clause 11.

### 7.1 Names and labels

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-N01 | Missing accessible name | Focusable or clickable element with no text, content description, label-for, labelled-by or merged child text | ATF SpeakableTextPresentCheck + Custom (Compose merged nodes) | 1.1.1 (images), 4.1.2 (controls), level A | 11.1.1.1, 11.4.1.2 | Critical for controls, Serious for images | Definite |
| BWA-N02 | Editable field labelled by content description | EditText or Compose text field with a contentDescription instead of a label or hint | ATF EditableContentDescCheck | 3.3.2, 4.1.2 | 11.3.3.2 | Serious | Definite |
| BWA-N03 | Hint used as the only label | Editable field whose only name is a hint that disappears on input (isShowingHintText and no labelled-by) | Custom | 3.3.2 | 11.3.3.2 | Moderate | Likely |
| BWA-N04 | Visible label not in accessible name | Clickable element with visible text whose accessible name does not contain that text | Custom (text vs contentDescription; OCR for image buttons with painted text in 1.1) | 2.5.3 | 11.2.5.3 | Serious | Likely |
| BWA-N05 | Duplicate names on interactive elements | Two or more clickable elements on the screen with identical speakable text and different targets | ATF DuplicateSpeakableTextCheck (clickable case) | 2.4.6, 2.5.3 | 11.2.4.6 | Moderate | Needs review (list items with the same label are often legitimate when the container differs) |
| BWA-N06 | Role or state words inside the name | Content description containing "button", "checked", "double tap" and similar | ATF RedundantDescriptionCheck (English only, gated on locale) | 2.4.6 (best practice) | 11.2.4.6 | Minor | Likely |
| BWA-N07 | Unlabelled custom action | Custom accessibility action with an empty or generic label | Custom | 4.1.2 | 11.4.1.2 | Serious | Definite |
| BWA-N08 | Decorative image reachable | Non-clickable image with an empty name that is focusable or screen-reader focusable | Custom | 1.1.1 | 11.1.1.1 | Minor | Likely |
| BWA-N09 | Filename or placeholder as name | Name matching `IMG_`, `.png`, `.jpg`, "image", "icon", "unlabelled" patterns | Custom | 1.1.1 | 11.1.1.1 | Serious | Likely |
| BWA-N10 | Text in image not exposed | OCR finds text inside an image region with no matching exposed text | ATF UnexposedTextCheck + Pixels | 1.1.1, 1.4.5 | 11.1.1.1, 11.1.4.5 | Serious | Needs review |

### 7.2 Roles, states and values

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-R01 | Unsupported or missing class name | Class name empty, unknown or not a type services understand | ATF ClassNameCheck | 4.1.2 | 11.4.1.2 | Moderate | Likely |
| BWA-R02 | Clickable but not reachable | Clickable element that is not focusable, not important for accessibility, or inside a hidden-descendants subtree | Custom | 2.1.1, 4.1.2 | 11.2.1.1, 11.4.1.2 | Critical | Definite |
| BWA-R03 | Checkable without state exposure | Checkable element with a generic class and no state description or checked type | Custom (uses tri-state `getChecked` on API 36) | 4.1.2 | 11.4.1.2 | Serious | Likely |
| BWA-R04 | Expandable without expanded state | Element with expand or collapse actions and undefined expanded state (API 36) or no state description | Custom | 4.1.2 | 11.4.1.2 | Moderate | Needs review |
| BWA-R05 | Slider or progress without range info | SeekBar-like or progress role without RangeInfo | Custom | 4.1.2 | 11.4.1.2 | Serious | Likely |
| BWA-R06 | Selected tab or item not exposed | Visual selection cue (tab indicator region detected by class or role) with no selected state | Custom | 4.1.2 | 11.4.1.2 | Moderate | Needs review |
| BWA-R07 | Nested or duplicate clickable bounds | Clickable container sharing bounds with a clickable child | ATF DuplicateClickableBoundsCheck | 2.4.3, 4.1.2 | 11.2.4.3 | Moderate | Definite |
| BWA-R08 | Clickable span in text | ClickableSpan that is not a URLSpan, unreachable for services | ATF ClickableSpanCheck | 2.1.1, 4.1.2 | 11.2.1.1 | Serious | Definite |
| BWA-R09 | Disabled state not exposed | Element visually inert (alpha from `ExtraRenderingInfo` on API 37, or class heuristics) but enabled in the tree | Custom | 4.1.2 | 11.4.1.2 | Minor | Needs review |

### 7.3 Structure and order

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-S01 | No headings on a long screen | Scrollable screen with more than N text nodes and no node marked as heading | Custom | 1.3.1, 2.4.6 | 11.1.3.1 | Moderate | Needs review |
| BWA-S02 | Screen or pane without a title | Window state change without a window title or pane title, or a screen whose top text is not exposed as a heading or title | Custom + Session | 2.4.2 | 11.2.4.2 | Serious | Likely |
| BWA-S03 | List without collection semantics | Repeated sibling structure (3 or more similar subtrees) with no CollectionInfo on the container | Custom | 1.3.1 | 11.1.3.1 | Moderate | Needs review |
| BWA-S04 | Field label not associated | Static text immediately above or beside an editable field with no labelled-by relationship | Custom | 1.3.1, 3.3.2 | 11.1.3.1, 11.3.3.2 | Moderate | Needs review |
| BWA-S05 | Traversal order cycle or over-constraint | traversalBefore and traversalAfter loops | ATF TraversalOrderCheck | 1.3.2, 2.4.3 | 11.1.3.2 | Serious | Definite |
| BWA-S06 | Reading order deviates from visual order | Predicted traversal order differs from top-to-bottom, start-to-end geometric order beyond a tolerance | Custom (reading preview) | 1.3.2 | 11.1.3.2 | Moderate | Needs review |
| BWA-S07 | Content hidden behind a modal still exposed | A dialog or sheet window present while background window nodes remain focusable and visible | Custom | 1.3.2, 2.4.3 | 11.2.4.3 | Serious | Likely |
| BWA-S08 | Required field not marked | Editable field with a visible asterisk or "required" text and `isFieldRequired` false (API 36) | Custom | 3.3.2 | 11.3.3.2 | Minor | Needs review |

### 7.4 Contrast and colour

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-C01 | Text contrast below minimum | Text against its background below 4.5:1 (3:1 for large text: at least 18 sp, or 14 sp bold, computed from `ExtraRenderingInfo`) | ATF TextContrastCheck + Pixels; exact colours on API 37 | 1.4.3 | 11.1.4.3 | Serious | Likely (Definite with exact colours) |
| BWA-C02 | Non-text contrast below 3:1 | Icons, input borders and state indicators against adjacent colours | ATF ImageContrastCheck + Pixels | 1.4.11 | 11.1.4.11 | Serious | Needs review |
| BWA-C03 | Placeholder or hint contrast | Hint text shown below 4.5:1 | Pixels (hint colour on API 37) | 1.4.3 | 11.1.4.3 | Moderate | Likely |
| BWA-C04 | Contrast under secure window not evaluated | FLAG_SECURE window: report as not evaluated, never as pass | Pixels | 1.4.3, 1.4.11 | | Informational | n/a |
| BWA-C05 | Colour-only distinction (assist) | CVD simulation and grey-scale view of the capture for the manual check of 1.4.1 | Pixels (1.1) | 1.4.1 | 11.1.4.1 | Manual | n/a |

Disabled elements are exempt from BWA-C01 and BWA-C02. Dark theme captures are checked with the same thresholds; the report groups results by theme.

### 7.5 Touch targets

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-T01 | Target below the WCAG floor | Clickable element smaller than 24 by 24 dp in either dimension with no 24 dp spacing circle free of other targets, and not an inline link in text (the user-agent and essential exceptions are left to the auditor) | Custom (honours TouchDelegate) | 2.5.8 (AA) | 11.2.5.8 | Serious | Likely |
| BWA-T02 | Target below platform guidance | Clickable element smaller than 48 by 48 dp (32 dp at a screen edge or in an IME window) | ATF TouchTargetSizeCheck | Platform guidance; 2.5.5 (AAA) reference | | Advisory | Definite |
| BWA-T03 | Overlapping targets | Two clickable elements whose bounds intersect | Custom | 2.5.8, 1.3.1 | 11.2.5.8 | Moderate | Likely |
| BWA-T04 | Tiny spacing between small targets | Targets under 48 dp closer than 8 dp to each other | Custom | Platform guidance | | Advisory | Likely |

The profile decides which of T01 and T02 appears in totals: WCAG profiles count T01 and show T02 as advisory; the Android platform profile counts T02.

### 7.6 Text scaling and reflow

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-Z01 | Text size in dp or px | Text whose size unit is not sp | ATF TextSizeCheck via `ExtraRenderingInfo` | 1.4.4 | 11.1.4.4 | Serious | Definite |
| BWA-Z02 | Fixed-size container with scalable text | Scalable text inside a fixed width or height container | ATF TextSizeCheck | 1.4.4 | 11.1.4.4 | Moderate | Needs review |
| BWA-Z03 | Text truncated at the current scale | Exposed text longer than the OCR-visible text, or visible ellipsis with a multi-word source string | Custom + Pixels | 1.4.4 | 11.1.4.4 | Serious | Likely |
| BWA-Z04 | Text overlap | Bounds of two text nodes intersect | Custom | 1.4.4, 1.4.10 | 11.1.4.4 | Serious | Likely |
| BWA-Z05 | Horizontal scrolling required for text | Horizontally scrollable container holding body text at the current width | Custom | 1.4.10 | 11.1.4.10 | Moderate | Needs review |
| BWA-Z06 | App ignores font scale | Same screen captured at two font scales shows identical text sizes | Custom (compares two captures in a session) | 1.4.4 | 11.1.4.4 | Critical | Likely |

The conditions panel drives Z03 to Z06: the matrix asks for the same screen at 100 and 200 percent.

### 7.7 Orientation and layout

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-O01 | Orientation locked | Foreground activity declares a fixed `screenOrientation` | Manifest | 1.3.4 | 11.1.3.4 | Serious | Definite (Needs review if the package is not visible) |
| BWA-O02 | Not resizable | `resizeableActivity` false or `configChanges` without orientation and screen size handling, where readable | Manifest | 1.4.10 (advisory) | | Advisory | Needs review |
| BWA-O03 | Old target SDK | Audited app targets below API 33 (affects font scaling behaviour and large screen rules) | Manifest | Informational | | Informational | Definite |

### 7.8 Dynamic behaviour (recorder, 1.1)

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-D01 | Focus not moved after screen change | Window state change with TalkBack on and no accessibility focus event in the new window within 1.5 s | Session | 2.4.3 | 11.2.4.3 | Serious | Likely |
| BWA-D02 | Status message not announced | Snackbar, toast-like or validation text appears (content change) with no live region and no announcement | Session | 4.1.3 | 11.4.1.3 | Serious | Needs review |
| BWA-D03 | Assertive live region or rapid updates | Assertive live region, or content changes more often than `minDurationBetweenContentChanges` allows | Custom + Session | 4.1.3, 2.2.2 | 11.4.1.3 | Minor | Likely |
| BWA-D04 | Deprecated announcement API in use | TYPE_ANNOUNCEMENT events received from the audited app | Session | 4.1.3 (advisory) | | Advisory | Definite |
| BWA-D05 | Auto-advancing content | Region changes at a regular interval across repeated captures with no user input | Pixels + Session | 2.2.2 | 11.2.2.2 | Serious | Needs review |
| BWA-D06 | Suspected flashing | Luminance of a region alternates more than three times per second across captures (sampling is about 3 frames a second, so this is a hint only) | Pixels | 2.3.1 | 11.2.3.1 | Critical | Needs review |
| BWA-D07 | Animations ignore Remove animations | Captures with animation scale 0 still show motion in a region | Pixels + Conditions | 2.3.3 (AAA) advisory, 2.2.2 | | Advisory | Needs review |

### 7.9 Links, language and text

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-L01 | Link purpose unclear | "Click here", "read more", "learn more" style link text | ATF LinkPurposeUnclearCheck (English only, gated) | 2.4.4 | 11.2.4.4 | Moderate | Likely |
| BWA-L02 | Content language differs from app locale | Script or language detection on exposed text disagrees with the app's locale | Custom (1.1, on-device language identification) | 3.1.1 | 11.3.1.1 | Minor | Needs review |

### 7.10 Keyboard and input (1.2 helper, manual otherwise)

| ID | Rule | Detects | Source | WCAG | EN | Severity | Confidence |
|---|---|---|---|---|---|---|---|
| BWA-K01 | Interactive element not keyboard focusable | Clickable element with `isFocusable` false | Custom | 2.1.1 | 11.2.1.1 | Serious | Likely |
| BWA-K02 | Keyboard focus not visible | During a d-pad trace, focused element shows no pixel change against the unfocused capture | Session + Pixels (1.2) | 2.4.7 | 11.2.4.7 | Serious | Needs review |
| BWA-K03 | Error state without error text | `isContentInvalid` true with empty `getError` | Custom | 3.3.1 | 11.3.3.1 | Serious | Definite |

### 7.11 What the engine must never report

Automated failures for: meaningfulness of a label (only presence and patterns), correctness of a role on a custom control (only absence), reflow judgement, media alternatives, timeouts, consistency across screens, gesture alternatives, error suggestion quality, authentication flows. These are checklist items with the Android procedure attached.

## 8. The reading preview (predicted screen reader output)

- Port the traversal package from the TalkBack repository (`utils/.../traversal`, Apache 2.0, about 2,900 lines) into `:core:talkback-predict`, depending only on `AccessibilityNodeInfoCompat`. Keep a `NOTICE` file and the upstream commit hash; re-sync on each TalkBack source drop.
- Port the node text and role description utilities (`AccessibilityNodeFeedbackUtils`, the `roledescription` classes and their English strings) to compose, per focusable node: name (content description over text, merged child text for screen-reader-focusable containers), role word, state (checked, selected, expanded or collapsed, disabled), value (range info, percentage), position in collection ("2 of 5"), and the usage hint ("double tap to activate", "actions available" when custom actions exist).
- Output: an ordered list for the captured screen, numbered on the screenshot, each row with the utterance text and the node reference. Label it "Predicted (TalkBack 16.2 rules)". When a recorded session exists for the same screen, show the actual utterance order beside it and highlight disagreements.
- Rules BWA-S06 and the Needs review hints for N05 use this order.

## 9. Device conditions

### 9.1 Read on every capture and stored with the screen

Font scale, font weight adjustment (bold text), high contrast or outline text, colour correction mode, colour inversion, dark theme, animation scales, enabled accessibility services (TalkBack, Switch Access, Voice Access, ours), caption state and style, time to take action (interactive UI timeout), magnification shortcut state, orientation, display size (density), locale, OS version and API level, device model, the audited app's version name and code and target SDK.

### 9.2 Switches

| Condition | Direct control | Permission and API | Fallback |
|---|---|---|---|
| Font scale 100, 130, 150, 180, 200 percent | Yes | `WRITE_SETTINGS` (user-granted) | Deep link to Display size and text |
| Animations on or off | Yes | None extra, API 33 (`setAnimationScale`) | Deep link to Developer options or Accessibility > Remove animations |
| Magnification demo | Yes | `canControlMagnification` | n/a |
| Dark theme, bold text, high contrast or outline text, colour correction, inversion, display size, TalkBack on or off, captions | 1.2 advanced switcher only (Shizuku or adb-granted `WRITE_SECURE_SETTINGS`), on explicit tap | `WRITE_SECURE_SETTINGS` | Deep links (default in 1.0), each wrapped in `resolveActivity` with Accessibility settings as the final fallback |

### 9.3 Test-condition matrix

Per session, a grid of conditions against screens: which screens were captured at 100 and 200 percent, in light and dark theme, in portrait and landscape, with TalkBack on. The report lists the untested cells. The checklist's quick procedures tick cells automatically when a capture matches.

## 10. Architecture

### 10.1 Stack

Kotlin 2.4, Jetpack Compose with Material 3 1.4 (stable; no Expressive beta in 1.0), Android Gradle Plugin 9.5, JDK 17, `minSdk 30`, `targetSdk 36`, `compileSdk 36` (37 behind a version check if the API 37 colour fields are used). Coroutines and Flow; Hilt for dependency injection; Room for storage; Kotlin Serialization for JSON; Navigation Compose with type-safe routes; Coil for images; ML Kit text recognition (bundled Latin model, offline); the vendored Accessibility Test Framework; the ported TalkBack traversal code. No analytics, crash reporting or network libraries in 1.0.

### 10.2 Modules

```
app/                      single Activity, navigation, DI wiring, onboarding, settings
core/design/              theme, tokens, components from 04-design-language.md, previews
core/model/               Session, Screen, Node, Finding, Rule, ManualCheck, Conditions (pure Kotlin)
core/capture/             AuditAccessibilityService, triggers (bubble, tile, notification, accessibility button),
                          screenshot pipeline, node snapshotting, OCR adapter, secure-window handling
core/rules/               rule engine: ATF adapter, custom rules, profiles, severity and confidence, fix guidance
core/talkback-predict/    ported traversal and utterance composition (Apache 2.0 NOTICE)
core/conditions/          settings readers, switches, deep links, matrix
core/db/                  Room database, DAOs, file store for screenshots and hierarchy snapshots
core/export/              HTML, CSV, JSON, Markdown renderers; ACR skeleton (1.2)
third_party/atf/          Accessibility Test Framework 4.1.1 source with local patches (Apache 2.0)
fixtures/badapp/          a deliberately inaccessible sample app, one screen per rule family (section 12.2)
docs/                     this pack
```

`core/rules` and `core/talkback-predict` must be pure JVM modules testable without a device: they operate on the app's own immutable `Node` model, not on `AccessibilityNodeInfo`. `core/capture` converts the live tree into that model once per capture.

### 10.3 Capture pipeline

1. Trigger fires. Record the foreground package from the active window; refuse to scan our own package except the demo screen.
2. Hide the bubble and any highlight layer; wait one frame.
3. Take the screenshot: `takeScreenshotOfWindow` for the target application window on API 34 and later, else `takeScreenshot` of the default display. On a secure-window error or a uniform black image, mark pixels unavailable.
4. Collect windows with `getWindows()`; keep application windows of the target package, dialogs and sheets of that package, and note IME and system windows separately. Call `refresh()` on roots.
5. Snapshot the tree into `Node` objects on a background dispatcher: bounds in screen and window, all text fields, states, actions with labels, collection and range info, labelled-by, live region, heading, pane title, tooltip, error, `isAccessibilityDataSensitive` count (never content), `ExtraRenderingInfo` for text nodes only (capped at 400 nodes per capture, then sampled). Recycle live nodes immediately.
6. Build the ATF hierarchy from the same windows with `setObtainRenderingInfo(true)` and run the ATF checks with `Parameters` (screenshot, thresholds from the profile, enhanced contrast evaluation, the ML Kit `OcrEngine`). Map results to `Node` references through the origin map.
7. Run custom rules over the `Node` model and the ATF results. Compute the reading preview. Deduplicate (one finding per node per rule).
8. Persist Screen, snapshot (JSON, compressed), screenshot (WebP, full and half resolution), findings, conditions. Show the result chip. Restore the overlay.
9. Budget: under 3 seconds on a 2023 mid-range phone for a 300-node screen. Everything off the service's main thread; a 10 second watchdog cancels the capture and reports a partial result rather than hanging (phone soft-locks are a recurring Scanner complaint).

### 10.4 Service manifest

Declare `canRetrieveWindowContent`, `canTakeScreenshot`, `flagRetrieveInteractiveWindows`, `flagReportViewIds`, `flagIncludeNotImportantViews`, `flagRequestAccessibilityButton`, `canPerformGestures` (used only for the 1.1 scroll-and-rescan), `canControlMagnification`. Do not declare touch exploration, key event filtering or `isAccessibilityTool`. Event types: window state and content changes, accessibility focus, announcements, speech state (API 33), windows changed; `notificationTimeout` 100 ms. Provide `settingsActivity`, `description` and `intro` strings that match the disclosure.

### 10.5 Data model (Room)

- `apps`: package, label, icon cache path.
- `sessions`: id, app package, version name and code, target SDK, profile, started at, name, notes, baseline session id (nullable), device summary.
- `screens`: id, session id, captured at, window title or pane title, activity (when visible), orientation, theme, font scale, conditions JSON, screenshot paths, snapshot path, pixels available, node count, hidden sensitive count.
- `findings`: id, screen id, rule id, node key (view id resource name, else stable path hash), bounds, severity, confidence, status, message, details JSON, criterion list, EN clause list.
- `manual_checks`: id, session id, criterion id, status, assistive technology, notes, evidence screen ids.
- `transcripts` (1.1): id, session id, started at, events (JSON lines file path).
- `baselines` are a pointer on `sessions`.

Diff matching (section 6.4): a finding in the current session matches a baseline finding when rule id and node key match; if node keys differ, fall back to rule id plus normalised name plus bounds within 8 dp on a screen with the same title. Everything else is New or Resolved; screens without a counterpart are Not comparable.

### 10.6 Export formats

- **HTML**: one self-contained file, accessible (headings, landmarks, tables with headers, alt text on every screenshot describing the screen and the outlined element, 4.5:1 colours from the design language, dark mode via `prefers-color-scheme`), with a summary page (app, version, device, profile, totals by severity, manual checks by status, untested matrix cells, methodology and the "automated checks are not a conformance claim" statement), then per-screen sections with the screenshot, findings and reading preview, then the checklist. Images inline as base64 WebP; optional half-resolution.
- **CSV**: one row per finding: session, app, version, screen, rule id, rule name, severity, confidence, status, criterion list, level, EN clauses, element name, view id, class, bounds, message, fix summary, screenshot file name.
- **JSON**: schema `bwa-report/1` with every entity above, versioned and documented in `docs/json-schema.md`; screenshots as file references in a zip when the user chooses "with images".
- **Markdown**: per finding and per session, formatted for GitHub and Jira (Jira's wiki markup variant for the Jira option).
- **ACR skeleton (1.2)**: VPAT 2.5 WCAG edition table structure with conformance level and remarks per criterion, pre-filled; the auditor confirms every level before export, and the export says "draft, prepared with Build with Accessibility".

All exports go through the Storage Access Framework or the share sheet. No network.

## 11. Google Play and distribution

- Category Tools. Listing text documents the accessibility service use in plain language (required).
- Permissions Declaration Form: non-tool AccessibilityService use, purpose "App functionality", with a screen recording of the disclosure flow from section 6.7. Data safety: screenshots and screen content are collected on device, not shared, deletable; no account.
- Privacy policy page on accessibility.build (the website already hosts one for the desktop app; add the Android section or a sibling page).
- Permissions requested: `BIND_ACCESSIBILITY_SERVICE` (service), `SYSTEM_ALERT_WINDOW` (bubble, optional), `POST_NOTIFICATIONS` (optional), `WRITE_SETTINGS` (font scale switch, optional), `FOREGROUND_SERVICE` only if the recorder needs it in 1.1. No `QUERY_ALL_PACKAGES`; a `<queries>` element for launcher activities.
- Direct APK on GitHub Releases for people who cannot use Play, with the Android 13 restricted-settings instructions and a checksum. Same signing key for both channels.
- Internal testing track first, then closed testing with auditors, then production. Versioning starts at 1.0.0.

## 12. Quality and testing

### 12.1 Automated

- Unit tests for every rule in `core/rules` against hand-built `Node` trees: at least one passing and one failing fixture per rule, plus the known false-positive cases from Scanner's reviews (duplicate labels in list rows, back button in a bottom sheet, content behind a sheet).
- Golden tests for the reading preview against recorded TalkBack output from the fixture app on an emulator (stored transcripts, updated deliberately).
- Contrast maths tests against published WCAG examples and the APCA reference values (the website uses APCA-W3 0.1.9 constants; match them so the app and the web contrast checker never disagree).
- Compose UI tests for every screen with Espresso `AccessibilityChecks` enabled, at font scale 1.0 and 2.0, light and dark.
- Screenshot tests of every screen in both themes and both font scales.
- A lint rule that fails the build on a hard-coded colour outside the design tokens.

### 12.2 The fixture app

`fixtures/badapp` is a small Compose and Views app with one screen per rule family, each element annotated with the rule id it should trigger, and a "clean" screen that must produce zero findings. Instrumented tests on an emulator enable the service, open each fixture screen, trigger a capture and assert the exact finding set. This is the regression suite for the engine and the demo for first-time users.

### 12.3 Manual, before every release

- Audit the auditor: zero findings from our engine and from Accessibility Scanner on every screen; TalkBack full traversal; Switch Access run; Bluetooth keyboard; 200 percent font; both orientations; Remove animations; RTL.
- Scan ten real apps across frameworks (Views, Compose, Flutter, React Native, a WebView-heavy app, a game) and record the false-positive rate; investigate anything above 5 percent of Definite and Likely findings.
- Device matrix: a current Pixel, a Samsung with One UI, a budget device on Android 11, a tablet or foldable.

### 12.4 The built-in demo

Settings > Learn > "Try a scan" opens a demo screen inside the app with five known defects (the own-package exclusion allows exactly this screen). It teaches the trigger and the results view without needing a third-party app.

## 13. Milestones

Sizes are indicative for one coding agent with a human reviewer; they are an ordering, not a commitment.

| # | Milestone | Deliverables | Acceptance | Size |
|---|---|---|---|---|
| M0 | Foundation | Repo and modules; theme and components from the design language with previews; CI (unit, lint, screenshot, accessibility checks); fixture app skeleton; onboarding and disclosure; service that lists windows and the foreground package; demo screen | CI green; onboarding usable with TalkBack and at 200 percent; service enables and reports the foreground package | M |
| M1 | Scan engine | Capture pipeline; ATF vendored and patched; OCR adapter; rule families N, R, S, C, T, Z (static parts), O; `Node` model; findings persistence; results UI; highlight overlay; fix guidance text | Fixture app produces the expected finding set per screen; ten real apps scanned with the false-positive review; capture under 3 s | L |
| M2 | Reading preview and conditions | Traversal and utterance port; numbered preview; conditions panel with font scale and animation switches, deep links, matrix | Preview order matches TalkBack on the fixture app in 95 percent of nodes; matrix fills from captures | M |
| M3 | Sessions, diff, export | Sessions UI; baseline diff; HTML, CSV, JSON, Markdown exports; share finding; profiles | Exports validate (HTML passes axe in a browser; JSON validates against the schema); diff on the fixture app before and after a fix shows the right buckets | M |
| M4 | Release 1.0 | Play listing, declaration video, Data safety, privacy page, APK release notes, docs; closed test with auditors | Play review passed; zero own-engine and Scanner findings; manual pre-release list done | S |
| M5 | Record (1.1) | Recorder, transcript view, D rules, flow recording, full-page capture, colour tools | Transcript matches TalkBack speech log on the fixture app; D01 fires on the fixture's broken navigation | L |
| M6 | Audit (1.2) | ACR skeleton, statement draft, keyboard helper, advanced switcher, issue templates | ACR exports open in Word and Google Docs with structure intact; switcher works with Shizuku on a Pixel and refuses cleanly without it | M |

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Play rejects the accessibility service declaration | Follow the disclosure wording and video requirements exactly; keep all actions user-initiated; have the APK channel ready |
| Apps hide overlays or users cannot see the bubble | Accessibility button, tile and notification triggers from day one |
| False positives damage trust (Scanner's main complaint) | Confidence levels; Needs review excluded from totals; fixture-based regression; the 5 percent false-positive gate before release |
| ATF is stale and misreads Compose | Vendor the source, patch, and cover Compose with custom rules on our own `Node` model; keep ATF for contrast, OCR and the checks it does well |
| Predicted utterances differ from the user's TalkBack | Label as prediction with the rules version; show actual transcripts beside it in 1.1 |
| Secure windows and sensitive nodes blind parts of the audit | Report "not evaluated" and hidden-node counts; never guess |
| Phone soft-locks or ANRs during capture | Off-main-thread pipeline, caps and watchdog; partial results over hangs |
| Advanced switcher reads as "changing user settings" to a Play reviewer | Opt-in, documented, tap-to-change only, defaults to deep links; ship it in 1.2, not 1.0 |
| Screenshot storage grows | Half-resolution option, per-session delete, storage meter in Settings |
| Our own app fails its own rules | Accessibility checks in CI; the audit-the-auditor gate in every release |

## 15. Decisions for the owner

| # | Decision | Recommendation |
|---|---|---|
| D1 | Source licence for the app repository | Keep private or publish under a licence of your choice; the ATF and TalkBack code requires an Apache 2.0 NOTICE either way |
| D2 | Google Play developer account | Register under the Accessibility.build organisation before M4 (one-off fee, identity verification takes days) |
| D3 | Bundled or unbundled ML Kit | Bundled Latin model (about 4 MB) so OCR works offline on first run |
| D4 | Pricing | Free, no account, as the website's tools and the WordPress plugin; revisit only for team sync |
| D5 | Shizuku switcher in 1.0 or 1.2 | 1.2, after the Play declaration has been approved once |
| D6 | Name in the Play listing | "Build with Accessibility" with the subtitle "Audit Android apps on the device" |
