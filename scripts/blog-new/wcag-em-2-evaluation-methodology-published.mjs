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
  slug: 'wcag-em-2-evaluation-methodology-published',
  title: 'WCAG-EM 2.0 Is Here: The W3C’s Audit Methodology Grows Beyond Websites',
  excerpt:
    'The W3C published WCAG-EM 2.0 on 23 July 2026. The five steps survive intact — but "website" became "digital product," and that one change is the whole story.',
  publishedAt: '2026-07-24T06:00:00Z',
  categoryTitles: ['WCAG Guidelines', 'Testing Tools', 'Industry News'],
  seo: {
    metaTitle: 'WCAG-EM 2.0: The W3C’s Updated Audit Methodology',
    metaDescription:
      'The W3C published WCAG-EM 2.0 on 23 July 2026. It now covers apps, kiosks and documents — not just websites. The five steps, the 10% rule, and how to use it.',
    keywords: [
      'WCAG-EM 2.0',
      'WCAG evaluation methodology',
      'accessibility audit methodology',
      'WCAG-EM',
      'representative sample accessibility',
      'accessibility conformance evaluation',
      'WCAG 2.2 audit',
      'accessibility sampling',
    ],
  },
  body: [
    p(
      span(
        'On 23 July 2026, the W3C published WCAG Evaluation Methodology (WCAG-EM) 2.0 as a Group Note. It is the first substantial update to the W3C’s official recipe for auditing against WCAG since version 1.0 landed in July 2014 — twelve years in which the thing being audited stopped looking much like a website.'
      )
    ),
    p(
      span(
        'If you audit for a living, the good news is that almost nothing about your process breaks. The five steps are the same five steps. The sampling maths is unchanged. What shifted is the vocabulary, and the vocabulary is the point: WCAG-EM is no longer a methodology for evaluating websites. It is a methodology for evaluating digital products.'
      )
    ),

    h2('What WCAG-EM is — and what it is not'),
    p(
      span(
        'WCAG-EM does not add a single accessibility requirement. It contains no new success criteria and changes nothing about what "accessible" means. WCAG 2.2 remains the normative standard; WCAG-EM is the procedure you follow to check a real product against it in a way another evaluator could repeat and defend.'
      )
    ),
    p(
      span(
        'That distinction matters because of how the document is published. WCAG-EM 2.0 is a W3C Group Note — endorsed by the Accessibility Guidelines Working Group, but, in the document’s own words, "not endorsed by W3C itself nor its Members." It is informative guidance, not a standard you can be held to. Its authority is practical rather than legal: it is the closest thing the field has to an agreed definition of a competent audit, which is precisely why procurement teams, regulators and courts keep reaching for it.'
      )
    ),

    h2('The headline change: "website" became "digital product"'),
    p(
      span(
        'The 2014 document was called the Website Accessibility Conformance Evaluation Methodology, and it said plainly that it was "designed for evaluating full, self-enclosed websites." The word "website" is gone from the 2.0 title. The methodology now targets digital products, which it defines as a "coherent collection of one or more related views that together provide common use or functionality" — explicitly including web applications, mobile apps, kiosk software, e-books, and documents such as PDF, Word and EPUB.'
      )
    ),
    p(
      span(
        'Follow that change down into the steps and you can see it applied consistently. Where 1.0 asked you to "Identify Common Web Pages," 2.0 asks you to identify common views. "Identify the Variety of Web Page Types" became "Identify the variety of sample types." Step 4 was "Audit the Selected Sample" and is now "Evaluate the selected sample set," checking samples rather than web pages. Even the substep numbering was modernised, from 1.a through 1.d to 1.1 through 1.4.'
      )
    ),
    p(
      span(
        'This reads like cosmetic editing and is not. A native mobile app has no web pages, so an evaluator applying WCAG-EM 1.0 to one was quietly improvising — mapping "web page" onto "screen" and hoping a reviewer agreed. A kiosk has no URLs to enumerate for scope. The 1.0 text gave those evaluators nothing to cite. The 2.0 text does, and that closes a gap that has been widening since roughly the day 1.0 was published.'
      )
    ),

    h2('The five steps, unchanged in shape'),
    term('Step 1 — Define the evaluation scope:', ' fix what is in scope, the conformance target (A, AA or AAA), an accessibility support baseline naming actual browsers and assistive technologies, and any extra requirements.'),
    term('Step 2 — Explore the target digital product:', ' find the common views, the essential functionality, the variety of sample types, the technologies relied upon, and any other relevant samples.'),
    term('Step 3 — Select a representative sample set:', ' a structured sample, a randomly selected sample, and every view inside a complete process.'),
    term('Step 4 — Evaluate the selected sample set:', ' check the initial samples, check the complete processes, then compare the structured and random sets against each other.'),
    term('Step 5 — Report the evaluation findings:', ' document each step’s outcomes, with optional substeps for recording evaluation specifics, providing an evaluation statement, giving an aggregated score, and producing machine-readable reports.'),
    p(
      span(
        'Anyone who has run WCAG-EM 1.0 will recognise every one of those, including the optional endings to Step 5. The stability is deliberate and it is worth saying out loud: your existing audit templates, statements of work and report skeletons do not need rewriting. They need renaming.'
      )
    ),

    h2('Step 3 is where audits are won or lost'),
    p(
      span(
        'Sampling is the part practitioners most often get wrong, because it is the part where the temptation to shortcut is strongest. WCAG-EM 2.0 keeps the three-part structure that makes a sample defensible.'
      )
    ),
    term('The structured sample:', ' chosen deliberately to cover every view type, function, technology and coding style you catalogued in Step 2. This is your judgment, applied on purpose.'),
    term('The random sample:', ' "10% of the structured sample set," picked at random — the figure is unchanged from 1.0. It exists to audit your judgment, not the product.'),
    term('Complete processes:', ' every view in a multi-step flow such as checkout or registration, even views you would not otherwise have picked. A process is only accessible if all of it is.'),
    p(
      span(
        'The random 10% is the cleverest idea in the document and the most frequently skipped. Step 4.3 asks you to compare the two sets: if the random sample surfaces problems or content types your structured sample missed, your structured sample was not representative, and the correct response is to go back and widen it. Without that check, an evaluator naturally gravitates toward the views they already understand, and the audit measures the evaluator rather than the product.'
      )
    ),

    h2('How big should the sample be?'),
    p(
      span(
        'There is no minimum page count, and the absence is intentional. WCAG-EM 2.0 instead lists the factors that should push a sample larger or smaller:'
      )
    ),
    plainBullet('Size of the digital product'),
    plainBullet('Age of the digital product — older products accumulate inconsistency'),
    plainBullet('Complexity, including interactivity and dynamically generated content'),
    plainBullet('Consistency across sample types, functionality, technologies and coding styles'),
    plainBullet('Adherence to development processes, including how well trained the authors are'),
    plainBullet('The level of confidence required from the evaluation'),
    plainBullet('Whether prior evaluation findings are available to draw on'),
    p(
      span(
        'Read as a set, these say something uncomfortable and true: a large, old, inconsistent product built by many hands without a formal process needs a much bigger sample than a small design-system-driven app — and it is exactly the sort of product whose owners want to be told a twelve-page audit will do. Being able to point at a published W3C methodology when you say otherwise is genuinely useful in a procurement conversation.'
      )
    ),

    h2('The limitation you should quote to clients'),
    p(
      span(
        'The document is blunt about what a sample-based evaluation can support: "WCAG 2 conformance claims cannot be made for entire websites based upon the evaluation of a selected sub-set of web pages and functionality alone, as it is always possible that there will be unidentified conformance errors." It adds that "in the majority of situations, using this methodology alone does not result in being able to make WCAG 2 conformance claims."'
      )
    ),
    p(
      span(
        'This is why Step 5.3 offers an evaluation statement rather than a conformance claim. A statement says the samples evaluated met the conformance target defined in Step 1.2. A claim says the whole product conforms, and sampling cannot get you there. Any vendor promising "WCAG 2.2 AA certified" off the back of a sampled audit is describing something the methodology they cite explicitly says it cannot deliver — and that gap between what was tested and what was claimed is a familiar feature of accessibility litigation.'
      )
    ),

    h2('Putting WCAG-EM 2.0 to work'),
    p(
      span(
        'For most teams this is a relabelling exercise rather than a re-tooling one. Three things are worth doing while the change is fresh: update your audit templates and statements of work to the 2.0 substep numbering so your reports cite something a reader can find; check whether Step 1.3’s accessibility support baseline in your boilerplate still names browsers and screen reader versions anyone actually uses; and if your organisation ships a mobile app or a kiosk, note that you can now run a defensible, citable evaluation against it under the same methodology as the website.'
      )
    ),
    p(
      span(
        'And if you have been skipping the random 10%, this is a good moment to stop. It is the cheapest quality control in the whole document, and it is the step that tells you whether the rest of your work was representative.'
      )
    ),
    linkBullet('/guides/how-to-audit-website-accessibility', 'l1', 'Walk through a full audit end to end in our ', 'website accessibility audit guide', '.'),
    linkBullet('/methodology', 'l2', 'See how we apply a sampled, WCAG-EM-style process in our ', 'audit methodology', '.'),
    linkBullet('/sample-audit-report', 'l3', 'Look at what the output actually contains in a ', 'sample audit report', '.'),
    linkBullet('/guides/automated-vs-manual-accessibility-testing', 'l4', 'Understand what Step 4 can and cannot automate with ', 'automated vs manual testing', '.'),
    linkBullet('/checklists/wcag-2-2', 'l5', 'Check samples against the criteria themselves using the ', 'WCAG 2.2 checklist', '.'),

    h2('Sources'),
    sourceLink('https://www.w3.org/TR/wcag-em-2/', 's1', 'W3C — WCAG Evaluation Methodology (WCAG-EM) 2.0, Group Note, 23 July 2026'),
    sourceLink('https://www.w3.org/TR/2014/NOTE-WCAG-EM-20140710/', 's2', 'W3C — Website Accessibility Conformance Evaluation Methodology (WCAG-EM) 1.0, Working Group Note, 10 July 2014'),
    sourceLink('https://www.w3.org/TR/WCAG22/', 's3', 'W3C — Web Content Accessibility Guidelines (WCAG) 2.2'),
  ],
}
