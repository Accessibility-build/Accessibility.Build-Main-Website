// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const h3 = (t) => block('h3', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })
const linkP = (href, key, before, linkText, after) =>
  ({ _type: 'block', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
// A bullet listing several WCAG success criteria, each linked to its /wcag page.
// links: [[href, key, linkText], ...]
const wcagBullet = (links) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal',
    markDefs: links.map(([href, key]) => ({ _key: key, _type: 'link', href })),
    children: [
      span('WCAG 2.1 AA criteria: ', ['strong']),
      ...links.flatMap(([, key, text], i) => [span(text, [key]), ...(i < links.length - 1 ? [span(', ')] : [span('.')])]),
    ] })

// Every factual claim below was checked against these primary sources (fetched 18 Nov 2026):
// - Anderson v. American Dental Associates, Ltd., No. 1:26-cv-01084 (N.D. Ill.): CourtListener
//   docket (filed 30 Jan 2026; motion to dismiss 27 Feb 2026; voluntary dismissal without
//   prejudice 2 Sept 2026, minute order 3 Sept 2026), complaint ECF 1 (paras 10, 28, 32, 35(a) to (h)),
//   defendant's memorandum ECF 7 (demand letter of 15 Dec 2025, $15,000 demand, three barriers
//   incl. date/time controls not focusable with Tab, remediation from 8 Jan 2026, accessWidget
//   deployed, 500 remediations, accessibility statement 8 Feb 2026, quotation of Doe v. Mutual of
//   Omaha, 179 F.3d 557 (7th Cir. 1999)), plaintiff's opposition ECF 9 (persisting barriers,
//   reliance on accessiBe report, FTC order).
// - D.N.J. complaints filed 1 July 2026: 2:26-cv-08035 (Eastern Smiles Opco), 2:26-cv-08038
//   (Nova Dental Associates; docket shows answer 31 Aug 2026), 2:26-cv-08039 (Nuva Smile), each
//   alleging a last visit of 19 July 2025, intent to book a dental check-up, identical barrier
//   list (para 43); the same list appears in 2:26-cv-08042 (a restaurant). Prayer includes
//   nominal damages.
// - 42 U.S.C. 12181(7)(F), 12188(a), 12205 (Cornell LII).
// - DOJ, Guidance on Web Accessibility and the ADA (18 March 2022), ada.gov.
// - eCFR 45 CFR 84.84 (as amended 91 FR 25507), 84.85, 84.86, 92.204 (current to 13 Nov 2026).
// - HHS interim final rule, 91 FR 25496 (11 May 2026, effective 7 May 2026, govinfo text):
//   new dates, "health care providers of all sizes", clinic scheduling example, 84.68(b)(7)
//   duties continue, future NPRM on substance.
// - HHS final rule, 89 FR 40066 (9 May 2024, govinfo text): 52% / 20.4% firm-size figures,
//   linked third-party content exception removed, Medicaid programs covered.
// - FTC press release on accessiBe final order (22 April 2025).
// - Healthcare share of 2.5% is UsableNet's 2025 year-end figure as recorded in
//   lib/data/lawsuit-statistics.ts (lawsuitsByIndustry); it is attributed, not restated as ours.
// Lead only (not relied on for facts): Rivkin Radler, 3 Nov 2026.
export default {
  slug: 'dental-medical-practice-website-ada-lawsuits',
  authorId: 'author-accessibility-build-team',
  title: 'Dental and Medical Practices Are Being Sued Over Their Websites. Here Is What a Practice Site Owes Patients',
  excerpt:
    'Blind patients are suing dental practices because they could not book a check-up online. We read the filings: three near-identical New Jersey complaints filed on one day, and a Chicago case where a $15,000 demand letter led to a fast fix and an overlay. Plus the ADA and Section 504 rules that apply, and the five places practice websites most often fail.',
  publishedAt: '2026-11-18T04:00:00Z',
  categoryTitles: ['Legal & Compliance'],
  seo: {
    metaTitle: 'Dental and Medical Practice Website ADA Lawsuits',
    metaDescription:
      'Blind patients are suing dental practices over websites they cannot use to book. What the complaints allege, how the ADA and Section 504 apply, and what to fix.',
    keywords: [
      'dental practice ADA lawsuit',
      'dental website accessibility',
      'medical practice website ADA',
      'healthcare website accessibility',
      'Section 504 web accessibility',
      'online booking accessibility',
      'patient intake form accessibility',
      'ADA Title III health care provider',
      'WCAG 2.1 AA healthcare',
    ],
  },
  body: [
    p(
      span(
        'A blind person in Chicago wants to book a dental check-up. She opens the practice’s website with her screen reader, finds the appointment form, and gets stuck: the date and time controls cannot be reached with the Tab key, and nothing tells her whether a checkbox is required. A few months later the practice receives a demand letter asking for $15,000. That is the story told, from both sides, in the court filings of a case brought in January 2026, and it is far from the only one.'
      )
    ),
    p(
      span(
        'Defence law firms are warning that dental and other health care practices are a growing target for website accessibility suits. We read the dockets to see what that looks like in the court record. Here is what the complaints allege, which laws apply to a practice website, and the five things that most often go wrong.'
      )
    ),
    p(
      span('A note before the detail: ', ['strong']),
      span(
        'the cases below are allegations, none has produced a ruling on whether a website broke the law, and this post is not legal advice.'
      )
    ),

    h2('At a glance'),
    term('Who is suing:', ' blind people who use screen readers and say they could not book an appointment or use a form, usually in federal class actions under Title III of the Americans with Disabilities Act.'),
    term('The ADA hook:', ' Title III lists the “professional office of a health care provider” as a public accommodation (42 U.S.C. 12181(7)(F)).'),
    term('The second rule:', ' practices receiving federal financial assistance from HHS must meet WCAG 2.1 AA under Section 504 from 11 May 2027 (15 or more employees) or 10 May 2028 (fewer than 15).'),
    term('How big is the trend?', ' smaller than the warnings suggest. UsableNet’s 2025 year-end report, which our lawsuit tracker uses, put healthcare at about 2.5% of digital accessibility suits. But one plaintiff can sue several practices in a day.'),

    h2('What the complaints say'),
    h3('Three dental complaints, one day, one barrier list'),
    p(
      span(
        'On 1 July 2026 one blind New Jersey resident, through one law firm, filed class actions in the District of New Jersey against three dental businesses (2:26-cv-08035, 08038 and 08039). Each says he last visited the practice’s website on 19 July 2025, almost a year earlier, to book a dental check-up, and could not do it with his screen reader.'
      )
    ),
    p(
      span(
        'The barrier list is word for word the same in all three: missing alt text, hidden elements, badly formatted lists, unannounced pop-ups, unclear labels, and actions that need a mouse. The same list appears in his complaint against a restaurant filed that day (2:26-cv-08042). Each asks for an injunction requiring a consultant, regular WCAG 2.1 testing, training and an accessibility policy, plus nominal damages and fees.'
      )
    ),
    p(
      span(
        'Boilerplate does not make the barriers imaginary; each is a common, real failure. But identical wording and a shared visit date suggest suits produced at volume from a template. In one case the practice answered in late August 2026 and the case continues.'
      )
    ),

    h3('The Chicago case: a demand letter, a fast fix and an overlay'),
    p(
      span(
        'Anderson v. American Dental Associates, Ltd. was filed in the Northern District of Illinois on 30 January 2026. The complaint lists eight problems the blind plaintiff says she met with JAWS, including controls unreachable by Tab, a skip link that did not move focus, a logo link with no text alternative, links opening new windows without warning, and a form that did not say whether a checkbox was required (paragraph 35).'
      )
    ),
    p(
      span(
        'The practice’s motion to dismiss gives its side. It says a demand letter arrived on 15 December 2025 asking for $15,000 and naming three barriers, including date and time controls that could not be focused with Tab. A consultant began fixes on 8 January 2026. The day before the complaint was served, the practice also deployed accessiBe’s accessWidget overlay, whose report counted 500 remediations. It published an accessibility statement on 8 February and argued the case was moot.'
      )
    ),
    p(
      span(
        'The plaintiff replied that follow-up testing found barriers still present, and that the evidence of remediation came largely from the overlay vendor’s own report. She cited the Federal Trade Commission’s 2025 order requiring accessiBe to pay $1 million and barring it from claiming, without evidence, that its tools make any website WCAG compliant. The court never ruled. On 2 September 2026 the plaintiff voluntarily dismissed the case without prejudice; the docket does not say why.'
      )
    ),
    linkP(
      '/guides/accessibility-overlays', 'l0',
      'Two lessons. The practice responded quickly and still spent seven months in federal court. And the other side did not accept an overlay vendor’s report as proof of a fix. Our ',
      'overlay guide', ' explains the wider problem.'
    ),

    h2('Which laws apply to a practice website'),
    h3('ADA Title III'),
    p(
      span(
        'Title III bans disability discrimination by places of public accommodation, and its list expressly includes the “professional office of a health care provider.” Courts have long split on whether websites count, but a practice with a physical office will struggle to argue its booking site is separate from the office it books you into. Even the dental practice’s own brief in Chicago quoted a 1999 Seventh Circuit opinion naming a dentist’s office and a website side by side.'
      )
    ),
    p(
      span(
        'No Justice Department regulation sets a technical standard for private websites. The department’s March 2022 guidance says businesses have flexibility in how they comply but must still make what they offer online accessible, and points to WCAG. The complaints above measure sites against WCAG 2.1 or 2.2.'
      )
    ),
    p(
      span(
        'Private plaintiffs can get an injunction and, if they prevail, reasonable attorney’s fees (42 U.S.C. 12188(a) and 12205). The ADA gives them no damages, though some state laws do, and the complaints above still ask for nominal or compensatory damages.'
      )
    ),

    h3('Section 504 and the HHS web rule'),
    p(
      span(
        'Section 504 of the Rehabilitation Act covers programs receiving federal financial assistance. HHS’s May 2024 rule (45 CFR part 84, subpart I) requires its recipients’ web content and mobile apps to meet WCAG 2.1 Level A and AA, including content provided “through contractual, licensing, or other arrangements.” HHS says its recipients include health care providers of all sizes, down to small local clinics, and the 2024 rule notes that state Medicaid programs are covered. Whether your practice’s payments make it a recipient is a question for counsel.'
      )
    ),
    linkP(
      '/guides/section-504-web-accessibility-deadline', 'l1',
        'An interim final rule effective 7 May 2026 moved the dates to 11 May 2027 (15 or more employees) and 10 May 2028 (fewer). The later date covers most practices: HHS noted that 52% of firms providing health care services, including doctors and dentists, have fewer than five employees and another 20.4% have five to nine. HHS said the delay does not remove other Section 504 duties, such as reasonable modifications, and that it may revisit the rule’s substance. More in our ',
      'Section 504 deadline guide', '.'
    ),
    p(
      span(
        'Two details matter for practices. A separate accessible version of web content is allowed only where the main content cannot be made accessible for technical or legal reasons (45 CFR 84.86). And HHS dropped a proposed exception for linked third-party content, so a booking or intake tool you send patients to is not automatically outside the rule.'
      )
    ),

    h3('Section 1557 of the Affordable Care Act'),
    p(
      span(
        'The ACA’s nondiscrimination rule requires health programs delivered through technology to be accessible, and says recipients’ websites and apps must meet Section 504 requirements (45 CFR 92.204). It points back to the same obligations rather than adding a new standard.'
      )
    ),

    h2('The five places practice websites most often fail'),
    p(
      span(
        'HHS’s own example fits: a clinic that has patients book online must make that booking usable by a blind patient with a screen reader.'
      )
    ),

    h3('1. The online booking widget'),
    p(
      span(
        'This is the heart of every dental complaint we read. Date pickers and time grids built from clickable divs cannot be reached by keyboard, and icon buttons have no name. Test the whole flow, from choosing a service to the confirmation, with only a keyboard and then a screen reader.'
      )
    ),
    wcagBullet([
      ['/wcag/2-1-1', 'w1', '2.1.1 Keyboard'],
      ['/wcag/4-1-2', 'w2', '4.1.2 Name, Role, Value'],
    ]),

    h3('2. Patient intake forms and PDFs'),
    p(
      span(
        'New patient forms are often scanned PDFs, or web forms with placeholder text instead of labels, so a screen reader announces a row of unnamed boxes. Mark required fields in text, not only with a red asterisk. Under the HHS rule, older documents are exempt only if they are not currently used to take part in a program, and an intake form is used for exactly that.'
      )
    ),
    wcagBullet([
      ['/wcag/1-3-1', 'w3', '1.3.1 Info and Relationships'],
      ['/wcag/3-3-2', 'w4', '3.3.2 Labels or Instructions'],
    ]),

    h3('3. Patient portal links'),
    p(
      span(
        'The portal link is often a logo with no text alternative or a vague “Click here,” sometimes opening a new window without warning, as alleged in Chicago. The HHS rule exempts individual documents behind a login, such as a patient’s own statement, but not the portal’s pages when the practice provides it through a contract.'
      )
    ),
    wcagBullet([
      ['/wcag/2-4-4', 'w5', '2.4.4 Link Purpose (In Context)'],
      ['/wcag/1-1-1', 'w6', '1.1.1 Non-text Content'],
    ]),

    h3('4. Offers and key information in images'),
    p(
      span(
        'Whitening specials, new patient offers and office hours are often posted as banner images. Without a text alternative a screen reader user gets nothing, and low vision users cannot resize or recolour the text. Put the offer in real text.'
      )
    ),
    wcagBullet([
      ['/wcag/1-1-1', 'w7', '1.1.1 Non-text Content'],
      ['/wcag/1-4-5', 'w8', '1.4.5 Images of Text'],
    ]),

    h3('5. CAPTCHA, phone-only contact and skipped navigation'),
    p(
      span(
        'An image CAPTCHA with no alternative blocks blind users entirely; the New Jersey complaints list unlabelled CAPTCHA prompts among common barriers. The opposite mistake, a contact page with only a phone number, shuts out many deaf patients. And menus with no working skip link force keyboard users through every link on every page, another Chicago allegation.'
      )
    ),
    wcagBullet([
      ['/wcag/1-1-1', 'w9', '1.1.1 Non-text Content (CAPTCHA)'],
      ['/wcag/3-3-2', 'w10', '3.3.2 Labels or Instructions'],
      ['/wcag/2-4-1', 'w11', '2.4.1 Bypass Blocks'],
    ]),

    h2('Your booking vendor is still your problem'),
    p(
      span(
        'Most practices license their scheduling, forms and portal. That does not move the legal risk. In Chicago, one of the three barriers in the demand letter was in the appointment date and time controls, and the letter and lawsuit went to the practice. Under the HHS rule, content provided through a contract or licence is yours to make accessible.'
      )
    ),
    p(span('Before you sign or renew with a booking, intake or portal vendor:')),
    term('Ask for an Accessibility Conformance Report (ACR).', ' A completed VPAT stating, criterion by criterion, how the product meets WCAG 2.1 or 2.2 AA, and who tested it when. “ADA compliant” on a sales sheet is not an ACR.'),
        term('Put it in the contract.', ' Require WCAG 2.1 AA conformance, a timeline for fixing reported issues, and cooperation if you receive a complaint or demand letter.'),
    term('Test it yourself.', ' Book a fake appointment using only a keyboard. If you cannot, neither can your patients.'),

    h2('What to do this month'),
    plainBullet('Scan the homepage, booking, contact and intake pages, then test booking by keyboard and screen reader. Automated tools catch only part of the problems.'),
    plainBullet('Fix booking first, then replace image-only offers and scanned forms.'),
    plainBullet('Publish an accessibility statement with a monitored email and phone number.'),
    plainBullet('If you are an HHS recipient, plan for WCAG 2.1 AA by your Section 504 date. If a demand letter arrives, call counsel before buying a quick fix.'),

    p(span('Our free tools and guides cover each of these steps:')),
    linkBullet('/tools/url-accessibility-auditor', 'l2', 'Scan a practice page with the ', 'URL accessibility auditor', '.'),
    linkBullet('/sample-audit-report', 'l3', 'See what a full manual review covers in our ', 'sample audit report', '.'),
    linkBullet('/guides/accessible-forms', 'l4', 'Fix booking and intake forms with the ', 'accessible forms guide', '.'),
    linkBullet('/guides/pdf-accessibility', 'l5', 'Make patient documents usable with our ', 'PDF accessibility guide', '.'),
    linkBullet('/guides/vpat-accessibility-conformance-report', 'l6', 'Learn how to read a vendor’s ACR in our ', 'VPAT and ACR guide', '.'),
    linkBullet('/compliance/ada', 'l7', 'See how the ADA applies to websites on our ', 'ADA compliance page', '.'),
    linkBullet('/reference/ada-website-case-law', 'l8', 'Read the decisions that shaped website coverage in our ', 'ADA case law reference', '.'),
    linkBullet('/research/accessibility-lawsuits', 'l9', 'Follow filing numbers by year and industry in the ', 'accessibility lawsuit tracker', '.'),

    h2('Sources'),
    sourceLink('https://www.courtlistener.com/docket/72210105/anderson-v-american-dental-associates-ltd/', 's1', 'CourtListener: Docket, Anderson v. American Dental Associates, Ltd., No. 1:26-cv-01084 (N.D. Ill.)'),
    sourceLink('https://storage.courtlistener.com/recap/gov.uscourts.ilnd.494274/gov.uscourts.ilnd.494274.1.0.pdf', 's2', 'US District Court, N.D. Ill.: Class Action Complaint, Anderson v. American Dental Associates (filed 30 January 2026)'),
    sourceLink('https://storage.courtlistener.com/recap/gov.uscourts.ilnd.494274/gov.uscourts.ilnd.494274.7.0.pdf', 's3', 'US District Court, N.D. Ill.: Memorandum in Support of Defendant’s Motion to Dismiss, Anderson v. American Dental Associates (27 February 2026)'),
    sourceLink('https://storage.courtlistener.com/recap/gov.uscourts.ilnd.494274/gov.uscourts.ilnd.494274.9.0.pdf', 's4', 'US District Court, N.D. Ill.: Plaintiff’s Memorandum in Opposition to Motion to Dismiss, Anderson v. American Dental Associates (23 March 2026)'),
    sourceLink('https://www.courtlistener.com/docket/73565149/orcel-v-nova-dental-associates-pc/', 's5', 'CourtListener: Docket, No. 2:26-cv-08038 (D.N.J., filed 1 July 2026)'),
    sourceLink('https://storage.courtlistener.com/recap/gov.uscourts.njd.602165/gov.uscourts.njd.602165.1.0.pdf', 's6', 'US District Court, D.N.J.: Class Action Complaint, No. 2:26-cv-08038 (1 July 2026)'),
    sourceLink('https://storage.courtlistener.com/recap/gov.uscourts.njd.602161/gov.uscourts.njd.602161.1.0.pdf', 's7', 'US District Court, D.N.J.: Class Action Complaint, No. 2:26-cv-08035 (1 July 2026)'),
    sourceLink('https://storage.courtlistener.com/recap/gov.uscourts.njd.602166/gov.uscourts.njd.602166.1.0.pdf', 's8', 'US District Court, D.N.J.: Class Action Complaint, No. 2:26-cv-08039 (1 July 2026)'),
    sourceLink('https://storage.courtlistener.com/recap/gov.uscourts.njd.602168/gov.uscourts.njd.602168.1.0.pdf', 's9', 'US District Court, D.N.J.: Class Action Complaint, No. 2:26-cv-08042 (1 July 2026)'),
    sourceLink('https://www.law.cornell.edu/uscode/text/42/12181', 's10', 'Legal Information Institute: 42 U.S.C. 12181, Definitions (public accommodations)'),
    sourceLink('https://www.law.cornell.edu/uscode/text/42/12188', 's11', 'Legal Information Institute: 42 U.S.C. 12188, Enforcement'),
    sourceLink('https://www.law.cornell.edu/uscode/text/42/12205', 's12', 'Legal Information Institute: 42 U.S.C. 12205, Attorney’s fees'),
    sourceLink('https://www.ada.gov/resources/web-guidance/', 's13', 'US Department of Justice: Guidance on Web Accessibility and the ADA (18 March 2022)'),
    sourceLink('https://www.ecfr.gov/current/title-45/section-84.84', 's14', 'eCFR: 45 CFR 84.84, Requirements for web and mobile accessibility'),
    sourceLink('https://www.ecfr.gov/current/title-45/section-84.85', 's15', 'eCFR: 45 CFR 84.85, Exceptions'),
    sourceLink('https://www.ecfr.gov/current/title-45/section-92.204', 's16', 'eCFR: 45 CFR 92.204, Accessibility of information and communication technology'),
    sourceLink('https://www.govinfo.gov/content/pkg/FR-2026-05-11/html/2026-09266.htm', 's17', 'Federal Register: HHS interim final rule extending Section 504 web and mobile compliance dates, 91 FR 25496 (11 May 2026)'),
    sourceLink('https://www.govinfo.gov/content/pkg/FR-2024-05-09/html/2024-09237.htm', 's18', 'Federal Register: HHS final rule, Nondiscrimination on the Basis of Disability in Programs or Activities Receiving Federal Financial Assistance, 89 FR 40066 (9 May 2024)'),
    sourceLink('https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million', 's19', 'Federal Trade Commission: FTC Approves Final Order Requiring accessiBe to Pay $1 Million (22 April 2025)'),
  ],
}
