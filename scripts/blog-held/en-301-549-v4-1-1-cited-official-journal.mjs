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

// CITATION-DAY POST. Drafted 18 November 2026, when V4.1.1 was NOT yet cited.
// DO NOT PUBLISH until cited; fill TODO_CITATION_ tokens.
// Status check on 18 Nov 2026: the EU Publications Office (Cellar SPARQL) index held Commission
// decisions up to 17 Nov 2026; no decision since 1 Sep 2026 mentions accessibility, 2019/882 or
// 2016/2102 in its title (the latest harmonised-standards decisions were 2026/2505 of 12 Nov and
// 2026/2479 to 2481 of 9 Nov, none on accessibility). NDA Ireland still says citation is
// "currently expected on 16 December 2026". The Commission's accessibility harmonised standards
// page returned HTTP 503 and was not used.
// On citation day: read the decision itself, then replace every TODO_CITATION_ token, delete the
// WAD paragraph variant that does not apply, set publishedAt, and follow docs/en-301-549-citation-day.md.
//
// Every non-placeholder claim below was checked against:
// - ETSI EN 301 549 V4.1.1 (2026-09) PDF: foreword (C(2022) 6456 standardisation request, list of
//   significant changes, Annex ZA/ZB, clause A.2, national transposition dates 24 Aug 2026 /
//   30 Nov 2026 / 31 May 2027 / 31 May 2028), clause A.1 (Tables ZA.1 and ZA.2 for the WAD), clause
//   A.2.0 (Tables A.1 to A.5, "within the limits of the scope", presumption valid only while the
//   reference stays in the OJ list), clauses 4.2.11, 5.1.8, 9.1.2.2 (Subtitles), 9.2.4.11, 9.2.5.7,
//   9.2.5.8, 9.3.2.6, 9.3.3.7, 9.3.3.8, 9.4.1.1 (Void), 10.x and 11.x equivalents, 11.3.2.6
//   (Consistent help (Void)). ETSI deliver directory dates the PDF 2 Sep 2026.
// - Our dataset lib/data/en-301-549-v4-checklist.json, regenerated from that PDF by
//   scripts/en301549/build-v4-checklist.mjs: 319 requirements, 91 new, 93 changed, 48 v3 clauses
//   removed; Tables A.1 to A.5 = 57 / 54 / 68 / 28 / 106 clauses.
// - Directive (EU) 2019/882 on EUR-Lex: Art 14(1) to (8), Art 15(1) and (3), Art 4(8), Art 31(1) to (3).
// - Directive (EU) 2016/2102 on EUR-Lex: Art 5(1) to (4), Art 6(1).
// - Commission Implementing Decision (EU) 2021/1339 on EUR-Lex: V3.2.1 replaced v2.1.2 under the
//   WAD, adopted 11 Aug 2021, in force on OJ publication 12 Aug 2021, v2.1.2 row deleted from
//   12 Feb 2022.
// - W3C WCAG 2.2 Recommendation (12 Dec 2024 edition): levels of the six new A/AA criteria;
//   4.1.1 Parsing obsolete and removed.
// - NDA Ireland news item: V4.1.1 published online 2 Sep 2026, citation expected 16 Dec 2026.
export default {
  slug: 'en-301-549-v4-1-1-cited-official-journal',
  authorId: 'author-accessibility-build-team',
  title: 'EN 301 549 v4.1.1 Is Cited in the Official Journal: WCAG 2.2 Is Now the EAA Baseline',
  excerpt:
    'The European Commission has cited EN 301 549 V4.1.1 in the Official Journal under the European Accessibility Act. For the first time, a version of the standard gives businesses a presumption of conformity with the Act, and it is built on WCAG 2.2. What that presumption covers, what it does not, and what to change this week.',
  // DO NOT PUBLISH until cited; fill TODO_CITATION_ tokens. On citation day set this to the
  // morning after the OJ publication, for example '2026-12-17T07:00:00Z'.
  publishedAt: '2099-01-01T00:00:00Z',
  categoryTitles: ['Legal & Compliance', 'WCAG Guidelines'],
  seo: {
    metaTitle: 'EN 301 549 v4.1.1 Cited: WCAG 2.2 Is Now the EAA Baseline',
    metaDescription:
      'EN 301 549 V4.1.1 is now cited under the European Accessibility Act. What presumption of conformity means, what changes and what to update this week.',
    keywords: [
      'EN 301 549 V4.1.1 cited',
      'EN 301 549 Official Journal',
      'European Accessibility Act harmonised standard',
      'presumption of conformity EAA',
      'WCAG 2.2 EAA',
      'EN 301 549 WCAG 2.2',
      'Directive 2019/882 harmonised standard',
      'Web Accessibility Directive EN 301 549',
      'EN 301 549 Annex ZB',
    ],
  },
  body: [
    p(
      span(
        'On TODO_CITATION_OJ_DATE the European Commission published Implementing Decision TODO_CITATION_DECISION_NUMBER in the Official Journal of the European Union, citing EN 301 549 V4.1.1 as a harmonised standard under the European Accessibility Act (Directive (EU) 2019/882). It is the first time any edition of EN 301 549 has been cited under the Act. From TODO_CITATION_APPLICATION_DATE, a product or service that conforms to the relevant clauses of V4.1.1 is presumed to meet the Act’s accessibility requirements that those clauses cover.'
      )
    ),
    p(
      span(
        'The practical headline is the web baseline. V4.1.1 aligns its web, document and software chapters with WCAG 2.2, where the previous edition used WCAG 2.1. If your accessibility programme, your conformance reports or your accessibility statement still measure against WCAG 2.1, they now point at the old benchmark. We covered what is inside V4.1.1 when ETSI published it in September. This post is about what the citation itself changes, and what it does not.'
      )
    ),

    h2('The citation at a glance'),
    term('Decision:', ' Commission Implementing Decision TODO_CITATION_DECISION_NUMBER of TODO_CITATION_DECISION_DATE, published in the Official Journal on TODO_CITATION_OJ_DATE (TODO_CITATION_OJ_REFERENCE).'),
    term('Law it is cited under:', ' Directive (EU) 2019/882, the European Accessibility Act. TODO_CITATION_WAD_STATUS_SHORT'),
    term('Standard:', ' ETSI EN 301 549 V4.1.1 (2026-09), Accessibility requirements for ICT products and services, adopted 24 August 2026 and published by ETSI on 2 September 2026.'),
    term('Applies from:', ' TODO_CITATION_APPLICATION_DATE (the decision enters into force TODO_CITATION_ENTRY_INTO_FORCE).'),
    term('What gives the presumption:', ' conformance with the normative clauses listed in Tables A.1 to A.5 of clause A.2 of the standard, within the limits of its scope.'),
    term('Restrictions in the citation:', ' TODO_CITATION_RESTRICTIONS (write "None" if the decision cites the standard without restrictions or warnings).'),
    term('Previous edition:', ' V3.2.1 (March 2021, WCAG 2.1) was cited only under the Web Accessibility Directive, through Implementing Decision (EU) 2018/2048 as amended by Implementing Decision (EU) 2021/1339. No edition was ever cited under the EAA before today.'),

    h2('What a presumption of conformity is'),
    p(
      span(
        'Article 15(1) of the Act says that products and services conforming to harmonised standards, or parts of them, whose references are published in the Official Journal are presumed to meet the accessibility requirements, to the extent those standards cover them. That is what changed today. Until now an economic operator could test against EN 301 549 and argue that it met the Act, but no edition carried the formal presumption, because none had been cited under the Act.'
      )
    ),
    p(
      span(
        'In practice the presumption shifts the argument. A business that can show conformance with the cited clauses does not have to prove from first principles that its interpretation of Annex I is right; a market surveillance authority that disagrees has to engage with the standard. That is why harmonised standards matter more than any guidance document, and why the version number in your documentation suddenly carries legal weight.'
      )
    ),

    h3('What it is not'),
    term('It is not mandatory.', ' The standard describes itself as one voluntary means of conforming to the essential requirements. You can meet the Act another way, but you then carry the burden of showing how.'),
    term('It is not a blanket pass.', ' The presumption covers only the requirements the standard addresses, and the standard says it applies "within the limits of the scope of the present document". Annex ZB maps each clause to the Act’s requirements; anything the mapping does not cover still has to be met on its own terms.'),
    term('It is not WCAG on its own.', ' Table A.5 applies to all ICT and has 106 clauses, including functional performance statements, documentation and support services. Passing WCAG 2.2 AA on a website satisfies Table A.1, not the whole of clause A.2.'),
    term('It is not permanent.', ' The standard itself warns that the presumption stays valid only as long as its reference remains in the Official Journal list. When a later edition replaces it, the clock starts again.'),
    term('It is not a certificate.', ' Nobody issues a V4.1.1 certificate. The presumption rests on your own evidence: test results against the clauses in the tables that apply to your product or service.'),

    h2('What changes in practice'),
    h3('WCAG 2.2 AA is the baseline for web, documents and software'),
    p(
      span(
        'Clauses 9 (web), 10 (non-web documents) and 11 (software) now incorporate WCAG 2.2 Level A and AA. Six criteria are new compared with a WCAG 2.1 audit, and each appears in all three chapters with one exception:'
      )
    ),
    term('2.4.11 Focus Not Obscured (Minimum), AA', ' (9.2.4.11, 10.2.4.11, 11.2.4.11): focused elements must not be entirely hidden by sticky headers, cookie banners or chat launchers.'),
    term('2.5.7 Dragging Movements, AA', ' (9.2.5.7, 10.2.5.7, 11.2.5.7): any drag operation needs a single-pointer alternative.'),
    term('2.5.8 Target Size (Minimum), AA', ' (9.2.5.8, 10.2.5.8, 11.2.5.8): targets of at least 24 by 24 CSS pixels, or enough spacing around smaller ones.'),
    term('3.2.6 Consistent Help, A', ' (9.3.2.6, 10.3.2.6): help mechanisms in a consistent place. For software, 11.3.2.6 is marked void, so this one does not apply to native apps through clause 11.'),
    term('3.3.7 Redundant Entry, A', ' (9.3.3.7, 10.3.3.7, 11.3.3.7): do not make people re-enter information they already gave in the same process.'),
    term('3.3.8 Accessible Authentication (Minimum), AA', ' (9.3.3.8, 10.3.3.8, 11.3.3.8): no cognitive function test to log in unless an alternative method or a mechanism to assist the user is available.'),
    p(
      span(
        'Parsing goes the other way. WCAG 2.2 removed 4.1.1, and V4.1.1 marks 9.4.1.1, 10.4.1.1 and 11.4.1.1 as void, so old parsing findings can be closed rather than carried forward.'
      )
    ),

    h3('Clause A.2 is the new conformance route'),
    p(
      span(
        'V4.1.1 adds clause A.2 specifically for the Act. You work through five tables in order and apply each one whose condition fits: Table A.1 where the ICT is or includes a web page (57 clauses), A.2 for non-web documents (54), A.3 for non-web software with a user interface (68), A.4 for hardware (28) and A.5 for all ICT (106). This replaces the old habit of picking clauses from Annex A by feel. If you produce conformance reports, structure them by these tables so a reviewer can see which presumption you are claiming.'
      )
    ),

    h3('The non-WCAG chapters moved too'),
    p(
      span(
        'Measured against V3.2.1, our clause-by-clause dataset finds 91 new requirements, 93 changed and 48 earlier clauses removed or relocated, out of 319 requirements in V4.1.1. The changes most likely to catch a digital team are these:'
      )
    ),
    plainBullet('A new general requirement, 4.2.11 Privacy: where ICT provides accessibility features, using them must not compromise the user’s privacy. The standard’s own examples include not speaking masked characters aloud and allowing private listening through a personal headset.'),
    plainBullet('Real-time text in clause 6.2 was significantly revised and extended to total conversation (new clause 6.7). Any service with voice or video calling should re-read clause 6 rather than assume the 2021 analysis still holds.'),
    plainBullet('Closed functionality, such as kiosks and terminals, gains 5.1.8 Identify input purpose: fields that collect information about the user must announce their purpose in audio in at least one mode of operation.'),
    plainBullet('Captions are now called subtitles throughout (for example 9.1.2.2 Subtitles (pre-recorded)). The requirement is the same; search-and-replace your test scripts so reviewers are not confused.'),

    h2('What does not change'),
    term('The Act is still applied through national law.', ' The Directive had to be transposed by 28 June 2022 and applied from 28 June 2025 (Article 31). Market surveillance, penalties and enforcement remain national. The citation changes the technical reference point, not who enforces it.'),
    term('Fundamental alteration and disproportionate burden still exist.', ' Article 14 still limits the requirements where meeting them would fundamentally alter a product or service or impose a disproportionate burden. Operators relying on that must assess it against Annex VI, document it, keep the assessment for five years, and (except microenterprises) notify the relevant authorities. A cited standard does not remove those exceptions, and it does not make an undocumented claim any safer.'),
    term('The 112 date is unchanged.', ' Member States may apply the emergency communications requirements in Article 4(8) from 28 June 2027 at the latest (Article 31(3)).'),
    term('National standards follow on their own timetable.', ' ETSI set 30 November 2026 as the latest date for national standards bodies to announce V4.1.1, 31 May 2027 to publish it nationally, and 31 May 2028 to withdraw conflicting national standards. Those are standardisation milestones, not legal deadlines for businesses.'),

    h2('What about public-sector websites?'),
    p(
      span(
        // DELETE ONE of the two variants below on citation day, based on the decision text.
        // Variant A (V4.1.1 is ALSO cited under the WAD):
        'VARIANT A: The Commission also cited V4.1.1 under the Web Accessibility Directive (Directive (EU) 2016/2102), amending Implementing Decision (EU) 2018/2048. For public-sector websites and apps, the presumption under Article 6 of that Directive now comes from conformance with Tables ZA.1 and ZA.2 in Annex ZA of V4.1.1. V3.2.1 remains usable until TODO_CITATION_V321_WITHDRAWAL_DATE. That mirrors the last change: in 2021, Implementing Decision (EU) 2021/1339 let the older v2.1.2 reference stand for six months, until 12 February 2022.'
      )
    ),
    p(
      span(
        // Variant B (V4.1.1 is cited ONLY under the EAA):
        'VARIANT B: This decision concerns the European Accessibility Act only. For public-sector websites and mobile apps under the Web Accessibility Directive, V3.2.1 (WCAG 2.1) is still the cited edition, so a public body’s accessibility statement can still refer to it. V4.1.1 contains an updated Annex ZA for that Directive, ready for a separate citation, and public bodies that buy or build services also covered by the EAA should test to WCAG 2.2 now rather than run two baselines.'
      )
    ),

    h2('What to do this week'),
    term('Update the version in every public document.', ' Accessibility statements, conformance reports (ACRs and VPATs with an EN 301 549 section), procurement responses and product documentation should name EN 301 549 V4.1.1 and the tables you assessed against. A statement that says "EN 301 549 V3.2.1" or "WCAG 2.1 AA" for an EAA-covered service now describes a superseded benchmark.'),
    term('Re-test the six new WCAG 2.2 criteria.', ' Start with 2.5.8 Target Size and 3.3.8 Accessible Authentication, which most often surface real defects in checkout, sign-in and dense mobile layouts. Then 2.4.11 for sticky page furniture, 2.5.7 for sliders and drag-and-drop, 3.2.6 for help placement, and 3.3.7 for multi-step forms.'),
    term('Map your products to Tables A.1 to A.5.', ' Decide which tables apply to each product or service, and make sure Table A.5 (all ICT) is in scope, including documentation and support.'),
    term('Re-read clause 6 if you offer voice or video.', ' Real-time text and total conversation were rewritten, and a 2021 assessment does not carry over.'),
    term('Check any Article 14 assessments.', ' If you rely on disproportionate burden for part of a service, confirm the assessment still refers to the right requirements and is less than five years old.'),
    term('Keep evidence, not just a claim.', ' The presumption is only as strong as the test records behind it. Keep dated results per clause, with the edition named.'),
    p(
      span(
        'Our tools are already on the new edition:'
      )
    ),
    linkBullet('/checklists/en-301-549', 'l1', 'Work clause by clause through V4.1.1, with the A.1 to A.5 tables, in the ', 'interactive EN 301 549 checklist', '.'),
    linkBullet('/compliance/en-301-549-v4', 'l2', 'See every new, changed and removed clause in our ', 'EN 301 549 V4.1.1 guide', '.'),
    linkBullet('/compliance/en-301-549', 'l3', 'For the full background on the standard and its versions, read the ', 'EN 301 549 compliance page', '.'),
    linkBullet('/checklists/eaa', 'l4', 'Check the rest of your obligations under the Act with the ', 'EAA readiness checklist', '.'),
    linkBullet('/checklists/wcag-2-2', 'l5', 'Re-test the new success criteria with the ', 'WCAG 2.2 checklist', '.'),
    linkBullet('/tools/accessibility-statement-generator', 'l6', 'Regenerate a statement that names the right edition with the ', 'accessibility statement generator', '.'),
    linkBullet('/research/european-accessibility-act', 'l7', 'Track national transposition and enforcement in the ', 'European Accessibility Act tracker', '.'),

    h2('Sources'),
    sourceLink('TODO_CITATION_URL', 's1', 'EUR-Lex: Commission Implementing Decision TODO_CITATION_DECISION_NUMBER of TODO_CITATION_DECISION_DATE on harmonised standards drafted in support of Directive (EU) 2019/882 (OJ TODO_CITATION_OJ_REFERENCE)'),
    sourceLink('https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf', 's2', 'ETSI: EN 301 549 V4.1.1 (2026-09), Accessibility requirements for ICT products and services (published 2 September 2026)'),
    sourceLink('https://eur-lex.europa.eu/eli/dir/2019/882/oj', 's3', 'EUR-Lex: Directive (EU) 2019/882 on the accessibility requirements for products and services, Articles 4, 14, 15 and 31'),
    sourceLink('https://eur-lex.europa.eu/eli/dir/2016/2102/oj', 's4', 'EUR-Lex: Directive (EU) 2016/2102 on the accessibility of the websites and mobile applications of public sector bodies, Articles 5 and 6'),
    sourceLink('https://eur-lex.europa.eu/eli/dec_impl/2021/1339/oj', 's5', 'EUR-Lex: Commission Implementing Decision (EU) 2021/1339 amending Implementing Decision (EU) 2018/2048 (11 August 2021)'),
    sourceLink('https://www.w3.org/TR/WCAG22/', 's6', 'W3C: Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation (12 December 2024)'),
    sourceLink('https://nda.ie/news/en301549-published', 's7', 'National Disability Authority: Updated EN 301 549 standard published'),
  ],
}
