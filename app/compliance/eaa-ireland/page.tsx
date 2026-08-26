import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const ogTitle = encodeURIComponent("EAA Compliance in Ireland: S.I. 636/2023 Explained")

export const metadata: Metadata = {
  title: "EAA Compliance in Ireland: S.I. 636/2023 Explained",
  description:
    "Ireland's EAA rules under S.I. No. 636/2023: six sector regulators, criminal penalties up to EUR 60,000, who is in scope, and how to comply.",
  keywords: [
    "european accessibility act ireland",
    "eaa ireland",
    "si 636 2023",
    "accessibility requirements products services regulations ireland",
    "ccpc accessibility",
    "irish website accessibility law",
    "eaa compliance ireland",
  ],
  alternates: {
    canonical: "/compliance/eaa-ireland",
  },
  openGraph: {
    title: "EAA Compliance in Ireland: S.I. 636/2023 Explained",
    description:
      "Ireland's EAA rules under S.I. No. 636/2023: six sector regulators, criminal penalties up to EUR 60,000, who is in scope, and how to comply.",
    url: "/compliance/eaa-ireland",
    type: "article",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EAA Compliance in Ireland: S.I. 636/2023 Explained",
    description:
      "Ireland's EAA rules under S.I. No. 636/2023: six sector regulators, criminal penalties up to EUR 60,000, who is in scope, and how to comply.",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "Does the European Accessibility Act apply to my Irish business?",
    answer:
      "It applies if you sell in-scope products or services to consumers in the EU. The covered categories include consumer-facing e-commerce, consumer banking services, e-books and e-readers, transport services, audiovisual media services access, electronic communications, self-service terminals, computers and operating systems, and smartphones. Ireland transposed the Directive through the European Union (Accessibility Requirements of Products and Services) Regulations 2023 (S.I. No. 636/2023), and the obligations have applied since 28 June 2025. The main carve-out is for service-provider microenterprises: businesses with fewer than 10 employees and annual turnover not exceeding EUR 2 million are exempt from the service requirements.",
  },
  {
    question: "What are the penalties for EAA non-compliance in Ireland?",
    answer:
      "Penalties in Ireland are criminal, which is unusual in the EU. On summary conviction, an offence carries a Class A fine (up to EUR 5,000) and/or up to 6 months imprisonment. On conviction on indictment, the fine rises to up to EUR 60,000 and/or up to 18 months imprisonment. Liability can also extend to directors, managers, secretaries and other officers of a company where an offence is committed with their consent, connivance or neglect, so senior individuals carry personal exposure, not just the corporate entity.",
  },
  {
    question: "Is my company exempt as a microenterprise?",
    answer:
      "Possibly, but the exemption is narrower than many assume. Service-provider microenterprises (fewer than 10 employees and annual turnover not exceeding EUR 2 million) are exempt from the service requirements, though they should be able to provide relevant documentation if relying on the exemption. Microenterprises dealing with products do not get a full pass: they benefit from lighter documentation duties, but the substantive product requirements still apply. If you are near either threshold, document your headcount and turnover position rather than assuming you qualify.",
  },
  {
    question: "Do I really have until 2030 to comply?",
    answer:
      "No. The general obligations have applied since 28 June 2025. The 2030 date comes from a narrow transitional rule: service contracts agreed before 28 June 2025 may run unaltered until they expire, but no longer than five years, which lands at 28 June 2030. That rule protects specific pre-existing contracts, not your website, app, or any new service. Separately, self-service terminals lawfully in use before 28 June 2025 may continue until the end of their economically useful life, capped at 20 years. Everything else needed to comply from June 2025.",
  },
  {
    question: "What standard do I need to meet?",
    answer:
      "The technical route to compliance is EN 301 549, the harmonised European standard, which incorporates WCAG at Level AA for web content. Conformity with the harmonised standard gives a presumption of conformity with the accessibility requirements. The currently cited version is EN 301 549 v3.2.1, and a v4 aligned to WCAG 2.2 is in the ETSI approval pipeline in 2026, so building to WCAG 2.2 Level AA now is the sensible target for web content.",
  },
  {
    question: "Which Irish regulator do I answer to?",
    answer:
      "It depends on your sector. The CCPC (Competition and Consumer Protection Commission) handles market surveillance for products and is the default for e-commerce and consumer services. ComReg covers electronic communications services, Coimisiun na Mean covers audiovisual media services access, the Irish Aviation Authority covers air passenger transport, the National Transport Authority covers bus, rail and waterborne passenger transport, and the Central Bank of Ireland covers consumer banking services. A business operating across sectors can be answerable to more than one of these regulators.",
  },
  {
    question: "Does a non-EU company selling to Irish consumers have to comply?",
    answer:
      "Yes. The European Accessibility Act applies to any business selling in-scope products or services to consumers in the EU, regardless of where the business is established. A US, UK or other non-EU company whose e-commerce site serves Irish consumers falls within the scope of S.I. No. 636/2023 for those sales, and the Irish regulators can enforce against that activity in the same way.",
  },
]

