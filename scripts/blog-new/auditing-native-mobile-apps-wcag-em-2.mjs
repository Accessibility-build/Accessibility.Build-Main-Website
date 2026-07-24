// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const h3 = (t) => block('h3', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const numbered = (t) => ({ _type: 'block', listItem: 'number', style: 'normal', children: [span(t)] })
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

export default {
  slug: 'auditing-native-mobile-apps-wcag-em-2',
  title: 'Auditing a Native Mobile App: The Two Documents You Need',
  excerpt:
    'WCAG is written for web pages, and an app has none. WCAG-EM 2.0 now gives you the process and WCAG2ICT gives you the criteria — here is how they fit together on a real app audit.',
  publishedAt: '2026-07-24T08:00:00Z',
  categoryTitles: ['Testing Tools', 'WCAG Guidelines'],
  seo: {
    metaTitle: 'How to Audit a Native Mobile App Against WCAG',
    metaDescription:
      'WCAG-EM 2.0 supplies the audit process and WCAG2ICT the criteria interpretation. Scope, sampling, baselines and the criteria that behave differently on mobile.',
    keywords: [
      'mobile app accessibility audit',
      'native app WCAG',
      'WCAG2ICT',
      'iOS accessibility audit',
      'Android accessibility audit',
      'app accessibility testing',
      'WCAG-EM mobile',
      'mobile accessibility compliance',
    ],
  },
  body: [
    p(
      span(
        'Auditing a native mobile app against WCAG has always involved a quiet act of improvisation. The standard is written about web pages, and an app does not have any. Every success criterion referring to a "web page," every instruction to enumerate URIs, every assumption that a browser sits between the user and the interface — none of it lands cleanly on an iOS or Android build.'
      )
    ),
    p(
      span(
        'Two W3C documents now close that gap from opposite ends. WCAG-EM 2.0, published on 23 July 2026, supplies the evaluation process and — for the first time — a vocabulary that covers apps. WCAG2ICT supplies the interpretation of the criteria themselves for non-web software. Neither is sufficient alone. Together they make an app audit as defensible as a website audit.'
      )
    ),

    h2('What each document does'),
    term('WCAG-EM 2.0 — the process. ', 'Its five steps tell you how to scope, explore, sample, evaluate and report. Version 2.0 replaced "website" with "digital product" and "web page" with "view," which is what makes the method applicable to an app at all.'),
    term('WCAG2ICT — the criteria. ', 'Formally "Guidance on Applying WCAG 2 to Non-Web Information and Communications Technologies," a W3C Group Note published 11 December 2025 covering WCAG 2.0, 2.1 and 2.2. It explains how to read WCAG’s web-centric wording for non-web documents and software, including mobile apps.'),
    p(
      span(
        'The regulatory weight sits with the second one. WCAG2ICT is the guidance U.S. Department of Justice rulemaking directs implementers toward for mobile app accessibility, which means it is no longer merely a convenience for auditors — it is the reference a public entity is expected to have used.'
      )
    ),
    p(
      span(
        'Both are Group Notes, so neither is a normative standard. They are the agreed professional interpretation, which is precisely what you want to be able to cite when a finding is disputed.'
      )
    ),

    h2('Step 1: Scoping an app is stricter than scoping a site'),
    p(
      span(
        'A website’s scope can be described with a URL pattern. An app has no equivalent, so the scope statement has to pin down the build itself — and it goes stale far faster.'
      )
    ),
    numbered('The app, its platform, and the exact version and build number evaluated.'),
    numbered('The operating system versions in scope — an app can behave differently on iOS 18 and iOS 19.'),
    numbered('The device classes covered: phone and tablet, and whether foldables or landscape orientation are included.'),
    numbered('Account states — logged out, free tier, paid tier, admin — since large parts of an app are unreachable without the right account.'),
    numbered('Whether embedded web views and third-party SDKs are in or out of scope, stated explicitly.'),
    p(
      span(
        'The accessibility support baseline in Step 1.3 needs the same specificity. For an app that means naming the screen readers and their versions — VoiceOver on a stated iOS release, TalkBack on a stated Android release — plus any platform features you commit to supporting, such as Dynamic Type, Switch Control, or Voice Control. A baseline that just says "current mobile screen readers" is not testable and will not survive scrutiny.'
      )
    ),

    h2('Step 2: Exploring an app without a sitemap'),
    p(
      span(
        'On a website you can crawl. On an app you cannot, so exploration is manual and the risk is systematically missing views that live behind a state you never entered. Work from the navigation graph rather than a page list:'
      )
    ),
    term('Common views: ', 'tab bar, navigation drawer, global search, modal sheets, toasts and snackbars — the components that recur everywhere.'),
    term('Essential functionality: ', 'onboarding, sign-in including biometrics, purchase, the core task the app exists for, and account deletion.'),
    term('Variety of sample types: ', 'lists, forms, maps, media players, charts, camera or scanner screens, in-app documents such as PDF receipts.'),
    term('Technologies relied upon: ', 'native SDK components, custom-drawn views, cross-platform frameworks such as React Native or Flutter, and any embedded web views.'),
    term('Other relevant views: ', 'permission prompts, error and offline states, the accessibility settings screen if one exists, and legal or support screens.'),
    p(
      span(
        'That last group deserves attention. Permission dialogs, empty states and error states are where app audits most often find serious problems, precisely because they are hard to reach deliberately and get skipped in everyday testing.'
      )
    ),
    p(
      span(
        'Flag the custom-drawn and cross-platform items as you go. A native control inherits platform accessibility largely for free; a custom-drawn view or a poorly configured cross-platform component inherits nothing, and those are the views your sample most needs to include.'
      )
    ),

    h2('Step 3: Sampling by state, not by screen'),
    p(
      span(
        'The sampling model carries over unchanged — a structured sample, a random sample of 10% of it, and every view in a complete process. What changes is the unit. A single app screen can be five materially different samples: empty, loading, populated, error, and offline. Treating "the orders screen" as one sample will miss the states where the failures actually are.'
      )
    ),
    p(
      span(
        'Complete processes matter even more on mobile than on the web, because apps front-load mandatory flows. If onboarding is inaccessible, nothing behind it is reachable, and no amount of well-built home screen compensates. Audit onboarding, sign-in and purchase end to end, always.'
      )
    ),
    p(
      span(
        'The random 10% is harder to draw without a URL list. A workable approach is to enumerate the views you catalogued in Step 2, number them, and select randomly from that list — then treat any view the random draw surfaces that your structured sample missed as a signal that the exploration was incomplete.'
      )
    ),

    h2('Step 4: The criteria that behave differently on mobile'),
    p(
      span(
        'Most success criteria transfer with only vocabulary changes. A handful behave so differently on a touch device that a desktop-trained auditor will under-test them:'
      )
    ),
    term('2.5.8 Target Size (Minimum): ', 'the classic mobile failure. Small icon buttons, tightly packed list actions and close buttons in modals routinely fall under 24 by 24 CSS pixels.'),
    term('2.5.1 Pointer Gestures: ', 'swipe-to-delete, pinch-to-zoom, drag-to-reorder and pull-to-refresh all need a single-pointer alternative. Screen readers also intercept swipes, so a gesture-only action can become genuinely unreachable.'),
    term('1.3.4 Orientation: ', 'locking to portrait fails users with a device fixed to a wheelchair mount, unless orientation is essential to the function.'),
    term('Dynamic Type and text scaling: ', 'raise the system font size to its maximum and watch what clips, truncates or overlaps. Layouts built at default size fail here constantly.'),
    term('Focus and reading order: ', 'the accessibility focus order is set by the view hierarchy, and custom layouts often produce an order that makes no sense read aloud.'),
    p(
      span(
        'Test with the real screen readers on real hardware rather than a simulator’s approximation — gesture handling and focus behaviour are exactly what simulators reproduce least faithfully.'
      )
    ),
    linkBullet('/guides/talkback-screen-reader-testing', 'g1', 'Start on Android with the ', 'TalkBack testing guide', ' — it covers explore-by-touch, the focus-versus-activation split, and the reading-controls menu.'),
    linkBullet('/guides/voiceover-screen-reader-testing', 'g2', 'Then repeat on iOS with the ', 'VoiceOver testing guide', ', including the Rotor and the "interacting" model.'),
    p(
      span(
        'Where an app embeds a web view, the content inside it is web content and WCAG applies to it directly — no WCAG2ICT translation needed. Note the boundary in your report, because responsibility for that content often sits with a different team.'
      )
    ),

    h2('Step 5: Reporting an app evaluation'),
    p(
      span(
        'The reporting requirements are the same, with two additions worth making habitual. Record the build number and OS versions in the statement itself, not just the covering email — an app evaluation is a snapshot of a build, and a report that does not say which build is unusable six weeks later. And state the baseline devices and screen reader versions alongside the findings, since "works with VoiceOver" means little without them.'
      )
    ),
    p(
      span(
        'The limits on what you can claim are unchanged too. A sampled app evaluation supports an evaluation statement about the samples tested, not a conformance claim about the whole app — and app stores do not certify accessibility any more than the W3C does.'
      )
    ),
    linkBullet('/blog/wcag-em-2-evaluation-methodology-published', 'l1', 'Start with the methodology in ', 'what changed in WCAG-EM 2.0', '.'),
    linkBullet('/blog/accessibility-audit-representative-sample', 'l2', 'Work the sampling arithmetic through in our ', 'representative sample worked example', '.'),
    linkBullet('/blog/wcag-conformance-claim-vs-evaluation-statement', 'l3', 'Understand what you can honestly claim in ', 'conformance claims vs evaluation statements', '.'),
    linkBullet('/blog/mobile-accessibility-testing', 'l4', 'Get hands-on with the tooling in our ', 'mobile accessibility testing guide', '.'),
    linkBullet('/guides/doj-title-ii-deadline-extension', 'l5', 'Check the deadlines that apply to public entities in our ', 'DOJ Title II guide', '.'),

    h2('Sources'),
    sourceLink('https://www.w3.org/TR/wcag-em-2/', 's1', 'W3C — WCAG Evaluation Methodology (WCAG-EM) 2.0, Group Note, 23 July 2026'),
    sourceLink('https://www.w3.org/TR/wcag2ict/', 's2', 'W3C — Guidance on Applying WCAG 2 to Non-Web ICT (WCAG2ICT), Group Note, 11 December 2025'),
    sourceLink('https://www.w3.org/TR/WCAG22/', 's3', 'W3C — Web Content Accessibility Guidelines (WCAG) 2.2'),
  ],
}
