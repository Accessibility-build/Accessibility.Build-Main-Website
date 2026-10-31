# Market research: Android accessibility auditing tools (30 October 2026)

Part of the Build with Accessibility for Android handoff pack. This document records what exists today, what each tool does and lacks, and where the planned app can be alone in its category. Part 1 is the summary and the implications for the product; parts 2 onward are the detailed findings with a numbered source for every claim. Play Store figures were read on the research date and will drift.

## 1. Summary and implications

### 1.1 The landscape in one page

**The free on-device slot is thin and has barely moved in years.** Google's Accessibility Scanner (free, 4.0 stars from about 15K reviews, 1M+ installs) runs the 14 checks of Google's open-source Accessibility Test Framework in four categories: content labels, touch targets (48 dp), contrast (3.0:1 default) and a few implementation heuristics for traversal order and text scaling. It has no WCAG mapping, no structured export, no scan history, no TalkBack capture and no heading, orientation, keyboard or genuine text-resize checks. After a two-year gap it shipped 2.5.0 and 2.5.1 in spring 2026. A CHI 2025 study measured it at 31.3 percent recall against expert-found screen reader errors, with 0 percent on heading errors. Its most up-voted reviews ask for export, complain that the app itself is hard to use with TalkBack, and report false positives on duplicate descriptions.

**One new direct analogue exists:** BarrierBreak's A11yInspect (free, no login, on-device, 100+ installs as of April 2026) with no published rule list and Jetpack Compose "coming soon". Siteimprove ships a customer-only Android app with seven rules. Deque's axe Accessibility Analyzer now needs a Deque account and licence and sends results to a web dashboard; its listing sits at 2.8 stars. Evinced is desktop-tethered and enterprise-priced. Microsoft retired Accessibility Insights for Android in June 2023.

**Everything with real WCAG coverage runs in the cloud or on a desktop and sells to enterprises:** BrowserStack App Accessibility (37 Android rules including headings, orientation lock, keyboard focus, text truncation and font magnification; mobile price unpublished), TestMu AI (formerly LambdaTest, 159 dollars a month), Deque (16 Android rules), Level Access (demo-led).

**Buyers are regulated organisations:** EU services under the European Accessibility Act since June 2025, UK public-sector apps since June 2021, US state and local government apps under the ADA Title II rule (deadlines now April 2027 and April 2028), and banks. Audits are priced per screen (75 to 250 dollars) and retests at about half the audit fee. There is a visible hole between "free but shallow" and "enterprise contract".

### 1.2 Gaps nobody fills on the device, ranked

Full evidence is in part F. In order of auditor value:

1. What TalkBack will announce, as text, per element, in traversal order, without listening.
2. The structural checks auditors actually report: headings, orientation lock, keyboard reachability, text resize. UK government monitoring of 21 apps found 4.1.2, 1.3.1, 1.4.3, 2.1.1 and 1.4.4 as the top failures, with keyboard and orientation issues the least likely to be fixed.
3. WCAG-mapped, shareable structured reports (HTML, CSV, JSON) from a free on-device tool.
4. Scan history, retest diffs and baselines on the device.
5. Compose-correct semantics (merged nodes, roles, custom actions).
6. Capture of dynamic events: announcements, live regions, focus moves, dialogs.
7. Colour sampling from another app's live screen, with WCAG ratios and colour-vision simulation of the captured UI.
8. Standard profiles the auditor can choose (WCAG 2.2 AA, EN 301 549) that change thresholds such as 24 dp target spacing versus 48 dp platform guidance.
9. An overlay that survives apps that hide overlays and is itself usable with TalkBack.
10. Scrolled-off and multi-window content.

### 1.3 What this means for Build with Accessibility

**Positioning.** The free, on-device auditor that produces what an auditor can hand to a client: every finding mapped to WCAG 2.2 and EN 301 549, a transcript of what the screen reader will say, device test conditions switched from one panel, a guided manual audit for everything automation cannot see, and exports in the formats audit reports are written in. Nothing leaves the device unless the auditor exports it.

**Be alone in the category by shipping all five together:** screen reader transcript and traversal order; heading, orientation, keyboard and resize checks; WCAG and EN 301 549 mapping with HTML, CSV and JSON export; per-app history with diffs; and an app that passes its own rules under TalkBack.

**Do not compete on** device clouds, CI SDKs compiled into the app under test, Appium drivers, or an enterprise web dashboard in version 1. Those are where Deque, Evinced and BrowserStack are strong and where an on-device app has no advantage. A later sync to Accessibility.build can add team features without the app depending on an account.

**Expect the same technical hazards the incumbents document:** apps that call `setHideOverlayWindows(true)`, screens with `FLAG_SECURE` (no screenshot, so no pixel contrast), modals and bottom sheets that leave background content in the tree, Compose semantics that the Accessibility Test Framework still misreads, and the phone soft-locks and vanishing floating buttons that reviewers complain about. The product plan treats each as a requirement, not a known issue.

**Pricing read.** Core auditing should be free with no account, matching Scanner and A11yInspect and consistent with the website's free tools and free WordPress plugin. Paid value, if any, belongs in export templates, team sync and services, not in gating findings. The product plan makes the call.

## 2. Method and scope

Products were grouped as (A) tools that run on the Android device itself, (B) desktop and cloud tools that audit Android apps, (C) developer tooling bundled with Android Studio and the test frameworks, and (D) open-source projects. For each product the aim was: maker, price or licence, technical approach, what it checks (full rule list where published), WCAG mapping, outputs and exports, team or workflow features, platform requirements, maintenance status, strengths, weaknesses, and user complaints with sources.

Two research limits should be stated up front. Google Play review text was captured from the "most relevant" sort of the web listing, not the full review corpus. Evinced publishes its mobile validation catalogue in a JavaScript-rendered knowledge base that could not be enumerated here, so its rule list is reconstructed from SDK docs, release notes and two knowledge-base pages.

---

## Part A. On-device tools

### A1. Google Accessibility Scanner

**Maker and price.** Google LLC. Free. Play listing: 4.0 stars from about 15K reviews, 1M+ downloads, last updated 15 April 2026 [4]. The listing's review panel shows 4.1 from 14.6K phone reviews [4]. A third-party tracker shows 3.9M+ installs and a 4.35 average [6]; the install count on the listing itself is the 1M+ tier, so the tracker figure is unverified.

