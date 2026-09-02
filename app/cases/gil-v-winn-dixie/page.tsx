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
import { CasePhoto } from "@/components/cases/case-photo"
import { CircuitPositions } from "@/components/cases/case-graphics"
import { CourtPathDiagram } from "@/components/cases/case-illustrations"
import { CaptureSeries, MoneyBars, TwoClocks, VoiceShare } from "@/components/cases/case-charts"
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

const CASE_SLUG = "gil-v-winn-dixie"
const study = getCaseStudy(CASE_SLUG)!

const pageTitle = "Gil v. Winn-Dixie: The Web Accessibility Trial"
const pageDescription =
  "A sourced account of Gil v. Winn-Dixie: the only web accessibility case tried to judgment, what the trial found, the $37,000 estimate, the Eleventh Circuit reversal, and why the opinion was erased as moot."

const primarySources = {
  verdict:
    "https://www.govinfo.gov/content/pkg/USCOURTS-flsd-1_16-cv-23020/pdf/USCOURTS-flsd-1_16-cv-23020-3.pdf",
  dojStatement: "https://archive.ada.gov/briefs/winn_dixie_soi.pdf",
  panelOpinion: "https://media.ca11.uscourts.gov/opinions/pub/files/201713467.pdf",
  vacatur: "https://media.ca11.uscourts.gov/opinions/pub/files/201713467.ord.pdf",
  enBancPetition:
    "https://www.adatitleiii.com/wp-content/uploads/sites/25/2021/04/winn-dixie-FILED-en-banc-PDF-April-15-d.pdf",
  chamberBrief:
    "https://www.uschamber.com/assets/documents/U.S.20Chamber2C20et20al.20Amicus20Brief20-20Winn-Dixie20Stores2C20Inc.20v.20Gil2028Eleventh20Circuit29.pdf",
  docket: "https://www.pacermonitor.com/public/case/15211688/Gil_v_Winn_Dixie_Stores,_Inc",
  accessibilityStatement: "https://www.winndixie.com/about/accessibility-statement",
}

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  authors: [{ name: "The Accessibility.build team", url: "https://accessibility.build/about" }],
  creator: "The Accessibility.build team",
  publisher: "Accessibility.build",
  keywords: [
    "Gil v Winn-Dixie",
    "Winn-Dixie accessibility lawsuit",
    "Winn-Dixie ADA website",
    "Eleventh Circuit website accessibility",
    "web accessibility trial",
    "ADA Title III website",
    "website public accommodation",
    "vacated as moot",
    "screen reader lawsuit",
    "WCAG 2.0 injunction",
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
        url: `/api/og?title=${encodeURIComponent("Gil v. Winn-Dixie Stores")}&section=Case study`,
        width: 1200,
        height: 630,
        alt: "Gil v. Winn-Dixie Stores case study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Gil v. Winn-Dixie Stores")}&section=Case study`],
  },
}

// Comments are read at request time but the page is cached, so the thread is
// server-rendered without making every visit hit the database.
export const revalidate = 300

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Case Studies", url: "https://accessibility.build/cases" },
  { name: "Gil v. Winn-Dixie Stores", url: `https://accessibility.build/cases/${CASE_SLUG}` },
]

