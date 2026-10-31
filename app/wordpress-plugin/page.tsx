import Image from "next/image"
import Link from "next/link"
import { ArrowDownToLine, ArrowRight, Check, RotateCcw } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"

export const metadata = createMetadata({
  title: "Free WordPress Accessibility Monitoring Plugin | Accessibility.build",
  description: "Run local accessibility scans, record guided manual testing sessions, track review dates and changes, and export testing history in WordPress. Completely free.",
  path: "/wordpress-plugin",
  keywords: ["WordPress accessibility plugin", "accessibility monitoring", "axe-core", "manual accessibility testing", "Gutenberg accessibility"],
})

const linkStyle = "font-semibold text-blue-700 underline underline-offset-4 hover:decoration-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-blue-300"
const features = [
  ["Check the rendered page", "Run the bundled axe-core engine against saved pages and drafts. Review findings, affected elements, and checks that need human judgment. Choose the full enabled ruleset or the WCAG 2.2 A/AA profile."],
  ["Locate the affected element", "Open a private, read-only page preview from a finding. A purple outline marks the element only when its selector and recorded evidence match. Missing, changed, hidden or ambiguous elements receive an explanation. Normal visitor pages receive no overlay."],
  ["Follow the owning editor", "Four steps connect locating, source identification, repair advice and rechecking. Choose guidance for Gutenberg, Elementor, WooCommerce, Contact Form 7 or WPForms Lite. Supported native repairs stay guarded; generated fields are changed in their own tool."],
  ["Repair the content you own", "Review image alternatives, native heading levels and text, plain-text links, and labels in static Custom HTML forms. Preview each supported change, save it, recheck the rendered result, and undo while the source still matches."],
  ["Compare against a reference", "Choose a scan as the baseline for a page, rule profile, and viewport. Later compatible scans show new, changed, still detected, no-longer-detected, and unverified findings with before/after evidence. A baseline is not an accessibility approval."],
  ["Find pages to recheck", "One admin inbox explains automated rechecks and manual-review tasks. Recorded reviews need attention after tracked changes, when their review date arrives, or while steps are untested, blocked, or have an issue. Automated scans cannot clear manual tasks."],
  ["Follow a manual testing guide", "Eight starter guides provide steps and expected behaviour. Record the page state, browser, assistive technology, observations and an optional review date. Repeat the same review with new outcomes while preserving earlier sessions."],
  ["Review content in context", "Filename-like image alternatives and common generic English links receive targeted review prompts. These are separate from axe failures and baseline counts. Review meaning before changing content; a prompt is not a WCAG determination."],
  ["Group repeated findings", "Bring matching rule, selector and HTML evidence together across pages. Each page keeps its own review decision, freshness and repair boundary. Matching evidence can suggest a shared component, but does not prove ownership."],
  ["Take your testing history with you", "Export every retained manual session for a page as standalone HTML, JSON or CSV, including testing context, guide instructions, observations and earlier notes. Scan reports and repair history remain in the same free admin workspace."],
]
const manualChecks = [
  ["Keyboard and focus", "Complete real tasks without a mouse. Check focus order, visibility, traps, and controls that appear after interaction."],
  ["Screen readers", "Check names, roles, reading order, announcements, and complete journeys using relevant browser and assistive-technology combinations."],
  ["Zoom, reflow, and content", "Review enlarged text, narrow layouts, meaningful alternatives, heading structure, instructions, captions, and information conveyed by color."],
  ["Forms and dynamic states", "Test errors and recovery, grouped fields, menus, dialogs, authentication, and checkout where relevant. Include disabled people in testing real tasks where possible."],
]