**How it works.** An AccessibilityService that draws a floating button over any app. It retrieves window content and observes actions (the listing's permission notice) [4]. Checks come from Google's open-source Accessibility Test Framework (ATF); Android's own testing docs state Scanner "uses the Accessibility Test Framework" [11]. Two modes: Snapshot (one screen) and Record (a series of screenshots across a workflow; not video; pauses when you leave the app) [1].

**Exact check list.** The results help page defines four categories and twelve suggestion types [2]:

- Content labelling: Item label missing; Item labelled with type or state; Duplicate item descriptions; Link purpose unclear; Unexposed text.
- Implementation: Clickable links (ClickableSpan that is not a UrlSpan); Duplicate clickable elements (same on-screen location); Editable item label (EditText with a contentDescription); Unsupported item type; Traversal order ("possible issues in the traversal ordering of items"); Text scaling ("font size and layout specifications ... that may cause text to become cropped, cut, or hidden").
- Touch target size: clickable or long-clickable views smaller than 48x48dp (32x32dp inside input-method windows or at the display edge).
- Low contrast: "text or images with a contrast ratio lower than 3.0 between the text color and background color (for non-empty TextViews) or between the foreground and background color (for ImageViews)" [2].

This maps one-to-one onto the 14 check classes in the ATF repository: ClassNameCheck, ClickableSpanCheck, DuplicateClickableBoundsCheck, DuplicateSpeakableTextCheck, EditableContentDescCheck, ImageContrastCheck, LinkPurposeUnclearCheck, RedundantDescriptionCheck, SpeakableTextPresentCheck, TextContrastCheck, TextSizeCheck, TouchTargetSizeCheck, TraversalOrderCheck, UnexposedTextCheck [8].

**Settings.** Minimum text contrast ratio, minimum image contrast ratio and minimum touch target size are user-adjustable in Scanner settings [1][2]. There is a colour editor that lets you try alternative foreground or background colours on a contrast finding [1]. No exclusion or suppression options are documented [1].

**Outputs and sharing.** Orange outlines on screenshots; a list view grouped by screen or by category; a library grid of screenshots; "share" of a whole scan or a single item; past scans can be renamed, described or deleted [1]. Sharing produces screenshots plus text; there is no structured export. Recordings "stay on your device and are never shared with Google" [3].

**WCAG mapping.** None. Suggestions are described in Android terms; no success criterion is cited [2]. Deque's remediation guide for Scanner findings notes that "duplicate item descriptions" is "not a WCAG failure" and that a Traversal Order finding "may be a false positive" if TalkBack already reads in a sensible order [34].

**Requirements and limitations.** Android 9.0+; a frozen version 230 remains for Android 6.0 to 8.0 [1][3]. Windows with FLAG_SECURE cannot be captured or contrast-checked and appear as a black screen [1][3]. Google states it "isn't a replacement for manual testing" [1].

**Maintenance.** After a gap from November 2023 (2.4.1) to March 2026 (2.5.0), two 2026 releases shipped: 2.5.0 on 29 March 2026 and 2.5.1 on 30 April 2026 [5]. Release notes: "Accuracy improvements to accessibility checks; Scans now include additional application windows; Bug fixes" [4][5]. The underlying ATF library's last published artifact on Google's Maven is 4.1.1 with metadata updated 29 March 2024 [10]; the GitHub repo lists 22 open issues and no formal releases [7][9].

**Recurring complaints (Play reviews, GitHub, academic).**

- Export and sharing: "it doesn't allow to export/import scan results and sending the results as screenshot and txt files is super annoying for coworkers (not tech ones) to understand" (Dec 2024, 95 helpful votes) [4]. Earlier: "I cannot find the share button to send a complete report of the app that I recorded" (Apr 2020, 124 votes); "can we export the consolidated in a JSON or any report format?" (Nov 2019, 249 votes) [4].
- The app's own accessibility: a TalkBack user wrote "the app itself is not accessible for people using screen reading software like TalkBack" (Jul 2025, 93 votes); a blind user reported the report was generated in the phone's system language rather than the scanned app's language, and that the scan button is sometimes missing (Dec 2020, 917 votes) [4].
- False positives: "If the UI is having multiple items with same component ... tool will tell, duplicate semantics on the screen. this is not an error" (Feb 2026) [4]. Firefox for Android bug reports show Scanner flagging a "Back" button in a bottom sheet as unlabelled and skipping elements in a reader-view pop-up to analyse the page behind it [22][23].
- Device lock-ups: several 2020 to 2024 reviews describe the phone soft-locking after a scan and needing a hard reboot [4].
- Compose coverage at the library level: open ATF issues include "SpeakableTextPresentCheck skipped on Compose IconButton" (Jun 2026), "ATF skips some Compose elements when AndroidView is present" (Feb 2026), "TextContrastCheck does not run on TextView with Compose Origin" (May 2024) and the long-running "Jetpack compose compatibility" (Dec 2021) [9].
- Research: the CHI 2025 ScreenAudit study measured Scanner at 31.3% recall against expert-identified screen reader errors (precision .729, F1 .438), with 0.0% accuracy on heading errors and 20.4% on structure and grouping; students in the study "identified inconsistent or false positive issues" and found output terms "overly technical" [24].

**Strengths.** Free, no account, runs offline, works on any app including production builds, adjustable thresholds, record mode across flows, Google's own ATF rules. **Weaknesses.** No WCAG mapping, no structured export, no history or baselines, no TalkBack announcement capture, no heading or orientation or keyboard checks, weak Compose coverage at the ATF level, FLAG_SECURE blind spot.

### A2. Deque axe DevTools Mobile: axe Accessibility Analyzer (Android app) plus SDKs

**Maker and price.** Deque Systems. The Analyzer is a free download on Play but requires a Deque account [27][38]; Play reviewers report it moved from free use to paid: "This used to work great as a free app but apparently now you have to pay" (Feb 2025) [38]. Deque's pricing page lists Pro at a per-seat price for the web extension and says "Looking for mobile accessibility testing tools? Check out Axe DevTools for Mobile" with no price; Mobile is sales-led ("Request a Demo") [35][25]. A search-indexed Deque plans page lists Pro at $45 per user per month "with Mobile app testing available as an add on" [36] (not re-fetched; treat the add-on price as unpublished). Third-party estimates put the combined axe DevTools and Monitor platform at $15,000 to $200,000+ per year [119] and axe DevTools "starting at $45/month/user" [120]; both unverified against Deque.

**Play listing.** "axe Accessibility Analyzer", 2.8 stars from 12 reviews, 1K+ downloads, updated 9 October 2026 [38]. A tracker shows first release 14 August 2023 and 5K+ installs [39].

**How it works.** Install from Play; choose Standard or Custom (on-prem) server; sign in with a Deque account; grant draw-over-apps, "Allow modifying system settings" or accessibility access, and screen recording and casting permission [27]. A floating action button appears over any app; tap it on each screen; a second kebab FAB offers "Finish report"; results are sent to Axe Developer Hub (web) and the docs describe no on-device results view [28][29]. In December 2023 Deque removed the embedded FAB from its Android library and told users to switch to the Analyzer app [32]. Results include an accessibility score, severity breakdown, per-instance remediation, project URLs for sharing, and "multiple JSON formats" for export [29]. The Mobile JSON export is a zip with one JSON per result plus screenshot and view hierarchy; the axe universal JSON drops screenshots and hierarchy; exports time out at 30 seconds [33].

**Rule list and WCAG mapping (Android, v2025.7.2).** Sixteen rules, each mapped to a WCAG criterion and impact [26]: Active View Name (4.1.2, Critical), CheckBox Name (4.1.2), Color Contrast (1.4.3, 4.5:1 or 3.0:1 large), Edit Text Name (4.1.2), Edit Text Value (4.1.2), Focusable Text (1.3.2), ImageView Name (1.1.1), Inaccessible Action (2.1.1), Label At Front (best practice), Label In Name (2.5.3), Nested Focusable Element (listed as 4.1.2), Screen Orientation (1.3.4), Screen Title (2.4.2), Switch Name (4.1.2), Touch Target Size (44x44dp, cited to 2.5.5 AAA), Touch Target Spacing (24dp, 2.5.8 AA). Deque's own Scanner remediation page shows it treats Google's Scanner as complementary, not a competitor to be displaced [34].

**Platforms.** Native Android XML and Compose; React Native, Flutter and .NET MAUI for interactive testing; Espresso, UI Automator and Appium for pipelines; React Native linting [25]. Appium drivers run on Sauce Labs, Kobiton and Perfecto device clouds [40][128].

**Team features.** Centralised dashboard, sharing by URL with code samples, user management, enforced configurations, PR blocking, custom rulesets, on-prem or private cloud deployment [25][37].

**Maintenance.** Monthly-ish releases; the April 2026 notes add Auto Scan for Appium drivers [31].

**Known issues and complaints.** Deque's own known-issues page lists: the FAB disappears in apps that call setHideOverlayWindows(true); TalkBack older than 16.2 cannot focus the FAB; hidden views behind other views are still reported; views behind custom modals are reported; Label at Front false positives on abbreviations; Color Contrast skipped when text and background colours match; Screen Title fails on every Flutter screen; Touch Target Spacing does not run on Compose sliders; EditTextName false positives on Android 7; missing screenshots when FLAG_SECURE is set [30]. Play reviews: "many times it crashes and the only way I can get it to work again is to uninstall it" (May 2026); "You need to signup on the website to get an api key and ironically the UI is broken there" (Jan 2025); "does nothing, can't create an account" (Feb 2026) [38]. The docs also say analyzer runs "may show more issues" than automated runs because analyzer rule sets cannot be ignored [29].

**Strengths.** Real WCAG mapping, mature dashboard, enterprise governance, broad framework coverage. **Weaknesses.** Account and licence wall, results live in the cloud not on the device, 2.8-star listing, overlay fragility, no heading or text-scaling rules on Android in the published list [26].

### A3. Evinced Mobile Flow Analyzer (MFA) and Mobile SDKs

**Maker and price.** Evinced Ltd (raised a $55M Series C in December 2024; total $112M) [52]. Pricing is not published; Gartner describes a subscription model [53]; third-party tier estimates exist but are unverified. An Evinced account is required [44].

**Architecture.** MFA is a Windows and macOS desktop app that connects to a real or virtual Android or iOS device; wired Android needs ADB, wireless pairing uses a QR code [44]. The Play companion app "Evinced Mobile Flow Analyzer" (1K+ downloads, no ratings, updated 20 August 2026) enables an accessibility service so the desktop client can take screenshots and read the view tree [51]. So it is device-tethered, not on-device: results appear on the desktop, not on the phone.

**Scan modes.** Scan View (viewport only), Scan Full Page (crawls the whole current page), Scan App (crawls default view of every page) [47]. Full-page iOS scanning arrived March 2026 [48]. Webview content is scanned [43].

**Rule catalogue (partial, reconstructed).** Tappable Area (48x48dp default or 24dp plus spacing; mapped to 2.5.8 and 2.5.5) [49]; Colliding Controls (1.3.1, 2.5.8) [50]; Color Contrast; Duplicate Name; Accessible Name; Label in Name; Meaningful Heading (cloud, LLM-assisted, "Needs Review") [45]; On Focus (Android, Q3 2025) [47]; Text-Resizing and Minimum Text Size for Android XML (Q1 2026, no longer need Mobile Kit) [48]. Compliance mapping options: WCAG (default), Section 508, EN 301 549 / EAA [45][48]. Severities: Critical, Serious, Moderate, Minor, Best Practice, plus Needs Review [44].

**Outputs and workflow.** HTML, JSON and CSV exports (self-contained, filter-aware); view hierarchy export as JSON; sync to the Evinced Platform with search and filtering by platform, app, version, owner, severity and date; Jira and Azure DevOps ticketing configured via support [44][48]. SDK baseline comparison labels issues New, Persistent or Ignored (Espresso 1.30.0+, Sept 2025) [47][45]. The optional Android Mobile Kit is a debug-only library added to the app under test that unlocks extra validations; version 1.1.1 (April 2025), pulled from a private Artifactory, "not currently intended to be used in a production app" [46].

**Requirements.** Android 5.0+ for the SDK; Java 11; Kotlin 1.5 [45][46].

**Strengths.** Only vendor with documented full-page crawling, webview coverage, text-resizing validations, CSV export and baselines. **Weaknesses.** Desktop plus account plus ADB; no public price; richest checks need Mobile Kit inside the app; companion app has no ratings or community footprint.

### A4. Siteimprove Mobile A11y (Android app)

**Maker and price.** Siteimprove A/S. Customer-only: "You must have a valid Siteimprove account to use it" [75]. Play listing shows 10+ downloads, updated 2 June 2026, no rating yet [75].

**How it works.** Installable app with a floating action button; requires Android accessibility permissions; session-based: start a session, navigate, capture key screens, finish to process and receive a report; share results with the team; attach to Jira or another tracker [73][74][75]. Android 8+ [74]. Any native Android app on the device can be tested per the Android article [74], although the overview says rules are "derived from native platform guidelines (Android Jetpack Compose and SwiftUI)" [73].

**Rules (published table).** Image missing an accessible name; Touch target too small (44x44dp); Button missing an accessible name; Form element missing an accessible name; Interactive element missing an accessible name (iOS only, not in the Android app); Same accessible name, different purpose; Visible label and accessible name do not match [73]. Issues are mapped to WCAG criteria [73].

**Weaknesses.** Seven rules, no contrast rule listed, customer-only, flow-only scanning, tiny install base. **Strengths.** Genuine on-device auditing with a WCAG-mapped shareable report, from a platform vendor with web monitoring to cross-sell.

### A5. BarrierBreak A11yInspect for Android

**Maker and price.** BarrierBreak Solutions Pvt Ltd (India). Free, "No login required for Free" [76]; Product Hunt lists it as free with no credit card [77]. Play listing: 100+ downloads, updated 22 April 2026, no rating yet [76].

**How it works.** Accessibility Service API analyses on-screen content on device; highlights errors in real time; "Works on any Android app running on your device, including production builds"; detects "missing labels, low-contrast text, touch target issues, and more"; "Supports Kotlin and popular Android frameworks, Jetpack Compose coming soon" [76]. Product Hunt lists compliance support for WCAG, Section 508, EN 301 549, GIGW 3.0 and IS 17802 (the Indian standards) [77]. No full rule list, export format or WCAG-per-issue mapping is published [76][78].

**Significance.** This is the closest existing analogue to the planned product: free, on-device, no account, any app. Its Compose gap and thin documentation are the openings. BarrierBreak also sells an iOS framework and mobile audit services [78].

### A6. Level Access Mobile Testing Suite (On-Device Testing, Live App Testing, SDK)

**Maker and price.** Level Access (which acquired UserWay). No published price; 30-minute demo is the call to action [79][80].

**Products.** Mobile Testing SDK (beta announced Jan 2025, Appium and CI) [81]; a no-code "Live App Testing" cloud upload-and-navigate tool (limited beta April 2025) [82]; and "On-Device Testing": "Run accessibility scans directly on the physical devices, emulators, and simulators your team already uses. Crawl your app with AI, evaluate finding history, and share results" (brochure dated September 2026) [80]. Findings flow into the Level Access Platform with issue history, Jira sync and MCP connectivity [80][81]. The FAQ claims native rules "cover all WCAG 2.0, 2.1, and 2.2 success criteria" [79]. How On-Device Testing is delivered on Android (Play app, sideload, or SDK) is not documented publicly; unverified.

### A7. Stark (Android integration)

Stark's Android route is not an on-device auditor: it runs Google's ATF inside instrumentation tests via a Gradle plugin (co.getstark.accessibility 1.0.1, beta) and uploads results to the Stark dashboard [83][84]. Relevant as a design-to-dev platform competitor, not as a phone app.

### A8. Niche Play Store apps auditors keep installed

- **Chromatic Vision Simulator** (Kazunori Asada): free, 4.3 stars, 1.3K reviews, 500K+ downloads, updated 30 October 2026; live camera and photo simulation of protanopia, deuteranopia and tritanopia with side-by-side split, strength slider, difference mode, colour naming; no network access; works with TalkBack [88]. It simulates the camera, not the on-screen UI of another app.
- **Color Blind Pal** (Vincent Fiorentini): free, 3.4 stars, 839 reviews, 100K+ downloads, updated 7 October 2026; camera colour inspector and filter, can simulate any CVD type [89]. Reviews ask for zoom on frozen frames and an offset cross-hair [89].
- **WCAG Contrast Checker** (99ersstudio): 10+ downloads, updated 14 October 2026, ads with a one-off purchase; manual two-colour picker, AA/AAA badges, CVD simulation, six-colour palette matrix; its own description says "It does not offer a camera eye-dropper, CSV/JSON export, or full-site accessibility auditing" [90]. The Play search for contrast checkers otherwise surfaces iOS or web tools; there is no established Android app that samples colours from another app's live screen (unverified beyond the store search).
- **Developer Assistant** (Jarosław Wiśniewski / Apps Isle): 4.2 stars, 1.61K reviews, 100K+ downloads; inspects the view hierarchy, IDs, text style, dp measurements and translation keys of other apps via the Assist API plus optional Accessibility Service; "limited support of technologies like Android Compose, Flutter and Web apps"; 30-day trial then paid licence [91]. Not an accessibility auditor but the nearest thing to an on-device inspector.
- **Appt - App accessibility** (Stichting Appt): educational demo of accessibility features, 10K+ downloads, last updated 10 January 2023 [92]. **ScreenReader - Learn TalkBack** (Stichting Appt): 3.7 stars, 159 reviews, 10K+ downloads, updated 29 January 2026; gesture and action training [93].
- **Not auditors despite the search placement:** "Accessibility Support Tool" (East-Hino) is a shortcuts app for motor-impaired users (4.5 stars, 100K+) [97]; "ADAShield Pro - WCAG Scanner" (Elev8AI) scans public web pages, not apps [96].
- **a11y-ally** (Quittle): formerly a Play app overlaying missing descriptions and small targets; the Play URL now returns Not Found and the last commit is 2 February 2021 [103][104].

### A9. Built-in assistive technology used as test instruments

- **TalkBack developer settings**: Settings > Accessibility > TalkBack > Settings > Advanced settings > Developer settings: set Log output level to VERBOSE and turn on "Display speech output" to show announcements on screen [11][20]. "Enable node tree debugging" dumps the accessibility node tree, including traversal order, to Logcat under the tag TreeDebug [21][121][12]. This is the only way today to see what TalkBack will say without listening, and it requires Logcat or reading toasts.
- **Switch Access** (Google, 3.7 stars, 190K reviews, 1B+ downloads, updated 16 June 2026): Android's testing guide recommends group selection to verify that only actionable items are highlighted and each only once [95][11].
- **Voice Access** (Google, 3.8 stars, 248K reviews, 1B+): overlays numbers on actionable items; recent reviews complain it stopped hearing commands after Gemini arrived on Samsung phones [94].

---

## Part B. Desktop and cloud tools that audit Android apps

### B1. Microsoft Accessibility Insights for Android (retired)

Launched 10 March 2020 as a Windows, Mac and Linux desktop app that connected to a device or emulator, installed a companion accessibility service, and ran automated checks for low contrast, missing names and small touch targets using Deque's axe-android rules [57]; the archived service README also names ATF checks and says results were read over "adb shell content read" after the 1.x HTTP-over-adb-forward method was removed in 2.x [55]. It offered tab-stop helpers for keyboard testing, a Needs Review bucket, and GitHub or Azure Boards issue filing [58]. Support ended 1 June 2023 because "usage ... did not meet expectations" [56]; the repo was archived 16 November 2023 [55]; the download is gone and installed copies receive no updates [54][117]. The axe-android library it depended on was archived 30 August 2023 with ten rules (Active View Name, Color Contrast, ImageView Name, Touch Size WCAG, Touch Size Custom, CheckBox Name, Don't Move Accessibility Focus, EditText Name, EditText Value, Switch Name) [42]. HTML report export: unverified.

