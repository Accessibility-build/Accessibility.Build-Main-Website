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

// Every claim below was checked against the HCRC notice of 18 September 2026, the
// Ramseyer draft of HAR 12-46 Subchapter 10, Governor's Message No. 1359 and SB 2852 CD1.
export default {
  slug: 'hawaii-act-257-digital-accessibility-rules',
  authorId: 'author-accessibility-build-team',
  title: 'Hawaii Wants WCAG 2.1 AA From Private Businesses. Comments Close October 30.',
  excerpt:
    'Hawaii Act 257 and the Civil Rights Commission’s draft rules would require places of public accommodation to make websites and apps meet WCAG 2.1 AA, with a private right of action. What the draft says, who it covers, and what to tell the Commission before October 30, 2026.',
  publishedAt: '2026-10-14T07:00:00Z',
  categoryTitles: ['Legal & Compliance', 'Industry News'],
  seo: {
    metaTitle: 'Hawaii Act 257: WCAG 2.1 AA Rules for Businesses Explained',
    metaDescription:
      'Hawaii’s draft rules under Act 257 would require businesses to meet WCAG 2.1 AA within 24 or 36 months. Who is covered, the exceptions, enforcement, and the Oct 30 deadline.',
    keywords: [
      'Hawaii Act 257',
      'Hawaii digital accessibility law',
      'Hawaii Civil Rights Commission accessibility rules',
      'SB 2852 Hawaii',
      'state website accessibility law',
      'WCAG 2.1 AA private businesses',
      'public accommodation website accessibility',
      'state accessibility law 2026',
    ],
  },
  body: [
    p(
      span(
        'Most US website accessibility law for private businesses still runs through courts interpreting a 1990 statute that never mentions the web. Hawaii is trying something different. On 14 July 2026 Governor Josh Green signed Act 257 (SB 2852), and on 18 September 2026 the Hawaii Civil Rights Commission published draft rules that would require places of public accommodation to make their websites and mobile apps conform to WCAG 2.1 Level A and AA. The Commission is taking public comment until 30 October 2026.'
      )
    ),
    p(
      span(
        'These are proposed rules, not final ones. No public hearing date has been set, the size threshold is explicitly open for comment, and the compliance clock does not start until a final rule takes effect. But the draft is specific enough to plan around, and businesses that will be covered have a short window to shape it.'
      )
    ),

    h2('What Act 257 itself does'),
    p(
      span(
        'The Act amends Hawaii’s public accommodations law (chapter 489 of the Hawaii Revised Statutes). It makes it a discriminatory practice for a place of public accommodation to deny a person with a disability full and equal enjoyment of its goods and services by requiring the use of information and communication technology that is not accessible to them. It then directs the Civil Rights Commission to adopt rules consistent with the US Department of Justice’s Title II web accessibility framework, 28 CFR part 35, as it stood on 24 June 2024. That framework is the DOJ rule that set WCAG 2.1 AA for state and local governments, which is why the Hawaii draft looks so familiar.'
      )
    ),

    h2('What the draft rules require'),
    term('Who is covered:', ' any place of public accommodation as defined in section 489-2 of the Hawaii Revised Statutes. The draft does not change that definition, so how far it reaches businesses with no premises in Hawaii is a question the rules leave to the existing statute.'),
    term('What is covered:', ' web content and mobile apps the business provides directly or through contractual, licensing or other arrangements, plus self-service digital technology (including kiosks and QR codes that lead to an app) when that technology is the main way the public reaches the goods or services.'),
    term('The standard:', ' WCAG 2.1, Level A and AA success criteria and conformance requirements, incorporated by reference.'),
    term('The timeline:', ' businesses with 100 or more full-time and part-time employees would have 24 months from the effective date of the final rule; all other covered businesses would have 36 months. The Commission is asking whether 100 employees is the right threshold, or whether a revenue test should be used instead.'),
    term('Self-service technology:', ' a business that relies on self-service digital technology must also offer an alternative method of access, not only an accessible kiosk.'),

    h2('The exceptions mirror the federal rule'),
    p(
      span('The draft exempts five categories, closely following the DOJ Title II rule:')
    ),
    plainBullet('Archived web content kept only for reference, research or recordkeeping, not changed after the compliance date, and stored in a dedicated archive area.'),
    plainBullet('PDFs, word processing, presentation and spreadsheet files posted before the compliance date, unless they are still used to apply for, access or take part in the business’s services.'),
    plainBullet('Content posted by third parties, unless the third party posts under a contract, licence or other arrangement with the business.'),
    plainBullet('Individualised, password-protected documents about a specific person, their property or their account.'),
    plainBullet('Social media posts made before the compliance date. New or updated posts after that date must be accessible.'),

    h2('Defences, and the paperwork they require'),
    p(
      span(
        'A business can avoid full conformance only by showing that it would fundamentally alter its goods or services, or impose an undue financial and administrative burden. The burden of proof sits with the business. The determination must be made by a responsible official or senior officer after considering all available resources, written down with reasons, kept, and made available to the Commission. Even then, the business must still do whatever it can to give disabled customers substantially equivalent access. A conforming alternate version of a page is allowed only where making the original accessible is not possible for technical or legal reasons.'
      )
    ),

    h2('Enforcement: the Commission and the courts'),
    p(
      span(
        'Anyone who believes a business has violated the rules can file a complaint with the Civil Rights Commission. On a finding of a violation, the Commission can order the business to bring its web content and mobile apps into WCAG 2.1 AA conformance within a set time, award compensatory damages for actual injury, and order other relief available under chapter 489. The draft also provides a private right of action: an aggrieved individual can sue in Hawaii circuit court, within chapter 489’s limitations period, for the remedies available under section 489-7.5.'
      )
    ),
    p(
      span(
        'That combination is the part to take seriously. Federal ADA Title III suits over websites give private plaintiffs injunctions and attorney’s fees but no damages, and they rest on judicial interpretation rather than a written technical standard. Hawaii’s draft would give complainants both a named standard to measure against and a state-law route to a remedy.'
      )
    ),

    h2('How this fits the wider picture'),
    p(
      span(
        'States are pulling in different directions. California’s AB 2190, which would have set a WCAG standard for business websites, died in the 2025-26 session. Missouri’s SB 907 went the other way, creating a cure period and penalties aimed at abusive website lawsuits. Hawaii is building an affirmative technical standard for private businesses, borrowed from the federal rule for governments. Note one detail: the Act ties the rules to the federal framework as it stood in June 2024, so the DOJ’s April 2026 extension of its own government deadlines does not carry over to Hawaii’s timeline.'
      )
    ),

    h2('What to do now'),
    plainBullet('If you run a business in Hawaii, or a trade association representing them, comment before 30 October 2026. The Commission asks specifically about the size or revenue threshold and the 24 and 36 month timeline. Comments go to the Hawaii Civil Rights Commission by email or by mail to 830 Punchbowl Street, Room 411, Honolulu, HI 96813, with "Act 257, Comments on HCRC Proposed Rule Amendments" in the subject line.'),
    plainBullet('Do not wait for the final rule to start. Audit against WCAG 2.2 AA, which includes every 2.1 requirement, so the work survives the next update of the federal and European baselines.'),
    plainBullet('Check your contracts. Booking engines, ordering platforms and payment flows provided "through contractual, licensing, or other arrangements" are covered, so ask vendors for current conformance evidence now.'),
    plainBullet('If customers reach you through kiosks or QR codes, plan an accessible alternative route as well as an accessible interface.'),
    plainBullet('Inventory your PDFs. Documents posted before the compliance date are exempt only if nobody needs them to apply for or use your services.'),

    linkBullet('/research/accessibility-laws', 'l1', 'Compare Hawaii with other jurisdictions in our ', 'accessibility laws tracker', '.'),
    linkBullet('/checklists/wcag-2-2', 'l2', 'Work through every A and AA criterion with the ', 'WCAG 2.2 checklist', '.'),
    linkBullet('/tools/url-accessibility-auditor', 'l3', 'Get a first automated read on a page with the free ', 'URL accessibility auditor', ', then test manually.'),
    linkBullet('/research/accessibility-lawsuits', 'l4', 'See how website litigation is trending in the ', 'lawsuit tracker', '.'),

    h2('Sources'),
    sourceLink('https://labor.hawaii.gov/hcrc/notice-seeking-public-comment-on-proposed-admin-rules-on-digital-accessibility/', 's1', 'Hawaii Civil Rights Commission: Notice seeking public comment on proposed admin rules on digital accessibility (18 September 2026)'),
    sourceLink('https://labor.hawaii.gov/hcrc/files/2026/09/HCRC-admin-rules-proposed-changes-Ramseyer-Sept-2026.pdf', 's2', 'Hawaii Civil Rights Commission: Proposed HAR Title 12, Chapter 46, Subchapter 10 (Ramseyer draft, September 2026)'),
    sourceLink('https://labor.hawaii.gov/hcrc/files/2026/09/GM1359_-1.pdf', 's3', 'Office of the Governor: Governor’s Message No. 1359, Act 257 signed 14 July 2026'),
    sourceLink('https://data.capitol.hawaii.gov/sessions/session2026/bills/SB2852_CD1_.HTM', 's4', 'Hawaii State Legislature: SB 2852 CD1, Relating to Civil Rights'),
    sourceLink('https://www.ada.gov/resources/2024-03-08-web-rule/', 's5', 'US Department of Justice: Fact sheet on the ADA Title II web and mobile app accessibility rule'),
  ],
}