export default function EAAIrelandCompliancePage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Compliance", url: "https://accessibility.build/compliance" },
          { name: "EAA Ireland", url: "https://accessibility.build/compliance/eaa-ireland" },
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/compliance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Compliance
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                EAA Ireland
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-4">
              Compliance Guide &bull; S.I. No. 636/2023
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              The European Accessibility Act{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                in Ireland
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              Ireland transposed the European Accessibility Act with an enforcement model most of
              the EU did not choose: non-compliance is a criminal offence, policing is split across
              six sector regulators, and company officers can be personally liable. The obligations
              have applied since 28 June 2025, not 2030.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Obligations Live Since</p>
              <p className="text-2xl md:text-3xl font-bold text-white">28 June 2025</p>
              <p className="text-slate-400 text-xs mt-1">S.I. No. 636/2023 in effect</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Enforcement Split Across</p>
              <p className="text-2xl md:text-3xl font-bold text-white">6 Regulators</p>
              <p className="text-slate-400 text-xs mt-1">CCPC, ComReg, Central Bank and more</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Maximum Fine on Indictment</p>
              <p className="text-2xl md:text-3xl font-bold text-white">EUR 60,000</p>
              <p className="text-slate-400 text-xs mt-1">And/or up to 18 months imprisonment</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Non-Compliance Is a</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Criminal Offence</p>
              <p className="text-slate-400 text-xs mt-1">Officers can be personally liable</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* What S.I. 636/2023 does */}
          <section aria-labelledby="si636-heading">
            <h2 id="si636-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What S.I. 636/2023 Does
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The European Accessibility Act is an EU directive, Directive (EU) 2019/882, so each
              member state had to write it into national law. Ireland did that through the European
              Union (Accessibility Requirements of Products and Services) Regulations 2023, S.I.
              No. 636/2023. The Regulations set accessibility requirements for a defined list of
              consumer products and services, and those obligations have applied since{" "}
              <strong className="text-slate-900 dark:text-white">28 June 2025</strong>.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The reach is wide. The Regulations catch any business selling in-scope products or
              services to consumers in the EU, regardless of where that business is established. An
              Irish retailer, a UK brand shipping to Dublin, and a US SaaS company billing Irish
              consumers are all inside the same net for their in-scope activity.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              This page covers the Irish specifics: who enforces the Regulations, why the penalty
              model stands out, and what to do about it. For the EU-wide picture, start with our{" "}
              <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                European Accessibility Act guide
              </Link>{" "}
              and the deeper{" "}
              <Link href="/research/european-accessibility-act" className="text-blue-600 dark:text-blue-400 hover:underline">
                EAA research hub
              </Link>
              .
            </p>
          </section>

          {/* Six-regulator map */}
          <section aria-labelledby="regulators-heading">
            <h2 id="regulators-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Who Enforces It: The Six-Regulator Map
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Instead of naming one national accessibility authority, Ireland split enforcement
              across six existing sector regulators. Which one you answer to depends on what you
              sell:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm border-collapse">
                <caption className="sr-only">
                  Irish regulators responsible for enforcing the European Accessibility Act, by
                  sector
                </caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                      Regulator
                    </th>
                    <th scope="col" className="py-3 font-semibold text-slate-900 dark:text-white">
                      Responsibility
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                      CCPC (Competition and Consumer Protection Commission)
                    </td>
                    <td className="py-3">
                      Market surveillance for products, and the default for e-commerce and consumer
                      services
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">ComReg</td>
                    <td className="py-3">Electronic communications services</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                      Coimisi&uacute;n na Me&aacute;n
                    </td>
                    <td className="py-3">Access to audiovisual media services</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                      Irish Aviation Authority
                    </td>
                    <td className="py-3">Air passenger transport services</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                      National Transport Authority
                    </td>
                    <td className="py-3">Bus, rail and waterborne passenger transport</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                      Central Bank of Ireland
                    </td>
                    <td className="py-3">Consumer banking services</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For most online businesses the practical answer is the CCPC: an inaccessible
              e-commerce checkout is squarely its territory. A bank&apos;s consumer services sit
              with the Central Bank of Ireland instead, and a business operating across sectors can
              be answerable to more than one regulator. We cover the sector-specific stakes in our{" "}
              <Link href="/industries/ecommerce" className="text-blue-600 dark:text-blue-400 hover:underline">
                e-commerce accessibility guide
              </Link>{" "}
              and{" "}
              <Link href="/industries/finance" className="text-blue-600 dark:text-blue-400 hover:underline">
                finance accessibility guide
              </Link>
              .
            </p>
          </section>

          {/* Penalties */}
          <section aria-labelledby="penalties-heading">
            <h2 id="penalties-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Penalties: Why Ireland Is Different
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Ireland made EAA non-compliance a criminal matter, which is unusual in the EU. Under
              S.I. No. 636/2023 an offence can be prosecuted two ways:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">On summary conviction:</strong>{" "}
                a Class A fine (up to EUR 5,000) and/or up to 6 months imprisonment.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">On conviction on indictment:</strong>{" "}
                a fine of up to EUR 60,000 and/or up to 18 months imprisonment.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The sharper edge is personal. Where an offence is committed with the consent,
              connivance or neglect of a director, manager, secretary or other officer of the
              company, that individual can be liable as well as the company. A compliance question
              that lands in most member states as an administrative matter for the business lands
              in Ireland as potential criminal exposure for named people.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              That framing changes how Irish boards should treat digital accessibility: it belongs
              on the risk register next to other criminal-liability regimes, with documented
              decisions, not in a backlog of nice-to-have website improvements.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope-heading">
            <h2 id="scope-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Are You in Scope?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Directive defines the covered categories, and Ireland enforces the same list. You
              are in scope if you provide any of these to consumers:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>Consumer-facing e-commerce services</li>
              <li>Consumer banking services</li>
              <li>E-books and e-readers</li>
              <li>Transport services</li>
              <li>Access to audiovisual media services</li>
              <li>Electronic communications services</li>
              <li>Self-service terminals</li>
              <li>Computers and operating systems</li>
              <li>Smartphones</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Two points trip people up. First, establishment does not matter: any business selling
              these to consumers in the EU is covered, wherever it is based. Second, the
              microenterprise exemption is narrower than its reputation. Service-provider
              microenterprises (fewer than 10 employees and annual turnover not exceeding EUR 2
              million) are exempt from the service requirements, but should be able to provide
              relevant documentation if relying on the exemption. Microenterprises dealing with
              products get lighter documentation duties, not a full pass.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you are unsure where you land, our{" "}
              <Link href="/tools/eaa-scope-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                EAA scope checker
              </Link>{" "}
              walks through the sector, establishment and microenterprise questions in a few
              minutes.
            </p>
          </section>

          {/* Compliance route */}
          <section aria-labelledby="standard-heading">
            <h2 id="standard-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Compliance Route: EN 301 549 and WCAG
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Regulations state requirements as outcomes, not techniques. The practical route
              to meeting them is{" "}
              <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                EN 301 549
              </Link>
              , the harmonised European accessibility standard. Conformity with the harmonised
              standard gives a presumption of conformity with the accessibility requirements, which
              is the strongest position a business can put itself in.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              For web content, EN 301 549 incorporates WCAG at Level AA. The currently cited
              version of the standard is EN 301 549 v3.2.1, and a v4 aligned to WCAG 2.2 is in the
              ETSI approval pipeline in 2026. Building to WCAG 2.2 Level AA now means you meet the
              current standard and are already positioned for the next one.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG 2.2 checklist
              </Link>{" "}
              covers every success criterion, and the{" "}
              <Link href="/guides/wcag-2-2-aa-requirements" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG 2.2 AA requirements guide
              </Link>{" "}
              explains what each one demands in practice.
            </p>
          </section>

          {/* 2030 misconception */}
          <section aria-labelledby="misconception-heading">
            <h2 id="misconception-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The 2030 Misconception and Disproportionate Burden
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              A persistent myth says businesses have until 2030 to comply. They do not. The general
              obligations have applied since 28 June 2025. The 2030 date comes from two narrow
              transitional rules:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Pre-existing service contracts.</strong>{" "}
                Service contracts agreed before 28 June 2025 may run unaltered until they expire,
                but no longer than five years, which caps them at 28 June 2030. This protects
                specific old contracts, not your website or any new agreement.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Existing self-service terminals.</strong>{" "}
                Terminals lawfully in use before 28 June 2025 may continue until the end of their
                economically useful life, capped at 20 years.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The other clause businesses reach for is disproportionate burden. It exists, but it
              is not a self-declared opt-out: a business may claim the requirements impose a
              disproportionate burden only on the basis of a documented assessment against the
              criteria in Annex VI of the Directive. Relying on the exemption without that
              documentation is itself non-compliance.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The safe reading for an Irish business: assume you needed to comply in June 2025, and
              treat every exemption as something to be evidenced in writing, not asserted after a
              regulator gets in touch.
            </p>
          </section>

          {/* Enforcement so far */}
          <section aria-labelledby="enforcement-heading">
            <h2 id="enforcement-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What Enforcement Looks Like So Far in Europe
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Honest answer: it is early. There is no EU-wide enforcement dataset yet, and the
              first Commission report on the Directive&apos;s application is due 28 June 2030. As
              of an August 2026 review of primary sources, no monetary fine under an EAA
              transposition law had been confirmed anywhere in the EU. Two developments show which
              way the wind is blowing:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">The Carrefour ruling in France.</strong>{" "}
                On 4 June 2026 the Tribunal judiciaire de Caen ordered Carrefour to make its
                website and app accessible within six months, under a penalty of EUR 500 per day,
                treating accessibility as an obligation of result rather than an obligation of
                effort.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">The Dutch regulator&apos;s findings.</strong>{" "}
                In March 2026 the ACM reported that 61% of the largest Dutch webshops fail
                accessibility requirements, a signal that regulators are actively measuring the
                market even before headline fines arrive.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Ireland has its own reason not to wait for a first fine elsewhere: its criminal
              penalty model means the first Irish enforcement action would look very different from
              an administrative fine. Track how the EAA compares with other regimes in our{" "}
              <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility laws tracker
              </Link>
              , and if you also sell into Great Britain, note that the UK sits outside the EAA and
              runs its own regime, covered in our{" "}
              <Link href="/compliance/uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                UK accessibility law guide
              </Link>
              .
            </p>
          </section>

          {/* Practical steps */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Practical Steps for Irish Businesses
            </h2>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Confirm whether you are in scope.</strong>{" "}
                Run your business through the{" "}
                <Link href="/tools/eaa-scope-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EAA scope checker
                </Link>
                . If you plan to rely on the microenterprise exemption or a disproportionate burden
                claim, put the supporting evidence in writing now.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Audit against WCAG 2.2 AA.</strong>{" "}
                An audit tells you the gap between where you are and what EN 301 549 expects. Our{" "}
                <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  fixed-price WCAG 2.2 AA audits
                </Link>{" "}
                start at $950, and you can see exactly what you get in the{" "}
                <Link href="/sample-audit-report" className="text-blue-600 dark:text-blue-400 hover:underline">
                  sample audit report
                </Link>
                .
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Fix the consumer journeys first.</strong>{" "}
                Prioritise the flows a regulator or a blocked customer meets first: product pages,
                cart, checkout, account creation, and support. For online retail, our{" "}
                <Link href="/industries/ecommerce" className="text-blue-600 dark:text-blue-400 hover:underline">
                  e-commerce guide
                </Link>{" "}
                maps the highest-risk patterns.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Publish accessibility information.</strong>{" "}
                Telling customers how your service meets the requirements, and where it falls
                short, is part of operating in good faith. Our{" "}
                <Link href="/guides/how-to-write-an-accessibility-statement" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessibility statement guide
                </Link>{" "}
                explains what to say, and the{" "}
                <Link href="/tools/accessibility-statement-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
                  statement generator
                </Link>{" "}
                gives you a starting draft.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Know your regulator.</strong>{" "}
                Work out which of the six bodies covers you, and treat correspondence from any of
                them seriously from the first letter. Given the criminal penalty model, this is a
                conversation to have with legal counsel early, not after a deadline passes.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Keep the evidence current.</strong>{" "}
                Retest after significant releases and keep your documentation, assessments and
                remediation records up to date. The businesses in the worst position under S.I. No.
                636/2023 are the ones that can show a regulator nothing at all.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not constitute
                legal advice. The European Accessibility Act and its Irish transposition are new,
                and their interpretation by the six Irish regulators and the courts will develop
                over the coming years. For advice about your specific situation, consult a
                solicitor experienced in Irish and EU accessibility law.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="European Accessibility Act Ireland EAA compliance EN 301 549 WCAG e-commerce banking enforcement CCPC"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
