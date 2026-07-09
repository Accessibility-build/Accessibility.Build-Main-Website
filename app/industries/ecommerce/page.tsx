import Link from "next/link"
import {
  ArrowRight,
  ShoppingCart,
  Scale,
  Gavel,
  Globe,
  ImageIcon,
  FormInput,
  SlidersHorizontal,
  MousePointerClick,
  Contrast,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"

export const metadata = {
  title: "E-commerce Accessibility: WCAG & ADA Compliance",
  description:
    "Online stores face more ADA web lawsuits than any other industry. Understand your legal exposure, the WCAG issues that matter most, and a practical fix roadmap.",
  alternates: { canonical: "/industries/ecommerce" },
  openGraph: {
    type: "website",
    title: "E-commerce Accessibility: WCAG & ADA Compliance",
    description:
      "Online stores face more ADA web lawsuits than any other industry. Understand your legal exposure, the WCAG issues that matter most, and a practical fix roadmap.",
    url: "/industries/ecommerce",
    images: [
      {
        url: "/api/og?title=E-commerce%20Accessibility%3A%20WCAG%20%26%20ADA%20Compliance&section=Industries",
        width: 1200,
        height: 630,
        alt: "E-commerce Accessibility: WCAG & ADA Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-commerce Accessibility: WCAG & ADA Compliance",
    description:
      "Online stores face more ADA web lawsuits than any other industry. Understand your legal exposure, the WCAG issues that matter most, and a practical fix roadmap.",
    images: ["/api/og?title=E-commerce%20Accessibility%3A%20WCAG%20%26%20ADA%20Compliance&section=Industries"],
  },
}

const stats = [
  {
    value: "~70%",
    label: "of digital accessibility lawsuits target e-commerce and retail — more than every other industry combined",
  },
  {
    value: "3,117",
    label: "ADA Title III web accessibility suits filed in US federal courts in 2025, up 27% year over year",
  },
  {
    value: "$490B",
    label: "estimated annual disposable income of working-age US adults with disabilities",
  },
  {
    value: "1 in 4",
    label: "US adults lives with a disability — a customer segment most stores unintentionally turn away",
  },
]

const legalExposure = [
  {
    icon: Gavel,
    title: "ADA Title III — the primary driver",
    description:
      "Courts have repeatedly held that the websites and apps of businesses selling goods to the public fall under Title III of the Americans with Disabilities Act. The Ninth Circuit's Robles v. Domino's decision (which the Supreme Court declined to disturb) cemented that an inaccessible site or app can violate the ADA. Retail and e-commerce absorb roughly 70% of the resulting litigation — around 3,500 of the 5,000+ combined federal and state suits filed in 2025 — because storefronts are easy for plaintiff firms to test at scale: scan the product pages, attempt a checkout with a screen reader, and file.",
  },
  {
    icon: Scale,
    title: "California Unruh Act and New York venues",
    description:
      "State law raises the stakes. California's Unruh Civil Rights Act attaches minimum statutory damages of $4,000 per violation to ADA breaches, which is why California state courts host thousands of web accessibility claims against retailers. New York remains the single busiest venue for federal filings — its courts have taken a broad view of standing, and a handful of plaintiff firms there file hundreds of near-identical complaints against online stores each year. If you sell nationwide, you are exposed in both jurisdictions regardless of where you are headquartered.",
  },
  {
    icon: Globe,
    title: "The European Accessibility Act",
    description:
      "Since June 28, 2025, the European Accessibility Act (EAA) has applied to e-commerce services offered to consumers in the EU — including US-based stores that ship there. The EAA requires conformance with EN 301 549, which incorporates WCAG 2.1 AA, and is enforced by national market-surveillance authorities with penalties that vary by member state. Micro-enterprises are exempt, but any store of meaningful size selling into Europe now has a second, independent legal reason to meet WCAG. See our European Accessibility Act guide for scope and enforcement details.",
  },
  {
    icon: AlertTriangle,
    title: "Settlements are getting expensive",
    description:
      "Most e-commerce accessibility cases settle quickly for five-figure sums plus remediation commitments — but the ceiling is rising. Fashion Nova's $5.15 million class settlement showed that repeat exposure and large customer bases translate into real numbers, and defense costs, injunctive monitoring, and repeat suits (being sued again by a different plaintiff after settling) compound the total. The cheapest time to fix accessibility is before the demand letter arrives.",
  },
]

const wcagIssues = [
  {
    icon: ImageIcon,
    title: "Product images without meaningful alt text",
    criteria: [{ label: "WCAG 1.1.1 Non-text Content", href: "/wcag/1-1-1" }],
    description:
      "Product photos are the core content of a store, and they are the single most-cited failure in e-commerce complaints. Missing alt text, file-name alt text (\"IMG_2043.jpg\"), or generic alt text (\"product image\") leaves screen reader users unable to compare items, verify colors and styles, or confirm what they are buying. Every product image needs alt text that conveys what a sighted shopper learns from the photo — and decorative flourishes should be explicitly marked decorative. Our free alt text generator can draft descriptions at catalog scale.",
  },
  {
    icon: FormInput,
    title: "Checkout forms with unlabeled fields and silent errors",
    criteria: [
      { label: "WCAG 3.3.2 Labels or Instructions", href: "/wcag/3-3-2" },
      { label: "WCAG 3.3.1 Error Identification", href: "/wcag/3-3-1" },
      { label: "WCAG 3.3.7 Redundant Entry", href: "/wcag/3-3-7" },
    ],
    description:
      "Checkout is where accessibility failures cost you money directly. Placeholder-only labels disappear on input, unassociated error messages leave users guessing which field failed, and card-number fields that reject pasted input or split into unlabeled fragments are classic abandonment triggers. WCAG 2.2's Redundant Entry criterion also requires that information a shopper already provided (shipping address, for example) be auto-populated or selectable rather than retyped.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filters, facets, and variant pickers that keyboard users cannot operate",
    criteria: [
      { label: "WCAG 2.1.1 Keyboard", href: "/wcag/2-1-1" },
      { label: "WCAG 4.1.2 Name, Role, Value", href: "/wcag/4-1-2" },
    ],
    description:
      "Category filters, price sliders, size and color swatches, and quantity steppers are usually custom widgets — and custom widgets built from bare <div> elements are invisible to assistive technology. Swatches that convey the selected color only visually, filters that apply on hover, and sliders that only respond to mouse drags all fail. Every control needs an accessible name, a correct role, a communicated state, and full keyboard operation.",
  },
  {
    icon: MousePointerClick,
    title: "Missing focus indicators and tiny tap targets",
    criteria: [
      { label: "WCAG 2.4.7 Focus Visible", href: "/wcag/2-4-7" },
      { label: "WCAG 2.5.8 Target Size (Minimum)", href: "/wcag/2-5-8" },
    ],
    description:
      "Design systems that strip focus outlines for aesthetics make keyboard shopping impossible — users cannot tell which product card, mini-cart button, or menu item is active. On mobile, where most e-commerce traffic now lives, cramped quantity buttons and close icons under 24x24 CSS pixels fail WCAG 2.2's Target Size minimum and frustrate anyone with limited dexterity.",
  },
  {
    icon: Contrast,
    title: "Low-contrast prices, sale badges, and body text",
    criteria: [{ label: "WCAG 1.4.3 Contrast (Minimum)", href: "/wcag/1-4-3" }],
    description:
      "Light gray prices on white, thin sale-badge text over photography, and brand-color CTAs that fall below 4.5:1 contrast are among the most common automated-scan findings on retail sites. Contrast failures affect the largest population of any issue — including the growing number of older shoppers — and they are usually the fastest to fix.",
  },
  {
    icon: CreditCard,
    title: "Session timeouts and inaccessible third-party payment widgets",
    criteria: [{ label: "WCAG 2.2.1 Timing Adjustable", href: "/wcag/2-2-1" }],
    description:
      "Screen reader users and people with motor or cognitive disabilities often need longer to complete checkout. Cart sessions that expire without warning or extension options fail Timing Adjustable. Embedded payment iframes, buy-now-pay-later widgets, and express-checkout buttons are also part of your legal exposure even though a vendor built them — plaintiffs sue the store, not the payment processor.",
  },
]

const roadmap = [
  {
    step: "Audit your revenue path first",
    detail:
      "Run a full audit of the money-making journey — home page, search, product listing, product detail, cart, checkout, and account creation — before worrying about long-tail content. This is the path plaintiff firms test and the path where fixes pay for themselves in recovered conversions. Combine automated scanning with manual keyboard and screen reader testing; automated tools alone catch roughly a third of WCAG failures.",
  },
  {
    step: "Fix catalog-scale content problems programmatically",
    detail:
      "Alt text, heading structure on product pages, and link text usually live in templates and product data, not individual pages. Fix the template once, then backfill product data — require alt text in your PIM or CMS workflow so new products cannot ship without it.",
  },
  {
    step: "Remediate checkout and custom widgets",
    detail:
      "Rebuild filters, variant pickers, and cart interactions on semantic HTML or correct ARIA patterns, with visible focus and full keyboard support. Test the entire checkout with a screen reader and keyboard only, including error states and applied discount codes.",
  },
  {
    step: "Put vendors under contract",
    detail:
      "Reviews widgets, chat, payments, personalization, and A/B testing scripts all render inside your pages. Require WCAG 2.1 AA (or 2.2 AA) conformance and current accessibility documentation in vendor contracts, and test third-party embeds as part of your own QA.",
  },
  {
    step: "Verify, publish, and monitor",
    detail:
      "Validate fixes against the WCAG 2.2 checklist, publish an accessibility statement with a working feedback channel, and add automated regression scans to CI so redesigns and seasonal campaigns don't reintroduce failures. Re-audit at least annually and after major replatforms.",
  },
]

const faqs = [
  {
    question: "Does the ADA really apply to an online-only store with no physical location?",
    answer:
      "In many jurisdictions, yes — and in practice it barely matters. Some federal circuits require a nexus to a physical place while others treat websites as places of public accommodation on their own, but plaintiff firms simply file in favorable venues like New York, and state laws such as California's Unruh Act add independent exposure. Online-only retailers are sued under the ADA routinely, so the safe operating assumption for any US-facing store is that WCAG 2.1 AA conformance is the de facto legal standard.",
  },
  {
    question: "Which WCAG version should an e-commerce site target in 2026?",
    answer:
      "Target WCAG 2.2 Level AA. Lawsuits and settlement agreements most commonly cite WCAG 2.1 AA, but WCAG 2.2 is the current W3C recommendation, is backwards-compatible, and adds criteria that matter directly to stores — Target Size for mobile tap targets, Redundant Entry for checkout, and Accessible Authentication for login. Meeting 2.2 AA satisfies every regime that cites 2.1 AA, including the European Accessibility Act's EN 301 549 standard.",
  },
  {
    question: "Will an accessibility overlay or widget protect my store from lawsuits?",
    answer:
      "No. Overlay widgets do not fix the underlying code, and sites running overlays are sued regularly — hundreds of companies using overlay products receive demand letters or lawsuits every year, and some complaints now cite the overlay itself as a barrier. Courts and settlement agreements require actual WCAG conformance of the site's code. Budget for real remediation instead of a subscription that leaves the violations in place.",
  },
  {
    question: "How much does an accessibility lawsuit actually cost an online store?",
    answer:
      "Typical ADA website suits settle in the $5,000 to $50,000 range plus legal fees and a binding remediation commitment — but that is the floor, not the ceiling. Unruh Act claims add $4,000 minimum statutory damages per violation, defendants who settle without fixing their sites are frequently sued again by new plaintiffs, and large-scale cases like Fashion Nova's $5.15 million settlement show the upper end. Remediation itself is usually cheaper than one lawsuit cycle.",
  },
  {
    question: "Is accessible e-commerce actually good for revenue?",
    answer:
      "Yes, measurably. Working-age US adults with disabilities control an estimated $490 billion in disposable income, and UK research (the Click-Away Pound survey) found shoppers with access needs abandoned sites worth billions per year rather than report problems. The same fixes that satisfy WCAG — clear labels, visible focus, logical structure, robust forms — reduce checkout abandonment for everyone and improve SEO, since search engines parse the same semantics screen readers do.",
  },
  {
    question: "Does the European Accessibility Act apply to US-based stores?",
    answer:
      "If you sell to consumers in the EU, generally yes. The EAA applies to e-commerce services targeting EU consumers regardless of where the seller is established, with an exemption for micro-enterprises (fewer than 10 employees and under EUR 2 million turnover). The obligation has been live since June 28, 2025, and requires conformance with EN 301 549, which incorporates WCAG 2.1 AA.",
  },
]

export default function EcommerceIndustryPage() {
  return (
    <div className="container-wide py-12 px-4 sm:px-6">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Industries", url: "https://accessibility.build/industries" },
          { name: "E-commerce", url: "https://accessibility.build/industries/ecommerce" },
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/industries" className="hover:text-primary transition-colors">
              Industries
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span className="text-foreground font-medium">E-commerce</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Industry Guide
        </div>
        <h1 className="text-4xl font-bold mb-4">E-commerce Accessibility: WCAG &amp; ADA Compliance</h1>
        <p className="text-xl text-muted-foreground">
          Online retail is the most-sued industry in digital accessibility — and the one with the clearest business
          case for fixing it. Here is what the law demands of your store, where storefronts actually fail, and how to
          remediate in the order that reduces risk fastest.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, i) => (
          <div key={i} className="bg-background rounded-2xl border p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Why it matters */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">Why accessibility matters in e-commerce</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Roughly one in four US adults lives with a disability, and nearly all of them shop online — screen reader
            users buying groceries, keyboard-only users with tremor or repetitive strain injuries, low-vision shoppers
            zoomed to 200%, and deaf customers relying on captioned product videos. Add the world&apos;s aging
            population — declining vision, hearing, and dexterity arrive for everyone — and the &quot;edge case&quot;
            framing collapses. Accessibility barriers exclude a market segment larger than most countries: working-age
            US adults with disabilities alone control an estimated $490 billion in disposable income, and their
            households and networks influence far more.
          </p>
          <p>
            Unlike most industries, e-commerce gets an immediate, measurable return on accessibility. An unlabeled
            checkout field is not an abstract compliance gap — it is cart abandonment you can watch in analytics. UK
            researchers behind the Click-Away Pound survey found that most shoppers with access needs do not complain
            when a site fails them; they silently take billions in annual spending to a competitor. The reverse is
            equally true: semantic HTML, descriptive product alt text, and clear form structure are the same signals
            search engines rank on, so accessible stores tend to convert better and rank better simultaneously.
          </p>
          <p>
            And because storefronts share so much structure — catalog, cart, checkout — plaintiff law firms can test
            hundreds of them quickly. That is why e-commerce absorbs the largest share of accessibility litigation of
            any industry, year after year, as tracked in our{" "}
            <Link href="/research/accessibility-lawsuits" className="text-primary hover:underline">
              accessibility lawsuit tracker
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Legal exposure */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">Your legal exposure as an online retailer</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Four overlapping regimes drive e-commerce accessibility risk in 2026. For the full legal picture, see our
          guides to the <Link href="/compliance/ada" className="text-primary hover:underline">ADA</Link> and the{" "}
          <Link href="/compliance/eaa" className="text-primary hover:underline">European Accessibility Act</Link>.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {legalExposure.map((item, i) => {
            const IconComponent = item.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2">
                    <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* WCAG issues */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">The WCAG issues that hit online stores hardest</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          These are the failures most frequently cited in e-commerce complaints and audits, in rough priority order.
          Each links to the relevant WCAG success criterion.
        </p>
        <div className="space-y-6 max-w-4xl mx-auto">
          {wcagIssues.map((issue, i) => {
            const IconComponent = issue.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2.5 flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {issue.criteria.map((criterion) => (
                        <Link
                          key={criterion.href}
                          href={criterion.href}
                          className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                          {criterion.label}
                        </Link>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">A practical compliance roadmap for stores</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Sequence matters: fix the journeys that carry revenue and litigation risk first, then make the gains
          permanent.
        </p>
        <ol className="space-y-4">
          {roadmap.map((item, i) => (
            <li key={i} className="bg-background rounded-2xl border p-6 shadow-sm flex gap-4">
              <div
                className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold"
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.step}</h3>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Resources */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Tools and resources for e-commerce teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/tools/alt-text-generator"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <ImageIcon className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Alt Text Generator</h3>
            <p className="text-sm text-muted-foreground">
              Draft meaningful product-image descriptions at catalog scale.
            </p>
          </Link>
          <Link
            href="/checklists/wcag-2-2"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <CheckCircle2 className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">WCAG 2.2 Checklist</h3>
            <p className="text-sm text-muted-foreground">
              Every success criterion in plain language, checkable by your team.
            </p>
          </Link>
          <Link
            href="/services/accessibility-audits"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Wrench className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Accessibility Audits</h3>
            <p className="text-sm text-muted-foreground">
              Manual + automated audits of your full purchase funnel with a prioritized fix plan.
            </p>
          </Link>
          <Link
            href="/research/accessibility-lawsuits"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Scale className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Lawsuit Tracker</h3>
            <p className="text-sm text-muted-foreground">
              Live data on filings, venues, and retail&apos;s share of accessibility litigation.
            </p>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 border border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Get your store audited before a plaintiff firm does</h2>
          <p className="text-muted-foreground">
            We audit the exact journey litigation targets — search, product pages, cart, and checkout — and hand your
            developers a prioritized, code-level remediation plan.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact?service=audit" className="flex items-center">
              Request an E-commerce Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/industries">Explore Other Industries</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
