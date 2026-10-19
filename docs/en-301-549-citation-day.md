# EN 301 549 V4.1.1 citation day: the edits to make

Prepared 19 October 2026. Do NOT apply until the Commission's decision citing EN 301 549 V4.1.1 is
published in the Official Journal of the EU. Verify three facts from the decision itself before
touching anything, because the copy below depends on them:

1. **Which law(s) the decision cites V4.1.1 under.** The expected case is Directive (EU) 2019/882
   (the European Accessibility Act). A separate decision may, or may not, also cite V4.1.1 under
   Directive (EU) 2016/2102 (the Web Accessibility Directive) and amend or repeal Decision (EU)
   2018/2048. Until a WAD decision exists, V3.2.1 stays the edition cited for the WAD; do not write
   otherwise.
2. **The decision's date, number and OJ reference** (for example "Commission Implementing Decision
   (EU) 2026/NNNN of DD Month 2026, OJ L, DD.MM.2026"). Every page below should quote it once.
3. **Any transition period** the decision gives for V3.2.1 under the WAD (the 2021 amendment gave
   one). If present, the WAD lines keep "V3.2.1 remains acceptable until <date>".

Then run `node scripts/en301549/build-v4-checklist.mjs --v4 <pdf>` after editing the
`legalStatus` block as described in section 6, so the dataset and the pages agree.