### B2. BrowserStack App Accessibility Testing

GA on 25 September 2024 with WCAG 2.1 and 2.2 at all levels, TalkBack and VoiceOver on real devices, React Native and Flutter support [60]. Components: Workflow Analyzer (scan screens as you navigate, optional Continuous Scanning), automated tests via the BrowserStack SDK and Appium, screen reader sessions, Figma design tools, a linter, and AI agents [59]. Spectra rule engine claims about 75% of real-world issues across 20+ success criteria [59]. The published rule repository lists 37 rules, all applicable to Android, two Android-only (Content Description in Editable Elements; Text spacing), covering labels, duplicate and redundant spoken output, label in name, link purpose, images of text, text and non-text contrast, missing and incorrect headings, orientation lock, keyboard focus, meaningful reading and visual order, overlapping interactive elements, screen reader focus, traversal order, input field labels and input type, font magnification, responsive containers, text truncation, two-dimensional scrolling, and touch target size and spacing [61]. Configuration: WCAG 2.1 or 2.2 at A/AA/AAA or RAAM 1.1; best-practice, needs-review and experimental toggles; per-rule exclusions; framework hint; Continuous Scanning cannot run the Screen Reader Focus and Meaningful Reading Order rules [62]. TalkBack sessions stream audio and expose keyboard shortcuts for next and previous, but the docs describe no text transcript of announcements; touch gestures on the device act in regular mode not TalkBack mode; supported devices listed are Pixel 6 (Android 12), Galaxy S22 Plus (12), S24 Ultra (14) with TalkBack 16.2 [63]. CSV export exists for app accessibility reports [64]. Pricing for App Accessibility is not on the pricing page; the page shows web "Test & Monitor" at $1,099 per month annually and a $375 per month Team Ultimate toolkit [65]; third-party listings show no mobile price [67]; a G2 reviewer calls BrowserStack "relatively expensive ... for small teams or individual developers" [66].

