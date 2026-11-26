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
const linkP = (href, key, before, linkText, after) =>
  ({ _type: 'block', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const pLinks = (links, ...children) =>
  ({ _type: 'block', style: 'normal', markDefs: Object.entries(links).map(([_key, href]) => ({ _key, _type: 'link', href })), children })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

// Sources checked, claim by claim:
// - 28 CFR part 35 subpart H, current eCFR text (35.200 to 35.205): "directly or through contractual,
//   licensing, or other arrangements" in 35.200(a) and (b); new dates 26 Apr 2027 / 26 Apr 2028;
//   WCAG 2.1 Level A and AA; the five exceptions in 35.201 (third-party exception excludes content
//   posted under contractual, licensing or other arrangements); 35.202 conforming alternate versions
//   only where technical or legal limitations; 35.203 equivalent facilitation; 35.204 written
//   statement by head of entity; 35.205 minimal impact.
// - Federal Register 91 FR 20902 (FR Doc 2026-07663, 20 Apr 2026), via govinfo: interim final rule,
//   effective 20 Apr 2026, comments due 22 Jun 2026, old and new dates, "amendments do not alter any
//   other provisions", plans for future rulemaking on substance, ongoing title II obligations.
// - ADA.gov First Steps page (8 Jan 2025, updated April 2026), Action Steps 3 and 10: procurement
//   staff role, "can't contract away" line, list of contracting approaches heard in public comments
//   (pre-contract accessibility info, warranties, no disclaimers, indemnification, testing and
//   publishing results), DOJ does not endorse any particular approach; tuition payment and township
//   app examples.
// - ADA.gov fact sheet (8 Apr 2024, updated for the IFR): vendor/contractor content not covered by
//   the third-party exception; calendars, maps, reservation and payment systems not exempt.
// - Section508.gov /buy/ (reviewed Oct 2026): six-step process, ART generates solicitation language,
//   Revised 508 Standards use WCAG 2.0 A and AA, "trust but verify", re-test each new version.
// - Section508.gov /buy/define-accessibility-criteria/ (reviewed Mar 2026): sample clauses for
//   maintenance upgrades, hosting, validation, conformance reporting (ACR on latest VPAT), agency
//   right to independent testing, non-compliance repair or replace at no cost.
// - Section508.gov /buy/understand-claims/ (Sept 2023): meanings of Supports, Partially Supports
//   (does not conform), Does Not Support, Not Applicable, Not Evaluated; independent validation.
// - Section508.gov /sell/how-to-create-acr-with-vpat/: title page fields incl. report date, contact,
//   evaluation methods.
// - ITI VPAT page: VPAT 2.5Rev released April 2025; WCAG, 508, EU and INT editions; completed VPAT
//   is an ACR; no official certification; ITI does not review ACRs.
// - Idaho ITS "Digital Accessibility Agreement Language" (Ver. 1, rev. 3/26): WCAG 2.1 AA, ACR on
//   VPAT 508 edition 2.3 or higher on current product version, automated plus manual testing with
//   assistive technology, remediation at no cost, advance notice of updates, remedies, optional
//   indemnification clause.
// - W3C "What's New in WCAG 2.1": 17 new criteria, 5 A and 7 AA.
// - NFB v. DOJ complaint, D. Md. 1:26-cv-02007, filed 21 May 2026: asks the court to vacate the IFRs.
//   We did not find a ruling, so the post says the case is pending as far as we know.
// - Route Fifty commentary (2 Nov 2026) used only as the news hook. Its NASCIO 63% figure was not
//   verified against NASCIO and is left out. The Idaho FAQ (A4) PDF returned 404 and is not cited.
export default {
  slug: 'ada-title-ii-procurement-vendor-contracts-accessibility',
  authorId: 'author-accessibility-build-team',
  title: 'ADA Title II After the Extension: Put Accessibility Into Your Vendor Contracts Now',
  excerpt:
    'The DOJ gave state and local governments an extra year, but the Title II web rule still covers every website and app a public entity provides through a vendor. Here is what to write into contracts, how to read a vendor’s ACR without being fooled by a wall of “Supports”, and a clause checklist drawn from the rule, ADA.gov, GSA and Idaho.',
  publishedAt: '2026-11-18T04:05:00Z',
  categoryTitles: ['Legal & Compliance'],
  seo: {
    metaTitle: 'ADA Title II Procurement: Accessibility in Vendor Contracts',
    metaDescription:
      'Title II covers vendor-provided websites and apps. What to require in contracts, how to evaluate an ACR or VPAT, and a clause checklist for April 2027.',
    keywords: [
      'ADA Title II procurement',
      'accessibility contract language',
      'vendor accessibility warranty',
      'ACR evaluation',
      'VPAT 2.5',
      'Title II web rule vendors',
      '28 CFR 35.200',
      'WCAG 2.1 AA contract',
      'state and local government accessibility',
      'accessibility procurement checklist',
    ],
  },
  body: [
    p(
      span(
        'When the Justice Department pushed back the ADA Title II web and mobile app deadlines in April 2026, a lot of public entities heard “one more year.” The first new date, 26 April 2027, is now about five months away. For most state and local governments and public colleges, the hardest part of meeting it is not the pages their own staff build. It is the payment portal, the permit system, the learning platform, the agenda software and the mobile app that someone else built and the entity merely licenses.'
      )
    ),
    pLinks(
      { ext: '/guides/doj-title-ii-deadline-extension' },
      span(
        'A 2 November commentary in Route Fifty made this point well: procurement is where Title II compliance is quietly won or lost. This post is the practical follow-up. It sets out what the rule actually says about vendors, what to require in contracts, how to read a vendor’s Accessibility Conformance Report (ACR) critically, and a short clause checklist. If you want the background on the extension itself, our earlier '
      ),
      span('guide to the deadline extension', ['ext']),
      span(' covers it.'),
    ),
    p(
      span('A note before the detail: ', ['strong']),
      span(
        'this is general information, not legal advice. Contract terms, especially indemnity and limitation of liability, depend on your state’s procurement law and your existing terms. Talk to your counsel and procurement office before adopting any language.'
      )
    ),

    h2('The rule at a glance'),
    term('Regulation:', ' 28 C.F.R. part 35, subpart H (sections 35.200 to 35.205), adopted by the Justice Department in April 2024.'),
    term('Standard:', ' WCAG 2.1, Level A and Level AA success criteria and conformance requirements.'),
    term('Compliance dates:', ' 26 April 2027 for public entities with a total population of 50,000 or more; 26 April 2028 for entities under 50,000 and for all special district governments. These come from an interim final rule published on 20 April 2026, which extended each date by one year and, in the department’s words, did not alter any other provision of the 2024 rule.'),
    term('Who is responsible:', ' the public entity, for web content and mobile apps it provides or makes available “directly or through contractual, licensing, or other arrangements” (35.200).'),
    term('Still open:', ' the department has said it plans further rulemaking on the rule’s substance and may issue a proposed rule during the extension period. Separately, the National Federation of the Blind sued in May 2026 asking a federal court in Maryland to vacate the extension. As far as we know that case is pending. Either could change the picture, which is one more reason not to plan around the latest possible date.'),

    h2('Why the vendor’s product is your problem'),
    p(
      span(
        'The phrase “contractual, licensing, or other arrangements” appears in both the general requirement and the dated compliance requirement in 35.200. The department’s own guidance on ADA.gov spells out what it means in practice: a public entity remains responsible for the accessibility of its web content and apps even when it outsources the work, and it cannot contract away its ADA responsibilities. Its examples are ordinary. A university that sends students to a third-party site to pay tuition is providing that page through an arrangement, so it needs to pick an accessible one. A township that offers residents a parking app it did not build and does not own generally must choose one that meets WCAG 2.1 AA.'
      )
    ),
    p(
      span(
        'The exceptions in 35.201 do not offer a way out either. The exception for content posted by a third party expressly excludes third parties posting because of a contractual, licensing or other arrangement with the entity. The ADA.gov fact sheet lists calendars, maps, reservation systems and payment systems as examples of third-party tools that are not exempt. The other four exceptions (archived content, older documents not used to access services, individualized secured documents, and older social media posts) do not cover the systems residents use to get things done.'
      )
    ),
    p(
      span(
        'Three other provisions matter when you negotiate. Section 35.202 allows a conforming alternate version only where technical or legal limitations make direct accessibility impossible, so a vendor offering “a separate accessible version” instead of fixing the main product should be asked which limitation applies. Section 35.203 permits alternative designs that give substantially equivalent or greater accessibility and usability. Section 35.204 lets an entity rely on undue burden or fundamental alteration, but only through a written statement of reasons reached by the head of the entity or a designee, and the entity still has to provide access to the maximum extent possible. A vendor’s cost is not your undue burden. And 35.205, which excuses defects with only a minimal impact on access, is a narrow safety valve, not a contract standard.'
      )
    ),

    h2('What the Justice Department says has worked'),
    p(
      span(
        'Action Step 10 of the department’s “First Steps” guidance for state and local governments is about vendor contracts. It tells entities to review existing contracts and decide whether a vendor can produce accessible content or needs replacing. It then lists approaches that public entities reported using successfully during the rulemaking: requiring detailed accessibility information before signing, asking for a warranty of conformance with technical standards and accessibility laws, prohibiting vendors from disclaiming those warranties, requiring indemnification for breach, and testing vendor products and publishing the results. The department adds that it does not recommend or endorse any particular approach. Action Step 3 makes a related point: procurement staff, not just IT, decide whether accessible products get bought.'
      )
    ),

    h2('Borrow from federal Section 508 procurement, with one fix'),
    p(
      span(
        'Federal agencies have bought accessible technology under Section 508 for years, and GSA publishes the playbook on Section508.gov. Its Accessibility Requirements Tool (ART) generates customised solicitation language, and its sample clauses cover custom development, installation and configuration, maintenance upgrades, hosting, validation testing, conformance reporting and non-compliance. Several are directly reusable: upgrades and replacements must not reduce the level of conformance at award; hosting must not reduce the conformance of the agency’s content; the agency reserves the right to test independently before acceptance; and non-conforming items are repaired or replaced at no cost within a period the contracting officer sets.'
      )
    ),
    p(
      span('The fix: ', ['strong']),
      span(
        'the Revised 508 Standards incorporate WCAG 2.0, while Title II requires WCAG 2.1. WCAG 2.1 added 12 Level A and AA success criteria, including reflow, non-text contrast, text spacing, orientation, input purpose and status messages. If you paste in federal language unchanged, or accept an ACR that only reports against WCAG 2.0, those 12 criteria fall out of the contract. Replace “Revised 508 Standards” with “WCAG 2.1 Level A and AA” (or a later version) wherever it appears.'
      )
    ),

    h2('A real state example: Idaho'),
    p(
      span(
        'Idaho’s Office of Information Technology Services published contract language in March 2026 that it says must go into all agreements where a deliverable is a digital asset. It requires WCAG 2.1 AA as a minimum; an accurate ACR built on the VPAT Revised Section 508 Edition, version 2.3 or higher, based on the current product version; vendor testing with both automated tools and manual methods, including screen readers, with barriers fixed before final acceptance; remediation of known violations during the term at no cost to the state; advance documentation of how updates will affect accessibility; and accessible training materials. Remedies include withholding payment, termination without penalty and remediating at the vendor’s cost, and an optional indemnification clause is offered.'
      )
    ),

    h2('What to require: a clause checklist'),
    p(span('Use this as a list of topics for your counsel and procurement office, not as finished wording.')),
    term('Standard and scope.', ' Conformance with WCAG 2.1 Level A and AA for everything the public will use, including admin-facing screens your staff need, documents the system generates, emails, and mobile apps. Name later versions as acceptable.'),
    term('Warranty for the full term.', ' A warranty that the product conforms at delivery and continues to conform through every release during the contract, with no disclaimer of that warranty elsewhere in the vendor’s terms.'),
    term('An ACR before award.', ' Built on the current ITI VPAT (version 2.5Rev, released April 2025), using the WCAG or International edition, or a 508 edition that reports the WCAG 2.1 criteria. It must cover the exact product and version you are buying.'),
    term('Your right to test.', ' The right to test the product yourself or through an independent third party, before acceptance and at any time during the term, with access to a test environment.'),
    term('Remediation timelines.', ' Defined fix windows by severity (for example, a shorter window for barriers that block a task entirely), a written remediation plan for any known gap at signing, and fixes at no additional cost.'),
    term('Updates and new features.', ' Updates must not reduce conformance, the vendor must tell you in advance how a change affects accessibility, and the ACR must be refreshed when the product changes materially.'),
    term('Accessible support.', ' Accessible documentation and training, and a way for residents and staff to report accessibility problems that reaches the vendor.'),
    term('Remedies.', ' Acceptance tied to accessibility, plus payment withholding, cure periods, termination rights and the right to remediate at the vendor’s cost.'),
    term('Indemnity: talk to counsel.', ' DOJ and Idaho both mention indemnification for breach of accessibility warranties. Whether it is enforceable or worth the price in your state, and how it interacts with liability caps, is a legal question. It also does not move your ADA responsibility to the vendor: you remain the one residents can complain about.'),

    h2('How to read an ACR without being fooled'),
    p(
      span(
        'ITI is clear that there is no official certification or approval for a VPAT or ACR, and that ITI does not review completed reports. An ACR is the vendor’s own claim. GSA’s guidance on vendor claims explains the conformance terms: “Partially Supports” means the product does not conform to that criterion, “Not Evaluated” provides no assurance at all, and “Not Applicable” should come with a reason. GSA also advises purchasers to verify claims with independent testing wherever possible. With that in mind, these are the red flags we look for:'
      )
    ),
    term('Every row says “Supports”.', ' Almost no real product of any complexity fully conforms to every criterion. A clean sweep usually means nobody tested carefully.'),
    term('No evaluation method.', ' The VPAT asks for the evaluation methods used. A blank, or a single sentence naming an automated scanner, is a problem. Automated tools find only part of WCAG failures; keyboard use, focus order, screen reader output and meaningful alt text need people.'),
    term('No date, version or author.', ' An undated ACR for “the platform” could describe a product that no longer exists. Ask who prepared it, when, and against which release.'),
    term('Only WCAG 2.0 criteria.', ' Check that the 12 WCAG 2.1 A and AA criteria appear. If they are missing, the report does not address the Title II standard.'),
    term('Remarks that say nothing.', ' A “Partially Supports” with no explanation tells you nothing about whether the gap blocks a resident from paying a bill. Ask for the specific issues and a fix date.'),
    term('Excluded features.', ' Watch for scope notes that leave out the parts residents actually use, such as checkout, file upload or the mobile app.'),
    pLinks(
      { aud: '/tools/url-accessibility-auditor', amt: '/guides/automated-vs-manual-accessibility-testing' },
      span(
        'Then test the parts that matter. You do not need a full audit of every vendor before award. A focused check of the main task flows with a keyboard and a screen reader, plus an automated scan, will tell you quickly whether an ACR is credible. Our '
      ),
      span('URL accessibility auditor', ['aud']),
      span(' can handle the automated part for public pages, and the '),
      span('automated versus manual testing guide', ['amt']),
      span(' explains what a scan cannot catch.'),
    ),

    h2('What to do before April 2027'),
    plainBullet('Inventory every system that residents, students or applicants use and that a vendor supplies or hosts. Note contract end dates and renewal windows.'),
    plainBullet('Request current ACRs for the highest-traffic and highest-stakes systems first: payments, applications, permits, benefits, courts, enrollment and learning platforms.'),
    plainBullet('Spot-test those systems against the red flags above, and log the gaps you find.'),
    plainBullet('Use renewals and amendments to add accessibility terms, and put the clause checklist into every new solicitation now.'),
    plainBullet('Train procurement staff, whom the department’s guidance names as key players.'),

    h2('Further reading on Accessibility.build'),
    linkBullet('/guides/vpat-accessibility-conformance-report', 'l1', 'Our ', 'guide to VPATs and ACRs', ' walks through the template section by section.'),
    linkBullet('/compliance/ada', 'l2', 'See how the ADA applies to digital services on our ', 'ADA compliance page', '.'),
    linkBullet('/compliance/section-508', 'l3', 'For the federal side, read our ', 'Section 508 overview', '.'),
    linkBullet('/reference/ada-website-case-law', 'l4', 'The court decisions behind digital ADA coverage are collected in our ', 'ADA case law reference', '.'),
    linkBullet('/research/accessibility-lawsuits', 'l5', 'Track how disability litigation is trending in the ', 'accessibility lawsuit tracker', '.'),
    linkP(
      '/templates/title-ii-compliance-kit',
      'l6',
      'If you would rather start from editable documents than a blank page, our ',
      'ADA Title II Web Accessibility Compliance Kit',
      ' includes procurement clauses and vendor letters alongside the policy, notice and 35.204 statement templates. As with everything here, have your counsel review the final wording.'
    ),

    h2('Sources'),
    sourceLink('https://www.ecfr.gov/api/versioner/v1/full/2026-11-01/title-28.xml?part=35&subpart=H', 's1', 'eCFR: 28 C.F.R. part 35, subpart H, Web and Mobile Accessibility, sections 35.200 to 35.205 as amended 20 April 2026 (XML, current text)'),
    sourceLink('https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm', 's2', 'Federal Register: Extension of Compliance Dates for Nondiscrimination on the Basis of Disability; Accessibility of Web Information and Services of State and Local Government Entities, interim final rule, 91 FR 20902 (20 April 2026)'),
    sourceLink('https://www.ada.gov/resources/web-rule-first-steps/', 's3', 'US Department of Justice, ADA.gov: State and Local Governments: First Steps Toward Complying with the ADA Title II Web and Mobile Application Accessibility Rule (8 January 2025, updated April 2026)'),
    sourceLink('https://www.ada.gov/resources/2024-03-08-web-rule/', 's4', 'US Department of Justice, ADA.gov: Fact Sheet: New Rule on the Accessibility of Web Content and Mobile Apps Provided by State and Local Governments (April 2024, updated for the 2026 extension)'),
    sourceLink('https://www.section508.gov/buy/', 's5', 'GSA, Section508.gov: Buy Accessible Products and Services (reviewed October 2026)'),
    sourceLink('https://www.section508.gov/buy/define-accessibility-criteria/', 's6', 'GSA, Section508.gov: Define Accessibility Criteria in Contracts (reviewed March 2026)'),
    sourceLink('https://www.section508.gov/buy/understand-claims/', 's7', 'GSA, Section508.gov: Understanding Vendor Claims in Accessibility Conformance Reports for Section 508 Conformance'),
    sourceLink('https://www.section508.gov/sell/how-to-create-acr-with-vpat/', 's8', 'GSA, Section508.gov: How to Create an ACR with a VPAT'),
    sourceLink('https://www.itic.org/policy/accessibility/vpat', 's9', 'Information Technology Industry Council: VPAT (VPAT 2.5Rev, April 2025)'),
    sourceLink('https://its.idaho.gov/wp-content/uploads/2026/03/A1-Digital-Accessibility-Agreement-Language-v1-rev-3-26.pdf', 's10', 'Idaho Office of Information Technology Services: Digital Accessibility Agreement Language (Ver. 1, rev. 3/26)'),
    sourceLink('https://www.w3.org/WAI/standards-guidelines/wcag/new-in-21/', 's11', 'W3C Web Accessibility Initiative: What’s New in WCAG 2.1'),
    sourceLink('https://browngold.com/wp-content/uploads/2026/05/NFB-v.-DOJ_5-21-2026.pdf', 's12', 'Brown, Goldstein & Levy: Complaint, National Federation of the Blind v. Department of Justice, No. 1:26-cv-02007 (D. Md., filed 21 May 2026)'),
    sourceLink('https://www.route-fifty.com/digital-government/2026/11/extended-ada-title-ii-deadline-demands-focus-procurement/416969/', 's13', 'Route Fifty: Extended ADA Title II deadline demands a focus on procurement (commentary, 2 November 2026)'),
  ],
}
