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
  slug: 'ai-did-not-fix-accessibility-2026',
  title: 'AI Promised to Fix Accessibility. It Didn’t.',
  excerpt:
    'AI accelerates accessibility work, but it does not automate compliance. A measured look at what broke, what regulators said, and what actually works.',
  publishedAt: '2026-06-10T10:00:00Z',
  categoryTitles: ['AI & Accessibility', 'Opinion'],
  seo: {
    metaTitle: 'AI Promised to Fix Accessibility. It Didn’t.',
    metaDescription:
      'AI accelerates accessibility work but does not automate compliance. What broke for screen-reader users, what the FTC said, and what actually works.',
    keywords: [
      'AI accessibility',
      'AI accessibility tools',
      'automated accessibility remediation',
      'AI alt text',
      'accessiBe FTC',
      'screen reader compatibility',
      'AI vs manual accessibility',
    ],
  },
  body: [
    p(
      span(
        'Through 2025 and 2026, a gap widened between what AI-powered accessibility remediation tools claimed and what they actually delivered. The promise was automatic compliance; the reality was broken screen-reader experiences and unreliable machine-written alt text. This is not an argument against AI — AI genuinely accelerates expert work. It is an argument against the specific claim that AI can make a website compliant on its own.'
      )
    ),

    h2('Regulators pushed back on the marketing'),
    p(
      span(
        'The clearest signal came from regulators. In April 2025, the Federal Trade Commission finalized a $1 million order against accessiBe, barring it from claiming that its automated product can make any site WCAG compliant. When a federal regulator draws a line under "AI makes your site compliant" marketing, it is worth taking seriously.'
      )
    ),
    p(
      span(
        'The order is narrow in one sense — it names a single company — but broad in what it establishes: the specific promise that an automated product can, by itself, deliver WCAG compliance is one a regulator was willing to challenge and penalize. Any vendor making the same claim now does so knowing that line exists.'
      )
    ),

    h2('Where the automation broke'),
    p(span('Two concrete failure modes stood out.')),
    term(
      'AI-driven overlays broke screen-reader compatibility:',
      ' users of JAWS and NVDA reported overlay scripts intercepting keyboard commands, re-reading page elements out of order, or hiding content their assistive technology had already handled correctly.'
    ),
    term(
      'AI-generated alt text proved unreliable at scale:',
      ' automation can detect whether an image has alt text, but not whether that alt text is meaningful to a human. Presence is measurable; usefulness is not — at least not without a person in the loop.'
    ),
    p(
      span(
        'Both failures share a root cause. Accessibility is ultimately about whether a real person can use a page, and that is a judgment automated checks cannot fully make. The overlay case is especially telling: a script inserted to improve accessibility actively degraded it for the exact users — JAWS and NVDA users — it claimed to serve, by fighting the assistive technology instead of cooperating with it. The alt-text case is quieter but just as consequential, because a page can pass an automated "does every image have alt text?" check while remaining opaque to a blind user reading descriptions that are technically present and practically useless.'
      )
    ),

    h2('What actually works: augmentation, not automation'),
    p(
      span(
        'The credible, evidence-supported role for AI is augmentation, not automation. In that model, AI does what it is genuinely good at, and people do the rest:'
      )
    ),
    plainBullet('AI flags likely violations at scale, far faster than a human could review a large site by hand.'),
    plainBullet('AI drafts alt text as a starting point.'),
    plainBullet('Human experts then confirm, prioritize, and fix — deciding what a violation means in context and whether a description is actually useful.'),
    p(
      span(
        'Claims of full automation, of replacing manual audits, or of automatic compliance are not supported by evidence. Claims that AI accelerates expert work are. The distinction is not rhetorical: it changes what you buy, how you staff, and where accountability sits. In an augmentation model, the AI is a force multiplier for a person who remains responsible for the outcome. In an automation model, responsibility is quietly handed to a system that, as JAWS and NVDA users learned, can make things worse while reporting success.'
      )
    ),

    h2('How to tell a real tool from hype'),
    p(
      span(
        'You can usually separate a credible tool from a marketing claim before you buy, using a few simple checks. Honest accessibility tooling tends to share these traits:'
      )
    ),
    term(
      'It describes augmentation, not automation:',
      ' the pitch is "we help your team work faster," not "we make your site compliant."'
    ),
    term(
      'It keeps a human in the loop:',
      ' AI output is treated as a draft an expert reviews, not a fix that ships unseen.'
    ),
    term(
      'It does not fight assistive technology:',
      ' a script that intercepts keyboard input or overrides what JAWS and NVDA already do is a red flag, not a feature.'
    ),
    term(
      'It is honest about limits:',
      ' automated testing can only catch a portion of WCAG issues — the rest require human judgment — and a trustworthy vendor says so plainly.'
    ),
    term(
      'It never promises legal immunity:',
      ' no widget or subscription makes an ADA lawsuit disappear, and the FTC’s $1 million order against accessiBe shows regulators will challenge "automatic compliance" claims.'
    ),
    p(
      span(
        'If a product cannot survive those five questions, its "AI-powered compliance" is marketing, not engineering.'
      )
    ),

    h2('Why it matters for you'),
    p(
      span(
        'If you are choosing a tool, judge it by the claim it makes. A tool that says "we help our experts work faster" is describing something real. A tool that says "we make your site compliant automatically" is describing something that broke for JAWS and NVDA users and drew a $1 million FTC order. Use AI to move faster; keep a human accountable for the result.'
      )
    ),
    p(
      span(
        'None of this is a case against AI. Used well, it genuinely accelerates expert work: it can triage a large site in a fraction of the time a manual pass would take, surface the issues most likely to matter, and hand a person a running start on descriptions and fixes. The failure was never the technology itself — it was the promise wrapped around it. Treat AI as the fast first pass and a person as the final word, and you get the speed without inheriting the failures that made 2025 and 2026 such a cautionary tale.'
      )
    ),
    linkBullet(
      '/guides/automated-vs-manual-accessibility-testing',
      'l1',
      'See where each approach fits in our guide to ',
      'automated vs manual accessibility testing',
      '.'
    ),
    linkBullet(
      '/guides/accessibility-overlays',
      'l2',
      'Understand the widgets behind many of these failures in our ',
      'guide to accessibility overlays',
      '.'
    ),
    linkBullet(
      '/tools/alt-text-generator',
      'l3',
      'Use AI the right way — as a drafting aid — with our ',
      'alt text generator',
      ', then review every result.'
    ),
    linkBullet(
      '/guides/how-to-audit-website-accessibility',
      'l4',
      'And put a human in the loop with our guide on ',
      'how to audit website accessibility',
      '.'
    ),

    h2('Sources'),
    sourceLink(
      'https://www.tranistics.com/ai-promised-to-fix-accessibility-the-doj-disagreed-heres-whats-actually-working/',
      's1',
      'Tranistics'
    ),
    sourceLink('https://www.audioeye.com/post/ai-accessibility-tools/', 's2', 'AudioEye'),
    sourceLink('https://think.design/blog/ai-and-digital-accessibility/', 's3', 'Think Design'),
  ],
}