### B3. LambdaTest / TestMu AI native app scanner

Rebranded TestMu AI. Manual scanner in real-device sessions plus Appium "AutoScan" and KaneAI no-code steps. Detects missing labels, unreachable elements, contrast, text that breaks at large font sizes, target size and spacing, focus order, content structure, input purpose, orientation lock; "18 baseline Android rules, 15 baseline iOS rules, and 34 newer rules shared by both"; WCAG target selectable (2.0/2.1/2.2, A/AA/AAA); Critical to Minor severities; PDF and CSV export; Accessibility plan $159 per month billed annually with 750 scans per month (from the page's schema markup) [68]. TalkBack on real Android devices since October 2024 [69].

### B4. Sauce Labs, Perfecto, Kobiton

Sauce Labs: live Android sessions with one-click TalkBack streamed to the browser (Android 12+), and automated testing via Deque's Appium drivers using a Deque licence, results in Deque's dashboard [41][40][127]. Perfecto: TalkBack and VoiceOver on cloud devices (Appium 2, Pixel devices on Android 13+), accessibility scenarios in Appium tests, and an older integration with Google's Accessibility Scanner via automation [70][71]. Kobiton: Deque Appium drivers are supported [128]; its own guide is a useful statement of what automation misses (focus flow, silent state changes, modal dismissal, gesture alternatives, text enlargement in context) [72].

### B5. Google Play pre-launch report and Firebase Test Lab

After an upload to a release track, Play's crawler runs ATF checks on Android 9+ devices and reports Content labelling, Touch target size, Implementation and Low contrast, grouped into screen clusters with device, OS, density and language per screenshot and a recommendation; Google says it does not guarantee finding every issue and points to Accessibility Scanner for more [18][19][11]. Firebase Test Lab provides the infrastructure and lets you record Robo scripts [19].

---

## Part C. Developer tooling

- **Android Studio Compose UI Check**: introduced in Iguana Canary 5 (Feb 2024); audits Compose previews for adaptive and accessibility issues such as text stretched on large screens and low colour contrast, listed in the Problems panel; early known issues included "Suppress rule doesn't work" [14]. Uses the same checks as Accessibility Scanner and the views integration; a 2025 to 2026 "Fix with AI" button proposes code changes [13][15]. Preview-only: it cannot run against another team's installed app.
- **Layout Inspector**: shows Compose semantics (merged vs declared, focusable, onClick, hideFromAccessibility) for debugging what services see [12].
- **Android Lint accessibility category** (9 checks): AccessibilityFocus, AccessibilityScrollActions, AccessibilityWindowStateChangedEvent, ClickableViewAccessibility, ContentDescription, GetContentDescriptionOverride, InflationInItemDecoration, KeyboardInaccessibleWidget, LabelFor [17]. Source-code only.
- **Espresso AccessibilityChecks**: AccessibilityChecks.enable() runs ATF on every ViewAction (or from the root with setRunChecksFromRootView); suppression via setSuppressingResultMatcher with matchesCheck and matchesViews [16]. Needs the app's source and test harness.
- **UI Automator viewer / Appium**: inspect the semantics tree and write selectors; Appium accessibility auditing in practice comes from vendor drivers (Deque, Evinced, BrowserStack, LambdaTest) [11][40][45][68].

---

## Part D. Open source beyond ATF

- **Android Accessibility Inspector App** (jwlilly, GPL-3.0, 44 stars): desktop Electron app plus companion service; installs the service over ADB, forwards port 38301 to a WebSocket, captures node tree and screenshot, highlights the node under the cursor, logs announceForAccessibility messages, toggles not-important views, Wi-Fi QR pairing; release 2.1.0 on 25 October 2026 [98][99]. Active and the best free view of the live node tree, but desktop-tethered.
- **ComposeA11yScanner** (mohdaquib, Apache-2.0, 33 stars): debug-only runtime SDK for Compose with rules for Touch Target Overlap, Missing and Duplicate Content Description, Focus Order, Text Scaling, Image With Text Overlay, Clickable Role, Text Contrast (pixel analysis on API 26+); shake to scan; 3.0.0 released 17 September (year not shown; unverified); CSUN 2027 acceptance claimed [100][101]. Must be compiled into the app.
- **AALT android-accessibility-test-kit** (1 star): Robolectric tests for contrast 4.5:1, 8dp spacing, form labels, alt text, 48dp targets; v1.0.0-alpha [102].
- **a11y-ally** (Quittle, Apache-2.0, 25 stars): overlay of missing descriptions and small targets; dormant since February 2021 [103][104].
- **Oh My Android** (ateymoori): macOS 26+ ADB GUI with a dp layout inspector, an accessibility audit, one-click TalkBack and an MCP server; a recent release fixed false small-target reports on list edges [105].
- **Research**: ScreenAudit (CHI 2025) drives TalkBack, captures speech output and uses an LLM to find label-quality, structure, heading and functionality errors that rule-based checkers miss [24]; Alotaibi et al. (ICST 2022) detect TalkBack interactive failures automatically [125]. Neither is a product.

---

## Part E. Comparison table

Legend: Y = documented; N = not documented or absent; P = partial; ? = unverified. "On-device" means results are produced and viewable on the phone without a desktop or cloud.

### E1. Tools that run on or tether to the device

| Capability | Google Accessibility Scanner | axe Accessibility Analyzer (Deque) | Evinced MFA + companion | Siteimprove Mobile A11y | BarrierBreak A11yInspect | Level Access On-Device Testing |
|---|---|---|---|---|---|---|
| Price / licence | Free [4] | Free download, Deque account and licence [27][38] | Enterprise subscription, unpublished [53] | Customer-only [75] | Free, no login [76] | Unpublished, demo-led [80] |
| Results viewable on the phone | Y [1] | N, Developer Hub web [28][29] | N, desktop client [44] | Y (report on device, shareable) [75] | Y [76] | ? |
| Works without account or desktop | Y | N | N | N | Y | ? |
| Any installed app incl. production | Y [4] | Y (no source needed) [38] | Y [43] | Y [74] | Y [76] | ? |
| Mechanism | AccessibilityService + ATF [4][11] | AccessibilityService, overlay, screen capture [27] | Desktop + ADB + device accessibility service [44][51] | AccessibilityService + FAB [74] | AccessibilityService [76] | ? |
| Labels / names | Y [2] | Y, 6 name rules [26] | Y [45] | Y [73] | Y [76] | Y (claims) [79] |
| Touch target size / spacing | Y 48dp, adjustable [2] | Y 44dp + 24dp spacing [26] | Y 48dp or 24dp + spacing [49] | Y 44dp [73] | Y [76] | ? |
| Text and image contrast | Y, default 3.0 adjustable [2] | Y 4.5/3.0 [26] | Y [45] | N listed [73] | Y [76] | ? |
| Focus / traversal order | P (heuristic) [2] | P (Focusable Text, Inaccessible Action) [26] | P (On Focus) [47] | N | ? | ? |
| Headings | N | N | P (cloud LLM "Meaningful Heading") [45] | N | N | ? |
| Text scaling / resize | P (Text scaling heuristic) [2] | N [26] | Y (XML, Q1 2026) [48] | N | N | ? |
| Orientation lock | N | Y [26] | ? | N | N | ? |
| Keyboard focusability | N | P (Inaccessible Action) [26] | ? | N | N | ? |
| TalkBack announcement capture | N | N | N | N | N | N |
| WebView content | ? | ? | Y [43] | N | N | ? |
| Compose support | P (ATF gaps) [9] | Y [25] | Y | Y (rules derived from Compose) [73] | "coming soon" [76] | ? |
| WCAG mapping per issue | N [2] | Y [26] | Y + 508 + EN 301 549 [45] | Y [73] | Claims, not per-issue [77] | Y (claims) [79] |
| Export formats | Screenshots + text share [1] | JSON zip via web [33] | HTML, JSON, CSV [44] | Shareable report, format unstated [73] | Unstated | Platform |
| History / baselines | N | Dashboard compare [29] | Baselines (SDK), cloud sessions [47][48] | N | N | Finding history [80] |
| Tracker integration | N | N documented for mobile [33] | Jira, Azure DevOps [44] | Attach to Jira manually [74] | N | Jira sync [81] |
| FLAG_SECURE handling | Black screen, other checks continue [1] | No screenshot [30] | ? | ? | ? | ? |
| Min Android | 9 (v230 for 6 to 8) [1] | Unstated | 5.0 SDK [45] | 8 [74] | Unstated | ? |
| Last update | 15 Apr 2026 [4] | 9 Oct 2026 [38] | 20 Aug 2026 (companion) [51] | 2 Jun 2026 [75] | 22 Apr 2026 [76] | Sep 2026 brochure [80] |
| Store rating | 4.0 / 15K [4] | 2.8 / 12 [38] | none [51] | none [75] | none [76] | n/a |

### E2. Desktop, cloud and developer tooling

| Capability | Accessibility Insights for Android | BrowserStack App A11y | LambdaTest / TestMu AI | Play pre-launch report | Compose UI Check + Espresso ATF |
|---|---|---|---|---|---|
| Status | Retired 1 Jun 2023 [56] | Active, GA Sep 2024 [60] | Active [68] | Active [18] | Active [14][16] |
| Price | Was free | Unpublished for mobile [65] | $159/mo annual, 750 scans [68] | Free with Play Console [19] | Free |
| Needs source or build | No (installed app) | Upload APK or store build [60] | Upload build [68] | Upload to track [19] | Yes |
| Real device | Yes via ADB [58] | Cloud real devices [59] | Cloud real devices [68] | Cloud devices [19] | Emulator or device |
| Rule count (Android) | 10 axe-android + ATF [42][55] | 37 [61] | 18 base + 34 shared [68] | 4 ATF categories [18] | 14 ATF checks [8] |
| Headings / orientation / keyboard | N / N / tab-stop helper [58] | Y / Y / Y [61] | Structure / Y / focus order [68] | N | N |
| TalkBack with text transcript | N | Audio only [63] | Audio [69] | N | N |
| WCAG mapping | Y (axe) [42] | Y [61] | Y [68] | N | N |
| Exports | ? | CSV, dashboard [64] | PDF, CSV [68] | Console only | Test logs |
| History / trends | N | Build trends [59] | Reports [68] | Per release | CI |

---

## Part F. Gaps nobody fills on-device, ranked by auditor value

Ranking weighs (1) how often the gap appears in auditor complaints and monitoring data, (2) whether any on-device product covers it, and (3) whether it is technically feasible from an AccessibilityService without the app's source.

1. **Showing what TalkBack will announce, as text, per element, with the traversal order, without listening.** No on-device auditor does this; the only routes are TalkBack's "Display speech output" toast and TreeDebug logcat dumps [11][20][21], or a desktop inspector [98]. Evidence of demand: students wanted "Scanner results and TalkBack output integrated" [24]; developers write whole posts on "Seeing what TalkBack sees" [21][121]; Kobiton lists announced names, roles and states, silent state changes and modal focus as what automation misses [72]; BrowserStack and Sauce stream audio only [63][41]. The ScreenAudit study found Scanner at 26.2% on label quality and 20.4% on structure and grouping, the categories a speech transcript exposes [24]. Feasible: AccessibilityService can read node text, contentDescription, role, state and traversal links. Caveat: exact TalkBack phrasing is TalkBack's business; a close approximation plus the raw node fields is still far more than exists.

2. **Structural checks that WCAG auditors actually report: headings, orientation lock, keyboard reachability, text resize.** GDS's 2022 to 2024 monitoring of 21 public-sector apps found 4.1.2 Name Role Value (19.2%), 1.3.1 Info and Relationships (14.7%), 1.4.3 Contrast (13.6%), 2.1.1 Keyboard (10.6%) and 1.4.4 Resize Text (6.0%) as the top failures, with keyboard and orientation issues "least likely to be fixed" and whole-app failures when text does not scale [110]. On-device coverage today: Scanner has no heading, orientation or keyboard check and only a layout heuristic for text scaling [2]; Deque has orientation but no heading or resize rule on Android [26]; Siteimprove and A11yInspect have neither [73][76]. Only cloud tools (BrowserStack's 37 rules, TestMu) cover these [61][68]. Heading role, isFocusable, isScreenReaderFocusable, orientation of the activity and font-scale state are all readable from the node tree or system settings.

