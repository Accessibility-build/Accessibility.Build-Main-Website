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
import {
  ConformanceLevelsDiagram,
  CourtPathDiagram,
} from "@/components/cases/case-illustrations"
import {
  CaseCorrection,
  CaseExitRamp,
  CaseFacts,
  CaseNote,
  CaseProse,
  CaseQuote,
  CaseSection,
  CaseTable,
  CaseTd,
  CaseTh,
  CaseTimeline,
} from "@/components/cases/case-primitives"

const CASE_SLUG = "robles-v-dominos"
const study = getCaseStudy(CASE_SLUG)!

const pageTitle = "Robles v. Domino's: The Web Accessibility Case"
const pageDescription =
  "A blind man could not order a pizza. Every barrier was a Level A failure, and Domino's spent nearly six years and a Supreme Court petition arguing it did not have to fix them. A sourced account of what broke, how it was defended, and the six points where it could have ended."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
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
  { name: "Robles v. Domino's Pizza", url: `https://accessibility.build/cases/${CASE_SLUG}` },
]

const TOC = [
  { id: "what-happened", label: "What happened" },
  { id: "barriers", label: "What actually broke" },
  { id: "timeline", label: "Six years, step by step" },
  { id: "defence", label: "How it was defended" },
  { id: "prevented", label: "What could have prevented it" },
  { id: "debate", label: "How the argument was had" },
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
              A blind man could not order a pizza. Every barrier that stopped him was a{" "}
              <strong className="font-semibold text-rose-800 dark:text-rose-300">Level A</strong>{" "}
              failure, the lowest bar in the accessibility standard. Domino&apos;s spent nearly six
              years and a Supreme Court petition arguing it did not have to fix them, then published
              the commitment the complaint had asked for.
            </p>

            <div className="mt-7">
              <PageByline route={`/cases/${CASE_SLUG}`} />
            </div>

            <CaseFacts facts={study.facts} />
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto grid max-w-6xl gap-x-12 py-14 lg:grid-cols-[13rem_minmax(0,1fr)]">
            <CaseToc entries={TOC} />
            <div className="min-w-0 space-y-14">
            <CaseSection id="what-happened" title="What happened">
              <CaseProse>
                <p>
                  Guillermo Robles is blind. He uses JAWS on his laptop and VoiceOver on his iPhone.
                  Between July 2015 and February 2017 he tried repeatedly to order a customised pizza
                  from a nearby Domino&apos;s, on the website and in the app, and could not complete
                  the order. In September 2016 he sued under Title III of the Americans with
                  Disabilities Act and California&apos;s Unruh Civil Rights Act.
                </p>
                <p>
                  He asked for two things: an injunction requiring Domino&apos;s to conform its
                  website and app to the Web Content Accessibility Guidelines 2.0, and statutory
                  damages under Californian law. Domino&apos;s did not settle. It litigated the
                  question of whether the ADA applied to its website at all, lost in the Ninth
                  Circuit, asked the Supreme Court to take the case, was refused, lost again on the
                  merits in the district court, and settled on confidential terms in June 2022.
                </p>
                <p>
                  The case is now the most cited authority in the United States for the proposition
                  that a retailer&apos;s website and app fall under the ADA when they connect
                  customers to a physical location. It is also the clearest available record of what
                  it costs to argue the opposite.
                </p>
              </CaseProse>
            </CaseSection>

            <CaseSection id="barriers" title="What actually broke">
              <CaseProse>
                <p>
                  The complaint described ordinary defects, not exotic ones. Graphics without text
                  alternatives. Links with no readable text. Redundant links pointing at the same
                  destination. In the iOS app, buttons with no accessible name, which the complaint
                  said did not conform to Apple&apos;s own accessibility guidance. Together they made
                  the ordering flow impossible to complete without sight.
                </p>
                <p>
                  Mapped against WCAG 2.2, every one of these sits at Level A. Level A is not the
                  standard most organisations aim for; it is the floor beneath the standard, and the
                  great majority of these particular defects are detectable by free automated tooling
                  in a single scan.
                </p>
              </CaseProse>

              <CaseTable caption="Barriers alleged, mapped to success criteria">
                <thead>
                  <tr>
                    <CaseTh>Barrier</CaseTh>
                    <CaseTh>Success criterion</CaseTh>
                    <CaseTh>Level</CaseTh>
                    <CaseTh>Automatically detectable</CaseTh>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <CaseTd>Images with no text alternative</CaseTd>
                    <CaseTd>
                      <Link href="/wcag/1-1-1">1.1.1 Non-text Content</Link>
                    </CaseTd>
                    <CaseTd>A</CaseTd>
                    <CaseTd>Yes</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Links with no readable text</CaseTd>
                    <CaseTd>
                      <Link href="/wcag/2-4-4">2.4.4 Link Purpose (In Context)</Link>
                    </CaseTd>
                    <CaseTd>A</CaseTd>
                    <CaseTd>Yes</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Controls with no accessible name</CaseTd>
                    <CaseTd>
                      <Link href="/wcag/4-1-2">4.1.2 Name, Role, Value</Link>
                    </CaseTd>
                    <CaseTd>A</CaseTd>
                    <CaseTd>Yes</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Order flow not conveyed in structure</CaseTd>
                    <CaseTd>
                      <Link href="/wcag/1-3-1">1.3.1 Info and Relationships</Link>
                    </CaseTd>
                    <CaseTd>A</CaseTd>
                    <CaseTd>Partly</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Form fields without labels or instructions</CaseTd>
                    <CaseTd>
                      <Link href="/wcag/3-3-2">3.3.2 Labels or Instructions</Link>
                    </CaseTd>
                    <CaseTd>A</CaseTd>
                    <CaseTd>Partly</CaseTd>
                  </tr>
                </tbody>
              </CaseTable>

              <ScreenReaderDemo />

              <ConformanceLevelsDiagram />

              <CaseNote title="The detail that decided the case">
                <p>
                  Domino&apos;s retained its own expert, a blind accessibility consultant, to assess
                  the site. He found it was not fully accessible and said he could not place a future
                  order using a screen reader. By the time of summary judgment in 2021 the court
                  recorded that no person, on either side, had found the website fully accessible.
                  The central factual allegation was never actually contested.
                </p>
              </CaseNote>

              <CaseProse className="mt-6">
                <p>
                  One further fact, which comes from outside the litigation, changes how the failure
                  should be read. Blind users had rated the Domino&apos;s iOS app highly in 2012 and
                  2013, praising the pizza builder and its braille support, and then documented it
                  breaking in October 2014. The company had built something that worked and then
                  shipped releases that broke it. That is covered below, and it is the difference
                  between a company that never thought about blind customers and one that stopped
                  checking.
                </p>
              </CaseProse>
            </CaseSection>

            <CaseSection id="timeline" title="Six years, step by step">
              <CaseProse>
                <p>Marked points are the moments where the dispute could have ended and did not.</p>
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
                    body: "Four causes of action in the Central District of California, covering the website and the app. The complaint asks for conformance with WCAG 2.0 and $4,000 in statutory damages. It does not mention any telephone service, because there was not one.",
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
                    body: "Domino's retains Lisa Blatt of Williams and Connolly, one of the most prominent Supreme Court advocates in the country. Five amicus briefs are filed in support. None are filed for Robles.",
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
                    title: "Domino's settles rather than appeal again",
                    emphasis: "resolution",
                    body: "Four months after losing, and before the question of attorney's fees is decided, the parties file a first notice of settlement. There is no second appeal.",
                  },
                  {
                    date: "6 Jun 2022",
                    title: "Settled",
                    emphasis: "resolution",
                    body: "A second notice of settlement is filed and the case is dismissed with prejudice on 21 June 2022. The financial terms are confidential, but the plaintiff's counsel publicly confirmed the accessibility term: Domino's committed to maintaining the accessibility of its website and apps through compliance with WCAG 2.0 A and AA. The app claims are never adjudicated.",
                  },
                  {
                    date: "Today",
                    title: "Domino's publishes an accessibility policy",
                    emphasis: "resolution",
                    body: "The company states that it strives to comply with ADA Title III and WCAG 2.0 Levels A and AA, assigns responsibility across its technology, customer care and legal teams, and runs a reporting line and an accessibility email address. The wording is careful: it claims effort rather than conformance, and names the version from the 2021 injunction rather than the current WCAG 2.2.",
                  },
                ]}
              />
            </CaseSection>

            <CaseSection id="defence" title="How Domino's defended it">
              <CaseProse>
                <p>
                  Five arguments, made across three courts. Understanding why four of them failed is
                  the practical value of this case, because they are the arguments most businesses
                  reach for first.
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
                      The website is not a place of public accommodation, so the ADA does not reach it
                    </CaseTd>
                    <CaseTd>District court, Ninth Circuit, cert petition</CaseTd>
                    <CaseTd>
                      Rejected. The statute covers services <em>of</em> a public accommodation, not
                      only services <em>in</em> one.
                    </CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>
                      Enforcing the ADA online without a federal technical rule violates due process
                    </CaseTd>
                    <CaseTd>District court, Ninth Circuit</CaseTd>
                    <CaseTd>
                      Won in 2017, reversed in 2019. Fair notice of a legal duty is required, not a
                      blueprint for compliance.
                    </CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Courts should defer to the Department of Justice</CaseTd>
                    <CaseTd>District court, Ninth Circuit</CaseTd>
                    <CaseTd>
                      Won in 2017, reversed in 2019. The DOJ had withdrawn its rulemaking, so delay
                      was not just likely but inevitable.
                    </CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>A telephone line is an adequate alternative</CaseTd>
                    <CaseTd>District court, 2021</CaseTd>
                    <CaseTd>
                      Rejected on the facts. Two calls, more than forty-five minutes on hold each
                      time. The website also carried discounts available nowhere else, so the phone
                      was not even a price-equivalent channel.
                    </CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Compliance is expensive and the litigation is opportunistic</CaseTd>
                    <CaseTd>Cert petition</CaseTd>
                    <CaseTd>Never tested. Presented as policy argument, not as a legal defence.</CaseTd>
                  </tr>
                </tbody>
              </CaseTable>

              <CaseQuote source="Ninth Circuit, 15 January 2019">
                &ldquo;The Constitution only requires that Domino&apos;s receive fair notice of its
                legal duties, not a blueprint for compliance with its statutory obligations.&rdquo;
              </CaseQuote>

              <CaseProse className="mt-6">
                <p>
                  The last row is the one most commentary gets wrong. In its Supreme Court petition
                  Domino&apos;s argued at length that accessibility is costly, citing a grocery
                  chain&apos;s $250,000 estimate, bank estimates reaching $3 million per website and
                  a publishers&apos; floor of $100,000. But those were other companies&apos; numbers,
                  offered as a reason for the Court to take the case. At the Ninth Circuit stage, on
                  its own website, Domino&apos;s did not argue that fixing it would be an undue
                  burden or would fundamentally alter its business, which are the actual statutory
                  defences. The court noted that absence expressly.
                </p>
              </CaseProse>

              <CaseQuote source="District court, 23 June 2021, on the telephone alternative">
                &ldquo;No person who has ever waited on hold with customer service, or ever been
                hungry for a pizza, would find this to be an acceptable substitute for ordering from
                a website.&rdquo;
              </CaseQuote>

              <CaseProse className="mt-6">
                <p>
                  At the Supreme Court the argument shifted again. Rather than defend the website in
                  isolation, Domino&apos;s proposed that Title III should be satisfied by the
                  combined means of access a business offers, so that no single channel need be
                  accessible on its own provided the whole adds up to equal enjoyment. Had it been
                  accepted, a working phone line would have excused an unusable website. The Court
                  did not take the case, so the theory was never tested.
                </p>
                <p>
                  Publicly, the company held one line throughout. Its statement on the day certiorari
                  was denied said it had already developed an accessible website and app, and pressed
                  for national rulemaking to eliminate what it called a tsunami of website
                  accessibility litigation. That word was Domino&apos;s own, taken from its petition
                  rather than from the business groups supporting it.
                </p>
              </CaseProse>
            </CaseSection>

            <CaseSection id="prevented" title="What could have prevented it">
              <CaseProse>
                <p>Six moments where the outcome was still open. The cost of acting rose at every one.</p>
              </CaseProse>

              <div className="mx-auto mt-6 w-full max-w-2xl">
                <CaseExitRamp
                  n={1}
                  title="Build to Level A in the first place"
                  cost={
                    <>
                      Cost then: <b className="font-semibold text-slate-900 dark:text-white">a developer&apos;s attention during the build.</b>{" "}
                      Cost taken: six years of litigation across three courts.
                    </>
                  }
                >
                  <p>
                    Text alternatives, link text and accessible names for controls are the first
                    things any accessibility standard asks for, and the first things a free automated
                    scan reports. None of the alleged defects required specialist knowledge to find.
                  </p>
                </CaseExitRamp>

                <CaseExitRamp
                  n={2}
                  title="Give people a way to report a barrier, and answer it"
                  cost={
                    <>
                      Cost then:{" "}
                      <b className="font-semibold text-slate-900 dark:text-white">an email address and a named owner.</b>
                    </>
                  }
                >
                  <p>
                    Robles tried to order across at least two years before filing. There was no
                    accessibility contact route on the site until after he sued. A published feedback
                    channel with an owner is the cheapest early warning a business can install, and
                    the courts treat its absence as evidence that access was never considered.
                  </p>
                </CaseExitRamp>

                <CaseExitRamp
                  n={3}
                  title="Settle and remediate on receipt of the complaint"
                  cost={
                    <>
                      Cost then: <b className="font-semibold text-slate-900 dark:text-white">$4,000 plus remediation.</b>{" "}
                      Cost taken: the same remediation, plus six years of fees.
                    </>
                  }
                >
                  <p>
                    The defence firm that tracked this case for the industry later wrote that it
                    likely could have been settled at the outset for a modest amount of money. The
                    statutory damages exposure was $4,000. The injunction ultimately obtained asked
                    for the standard the complaint had named in the first place.
                  </p>
                </CaseExitRamp>

                <CaseExitRamp
                  n={4}
                  title="Test the workaround before relying on it"
                  cost={
                    <>
                      Cost then: <b className="font-semibold text-slate-900 dark:text-white">a staffing decision.</b>
                    </>
                  }
                >
                  <p>
                    Domino&apos;s did respond, by adding a screen-reader assistance line. Nobody
                    appears to have measured whether it worked. Two calls, forty-five minutes of hold
                    music each, and the alternative became evidence against the company rather than a
                    defence. An alternative channel that is not monitored for response time is not an
                    accommodation.
                  </p>
                </CaseExitRamp>

                <CaseExitRamp
                  n={5}
                  title="Fix it after losing the appeal"
                  cost={
                    <>
                      Cost then:{" "}
                      <b className="font-semibold text-slate-900 dark:text-white">remediation and a modest settlement.</b>{" "}
                      Cost taken: a cert petition, then two and a half more years of litigation.
                    </>
                  }
                >
                  <p>
                    In January 2019 the Ninth Circuit told Domino&apos;s plainly that the ADA applied.
                    The company instead retained one of the most expensive appellate practices in the
                    country to ask the Supreme Court to say otherwise.
                  </p>
                </CaseExitRamp>

                <CaseExitRamp
                  n={6}
                  title="Do what the company now does anyway"
                  cost={<>The destination did not change. Only the route, and its price.</>}
                >
                  <p>
                    Domino&apos;s today publishes an accessibility policy naming WCAG 2.0 Levels A
                    and AA, assigns responsibility across its technology, customer care and legal
                    teams, retains third-party accessibility consultants and runs a reporting line
                    and email address. That is, in substance, the remedy the 2016 complaint asked for.
                  </p>
                </CaseExitRamp>
              </div>

              <CaseNote title="What Domino's did not do">
                <p>
                  It did not install an accessibility overlay. A scan of the live site finds no widget
                  from any of the well-known vendors, and the policy describes remediation work with
                  consultants instead. Several overlay companies market this case on their own blogs
                  as an argument for buying their product. The company at the centre of it chose to
                  fix the site. See our{" "}
                  <Link href="/guides/accessibility-overlays">guide to accessibility overlays</Link>{" "}
                  for why that distinction matters.
                </p>
              </CaseNote>
            </CaseSection>

            <CaseSection id="debate" title="How the argument was actually had">
              <CaseProse>
                <p>
                  The court record is only half the story. This case became, for a few weeks in
                  October 2019, the most widely discussed accessibility story on the internet, and the
                  public argument that followed was quite different from the legal one. It is worth
                  reading, because the objections raised there are the objections you will hear in
                  your own organisation.
                </p>
                <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                  Developers argued about whether the duty should exist at all
                </h3>
                <p>
                  The largest single discussion drew 591 comments on the day after certiorari was
                  denied. Coded by theme, the shape of it is revealing.
                </p>
              </CaseProse>

              <CaseTable caption="Recurring themes in the 591-comment thread">
                <thead>
                  <tr>
                    <CaseTh>Theme</CaseTh>
                    <CaseTh numeric>Mentions</CaseTh>
                    <CaseTh>Character of the argument</CaseTh>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <CaseTd>Could he not just telephone?</CaseTd>
                    <CaseTd numeric>67</CaseTd>
                    <CaseTd>The most common response, and the exact defence the court rejected.</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Government should set a standard</CaseTd>
                    <CaseTd numeric>44</CaseTd>
                    <CaseTd>Broad agreement that the rulemaking vacuum is the underlying problem.</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Litigation is abusive</CaseTd>
                    <CaseTd numeric>36</CaseTd>
                    <CaseTd>Asserted confidently, then challenged for evidence rarely produced.</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Accessibility is genuinely hard</CaseTd>
                    <CaseTd numeric>31</CaseTd>
                    <CaseTd>Often about hard cases such as drawing tools, not ordering forms.</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Blind users are too small a market</CaseTd>
                    <CaseTd numeric>22</CaseTd>
                    <CaseTd>Argued explicitly as efficient resource allocation.</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>This is basic work</CaseTd>
                    <CaseTd numeric>17</CaseTd>
                    <CaseTd>Alt text and semantic markup described as day-one knowledge.</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Domino&apos;s own legal theory</CaseTd>
                    <CaseTd numeric>4</CaseTd>
                    <CaseTd>The due process argument the company spent years on barely registered.</CaseTd>
                  </tr>
                  <tr>
                    <CaseTd>Accessibility overlays</CaseTd>
                    <CaseTd numeric>1</CaseTd>
                    <CaseTd>Effectively absent. The overlay industry had not yet claimed this ground.</CaseTd>
                  </tr>
                </tbody>
              </CaseTable>

              <CaseProse className="mt-8">
                <p>
                  Two things stand out. The argument the company actually made, that it lacked fair
                  notice of a specific technical standard, was of almost no interest to working
                  developers. They argued instead about whether the obligation should exist, which was
                  never the legal question.
                </p>
                <p>
                  The second is who was speaking. In a thread of 591 comments about blind people,
                  three comments came from someone identifying as blind. One made the point that
                  accessibility has been getting worse as web frameworks proliferate. Elsewhere a
                  commenter argued that if blind customers genuinely wanted to use these sites they
                  would simply write in and ask for fixes. A disabled developer in the same thread
                  described doing exactly that, submitting a code change to a large platform, and
                  being ignored. The Domino&apos;s record answers it too: there was no accessibility
                  contact route on the site until after the lawsuit was filed.
                </p>

                <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                  Blind users had already documented the app breaking
                </h3>
                <p>
                  The most useful record of what Domino&apos;s was like to use was not made by either
                  party. It sits on AppleVis, a community site run by and for blind Apple users, where
                  the app has a page with comments running from 2012 to 2023.
                </p>
                <p>
                  In late 2012 blind users praised it. One described the pizza builder working
                  properly, including putting a topping on one half of the pizza, the exact
                  interaction the litigation was later about. Another praised its support for braille
                  displays. In October 2014 the same community reported it breaking: payment fields
                  could no longer be reached by swiping, the order tracker stopped working, and
                  buttons lost their labels. By July 2023 other users reported it working again.
                </p>
                <p>
                  Robles filed in September 2016, inside that window. This is independent
                  corroboration, from people with no stake in the case, that the product genuinely
                  regressed. It also explains why the app claims were never resolved: the court
                  refused summary judgment on the app because whether it was accessible by then was
                  genuinely disputed, and a moving target is hard to enjoin.
                </p>

                <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                  Blind organisations backed the case and attacked the machinery around it
                </h3>
                <p>
                  This is the part that almost never survives into secondary coverage, and it is the
                  most interesting position in the whole debate, because it is neither of the two on
                  offer.
                </p>
                <p>
                  In the same month that certiorari was denied, the National Federation of the Blind,
                  the largest blind consumer organisation in the United States, published an article
                  in its member magazine attacking high-volume accessibility litigation. Lawyers were
                  picking a category of business and filing near-identical complaints in bulk, some of
                  the resulting suits were close to meritless, and small businesses were settling for
                  a few thousand dollars without fixing anything. It warned that bad cases make bad
                  law, and told members to decline invitations to serve as named plaintiffs in such
                  campaigns. A resolution adopted that year condemned mass filings and confidential
                  cash settlements, and called for public settlement agreements with specific
                  remediation commitments instead.
                </p>
                <p>
                  At that same convention, the disability rights lawyer Eve Hill, whose firm later
                  helped take this very case to judgment, told an audience of blind people that some
                  blind people and some lawyers treat inaccessible websites as a business opportunity
                  rather than a civil rights problem. Her distinction is the one worth borrowing: the
                  problem is not the number of lawsuits but their quality, and whether the lawyer
                  bringing them can actually litigate. She defended the Domino&apos;s case in the same
                  breath.
                </p>
                <p>
                  So the accurate summary is not that blind people supported the lawsuit or opposed
                  it. Their organisations supported this case and criticised the machinery around it,
                  on the grounds that the machinery was producing cash rather than accessible
                  websites.
                </p>

                <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                  Practitioners were harder on both sides than the coverage was
                </h3>
                <p>
                  Writing after the 2021 judgment, the accessibility consultant Sheri Byrne-Haber
                  criticised Domino&apos;s for continuing to spend on litigation, but also faulted the
                  plaintiff&apos;s team on evidence handling, including failing to preserve the
                  original phone and running expert testing on a different platform from the one the
                  plaintiff actually used.
                </p>
                <p>
                  The disability rights lawyer Lainey Feingold, who published a response to the public
                  reaction a week after the denial, spent more of it deflating the result than
                  celebrating it. She also corrected the most popular objection of all, and it is
                  worth stating plainly because it is a matter of law rather than opinion.{" "}
                  <strong>
                    Title III of the ADA provides no damages to private plaintiffs at all.
                  </strong>{" "}
                  The remedy is an injunction, plus legal fees to a prevailing party, which is the
                  ordinary enforcement mechanism across American civil rights statutes. The $4,000 in
                  this case came from a Californian state statute, not the ADA.
                </p>
                <p>
                  Criticism of the plaintiffs&apos; bar came from inside the profession too. Karl
                  Groves, an accessibility consultant and court-qualified expert, has argued that mass
                  demand-letter campaigns actively damage the cause: they crowd out collaboration, and
                  they invite judges to treat genuine claims as opportunism. His preferred alternative
                  is structured negotiation, which has produced dozens of accessibility agreements
                  with major institutions without anyone filing suit. That is the option Domino&apos;s
                  never took and the one this case never tested.
                </p>
                <p>
                  The most striking thing about the practitioner response, though, is how little of it
                  there was. A page-by-page crawl of the personal sites of many of the field&apos;s
                  best-known technical writers, together with the archives of a major community project
                  and a leading accessibility research group, found no mention of this case at all.
                </p>

                <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                  The ruling that decided the case was never discussed
                </h3>
                <p>
                  Here is the most useful observation about the public record, and it explains why so
                  much of what people believe about this case is wrong.
                </p>
                <p>
                  The moment everybody argued about, in October 2019, was a denial of certiorari. It
                  decided nothing. It produced no opinion, set no precedent, and did not even tell you
                  which way the court leaned. The moment that actually resolved the dispute was the
                  summary judgment of June 2021.
                </p>
                <p>
                  That second event produced no significant discussion anywhere. The community formed
                  its beliefs during a procedural non-event reported under misleading headlines, and
                  was not present for the correction. That is why, years later, people still say the
                  Supreme Court ruled against Domino&apos;s, that the company was fined, and that
                  Level AA was ordered, when none of those things happened.
                </p>

                <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                  The one voice missing throughout is the plaintiff&apos;s
                </h3>
                <p>
                  Across six years of coverage, Guillermo Robles does not appear to have spoken
                  publicly once. Every quotation attributed to his side comes from his lawyers. Court
                  records indicate he was a party to roughly sixteen federal accessibility suits filed
                  in the same district over about a year, which is the pattern that draws the
                  serial-plaintiff criticism. That context belongs in any fair account. So does the
                  fact that the criticism directed at this case was aimed almost entirely at the
                  litigation environment rather than at him, and that the barriers he complained of
                  were real, were conceded by Domino&apos;s own expert, and had been independently
                  documented by other blind users two years before he filed.
                </p>
              </CaseProse>
            </CaseSection>

            <CaseSection id="record" title="Correcting the record">
              <CaseProse>
                <p>
                  This case is described inaccurately in a great deal of published commentary,
                  including by vendors selling accessibility products. The differences matter if you
                  are relying on it to brief a board.
                </p>
              </CaseProse>

              <div className="mx-auto mt-6 w-full max-w-2xl">
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
                  record="He could not have been, under the federal claim. Title III of the ADA gives a private plaintiff no damages whatsoever: the remedy is an injunction, with legal fees to a prevailing party. The $4,000 came from California's Unruh Act and was the statutory minimum."
                />
                <CaseCorrection
                  claim="Court documents showed fixing the site would have cost $38,000."
                  record="No such document exists. The figure originates in a single tweet of 1 August 2019 asserting that Domino's had revealed the number in court filings. The tweet linked to a news article containing no cost figure at all. Searching for the number across the cert petition and its appendix, the appellate brief, the brief in opposition, the reply, all five amicus briefs, the Ninth Circuit opinion and the 2021 judgment returns nothing."
                />
                <CaseCorrection
                  claim="The case cost Domino's millions, against a cheap fix."
                  record="The comparison cannot be sourced on either side. No fee award was ever entered and no bill of costs was filed, so the litigation spend is unpublished, and the settlement was confidential. The only figure in the record is $4,000."
                />
                <CaseCorrection
                  claim="The cert denial opened the floodgates to web accessibility lawsuits."
                  record="Filings fell after it. In the months before the October 2019 denial they ran at about seven a day; for the rest of that year they ran at about four. 2019 closed two cases below 2018. The step change had come a year earlier, when federal filings tripled after the Justice Department withdrew its web rulemaking in December 2017."
                />
                <CaseCorrection
                  claim="The courts ruled the app inaccessible."
                  record="They did not. Summary judgment was denied on both app claims because accessibility was a disputed fact, and the claims were never decided. Only the website was adjudicated."
                />
                <CaseCorrection
                  claim="The case established that accessibility overlays cannot substitute for accessible code."
                  record="It established nothing about overlays. No overlay was at issue, none is mentioned in the opinion or the judgment, and Domino's does not use one. Pages making this claim are typically selling something."
                />
                <CaseCorrection
                  claim="Blind people and their organisations were united behind the litigation."
                  record="They were not, and they said so at the time. The largest US blind consumer organisation spent the month of the cert denial publicly criticising high-volume accessibility litigation while supporting this case."
                />
                <CaseCorrection
                  claim="The case establishes that all websites are covered by the ADA."
                  record="It does not. The Ninth Circuit relied on the nexus between the website and physical restaurants, and expressly declined to decide the position where no such nexus exists. Other circuits differ."
                />
              </div>
            </CaseSection>

            <CaseSection id="now" title="What it means now">
              <CaseProse>
                <p>
                  Domino&apos;s told the Supreme Court that leaving the decision undisturbed would
                  turn a flood of litigation into a tsunami. The filing record does not support the
                  case being the cause. The step change came a year earlier, after the Justice
                  Department withdrew its web accessibility rulemaking in December 2017.
                </p>
              </CaseProse>

              <FilingsChart />

              <CaseProse className="mt-8">
                <p>
                  Certiorari was denied in October 2019, and that year was flat against 2018. Counts
                  that include state courts run considerably higher, so do not mix the two series.
                  Filing is also heavily concentrated: in the first half of 2025, sixteen firms
                  accounted for more than 90 percent of cases and the firm that represented Robles was
                  the single largest filer. Our{" "}
                  <Link href="/research/accessibility-lawsuits">accessibility lawsuit tracker</Link>{" "}
                  keeps the current numbers.
                </p>
                <p>
                  One part of Domino&apos;s complaint also turned out to be durable. There is still no
                  federal technical regulation for private business. The rule the Justice Department
                  published in 2024, adopting WCAG 2.1 Level AA, binds state and local government
                  under Title II only.
                </p>

                <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                  Did any of it make websites better?
                </h3>
                <p>
                  There is one piece of evidence, and it is worth knowing because it is measured
                  rather than asserted. WebAIM&apos;s annual survey of the top million home pages found
                  the food and drink sector improving markedly in the years after this litigation
                  wave, from around 66 detected errors per page to around 47, and its authors
                  attributed part of that improvement to the increase in accessibility litigation in
                  the sector.
                </p>
                <p>
                  Treat that carefully. It measures automatically detectable errors on home pages,
                  which is precisely the class of defect at issue in this case, and precisely not the
                  same thing as a blind customer being able to order a pizza. The honest reading is
                  that litigation demonstrably reduced the machine-detectable failures and tells us
                  nothing directly about whether the experience became usable. That gap is the whole
                  argument between compliance and accessibility, and it is why an audit that stops at
                  the scanner is not an audit.
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
                    <strong>The absence of a federal technical rule is not a defence.</strong> Courts
                    have declined to wait for one, and that position has hardened.
                  </li>
                  <li>
                    <strong>An alternative channel must be measured.</strong> Phone support counts for
                    nothing if nobody checks that a disabled customer can get through in a comparable
                    time, at a comparable price.
                  </li>
                  <li>
                    <strong>Level A defects are the litigation risk.</strong> Not the difficult
                    judgement calls at AA, but missing alternative text and unlabelled buttons, which
                    any scan will surface.
                  </li>
                  <li>
                    <strong>Your own expert may confirm the claim.</strong> Domino&apos;s lost because
                    its own consultant could not place an order.
                  </li>
                  <li>
                    <strong>Accessibility is a maintenance property, not a project.</strong> The app
                    blind users praised in 2012 was broken by 2014 and litigated over in 2016.
                  </li>
                </ul>
              </CaseProse>

              <CaseNote title="A closing note on statements">
                <p>
                  The policy Domino&apos;s published after all this is worth reading as an object
                  lesson. It is undated. It claims no conformance level, saying only that the company
                  strives to comply. It names a standard, WCAG 2.0, that is now two revisions behind.
                  It gives one telephone number, while the site footer gives a different one. None of
                  that is unlawful, and the governance it describes is more than most companies
                  publish. But it is a statement of intent rather than a statement of conformance. If
                  a statement is the artifact you show a regulator or a procurement team, this is a
                  reminder that it is worth exactly what it commits to. Ours is checked with the{" "}
                  <Link href="/tools/accessibility-statement-checker">
                    accessibility statement checker
                  </Link>
                  .
                </p>
              </CaseNote>
            </CaseSection>

            <CaseSection id="sources" title="Sources" eyebrow="Everything above is traceable">
              <CaseProse>
                <p>
                  Primary documents were read directly rather than through secondary summaries. Where
                  the record is silent, particularly on costs, this page says so rather than
                  estimating.
                </p>
                <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">Primary</h3>
                <ul>
                  <li>
                    <a href="https://cdn.ca9.uscourts.gov/datastore/opinions/2019/01/15/17-55504.pdf" target="_blank" rel="noopener noreferrer">
                      Ninth Circuit opinion, 913 F.3d 898 (15 January 2019)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.supremecourt.gov/DocketPDF/18/18-1539/102950/20190613153319483_DominosPetition.pdf" target="_blank" rel="noopener noreferrer">
                      Domino&apos;s petition for certiorari, No. 18-1539
                    </a>
                  </li>
                  <li>
                    <a href="https://www.supremecourt.gov/docket/docketfiles/html/public/18-1539.html" target="_blank" rel="noopener noreferrer">
                      Supreme Court docket, No. 18-1539
                    </a>
                  </li>
                  <li>
                    <a href="https://www.lflegal.com/wp-content/uploads/2021/06/June-23-2021-Dominos-Federal-Court-Order.pdf" target="_blank" rel="noopener noreferrer">
                      District court order granting summary judgment (23 June 2021)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.courtlistener.com/docket/4615111/guillermo-robles-v-dominos-pizza-llc/" target="_blank" rel="noopener noreferrer">
                      Full district court docket
                    </a>
                  </li>
                  <li>
                    <a href="https://www.dominos.com/en/content/accessibility-policy" target="_blank" rel="noopener noreferrer">
                      Domino&apos;s accessibility policy
                    </a>
                  </li>
                </ul>
                <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                  Commentary and community
                </h3>
                <ul>
                  <li>
                    <a href="https://www.adatitleiii.com/2021/06/court-finds-dominos-pizza-violated-the-ada-by-having-an-inaccessible-website-and-orders-wcag-compliance/" target="_blank" rel="noopener noreferrer">
                      Seyfarth Shaw on the 2021 ruling
                    </a>
                  </li>
                  <li>
                    <a href="https://www.lflegal.com/2019/10/dominos-comments/" target="_blank" rel="noopener noreferrer">
                      Lainey Feingold answering the public reaction
                    </a>
                  </li>
                  <li>
                    <a href="https://www.applevis.com/apps/ios/food-drink/dominos-pizza-usa" target="_blank" rel="noopener noreferrer">
                      AppleVis, blind users on the Domino&apos;s app, 2012 to 2023
                    </a>
                  </li>
                  <li>
                    <a href="https://nfb.org/images/nfb/publications/bm/bm19/bm1909/bm190902.htm" target="_blank" rel="noopener noreferrer">
                      Braille Monitor on drive-by accessibility lawsuits (October 2019)
                    </a>
                  </li>
                  <li>
                    <a href="https://karlgroves.com/drive-by-demand-letters-and-lawsuit-threats-do-not-help-advance-accessibility/" target="_blank" rel="noopener noreferrer">
                      Karl Groves on drive-by demand letters
                    </a>
                  </li>
                  <li>
                    <a href="https://webaim.org/projects/million/2021" target="_blank" rel="noopener noreferrer">
                      WebAIM Million 2021, on litigation and the food and drink sector
                    </a>
                  </li>
                  <li>
                    <a href="https://news.ycombinator.com/item?id=21188092" target="_blank" rel="noopener noreferrer">
                      The 591-comment developer discussion, 8 October 2019
                    </a>
                  </li>
                </ul>
                <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
                  Nothing on this page is legal advice. Reddit blocks automated access and its
                  archives are no longer openly queryable, so the developer threads were recovered
                  from web archive snapshots and the blind community&apos;s own forum discussion could
                  not be read.
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
