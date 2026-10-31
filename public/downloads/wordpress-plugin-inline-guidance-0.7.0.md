# Inline issue inspection and repair guidance — 0.7.0

This release adds an admin workflow for acting on a recorded finding. All processing remains local, with no accounts, paid features, telemetry or remote repair service. It does not establish accessibility conformance.

## How it works

Open a finding in **Issues** and follow its **Repair guide**. Locate the affected element, identify its owning source, make a focused change, then save, rescan and perform the relevant manual tests. Existing native Gutenberg repair actions still use their guarded save, recheck and undo paths. The guide can open Manual checks with the finding's page already selected.

**Locate element** creates a user-bound five-minute inspection session. The server requires administrator access, permission to edit the page, the latest completed scan and unchanged tracked source/site state, both when issuing the session and when loading the diagnostic. The browser matches a unique top-level selector against normalized recorded HTML. Normalization ignores diagnostic markers, attribute order and filled input/textarea values; it does not ignore substantive content changes. Recorded HTML is parsed in an inert template and never inserted into the visible page. Inline configuration escapes HTML-significant characters.

The outline is drawn outside page content and follows layout/scroll changes. The original scan's desktop/mobile viewport is preserved and visually scaled to fit the admin dialog. The preview is inert to pointer and keyboard interaction, and its frame cannot submit native forms or open new windows. It still loads the page's own scripts; it is not a network-isolated website execution environment. Admin buttons provide reload and centering, and text status communicates the match to users who do not see the outline. Returning from an editor rechecks server freshness.

The preview never saves a repair, submits a form, places an order, stores a new scan or resolves a finding. Normal visitor requests receive no highlighter script. Authenticated diagnostic pages opt out of supported cache/optimization paths and send no-cache headers.

## Source guidance

| Context | What the guide provides | Edit boundary |
| --- | --- | --- |
| Gutenberg | Mapped image/link/heading/label actions where supported; otherwise List View and owning block/template guidance | Existing native allowlists and source guards remain authoritative |
| Elementor | Structure/Navigator guidance and an editor link for a detected editable Elementor document | Builder or template owns the source; no generated HTML rewriting |
| WooCommerce product | Product-editor handoff and contextual image/content guidance | Edit product content or the owning template/extension |
| WooCommerce checkout | Field-label, populated-cart, validation/recovery and test-payment guidance | Generated checkout fields stay with WooCommerce/its extension; no automatic order or submission |
| Contact Form 7 | Form-editor link, Form tab and visible label/form-tag association guidance | CF7 edit capability and existing form ID required for a direct link |
| WPForms Lite | Builder link, Field Options, Label, Hide Label and choice/sublabel guidance | WPForms edit_forms capability and existing form ID required for a direct link |

Context detected from the rendered element is a clue, not proof of shared ownership. Embedded forms take precedence over surrounding builder/store containers. Users can select another guide without receiving edit privileges. Source links open a new tab and do not perform a save.

Rule-specific instructions cover image alternatives, heading structure, link/button names, form labels, contrast and frame titles. Other rules retain the original explanation, a conservative source-editing workflow and the external rule reference. Instructions do not invent image meanings or assume an editorial prompt is a WCAG failure. Manual undo outside the plugin belongs to the tool where the change was made.

The terminology was checked against the installed free plugins and primary documentation, including [Elementor Structure](https://elementor.com/help/navigator/) and [WPForms field options](https://wpforms.com/docs/how-to-customize-form-field-options/). Interfaces can vary by version; use the actual owning editor.

## Explicit limits

- Only uniquely matched top-level elements are highlighted in 0.7.0. Embedded frame/shadow-root findings retain their recorded evidence and manual guidance.
- Missing, ambiguous, hidden, changed, oversized/truncated or invalid evidence gives an explanation. No substitute element is highlighted.
- A live DOM change that invalidates the match removes the outline. Navigation away from a confirmed preview clears its match and asks for a fresh inspection. A blocked frame or missing theme hook times out with a recoverable message. Expired sessions require a new inspection.
- The initial page state may differ by login, cart, menu, form or responsive state. Recreate the intended state on staging and rescan. A normal page-load scan and visual preview do not exercise complete journeys.
- Human keyboard/screen-reader testing, additional hosts, custom builders, localization and actual production content remain necessary. Playwright WebKit is engine coverage, not a new native Safari test.

## Reproducible local validation

Use the repository's disposable MariaDB/WordPress HTTP lab on `127.0.0.1:9421`. Do not target a live site. The 0.6.0 benchmark snapshot supplies common Gutenberg, Elementor and product markup plus CF7/WPForms fixtures. Restore its static image/frame files and mail interceptor, install the pinned free journey plugins, and install the exact 0.7.0 development ZIP. Copy `dev/inline/support.php` only into this local lab's mu-plugins; it deliberately adds an unnamed reference input to classic checkout.

`tests/inline-guidance.spec.mjs` covers real native scans, outline geometry, keyboard controls/focus, manual-test handoff, source preservation, stale/latest-scan/actor/permission guards, invalid/missing/ambiguous/hidden/nested/truncated evidence, dynamic changes, forged messages, blocked-frame recovery and a mobile viewport. `dev/inline/helpers.mjs` uses the actual production viewport from the scan ticket. The older benchmark adapter's 1200px frame was not used for these new tests.

`dev/inline/integration.spec.mjs` repeats real scan → open finding → locate → verify outline geometry → check guidance → open permitted editor on Gutenberg, Elementor, WooCommerce product and populated checkout, CF7 and WPForms Lite. It checks source preservation and runs scoped axe checks over the admin dialog. These tests inspect the handoff; they do not claim to perform every repair in each third-party editor or evaluate its complete accessibility.

Run suites sequentially because they share the disposable database:

```sh
BWA_TEST_URL=http://127.0.0.1:9421 npx playwright test tests/inline-guidance.spec.mjs
npx playwright test -c dev/inline/playwright.config.mjs
```

Repeat with `BWA_BROWSER=firefox` and `BWA_BROWSER=webkit`. The full core regression suite runs after resetting to the separate native-content fixture. Install the final directory ZIP only after browser tests, then run official Plugin Check with its runtime bootstrap. Detailed final counts, exact archive hashes and limitations are in [VALIDATION.md](VALIDATION.md). Raw logs, screenshots and evidence are in ignored `artifacts/inline-0.7/`.
