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

export default {
  slug: 'apple-intelligence-image-descriptions-alt-text-obligation',
  authorId: 'author-accessibility-build-team',
  title: 'Apple’s AI Will Describe Your Images. You Still Owe Alt Text.',
  excerpt:
    'Apple Intelligence now lets VoiceOver describe images your site never labelled. That is genuinely useful, and it is not a reason to stop writing alt text. Here is why the obligation did not move.',
  publishedAt: '2026-08-19T07:00:00Z',
  categoryTitles: ['AI & Accessibility', 'Screen Readers'],
  seo: {
    metaTitle: 'Apple Intelligence Image Descriptions vs Your Alt Text Duty',
    metaDescription:
      'Apple’s 2026 AI accessibility features let VoiceOver describe unlabelled images. Why WCAG 1.1.1 still puts alt text on you, and how AI on the device changes the job rather than removing it.',
    keywords: [
      'Apple Intelligence accessibility',
      'VoiceOver image descriptions',
      'AI alt text',
      'WCAG 1.1.1 non-text content',
      'alt text obligation',
      'screen reader AI',
      'accessibility 2026',
      'image accessibility',
    ],
  },
  body: [
    p(
      span(
        'At its 2026 accessibility preview, timed to Global Accessibility Awareness Day, Apple showed VoiceOver Image Explorer describing images the way a sighted friend might: photographs, scanned bills, personal records, all narrated on demand by Apple Intelligence running on the device. Point the camera at something, press the Action button, and ask a follow-up question in plain language. Accessibility Reader will summarise dense material with multiple columns, images and tables. Voice Control now lets people say what they see to drive an app. It is an impressive release, and it is arriving later in 2026 across Apple’s platforms.'
      )
    ),
    p(
      span(
        'The reasonable question a product team asks next is the uncomfortable one: if the user’s phone can now describe an image we forgot to label, do we still have to label it? The answer is yes, without an asterisk. The technology is a gift to users. It is not a transfer of your obligation, and treating it as one will make your site worse for the people it is meant to help.'
      )
    ),

    h2('Machine sight is not authorial intent'),
    p(
      span(
        'An on-device model describes what a picture looks like. Alt text describes what a picture means in its context, which is a different and usually smaller thing. A product photo does not need "a woman with brown hair standing against a grey wall." It needs "Ellis floral midi dress, knee length." The model cannot know the product name, that the size chart matters more than the model’s pose, or that the swatch beside it is the colour being sold. It is guessing at pixels. You are stating a fact about your catalogue.'
      )
    ),
    p(
      span(
        'The gap widens the moment an image carries information rather than decoration. A chart’s alt text should give the trend and the numbers, not "a line going up." A logo that is also a home link needs the destination, not a description of the mark. A diagram needs the relationship it encodes. AI narration is a plausible-sounding paraphrase of the surface. For anything load-bearing, plausible is exactly the wrong target.'
      )
    ),

    h2('It also cannot tell decorative from meaningful'),
    p(
      span(
        'Half of good alt text is knowing when to write none. A decorative flourish, a background texture, a spacer, should be marked so a screen reader skips it entirely. Hand that judgment to a general-purpose describer and it will dutifully narrate the texture, because it has no way to know the texture means nothing. The result is not silence where silence belongs, it is noise. A page where the AI reads every decorative image aloud is more tiring to use, not less.'
      )
    ),

    h2('Not everyone is holding the latest phone'),
    p(
      span(
        'Even if the descriptions were perfect, relying on them quietly redraws your audience. These features need current Apple hardware, a recent OS, the right language support, and a user who has turned them on. That leaves out Android and Windows users, people on older devices, anyone on a screen reader that does not ship this capability, and everyone browsing in a language the model handles poorly. Accessibility that only works on this year’s iPhone is not accessibility, it is a demo.'
      )
    ),

    h2('WCAG did not move, and neither did the law'),
    p(
      span(
        'Success Criterion 1.1.1, Non-text Content, places the duty on the content, not on the visitor’s assistive technology. The text alternative is something the author provides. Nothing in WCAG 2.2, the European Accessibility Act, or the ADA says a page is conformant because a particular user’s phone can reconstruct the missing information. The accessibility support baseline in any serious audit names real browsers and assistive technologies, and it assumes the page carries its own meaning rather than outsourcing it to whatever the reader happens to own.'
      )
    ),
    p(
      span(
        'There is a deeper reason this matters. Alt text is not a fallback for blind users to be tolerated, it is structured information about your own content. It feeds search engines, it survives when images fail to load, it drives the reading order, and now it is the ground truth that a good AI description should agree with. Outsourcing it does not just fail a criterion, it throws away data you own.'
      )
    ),

    h2('The right way to use this'),
    p(
      span(
        'Apple Intelligence should raise your standard, not lower your effort. When users can instantly compare your alt text against an AI’s honest guess, thin or wrong alternatives get more obvious, not less. Use the moment to do the boring work well.'
      )
    ),
    plainBullet('Write alt text that states the meaning in context, and keep it short.'),
    plainBullet('Mark genuinely decorative images as decorative so screen readers, and the AI, leave them alone.'),
    plainBullet('Give charts and infographics a real text alternative with the actual numbers.'),
    plainBullet('Label every control by its function, because no image describer fixes an unnamed button.'),
    plainBullet('Test with a real screen reader, then let the AI description be a bonus on top of a page that already worked without it.'),
    p(
      span(
        'The best outcome of smarter assistive technology is that it makes lazy content stand out. Meet it with content that was already right, and your users get the description you intended plus the one their device can add. Lean on it instead, and you have simply moved your accessibility offsite, onto a phone you do not control, for an audience you just narrowed.'
      )
    ),

    linkBullet('/wcag/1-1-1', 'l1', 'Read what the standard actually requires in ', 'WCAG 1.1.1 Non-text Content', '.'),
    linkBullet('/guides/voiceover-screen-reader-testing', 'l2', 'Hear your own images the way users do with our ', 'VoiceOver testing guide', '.'),
    linkBullet('/guides/screen-reader-testing', 'l3', 'Build a repeatable check across readers in the ', 'screen reader testing guide', '.'),
    linkBullet('/guides/using-aria', 'l4', 'Get names and roles right on your controls with ', 'using ARIA', '.'),

    h2('Sources'),
    sourceLink('https://www.apple.com/newsroom/2026/05/apple-unveils-new-accessibility-features-and-updates-with-apple-intelligence/', 's1', 'Apple Newsroom: Apple unveils new accessibility features, with Apple Intelligence, 2026'),
    sourceLink('https://techcrunch.com/2026/05/19/apple-announces-apple-intelligence-powered-accessibility-feature-updates/', 's2', 'TechCrunch: Apple announces Apple Intelligence-powered accessibility feature updates, 19 May 2026'),
    sourceLink('https://www.macrumors.com/2026/05/19/new-accessibility-features-with-apple-intelligence/', 's3', 'MacRumors: Apple previews new accessibility features powered by Apple Intelligence'),
    sourceLink('https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html', 's4', 'W3C: Understanding SC 1.1.1: Non-text Content'),
  ],
}
