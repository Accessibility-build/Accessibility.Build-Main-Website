// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

// Checked against: SB26-189 signed act (6-1-1704(8), effective date s.5), HB26-1263 signed act,
// AG draft rules 4 CCR 904-6 of 11 Aug 2026 (Rule 3.2(A)(2) p.5, Rule 14.1 p.50, Rules 6.2, 7.2,
// 10.2) and the 6 Oct interim redline ("such as, but not limited to"), SIFMA letters of 3 Sept
// and 26 Oct, US Chamber letter of 4 Sept (p.9), CCDC comment of 27 Oct, coag.gov/ai (last
// updated 27 Oct; no final rules), C.R.S. 6-1-112, and California 11 CCR 7003(b)(3).
// Rule numbers cited are from the August draft; the October draft renumbers several.
export default {
  slug: 'colorado-ai-rules-wcag-2-2-accessible-disclosures',
  authorId: 'author-accessibility-build-team',
  title: 'Colorado’s Draft AI Rules Point to WCAG 2.2 for AI Notices and Chatbots',
  excerpt:
    'Colorado’s new AI laws require AI decision notices to be reasonably accessible, and the Attorney General’s draft rules name WCAG 2.2 as the benchmark for online disclosures and chatbot communications. What the text says, what changed in October, who objected, and what to build before 1 January 2027.',
  publishedAt: '2026-11-11T13:00:00Z',
  categoryTitles: ['Legal & Compliance', 'AI & Accessibility'],
  seo: {
    metaTitle: 'Colorado AI Rules Name WCAG 2.2 for AI Notices and Chatbots',
    metaDescription:
      'Colorado’s draft AI rules require accessible AI decision notices and chatbot disclosures, naming WCAG 2.2. What the rules say, who objected, and what to do.',
    keywords: [
      'Colorado AI rules accessibility',
      'Colorado ADMT rules WCAG 2.2',
      'SB26-189 Colorado',
      'Colorado Chatbot Safety Act',
      'HB26-1263',
      '4 CCR 904-6',
      'AI disclosure accessibility',
      'chatbot accessibility law',
      'WCAG 2.2 state law',
    ],
  },
  body: [
    p(
      span(
        'Colorado’s artificial intelligence laws take effect on 1 January 2027, and the Attorney General is now finishing the rules that will explain how businesses must comply. Buried in the draft is a requirement that matters to every accessibility team: the notices people receive when an AI system makes a decision about them, and the messages a chatbot sends, must be reasonably accessible to people with disabilities. For information provided online, the draft names the Web Content Accessibility Guidelines, version 2.2, as the benchmark.'
      )
    ),
    p(
      span(
        'That makes Colorado one of the first places in the US to tie accessibility of AI disclosures to a specific WCAG version, and the first we know of to name WCAG 2.2 for it. The rules are not final yet. Comments closed on 26 October 2026, and the law requires the Attorney General to adopt rules by 1 January 2027.'
      )
    ),

    h2('The two laws behind the rules'),
    term('SB26-189, the ADMT Act:', ' signed on 14 May 2026, it replaced the 2024 Colorado AI Act with a new law on automated decision-making technology used in consequential decisions, such as lending, housing, employment, insurance, healthcare and education. It applies to decisions made on or after 1 January 2027.'),
    term('HB26-1263, the Chatbot Safety Act:', ' signed on 29 May 2026, it sets duties for operators of conversational AI services, including telling users they are talking to AI. The operator duties apply from 1 January 2027.'),
    p(
      span(
        'The accessibility duty starts in the statute itself, not only in the rules. Section 6-1-1704(8) of the Colorado Revised Statutes says deployers and developers must provide the notices and disclosures the law requires in a way that is reasonably accessible to consumers with disabilities and consumers with limited English proficiency, consistent with applicable state and federal law. The statute names no technical standard. The rules supply one.'
      )
    ),

    h2('What the draft rule says'),
    p(
      span(
        'Rule 3.2(A) of the Attorney General’s draft (4 CCR 904-6) sets out how required notices, disclosures and communications must be delivered. Its accessibility clause, Rule 3.2(A)(2), says they must be '
      ),
      span('“Reasonably accessible to Consumers or Users with disabilities”'),
      span(
        ', including through digital accessibility tools. For information provided online, the business must follow generally recognised industry standards, and the draft points to WCAG 2.2 of 12 December 2024. In other contexts, the business must explain how a person with a disability can get the disclosure in an alternative format.'
      )
    ),
    p(span('Three details are worth noticing:')),
    term('The version is fixed.', ' WCAG 2.2 is incorporated by reference under Colorado law and does not include any later amendments. A future WCAG 2.3 or 3.0 would not automatically become the benchmark.'),
    term('No conformance level is named.', ' Neither draft says Level A or Level AA. In practice, AA is the level used by the federal Title II rule, Section 508 and Europe’s EN 301 549, and it is the sensible target.'),
    term('October softened the wording.', ' The 6 October interim draft changed “such as” to “such as, but not limited to” before WCAG 2.2. That makes it clearer WCAG 2.2 is an example of an acceptable standard, not the only one. It is still the only standard the rule names.'),
    p(
      span(
        'The same rule also requires plain, jargon-free language that takes account of the recipient’s vulnerabilities, delivery in the languages the business uses with that person, an interface that is readily accessible, and content that is readable on every device, including small screens and mobile apps. Several of those overlap with WCAG 2.2 and with good cognitive accessibility practice.'
      )
    ),

    h2('Where it applies'),
    p(span('Rule 3.2 is referenced throughout the draft. In the August version it applies to:')),
    plainBullet('Disclosures a deployer must give when an automated decision goes against someone (Rule 6.2).'),
    plainBullet('The methods people use to exercise their rights, such as correcting data or appealing a decision (Rule 7.2).'),
    plainBullet('Chatbot disclosures that the user is talking to AI (Rule 10.2), which must comply with Rule 3 as relevant.'),
    p(
      span(
        'The chatbot rule adds its own specifics. On products with a screen, the AI disclaimer must be persistent and no smaller than the largest text on the interface. On screenless products, such as voice assistants, it must be spoken. One public commenter pointed out the obvious gap: an audio-only disclaimer tells a Deaf user nothing, so a non-audio alternative is needed.'
      )
    ),
    p(
      span(
        'One drafting quirk: the statute puts the accessibility duty on developers as well as deployers, but Rule 3.2 names only deployers and chatbot operators. If you build AI systems that other companies deploy, the statutory duty still applies to the notices and disclosures you are required to provide.'
      )
    ),

    h2('Borrowed from California, updated to 2.2'),
    p(
      span(
        'Rule 3.2 closely follows California’s privacy regulations. Section 7003(b)(3) of the California Consumer Privacy Act regulations requires notices to be reasonably accessible to consumers with disabilities and points to WCAG 2.1 of 5 June 2018 for online notices. California’s automated decision-making rules, which take effect for significant decisions on 1 January 2027, apply that same benchmark to pre-use notices. Colorado copied the structure and moved the reference forward to WCAG 2.2.'
      )
    ),
    p(
      span(
        'For companies operating in both states, the practical answer is simple. WCAG 2.2 includes every WCAG 2.1 success criterion except the obsolete 4.1.1 Parsing, so building AI notices to WCAG 2.2 AA satisfies both.'
      )
    ),

    h2('Who pushed back, and why'),
    term('SIFMA (securities and financial firms):', ' argued that banks and brokers already run accessibility programs built around the ADA and DOJ guidance, which do not tie themselves to a specific WCAG version. It asked the Attorney General to confirm that ADA compliance plus an existing program satisfies the rule, rather than making WCAG 2.2 a freestanding state benchmark. It did not propose a different version. It also asked for enforcement to start on 1 January 2028, citing among other things the work of building WCAG 2.2-conformant notices.'),
    term('US Chamber of Commerce:', ' argued that a fixed reference to WCAG 2.2 creates a static obligation that may become outdated, and asked for a reference to the current version or equivalent standards.'),
    term('Colorado Cross-Disability Coalition:', ' argued the opposite concern: that accessibility must go beyond websites. Notices, identity checks, document uploads and rights requests all need to work, with non-digital alternatives and the right to choose assistance. It also asked that the use of assistive technology never be treated as a sign of deception or fraud.'),
    p(
      span(
        'That last point is easy to miss and important. Identity verification and fraud detection systems sometimes flag unusual interaction patterns, and screen reader, switch and voice control users interact in unusual ways. An appeal process that locks out the people most likely to need it would defeat the purpose of the law.'
      )
    ),

    h2('Enforcement'),
    plainBullet('The Attorney General enforces the core obligations exclusively, under the Colorado Consumer Protection Act. A violation is a deceptive trade practice.'),
    plainBullet('Before acting, the Attorney General must give notice and a 60-day cure period where a violation can be cured, except for knowing or repeated violations. That cure provision expires on 1 January 2030.'),
    plainBullet('The law creates no new private right of action, but it preserves existing rights, including under Colorado’s anti-discrimination law.'),
    plainBullet('Civil penalties under the Consumer Protection Act can reach $20,000 per violation, and $50,000 where an elderly person is involved, with each consumer or transaction potentially counted separately.'),
    p(
      span(
        'The Attorney General’s office has said its policy is to focus on egregious and intentional violations. That is reassuring for good-faith businesses, but it is a statement of current policy, not a safe harbour.'
      )
    ),

    h2('What WCAG 2.2 means for an AI notice'),
    p(
      span(
        'Most AI disclosures will not live on a tidy static page. They will appear in chat widgets, modal dialogs, emails, PDFs, in-app banners and voice interfaces. That is where accessibility usually breaks. Several of the success criteria added in WCAG 2.2 map directly onto these patterns:'
      )
    ),
    term('2.4.11 Focus Not Obscured (Minimum):', ' a chat launcher or sticky disclosure banner must not hide the element that has keyboard focus.'),
    term('3.2.6 Consistent Help:', ' if you offer a way to contact a human about a decision, put it in the same place on every page.'),
    term('3.3.7 Redundant Entry:', ' do not make someone re-type information they already gave you when they appeal or request a correction.'),
    term('3.3.8 Accessible Authentication (Minimum):', ' identity checks in the appeal or rights-request process must not depend on a cognitive function test such as remembering a password or solving a puzzle, without an alternative.'),
    term('2.5.8 Target Size (Minimum):', ' buttons to dismiss, expand or respond to a disclosure must be large enough to hit.'),
    p(
      span(
        'And the long-standing criteria still do most of the work. Chat transcripts need to be announced to screen readers without flooding them (4.1.3 Status Messages), streaming responses must not move focus, dialogs need proper names and focus management, and PDF notices need real tags and reading order.'
      )
    ),

    h2('What to do before 1 January 2027'),
    plainBullet('Inventory every place your AI systems produce a required notice, disclosure or chatbot message, including emails, PDFs and voice channels.'),
    plainBullet('Test those surfaces against WCAG 2.2 AA with a screen reader, keyboard only and at 400% zoom, not just with an automated scanner.'),
    plainBullet('Write the disclosures in plain language and check them with a readability tool. Plain language is a separate requirement in Rule 3.2.'),
    plainBullet('Provide an alternative format route for anything not delivered online, and a non-audio alternative for any spoken disclaimer.'),
    plainBullet('Review identity checks and fraud signals in your appeal and rights-request flows so assistive technology use does not trigger a block.'),
    plainBullet('Watch coag.gov for the final rules. Rule numbers and wording may change again before adoption.'),

    linkBullet('/guides/accessible-ai-chat', 'l1', 'Build chat interfaces that work with assistive technology using our ', 'accessible AI chat guide', '.'),
    linkBullet('/checklists/wcag-2-2', 'l2', 'Work through every A and AA criterion with the ', 'WCAG 2.2 checklist', '.'),
    linkBullet('/wcag/3-3-8', 'l3', 'Understand the authentication rule in ', 'WCAG 3.3.8 Accessible Authentication', '.'),
    linkBullet('/tools/readability-checker', 'l4', 'Check disclosure wording with the ', 'readability checker', '.'),
    linkBullet('/guides/pdf-accessibility', 'l5', 'Fix notices delivered as documents with our ', 'PDF accessibility guide', '.'),
    linkBullet('/blog/midterms-2026-ada-website-enforcement-outlook', 'l6', 'See why states are moving faster than Washington in ', 'our post on the 2026 midterms and ADA enforcement', '.'),

    h2('Sources'),
    sourceLink('https://coag.gov/ai/', 's1', 'Colorado Attorney General: ADMT and Chatbot Safety Act rulemaking page'),
    sourceLink('https://leg.colorado.gov/bills/sb26-189', 's2', 'Colorado General Assembly: SB26-189, Automated Decision-Making Technology in Consequential Decisions'),
    sourceLink('https://leg.colorado.gov/bills/hb26-1263', 's3', 'Colorado General Assembly: HB26-1263, Conversational Artificial Intelligence Services'),
    sourceLink('https://blogs.duanemorris.com/classactiondefense/wp-content/uploads/sites/56/2026/08/2026.08.11-ADMT-Chatbot-Act-Rulemaking.pdf', 's4', 'Colorado Attorney General: Proposed rules, 4 CCR 904-6 (11 August 2026 draft, copy hosted by Duane Morris)'),
    sourceLink('https://coag.gov/app/uploads/2026/10/2026.10.06-ADMT-Chatbot-Act-Rulemaking-Interim-Draft-Redline.pdf', 's5', 'Colorado Attorney General: Interim draft rules, redline (6 October 2026)'),
    sourceLink('https://www.sifma.org/wp-content/uploads/2026/10/SIFMA-Comment-Letter-Revised-Colorado-ADMT-Draft-Rules-October-26-2026.pdf', 's6', 'SIFMA: Comment letter on the revised Colorado ADMT draft rules (26 October 2026)'),
    sourceLink('https://www.uschamber.com/assets/documents/260901_Comment_Colorado-ADMT.pdf', 's7', 'US Chamber of Commerce: Comment on the Colorado ADMT rules (September 2026)'),
    sourceLink('https://cppa.ca.gov/regulations/pdf/ccpa_updates_cyber_risk_admt_appr_text.pdf', 's8', 'California Privacy Protection Agency: Approved regulations text including 11 CCR 7003 and ADMT rules'),
    sourceLink('https://www.w3.org/TR/WCAG22/', 's9', 'W3C: Web Content Accessibility Guidelines 2.2 (Recommendation, 12 December 2024)'),
  ],
}
