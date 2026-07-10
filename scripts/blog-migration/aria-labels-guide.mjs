export default {
  slug: 'aria-labels-guide',
  title: 'ARIA Labels and Attributes: Complete Developer Guide',
  excerpt: 'Master ARIA labels, attributes, and roles for web accessibility. Learn aria-label, aria-labelledby, aria-describedby, and more with practical examples.',
  publishedAt: '2025-11-15T10:00:00Z',
  categoryTitles: ['Development'],
  seo: {
    metaTitle: 'ARIA Labels and Attributes: Developer Guide',
    metaDescription: 'Master ARIA labels, attributes, and roles for web accessibility. Learn aria-label, aria-labelledby, aria-describedby, and more with practical examples.',
    keywords: ['ARIA labels', 'aria-label', 'aria-labelledby', 'aria-describedby', 'ARIA attributes', 'web accessibility', 'screen reader accessibility'],
  },
  body: [
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'What are ARIA Labels?' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: `ARIA (Accessible Rich Internet Applications) labels provide additional semantic information to assistive technologies when HTML alone isn't sufficient. They're essential for complex interactive components and dynamic content.` }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Core ARIA Labeling Attributes' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'aria-label', marks: ['code'] }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Provides an accessible name when no visible text is available.' }] },
    { _type: 'code', language: 'html', code: `<button aria-label="Close dialog">
  <svg>...</svg>
</button>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'aria-labelledby', marks: ['code'] }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'References other elements that serve as the label.' }] },
    { _type: 'code', language: 'html', code: `<h2 id="billing">Billing Address</h2>
<div role="group" aria-labelledby="billing">
  <input type="text" placeholder="Street">
</div>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'aria-describedby', marks: ['code'] }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'References elements that provide additional description.' }] },
    { _type: 'code', language: 'html', code: `<input type="password" aria-describedby="pwd-help">
<div id="pwd-help">
  Must be 8+ characters with one uppercase letter
</div>` },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Common ARIA Patterns' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Form Enhancement' }] },
    { _type: 'code', language: 'html', code: `<label for="email">Email</label>
<input type="email" id="email"
       aria-describedby="email-error"
       aria-invalid="true">
<div id="email-error" role="alert">
  Please enter a valid email address
</div>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Interactive Components' }] },
    { _type: 'code', language: 'html', code: `<button aria-haspopup="listbox"
        aria-expanded="false"
        aria-labelledby="dropdown-label">
  Choose option
</button>` },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Live Regions' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Announce dynamic content changes:' }] },
    { _type: 'code', language: 'html', code: `<div aria-live="polite" id="status">
  <!-- Status updates -->
</div>

<div aria-live="assertive" role="alert">
  <!-- Critical alerts -->
</div>` },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Best Practices' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Use semantic HTML first, enhance with ARIA' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: `Don't change semantic meaning with ARIA roles` }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Test with real screen readers' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Keep ARIA labels concise and descriptive' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Ensure all interactive elements are properly labeled' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Test Your ARIA Implementation' }] },
    { _type: 'block', style: 'normal', markDefs: [{ _key: 'l1', _type: 'link', href: '/tools/accessibility-audit-helper' }], children: [{ _type: 'span', text: 'Use our ' }, { _type: 'span', text: 'Accessibility Audit Helper', marks: ['l1'] }, { _type: 'span', text: ' to check your ARIA implementation and get specific recommendations for improvement.' }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Common Mistakes' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Overusing ARIA when HTML is sufficient' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Using invalid ARIA attribute values' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Breaking semantic meaning with inappropriate roles' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Not testing with assistive technologies' }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Conclusion' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'ARIA labels are powerful tools for accessibility when used correctly. Remember: semantic HTML first, then enhance with ARIA only when necessary. Always test with real assistive technologies.' }] },
  ],
}
