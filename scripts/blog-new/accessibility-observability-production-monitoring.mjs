const span = (text, marks = []) => ({ _type: 'span', text, marks })
const block = (style, children, extra = {}) => ({ _type: 'block', style, children, ...extra })
const p = (text) => block('normal', [span(text)])
const h2 = (text) => block('h2', [span(text)])
const h3 = (text) => block('h3', [span(text)])
const item = (text, listItem = 'bullet') => block('normal', [span(text)], { listItem })
const linked = (children, markDefs) => block('normal', children, { markDefs })

export default {
  slug: 'accessibility-observability-production-monitoring',
  title: 'Accessibility Observability: Monitor What Users Can Actually Do',
  excerpt: 'A passing audit is a snapshot. Accessibility observability tracks whether real user journeys remain operable after every release, content update, and dependency change.',
  publishedAt: '2026-07-11T10:00:00Z',
  categoryTitles: ['Development', 'Testing Tools'],
  seo: {
    metaTitle: 'Accessibility Observability for Production Teams',
    metaDescription: 'Turn accessibility from a periodic audit into a monitored production signal with journey checks, release gates, ownership, and useful alerts.',
    keywords: [
      'accessibility observability',
      'continuous accessibility monitoring',
      'accessibility regression testing',
      'WCAG monitoring',
      'accessibility CI testing',
      'production accessibility',
      'accessibility metrics',
      'accessibility SLO',
    ],
  },
  body: [
    p('Most teams measure accessibility as an event: an audit before launch, a scan after a complaint, or a certification exercise once a year. The product, meanwhile, changes every day. Components are upgraded, campaigns add new content, experiments alter checkout flows, and third-party widgets ship without asking the accessibility lead. A report can be accurate on Monday and irrelevant by Friday.'),
    p('Accessibility observability treats operability as a living production property. The question is no longer only "How many WCAG failures did the scanner find?" It becomes "Can people still complete the tasks this service exists to support, and will we know when that changes?"'),
    h2('An audit is a snapshot; observability is a feedback system'),
    p('Traditional observability combines signals, context, ownership, and response. Accessibility needs the same shape. A raw issue count is not enough because ten repeated color-contrast findings may matter less than one keyboard trap in payment. The signal must preserve the user journey and the consequence of failure.'),
    linked(
      [
        span('W3C guidance recommends evaluating accessibility early and throughout development, and it explicitly calls for a monitoring framework with measurable criteria, regular reviews, assigned responsibility, and escalation paths. That is the foundation. A one-time '),
        span('accessibility audit', ['audit']),
        span(' is still valuable, but it should establish a baseline for continuous work rather than mark the end of it.'),
      ],
      [{ _key: 'audit', _type: 'link', href: '/guides/how-to-audit-website-accessibility' }],
    ),
    h2('Start with accessibility service-level objectives'),
    p('A useful accessibility objective describes a user outcome, not a tool score. It should be narrow enough to test, important enough to page or block a release, and stable enough to compare over time.'),
    item('Authentication: every supported login path can be completed with keyboard-only input and a screen reader.'),
    item('Commerce: a user can find a product, add it to the cart, correct validation errors, and complete payment without a pointer.'),
    item('Publishing: every newly uploaded informative image has meaningful alternative text before it becomes public.'),
    item('Navigation: no production route introduces a keyboard trap, missing page title, or unlabeled primary control.'),
    item('Support: accessibility feedback receives acknowledgement within one business day and has an accountable owner.'),
    p('These are not claims that every possible barrier has disappeared. They are operational promises about the journeys where failure causes the most harm. They also tell engineering, content, design, and support teams what they own.'),
    h2('Use four signal layers'),
    h3('1. Static prevention'),
    p('Linting, component tests, design-token checks, and CMS validation prevent known defects before they merge. This layer should catch missing labels, invalid ARIA, empty alternative text fields, inaccessible token combinations, and component states that violate your design-system contract.'),
    h3('2. Journey regression tests'),
    p('Browser tests should exercise the actions that matter: tab through navigation, open and close a dialog, submit invalid data, recover from errors, and complete a transaction. Add automated accessibility checks at meaningful states, not only on the initial page load. A checkout can pass while empty and fail after an inline error appears.'),
    h3('3. Production probes'),
    p('Run scheduled checks against representative public routes and critical authenticated journeys. Watch for changes in page titles, heading structure, accessible names, focus order, landmark count, and severe automated-rule failures. Sample templates and journeys instead of crawling every URL with the same priority.'),
    h3('4. Human and user signals'),
    p('Automated tools cannot determine full conformance or usability. Keep recurring manual keyboard and screen-reader checks, involve people with disabilities in evaluation, and treat support contacts as production signals. A complaint about an unlabeled button is not anecdotal noise; it is evidence that a user journey failed outside the lab.'),
    h2('Store evidence that explains the regression'),
    p('An alert should answer five questions: what changed, which user action is affected, who is affected, how severe the impact is, and which team owns the surface. Preserve the URL, commit or deployment, browser state, rule identifier, DOM excerpt, screenshot where useful, and reproduction steps. Avoid storing sensitive user data.'),
    {
      _type: 'code',
      language: 'json',
      filename: 'accessibility-signal.json',
      code: `{
  "journey": "checkout/payment",
  "state": "card validation error",
  "impact": "critical",
  "userEffect": "keyboard focus cannot leave the error dialog",
  "detectedBy": "scheduled production journey",
  "firstSeenIn": "deploy-2026-07-11.3",
  "owner": "commerce-platform"
}`,
    },
    p('This format makes the issue useful during triage. "Axe score fell from 96 to 92" does not tell an incident responder whether anyone is blocked. "Keyboard focus cannot leave the payment error dialog" does.'),
    h2('Choose release gates by impact'),
    p('Blocking every automated finding creates alert fatigue. Blocking nothing turns monitoring into decoration. Use impact-based gates.'),
    item('Block immediately: keyboard traps, inaccessible authentication, loss of an accessible name on a primary control, missing captions on required media, or a critical journey that cannot be completed.'),
    item('Require owner and deadline: serious regressions with a workaround, repeated component defects, or barriers on high-traffic supporting journeys.'),
    item('Track in backlog: lower-impact findings with clear context, without allowing the backlog to become permanent storage.'),
    p('A temporary exception needs an owner, reason, affected users, compensating path, and expiry date. An ignore rule without an expiry date is usually a defect that has learned to hide.'),
    h2('Build a dashboard people can act on'),
    p('The most useful dashboard is small. Show critical journeys passing or failing, new regressions by deployment, unresolved user-reported barriers, age of high-impact issues, and recurrence by component. Segment by ownership rather than presenting one organization-wide pile.'),
    p('Do not use a single accessibility score as the executive truth. Scores compress unlike failures into a number and can improve while a key workflow becomes unusable. Pair trend metrics with plain-language outcomes such as "all six purchase journeys passed keyboard and screen-reader checks this week."'),
    h2('A practical 30-day rollout'),
    item('Week 1: choose three critical journeys and document their accessible completion criteria.', 'number'),
    item('Week 2: add automated checks at each meaningful state and assign component owners.', 'number'),
    item('Week 3: run the journeys against production on a schedule and route failures into the normal incident system.', 'number'),
    item('Week 4: perform a manual review with disabled users or experienced assistive-technology testers, then correct what automation missed.', 'number'),
    linked(
      [
        span('Use the '),
        span('WCAG 2.2 checklist', ['checklist']),
        span(' to define coverage, and the '),
        span('accessibility audit helper', ['helper']),
        span(' to organize findings. The important move is connecting those tools to releases, owners, and user outcomes.'),
      ],
      [
        { _key: 'checklist', _type: 'link', href: '/checklists/wcag-2-2' },
        { _key: 'helper', _type: 'link', href: '/tools/accessibility-audit-helper' },
      ],
    ),
    h2('The bottom line'),
    p('Accessibility is not a property a team earns once. It is a behavior the product must continue to exhibit. Observability makes that behavior visible: prevent predictable defects, test meaningful journeys, monitor production, listen to users, and connect every serious signal to an owner who can respond.'),
    h2('Sources'),
    linked(
      [span('W3C WAI: Planning and Managing Web Accessibility', ['s1'])],
      [{ _key: 's1', _type: 'link', href: 'https://www.w3.org/WAI/planning-and-managing/' }],
    ),
    linked(
      [span('W3C WAI: Evaluating Web Accessibility Overview', ['s2'])],
      [{ _key: 's2', _type: 'link', href: 'https://www.w3.org/WAI/test-evaluate/' }],
    ),
    linked(
      [span('W3C WAI: Involving Users in Evaluating Web Accessibility', ['s3'])],
      [{ _key: 's3', _type: 'link', href: 'https://www.w3.org/WAI/test-evaluate/involving-users/' }],
    ),
  ],
}
