# Build with Accessibility for Android: handoff pack

Status: research and plan written 30 October 2026. Nothing in this folder is code; it is the brief for building the Android app in its own repository with an AI coding agent (Codex) that has no other access to Accessibility.build.

## What the product is

A standalone Android app from Accessibility.build that helps accessibility auditors audit **other** Android apps on the same device: automated checks on every screen (names, roles, contrast, touch targets, text scaling, headings, focus order and more), a guided manual audit that covers what automation cannot, device test conditions switched from one panel, evidence capture, and reports in the formats auditors deliver. It is the mobile counterpart of the website's tools and the WordPress plugin, and it carries the same name as the plugin: "Build with Accessibility".

## Files, in reading order

| File | What it is | Who reads it |
|---|---|---|
| `01-market-research.md` | Every tool an Android auditor uses today, what each does, what each lacks, and the gaps this app fills | Product decisions; skim before building |
| `02-android-platform-capabilities.md` | What an on-device auditing app can and cannot do on Android 8 to 16, the Play policy constraints, and the open-source building blocks | Required reading for the coding agent |
| `03-product-plan.md` | The product: personas, scope by release, the full rule catalog mapped to WCAG 2.2, screens, architecture, data model, exports, testing, risks and milestones | Required reading for the coding agent |
| `04-design-language.md` | The Accessibility.build brand translated to Android: color tokens, type, shape, components, voice, icon, accessibility bar | Required reading for the coding agent |
| `05-codex-brief.md` | The prompt to paste into Codex, plus the working agreements (stack, repo layout, definition of done) | Paste first |
| `06-standards-and-audit-workflow.md` | How auditors evaluate native Android apps: standards by jurisdiction, every WCAG 2.2 A and AA criterion with its Android test procedure, automation limits, scoping, finding records, severity scales, ACR and statement formats, platform guidance, failure prevalence | Source of the manual checklist, profiles and report templates |

## How to use this pack with Codex

1. Create an empty repository (suggested name `build-with-accessibility-android`) and copy this whole folder into it as `docs/`.
2. Paste the part of `05-codex-brief.md` below its horizontal rule as the first message. It tells the agent to read `02`, `03`, `04` and `06` in full before writing code.
3. Work milestone by milestone as laid out in `03-product-plan.md` section 13. Do not let the agent skip milestone M0 (project skeleton, theme, CI, accessibility test harness); everything after depends on it.
4. After each milestone, run the acceptance checks listed for it, including the "audit the auditor" pass with Google's Accessibility Scanner and TalkBack.
5. Decide the six owner decisions in `03-product-plan.md` section 15 before milestone M4 (release); the Google Play developer account takes days to verify.

## Conventions used in these documents

- Facts about third-party products and Android APIs are dated 30 October 2026 and carry a source where one was found. Items marked "verify" need a check at build time because they change often (library versions, Play policy wording).
- WCAG references are to WCAG 2.2. Android guidance references are to developer.android.com unless stated.
- Severity words are axe-core's: Critical, Serious, Moderate, Minor, plus Needs review.
- The documents avoid em dashes on purpose; keep that style in any copy added to the app.
