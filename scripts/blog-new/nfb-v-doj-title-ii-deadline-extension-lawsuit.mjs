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

// Every factual claim below was checked against these primary sources (fetched 18 Nov 2026):
// - The CourtListener RECAP docket for NFB v. DOJ, No. 1:26-cv-02007 (D. Md.), entries 1 to 18
//   (judge, filing date, joint briefing schedule order of 29 June, NFB summary judgment motion of
//   28 Sept, government extension motion of 12 Nov, order granting it of 13 Nov). The new response
//   date is not shown in the public docket text, so it is not stated.
// - The filed complaint (Doc. 1, 21 May 2026), hosted by plaintiff's counsel Brown Goldstein & Levy:
//   counts I to III, paragraphs 3, 70 to 80, 86 to 87, 93 to 100, 132 to 149 and the prayer for relief.
// - The DOJ IFR, 91 FR 20902 (20 Apr 2026), section V.A (good cause) and section IV (severability),
//   plus the "future rulemaking" passage; text read from govinfo.
// - The HHS IFR, 91 FR 25496 (published 11 May 2026, effective 7 May 2026), section V.A (553(a)(2)
//   and good cause, Richardson Waiver footnote), severability, and the "other obligations" passage.
// - 5 U.S.C. 553 and 706 (Cornell LII).
// - Federal Register API search: no later DOJ or HHS document changing these dates found as of 18 Nov 2026.
// The explanation of vacatur, remand without vacatur and timing is general administrative-law
// background and our own reading, labelled as such in the text. Not legal advice.
export default {
  slug: 'nfb-v-doj-title-ii-deadline-extension-lawsuit',
  authorId: 'author-accessibility-build-team',
  title: 'NFB v. DOJ: Could a Court Restore the Original Title II and Section 504 Web Deadlines?',
  excerpt:
    'The National Federation of the Blind is asking a Maryland federal court to throw out the one-year extensions DOJ and HHS gave to the Title II and Section 504 web accessibility deadlines. We read the docket, the complaint and both interim final rules: what “good cause” means, what vacatur would do to dates that have already passed, and why you should not plan around the extension.',
  publishedAt: '2026-11-18T04:25:00Z',
  categoryTitles: ['Legal & Compliance'],
  seo: {
    metaTitle: 'NFB v. DOJ: Can a Court Undo the Title II Extension?',
    metaDescription:
      'NFB is suing DOJ and HHS to vacate the one-year Title II and Section 504 web deadline extensions. Where the case stands, what vacatur means, what to do now.',
    keywords: [
      'NFB v. DOJ',
      'National Federation of the Blind lawsuit',
      'Title II web rule extension lawsuit',
      'Section 504 deadline extension lawsuit',
      'interim final rule good cause',
      'APA notice and comment',
      'ADA Title II compliance date',
      'vacatur interim final rule',
      'WCAG 2.1 AA deadline',
    ],
  },
  body: [
    p(
      span(
        'In April and May 2026 the Justice Department and the Department of Health and Human Services each pushed their web and mobile accessibility deadlines back by a year. They did it with interim final rules that took effect immediately, with no chance for the public to comment first. On 21 May 2026 the National Federation of the Blind (NFB) sued both agencies in the federal court for the District of Maryland, asking the judge to set those extensions aside.'
      )
    ),
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'g1', _type: 'link', href: '/guides/doj-title-ii-deadline-extension' },
        { _key: 'g2', _type: 'link', href: '/guides/section-504-web-accessibility-deadline' },
      ],
      children: [
      span(
        'If NFB wins, the original 2024 compliance dates could come back. For the largest public entities and HHS funding recipients, those dates have already passed. We have covered what the extensions changed in our guides to the '
      ),
      span('Title II extension', ['g1']),
      span(' and the '),
      span('Section 504 extension', ['g2']),
      span(
        '. This post is about the lawsuit: where it stands on the docket, the legal question at its centre, what each possible outcome would mean, and how to plan while it is pending.'
      ),
      ],
    },
    p(
      span('A note before the detail: ', ['strong']),
      span(
        'the court has not ruled on anything substantive. What follows describes the parties’ filings and our reading of how cases like this usually go. It is not legal advice.'
      )
    ),

    h2('The case at a glance'),
    term('Case:', ' National Federation of the Blind v. Department of Justice, No. 1:26-cv-02007, US District Court for the District of Maryland, filed 21 May 2026 and assigned to Judge Richard D. Bennett.'),
    term('Defendants:', ' the Department of Justice and the Acting Attorney General, and the Department of Health and Human Services and its Secretary, all in their official capacities.'),
    term('What is challenged:', ' the DOJ interim final rule at 91 FR 20902 (20 April 2026) under ADA Title II, and the HHS interim final rule at 91 FR 25496 (published 11 May 2026, effective 7 May 2026) under Section 504 of the Rehabilitation Act.'),
    term('Claims:', ' three counts under the Administrative Procedure Act (APA): both rules skipped required notice and comment, and each rule is arbitrary and capricious.'),
    term('What NFB wants:', ' an order holding the rules unlawful and vacating or setting them aside, a declaration that they violate the APA, and attorney’s fees.'),
    term('Counsel for NFB:', ' Democracy Forward Foundation and Brown, Goldstein & Levy.'),
    term('Status:', ' NFB moved for summary judgment on 28 September 2026. On 13 November the court granted the government more time to respond. No ruling yet.'),

    h2('What the two rules did'),
    p(
      span(
        'Both rules leave the technical standard (WCAG 2.1 Level AA) alone and move only the dates. DOJ moved the date for state and local governments serving 50,000 or more people from 24 April 2026 to 26 April 2027, and the date for smaller entities and special district governments from 26 April 2027 to 26 April 2028. HHS moved the date for recipients with 15 or more employees from 11 May 2026 to 11 May 2027, and for smaller recipients from 10 May 2027 to 10 May 2028.'
      )
    ),
    p(
      span(
        'The timing is the heart of the case. The DOJ rule appeared four days before the first deadline. The HHS rule took effect four days before its first deadline and was published in the Federal Register on the deadline itself. Both rules opened a 60-day comment period after the fact, which closed on 22 June 2026 for DOJ and 6 July 2026 for HHS.'
      )
    ),

    h2('What “good cause” means'),
    p(
      span(
        'Normally, when a federal agency writes or changes a binding rule, the APA makes it publish a proposal, take public comments and respond to them before the rule takes effect. Section 553(b)(B) has an escape hatch. An agency can skip that process when it finds, for good cause, that notice and comment would be impracticable, unnecessary, or contrary to the public interest, and it must put that finding and its reasons in the rule.'
      )
    ),
    p(
      span(
        'In plain terms: impracticable usually means there is genuinely no time, as in an emergency. Unnecessary usually means the change is minor or technical and nobody would have anything useful to say. Contrary to the public interest usually means that announcing the rule in advance would itself defeat its purpose. Courts generally treat the exception as narrow, and an agency that created its own deadline crunch can have trouble relying on it.'
      )
    ),

    h3('What DOJ said'),
    p(
      span(
        'DOJ gave several reasons. It said the longer timeline it was adopting had already been considered as an alternative in the 2023 proposed rule, so a new round of comment was unnecessary. It said the first deadline was days away, that it had overestimated how far accessibility technology had advanced, and that public entities had reported resource and staffing limits. Because the ADA lets private individuals sue, DOJ argued it could not simply announce that it would not enforce the rule, so the only way to delay the consequences was to skip comment beforehand. It added that the rule relieves a restriction rather than imposing one. Its formal finding was that prior notice and comment would be impracticable and contrary to the public interest.'
      )
    ),
    h3('What HHS said'),
    p(
      span(
        'HHS used much the same reasoning, with two additions. It said it did not need notice and comment at all under section 553(a)(2), which exempts rules relating to grants, loans, benefits or contracts, because Section 504 obligations attach to federal financial assistance. HHS acknowledged that a 1971 department policy (the “Richardson Waiver”) had given up that exemption, but said the policy was rescinded in March 2025. It also said it needed to stay in step with DOJ, since the two 2024 rules were written to match.'
      )
    ),

    h2('What NFB argues'),
    p(span('The complaint attacks both the procedure and the reasoning. Its main points:')),
    term('The “new information” was not new.', ' NFB says the letters DOJ relied on were sent to the Office of Management and Budget in May 2025, nearly a year before the rule, and raised the same cost and burden concerns DOJ had already weighed in 2024. If the agency had the material that long, NFB argues, it had time to run a normal comment process.'),
    term('The HHS exemption does not apply.', ' NFB says HHS bound itself to notice and comment through the 1971 policy and that rescinding it was itself arbitrary and capricious.'),
    term('Harm to disabled people was brushed aside.', ' The complaint says neither agency meaningfully weighed the cost of another year of inaccessible voting, benefits, health and education services.'),
    term('Alternatives were ignored.', ' NFB says the agencies could have limited the extension to entities actually unable to comply, or run full notice and comment on the later small-entity dates, which were a year or more away.'),

    h2('Where the case stands on the docket'),
    p(span('These are the substantive entries visible on the public docket as of 18 November 2026:')),
    plainBullet('21 May 2026: complaint filed.'),
    plainBullet('15 June 2026: the defendants were served.'),
    plainBullet('26 June 2026: the parties filed a joint motion for a briefing schedule, granted by Judge Bennett on 29 June. Challenges to agency rules are usually decided this way, on written briefs and the administrative record rather than at trial.'),
    plainBullet('28 September 2026: NFB moved for summary judgment, with declarations from NFB President Mark Riccobono and four other declarants, and separate appendices for DOJ and HHS.'),
    plainBullet('12 November 2026: the government moved for more time to file its response. The court granted the motion on 13 November.'),
    p(
      span(
        'The new due date is not shown in the docket text, and the underlying order is not publicly posted, so we do not know it. The docket also shows no motion for a preliminary injunction. NFB chose to go straight to a decision on the merits rather than asking for emergency relief, which means the extended dates stay in force while the case is briefed.'
      )
    ),

    h2('What a ruling could do'),
    p(
      span(
        'What follows is our reading of the realistic outcomes. Nothing here predicts how this judge will rule.'
      )
    ),
    h3('1. The court vacates the rules'),
    p(
      span(
        'Vacatur means the court wipes the interim rules off the books, as if they had never been issued. The 2024 dates would then apply again. That produces an odd result: for large state and local governments the deadline would be 24 April 2026, and for HHS recipients with 15 or more employees it would be 11 May 2026. Both dates are already in the past, so those organisations would be expected to conform immediately. Smaller public entities would return to 26 April 2027 and smaller HHS recipients to 10 May 2027, a year earlier than they now expect.'
      )
    ),
    p(
      span(
        'Vacatur need not be all or nothing. Both rules say each extension is severable, so a court could, for example, set aside the extension for large entities and leave the small-entity one in place, or rule differently on the DOJ and HHS rules. HHS also has a second defence (the grants exemption) that DOJ does not, so the two rules could come out differently.'
      )
    ),
    h3('2. Remand without vacatur'),
    p(
      span(
        'A court that finds a rule flawed can send it back to the agency to fix while leaving it in effect. Judges tend to choose this when wiping a rule out at once would be disruptive, and a sudden return to deadlines that have already passed could be seen that way, which makes this a plausible middle path. If it happened, the extended dates would survive for now and the agency would have to explain itself better or run proper rulemaking.'
      )
    ),
    h3('3. The rules are upheld'),
    p(
      span(
        'If the court accepts the agencies’ good-cause findings and their reasoning, the extended dates stand: 26 April 2027 and 26 April 2028 under Title II, and 11 May 2027 and 10 May 2028 under Section 504.'
      )
    ),
    h3('Other things that could change the picture'),
    plainBullet('Appeal. Whoever loses can appeal to the Fourth Circuit and may ask for the ruling to be paused while the appeal runs.'),
    plainBullet('Later agency action. Both comment periods have closed. If an agency issued a final rule after considering those comments, the government might argue that the procedural complaint has been cured. We found no such document in the Federal Register as of 18 November 2026.'),
    plainBullet('More changes from the agencies. Both rules say the agencies will consider proposing changes to the substance of the 2024 rules during the extension, and both leave the door open to further delays.'),

    h2('Realistic timing'),
    p(
      span(
        'With the government’s response now extended, NFB will normally get a reply, and the government may file its own cross-motion. A decision after that could take weeks or months. Our own estimate is that a ruling before the end of 2026 is unlikely, and that an appeal could stretch the final answer well into 2027, close to or past the extended large-entity deadline of 26 April 2027. Nobody should plan on knowing the outcome soon.'
      )
    ),

    h2('What to do while the case is pending'),
    p(
      span(
        'The practical answer is the same whichever way the case goes: do not plan around the extension. Keep working to the original timeline.'
      )
    ),
    term('Vacatur could make you late overnight.', ' If the court restores the 2024 dates, large entities would be past their deadline the day the order issues. The organisations best placed for that outcome are the ones that never slowed down.'),
    term('Your underlying duty never moved.', ' Both rules say that, whatever the compliance date, covered entities still have to make their programs accessible under Title II or Section 504. HHS gives the example of the duty to make reasonable modifications. Complaints and lawsuits do not wait for a compliance date.'),
    term('Document as you go.', ' A dated audit, a remediation plan and evidence of fixes are useful under every outcome, from a sudden deadline to a complaint.'),
    p(span('Our resources can help with that work:')),
    linkBullet('/compliance/deadlines', 'l1', 'Check every date in one place on our ', 'accessibility compliance deadlines page', ', which we update as the case moves.'),
    linkBullet('/checklists/wcag-2-2', 'l2', 'Work through the ', 'WCAG 2.2 checklist', ', which covers every WCAG 2.1 AA criterion plus the newer ones.'),
    linkBullet('/tools/url-accessibility-auditor', 'l3', 'Get a quick baseline with the ', 'URL accessibility auditor', '.'),
    linkBullet('/templates/title-ii-compliance-kit', 'l4', 'Public entities can organise the work with our ', 'Title II compliance kit', '.'),
    linkBullet('/compliance/ada', 'l5', 'See how the ADA applies to digital services on our ', 'ADA compliance page', '.'),
    linkBullet('/reference/ada-website-case-law', 'l6', 'Read the decisions that shaped digital ADA coverage in our ', 'ADA website case law reference', '.'),

    h2('Sources'),
    sourceLink('https://www.courtlistener.com/docket/73378158/national-federation-of-the-blind-v-department-of-justice/', 's1', 'CourtListener (RECAP): National Federation of the Blind v. Department of Justice, No. 1:26-cv-02007 (D. Md.), docket entries 1 to 18 (viewed 18 November 2026)'),
    sourceLink('https://browngold.com/wp-content/uploads/2026/05/NFB-v.-DOJ_5-21-2026.pdf', 's2', 'Brown, Goldstein & Levy: Complaint, National Federation of the Blind v. Department of Justice (D. Md., filed 21 May 2026)'),
    sourceLink('https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm', 's3', 'Federal Register (govinfo): DOJ interim final rule, Extension of Compliance Dates, Accessibility of Web Information and Services of State and Local Government Entities, 91 FR 20902 (20 April 2026)'),
    sourceLink('https://www.govinfo.gov/content/pkg/FR-2026-05-11/html/2026-09266.htm', 's4', 'Federal Register (govinfo): HHS interim final rule, Extension of Compliance Dates, Accessibility of Web Content and Mobile Applications of Recipients of Departmental Financial Assistance, 91 FR 25496 (11 May 2026)'),
    sourceLink('https://www.law.cornell.edu/uscode/text/5/553', 's5', 'Cornell Legal Information Institute: 5 U.S.C. 553, Rule making'),
    sourceLink('https://www.law.cornell.edu/uscode/text/5/706', 's6', 'Cornell Legal Information Institute: 5 U.S.C. 706, Scope of review'),
  ],
}
