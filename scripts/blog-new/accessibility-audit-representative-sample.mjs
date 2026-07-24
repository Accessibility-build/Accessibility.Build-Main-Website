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
  slug: 'accessibility-audit-representative-sample',
  title: 'How Many Pages Should an Accessibility Audit Cover? A Worked Example',
  excerpt:
    '"How many pages?" is the wrong question. WCAG-EM answers a better one — which pages — and the arithmetic is more forgiving than most teams expect. Here it is on a 400-page site.',
  publishedAt: '2026-07-24T07:00:00Z',
  categoryTitles: ['Testing Tools', 'WCAG Guidelines'],
  seo: {
    metaTitle: 'How Big Should an Accessibility Audit Sample Be?',
    metaDescription:
      'A worked WCAG-EM example on a 400-page site: how to build a structured sample, why the random 10% exists, and how complete processes change the total.',
    keywords: [
      'accessibility audit sample size',
      'representative sample accessibility',
      'how many pages accessibility audit',
      'WCAG-EM sampling',
      'structured sample',
      'random sample accessibility audit',
      'accessibility audit scope',
      'WCAG audit methodology',
    ],
  },
  body: [
    p(
      span(
        'Every accessibility audit starts with the same negotiation. The buyer asks how many pages you will test; the auditor gives a number; the number gets cut to fit a budget. Both sides are arguing about the wrong variable, and the W3C’s evaluation methodology explains why: it never tells you how many samples to take. It tells you how to choose them.'
      )
    ),
    p(
      span(
        'That shift — from counting to choosing — is what makes an audit defensible. A twelve-view sample that covers every template, technology and user journey on a product is worth more than fifty near-identical blog posts. Below is the selection process from WCAG-EM Step 3, worked through on a realistic site.'
      )
    ),

    h2('Why page count is the wrong unit'),
    p(
      span(
        'Two sites with 400 pages each can need wildly different samples. If the first is a documentation site where all 400 pages use one template, you learn almost everything from a handful of views. If the second is fifteen years of accumulated microsites, campaign landing pages and three generations of component library, 40 views might still miss the worst of it.'
      )
    ),
    p(
      span(
        'What actually drives risk is variety — of templates, of functionality, of technologies, of the people who wrote the code. A sample is representative when it covers that variety, not when it hits a percentage of the URL count. So the count falls out of the selection; it is not an input to it.'
      )
    ),

    h2('You cannot sample what you have not explored'),
    p(
      span(
        'Step 3 depends entirely on Step 2, and skipping the exploration is the single most common reason audits miss things. Before selecting anything, inventory the product: the common views, the essential functionality, the variety of sample types, the technologies relied upon, and anything else relevant such as help pages, legal pages, or accessibility settings.'
      )
    ),
    p(
      span(
        'For our example, assume a 400-page B2B SaaS product. The exploration comes back with this:'
      )
    ),
    term('Common views: ', 'global header, footer, navigation, cookie banner, search overlay — present on essentially every page.'),
    term('Templates: ', 'marketing home, product page, pricing table, blog index, blog post, docs article, support article, 404, plus the signed-in app shell.'),
    term('Functionality: ', 'signup, login with 2FA, checkout, contact form, in-app data table with filters, file upload, a charting dashboard.'),
    term('Sample-type variety: ', 'long-form text, data tables, forms, video with captions, an interactive pricing calculator, downloadable PDFs.'),
    term('Technologies relied upon: ', 'HTML, CSS, JavaScript, WAI-ARIA, a React component library, an embedded third-party chat widget, and PDF.'),
    p(
      span(
        'Notice how little of that is expressible as a page count. The inventory is a list of things that could each break in their own way — which is exactly what a sample needs to cover.'
      )
    ),

    h2('The worked sample'),
    h3('1. The structured sample'),
    p(
      span(
        'Pick deliberately, one instance per distinct thing, plus a second instance where a template carries meaningfully different content. On our example product that lands at roughly 22 views:'
      )
    ),
    plainBullet('One of each template listed above — 9 views, including the 404 and the app shell.'),
    plainBullet('A second blog post and a second docs article, chosen because both are authored by many hands and drift over time — 2 views.'),
    plainBullet('The views carrying each distinct sample type: the video page, the pricing calculator, the data table, the file upload, a PDF — 5 samples.'),
    plainBullet('The views where the third-party chat widget and the charting library actually render — 2 views.'),
    plainBullet('Accessibility statement, help landing page, contact page, and the cookie-consent interaction — 4 views.'),
    p(
      span(
        'The global header, footer and navigation do not need their own entries. They appear on nearly every sample already, and the methodology does not ask you to re-evaluate identical components on every page they appear.'
      )
    ),

    h3('2. The random sample — 10% of the structured set'),
    p(
      span(
        'WCAG-EM sets the random sample at 10% of the structured sample set. With 22 structured samples, that is between 2 and 3 randomly chosen views from anywhere in the product — genuinely at random, not "a couple more we thought of."'
      )
    ),
    p(
      span(
        'This is the step teams cut first, and cutting it removes the only independent check in the entire method. More on why below.'
      )
    ),

    h3('3. Complete processes'),
    p(
      span(
        'Any multi-step flow must be included in full, even where individual views would not otherwise have been selected. Signup is 3 views, checkout is 4, and 2FA login is 3. Several of those already appear in the structured set, so assume 6 additions.'
      )
    ),
    p(
      span(
        'The reasoning is strict and worth repeating to clients: a process is accessible only if every step is. One inaccessible view in a five-step checkout makes the whole purchase impossible, and testing four of the five tells you nothing useful.'
      )
    ),

    h3('The total'),
    p(
      span(
        'Twenty-two structured, plus three random, plus six process views, is roughly 31 samples for a 400-page product — under 8% of the URL count, and far more informative than 8% chosen by traffic. That ratio is typical. When someone insists a real audit means testing every page, this is the arithmetic that answers them.'
      )
    ),

    h2('What the random 10% is actually for'),
    p(
      span(
        'The random sample does not exist to test more of the product. It exists to test your structured sample, and Step 4.3 makes that explicit: after evaluating, compare the two sets.'
      )
    ),
    p(
      span(
        'If the random views surface issue types, content types or technologies your structured sample never included, your exploration in Step 2 was incomplete — and the correct response is to go back and widen the structured sample, not to note it and move on. If the random views produce nothing new, that is meaningful evidence your sample was representative, and it belongs in the report.'
      )
    ),
    p(
      span(
        'Without that check, an audit quietly measures the auditor. Evaluators gravitate toward views they understand and templates they have seen before, and nothing in the process contradicts them. Three random views are the cheapest quality control available in the entire methodology.'
      )
    ),

    h2('The factors that should move your number'),
    p(
      span(
        'WCAG-EM lists what should push a sample larger or smaller. Read as a group, they describe risk:'
      )
    ),
    numbered('Size of the product.'),
    numbered('Age of the product — older products accumulate inconsistency and dead corners.'),
    numbered('Complexity, including interactivity and dynamically generated content.'),
    numbered('Consistency across templates, functionality, technologies and coding styles.'),
    numbered('Adherence to development processes, including how many authors contribute and how well trained they are.'),
    numbered('The level of confidence the evaluation needs to support.'),
    numbered('Whether prior evaluation findings exist to build on.'),
    p(
      span(
        'A ten-year-old product built by dozens of contributors without a design system needs a substantially larger sample than a young app on a governed component library — and it is invariably the former whose owners want to be told a small audit will do. Being able to point at the published methodology changes that conversation from opinion to standard practice.'
      )
    ),

    h2('Four ways sampling goes wrong'),
    term('Sampling by traffic. ', 'The top 20 pages by pageviews are usually the same template repeated, and they systematically exclude the account, settings and error states where the hardest failures live.'),
    term('Skipping the random set. ', 'Removes the only check on your own judgment, and with it any evidence that the sample was representative.'),
    term('Testing part of a process. ', 'A checkout audited to step three tells you nothing about whether anyone can buy.'),
    term('Letting the client pick. ', 'Understandable, and fatal. Stakeholders choose the pages they are proud of; sampling exists precisely to defeat that instinct.'),

    h2('Writing it down'),
    p(
      span(
        'Whatever you select, Step 5.1 expects the reasoning to be documented — the inventory, the sample and why each item is in it. That record is what lets a second evaluator repeat your work, what makes a finding defensible when a vendor disputes it, and what distinguishes an audit from a list of opinions about a website.'
      )
    ),
    linkBullet('/blog/wcag-em-2-evaluation-methodology-published', 'l1', 'Start with the methodology itself in ', 'what changed in WCAG-EM 2.0', '.'),
    linkBullet('/guides/how-to-audit-website-accessibility', 'l2', 'Run the whole evaluation end to end with our ', 'website accessibility audit guide', '.'),
    linkBullet('/methodology', 'l3', 'See how we scope and sample engagements in our ', 'audit methodology', '.'),
    linkBullet('/sample-audit-report', 'l4', 'Look at how a documented sample appears in a ', 'sample audit report', '.'),
    linkBullet('/guides/automated-vs-manual-accessibility-testing', 'l5', 'Decide what to automate across your sample with ', 'automated vs manual testing', '.'),

    h2('Sources'),
    sourceLink('https://www.w3.org/TR/wcag-em-2/', 's1', 'W3C — WCAG Evaluation Methodology (WCAG-EM) 2.0, Group Note, 23 July 2026'),
    sourceLink('https://www.w3.org/TR/2014/NOTE-WCAG-EM-20140710/', 's2', 'W3C — Website Accessibility Conformance Evaluation Methodology (WCAG-EM) 1.0, 10 July 2014'),
    sourceLink('https://www.w3.org/TR/WCAG22/', 's3', 'W3C — Web Content Accessibility Guidelines (WCAG) 2.2'),
  ],
}