const TOC = [
  { id: "what-happened", label: "What happened" },
  { id: "trial", label: "What the trial found" },
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

export default async function GilWinnDixieCasePage() {
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
                <li className="text-slate-900 dark:text-white">Gil v. Winn-Dixie Stores</li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Case study &middot; Web accessibility litigation
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Gil v. Winn-Dixie Stores
            </h1>
            <p className="mt-4 font-mono text-xs leading-6 text-slate-500 dark:text-slate-400">
              {study.citation}
            </p>

            <p className="mt-7 max-w-[60ch] font-serif text-xl leading-8 text-slate-800 dark:text-slate-200 sm:text-2xl">
              A blind customer could not refill a prescription or clip a coupon on a grocery
              chain&apos;s website. It is the only web accessibility case ever tried to judgment.
              He won. An appeals court reversed. Then the court erased its own opinion, because the
              order it was reviewing had expired while it deliberated.
            </p>

            <div className="mt-7">
              <PageByline
                route={`/cases/${CASE_SLUG}`}
                reviewer={{ name: "The Accessibility.build team", href: "/about", credential: "" }}
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
                  <>
                    After a two-day bench trial, a federal judge found that Winn-Dixie&apos;s website
                    was a service of its stores and that its inaccessibility violated the ADA.
                  </>,
                  <>
                    The only cost evidence at trial put remediation at $37,000 or less. Winn-Dixie had
                    budgeted $250,000 and had spent $2 million and then $7 million building the site.
                  </>,
                  <>
                    The injunction named WCAG 2.0 and no conformance level, and expired after three
                    years by its own terms.
                  </>,
                  <>
                    A divided Eleventh Circuit panel reversed in April 2021, then vacated its own
                    opinion and the trial judgment in December 2021 because the case had become moot.
                  </>,
                ]}
                notEstablished={[
                  <>
                    Whether websites are places of public accommodation in Florida, Georgia and
                    Alabama. The vacated opinion binds no court.
                  </>,
                  <>
                    Any damages. Title III of the ADA provides none, and none were sought or awarded.
                  </>,
                  <>
                    What Winn-Dixie spent on five and a half years of litigation. No fee was ever
                    paid on the record, and the figure is unpublished.
                  </>,
                  <>
                    A circuit split with the Ninth Circuit&apos;s Domino&apos;s decision. It existed
                    for eight months and was then removed.
                  </>,
                ]}
              />

              <CaseSection id="what-happened" title="What happened">
                <CaseProse>
                  <p>
                    Juan Carlos Gil is legally blind and has cerebral palsy. He has lived in Miami for
                    twenty-five years, uses the JAWS screen reader for almost everything, and had
                    shopped at Winn-Dixie since a school trip in 1999, when the Florida School for the
                    Deaf and Blind took its vending-programme students to the store to learn to buy
                    stock. He kept going because the prices were low and his only income was Social
                    Security. He estimated thirty to forty visits.
                  </p>
                  <p>
                    In 2015 and 2016 he heard, from television advertising and from people at the
                    Center for Independent Living, the American Council of the Blind and the National
                    Federation of the Blind, that Winn-Dixie had a website where you could refill a
                    prescription and load digital coupons onto your rewards card. He was interested
                    because, as the trial judge later recorded, he could finally do something
                    independently without asking somebody for help. He spent about half an hour on
                    the site. Roughly nine in ten of its controls did nothing for his screen reader.
                    He could not reach the store locator.
                  </p>
                  <p>
                    He sued on 12 July 2016 under Title III of the Americans with Disabilities Act,
                    seeking an injunction, a declaration and fees, and nothing else, because Title III
                    gives a private plaintiff nothing else. Winn-Dixie argued that its website was not
                    a place of public accommodation and that nothing on it stopped Gil walking into a
                    store. The Justice Department filed a statement backing Gil. The judge refused to
                    dismiss the case, tried it over two days in June 2017, and found for Gil in a
                    thirteen-page verdict that is still the only trial judgment in the field.
                  </p>
                  <p>
                    Winn-Dixie appealed. The Eleventh Circuit heard argument in October 2018 and then
                    said nothing for thirty months. In that silence the three-year injunction ran its
                    course and expired. When the panel finally ruled, in April 2021, it reversed two to
                    one and held that a website is not a place of public accommodation. Gil asked for
                    rehearing, pointing out that there was nothing left to decide. In December 2021
                    the same panel agreed, vacated its opinion and the judgment beneath it, and sent
                    the case back to be dismissed. Winn-Dixie asked the full court to rescue its win.
                    It was refused in March 2022.
                  </p>
                </CaseProse>

                <CourtPathDiagram
                  stops={[
                    { court: "District Court", year: "2017", outcome: "Judgment for Gil", tone: "plaintiff" },
                    { court: "Eleventh Circuit", year: "2021", outcome: "Reversed, 2 to 1", tone: "defence" },
                    { court: "Eleventh Circuit", year: "2021", outcome: "Opinion vacated", tone: "neutral" },
                    { court: "Eleventh Circuit", year: "2022", outcome: "Rehearing refused", tone: "neutral" },
                    { court: "District Court", year: "2022", outcome: "Dismissed as moot", tone: "neutral" },
                  ]}
                  duration="5 years, 8 months"
                />

                <CasePhoto
                  src="/images/cases/miami-courthouse.webp"
                  alt="The lawn and columned entrance of the Wilkie D. Ferguson Jr. United States Courthouse in Miami, palm trees behind, with the word Courthouse carved above the entrance."
                  caption="The federal courthouse in Miami, where the case was tried over two days in June 2017. The verdict is thirteen pages long and remains the only trial judgment on website accessibility under the ADA."
                  credit="Carol M. Highsmith, Library of Congress. Public domain."
                  creditHref="https://commons.wikimedia.org/wiki/File:Environmental_art_%22Flutter%22_at_the_NE_and_SE_lawn_quadrants_of_the_Wilkie_D._Ferguson,_Jr.,_U.S._Courthouse,_Miami,_Florida_LCCN2010720278.tif"
                  width={1400}
                  height={1051}
                  priority
                />
              </CaseSection>

              <CaseSection id="trial" title="What the trial found">
                <CaseProse>
                  <p>
                    Most accessibility cases end in a settlement, so the public record consists of a
                    complaint and a press release. This one produced sworn testimony from both sides,
                    and the judge&apos;s findings of fact are worth reading in full. They contain
                    three things a boardroom summary usually leaves out.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    The customer&apos;s side
                  </h3>
                  <p>
                    Gil testified that refilling a prescription in person meant asking an employee to
                    walk him to the pharmacy and then saying his medications aloud at the counter, not
                    knowing who was standing nearby. Coupons meant asking a friend to read the
                    newspaper to him, or asking employees who sometimes seemed annoyed. Publix and
                    Walgreens both had websites that worked with his screen reader; he used them to
                    build a shopping list, hand it to an employee, and collect prescriptions without
                    announcing them. On Winn-Dixie&apos;s site the tab key reached almost nothing,
                    there was no search shortcut, and he could not find a store. He had used five or
                    six hundred other websites that worked. There was no accessibility notice and no
                    way to report the problem.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    The company&apos;s side
                  </h3>
                  <p>
                    Winn-Dixie&apos;s witness was Rodney Cornwell, vice president of IT at its parent,
                    Southeastern Grocers. His evidence did more for the plaintiff than the
                    plaintiff&apos;s own expert did. The website had been built in September 2015 and,
                    he said, there had been no discussion whatsoever of accessibility. It had cost $2
                    million. It was rebuilt for the Plenti rewards programme at a cost of $7 million,
                    again with no accessibility work. It had never been tested with a screen reader.
                    The company had no accessibility policy, was building one, had set aside $250,000
                    to make the site accessible, and considered the work feasible. A new executive
                    team, several of whom had come from Australia where accessibility was mandated,
                    had decided to do it regardless of the lawsuit.
                  </p>
                  <p>
                    He also confirmed the facts that later decided the appeal: the site sold nothing;
                    coupons could be linked to a rewards card only through the site; existing
                    prescriptions could be refilled online for collection in store; and 495 stores
                    across five states were listed on it.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    The expert&apos;s side
                  </h3>
                  <p>
                    Chris Keroack of Equal Entry, a former Microsoft accessibility tester, had run an
                    automated scan and a manual pass with the NVDA screen reader over the home page,
                    the coupons, the store locator and the pharmacy section. He told the court that
                    most of the problems could be corrected with simple changes to source code, that
                    WCAG addressed every one of them, and that a full audit followed by eighty to one
                    hundred hours of remediation and a re-test would cost $37,000 or less. He could
                    not imagine, he said, that it would ever cost in the neighbourhood of $250,000.
                    Google Maps, which powered the store locator, was already conformant.
                  </p>
                </CaseProse>

                <MoneyBars
                  title="Every dollar figure in the record, to one scale"
                  lede="The judge said the difference between the two remediation estimates was of no moment. Drawn against what the company had already spent on the site, it is easy to see why."
                  items={[
                    { label: "Rebuild for the Plenti programme", note: "Cornwell testimony, 2016 to 2017", value: 7_000_000, tone: "spend" },
                    { label: "Building the site", note: "Cornwell testimony, September 2015", value: 2_000_000, tone: "spend" },
                    { label: "Budget set aside for accessibility", note: "Cornwell testimony", value: 250_000, tone: "estimate" },
                    { label: "Fees and costs awarded to Gil's lawyers", note: "Order of 15 August 2017, stayed pending appeal", value: 105_271, tone: "award" },
                    { label: "Expert's estimate to fix everything", note: "Keroack testimony, ceiling figure", value: 37_000, tone: "estimate" },
                    { label: "Damages to Gil", note: "Title III of the ADA provides none", value: 0, tone: "none" },
                  ]}
                  note="Winn-Dixie's own litigation spend across two courts and five and a half years is not in the record. No fee award against it was ever paid, and the fee order itself was left in doubt when the judgment was vacated."
                />

                <CaseQuote source="Verdict and Order Following Non-Jury Trial, 12 June 2017, Judge Robert N. Scola Jr.">
                  The Court finds that whether the cost to modify the website is $250,000 or $37,000
                  is of no moment. Though that higher cost seems high, it pales in comparison to the
                  $2 million Winn-Dixie spent in 2015 to open the website and the $7 million it spent
                  in 2016 to remake the website for the Plenti program.
                </CaseQuote>

                <CaseProse className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    What the court ordered
                  </h3>
                  <p>
                    The judge held that he did not need to decide whether the website was a public
                    accommodation in itself, because it was heavily integrated with the stores and
                    operated as a gateway to them. He then set out the injunction as a numbered list
                    with the dates left blank for the parties to negotiate. Its substance is worth
                    quoting because it is routinely misdescribed.
                  </p>
                </CaseProse>

                <CaseTable caption="Terms of the injunction as set out in the verdict, with the dates left for the parties to agree">
                  <thead>
                    <tr>
                      <CaseTh>Term</CaseTh>
                      <CaseTh>What the order actually says</CaseTh>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <CaseTd>Standard</CaseTd>
                      <CaseTd>
                        A web accessibility policy ensuring the site &ldquo;conforms with the WCAG
                        2.0 criteria&rdquo;. No conformance level is named.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Devices</CaseTd>
                      <CaseTd>Accessible to people using computers, laptops, tablets and smartphones.</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Third parties</CaseTd>
                      <CaseTd>
                        Any vendor participating on the site must conform with WCAG 2.0. The judge
                        found third-party components were no legal impediment.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Public statement</CaseTd>
                      <CaseTd>
                        An accessibility policy linked from the home page, with an accessible way to
                        report problems.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Training</CaseTd>
                      <CaseTd>
                        Mandatory, at least yearly, for everyone who writes code for or publishes
                        content to the site.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Testing</CaseTd>
                      <CaseTd>Automated accessibility tests at least every three months.</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Enforcement</CaseTd>
                      <CaseTd>
                        Gil must give notice of a breach; Winn-Dixie has thirty days to fix it before
                        he can return to court.
                      </CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Duration</CaseTd>
                      <CaseTd>
                        Three years, in light of what the court called the defendant&apos;s sincere
                        and serious intent to make its website accessible to all.
                      </CaseTd>
                    </tr>
                  </tbody>
                </CaseTable>

                <CaseNote title="The detail that decided everything">
                  <p>
                    The three-year limit was a courtesy to a defendant the judge believed was already
                    fixing the problem. It became the reason the case produced no law. The injunction
                    took effect on 5 July 2017 and expired on 5 July 2020, twenty-one months after
                    the appeal was argued and nine months before it was decided.
                  </p>
                </CaseNote>

                <CaseSourceLinks
                  ariaLabel="Sources for the trial findings"
                  sources={[
                    { label: "Trial verdict, 12 June 2017", href: primarySources.verdict },
                    { label: "Justice Department statement of interest, December 2016", href: primarySources.dojStatement },
                  ]}
                />
              </CaseSection>

              <CaseSection id="timeline" title="Six years, step by step">
                <CaseProse>
                  <p>
                    The dates matter here more than in most cases, because the outcome turned on a
                    gap between two of them. The three-year clock on the injunction and the
                    thirty-month clock on the appeal ran at the same time, and the first ran out.
                  </p>
                </CaseProse>

                <CaseTimeline
                  entries={[
                    {
                      date: "Sep 2015",
                      title: "The website is built",
                      body: "Winn-Dixie's corporate witness later testified that the $2 million build involved no discussion of accessibility whatsoever and was never tested with a screen reader.",
                    },
                    {
                      date: "2015 to 2016",
                      title: "Gil tries the site",
                      body: "About half an hour, most controls unreachable, no store locator, no accessibility notice and no way to report the problem.",
                    },
                    {
                      date: "12 Jul 2016",
                      title: "Complaint filed",
                      body: "Southern District of Florida, assigned to Judge Robert N. Scola Jr. Gil is represented by Scott R. Dinin of Miami; Winn-Dixie by Nelson Mullins Riley & Scarborough.",
                      emphasis: "pivot",
                    },
                    {
                      date: "12 Dec 2016",
                      title: "The Justice Department intervenes",
                      body: "A statement of interest argues that Winn-Dixie's position cannot be squared with the statute, the regulations or the case law, and that a grocery chain's website must be accessible unless doing so would be an undue burden.",
                    },
                    {
                      date: "15 Mar 2017",
                      title: "Motion for judgment on the pleadings denied",
                      body: "The court relies on the Eleventh Circuit's Rendon decision, which held that the ADA reaches intangible barriers as well as physical ones.",
                    },
                    {
                      date: "5 to 6 Jun 2017",
                      title: "Trial",
                      body: "Two days, no jury. Three witnesses: Gil, Winn-Dixie's IT vice president, and the plaintiff's accessibility expert.",
                    },
                    {
                      date: "12 Jun 2017",
                      title: "Verdict for Gil",
                      body: "The website is a service of the stores; its inaccessibility denied Gil full and equal enjoyment; the cost of fixing it is of no moment; injunction to follow, expiring in three years.",
                      emphasis: "resolution",
                    },
                    {
                      date: "5 Jul 2017",
                      title: "Injunction takes effect",
                      body: "Three-year term begins.",
                    },
                    {
                      date: "15 Aug 2017",
                      title: "Fees awarded",
                      body: "$99,879 in fees and $5,392.06 in costs, unopposed as to amount, stayed until the appeal concludes.",
                    },
                    {
                      date: "17 Oct 2017",
                      title: "Business groups file in support of the appeal",
                      body: "The US Chamber of Commerce leads a coalition of twelve organisations, including the National Retail Federation, the American Bankers Association and the National Association of Realtors, urging the court to hold that Title III does not extend to websites.",
                    },
                    {
                      date: "27 Mar 2018",
                      title: "Parent company enters Chapter 11",
                      body: "Southeastern Grocers files for bankruptcy protection to restructure its debt, with the appeal pending.",
                    },
                    {
                      date: "4 Oct 2018",
                      title: "Oral argument in the Eleventh Circuit",
                      body: "Judges Jill Pryor and Elizabeth Branch, with Chief District Judge Danny Reeves of Kentucky sitting by designation.",
                    },
                    {
                      date: "5 Jul 2020",
                      title: "The injunction expires",
                      body: "Twenty-one months after argument, with no decision. Nothing in the case now requires anyone to do anything.",
                      emphasis: "pivot",
                    },
                    {
                      date: "7 Apr 2021",
                      title: "Panel reverses, two to one",
                      body: "Judge Branch, joined by Judge Reeves: websites are not places of public accommodation, and this one was not an intangible barrier to the stores. Judge Pryor dissents at length.",
                      emphasis: "pivot",
                    },
                    {
                      date: "15 Apr 2021",
                      title: "Gil petitions for rehearing",
                      body: "Two arguments: the panel abandoned the circuit's nexus standard, and the case is moot because the injunction has expired.",
                    },
                    {
                      date: "28 Dec 2021",
                      title: "Opinion and judgment vacated",
                      body: "The same panel grants rehearing, finds the appeal moot, vacates its opinion and the trial judgment, and remands for dismissal.",
                      emphasis: "resolution",
                    },
                    {
                      date: "2 Mar 2022",
                      title: "Winn-Dixie's bid to keep its win refused",
                      body: "The full court denies rehearing on the mootness question.",
                    },
                    {
                      date: "10 Mar 2022",
                      title: "Case dismissed as moot",
                      body: "The mandate issues and the district court dismisses. After five years and eight months, no order in the case is in force.",
                      emphasis: "resolution",
                    },
                  ]}
                />

                <TwoClocks
                  title="Two clocks that ran at once"
                  lede="The injunction Winn-Dixie was appealing had a three-year life. The appeal took longer than that. Once the order expired there was nothing left for the court to reverse, which is why its reversal could not stand."
                  from="2017-01-01"
                  to="2022-07-01"
                  bars={[
                    { label: "The injunction", start: "2017-07-05", end: "2020-07-05", tone: "injunction" },
                    { label: "The appeal", start: "2017-08-15", end: "2021-12-28", tone: "appeal" },
                  ]}
                  markers={[
                    { label: "Argued 4 Oct 2018", date: "2018-10-04" },
                    { label: "Injunction expires 5 Jul 2020", date: "2020-07-05" },
                    { label: "Opinion 7 Apr 2021", date: "2021-04-07" },
                    { label: "Vacated 28 Dec 2021", date: "2021-12-28" },
                  ]}
                  summary="The court took thirty months from argument to opinion. The injunction had nine months left when it was argued and had been dead for nine months when the opinion arrived."
                />
              </CaseSection>

              <CaseSection id="defence" title="How Winn-Dixie defended it">
                <CaseProse>
                  <p>
                    The defence ran on one idea at every stage: the website is not a place, and
                    nothing about it stops a blind customer walking into the store. That argument
                    failed at trial, succeeded for eight months on appeal, and then ceased to exist.
                    Two things it never argued deserve attention.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    At trial
                  </h3>
                  <p>
                    Winn-Dixie did not dispute that its stores were public accommodations, that Gil
                    was disabled, or that the site failed with a screen reader. It argued that Gil had
                    not been denied access to the stores themselves. The judge answered that the ADA
                    does not merely require physical access; it requires full and equal enjoyment of
                    the services of a place, and the pharmacy management system, the digital coupons
                    and the store locator were undoubtedly services of the stores. He added a sentence
                    with no legal weight and considerable moral weight: those services are especially
                    important for blind customers, for whom paper coupons, finding a store and going
                    to a pharmacy counter are difficult or impossible.
                  </p>
                  <p>
                    Winn-Dixie presented no evidence that the work would be unduly burdensome. Its
                    own witness said it was feasible and under way. That left the court free to find
                    the cost of no moment, and it did.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    On appeal
                  </h3>
                  <p>
                    The majority opinion by Judge Branch worked through the statute&apos;s twelve
                    categories of public accommodation, found every one of them a tangible physical
                    place, and held that websites are not among them. It then turned to the
                    circuit&apos;s own precedent, Rendon, in which a telephone screening line for a
                    game show was held to be an intangible barrier to the privilege of appearing on
                    the show. The difference, the majority said, was that the phone line had been the
                    only way in. Winn-Dixie&apos;s site was a limited-use convenience. It was not a
                    point of sale. Everything started on it had to be finished in a store, and nothing
                    prevented Gil from shopping there, as he had for years before he freely chose to
                    stop.
                  </p>
                  <p>
                    The majority expressly declined to adopt the nexus test, and it distinguished the
                    Ninth Circuit&apos;s decision in{" "}
                    <Link href="/cases/robles-v-dominos">Robles v. Domino&apos;s</Link> on the facts:
                    Domino&apos;s sold pizza through its site and app, and Winn-Dixie sold nothing
                    through its site. A footnote recorded that Gil&apos;s counsel had conceded at
                    argument that Winn-Dixie was not required to have a website at all and could
                    simply remove it.
                  </p>
                </CaseProse>

                <CaseQuote source="Judge Jill Pryor, dissenting, 7 April 2021">
                  Winn-Dixie&apos;s customers could obtain the in-store prescription and coupon
                  benefits only by accessing Winn-Dixie&apos;s website. But visually-impaired
                  customers could not access the website. Winn-Dixie&apos;s visually-impaired
                  customers therefore were treated differently than its sighted customers and denied
                  the full and equal enjoyment of services, privileges, and advantages offered by
                  Winn-Dixie stores.
                </CaseQuote>

                <CaseProse className="mt-8">
                  <p>
                    The dissent, thirty-four pages long, argued that the statute protects the services
                    of a place, not services in a place; that express refills and linked coupons were
                    services of the stores, offered only through the website; and that the
                    majority&apos;s in-store alternative was an inferior one, because it required a
                    blind customer to wait in line and disclose medical information aloud that a
                    sighted customer could submit privately at home. It also flagged the effective
                    communication regulation, which requires auxiliary aids where necessary, and
                    noted that the majority had not explained why the website was not covered by it.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    What was never argued
                  </h3>
                  <p>
                    First, cost. At no stage did Winn-Dixie plead undue burden or fundamental
                    alteration, the two defences the statute provides. The $250,000 figure entered the
                    record as a budget the company had already set aside, not as a reason it could
                    not comply. Second, standards. The company did not argue that the absence of a
                    federal technical rule left it without fair notice, the argument{" "}
                    <Link href="/cases/robles-v-dominos">Domino&apos;s</Link> built its whole case
                    around. Its witness said the company was already consulting WCAG.
                  </p>
                  <p>
                    That leaves a company which agreed the work was feasible, agreed it was doing the
                    work, and spent five and a half years and a Chapter 11 restructuring arguing that
                    it did not have to. The most generous reading is that the fight was about the
                    principle, and the amicus roster supports it: the Chamber of Commerce, the National
                    Retail Federation, the American Bankers Association and nine other trade bodies
                    filed in support of the appeal. The case had become a vehicle.
                  </p>
                </CaseProse>

                <CasePhoto
                  src="/images/cases/eleventh-circuit.webp"
                  alt="The stone facade of the Elbert P. Tuttle United States Court of Appeals Building in Atlanta, with arched windows, an American flag, and clipped trees along the pavement."
                  caption="The Eleventh Circuit's courthouse in Atlanta. The panel heard argument on 4 October 2018 and issued its opinion on 7 April 2021. The three-year injunction it was reviewing had expired between the two dates."
                  credit="Warren LeMay, Wikimedia Commons. CC0."
                  creditHref="https://commons.wikimedia.org/wiki/File:Elbert_P._Tuttle_United_States_Court_of_Appeals_Building,_Atlanta,_GA_(47474421621).jpg"
                  width={1400}
                  height={1050}
                />

                <CaseSourceLinks
                  ariaLabel="Sources for the defence and the appeal"
                  sources={[
                    { label: "Eleventh Circuit opinion and dissent, 7 April 2021", href: primarySources.panelOpinion },
                    { label: "Order vacating the opinion, 28 December 2021", href: primarySources.vacatur },
                    { label: "Chamber of Commerce amicus brief, October 2017", href: primarySources.chamberBrief },
                    { label: "Gil's petition for rehearing, April 2021", href: primarySources.enBancPetition },
                  ]}
                />
              </CaseSection>

              <CaseSection id="prevented" title="Practical lessons from the record">
                <CaseProse>
                  <p>
                    Seven points where the outcome was still open, taken from the testimony and the
                    docket rather than from hindsight. At most of them the company was told, by its
                    own people, what to do.
                  </p>
                </CaseProse>

                <div className="mx-auto mt-6 w-full max-w-2xl">
                  <CaseExitRamp
                    n={1}
                    title="Build it in, September 2015"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          a line in the requirements of a $2 million build.
                        </b>{" "}
                        What followed: everything below.
                      </>
                    }
                  >
                    The company&apos;s own witness testified that accessibility was not discussed at
                    all when the site was built. Safeway had publicly adopted WCAG 2.0 AA for its
                    grocery site in December 2013; the Justice Department had settled with Peapod on
                    the same terms in 2014. The roadmap was published and free.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={2}
                    title="Test it during the $7 million rebuild"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          one screen-reader pass on a site being remade anyway.
                        </b>{" "}
                        What followed: a second build that shipped the same barriers.
                      </>
                    }
                  >
                    The Plenti rewards rebuild went, in Cornwell&apos;s words, far beyond the
                    programme itself: template, content and functionality. It was the ideal moment to
                    fix the markup and it was again never tested with a screen reader.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={3}
                    title="Give the customer a way to report it"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          a footer link and a mailbox.
                        </b>{" "}
                        What followed: the first contact was a federal complaint.
                      </>
                    }
                  >
                    Gil found no accessibility notice and nothing announcing planned changes. The
                    injunction later ordered exactly this: a policy statement linked from the home
                    page with an accessible way to submit problems. Winn-Dixie has one today.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={4}
                    title="Settle on the expert's number, July 2016"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          about $37,000 of remediation plus a modest fee.
                        </b>{" "}
                        What followed: five and a half years of litigation on both sides.
                      </>
                    }
                  >
                    The plaintiff wanted an injunction and fees; the statute allows nothing else. A
                    consent decree on WCAG 2.0 terms would have cost less than the budget the company
                    had already set aside, and the company had already decided to do the work.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={5}
                    title="Read the government's brief, December 2016"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          sixteen pages.
                        </b>{" "}
                        What followed: a trial and an appeal against the regulator&apos;s stated
                        position.
                      </>
                    }
                  >
                    The Justice Department told the court that the company&apos;s argument could not
                    be squared with the statute, the regulations or the case law. Companies that
                    litigate against the enforcing agency&apos;s written view rarely improve their
                    position by doing so.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={6}
                    title="Comply and close, June 2017"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          the remediation it was already doing, plus $105,271 in fees.
                        </b>{" "}
                        What followed: an appeal that outlived the order it challenged.
                      </>
                    }
                  >
                    The verdict required what the company said it intended to do anyway, for three
                    years. Appealing turned a compliance project into a test case, with a business
                    coalition attached, and a Chapter 11 filing in the middle of it.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={7}
                    title="Take the win and leave, April 2021"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          nothing; the opinion favoured the company.
                        </b>{" "}
                        What followed: a year of further motions, and the opinion was erased anyway.
                      </>
                    }
                  >
                    The mootness problem was in Gil&apos;s petition within a week. Winn-Dixie fought
                    to keep a precedent it could not keep, lost in December, sought rehearing on the
                    mootness ruling itself, and lost again in March 2022.
                  </CaseExitRamp>
                </div>
              </CaseSection>

              <CaseSection id="debate" title="Public and professional reaction">
                <CaseProse>
                  <p>
                    The verdict was the first of its kind and was reported as such. The reversal, four
                    years later, was reported as the end of website accessibility claims in three
                    states. The vacatur, eight months after that, was barely reported at all. This
                    section sets out who said what, at each stage, and where the arguments came from.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    Developers, June 2017
                  </h3>
                  <p>
                    The largest public discussion of the verdict was a Hacker News thread of 114
                    comments. We read all of them. Its centre of gravity was the wheelchair-ramp
                    analogy, argued from both directions: that a website is a storefront and the
                    obligation is the same, or that building codes and design rules are not
                    comparable and government has no business zoning websites. A large sub-thread
                    concerned whether WCAG is easy or hard, with practitioners insisting that sensible
                    HTML gets you most of the way and sceptics replying that the last part is where
                    the cost lives. The $37,000 estimate was mocked as unrealistically low by people
                    who had not read the testimony, and defended by people who had.
                  </p>
                  <p>
                    The thread&apos;s serial-litigation anxiety attached itself not to Gil or his
                    lawyer but to Paul Hansmeier, a Minnesota attorney then under federal
                    investigation for a copyright-trolling scheme who had moved into ADA filings. One
                    commenter noted that Winn-Dixie had spent $9 million on the website the previous
                    year and asked how that squared with the cost objection. Nobody in the thread
                    mentioned that the company had testified it was fixing the site anyway.
                  </p>
                </CaseProse>

                <VoiceShare
                  total={114}
                  highlighted={1}
                  title="Who was actually speaking"
                  lede="The 2017 Hacker News discussion holds 114 surviving comments about whether a blind man should be able to refill a prescription online. One came from someone identifying as blind."
                  labels={{ total: "Comments", highlighted: "From a blind commenter", share: "Share" }}
                />

                <CaseProse>
                  <p>
                    That one commenter was answering a claim that the University of California,
                    Berkeley had been forced to take down free online courses over accessibility.
                    Berkeley, he wrote, did not have to take them down; it chose to, and could have
                    captioned them instead. The exchange is a reminder that the most-cited horror
                    story in the thread was itself a choice presented as a compulsion.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    Practitioners
                  </h3>
                  <p>
                    Lainey Feingold, who negotiates accessibility agreements without litigation,
                    called the verdict the first trial in an ADA case about website accessibility
                    against a private company and, a month later, published a piece arguing that
                    Winn-Dixie had simply not been paying attention: Safeway had adopted WCAG 2.0 AA
                    in 2013 after a structured negotiation with nine blind customers, and the Peapod
                    settlement with the Justice Department in 2014 was a public roadmap the company
                    could have copied. After the 2021 reversal she described the opinion&apos;s
                    reasoning as convoluted and advised businesses that unless they planned a separate
                    website for Georgia, Alabama and Florida, inclusive design should remain their
                    guiding star and WCAG 2.1 AA their standard.
                  </p>
                  <p>
                    William Goren, an ADA lawyer and commentator, predicted the majority&apos;s
                    approach would be very hard for courts to apply and identified a paradox in it:
                    Gil already had his auxiliary aid, the screen reader; the problem was that the
                    company had not set its site up to work with it. Eric Goldman, the technology law
                    scholar, thought the opinion consistent with decades of precedent but puzzled
                    over the business decision, given that the litigation had plainly cost more than
                    the $250,000 the company had budgeted for compliance.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    Blind organisations
                  </h3>
                  <p>
                    Two weeks after the reversal, the National Federation of the Blind&apos;s
                    president, Mark Riccobono, appeared on the ADA National Network&apos;s broadcast
                    alongside Howard Rosenblum of the National Association of the Deaf and Bruce
                    Sexton, the named plaintiff in{" "}
                    <Link href="/cases/nfb-v-target">the Target case</Link> fifteen years earlier.
                    Asked for his view, Riccobono said it was outrageous, three times, and then made
                    an argument that was pointedly not a legal one.
                  </p>
                </CaseProse>

                <CaseQuote source="Mark Riccobono, President, National Federation of the Blind, ADA Live, 21 April 2021">
                  This particular ruling is outrageous, recognizing that this is 2021, not 1921 and
                  we&apos;re in the middle of a worldwide pandemic. The idea that the website, which
                  permits you to stay at home, in the safety of your own home, that not being able to
                  access the website is merely an inconvenience is completely, completely out of
                  touch with reality.
                </CaseQuote>

                <CaseProse className="mt-8">
                  <p>
                    He said the company had spent more fighting accessibility than it would have
                    needed to spend achieving it, encouraged listeners to boycott Winn-Dixie on that
                    basis, and called on Congress to legislate that websites are places of public
                    accommodation. In the same conversation he went out of his way to praise Target,
                    which had, he said, flipped the script since its own lawsuit and made disabled
                    customers a target audience. Ten months later, 181 disability organisations led by
                    the NFB, the American Council of the Blind, the American Foundation for the Blind
                    and the National Disability Rights Network wrote to the Justice Department asking
                    for enforceable web accessibility standards before the end of the administration.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    The plaintiff&apos;s lawyer
                  </h3>
                  <p>
                    A fair account has to include this. Scott Dinin, who tried the case for Gil, was
                    sanctioned in August 2019 by a different judge of the same court in unrelated
                    cases, where he had brought twenty-six suits against petrol stations over
                    uncaptioned video on fuel pumps for a different client, Alexander Johnson. The
                    court found that Dinin had egregiously inflated his fee claims and had paid Johnson
                    more than $84,500 over three years for taking part in lawsuits, described the
                    arrangement as an illicit joint enterprise, ordered $59,900 disgorged, barred both
                    men from filing ADA cases without leave, and required Dinin to file the order in
                    every court where he had a case. He was counsel in 251 federal suits in 2018.
                  </p>
                  <p>
                    None of that was found in this case, and none of it reached the trial record. Gil
                    testified to thirty or forty visits to Winn-Dixie and to a genuine wish to use its
                    pharmacy privately; the judge believed him. He also had, by June 2017, some sixty
                    other suits pending against retailers and restaurants. Both facts are true, and
                    the case is a good illustration of why a barrier can be real and the litigation
                    around it can still deserve scrutiny.
                  </p>
                </CaseProse>
              </CaseSection>

              <CaseSection id="record" title="Correcting the record">
                <CaseProse>
                  <p>
                    This case is misdescribed more often than any other in the field, partly because
                    it changed shape three times and most commentary stopped after the second. Twelve
                    claims circulate widely enough to be worth answering directly, each set here
                    against what the filings and the orders actually say.
                  </p>
                </CaseProse>

                <CaseCorrections>
                  <CaseCorrection
                    claim="The Eleventh Circuit held that websites are not places of public accommodation."
                    record="A panel held that on 7 April 2021. The same panel vacated the opinion on 28 December 2021 because the case was moot. A vacated opinion has no precedential effect. The Eleventh Circuit has no controlling decision on the question."
                  />
                  <CaseCorrection
                    claim="Winn-Dixie won."
                    record="It won a panel decision that was then erased, along with the trial judgment against it. It asked the full court to preserve the win and was refused on 2 March 2022. The only order in force is a dismissal for mootness, which decides nothing about anyone's rights."
                  />
                  <CaseCorrection
                    claim="The court ordered Winn-Dixie to meet WCAG 2.0 Level AA."
                    record="The order requires conformance with the WCAG 2.0 criteria and names no level. Level AA appears in Winn-Dixie's own accessibility statement, which it adopted afterwards."
                  />
                  <CaseCorrection
                    claim="Fixing the website would have cost $250,000."
                    record="That was a budget the company had set aside, on what its witness called high-level input. The only estimate in evidence was the plaintiff's expert's ceiling of $37,000. The judge found the difference of no moment against $9 million already spent on the site."
                  />
                  <CaseCorrection
                    claim="Gil was awarded damages."
                    record="He was awarded nothing. Title III of the ADA provides no damages to a private plaintiff. His lawyers were awarded $99,879 in fees and $5,392.06 in costs, stayed pending the appeal, and the status of that award after the judgment was vacated is unclear."
                  />
                  <CaseCorrection
                    claim="This was the first website accessibility lawsuit."
                    record="It was the first to reach trial and judgment. The Target case produced the first ruling against a retailer in 2006, and a blind plaintiff had sued Southwest Airlines over its website in 2002 and lost."
                  />
                  <CaseCorrection
                    claim="The case created a circuit split with the Ninth Circuit's Domino's decision."
                    record="For eight months it did. The vacatur removed it. The Eleventh Circuit majority had in any case distinguished Domino's on its facts rather than disagreeing with it, because Domino's sold through its site and Winn-Dixie did not."
                  />
                  <CaseCorrection
                    claim="Gil never shopped at Winn-Dixie and was a professional plaintiff."
                    record="He testified to thirty or forty visits since a school trip in 1999 and to filling prescriptions there, and the court found him credible. He also had some sixty other suits pending in June 2017. Both are in the record."
                  />
                  <CaseCorrection
                    claim="Winn-Dixie's website sold groceries online."
                    record="It sold nothing. The company's witness confirmed it, and that fact was central to the panel majority's reasoning: everything begun on the site had to be completed in a store."
                  />
                  <CaseCorrection
                    claim="The appeal was delayed by the pandemic."
                    record="Argument was in October 2018. Seventeen months of the thirty-month wait passed before the pandemic began. The injunction expired in July 2020 and the opinion arrived in April 2021."
                  />
                  <CaseCorrection
                    claim="The Justice Department stayed out of it."
                    record="It filed a statement of interest on 12 December 2016 supporting Gil, arguing that a grocery chain's website must be accessible unless doing so would be an undue burden or fundamental alteration."
                  />
                  <CaseCorrection
                    claim="Because the opinion was vacated, Winn-Dixie's site did not have to be fixed and was not."
                    record="The injunction ran its full three years before anything was vacated. The company's own witness said the work was under way in 2017. Winn-Dixie's accessibility statement, updated in January 2026, claims WCAG 2.0 AA and periodic testing with disabled users. Our own measurement of the live home page is below."
                  />
                </CaseCorrections>
              </CaseSection>

              <CaseSection id="now" title="What it means now">
                <CaseProse>
                  <p>
                    The legal position in Florida, Georgia and Alabama is what it was in 2016: no
                    appellate decision either way, district courts applying the nexus test case by
                    case, and the Justice Department&apos;s view on the record. The company that
                    fought the case says it now conforms to a standard the order never required.
                  </p>
                </CaseProse>

                <CircuitPositions />

                <CaseProse>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    Did the site get fixed?
                  </h3>
                  <p>
                    Unlike{" "}
                    <Link href="/cases/robles-v-dominos">Domino&apos;s</Link>, Winn-Dixie&apos;s
                    site was server-rendered through the years that matter, so the Internet
                    Archive&apos;s captures contain markup that can be measured. We measured the home
                    page at four points and then measured the live site on 2 September 2026, counting
                    the defects a screen reader hits first.
                  </p>
                </CaseProse>

                <CaptureSeries
                  title="The Winn-Dixie home page, 2016 to 2026"
                  lede="Archived captures rendered by the Internet Archive, plus the live site. Counts are of the served markup: images without any alt attribute, links and buttons with no accessible name, whether the page links to an accessibility statement, and whether the document declares its language."
                  site="winndixie.com"
                  rows={[
                    { date: "14 Jul 2016", phase: "Two days after the complaint", images: 41, missingAlt: 4, unnamedLinks: 11, unnamedButtons: 0, accessibilityLink: false, lang: false },
                    { date: "16 Jun 2018", phase: "Injunction, year one", images: 48, missingAlt: 2, unnamedLinks: 0, unnamedButtons: 3, accessibilityLink: true, lang: true },
                    { date: "31 May 2021", phase: "After the panel opinion", images: 43, missingAlt: 1, unnamedLinks: 0, unnamedButtons: 6, accessibilityLink: true, lang: true },
                    { date: "1 Jun 2024", phase: "After dismissal", images: 61, missingAlt: 2, unnamedLinks: 8, unnamedButtons: 2, accessibilityLink: true, lang: true },
                    { date: "2 Sep 2026", phase: "Live site", images: 80, missingAlt: 21, unnamedLinks: 7, unnamedButtons: 2, accessibilityLink: true, lang: true },
                  ]}
                  note="The live page was measured in a browser with scripts running; archived captures are rendered by the Internet Archive and may not run every script, so the two are indicative rather than strictly comparable. A link flagged as unnamed by an automated rule may take its name from context a rule cannot see. These counts find the class of defect the case was about and nothing more; a clean count is not a usable pharmacy refill."
                />

                <CaseProse>
                  <p>
                    The shape is clear enough. The page with no language declaration, no accessibility
                    link and eleven unnamed links in 2016 had all three fixed within the
                    injunction&apos;s first year, and stayed largely clean through the appeal. The
                    2026 figure, twenty-one images without alt text on a page that claims WCAG 2.0
                    AA, is the familiar pattern from the{" "}
                    <Link href="/cases/robles-v-dominos">Domino&apos;s app</Link>: accessibility is
                    a maintenance property, and the order that required quarterly testing expired in
                    2020.
                  </p>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    The company since
                  </h3>
                  <p>
                    Southeastern Grocers emerged from Chapter 11 in 2018, was bought by Aldi in a
                    deal completed in March 2024, and was sold back to a private consortium including
                    its supplier C&amp;S Wholesale in February 2025 with about 170 stores, the rest
                    converting to Aldi. It has announced a rebrand to The Winn-Dixie Company in 2026.
                    Its accessibility statement, last updated 21 January 2026, names WCAG 2.0 AA as
                    its standard, describes periodic testing with screen readers, magnifiers and
                    disabled users, and gives an email address, a telephone number and a postal
                    address. It names no vendor and runs no overlay. WCAG 2.0 is two revisions behind
                    the current guidelines; the order that named it was written in 2017.
                  </p>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    What to take from it
                  </h3>
                  <ul>
                    <li>
                      <strong>Vacated means gone.</strong> Anyone citing the Eleventh Circuit&apos;s
                      Winn-Dixie opinion as law, in a brief or a sales deck, is citing an opinion the
                      court itself withdrew. The question is open in three states.
                    </li>
                    <li>
                      <strong>Your own witness sets the ceiling on your defence.</strong> Once the
                      company said the work was feasible, budgeted and under way, the cost argument
                      was over before it was made.
                    </li>
                    <li>
                      <strong>An in-store alternative has to be equal, not merely available.</strong>{" "}
                      The dissent&apos;s point about saying your medications aloud at a counter is the
                      one that will be argued next time, and it is a usability finding, not a legal
                      one.
                    </li>
                    <li>
                      <strong>Time-limited orders time out.</strong> A three-year injunction and a
                      thirty-month appeal cannot coexist. Plaintiffs who want a precedent now know to
                      seek declaratory relief; defendants who want one now know the risk of winning
                      late.
                    </li>
                    <li>
                      <strong>Statements outlive orders.</strong> The company still publishes the
                      policy the injunction required, six years after the injunction ended. Check it
                      against the live site, as we did, before relying on it.
                    </li>
                  </ul>
                </CaseProse>

                <CaseNote title="A note on the two cases together">
                  <p>
                    Read with <Link href="/cases/robles-v-dominos">Domino&apos;s</Link>, this case
                    shows the nexus test cutting both ways. A site that sells is covered in the
                    Ninth Circuit because of what it does for the stores. A site that does not sell
                    was, for eight months, not covered in the Eleventh Circuit for the same reason.
                    Both courts were applying the idea first set out in{" "}
                    <Link href="/cases/nfb-v-target">the Target ruling of 2006</Link>. Neither has
                    said what happens when there are no stores at all.
                  </p>
                </CaseNote>
              </CaseSection>

              <CaseSection id="sources" title="Sources" eyebrow="Primary record and attributed analysis">
                <CaseProse>
                  <p>
                    Trial findings, procedural facts and quotations are drawn from the verdict, the
                    appellate opinions and the filings below. Commentary and community claims are
                    attributed to their sources. Where the record is silent, particularly on
                    Winn-Dixie&apos;s litigation spend, this page does not estimate.
                  </p>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">Primary</h3>
                  <ul>
                    <li>
                      <a href={primarySources.verdict} target="_blank" rel="noopener noreferrer">
                        Verdict and Order Following Non-Jury Trial, 257 F. Supp. 3d 1340 (12 June 2017)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.dojStatement} target="_blank" rel="noopener noreferrer">
                        Statement of Interest of the United States (12 December 2016)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.panelOpinion} target="_blank" rel="noopener noreferrer">
                        Eleventh Circuit opinion and dissent, 993 F.3d 1266 (7 April 2021)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.enBancPetition} target="_blank" rel="noopener noreferrer">
                        Gil&apos;s petition for rehearing en banc (15 April 2021)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.vacatur} target="_blank" rel="noopener noreferrer">
                        Order granting panel rehearing and vacating the opinion, 21 F.4th 775 (28 December 2021)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.chamberBrief} target="_blank" rel="noopener noreferrer">
                        Amicus brief of the US Chamber of Commerce and eleven business organisations (17 October 2017)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.docket} target="_blank" rel="noopener noreferrer">
                        District court docket, No. 1:16-cv-23020
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.accessibilityStatement} target="_blank" rel="noopener noreferrer">
                        Winn-Dixie accessibility statement, checked 2 September 2026
                      </a>
                    </li>
                  </ul>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                    Reporting and legal commentary
                  </h3>
                  <ul>
                    <li>
                      <a href="https://www.adatitleiii.com/2017/06/first-federal-court-rules-that-having-an-inaccessible-website-violates-title-iii-of-the-ada/" target="_blank" rel="noopener noreferrer">
                        Seyfarth Shaw on the verdict (June 2017)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.forbes.com/sites/legalnewsline/2017/10/02/lawyers-awarded-100k-after-historic-verdict-for-blind-internet-users-winn-dixie-appealing/" target="_blank" rel="noopener noreferrer">
                        Legal Newsline on the fee award and the appeal (2 October 2017)
                      </a>
                    </li>
                    <li>
                      <a href="https://couponsinthenews.com/2017/06/21/blind-couponer-wins-landmark-lawsuit/" target="_blank" rel="noopener noreferrer">
                        Coupons in the News on the verdict and Gil&apos;s other suits (21 June 2017)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.cnbc.com/2018/03/27/winn-dixie-operator-southeastern-grocers-files-for-bankruptcy-protection.html" target="_blank" rel="noopener noreferrer">
                        CNBC on the Southeastern Grocers Chapter 11 filing (27 March 2018)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.adatitleiii.com/2019/08/florida-judge-sanctions-serial-ada-plaintiff-alexander-johnson-and-attorney-scott-dinin/" target="_blank" rel="noopener noreferrer">
                        Seyfarth Shaw on the sanctions against Scott Dinin (August 2019)
                      </a>
                    </li>
                    <li>
                      <a href="https://blog.ericgoldman.org/archives/2021/04/11th-circuit-says-grocery-store-website-isnt-covered-by-the-ada-gil-v-winn-dixie.htm" target="_blank" rel="noopener noreferrer">
                        Eric Goldman on the panel opinion (April 2021)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.understandingtheada.com/blog/2021/04/13/11th-circuits-opinion-gil-v-winn-dixie/" target="_blank" rel="noopener noreferrer">
                        William Goren on the panel opinion (13 April 2021)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.hklaw.com/en/insights/publications/2022/01/11th-circuit-vacates-opinion-holding-that-websites-are-not-ada-public" target="_blank" rel="noopener noreferrer">
                        Holland &amp; Knight on the vacatur (January 2022)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.adatitleiii.com/2022/03/as-the-winn-dixie-saga-finally-concludes-in-florida-181-advocacy-groups-urge-doj-to-issue-website-accessibility-regulations/" target="_blank" rel="noopener noreferrer">
                        Seyfarth Shaw on the denial of rehearing and the 181-group letter (March 2022)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.winndixie.com/press/details/southeastern-grocers-announces-new-ownership-of-iconic-winn-dixie-banner" target="_blank" rel="noopener noreferrer">
                        Southeastern Grocers on its 2025 change of ownership
                      </a>
                    </li>
                  </ul>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                    Practitioners and community
                  </h3>
                  <ul>
                    <li>
                      <a href="https://www.lflegal.com/2017/06/winn-dixie/" target="_blank" rel="noopener noreferrer">
                        Lainey Feingold on the verdict (13 June 2017)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.lflegal.com/2017/07/grocery-access/" target="_blank" rel="noopener noreferrer">
                        Lainey Feingold, &ldquo;Winn-Dixie wasn&apos;t paying attention&rdquo; (July 2017)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.lflegal.com/2021/04/winn-dixie-appeal/" target="_blank" rel="noopener noreferrer">
                        Lainey Feingold on the appeal (11 April 2021)
                      </a>
                    </li>
                    <li>
                      <a href="https://disabilityrightstoday.org/wp-content/uploads/2021/09/episode1-transcript.pdf" target="_blank" rel="noopener noreferrer">
                        ADA Live transcript with Mark Riccobono, Howard Rosenblum and Bruce Sexton (21 April 2021)
                      </a>
                    </li>
                    <li>
                      <a href="https://news.ycombinator.com/item?id=14578697" target="_blank" rel="noopener noreferrer">
                        Hacker News discussion of the verdict, 114 comments (June 2017)
                      </a>
                    </li>
                    <li>
                      <a href="https://blog.usablenet.com/winn-dixie-win-ada-lawsuit-but-choose-web-accessibility" target="_blank" rel="noopener noreferrer">
                        UsableNet on Winn-Dixie&apos;s accessibility statement after the reversal (April 2021)
                      </a>
                    </li>
                  </ul>
                </CaseProse>
              </CaseSection>

              <section id="discussion" aria-labelledby="discussion-heading" className="scroll-mt-28">
                <CaseComments
                  caseSlug={CASE_SLUG}
                  caseTitle="Gil v. Winn-Dixie Stores"
                  initialComments={comments}
                />
              </section>

              <RelatedContent
                content="ADA website accessibility lawsuit Eleventh Circuit public accommodation nexus WCAG injunction"
                title="Related reading"
                maxItems={4}
                showDescriptions
              />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