3. **WCAG-mapped, shareable structured reports from a free on-device tool.** The single most up-voted Scanner complaints are export and sharing: screenshots plus txt that non-technical colleagues cannot read, no whole-report share in some versions, a JSON ask from 2019 [4]. Scanner has no WCAG mapping at all [2]; A11yInspect lists standards but not per-issue mapping [77]; Deque and Siteimprove map issues but gate them behind accounts [26][75]. GDS's own methodology tests apps against the full WCAG A and AA list [110], so an auditor needs criterion references in the output. HTML, CSV and JSON on the device (Evinced does this from the desktop [44]) would be unique on-device.

4. **Scan history, re-test diffs and baselines on the device.** Scanner stores scans but cannot compare them [1]; Deque compares scores in the web dashboard [29]; Evinced baselines live in the SDK [47]. Retests are a billable, repeated part of audit work (one provider charges 50% of the audit fee for retests [106]), and GDS tracked 743 of 880 app issues to resolution [110]. Nothing on the phone shows "new since last scan".

5. **Compose-first coverage.** ATF, which Scanner, Espresso and the pre-launch report all depend on, has open Compose issues from 2021 to June 2026 [9]; Deque's Touch Target Spacing does not run on Compose sliders [30]; A11yInspect says Compose is "coming soon" [76]; Developer Assistant has "limited support" [91]. Compose is Google's default UI toolkit, so an auditor tool that reads Compose semantics correctly (merged nodes, roles, custom actions) fills a visible hole.

