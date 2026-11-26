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

// Every factual claim below was checked against these primary sources, read in full:
// - Wilson v. Family Footwear Center, Inc., No. 1:26-cv-03466 (N.D. Ill.), Memorandum Opinion and
//   Order, ECF No. 19 (Kendall, C.J., 23 Oct 2026), via the CourtListener RECAP archive, plus the
//   RECAP docket (last updated 30 Oct 2026; no filing after ECF 19 shown). Filing date, motion date
//   (ECF 15, 20 Aug 2026), facial and factual challenge, AudioEye subscription since Dec 2021,
//   accessibility statement, help desk, feedback channel, discontinued shoes, two declarations,
//   Wayback Machine remark, discovery denial and 21 days to replead all come from the opinion.
// - Jones v. Moscot.com, LLC, No. 25-cv-1843 (S.D.N.Y.), Opinion and Order, ECF No. 17 (Oetken, J.,
//   5 Mar 2026): standing found adequately alleged, case dismissed as moot on the unrebutted Level
//   Access declaration, NYCHRL claim dismissed without prejudice to refiling in state court.
// - Acheson Hotels, LLC v. Laufer, 601 U.S. 1 (5 Dec 2023), slip opinion from supremecourt.gov:
//   split (CA2, CA5, CA10 no standing; CA1, CA4, CA11 standing), vacated as moot under Munsingwear,
//   Thomas would find no standing, Jackson objected to vacatur, the $10,000 fee finding and the
//   footnote that the Fourth Circuit vacated the suspension order. Thomas concurrence for the
//   point that private Title III plaintiffs get only injunctive relief and fees.
// - Harty v. West Point Realty, Inc., 28 F.4th 435 (2d Cir. 18 Mar 2022), slip opinion via govinfo.
// - Calcano v. Swarovski N. Am. Ltd., 36 F.4th 68 (2d Cir. 2 June 2022), full text (NYU Law copy):
//   braille gift cards, 81 of over 200 near-identical complaints, 26 differing words of about 6,300,
//   supplemental jurisdiction over state and local claims declined.
// - 42 U.S.C. 12188 (Cornell LII): Attorney General suits, damages and civil penalties.
// - Cal. Civ. Code 51(f) and 52(a) (leginfo.legislature.ca.gov): ADA violation is an Unruh violation;
//   $4,000 minimum per offense plus fees.
// Leads only (not relied on for any fact): adaquickscan.com and settlementinsight.com write-ups of Wilson.
export default {
  slug: 'ada-website-lawsuits-dismissed-standing-2026',
  authorId: 'author-accessibility-build-team',
  title: 'Website ADA Suits Keep Failing on Standing. That Does Not Make Your Site Accessible.',
  excerpt:
    'A Chicago federal judge threw out a website accessibility suit against a shoe retailer in October 2026 because the blind plaintiff offered no evidence of standing. We read the opinion and the appellate cases behind it. Here is what standing means, why these wins are narrower than they look, and why the defendants who win tend to be the ones who had already fixed their sites.',
  publishedAt: '2026-11-18T04:20:00Z',
  categoryTitles: ['Legal & Compliance'],
  seo: {
    metaTitle: 'ADA Website Suits Dismissed for Standing: What It Means',
    metaDescription:
      'Courts keep dismissing website ADA suits for lack of standing, without prejudice. What Wilson, Harty and Acheson decided, and why to fix your site anyway.',
    keywords: [
      'ADA website lawsuit standing',
      'Wilson v. Family Footwear',
      'ADA tester standing',
      'Acheson Hotels v. Laufer',
      'Harty v. West Point Realty',
      'Calcano v. Swarovski',
      'website accessibility lawsuit dismissed',
      'factual challenge standing declaration',
      'Unruh Act website accessibility',
      'ADA Title III mootness website',
    ],
  },
  body: [
    p(
      span(
        'On 23 October 2026 a federal judge in Chicago dismissed a website accessibility lawsuit against Family Footwear Center, Inc. The plaintiff, a blind man named Howard Wilson, said he could not buy a pair of shoes on the retailer’s website with his screen reader. The court did not decide whether that was true. It decided that Wilson had not proved he had standing to sue, because the retailer put sworn evidence in front of the court and Wilson put in none.'
      )
    ),
    p(
      span(
        'Decisions like this get passed around as proof that ADA website suits are beatable. Some are. But read the opinions and a more useful pattern appears: the defendants who win early tend to be the ones who had already done the accessibility work and could prove it. A standing dismissal is not a finding that a website is accessible, it usually leaves the door open for the same plaintiff or a new one, and it does nothing about state law or the Justice Department.'
      )
    ),
    p(
      span('A note before the detail: ', ['strong']),
      span(
        'this is an explanation of published court decisions, not legal advice. If you have been sued, talk to a lawyer licensed where the case was filed.'
      )
    ),

    h2('Standing at a glance'),
    term('Article III standing:', ' federal courts can only hear real cases. A plaintiff must show an injury in fact that is concrete, particularized and actual or imminent, that the defendant caused it, and that a court order would fix it.'),
    term('Intent to return:', ' private ADA Title III plaintiffs can only get an injunction (plus attorney’s fees), so they must show a real likelihood of being harmed again. Courts look at past visits, a specific reason for wanting the product, and concrete plans to come back.'),
    term('Tester:', ' someone who visits businesses to check whether they comply with the law. Testers can have standing, but only if they show a real injury of their own.'),
    term('Facial challenge:', ' the defendant argues the complaint, read as true, does not allege standing. The court looks only at the complaint.'),
    term('Factual challenge:', ' the defendant submits evidence, usually sworn declarations, disputing the facts behind standing. The plaintiff must then answer with evidence of their own.'),
    term('Without prejudice:', ' the case is dismissed but not decided on the merits, so it can be refiled. A dismissal for lack of standing is always without prejudice.'),
    term('Mootness:', ' a different defence. The case ends because there is nothing left for a court to order, for example because the defendant has fixed the problem and shown it will stay fixed.'),

    h2('Wilson v. Family Footwear: the plaintiff brought no evidence'),
    p(
      span(
        'Wilson filed his complaint on 30 March 2026 in the Northern District of Illinois. He said he had tried to use the Family Footwear website several times and that barriers stopped him from buying a particular pair of shoes. In August the retailer moved to dismiss, challenging standing both on the face of the complaint and on the facts.'
      )
    ),
    p(
      span(
        'Chief Judge Virginia M. Kendall found that the complaint only just survived the facial challenge. Wilson had not described any concrete plan to return to the site, but he did say he would come back if it were made accessible, and the Seventh Circuit treats that kind of conditional statement as enough at the pleading stage. In the judge’s words, the complaint “ekes by.”'
      )
    ),
    p(
      span(
        'Then came the evidence. Family Footwear filed two sworn declarations and exhibits. It pointed to its accessibility monitoring, its accessibility statement, a help desk and a feedback channel, and to receipts showing it had paid for an AudioEye subscription since December 2021. Its internet manager swore that the company maintained monitoring, testing, audits and remediation during the relevant period. He also said the website had stayed materially the same throughout, and that the purchase path is the same for every shoe. A second declarant described testing the site’s purchase path in August 2026. The retailer added that the shoes Wilson wanted had been discontinued.'
      )
    ),
    p(
      span(
        'Wilson did not file a declaration of his own, or any other evidence. His lawyers attacked the retailer’s evidence instead (one declarant was married to defence counsel, the statement’s timestamp postdated the lawsuit, the testing missed some alleged barriers), and the court rejected each point. On the timestamp, the judge noted that Wilson could have checked the Wayback Machine and did not. Attorney argument is not evidence, and once standing is challenged on the facts, the plaintiff must prove it by a preponderance of the evidence.'
      )
    ),
    p(
      span(
        'The court dismissed the case without prejudice, refused Wilson’s request for jurisdictional discovery, and gave him 21 days to file an amended complaint if he could cure the problems consistently with his obligations under Rule 11. The public RECAP docket, last updated on 30 October, shows no filing after the opinion, but that archive can lag behind the court’s own records.'
      )
    ),
    p(
      span(
        'Notice what actually won this motion. It was not a clever legal argument. It was years of receipts for an accessibility service, a published accessibility statement, a working feedback route and a witness willing to swear that the site had not changed. Be clear about what the court did not decide, though. It made no finding that the site was accessible, and paying for a monitoring or widget service is not evidence of conformance on its own. The ruling was about Wilson’s failure to prove his own injury, nothing more.'
      )
    ),

    h2('The appellate cases behind it'),
    h3('Harty v. West Point Realty (2d Cir. 2022)'),
    p(
      span(
        'Owen Harty, a wheelchair user, described himself as a tester. He visited a hotel’s booking website to check whether it described its accessible rooms, as the ADA regulations require, and sued when it did not. The Second Circuit affirmed dismissal. He had no plans to travel to the area, so the missing information did not harm him. A vague intention to use the site at some point in the near future was not imminent enough. An informational injury needs consequences beyond the lawsuit itself. And while the court said plainly that “testers can have standing,” calling yourself one does not replace an actual injury.'
      )
    ),
    p(
      span(
        'Harty also explains two procedural points that matter in every case like this. On a facial challenge, the court may ignore an affidavit the plaintiff files to shore up the complaint. And a dismissal for lack of standing is, by definition, without prejudice, because a court that lacks jurisdiction has no power to decide the merits.'
      )
    ),
    h3('Calcano v. Swarovski (2d Cir. 2022)'),
    p(
      span(
        'Calcano is not a website case. Blind plaintiffs sued retailers for not selling braille gift cards. But New York courts routinely apply it in website cases (the Moscot opinion below is one example), because it set the bar for pleading an intent to return. The four plaintiffs before the court had filed 81 of more than 200 near-identical complaints in late 2019; one complaint of about 6,300 words differed from another by only 26 words, typos included. The court called them “Mad-Libs-style complaints” and held that boilerplate claims of past visits and nearby homes did not plausibly show standing. It also upheld the trial court’s decision not to hear the state and city law claims, which matters below.'
      )
    ),
    h3('Acheson Hotels v. Laufer (US Supreme Court, 2023)'),
    p(
      span(
        'The Supreme Court agreed to decide whether a tester like Deborah Laufer, who had sued hundreds of hotels over booking websites without any plan to stay at them, has standing. The circuits were split: the Second, Fifth and Tenth said no; the First, Fourth and Eleventh said yes. Then a federal court suspended her lawyer, finding among other things that he demanded $10,000 in fees per case using boilerplate complaints. (The Fourth Circuit later vacated that suspension on notice grounds, and disciplinary proceedings continued.) Laufer dismissed her cases, and on 5 December 2023 the Court vacated the First Circuit’s judgment as moot.'
      )
    ),
    p(
      span(
        'So Acheson decided nothing about tester standing. Justice Thomas wrote separately to say he would have held that Laufer lacked standing; Justice Jackson objected to wiping out the lower court’s judgment. The majority left the split in place and warned that it “might exercise our discretion differently in a future case.” Whether a tester has standing still depends on which circuit you are sued in.'
      )
    ),

    h2('A contrast: Jones v. Moscot.com, where the defendant lost on standing and won anyway'),
    p(
      span(
        'In March 2026 Judge J. Paul Oetken of the Southern District of New York dismissed a blind plaintiff’s suit against the eyewear retailer Moscot. This one is often listed as a standing win. It was not. The court held that Jones had adequately alleged standing: he gave a specific date, a specific pair of sunglasses, specific reasons for wanting them, and specific barriers. That is the difference from Calcano.'
      )
    ),
    p(
      span(
        'Moscot won on mootness instead. Its director of e-commerce declared that the company had worked with Level Access since May 2023, that after the lawsuit Level Access had checked each alleged barrier and found nothing stopping a screen reader user from buying the sunglasses, and that the one low-severity issue it did find had been fixed. Defendants normally face a formidable burden to show a problem will not come back, but Jones offered no evidence in reply, and the court found the burden met. In short, the defendant won because its website had been made accessible, and it could prove it.'
      )
    ),

    h2('Why a standing win is narrower than it looks'),
    h3('It is without prejudice'),
    p(
      span(
        'A standing dismissal says this plaintiff has not shown this court that it has jurisdiction. It does not say the website is accessible. The plaintiff can replead with better facts, as Wilson was invited to do, or a different plaintiff with a stronger story can sue over the same barriers. Nothing in the Wilson opinion stops that.'
      )
    ),
    h3('State-law claims go back to state court'),
    p(
      span(
        'Article III limits only federal courts. Website complaints in New York often add claims under state or New York City human rights law, and once the federal ADA claim is dismissed, federal judges usually decline to hear the rest. In Moscot, the city law claim was dismissed expressly without prejudice to refiling in state court; in Calcano, the Second Circuit upheld the same choice. California’s Unruh Civil Rights Act goes further: any violation of the ADA is also an Unruh violation, with damages of at least $4,000 for each offence plus attorney’s fees. A defence that only works in federal court leaves that exposure untouched.'
      )
    ),
    h3('The Justice Department does not need standing of this kind'),
    p(
      span(
        'Under 42 U.S.C. 12188(b), the Attorney General can sue over a pattern or practice of discrimination, or over discrimination that raises an issue of general public importance, and can seek damages for people harmed and civil penalties. Private plaintiffs get only an injunction and fees. The intent-to-return question that sinks so many private suits is simply not part of a government enforcement action.'
      )
    ),

    h2('The cost math'),
    p(
      span(
        'Winning on standing is not cheap. Family Footwear needed a lawyer, a motion, two declarations, exhibits and almost seven months from complaint to dismissal, and it still faces a possible amended complaint. Every new plaintiff restarts that clock. Remediation is paid once and then maintained, and it is the only spending that also lowers the risk of the next lawsuit, the state-court claim and the customer who simply leaves.'
      )
    ),
    p(
      span(
        'In both 2026 opinions, the evidence that won was evidence of accessibility work. The same work that makes a site usable is what makes a defence possible.'
      )
    ),

    h2('Practical takeaways for site owners'),
    term('Keep dated records.', ' Contracts, invoices, audit reports, issue trackers and release notes, with dates. In Wilson and Moscot, records from before the lawsuit carried real weight.'),
    term('Remediate anyway.', ' Fix the barriers a complaint names, and the ones an audit finds, whether or not you think the plaintiff has standing. Moscot shows that a proven fix can end a case that standing arguments could not.'),
    term('Publish an accessibility statement with a working contact route.', ' Say what standard you aim for, what you know is not yet fixed, and how someone who hits a barrier can reach a person. Then answer the messages.'),
    term('Do not treat an early win as a clean bill of health.', ' A dismissal without prejudice is a pause. Use it to fix the site before the next complaint arrives.'),
    p(span('These resources can help with the parts that are in your control:')),
    linkBullet('/tools/url-accessibility-auditor', 'l1', 'Run a first pass on your key pages with the ', 'URL accessibility auditor', '.'),
    linkBullet('/sample-audit-report', 'l2', 'See what a documented, dated audit looks like in our ', 'sample audit report', '.'),
    linkBullet('/tools/accessibility-statement-generator', 'l3', 'Draft a statement with a real contact route using the ', 'accessibility statement generator', '.'),
    linkBullet('/reference/ada-website-case-law', 'l4', 'Check where your circuit stands on whether the ADA covers websites in our ', 'ADA website case law reference', '.'),
    linkBullet('/research/accessibility-lawsuits', 'l5', 'Follow filing trends in the ', 'accessibility lawsuit tracker', '.'),
    linkBullet('/cases/gil-v-winn-dixie', 'l6', 'For another case that ended on mootness rather than the merits, read our study of ', 'Gil v. Winn-Dixie', '.'),
    linkBullet('/compliance/ada', 'l7', 'For the bigger picture, see our ', 'ADA compliance page', '.'),

    h2('Sources'),
    sourceLink('https://www.courtlistener.com/docket/73110783/19/wilson-v-family-footwear-center-inc/', 's1', 'US District Court, N.D. Illinois (via CourtListener RECAP): Wilson v. Family Footwear Center, Inc., No. 1:26-cv-03466, Memorandum Opinion and Order, ECF No. 19 (23 October 2026)'),
    sourceLink('https://www.courtlistener.com/docket/73110783/wilson-v-family-footwear-center-inc/', 's2', 'CourtListener: Wilson v. Family Footwear Center, Inc., docket, No. 1:26-cv-03466 (N.D. Ill.)'),
    sourceLink('https://www.adatitleiii.com/wp-content/uploads/sites/25/2026/04/Jones-v.-Moscot.com-Dkt-17-MTD-Granted.pdf', 's3', 'US District Court, S.D.N.Y.: Jones v. Moscot.com, LLC, No. 25-cv-1843, Opinion and Order, ECF No. 17 (5 March 2026)'),
    sourceLink('https://www.supremecourt.gov/opinions/23pdf/22-429_h315.pdf', 's4', 'Supreme Court of the United States: Acheson Hotels, LLC v. Laufer, No. 22-429 (5 December 2023)'),
    sourceLink('https://govinfo.gov/content/pkg/USCOURTS-ca2-20-02672/pdf/USCOURTS-ca2-20-02672-0.pdf', 's5', 'US Court of Appeals for the Second Circuit: Harty v. West Point Realty, Inc., No. 20-2672 (18 March 2022)'),
    sourceLink('https://www.law.nyu.edu/sites/default/files/Calcano%20v%20Swarovski%20North%20America%20Limited.pdf', 's6', 'US Court of Appeals for the Second Circuit: Calcano v. Swarovski North America Ltd., 36 F.4th 68 (2 June 2022)'),
    sourceLink('https://www.law.cornell.edu/uscode/text/42/12188', 's7', 'Legal Information Institute: 42 U.S.C. 12188, Enforcement'),
    sourceLink('https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=51.', 's8', 'California Legislative Information: Civil Code section 51 (Unruh Civil Rights Act)'),
    sourceLink('https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=52.', 's9', 'California Legislative Information: Civil Code section 52'),
  ],
}
