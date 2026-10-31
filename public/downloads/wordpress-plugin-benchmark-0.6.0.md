# Free WordPress accessibility plugin benchmark — 30 October 2026

This is a small, reproducible local comparison of official free releases on deliberately seeded pages. It is **not an overall ranking, a complete WCAG evaluation, a production performance test, or proof that any plugin is best**. It found useful strengths in other free tools and informed two changes in Build with Accessibility 0.6.0.

## What we actually ran

| Plugin | Installed release | Measured approach |
| --- | --- | --- |
| Build with Accessibility | Frozen 0.5.4; then 0.6.0 | Actual authorized browser scan API, bundled axe-core 4.14.0 and saved local reports |
| [Equalize Digital Accessibility Checker](https://wordpress.org/plugins/accessibility-checker/) | 1.51.1 | Native editor scans; captured the plugin's own scan-result submissions |
| [Sa11y](https://wordpress.org/plugins/sa11y/) | 1.2.9 | Native frontend checker and its completed result collection |
| [Editoria11y](https://wordpress.org/plugins/editoria11y-accessibility-checker/) | 3.0.8 | Native free frontend content-checker results; default content scope |
| [WeAreDev Accessibility Assessment](https://wordpress.org/plugins/wearedev-accessibility-assessment/) | 1.0.0 | Native custom-URL batch scan through its admin UI; all six pages completed |
| [Web200 Accessibility Audit](https://wordpress.org/plugins/web200-accessibility-audit/) | 1.1.2 | Native admin scan form and stored results; default server-HTML engine |
| [WP Accessibility](https://wordpress.org/plugins/wp-accessibility/) | 2.4.5 | Admin features/fixes/settings and frontend behavior inspected; a different category from a comprehensive scanner |
| [BEARS](https://wordpress.org/plugins/bears-accessibility/) | 1.0.2 | Native Gutenberg sidebar, heading suggestion, Apply and WordPress Undo exercised |
| [Elementor Web Accessibility / Ally](https://wordpress.org/plugins/pojo-accessibility/) | 4.1.4 | Onboarding inspected; no completed local scanner run. External services/account-dependent features were not enabled |

We selected established free plugins plus directly comparable newer monitoring and repair products. This is not every WordPress accessibility plugin. Packages came from official WordPress.org downloads; versions, download URLs, sizes and SHA-256 hashes are pinned in `dev/benchmark/packages.json`. No vendor code was patched, paid feature unlocked, external account created, or replacement scanner injected into a competing product.

The local lab used WordPress 7.1.4, PHP 8.4.27 with a 512 MB memory limit, MariaDB 11.4.13, Storefront 4.6.2, Chrome 156 and the same Elementor, WooCommerce, Contact Form 7 and WPForms Lite base installation. Each accessibility plugin started from the same database snapshot with other accessibility plugins deactivated. The outer browser was 1440 × 1100. Native scanner frames can use different sizes; the Build with Accessibility API adapter used a 1200 × 900 diagnostic frame for both before/after runs. These fixtures have fixed styles and no responsive variants of the scored seeds. This does not compare responsive coverage or speed.

The fixture contains:

- Identical seeded markup in a Gutenberg Custom HTML block, a real Elementor HTML widget, and a WooCommerce product description, plus extra native Gutenberg blocks for repair checks.
- Eight structural seeds: absent image alternative, unnamed link, unnamed button, unnamed text input, unnamed select, explicit low contrast, unnamed iframe and a shared unnamed footer link.
- Three separate editorial review seeds: filename-like alt text, generic link wording and skipped heading hierarchy. These are review signals, not automatic conclusions about WCAG conformance.
- Four valid controls on each of the three content pages: a declared decorative image, properly labelled field, meaningful link and adequately contrasting text.
- A real CF7 form and a real WPForms Lite form, each with one intentionally unnamed optional reference field and correctly labelled required fields.
- Classic WooCommerce checkout with a populated signed-in browser cart. No real payment, purchase or email delivery was performed by this benchmark.

The frame fixture initially used malformed rendered `srcdoc` markup. Preflight discovered that it swallowed later content on Gutenberg. It was replaced by a local frame document **before all reported measurements**. Other harness corrections included sequential plugin activation, a memory-limit adjustment, selectors for native controls and parsing CLI output separately from Elementor deprecation notices. Those setup attempts are not plugin misses or successful measurements.

## Detection on the same content

Numbers below count only the eight named structural seeds on each page, not every issue reported by a plugin. Missing a seed in a narrower product scope is not a judgment about its overall value.

| Free plugin | Gutenberg / 8 | Elementor / 8 | WooCommerce product / 8 | CF7 unnamed reference | WPForms unnamed reference |
| --- | ---: | ---: | ---: | --- | --- |
| Build with Accessibility 0.5.4 | 8 | 8 | 8 | Detected | Detected |
| Build with Accessibility 0.6.0 | 8 | 8 | 8 | Detected | Detected |
| Equalize Digital 1.51.1 | 7 | 7 | Outside free product-type scope | Detected | Detected |
| Sa11y 1.2.9 | 8 | 8 | 8 | Detected | Detected |
| Editoria11y 3.0.8 | 3 | 3 | 3 | Not reported in this default content scope | Not reported in this default content scope |
| WeAreDev 1.0.0 | 8 | 8 | 8 | Detected | Detected |
| Web200 1.1.2 | 7 | 7 | 7 | Detected | Detected |

Equalize Digital did not report the seeded unnamed select in these runs; its dashboard explicitly offered a paid upgrade for product scans, so products were not given a zero. Web200's default server-HTML engine did not report the explicit contrast seed. Its rendered-DOM integration mode was not supplied with a custom external payload. Editoria11y's free content checker reported the missing alternative, empty content link and unnamed frame; its default scope did not include the shared footer or these developer/form/contrast checks.

**None of these six measured scanners flagged the four named valid controls on the three content fixtures.** This is a narrow control observation, not a false-positive rate for real websites. Unrelated theme findings were preserved in raw results and were not automatically labelled false positives.

## Editorial guidance and workflow differences

| Review signal on the common content | BWA 0.5.4 | BWA 0.6.0 | Equalize Digital | Sa11y | Editoria11y | WeAreDev | Web200 default |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Filename-like alternative | No targeted prompt | Review prompt | Reported | Reported | Reported | Not reported | Not reported |
| Generic “click here” link | No targeted prompt | Review prompt | Reported | Reported | Reported | Not reported | Not reported |
| Skipped heading hierarchy | axe best-practice finding | axe best-practice finding | Reported | Reported | Reported | Review finding | Not reported |

A generic link may have adequate purpose in context, and a filename pattern cannot determine an image's meaning. We deliberately did not score these as definite WCAG failures, regardless of the category a vendor uses. Heading hierarchy advice is also kept separate from the eight structural seeds. Build with Accessibility uses the full enabled axe profile here; a narrower WCAG profile has different rule coverage.

WeAreDev's completed admin scan demonstrated grouped findings with occurrence/page counts and likely-source guidance. BEARS detected the native H4, changed it to H2 through its Apply control, and returned it to H4 using WordPress Undo. Its native-block scope does not make it a scanner for Elementor, generated forms or the Custom HTML fixture. WP Accessibility exposed targeted theme fixes and author/admin tools; Storefront's accessibility-ready status disabled some options. It was not assigned a scanner score. Elementor Web Accessibility onboarding did not produce a local scan under this lab's external-request restrictions; that is an **unmeasured service-dependent path**, not a detection failure.

Checkout findings describe the initial populated signed-in browser state for the rendered-page tools. Web200 fetches server HTML without that browser cart session, so its checkout result is not directly comparable. This benchmark does not establish keyboard, screen-reader, validation, payment or confirmation journey quality. Earlier functional journey tests are documented separately in `JOURNEYS.md`; they were not converted into competitor results.

## Gaps addressed in 0.6.0

1. **Targeted content-review prompts.** Authorized scans now flag filename-like alternatives and common generic English link wording. They are stored as `editorial`, displayed separately in Issues and reports, included with an explicit classification in exports, and excluded from axe failure totals and baseline issue counts. Native block mappings can open existing guarded image/link repair flows. The plugin does not invent replacements, infer decoration or edit generated builder/form content.
2. **Repeated-finding groups.** Issues can group matching rule, result category, impact, selector and recorded HTML across filtered latest scans. Every page retains its own freshness, review decision and repair boundary. Finding openers retain keyboard focus after closing a dialog, including after a review decision refresh. The shared empty footer link's six page occurrences form one group; a separate region finding remains a separate group. Matching evidence is a useful clue, not proof that one shared template owns every occurrence. Grouped views over 2,000 matching findings explicitly require narrower filters instead of silently showing a sample.

The after-run preserves detection of all structural seeds and adds both missing editorial signals on Gutenberg, Elementor and the product description. The native Gutenberg extras add further review prompts without being included twice in the common-content comparison.

## Remaining work

Sa11y and Editoria11y still offer richer contextual author guidance and inline inspection. A safe “locate this element” experience for generated content remains valuable. Broader language coverage, more content checks, practical multisite support, role-appropriate workflows and larger-site ergonomics deserve further work. Validation/error/confirmation states need a separate repeatable comparison. Independent testing with disabled users, additional hosts and real production content is still required.

These changes do not establish a universal lead over free alternatives. Our useful combination is local axe scanning, conservative native repairs with recheck and undo, changed-page tracking, baseline comparisons and structured manual-session history/exports, with every feature free.

## Reproduction and evidence

`dev/benchmark/protocol.json` defines the seed/control protocol. `fixture.php`, `support.php`, `setup.mjs`, `lab.mjs`, `collect.mjs`, `workflows.mjs` and `summarize.mjs` reproduce the disposable-lab workflow. Start the repository's MariaDB and compatibility lab, install the pinned official free packages, seed the journey fixtures, then run benchmark setup and snapshot. The lab allows only local requests, uses synthetic accounts and intercepts mail. Do not run these scripts against a live site.

For the frozen baseline, use `node dev/benchmark/install.mjs --version=0.5.4` then `node dev/benchmark/collect.mjs build-with-accessibility 0.5.4`. Repeat with 0.6.0. Each competitor collection restores the snapshot and activates its own installed release. Run the workflow adapter for WP Accessibility, BEARS and Elementor Web Accessibility. Do not run multiple database-mutating adapters in parallel.

Raw results, native workflow screenshots, fixture HTML/hash, initial failed setup logs and machine-readable per-seed classifications remain in the ignored local `artifacts/benchmark/` directory. `results-*.json` and `summary.json` are the measured outputs; `preflight-invalid-fixture-*` and earlier failed harness logs are excluded. Package validation and regression results are recorded in `VALIDATION.md`. No public site was deployed and no directory submission was made.
