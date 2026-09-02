import type { Metadata } from "next"
import Link from "next/link"
import { asc, and, eq } from "drizzle-orm"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"
import { getCaseStudy } from "@/lib/case-studies"
import { db } from "@/lib/db"
import { caseComments } from "@/lib/db/schema"
import { ownerUserIds, toPublicComment } from "@/lib/case-comments-server"
import type { PublicComment } from "@/lib/case-comments"
import { CaseComments } from "@/components/cases/case-comments"
import { CaseToc } from "@/components/cases/case-toc"
import { FilingsChart } from "@/components/cases/filings-chart"
import { ScreenReaderDemo } from "@/components/cases/screen-reader-demo"
import { RemediationEvidence } from "@/components/cases/remediation-evidence"
import { CasePhoto } from "@/components/cases/case-photo"
import {
  CircuitPositions,
  DefenceScorecard,
  DefendantPlaybook,
} from "@/components/cases/case-graphics"
import { ConformanceLevelsDiagram, CourtPathDiagram } from "@/components/cases/case-illustrations"
import {
  CaseCorrection,
  CaseCorrections,
  CaseExitRamp,
  CaseFacts,
  CaseNote,
  CaseProse,
  CaseQuote,
  CaseScopeSummary,
  CaseSection,
  CaseSourceLinks,
  CaseTable,
  CaseTd,
  CaseTh,
  CaseTimeline,
} from "@/components/cases/case-primitives"

const CASE_SLUG = "robles-v-dominos"
const study = getCaseStudy(CASE_SLUG)!

const pageTitle = "Robles v. Domino's: The Web Accessibility Case"
const pageDescription =
  "A sourced account of Robles v. Domino's: the alleged website and app barriers, the Ninth Circuit's ADA nexus holding, the 2021 website judgment, and what the public record does and does not establish."

const primarySources = {
  complaint: "https://www.courthousenews.com/wp-content/uploads/2019/01/Dominos-Lawsuit.pdf",
  dismissal2017:
    "https://www.uschamber.com/assets/documents/Lower20Court20Decision20-20Robles20v.20Dominos20Pizza20LLC2028USDC20-20Central20District20of20California29.pdf",
  ninthCircuit: "https://cdn.ca9.uscourts.gov/datastore/opinions/2019/01/15/17-55504.pdf",
  certPetition:
    "https://www.supremecourt.gov/DocketPDF/18/18-1539/102950/20190613153319483_DominosPetition.pdf",
  supremeCourtDocket: "https://www.supremecourt.gov/docket/docketfiles/html/public/18-1539.html",
  order2021:
    "https://www.lflegal.com/wp-content/uploads/2021/06/June-23-2021-Dominos-Federal-Court-Order.pdf",
  settlementNotice2021:
    "https://www.lflegal.com/wp-content/uploads/2021/06/Dominos-Notice-of-Settlement-November-2021.pdf",
  districtDocket:
    "https://www.courtlistener.com/docket/4615111/guillermo-robles-v-dominos-pizza-llc/",
  settlementUpdate: "https://www.lflegal.com/2021/06/dominos-june-2021/",
  dominosPolicy: "https://perf2-cloud.dominos.pizza/content/accessibility-policy",
} as const

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  authors: [
    {
      name: "The Accessibility.build team",
      url: "https://accessibility.build/about",
    },
  ],
  creator: "The Accessibility.build team",
  publisher: "Accessibility.build",
  keywords: [
    "Robles v Domino's",
    "Domino's accessibility lawsuit",
    "Domino's ADA lawsuit",
    "web accessibility lawsuit",
    "ADA Title III website",
    "website accessibility case law",
    "nexus test ADA website",
    "Domino's Supreme Court accessibility",
    "screen reader lawsuit",
    "WCAG lawsuit",
  ],
  alternates: { canonical: `/cases/${CASE_SLUG}` },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `/cases/${CASE_SLUG}`,
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Robles v. Domino's Pizza")}&section=Case study`,
        width: 1200,
        height: 630,
        alt: "Robles v. Domino's Pizza case study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Robles v. Domino's Pizza")}&section=Case study`],
  },
}

// Comments are read at request time but the page is cached, so the thread is
// server-rendered (and therefore readable without JavaScript) without making
// every visit hit the database.
export const revalidate = 300

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Case Studies", url: "https://accessibility.build/cases" },
  {
    name: "Robles v. Domino's Pizza",
    url: `https://accessibility.build/cases/${CASE_SLUG}`,
  },
]

const TOC = [
  { id: "what-happened", label: "What happened" },
  { id: "barriers", label: "What the complaint alleged" },
  { id: "timeline", label: "Six years, step by step" },
  { id: "defence", label: "How it was defended" },
  { id: "prevented", label: "Practical lessons" },
  { id: "debate", label: "Public and professional reaction" },
  { id: "record", label: "Correcting the record" },
  { id: "now", label: "What it means now" },
  { id: "sources", label: "Sources" },
  { id: "discussion", label: "Discussion" },
]

async function loadComments(): Promise<PublicComment[]> {
  try {
    const rows = await db
      .select()
      .from(caseComments)
      .where(and(eq(caseComments.caseSlug, CASE_SLUG), eq(caseComments.status, "approved")))
      .orderBy(asc(caseComments.createdAt))
    const owners = ownerUserIds()
    return rows.map((row) => toPublicComment(row, owners))
  } catch (error) {
    // A database outage must never take the case study down with it.
    console.error("Case comments could not be loaded:", error)
    return []
  }
}

