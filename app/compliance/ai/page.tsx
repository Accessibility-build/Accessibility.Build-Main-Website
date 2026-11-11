import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"
import { KeyFacts } from "@/components/research/key-facts"
import { clampDescription } from "@/lib/metadata"
import { cn } from "@/lib/utils"

const pageTitle = "AI Accessibility Law: EU AI Act, Colorado and California"
const pageDescription =
  "Laws requiring accessible AI notices, labels and chatbots: EU AI Act Article 50(5) and 16(l), Colorado's WCAG 2.2 draft rule, California ADMT notices."
const ogTitle = encodeURIComponent(pageTitle)

// Dates the page is pinned to. Restamp both when the Colorado rules are adopted
// or the Commission revises its Article 50 Guidelines.
const REVIEWED_ON = "11 November 2026"
const REVIEWED_ISO = "2026-11-11"

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "ai accessibility law",
    "eu ai act accessibility",
    "article 50 ai act accessibility",
    "article 16(l) ai act",
    "accessible ai disclosure",
    "accessible chatbot law",
    "colorado ai rules wcag 2.2",
    "california admt pre-use notice wcag",
    "code of practice ai-generated content accessibility",
    "can-asc-6.2",
  ],
  alternates: {
    canonical: "/compliance/ai",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/compliance/ai",
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
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

// Primary sources, all read on the review date.
const AI_ACT = "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689"
const OMNIBUS = "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32026R1744"
const GUIDELINES_PAGE =
  "https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems"
const GUIDELINES_PDF = "https://ec.europa.eu/newsroom/dae/redirection/document/131215"
const CODE_PAGE = "https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content"
const CODE_OPINION =
  "https://digital-strategy.ec.europa.eu/en/library/commission-opinion-assessment-code-practice-transparency-ai-generated-content"
const CODE_PDF = "https://ec.europa.eu/newsroom/dae/redirection/document/129555"
const STANDARDISATION_REQUEST =
  "https://ec.europa.eu/transparency/documents-register/api/files/C(2023)3215_0/de00000001048942"
const CO_SB189_PDF = "https://leg.colorado.gov/bill_files/116489/download"
const CO_SB189_PAGE = "https://leg.colorado.gov/bills/sb26-189"
const CO_HB1263 = "https://leg.colorado.gov/laws/session-laws/HB26-1263/208/download"
const CO_AG = "https://coag.gov/ai/"
const CO_PROPOSED =
  "https://coag.gov/app/uploads/2026/08/2026.08.11-ADMT-Chatbot-Act-Rulemaking.docx"
const CO_INTERIM =
  "https://coag.gov/app/uploads/2026/10/2026.10.06-ADMT-Chatbot-Act-Rulemaking-Interim-Draft-Redline.pdf"
const WCAG22 = "https://www.w3.org/TR/WCAG22/"
const CPPA_TEXT = "https://cppa.ca.gov/regulations/pdf/ccpa_updates_cyber_risk_admt_appr_text.pdf"
const CPPA_STATUS = "https://cppa.ca.gov/regulations/ccpa_updates.html"
const CPPA_FINES = "https://cppa.ca.gov/regulations/cpi_adjustment.html"
const CRD_RELEASE =
  "https://calcivilrights.ca.gov/2025/06/30/civil-rights-council-secures-approval-for-regulations-to-protect-against-employment-discrimination-related-to-artificial-intelligence/"
const CRD_TEXT =
  "https://calcivilrights.ca.gov/wp-content/uploads/sites/32/2025/06/Final-Text-regulations-automated-employment-decision-systems.pdf"
const CRD_FSOR =
  "https://calcivilrights.ca.gov/wp-content/uploads/sites/32/2025/06/Final-Statement-of-Reasons-regulations-automated-employment-decision-systems.pdf"
const DOJ_AI = "https://www.ada.gov/resources/ai-guidance/"
const NYC_RULE =
  "https://rules.cityofnewyork.us/wp-content/uploads/2023/04/DCWP-NOA-for-Use-of-Automated-Employment-Decisionmaking-Tools-2.pdf"
const NYC_FAQ = "https://www.nyc.gov/site/dca/businesses/faq-automated-employment-decision-tools.page"
const TX_TRAIGA = "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.htm"
const CA_TBS_DIRECTIVE = "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32592"
const CA_ASC_62 =
  "https://accessible.canada.ca/creating-accessibility-standards/overview-asc-62-accessible-equitable-artificial-intelligence-systems"

const sources = [
  {
    label:
      "Regulation (EU) 2024/1689 (Artificial Intelligence Act), OJ L, 12.7.2024: Articles 5, 16, 50, 71, 95, 99, 113 and recitals 80, 132, 142 and 165",
    href: AI_ACT,
  },
  {
    label:
      "Regulation (EU) 2026/1744 (Digital Omnibus on AI) of 8 July 2026, OJ L, 24.7.2026: new Articles 111(2), 111(4) and 113(c)",
    href: OMNIBUS,
  },
  {
    label:
      "European Commission, Guidelines on the implementation of the transparency obligations under Article 50 of the AI Act, C(2026) 7702 final, 5 November 2026 (PDF)",
    href: GUIDELINES_PDF,
  },
  {
    label: "European Commission, Article 50 Guidelines library page (published 20 July 2026, last updated 5 November 2026)",
    href: GUIDELINES_PAGE,
  },
  {
    label: "Code of Practice on Transparency of AI-generated Content, final text of 10 June 2026 (PDF)",
    href: CODE_PDF,
  },
  {
    label: "European Commission, Code of Practice on AI-generated content policy page",
    href: CODE_PAGE,
  },
  {
    label: "European Commission, Opinion of 8 July 2026 on the assessment of the Code of Practice on transparency of AI-generated content",
    href: CODE_OPINION,
  },
  {
    label: "Commission Implementing Decision C(2023) 3215 final of 22 May 2023, the AI standardisation request (recital 14)",
    href: STANDARDISATION_REQUEST,
  },
  {
    label: "Colorado SB26-189, Automated Decision-Making Technology, signed act (C.R.S. 6-1-1704 and 6-1-1706)",
    href: CO_SB189_PDF,
  },
  {
    label: "Colorado General Assembly, SB26-189 bill page (signed 14 May 2026)",
    href: CO_SB189_PAGE,
  },
  {
    label: "Colorado HB26-1263, Conversational Artificial Intelligence Services, Session Laws 2026 chapter 208 (approved 29 May 2026)",
    href: CO_HB1263,
  },
  {
    label: "Colorado Attorney General, ADMT and Chatbot Act rulemaking page, 4 CCR 904-6 (checked 11 November 2026)",
    href: CO_AG,
  },
  {
    label: "Colorado Attorney General, proposed rules filed 11 August 2026, Rules 1.3, 3.2 and 14.1 (Word document)",
    href: CO_PROPOSED,
  },
  {
    label: "Colorado Attorney General, interim draft redline of 6 October 2026 (PDF)",
    href: CO_INTERIM,
  },
  {
    label: "W3C, Web Content Accessibility Guidelines (WCAG) 2.2, Recommendation of 12 December 2024",
    href: WCAG22,
  },
  {
    label:
      "California Privacy Protection Agency, approved regulation text on CCPA updates, cybersecurity audits, risk assessments and ADMT: 11 CCR §§ 7003, 7200, 7220 and 7221 (PDF)",
    href: CPPA_TEXT,
  },
  {
    label: "California Privacy Protection Agency, CCPA updates rulemaking status page (approved 22 September 2025, effective 1 January 2026)",
    href: CPPA_STATUS,
  },
  {
    label: "California Privacy Protection Agency, 2025 CPI adjustment of administrative fine amounts",
    href: CPPA_FINES,
  },
  {
    label: "California Civil Rights Department, release of 30 June 2025 on the automated-decision system employment regulations",
    href: CRD_RELEASE,
  },
  {
    label: "California Civil Rights Council, final text of the automated-decision system employment regulations, 2 CCR § 11016 (PDF)",
    href: CRD_TEXT,
  },
  {
    label: "California Civil Rights Council, Final Statement of Reasons for the automated-decision system regulations (PDF)",
    href: CRD_FSOR,
  },
  {
    label: "US Department of Justice, Algorithms, Artificial Intelligence, and Disability Discrimination in Hiring, 12 May 2022",
    href: DOJ_AI,
  },
  {
    label: "New York City DCWP, notice of adoption of the rule on automated employment decision tools, 6 RCNY § 5-304 (PDF)",
    href: NYC_RULE,
  },
  {
    label: "New York City DCWP, frequently asked questions on automated employment decision tools",
    href: NYC_FAQ,
  },
  {
    label: "Texas HB 149 (89th Legislature), Texas Responsible Artificial Intelligence Governance Act, enrolled text",
    href: TX_TRAIGA,
  },
  {
    label: "Treasury Board of Canada Secretariat, Directive on Automated Decision-Making (section 6.1.1)",
    href: CA_TBS_DIRECTIVE,
  },
  {
    label: "Accessibility Standards Canada, overview of CAN-ASC-6.2:2025, Accessible and Equitable Artificial Intelligence Systems",
    href: CA_ASC_62,
  },
]

type Status = "applies" | "adopted" | "draft" | "guidance" | "voluntary"

const statusStyles: Record<Status, string> = {
  applies:
    "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900",
  adopted: "bg-blue-50 text-blue-800 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-900",
  draft: "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-900",
  guidance: "bg-slate-100 text-slate-800 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
  voluntary:
    "bg-purple-50 text-purple-800 ring-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:ring-purple-900",
}

const regimes: {
  jurisdiction: string
  law: string
  who: string
  what: string
  standard: string
  date: string
  enforcement: string
  status: Status
  statusLabel: string
}[] = [
  {
    jurisdiction: "European Union",
    law: "AI Act, Article 50(5) (with 50(1) to 50(4))",
    who: "Providers of AI that interacts with people and of generative AI; deployers of emotion recognition, biometric categorisation and deep fakes",
    what: "AI-interaction notices, information on marked synthetic content, deep-fake and public-interest text disclosures, emotion-recognition notices",
    standard:
      "None named. \"Applicable accessibility requirements\", which the Commission reads as the EAA and the Web Accessibility Directive where they apply. The Code of Practice encourages EN 301 549 and WCAG 2.1 AA",
    date: "2 August 2026 (Article 50(2) marking for generative systems already on the market: 2 December 2026)",
    enforcement: "National market surveillance authorities; fines up to EUR 15 million or 3% of worldwide turnover (Article 99(4))",
    status: "applies",
    statusLabel: "Applies",
  },
  {
    jurisdiction: "European Union",
    law: "AI Act, Article 16(l)",
    who: "Providers of high-risk AI systems (not deployers)",
    what: "The high-risk AI system itself",
    standard: "Accessibility requirements of Directives (EU) 2016/2102 and 2019/882, whose harmonised standard is EN 301 549",
    date: "2 December 2027 (Annex III systems); 2 August 2028 (Annex I systems)",
    enforcement: "National market surveillance authorities; fines up to EUR 15 million or 3% (Article 99(4)(a))",
    status: "adopted",
    statusLabel: "Adopted, not yet applicable",
  },
  {
    jurisdiction: "Colorado",
    law: "C.R.S. 6-1-1704(8) (SB26-189) and draft AG Rule 3.2(A)(2), 4 CCR 904-6",
    who: "Deployers and developers of covered automated decision-making technology; under the draft rule, also operators of conversational AI services (HB26-1263)",
    what: "Pre-use notices, public notices and adverse-outcome disclosures; chatbot AI disclosures under the draft rule",
    standard:
      "Statute: \"reasonably accessible\". Draft rule: WCAG 2.2 of 12 December 2024, \"such as, but not limited to\", no conformance level named",
    date: "1 January 2027 (statute and stated rule effective date)",
    enforcement:
      "Attorney General only, under the Colorado Consumer Protection Act; 60-day cure where cure is possible; no private right of action",
    status: "draft",
    statusLabel: "Statute enacted; rules not final",
  },
  {
    jurisdiction: "California",
    law: "CCPA regulations, 11 CCR § 7003(b)(3) applied by § 7220(b)(1) and § 7221",
    who: "Businesses using automated decision-making technology (ADMT) for significant decisions",
    what: "ADMT Pre-use Notices and ADMT appeal communications",
    standard: "WCAG 2.1 of 5 June 2018, \"such as\", no conformance level named; alternative format route in other contexts",
    date: "1 January 2027 for ADMT already in use before that date (§ 7200(b)); regulations effective 1 January 2026",
    enforcement: "Administrative fines up to $2,663 per violation or $7,988 per intentional violation (2025 CPI-adjusted)",
    status: "applies",
    statusLabel: "In force; ADMT duties from 2027",
  },
  {
    jurisdiction: "California",
    law: "Civil Rights Council employment regulations, 2 CCR § 11016(c)(5) and (d)(1)",
    who: "Employers and other covered entities using automated-decision systems",
    what: "ADS assessments of skill, dexterity, reaction time, tone of voice or facial expression: reasonable accommodation may be needed",
    standard: "None; existing reasonable-accommodation duty (Gov. Code 12940(m)(1))",
    date: "1 October 2025",
    enforcement: "California fair employment law; ADS data kept for 4 years",
    status: "applies",
    statusLabel: "In force",
  },
  {
    jurisdiction: "New York City",
    law: "Local Law 144 of 2021, rule 6 RCNY § 5-304(a)",
    who: "Employers and employment agencies using automated employment decision tools",
    what: "The candidate notice must explain how to request an alternative selection process or a reasonable accommodation",
    standard: "None",
    date: "5 July 2023",
    enforcement: "DCWP rule; an alternative selection process itself is not required",
    status: "applies",
    statusLabel: "In force",
  },
  {
    jurisdiction: "United States (federal)",
    law: "ADA, DOJ guidance on algorithms and AI in hiring",
    who: "Employers using AI and algorithmic hiring tools",
    what: "Reasonable accommodations so disabled applicants and employees can meet the tool's standards",
    standard: "None",
    date: "12 May 2022 (guidance); the parallel EEOC document has been removed",
    enforcement: "The ADA itself; the guidance is non-binding",
    status: "guidance",
    statusLabel: "Guidance, still published",
  },
  {
    jurisdiction: "Canada (federal)",
    law: "Treasury Board Directive on Automated Decision-Making, 6.1.1",
    who: "Federal institutions",
    what: "Published algorithmic impact assessment results",
    standard: "\"In an accessible format\"; no standard named",
    date: "In force (page modified 24 June 2025)",
    enforcement: "Treasury Board policy for federal institutions",
    status: "applies",
    statusLabel: "In force",
  },
  {
    jurisdiction: "Canada",
    law: "CAN-ASC-6.2:2025, Accessible and Equitable Artificial Intelligence Systems",
    who: "Organisations whose AI affects workers, customers or the public",
    what: "AI systems, and notices telling the public about AI use",
    standard: "The standard itself",
    date: "Published December 2025",
    enforcement: "None unless adopted in regulation (as reported)",
    status: "voluntary",
    statusLabel: "Voluntary standard",
  },
]

const otherEuMentions = [
  {
    ref: "Article 5(1)(b)",
    text: "Prohibits AI that exploits vulnerabilities due to age, disability or a specific social or economic situation to materially distort behaviour. Applies since 2 February 2025; fines up to EUR 35 million or 7% under Article 99(3).",
  },
  {
    ref: "Article 60(4)(g)",
    text: "Real-world testing must appropriately protect subjects who belong to vulnerable groups due to age or disability.",
  },
  {
    ref: "Article 71(6)",
    text: "The EU database of high-risk systems \"shall comply with the applicable accessibility requirements\".",
  },
  {
    ref: "Article 95(2)(e)",
    text: "Voluntary codes of conduct may cover the impact of AI on vulnerable persons, including accessibility for persons with a disability.",
  },
  {
    ref: "Recital 80",
    text: "Cites the UN Convention on the Rights of Persons with Disabilities and says providers should ensure compliance with the accessibility directives \"by design\".",
  },
  {
    ref: "Recital 132",
    text: "Transparency notices \"should be provided in accessible formats for persons with disabilities\".",
  },
  {
    ref: "Recitals 142 and 165",
    text: "Encourage funding for AI that increases accessibility, and voluntary codes on accessibility to persons with disability.",
  },
]

const criteria: { sc: string; name: string; href: string; why: string }[] = [
  {
    sc: "1.1.1",
    name: "Non-text Content",
    href: "/wcag/1-1-1",
    why: "An AI icon or badge needs a text alternative that says what it means. The Code of Practice asks for labels \"detectable\" by assistive technologies.",
  },
  {
    sc: "1.3.1",
    name: "Info and Relationships",
    href: "/wcag/1-3-1",
    why: "Screen reader users need to know who said what in a transcript, and which text is the AI notice.",
  },
  {
    sc: "1.4.1",
    name: "Use of Color",
    href: "/wcag/1-4-1",
    why: "A coloured dot or tint alone cannot carry the AI label. The Code names users with colour vision deficiencies.",
  },
  {
    sc: "1.4.3 and 1.4.11",
    name: "Contrast (Minimum) and Non-text Contrast",
    href: "/wcag/1-4-3",
    why: "Text labels need 4.5:1 and icons 3:1. The Code asks for high contrast icons or equivalent labels.",
  },
  {
    sc: "1.4.10",
    name: "Reflow",
    href: "/wcag/1-4-10",
    why: "Colorado's draft rule and California's regulation both require notices to be readable on smaller screens.",
  },
  {
    sc: "1.2.2 and 1.2.x",
    name: "Captions and audio description",
    href: "/wcag/1-2-2",
    why: "A spoken disclosure in a video needs captions; a visual label in a video needs an audio equivalent.",
  },
  {
    sc: "2.1.1",
    name: "Keyboard",
    href: "/wcag/2-1-1",
    why: "Open the chat, send, stop, regenerate and dismiss the notice without a mouse.",
  },
  {
    sc: "2.2.1",
    name: "Timing Adjustable",
    href: "/wcag/2-2-1",
    why: "Chat sessions that time out need a warning and a way to extend.",
  },
  {
    sc: "2.4.3",
    name: "Focus Order",
    href: "/wcag/2-4-3",
    why: "Opening a chat widget should move focus into it, and closing it should return focus to the trigger.",
  },
  {
    sc: "2.4.11",
    name: "Focus Not Obscured (Minimum)",
    href: "/wcag/2-4-11",
    why: "A floating chat launcher or persistent AI banner must not cover the focused element. New in WCAG 2.2, so it matters under Colorado's draft rule.",
  },
  {
    sc: "3.3.8",
    name: "Accessible Authentication (Minimum)",
    href: "/wcag/3-3-8",
    why: "If users must sign in to reach the assistant or the alternative route, no memory or puzzle test without an alternative. Also new in WCAG 2.2.",
  },
  {
    sc: "4.1.2",
    name: "Name, Role, Value",
    href: "/wcag/4-1-2",
    why: "Every chat control, including the AI badge if it is interactive, exposes a name and role.",
  },
  {
    sc: "4.1.3",
    name: "Status Messages",
    href: "/wcag/4-1-3",
    why: "Announce the first-turn AI greeting, \"responding\" and \"response complete\" without moving focus.",
  },
]

const faqs = [
  {
    question: "Does the EU AI Act require AI disclosures and chatbots to be accessible?",
    answer:
      "Yes, for the transparency information. Article 50(5) of Regulation (EU) 2024/1689 says the notices required by Article 50(1) to (4) must be given in a clear and distinguishable manner at the latest at the first interaction or exposure, and that the information shall conform to the applicable accessibility requirements. That covers telling people they are talking to an AI system, information about marked synthetic content, deep-fake and public-interest text disclosures, and emotion recognition or biometric categorisation notices. It has applied since 2 August 2026. Separately, Article 16(l) requires providers of high-risk AI systems to make the system itself comply with the accessibility requirements of Directives 2016/2102 and 2019/882, from 2 December 2027 for Annex III systems and 2 August 2028 for Annex I systems.",
  },
  {
    question: "What does \"applicable accessibility requirements\" mean in Article 50(5)?",
    answer:
      "The Commission's Article 50 Guidelines, C(2026) 7702 final of 5 November 2026, answer this in paragraph 144: Article 50 does not impose distinct or additional accessibility requirements. Providers and deployers must know the accessibility requirements that already apply, for example under the Web Accessibility Directive (2016/2102) and the European Accessibility Act (2019/882), and assess whether their product, service or content falls under them. If it does, the AI notice is part of that product or service and must meet those requirements, which in practice means EN 301 549. The Guidelines still define a clear notice in paragraph 142 as one that is noticeable, easy to understand and accessible for the person concerned, including persons with disabilities. The Guidelines are not binding.",
  },
  {
    question: "Which WCAG version applies to AI notices?",
    answer:
      "It depends on the law. The EU AI Act names no standard; the Code of Practice on Transparency of AI-generated Content encourages EN 301 549 and WCAG 2.1 Level AA, and EN 301 549 is the harmonised standard for the EAA and the Web Accessibility Directive. Colorado's draft Rule 3.2(A)(2) names WCAG 2.2 of 12 December 2024, and since the 6 October 2026 interim draft it says \"such as, but not limited to\". California's 11 CCR § 7003(b)(3) names WCAG 2.1 of 5 June 2018 for ADMT Pre-use Notices. Neither US text names a conformance level. Building to WCAG 2.2 Level AA covers the success criteria of every version named; the one caveat is that EN 301 549 V3.2.1 still lists 4.1.1 Parsing, which WCAG 2.2 removed.",
  },
  {
    question: "Are Colorado's AI accessibility rules final?",
    answer:
      "No. As of 11 November 2026 the Attorney General's rules under 4 CCR 904-6 were still drafts. Proposed rules were filed on 11 August 2026, an interim redline followed on 6 October, and the formal hearing and comment deadline was 26 October 2026. The rulemaking page says the Office will consider all comments received by that date in drafting the final rules, and no adopted rules were posted. The statutory duty is already law: C.R.S. 6-1-1704(8), enacted by SB26-189, requires AI notices and disclosures to be reasonably accessible to consumers with disabilities from 1 January 2027, and the draft rule states the same effective date.",
  },
  {
    question: "Do Colorado's accessibility rules cover chatbots?",
    answer:
      "Under the draft, yes. HB26-1263, approved on 29 May 2026, requires operators of conversational AI services to disclose clearly and conspicuously that the service is artificial intelligence, at the first interaction each day, every three hours or persistently, and whenever a user asks whether it is human, from 1 January 2027. The statute has no accessibility wording of its own. The Attorney General's draft Rule 3.2 applies its accessibility requirement, including the WCAG 2.2 reference, to operator disclosures to users as well as to deployer notices to consumers.",
  },
  {
    question: "Do AI voices used by disabled people need an AI watermark?",
    answer:
      "No, according to the Commission's Article 50 Guidelines. Content that only transforms authentic human input through assistive technologies that allow persons with disabilities to communicate, such as augmentative and alternative communication (AAC), does not need to be marked as AI-generated under Article 50(2). The Guidelines also treat edits made to bring content into line with accessibility requirements as standard editing. The Guidelines are not binding, but they are the Commission's reading of the exception.",
  },
  {
    question: "Do employers using AI hiring tools have accessibility duties?",
    answer:
      "Yes, through disability discrimination law rather than a technical standard. The US Department of Justice's 2022 guidance, still published on ada.gov, says employers must provide requested reasonable accommodations unless doing so would be an undue hardship; the parallel EEOC document has been removed. New York City's 6 RCNY § 5-304(a) requires the automated employment decision tool notice to explain how to request an alternative selection process or a reasonable accommodation. California's 2 CCR § 11016 says an employer using an automated-decision system that measures skill, dexterity or reaction time, or analyses tone of voice or facial expressions, may need to provide reasonable accommodation.",
  },
  {
    question: "Does California's companion chatbot law require accessibility?",
    answer:
      "No. SB 243 (2025), codified at Business and Professions Code 22601 to 22606, requires a clear and conspicuous notification that a companion chatbot is artificially generated and not human where a reasonable person could be misled, and gives a private right of action. Sections 22601 to 22605 contain no accessibility or disability wording. California's accessibility hook for AI notices is the CCPA regulation instead: ADMT Pre-use Notices must follow § 7003(b)(3), which names WCAG 2.1.",
  },
]

const linkClass =
  "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2"

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  )
}

