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

// Every factual claim below was checked against the DOJ press release (26-1338, 9 Nov 2026),
// the filed complaint in United States v. Lyft, Inc. (N.D. Cal., 9 Nov 2026, paragraph
// numbers cited in comments), the June 2020 USAO C.D. Cal. release on the earlier Lyft
// agreement, the DOJ Uber press release (11 Sept 2025) and the DOJ Uber case page.
// Note: the $53 million figure appears in the press release only, not in the complaint.
export default {
  slug: 'doj-sues-lyft-service-animals-wheelchairs-ada',
  authorId: 'author-accessibility-build-team',
  title: 'The Justice Department Sues Lyft Over Service Dogs and Wheelchairs: What the Complaint Says',
  excerpt:
    'On 9 November 2026 the US Justice Department sued Lyft under ADA Title III, alleging drivers routinely refuse riders with guide dogs and folding wheelchairs, and that Lyft charges them for it. We read the 30-page complaint: the 14 riders, the $10 credits, the $4 Pet fee, the 2020 settlement that came first, and what product teams should learn from it.',
  publishedAt: '2026-11-11T07:00:00Z',
  categoryTitles: ['Legal & Compliance', 'Industry News'],
  seo: {
    metaTitle: 'DOJ Sues Lyft Over Service Dogs and Wheelchairs (ADA)',
    metaDescription:
      'The DOJ says Lyft refuses riders with guide dogs and wheelchairs, charges them fees and offers $10 credits. What the ADA complaint alleges and what comes next.',
    keywords: [
      'DOJ sues Lyft',
      'United States v. Lyft',
      'Lyft ADA lawsuit',
      'Lyft service animal lawsuit',
      'Lyft wheelchair discrimination',
      'rideshare ADA Title III',
      'service dog ride refusal',
      'Uber ADA lawsuit service animals',
      '49 CFR part 37',
    ],
  },
  body: [
    p(
      span(
        'On Monday 9 November 2026 the US Department of Justice filed a lawsuit against Lyft, Inc. in the federal court for the Northern District of California. The government says Lyft and its drivers routinely refuse to carry people who travel with service animals or who use folding wheelchairs, charge some of them cancellation fees after turning them away, and then offer a $10 credit when they complain. The press release says the department is seeking $53 million for people who reported discrimination to Lyft or to the department, plus a civil penalty and a court order forcing changes to Lyft’s policies and training.'
      )
    ),
    p(
      span(
        'This is the second time the department has taken Lyft to task over disabled riders, and it follows a near-identical suit against Uber filed in September 2025. We read the full 30-page complaint. Here is what it alleges, what the law actually requires, and why anyone who builds a digital service should pay attention, even though the case is about cars.'
      )
    ),
    p(
      span('A note before the detail: ', ['strong']),
      span(
        'these are allegations. Lyft has not yet answered the complaint in court, nothing has been proven, and Lyft says it disagrees with the claims.'
      )
    ),

    h2('The case at a glance'),
    term('Case:', ' United States of America v. Lyft, Inc., US District Court for the Northern District of California, filed 9 November 2026. The government has demanded a jury trial.'),
    term('Law:', ' Title III of the Americans with Disabilities Act (42 U.S.C. 12181 to 12189), specifically section 12184, which covers private companies primarily in the business of transporting people, and the Department of Transportation’s ADA regulations at 49 C.F.R. part 37.'),
    term('Legal basis for the government suing:', ' a finding of reasonable cause that Lyft engages in a pattern or practice of discrimination, and that its discrimination raises an issue of general public importance (42 U.S.C. 12188(b)(1)(B)).'),
    term('Who is named:', ' 14 riders living in 12 states and Washington, D.C., including retired federal appeals judge David Tatel. Twelve travel with guide dogs or service dogs. Others use wheelchairs or need to sit in the front seat because of a balance impairment.'),
    term('What the government wants:', ' a declaration that Lyft violated the ADA, an injunction, changes to Lyft’s policies, ADA training for staff and drivers, compensatory damages including for emotional distress, and a civil penalty.'),
    term('Lyft’s position:', ' in a statement reported by Engadget, Lyft denied the allegations and said it has long required drivers to accommodate service animals and foldable mobility devices, with permanent deactivation among the consequences for violations.'),

    h2('What the complaint alleges'),
    p(
      span(
        'The complaint makes a simple core claim: Lyft denies service to “hundreds, and likely thousands,” of disabled riders, and Lyft itself receives thousands of disability discrimination complaints every year (paragraphs 51 and 52). It backs that up with rider accounts, many supported by video and screenshots reproduced in the filing. Four patterns run through them.'
      )
    ),

    h3('1. Drivers refuse guide dogs, often on sight'),
    p(
      span(
        'Most of the named riders are blind or have low vision and travel with guide dogs. The accounts repeat with uncomfortable regularity: a driver pulls up, sees the dog, says “no dogs” or “no pets,” and leaves. Judge Tatel describes a driver screaming at him and his wife outside their synagogue in April 2023, and another driver locking the doors and driving off in September 2026 (paragraphs 97 to 105). A rider in Dayton, Ohio says a driver began pulling away while her hand was still on the door handle (paragraph 214). A rider in New Jersey says three drivers in a row refused her on one evening in July 2025 (paragraph 194).'
      )
    ),
    p(
      span(
        'Several riders describe the costs that follow: missed dentist and therapy appointments, a missed conference presentation, being late to work, paying for a more expensive car service, or relying on family. Some have stopped bringing their guide dog at all. One Austin rider began leaving his dog at home in 2022 and says he does not intend to get another guide dog, even though he feels less safe without one (paragraphs 159 and 167).'
      )
    ),

    h3('2. Wheelchair users are left at the curb'),
    p(
      span(
        'A Nevada woman recovering from a near-fatal car accident waited in her wheelchair outside a dentist’s office in Sacramento in May 2024. According to the complaint, one driver drove away as she waved, and a second refused to help stow her chair and left. She could not wheel herself back up the hill, got sunburned because of medication that made her skin sensitive to light, and was delayed in taking pain medication (paragraphs 128 to 134). That ride had been arranged through her insurer. The complaint notes that Lyft also contracts with health care providers, insurers and local paratransit programs (paragraphs 2 and 3).'
      )
    ),

    h3('3. Riders are charged after being refused'),
    p(
      span(
        'Several riders say drivers refused them and then drove off without cancelling the trip. That leaves the rider stuck: they cannot book another car until the trip ends, and if they cancel it themselves, or the trip times out, Lyft records them as a “no show.” A deaf-blind teacher in Vancouver, Washington says a driver refused her guide dog, parked a short distance away for several minutes, and she was then charged a no-show fee that was only refunded after she submitted video (paragraphs 114 to 118). The government says Lyft does not check whether it has wrongly charged riders with service animals or mobility devices unless they complain (paragraph 253). Under 49 C.F.R. 37.5(d), a transportation provider may not impose special charges on disabled passengers.'
      )
    ),

    h3('4. Complaints go nowhere, or end with $10'),
    p(
      span(
        'This is the part of the complaint that reads most like a product teardown. Riders describe in-app complaints that never received a reply, a complaint flow one rider could not use at all, phone support that was hard to reach, and representatives who questioned blind riders’ accounts or asked about their disabilities. The standard outcome, according to the filing, is a $10 credit, sometimes $5. When Judge Tatel asked whether the driver who refused him had been removed from the platform, Lyft declined to say, citing the driver’s privacy (paragraph 106). Another standard response was telling the rider they would no longer be matched with that driver, which the government notes does nothing to protect the next rider (paragraph 260).'
      )
    ),
    p(
      span(
        'There is also a deactivation threat running the other way. The deaf-blind teacher says Lyft warned her that her own account would be deactivated after she stood up for herself with a driver (paragraphs 124 and 235). A rider in Stony Brook, New York filmed a driver showing her that he had reported her to Lyft for having a dog (paragraph 145).'
      )
    ),

    h2('Two details that should worry any product team'),
    h3('The opt-in feature that did not fix it'),
    p(
      span(
        'According to the complaint, after the Justice Department told Lyft it was investigating, Lyft added a voluntary feature that lets riders tell their driver in advance that they are travelling with a service animal (paragraph 12). Several named riders use it. They say they are still refused (paragraphs 57, 111 and 192). Worse, at least one driver told a rider she was obliged to give notice in advance, and another spent five minutes insisting that a rider should have flagged her guide dog in the app before he relented (paragraphs 82, 227 and 228). The ADA does not require disabled riders to announce themselves. A disclosure toggle moved the burden onto the rider without changing the driver’s behaviour, and some drivers came to treat it as a precondition.'
      )
    ),
    h3('The $4 Pet fee'),
    p(
      span(
        'Lyft sells a Pet ride option. The rider pays a $4 fee plus tax, all of which goes to the driver (paragraph 35). The complaint describes drivers telling guide dog users to book a Pet ride, or explaining that they would get $4 extra for an animal (paragraphs 171 to 173 and 222). A service animal is not a pet, and charging extra for one is exactly the kind of surcharge the regulations ban. A pricing feature built for a legitimate purpose taught some drivers that dogs cost money, and the app did not distinguish between the two at the point of pickup.'
      )
    ),

    h2('What the law requires of rideshare companies'),
    p(
      span(
        'The complaint lists the specific Title III and 49 C.F.R. part 37 obligations it says Lyft breaks. In plain terms, a company like Lyft must:'
      )
    ),
    plainBullet('Let disabled people use its service if they are able to (49 C.F.R. 37.5(b) and 37.29(c)).'),
    plainBullet('Permit service animals to ride with the person they assist (49 C.F.R. 37.167(d)).'),
    plainBullet('Help stow mobility devices such as folding wheelchairs when needed (49 C.F.R. 37.29(c)).'),
    plainBullet('Not impose surcharges or disability-related fees (49 C.F.R. 37.5(d)).'),
    plainBullet('Train personnel to proficiency so they treat disabled riders properly and courteously (49 C.F.R. 37.173).'),
    plainBullet('Run a complaint procedure that resolves disability complaints promptly and equitably, and tells each complainant what was decided and why (49 C.F.R. 37.17(b)).'),
    plainBullet('Make reasonable modifications to policies and practices, such as letting a rider with a balance impairment sit in the front, unless doing so would fundamentally alter the service (42 U.S.C. 12184(b)(2)(A)).'),
    p(
      span(
        'Note that the complaint is built on the ADA itself, not on Lyft’s own policies. Lyft has a service animal policy. The government’s argument is that a policy drivers routinely ignore, enforced through $10 credits, is not compliance.'
      )
    ),

    h2('This has happened before'),
    p(
      span(
        'In June 2020 Lyft settled a Justice Department investigation that began with a Los Angeles area rider who uses a foldable wheelchair. Lyft agreed to revise its wheelchair policy, remind drivers of it every quarter, make a training video, discipline drivers who violated it, pay damages of $4,000 to $30,000 to four complainants and a $40,000 civil penalty, and report to the department for three years. Lyft did not admit wrongdoing and denied that the ADA applied to it.'
      )
    ),
    p(
      span(
        'One detail of that agreement stands out now. It required Lyft to refund charges and give $10 credits to riders who made plausible discrimination complaints under the revised policy. Six years later, the government is citing $10 credits as evidence that Lyft’s remedies are inadequate. A gesture written into a settlement as a floor appears to have become the ceiling.'
      )
    ),

    h2('The Uber case is a preview'),
    p(
      span(
        'On 11 September 2025 the department filed a similar suit against Uber Technologies in the same court, alleging refusals of riders with service animals and stowable wheelchairs, cleaning fees for service animals, and cancellation fees for refused riders. That case seeks $125 million for affected riders. Uber moved to dismiss, and on 5 March 2026 the court denied the motion, so the case is going forward. The US Attorney for the Northern District of California referred to the Uber case directly when announcing the Lyft suit.'
      )
    ),
    p(
      span(
        'Both companies have long argued that they are technology platforms rather than transportation companies, and that drivers are independent contractors. The Lyft complaint anticipates this. It spends twelve paragraphs (36 to 47) on the ways Lyft controls each trip: vehicle requirements, driver eligibility and ratings, pricing, cancellation fees, monitoring rides for unusual activity, insurance, and banning drivers. The point is that a company which controls that much of the ride is responsible for what happens on it.'
      )
    ),

    h2('What happens next'),
    plainBullet('Lyft will respond, either by answering the complaint or by moving to dismiss it. The Uber ruling does not bind the judge who will hear the Lyft case, but it shows that the argument that a rideshare company falls outside Title III did not end that case early.'),
    plainBullet('If the government wins, the court can order injunctive relief and damages for aggrieved riders. The ADA also allows a civil penalty, set by statute at up to $50,000 for a first violation and $100,000 for a subsequent one, with both amounts since raised for inflation.'),
    plainBullet('Settlement is possible at any stage. If it comes, the useful questions will be whether it includes independent monitoring, automatic refunds of fees charged after refusals, and real consequences for drivers, rather than another round of credits.'),

    h2('Why this matters beyond rideshare'),
    p(
      span(
        'Accessibility.build mostly writes about websites and apps, and this lawsuit is not about whether the Lyft app works with a screen reader. But almost every failure in the complaint passes through software: a disclosure toggle, a pricing tier, a trip state that lets a driver leave without cancelling, a fee engine that charges by default, and a complaint flow that ends in an automated credit. When a service is delivered through an app, the app is where discrimination either gets designed out or quietly built in.'
      )
    ),
    p(span('If you build a platform that matches people with providers, the complaint reads as a checklist:')),
    term('Do not make disclosure the fix.', ' If disabled users have to announce themselves to get equal treatment, and that announcement is used to screen them out, the feature has made things worse. Measure refusal rates for users who disclose, not just how many disclose.'),
    term('Audit pricing for disability surcharges.', ' Any fee attached to an animal, a device or extra assistance needs a clear separation from protected needs, enforced in the product, not just in the help centre.'),
    term('Stop charging by default after a refusal.', ' If a provider arrives and leaves without completing the job, the user should not carry the fee or the burden of proving what happened.'),
    term('Treat complaints as a regulated feature.', ' For transportation providers, a prompt, equitable process that explains its outcome is a legal requirement. The complaint channel itself must be accessible to blind and deaf-blind users, with a human option.'),
    term('Close the loop.', ' A credit is not a remedy. Users who report discrimination want to know that something happened to stop it recurring.'),
    p(
      span(
        'And if your own app is the front door to a service covered by the ADA, make sure the door itself works. Our tools and guides can help with that part:'
      )
    ),
    linkBullet('/guides/mobile-accessibility', 'l1', 'Start with the ', 'mobile accessibility guide', ' for iOS and Android apps.'),
    linkBullet('/compliance/ada', 'l2', 'See how the ADA applies to digital services on our ', 'ADA compliance page', '.'),
    linkBullet('/reference/ada-website-case-law', 'l3', 'Read the court decisions that shaped digital ADA coverage in our ', 'ADA case law reference', '.'),
    linkBullet('/research/accessibility-lawsuits', 'l4', 'Track how disability litigation is trending in the ', 'accessibility lawsuit tracker', '.'),
    linkBullet('/cases/robles-v-dominos', 'l5', 'For the closest web-era parallel, read our case study on ', 'Robles v. Domino’s', ', where a website and app were also the gateway to a physical service.'),

    h2('If you have been refused a ride'),
    p(
      span(
        'Riders who believe they have been discriminated against can report it to the Justice Department at civilrights.justice.gov. The ADA Information Line answers questions at 800-514-0301 (TTY 1-833-610-1264). Many of the riders in the complaint kept screenshots, trip records and video, and that evidence is what lets their accounts carry weight in a federal filing.'
      )
    ),

    h2('Sources'),
    sourceLink('https://www.justice.gov/opa/pr/justice-department-sues-lyft-denying-rides-passengers-service-dogs-wheelchairs', 's1', 'US Department of Justice: Justice Department Sues Lyft for Denying Rides to Passengers with Service Dogs and Wheelchairs (9 November 2026)'),
    sourceLink('https://www.justice.gov/crt/media/1470976/dl?inline', 's2', 'US Department of Justice: Complaint, United States v. Lyft, Inc. (N.D. Cal., filed 9 November 2026)'),
    sourceLink('https://www.justice.gov/usao-cdca/pr/lyft-agrees-resolve-allegations-it-violated-federal-law-when-its-drivers-denied-rides', 's3', 'US Attorney’s Office, Central District of California: Lyft agrees to resolve allegations it violated federal law when its drivers denied rides (June 2020)'),
    sourceLink('https://www.justice.gov/opa/pr/justice-department-sues-uber-denying-rides-passengers-service-dogs-wheelchairs', 's4', 'US Department of Justice: Justice Department Sues Uber for Denying Rides to Passengers with Service Dogs and Wheelchairs (11 September 2025)'),
    sourceLink('https://www.justice.gov/crt/case/united-states-v-uber-technologies-inc-0', 's5', 'US Department of Justice, Civil Rights Division: United States v. Uber Technologies, Inc. case page (order denying motion to dismiss, 5 March 2026)'),
    sourceLink('https://www.engadget.com/2311839/doj-lawsuit-lyft-routinely-refused-service-passengers-with-disabilities/', 's6', 'Engadget: DOJ lawsuit says Lyft routinely refuses service to passengers with disabilities (10 November 2026)'),
    sourceLink('https://www.ecfr.gov/current/title-49/subtitle-A/part-37', 's7', 'eCFR: 49 C.F.R. Part 37, Transportation Services for Individuals with Disabilities (ADA)'),
  ],
}