export default async function RoblesDominosCasePage() {
  const comments = await loadComments()

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema
        route={`/cases/${CASE_SLUG}`}
        title={pageTitle}
        description={pageDescription}
        datePublished={study.datePublished}
        section="Case study"
        author={{
          name: "The Accessibility.build team",
          url: "https://accessibility.build/about",
          type: "Organization",
        }}
      />

      <article className="bg-white pb-20 dark:bg-slate-950">
        {/* Masthead */}
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/cases" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Case studies
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">Robles v. Domino&apos;s Pizza</li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Case study &middot; Web accessibility litigation
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Robles v. Domino&apos;s Pizza
            </h1>
            <p className="mt-4 font-mono text-xs leading-6 text-slate-500 dark:text-slate-400">
              {study.citation}
            </p>

            <p className="mt-7 max-w-[60ch] font-serif text-xl leading-8 text-slate-800 dark:text-slate-200 sm:text-2xl">
              A blind customer could not complete a pizza order through Domino&apos;s website or
              app. The case established how the ADA&apos;s physical-place nexus applies to those
              digital services in the Ninth Circuit, but it did not decide every issue often
              attributed to it.
            </p>

            <div className="mt-7">
              <PageByline
                route={`/cases/${CASE_SLUG}`}
                reviewer={{
                  name: "The Accessibility.build team",
                  href: "/about",
                  credential: "",
                }}
              />
            </div>

            <CaseFacts facts={study.facts} />
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto grid max-w-6xl gap-x-12 py-14 lg:grid-cols-[13rem_minmax(0,1fr)]">
            <CaseToc entries={TOC} />
            <div className="min-w-0 space-y-14">
              <CaseScopeSummary
                established={[
                  <span key="nexus">
                    In the Ninth Circuit, Title III reaches Domino&apos;s website and app because
                    they connect customers to the goods and services of its physical restaurants.
                  </span>,
                  <span key="website">
                    The district court found the website was not fully accessible in 2021 and
                    rejected the telephone line as an adequate substitute on the evidence presented.
                  </span>,
                  <span key="remedy">
                    The website was ordered to conform to WCAG 2.0, and Robles received $4,000 under
                    California&apos;s Unruh Civil Rights Act.
                  </span>,
                ]}
                notEstablished={[
                  <span key="supreme-court">
                    The Supreme Court did not rule on the merits, and the case did not create a
                    nationwide rule for every website or online-only business.
                  </span>,
                  <span key="app">
                    The app claims were never decided on the merits; they remained disputed until
                    the case ended through settlement and dismissal.
                  </span>,
                  <span key="unknowns">
                    The 2021 order did not specify Level A or AA. Domino&apos;s legal spend,
                    remediation cost, fee resolution and settlement amount are not public.
                  </span>,
                ]}
              >
                <CaseSourceLinks
                  label="Controlling documents"
                  ariaLabel="Controlling documents for the case summary"
                  className="mt-5"
                  sources={[
                    {
                      label: "Ninth Circuit opinion",
                      href: primarySources.ninthCircuit,
                    },
                    {
                      label: "Supreme Court docket",
                      href: primarySources.supremeCourtDocket,
                    },
                    {
                      label: "2021 district-court order",
                      href: primarySources.order2021,
                    },
                    {
                      label: "District-court docket",
                      href: primarySources.districtDocket,
                    },
                  ]}
                />
              </CaseScopeSummary>

              <CaseSection id="what-happened" title="What happened">
                <CaseProse>
                  <p>
                    Guillermo Robles is blind. He uses JAWS on his laptop and VoiceOver on his
                    iPhone. He was unable to order through the website in July 2015, July and
                    September 2016, and February 2017, and through the app in July 2016 and June
                    2019. In September 2016 he sued under Title III of the Americans with
                    Disabilities Act and California&apos;s Unruh Civil Rights Act.
                  </p>
                  <p>
                    His requested relief included an injunction requiring Domino&apos;s to conform
                    its website and app to the Web Content Accessibility Guidelines 2.0, statutory
                    damages under Californian law, and fees, expenses, interest and costs.
                    Domino&apos;s did not resolve the case early. It litigated the question of
                    whether the ADA applied to its website at all, lost in the Ninth Circuit, asked
                    the Supreme Court to take the case, was refused, lost again on the website
                    claims in the district court, and settled on confidential terms in June 2022.
                  </p>
                  <p>
                    The published Ninth Circuit opinion is an important federal appellate authority
                    for the proposition that a website and app can fall within Title III when they
                    connect customers to the goods and services of a physical public accommodation.
                    The public record does not disclose Domino&apos;s litigation spend, remediation
                    cost, legal-fee resolution or settlement amount.
                  </p>
                </CaseProse>
                <CaseSourceLinks
                  ariaLabel="Primary sources for what happened"
                  sources={[
                    {
                      label: "Original complaint",
                      href: primarySources.complaint,
                    },
                    {
                      label: "Ninth Circuit opinion",
                      href: primarySources.ninthCircuit,
                    },
                    { label: "2021 order", href: primarySources.order2021 },
                    {
                      label: "Full docket",
                      href: primarySources.districtDocket,
                    },
                  ]}
                />
              </CaseSection>

              <CaseSection id="barriers" title="What the complaint alleged">
                <CaseProse>
                  <p>
                    The complaint first recited a sixteen-item list of barriers commonly encountered
                    on inaccessible sites and apps. It then identified the defects Robles allegedly
                    encountered more specifically: on the website, graphics without text
                    alternatives, empty links, redundant adjacent links and linked images without
                    text alternatives; in the iOS app, buttons that were not clearly labelled as
                    Apple&apos;s accessibility guidance required, along with missing text
                    alternatives, inaccessible forms and image maps, and inadequate prompting and
                    labelling. Robles alleged that the barriers prevented him from completing the
                    ordering flow with his screen readers.
                  </p>
                  <p>
                    Several expressly alleged defects map to Level A success criteria in WCAG 2.2.
                    That mapping is an editorial comparison, not a criterion-by-criterion finding
                    made by the court. Missing attributes and accessible names are often detectable
                    with automated tools, but automation cannot determine every failure or whether
                    the ordering journey works for a screen-reader user.
                  </p>
                </CaseProse>

                <CaseTable caption="Selected specifically alleged barriers and an editorial WCAG 2.2 mapping">
                  <thead>
                    <tr>
                      <CaseTh>Barrier</CaseTh>
                      <CaseTh>Success criterion</CaseTh>
                      <CaseTh>Level</CaseTh>
                      <CaseTh>Can automation flag some cases?</CaseTh>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <CaseTd>Website graphics with no text alternative</CaseTd>
                      <CaseTd>
                        <Link href="/wcag/1-1-1">1.1.1 Non-text Content</Link>
                      </CaseTd>
                      <CaseTd>A</CaseTd>
                      <CaseTd>Often; alternative quality needs review</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Empty website links containing no text</CaseTd>
                      <CaseTd>
                        <Link href="/wcag/2-4-4">2.4.4 Link Purpose (In Context)</Link>
                      </CaseTd>
                      <CaseTd>A</CaseTd>
                      <CaseTd>Often; link context needs review</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Linked website images with no text alternative</CaseTd>
                      <CaseTd>
                        <Link href="/wcag/1-1-1">1.1.1 Non-text Content</Link> and{" "}
                        <Link href="/wcag/2-4-4">2.4.4 Link Purpose (In Context)</Link>
                      </CaseTd>
                      <CaseTd>A</CaseTd>
                      <CaseTd>Often; link purpose and alternative quality need review</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>iOS app buttons not clearly labelled</CaseTd>
                      <CaseTd>
                        <Link href="/wcag/4-1-2">4.1.2 Name, Role, Value</Link>
                      </CaseTd>
                      <CaseTd>A</CaseTd>
                      <CaseTd>Often; name quality needs review</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Redundant adjacent links</CaseTd>
                      <CaseTd>
                        Not automatically a WCAG failure; assess link purpose and structure
                      </CaseTd>
                      <CaseTd>Context dependent</CaseTd>
                      <CaseTd>No</CaseTd>
                    </tr>
                  </tbody>
                </CaseTable>

                <CasePhoto
                  src="/images/cases/braille.webp"
                  alt="A refreshable braille display: a long, low device with a row of cells, each raising small rounded pins to form braille characters, and round control buttons along the front edge."
                  caption="A refreshable braille display, one way a blind customer can read a web page. A control without a useful accessible name may expose its role without identifying its purpose. Blind users praised the Domino's app's braille support in 2012."
                  credit="Photo by Eddau, Wikimedia Commons, CC0"
                  creditHref="https://commons.wikimedia.org/wiki/File:Refreshable_Braille_display_2010_0123.JPG"
                  width={1600}
                  height={1200}
                />

                <ScreenReaderDemo />

                <ConformanceLevelsDiagram />

                <CaseNote title="The detail that decided the case">
                  <p>
                    Domino&apos;s retained its own expert, a blind accessibility consultant, to
                    assess the site. He found it was not fully accessible and said he could not
                    place a future order using a screen reader. By the time of summary judgment in
                    2021 the court recorded that no expert had found the website fully accessible.
                    Cannon had not tested the website before September 2020, so his findings did not
                    concede each defect Robles said he encountered in 2015 through 2017. They did
                    undermine the argument that Robles&apos;s older browser was the sole cause of
                    the problem.
                  </p>
                </CaseNote>

                <CaseProse className="mt-6">
                  <p>
                    One further fact, which comes from outside the litigation, changes how the
                    failure should be read. Blind users rated the Domino&apos;s iOS app highly in
                    2012 and early 2014, praising the pizza builder and its braille support, and
                    then documented it breaking in October 2014. The company had built something
                    that worked and then shipped releases that users reported had broken it. The
                    record does not identify why the regression occurred, but it illustrates that
                    accessibility can be lost as a product changes.
                  </p>
                </CaseProse>
                <CaseSourceLinks
                  label="Evidence"
                  ariaLabel="Sources for the alleged barriers and accessibility evidence"
                  sources={[
                    {
                      label: "Original complaint",
                      href: primarySources.complaint,
                    },
                    {
                      label: "2021 district-court order",
                      href: primarySources.order2021,
                    },
                    {
                      label: "AppleVis user reports",
                      href: "https://www.applevis.com/apps/ios/food-drink/dominos-pizza-usa",
                    },
                  ]}
                />
              </CaseSection>

              <CaseSection id="timeline" title="Six years, step by step">
                <CaseProse>
                  <p>
                    Marked points are the moments where the dispute could have ended and did not.
                  </p>
                </CaseProse>
                <CourtPathDiagram />

                <CaseTimeline
                  entries={[
                    {
                      date: "Dec 2008",
                      title: "WCAG 2.0 is published",
                      body: "The standard Robles would later ask for becomes a W3C Recommendation, nearly eight years before the complaint.",
                    },
                    {
                      date: "18 Jul 2015",
                      title: "First failed order",
                      body: "Robles cannot complete an order on the website. The court later records further attempts in July 2016, September 2016 and February 2017, and app attempts in July 2016 and June 2019.",
                    },
                    {
                      date: "1 Sep 2016",
                      title: "Complaint filed",
                      emphasis: "pivot",
                      body: "Four causes of action in the Central District of California, covering the website and the app. The complaint asks for a WCAG 2.0-based injunction, statutory damages of $4,000 per violation under California law, attorney's fees, expenses, interest and costs. It does not address whether ordinary telephone ordering was available.",
                    },
                    {
                      date: "Feb 2017",
                      title: "A phone line appears",
                      body: "After the suit is filed, the website begins displaying a number for screen-reader users. The district court notes callers may be placed on hold. Robles later testifies he called twice and waited more than forty-five minutes each time before giving up.",
                    },
                    {
                      date: "20 Mar 2017",
                      title: "Domino's wins round one",
                      emphasis: "pivot",
                      body: "Judge S. James Otero agrees the ADA reaches the website and app, but dismisses all four claims without prejudice under the primary jurisdiction doctrine, holding that ordering compliance with WCAG in the absence of a federal rule flies in the face of due process. He calls on Congress and the Department of Justice to set standards.",
                    },
                    {
                      date: "12 Oct 2018",
                      title: "Argued in the Ninth Circuit",
                      body: "Fourteen disability organisations file in support of Robles. Business groups including the US Chamber of Commerce, the National Retail Federation and the Restaurant Law Center file in support of Domino's.",
                    },
                    {
                      date: "15 Jan 2019",
                      title: "Reversed",
                      emphasis: "pivot",
                      body: "The Ninth Circuit holds the ADA applies, because the site and app connect customers to physical restaurants, a nexus Domino's did not contest. It rejects the due process argument and the primary jurisdiction dismissal, and returns the case for discovery.",
                    },
                    {
                      date: "13 Jun 2019",
                      title: "Petition to the Supreme Court",
                      emphasis: "pivot",
                      body: "Domino's retains Lisa Blatt of Williams and Connolly as Supreme Court counsel. Five amicus briefs are filed in support of the petition. None are filed for Robles.",
                    },
                    {
                      date: "7 Oct 2019",
                      title: "Certiorari denied",
                      emphasis: "pivot",
                      body: "The Supreme Court declines the case without comment. The Ninth Circuit decision stands. Litigation continues for another two years and eight months.",
                    },
                    {
                      date: "23 Jun 2021",
                      title: "Judgment on the website",
                      body: "Judge Jesus G. Bernal grants summary judgment for Robles on the website claims, orders conformance with WCAG 2.0 and awards $4,000. The claims about the app are not resolved; whether it was accessible by then remained a disputed fact.",
                    },
                    {
                      date: "Nov 2021",
                      title: "The parties report a settlement",
                      emphasis: "resolution",
                      body: "The parties file a joint notice saying they have reached a settlement. The case does not end: in January 2022 they tell the court that they were unable to complete it and ask for a trial date.",
                    },
                    {
                      date: "21 Jan 2022",
                      title: "The first settlement fails",
                      body: "The parties notify the court that they have been unable to settle. The remaining app claims and related issues remain pending until a later agreement.",
                    },
                    {
                      date: "6 Jun 2022",
                      title: "Settled",
                      emphasis: "resolution",
                      body: "A second notice of settlement is filed and the case is dismissed with prejudice on 21 June 2022. The agreement's terms are confidential. In a public joint statement, the parties said Domino's was committed to maintaining the accessibility of its website and apps through compliance with WCAG 2.0 Levels A and AA. The app claims are not resolved on the merits before dismissal.",
                    },
                    {
                      date: "Checked 2 Sep 2026",
                      title: "Domino's publishes an accessibility policy",
                      emphasis: "resolution",
                      body: "The company states that it strives to comply with ADA Title III and WCAG 2.0 Levels A and AA, assigns responsibility across its technology, customer care and legal teams, and runs a reporting line and an accessibility email address. The wording is careful: it claims effort rather than conformance, and names the version from the 2021 injunction rather than the current WCAG 2.2.",
                    },
                  ]}
                />
                <CaseSourceLinks
                  label="Timeline record"
                  ariaLabel="Primary documents for the case timeline"
                  sources={[
                    {
                      label: "2017 dismissal",
                      href: primarySources.dismissal2017,
                    },
                    {
                      label: "Ninth Circuit opinion",
                      href: primarySources.ninthCircuit,
                    },
                    {
                      label: "Supreme Court docket",
                      href: primarySources.supremeCourtDocket,
                    },
                    { label: "2021 order", href: primarySources.order2021 },
                    {
                      label: "District-court docket",
                      href: primarySources.districtDocket,
                    },
                  ]}
                />
              </CaseSection>

              <CaseSection id="defence" title="How Domino's defended it">
                <CasePhoto
                  src="/images/cases/ninth-circuit.webp"
                  alt="A courtroom in the James R. Browning United States Court of Appeals Building in San Francisco, with a raised wooden bench beneath an ornate coffered ceiling and a mosaic-tiled arch."
                  caption="The James R. Browning courthouse in San Francisco, home of the Ninth Circuit, where the appeal was argued on 12 October 2018 and decided three months later."
                  credit="Photo by Carol M. Highsmith, Library of Congress, public domain"
                  creditHref="https://commons.wikimedia.org/wiki/File:Courtroom_three_mosaic,_James_R._Browning_U.S._Court_of_Appeals_Building,_San_Francisco,_California_LCCN2010719381.tif"
                  width={1600}
                  height={873}
                />
                <CaseProse>
                  <p>
                    Five arguments, made across three courts. Understanding why four of them failed
                    is the practical value of this case, because they recur in website-accessibility
                    litigation and commentary.
                  </p>
                </CaseProse>

                <CaseTable>
                  <thead>
                    <tr>
                      <CaseTh>Argument</CaseTh>
                      <CaseTh>Where it was made</CaseTh>
                      <CaseTh>Result</CaseTh>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <CaseTd>
                        The website is not a place of public accommodation, so the ADA does not
                        reach it
                      </CaseTd>
                      <CaseTd>District court, Ninth Circuit, cert petition</CaseTd>
                      <CaseTd>
                        Rejected. The statute covers services <em>of</em> a public accommodation,
                        not only services <em>in</em> one.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>
                        Enforcing the ADA online without a federal technical rule violates due
                        process
                      </CaseTd>
                      <CaseTd>District court, Ninth Circuit</CaseTd>
                      <CaseTd>
                        Won in 2017, reversed in 2019. Fair notice of a legal duty is required, not
                        a blueprint for compliance.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Courts should defer to the Department of Justice</CaseTd>
                      <CaseTd>District court, Ninth Circuit</CaseTd>
                      <CaseTd>
                        Won in 2017, reversed in 2019. The DOJ had withdrawn its rulemaking, so
                        delay was not just likely but inevitable.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>A telephone line is an adequate alternative</CaseTd>
                      <CaseTd>District court, 2021</CaseTd>
                      <CaseTd>
                        Rejected on the facts. Two calls, more than forty-five minutes on hold each
                        time. The court did not need to decide every other feature comparison.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Compliance is expensive and the litigation is opportunistic</CaseTd>
                      <CaseTd>Cert petition</CaseTd>
                      <CaseTd>
                        Never tested. Presented as policy argument, not as a legal defence.
                      </CaseTd>
                    </tr>
                  </tbody>
                </CaseTable>

                <CaseQuote source="Ninth Circuit, 15 January 2019">
                  &ldquo;The Constitution only requires that Domino&apos;s receive fair notice of
                  its legal duties, not a blueprint for compliance with its statutory
                  obligations.&rdquo;
                </CaseQuote>

                <CaseProse className="mt-6">
                  <p>
                    The last row is often misunderstood. In its Supreme Court petition Domino&apos;s
                    argued at length that accessibility is costly, citing a grocery chain&apos;s
                    $250,000 estimate, bank estimates reaching $3 million per website and a
                    publishers&apos; floor of $100,000. But those were other companies&apos;
                    numbers, offered as a reason for the Court to take the case. At the Ninth
                    Circuit stage, on its own website, Domino&apos;s did not argue that fixing it
                    would be an undue burden or would fundamentally alter its business, which are
                    the actual statutory defences. The court noted that absence expressly.
                  </p>
                </CaseProse>

                <CaseQuote source="District court, 23 June 2021, on the telephone alternative">
                  &ldquo;No person who has ever waited on hold with customer service, or ever been
                  hungry for a pizza, would find this to be an acceptable substitute for ordering
                  from a website.&rdquo;
                </CaseQuote>

                <CaseProse className="mt-6">
                  <p>
                    At the Supreme Court the argument shifted again. Rather than defend the website
                    in isolation, Domino&apos;s proposed that Title III should be satisfied by the
                    combined means of access a business offers, so that no single channel need be
                    accessible on its own provided the whole adds up to equal enjoyment. Had it been
                    accepted, a working phone line would have excused an unusable website. The Court
                    did not take the case, so the theory was never tested.
                  </p>
                  <p>
                    In its statement on the day certiorari was denied, Domino&apos;s said it had
                    already developed an accessible website and app and pressed for national
                    rulemaking to eliminate what it called a tsunami of website accessibility
                    litigation. That word was Domino&apos;s own, taken from its petition rather than
                    from the business groups supporting it.
                  </p>
                </CaseProse>
                <CaseSourceLinks
                  ariaLabel="Primary sources for Domino's legal arguments"
                  sources={[
                    {
                      label: "2017 dismissal",
                      href: primarySources.dismissal2017,
                    },
                    {
                      label: "Ninth Circuit opinion",
                      href: primarySources.ninthCircuit,
                    },
                    {
                      label: "Certiorari petition",
                      href: primarySources.certPetition,
                    },
                    { label: "2021 order", href: primarySources.order2021 },
                  ]}
                />
              </CaseSection>

              <DefenceScorecard />

              <CaseSection id="prevented" title="Practical lessons from the record">
                <CaseProse>
                  <p>
                    Six points where a different operational or litigation choice could have
                    shortened the dispute. The public record does not disclose what any alternative
                    would have cost.
                  </p>
                </CaseProse>

                <div className="mx-auto mt-6 w-full max-w-2xl">
                  <CaseExitRamp
                    n={1}
                    title="Address basic Level A failures before release"
                    cost={
                      <>
                        Practical step:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          test accessible names, text alternatives and the ordering journey before
                          release.
                        </b>
                      </>
                    }
                  >
                    <p>
                      Automated checks can identify some missing text alternatives and accessible
                      names. Manual keyboard and screen-reader testing is still necessary to
                      determine whether controls are understandable and whether a customer can
                      complete an order.
                    </p>
                  </CaseExitRamp>

                  <CaseExitRamp
                    n={2}
                    title="Give people a way to report a barrier, and answer it"
                    cost={
                      <>
                        Practical step:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          publish a monitored feedback channel with a named owner.
                        </b>
                      </>
                    }
                  >
                    <p>
                      The record says Domino&apos;s began displaying a dedicated screen-reader
                      assistance number after the suit was filed. It does not establish that no
                      other telephone or contact route previously existed. A documented, monitored
                      accessibility channel can nevertheless surface barriers before they become
                      prolonged disputes.
                    </p>
                  </CaseExitRamp>

                  <CaseExitRamp
                    n={3}
                    title="Settle and remediate on receipt of the complaint"
                    cost={
                      <>
                        Record limitation:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          the settlement value, legal spend and remediation cost are not public.
                        </b>
                      </>
                    }
                  >
                    <p>
                      The complaint requested $4,000 per violation under California law, along with
                      fees, expenses, interest and costs. The court ultimately awarded one $4,000
                      recovery, but that later award does not establish what early settlement
                      exposure or remediation would have cost.
                    </p>
                  </CaseExitRamp>

                  <CaseExitRamp
                    n={4}
                    title="Test the workaround before relying on it"
                    cost={
                      <>
                        Practical step:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          measure wait time, availability, privacy and price equivalence.
                        </b>
                      </>
                    }
                  >
                    <p>
                      Domino&apos;s displayed a screen-reader assistance line after the suit began.
                      Robles testified that he called twice and abandoned each call after waiting
                      more than forty-five minutes. On that undisputed evidence, the court rejected
                      the line as an acceptable substitute for website ordering.
                    </p>
                  </CaseExitRamp>

                  <CaseExitRamp
                    n={5}
                    title="Fix it after losing the appeal"
                    cost={
                      <>
                        Procedural fact:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          the case continued for about three and a half years after the Ninth
                          Circuit decision.
                        </b>
                      </>
                    }
                  >
                    <p>
                      In January 2019 the Ninth Circuit held that the ADA applied in this nexus
                      context. Domino&apos;s petitioned the Supreme Court, which declined review,
                      and the parties continued litigating through the 2021 judgment and 2022
                      dismissal.
                    </p>
                  </CaseExitRamp>

                  <CaseExitRamp
                    n={6}
                    title="Do what the company now does anyway"
                    cost={<>Current policy, not proof of past or present conformance.</>}
                  >
                    <p>
                      Domino&apos;s today publishes an accessibility policy naming WCAG 2.0 Levels A
                      and AA, assigns responsibility across its technology, customer care and legal
                      teams, retains third-party accessibility consultants and runs a reporting line
                      and email address. The policy says Domino&apos;s strives to comply; it does
                      not itself prove conformance or disclose the confidential settlement terms.
                    </p>
                  </CaseExitRamp>
                </div>

                <CaseNote title="What the case did not decide">
                  <p>
                    No accessibility overlay was at issue in the complaint, the Ninth Circuit
                    opinion or the 2021 judgment. The case therefore does not establish whether an
                    overlay can satisfy the ADA or WCAG, and the absence or presence of a widget
                    would not by itself prove that the ordering experience is accessible. See our{" "}
                    <Link href="/guides/accessibility-overlays">
                      guide to accessibility overlays
                    </Link>{" "}
                    for why that distinction matters.
                  </p>
                </CaseNote>
              </CaseSection>

              <DefendantPlaybook />

              <CaseSection id="debate" title="Public and professional reaction">
                <CaseProse>
                  <p>
                    The court record is only part of the story. A Hacker News discussion posted
                    after the Supreme Court denial attracted extensive debate, and the public
                    arguments were often different from Domino&apos;s due-process argument in court.
                  </p>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    Developers argued about whether the duty should exist at all
                  </h3>
                  <p>
                    Hacker News records 591 descendants for the discussion. That metadata includes
                    deleted or unavailable items, so it should not be read as 591 surviving
                    substantive comments. The observations below are qualitative, not a frequency
                    analysis.
                  </p>
                </CaseProse>

                <CaseProse>
                  <p>
                    Participants repeatedly raised telephone ordering, the absence of a government
                    technical regulation, implementation cost, litigation incentives and the
                    practical limits of automated testing. Those comments show the range of public
                    reaction; they do not establish how common any position was outside that
                    discussion.
                  </p>
                  <p>
                    At least five surviving comments were posted by one participant who identified
                    as blind. He described web accessibility worsening as frameworks proliferated,
                    rejected separate accessible versions because they tend to fall out of sync, and
                    described accessibility reports and a submitted code change being ignored. This
                    is evidence of one participant&apos;s experience, not a representative survey of
                    blind users.
                  </p>

                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    Blind users had already documented the app breaking
                  </h3>
                  <p>
                    A useful independent record of what Domino&apos;s was like to use was not made
                    by either party. It sits on AppleVis, a community site run by and for blind
                    Apple users, where the app has a page with comments running from 2012 to 2023.
                  </p>
                  <p>
                    In September and November 2012, and again in March 2014, blind users praised it.
                    One described the pizza builder working properly, including putting a topping on
                    one half of the pizza, the exact interaction the litigation was later about.
                    Another praised its support for braille displays. In October 2014 the same
                    community reported it breaking: payment fields could no longer be reached by
                    swiping, the order tracker stopped working, and buttons lost their labels. By
                    July 2023 other users reported it working again.
                  </p>
                  <p>
                    Robles filed in September 2016, after the reported regression. The AppleVis
                    posts independently document that some blind users encountered app barriers
                    before the lawsuit, but they do not test Robles&apos;s device, version or
                    individual experience. The court later denied summary judgment on the app claims
                    because its current accessibility remained a disputed fact.
                  </p>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    Disability organisations answered the no-standard argument
                  </h3>
                  <p>
                    Fourteen disability organisations had backed Robles at the Ninth Circuit. After
                    the denial, the American Council of the Blind answered the no-standard argument
                    on its merits rather than in general terms: accessibility guidelines have
                    existed for decades, and the latitude they leave a business is a benefit to that
                    business rather than a defect. That is the same answer the Ninth Circuit gave
                    when it said flexibility in the standard was a feature rather than a bug.
                  </p>
                  <p>
                    Robles&apos;s own counsel called the certiorari denial the right call on every
                    level, and framed the underlying proposition as one nobody actually disputes:
                    that blind people need access to websites and apps to take part in ordinary
                    life. That framing is worth noticing, because it is precisely the proposition
                    large parts of the public discussion went on to dispute.
                  </p>

                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    Blind organisations backed the case and attacked the machinery around it
                  </h3>
                  <p>
                    This position is more nuanced than a simple choice between supporting all such
                    litigation and opposing accessibility enforcement.
                  </p>
                  <p>
                    In the same month that certiorari was denied, the National Federation of the
                    Blind published an article in its member magazine attacking high-volume
                    accessibility litigation. Lawyers were picking a category of business and filing
                    near-identical complaints in bulk, some of the resulting suits were close to
                    meritless, and small businesses were settling for a few thousand dollars without
                    fixing anything. It warned that bad cases make bad law, and told members to
                    decline invitations to serve as named plaintiffs in such campaigns. A resolution
                    adopted that year condemned mass filings and confidential cash settlements, and
                    called for public settlement agreements with specific remediation commitments
                    instead.
                  </p>
                  <p>
                    At that same convention, the disability rights lawyer Eve Hill, whose firm later
                    helped take this very case to judgment, told an audience of blind people that
                    some blind people and some lawyers treat inaccessible websites as a business
                    opportunity rather than a civil rights problem. Her distinction is the one worth
                    borrowing: the problem is not the number of lawsuits but their quality, and
                    whether the lawyer bringing them can actually litigate. She defended the
                    Domino&apos;s case in the same breath.
                  </p>
                  <p>
                    The documented position was therefore more specific than blanket support for or
                    opposition to litigation: these organisations supported the Domino&apos;s case
                    while criticising high-volume practices that could produce payments without
                    remediation.
                  </p>

                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    Practitioners were harder on both sides than the coverage was
                  </h3>
                  <p>
                    The disability rights lawyer Lainey Feingold, who published a response to the
                    public reaction a week after the denial, spent more of it deflating the result
                    than celebrating it. She also addressed a recurring objection, and it is worth
                    stating plainly because it is a matter of law rather than opinion.{" "}
                    <strong>
                      Title III of the ADA provides no damages to private plaintiffs at all.
                    </strong>{" "}
                    The remedy is an injunction, plus legal fees to a prevailing party, which is the
                    ordinary enforcement mechanism across American civil rights statutes. The $4,000
                    in this case came from a Californian state statute, not the ADA.
                  </p>
                  <p>
                    Criticism of the plaintiffs&apos; bar came from inside the profession too. Karl
                    Groves, an accessibility consultant and court-qualified expert, has argued that
                    mass demand-letter campaigns actively damage the cause: they crowd out
                    collaboration, and they invite judges to treat genuine claims as opportunism. He
                    has advocated collaborative approaches as an alternative. The Domino&apos;s
                    record does not show that the parties used a structured-negotiation process
                    before suit.
                  </p>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    A critique of the nexus approach
                  </h3>
                  <p>
                    Writing in 2019, developer Ben Myers mapped the disagreement between the
                    circuits and warned that resting the duty on a physical connection could end up
                    harming the accessible web rather than advancing it, because it leaves the
                    business that exists only online with the weakest obligation. The pandemic
                    sharpened the point: when venues close, the website is not an adjunct to the
                    service, it is the service.
                  </p>
                </CaseProse>

                <CasePhoto
                  src="/images/cases/supreme-court.webp"
                  alt="The west facade of the United States Supreme Court building, a white marble portico with fluted columns beneath a sculpted pediment."
                  caption="The Supreme Court declined the case on 7 October 2019 without comment. A denial of certiorari produces no opinion on the merits and creates no Supreme Court precedent."
                  credit="Photo by the Architect of the Capitol, Wikimedia Commons, public domain"
                  creditHref="https://commons.wikimedia.org/wiki/File:Flickr_-_USCapitol_-_Supreme_Court_West_Facade_Restoration.jpg"
                  width={1400}
                  height={933}
                />

                <CaseProse>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    The later ruling received less attention
                  </h3>
                  <p>
                    Public discussion peaked around the Supreme Court&apos;s denial of review, even
                    though that event did not decide the merits.
                  </p>
                  <p>
                    The October 2019 event was a denial of certiorari. It decided nothing. It
                    produced no opinion, set no precedent, and did not even tell you which way the
                    court leaned. The adjudication that resolved the website merits was the June
                    2021 summary judgment; the remaining app claims ended through settlement and
                    dismissal in June 2022.
                  </p>
                  <p>
                    The sources reviewed for this article show substantially more public discussion
                    of the 2019 denial than of the 2021 summary-judgment order. That helps explain
                    why some later summaries incorrectly say the Supreme Court ruled on the merits,
                    that Domino&apos;s was fined, or that the court specifically ordered Level AA.
                  </p>

                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    What the record says about the plaintiff
                  </h3>
                  <p>
                    The sources reviewed for this article did not reveal a public interview with
                    Robles; the public statements attributed to his side came from his lawyers.
                    Domino&apos;s told the Supreme Court that he had filed at least fourteen similar
                    lawsuits, a defence characterization rather than a finding made by the Court. In
                    this case, the district court found the website was not fully accessible in
                    2021. Domino&apos;s 2020 expert did not concede every historical defect, while
                    AppleVis posts separately documented an app regression before Robles filed.
                  </p>
                </CaseProse>
              </CaseSection>

              <CaseSection id="record" title="Correcting the record">
                <CaseProse>
                  <p>
                    This case is described inaccurately in a great deal of published commentary,
                    including by vendors selling accessibility products. The differences matter if
                    you are relying on it to brief a board. Eleven claims circulate widely enough to
                    be worth answering directly, each set here against what the filings and the
                    judgment actually say.
                  </p>
                </CaseProse>

                <CaseCorrections>
                  <CaseCorrection
                    claim="The Supreme Court ruled against Domino's."
                    record="The Court denied certiorari on 7 October 2019. A denial is not a ruling on the merits and sets no precedent. The binding decision is the Ninth Circuit's."
                  />
                  <CaseCorrection
                    claim="Domino's was ordered to meet WCAG 2.0 Level AA."
                    record="The June 2021 order requires conformance with the WCAG 2.0 guidelines and specifies no level and no deadline. Level AA appears in Domino's own later policy, not in the order."
                  />
                  <CaseCorrection
                    claim="Domino's was fined."
                    record="There was no fine. $4,000 in statutory damages was awarded under California's Unruh Act, treated as a single violation rather than $4,000 per visit."
                  />
                  <CaseCorrection
                    claim="The plaintiff was in it for the money."
                    record="The record does not establish Robles's subjective motive. His ADA claim offered injunctive relief rather than private damages, while his Unruh Act claims requested $4,000 per violation and the complaint also sought fees and costs. The court disregarded Domino's motive allegations when they failed to dispute the facts to which they were offered as objections."
                  />
                  <CaseCorrection
                    claim="Court documents showed fixing the site would have cost $38,000."
                    record="The reviewed complaint, appellate filings, Supreme Court filings, Ninth Circuit opinion and 2021 judgment do not contain that figure. Its traceable public origin is an August 2019 tweet asserting that Domino's had disclosed it in court papers; the linked article did not state a remediation cost. The public record reviewed here does not establish Domino's remediation cost."
                  />
                  <CaseCorrection
                    claim="The case cost Domino's millions, against a cheap fix."
                    record="The comparison cannot be verified from the public record. Domino's litigation spend, remediation cost, fee resolution and settlement amount are not disclosed. The publicly documented $4,000 figure is the Unruh Act amount awarded to Robles, not the total cost of the case."
                  />
                  <CaseCorrection
                    claim="The cert denial opened the floodgates to web accessibility lawsuits."
                    record="The cited federal series does not show a jump in 2019: it records 2,256 cases, two fewer than in 2018. The large annual increase occurred in 2018, when filings rose 177% from 814 to 2,258 after the Justice Department withdrew its web rulemaking. That timing alone does not prove what caused the increase."
                  />
                  <CaseCorrection
                    claim="The courts ruled the app inaccessible."
                    record="They did not. Summary judgment was denied on both app claims because accessibility was a disputed fact, and the claims were never decided. Only the website was adjudicated."
                  />
                  <CaseCorrection
                    claim="The case established that accessibility overlays cannot substitute for accessible code."
                    record="It established nothing about overlays. No overlay was at issue in the complaint, Ninth Circuit opinion or 2021 judgment. The presence or absence of a widget on Domino's current site would not change what the case decided."
                  />
                  <CaseCorrection
                    claim="Blind people and their organisations were united behind the litigation."
                    record="Fourteen disability organisations supported Robles in the Ninth Circuit. Separately, the National Federation of the Blind criticised high-volume, near-identical accessibility cases and confidential cash settlements while continuing to support the Domino's case. Those records show a distinction between this case and criticism of some litigation practices."
                  />
                  <CaseCorrection
                    claim="The case establishes that all websites are covered by the ADA."
                    record="It does not. The Ninth Circuit relied on the nexus between the website and physical restaurants, and expressly declined to decide the position where no such nexus exists. Other circuits differ."
                  />
                </CaseCorrections>
              </CaseSection>

              <CaseSection id="now" title="What it means now">
                <CaseProse>
                  <p>
                    Domino&apos;s told the Supreme Court that leaving the decision undisturbed would
                    turn a flood of litigation into a tsunami. The filing record does not support
                    the case being the cause. The largest year-over-year increase in the cited
                    federal series occurred in 2018, after the Justice Department withdrew its web
                    accessibility rulemaking in December 2017; that timing does not establish
                    causation.
                  </p>
                </CaseProse>

                <FilingsChart />

                <CaseProse className="mt-8">
                  <p>
                    Certiorari was denied in October 2019, and that year was flat against 2018.
                    Counts that include state courts run considerably higher, so do not mix the two
                    series. A separate EcomBack dataset, which includes federal and state cases,
                    reported that in the first half of 2025 sixteen firms accounted for more than 90
                    percent of its matters and that the firm representing Robles had the largest
                    count in that period. That concentration figure should not be combined with the
                    federal-only chart. Our{" "}
                    <Link href="/research/accessibility-lawsuits">
                      accessibility lawsuit tracker
                    </Link>{" "}
                    keeps the current numbers.
                  </p>
                  <p>
                    One part of Domino&apos;s complaint also turned out to be durable. There is
                    still no federal technical regulation for private business. The rule the Justice
                    Department published in 2024, adopting WCAG 2.1 Level AA, binds state and local
                    government under Title II only.
                  </p>
                </CaseProse>

                <CircuitPositions />

                <CaseProse>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    What has changed since the case closed
                  </h3>
                  <p>
                    Three developments since 2022 bear on the argument this case started, and two of
                    them cut against the plaintiffs&apos; bar rather than for it.
                  </p>
                  <p>
                    In February 2026 the{" "}
                    <Link href="/blog/doj-opposes-website-accessibility-class-settlement-2026">
                      Justice Department filed a statement of interest opposing a proposed class
                      settlement
                    </Link>{" "}
                    in a website accessibility case, objecting that the injunctive relief set out no
                    concrete steps, that monitoring was optional, and that $2.52 million in fees was
                    disproportionate to what class members received. It recorded that the same
                    counsel had filed substantially the same lawsuit more than 500 times between
                    2019 and 2023, mostly resolving in undisclosed individual settlements, and said
                    it opposed using a civil claim principally to enrich class counsel on the backs
                    of disabled people. That is the federal government making, in court, the
                    criticism the National Federation of the Blind made in its member magazine in
                    2019.
                  </p>
                  <p>
                    Second, filings by people representing themselves rose sharply in 2025, which
                    practitioners attribute to{" "}
                    <Link href="/blog/chatgpt-is-filing-ada-lawsuits-pro-se-surge-2026">
                      general-purpose AI tools making a complaint easy to draft
                    </Link>
                    . Third, Missouri has now responded:{" "}
                    <Link href="/blog/missouri-sb-907-accessibility-litigation-safe-harbor">
                      Missouri enacted a safe harbour
                    </Link>{" "}
                    operative from 28 August 2026. It creates a rebuttable presumption concerning
                    allegedly abusive litigation when a defendant takes substantial good-faith steps
                    to correct a noticed violation within ninety days; it does not replace the
                    substantive federal accessibility duty.
                  </p>
                  <p>
                    None of this disturbs the holding. It does mean the honest summary of 2026 is
                    not that enforcement is uncontested, but that Robles&apos;s nexus holding
                    remains binding in the Ninth Circuit while the machinery around it is under
                    pressure from the courts, the regulator and disability organisations alike.
                  </p>

                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    Did any of it make websites better?
                  </h3>
                  <p>
                    WebAIM&apos;s 2021 survey of the top million home pages found the Food and Drink
                    category improving from an average of 66.1 automatically detected errors in 2020
                    to 46.8 in 2021. Its authors said increased accessibility litigation may have
                    contributed to the change.
                  </p>
                  <p>
                    This is an observational category-level comparison. It does not establish that
                    litigation caused the decline, that Domino&apos;s was among the measured sites
                    that improved, or that a blind customer could complete an order. Automated
                    home-page error counts and end-to-end usability are different forms of evidence.
                  </p>
                </CaseProse>

                <RemediationEvidence />

                <CaseProse>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    What to take from it
                  </h3>
                  <ul>
                    <li>
                      <strong>The nexus argument is settled in the Ninth Circuit.</strong> If your
                      website connects customers to a physical location, expect it to be covered.
                    </li>
                    <li>
                      <strong>
                        The absence of a federal technical rule did not erase the duty.
                      </strong>{" "}
                      The Ninth Circuit held that Domino&apos;s had fair notice of its ADA
                      obligation and declined to wait for the Justice Department to issue a
                      technical standard.
                    </li>
                    <li>
                      <strong>An alternative channel must be measured.</strong> The line failed on
                      the facts here because Robles waited more than forty-five minutes on each of
                      two calls. Comparable timing, privacy, independence and access to the same
                      offers should be tested rather than assumed.
                    </li>
                    <li>
                      <strong>Several allegations mapped to Level A criteria.</strong> Missing text
                      alternatives and accessible names can sometimes be detected automatically, but
                      their quality and the usability of a complete journey require manual review.
                    </li>
                    <li>
                      <strong>Your own expert&apos;s findings may narrow a defence.</strong>{" "}
                      Domino&apos;s expert completed ordinary website and app orders in 2020, but
                      found the website was not fully accessible and could not schedule a future
                      website order.
                    </li>
                    <li>
                      <strong>Accessibility is a maintenance property, not a project.</strong> Blind
                      users praised the app in 2012 and reported an October 2014 version broken; the
                      app was part of the complaint filed in 2016.
                    </li>
                  </ul>
                </CaseProse>

                <CaseNote title="A closing note on statements">
                  <p>
                    The policy Domino&apos;s published after all this is worth reading as an object
                    lesson. It is undated. It does not say that conformance has been achieved; it
                    says that the company strives to comply with WCAG 2.0 Levels A and AA, a
                    standard that is now two revisions behind. It gives one telephone number, while
                    the site footer gives a different one. None of that is unlawful, and the
                    governance it describes is more than most companies publish. But it is a
                    statement of intent rather than a statement of achieved conformance. If a
                    statement is the artifact you show a regulator or a procurement team, this is a
                    reminder that it is worth exactly what it commits to. Ours is checked with the{" "}
                    <Link href="/tools/accessibility-statement-checker">
                      accessibility statement checker
                    </Link>
                    .
                  </p>
                </CaseNote>
              </CaseSection>

              <CaseSection
                id="sources"
                title="Sources"
                eyebrow="Primary record and attributed analysis"
              >
                <CaseProse>
                  <p>
                    Court holdings and procedural facts are drawn from the complaint, orders and
                    dockets below. Later policy, filing and community claims are attributed to their
                    own sources. Where the public record is silent, particularly on costs and the
                    confidential settlement, this page does not estimate.
                  </p>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                    Primary
                  </h3>
                  <ul>
                    <li>
                      <a href={primarySources.complaint} target="_blank" rel="noopener noreferrer">
                        Original complaint, Document 1 (1 September 2016)
                      </a>
                    </li>
                    <li>
                      <a
                        href={primarySources.dismissal2017}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        District court dismissal (20 March 2017)
                      </a>
                    </li>
                    <li>
                      <a
                        href={primarySources.ninthCircuit}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ninth Circuit opinion, 913 F.3d 898 (15 January 2019)
                      </a>
                    </li>
                    <li>
                      <a
                        href={primarySources.certPetition}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Domino&apos;s petition for certiorari, No. 18-1539
                      </a>
                    </li>
                    <li>
                      <a
                        href={primarySources.supremeCourtDocket}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Supreme Court docket, No. 18-1539
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.order2021} target="_blank" rel="noopener noreferrer">
                        District court order granting summary judgment (23 June 2021)
                      </a>
                    </li>
                    <li>
                      <a
                        href={primarySources.settlementNotice2021}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Joint notice of settlement (5 November 2021)
                      </a>
                    </li>
                    <li>
                      <a
                        href={primarySources.districtDocket}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Full district court docket
                      </a>
                    </li>
                    <li>
                      <a
                        href={primarySources.settlementUpdate}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        June 2022 settlement update and public joint statement
                      </a>
                    </li>
                    <li>
                      <a
                        href={primarySources.dominosPolicy}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Domino&apos;s accessibility policy text, checked 2 September 2026
                      </a>
                    </li>
                  </ul>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                    Government and filing data
                  </h3>
                  <ul>
                    <li>
                      <a
                        href="https://www.ada.gov/resources/2024-03-08-web-rule/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Justice Department fact sheet on the Title II web and app rule
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.justice.gov/opa/pr/department-justice-opposes-unfair-class-action-settlement-involving-accessibility-website"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Justice Department statement on the Fashion Nova class settlement (2
                        February 2026)
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.senate.mo.gov/26info/pdf-bill/tat/SB907.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Missouri SB 907 enacted text, including the 90-day safe-harbour provision
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Seyfarth Shaw federal website-accessibility filing series, 2017–2025
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.ecomback.com/ada-website-lawsuits-recap-report/2025-mid-year-ada-website-lawsuit-report"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        EcomBack first-half 2025 filing and law-firm dataset
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.adatitleiii.com/2025/10/federal-pro-se-ada-title-iii-and-fha-lawsuit-numbers-surge-likely-powered-by-ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Seyfarth Shaw on the 2025 rise in pro se filings and its AI attribution
                      </a>
                    </li>
                  </ul>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                    Commentary and community
                  </h3>
                  <ul>
                    <li>
                      <a
                        href="https://www.adatitleiii.com/2021/06/court-finds-dominos-pizza-violated-the-ada-by-having-an-inaccessible-website-and-orders-wcag-compliance/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Seyfarth Shaw on the 2021 ruling
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.lflegal.com/2019/10/dominos-comments/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lainey Feingold answering the public reaction
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.applevis.com/apps/ios/food-drink/dominos-pizza-usa"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        AppleVis, blind users on the Domino&apos;s app, 2012 to 2023
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://nfb.org/images/nfb/publications/bm/bm19/bm1909/bm190902.htm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Braille Monitor on drive-by accessibility lawsuits (October 2019)
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://karlgroves.com/drive-by-demand-letters-and-lawsuit-threats-do-not-help-advance-accessibility/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Karl Groves on drive-by demand letters
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://webaim.org/projects/million/2021"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WebAIM Million 2021, on litigation and the food and drink sector
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://news.ycombinator.com/item?id=21188092"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Hacker News discussion and its 591-descendant metadata, 8 October 2019
                      </a>
                    </li>
                    <li>
                      Surviving comments by the self-identified blind participant:{" "}
                      <a
                        href="https://hacker-news.firebaseio.com/v0/item/21189512.json"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        1
                      </a>
                      ,{" "}
                      <a
                        href="https://hacker-news.firebaseio.com/v0/item/21189535.json"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        2
                      </a>
                      ,{" "}
                      <a
                        href="https://hacker-news.firebaseio.com/v0/item/21189647.json"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        3
                      </a>
                      ,{" "}
                      <a
                        href="https://hacker-news.firebaseio.com/v0/item/21190414.json"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        4
                      </a>
                      , and{" "}
                      <a
                        href="https://hacker-news.firebaseio.com/v0/item/21191685.json"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        5
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://threadreaderapp.com/thread/1157019600619483136.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Archived August 2019 thread from which the unsupported $38,000 claim spread
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://benmyers.dev/blog/dominos-1/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ben Myers on the nexus test and the circuit split
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.acb.org/supreme-court-dominos-robles"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        American Council of the Blind on the cert denial
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.americanbar.org/groups/law_practice/resources/law-practice-magazine/2022/law-website-mobile-accessibility/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        American Bar Association overview of the circuit disagreement
                      </a>
                    </li>
                  </ul>
                  <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
                    Nothing on this page is legal advice. Community comments are used as attributed
                    examples of public reaction, not as representative survey evidence. The circuit
                    graphic is an editorial summary and distinguishes square website holdings from
                    positions commonly inferred from broader public-accommodation precedent.
                  </p>
                </CaseProse>
              </CaseSection>

              <CaseComments
                caseSlug={CASE_SLUG}
                caseTitle="Robles v. Domino's Pizza"
                initialComments={comments}
              />

              <div className="border-t-2 border-slate-900 pt-8 dark:border-slate-100">
                <RelatedContent
                  content="ADA Title III web accessibility lawsuit litigation compliance nexus screen reader WCAG conformance"
                  title="Related reading"
                  maxItems={4}
                  showDescriptions
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
