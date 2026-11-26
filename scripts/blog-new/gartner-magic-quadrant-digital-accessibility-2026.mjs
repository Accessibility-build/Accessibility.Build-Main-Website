// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const h3 = (t) => block('h3', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

// Every factual claim below was checked against these primary sources (all fetched 18 Nov 2026):
// - Gartner abstract, document 8470345: title "Magic Quadrant for Digital Accessibility",
//   "Published: 05 October 2026", the four analysts, the summary, the list of contents, and the
//   19 vendors named under "Vendor Strengths and Cautions" (read from the page HTML).
// - Gartner Magic Quadrant methodology page and Magic Quadrant overview/FAQ page: quadrant
//   definitions, "niche player may support your needs better", 15 weighted criteria, client status
//   does not affect coverage. Gartner document 5292963 (19 March 2024): consult an MQ to narrow a
//   list but do not base the decision on it alone.
// - Vendor announcements (placements are self-reported): Level Access release (16 Oct 2026; calls
//   it "Magic Quadrant for Digital Accessibility Platforms"; highest Ability to Execute; its image
//   alt text describes every vendor's position), Deque blog (9 Oct 2026), Siteimprove release
//   (9 Oct 2026; footnote cites 6 October 2026), accessiBe release on PR Newswire (15 Oct 2026;
//   Challenger; also evaluated in the companion Critical Capabilities report), inSuit website banner
//   (only Spanish vendor; links to "what it means to be a Niche Player").
// - FTC press release (22 Apr 2025) and the Decision and Order in File No. 222-3156 (Section I
//   wording, substantiation condition, neither admit nor deny, 20-year term).
// - W3C WCAG-EM 2.0 Group Note (23 July 2026): five steps, 10% random sample, "most accessibility
//   checks are not fully automatable".
// - ITI VPAT page: VPAT 2.5Rev (April 2025), completed VPAT = ACR, ITI does not certify ACRs,
//   product owner usually best placed to complete it.
// Not used: the full Gartner report (paywalled). Gartner's inclusion criteria are not public.
export default {
  slug: 'gartner-magic-quadrant-digital-accessibility-2026',
  authorId: 'author-accessibility-build-team',
  title: 'Gartner’s First Magic Quadrant for Digital Accessibility: What It Tells Buyers, and What It Does Not',
  excerpt:
    'Gartner published its first Magic Quadrant for Digital Accessibility on 5 October 2026, evaluating 19 vendors. Level Access, Deque and Siteimprove say they are Leaders. Here is what the report measures, what the vendor announcements claim, and the questions a buyer should ask whichever quadrant a vendor sits in.',
  publishedAt: '2026-11-18T04:15:00Z',
  categoryTitles: ['Industry News', 'Opinion'],
  seo: {
    metaTitle: 'Gartner Magic Quadrant for Digital Accessibility 2026',
    metaDescription:
      'Gartner’s first Magic Quadrant for Digital Accessibility names 19 vendors. What placement measures, what it does not, and what buyers should ask any vendor.',
    keywords: [
      'Gartner Magic Quadrant digital accessibility',
      'Magic Quadrant for Digital Accessibility 2026',
      'digital accessibility platforms',
      'accessibility vendor evaluation',
      'Level Access Gartner',
      'Deque Gartner Leader',
      'Siteimprove Gartner',
      'accessiBe FTC order',
      'WCAG-EM sampling',
      'VPAT ACR authorship',
    ],
  },
  body: [
    p(
      span(
        'On 5 October 2026 Gartner published its first Magic Quadrant for Digital Accessibility. For a field that has spent years being treated as a compliance afterthought, that is a milestone: Gartner describes Magic Quadrants as covering markets where growth is high and the differences between providers are distinct. Within days, the vendors placed in the Leaders quadrant were announcing it, and others followed with their own placements.'
      )
    ),
    p(
      span(
        'If you buy accessibility tools or services, you will see this report cited in sales decks for the next year at least. So it is worth being clear about what a Magic Quadrant measures, what the vendor announcements actually say, and what it cannot tell you: whether a product will make your website or app conform to WCAG.'
      )
    ),
    p(
      span('A note on sourcing: ', ['strong']),
      span(
        'the full Gartner report is paywalled and we have not read it. The title, date, analysts and vendor list below come from Gartner’s public abstract. Every placement comes from the vendors’ own announcements, and one of them, Level Access, reproduces Gartner’s graphic.'
      )
    ),

    h2('The report at a glance'),
    term('Title:', ' Magic Quadrant for Digital Accessibility, per Gartner’s abstract. Level Access’s announcement calls it the Magic Quadrant for Digital Accessibility Platforms.'),
    term('Published:', ' 5 October 2026, according to Gartner’s abstract page. Siteimprove’s footnote cites 6 October 2026; the other vendor citations we checked give 5 October.'),
    term('Analysts:', ' Brent Stewart, Nabeeha Ahmed, Paige Kirk and Sarah Baumunk.'),
    term('How many vendors:', ' 19, all listed in the abstract under the report’s Vendor Strengths and Cautions section.'),
    term('Gartner’s framing:', ' the summary describes the market moving from periodic compliance tools to continuous, AI-assisted accessibility assurance, shaped by agentic testing, intelligent remediation and adaptive experiences.'),
    term('Companion report:', ' accessiBe says it was also evaluated in a companion Gartner Critical Capabilities for Digital Accessibility report.'),
    term('Inclusion criteria:', ' the report has an Inclusion and Exclusion Criteria section, but it sits behind the paywall. We could not verify what a vendor had to meet to be included.'),

    h2('Who is in it'),
    p(
      span(
        'Gartner’s abstract names these 19 vendors, in alphabetical order: accessiBe, Accessiway, Acquia, Allyable, Allyant, AudioEye, BarrierBreak, BrowserStack, Deque Systems, Evinced, Eye-Able, inSuit, Level Access, Rezolve Ai, Silktide, Siteimprove, Stark, UsableNet and Vispero.'
      )
    ),
    p(
      span(
        'That is a broad mix. The list puts companies best known for developer testing tools alongside content governance platforms, design tooling, assistive technology, specialist services firms and on-site widgets. Gartner’s summary mentions adaptive experiences as one of the forces shaping the market, which helps explain why such different products share one chart.'
      )
    ),

    h3('Placements, as reported by the vendors'),
    p(
      span(
        'Level Access’s announcement includes the Magic Quadrant graphic with a text description of where every vendor sits. According to that description and the vendors’ own announcements:'
      )
    ),
    term('Leaders:', ' Level Access, Deque Systems and Siteimprove. Level Access says it was placed highest of all vendors for Ability to Execute; the same description puts Deque furthest right on Completeness of Vision.'),
    term('Challengers:', ' BrowserStack, Acquia, AudioEye and accessiBe. accessiBe confirmed its Challenger placement in a release on 15 October 2026.'),
    term('Visionaries:', ' Evinced and Stark.'),
    term('Niche Players:', ' inSuit, Vispero, Silktide and Rezolve Ai. inSuit’s website describes it as the only Spanish vendor in the report and links to an explanation of being a Niche Player.'),
    term('Near the middle of the chart:', ' the description places Accessiway, Allyant and Eye-Able close to the Leaders and Challengers boundary, and UsableNet, Allyable and BarrierBreak close to the Niche Players and Visionaries boundary, without stating the quadrant for each.'),
    p(
      span(
        'Deque announced its Leader placement on 9 October 2026, as did Siteimprove. Level Access followed on 16 October. Each announcement carries Gartner’s standard disclaimer that it does not endorse any vendor depicted in its research.'
      )
    ),

    h2('What a Magic Quadrant actually measures'),
    p(
      span(
        'A Magic Quadrant plots vendors on two axes. Gartner describes Ability to Execute as a vendor’s operational performance and delivery, and Completeness of Vision as its innovation and market strategy. It says the evaluation uses 15 weighted criteria across those two dimensions, including overall viability, customer experience, industry strategy and geographic strategy.'
      )
    ),
    p(
      span(
        'Gartner defines the four quadrants in those terms. Leaders execute well against their current vision and are well placed for the future. Challengers execute well today but show less grasp of market direction. Visionaries understand where the market is heading but do not yet execute as well. Niche Players focus successfully on a small segment, or are unfocused and do not outperform others.'
      )
    ),
    p(
      span(
        'Gartner itself warns against reading too much into the top right corner. Its methodology page says focusing on the Leaders quadrant is not always the best course, and that “a niche player may support your needs better than a market leader.” Its guide to the methodology tells readers to use a Magic Quadrant to narrow a shortlist, not to base a decision on it alone. Gartner also states that whether a vendor is a paying client does not affect its coverage decisions.'
      )
    ),

    h2('What it does not measure'),
    p(
      span(
        'None of that is a conformance test. A Magic Quadrant is an analyst’s judgement of a vendor’s business and strategy. It is not an audit of whether customers’ websites meet WCAG 2.2 Level AA after using the product, and placement is not certification. No Leader badge changes what a court, a regulator or a disabled user will find when they try to use your checkout.'
      )
    ),
    p(
      span(
        'This matters more in accessibility than in most software categories, because the products on this chart do very different things. A testing platform finds problems for your team to fix. A services firm tests manually and writes reports. A design plugin catches contrast and focus issues before code exists. An on-site script changes how a page behaves in the browser. A strong execution score tells you a vendor is well run and sells well. It does not tell you which of those jobs you need done, or whether the product does that job well enough for your site to conform.'
      )
    ),

    h2('The FTC order is a useful reminder'),
    p(
      span(
        'One vendor on the chart has a public enforcement record on exactly this point. In April 2025 the Federal Trade Commission voted 3 to 0 to approve a final consent order requiring accessiBe to pay $1 million. The FTC had alleged that accessiBe claimed its accessWidget product could make any website compliant with WCAG when it did not, and that it formatted third-party articles and reviews so they appeared to be independent opinions.'
      )
    ),
    p(
      span(
        'Section I of the order bars accessiBe from claiming that the product, including its artificial intelligence and other automated technology, can make any website WCAG compliant or keep it compliant automatically as content changes, unless the claim is not misleading and is backed by competent and reliable evidence. accessiBe neither admitted nor denied the allegations, which is standard in FTC consent orders, and the order runs for 20 years. accessiBe’s Gartner release does not mention the FTC, and nothing in the public record suggests Gartner’s placement reflects a view on the order either way.'
      )
    ),
    p(
      span(
        'The point is not to single out one vendor. It is that the gap between “a highly rated accessibility company” and “a product that makes your site conform” is real enough that a federal regulator has written it into an order. A buyer should keep those two ideas separate for every vendor on the chart.'
      )
    ),

    h2('Questions to ask any vendor, in any quadrant'),
    p(
      span(
        'Whichever vendors make your shortlist, these questions get you closer to the thing you are actually buying: an accessible product and evidence you can stand behind.'
      )
    ),
    term('How much of WCAG does your testing cover, and how?', ' Ask which success criteria are tested automatically, which are tested manually, and which are not tested at all. The W3C’s own evaluation methodology states that most accessibility checks cannot be fully automated, so a credible answer should include human testing with assistive technology.'),
    term('How do you choose what to test?', ' WCAG-EM 2.0, the W3C Group Note published on 23 July 2026, sets out a five-step method: define scope, explore the product, select a representative sample, evaluate it, and report. The sample should include common page types, essential functionality and complete processes such as checkout, plus a random sample of 10 percent on top of the structured set. Ask whether the vendor follows it, and if not, what they do instead.'),
    term('Who writes the ACR?', ' A completed VPAT is an Accessibility Conformance Report. ITI, which publishes the VPAT (the current edition is 2.5Rev, from April 2025), does not review or certify completed reports, and says the product owner is generally best placed to complete one. Ask who tested, who wrote the report, and what evidence sits behind each conformance level.'),
    term('Who fixes the code?', ' Finding issues is half the job. Ask whether the vendor fixes source code, gives your developers fixes they can apply, or changes the page at runtime. Each has a different cost, and only fixes in your own code stay fixed when the vendor relationship ends.'),
    term('What exactly do you claim?', ' Ask for the vendor’s conformance or compliance claims in writing, and the evidence for them. Be wary of any promise that a product makes a site compliant on its own.'),
    term('What happens when content changes?', ' Sites change weekly. Ask how regressions are caught, how often manual retesting happens, and whether monitoring covers authenticated pages and apps, not just public templates.'),
    term('Can we talk to customers like us?', ' A reference with a similar stack, size and legal exposure is worth more than a quadrant position.'),

    h2('Our view'),
    p(
      span(
        'A Gartner Magic Quadrant for accessibility is good news for the field. It signals that large buyers now treat accessibility as a category worth a formal procurement process, and it gives procurement teams a starting list. Being placed in it is an achievement for the vendors, and the Leaders earned the attention they are getting.'
      )
    ),
    p(
      span(
        'But a buyer should read it for what it is: an analyst’s view of which vendors are well run and well positioned. Use it to build a shortlist, then judge every vendor on the same evidence, from testing coverage and sampling to report authorship and who fixes the code. Conformance is earned in your own codebase, page by page, and it is measured by testing, not by a chart.'
      )
    ),
    p(
      span(
        'If you are building that evidence yourself, these will help:'
      )
    ),
    linkBullet('/guides/automated-vs-manual-accessibility-testing', 'l1', 'Understand what tools catch and what needs people in our guide to ', 'automated vs manual accessibility testing', '.'),
    linkBullet('/research/accessibility-testing-tools-benchmark', 'l2', 'See how automated engines compare on the same pages in our ', 'accessibility testing tools benchmark', '.'),
    linkBullet('/guides/vpat-accessibility-conformance-report', 'l3', 'Learn what a credible ACR contains in our ', 'VPAT and ACR guide', '.'),
    linkBullet('/sample-audit-report', 'l4', 'See what a manual audit deliverable looks like in our ', 'sample audit report', '.'),
    linkBullet('/guides/accessibility-overlays', 'l5', 'Read our ', 'guide to accessibility overlays', ' before buying any on-site widget.'),
    linkBullet('/checklists/wcag-2-2', 'l6', 'Work through every success criterion with the ', 'WCAG 2.2 checklist', '.'),
    linkBullet('/tools/url-accessibility-auditor', 'l7', 'Get a first automated pass on any page with the ', 'URL accessibility auditor', '.'),

    h2('Sources'),
    sourceLink('https://www.gartner.com/en/documents/8470345', 's1', 'Gartner: Magic Quadrant for Digital Accessibility, abstract (published 5 October 2026)'),
    sourceLink('https://www.gartner.com/en/research/methodologies/magic-quadrants-research', 's2', 'Gartner: Magic Quadrant research methodology'),
    sourceLink('https://www.gartner.com/en/research/magic-quadrant', 's3', 'Gartner: Gartner Magic Quadrant overview and FAQs'),
    sourceLink('https://www.gartner.com/en/documents/5292963', 's4', 'Gartner: How Markets and Vendors Are Evaluated in Gartner Magic Quadrants, abstract (19 March 2024)'),
    sourceLink('https://www.levelaccess.com/news/level-access-named-a-leader-in-the-2026-gartner-magic-quadrant-for-digital-accessibility-platforms/', 's5', 'Level Access: Level Access named a Leader in the 2026 Gartner Magic Quadrant for Digital Accessibility Platforms (16 October 2026)'),
    sourceLink('https://www.deque.com/?p=65129', 's6', 'Deque Systems: Deque named a Leader in the 2026 Gartner Magic Quadrant for Digital Accessibility (9 October 2026)'),
    sourceLink('https://www.siteimprove.com/press/siteimprove-named-a-leader-in-the-2026-gartner-magic-quadrant-for-digital-accessibility/', 's7', 'Siteimprove: Siteimprove named a Leader in the 2026 Gartner Magic Quadrant for Digital Accessibility (9 October 2026)'),
    sourceLink('https://www.prnewswire.com/il/news-releases/accessibe-recognized-in-the-inaugural-2026-gartner-magic-quadrant-for-digital-accessibility-302909740.html', 's8', 'accessiBe via PR Newswire: accessiBe recognized in the inaugural 2026 Gartner Magic Quadrant for Digital Accessibility (15 October 2026)'),
    sourceLink('https://insuit.net/?p=13301', 's9', 'inSuit: website banner on the first Gartner Magic Quadrant for Digital Accessibility'),
    sourceLink('https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million', 's10', 'US Federal Trade Commission: FTC approves final order requiring accessiBe to pay $1 million (22 April 2025)'),
    sourceLink('https://www.ftc.gov/system/files/ftc_gov/pdf/d-o.222_3156_-_accessibe_final_consent_package_without_signatures-2.pdf', 's11', 'US Federal Trade Commission: Decision and Order, In the Matter of accessiBe Inc., File No. 222-3156 (April 2025)'),
    sourceLink('https://www.w3.org/TR/WCAG-EM/', 's12', 'W3C: WCAG Evaluation Methodology (WCAG-EM) 2.0, W3C Group Note (23 July 2026)'),
    sourceLink('https://www.itic.org/policy/accessibility/vpat', 's13', 'Information Technology Industry Council: Voluntary Product Accessibility Template (VPAT)'),
  ],
}
