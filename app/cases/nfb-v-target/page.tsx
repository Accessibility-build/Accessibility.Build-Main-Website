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
import { CaptureSeries, KeptAndCut, MoneyBars } from "@/components/cases/case-charts"
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

const CASE_SLUG = "nfb-v-target"
const study = getCaseStudy(CASE_SLUG)!

const pageTitle = "NFB v. Target: The First Web Accessibility Case"
const pageDescription =
  "A sourced account of National Federation of the Blind v. Target: the 2006 ruling that created the nexus test, the nationwide class, the $6 million settlement, and what the record shows the site looked like before and after."

const primarySources = {
  order2006:
    "https://www.courtlistener.com/opinion/2368363/national-federation-of-the-blind-v-target-corp/",
  order2007:
    "https://www.courtlistener.com/opinion/2523254/national-federation-of-blind-v-target-corp/",
  settlement: "https://dralegal.org/wp-content/uploads/2012/09/settlementagreement_2.pdf",
  brailleMonitor:
    "https://nfb.org/sites/default/files/images/nfb/publications/bm/bm08/bm0809/bm080915.htm",
  berkeleyRelease: "https://newsarchive.berkeley.edu/news/media/releases/2006/03/20_sexton.shtml",
  certification2010:
    "https://www.prnewswire.com/news-releases/national-federation-of-the-blind-nonvisual-accessibility-web-certification-granted-to-targetcom-83889602.html",
  partnership:
    "https://nfb.org/programs-services/center-excellence-nonvisual-access/strategic-nonvisual-accessibility-partnership",
  w3cCaseStudy: "https://www.w3.org/WAI/business-case/archive/target-case-study",
  targetAccessibility: "https://www.target.com/c/accessibility-ways-to-shop/-/n-4ynq1",
  docket:
    "https://www.courtlistener.com/docket/4165835/national-federation-of-the-blind-v-target-corporation/",
}

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  authors: [{ name: "The Accessibility.build team", url: "https://accessibility.build/about" }],
  creator: "The Accessibility.build team",
  publisher: "Accessibility.build",
  keywords: [
    "NFB v Target",
    "National Federation of the Blind v. Target",
    "Target accessibility lawsuit",
    "Target.com blind lawsuit 2006",
    "nexus test ADA website",
    "web accessibility class action",
    "Unruh Act website",
    "Target $6 million settlement",
    "first website accessibility case",
    "screen reader lawsuit",
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
        url: `/api/og?title=${encodeURIComponent("National Federation of the Blind v. Target")}&section=Case study`,
        width: 1200,
        height: 630,
        alt: "National Federation of the Blind v. Target case study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [
      `/api/og?title=${encodeURIComponent("National Federation of the Blind v. Target")}&section=Case study`,
    ],
  },
}

// Comments are read at request time but the page is cached, so the thread is
// server-rendered without making every visit hit the database.
export const revalidate = 300

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Case Studies", url: "https://accessibility.build/cases" },
  {
    name: "National Federation of the Blind v. Target",
    url: `https://accessibility.build/cases/${CASE_SLUG}`,
  },
]

