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
  slug: 'missouri-sb-907-accessibility-litigation-safe-harbor',
  authorId: 'author-accessibility-build-team',
  title: 'Missouri Built a Safe Harbor for Accessibility Lawsuits. It Does Not Lower the Bar.',
  excerpt:
    'Missouri SB 907 takes effect on 28 August 2026. It rewards businesses that fix their sites within 90 days and punishes filers who sue anyway. What it changes, what it does not, and why it is not a reason to relax.',
  publishedAt: '2026-08-25T07:00:00Z',
  categoryTitles: ['Legal & Compliance', 'Industry News'],
  seo: {
    metaTitle: 'Missouri SB 907: The Accessibility Lawsuit Safe Harbor Explained',
    metaDescription:
      'Missouri SB 907 takes effect 28 August 2026 with a 90-day cure period and treble fee-shifting against abusive filers. What it does, what it cannot do, and why you still need to fix your site.',
    keywords: [
      'Missouri SB 907',
      'abusive website access litigation',
      'ADA website lawsuit',
      'accessibility litigation reform',
      'website accessibility safe harbor',
      'ADA cure period',
      'predatory ADA lawsuits',
      'web accessibility compliance',
    ],
  },
  body: [
    p(
      span(
        'On 28 August 2026, Missouri becomes the first state with a law written specifically to punish what it calls abusive website accessibility litigation. Senate Bill 907, the Act Against Abusive Website Access Litigation, passed the Missouri General Assembly on 21 April 2026 and applies to litigation pending on its effective date. If you sell to Missouri residents, or run on a platform like Shopify or Etsy that does, it is worth understanding exactly what the law rewards and, more importantly, what it leaves completely untouched.'
      )
    ),
    p(
      span(
        'The short version: SB 907 does not make your website any less obligated to be accessible. It changes who pays when a lawsuit looks less like an accessibility complaint and more like a business model. That is a meaningful shift in tone. It is not a shift in the standard.'
      )
    ),

    h2('The mechanism: a 90-day cure, then the burden flips'),
    p(
      span(
        'The heart of the law is a notice-and-cure window. When a business receives written notice of an alleged violation, it has 90 days to take substantial, good-faith steps to correct it. If it does, it earns a rebuttable presumption that any subsequent claim based on that same violation is abusive. Read that direction carefully, because it is the whole point: fixing the problem inside the window does not just resolve the complaint, it arms you with a presumption you can turn against a plaintiff who sues anyway.'
      )
    ),
    p(
      span(
        'The presumption is rebuttable, so a plaintiff can still argue the fix was cosmetic or the purpose was genuine. And if the business does not correct the issue within 90 days of notice or service, no presumption attaches at all. The law rewards remediation and only remediation. A defendant who ignores the notice for three months gets none of its protection.'
      )
    ),

    h2('What counts as "abusive"'),
    p(
      span(
        'SB 907 deliberately avoids a rigid checklist. A court decides, on the totality of the circumstances, whether the primary purpose of the original litigation was to obtain payment from the defendant because of the cost of defending the case rather than to secure an actual accessibility remedy. That is the line the whole statute draws: a suit aimed at a fix is legitimate, a suit aimed at a settlement cheque is not.'
      )
    ),
    p(
      span(
        'The Missouri Attorney General is given real teeth here. The AG can intervene in or bring an action on behalf of Missouri residents targeted by these suits, can pursue the parties, attorneys and firms that filed them, and can issue guidance identifying practices considered abusive. The statute is careful to say that guidance does not preclude legitimate enforcement, so the AG cannot use it to wave away real accessibility complaints.'
      )
    ),

    h2('The penalties are designed to sting'),
    term('Fee-shifting:', ' a court that finds litigation abusive may award attorney fees and costs to the party that had to defend against it.'),
    term('Treble sanctions:', ' on top of that, the court may award punitive damages or sanctions of up to three times the fees awarded. For a filer running a volume practice, that turns a routine cost of doing business into a genuine downside.'),
    p(
      span(
        'The economics of high-volume accessibility filing depend on defense being expensive and settlement being cheap. SB 907 attacks that math from both ends: it makes the fix a shield, and it makes a bad-faith continuation potentially cost the filer more than the settlement they were chasing.'
      )
    ),

    h2('The three limits that matter more than the headline'),
    p(
      span(
        'This is the part that gets lost when the law is reported as a win for merchants. There are three limitations, and each one should keep an accessibility program exactly where it was.'
      )
    ),
    term('It does not change your obligation.', ' The statute is explicit that it does not alter any merchant’s duty to build inclusive digital storefronts. The Web Content Accessibility Guidelines still define accessible. A site that fails WCAG 2.2 AA is still inaccessible in Missouri on 29 August exactly as it was on 27 August. The only thing that changed is the cost calculus around one category of lawsuit.'),
    term('It cannot rewrite federal law.', ' The overwhelming majority of website accessibility suits are brought under Title III of the Americans with Disabilities Act, a federal statute, and many are filed in federal court. A Missouri state law can shape state-court litigation and the conduct of Missouri-registered entities, but it does not repeal the ADA and cannot bar a federal claim outright. Treat SB 907 as changing the terrain for one kind of filing, not as immunity.'),
    term('It sunsets the moment the DOJ acts.', ' The act is written to expire if the U.S. Department of Justice issues standards for website or web content accessibility under the ADA, at which point federal rules take over. Given how long a federal web rule has been discussed, that may be a distant trigger, but it means SB 907 is explicitly a stopgap, not a settled regime.'),

    h2('What a business should actually do with this'),
    p(
      span(
        'The uncomfortable irony of SB 907 is that the only businesses it protects are the ones that were already doing the right thing. The safe harbor is unlocked by fixing your site within 90 days of notice. A company with a clean, audited, WCAG 2.2 AA site has a short, cheap cure and a strong presumption to wield. A company with 60 unlabelled controls and no statement has three frantic months and, if it misses the window, no protection at all.'
      )
    ),
    p(
      span(
        'So the practical response is the same response as before the law existed, only now with a clearer payoff: know where your site actually stands, and be in a position to remediate fast. If you can close the common failures, missing alternative text, unlabelled form fields, low-contrast text, keyboard traps, before a demand letter ever arrives, the 90-day clock is a formality rather than an emergency. And if you cannot, no state safe harbor will save you from the federal claim underneath it.'
      )
    ),
    p(
      span(
        'Missouri has changed the price of suing a business that fixed its site. It has not changed the price of ignoring accessibility. That distinction is the entire law.'
      )
    ),

    linkBullet('/research/accessibility-laws', 'l1', 'See where this sits among the wider patchwork in our ', 'accessibility laws tracker', '.'),
    linkBullet('/research/accessibility-lawsuits', 'l2', 'Track the federal litigation the safe harbor cannot touch in the ', 'accessibility lawsuit tracker', '.'),
    linkBullet('/guides/how-to-audit-website-accessibility', 'l3', 'Get ahead of a cure period by knowing where you stand with our ', 'website accessibility audit guide', '.'),
    linkBullet('/sample-audit-report', 'l4', 'See what a remediation-ready finding list looks like in a ', 'sample audit report', '.'),

    h2('Sources'),
    sourceLink('https://legiscan.com/MO/bill/SB907/2026', 's1', 'LegiScan: Missouri SB 907, 2026 Regular Session, bill text and history'),
    sourceLink('https://www.senate.mo.gov/BillTracking/Bills/BillInformation?year=2026&billid=286', 's2', 'Missouri Senate: SB 907 bill information, 2026 session'),
    sourceLink('https://www.ecomm-alliance.org/blog/a-win-for-online-merchants-missouri-sb-907-takes-aim-at-predatory-website-accessibility-lawsuits/', 's3', 'Ecommerce Innovation Alliance: analysis of SB 907’s cure period, presumption and penalties'),
    sourceLink('https://www.yahoo.com/news/articles/missouri-lawmakers-move-curb-predatory-140445832.html', 's4', 'Yahoo News: Missouri lawmakers move to curb predatory ADA lawsuits targeting small businesses'),
  ],
}
