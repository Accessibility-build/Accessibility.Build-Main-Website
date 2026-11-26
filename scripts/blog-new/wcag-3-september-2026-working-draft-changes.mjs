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

// Every factual claim below was checked on 18 Nov 2026 against:
// - the W3C publication history for WCAG 3.0 (latest WD is 10 Sept 2026; previous 3 Mar 2026),
//   and https://www.w3.org/TR/wcag-3.0/ (byte-identical to WD-wcag-3.0-20260910).
// - the two Working Drafts themselves (WD-wcag-3.0-20260303 and WD-wcag-3.0-20260910). All counts
//   (guidelines, core/supplemental/assertion/practice provisions, status markers, functional
//   performance statements) were scripted from the published HTML, not taken from summaries.
//   Section text cited: 1.1 About this draft, 3 Conformance (3.1.1, 3.1.2, 3.2, 3.2.1, 3.2.2),
//   4 Reporting (4.1, 4.1.1 to 4.1.4, 4.2), and the requirement texts for text contrast, blocks
//   of text, summaries, flashing, adjacent interactive elements and the media player assertions.
//   March text cited: 3.1.1, 3.1.2, 3.2.1 Conformance level (Bronze/Silver/Gold), 3.2.3 scope, 3.3.
//   We found no Physical harm / Risk / Barrier / Friction tag applied to any individual
//   requirement in the published September draft; the words appear only in the definitions.
// - the Explainer Group Note Draft of 10 Sept 2026 (status section; 7.1 Alternative approach,
//   Scoring, with weights 3/2/1; 9 Schedule: "will not be published until it covers at least as
//   much as WCAG 2.2").
// - the WAI news item of 10 Sept 2026 and the WAI WCAG 3 Introduction (updated 16 Nov 2026):
//   single conformance level, tiers, review questions, "best way to prepare" is WCAG 2.2, WCAG 2
//   not deprecated for several years after WCAG 3 is final.
// - the W3C blog post by Shawn Lawton Henry (25 Sept 2026): core requirements build on WCAG 2.2
//   A and AA; tags usable by regulators.
// - the AGWG schedule wiki on GitHub (last edited 10 Sept 2026; carries its own disclaimer that it
//   may not represent consensus): December 2026 WD planned; colour algorithm note deferred because
//   research is not sufficient; CR Snapshot targeted for 2027. Presented as a plan, not a promise.
// Not used: secondary summaries. The March draft's "174 requirements" headline figure was not
// reproduced because our own count of the March HTML gives different totals (see body).
export default {
  slug: 'wcag-3-september-2026-working-draft-changes',
  authorId: 'author-accessibility-build-team',
  title: 'WCAG 3.0’s September 2026 Draft: One Conformance Bar, Six Reporting Tiers',
  excerpt:
    'The 10 September 2026 Working Draft of WCAG 3.0 is the biggest rethink of conformance in years. Bronze, Silver and Gold are no longer conformance levels, conformance means meeting every core requirement, and the draft grew from 182 to 216 provisions. We diffed it against the March draft line by line.',
  publishedAt: '2026-11-18T04:30:00Z',
  categoryTitles: ['WCAG Guidelines', 'Industry News'],
  seo: {
    metaTitle: 'WCAG 3 September 2026 Draft: What Changed Since March',
    metaDescription:
      'WCAG 3’s September 2026 draft makes conformance a single bar and moves Bronze, Silver and Gold into reporting tiers. Counts, changes and what to watch next.',
    keywords: [
      'WCAG 3.0',
      'WCAG 3 September 2026',
      'WCAG 3 working draft',
      'WCAG 3 conformance model',
      'WCAG 3 reporting tiers',
      'WCAG 3 core requirements',
      'WCAG 3 Bronze Silver Gold',
      'WCAG 3 contrast',
      'WCAG 2.2 AA',
    ],
  },
  body: [
    p(
      span(
        'On 10 September 2026 the W3C published a new Working Draft of WCAG 3.0, the W3C Accessibility Guidelines, alongside an updated Explainer. As of mid-November it is still the latest version: the W3C publication history lists nothing newer, and the “latest published version” of WCAG 3.0 is this draft.'
      )
    ),
    p(
      span(
        'We covered the March 2026 draft when it renamed outcomes to requirements. The September draft goes further. It does not just add requirements. It rewrites what it means to conform. We compared both drafts requirement by requirement, counting everything from the published HTML.'
      )
    ),
    p(
      span('The short version: ', ['strong']),
      span(
        'WCAG 3 is still a Working Draft with, in the working group’s own words, several years of work left. WCAG 2.2 remains the standard to conform to, and W3C’s own advice is that meeting WCAG 2.2 now is the best way to prepare.'
      )
    ),

    h2('The September draft at a glance'),
    term('Published:', ' 10 September 2026, as a W3C Working Draft on the Recommendation track. The previous draft was 3 March 2026.'),
    term('Companion document:', ' an updated Explainer, published the same day as a Group Note Draft. It is informative and is not expected to become a W3C Recommendation.'),
    term('Conformance:', ' a single bar. A defined scope conforms when all core requirements are met. Supplemental requirements and assertions are no longer needed to conform.'),
    term('Bronze, Silver and Gold:', ' moved out of conformance into a new, informative Reporting section, where they are tiers 4 to 6 of six reporting tiers.'),
    term('Size:', ' 46 guidelines and 216 provisions, up from 44 guidelines and 182 provisions in March (our count).'),
    term('Maturity:', ' every provision in both drafts is at Developing status. Nothing has reached Refining or Mature. Exploratory provisions are left out of the published draft by design.'),
    term('Still undecided:', ' the contrast algorithm, the numeric values for text readability, which requirements carry which severity tag, and the number of supplemental requirements needed for each tier above conformance.'),

    h2('The big change: conformance is now one bar'),
    p(
      span(
        'In the March draft, the Conformance section defined three conformance levels. Bronze, the minimum, required every page or process in scope to meet all core requirements plus some portion, still to be determined, of the supplemental requirements and assertions. Silver and Gold required larger portions.'
      )
    ),
    p(
      span(
        'The September draft removes that “Conformance level” subsection entirely. Section 3.2 now says that for a defined scope to conform, all core requirements must be satisfied. That is the whole test. An editor’s note explains that the update “moves the concept of leveling from conformance to reporting”, and that the draft calls them reporting tiers to keep them distinct from the old conformance levels.'
      )
    ),
    p(
      span(
        'Two smaller changes in the same section reinforce the point. Supplemental requirements are now described explicitly as not required for conformance, and their definition changed from requirements that are currently more difficult or expensive to implement, to requirements that are disproportionately burdensome to implement. What March called best practices are now recommended practices, and the draft states that they are informative.'
      )
    ),
    p(
      span(
        'The Conformance section itself moved from Exploratory to Developing status. By the draft’s own definitions, that means the direction is roughly agreed but details are still being worked out.'
      )
    ),
    p(
      span('A correction to the record: ', ['strong']),
      span(
        'many descriptions of WCAG 3, including the first version of our own March article (since corrected), described a graded or scored conformance model. That idea dates from earlier drafts and is not what the September draft says. Conformance is binary: every core requirement is met, or the scope does not conform. Scoring survives only as an alternative proposal for reporting progress, described below.'
      )
    ),

    h2('The new Reporting section and its six tiers'),
    p(
      span(
        'Section 4, Reporting, is new. It is marked Exploratory and informative, which means it gives advice and sets no requirements. It introduces tags for core requirements, based on the worst harm that failing them could cause:'
      )
    ),
    term('Physical harm:', ' failure can cause a disabled person immediate physical harm.'),
    term('Risk:', ' failure unreasonably increases financial, medical, legal, privacy or security risk.'),
    term('Barrier:', ' failure can stop a disabled person from proceeding.'),
    term('Friction:', ' failure can hinder a disabled person, and several such failures together can stop them.'),
    p(span('The tiers are cumulative:')),
    plainBullet('Tier 1, avoid physical harm: all physical harm and risk requirements are met.'),
    plainBullet('Tier 2, foundational access: tier 1 plus all barrier requirements.'),
    plainBullet('Tier 3, conformance: tier 2 plus all friction requirements, which means every core requirement.'),
    plainBullet('Tier 4, Bronze: conformance plus a to-be-determined number of supplemental requirements and content assertions.'),
    plainBullet('Tier 5, Silver: a larger, still undetermined number of the same.'),
    plainBullet('Tier 6, Gold: adds assertions about the organization, such as staff training or public accessibility statements.'),
    p(
      span(
        'The draft says plainly that WCAG declares conformance when the core requirements are met, and that policymakers have the flexibility to require additional tiers. W3C’s blog post on the draft frames this as WCAG being the ruler and laws being the rules: the tags could let a regulator ask more of essential government services than of less important websites.'
      )
    ),
    p(
      span(
        'One thing to know if you try to use the tiers today: the published draft defines the four tags but, in our check of the HTML, does not yet assign a tag to any individual requirement. You cannot yet work out which requirements fall into tier 1 or tier 2.'
      )
    ),

    h3('The rival proposal: scoring'),
    p(
      span(
        'The tiers are not settled. An editor’s note in the draft invites comment on an alternative that the Explainer sets out in full. Under that proposal, the same tags weight a percentage score toward conformance: 3 points for physical harm and risk provisions, 2 for barrier, 1 for friction and the rest. Once a scope conforms, counting supplemental requirements and assertions would lead to WCAG 3 Bronze, Silver and Gold awards. In both versions, Bronze, Silver and Gold sit above conformance rather than defining it. The working group has also not decided whether assertions can ever be required for conformance.'
      )
    ),

    h2('Scope, support sets and functional needs'),
    term('Wider scopes.', ' March allowed claims about pages or views and processes. September lets a claim cover a product, site, subsite, application or other defined set, and adds paths and components as limited scopes. The draft says paths and components are still being defined.'),
    term('Accessibility support set.', ' As in March, a conformance claim must include the accessibility support set, the browsers and assistive technologies the methods were checked against. The default set is described as supporting web methods rather than HTML methods, and it has still not been defined.'),
    term('Functional performance statements.', ' The expanded list grew from 17 to 18 and was rewritten. New entries include use with hyposensitivity, use with hypersensitivity, use with very limited or no identifying characteristics (for biometrics), and use with intersectional disabilities, such as deafblind people.'),

    h2('What changed in the guidelines'),
    p(
      span(
        'By our count of the published HTML, the March draft contained 182 provisions: 92 core requirements, 61 supplemental requirements, 28 assertions and 1 best practice. The September draft contains 216: 106 core requirements, 74 supplemental requirements, 35 assertions and 1 recommended practice. Guidelines went from 44 to 46. Two guidelines, Figure captions and Control text, still have no provisions at Developing status in either draft.'
      )
    ),
    p(
      span(
        'Bear in mind that the published draft only includes provisions that have reached Developing status. A provision that disappears may have been merged, renamed or sent back for more work. The draft does not say which.'
      )
    ),

    h3('Media alternatives were broken up'),
    p(
      span(
        'March had a single Media alternatives guideline. September replaces it with three: Transcripts, Sign language and Accessible media player. Requirements that used to apply to media alternatives in general, such as identifying speakers, sounds and visual information, are now written separately for transcripts, captions and audio descriptions. Captions and audio descriptions each gained an “equivalent” requirement, plus assertions about style guides, usability testing and review by content authors. A live sign language assertion was replaced by one about having a policy to provide interpretation at live events, including how to request it.'
      )
    ),

    h3('Text appearance grew, but the numbers are blank'),
    p(
      span(
        'Text appearance went from 3 provisions to 11. New core requirements cover readable blocks of text, readable text style, text contrast, and the ability to adjust blocks of text and text style, with enhanced versions as supplemental requirements. Almost every value is a placeholder. In the text contrast requirement, the contrast measure itself is a bracketed placeholder marked as still to be determined, and an editor’s note says the WCAG 3 contrast algorithm is yet to be determined. The draft does not name APCA or any other method. The readability requirements also leave margins, line length, line height and type properties as values to be determined.'
      )
    ),

    h3('Other notable additions and removals'),
    plainBullet('Clear language gains Summaries available, a core requirement for pages of long-form text with 300 or more words, and Common words used, a supplemental requirement. An editor’s note says the 300-word threshold needs research.'),
    plainBullet('No flashing is now No flashing over threshold. An editor’s note says research into size and frequency metrics is under way and the values are likely to change.'),
    plainBullet('No repetitive links became No repetitive adjacent interactive elements, a supplemental requirement aimed at the common pattern of an image link and a text link going to the same place.'),
    plainBullet('Expected behavior gains Consistent control location, and Media control gains Media chapters available. Both are supplemental.'),
    plainBullet('Keyboard navigable if responsive, a March core requirement, no longer appears in the published draft.'),

    h2('What has not changed'),
    p(
      span(
        'WCAG 3 is not close to final. Nothing is at Refining or Mature status. The Explainer states that WCAG 3 will not be published until it covers at least as much as WCAG 2.2, and W3C’s introduction says WCAG 2 will not be deprecated for several years after WCAG 3 is finalized. W3C’s blog post on the draft says the core requirements build on the WCAG 2.2 Level A and AA success criteria, so work toward WCAG 2.2 AA is not wasted.'
      )
    ),
    p(
      span(
        'Laws and procurement rules today reference WCAG 2.x, directly or through standards such as EN 301 549. No regulator can point to WCAG 3 conformance yet, because the conformance model is still in draft.'
      )
    ),

    h2('What to watch next'),
    term('A December draft.', ' The working group’s schedule page, which carries a note that it may not represent group consensus, plans an updated Working Draft in December 2026 with updated provisions and a revised accessibility supported section. It targets a Candidate Recommendation Snapshot in 2027. Treat both as plans.'),
    term('Tiers or scoring.', ' The public review questions ask directly which approach is better. Whichever wins will decide how accessibility progress is reported in audits and procurement.'),
    term('Tag assignments.', ' Once requirements are tagged as physical harm, risk, barrier or friction, the tiers become something you can measure against.'),
    term('Contrast.', ' The schedule page notes that a planned note on a colour algorithm was put off because the research is not yet sufficient. Until the draft names a method, do not plan around one.'),
    term('Movement to Refining.', ' Refining is the first status the working group describes as ready for experimental adoption. Nothing has reached it yet.'),

    h2('What this means for your team'),
    p(
      span(
        'Keep building and testing to WCAG 2.2 AA. If you want to get ahead, the September draft suggests two habits worth starting now. First, rank your accessibility issues by impact, separating anything that could cause harm or block a task from friction, because that is how WCAG 3 reporting is likely to work. Second, look at the assertions, such as caption style guides, usability testing with disabled people and accessibility training. They describe processes that improve products regardless of how the standard ends up scoring them.'
      )
    ),
    p(span('Our resources can help with both:')),
    linkBullet('/wcag-3', 'l1', 'Read our ', 'WCAG 3 overview', ', updated for the September 2026 draft.'),
    linkBullet('/wcag-3/concepts', 'l2', 'Understand core requirements, assertions and reporting tiers in ', 'WCAG 3 key concepts', '.'),
    linkBullet('/wcag-3/comparison', 'l3', 'See how the new model compares with today’s in our ', 'WCAG 2 vs WCAG 3 comparison', '.'),
    linkBullet('/wcag-3/preparation', 'l4', 'Plan ahead with our ', 'WCAG 3 preparation guide', '.'),
    linkBullet('/checklists/wcag-2-2', 'l5', 'Meet the standard that applies now with our ', 'WCAG 2.2 checklist', '.'),
    linkBullet('/tools/url-accessibility-auditor', 'l6', 'Find issues on a live page with the ', 'URL accessibility auditor', '.'),
    linkBullet('/blog/wcag-3-march-2026-draft-outcomes-become-requirements', 'l7', 'For the previous step, read our coverage of the ', 'March 2026 draft', '.'),

    h2('Sources'),
    sourceLink('https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/', 's1', 'W3C: W3C Accessibility Guidelines (WCAG) 3.0, Working Draft (10 September 2026)'),
    sourceLink('https://www.w3.org/TR/2026/WD-wcag-3.0-20260303/', 's2', 'W3C: W3C Accessibility Guidelines (WCAG) 3.0, Working Draft (3 March 2026)'),
    sourceLink('https://www.w3.org/standards/history/wcag-3.0/', 's3', 'W3C: WCAG 3.0 publication history'),
    sourceLink('https://www.w3.org/TR/2026/DNOTE-wcag-3.0-explainer-20260910/', 's4', 'W3C: Explainer for W3C Accessibility Guidelines (WCAG) 3.0, Group Note Draft (10 September 2026)'),
    sourceLink('https://www.w3.org/WAI/news/2026-09-10/wcag3/', 's5', 'W3C Web Accessibility Initiative: For Review: WCAG 3 Working Draft, September 2026 (10 September 2026)'),
    sourceLink('https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/', 's6', 'W3C Web Accessibility Initiative: WCAG 3 Introduction (updated 16 November 2026)'),
    sourceLink('https://www.w3.org/blog/2026/crafting-wcag-3-for-more-accessible-user-experiences/', 's7', 'W3C Blog, Shawn Lawton Henry: Crafting WCAG 3 for more accessible user experiences (25 September 2026)'),
    sourceLink('https://github.com/w3c/wcag3/wiki/Schedule', 's8', 'Accessibility Guidelines Working Group: WCAG 3 schedule (project wiki)'),
  ],
}
