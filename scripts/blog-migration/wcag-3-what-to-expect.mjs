// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const h3 = (t) => block('h3', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
// A bullet whose text starts with a bold "Label:" then normal text
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
// A bullet that is entirely bold
const strongBullet = (t) => bullet([span(t, ['strong'])])
const plainBullet = (t) => bullet([span(t)])

export default {
  slug: 'wcag-3-what-to-expect',
  title: 'WCAG 3.0: What to Expect from the New Standard',
  excerpt:
    'Explore WCAG 3.0 updates including new outcomes-based approach, bronze/silver/gold levels, and how to prepare for the next generation of accessibility guidelines.',
  publishedAt: '2025-11-15T10:00:00Z',
  categoryTitles: ['WCAG Guidelines'],
  seo: {
    metaTitle: 'WCAG 3.0: What to Expect from the New Standard',
    metaDescription:
      "Explore WCAG 3.0's outcomes-based approach, bronze/silver/gold levels, and how to prepare for next-generation accessibility guidelines.",
    keywords: [
      'WCAG 3.0',
      'WCAG 3 updates',
      'future accessibility standards',
      'WCAG silver guidelines',
      'accessibility 3.0',
      'next generation WCAG',
    ],
  },
  body: [
    h2('WCAG 3.0 Overview'),
    p(
      span(
        'WCAG 3.0 (formerly known as "Silver") represents a fundamental shift in how we approach web accessibility standards. Currently in working draft status, it introduces outcome-based testing and a more flexible scoring system.'
      )
    ),

    h2('Key Changes from WCAG 2.x'),
    h3('1. Outcome-Based Approach'),
    term('Current (WCAG 2.x):', ' Pass/fail based on technical compliance'),
    term('WCAG 3.0:', ' Scoring based on actual user outcomes'),
    term('Benefit:', ' Better correlation with real accessibility impact'),

    h3('2. New Conformance Levels'),
    term('Bronze:', ' Minimum accessibility (roughly equivalent to AA)'),
    term('Silver:', ' Good accessibility with user testing'),
    term('Gold:', ' Advanced accessibility with comprehensive testing'),

    h3('3. Scoring System'),
    plainBullet('Numerical scores instead of binary pass/fail'),
    plainBullet('Weighted scores based on impact on users'),
    plainBullet('Ability to compensate for some issues with excellence in others'),

    h2('Major WCAG 3.0 Features'),
    h3('Functional Categories'),
    p(span('WCAG 3.0 organizes guidelines into functional categories:')),
    strongBullet('Text alternatives'),
    strongBullet('Captions'),
    strongBullet('Visual contrast'),
    strongBullet('Audio contrast'),
    strongBullet('Clear language'),
    strongBullet('Structure'),
    strongBullet('Interaction'),
    strongBullet('Navigation'),
    strongBullet('Focus'),

    h3('Multiple Ways to Conform'),
    p(span('WCAG 3.0 recognizes different approaches to achieving accessibility:')),
    term('Technical compliance:', ' Meeting specific technical requirements'),
    term('User testing:', ' Demonstrated success with disabled users'),
    term('Expert review:', ' Professional accessibility evaluation'),

    h2("What's New in WCAG 3.0"),
    h3('Content Areas'),
    p(span('Expanded scope beyond just web content:')),
    strongBullet('Web content and applications'),
    strongBullet('Mobile applications'),
    strongBullet('Desktop applications'),
    strongBullet('Virtual and augmented reality'),
    strongBullet('Digital publications'),

    h3('New Guidelines'),
    term('Audio contrast:', ' Requirements for audio accessibility'),
    term('Clear language:', ' More specific guidance on cognitive accessibility'),
    term('Interaction methods:', ' Support for various input devices'),
    term('Personalization:', ' User customization capabilities'),

    h2('Timeline and Current Status'),
    term('2019:', ' First working draft published'),
    term('2021-2023:', ' Multiple working drafts and refinements'),
    term('2024:', ' Continued development and testing'),
    term('Expected:', ' Candidate recommendation in 2025-2026'),
    term('Adoption:', ' Widespread adoption likely 2027-2030'),

    h2('How to Prepare for WCAG 3.0'),
    h3('Continue with WCAG 2.2'),
    plainBullet('WCAG 2.x will remain relevant for years'),
    plainBullet('Focus on achieving WCAG 2.2 Level AA compliance'),
    plainBullet('Build strong accessibility foundations'),
    plainBullet('Implement user testing practices'),

    h3('Start Outcome-Based Thinking'),
    plainBullet('Focus on user experience, not just technical compliance'),
    plainBullet('Include disabled users in design and testing'),
    plainBullet('Document accessibility outcomes and benefits'),
    plainBullet('Measure effectiveness of accessibility features'),

    h3('Expand Testing Methods'),
    plainBullet('Combine automated testing with manual review'),
    plainBullet('Include usability testing with disabled users'),
    plainBullet('Work with accessibility experts'),
    plainBullet('Test across different devices and platforms'),

    h2('Potential Challenges'),
    h3('Implementation Complexity'),
    plainBullet('More complex scoring system'),
    plainBullet('Need for user testing capabilities'),
    plainBullet('Requirement for accessibility expertise'),
    plainBullet('Higher testing costs'),

    h3('Industry Adoption'),
    plainBullet('Legal systems may be slow to adopt'),
    plainBullet('Training needs for accessibility professionals'),
    plainBullet('Tool development for new testing methods'),
    plainBullet('Transition period management'),

    h2('Opportunities with WCAG 3.0'),
    h3('Better Accessibility Outcomes'),
    plainBullet('Focus on real user benefits'),
    plainBullet('Recognition of good practices beyond minimum compliance'),
    plainBullet('Flexibility in achieving accessibility goals'),
    plainBullet('Innovation in accessibility solutions'),

    h3('Expanded Scope'),
    plainBullet('Consistent standards across platforms'),
    plainBullet('Future-ready for emerging technologies'),
    plainBullet('Better support for cognitive accessibility'),
    plainBullet('Personalization and user preferences'),

    h3('🚀 Stay Prepared'),
    {
      _type: 'block',
      style: 'normal',
      markDefs: [{ _key: 'l1', _type: 'link', href: '/tools/accessibility-audit-helper' }],
      children: [
        span(
          'While WCAG 3.0 is still in development, focus on building strong WCAG 2.2 compliance and user-centered accessibility practices. Use our '
        ),
        span('Accessibility Audit Helper', ['l1']),
        span(' to ensure current compliance.'),
      ],
    },

    h2('Frequently Asked Questions'),
    h3('When will WCAG 3.0 be final?'),
    p(
      span(
        'WCAG 3.0 is expected to reach candidate recommendation status in 2025-2026, with widespread adoption likely beginning in 2027-2030.'
      )
    ),
    h3('Will WCAG 2.x become obsolete?'),
    p(
      span(
        'No, WCAG 2.x guidelines will remain valid and widely used for many years. Organizations should continue focusing on WCAG 2.2 compliance.'
      )
    ),
    h3('How different will WCAG 3.0 testing be?'),
    p(
      span(
        'WCAG 3.0 will require more comprehensive testing including user testing, but automated testing and expert review will still be important components.'
      )
    ),

    h2('Preparing Your Organization'),
    h3('Build Accessibility Capability'),
    plainBullet('Develop in-house accessibility expertise'),
    plainBullet('Establish relationships with disabled user communities'),
    plainBullet('Create user testing capabilities'),
    plainBullet('Document current accessibility practices'),

    h3('Future-Proof Your Approach'),
    plainBullet('Focus on user outcomes in accessibility work'),
    plainBullet('Implement comprehensive testing strategies'),
    plainBullet('Stay current with WCAG 3.0 development'),
    plainBullet('Plan for gradual transition when standards mature'),

    h2('Conclusion'),
    p(
      span(
        'WCAG 3.0 represents an evolution toward more user-centered accessibility standards. While still in development, it signals a future where accessibility success is measured by actual user outcomes rather than just technical compliance.'
      )
    ),
    p(
      span(
        'Organizations should continue focusing on WCAG 2.2 compliance while beginning to adopt outcome-based thinking and user testing practices that will be central to WCAG 3.0 success.'
      )
    ),
  ],
}
