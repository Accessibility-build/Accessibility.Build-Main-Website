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
  slug: 'en-301-549-v4-1-1-wcag-2-2-eaa',
  authorId: 'author-accessibility-build-team',
  title: 'The EAA Is About to Point at WCAG 2.2: EN 301 549 v4.1.1 Explained',
  excerpt:
    'The European standard behind the Accessibility Act is moving from WCAG 2.1 to WCAG 2.2. If your last audit stopped at 2.1, here is the gap you now have to close, and the parts of EN 301 549 that were never in WCAG at all.',
  publishedAt: '2026-08-12T07:00:00Z',
  categoryTitles: ['WCAG Guidelines', 'Legal & Compliance'],
  seo: {
    metaTitle: 'EN 301 549 v4.1.1 and WCAG 2.2: What Changes for the EAA',
    metaDescription:
      'EN 301 549 v4.1.1 updates the EU’s harmonised accessibility standard from WCAG 2.1 to WCAG 2.2, expected in 2026. The new success criteria to close and the non-WCAG requirements to remember.',
    keywords: [
      'EN 301 549',
      'EN 301 549 v4.1.1',
      'WCAG 2.2 AA',
      'European Accessibility Act standard',
      'harmonised standard accessibility',
      'presumption of conformity',
      'real-time text accessibility',
      'EAA compliance',
    ],
  },
  body: [
    p(
      span(
        'Most conversations about the European Accessibility Act reach for WCAG, but WCAG is not the standard the EAA actually points to. That role belongs to EN 301 549, the European harmonised standard for accessibility of ICT products and services. Conforming to it is what gives a business the practical presumption that it has met the directive’s requirements. And EN 301 549 is on the move: the version that grants that presumption is shifting from one built on WCAG 2.1 to one built on WCAG 2.2.'
      )
    ),
    p(
      span(
        'The current published version, v3.2.1 from March 2021, incorporates WCAG 2.1 Level AA. The next version, v4.1.1, is expected during 2026 and updates the web content requirements to WCAG 2.2 Level AA, alongside significant changes to real-time text. It is anticipated to be cited as the harmonised standard in the Official Journal of the EU later in the process. When that citation lands, the reference point for European accessibility quietly becomes WCAG 2.2, and any programme still measuring itself against 2.1 has a defined gap to close.'
      )
    ),

    h2('Why the standard, not the guidelines, is the thing to track'),
    p(
      span(
        'EN 301 549 wraps WCAG rather than replacing it. Chapters 9, 10 and 11 pull the WCAG success criteria into web, non-web document and software contexts, so when EN 301 549 updates its WCAG baseline, the web criteria you are held to move with it. But the standard also covers a great deal that WCAG never addresses: hardware, two-way voice and video communication, real-time text, biometrics, and requirements for the documentation and support that ship with a product. Treating "EAA compliance" as "pass WCAG" quietly ignores those chapters.'
      )
    ),
    p(
      span(
        'The version number matters because the presumption of conformity is version-specific. A business audited against v3.2.1 was measured against WCAG 2.1. Once v4.1.1 is the referenced standard, the benchmark is WCAG 2.2, and the delta between them is real work, not a rounding error.'
      )
    ),

    h2('The WCAG 2.2 criteria your 2.1 audit never checked'),
    p(
      span(
        'WCAG 2.2 kept everything in 2.1 and added new success criteria. At Level A and AA, the additions that a 2.1-era audit would have skipped are these:'
      )
    ),
    term('2.4.11 Focus Not Obscured (Minimum), AA:', ' when an element receives keyboard focus, it must not be entirely hidden behind sticky headers, cookie bars or chat widgets. Fixed page furniture is the usual culprit.'),
    term('2.5.7 Dragging Movements, AA:', ' anything you operate by dragging, sliders, reorderable lists, map panning, needs a single-pointer alternative that does not require a drag.'),
    term('2.5.8 Target Size (Minimum), AA:', ' interactive targets must be at least 24 by 24 CSS pixels, or have enough spacing around them. This is one of the most common new failures on dense mobile layouts.'),
    term('3.2.6 Consistent Help, A:', ' if you offer help such as contact details or a chat, it must appear in a consistent place across pages.'),
    term('3.3.7 Redundant Entry, A:', ' do not make people re-enter information they already gave you in the same process, unless it is essential.'),
    term('3.3.8 Accessible Authentication (Minimum), AA:', ' log-in must not depend on a cognitive function test such as remembering a password or solving a puzzle, unless an alternative or a mechanism like a passkey is provided. This one quietly implicates a lot of checkout and account flows.'),
    p(
      span(
        'Two of these, target size and accessible authentication, tend to surface real defects on production sites rather than edge cases, so they are the ones worth checking first. WCAG 2.2 also removed the old 4.1.1 Parsing criterion, so a handful of legacy findings simply disappear.'
      )
    ),

    h2('The parts of EN 301 549 that are not WCAG at all'),
    p(
      span(
        'If your product does anything beyond static web content, v4.1.1’s non-web chapters deserve attention. The real-time text updates matter for any service with live chat or voice and video calling, where text has to be transmitted character by character rather than message by message so that a deaf or hard of hearing user can follow a conversation as it happens. There are also functional performance statements, which describe outcomes for users with particular needs, and documentation requirements that mean your help content and support channels are in scope, not just the interface.'
      )
    ),

    h2('What to do before the citation lands'),
    p(
      span(
        'You do not need to wait for the Official Journal to act, and waiting is the wrong move. The safe posture is simple: treat WCAG 2.2 AA as your target now.'
      )
    ),
    plainBullet('Re-run your audit against WCAG 2.2, not 2.1, and treat the six new A and AA criteria as first-class findings.'),
    plainBullet('Prioritise target size and accessible authentication, which most often produce genuine defects.'),
    plainBullet('If you build a mobile app, a kiosk, or anything with live communication, read EN 301 549’s non-web chapters rather than assuming WCAG covers you.'),
    plainBullet('Check that your accessibility statement names the version of the standard you actually tested against, so it does not go stale the day v4.1.1 is cited.'),
    p(
      span(
        'None of this is speculative. WCAG 2.2 has been a finished W3C Recommendation for a while, the new criteria are stable, and the direction of the European standard is set. Auditing to 2.2 today is not getting ahead of the rules, it is meeting the ones that are about to be written down.'
      )
    ),

    linkBullet('/checklists/wcag-2-2', 'l1', 'Work through every criterion, including the 2.2 additions, with the ', 'WCAG 2.2 checklist', '.'),
    linkBullet('/research/european-accessibility-act', 'l2', 'See how the standard fits the wider obligation in our ', 'European Accessibility Act guide', '.'),
    linkBullet('/guides/how-to-audit-website-accessibility', 'l3', 'Run a 2.2-level review end to end with the ', 'website accessibility audit guide', '.'),
    linkBullet('/wcag', 'l4', 'Read any criterion in plain language in the ', 'WCAG reference', '.'),

    h2('Sources'),
    sourceLink('https://en.wikipedia.org/wiki/EN_301_549', 's1', 'Wikipedia: EN 301 549, version history and scope'),
    sourceLink('https://www.levelaccess.com/blog/eu-accessibility-requirements-and-eaa-compliance/', 's2', 'Level Access: EU accessibility requirements and EAA compliance'),
    sourceLink('https://lists.w3.org/Archives/Public/public-wai-announce/2025JulSep/0002.html', 's3', 'W3C WAI: WCAG2ICT updated to coordinate with EN 301 549'),
    sourceLink('https://www.w3.org/TR/WCAG22/', 's4', 'W3C: Web Content Accessibility Guidelines (WCAG) 2.2'),
  ],
}