const pClass = "text-slate-600 dark:text-slate-400 mb-4 leading-relaxed"
const h2Class = "text-3xl font-bold text-slate-900 dark:text-white mb-6"
const h3Class = "text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-8"
const strongClass = "text-slate-900 dark:text-white"

export default function AiAccessibilityLawPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Compliance", url: "https://accessibility.build/compliance" },
          { name: "AI and Accessibility Law", url: "https://accessibility.build/compliance/ai" },
        ]}
      />

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
                AI and Accessibility Law
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
              Compliance Guide &bull; Artificial Intelligence
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              AI and Accessibility Law:{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Accessible AI Notices, Labels and Chatbots
              </span>
            </h1>
            <PageByline route="/compliance/ai" variant="hero" tone="inverse" className="mt-0 mb-5" />
            <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-2xl">
              New AI laws make you tell people when they are dealing with a machine. A growing
              number also say that the notice, the label or the system itself must work for disabled
              people. This page brings those rules together: the EU AI Act, Colorado&apos;s ADMT and
              chatbot laws, California&apos;s ADMT notices and employment rules, New York City&apos;s
              hiring-tool notice, US federal guidance and Canada&apos;s AI accessibility standard,
              with the standard each one names and a practical checklist.
            </p>
            <p
              className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 mb-10"
              aria-label="Page status"
            >
              <strong className="font-semibold text-amber-200">
                Status: EU Article 50 applies since 2 August 2026; Colorado rules not final.
              </strong>
              <span>
                Reviewed <time dateTime={REVIEWED_ISO}>{REVIEWED_ON}</time>.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-300 text-sm font-medium mb-1">EU Article 50(5)</p>
              <p className="text-2xl md:text-3xl font-bold text-white">2 Aug 2026</p>
              <p className="text-slate-300 text-xs mt-1">AI notices must meet applicable accessibility requirements</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-300 text-sm font-medium mb-1">Colorado Draft Rule</p>
              <p className="text-2xl md:text-3xl font-bold text-white">WCAG 2.2</p>
              <p className="text-slate-300 text-xs mt-1">ADMT and chatbot disclosures; not final; 1 Jan 2027</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-300 text-sm font-medium mb-1">California ADMT Notices</p>
              <p className="text-2xl md:text-3xl font-bold text-white">WCAG 2.1</p>
              <p className="text-slate-300 text-xs mt-1">11 CCR § 7003(b)(3); due by 1 Jan 2027</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-300 text-sm font-medium mb-1">EU Maximum Fine</p>
              <p className="text-2xl md:text-3xl font-bold text-white">EUR 15m or 3%</p>
              <p className="text-slate-300 text-xs mt-1">Articles 16 and 50 breaches, Article 99(4)</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <KeyFacts
          title="AI accessibility law, the dates and numbers"
          facts={[
            {
              value: "2 Aug 2026",
              label: "EU AI Act Article 50 applies, including 50(5): transparency information shall conform to the applicable accessibility requirements",
              source: "Regulation (EU) 2024/1689, Articles 50(5) and 113",
              sourceHref: AI_ACT,
              asOf: "2026-08-02",
            },
            {
              value: "Para 144",
              label: "Commission Guidelines: Article 50 does not impose distinct or additional accessibility requirements; it points to the EAA and the Web Accessibility Directive",
              source: "Guidelines C(2026) 7702 final",
              sourceHref: GUIDELINES_PDF,
              asOf: "2026-11-05",
            },
            {
              value: "2 Dec 2027",
              label: "Article 16(l) accessibility duty starts for providers of Annex III high-risk AI; 2 August 2028 for Annex I systems",
              source: "Regulation (EU) 2026/1744, new Article 113(c)",
              sourceHref: OMNIBUS,
              asOf: "2026-07-24",
            },
            {
              value: "WCAG 2.1 AA",
              label: "Named, with EN 301 549, in the EU Code of Practice on AI-generated content, which the Commission found adequate for Article 50(2), (4) and (5)",
              source: "Code of Practice, final text",
              sourceHref: CODE_PDF,
              asOf: "2026-06-10",
            },
            {
              value: "WCAG 2.2",
              label: "Named in Colorado's draft Rule 3.2(A)(2) for ADMT notices and chatbot disclosures, with no conformance level; rules not yet final",
              source: "4 CCR 904-6 interim draft",
              sourceHref: CO_INTERIM,
              asOf: "2026-10-06",
            },
            {
              value: "1 Jan 2027",
              label: "Deadline for California ADMT Pre-use Notices, which must follow § 7003(b)(3) and its WCAG 2.1 reference",
              source: "11 CCR §§ 7200(b), 7220(b)(1)",
              sourceHref: CPPA_TEXT,
              asOf: "2025-09-22",
            },
          ]}
        />

        {/* Comparison table */}
        <section aria-labelledby="compare-heading" className="mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 id="compare-heading" className={h2Class}>
              Every AI Law With an Accessibility Requirement, Compared
            </h2>
            <p className={pClass}>
              Plenty of AI laws require a disclosure. Far fewer say the disclosure must be accessible.
              The table lists the ones that do, plus the employment rules that require an
              accommodation route around automated tools. Laws with an AI disclosure duty but no
              accessibility or disability hook, such as California&apos;s SB 243 and the Texas
              Responsible AI Governance Act, are covered in the text below rather than the table.
            </p>
          </div>
          <div
            tabIndex={0}
            role="region"
            aria-label="AI laws with an accessibility requirement, compared by jurisdiction"
            className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <table className="w-full min-w-[72rem] text-left text-sm border-collapse">
              <caption className="sr-only">
                AI laws with an accessibility requirement, compared by jurisdiction: law or provision,
                who it applies to, what must be accessible, standard named, date, enforcement and
                status, as of {REVIEWED_ON}
              </caption>
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                  <th scope="col" className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Jurisdiction</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Law or provision</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Applies to</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-slate-900 dark:text-white">What must be accessible</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Standard named</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Date</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Enforcement and penalty</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-400 align-top">
                {regimes.map((r) => (
                  <tr key={r.law} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                    <th scope="row" className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      {r.jurisdiction}
                    </th>
                    <td className="py-3 px-4 text-slate-900 dark:text-white">{r.law}</td>
                    <td className="py-3 px-4">{r.who}</td>
                    <td className="py-3 px-4">{r.what}</td>
                    <td className="py-3 px-4">{r.standard}</td>
                    <td className="py-3 px-4">{r.date}</td>
                    <td className="py-3 px-4">{r.enforcement}</td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "inline-block rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                          statusStyles[r.status],
                        )}
                      >
                        {r.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="max-w-3xl mx-auto mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Wider deadlines for accessibility laws in general are on the{" "}
            <Link href="/compliance/deadlines" className={linkClass}>
              accessibility compliance deadlines
            </Link>{" "}
            page.
          </p>
        </section>

        <div className="max-w-3xl mx-auto space-y-16 mt-16">
          {/* EU AI Act */}
          <section aria-labelledby="eu-heading">
            <h2 id="eu-heading" className={h2Class}>
              EU AI Act: Article 50(5) and the Accessible Notice Duty
            </h2>
            <p className={pClass}>
              Article 50 of Regulation (EU) 2024/1689 sets the AI Act&apos;s transparency duties.
              Providers must design AI systems that interact directly with people so those people
              are told they are dealing with an AI system, unless that is obvious (50(1)), and must
              mark synthetic audio, image, video and text in a machine-readable, detectable way
              (50(2)). Deployers must inform people exposed to emotion recognition or biometric
              categorisation (50(3)), disclose deep fakes, and disclose AI-generated text published
              to inform the public on matters of public interest unless it had human review or
              editorial control (50(4)).
            </p>
            <p className={pClass}>
              Paragraph 5 governs how all four are delivered. The information must reach the people
              concerned in a clear and distinguishable manner at the latest at the first interaction
              or exposure, and then:
            </p>
            <blockquote className="border-l-4 border-blue-600 pl-4 my-6 text-lg text-slate-900 dark:text-white">
              &ldquo;The information shall conform to the applicable accessibility requirements.&rdquo;
              <footer className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Article 50(5), Regulation (EU) 2024/1689
              </footer>
            </blockquote>
            <p className={pClass}>
              The duty therefore falls on providers for the interaction notice and content marking,
              and on deployers for emotion recognition, deep-fake and public-interest text
              disclosures. Recital 132 adds that the characteristics of people in vulnerable groups
              due to age or disability should be taken into account, and that notifications
              &ldquo;should be provided in accessible formats for persons with disabilities&rdquo;.
            </p>

            <h3 className={h3Class}>When it applies</h3>
            <p className={pClass}>
              Article 50 has applied since 2 August 2026 under Article 113, and the Commission&apos;s
              Guidelines (paragraph 153) confirm it applies from that date regardless of when a
              system was placed on the market. The Digital Omnibus on AI, Regulation (EU) 2026/1744,
              published on 24 July 2026 and in force from 27 July 2026, moved only one piece: providers
              of generative systems placed on the market before 2 August 2026 have until 2 December
              2026 to comply with the Article 50(2) marking duty (new Article 111(4)). The interaction
              disclosure under 50(1) had to be in place from 2 August 2026. The Omnibus did not amend
              paragraph 5 at all; its only change to Article 50 replaces paragraph 7 on codes of
              practice.
            </p>

            <h3 className={h3Class}>What the Commission&apos;s Guidelines say about accessibility</h3>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 mb-6 dark:border-blue-900 dark:bg-blue-950/40">
              <p className="font-semibold text-slate-900 dark:text-white mb-2">
                The key nuance: Article 50 adds no new accessibility standard
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                In section 7.3, paragraph 144, of the Guidelines on Article 50 (C(2026) 7702 final,
                5 November 2026), the Commission says providers and deployers must be aware of the
                applicable accessibility requirements, for example under Directive 2016/2102 and
                Directive 2019/882, and assess whether their product, service or content falls
                under them. Then: &ldquo;Article 50 AI Act does not impose distinct or additional
                accessibility requirements.&rdquo;
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                In practice: if your product or service is covered by the{" "}
                <Link href="/compliance/eaa" className={linkClass}>
                  European Accessibility Act
                </Link>
                , or you are a public sector body under the Web Accessibility Directive, your AI
                notice is part of that product or website and must meet the same requirements, which
                means{" "}
                <Link href="/compliance/en-301-549" className={linkClass}>
                  EN 301 549
                </Link>
                . If neither directive applies, Article 50(5) does not, on the Commission&apos;s
                reading, import a separate accessibility standard. It does not remove the need
                either: paragraph 142 defines a clear notice as one that is noticeable, easy to
                understand by and accessible for the person concerned, including persons with
                disabilities. A notice a screen reader cannot reach is hard to defend as clear. The
                Guidelines are not binding; the courts have the final word.
              </p>
            </div>
            <p className={pClass}>
              The Guidelines then get specific about format. Paragraph 34 says the information must
              be provided in an accessible format for persons with disabilities, as Article 50(5) and
              recital 132 require, and a footnote notes that where a system interacts with the general
              public, vulnerable groups are included. Paragraph 35 adds that a provider who can foresee
              interaction with vulnerable groups should provide the information in an accessible
              format. Paragraph 37 recommends multimodal disclosure:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>Text labels such as &ldquo;You are interacting with an AI system&rdquo;, first-turn chatbot greetings and persistent badges placed near the input or output field.</li>
              <li>Spoken statements in voice contexts.</li>
              <li>Earcons, which may help visually impaired users recognise the AI but &ldquo;are not considered sufficient by themselves&rdquo;.</li>
              <li>Combinations of modes to ensure accessibility.</li>
            </ul>
            <p className={pClass}>
              Paragraph 38 says a disclosure only in terms and conditions, a URL or documentation is
              not enough on its own, and paragraph 142 rules out information hidden under layers of
              menu options. Paragraph 143 sets the timing: at least once at the start of each
              interactive session, such as when launching a conversation with a chatbot, and per
              output for generated content.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>The AAC exemption.</strong> Among the examples for the
              Article 50(2) exceptions, the Guidelines say content that only transforms authentic
              human input through assistive technologies that let persons with disabilities
              communicate, such as augmentative and alternative communication (AAC), does not need to
              be marked as AI-generated. Edits made to align content with accessibility requirements
              count as standard editing. A synthetic voice that speaks for a disabled person does not
              need an AI watermark.
            </p>

            <h3 className={h3Class}>Article 16(l): high-risk AI must itself be accessible</h3>
            <p className={pClass}>
              Article 16 lists what providers of high-risk AI systems must do. Point (l) reads:
              &ldquo;ensure that the high-risk AI system complies with accessibility requirements in
              accordance with Directives (EU) 2016/2102 and (EU) 2019/882.&rdquo; This is a duty on
              the system, not just its notices, and it falls on providers only: Article 26, which
              sets deployers&apos; duties, has no accessibility wording. Recital 80 explains why,
              citing the UN Convention on the Rights of Persons with Disabilities and adding that
              providers should ensure compliance &ldquo;by design&rdquo;.
            </p>
            <p className={pClass}>
              The Omnibus pushed the dates back because of the delayed availability of standards,
              common specifications and alternative guidance (recital 40). Chapter III, Sections 1 to
              3, which contain Article 16, now apply from 2 December 2027 for high-risk systems under
              Article 6(2) and Annex III, and from 2 August 2028 for systems under Article 6(1) and
              Annex I. The original dates were 2 August 2026 and 2 August 2027. High-risk systems
              already on the market before those dates are caught only after significant changes in
              their design, but providers and deployers that are public authorities must comply by
              2 August 2030 (new Article 111(2)).
            </p>
            <p className={pClass}>
              No harmonised AI standard deals with accessibility. The Commission&apos;s 2023
              standardisation request for the AI Act, C(2023) 3215, mentions disability once, asking
              that the UN Convention be taken into account (recital 14). For 16(l) and 50(5), EN 301
              549, the harmonised standard for the EAA and the Web Accessibility Directive, remains
              the practical measuring stick.
            </p>

            <h3 className={h3Class}>The Code of Practice names EN 301 549 and WCAG 2.1 AA</h3>
            <p className={pClass}>
              The Code of Practice on Transparency of AI-generated Content, final text of 10 June
              2026, is voluntary, and adherence &ldquo;does not constitute conclusive evidence of
              compliance&rdquo;. But on 8 July 2026 the Commission gave its opinion that the Code
              adequately covers the obligations in Articles 50(2), (4) and (5), and the AI Board
              adopted its assessment the next day. It is the most concrete statement of what an
              accessible AI label looks like:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className={strongClass}>Providers, Measure 2.3.</strong> Interfaces that show
                detection results must be accessible to persons with disabilities under the EAA and
                the Web Accessibility Directive. Signatories are encouraged to implement relevant
                standards, &ldquo;including but not limited to&rdquo; EN 301 549 and WCAG 2.1 Level
                AA.
              </li>
              <li>
                <strong className={strongClass}>Deployers, objective (c).</strong> Disclosure should
                be easily perceivable and understandable by everyone, including persons with
                disabilities, children and the elderly.
              </li>
              <li>
                <strong className={strongClass}>Deployers, Measure 1.1.</strong> Signatories will
                ensure accessible disclosure, including audio descriptions or alternative cues for
                visual disclosure elements; tactile and haptic cues for audio-only content, such as a
                vibration before deep-fake audio; high contrast icons or equivalent labels and screen
                reader compatibility, including for users with colour vision deficiencies; and
                detectability of the icon or label by assistive technologies. EN 301 549 or WCAG 2.1
                are encouraged where the service falls within their scope.
              </li>
            </ul>

            <h3 className={h3Class}>Penalties</h3>
            <p className={pClass}>
              Article 99(4) sets fines of up to EUR 15 million or 3% of total worldwide annual
              turnover, whichever is higher, and expressly lists providers&apos; obligations under
              Article 16 and the transparency obligations of providers and deployers under Article
              50. For SMEs, and since the Omnibus for small mid-caps, the lower of the two applies.
              EU institutions face up to EUR 750,000. National market surveillance authorities
              enforce, the AI Office handles systems built on its own general-purpose models, and the
              European Data Protection Supervisor covers EU institutions.
            </p>

            <h3 className={h3Class}>Other accessibility and disability provisions in the AI Act</h3>
            <dl className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              {otherEuMentions.map((m) => (
                <div key={m.ref}>
                  <dt className="font-semibold text-slate-900 dark:text-white">{m.ref}</dt>
                  <dd>{m.text}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              Articles 13(2) and 77(1) also use the word &ldquo;accessible&rdquo;, but in the sense of
              available or understandable, not disability access.
            </p>
          </section>

          {/* Colorado */}
          <section aria-labelledby="colorado-heading">
            <h2 id="colorado-heading" className={h2Class}>
              Colorado: Reasonably Accessible AI Notices and a WCAG 2.2 Draft Rule
            </h2>
            <p className={pClass}>
              <strong className={strongClass}>The statute.</strong> SB26-189, signed on 14 May 2026,
              repealed and re-enacted Colorado&apos;s AI framework as an automated decision-making
              technology law that takes effect on 1 January 2027. Section 6-1-1704 requires a
              clear and conspicuous pre-use notice before covered ADMT materially influences a
              consequential decision, a public notice reasonably accessible at points of consumer
              interaction, and an adverse-outcome disclosure within 30 days. Subsection (8) adds the
              accessibility duty: a deployer or developer must provide these notices and disclosures
              in a manner &ldquo;reasonably accessible to consumers with disabilities and consumers
              with limited English proficiency&rdquo;, consistent with applicable state and federal
              law.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>The chatbot law.</strong> HB26-1263, approved on 29 May
              2026, requires an operator of a conversational AI service to disclose clearly and
              conspicuously that the service is artificial intelligence: at the first interaction
              each day, every three hours or as a persistent disclosure, and whenever a user asks
              whether it is human. Duties apply from 1 January 2027. For minors, screen products need
              a persistent visible disclaimer and screenless products an intermittent audio one. The
              statute itself has no accessibility wording. The interim draft rules renumber the
              chatbot section as 6-1-1710, so check the codified number before citing it.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>The draft rule.</strong> The Attorney General&apos;s
              draft rules, 4 CCR 904-6, apply Rule 3.2 to notices from deployers to consumers and from
              chatbot operators to users. Rule 3.2(A)(2) as proposed on 11 August 2026 requires
              disclosures to be reasonably accessible to consumers or users with disabilities,
              including through digital accessibility tools. For information online, the deployer
              or operator must follow generally recognised industry standards, such as{" "}
              <Ext href={WCAG22}>WCAG 2.2 of 12 December 2024</Ext>, incorporated by reference in
              Rule 14.1 without later amendments. In other contexts, it must explain how a person
              with a disability can get the disclosure in an alternative format. The 6 October 2026
              interim draft changed the wording to &ldquo;such as, but not limited to&rdquo;. Neither
              draft names a conformance level. Rule 3.2(A) also asks for plain language, the languages
              ordinarily used, and a format readable on all devices including smaller screens. The
              wording mirrors California&apos;s § 7003(b)(3), with WCAG 2.2 in place of 2.1.
            </p>
            <div tabIndex={0} role="region" aria-label="Colorado AI rulemaking timeline, 4 CCR 904-6" className="overflow-x-auto mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
              <table className="w-full text-left text-sm border-collapse">
                <caption className="sr-only">Colorado AI rulemaking timeline, 4 CCR 904-6</caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Date</th>
                    <th scope="col" className="py-3 font-semibold text-slate-900 dark:text-white">Step</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">Up to 13 July 2026</th>
                    <td className="py-3">Pre-rulemaking comments</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">11 August 2026</th>
                    <td className="py-3">Proposed rules filed with the Secretary of State, naming WCAG 2.2</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">6 October 2026</th>
                    <td className="py-3">Interim draft redline: &ldquo;such as, but not limited to&rdquo;</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">21 October 2026</th>
                    <td className="py-3">Final Regulatory Analysis</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">26 October 2026</th>
                    <td className="py-3">Formal hearing and comment deadline</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">1 January 2027</th>
                    <td className="py-3">Statute and stated rule effective date (rules not adopted as of {REVIEWED_ON})</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={pClass}>
              <strong className={strongClass}>Enforcement.</strong> Under C.R.S. 6-1-1706 the
              Attorney General enforces through the Colorado Consumer Protection Act, and the
              disclosure duties are enforceable exclusively by the Attorney General. A violation is a
              deceptive trade practice. Before acting, the Attorney General gives notice and a 60-day
              cure period where cure is possible, but not for knowing or repeated violations. There
              is no private right of action.
            </p>
            <p className={pClass}>
              We walk through the draft rule&apos;s wording, the &ldquo;such as, but not limited
              to&rdquo; change and what it means for chatbot teams in{" "}
              <Link href="/blog/colorado-ai-rules-wcag-2-2-accessible-disclosures" className={linkClass}>
                Colorado&apos;s AI rules and WCAG 2.2 accessible disclosures
              </Link>
              .
            </p>
          </section>

          {/* California */}
          <section aria-labelledby="california-heading">
            <h2 id="california-heading" className={h2Class}>
              California: ADMT Notices Under WCAG 2.1 and Accommodation in AI Hiring
            </h2>
            <p className={pClass}>
              <strong className={strongClass}>CCPA regulations.</strong> The California Privacy
              Protection Agency&apos;s regulations on cybersecurity audits, risk assessments and
              automated decision-making technology were approved by the Office of Administrative Law
              on 22 September 2025, effective 1 January 2026. Section 7003(b)(3) of title 11 requires
              disclosures to be reasonably accessible to consumers with disabilities; for notices
              online, the business must follow generally recognised industry standards, such as WCAG
              2.1 of 5 June 2018, and in other contexts must explain how a consumer with a disability
              can get the information in an alternative format. Section 7220(b)(1) applies that rule
              to the ADMT Pre-use Notice, and § 7221 applies it to communications about appeals of
              ADMT decisions. A business already using ADMT for a significant decision must comply
              no later than 1 January 2027 (§ 7200(b)).
            </p>
            <p className={pClass}>
              Administrative fines under Civil Code 1798.155(a), as adjusted for 2025, are up to
              $2,663 per violation or $7,988 per intentional violation or violation involving minors
              under 16. Our{" "}
              <Link href="/compliance/california" className={linkClass}>
                California accessibility law guide
              </Link>{" "}
              covers the Unruh Act exposure that sits alongside these rules.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>Civil Rights Council employment rules.</strong> The
              Council&apos;s automated-decision system regulations took effect on 1 October 2025.
              2 CCR § 11016(c)(5) says an ADS that measures an applicant&apos;s skill, dexterity,
              reaction time or other abilities may discriminate against people with certain
              disabilities, and § 11016(d)(1) says the same of an ADS that analyses tone of voice,
              facial expressions or other physical characteristics. Both add that an employer may
              need to provide reasonable accommodation to avoid unlawful discrimination. The
              Council&apos;s Final Statement of Reasons says the existing requirement to provide
              reasonable accommodations applies to the use of automated-decision systems. The
              Civil Rights Department adds that ADS assessments, including puzzle games, that elicit
              information about a disability may be an unlawful medical inquiry, and that ADS data
              must be kept for four years.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>SB 243 has no accessibility clause.</strong>{" "}
              California&apos;s companion chatbot law requires a clear and conspicuous notification
              that a companion chatbot is artificially generated and not human, where a reasonable
              person could be misled, and gives a private right of action with damages of at least
              $1,000 per violation. Business and Professions Code sections 22601 to 22605 contain no
              accessibility or disability wording, and customer-service bots are excluded. Making
              that notice accessible is good practice, not an SB 243 requirement.
            </p>
          </section>

          {/* Other US */}
          <section aria-labelledby="us-heading">
            <h2 id="us-heading" className={h2Class}>
              Other United States Rules
            </h2>
            <p className={pClass}>
              <strong className={strongClass}>New York City.</strong> Local Law 144 of 2021 regulates
              automated employment decision tools. The Department of Consumer and Worker
              Protection&apos;s rule, in force and enforced since 5 July 2023, says the candidate
              notice &ldquo;must include instructions for how an individual can request an
              alternative selection process or a reasonable accommodation under other laws, if
              available&rdquo; (6 RCNY § 5-304(a)). The rule does not require an alternative process
              itself, and the notice is due ten business days before use.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>Federal ADA guidance.</strong> The Department of
              Justice&apos;s 2022 guidance on algorithms, AI and disability discrimination in hiring
              is still published on ada.gov. It says employers must provide requested reasonable
              accommodations that let applicants and employees with disabilities meet the tool&apos;s
              standards, unless doing so would be an undue hardship. The EEOC&apos;s companion
              document from May 2022 now returns a 404. Removing guidance does not change the ADA:
              Title I still governs AI in employment, and our{" "}
              <Link href="/guides/ai-accessibility-lawsuits" className={linkClass}>
                AI accessibility lawsuits guide
              </Link>{" "}
              tracks how claims are being brought. State and local government chatbots are web
              content under the{" "}
              <Link href="/compliance/ada" className={linkClass}>
                ADA Title II web rule
              </Link>
              , which uses WCAG 2.1 AA, and federal agencies&apos; AI interfaces fall under{" "}
              <Link href="/compliance/section-508" className={linkClass}>
                Section 508
              </Link>
              , which has no AI-specific guidance.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>Texas.</strong> The Texas Responsible Artificial
              Intelligence Governance Act (HB 149), in effect since 1 January 2026, requires
              governmental agencies to disclose AI interaction in plain language, clearly and
              conspicuously and without dark patterns, but says nothing about accessibility. Its
              disability hook is a ban on developing or deploying AI with the intent to unlawfully
              discriminate against a protected class, which includes disability; disparate impact
              alone is not enough.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>Illinois (not confirmed from the statute).</strong>{" "}
              Secondary sources report that HB 3773 amended the Illinois Human Rights Act from
              1 January 2026 to bar AI use that has a discriminatory effect on protected classes,
              which include disability, and that draft notice rules referring to accessibility and
              accommodation were withdrawn in June 2026. We could not read the statute from the
              primary source, so it is not in the table.
            </p>
          </section>

          {/* Canada and UK */}
          <section aria-labelledby="intl-heading">
            <h2 id="intl-heading" className={h2Class}>
              Canada and the United Kingdom
            </h2>
            <p className={pClass}>
              <strong className={strongClass}>CAN-ASC-6.2:2025.</strong> Accessibility Standards
              Canada published &ldquo;Accessible and Equitable Artificial Intelligence Systems&rdquo;
              in December 2025. Its overview says that if AI affects workers, customers or the public,
              it must meet accessibility standards, and that organisations should use accessible
              formats when telling the public about their use of AI. It is reported to be voluntary
              unless adopted in regulation. For federal institutions, the Treasury Board Directive on
              Automated Decision-Making already requires algorithmic impact assessment results to be
              published &ldquo;in an accessible format&rdquo; (6.1.1). More on the federal regime is
              on our{" "}
              <Link href="/compliance/canada" className={linkClass}>
                Canada accessibility law
              </Link>{" "}
              page.
            </p>
            <p className={pClass}>
              <strong className={strongClass}>United Kingdom.</strong> The UK has no AI Act. The
              Equality Act 2010 duty to make reasonable adjustments applies to AI services as to any
              other, and public sector chatbots on websites and apps fall under the 2018 public
              sector accessibility regulations. See the{" "}
              <Link href="/compliance/uk" className={linkClass}>
                UK accessibility law guide
              </Link>
              .
            </p>
          </section>

          {/* What to do */}
          <section aria-labelledby="checklist-heading">
            <h2 id="checklist-heading" className={h2Class}>
              What To Do: An Accessibility Checklist for AI Notices, Labels and Chat
            </h2>
            <p className={pClass}>
              The laws name different WCAG versions, but they converge on the same design. Build the
              notice, the label and the chat interface to WCAG 2.2 Level AA and EN 301 549, and you
              cover the technical requirements of the EU regime where it applies, Colorado&apos;s
              draft and California&apos;s rule. The steps below come from the Commission&apos;s Guidelines,
              the Code of Practice and the US texts.
            </p>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5 mb-8">
              <li>
                <strong className={strongClass}>Disclose in context, at the first interaction.</strong>{" "}
                Show the AI notice when the session starts, near the input or output field, and keep
                a persistent label. A line in the terms and conditions is not enough.
              </li>
              <li>
                <strong className={strongClass}>Make the label real text.</strong> If you use an AI
                icon, give it a text alternative that states its meaning, keep it in the accessibility
                tree, and never rely on colour alone. Aim for 4.5:1 contrast for text and 3:1 for the
                icon.
              </li>
              <li>
                <strong className={strongClass}>Use more than one sense.</strong> Pair visual labels
                with an audio or text cue, give voice assistants a spoken statement, and give
                audio-only content a visual or haptic cue. An earcon can support recognition but
                cannot be the only signal.
              </li>
              <li>
                <strong className={strongClass}>Announce without stealing focus.</strong> Use a
                status message for the AI greeting, &ldquo;responding&rdquo; and &ldquo;response
                complete&rdquo;, so screen reader users hear them without losing their place.
              </li>
              <li>
                <strong className={strongClass}>Keep the chat operable and unobscured.</strong> Every
                control works from the keyboard, focus moves into the chat and back, and the floating
                launcher or AI banner never hides the focused element.
              </li>
              <li>
                <strong className={strongClass}>Fit every screen.</strong> Notices must reflow at
                320 CSS pixels; Colorado and California both require readability on smaller screens.
              </li>
              <li>
                <strong className={strongClass}>Publish an alternative format route.</strong> Both
                US rules require information, in contexts other than online, on how a person with a
                disability can get the notice in an alternative format. Name a contact and a format list.
              </li>
              <li>
                <strong className={strongClass}>Offer an accommodation route around automated decisions.</strong>{" "}
                In hiring, tell candidates how to request an alternative process or reasonable
                accommodation before the tool is used, as New York City requires and California and
                the ADA expect.
              </li>
              <li>
                <strong className={strongClass}>Do not watermark assistive speech.</strong> AAC output
                that transforms a disabled person&apos;s own input falls outside the Article 50(2)
                marking duty.
              </li>
              <li>
                <strong className={strongClass}>Test with assistive technology.</strong> Check the
                label and the chat with a screen reader, keyboard only, high contrast and zoom. Our{" "}
                <Link href="/guides/accessible-ai-chat" className={linkClass}>
                  accessible AI chat guide
                </Link>{" "}
                maps each pattern to WCAG, and the{" "}
                <Link href="/checklists/wcag-2-2" className={linkClass}>
                  WCAG 2.2 checklist
                </Link>{" "}
                covers the full set.
              </li>
            </ol>

            <h3 className={h3Class}>WCAG 2.2 criteria that matter most for AI notices and chat</h3>
            <div tabIndex={0} role="region" aria-label="WCAG 2.2 success criteria most relevant to AI notices, labels and chat interfaces" className="overflow-x-auto mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
              <table className="w-full text-left text-sm border-collapse">
                <caption className="sr-only">
                  WCAG 2.2 success criteria most relevant to AI notices, labels and chat interfaces
                </caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Criterion</th>
                    <th scope="col" className="py-3 font-semibold text-slate-900 dark:text-white">Why it matters for AI</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400 align-top">
                  {criteria.map((c) => (
                    <tr key={c.sc} className="border-b border-slate-200 dark:border-slate-800">
                      <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                        <Link href={c.href} className={linkClass}>
                          {c.sc} {c.name}
                        </Link>
                      </th>
                      <td className="py-3">{c.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className={h3Class}>EN 301 549 clauses beyond WCAG</h3>
            <p className={pClass}>
              Where the EAA or the Web Accessibility Directive applies, EN 301 549 reaches past web
              content. For AI products, the clauses to check in V3.2.1 are:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li><strong className={strongClass}>9.4.1.3 and 11.4.1.3</strong> Status messages, on the web and in software.</li>
              <li><strong className={strongClass}>5.1.3.1</strong> Audio output of visual information, for kiosks and other closed functionality.</li>
              <li><strong className={strongClass}>6.1, 6.2.1.1 and 6.2.1.2</strong> Audio bandwidth for speech, real-time text, and concurrent voice and text, for voice bots and two-way voice.</li>
              <li><strong className={strongClass}>11.5.2.3 and 11.7</strong> Use of accessibility services and user preferences, for native apps.</li>
              <li><strong className={strongClass}>12.1.1, 12.1.2, 12.2.2, 12.2.3 and 12.2.4</strong> Documentation and support services, including effective communication, which matters wherever an AI assistant replaces human support.</li>
            </ul>
          </section>

          {/* FAQ */}
          <FaqSection faqs={faqs} title="Frequently Asked Questions" as="h2" className="scroll-mt-24" />

          {/* Sources */}
          <section aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Sources
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Every provision, date and quotation on this page was read in the documents below,
              checked on <time dateTime={REVIEWED_ISO}>{REVIEWED_ON}</time>. Where only secondary
              reporting was available, the text says so.
            </p>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-decimal pl-5">
              {sources.map((s) => (
                <li key={s.href}>
                  <Ext href={s.href}>{s.label}</Ext>
                </li>
              ))}
            </ol>
          </section>

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not constitute
                legal advice. Colorado&apos;s rules are drafts and may change before adoption, the
                Commission&apos;s Guidelines and the Code of Practice are not binding, and courts and
                regulators may read these provisions differently. For advice about your specific
                situation, consult a lawyer experienced in technology and disability law in the
                relevant jurisdiction.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="AI accessibility law EU AI Act Article 50 accessible chatbot disclosure European Accessibility Act EN 301 549 WCAG 2.2 Colorado California ADMT"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
