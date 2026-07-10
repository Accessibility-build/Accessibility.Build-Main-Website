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
const plainBullet = (t) => bullet([span(t)])

export default {
  slug: 'website-accessibility-compliance',
  title: 'Website Accessibility Compliance: ADA & WCAG Guide',
  excerpt:
    'Complete guide to website accessibility compliance including ADA requirements, WCAG standards, legal obligations, and practical implementation strategies.',
  publishedAt: '2025-11-15T10:00:00Z',
  categoryTitles: ['WCAG Guidelines'],
  seo: {
    metaTitle: 'Website Accessibility Compliance: ADA & WCAG Guide',
    metaDescription:
      'Complete guide to website accessibility compliance including ADA requirements, WCAG standards, legal obligations, and practical implementation strategies.',
    keywords: [
      'website accessibility compliance',
      'ADA compliance',
      'WCAG compliance',
      'accessibility laws',
      'digital accessibility requirements',
      'accessibility legal requirements',
    ],
  },
  body: [
    h2('Understanding Accessibility Compliance'),
    p(
      span(
        "Website accessibility compliance ensures your digital content is usable by people with disabilities. It's not just good practice—it's increasingly required by law."
      )
    ),

    h2('Key Compliance Standards'),
    h3('Americans with Disabilities Act (ADA)'),
    plainBullet('Applies to businesses open to the public'),
    plainBullet('No specific technical standards, but courts reference WCAG'),
    plainBullet('Increasing litigation - 4,605 lawsuits in 2023'),

    h3('WCAG 2.2 Standards'),
    term('Level AA:', ' Industry standard for compliance'),
    term('Four principles:', ' Perceivable, Operable, Understandable, Robust'),
    term('New criteria:', ' Focus appearance, target size, dragging movements'),

    h3('Section 508 (Federal Agencies)'),
    plainBullet('Mandates WCAG 2.0 Level AA'),
    plainBullet('Applies to federal websites and technology'),
    plainBullet('Procurement requirements for vendors'),

    h2('Who Must Comply?'),
    term('All businesses:', ' Places of public accommodation'),
    term('Government entities:', ' Federal, state, local websites'),
    term('Educational institutions:', ' Title II and III requirements'),
    term('Healthcare:', ' Patient portal accessibility'),
    term('Financial services:', ' Online banking and services'),

    h2('Compliance Checklist'),
    h3('Essential Requirements'),
    plainBullet('✓ All images have alt text'),
    plainBullet('✓ Sufficient color contrast (4.5:1)'),
    plainBullet('✓ Keyboard navigation works'),
    plainBullet('✓ Forms have proper labels'),
    plainBullet('✓ Videos have captions'),
    plainBullet('✓ Headings are properly structured'),
    plainBullet('✓ Focus indicators are visible'),
    plainBullet('✓ No content flashes more than 3 times/second'),

    h2('Implementation Strategy'),
    numTerm('Audit current state:', ' Identify accessibility barriers'),
    numTerm('Prioritize fixes:', ' Address critical issues first'),
    numTerm('Update processes:', ' Include accessibility in workflow'),
    numTerm('Train teams:', ' Educate designers and developers'),
    numTerm('Monitor ongoing:', ' Regular testing and updates'),

    h3('⚖️ Legal Protection'),
    {
      _type: 'block',
      style: 'normal',
      markDefs: [{ _key: 'l1', _type: 'link', href: '/tools/accessibility-audit-helper' }],
      children: [
        span('Use our '),
        span('Accessibility Audit Helper', ['l1']),
        span(
          ' to identify compliance issues and get specific remediation steps to protect your organization.'
        ),
      ],
    },

    h2('Cost of Non-Compliance'),
    term('Legal fees:', ' $50,000-$500,000+ per lawsuit'),
    term('Settlement costs:', ' $10,000-$100,000+ typical range'),
    term('Lost customers:', ' 71% of users with disabilities leave inaccessible sites'),
    term('Reputation damage:', ' Public accessibility failures impact brand'),

    h2('Creating an Accessibility Statement'),
    p(span('Include these elements:')),
    plainBullet('Commitment to accessibility'),
    plainBullet('Conformance level (WCAG 2.2 Level AA)'),
    plainBullet('Contact information for accessibility issues'),
    plainBullet('Feedback mechanism'),
    plainBullet('Date of last review'),

    h2('Maintaining Compliance'),
    plainBullet('Regular accessibility audits'),
    plainBullet('User testing with disabled users'),
    plainBullet('Staff training and awareness'),
    plainBullet('Accessibility-first design process'),
    plainBullet('Automated testing in CI/CD pipeline'),

    h2('Conclusion'),
    p(
      span(
        'Accessibility compliance is both a legal requirement and business opportunity. Start with WCAG 2.2 Level AA, prioritize user experience, and make accessibility part of your organizational culture.'
      )
    ),
  ],
}