export default function WordPressPluginPage() {
  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <BreadcrumbStructuredData breadcrumbs={[
        { name: "Home", url: "https://accessibility.build" },
        { name: "WordPress plugin", url: "https://accessibility.build/wordpress-plugin" },
      ]} />
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide grid gap-12 py-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">Build with Accessibility · WordPress plugin</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Accessibility work continues after launch.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
              Monitor detectable barriers, review content repairs, and keep manual testing records inside WordPress. Completely free, with local processing and no account or API key.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <a href="/downloads/build-with-accessibility-0.7.0.zip" download className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" /> Download development preview
              </a>
              <a href="#testing-scope" className={linkStyle}>Understand the testing scope</a>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">Version 0.7.0 · WordPress 6.6+ · PHP 8.0+<br />Development preview for staging. Not submitted to or approved by WordPress.org.</p>
          </div>
          <aside aria-labelledby="maintenance-title" className="self-start border-l-4 border-teal-700 bg-slate-50 p-6 sm:p-8 dark:border-teal-400 dark:bg-slate-900">
            <p className="flex items-center gap-2 text-sm font-semibold text-teal-800 dark:text-teal-300"><RotateCcw className="h-4 w-4" aria-hidden="true" /> An ongoing practice</p>
            <h2 id="maintenance-title" className="mt-4 text-2xl font-bold">Help maintain an accessible site.</h2>
            <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">If your site has already been evaluated and made accessible, repeat scans after changes can help catch detectable regressions. They cannot guarantee that it stays accessible.</p>
            <ol className="mt-6 space-y-5">
              {[
                ["Establish a baseline", "Evaluate the site with automated and manual testing. Record scope, evidence, and remaining barriers."],
                ["Review what changes", "Rescan affected pages after content, theme, or plugin changes. Review and recheck supported repairs."],
                ["Repeat the human checks", "Retest affected journeys and arrange regular manual reviews. Keep listening to accessibility feedback."],
              ].map(([title, text], index) => (
                <li key={title} className="flex gap-4 border-t border-slate-200 pt-5 dark:border-slate-700">
                  <span className="font-mono text-sm font-semibold text-teal-800 dark:text-teal-300" aria-hidden="true">{index + 1}</span>
                  <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section id="testing-scope" aria-labelledby="scope-title" className="container-wide scroll-mt-28 py-12 sm:py-16">
        <div className="border border-blue-200 bg-blue-50 p-6 sm:p-8 dark:border-blue-800 dark:bg-blue-950/40">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Before you use the results</p>
          <h2 id="scope-title" className="mt-3 text-2xl font-bold sm:text-3xl">A passing scan does not mean full accessibility or compliance.</h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-700 dark:text-slate-200">This plugin does not make a website fully accessible, certify WCAG conformance, or establish legal compliance. Automated tools cannot evaluate every accessibility requirement. Zero automated findings means no issues were detected by the checks that ran, in the page state and viewport tested.</p>
          <p className="mt-4 max-w-4xl leading-7 text-slate-700 dark:text-slate-200"><strong>Manual testing is still required, even when every automated check passes.</strong> A full evaluation needs an appropriate scope, representative pages and complete user journeys, human judgment, and assistive-technology testing. The plugin’s guided sessions are a starting point, not a complete WCAG audit.</p>
          <p className="mt-5 text-sm leading-6"><a href="https://www.w3.org/WAI/test-evaluate/tools/selecting/" className={linkStyle}>W3C explains what evaluation tools can and cannot do</a>.</p>
        </div>
      </section>

      <section aria-labelledby="features-title" className="container-wide pb-14 sm:pb-20">
        <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">Inside the current build</p>
        <h2 id="features-title" className="mt-3 text-3xl font-bold tracking-tight">Find a barrier. Review the change. Check the result.</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {features.map(([title, text]) => <div key={title} className="border-t-2 border-slate-200 pt-5 dark:border-slate-700"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p></div>)}
        </div>
        <figure className="mt-10 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <Image src="/images/wordpress-plugin/inline-highlight-0.7.0.png" alt="Version 0.7 in the WordPress admin panel: a private preview highlights the affected field on a Contact Form 7 test page, alongside the guided source and repair workflow." width={1440} height={1100} className="h-auto w-full" sizes="(max-width: 1280px) 100vw, 1280px" />
          <figcaption className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Actual 0.7 development build on an artificial form fixture. Highlighting identifies the recorded element; changes to generated fields are made in the form editor. Save, rescan and test the relevant journey before recording a result.</figcaption>
        </figure>
        <div className="mt-6 grid gap-6 text-sm leading-6 text-slate-600 sm:grid-cols-2 dark:text-slate-300">
          <p><strong className="text-slate-950 dark:text-white">Monitoring is user-initiated.</strong> Keep the admin tab open while scans run. The queue can be paused and resumed. This release does not run unattended scans or send background alerts.</p>
          <p><strong className="text-slate-950 dark:text-white">Repairs have explicit boundaries.</strong> Native static blocks and supported Custom HTML are covered. Third-party form builders, shared templates, complex links, and dynamic content still need their owning editor.</p>
        </div>
        <a href="/downloads/wordpress-plugin-inline-guidance-0.7.0.md" download className={cn(linkStyle, "mt-6 inline-flex min-h-11 items-center")}>Read the 0.7 workflow, inspection limits and test method (Markdown)</a>
      </section>

      <section id="compatibility" aria-labelledby="compatibility-title" className="container-wide scroll-mt-28 pb-14 sm:pb-20">
        <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">Official free editions · local compatibility testing</p>
        <h2 id="compatibility-title" className="mt-3 text-3xl font-bold tracking-tight">Works with the tools your pages are built with.</h2>
        <p className="mt-4 max-w-4xl leading-7 text-slate-600 dark:text-slate-300">We test rendered scans, saved changes, review tasks, supported repairs and diagnostic privacy in representative combinations. These checks cover the plugin’s workflows; they do not establish that a theme, builder or website is accessible.</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="border-t-2 border-slate-200 pt-5 dark:border-slate-700">
            <h3 className="text-xl font-semibold">Nine free themes</h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Twenty Twenty-Five, Astra, Hello Elementor, GeneratePress, Kadence, Blocksy, OceanWP, Neve and Storefront.</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Tested with native WordPress content and selected builder combinations. Custom child themes and every theme setting need their own checks.</p>
          </div>
          <div className="border-t-2 border-slate-200 pt-5 dark:border-slate-700">
            <h3 className="text-xl font-semibold">Seven builders and block libraries</h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Elementor, Beaver Builder Lite, SiteOrigin, Brizy, Spectra, Kadence Blocks and GenerateBlocks.</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Builder pages support scans and review records. Edit builder-owned content in that builder; native repair and undo controls protect it. Supported native blocks alongside block libraries can still use guided repairs.</p>
          </div>
          <div className="border-t-2 border-slate-200 pt-5 dark:border-slate-700">
            <h3 className="text-xl font-semibold">Caching and optimization</h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">WP Super Cache, WP Fastest Cache, W3 Total Cache, Autoptimize and LiteSpeed Cache.</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Private diagnostics bypass supported caching and optimization. LiteSpeed server caching requires a supported server; Apache optimization is a separate configuration.</p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-700">
          <h3 className="text-xl font-semibold">WooCommerce, Contact Form 7 and WPForms Lite</h3>
          <p className="mt-3 max-w-4xl leading-7 text-slate-600 dark:text-slate-300">Version 0.5.4 introduced testing to real form submissions and WooCommerce classic and block checkout on Storefront, Astra and Twenty Twenty-Five. Checks include required-field errors, consent, confirmation, cart changes, variations, coupons and local orders using an offline payment method. Selected caching and mobile journeys are included.</p>
          <p className="mt-3 max-w-4xl leading-7 text-slate-600 dark:text-slate-300">Shared form changes and tracked store changes now flag recorded evidence for review. The admin panel explains which journeys need separate checks, and an empty-cart checkout scan gives a useful retry message. Generated fields stay under the control of their form or store editor.</p>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">These are functional compatibility checks, with accessibility findings recorded separately. We also found third-party checkout contrast and ARIA issues that remain present with this plugin disabled. Live payment gateways, actual email delivery, premium extensions, every configuration and human screen-reader journeys still need testing. Scans do not submit forms or place orders; compare the same cart and customer state and record interactions in Manual checks.</p>
        </div>
        <div className="mt-8 border-l-4 border-blue-600 bg-blue-50 p-6 dark:bg-blue-950/40">
          <h3 className="font-semibold">Check the page visitors receive, too.</h3>
          <p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">Scans run as the signed-in administrator. A cache or CDN can serve visitors different or older HTML, including briefly after a repair. Let the cache refresh or purge the affected page, then check the signed-out page and relevant interactions. Paid editions, host-level caches and all possible combinations are outside this test matrix. Everything in this plugin remains completely free.</p>
        </div>
      </section>

      <section aria-labelledby="benchmark-title" className="container-wide py-14 sm:py-16">
        <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">Measured comparison · 30 October 2026</p>
        <h2 id="benchmark-title" className="mt-3 text-3xl font-bold tracking-tight">Learn from the other free tools.</h2>
        <p className="mt-4 max-w-4xl leading-7 text-slate-600 dark:text-slate-300">We tested official free releases on shared Gutenberg, Elementor, WooCommerce and form fixtures. Our scanner detected all eight seeded structural issues on each of the three content pages, as did Sa11y and WeAreDev. Other tools brought useful editorial guidance and different repair workflows. This small local comparison does not establish an overall winner.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div><h3 className="text-xl font-semibold">More useful content reviews</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Sa11y, Editoria11y and Equalize Digital highlighted a gap in our targeted editorial guidance. Version 0.6.0 adds filename-alternative and generic-link prompts, while keeping human judgment explicit and preserving the existing guarded repair flows.</p></div>
          <div><h3 className="text-xl font-semibold">Less repeated triage</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">WeAreDev demonstrated useful grouping in its admin workspace. Our new grouped view brings matching findings together and preserves each page’s decisions and stale status. After a shared change, every affected page still needs another check.</p></div>
        </div>
        <p className="mt-6 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">The report separates structural seeds, editorial review signals, valid controls and unsupported or unmeasured features. WP Accessibility and BEARS have different scopes; Elementor Web Accessibility’s service-dependent scan was not completed in the local lab. Checkout state, paid editions, production performance and full human accessibility evaluation remain separate work.</p>
        <a href="/downloads/wordpress-plugin-benchmark-0.6.0.md" download className={cn(linkStyle, "mt-6 inline-flex min-h-11 items-center")}>Download the benchmark methods and results (Markdown)</a>
      </section>

      <section aria-labelledby="manual-title" className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="container-wide py-14 sm:py-16">
          <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">Part of every testing plan</p>
          <h2 id="manual-title" className="mt-3 text-3xl font-bold tracking-tight">Keep people in the testing process.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">Choose a page and start a guided session in Manual checks. Record step outcomes and observations, preserve previous sessions, and set a review date. Due dates use your WordPress site timezone and appear when the workspace is opened or refreshed; this release does not send email reminders. These areas need human evaluation:</p>
          <dl className="mt-8 grid gap-8 md:grid-cols-2">
            {manualChecks.map(([title, text]) => <div key={title}><dt className="font-semibold">{title}</dt><dd className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{text}</dd></div>)}
          </dl>
          <Link href="/guides/automated-vs-manual-accessibility-testing" className={cn(linkStyle, "mt-8 inline-flex min-h-11 items-center gap-2")}>Read the automated and manual testing guide <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>

      <section aria-labelledby="free-title" className="container-wide grid gap-10 py-14 lg:grid-cols-2 sm:py-20">
        <div>
          <h2 id="free-title" className="text-3xl font-bold tracking-tight">Completely free. A separate WordPress product.</h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Build with Accessibility shares the Accessibility.build brand. It operates independently of this website’s paid tools and services. Plugin features do not require purchases, a subscription, an account, or API credits.</p>
          <ul className="mt-6 space-y-3">
            {["Local scan processing and records", "All repairs, manual sessions, history, review dates and exports included", "No plugin telemetry or required cloud service", "No scanner or overlay on ordinary visitor pages"].map(text => <li key={text} className="flex gap-3 text-sm leading-6"><Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />{text}</li>)}
          </ul>
          <p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-300">Reports and repair records can contain page snippets and before/after content. Store and share them with care. The current build retains records when deactivated or uninstalled; saved content repairs remain in the page.</p>
        </div>
        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 dark:border-slate-700">
          <h2 className="text-2xl font-bold">Try the development preview on staging</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-slate-600 dark:text-slate-300">
            <li>Download the ZIP and upload it through Plugins → Add New → Upload Plugin.</li>
            <li>Activate it, then open Accessibility in WordPress administration.</li>
            <li>Scan a representative page, inspect the findings, and record a guided manual testing session for an important page state.</li>
            <li>Review a supported repair, save, recheck, and test undo before using the workflow more widely.</li>
          </ol>
          <p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-300">Version 0.7.0 adds inline element highlighting in a private admin preview and step-by-step repair guidance for native content, Elementor, WooCommerce and forms. Source links are permission checked; the preview does not modify content or mark findings fixed. Frame and shadow-root findings, hidden states and evidence that cannot be matched still need manual inspection. Version 0.6.0 introduced content-review prompts and repeated-finding groups. Earlier releases cover the theme/cache matrix, commerce/form journeys, browser checks and database upgrades described above; those historical matrices are separate from current feature testing. Managed hosting, paid editions, additional configurations and human screen-reader testing remain release work. WordPress.org review is a separate code and directory-policy review; it is not a certification of website accessibility.</p>
          <Link href="/contact" className={cn(linkStyle, "mt-5 inline-flex min-h-11 items-center")}>Report a plugin issue or share feedback</Link>
        </div>
      </section>
    </div>
  )
}
