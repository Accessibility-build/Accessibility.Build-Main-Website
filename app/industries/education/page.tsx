import Link from "next/link"
import {
  ArrowRight,
  GraduationCap,
  Scale,
  Gavel,
  FileText,
  Video,
  MonitorSmartphone,
  Captions,
  Keyboard,
  CheckCircle2,
  BookOpen,
  Wrench,
  CalendarClock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"

export const metadata = {
  title: "Education & EdTech Accessibility Compliance",
  description:
    "What the DOJ Title II rule, Section 504, and the ADA require of schools, universities, and edtech — deadlines, OCR risk, and the WCAG issues to fix first.",
  alternates: { canonical: "/industries/education" },
  openGraph: {
    type: "website",
    title: "Education & EdTech Accessibility Compliance",
    description:
      "What the DOJ Title II rule, Section 504, and the ADA require of schools, universities, and edtech — deadlines, OCR risk, and the WCAG issues to fix first.",
    url: "/industries/education",
    images: [
      {
        url: "/api/og?title=Education%20%26%20EdTech%20Accessibility%20Compliance&section=Industries",
        width: 1200,
        height: 630,
        alt: "Education & EdTech Accessibility Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Education & EdTech Accessibility Compliance",
    description:
      "What the DOJ Title II rule, Section 504, and the ADA require of schools, universities, and edtech — deadlines, OCR risk, and the WCAG issues to fix first.",
    images: ["/api/og?title=Education%20%26%20EdTech%20Accessibility%20Compliance&section=Industries"],
  },
}

const stats = [
  {
    value: "WCAG 2.1 AA",
    label: "the standard the DOJ's ADA Title II rule requires of public schools, districts, and universities",
  },
  {
    value: "2027 / 2028",
    label:
      "current Title II compliance deadlines after the DOJ's April 2026 extension — originally April 2026 and 2027",
  },
  {
    value: "~19%",
    label: "of US undergraduates report a disability — plus K-12 students served under IDEA and Section 504 plans",
  },
  {
    value: "Thousands",
    label: "of digital accessibility complaints reach the Department of Education's Office for Civil Rights",
  },
]

const legalExposure = [
  {
    icon: Gavel,
    title: "The DOJ Title II web rule — hard deadlines for public education",
    description:
      "In April 2024, the DOJ finalized its ADA Title II regulation requiring the web content and mobile apps of state and local government entities — including public school districts, community colleges, and state universities — to conform to WCAG 2.1 Level AA. The original deadlines were April 24, 2026 for entities serving populations of 50,000 or more and April 26, 2027 for smaller entities and special districts. In April 2026, a DOJ Interim Final Rule extended those deadlines by one year, to April 26, 2027 and April 26, 2028 respectively. The standard, scope, and exceptions did not change — only the dates. Treat the original timeline as your internal target: OCR complaints, private Section 504 suits, and state laws did not pause.",
  },
  {
    icon: Scale,
    title: "Section 504 and OCR complaints",
    description:
      "Section 504 of the Rehabilitation Act covers every school that accepts federal education funding — which is virtually all public and most private institutions. The Department of Education's Office for Civil Rights enforces it through complaint investigations and resolution agreements, and digital accessibility is one of its recurring subjects: OCR has resolved hundreds of cases involving inaccessible websites, LMS content, and course materials, and at one point ran a mass enforcement initiative that swept up hundreds of districts at once. A single student, parent, or even unaffiliated advocate can trigger an investigation, and resolution agreements typically require audits, remediation on a fixed schedule, policy adoption, and years of OCR monitoring.",
  },
  {
    icon: BookOpen,
    title: "ADA Title III for private schools and edtech vendors",
    description:
      "Private, non-religious schools and universities are places of public accommodation under ADA Title III, and landmark litigation has shaped the sector — most famously the National Association of the Deaf's suits against Harvard and MIT over uncaptioned online course video, which settled with comprehensive captioning requirements. EdTech vendors face pressure from two directions: Title III claims against their own products, and procurement requirements flowing down from every public institution that must itself meet WCAG 2.1 AA. An edtech product without a current, honest ACR/VPAT is increasingly unsellable to schools.",
  },
  {
    icon: CalendarClock,
    title: "The exceptions are narrower than they look",
    description:
      "The Title II rule exempts certain archived web content, preexisting electronic documents, and individualized password-protected documents — but the exceptions collapse exactly when it matters. Password-protected course content (an LMS course, for example) loses its exception once a student with a relevant disability enrolls in the class, and any archived or preexisting document must be made accessible on request as a matter of effective communication. Planning around the exceptions rather than the rule is how institutions end up remediating a semester's content in two weeks.",
  },
]

const wcagIssues = [
  {
    icon: MonitorSmartphone,
    title: "LMS courses built from inaccessible content",
    criteria: [
      { label: "WCAG 1.3.1 Info and Relationships", href: "/wcag/1-3-1" },
      { label: "WCAG 2.4.6 Headings and Labels", href: "/wcag/2-4-6" },
    ],
    description:
      "Canvas, Moodle, Blackboard, and Google Classroom are reasonably accessible platforms — but the courses instructors build inside them usually are not. Walls of unstructured text, bold-as-heading formatting, meaning conveyed by color, tables used for layout, and 'click here' links make course navigation impossible for screen reader users. Because content is authored by hundreds of instructors, the fix is systemic: accessible course templates, authoring training, and the LMS's built-in accessibility checkers enforced as part of course publication.",
  },
  {
    icon: FileText,
    title: "Course documents: scanned PDFs, slide decks, and handouts",
    criteria: [
      { label: "WCAG 1.3.1 Info and Relationships", href: "/wcag/1-3-1" },
      { label: "WCAG 1.1.1 Non-text Content", href: "/wcag/1-1-1" },
    ],
    description:
      "The scanned book chapter is the classic education accessibility failure: a photocopied PDF is an image, not text, and no screen reader can read it. Untagged syllabi, slide decks without reading order or alt text, and STEM materials with equations rendered as images shut students out of the actual substance of a course. Prioritize high-enrollment courses, use OCR and proper tagging for legacy scans, author new documents accessibly from the start, and encode math as MathML or accessible LaTeX rather than pictures.",
  },
  {
    icon: Captions,
    title: "Uncaptioned lecture and course video",
    criteria: [
      { label: "WCAG 1.2.2 Captions (Prerecorded)", href: "/wcag/1-2-2" },
      { label: "WCAG 1.2.1 Audio-only and Video-only", href: "/wcag/1-2-1" },
    ],
    description:
      "Video is now the backbone of instruction — recorded lectures, flipped-classroom content, MOOC libraries — and uncaptioned video is what brought the NAD v. Harvard and MIT suits. Auto-captions alone typically fall short of the accuracy needed for technical vocabulary; the working standard is edited, accurate captions for all published course video, plus transcripts for audio content and audio description where visuals carry meaning. Build captioning into the recording workflow rather than treating it as a per-request accommodation.",
  },
  {
    icon: Keyboard,
    title: "Interactive courseware, quizzes, and third-party tools",
    criteria: [
      { label: "WCAG 2.1.1 Keyboard", href: "/wcag/2-1-1" },
      { label: "WCAG 4.1.2 Name, Role, Value", href: "/wcag/4-1-2" },
      { label: "WCAG 2.2.1 Timing Adjustable", href: "/wcag/2-2-1" },
    ],
    description:
      "Drag-and-drop exercises, simulations, homework platforms, and timed quizzes are frequent hard blockers: a drag-only interaction excludes keyboard and switch users entirely, and rigid quiz timers conflict with extended-time accommodations unless the platform supports per-student adjustment. Every embedded tool a course requires is part of the institution's legal surface — vet vendor accessibility before adoption, not after a student is stuck.",
  },
  {
    icon: Video,
    title: "Institutional sites: enrollment, portals, and emergency info",
    criteria: [
      { label: "WCAG 3.3.2 Labels or Instructions", href: "/wcag/3-3-2" },
      { label: "WCAG 1.4.3 Contrast (Minimum)", href: "/wcag/1-4-3" },
    ],
    description:
      "Beyond the classroom, the Title II rule covers the whole digital estate: application and enrollment forms, student portals, cafeteria menus, transportation schedules, board-meeting agendas, and emergency notifications. Application forms with unlabeled fields and inaccessible date pickers are gatekeeping failures — they can exclude a student before they are ever enrolled — and emergency communications that only ship as image posts on social media fail the students and parents who most need them.",
  },
]

const roadmap = [
  {
    step: "Inventory the whole digital estate",
    detail:
      "List everything the Title II rule reaches: public websites, the LMS and its course content, mobile apps, enrollment and payment systems, video libraries, document repositories, and every third-party tool students must use. Assign an owner to each — accessibility programs fail when the LMS belongs to everyone and no one.",
  },
  {
    step: "Audit and triage by student impact",
    detail:
      "Audit the highest-traffic surfaces first — homepage, enrollment, the LMS experience of your largest courses — combining automated scans with manual keyboard and screen reader testing. Triage findings by whether they block a student from participating in a course today, feed the fixes into a dated remediation plan, and validate against the WCAG 2.2 checklist.",
  },
  {
    step: "Fix the content pipeline, not just the content",
    detail:
      "Remediating last semester's documents without changing how documents get made buys you one semester. Deploy accessible templates for courses, documents, and slides; turn on LMS accessibility checkers; require captions at video publication; and train instructors and content authors — they are your largest population of de facto web publishers.",
  },
  {
    step: "Put accessibility into procurement",
    detail:
      "Require WCAG 2.1 AA conformance and a current ACR/VPAT for every edtech purchase and renewal, verify vendor claims with your own testing, and write remediation obligations into contracts. Public institutions cannot outsource Title II liability to a vendor, and a rigorous procurement gate is the cheapest remediation you will ever do.",
  },
  {
    step: "Institutionalize before the deadline",
    detail:
      "Adopt a formal digital accessibility policy, name a coordinator, publish an accessibility statement with a working barrier-report channel, and schedule recurring audits. With Title II deadlines now at April 2027 and April 2028 after the extension, institutions that treat the original 2026 date as their internal target will clear the real one with room to spare — and be defensible in any OCR complaint filed meanwhile.",
  },
]

const faqs = [
  {
    question: "What are the current ADA Title II deadlines for schools and universities?",
    answer:
      "Under the DOJ's 2024 final rule, public entities serving populations of 50,000 or more originally had until April 24, 2026, and smaller entities and special district governments until April 26, 2027, to conform web content and mobile apps to WCAG 2.1 Level AA. In April 2026, a DOJ Interim Final Rule extended those deadlines by one year — to April 26, 2027 and April 26, 2028. The technical standard and scope are unchanged, and OCR complaints and private lawsuits continue in the meantime, so the extension is breathing room, not a pause.",
  },
  {
    question: "Do private schools and universities have to comply with WCAG too?",
    answer:
      "Yes, through different statutes. Private, non-religious institutions are covered by ADA Title III as places of public accommodation, and nearly all of them also accept federal funding, which triggers Section 504 and OCR jurisdiction. The NAD v. Harvard and MIT settlements over uncaptioned course video show how Title III applies to online learning content. Courts and OCR consistently treat WCAG 2.1 AA as the benchmark, so private institutions should target the same standard as public ones.",
  },
  {
    question: "Is password-protected course content in the LMS exempt from the Title II rule?",
    answer:
      "Only conditionally, and the exemption is fragile. The rule's exceptions for certain password-protected course content and preexisting documents stop applying once a student with a relevant disability enrolls in the course — at which point the content must be made accessible, on a tight timeline, mid-semester. Because institutions rarely know in advance which courses will need it, the only operationally sane approach is to author new course content accessibly by default and remediate high-enrollment courses proactively.",
  },
  {
    question: "What happens when someone files an OCR complaint about our website?",
    answer:
      "The Department of Education's Office for Civil Rights evaluates the complaint and, if it opens an investigation, typically reviews your digital properties, policies, and complaint history. Most cases end in a resolution agreement requiring a comprehensive audit, remediation on a fixed schedule, a formal accessibility policy, staff training, and periodic reporting to OCR — often for several years. Anyone can file, including advocates with no connection to your institution, and complaints are far cheaper to prevent than to resolve.",
  },
  {
    question: "Do all lecture videos really need captions?",
    answer:
      "Published, prerecorded course video should be captioned to meet WCAG 1.2.2, and this was the core of the Harvard and MIT litigation. Raw auto-captions usually are not accurate enough for course terminology, so plan for edited captions — auto-generate, then correct. Live lectures fall under live-captioning criteria and effective-communication obligations when a student needs CART or interpreting. The sustainable model is captioning at publication as part of the media workflow, not scrambling per accommodation letter.",
  },
  {
    question: "How should edtech vendors prepare for education's accessibility deadlines?",
    answer:
      "Assume every public-sector customer must meet WCAG 2.1 AA and will push that requirement into procurement. Vendors need an honest, current Accessibility Conformance Report (VPAT), a real remediation roadmap for known gaps, keyboard and screen reader support in core workflows, and adjustable timing for assessments. Vendors who can prove conformance are winning deals from those who cannot — accessibility has shifted from a checkbox to a selection criterion in education purchasing.",
  },
]

export default function EducationIndustryPage() {
  return (
    <div className="container-wide py-12 px-4 sm:px-6">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Industries", url: "https://accessibility.build/industries" },
          { name: "Education", url: "https://accessibility.build/industries/education" },
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
            <span className="text-foreground font-medium">Education</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 px-4 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300 mb-6">
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          Industry Guide
        </div>
        <h1 className="text-4xl font-bold mb-4">Education &amp; EdTech Accessibility Compliance</h1>
        <p className="text-xl text-muted-foreground">
          Schools, universities, and the edtech products they buy now face explicit WCAG deadlines under the ADA
          Title II rule, ongoing Section 504 obligations, and a steady stream of OCR complaints. Here is the legal
          landscape and the fixes that matter most in the classroom.
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
        <h2 className="text-3xl font-bold mb-6">Why accessibility matters in education</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Students with disabilities are present in every classroom at every level. Roughly 15% of US public school
            students receive special education services under IDEA, more hold Section 504 plans, and about one in five
            undergraduates reports a disability — a number that keeps rising as more students disclose. Unlike a
            consumer who can shop elsewhere, a student cannot choose a different assigned reading, a different LMS, or
            a different enrollment portal. When course content is inaccessible, the institution is not inconveniencing
            a user; it is denying the education it exists to provide.
          </p>
          <p>
            Digital access is now inseparable from educational access. Assignments live in the LMS, lectures are
            recorded video, textbooks are PDFs, exams run on third-party platforms, and even snow-day announcements
            are digital. Every one of those layers is a potential barrier — and because accommodations-on-request
            models scale poorly (a blind student should not wait two weeks for a readable version of tonight's
            homework), regulators and courts increasingly expect accessibility to be built in, not bolted on per
            student.
          </p>
          <p>
            The upside mirrors the risk. Accessible course design — captions, structured documents, flexible
            interaction — measurably helps students who are multilingual, studying in noisy environments, or learning
            with ADHD and dyslexia. Institutions that fix their content pipelines see fewer accommodation escalations,
            faster course production, and stronger positions in the OCR complaint statistics we track alongside{" "}
            <Link href="/research/accessibility-lawsuits" className="text-primary hover:underline">
              accessibility litigation
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Legal exposure */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">The legal landscape for education</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Public institutions answer to the Title II rule and OCR; private institutions to Title III and Section 504.
          For statutory background, see our <Link href="/compliance/ada" className="text-primary hover:underline">ADA guide</Link>{" "}
          and <Link href="/compliance/section-508" className="text-primary hover:underline">Section 508 guide</Link>.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {legalExposure.map((item, i) => {
            const IconComponent = item.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 p-2">
                    <IconComponent className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          Deep dive: our analysis of the{" "}
          <Link href="/guides/doj-title-ii-deadline-extension" className="text-primary hover:underline">
            DOJ Title II deadline extension
          </Link>{" "}
          — what changed, what didn&apos;t, and why you shouldn&apos;t slow down.
        </p>
      </section>

      {/* WCAG issues */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">The WCAG issues that block students most</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Education's accessibility problem is mostly a content problem, produced at scale by thousands of authors.
          Each issue links to the relevant WCAG success criterion.
        </p>
        <div className="space-y-6 max-w-4xl mx-auto">
          {wcagIssues.map((issue, i) => {
            const IconComponent = issue.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 p-2.5 flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
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
        <h2 className="text-3xl font-bold mb-2 text-center">A compliance roadmap for institutions</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Built for the reality of education: enormous content volume, decentralized authorship, and deadlines that
          reward starting now.
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
        <h2 className="text-2xl font-bold mb-6 text-center">Tools and resources for education teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/checklists/wcag-2-2"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <CheckCircle2 className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">WCAG 2.2 Checklist</h3>
            <p className="text-sm text-muted-foreground">
              A practical checklist covering the WCAG 2.1 AA standard the Title II rule requires, and beyond.
            </p>
          </Link>
          <Link
            href="/tools/pdf-accessibility-checker"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <FileText className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">PDF Accessibility Checker</h3>
            <p className="text-sm text-muted-foreground">
              Test syllabi, readings, and administrative documents for tagging and structure.
            </p>
          </Link>
          <Link
            href="/services/accessibility-audits"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Wrench className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Accessibility Audits</h3>
            <p className="text-sm text-muted-foreground">
              Institution-wide audits of sites, LMS content, and edtech tools with a prioritized plan.
            </p>
          </Link>
          <Link
            href="/research/accessibility-lawsuits"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Scale className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Lawsuit Tracker</h3>
            <p className="text-sm text-muted-foreground">
              Litigation and enforcement data across industries, including education.
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
          <h2 className="text-2xl font-bold mb-2">Get ahead of the Title II deadline — and OCR</h2>
          <p className="text-muted-foreground">
            We audit institutional sites, LMS content, and edtech stacks against WCAG 2.1 AA and deliver a remediation
            plan your leadership, counsel, and instructors can all execute.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact?service=audit" className="flex items-center">
              Request an Education Audit
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
