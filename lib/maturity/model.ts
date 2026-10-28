/**
 * The W3C Accessibility Maturity Model, as data for the self-assessment at
 * /tools/accessibility-maturity-assessment.
 *
 * Source: "Accessibility Maturity Model", W3C Group Note, 4 November 2025
 * (https://www.w3.org/TR/2025/NOTE-maturity-model-20251104/), read on 28 October 2026.
 *
 * The dimension names, level names and section numbers are the W3C's. Every description and
 * proof point below is our own paraphrase of the Note, written to keep its meaning; none of it
 * is the Note's wording. The Note spells the dimension "ICT Development Life Cycle" in its list
 * of dimensions (2.1) and "ICT Development Lifecycle" as the heading of its section (3.2); we use
 * the section heading. Where the Note repeats a proof point in two places (User Experience
 * repeats two User Research points; Support lists several points both at the top of 3.7.2 and in
 * its subsections) we ask it once.
 *
 * The Note defines no numeric score. Proof points are evidence for a level, which is judged per
 * dimension. The per-dimension summary this tool shows is our own rule (see assessment.ts).
 */

export type MaturityLevel = "inactive" | "launch" | "integrate" | "optimize"

export interface LevelInfo {
  id: MaturityLevel
  /** The W3C's name for the level. */
  name: string
  /** Our paraphrase of what the level means across the model (Note section 2.3). */
  meaning: string
}

export interface ProofPoint {
  /** Stable id, stored in visitors' browsers. Never renumber. */
  id: string
  text: string
}

export interface ProofPointGroup {
  /** The Note's subsection title. */
  title: string
  section: string
  proofPoints: ProofPoint[]
}

export interface Dimension {
  id: string
  /** The W3C's name for the dimension. */
  name: string
  section: string
  /** Our paraphrase of what the dimension covers. */
  summary: string
  /** Our paraphrase of what each level looks like in this dimension ("How to evaluate"). */
  levels: Record<MaturityLevel, string>
  groups: ProofPointGroup[]
}

export const MATURITY_MODEL_SOURCE = {
  title: "Accessibility Maturity Model",
  status: "W3C Group Note",
  published: "2025-11-04",
  publishedLabel: "4 November 2025",
  url: "https://www.w3.org/TR/maturity-model/",
  versionUrl: "https://www.w3.org/TR/2025/NOTE-maturity-model-20251104/",
  reviewed: "2026-10-28",
} as const

export const LEVELS: LevelInfo[] = [
  { id: "inactive", name: "Inactive", meaning: "Little or no awareness that accessibility is needed, and almost nothing being done about it." },
  { id: "launch", name: "Launch", meaning: "The need is recognised and planning has started, but the work is not yet organised." },
  { id: "integrate", name: "Integrate", meaning: "There is a roadmap, and the organisation's approach is defined and well organised." },
  {
    id: "optimize",
    name: "Optimize",
    meaning: "Accessibility is part of how the whole organisation works, it is checked consistently, and the results of those checks lead to action.",
  },
]

export const LEVEL_NAME: Record<MaturityLevel, string> = Object.fromEntries(LEVELS.map((level) => [level.id, level.name])) as Record<
  MaturityLevel,
  string
>

const goals = (prefix: string, section: string, n: number): ProofPointGroup => ({
  title: "Dimension Goals and Metrics",
  section,
  proofPoints: [{ id: `${prefix}-${n}`, text: "Goals are set for this dimension, with metrics to measure them and progress tracked against them." }],
})

