// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const h3 = (t) => block('h3', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const numbered = (t) => ({ _type: 'block', listItem: 'number', style: 'normal', children: [span(t)] })
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

export default {
  slug: 'wcag-conformance-claim-vs-evaluation-statement',
  title: '“WCAG 2.2 AA Certified” Is Not a Thing. Here Is What You Actually Bought.',
  excerpt:
    'Nobody certifies WCAG conformance — there is no body that issues it. Here is the difference between a conformance claim, an evaluation statement and a VPAT, and what to demand in procurement.',
  publishedAt: '2026-07-24T07:30:00Z',
  categoryTitles: ['Legal & Compliance', 'WCAG Guidelines'],
  seo: {
    metaTitle: 'WCAG Certification Is Not Real: What You Actually Get',
    metaDescription:
      'No one certifies WCAG conformance. Understand conformance claims, evaluation statements and VPATs — and what to require from an accessibility vendor.',
    keywords: [
      'WCAG conformance claim',
      'WCAG 2.2 AA certified',
      'accessibility certification',
      'evaluation statement',
      'VPAT',
      'accessibility conformance report',
      'accessibility audit procurement',
      'WCAG compliance certificate',
    ],
  },
  body: [
    p(
      span(
        'If a vendor has told you your site is "WCAG 2.2 AA certified," you have been sold something that does not exist. There is no certification body for WCAG. The W3C writes the standard and does not certify anyone against it, no accredited scheme issues WCAG certificates, and no badge carries legal weight. Conformance under WCAG is self-declared.'
      )
    ),
    p(
      span(
        'This matters more than it sounds, because the gap between what an audit tested and what a certificate implies is exactly the gap that surfaces in litigation. Below: what the standard actually offers, what a sampled audit can honestly produce, and the language to put in your next contract.'
      )
    ),

    h2('What WCAG actually offers: an optional claim'),
    p(
      span(
        'WCAG defines a conformance claim, and it is explicitly voluntary. In the standard’s own words, "it is not required to make any conformance claim in order to conform." You can build a fully conformant product and never publish a claim; publishing one changes nothing about the product, only about what you have asserted.'
      )
    ),
    p(
      span('A conformance claim has five required components:')
    ),
    numbered('The date of the claim.'),
    numbered('The title, version and URI of the guidelines being claimed against — for example WCAG 2.2.'),
    numbered('The conformance level satisfied: A, AA or AAA.'),
    numbered('A concise description of the pages covered, such as a list of URIs.'),
    numbered('A list of the web content technologies relied upon.'),
    p(
      span(
        'Read component four carefully, because it is where most claims quietly fall apart. A claim covers the pages you describe — and every page in that description must fully meet every success criterion at the level claimed. Conformance in WCAG is per-page and all-or-nothing. There is no 94% conformant.'
      )
    ),

    h2('Why a sampled audit cannot produce a claim'),
    p(
      span(
        'Nearly every commercial audit is sample-based, because testing every page of a real product is rarely affordable or useful. The W3C’s evaluation methodology is blunt about the consequence: "WCAG 2 conformance claims cannot be made for entire websites based upon the evaluation of a selected sub-set of web pages and functionality alone, as it is always possible that there will be unidentified conformance errors." It adds that in most situations, using the methodology alone does not put you in a position to make a claim at all.'
      )
    ),
    p(
      span(
        'The logic is simple. A claim asserts something about every page in scope. A sample gives you evidence about the pages you tested. Those are different statements, and no amount of sampling turns the second into the first.'
      )
    ),

    h2('What you actually get: an evaluation statement'),
    p(
      span(
        'The honest deliverable is what WCAG-EM calls an evaluation statement — an optional step in its reporting phase. It says that the samples evaluated met the conformance target defined at the start of the engagement, and it carries the scope, the sample and the baseline alongside it so a reader knows precisely what was examined.'
      )
    ),
    p(span('The difference in plain language:')),
    term('Conformance claim: ', '"Every page at these URIs fully meets WCAG 2.2 AA." Self-declared, per-page, all-or-nothing, and undermined by a single failure anywhere in scope.'),
    term('Evaluation statement: ', '"These 31 samples, selected this way, were evaluated against WCAG 2.2 AA on this date using this baseline, and met it." Bounded, evidenced, and reproducible.'),
    p(
      span(
        'The second is weaker on paper and stronger in practice. It is defensible because it describes what somebody actually did, and a second evaluator can repeat it and get the same answer.'
      )
    ),

    h2('Where the VPAT fits'),
    p(
      span(
        'A VPAT — Voluntary Product Accessibility Template — is a template published by the Information Technology Industry Council. Filling it in produces an Accessibility Conformance Report, and buyers commonly ask for "a VPAT" when they mean the completed report.'
      )
    ),
    p(
      span(
        'The word doing the work is Voluntary. A VPAT is a structured self-disclosure: for each criterion the supplier records Supports, Partially Supports, Does Not Support, or Not Applicable, with remarks. Nobody validates it. Its value lies almost entirely in the remarks column — a report where every row says Supports with no explanation is a marketing document, while one that documents partial support and names the affected components is a supplier being straight with you.'
      )
    ),
    p(
      span(
        'A VPAT is not a certificate and does not become one because a third party filled it in. It is worth exactly as much as the evaluation behind it, which is why the sampling and methodology questions matter more than the artifact.'
      )
    ),

    h2('What to require in procurement'),
    p(
      span(
        'If you are buying an audit or evaluating a supplier’s accessibility documentation, these questions separate substance from paperwork:'
      )
    ),
    numbered('What exactly was in scope — which product, which views, which account states?'),
    numbered('What was the sample, and how was it selected? Ask specifically whether a random sample was included and what it found.'),
    numbered('What was the accessibility support baseline — which browsers, screen readers and versions were actually used?'),
    numbered('What conformance level was targeted, and at what date?'),
    numbered('Is this an evaluation statement or a conformance claim, and if it is a claim, what supports it beyond a sample?'),
    numbered('For a VPAT, what evaluation produced the ratings, and who performed it?'),
    p(
      span(
        'A supplier who can answer all six has done real work. One who responds with a badge and a percentage score has not, and the difference will matter to you long before it matters to a court.'
      )
    ),

    h2('The litigation angle'),
    p(
      span(
        'Accessibility claims rarely turn on whether a company tried. They turn on the distance between what was asserted and what a user actually experienced. A certificate implying whole-product conformance, backed by a sampled audit that cannot support it, widens that distance and puts it in writing — and overlay vendors have already demonstrated how badly a confident accessibility promise ages when the underlying product does not deliver.'
      )
    ),
    p(
      span(
        'An evaluation statement narrows it instead. It documents what was tested, what was found and what remains, which is both more honest and considerably easier to defend. Accuracy is the cheaper option here, and it is also the correct one.'
      )
    ),
    linkBullet('/blog/wcag-em-2-evaluation-methodology-published', 'l1', 'Understand the methodology behind the statement in ', 'what changed in WCAG-EM 2.0', '.'),
    linkBullet('/blog/accessibility-audit-representative-sample', 'l2', 'See why sampling limits what can be claimed in our ', 'representative sample worked example', '.'),
    linkBullet('/compliance', 'l3', 'Review the obligations that actually apply to you on our ', 'compliance overview', '.'),
    linkBullet('/guides/accessibility-overlays', 'l4', 'See how confident accessibility promises age in our ', 'accessibility overlays guide', '.'),
    linkBullet('/sample-audit-report', 'l5', 'Compare against a real deliverable in our ', 'sample audit report', '.'),

    h2('Sources'),
    sourceLink('https://www.w3.org/TR/WCAG22/#conformance-claims', 's1', 'W3C — WCAG 2.2, Conformance Claims (Optional)'),
    sourceLink('https://www.w3.org/TR/wcag-em-2/', 's2', 'W3C — WCAG Evaluation Methodology (WCAG-EM) 2.0, Group Note, 23 July 2026'),
    sourceLink('https://www.itic.org/policy/accessibility/vpat', 's3', 'Information Technology Industry Council — Voluntary Product Accessibility Template (VPAT)'),
  ],
}
