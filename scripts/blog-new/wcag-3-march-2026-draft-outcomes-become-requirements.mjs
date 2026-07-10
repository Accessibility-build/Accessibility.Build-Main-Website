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

export default {
  slug: 'wcag-3-march-2026-draft-outcomes-become-requirements',
  title: 'WCAG 3.0’s March 2026 Draft: Outcomes Become “Requirements”',
  excerpt:
    'The W3C’s March 2026 draft renames "outcomes" to "requirements" and lists 174 of them. Here is what changed — and why WCAG 2.2 AA is still your target.',
  publishedAt: '2026-06-02T10:00:00Z',
  categoryTitles: ['WCAG Guidelines', 'Industry News'],
  seo: {
    metaTitle: 'WCAG 3.0 March 2026 Draft: 174 Requirements',
    metaDescription:
      'The March 2026 WCAG 3.0 Working Draft renames outcomes to requirements and lists 174. What changed, the timeline, and why WCAG 2.2 AA remains your standard.',
    keywords: [
      'WCAG 3.0',
      'WCAG 3 draft 2026',
      'WCAG 3 requirements',
      'W3C Accessibility Guidelines',
      'WCAG 3 conformance model',
      'WCAG 2.2 AA',
      'accessibility standards',
    ],
  },
  body: [
    p(
      span(
        'On March 3, 2026, the W3C published a new Working Draft of WCAG 3.0 (the W3C Accessibility Guidelines 3.0). The headline change is terminology: what earlier drafts called "outcomes" are now called "requirements," and the draft describes 174 of them. It is a signal that the standard is maturing — but WCAG 3.0 is still years from being final, and WCAG 2.2 AA remains the standard to build and test against today.'
      )
    ),

    h2('What changed in the March 2026 draft'),
    term(
      'Outcomes are now "requirements":',
      ' the rename is the most visible shift, and the draft now describes 174 requirements.'
    ),
    term(
      'A revised Explainer:',
      ' the update reworked the Explainer and added new sections on best practices and conformance.'
    ),
    term(
      'Items moved to "Developing" status:',
      ' a set of guidelines, requirements, and assertions advanced to a maturity stage that signals they are becoming more concrete and testable.'
    ),
    p(
      span(
        'The Accessibility Guidelines Working Group also planned to publish a projected WCAG 3 timeline around April 2026, giving the community a clearer view of the road ahead.'
      )
    ),
    p(
      span(
        'The rename from "outcomes" to "requirements" is more than cosmetic. "Outcome" framed each item as a result to aim for; "requirement" frames it as something you must meet. Pairing that language with a stated count — 174 requirements — and with new conformance material in the Explainer suggests the working group is sharpening how the standard will eventually be tested and claimed, even if the specifics are not yet settled.'
      )
    ),

    h2('What "Developing" status signals'),
    p(
      span(
        'Alongside the rename, the March 2026 draft moved a set of guidelines, requirements, and assertions into "Developing" status. That is a maturity stage: it signals these items are becoming more concrete and testable, moving from broad ideas toward language that could eventually support a conformance claim. It is a useful tell for where the working group has the most confidence — and, by contrast, which parts of the standard are still early.'
      )
    ),

    h2('How WCAG 3.0 differs from WCAG 2.x'),
    p(
      span(
        'WCAG 3.0 is not an incremental update to WCAG 2.x. It introduces a new conformance model, moving beyond WCAG 2.x’s binary pass/fail toward graded outcomes, and it broadens the scope of what the guidelines cover. That is a substantial rethink of how conformance is measured and claimed — which is part of why it is taking time to get right.'
      )
    ),
    p(
      span(
        'Under WCAG 2.x, a success criterion is met or it is not. A graded model instead recognizes degrees of accessibility, which can better reflect real user experience but also raises hard questions: how scores are calculated, how they are audited, and how a legally meaningful claim is made against them. Those questions are exactly what a Working Draft exists to work through, and they are why the terminology and structure are still in motion.'
      )
    ),

    h2('The timeline: still years away'),
    plainBullet('A Candidate Recommendation is anticipated around Q4 2027.'),
    plainBullet('A final W3C Recommendation is not expected before 2028.'),
    p(
      span(
        'A Working Draft is an early, evolving stage. Requirement counts, names, and structure can still change before WCAG 3.0 becomes a Recommendation, so nothing in the March 2026 draft should be treated as a fixed compliance target.'
      )
    ),

    h2('What this means for you'),
    p(
      span(
        'Do not wait for WCAG 3.0 — but do track it. WCAG 2.2 AA remains the standard to build and test against today, and current laws reference WCAG 2.1 and 2.2, not 3.0. The practical move is to keep meeting today’s requirements while watching how the "requirements" model matures.'
      )
    ),
    p(
      span(
        'There is also a reassuring continuity here. The work you do now to meet WCAG 2.2 AA — meaningful alternative text, robust keyboard operation, sufficient contrast, clear structure — is the same work that will underpin any graded model. WCAG 3.0 is likely to change how conformance is measured and claimed, not to make well-built, genuinely usable pages obsolete. Teams that ship accessible experiences today are building the foundation the next standard will grade, not racing a clock that runs out before 2028.'
      )
    ),
    linkBullet('/wcag-3', 'l1', 'Follow the standard as it develops on our ', 'WCAG 3 overview', '.'),
    linkBullet(
      '/wcag-3/comparison',
      'l2',
      'See how the new model stacks up against today’s in our ',
      'WCAG 3 comparison',
      '.'
    ),
    linkBullet(
      '/guides/wcag-2-1-vs-2-2',
      'l3',
      'Make sure you are current first with our ',
      'WCAG 2.1 vs 2.2 guide',
      '.'
    ),
    linkBullet('/wcag', 'l4', 'Browse the criteria you must meet now in the ', 'WCAG reference', '.'),
    linkBullet(
      '/checklists/wcag-2-2',
      'l5',
      'And put it into practice with our ',
      'WCAG 2.2 checklist',
      '.'
    ),

    h2('Sources'),
    sourceLink('https://www.w3.org/WAI/news/2026-03-03/wcag3/', 's1', 'W3C Web Accessibility Initiative'),
    sourceLink('https://www.w3.org/TR/wcag-3.0/', 's2', 'W3C (WCAG 3.0 Working Draft)'),
    sourceLink('https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/', 's3', 'W3C Web Accessibility Initiative'),
  ],
}