export const DIMENSIONS: Dimension[] = [
  {
    id: "communications",
    name: "Communications",
    section: "3.1",
    summary:
      "Whether everything the organisation communicates, inside and outside, formal and informal, and whether written by staff or by contractors, can be used by as many people as possible and meets accessibility standards.",
    levels: {
      inactive: "Little happens beyond the odd one-off effort.",
      launch: "There are plans for accessible communications and for training, but they are not yet joined up into one roadmap.",
      integrate: "A roadmap is in place, some accessible content is being published, inaccessible tools are being replaced and training has started.",
      optimize: "Writing and reviewing accessible content is normal practice and keeps improving, and training in accessible communication is required and tracked.",
    },
    groups: [
      {
        title: "Foundation for Accessible Communication",
        section: "3.1.2.1",
        proofPoints: [
          { id: "com-1", text: "Staff have accessible templates for the organisation's standard documents." },
          { id: "com-2", text: "There are written steps for turning content into accessible HTML or PDF." },
          { id: "com-3", text: "What accessible communication requires, and how to produce it, is written down where staff can find it." },
          { id: "com-4", text: "The tools used for meetings, webinars and chat are accessible." },
        ],
      },
      {
        title: "Accessible Direct Communications",
        section: "3.1.2.2",
        proofPoints: [
          { id: "com-5", text: "Marketing and sales material is made from templates that are reliably accessible." },
          { id: "com-6", text: "Technical documents and position papers use templates that are reliably accessible." },
          { id: "com-7", text: "Accessibility Conformance Reports (ACRs) are written in a template that is itself accessible." },
          { id: "com-8", text: "Templates for other accessibility documentation are reliably accessible." },
          { id: "com-9", text: "Slide and presentation templates are reliably accessible." },
          { id: "com-10", text: "Internal and public websites meet the accessibility rules that apply to them, such as WCAG." },
          { id: "com-11", text: "An accessibility statement is published wherever one is needed." },
          { id: "com-12", text: "The organisation says publicly that it is committed to accessibility." },
          { id: "com-13", text: "Compliance documents for products and services can be had in accessible formats." },
          { id: "com-14", text: "Video and audio come with captions, transcripts and audio description where they are needed." },
          { id: "com-15", text: "Social media posts and blog content are accessible." },
          { id: "com-16", text: "Training given to customers and vendors is accessible." },
          { id: "com-17", text: "Information from customer support is accessible." },
          { id: "com-18", text: "People have a way to send accessibility questions and complaints." },
          { id: "com-19", text: "Legal, payment and billing documents are accessible." },
          { id: "com-20", text: "Any other communications the organisation has identified are accessible too." },
        ],
      },
      {
        title: "Accessible Communications Training",
        section: "3.1.2.3",
        proofPoints: [{ id: "com-21", text: "Training in accessible communication gives staff the skills they need and keeps those skills current." }],
      },
      goals("com", "3.1.2.4", 22),
    ],
  },
  {
    id: "ict-development-lifecycle",
    name: "ICT Development Lifecycle",
    section: "3.2",
    summary:
      "Whether accessibility is built into every stage of a digital product's life: the first idea, design, development, testing, conformance reporting, user research, maintenance and retirement, with training that keeps the skills current.",
    levels: {
      inactive: "Little happens beyond isolated efforts.",
      launch: "The need is recognised, but the approach is patchy and mostly limited to new work. Training is being planned.",
      integrate: "Each role is improving how it works, accessibility is applied unevenly across products, fixes to existing products have begun and training is under way.",
      optimize: "One standard, reported approach has an internal owner, accessibility is built into design, development and automated testing, releases are gated on it, and training is required.",
    },
    groups: [
      {
        title: "User Research",
        section: "3.2.2.1",
        proofPoints: [
          { id: "ict-1", text: "Disabled people take part in user research." },
          { id: "ict-2", text: "Some research studies are run only with disabled participants." },
          { id: "ict-3", text: "Research participants get the adjustments they need, such as extra time, their own assistive technology, a remote option and clear directions to an accessible venue." },
          { id: "ict-4", text: "Consent forms, instructions and other research materials are accessible." },
          { id: "ict-5", text: "Personas, journey maps and other research outputs include disabled people." },
        ],
      },
      {
        title: "Planning and Design",
        section: "3.2.2.2",
        proofPoints: [
          { id: "ict-6", text: "Accessibility standards and criteria are part of planning and design from the start." },
          { id: "ict-7", text: "Designers have accessibility checklists, guidance and annotation templates." },
          { id: "ict-8", text: "Designs go through an accessibility review." },
          { id: "ict-9", text: "Design and content style guides cover accessibility." },
          { id: "ict-10", text: "Design system components, and the ways they are combined, account for accessibility." },
          { id: "ict-11", text: "Designs handed to developers carry accessibility notes and annotations that meet the standard." },
          { id: "ict-12", text: "Accessibility features are designed the same way across products." },
          { id: "ict-13", text: "User stories and other planning methods include disabled users." },
        ],
      },
      {
        title: "Development",
        section: "3.2.2.3",
        proofPoints: [
          { id: "ict-14", text: "Developers have somewhere to get accessibility help, such as a team channel, office hours, an email contact or internal guidance pages." },
          { id: "ict-15", text: "Developers have accessibility checklists." },
          { id: "ict-16", text: "Accessibility features are built the same way across products." },
          { id: "ict-17", text: "There is a written way to triage and prioritise accessibility defects and the accessibility feedback customers send." },
          { id: "ict-18", text: "Meeting accessibility requirements is part of sign-off at each stage of the lifecycle." },
        ],
      },
      {
        title: "Quality Review Through Release",
        section: "3.2.2.5",
        proofPoints: [
          { id: "ict-19", text: "Accessibility testing and release follow one consistent approach." },
          { id: "ict-20", text: "Test procedures write down the manual checks done with assistive technology." },
          { id: "ict-21", text: "Automated accessibility testing is part of the test process." },
          { id: "ict-22", text: "Project schedules include accessibility activities with stakeholders." },
          { id: "ict-23", text: "The bug tracker has a category for accessibility." },
          { id: "ict-24", text: "Accessibility defects are prioritised and reviewed through a defined process." },
          { id: "ict-25", text: "A release cannot ship until it passes an accessibility check." },
          { id: "ict-26", text: "Changes made between full releases, such as website and social media updates, are checked by written steps on a set schedule." },
          { id: "ict-27", text: "For off-the-shelf products sold to others, an ACR is produced near the end of the lifecycle." },
        ],
      },
      {
        title: "ICT Development Training",
        section: "3.2.2.6",
        proofPoints: [{ id: "ict-28", text: "Training for development and testing staff gives them the skills these proof points need and keeps those skills current." }],
      },
      goals("ict", "3.2.2.7", 29),
    ],
  },
  {
    id: "knowledge-and-skills",
    name: "Knowledge and Skills",
    section: "3.3",
    summary:
      "Whether people at every level know enough about accessibility for their role, and understand how their work supports the organisation's accessibility goals. Skills that belong to one dimension are assessed in that dimension.",
    levels: {
      inactive: "Little happens beyond isolated efforts.",
      launch: "Plans exist but are loosely organised, skill gaps are being looked at but not fully assessed, training is ad hoc and role-based plans are being drawn up.",
      integrate: "There is a roadmap for skills and training, training for specific roles is available and training metrics have been set.",
      optimize: "Job adverts and descriptions name the skills needed, staff skills are reviewed regularly, training is part of onboarding, and training is required and monitored.",
    },
    groups: [
      {
        title: "Assessing Skills to Identify and Address Gaps",
        section: "3.3.2.1",
        proofPoints: [
          { id: "ks-1", text: "Surveys across the organisation show current skill levels and where the gaps are." },
          { id: "ks-2", text: "Staff training in digital accessibility is recorded and tracked." },
          { id: "ks-3", text: "There are certification or competency programmes, or regular reviews of competency." },
          { id: "ks-4", text: "Accessibility is part of how staff performance is measured." },
          { id: "ks-5", text: "Skills are kept up to date with current requirements." },
        ],
      },
      {
        title: "Building and Maintaining Organizational Capacity",
        section: "3.3.2.2",
        proofPoints: [
          { id: "ks-6", text: "Training plans and curricula for each role are in use." },
          { id: "ks-7", text: "External training is bought in when it is needed." },
          { id: "ks-8", text: "Accessibility training is part of the systems that manage, track and audit learning." },
          { id: "ks-9", text: "Every new starter gets accessibility training as part of onboarding." },
          { id: "ks-10", text: "Job descriptions include accessibility responsibilities." },
          { id: "ks-11", text: "Accessibility specialists are placed around the organisation to train and support colleagues." },
          { id: "ks-12", text: "The organisation runs or attends accessibility events to build awareness and knowledge." },
          { id: "ks-13", text: "Awareness campaigns are run, which also strengthens the culture of the organisation." },
        ],
      },
      {
        title: "Dimension Integration",
        section: "3.3.2.3",
        proofPoints: [{ id: "ks-14", text: "Training and learning are built into the proof points of every other dimension." }],
      },
      goals("ks", "3.3.2.4", 15),
    ],
  },
  {
    id: "oversight-and-culture",
    name: "Oversight and Culture",
    section: "3.4",
    summary:
      "Whether leadership's values, policies and processes make disability inclusion part of how the whole organisation operates, and whether everyone understands what digital accessibility means for their own role.",
    levels: {
      inactive: "Little happens beyond isolated efforts.",
      launch: "The need is recognised and planning has started, but there is little activity yet. Work on governance, leadership and culture programmes is beginning.",
      integrate: "Culture programmes have started, metrics and hiring practices exist, policies are followed in part, communities of practice have formed and training has begun.",
      optimize: "Support and awareness are strong across the organisation, policies are applied consistently and reviewed, everyone understands their role, and training is required and monitored.",
    },
    groups: [
      {
        title: "Organizational Culture of Disability Inclusion",
        section: "3.4.2.1",
        proofPoints: [
          { id: "oc-1", text: "A named executive sponsors digital accessibility." },
          { id: "oc-2", text: "Senior leadership runs the digital accessibility programme directly." },
          { id: "oc-3", text: "Executives state in public that the organisation is committed to digital accessibility." },
        ],
      },
      {
        title: "Financial Commitment",
        section: "3.4.2.2",
        proofPoints: [
          { id: "oc-4", text: "A financial plan covers the work needed to raise maturity in every dimension." },
          { id: "oc-5", text: "Money is formally committed to that work." },
        ],
      },
      {
        title: "ICT Accessibility Policy",
        section: "3.4.2.3",
        proofPoints: [
          { id: "oc-6", text: "Business strategy deals with digital accessibility before problems arise, not after." },
          { id: "oc-7", text: "Digital accessibility is written into the business strategy." },
          { id: "oc-8", text: "The organisation's core values mention digital accessibility." },
          { id: "oc-9", text: "The code of conduct covers digital accessibility." },
          { id: "oc-10", text: "There are communities of practice for digital accessibility." },
          { id: "oc-11", text: "Performance objectives for staff and officers include accessibility criteria." },
          { id: "oc-12", text: "How well the accessibility programme works is measured and improved over time." },
          { id: "oc-13", text: "Staff feedback surveys gather data on accessibility and disability." },
          { id: "oc-14", text: "Inaccessible digital assets can only be used through a written exception process that needs a reason, a time limit and executive approval." },
        ],
      },
      {
        title: "General Training",
        section: "3.4.2.4",
        proofPoints: [{ id: "oc-15", text: "Training gives staff the skills this dimension's proof points need and keeps those skills current." }],
      },
      goals("oc", "3.4.2.5", 16),
    ],
  },
  {
    id: "personnel",
    name: "Personnel",
    section: "3.5",
    summary:
      "Whether qualified disabled people work at every level and in every part of the organisation, so that their own experience informs its decisions.",
    levels: {
      inactive: "Little happens beyond isolated efforts.",
      launch: "Employing disabled people is recognised as a goal, targeted recruiting has begun without much structure, job adverts are accessible, diversity policies mention disability, a champion has been named and training is planned.",
      integrate: "A roadmap for disability inclusion exists, the approach to recruiting and keeping disabled staff is defined but not applied everywhere, key roles have been identified, and accessible recruiting and training are under way.",
      optimize: "Disabled people help shape decisions, audits, product development and services across the organisation, and the disability staff network informs accessibility choices.",
    },
    groups: [
      {
        title: "Targeted Recruiting",
        section: "3.5.2.1",
        proofPoints: [
          { id: "per-1", text: "There are goals for recruiting disabled employees." },
          { id: "per-2", text: "A needs assessment or gap analysis of recruiting has been done, for example for development or accessibility skills." },
          { id: "per-3", text: "There are initiatives aimed at recruiting disabled employees." },
        ],
      },
      {
        title: "Accessible Job Application Platform",
        section: "3.5.2.2",
        proofPoints: [
          { id: "per-4", text: "Hiring tools and job boards have been confirmed to meet a stated accessibility standard." },
          { id: "per-5", text: "Recruitment communications have been confirmed to meet a stated accessibility standard." },
          { id: "per-6", text: "The careers website has been audited for accessibility." },
          { id: "per-7", text: "The application process has been audited for accessibility." },
        ],
      },
      {
        title: "Strategic Engagement",
        section: "3.5.2.3",
        proofPoints: [
          { id: "per-8", text: "A staff network for disabled employees, with an executive sponsor, helps shape accessibility work." },
          { id: "per-9", text: "Disabled employees take part in focus groups for products and projects." },
          { id: "per-10", text: "There is a mentoring programme for disabled employees." },
          { id: "per-11", text: "Staff performance is reviewed against the accessibility duties in their job descriptions." },
        ],
      },
      {
        title: "Accessibility Training Programs",
        section: "3.5.2.4",
        proofPoints: [{ id: "per-12", text: "Training gives staff the skills this dimension's proof points need and keeps those skills current." }],
      },
      goals("per", "3.5.2.5", 13),
    ],
  },
  {
    id: "procurement",
    name: "Procurement",
    section: "3.6",
    summary:
      "Whether accessibility is part of how the organisation finds, chooses and contracts for goods and services. Most digital products arrive through procurement, so this is where accessible products and services are won or lost.",
    levels: {
      inactive: "Little happens beyond isolated efforts.",
      launch: "Work has begun to bring accessibility into procurement and tenders, and some procurement training is planned.",
      integrate: "Tender and contract wording is complete and reviewed, vendors must provide accessibility documentation and know the requirements, accessibility is monitored for the life of the contract and training has started.",
      optimize: "Accessibility processes and contract wording are used consistently across procurement and refined over time, and training is required and measured.",
    },
    groups: [
      {
        title: "Policy Documentation",
        section: "3.6.2.1",
        proofPoints: [
          { id: "pro-1", text: "A procurement policy for digital accessibility is published." },
          { id: "pro-2", text: "Accessibility requirements and related information are passed on to vendors." },
        ],
      },
      {
        title: "Consistent Use of Standardized Procurement Language",
        section: "3.6.2.2",
        proofPoints: [
          { id: "pro-3", text: "Standard wording covering accessibility is used when buying digital products and services." },
          { id: "pro-4", text: "Standard wording covering accessibility is used in contracts for digital products and services." },
          { id: "pro-5", text: "Bid and proposal forms and templates include accessibility." },
        ],
      },
      {
        title: "Consistent Evaluation Process and Methods",
        section: "3.6.2.3",
        proofPoints: [
          { id: "pro-6", text: "There is evidence that bids and proposals are evaluated for accessibility." },
          { id: "pro-7", text: "The evaluation method is written down." },
          { id: "pro-8", text: "There are scoring methods for submissions." },
        ],
      },
      {
        title: "Accessibility Contract Language",
        section: "3.6.2.4",
        proofPoints: [
          { id: "pro-9", text: "Vendors provide evidence of their accessibility testing." },
          { id: "pro-10", text: "Contracts for custom development include accessibility checkpoints." },
          { id: "pro-11", text: "Warranties and remedies in contracts cover accessibility." },
          { id: "pro-12", text: "Vendors must provide corrective action and remediation plans, before and after deployment." },
          { id: "pro-13", text: "There are examples of signed contracts that include accessibility wording." },
        ],
      },
      {
        title: "Accessibility in Procurement Program Management",
        section: "3.6.2.5",
        proofPoints: [
          { id: "pro-14", text: "Procurement processes and policies are reviewed for how well they include accessibility." },
          { id: "pro-15", text: "Accessibility requirements are part of contract lifecycle management." },
          { id: "pro-16", text: "Accessibility metrics for procurement are tracked and recorded." },
          { id: "pro-17", text: "There is a defined process for finding and resolving accessibility complaints from users that involve a vendor." },
        ],
      },
      {
        title: "Procurement Training",
        section: "3.6.2.6",
        proofPoints: [{ id: "pro-18", text: "Procurement staff are trained in accessibility." }],
      },
      goals("pro", "3.6.2.7", 19),
    ],
  },
  {
    id: "support",
    name: "Support",
    section: "3.7",
    summary:
      "Whether disabled employees and customers get the help they need with the organisation's digital products, from workplace adjustments for staff to accessibility support for customers.",
    levels: {
      inactive: "Little happens beyond isolated efforts.",
      launch: "There are plans for basic accessibility information and an adjustments policy, but nothing has been put in place yet. Training is planned.",
      integrate: "The website has an accessibility help section, employees have a way to request adjustments, hiring managers have had disability awareness training and support staff training has begun.",
      optimize: "Support staff are fully trained, people can get help through several channels, accessibility support covers every digital product, it keeps improving, and training is required and measured.",
    },
    groups: [
      {
        // The points listed at the top of 3.7.2, before its subsections, that no subsection repeats.
        title: "General",
        section: "3.7.2",
        proofPoints: [
          { id: "sup-1", text: "There are accessibility help topics or FAQs." },
          { id: "sup-2", text: "Customer support agents and internal IT support staff are trained in accessibility, assistive technology and disability etiquette." },
          { id: "sup-3", text: "There are written ways to measure how well support works, and they are used." },
        ],
      },
      {
        title: "Employee Support",
        section: "3.7.2.1",
        proofPoints: [
          { id: "sup-4", text: "A written policy says how employees ask for, and receive, adjustments to digital tools." },
          { id: "sup-5", text: "A staff network for disabled employees has an executive sponsor." },
          { id: "sup-6", text: "Career paths, and the activities around them such as recruitment and onboarding, are accessible." },
          { id: "sup-7", text: "Employees' use of assistive technology is supported." },
          { id: "sup-8", text: "The full range of adjustments a disabled employee might need for their work is considered." },
        ],
      },
      {
        title: "Organizational Support",
        section: "3.7.2.2",
        proofPoints: [
          { id: "sup-9", text: "Policies, practices and procedures for providing an accessible service are in place." },
          { id: "sup-10", text: "Information is written in plain language." },
          { id: "sup-11", text: "Support channels are themselves accessible." },
          { id: "sup-12", text: "Internal resources include an accessibility knowledge base." },
          { id: "sup-13", text: "There is a way to collect accessibility feedback." },
          { id: "sup-14", text: "Accessibility feedback is checked through a defined process." },
          { id: "sup-15", text: "Accessibility feedback is considered and used to keep improving the digital products it concerns." },
          { id: "sup-16", text: "Disabled people are involved in accessibility initiatives." },
        ],
      },
      {
        title: "External Support",
        section: "3.7.2.3",
        proofPoints: [
          { id: "sup-17", text: "A public, accessible accessibility statement tells people where to get support." },
          { id: "sup-18", text: "Where it applies, a written policy covers adjustments for customers." },
          { id: "sup-19", text: "Accessibility documentation is available to people outside the organisation." },
        ],
      },
      {
        title: "Accessibility Training Programs",
        section: "3.7.2.4",
        proofPoints: [{ id: "sup-20", text: "Training gives staff the skills this dimension's proof points need and keeps those skills current." }],
      },
      goals("sup", "3.7.2.5", 21),
    ],
  },
]

export const ALL_PROOF_POINTS: ProofPoint[] = DIMENSIONS.flatMap((dimension) => dimension.groups.flatMap((group) => group.proofPoints))
