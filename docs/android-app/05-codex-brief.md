# Codex brief: Build with Accessibility for Android

Paste everything below the line as the first message to the coding agent, after copying this `docs/` folder into the new repository.

---

You are building **Build with Accessibility for Android**, a standalone Android app from Accessibility.build that helps accessibility auditors audit other Android apps on the same device. This repository is new and empty apart from `docs/`. You have no access to Accessibility.build's website code or design system; the documents in `docs/` are the complete and only reference. Read them in this order before writing any code, in full, not skimmed:

1. `docs/02-android-platform-capabilities.md`: what the platform allows and forbids. Treat its policy section as binding.
2. `docs/03-product-plan.md`: the specification. Section 7 is the rule catalog, section 10 the architecture, section 13 the milestones.
3. `docs/04-design-language.md`: every visual and verbal decision. Do not invent colours, type sizes or copy styles outside it.
4. `docs/06-standards-and-audit-workflow.md`: the content of the manual checklist (section 2) and the report conventions (section 4).
5. `docs/01-market-research.md`: context on competitors; skim.

## What you are building first

Milestone M0 from the plan, then M1, M2, M3, M4 in order. Do not start a milestone before the previous one meets its acceptance criteria. Within M0:

1. Create the Gradle project with the module layout in plan section 10.2, Kotlin 2.4, Android Gradle Plugin 9.5, Compose BOM 2026.09.00, Material 3 1.4.0 stable, Hilt, Room, Kotlin Serialization, Navigation Compose, Coil. `minSdk 30`, `targetSdk 36`, `compileSdk 36`. Verify the exact latest stable versions when you set up the build and record them in `gradle/libs.versions.toml`.
2. Implement `core/design` from `04-design-language.md`: colour schemes (section 4.6), typography with the bundled Mona Sans variable font (section 5), shapes and spacing (section 6), the component set (section 7) with Compose previews for light and dark at font scale 1.0 and 2.0, and a unit test that recomputes the contrast ratios listed in section 4.6.
3. Set up CI (GitHub Actions): `./gradlew lint test`, Compose UI tests with Espresso `AccessibilityChecks` enabled on an emulator, screenshot tests, and a custom lint check that fails on hard-coded colours outside the tokens.
4. Build the onboarding and disclosure flow exactly as plan section 6.7 describes, with the disclosure text verbatim.
5. Create `AuditAccessibilityService` with the manifest in plan section 10.4, and a Scan screen that shows the service state and the foreground package.
6. Create `fixtures/badapp` with at least the "clean" screen and one defective screen, plus the in-app demo screen.

## Working agreements

- **Accessibility of this app is a build requirement.** Every interactive element has a name, role and state; headings use `semantics { heading() }`; every screen has a pane title; targets are at least 48 by 48 dp; text uses sp and never has `maxLines` with ellipsis on essential content; the app is usable with TalkBack, Switch Access and an external keyboard, at font scale 2.0, in both themes and both orientations. Pull requests that break any of these are not done.
- **Confidence before volume.** A rule ships only with unit fixtures for a true positive, a true negative, and the known false-positive cases listed in the plan. Needs review results never count in totals.
- **Policy constraints are absolute.** Do not set `isAccessibilityTool`. Do not request touch exploration or key filtering. Do not work around `FLAG_SECURE`. Do not add analytics, crash reporting or any network call in 1.0. Do not use `QUERY_ALL_PACKAGES`. Do not change any system setting without a direct user tap on a control that names the change.
- **Design tokens only.** No colour, radius or type size that is not defined in `core/design`. No Material You dynamic colour. Lucide icons only.
- **Copy rules.** Sentence case, US English, no exclamation marks, no em dashes, no claims of "accessible" or "compliant"; the voice rules in `04-design-language.md` section 11. All user-facing strings live in resources, never inline.
- **Licences.** Keep the Accessibility Test Framework and the TalkBack port under their Apache 2.0 terms with a `NOTICE` file and the upstream commit hashes; Mona Sans under OFL 1.1; Lucide under ISC; ML Kit under its terms with the required metrics disclosure in the privacy notice. List all of them in Settings > About.
- **Pure JVM where possible.** `core/rules` and `core/talkback-predict` depend on the app's own `Node` model, not on Android framework classes, so they run under plain JUnit.
- **Document decisions.** When two documents disagree, `02` wins on platform facts, `03` on behaviour, `04` on appearance. When a document is silent, choose the simplest option consistent with the principles in plan section 4 and record it in `docs/decisions.md` with the date. Anything that would change the privacy posture, the permission set or the Play declaration is not your call: stop and ask.
- **Every pull request** includes: what changed, screenshots of affected screens in light and dark, the accessibility test output, and the fixture results for any rule touched. Commit messages describe the change in plain English.

## Definition of done for a milestone

The acceptance column of plan section 13 is met, CI is green, the manual "audit the auditor" list in plan section 12.3 has been run on the affected screens, and `docs/decisions.md` records any choice made along the way.

## Questions you are likely to have

- *Where does fix guidance text come from?* Write it from plan section 7, the Android guidance in `06` section 5 and the platform facts in `02`. Give a Views snippet and a Compose snippet per rule, and link the criterion to `https://accessibility.build/wcag/{x-y-z}` (for example `https://accessibility.build/wcag/4-1-2`).
- *How exact must the reading preview be?* Port TalkBack's traversal and node-text logic faithfully; where TalkBack behaviour depends on user settings or device flavour, choose the defaults and say so in the preview banner.
- *What if ATF misreports a Compose element?* Patch the vendored copy, add a fixture that reproduces it, and note the upstream issue number in the patch header.
- *Can I use a newer library version?* Yes if stable. Never a beta or alpha in a release build.
