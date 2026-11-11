// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const h3 = (t) => block('h3', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const code = (language, filename, src) => ({ _type: 'code', language, filename, code: src })
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

// Every statement about how Adaptive Dark Mode behaves is taken from the WebKit announcement
// of 3 November 2026 (Safari 27.3 beta). The accessibility analysis is ours and is framed as
// risks to test for, not as observed behaviour.
export default {
  slug: 'safari-adaptive-dark-mode-accessibility',
  authorId: 'author-accessibility-build-team',
  title: 'Safari Will Now Repaint Light Websites Dark. Here Is What That Means for Accessibility.',
  excerpt:
    'Adaptive Dark Mode in the Safari 27.3 beta converts light websites to dark when a user turns it on, and your JavaScript cannot tell. What it changes, what it leaves alone, where contrast, focus and logos can break, and how to opt in properly instead of being repainted.',
  publishedAt: '2026-11-11T09:00:00Z',
  categoryTitles: ['Development', 'Industry News'],
  seo: {
    metaTitle: 'Safari Adaptive Dark Mode: What It Means for Accessibility',
    metaDescription:
      'Safari 27.3 beta can repaint light sites dark. How Adaptive Dark Mode works, the contrast and logo risks, why automated tests miss it, and how to support dark mode.',
    keywords: [
      'Safari Adaptive Dark Mode',
      'Safari 27.3 dark mode',
      'automatic dark mode websites',
      'color-scheme light dark',
      'color-scheme light only',
      'dark mode accessibility',
      'dark mode contrast WCAG',
      'prefers-color-scheme',
      'light-dark() CSS',
    ],
  },
  body: [
    p(
      span(
        'On 3 November 2026 the WebKit team announced Adaptive Dark Mode, now in the Safari 27.3 beta. When a user switches it on, Safari takes a website that only has a light design and presents it as dark. Safari makes the change itself, inside the browser engine, and the site cannot detect it.'
      )
    ),
    p(
      span(
        'WebKit’s reasoning is straightforward. By its count, almost 40% of web page loads come from people using dark mode, but only about 10% of page loads support it. If you prefer dark mode, most of the web still flashes white at you. For people who use dark mode because bright screens trigger migraines, eye strain or glare from low vision, that is more than an annoyance.'
      )
    ),
    p(
      span(
        'For anyone responsible for an accessible website, though, this raises an obvious question. Your colours, contrast ratios and focus styles were chosen and tested in light mode. What happens when a browser rewrites them?'
      )
    ),

    h2('How Adaptive Dark Mode works'),
    p(span('Here is what WebKit says the feature does, in plain terms:')),
    term('It only touches light pages.', ' If a page declares dark mode support with the color-scheme meta tag or the color-scheme CSS property, Safari leaves it alone. If a page is already mostly dark, nothing changes either.'),
    term('It inverts lightness but keeps hue.', ' A colour matrix turns light backgrounds dark and dark text light, while a blue stays blue and a red stays red. Light CSS gradients become dark.'),
    term('It aims for 4.5:1 on text.', ' When transforming text colour, Safari targets the WCAG contrast ratio of 4.5:1. WebKit also says it works to keep buttons distinct from backgrounds, text visible over images, and hover menus clear.'),
    term('Images are mostly left alone.', ' Photos are untouched. SVG images are inspected and recoloured when needed. For bitmap images, Safari analyses the pixels and inverts simple black-and-white logos.'),
    term('Some effects get switched off.', ' Masks and mix-blend-mode can produce bad results on recoloured elements, so Safari may disable them. Canvas content is left exactly as drawn.'),
    term('Your scripts cannot see it.', ' To stop it becoming a fingerprinting signal, JavaScript that reads CSS colours gets the original authored values, and images drawn into a canvas render in their original form.'),
    p(
      span(
        'To try it, set your system appearance to dark, open a bright website in the Safari 27.3 beta, and accept the preview Safari offers.'
      )
    ),

    h2('Where accessibility can go wrong'),
    p(
      span(
        'WebKit has clearly thought about legibility, and targeting 4.5:1 on text is a good sign. But an automatic transformation cannot know what your colours mean. These are the areas we would test first. None of them are confirmed failures; they are the places where a hue-preserving inversion is most likely to surprise you.'
      )
    ),

    h3('Non-text contrast is not mentioned'),
    p(
      span(
        'The announcement promises a contrast target for text. It does not say the same for input borders, icon-only buttons, chart lines, toggle states or focus indicators, which WCAG 1.4.11 asks to reach 3:1 against adjacent colours. A light grey input border on a white page, inverted, becomes a dark grey border on a near-black page. Whether that still reaches 3:1 depends on the exact values. Check it rather than assume it.'
      )
    ),

    h3('Focus indicators may lose their contrast'),
    p(
      span(
        'A custom focus ring designed to stand out against a white background will be recoloured along with everything else. A two-tone ring, or a ring that relies on a box-shadow against a specific background, may behave differently from a single solid outline. Tab through your key pages with Adaptive Dark Mode on and confirm you can always see where focus is (WCAG 2.4.7).'
      )
    ),

    h3('Colour that carries meaning'),
    p(
      span(
        'Because hue is preserved, a red error stays red and a green success state stays green. Their lightness flips, though, so a pale red background behind an error message becomes a deep red one. If your design relies on subtle tints to tell states apart, those differences can shrink or grow. Pages that already avoid using colour alone to convey meaning (WCAG 1.4.1) are safest.'
      )
    ),

    h3('Images of text and transparent logos'),
    p(
      span(
        'Safari inverts simple black-and-white bitmap logos, but a full-colour PNG logo with dark lettering on a transparent background is a different case. If Safari decides not to invert it, dark lettering ends up on a dark page. Images with a white background baked in will stay white, leaving bright rectangles on a dark page. WebKit’s own advice is to use SVG for logos and icons, and to give content images transparent backgrounds rather than painting the page colour into them.'
      )
    ),

    h3('Charts drawn in canvas'),
    p(
      span(
        'Canvas content is never changed. If your chart is drawn in canvas but its legend, axis labels or key are HTML, the HTML will be recoloured and the canvas will not. A legend swatch could end up a different shade from the line it describes, and a white chart panel will sit inside a dark page. SVG charts are recoloured, so they at least stay consistent with themselves.'
      )
    ),

    h3('Your automated tests will not see any of it'),
    p(
      span(
        'This is the part that matters most for testing. Because scripts receive the original colours, tools that read computed styles in the browser, including axe-core and most contrast checkers, will report on your light design even while the user is looking at the transformed one. The only way to check the adapted page is to look at it in Safari with the feature on.'
      )
    ),

    h2('Does this affect your WCAG conformance?'),
    p(
      span(
        'Not directly. WCAG evaluates the content you author, and a transformation the user chose to turn on in their browser is closer to a user setting, like zoom or a high contrast theme, than to your design. Adaptive Dark Mode does not make a conforming page non-conforming.'
      )
    ),
    p(
      span(
        'But conformance is not the same as the experience people have. Some of your users will now see a version of your site you never designed or tested, and when something in it is hard to read, they will blame your site, not Safari. The good news is that the fix is the same one you would apply to support dark mode properly anyway.'
      )
    ),

    h2('Your three options'),
    h3('1. Build a real dark mode (recommended)'),
    p(
      span(
        'If you declare dark mode support and provide your own dark styles, Safari leaves your site alone and you stay in control of every contrast ratio. Everything needed is supported in current browsers:'
      )
    ),
    code(
      'css',
      'dark-mode.css',
      `/* Tell the browser you support both schemes. Put this in CSS or use the
   <meta name="color-scheme" content="light dark"> tag in the <head>. */
:root {
  color-scheme: light dark;

  /* light-dark(light value, dark value) */
  --surface: light-dark(#ffffff, #0f172a);
  --text: light-dark(#0f172a, #f1f5f9);
  --border: light-dark(#767676, #94a3b8);
  --focus: light-dark(#1d4ed8, #93c5fd);
}

body {
  background: var(--surface);
  color: var(--text);
}

:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}`
    ),
    p(
      span(
        'Use a <picture> element with a prefers-color-scheme media query to swap logos and illustrations. WebKit also recommends declaring color-scheme in the HTML head or CSS from the start, not injecting it later with JavaScript.'
      )
    ),
    p(
      span('One warning: ', ['strong']),
      span(
        'only declare light dark once you have actually provided dark styles. The declaration tells the browser to switch its own defaults, such as the page background and form controls, to dark. If your CSS still hard-codes dark text in places, that text can end up on a dark default background. Test every page template before shipping the declaration.'
      )
    ),

    h3('2. Prepare your light design for adaptation'),
    p(
      span(
        'If a full dark theme is not on this quarter’s roadmap, you can make Safari’s job easier. WebKit’s suggestions line up neatly with good accessibility practice:'
      )
    ),
    plainBullet('Replace bitmap logos and icons with SVG.'),
    plainBullet('Use CSS colours and gradients instead of tiled background images.'),
    plainBullet('Replace image sprites with CSS for rounded corners, shadows and button states.'),
    plainBullet('Give content images transparent backgrounds instead of baking in the page colour.'),
    plainBullet('Add padding to containers so content does not crowd edges that may change colour.'),
    p(
      span(
        'You can also apply color-scheme: light dark to a single component, such as a code sample or a data table, and give that component your own dark styles while Safari adapts the rest.'
      )
    ),

    h3('3. Opt out with light only (use sparingly)'),
    p(
      span(
        'Declaring color-scheme: light only, in CSS or with the meta tag, tells Safari not to transform the page or a specific element. WebKit notes the only keyword is not yet supported in Safari 27.3 beta 1, so this route does not work today.'
      )
    ),
    p(
      span(
        'We would think twice before opting out a whole site. People turn dark mode on for real reasons, including light sensitivity, migraine and some forms of low vision. Opting out means they get the bright page back. It makes sense for an element where exact colour matters, such as a brand colour picker, a medical image or a colour-coded map, but not as a blanket default.'
      )
    ),

    h2('A quick test plan'),
    plainBullet('Install the Safari 27.3 beta, set your system to dark appearance, and enable Adaptive Dark Mode on your site.'),
    plainBullet('Check your top templates: home, product or article, form, checkout or sign-up, and any page with charts.'),
    plainBullet('Read body text and small print. Then check input borders, icons, toggles and chart lines for 3:1 against their backgrounds.'),
    plainBullet('Tab through each page and confirm focus is visible at every step.'),
    plainBullet('Look at every logo and image of text. Anything dark on a transparent background needs a dark-mode version or an SVG.'),
    plainBullet('Trigger error, success and warning states and make sure they are still distinguishable without relying on colour.'),
    plainBullet('Sample the colours you see with an eyedropper and check them with a contrast checker. Do not trust values read by scripts.'),
    plainBullet('If something breaks, report it to Apple through Feedback Assistant, and fix it on your side with a proper dark theme.'),

    linkBullet('/tools/dark-mode-contrast-checker', 'l0', 'Test any page in light and dark mode, and see whether Safari will repaint it, with our free ', 'dark mode contrast checker', '.'),
    linkBullet('/tools/contrast-checker', 'l1', 'Check sampled colour pairs with our ', 'contrast checker', '.'),
    linkBullet('/wcag/1-4-11', 'l2', 'Review the 3:1 rule for icons, borders and focus indicators in ', 'WCAG 1.4.11 Non-text Contrast', '.'),
    linkBullet('/recipes/two-tone-focus-ring', 'l3', 'Build a focus indicator that survives any background with the ', 'two-tone focus ring recipe', '.'),
    linkBullet('/guides/oklch-apca-color-systems', 'l4', 'Design light and dark palettes together with our guide to ', 'OKLCH colour systems', '.'),
    linkBullet('/tools/text-over-image-contrast-checker', 'l5', 'Test text placed over photos with the ', 'text over image contrast checker', '.'),

    h2('The bigger picture'),
    p(
      span(
        'Automatic darkening is not new as an idea. Chromium browsers have long had an experimental force-dark option, and Android lets apps darken web content algorithmically. But Safari putting a user-facing version into a mainstream browser is a step change, and it will make visible how many sites never planned for dark mode at all.'
      )
    ),
    p(
      span(
        'There is a useful lesson in it for accessibility teams. Users increasingly view your site through a layer you do not control: zoom, forced colours, text spacing overrides, reader modes, translation, AI summaries, and now automatic dark mode. A design built on solid foundations, with real text instead of images of text, SVG icons, CSS-driven colour tokens and states that do not rely on colour alone, survives those layers. A design held together by pixel-perfect assumptions does not.'
      )
    ),

    h2('Sources'),
    sourceLink('https://webkit.org/blog/18541/introducing-adaptive-dark-mode/', 's1', 'WebKit: Introducing Adaptive Dark Mode (3 November 2026)'),
    sourceLink('https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', 's2', 'W3C: Understanding Success Criterion 1.4.11 Non-text Contrast'),
    sourceLink('https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', 's3', 'W3C: Understanding Success Criterion 1.4.3 Contrast (Minimum)'),
    sourceLink('https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme', 's4', 'MDN: color-scheme'),
    sourceLink('https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark', 's5', 'MDN: light-dark()'),
  ],
}