6. **Capture of dynamic events: announcements, live regions, focus changes, dialogs.** Kobiton calls unannounced success banners "a common and damaging defect" and lists modal dismissal and focus return [72]; the ScreenAudit "Functionality" category (2.1.1, 3.2.1, 3.2.2, 4.1.3) is where both Scanner (16.7%) and the LLM approach were weakest [24]. An AccessibilityService receives TYPE_ANNOUNCEMENT, window-state and focus events; nobody records them into an audit trail on the device. (Deque's own known issues show how modals confuse static scans [30].)

7. **Colour sampling from the live screen of another app.** Scanner reports contrast but auditors still carry the Colour Contrast Analyser on desktop (GDS lists it as a mobile tool [110]); the only Play contrast app found is a manual picker that explicitly lacks an eyedropper [90]; CVD simulators work on the camera, not the UI [88][89]. A screen-capture eyedropper with WCAG ratios, plus a CVD filter over the captured UI, has no on-device equivalent (Compose UI Check does CVD preview only inside Android Studio [11]).

8. **Thresholds and profiles an auditor can set per standard.** Scanner lets you move three numbers [2]; cloud tools let you pick WCAG 2.1 or 2.2 and A/AA/AAA [62][68]; nothing on-device lets an auditor choose "WCAG 2.2 AA" or "EN 301 549" and have the rule set, 24dp target spacing (2.5.8) versus 48dp platform guidance, and report headings follow. Evinced's tappable-area doc shows the two target-size regimes auditors argue about [49].

9. **Reliability of the overlay itself.** Reviews of both Scanner and the Deque analyzer describe a disappearing button, crashes requiring reinstall, phone soft-locks, and a FAB that TalkBack cannot focus [4][38][30]. An auditor tool that is itself TalkBack-accessible and survives apps that hide overlays (Deque documents setHideOverlayWindows as a blocker [30]) is a differentiator, and also a credibility test: a Scanner reviewer who is blind rated it down because "a blind person can't use your accessibility scanner" [4].

10. **Scanning scrolled-off and multi-window content.** Scanner's 2.5 notes say scans "now include additional application windows" [5], and Evinced added full-page crawling because viewport scans "can miss bugs at the end of a long page" [47]; Deque warns about partially off-screen scroll items [30]. On-device full-page capture is not offered by any phone app.

Lower-ranked but noted: WebView content auditing on device (Evinced claims it from the desktop [43]); language-of-report controls (the Dutch report complaint [4]); offline operation with no data leaving the device (a trust point Scanner, A11yInspect and Chromatic Vision Simulator all advertise [3][76][88]).

---

## Part G. Market notes

**Who buys mobile audits.** Regulated buyers dominate. In the EU the Accessibility Act applies to smartphones, banking services, e-commerce, e-books and passenger transport services [113]; secondary sources agree native apps delivering those services are in scope from 28 June 2025 and are assessed via EN 301 549 [114] (primary directive text not fetched here; the date and app wording are therefore from secondary sources). In the UK, public-sector mobile apps have had to comply since 23 June 2021 [111], and GDS monitored 21 apps between 2022 and 2024, finding 13 to 76 issues per app and none compliant at first test [110]. In the US, the DOJ Title II rule covers "mobile apps that a state or local government provides or makes available" at WCAG 2.1 AA, with deadlines now 26 April 2027 (population 50,000+) and 26 April 2028 (smaller entities) after the 20 April 2026 extension [112][126]. Vendors name banks as anchor customers: Deque's fact sheet opens with "the world's largest banks, software companies, and retailers" [37]; Evinced says its software is used by financial institutions with $26 trillion in assets [52]. Litigation is a weaker driver for apps than for websites: UsableNet counted 5,114 ADA digital lawsuits in 2025 [115], but its historical breakdown put mobile apps at about 4% (2021) and under 1% (2022) of filings, typically as a second suit after the website [116].

**Price norms.** Audit services: Accessible.org quotes $75 to $125 per iOS screen with Android as a 30% add-on and WCAG 2.2 AA at plus 10% [106][107]; comparison sites put DigitalA11Y at $150 to $250 per mobile screen and whole-app audits at $12,000 to $25,000 [108][109]; retests at 50% of the audit fee [106]. Tools: Google Scanner free; A11yInspect free; Deque Pro $45 per user per month for web with mobile as an unpriced add-on (search-indexed plans page, unverified) [36]; TestMu AI $159 per month for 750 scans [68]; BrowserStack web accessibility monitoring $1,099 per month with mobile unpriced [65]; Evinced, Level Access and Siteimprove sales-led [53][80][75]. There is a visible hole between "free but shallow" and "enterprise contract".

**What auditors say is missing.** The repeated themes across reviews, monitoring reports and research: results you can hand to a designer or client (export, WCAG references) [4]; what the screen reader actually says and in what order [21][24][72]; checks for keyboard, orientation and text resize that drive the hardest-to-fix findings [110]; tools that are themselves accessible [4]; and fewer false positives on duplicates, traversal order and hidden views [4][30][34]. GDS marks reflow and text spacing as "Limited" to test on mobile at all [110], and estimates automated checkers find roughly 30 to 40% of issues [110], which matches the ScreenAudit measurement of Scanner's 31.3% recall [24].

**Competitive read for "Build with Accessibility".** The free on-device slot has two occupants: Google Scanner (huge install base, stagnant feature set, four categories, no WCAG) and the new A11yInspect (100+ installs, no Compose, no published rule list). Everyone with WCAG mapping, headings, orientation, keyboard and exports is cloud or desktop and sells to enterprises. A free or low-cost on-device app that (1) prints the TalkBack-equivalent transcript and traversal order, (2) adds heading, orientation, keyboard and resize checks, (3) maps every finding to WCAG 2.2 and EN 301 549 with HTML/CSV/JSON export, (4) keeps per-app history with diffs, and (5) is itself accessible, would be alone in its category. The main technical risks are those Deque documents: apps that hide overlays, FLAG_SECURE screens, modals, and Compose semantics [30].

---

## Sources

1. Google, Get started with Accessibility Scanner. https://support.google.com/accessibility/android/answer/6376570
2. Google, Accessibility Scanner results. https://support.google.com/accessibility/android/answer/6376559
3. Google, Accessibility Scanner help. https://support.google.com/accessibility/android/faq/6376582
4. Google Play, Accessibility Scanner listing and reviews (viewed 30 Oct 2026). https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor
5. APKMirror, Accessibility Scanner version history. https://www.apkmirror.com/apk/google-inc/accessibility-scanner/
6. AppGoblin, Accessibility Scanner. https://appgoblin.info/apps/com.google.android.apps.accessibility.auditor
7. Google, Accessibility Test Framework for Android (GitHub). https://github.com/google/Accessibility-Test-Framework-for-Android
8. ATF check classes directory. https://github.com/google/Accessibility-Test-Framework-for-Android/tree/master/src/main/java/com/google/android/apps/common/testing/accessibility/framework/checks
9. ATF open issues. https://github.com/google/Accessibility-Test-Framework-for-Android/issues
10. ATF maven-metadata on Google Maven. https://dl.google.com/dl/android/maven2/com/google/android/apps/common/testing/accessibility/framework/accessibility-test-framework/maven-metadata.xml
11. Android Developers, Test your app's accessibility. https://developer.android.com/guide/topics/ui/accessibility/testing
12. Android Developers, Compose accessibility: inspect and debug. https://developer.android.com/develop/ui/compose/accessibility/inspect-debug
13. Android Developers, Debug your Compose UI. https://developer.android.com/develop/ui/compose/tooling/debug
14. Android Studio Iguana release notes (Compose UI Check). https://developer.android.com/studio/releases/past-releases/as-iguana-release-notes
15. Android Studio preview release notes (Fix with AI). https://developer.android.com/studio/preview/features
16. Android Developers, Accessibility checking with Espresso. https://developer.android.com/training/testing/espresso/accessibility-checking
17. Android Lint check categories (Accessibility). https://googlesamples.github.io/android-custom-lint-rules/checks/categories.md.html
18. Google Play Console help, Understand your pre-launch report (Accessibility). https://support.google.com/googleplay/android-developer/answer/9844487
19. Google Play Console help, Pre-launch report overview. https://support.google.com/googleplay/android-developer/answer/9842757
20. Google, Learn about TalkBack settings. https://support.google.com/accessibility/android/answer/6006589
21. DEV Community, Seeing what TalkBack sees. https://dev.to/zmdominguez/seeing-what-talkback-sees-2180
22. Mozilla Bugzilla 1832562 (Scanner skips reader-view pop-up). https://bugzilla.mozilla.org/show_bug.cgi?id=1832562
23. Mozilla Bugzilla 1993026 (Scanner flags Back button). https://bugzilla.mozilla.org/show_bug.cgi?id=1993026
24. ScreenAudit (CHI 2025), arXiv 2504.02110. https://arxiv.org/html/2504.02110v1
25. Deque, Axe DevTools for Mobile product page. https://www.deque.com/axe/devtools/mobile-accessibility/
26. Deque docs, Rule overview for Android (2025.7.2). https://docs.deque.com/devtools-mobile/2025.7.2/en/android-rules
27. Deque docs, Install Axe Accessibility Analyzer (Android). https://docs.deque.com/devtools-mobile/2025.7.2/en/android-setup
28. Deque docs, Test Android apps for accessibility. https://docs.deque.com/devtools-mobile/2025.7.2/en/android-analyzer-test
29. Deque docs, View and manage results (Android). https://docs.deque.com/devtools-mobile/2025.7.2/en/android-view-results
30. Deque docs, Known issues. https://docs.deque.com/devtools-mobile/2025.7.2/en/known-issues
31. Deque docs, April 22 2026 release notes. https://docs.deque.com/devtools-mobile/2025.7.2/en/april-2026-2/
32. Deque docs, December 13 2023 release notes (embedded FAB removed). https://docs.deque.com/devtools-mobile/2025.7.2/en/december-2023
33. Deque docs, Export Mobile JSON from Axe Developer Hub. https://docs.deque.com/developer-hub/2/en/dh-mobile-export
34. Deque docs, Accessibility Scanner remediation. https://docs.deque.com/devtools-mobile/2025.7.2/en/android-accessibility-scanner/
35. Deque, axe DevTools pricing. https://www.deque.com/axe/devtools/pricing/
36. Deque, axe DevTools plans and pricing (search-indexed; add-on wording unverified). https://deque.com/?p=37102
37. Deque, Axe DevTools for Mobile fact sheet (PDF). https://accessibility.deque.com/hubfs/Fact%20Sheets/axe-DevTools-for-Mobile.pdf
38. Google Play, axe Accessibility Analyzer listing and reviews. https://play.google.com/store/apps/details?id=com.deque.mobile.devtools.axedevtoolsanalyzer
39. AppGoblin, axe Accessibility Analyzer. https://appgoblin.info/apps/com.deque.mobile.devtools.axedevtoolsanalyzer
40. Sauce Labs docs, Accessibility testing with Deque axe DevTools Mobile drivers. https://docs.saucelabs.com/mobile-apps/automated-testing/appium/appium-deque-accessibility-testing/
41. Sauce Labs docs, Accessibility testing (live). https://docs.saucelabs.com/mobile-apps/features/accessibility-testing/
42. Deque, axe-android (archived). https://github.com/dequelabs/axe-android
43. Evinced, Mobile Flow Analyzer. https://www.evinced.com/products/flow-analyzer-for-mobile
44. Evinced, MFA user guide: overview and setup. https://www.evinced.com/products/flow-analyzer-for-mobile/product-documentation/overview-and-setup
45. Evinced, Espresso / UIAutomator SDK. https://developer.evinced.com/sdks-for-mobile-apps/espresso-sdk
46. Evinced, Android Mobile Kit. https://developer.evinced.com/sdks-for-mobile-apps/android-mobile-kit-doc
47. Evinced, 2025-Q3 product updates. https://www.evinced.com/blog/2025-q3-new-product-and-feature-updates/
48. Evinced, 2026-Q1 product updates. https://www.evinced.com/blog/2026-q1-new-product-and-feature-updates
49. Evinced knowledge base, Tappable area. https://knowledge.evinced.com/mobile-validations/tappable-area
50. Evinced knowledge base, Colliding controls. https://knowledge.evinced.com/mobile-validations/colliding-controls
51. Google Play, Evinced Mobile Flow Analyzer companion app. https://play.google.com/store/apps/details?id=com.evinced.scan
52. Insight Partners, Evinced secures $55M Series C. https://www.insightpartners.com/ideas/evinced-secures-55m-series-c-to-drive-global-lead-in-ai-driven-digital-accessibility/
53. Gartner Peer Insights, Evinced. https://www.gartner.com/reviews/product/evinced
54. Accessibility Insights FAQ. https://accessibilityinsights.io/docs/general/faq/
55. Microsoft, accessibility-insights-for-android-service (archived). https://github.com/microsoft/accessibility-insights-for-android-service
56. Microsoft, Accessibility Insights for Android deprecation notice (issue 6744). https://github.com/microsoft/accessibility-insights-web/issues/6744
57. Microsoft Open Source blog, Accessibility Insights for Android is here. https://opensource.microsoft.com/blog/?p=79443
58. Classmethod, Accessibility Insights on Android (July 2021). https://dev.classmethod.jp/articles/android-accessibilityinsights/
59. BrowserStack, App Accessibility Testing. https://www.browserstack.com/app-accessibility-testing
60. BrowserStack release notes, App Accessibility Testing GA. https://www.browserstack.com/release-notes/en/app-accessibility-testing-is-now-generally-available-u7Ows3Fk
61. BrowserStack docs, App Accessibility rules overview. https://www.browserstack.com/docs/app-accessibility/rule-repository/rules-overview
62. BrowserStack docs, Workflow Analyzer configuration. https://www.browserstack.com/docs/app-accessibility/manual-tests/using-workflow-analyzer/configure-settings
63. BrowserStack docs, TalkBack screen reader testing. https://www.browserstack.com/docs/app-accessibility/screen-reader-testing/talkback
64. BrowserStack release notes, CSV export for app accessibility reports. https://www.browserstack.com/release-notes/en/new-feature-csv-export-for-app-accessibility-reports
65. BrowserStack pricing. https://www.browserstack.com/pricing?product=app-accessibility-testing
66. G2 review of BrowserStack (cost). https://g2.com/products/browserstack/reviews/browserstack-review-8180983
67. SoftwareOne marketplace, BrowserStack App Accessibility Testing. https://platform.softwareone.com/product/app-accessibility-testing/PCP-2231-8766
68. TestMu AI (LambdaTest), Native app accessibility scanner. https://www.testmuai.com/app-accessibility-testing/native-app-accessibility-scanner/
69. GlobeNewswire, LambdaTest launches screen reader for Android (Oct 2024). https://www.globenewswire.com/de/news-release/2024/10/10/2961474/0/en/LambdaTest-Launches-Screen-Reader-for-Enhanced-Accessibility-Testing-on-Android-Devices.html
70. Perfecto help, Test accessibility with VoiceOver or TalkBack. https://help.perfecto.io/perfecto-help/content/Perfecto/manual-testing/test-accessibility.htm
71. Perfecto, Accessibility testing. https://www.perfecto.io/accessibility-testing
72. Kobiton, What automated mobile accessibility testing misses. https://kobiton.com/mobile-testing-guide/mobile-accessibility-testing/mobile-accessibility-testing-automation-misses/
73. Siteimprove help, Mobile Accessibility Testing. https://siteimprove.freshdesk.com/support/solutions/articles/80001178549-mobile-accessibility-testing
74. Siteimprove help, Android configuration and usage. https://help.siteimprove.com/support/solutions/articles/80001178550-android-mobile-accessibility-testing-configuration-and-usage
75. Google Play, Siteimprove Mobile A11y. https://play.google.com/store/apps/details?id=com.siteimprove.mobile.a11y
76. Google Play, A11yInspect Accessibility Tool. https://play.google.com/store/apps/details?id=com.barrierbreak.A11yInspect
77. Product Hunt, A11yInspect for Android. https://www.producthunt.com/p/a11yinspect-for-android
78. BarrierBreak, Accessibility products. https://www.barrierbreak.com/accessibility-products/
79. Level Access, Mobile testing. https://www.levelaccess.com/mobile-testing/
80. Level Access, Mobile Testing Suite v2 (PDF, Sept 2026). https://www.levelaccess.com/wp-content/uploads/2026/10/The-Level-Access-Mobile-Testing-Suite_v2.pdf
81. Level Access, Winter '24 release recap. https://www.levelaccess.com/blog/mobile-testing-enhanced-reporting-and-more-winter-24-release-recap/
82. Level Access, Spring '25 release recap. https://www.levelaccess.com/blog/test-smarter-deliver-better-spring-25-release-recap/
83. Stark, Introducing native mobile code integrations. https://www.getstark.co/blog/introducing-native-mobile/
84. Stark support, Using the Android integration. https://www.getstark.co/support/getting-started/using-the-android-integration/
85. UserWay, Accessibility audit. https://userway.org/audit/
86. Allyant, Digital agency partner program (mobile frameworks). https://allyant.com/?p=92563
87. TPGi, Accessibility testing tools. https://www.tpgi.com/accessibility-testing-tool
88. Google Play, Chromatic Vision Simulator. https://play.google.com/store/apps/details?id=asada0.android.cvsimulator
89. Google Play, Color Blind Pal. https://play.google.com/store/apps/details?id=com.colorblindpal.colorblindpal
90. Google Play, WCAG Contrast Checker (99ersstudio). https://play.google.com/store/apps/details?id=com.ninetyniners.contrast_checker
91. Google Play, Developer Assistant. https://play.google.com/store/apps/details?id=com.appsisle.developerassistant
92. Google Play, Appt - App accessibility. https://play.google.com/store/apps/details?id=nl.appt
93. Google Play, ScreenReader - Learn TalkBack. https://play.google.com/store/apps/details?id=app.screenreader
94. Google Play, Voice Access. https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.voiceaccess
95. Google Play, Switch Access. https://play.google.com/store/apps/details?id=com.google.android.accessibility.switchaccess
96. Google Play, ADAShield Pro - WCAG Scanner. https://play.google.com/store/apps/details?id=org.elev8ai.adashield
97. Google Play, Accessibility Support Tool (East-Hino). https://play.google.com/store/apps/details?id=net.east_hino.accessibility_shortcut
98. jwlilly, Android Accessibility Inspector App. https://github.com/jwlilly/Android-Accessibility-Inspector-App
99. jwlilly, releases. https://github.com/jwlilly/Android-Accessibility-Inspector-App/releases
100. mohdaquib, ComposeA11yScanner. https://github.com/mohdaquib/ComposeA11yScanner
101. ComposeA11yScanner releases. https://github.com/mohdaquib/ComposeA11yScanner/releases
102. AALT-Framework, android-accessibility-test-kit. https://github.com/AALT-Framework/android-accessibility-test-kit
103. Quittle, a11y-ally. https://github.com/Quittle/a11y-ally
104. a11y-ally commit history. https://github.com/Quittle/a11y-ally/commits/master
105. ateymoori, Oh My Android releases. https://github.com/ateymoori/oh-my-android/releases
106. Accessible.org, How much does a digital accessibility audit cost. https://accessible.org/how-much-digital-accessibility-audit-cost/
107. Accessible.org (Medium), Mobile app accessibility audits: top 10 FAQ. https://adabook.medium.com/mobile-app-accessibility-audits-top-10-faq-for-clients-c1ef298abaaa
108. Half Accessible, Accessibility audit cost 2026. https://halfaccessible.com/accessibility-audit-cost/
109. The Front Kit, Accessibility audit cost 2026. https://thefrontkit.com/blogs/accessibility-audit-cost-2026
110. GOV.UK, Accessibility monitoring of public sector websites and mobile apps 2022 to 2024. https://www.gov.uk/government/publications/accessibility-monitoring-of-public-sector-websites-and-mobile-apps-from-2022-to-2024/accessibility-monitoring-of-public-sector-websites-and-mobile-apps-from-2022-to-2024
111. DWP Accessibility Manual, The Public Sector Bodies Accessibility Regulations 2018. https://accessibility-manual.dwp.gov.uk/accessibility-law/the-public-sector-bodies-accessibility-regulations-2018
112. ADA.gov, Fact sheet: new rule on web and mobile app accessibility (Title II). https://www.ada.gov/resources/2024-03-08-web-rule/
113. European Commission, European Accessibility Act. https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en
114. SOTA, EAA mobile app accessibility 2026 developer checklist (secondary source). https://sota.io/blog/eaa-mobile-app-accessibility-ios-android-pwa-developer-checklist-2026
115. UsableNet, 2025 year-end digital accessibility lawsuit report (plain text). https://info.usablenet.com/2025-year-end-digital-accessibility-lawsuit-report-plain-text
116. UsableNet, Five years of ADA web and app lawsuits. https://blog.usablenet.com/five-years-of-ada-web-and-app-lawsuits-key-observations-and-trends
117. Accessibility Insights for Android releases page (retirement notice). https://accessibilityinsights.io/docs/android/reference/releases
118. BOIA, Testing Android app accessibility with Google's Accessibility Scanner. https://www.boia.org/blog/testing-android-app-accessibility-with-googles-accessibility-scanner
119. Vendr, Deque pricing (third-party estimate). https://www.vendr.com/marketplace/deque
120. SourceForge, axe DevTools (third-party price). https://sourceforge.net/software/product/axe-DevTools/
121. Medium (Google Developer Experts), Seeing what TalkBack sees. https://medium.com/google-developer-experts/seeing-what-talkback-sees-181b3dfa95e8
122. APKMirror, Developer Assistant 1.4.2 release notes. https://www.apkmirror.com/?p=11571734
123. ICST 2022, Automated detection of TalkBack interactive accessibility failures (Alotaibi et al.). https://icst2022.vrain.upv.es/details/icst-2022-papers/23/Automated-Detection-of-TalkBack-Interactive-Accessibility-Failures-in-Android-Applica
124. JD Supra, DOJ extends Title II ADA web accessibility rule compliance deadlines. https://www.jdsupra.com/legalnews/doj-extends-title-ii-ada-web-2176958/
125. (see 123)
126. (see 124)
127. Deque blog, Sauce Labs and Deque Systems join forces. https://www.deque.com/blog/sauce-labs-and-deque-systems-join-forces-to-help-enterprises-ensure-digital-accessibility/
128. Deque docs, Axe DevTools Mobile Analyzers overview (cloud platforms list). https://docs.deque.com/devtools-mobile/2025.7.2/en/mobile-analyzer

Unverified items, collected: Deque mobile add-on price; Evinced pricing tiers; whether Level Access On-Device Testing ships as a Play app; the exact EAA directive wording on mobile applications and its 28 June 2025 application date (secondary sources only); Accessibility Insights for Android HTML report export; ComposeA11yScanner release year; AppGoblin install counts where they exceed the Play tier; Google Scanner WebView coverage.
