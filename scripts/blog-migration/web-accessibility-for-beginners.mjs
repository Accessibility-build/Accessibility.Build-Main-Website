// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const h3 = (t) => block('h3', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const number = (children) => ({ _type: 'block', listItem: 'number', style: 'normal', children })
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const numTerm = (label, rest) => number([span(label, ['strong']), span(rest)])
const numStrong = (t) => number([span(t, ['strong'])])
const plainBullet = (t) => bullet([span(t)])
const code = (language, codeStr) => ({ _type: 'code', language, code: codeStr })

export default {
  slug: 'web-accessibility-for-beginners',
  title: 'Web Accessibility for Beginners: Getting Started Guide',
  excerpt:
    'Learn web accessibility fundamentals, WCAG basics, and practical implementation tips. Perfect step-by-step guide for developers, designers, and content creators new to accessibility.',
  publishedAt: '2024-01-12T10:00:00Z',
  categoryTitles: ['WCAG Guidelines'],
  seo: {
    metaTitle: 'Web Accessibility for Beginners: Getting Started Guide',
    metaDescription:
      'Learn web accessibility fundamentals, WCAG basics, and practical tips. A step-by-step starter guide for developers, designers, and content creators.',
    keywords: [
      'web accessibility for beginners',
      'accessibility basics',
      'WCAG for beginners',
      'accessible web design',
      'accessibility fundamentals',
      'inclusive design basics',
      'accessibility tutorial',
    ],
  },
  body: [
    h2('What is Web Accessibility?'),
    p(
      span(
        'Web accessibility means designing and developing websites that can be used by everyone, including people with disabilities. It ensures that all users can perceive, understand, navigate, and interact with web content effectively, regardless of their abilities or the technologies they use.'
      )
    ),
    p(
      span(
        'Think of web accessibility as building ramps alongside stairs - it provides alternative ways for everyone to access the same destination.'
      )
    ),

    h2('Why Does Accessibility Matter?'),
    term('Inclusion:', ' 1 in 4 adults in the US has a disability, representing 61 million people'),
    term('Legal compliance:', ' Required by laws like ADA, Section 508, and international accessibility legislation'),
    term('Better user experience:', ' Accessible design benefits everyone, not just people with disabilities'),
    term('SEO benefits:', ' Many accessibility practices improve search engine rankings'),
    term('Market reach:', ' Expands your potential audience and customer base'),
    term('Ethical responsibility:', ' Creating inclusive digital experiences is the right thing to do'),

    h2('Understanding Different Types of Disabilities'),
    p(
      span(
        "To create accessible websites, it's important to understand the different types of disabilities and how they affect web usage:"
      )
    ),
    h3('Visual Disabilities'),
    term('Blindness:', ' Cannot see content, relies on screen readers'),
    term('Low vision:', ' Partial sight, may use magnification or high contrast'),
    term('Color blindness:', ' Difficulty distinguishing certain colors'),
    term('Light sensitivity:', ' Discomfort with bright lights or certain color combinations'),

    h3('Hearing Disabilities'),
    term('Deafness:', ' Cannot hear audio content, needs captions or transcripts'),
    term('Hard of hearing:', ' Partial hearing loss, benefits from captions and clear audio'),
    term('Auditory processing disorders:', ' Difficulty processing audio information'),

    h3('Motor/Mobility Disabilities'),
    term('Limited fine motor control:', ' Difficulty with precise mouse movements'),
    term('Inability to use a mouse:', ' Relies on keyboard or alternative input devices'),
    term('Tremors or muscle weakness:', ' May accidentally trigger interface elements'),
    term('Paralysis:', ' May use specialized input devices or voice control'),

    h3('Cognitive Disabilities'),
    term('Learning disabilities:', ' Difficulty processing or understanding information'),
    term('Memory issues:', ' Trouble remembering information or steps in a process'),
    term('Attention disorders:', ' Difficulty focusing or easily distracted by moving elements'),
    term('Executive function disorders:', ' Challenges with planning and decision-making'),

    h2('Introduction to WCAG (Web Content Accessibility Guidelines)'),
    p(
      span(
        'The Web Content Accessibility Guidelines (WCAG) provide the international standard for making web content accessible. WCAG 2.2 is the current version, organized around four fundamental principles:'
      )
    ),
    h3('1. Perceivable'),
    p(
      span(
        'Information and user interface components must be presentable to users in ways they can perceive.'
      )
    ),
    term('Provide alternative text for images:', ' Describe the content and function of images'),
    term('Ensure sufficient color contrast:', ' Text must be readable against background colors'),
    term('Make content adaptable:', ' Information should be available in different presentations'),
    term('Provide captions for videos:', ' Include captions and transcripts for multimedia'),

    h3('2. Operable'),
    p(span('User interface components and navigation must be operable by all users.')),
    term('Make all functionality keyboard accessible:', " Don't require a mouse"),
    term('Give users enough time:', " Don't use time limits unless necessary"),
    term('Don\'t cause seizures:', ' Avoid flashing content that could trigger seizures'),
    term('Help users navigate:', ' Provide clear navigation and ways to find content'),

    h3('3. Understandable'),
    p(span('Information and the operation of the user interface must be understandable.')),
    term('Make text readable:', ' Use clear language and define unusual words'),
    term('Make content predictable:', ' Pages should behave consistently'),
    term('Help users avoid mistakes:', ' Provide clear instructions and error messages'),
    term('Provide input assistance:', ' Help users complete forms successfully'),

    h3('4. Robust'),
    p(span('Content must be robust enough to work with various assistive technologies.')),
    term('Use valid, semantic HTML:', ' Write clean, standards-compliant code'),
    term('Ensure compatibility:', ' Test with different browsers and assistive technologies'),
    term('Future-proof your code:', ' Use technologies that will remain accessible as they advance'),

    h2('WCAG Conformance Levels'),
    p(span('WCAG has three levels of conformance:')),
    term('Level A:', ' Basic accessibility features (minimum level)'),
    term('Level AA:', ' Standard accessibility features (recommended for most websites)'),
    term('Level AAA:', ' Enhanced accessibility features (required for specialized content)'),
    p(
      span(
        'Most organizations aim for WCAG 2.2 Level AA compliance as it provides a good balance of accessibility and practical implementation.'
      )
    ),

    h2('Getting Started: 10 Easy Accessibility Wins'),
    p(span("Here are 10 simple changes you can make today to improve your website's accessibility:")),
    numStrong('Add alt text to images:'),
    code('html', '<img src="photo.jpg" alt="Team of five developers working together at a conference table">'),
    numTerm('Use proper heading structure:', ' Structure content with H1-H6 tags in hierarchical order (only one H1 per page)'),
    numTerm('Ensure color contrast:', ' Use 4.5:1 ratio for normal text, 3:1 for large text (18pt+ or 14pt+ bold)'),
    numStrong('Label form fields properly:'),
    code('html', '<label for="email">Email Address</label>\n<input type="email" id="email" required>'),
    numTerm('Make links descriptive:', ' Instead of "click here," use "Download the 2024 accessibility report (PDF, 2MB)"'),
    numTerm('Add focus indicators:', ' Show visual indication when elements receive keyboard focus'),
    numTerm('Test keyboard navigation:', ' Use Tab, Shift+Tab, Enter, and arrow keys to navigate your site'),
    numTerm('Provide video captions:', ' Include captions and transcripts for all video content'),
    numTerm('Use semantic HTML:', ' Choose elements based on meaning (button, nav, main, article) not appearance'),
    numTerm('Test with screen readers:', ' Try NVDA (free for Windows) or VoiceOver (built into Mac)'),

    h2('Essential Tools for Beginners'),
    h3('Free Accessibility Testing Tools'),
    term('axe DevTools:', ' Browser extension for automated accessibility testing'),
    term('WAVE:', ' Web accessibility evaluation tool by WebAIM'),
    term('Lighthouse:', ' Built into Chrome DevTools, includes accessibility audit'),
    term('Color Oracle:', ' Color blindness simulator'),
    term('Contrast ratio checkers:', ' Various online tools to test color contrast'),

    h3('Screen Reader Software'),
    term('NVDA (Windows):', ' Free and powerful screen reader'),
    term('VoiceOver (Mac):', ' Built into macOS and iOS'),
    term('JAWS (Windows):', ' Professional screen reader (paid)'),
    term('TalkBack (Android):', ' Built into Android devices'),

    h2('Common Accessibility Mistakes to Avoid'),
    term('Using placeholder text as labels:', ' Placeholders disappear when users start typing'),
    term('Relying only on color:', " Don't use color alone to convey important information"),
    term('Creating keyboard traps:', ' Ensure users can navigate away from all elements'),
    term('Using generic link text:', ' "Click here" and "Read more" don\'t provide context'),
    term('Ignoring focus management:', ' Properly manage focus when content changes dynamically'),
    term('Assuming automated testing is enough:', ' Combine automated tools with manual testing'),
    term('Making custom components inaccessible:', ' Ensure custom elements work with assistive technology'),

    h2('Building Your Accessibility Knowledge'),
    h3('Recommended Learning Resources'),
    term('Web Accessibility Initiative (WAI):', ' Official WCAG documentation and tutorials'),
    term('The A11Y Project:', ' Community-driven accessibility checklist and resources'),
    term('WebAIM:', ' Practical accessibility guidance and training materials'),
    term('Deque University:', ' Comprehensive accessibility training courses'),
    term('Accessibility.build:', ' Practical tools and guides for implementing accessibility'),

    h3('Hands-On Practice Exercises'),
    numTerm('Audit a website:', ' Use axe DevTools to audit an existing website and identify issues'),
    numTerm('Navigate with keyboard only:', ' Try using a website using only Tab, Enter, and arrow keys'),
    numTerm('Experience a screen reader:', ' Browse with NVDA or VoiceOver for 10-15 minutes'),
    numTerm('Check color contrast:', ' Use our contrast checker tool on your current project'),
    numTerm('Review form accessibility:', ' Analyze the accessibility of forms on sites you use regularly'),
    numTerm('Test mobile accessibility:', ' Check how your site works with mobile screen readers'),

    h3('🚀 Start Your Accessibility Journey Today'),
    {
      _type: 'block',
      style: 'normal',
      markDefs: [{ _key: 'l1', _type: 'link', href: '/tools/accessibility-audit-helper' }],
      children: [
        span('Ready to put these concepts into practice? Try our '),
        span('AI Accessibility Audit Helper', ['l1']),
        span(
          " to get personalized recommendations for improving your website's accessibility. It's perfect for beginners and provides step-by-step guidance."
        ),
      ],
    },

    h2('Creating an Accessibility Mindset'),
    p(span('True accessibility starts with changing how you think about design and development:')),
    term('Consider accessibility from the start:', " Don't treat it as an afterthought"),
    term('Think about diverse users:', ' Consider how different people might use your site'),
    term('Test early and often:', ' Build accessibility testing into your workflow'),
    term('Learn from the community:', ' Connect with disabled users and accessibility advocates'),
    term('Stay curious:', ' Accessibility is an evolving field with ongoing innovations'),

    h2('Your Next Steps'),
    p(span("Now that you understand the basics, here's how to continue your accessibility journey:")),
    numTerm('Start with automated testing:', ' Install axe DevTools and run it on your current projects'),
    numTerm('Learn to use a screen reader:', ' Spend time each week practicing with NVDA or VoiceOver'),
    numTerm('Practice keyboard navigation:', ' Make it a habit to test keyboard access on all projects'),
    numTerm('Join accessibility communities:', ' Follow accessibility experts and participate in discussions'),
    numTerm('Make accessibility part of your process:', ' Include accessibility considerations in planning and design'),
    numTerm('Keep learning:', ' Accessibility standards and best practices continue to evolve'),

    h2('Remember: Progress Over Perfection'),
    p(
      span(
        "Accessibility is a journey, not a destination. You don't need to learn everything at once or achieve perfect accessibility immediately. Start with the basics, be consistent in your efforts, and gradually build your expertise."
      )
    ),
    p(
      span(
        "Every small improvement makes a difference. By implementing even basic accessibility features, you're helping create a more inclusive web for everyone."
      )
    ),
    block('blockquote', [
      span(
        '"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect."',
        ['strong']
      ),
      span(' - Tim Berners-Lee, W3C Director and inventor of the World Wide Web'),
    ]),
  ],
}
