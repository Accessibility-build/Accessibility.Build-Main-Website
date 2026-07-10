// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
// A paragraph or bullet containing a single inline link inside surrounding text
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
// A Sources bullet: whole item is a single link labelled by publication name
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

export default {
  slug: 'overlay-lawsuits-2026-userway-class-action',
  title: 'The Overlay Reckoning: UserWay Class Action Advances in 2026',
  excerpt:
    'A class action against UserWay cleared a key hurdle in 2026, and the data confirms it: accessibility overlays do not buy legal immunity.',
  publishedAt: '2026-05-26T10:00:00Z',
  categoryTitles: ['Legal & Compliance'],
  seo: {
    metaTitle: 'UserWay Overlay Class Action Advances in 2026',
    metaDescription:
      'A federal judge let key claims against UserWay proceed in 2026. Here is what the overlay lawsuit, the FTC accessiBe order, and litigation data mean for you.',
    keywords: [
      'accessibility overlay lawsuit',
      'UserWay class action',
      'overlay legal protection',
      'ADA website compliance',
      'accessiBe FTC order',
      'web accessibility litigation 2026',
      'accessibility overlays',
    ],
  },
  body: [
    p(
      span(
        'Accessibility "overlay" widgets — the JavaScript add-ons that promise to auto-fix a website — spent 2026 under growing legal pressure. A class action against UserWay, brought by a small online flower business, cleared a significant procedural hurdle in February 2026 when a federal Magistrate Judge recommended that key portions of the case move forward. The lawsuit and the litigation data around it point to one conclusion: an overlay does not buy legal immunity, and it does not substitute for remediating the underlying code.'
      )
    ),

    h2('What the Bloomsybox case alleges'),
    p(
      span(
        'Bloomsybox, a small online flower-delivery business, filed a class action against UserWay. According to the complaint, Bloomsybox subscribed to UserWay’s overlay in 2023 and was served with an ADA website-accessibility lawsuit only about six months later. The overlay, the suit says, had not fixed core problems such as missing alternative text and broken keyboard navigation, and UserWay’s advertised "$1 million legal protection" did not shield the business from being sued.'
      )
    ),
    p(span('The complaint brings four claims:')),
    plainBullet('Breach of contract'),
    plainBullet('Violation of the Delaware Consumer Fraud Act'),
    plainBullet('Violation of the Magnuson-Moss Warranty Act'),
    plainBullet('Negligent misrepresentation'),
    p(
      span(
        'In February 2026, after UserWay moved to dismiss, a federal Magistrate Judge recommended that key portions of the case proceed. That recommendation does not decide the merits, but it does mean the central theory — that an overlay marketed with legal protection failed to deliver either accessibility or protection — will be tested rather than thrown out at the pleadings stage.'
      )
    ),
    p(
      span(
        'The sequence at the heart of the complaint is what makes it resonate. A small business adopts an overlay in good faith, in part to reduce legal exposure, and is nonetheless served with an ADA lawsuit roughly six months later — over the very barriers the overlay was supposed to have addressed. The advertised "$1 million legal protection," in Bloomsybox’s telling, did not prevent the suit or absorb its consequences. Framed as a class action, the case asks whether that experience was unique to one flower shop or a pattern many overlay subscribers share.'
      )
    ),

    h2('The regulatory parallel: the FTC’s accessiBe order'),
    p(
      span(
        'The Bloomsybox suit does not stand alone. It parallels the Federal Trade Commission’s action against accessiBe, another overlay vendor. In April 2025 the FTC finalized a $1 million order and barred accessiBe from representing that its automated product can make any website WCAG compliant. The two matters arrive from different directions — one a private class action over contract and consumer-protection law, the other a federal enforcement order — yet they converge on the same objection: marketing that equates an automated widget with genuine conformance. When both a plaintiff’s bar and a regulator are pressing the same point, the market signal is hard to ignore.'
      )
    ),

    h2('The data behind the pattern'),
    p(
      span(
        'Litigation research from 2025 and 2026 shows that overlays are not keeping their users out of court:'
      )
    ),
    term(
      'AudioEye’s 2026 litigation report',
      ' found that 38.5% of businesses sued for inaccessibility in 2025 already had some accessibility solution in place — usually an overlay.'
    ),
    term(
      'Other analyses',
      ' found that roughly 22–23% of web accessibility suits in the first half of 2025 targeted sites that already had an overlay installed.'
    ),
    p(
      span(
        'In other words, a meaningful share of the businesses being sued had already paid for a tool sold, in part, on the promise of reducing legal risk. The numbers do not prove any single overlay caused any single lawsuit, but they undercut the core sales pitch: if a widget reliably prevented litigation, sued sites with an overlay installed would be rare rather than routine.'
      )
    ),

    h2('What this means for you'),
    p(
      span(
        'The through-line is simple: overlays do not provide legal immunity, and real conformance comes from remediating the underlying code — the HTML, ARIA, and interaction patterns that assistive technology actually reads. An overlay layered on top of unfixed markup leaves missing alt text missing and broken keyboard navigation broken; a screen-reader user still hits the same wall, and a plaintiff can still document the barrier.'
      )
    ),
    p(
      span(
        'That reframes the buying decision. The question is not "which overlay comes with the biggest legal-protection promise," but "how do we remove the barriers a tester or a user would actually encounter." A vendor guarantee is only as good as the accessibility underneath it, and the Bloomsybox case is, at its core, an argument that the guarantee was not enough.'
      )
    ),
    linkBullet(
      '/guides/accessibility-overlays',
      'l1',
      'Understand what overlays can and cannot do before you rely on one — start with our ',
      'guide to accessibility overlays',
      '.'
    ),
    linkBullet(
      '/guides/accessibility-overlay-alternatives',
      'l2',
      'If you already run an overlay, review the ',
      'alternatives to accessibility overlays',
      ' that address the code itself.'
    ),
    linkBullet(
      '/tools/overlay-detector',
      'l3',
      'Not sure whether a site is leaning on a widget? Check with our ',
      'overlay detector',
      '.'
    ),
    linkBullet(
      '/services/accessibility-audits',
      'l4',
      'For durable conformance, commission a manual ',
      'accessibility audit',
      ' that finds and fixes the real barriers.'
    ),

    block('normal', [
      span('This article is general information, not legal advice.', ['em']),
    ]),

    h2('Sources'),
    sourceLink('https://www.lflegal.com/2025/02/userway-overlay-lawsuit/', 's1', 'Lainey Feingold (LFLegal)'),
    sourceLink('https://title2.info/article/the-userway-overlay-lawsuit/', 's2', 'Title2.info'),
    sourceLink('https://www.audioeye.com/guides/2026-web-accessibility-litigation-report/', 's3', 'AudioEye'),
    sourceLink('https://www.ftc.gov/news-events/news/press-releases', 's4', 'Federal Trade Commission (the FTC’s accessiBe order)'),
  ],
}
