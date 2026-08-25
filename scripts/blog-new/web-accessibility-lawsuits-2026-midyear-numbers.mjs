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
  slug: 'web-accessibility-lawsuits-2026-midyear-numbers',
  authorId: 'author-accessibility-build-team',
  title: 'On Track for 6,000 Lawsuits: What the 2026 Midyear Numbers Say About Web Accessibility Risk',
  excerpt:
    'UsableNet’s midyear report puts 2026 on pace for roughly 6,176 digital accessibility lawsuits, a record. The number matters less than the pattern underneath it, and the pattern is very learnable.',
  publishedAt: '2026-08-22T07:00:00Z',
  categoryTitles: ['Legal & Compliance', 'Industry News'],
  seo: {
    metaTitle: '2026 Web Accessibility Lawsuits: The Midyear Numbers',
    metaDescription:
      'UsableNet projects around 6,176 digital accessibility lawsuits in 2026, up nearly 20% on 2025’s 4,928, with 79% hitting e-commerce. What drives the filings and how to stay off the list.',
    keywords: [
      'web accessibility lawsuits 2026',
      'ADA website lawsuit statistics',
      'UsableNet midyear report',
      'digital accessibility litigation',
      'ADA Title III ecommerce',
      'website accessibility risk',
      'accessibility lawsuit trends',
      'WCAG compliance',
    ],
  },
  body: [
    p(
      span(
        'The midyear litigation data is in, and the line keeps pointing the same way. UsableNet’s 2026 midyear report puts the year on pace for roughly 6,176 federal and state lawsuits over inaccessible websites and mobile apps, which would be a record and a rise of close to 20 percent on 2025. For context, plaintiffs filed 4,928 web accessibility lawsuits in 2025, and roughly 79 percent of the businesses targeted sit in e-commerce.'
      )
    ),
    p(
      span(
        'Headline counts are easy to quote and easy to shrug off. The useful thing is not the number, it is the shape of it. Six years of this data have taught the field who gets sued, for what, and why, and almost none of it is random. If you understand the pattern, you can read your own exposure off it.'
      )
    ),

    h2('Why e-commerce keeps absorbing four out of five suits'),
    p(
      span(
        'The concentration in e-commerce is not because retailers are uniquely careless. It is structural. An online store is a public accommodation open to any visitor, its barriers are reproducible by anyone with a screen reader, and the friction points cluster exactly where the money is: product listings, add-to-cart controls, and checkout. A plaintiff does not need insider access to document a broken checkout. They need the same browser you use.'
      )
    ),
    p(
      span(
        'That reproducibility is the engine. A demand letter that says "your checkout cannot be completed with a keyboard" is cheap to write, hard to deny, and expensive to defend if it is true. The filings follow the path of least resistance, and a storefront is the least resistant surface a business owns.'
      )
    ),

    h2('The failures behind the filings are boringly consistent'),
    p(
      span(
        'Read enough complaints and the same handful of issues appear over and over. They map almost one to one onto the errors automated scans have found on the top million homepages for years running.'
      )
    ),
    plainBullet('Images and controls with no accessible name, so a screen reader announces "link" or "button" and nothing else.'),
    plainBullet('Form fields with no programmatic label, which turns a checkout into a guessing game.'),
    plainBullet('Text below the 4.5:1 contrast minimum, the single most common failure on the web.'),
    plainBullet('Keyboard traps and focus that vanishes into hidden menus or modal dialogs.'),
    plainBullet('An overlay widget bolted on in place of fixing any of the above.'),
    p(
      span(
        'That last one deserves its own sentence. A meaningful share of businesses named in these suits already had an accessibility overlay installed. The widget did not prevent the lawsuit, and in several matters its own marketing claims became evidence. Buying a promise of automatic compliance is not the same as being compliant, and courts have started to treat the gap as exactly that.'
      )
    ),

    h2('The counter-trend is real but narrow'),
    p(
      span(
        'It would be dishonest to describe 2026 as pure escalation. States have begun pushing back on what they call abusive filing. Missouri’s Act Against Abusive Website Access Litigation takes effect on 28 August 2026 with a 90-day cure period and treble fee-shifting against filers who sue after a defendant has fixed the problem. That is a genuine change in the cost of one kind of lawsuit.'
      )
    ),
    p(
      span(
        'But notice what the safe harbour is built around: fixing the site. It rewards remediation, not inaction, and it does nothing about the federal ADA claim that drives most of these filings in the first place. The counter-trend does not lower the standard. It raises the reward for having already met it.'
      )
    ),

    h2('Reading your own exposure'),
    p(
      span(
        'You do not need a law degree to estimate your risk, you need an honest look at your own funnel. Three questions get you most of the way there.'
      )
    ),
    term('Can a keyboard-only user complete a purchase?', ' Tab through your entire checkout without touching the mouse. If focus disappears, if a step cannot be reached, or if an error is announced to no one, that is a documented barrier, not a rough edge.'),
    term('Does every control have a name?', ' Turn on a screen reader and listen to your header, your product cards and your cart. A page full of "link, link, button" is a page full of exhibits.'),
    term('Is your statement true?', ' An accessibility statement that overpromises is worse than none. If it claims conformance the site does not have, it hands a plaintiff your own words.'),
    p(
      span(
        'The businesses that stay off the list are not the ones with the best lawyers. They are the ones whose sites actually work with a keyboard and a screen reader, and who can prove it with a dated, methodical audit rather than a vendor badge. In a year heading for six thousand suits, that evidence is the cheapest insurance on the page.'
      )
    ),

    linkBullet('/research/accessibility-lawsuits', 'l1', 'Watch the filings as they land in our live ', 'accessibility lawsuit tracker', '.'),
    linkBullet('/guides/how-to-audit-website-accessibility', 'l2', 'Find your own barriers before a plaintiff does with the ', 'website accessibility audit guide', '.'),
    linkBullet('/guides/accessibility-overlay-alternatives', 'l3', 'Understand why the widget did not help in ', 'accessibility overlay alternatives', '.'),
    linkBullet('/sample-audit-report', 'l4', 'See the kind of evidence a defensible program produces in a ', 'sample audit report', '.'),

    h2('Sources'),
    sourceLink('https://info.usablenet.com/2026-midyear-report', 's1', 'UsableNet: 2026 Midyear Digital Accessibility Lawsuit Report'),
    sourceLink('https://blog.usablenet.com/inside-the-2026-midyear-numbers-where-digital-accessibility-litigation-is-going', 's2', 'UsableNet: Inside the 2026 Midyear Numbers: where digital accessibility litigation is going'),
    sourceLink('https://blog.usablenet.com/digital-accessibility-lawsuits-in-2026-five-trends-companies-should-know', 's3', 'UsableNet: Digital Accessibility Lawsuits in 2026: Five Trends Companies Should Know'),
    sourceLink('https://legiscan.com/MO/bill/SB907/2026', 's4', 'LegiScan: Missouri SB 907, Act Against Abusive Website Access Litigation'),
  ],
}
