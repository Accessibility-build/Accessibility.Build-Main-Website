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

// Facts checked against: NPR/AP election coverage (4-5 Nov 2026), AP and NPR on Dhillon's
// resignation (5 Nov), DOJ releases (Uber 12 Sept 2025, Fashion Nova 2 Feb 2026, Lyft 9 Nov 2026),
// DOJ Uber case page (MTD denied 5 Mar 2026), Federal Register 2026-07663 (Title II extension),
// Seyfarth posts (9 Sept and 9 Nov 2026), UsableNet tracker (Oct 2026), Congress.gov bill records.
// Final House and Senate margins were still uncalled on 11 Nov, so the post gives none.
export default {
  slug: 'midterms-2026-ada-website-enforcement-outlook',
  authorId: 'author-accessibility-build-team',
  title: 'Democrats Won Congress and DOJ’s Civil Rights Chief Resigned. What Changes for ADA Website Risk?',
  excerpt:
    'The 2026 midterms flipped both chambers and Harmeet Dhillon left the Civil Rights Division two days later. Why that changes less about digital accessibility enforcement than headlines suggest, what happens to the pending web accessibility bills, and where the real risk sits in 2027.',
  publishedAt: '2026-11-11T11:00:00Z',
  categoryTitles: ['Legal & Compliance', 'Industry News'],
  seo: {
    metaTitle: 'Midterms and ADA Website Risk: What Actually Changes',
    metaDescription:
      'Democrats won Congress and DOJ’s civil rights chief resigned. Why ADA website lawsuits keep climbing, what happens to pending bills, and what to do before 2027.',
    keywords: [
      'ADA website enforcement 2027',
      'midterms ADA accessibility',
      'Harmeet Dhillon resigns',
      'DOJ Civil Rights Division ADA',
      'Online Accessibility Act H.R. 9539',
      'Websites and Software Applications Accessibility Act',
      'ADA notice and cure bill',
      'ADA website lawsuits 2026',
      'Title II web rule deadline 2027',
    ],
  },
  body: [
    p(
      span(
        'Two things happened in the first week of November 2026 that matter to anyone tracking digital accessibility law in the United States. On 3 November, Democrats won control of both the House and the Senate, according to an NPR analysis of Associated Press race calls. Two days later, on 5 November, Harmeet Dhillon resigned as Assistant Attorney General for Civil Rights after about 18 months running the Justice Department’s Civil Rights Division, which enforces the ADA. Jesus A. Osete, previously her principal deputy, is now Acting Assistant Attorney General.'
      )
    ),
    p(
      span(
        'It is tempting to read that as a turning point. For websites and apps, it mostly is not, at least not yet. Here is why, what does change, and what organisations should do with the next two years.'
      )
    ),
    p(
      span('Note: ', ['strong']),
      span(
        'as of 11 November some House and Senate races were still being counted, so we do not give final seat margins here.'
      )
    ),

    h2('Congress does not set DOJ’s enforcement priorities'),
    p(
      span(
        'The ADA is enforced by the executive branch, and the administration, not Congress, decides where DOJ points its lawyers. That is the core of a 9 November analysis by Minh Vu of Seyfarth Shaw, one of the most-watched ADA Title III defence practices. Its prediction: no new Title III regulations before the end of this administration in January 2029, and no sudden return to the more aggressive enforcement seen under past Democratic administrations.'
      )
    ),
    p(
      span(
        'A Democratic Congress can hold oversight hearings, shape the department’s budget and pass bills, but any bill still needs the President’s signature. None of that changes who opens investigations next month.'
      )
    ),

    h2('What DOJ has actually been doing'),
    p(
      span(
        'The Civil Rights Division under Dhillon shrank dramatically. AP reported that more than three quarters of its workforce left, and NPR put the number of career attorneys pushed out at around 300. Seyfarth notes that Disability Rights Section lawyers were among them. In March 2025 the department withdrew 11 ADA Title III guidance documents, covering topics such as parking, hotels and the maintenance of accessible features. None of them concerned websites or apps, and the department’s March 2022 web accessibility guidance is still published on ADA.gov.'
      )
    ),
    p(span('Disability enforcement did not stop, though. It narrowed. The notable digital and transportation actions:')),
    term('Uber (September 2025):', ' a pattern-or-practice suit alleging drivers refuse riders with service animals and stowable wheelchairs, seeking $125 million for riders. The court denied Uber’s motion to dismiss on 5 March 2026.'),
    term('Fashion Nova (February 2026):', ' a statement of interest opposing a website accessibility class settlement as too weak, noting among other things that the website for filing claims was itself not accessible.'),
    term('Title II web rule (April 2026):', ' an interim final rule pushing back the deadlines for state and local governments to make websites and apps meet WCAG 2.1 AA. Governments serving 50,000 people or more now have until 26 April 2027, and smaller governments and special districts until 26 April 2028. The National Federation of the Blind has challenged the extension in federal court.'),
    term('Lyft (9 November 2026):', ' filed four days after Dhillon left, seeking $53 million for riders refused because of service animals or wheelchairs.'),
    linkBullet('/blog/doj-sues-lyft-service-animals-wheelchairs-ada', 'l0', 'We read the full complaint in ', 'our breakdown of the Lyft lawsuit', '.'),
    p(
      span(
        'The pattern is consistent: large, visible cases against big platforms, alongside a lighter regulatory touch for everyone else. Nothing about the midterms changes that before 2029.'
      )
    ),

    h2('Private lawsuits never depended on DOJ'),
    p(
      span(
        'Most digital accessibility enforcement in the US happens through private lawsuits, and they are rising regardless of who controls Washington.'
      )
    ),
    plainBullet('Seyfarth counted 5,006 federal ADA Title III lawsuits in the first half of 2026, up 9% on the first half of 2025. That figure covers physical and digital claims together, and Seyfarth says the full year could pass 10,000.'),
    plainBullet('UsableNet’s tracker, which counts web and app cases specifically, recorded 431 new lawsuits in October 2026 alone. Of the businesses sued, 107 already had an accessibility widget installed.'),
    plainBullet('Filings are shifting toward state courts in some places. Seyfarth attributes the fall in New York federal filings to stricter standing rules there, not to fewer claims.'),
    p(
      span(
        'Plaintiffs in these cases are not waiting for DOJ guidance, and courts have been deciding website cases on the existing statute for years. A quieter Justice Department does not reduce that exposure at all.'
      )
    ),

    h2('What happens to the pending bills'),
    p(
      span(
        'The 119th Congress ends at noon on 3 January 2027. Any bill not enacted by then lapses and would have to be reintroduced. That covers every pending federal web accessibility bill:'
      )
    ),
    term('Online Accessibility Act (H.R. 9539):', ' introduced 30 June 2026 by Rep. Mark Alford (R-MO) with Rep. Lou Correa (D-CA). It would add a new ADA title for consumer-facing websites and apps, treat substantial compliance with WCAG 2.0 A and AA as compliance, and require notice, a 60-day wait and a DOJ complaint before anyone could sue.'),
    term('Websites and Software Applications Accessibility Act (H.R. 3417 and S. 3974):', ' the House bill from Rep. Pete Sessions (R-TX) and Rep. Steny Hoyer (D-MD), and a Senate version from Sen. Tammy Duckworth (D-IL). It would require DOJ and the EEOC to write binding web and app accessibility rules within two years and keeps a private right of action.'),
    term('ACCESS Act of 2026 (H.R. 8396):', ' Rep. Ken Calvert (R-CA), a notice-and-cure bill that would cover website and app barriers as well as physical ones.'),
    term('ADA 30 Days to Comply Act (H.R. 6453):', ' Rep. Mike Lawler (R-NY), notice-and-cure for physical barriers in existing buildings only. Despite how it is sometimes described, it does not cover websites.'),
    term('Accessible Voting Act of 2026 (H.R. 10700):', ' Rep. Mary Gay Scanlon (D-PA), introduced 1 October. It would require state election websites to meet at least WCAG 2.0 Level AA, or any successor guidelines, from 1 January 2027.'),
    p(
      span(
        'What changes in January is which of these ideas are likely to come back. Notice-and-cure has a difficult history: the ADA Education and Reform Act passed the House in 2018 and died in the Senate amid strong opposition from disability rights groups. Bills that set a clear technical standard while keeping private enforcement, like the Duckworth and Hoyer bill, may find a warmer reception in a Democratic Congress. Bills that add hurdles before a disabled person can sue will likely find a cooler one. Either way, any bill still needs a signature from a President who has not prioritised new ADA rules.'
      )
    ),

    h2('The real action is in the states'),
    p(
      span(
        'With federal rulemaking stalled, states are filling the gap, and they are moving in different directions:'
      )
    ),
    linkBullet('/blog/hawaii-act-257-digital-accessibility-rules', 'l1', 'Hawaii is drafting rules that would require private businesses to meet WCAG 2.1 AA, with a private right of action. ', 'Read our Hawaii Act 257 breakdown', '.'),
    linkBullet('/blog/colorado-ai-rules-wcag-2-2-accessible-disclosures', 'l2', 'Colorado’s draft AI rules name WCAG 2.2 for AI notices and chatbot communications. ', 'Read our Colorado analysis', '.'),
    linkBullet('/blog/missouri-sb-907-accessibility-litigation-safe-harbor', 'l3', 'Missouri went the other way, adding a cure period and penalties for abusive website suits. ', 'Read our Missouri SB 907 post', '.'),
    linkBullet('/research/accessibility-laws', 'l4', 'Track the full picture in our ', 'accessibility laws tracker', '.'),

    h2('The two-year risk nobody should ignore'),
    p(
      span(
        'Seyfarth makes one point worth repeating. Advocates inside and outside the department can spend the next two years collecting complaints and documenting patterns of non-compliance, ready for investigations that could begin if the administration changes in 2029. An inaccessible website is not a one-off event. It is a barrier that keeps existing, and every complaint filed about it now becomes part of a record.'
      )
    ),
    p(
      span('Its advice to businesses already under DOJ investigation is blunt: ', []),
      span('“Businesses with active DOJ investigations should consider resolving them sooner rather than later.”'),
      span(' A settlement negotiated now is likely to be less demanding than one negotiated in 2029.')
    ),

    h2('What to do now'),
    plainBullet('Do not mistake a quiet DOJ for a safe position. Private suits are at record levels and do not need federal action.'),
    plainBullet('If you are a state or local government, plan for 26 April 2027 or 26 April 2028 as real deadlines. The extension is being challenged in court, and could be shortened.'),
    plainBullet('Audit against WCAG 2.2 AA. It covers every 2.1 requirement and is what newer state rules, such as Colorado’s draft, are starting to name.'),
    plainBullet('Do not rely on an overlay. According to UsableNet, 107 of the businesses sued in October already had one installed.'),
    plainBullet('Fix how you handle accessibility complaints. A documented, responsive process is your best evidence of good faith, whoever is in charge.'),
    plainBullet('Watch for reintroduced bills in January 2027, and comment on state rulemakings where you operate.'),

    linkBullet('/compliance/deadlines', 'l9', 'Put every upcoming date in your calendar with our ', 'compliance deadlines calendar', '.'),
    linkBullet('/research/accessibility-lawsuits', 'l5', 'See the monthly numbers in our ', 'accessibility lawsuit tracker', '.'),
    linkBullet('/guides/doj-title-ii-deadline-extension', 'l6', 'Get the details of the government deadlines in our ', 'Title II deadline extension guide', '.'),
    linkBullet('/guides/ada-website-lawsuit-cost', 'l7', 'Understand the cost of a demand letter or lawsuit in our ', 'ADA website lawsuit cost guide', '.'),
    linkBullet('/checklists/wcag-2-2', 'l8', 'Start an audit with the ', 'WCAG 2.2 checklist', '.'),

    h2('Sources'),
    sourceLink('https://www.opb.org/article/2026/11/04/2026-midterms-democrats-win-the-senate/', 's1', 'NPR via OPB: Democrats win the Senate in the 2026 midterms (4 November 2026)'),
    sourceLink('https://www.wunc.org/2026-11-05/head-of-justice-department-office-on-civil-rights-resigns', 's2', 'NPR via WUNC: Head of Justice Department office on civil rights resigns (5 November 2026)'),
    sourceLink('https://abc7news.com/post/assistant-attorney-general-harmeet-dhillon-exits-radical-overhaul-justice-departments-civil-rights-division/20018222/', 's3', 'Associated Press via ABC7: Harmeet Dhillon exits after overhaul of the Civil Rights Division (5 November 2026)'),
    sourceLink('https://www.adatitleiii.com/2026/11/how-will-the-blue-tsunami-impact-dojs-ada-title-iii-enforcement/', 's4', 'Seyfarth Shaw, ADA Title III blog: How will the blue tsunami impact DOJ’s ADA Title III enforcement? (9 November 2026)'),
    sourceLink('https://www.adatitleiii.com/2026/09/2026-mid-year-report-ada-title-iii-federal-lawsuit-numbers-are-climbing/', 's5', 'Seyfarth Shaw, ADA Title III blog: 2026 mid-year report on federal lawsuit numbers (9 September 2026)'),
    sourceLink('https://info.usablenet.com/ada-website-compliance-lawsuit-tracker', 's6', 'UsableNet: ADA website compliance lawsuit tracker (October 2026 figures)'),
    sourceLink('https://www.justice.gov/opa/pr/justice-department-sues-uber-denying-rides-passengers-service-dogs-wheelchairs', 's7', 'US Department of Justice: Justice Department sues Uber (September 2025)'),
    sourceLink('https://www.justice.gov/crt/case/united-states-v-uber-technologies-inc-0', 's8', 'US Department of Justice: United States v. Uber Technologies case page (order denying motion to dismiss, 5 March 2026)'),
    sourceLink('https://www.justice.gov/opa/pr/department-justice-opposes-unfair-class-action-settlement-involving-accessibility-website', 's9', 'US Department of Justice: Department opposes class action settlement involving website accessibility (2 February 2026)'),
    sourceLink('https://www.justice.gov/opa/pr/justice-department-sues-lyft-denying-rides-passengers-service-dogs-wheelchairs', 's10', 'US Department of Justice: Justice Department sues Lyft (9 November 2026)'),
    sourceLink('https://www.federalregister.gov/documents/2026/04/20/2026-07663/', 's11', 'Federal Register: Extension of compliance dates for the ADA Title II web and mobile app rule (20 April 2026)'),
    sourceLink('https://www.ada.gov/resources/web-guidance/', 's15', 'ADA.gov: Guidance on Web Accessibility and the ADA (March 2022)'),
    sourceLink('https://www.congress.gov/bill/119th-congress/house-bill/9539', 's12', 'Congress.gov: H.R. 9539, Online Accessibility Act'),
    sourceLink('https://www.congress.gov/bill/119th-congress/house-bill/3417', 's13', 'Congress.gov: H.R. 3417, Websites and Software Applications Accessibility Act of 2025'),
    sourceLink('https://www.congress.gov/bill/119th-congress/house-bill/10700', 's14', 'Congress.gov: H.R. 10700, Accessible Voting Act of 2026'),
  ],
}
