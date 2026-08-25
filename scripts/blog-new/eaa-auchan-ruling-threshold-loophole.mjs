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
  slug: 'eaa-auchan-ruling-threshold-loophole',
  authorId: 'author-accessibility-build-team',
  title: 'The First EAA Ruling Went to the Defendant. Don’t Call It a Win.',
  excerpt:
    'A French court dismissed the first case brought under a national transposition of the European Accessibility Act. It also found the site failing 13 of 19 sections. The dismissal was a threshold quirk, not a clean bill of health, and it is already on appeal.',
  publishedAt: '2026-08-15T07:00:00Z',
  categoryTitles: ['Legal & Compliance', 'Industry News'],
  seo: {
    metaTitle: 'The Auchan EAA Ruling: A Defendant Win That Isn’t',
    metaDescription:
      'The Tribunal judiciaire de Lille dismissed the first EAA case on a revenue-threshold conflict, yet found Auchan’s site failing 13 of 19 sections. Why the finding matters more than the dismissal.',
    keywords: [
      'European Accessibility Act ruling',
      'Auchan EAA case',
      'EAA France',
      'EAA enforcement 2026',
      'digital accessibility court ruling',
      'EAA transposition threshold',
      'ecommerce accessibility Europe',
      'EAA compliance',
    ],
  },
  body: [
    p(
      span(
        'On 5 May 2026 the Tribunal judiciaire de Lille handed down what is believed to be the first ruling anywhere on a case brought under a national transposition of the European Accessibility Act. It went to the defendant. If you only read the outcome line, Auchan won, and you might conclude the EAA has less bite than advertised. That reading is wrong, and the reasons it is wrong are the whole lesson.'
      )
    ),
    p(
      span(
        'Two French disability associations, apiDV and Droit Pluriel, supported by the legal collective Intérêt à Agir, had sent formal notices in July 2025 and filed emergency injunction proceedings in November 2025 over the accessibility of Auchan’s e-commerce site. The court did not find the site accessible. It found that a particular French statute did not reach the particular corporate entity that had been sued.'
      )
    ),

    h2('The dismissal was a threshold accident'),
    p(
      span(
        'France has two overlapping accessibility regimes, and they carry different size thresholds. The older 2005 domestic law bites at a revenue floor of 250 million euros. The EAA transposition exempts only microenterprises, businesses under roughly 2 million euros in turnover with fewer than ten staff. Auchan E-Commerce, the entity in the dock, reported around 182 million euros of revenue in 2023 and 144 million in 2024. That sits below the 250 million domestic threshold and comfortably above the EAA’s microenterprise exemption.'
      )
    ),
    p(
      span(
        'The court applied the 2005 law’s threshold and, on that basis, held the obligation did not attach to this entity. In other words, the case turned on which of two conflicting rules governed, not on whether the site worked for disabled users. As one summary put it plainly, the court did not find that Auchan’s site was accessible, it found that one specific French law did not reach the specific corporate entity that got sued. That is a transposition drafting problem, not a precedent about accessibility.'
      )
    ),

    h2('The court still found the site failing'),
    p(
      span(
        'This is the part that should travel further than the verdict. Even while dismissing, the court accepted that the site’s accessibility was, in its words, fairly low, with strong or major failures across 13 of the 19 sections audited by the associations’ own committee of blind and partially sighted testers. A human panel of screen reader users went through the site and found the majority of it broken. The dismissal did not erase that finding, it sat right next to it.'
      )
    ),
    p(
      span(
        'For any business tempted to read this as permission, that is the number to sit with. Thirteen of nineteen sections failing is not a near miss. It is the ordinary state of an unaudited e-commerce site, and a court has now recorded it in the first EAA matter to reach judgment.'
      )
    ),

    h2('It is already on appeal, and the trend is against it'),
    p(
      span(
        'The associations filed an appeal to the Cour d’appel de Douai two days after the ruling, so this is not settled law, it is a first-instance decision on a contested question of which threshold applies. Threshold conflicts in a hasty transposition are exactly the kind of thing an appellate court, or a legislative fix, tends to resolve, and the direction of resolution rarely favours a loophole that lets a 180 million euro retailer escape a rule meant to cover it.'
      )
    ),
    p(
      span(
        'The wider case law is already leaning the other way. Weeks later, on 4 June 2026, the Tribunal judiciaire de Caen ordered Carrefour to make both its website and its mobile application fully accessible within six months, under a daily penalty for delay. That ruling reached the merits, ordered remediation, and pointedly covered the mobile app as well as the site. Put the two together and the message is not "the EAA is toothless." It is "the EAA is being tested, and the substance keeps coming back to whether the thing actually works."'
      )
    ),

    h2('What a business should take from this'),
    term('A threshold escape is not safety.', ' Relying on a size cutoff or a corporate structure to stay out of scope is a bet on a contested reading that is already being appealed, and on transposition text that regulators are motivated to tighten. It is not an accessibility strategy.'),
    term('The audit finding is the real exposure.', ' Whatever the court decided about jurisdiction, an independent panel found 13 of 19 sections failing. That is the fact that shows up in the next complaint, the next demand, and the next jurisdiction with a cleaner statute.'),
    term('Cover the app, not just the site.', ' The Carrefour order treated the mobile app as in scope on its own terms. If you ship an app, it needs the same evaluation as the website, across the full purchase journey.'),
    p(
      span(
        'The honest summary of the first EAA ruling is that the defendant won on a technicality that probably will not survive, while losing the only question that matters to a disabled customer. Do not build a compliance plan on the technicality. Build it on the finding.'
      )
    ),

    linkBullet('/research/european-accessibility-act', 'l1', 'Track scope, deadlines and enforcement in our ', 'European Accessibility Act guide', '.'),
    linkBullet('/guides/how-to-audit-website-accessibility', 'l2', 'Run the kind of section-by-section review the court relied on with our ', 'website accessibility audit guide', '.'),
    linkBullet('/guides/mobile-accessibility', 'l3', 'Bring your app into scope, as the Carrefour order did, using the ', 'mobile accessibility guide', '.'),
    linkBullet('/sample-audit-report', 'l4', 'See how a defensible finding set is documented in a ', 'sample audit report', '.'),

    h2('Sources'),
    sourceLink('https://silktide.com/blog/eaa-auchan-court-ruling/', 's1', 'Silktide: The first EAA court ruling went to the defendant. Don’t read it as good news.'),
    sourceLink('https://www.deque.com/blog/frances-major-court-decision-supporting-digital-accessibility-under-the-eaa/', 's2', 'Deque: France’s major court decision supporting digital accessibility under the EAA'),
    sourceLink('https://www.barrierbreak.com/eaa-carrefour-penalty-france/', 's3', 'BarrierBreak: What the Carrefour ruling teaches every business'),
  ],
}