Sources to confirm the citation: EUR-Lex (search "EN 301 549" in the OJ L series), the Commission's
harmonised standards page for Directive 2019/882, and ETSI's own news item. Deque's expected date is
30 November 2026 (this is also ETSI's "date of latest announcement"); Ireland's NDA expects
16 December 2026.

---

## 1. `app/compliance/en-301-549/page.tsx`

| Where | Current string | Change to |
|---|---|---|
| FAQ "What is the current version of EN 301 549?" | `V4.1.1 has not yet been cited in the Official Journal; Ireland's National Disability Authority expects the citation on 16 December 2026. Until then no version of EN 301 549 is cited under the EAA, and v3.2.1 remains the version cited for the Web Accessibility Directive.` | `V4.1.1 was cited in the Official Journal under the European Accessibility Act by <decision> on <date>, so conforming to the clauses in its Tables A.1 to A.5 now gives a presumption of conformity with the Act. For the Web Accessibility Directive, <v3.2.1 remains the cited edition / V4.1.1 is also cited, with V3.2.1 acceptable until <date>>.` |
| "What EN 301 549 is" bullet on the EAA | `No edition is cited under the EAA yet; V4.1.1 is expected to be the first, with an Official Journal citation anticipated in December 2026.` | `V4.1.1 is the edition cited under the EAA since <date> (<decision>).` |
| Versions table, v4.1.1 row | `Not yet cited in the Official Journal (expected December 2026)` | `Cited in the Official Journal under the EAA on <date>` (add "and the WAD" if true) |
| Versions table, v3.2.1 row | `Current baseline cited for the Web Accessibility Directive; WCAG 2.1 A/AA for web, documents, and software` | Keep if the WAD citation is unchanged; otherwise `Cited for the Web Accessibility Directive until <date>; superseded by V4.1.1` |
| Status box in "EN 301 549 v4: exactly what is changing" | `Status as of 14 October 2026: ... It has NOT yet been cited in the Official Journal; Ireland's National Disability Authority expects that on 16 December 2026. Until then, v3.2.1 remains the version cited for the Web Accessibility Directive, and no version is cited under the European Accessibility Act, so the EAA's presumption of conformity is not yet available through any edition. Test against WCAG 2.2 AA now, and cite the version you tested against.` | `Status as of <date>: ETSI published V4.1.1 on 2 September 2026 and the Commission cited it in the Official Journal under the European Accessibility Act on <date> (<decision>). Conformance with the clauses in Tables A.1 to A.5 now confers a presumption of conformity with the Act. <WAD sentence per fact 1.> Test against WCAG 2.2 AA and cite V4.1.1.` |
| FAQ "Who needs to conform" | `V4.1.1 is due to become the EAA's harmonised standard once it is cited in the Official Journal` | `V4.1.1 has been the EAA's harmonised standard since <date>` |
| "Who needs EN 301 549" list, EAA bullet | `which becomes a formal presumption-of-conformity route once V4.1.1 is cited in the Official Journal` | `which is a formal presumption-of-conformity route since V4.1.1 was cited in the Official Journal on <date>` |
| Metadata description and intro paragraph | `incorporates WCAG 2.1 AA` wording | Move the headline to WCAG 2.2 AA via V4.1.1 (keep the v3.2.1 / WCAG 2.1 history in the versions table) |
| Chapter table, Ch. 9 row | `incorporates WCAG 2.1 Level A and AA success criteria (WCAG 2.2 in v4.1.1)` | `incorporates WCAG 2.2 Level A and AA success criteria (WCAG 2.1 in v3.2.1)` |
| `lib/site-routes.ts` | `lastModified` for `/compliance/en-301-549` | citation date |

## 2. `app/checklists/en-301-549/page.tsx` and `components/checklists/interactive-en301549-checklist.tsx`

| Where | Current string | Change to |
|---|---|---|
| Amber "Legal status" note, first paragraph | `v3.2.1 is the only edition cited in the Official Journal of the EU, and only under the Web Accessibility Directive ... No edition of EN 301 549 is cited under the European Accessibility Act, so there is no EAA presumption of conformity through any version until V4.1.1 is cited.` | `V4.1.1 is cited in the Official Journal under the European Accessibility Act since <date> (<decision>); conformance with its Tables A.1 to A.5 gives a presumption of conformity with the Act. <WAD sentence per fact 1.>` |
| Amber note, second paragraph | `Its Official Journal citation is expected between late November and mid-December 2026: Deque reports 30 November ... Until then, cite v3.2.1 for Web Accessibility Directive statements, audit against WCAG 2.2 AA, and use the v4.1.1 switch to see what you will be tested against next` | `Audit against WCAG 2.2 AA and use the v4.1.1 edition for EAA conformance work; keep the v3.2.1 edition for <WAD statements until <date> / historical assessments>.` |
| Heading date | `Legal status (reviewed 19 October 2026)` | citation date |
| FAQ "Which versions ... cover?" | `V4.1.1 is not yet cited in the Official Journal; the citation is expected between late November and mid-December 2026.` | `V4.1.1 has been cited in the Official Journal under the EAA since <date>.` |
| FAQ "Which version should I audit against today?" | whole answer | Lead with V4.1.1 for the EAA; keep the WAD sentence per fact 1 |
| FAQ "Is completing this checklist the same as EAA compliance?" | `Once v4.1.1 is cited in the Official Journal under the European Accessibility Act, conformance with the clauses in its Tables A.1 to A.5 gives a presumption of conformity with the Act's accessibility requirements; before that, no edition does.` | `Since V4.1.1 was cited in the Official Journal under the European Accessibility Act on <date>, conformance with the clauses in its Tables A.1 to A.5 gives a presumption of conformity with the Act's accessibility requirements.` |
| Component `DATASETS.v4.status` | `Published 2 September 2026; Official Journal citation pending` | `Cited in the Official Journal for the EAA on <date>` |
| Component `DATASETS.v3.status` | `Cited in the Official Journal for the Web Accessibility Directive` | Keep, or `Cited for the Web Accessibility Directive until <date>` |
| Component default edition | `useState<Version>(initialVersion)` with `initialVersion = "v3"` on the page | Flip the default to `"v4"` (page prop or the default parameter) so first-time visitors land on the cited edition; the URL `?version=v3` still opens the old one |
| Component export sheet, "Legal status" rows | both strings | Same facts as the amber note |
| Checklists index card (`app/checklists/page.tsx`) | `v3.2.1 (cited today) and v4.1.1 (WCAG 2.2, published September 2026 ...)` | `v4.1.1 (cited for the EAA) and v3.2.1 (...)` |

## 3. `app/compliance/en-301-549-v4/page.tsx`

| Where | Current string | Change to |
|---|---|---|
| Blue status box | `Status on 19 October 2026: published, not cited. ... Expected citation window: late November to mid-December 2026.` | `Status on <date>: cited. The Commission cited V4.1.1 in the Official Journal under the European Accessibility Act on <date> (<decision>). <WAD sentence per fact 1.>` |
| Lead paragraph | `that make it the European Accessibility Act's harmonised standard once it is cited` | `that make it the European Accessibility Act's harmonised standard since <date>` |
| "Where V4.1.1 stands" prose | `and why the citation that matters for private-sector sellers is still ahead` | `and why the <date> citation is the one that matters for private-sector sellers` |
| Section "The legal-status trap" | all three paragraphs | Rewrite as "what changed on citation day": V3.2.1 history, V4.1.1 now cited under the EAA, presumption attaches to Tables A.1 to A.5, WAD status per fact 1; keep the warning that the presumption only covers the Act's requirements the standard addresses |
| Migration item 10 | `Keep citing v3.2.1 for Web Accessibility Directive statements until the Official Journal lists v4.1.1 ... the only thing you cannot do before citation day is claim a presumption of conformity through it.` | `Cite V4.1.1 (<decision>) in EAA conformity documentation; <WAD sentence per fact 1.>` |
| FAQ "Is EN 301 549 V4.1.1 in force?" | whole answer | `Yes for the EAA since <date> ...` |
| FAQ "What happens on the day V4.1.1 is cited" | whole answer | Replace with "What changed when V4.1.1 was cited on <date>" |
| Metadata description | `and the legal status until the Official Journal citation` | `and its status as the EAA's harmonised standard since <date>` |
| `lib/site-routes.ts` and `lib/internal-linking.ts` | `lastModified` and the description ending `until the Official Journal citation` | citation date; `since its Official Journal citation on <date>` |

## 4. `app/compliance/eaa/page.tsx`

| Where | Current string | Change to |
|---|---|---|
| Stat tile `WCAG 2.1 AA` | `The web standard incorporated by EN 301 549 v3.2.1, the edition cited today for the Web Accessibility Directive and the working benchmark for the EAA` (source `ETSI EN 301 549 v3.2.1`, asOf `2021-03-01`) | value `WCAG 2.2 AA`, label `The web standard incorporated by EN 301 549 V4.1.1, the edition cited in the Official Journal under the EAA since <date>`, source `Commission decision <number>`, asOf `<date>` |
| Stat tile `v4.1.1` | `The EN 301 549 revision that moves the baseline to WCAG 2.2, published 2 September 2026 and expected to be cited in the Official Journal, the first edition cited under the EAA, in December 2026` (asOf `2026-10-14`) | `The EN 301 549 edition cited under the EAA on <date>: WCAG 2.2 in clauses 9 to 11, Annex ZB mapping, clause A.2 conformance tables`, asOf `<date>` |
| Section heading `EN 301 549 and WCAG 2.1 AA` | heading and paragraph: `so for websites and apps, WCAG 2.1 AA conformance is the practical technical baseline today. V4.1.1, published in September 2026 and expected to be the first edition cited under the Act, moves that baseline to WCAG 2.2.` | heading `EN 301 549 and WCAG 2.2 AA`; `so for websites and apps, WCAG 2.2 AA conformance is the technical baseline. V4.1.1 was cited in the Official Journal under the Act on <date> (<decision>) and its clause A.2 tables define the presumption of conformity.` |
| FAQ answers mentioning `WCAG 2.1 AA` as the EAA baseline (three answers) and the "Audit against EN 301 549 / WCAG 2.1 AA" step | `WCAG 2.1 AA` | `WCAG 2.2 AA` with a clause that 2.1 AA was the benchmark via v3.2.1 before <date> |
| Metadata description, OG description, keywords | `EN 301 549 and WCAG 2.1 AA` | `EN 301 549 V4.1.1 and WCAG 2.2 AA` |
| `lib/site-routes.ts` | `lastModified` for `/compliance/eaa` | citation date |

## 5. `app/compliance/eaa-ireland/page.tsx`

| Where | Current string | Change to |
|---|---|---|
| FAQ "What standard do I need to meet?" | `ETSI published V4.1.1, aligned to WCAG 2.2 and mapped to the EAA, on 2 September 2026; the National Disability Authority expects its citation on 16 December 2026. Until then v3.2.1 is cited only for the Web Accessibility Directive ...` | `V4.1.1, aligned to WCAG 2.2 and mapped to the EAA, was cited in the Official Journal under the Act on <date> (<decision>), so conforming to its Tables A.1 to A.5 gives a presumption of conformity. <WAD sentence per fact 1.>` |
| "The Compliance Route" paragraph | `Version 3.2.1 (WCAG 2.1) is the edition cited today, for the Web Accessibility Directive. ETSI published V4.1.1, aligned to WCAG 2.2, on 2 September 2026, and the National Disability Authority expects it to be cited in the Official Journal on 16 December 2026, which would make it the first edition cited under the EAA.` | `V4.1.1 (WCAG 2.2) is the edition cited in the Official Journal under the EAA since <date>; <WAD sentence per fact 1.>` |
| `lib/site-routes.ts` | `lastModified` for `/compliance/eaa-ireland` | citation date |

## 6. `app/guides/accessibility-overlays-eu-uk-law/page.tsx`

| Where | Current string | Change to |
|---|---|---|
| FAQ "Will an overlay make my site EAA compliant?" | `(conformity is formally presumed once a version is cited in the Official Journal under the Act, expected for V4.1.1 in December 2026)` | `(conformity is formally presumed through V4.1.1, cited in the Official Journal under the Act on <date>)` |
| Body paragraph on the technical benchmark | `conformity with it becomes a formal presumption of conformity once a version is cited in the Official Journal under the Act, expected for V4.1.1 in December 2026.` | `conformity with V4.1.1, cited in the Official Journal under the Act on <date>, is a formal presumption of conformity.` |
| `lib/site-routes.ts` | `lastModified` for `/guides/accessibility-overlays-eu-uk-law` | citation date |

## 7. `lib/data/accessibility-laws.ts`, row `id: "eu-eaa"`

| Field | Current | Change to |
|---|---|---|
| `wcagVersion` | `"2.1 AA (via EN 301 549)"` | `"2.2 AA (via EN 301 549 V4.1.1)"` |
| `recentUpdate` | starts `Enforceable since June 28, 2025. ...` | Prepend `EN 301 549 V4.1.1 cited in the Official Journal under the EAA on <date> (<decision>): WCAG 2.2 AA is now the presumption-of-conformity baseline. ` |
| File header comment (re-review note, lines 12 to 14) | `ETSI published EN 301 549 v4.1.1 (WCAG 2.2) on September 2, 2026; not yet cited in the Official Journal (NDA Ireland expects December 16, 2026). v3.2.1 is cited only under the Web Accessibility Directive, not the EAA.` | `EN 301 549 v4.1.1 cited in the OJ under the EAA on <date>; <WAD status per fact 1>.` |
| Canada rows mentioning `CAN/ASC EN 301 549` | unchanged | Unchanged. CAN/ASC EN 301 549:2024 adopts v3.2.1 identically; a Canadian adoption of v4.1.1 is a separate event. |

## 8. `lib/data/en-301-549-v4-checklist.json` via the build script

Edit the `legalStatus` object in `scripts/en301549/build-v4-checklist.mjs` (not the JSON by hand):

```js
legalStatus: {
  published: "2026-09-02",
  adopted: "2026-08-24",
  citedInOfficialJournal: true,
  citedOn: "<date>",
  citedUnder: ["Directive (EU) 2019/882"],   // add "Directive (EU) 2016/2102" only if fact 1 says so
  decision: "<decision number and OJ reference>",
  note: "<two sentences: cited under the EAA on <date>; WAD status per fact 1>",
},
```

Then regenerate and verify:

```bash
node scripts/en301549/build-v4-checklist.mjs --v4 <path-to-en_301549v040101p.pdf>
node scripts/en301549/build-v4-checklist.mjs --v4 <path-to-en_301549v040101p.pdf> --check
```

## 9. Elsewhere, lighter touch

- `/blog/en-301-549-v4-1-1-wcag-2-2-eaa` (Sanity): add a dated update paragraph at the top stating the
  citation; do not rewrite the September post.
- `/research/european-accessibility-act` and `/research/accessibility-laws`: the timeline entries that say
  "expected December 2026" become the citation date.
- `/tools/eaa-scope-checker` and `/tools/accessibility-statement-generator` copy that names the standard:
  search for `v3.2.1` and `WCAG 2.1 AA (via EN 301 549)`.
- `lib/accessibility-statement-templates.ts`: the EAA statement template should cite V4.1.1.
- `docs/content-ideas-2026-10.md`: mark the watch-list item "EN 301 549 V4.1.1 cited in the OJ" done.
- After the commit: `node scripts/refresh-route-dates.mjs --apply`, then resubmit the six URLs via IndexNow.

## Grep to find anything this list missed

```bash
grep -rn "expected .*December 2026\|not yet cited\|citation pending\|cited today\|once .* cited\|16 December 2026\|30 November 2026" app components lib docs --include='*.ts' --include='*.tsx' --include='*.md' --include='*.mjs'
```