const TOC = [
  { id: "what-happened", label: "What happened" },
  { id: "barriers", label: "What the complaint alleged" },
  { id: "timeline", label: "Three years, step by step" },
  { id: "defence", label: "How it was defended" },
  { id: "nexus", label: "The ruling that made the nexus test" },
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

export default async function NfbTargetCasePage() {
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
                <li className="text-slate-900 dark:text-white">
                  National Federation of the Blind v. Target
                </li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Case study &middot; Web accessibility litigation
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              National Federation of the Blind v. Target
            </h1>
            <p className="mt-4 font-mono text-xs leading-6 text-slate-500 dark:text-slate-400">
              {study.citation}
            </p>

            <p className="mt-7 max-w-[60ch] font-serif text-xl leading-8 text-slate-800 dark:text-slate-200 sm:text-2xl">
              A blind student could not buy towels for his dorm room. The ruling that let his case
              proceed invented the test every later website case has fought over, the class it
              certified was nationwide, and the company that settled went on to become the example
              the plaintiffs point to.
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
                    A federal court held in September 2006 that the ADA reaches a retailer&apos;s
                    website to the extent its inaccessibility impedes enjoyment of the goods and
                    services of the retailer&apos;s stores.
                  </>,
                  <>
                    The same order held that California&apos;s Unruh Act and Disabled Persons Act
                    reach the website with no connection to a store required at all.
                  </>,
                  <>
                    A nationwide class of blind users was certified in October 2007, the first in a
                    web accessibility case, with a California subclass for damages under state law.
                  </>,
                  <>
                    Target settled in August 2008: a $6 million fund for California claimants,
                    remediation to its own written guidelines, certification by the NFB, and three
                    years of monitoring. It admitted no liability.
                  </>,
                ]}
                notEstablished={[
                  <>
                    That Target broke the law. No court ever found that it did, and the settlement
                    says so.
                  </>,
                  <>
                    That all websites are covered by the ADA. The court dismissed the claim as to
                    anything on Target.com unconnected to the stores.
                  </>,
                  <>
                    Any conformance standard. The settlement names Target&apos;s own Online Assistive
                    Technology Guidelines, not WCAG.
                  </>,
                  <>
                    What Target spent. The fee award against it was $3,738,864.96; its own costs are
                    unpublished.
                  </>,
                ]}
              />

              <CaseSection id="what-happened" title="What happened">
                <CaseProse>
                  <p>
                    In May 2005 the National Federation of the Blind wrote to Target Corporation to
                    say that Target.com did not work with screen readers and to ask it to fix that.
                    Target was then the fifth-largest retailer in the United States, with roughly
                    1,400 stores and a website, launched in 1999 and rebuilt in 2001 on
                    Amazon&apos;s technology platform, that was already doing close to a million
                    visits a day. The talks ran for eight months. Target would not commit to a
                    remediation programme. In January 2006 they ended.
                  </p>
                  <p>
                    On 7 February 2006 the NFB, its California affiliate and a 24-year-old
                    interdisciplinary studies student at Berkeley named Bruce Sexton filed a class
                    action in the Superior Court of California in Alameda County. Sexton, who is
                    legally blind and uses JAWS, was president of the California Association of
                    Blind Students. His own experience of the site had been an attempt to buy towels
                    for his dorm room: the screen reader read out the image file names and reference
                    numbers behind the pictures because there was no text to read. Target removed the
                    case to federal court in March and moved to dismiss it in full, arguing that the
                    ADA and the two California statutes applied only to physical places.
                  </p>
                  <p>
                    On 6 September 2006 Judge Marilyn Hall Patel refused. Her order is the origin of
                    the nexus test: the ADA covered the website to the extent that its inaccessibility
                    impeded the full and equal enjoyment of the goods and services of Target&apos;s
                    stores, and did not cover whatever on the site was unconnected to them. The
                    California statutes, she held, reached the site without any such limit. Target
                    kept litigating and kept fixing the site. In October 2007 the court certified a
                    nationwide class under the ADA and a California subclass under state law, and
                    rejected Target&apos;s argument that the improvements had made the case moot.
                  </p>
                  <p>
                    On 27 August 2008 the parties announced a settlement. Target would pay $6 million
                    into a fund for California class members, bring the site up to written guidelines
                    of its own, have the NFB certify it, submit to three years of quarterly monitoring
                    and annual training, and admit nothing. The court approved it in March 2009 and
                    awarded the plaintiffs $3,738,864.96 in fees and costs that August. In February
                    2010 the NFB certified Target.com at its highest level. In 2016 Target became the
                    first company in the NFB&apos;s strategic partnership programme. In 2021, on a
                    broadcast about the{" "}
                    <Link href="/cases/gil-v-winn-dixie">Winn-Dixie</Link> reversal, the NFB&apos;s
                    president went out of his way to say that Target had flipped the script.
                  </p>
                </CaseProse>

                <CourtPathDiagram
                  stops={[
                    { court: "Alameda Superior Court", year: "2006", outcome: "Filed, removed", tone: "neutral" },
                    { court: "District Court", year: "2006", outcome: "Claims narrowed, case proceeds", tone: "plaintiff" },
                    { court: "District Court", year: "2007", outcome: "Nationwide class certified", tone: "plaintiff" },
                    { court: "Settlement", year: "2008", outcome: "$6m fund, no admission", tone: "neutral" },
                    { court: "District Court", year: "2009", outcome: "Approved; fees awarded", tone: "neutral" },
                  ]}
                  duration="3 years, 6 months"
                />

                <CasePhoto
                  src="/images/cases/sather-gate.webp"
                  alt="Sather Gate at the University of California, Berkeley: an ornate green bronze arch on stone pillars over a brick plaza, with a few students walking through."
                  caption="Sather Gate at Berkeley. Bruce Sexton was a third-year student there when he tried to buy towels for his dorm room from Target.com and his screen reader read out file names instead of products. He agreed to be the named plaintiff, and told the university's news office that people thought he was radical for suing Target."
                  credit="Carol M. Highsmith, Library of Congress. Public domain."
                  creditHref="https://commons.wikimedia.org/wiki/File:Sather_Gate_at_University_of_California,_Berkeley,_California_LCCN2013633500_(edited).jpg"
                  width={1400}
                  height={802}
                  priority
                />
              </CaseSection>

              <CaseSection id="barriers" title="What the complaint alleged">
                <CaseProse>
                  <p>
                    The barriers were the ones that would be pleaded in almost every website case for
                    the next twenty years, described here for what may have been the first time in a
                    federal complaint about a retailer. Judge Patel&apos;s order summarised them; the
                    Berkeley news office, the plaintiffs&apos; expert and the developers who examined
                    the site at the time filled in the detail.
                  </p>
                </CaseProse>

                <CaseTable caption="Barriers alleged on Target.com in 2006, the technique each defeated, and the success criterion each maps to today">
                  <thead>
                    <tr>
                      <CaseTh>Alleged barrier</CaseTh>
                      <CaseTh>What it meant for a screen reader user</CaseTh>
                      <CaseTh>WCAG 2.2 today (our mapping)</CaseTh>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <CaseTd>Images without alternative text</CaseTd>
                      <CaseTd>
                        Product pictures and graphical buttons were announced as file names and
                        reference numbers. One developer on Slashdot noted that Target had rendered
                        plain text as GIFs, so even labels were images.
                      </CaseTd>
                      <CaseTd>1.1.1 Non-text Content (Level A)</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Inaccessible image maps</CaseTd>
                      <CaseTd>
                        The store-locator map and navigation used clickable regions with no text
                        equivalents. Our measurement of the site six days before the complaint found
                        85 image-map areas, none with alt text.
                      </CaseTd>
                      <CaseTd>1.1.1 and 2.4.4 Link Purpose (Level A)</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>Checkout required a mouse</CaseTd>
                      <CaseTd>
                        The checkout control was a hotspot that could not be reached or activated from
                        the keyboard, so a purchase could be assembled but never completed.
                      </CaseTd>
                      <CaseTd>2.1.1 Keyboard (Level A)</CaseTd>
                    </tr>
                    <tr>
                      <CaseTd>No navigational headings</CaseTd>
                      <CaseTd>
                        With no heading structure, a screen reader user could not jump between
                        sections and had to read the page linearly. The 2006 home page had no h1
                        element at all.
                      </CaseTd>
                      <CaseTd>1.3.1 Info and Relationships (Level A)</CaseTd>
                    </tr>
                  </tbody>
                </CaseTable>

                <CaseProse className="mt-8">
                  <p>
                    On our mapping, every one of them corresponds to a Level A criterion, the lowest
                    tier of the standard, and every one is detectable by the automated tools that
                    existed in 2006. The court made no such mapping; it is editorial. The
                    plaintiffs&apos; expert, the IBM accessibility veteran Jim Thatcher, reported that
                    as of 12 April 2006 the site was virtually unusable by a visitor who is blind. By
                    July 2006 he was prepared to say in a declaration that Target&apos;s changes had
                    made it more likely that a blind user could complete a transaction; keyboard
                    access to checkout was the one barrier the court later considered fully
                    addressed.
                  </p>
                  <p>
                    The point the court made about the class is the one that resists a simple defect
                    count. Putative class members described two kinds of injury: some were deterred
                    from going to a Target store at all after failing on the site, and one described
                    giving up and buying the video game he wanted from Wal-Mart&apos;s website instead.
                    The website was not a separate product with a separate audience. It was the front
                    door to the stores, and for a blind customer it was the only door that could be
                    used without asking for help.
                  </p>
                </CaseProse>

                <CaseSourceLinks
                  ariaLabel="Sources for the alleged barriers"
                  sources={[
                    { label: "Order on the motion to dismiss, 6 September 2006", href: primarySources.order2006 },
                    { label: "UC Berkeley news release on Bruce Sexton, 20 March 2006", href: primarySources.berkeleyRelease },
                    { label: "Class certification order, 2 October 2007", href: primarySources.order2007 },
                  ]}
                />
              </CaseSection>

              <CaseSection id="timeline" title="Three years, step by step">
                <CaseProse>
                  <p>
                    Set against the five and a half years of{" "}
                    <Link href="/cases/robles-v-dominos">Domino&apos;s</Link> and{" "}
                    <Link href="/cases/gil-v-winn-dixie">Winn-Dixie</Link>, this case was short, and
                    the reason is visible in the sequence: the defendant fought the law and fixed the
                    site at the same time.
                  </p>
                </CaseProse>

                <CaseTimeline
                  entries={[
                    {
                      date: "May 2005",
                      title: "The NFB writes to Target",
                      body: "It asks for alternative text, accessible image maps, keyboard access to checkout and navigational headings. Negotiations with the NFB and Disability Rights Advocates begin.",
                    },
                    {
                      date: "Jan 2006",
                      title: "Talks end",
                      body: "Target declines to commit to remedial action. Its public position is that it strives to make its goods and services available to all guests, including those with disabilities.",
                      emphasis: "pivot",
                    },
                    {
                      date: "7 Feb 2006",
                      title: "Class action filed",
                      body: "Superior Court of California, Alameda County. Plaintiffs: the NFB, the NFB of California and Bruce Sexton on behalf of all others similarly situated. Claims under the ADA, the Unruh Civil Rights Act and the Disabled Persons Act.",
                    },
                    {
                      date: "9 Mar 2006",
                      title: "Removed to federal court",
                      body: "Northern District of California, assigned to Judge Marilyn Hall Patel. Target moves to dismiss every claim.",
                    },
                    {
                      date: "12 Apr 2006",
                      title: "The expert's baseline",
                      body: "Jim Thatcher reports that the site is virtually unusable by a visitor who is blind. Target begins making changes in response to the report.",
                    },
                    {
                      date: "6 Sep 2006",
                      title: "Motion to dismiss granted in part, denied in part",
                      body: "The ADA claim survives to the extent the site impedes enjoyment of the stores, and is dismissed as to anything unconnected to them. The California claims survive in full. A preliminary injunction is refused pending discovery.",
                      emphasis: "pivot",
                    },
                    {
                      date: "25 Apr 2007",
                      title: "Class definition narrowed",
                      body: "After a hearing, the court writes the nexus requirement into the proposed nationwide class and calls for further briefing on the reach of the state statutes.",
                    },
                    {
                      date: "2 Oct 2007",
                      title: "Class certified",
                      body: "A nationwide ADA class and a California subclass. Target's summary judgment motion is denied, its mootness argument rejected, and trial bifurcated into liability and damages. Sexton's own ADA claim fails and a substitute class representative is ordered for the federal claims.",
                      emphasis: "pivot",
                    },
                    {
                      date: "27 Aug 2008",
                      title: "Settlement announced",
                      body: "A $6 million fund for the California class, remediation to Target's Online Assistive Technology Guidelines by 28 February 2009, NFB certification, quarterly monitoring, annual training and a guest feedback channel. No admission of liability.",
                      emphasis: "resolution",
                    },
                    {
                      date: "9 Mar 2009",
                      title: "Final approval",
                      body: "Judge Patel approves the settlement.",
                    },
                    {
                      date: "3 Aug 2009",
                      title: "Fees awarded",
                      body: "$3,738,864.96 in attorneys' fees and costs to the plaintiffs.",
                      emphasis: "resolution",
                    },
                    {
                      date: "Feb 2010",
                      title: "Target.com certified",
                      body: "The NFB grants its Nonvisual Accessibility Web Certification at gold level.",
                    },
                    {
                      date: "Aug 2011",
                      title: "Target leaves Amazon's platform",
                      body: "Target.com relaunches on Target's own technology after a ten-year partnership, keeping the accessibility work through the migration.",
                    },
                    {
                      date: "2 Jun 2016",
                      title: "First strategic partner",
                      body: "Target becomes the first company designated a Strategic Nonvisual Access Partner of the NFB.",
                    },
                  ]}
                />
              </CaseSection>

              <CaseSection id="defence" title="How Target defended it">
                <CaseProse>
                  <p>
                    Target ran the widest defence of the three cases on this site, and it is
                    instructive because every argument it made was made again by{" "}
                    <Link href="/cases/robles-v-dominos">Domino&apos;s</Link> and{" "}
                    <Link href="/cases/gil-v-winn-dixie">Winn-Dixie</Link> a decade later, with the
                    same result. What Target did differently was to fix the site while arguing.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    The five arguments
                  </h3>
                  <ul>
                    <li>
                      <strong>A website is not a place.</strong> The ADA&apos;s twelve categories of
                      public accommodation are physical, and the Ninth Circuit had held in Weyer that
                      a place of public accommodation is an actual, physical place. The court agreed
                      with the premise and rejected the conclusion: the statute covers the services of
                      a place of public accommodation, not only services in one.
                    </li>
                    <li>
                      <strong>Congress chose not to cover private websites.</strong> It had amended
                      the Rehabilitation Act to require accessible federal websites and had not
                      amended the ADA. The court found the silence proved nothing.
                    </li>
                    <li>
                      <strong>The plaintiffs were not denied physical access.</strong> Nothing on the
                      website kept them out of the stores. The court held that the ADA does not stop
                      at the door; it guarantees full and equal enjoyment of what the place offers.
                    </li>
                    <li>
                      <strong>The Unruh Act requires intentional discrimination, and neither
                      California statute reaches websites.</strong> The court held that a violation
                      of the ADA is by statute a violation of both, that Target.com is a service of a
                      business establishment, and that no nexus to a store is needed under state law.
                    </li>
                    <li>
                      <strong>Applying California law to a national website violates the dormant
                      Commerce Clause.</strong> The court rejected both limbs, and in doing so took
                      apart the assumption, common in internet cases of the period, that a website
                      cannot know where its users are.
                    </li>
                  </ul>
                  <p>
                    A year later Target added two more. The improvements it had made since filing
                    had made the case moot: rejected, because voluntary cessation does not moot a
                    claim and because only keyboard access had been fully fixed. And a class could
                    not be certified because damages would need individual proof of intent: rejected,
                    because intent is not required where the state claim rests on an ADA violation.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    What it said in public
                  </h3>
                  <p>
                    Target&apos;s public statements never conceded the site was inaccessible. In
                    March 2006 it strove to make its goods and services available to all guests. In
                    October 2007, the day after a nationwide class was certified against it, its
                    spokeswoman said the company believed its website was fully accessible and
                    complied with all applicable laws. In August 2008, announcing a $6 million
                    settlement, another spokeswoman said the site was accessible and compliant with
                    all applicable laws, but that there were improvements that could be made. The
                    president of Target.com said the company had made significant enhancements as
                    its online business evolved.
                  </p>
                </CaseProse>

                <CaseQuote source="Order on Target's motion to dismiss, 6 September 2006, Judge Marilyn Hall Patel">
                  The statute applies to the services of a place of public accommodation, not
                  services in a place of public accommodation. To limit the ADA to discrimination in
                  the provision of services occurring on the premises of a public accommodation would
                  contradict the plain language of the statute.
                </CaseQuote>

                <CaseSourceLinks
                  ariaLabel="Sources for the defence"
                  sources={[
                    { label: "Order on the motion to dismiss, 6 September 2006", href: primarySources.order2006 },
                    { label: "Class certification and summary judgment order, 2 October 2007", href: primarySources.order2007 },
                    { label: "Settlement agreement, 2008", href: primarySources.settlement },
                  ]}
                />
              </CaseSection>

              <CaseSection id="nexus" title="The ruling that made the nexus test">
                <CaseProse>
                  <p>
                    The September 2006 order is usually cited for the proposition that websites are
                    covered by the ADA. Read in full, it is at least as much a ruling about what is
                    not covered. Judge Patel started from the Ninth Circuit&apos;s rule that a place
                    of public accommodation is a physical place, declined to follow the First and
                    Seventh Circuits in reading the term more broadly, and then asked what a physical
                    place&apos;s services are. Her answer split the website down the middle.
                  </p>
                </CaseProse>

                <KeptAndCut
                  title="What the 2006 order kept and what it cut"
                  lede="The ADA claim survived only for the parts of Target.com that served the stores. The parts that did not were dismissed. The California claims survived without any such division."
                  keptHeading="Covered by the ADA claim"
                  cutHeading="Dismissed from the ADA claim"
                  kept={[
                    "Store locations and opening hours",
                    "Refilling a prescription for collection in a store",
                    "Ordering photo prints for collection in a store",
                    "Printing coupons to redeem in a store",
                    "Anything else that impedes the full and equal enjoyment of goods and services offered in Target stores",
                  ]}
                  cut={[
                    "Information and services on Target.com unconnected to Target stores",
                    "Content that does not affect the enjoyment of goods and services offered in the stores",
                    "The request for a preliminary injunction, refused without prejudice until after discovery",
                  ]}
                  note="Under California's Unruh Act and Disabled Persons Act, the court held, the whole site was reachable as a service of a business establishment, store or no store. That is why the money in this case came from state law."
                />

                <CaseProse>
                  <p>
                    Three things follow from this that are still true. First, the nexus test began
                    life as a limitation on a plaintiff&apos;s claim, and it has stayed one: it is
                    the reason a purely online business is treated differently from one with stores
                    in most of the country. Second, the same order is the reason the{" "}
                    <Link href="/cases/robles-v-dominos">Ninth Circuit</Link> could find Domino&apos;s
                    covered in 2019 without deciding whether websites are places, and the reason the{" "}
                    <Link href="/cases/gil-v-winn-dixie">Eleventh Circuit</Link> majority in 2021
                    thought it could reach the opposite result for a site that sold nothing. Third,
                    California law was broader than federal law in 2006 and remains so, which is why
                    the state accounts for a large share of website filings and why the damages in
                    every one of these cases come from Sacramento rather than Washington.
                  </p>
                  <p>
                    The class certification order a year later added a fourth. Bruce Sexton, the
                    named plaintiff, could not show that the website had denied him access to the
                    goods and services of a store, so his own ADA claim failed and the court ordered a
                    replacement class representative for the federal claims. The case he started
                    outlived his part in it. He remained a plaintiff under state law and received
                    $20,000 in the settlement, which he said he would put toward founding a nonprofit
                    for blind Californians.
                  </p>
                </CaseProse>

                <CircuitPositions />
              </CaseSection>

              <CaseSection id="prevented" title="Practical lessons from the record">
                <CaseProse>
                  <p>
                    Five points where the outcome was still open. The notable thing about this case
                    is how many of them the defendant took, which is why it lasted three years rather
                    than six and why the company is now cited by its former opponents as the model.
                  </p>
                </CaseProse>

                <div className="mx-auto mt-6 w-full max-w-2xl">
                  <CaseExitRamp
                    n={1}
                    title="Answer the letter, May 2005"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          a remediation plan with dates on it.
                        </b>{" "}
                        What followed: everything below.
                      </>
                    }
                  >
                    The NFB asked for four things, all of them Level A and all of them fixable on a
                    platform Target did not even own. The request came with an offer to work
                    together. Eight months of talks failed on commitment, not on technical
                    disagreement.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={2}
                    title="Fix it before the ruling, spring 2006"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          what Target in fact spent, starting within weeks of the complaint.
                        </b>{" "}
                        What followed: the fixes did not end the case, because they were incomplete and
                        unpromised.
                      </>
                    }
                  >
                    This is the ramp Target partly took. By July 2006 the plaintiffs&apos; own expert
                    conceded the site was better; by March 2007, on our measurement, every image-map
                    area had alt text and unnamed links had gone from ten to none. What it did not do
                    was commit to finishing, which is why the court refused to call the case moot.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={3}
                    title="Settle after the September 2006 order"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          an agreement on the terms eventually reached, two years earlier.
                        </b>{" "}
                        What followed: a class certification, a summary judgment loss, and roughly $3.7
                        million in the other side&apos;s fees.
                      </>
                    }
                  >
                    Once the court had held that the state claims reached the whole site without a
                    nexus, the exposure was a California class with statutory damages. The eventual
                    settlement terms were available in 2006.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={4}
                    title="Settle after class certification, October 2007"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          the terms reached ten months later.
                        </b>{" "}
                        What followed: ten months.
                      </>
                    }
                  >
                    Target took this one. With a nationwide class certified, its mootness and intent
                    arguments rejected and a bifurcated trial ordered, it negotiated a settlement that
                    bought certainty, a certification and a relationship with the plaintiff.
                  </CaseExitRamp>
                  <CaseExitRamp
                    n={5}
                    title="Make the plaintiff a partner, 2008 onward"
                    cost={
                      <>
                        What it would have taken:{" "}
                        <b className="font-semibold text-slate-900 dark:text-white">
                          three years of monitoring payments and training days.
                        </b>{" "}
                        What followed: exactly this. It is the ramp that turned a defendant into a reference.
                      </>
                    }
                  >
                    The settlement made the NFB Target&apos;s tester, trainer and certifier. Target
                    kept the arrangement after the three years ended, became the NFB&apos;s first
                    strategic partner in 2016, and today publishes a standard two revisions ahead of
                    the one Winn-Dixie names. The organisation that sued it is the organisation that
                    now recommends it.
                  </CaseExitRamp>
                </div>
              </CaseSection>

              <CaseSection id="debate" title="Public and professional reaction">
                <CaseProse>
                  <p>
                    This case predates most of the platforms where accessibility cases are now argued
                    in public. Hacker News did not exist when it was filed and had no discussion of
                    note when it settled; Reddit was a year old. The developer debate happened on
                    Slashdot, twice, and it is the same debate that would be had about{" "}
                    <Link href="/cases/gil-v-winn-dixie">Winn-Dixie</Link> in 2017 and{" "}
                    <Link href="/cases/robles-v-dominos">Domino&apos;s</Link> in 2019, with the same
                    positions in the same proportions.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    Slashdot, September 2006 and October 2007
                  </h3>
                  <p>
                    The first thread followed the September 2006 order under the headline that sites
                    could now be sued over their design. Its best-rated comments were technical: that
                    the important things on Target&apos;s site were lists of stores, hours and phone
                    numbers, none of which needed pictures; that Target had turned plain text into
                    GIFs, making the site five hundred times bigger and unreadable at once; that the
                    Web Accessibility Initiative&apos;s guidelines had existed since the late 1990s
                    and professional ignorance of them was untenable. Against that ran the arguments
                    that would become standard: that compliance costs small businesses years of
                    profit, that a blind customer could go to a competitor, that the judge should have
                    asked Congress to extend the ADA rather than extend it himself, and that
                    professional disabled litigators would make a racket of it.
                  </p>
                  <p>
                    Two comments cut through. One, rated informative, simply reported the facts that
                    the story had omitted: the NFB wrote to Target in May, negotiations broke down in
                    January, and the suit followed. Another, from a commenter who identified as
                    disabled, said he did not find the ruling foolish at all. The second thread, on
                    class certification a year later, added a developer&apos;s description of the
                    actual defect, a checkout button that was an image hotspot unreachable from the
                    keyboard, and a commenter with a degenerative condition who wrote that voting with
                    your wallet works only up to a point, because 99.9 percent of companies would
                    never willingly cater to disabled people.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    The plaintiff
                  </h3>
                  <p>
                    Unlike the plaintiffs in the two later cases on this site, Bruce Sexton spoke for
                    himself, repeatedly. To Berkeley&apos;s news office in March 2006 he said that
                    people thought he was radical for suing Target and did not try to understand what
                    it was about, and that he was not lawsuit happy; the point was to make a point.
                    At the settlement he commended Target for committing to be a leader. Fifteen
                    years later he was on the panel discussing the Winn-Dixie reversal, by then a
                    disability rights advocate at Syracuse University&apos;s Burton Blatt Institute.
                  </p>
                </CaseProse>

                <CaseQuote source="Bruce Sexton, UC Berkeley news release, 20 March 2006">
                  People think I&apos;m radical because I&apos;m suing Target. They don&apos;t try to
                  understand what this is about. I am not &lsquo;lawsuit happy.&rsquo; We&apos;re
                  doing this to make a point.
                </CaseQuote>

                <CaseProse className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    The organisations
                  </h3>
                  <p>
                    The NFB&apos;s president, Marc Maurer, called the class certification a
                    tremendous step forward for blind people who had for too long been denied equal
                    access to the internet economy, and at settlement said the Federation recognised
                    that Target had already taken action to make its website accessible. Its
                    spokesman Chris Danielsen framed the settlement as a wake-up call to companies
                    selling goods and services online, and added, in the same breath, that the NFB
                    would rather help companies do this than sue them and hoped to resolve its next
                    cases without litigation. Mazen Basrawi of Disability Rights Advocates, the
                    plaintiffs&apos; counsel, put the case in a sentence in 2006: the bottom line was
                    that accessibility was in Target&apos;s interest; they were asking it to make more
                    money.
                  </p>
                  <p>
                    The World Wide Web Consortium adopted the case as a business-case example under
                    the title A Cautionary Tale of Inaccessibility, which is how a generation of
                    accessibility practitioners first met it. Its figures, a $6 million fund and
                    $3,738,864.96 in fees against a company doing $50 billion a year in sales, were
                    the ones that would be reused in every slide deck for the next decade.
                  </p>
                </CaseProse>
              </CaseSection>

              <CaseSection id="record" title="Correcting the record">
                <CaseProse>
                  <p>
                    This case is older than most of the people now citing it, and the version in
                    circulation has drifted from the record in predictable ways. Eleven claims are
                    common enough to answer directly, each set here against what the orders and the
                    settlement actually say.
                  </p>
                </CaseProse>

                <CaseCorrections>
                  <CaseCorrection
                    claim="Target lost the case."
                    record="No court ever found that Target violated any law. It lost a motion to dismiss and a motion for summary judgment, which decide whether a case may continue, and then settled. The settlement agreement records that there is no admission or concession by Target of any kind."
                  />
                  <CaseCorrection
                    claim="The court held that all commercial websites must be accessible under the ADA."
                    record="It held the opposite for part of the site. The ADA claim survived only to the extent Target.com impeded enjoyment of the goods and services of Target stores, and was dismissed as to everything unconnected to them. That limitation is the nexus test."
                  />
                  <CaseCorrection
                    claim="Target paid a $6 million fine."
                    record="There was no fine and no penalty. The $6 million was a fund from which members of the California subclass could claim under the state's Unruh Act and Disabled Persons Act, with most claimants receiving about $3,500. The nationwide ADA class received injunctive terms and no money, because the ADA provides none."
                  />
                  <CaseCorrection
                    claim="The $6 million went to the National Federation of the Blind."
                    record="It went to individual claimants. The NFB and its co-counsel were awarded $3,738,864.96 in fees and costs separately, in August 2009, and were paid for monitoring work under the settlement."
                  />
                  <CaseCorrection
                    claim="The settlement required Target to meet WCAG."
                    record="It required Target.com to meet the Target Online Assistive Technology Guidelines, a document Target wrote and attached to the agreement, and to obtain the NFB's own certification. WCAG is not named in the settlement."
                  />
                  <CaseCorrection
                    claim="Target refused to engage with the NFB before being sued."
                    record="It engaged for eight months, from May 2005 to January 2006. The talks failed because Target would not commit to a remediation programme, not because it would not talk."
                  />
                  <CaseCorrection
                    claim="This was the first website accessibility lawsuit."
                    record="A blind plaintiff sued Southwest Airlines over its website in Florida in 2002 and lost for want of a physical place. Target was the first case to survive a motion to dismiss against a retailer with stores, the first to certify a class, and the largest settlement to that date."
                  />
                  <CaseCorrection
                    claim="Bruce Sexton won his case against Target."
                    record="His own ADA claim failed at the class certification stage because he could not show the site had denied him access to a store, and the court ordered a substitute representative for the federal claims. He remained a plaintiff under state law and received $20,000 in the settlement."
                  />
                  <CaseCorrection
                    claim="It was an ADA case, and California law was incidental."
                    record="Every dollar came from California law. The court held the Unruh Act and the Disabled Persons Act reached the whole website with no nexus to a store, which is broader than its ADA holding, and the damages fund was for California residents only."
                  />
                  <CaseCorrection
                    claim="Target.com was Target's own site, so the defects were Target's own code."
                    record="From 2001 to 2011 Target.com ran on Amazon's platform under a partnership agreement; the archived 2006 pages carry Amazon's address structure. Target made the fixes on a platform it did not own, which is worth remembering when a vendor is blamed for a barrier today."
                  />
                  <CaseCorrection
                    claim="The settlement is what fixed the site."
                    record="The fixing started within weeks of the complaint. The plaintiffs' expert conceded improvement by July 2006; the court found keyboard access fully addressed by October 2007; our measurement of the archived home page shows image-map alt text complete by March 2007 and missing image alt text at zero by June 2008, ten weeks before the settlement was announced."
                  />
                </CaseCorrections>
              </CaseSection>

              <CaseSection id="now" title="What it means now">
                <CaseProse>
                  <p>
                    The 2006 order is still cited in nearly every website case in the country, on
                    both sides, because it gave each side half of what it wanted. The company that
                    was sued is now the field&apos;s standard example of the other way to respond.
                    And the site itself, unusually, can be measured before and after.
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">
                    Did the site get fixed?
                  </h3>
                  <p>
                    Target.com in 2006 was served as plain HTML, so the Internet Archive&apos;s
                    captures contain the markup a screen reader would have met. We measured the home
                    page at five points between six days before the complaint and three years after
                    the settlement, and then the live site on 2 September 2026, counting the defects
                    the complaint named: images with no alt attribute, image-map areas with no alt
                    attribute, and links with no accessible name.
                  </p>
                </CaseProse>

                <CaptureSeries
                  title="The Target.com home page, 2006 to 2026"
                  lede="Archived captures rendered by the Internet Archive, plus the live site. The February 2006 capture is the site as it stood when the complaint was filed six days later."
                  site="target.com"
                  rows={[
                    { date: "1 Feb 2006", phase: "Six days before the complaint", images: 361, missingAlt: 192, unnamedLinks: 10, mapAreas: 85, mapAreasMissingAlt: 85, lang: false },
                    { date: "24 Mar 2007", phase: "Six months after the order", images: 55, missingAlt: 5, unnamedLinks: 0, mapAreas: 152, mapAreasMissingAlt: 0, lang: false },
                    { date: "1 Jun 2008", phase: "Ten weeks before the settlement", images: 54, missingAlt: 0, unnamedLinks: 2, mapAreas: 56, mapAreasMissingAlt: 0, lang: true },
                    { date: "1 Jun 2009", phase: "After the February 2009 deadline", images: 53, missingAlt: 0, unnamedLinks: 4, mapAreas: 14, mapAreasMissingAlt: 0, lang: true },
                    { date: "31 May 2012", phase: "After leaving Amazon's platform", images: 42, missingAlt: 0, unnamedLinks: 5, mapAreas: 9, mapAreasMissingAlt: 0, lang: true },
                    { date: "2 Sep 2026", phase: "Live site", images: 43, missingAlt: 0, unnamedLinks: 1, lang: true },
                  ]}
                  note="Counts are of the served markup as rendered. The 2006 page loaded 361 image elements, many of them spacer and layout graphics, and more than half had no alt attribute at all; the complaint's description of pictures announced as file names is what that number sounds like. A link flagged as unnamed by an automated rule may take its name from context a rule cannot see. These counts find the class of defect the case was about and nothing more."
                />

                <CaseProse>
                  <p>
                    This is the clearest before-and-after in any of the three cases on this site, and
                    it is worth being precise about what it shows. The site went from more than half
                    its images unlabelled and every image-map hotspot unlabelled to zero of each
                    inside two years, and it has stayed there through a change of platform and
                    fourteen years of redesigns. What the count cannot show is whether a blind
                    customer could complete a purchase; the court&apos;s own finding in 2007 was that
                    keyboard access was the one barrier fully fixed by then, and a page can be
                    labelled perfectly and still be unusable.
                  </p>
                </CaseProse>

                <MoneyBars
                  title="Where the money went"
                  lede="Every figure in the settlement and the fee order, to one scale. The nationwide class under the ADA is on the chart at zero, which is what the federal statute provides."
                  items={[
                    { label: "Damages fund for the California class", note: "Settlement agreement, August 2008", value: 6_000_000, tone: "award" },
                    { label: "Plaintiffs' fees and costs", note: "Order of 3 August 2009", value: 3_738_865, tone: "award" },
                    { label: "Bruce Sexton", note: "Named plaintiff, reported at settlement", value: 20_000, tone: "award" },
                    { label: "A typical California claimant", note: "About $3,500, reported at settlement", value: 3_500, tone: "award" },
                    { label: "The nationwide ADA class", note: "Injunctive terms only; the ADA provides no damages", value: 0, tone: "none" },
                  ]}
                  note="The fee figure is rounded to the dollar from $3,738,864.96. Target's own legal costs, the cost of remediation, and the monitoring and training payments to the NFB are not in the public record."
                />

                <CaseProse>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    The company since
                  </h3>
                  <p>
                    Target&apos;s accessibility statement today names WCAG 2.2 Level AA as its
                    measure, describes work with advocacy groups, specialists and disabled people,
                    offers the Aira visual-interpreting service free in its stores, and describes an
                    accessible self-checkout kiosk it showcased at the NFB&apos;s national convention.
                    Its live home page measured clean on the counts above. It runs no accessibility
                    overlay. Three things distinguish it from the other two defendants on this site:
                    the standard it names is current, the plaintiff organisation vouches for it, and
                    it has kept the arrangement for seventeen years after the order that required it
                    lapsed.
                  </p>
                  <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
                    What to take from it
                  </h3>
                  <ul>
                    <li>
                      <strong>The nexus test is a limit, and it was written by a court that ruled
                      for the plaintiffs.</strong> Anyone citing this case for the proposition that
                      every website is covered is citing the half of the order that went their way.
                    </li>
                    <li>
                      <strong>State law is where the money is.</strong> The $6 million, the $4,000 in{" "}
                      <Link href="/cases/robles-v-dominos">Domino&apos;s</Link> and the zero in{" "}
                      <Link href="/cases/gil-v-winn-dixie">Winn-Dixie</Link> are all explained by
                      one fact: Title III of the ADA has no damages remedy, and California&apos;s
                      Unruh Act does.
                    </li>
                    <li>
                      <strong>Fixing while fighting shortens the fight.</strong> Target&apos;s case
                      ran three and a half years to the fee order; the two defendants who fixed
                      nothing until ordered to ran nearly six.
                    </li>
                    <li>
                      <strong>Your platform vendor is not your defence.</strong> Target fixed
                      Amazon&apos;s markup. A court will treat the site as yours because it is.
                    </li>
                    <li>
                      <strong>A written standard of your own is only as good as its auditor.</strong>{" "}
                      The settlement used Target&apos;s guidelines rather than WCAG, and it worked
                      because an independent organisation tested against them every quarter.
                    </li>
                  </ul>
                </CaseProse>

                <CaseNote title="A note on the three cases together">
                  <p>
                    Target, 2006: the nexus test is born, as a limit, in a case the plaintiffs win.{" "}
                    <Link href="/cases/robles-v-dominos">Domino&apos;s</Link>, 2019: the test is
                    applied by a federal appeals court to a site that sells, and the defendant loses.{" "}
                    <Link href="/cases/gil-v-winn-dixie">Winn-Dixie</Link>, 2021: the test is
                    discarded by another appeals court for a site that does not sell, and the ruling
                    is then erased. Twenty years on, the question the first case deliberately left
                    open, what happens when there are no stores at all, is still open.
                  </p>
                </CaseNote>
              </CaseSection>

              <CaseSection id="sources" title="Sources" eyebrow="Primary record and attributed analysis">
                <CaseProse>
                  <p>
                    Rulings, procedural facts and the terms of the settlement are drawn from the two
                    published orders and the settlement agreement. Statements by the parties are
                    attributed to the release or report that carried them. Where the record is
                    silent, notably on Target&apos;s own costs, this page does not estimate.
                  </p>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">Primary</h3>
                  <ul>
                    <li>
                      <a href={primarySources.order2006} target="_blank" rel="noopener noreferrer">
                        Memorandum and order on the motion to dismiss, 452 F. Supp. 2d 946 (6 September 2006)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.order2007} target="_blank" rel="noopener noreferrer">
                        Order on class certification and summary judgment, 582 F. Supp. 2d 1185 (2 October 2007)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.settlement} target="_blank" rel="noopener noreferrer">
                        Class settlement agreement (2008)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.docket} target="_blank" rel="noopener noreferrer">
                        District court docket, No. 3:06-cv-01802
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.brailleMonitor} target="_blank" rel="noopener noreferrer">
                        NFB settlement announcement, Braille Monitor (October 2008)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.berkeleyRelease} target="_blank" rel="noopener noreferrer">
                        UC Berkeley news release on Bruce Sexton (20 March 2006)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.certification2010} target="_blank" rel="noopener noreferrer">
                        NFB Nonvisual Accessibility Web Certification granted to Target.com (February 2010)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.partnership} target="_blank" rel="noopener noreferrer">
                        NFB Strategic Nonvisual Accessibility Partnership programme
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.targetAccessibility} target="_blank" rel="noopener noreferrer">
                        Target accessibility statement, checked 2 September 2026
                      </a>
                    </li>
                  </ul>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                    Reporting and analysis
                  </h3>
                  <ul>
                    <li>
                      <a href="https://www.foxnews.com/story/judge-approves-blind-shoppers-lawsuit-against-target" target="_blank" rel="noopener noreferrer">
                        Associated Press on class certification, with Target&apos;s and the NFB&apos;s statements (3 October 2007)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.nbcnews.com/id/wbna26424772" target="_blank" rel="noopener noreferrer">
                        Associated Press on the settlement (27 August 2008)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.baltimoresun.com/news/bs-xpm-2008-08-28-0808280028-story.html" target="_blank" rel="noopener noreferrer">
                        Baltimore Sun on the settlement and Bruce Sexton&apos;s award (28 August 2008)
                      </a>
                    </li>
                    <li>
                      <a href={primarySources.w3cCaseStudy} target="_blank" rel="noopener noreferrer">
                        W3C Web Accessibility Initiative, &ldquo;Target Corporation: A Cautionary Tale of Inaccessibility&rdquo; (archived, 2009)
                      </a>
                    </li>
                    <li>
                      <a href="https://www.loeb.com/en/insights/publications/2006/11/california-class-action-update" target="_blank" rel="noopener noreferrer">
                        Loeb &amp; Loeb on the September 2006 order (November 2006)
                      </a>
                    </li>
                    <li>
                      <a href="https://dralegal.org/case/national-federation-of-the-blind-nfb-et-al-v-target-corporation/" target="_blank" rel="noopener noreferrer">
                        Disability Rights Advocates case page
                      </a>
                    </li>
                    <li>
                      <a href="https://www.supermarketnews.com/latest-news/targetcom-drop-partnership-amazon" target="_blank" rel="noopener noreferrer">
                        Supermarket News on the end of the Target.com and Amazon partnership
                      </a>
                    </li>
                    <li>
                      <a href="https://disabilityrightstoday.org/wp-content/uploads/2021/09/episode1-transcript.pdf" target="_blank" rel="noopener noreferrer">
                        ADA Live transcript, with Mark Riccobono&apos;s remarks on Target (21 April 2021)
                      </a>
                    </li>
                  </ul>
                  <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                    Community
                  </h3>
                  <ul>
                    <li>
                      <a href="https://slashdot.org/story/06/09/09/224204/judge-rules-sites-can-be-sued-over-design" target="_blank" rel="noopener noreferrer">
                        Slashdot discussion of the September 2006 order
                      </a>
                    </li>
                    <li>
                      <a href="https://yro.slashdot.org/story/07/10/14/035229/web-accessibility-gets-a-boost-in-california-court" target="_blank" rel="noopener noreferrer">
                        Slashdot discussion of the October 2007 class certification
                      </a>
                    </li>
                  </ul>
                </CaseProse>
              </CaseSection>

              <section id="discussion" aria-labelledby="discussion-heading" className="scroll-mt-28">
                <CaseComments
                  caseSlug={CASE_SLUG}
                  caseTitle="National Federation of the Blind v. Target"
                  initialComments={comments}
                />
              </section>

              <RelatedContent
                content="ADA website accessibility lawsuit class action Unruh Act nexus screen reader retail settlement"
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
