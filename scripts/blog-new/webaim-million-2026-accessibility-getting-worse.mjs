export default {
  slug: 'webaim-million-2026-accessibility-getting-worse',
  title: 'WebAIM Million 2026: Web Accessibility Is Getting Worse',
  excerpt: 'WebAIM Million 2026 found 95.9% of top home pages have WCAG failures, reversing six years of progress. Errors and page bloat both climbed.',
  publishedAt: '2026-05-13T10:00:00Z',
  categoryTitles: ['Industry News'],
  seo: {
    metaTitle: 'WebAIM Million 2026: Accessibility Is Getting Worse',
    metaDescription: 'The WebAIM Million 2026 report found 95.9% of the top home pages have WCAG failures, averaging 56.1 errors per page. The trend reversed after six years.',
    keywords: [
      'WebAIM Million 2026',
      'web accessibility statistics',
      'WCAG failures',
      'low contrast text',
      'alt text',
      'ARIA misuse',
      'accessibility report',
    ],
  },
  body: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The 2026 edition of the WebAIM Million, an annual automated analysis of the top one million home pages, found detectable WCAG 2 failures on 95.9% of pages, up from 94.8% in 2025. That increase is small in absolute terms but significant in direction: it reverses six straight years of modest improvement. The average page carried 56.1 detectable errors, a 10.1% jump from 51 the year before. In short, by the measures WebAIM can automate, the web got less accessible, not more.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'The headline numbers' }],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'WebAIM ran its analysis in February 2026 across the home pages of the top one million websites. The aggregate results paint a discouraging picture:',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: '95.9% of home pages had detectable WCAG 2 failures, up from 94.8% in 2025.',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Errors averaged 56.1 per page, a 10.1% increase over the prior year total of 51, amounting to 56,114,377 distinct errors across the sample.',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The average home page now contains 1,437 elements, a 22.5% jump in a single year and nearly double the count of seven years ago.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'That last figure is a big part of the story. Pages are getting heavier and more complex, and more elements mean more opportunities to introduce barriers. As sites grow, accessibility debt compounds unless teams actively manage it.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Pages are growing faster than accessibility can keep up' }],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The 22.5% single-year jump in average page elements, to 1,437 per home page, deserves attention on its own. Element counts have nearly doubled over seven years, which means the surface area for accessibility defects is expanding rapidly. Every additional interactive control, image, and region is another place where a label can be forgotten, a contrast ratio can slip, or an ARIA attribute can be misused. When complexity grows 22.5% in a year and average errors grow about 10% in the same period, it is easy to see how a small annual decline can turn into a reversal of a long-running trend. Accessibility work that is not continuous simply cannot keep pace with pages that heavy.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'The same six problems, seven years running' }],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Perhaps the most striking finding is how little the nature of the failures has changed. A full 96% of all detected errors fall into just six categories, and they have been the same six categories for seven years:',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      markDefs: [
        { _key: 'c1', _type: 'link', href: '/tools/contrast-checker' },
      ],
      children: [
        { _type: 'span', text: 'Low-contrast text, found on 83.9% of pages. A ' },
        { _type: 'span', text: 'contrast checker', marks: ['c1'] },
        { _type: 'span', text: ' catches these before they ship.' },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      markDefs: [
        { _key: 'c2', _type: 'link', href: '/tools/alt-text-generator' },
      ],
      children: [
        { _type: 'span', text: 'Missing alternative text on images, present on more than half of all pages. Writing good ' },
        { _type: 'span', text: 'alt text', marks: ['c2'] },
        { _type: 'span', text: ' remains a persistent gap.' },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Missing form input labels, affecting 51% of pages.' },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Empty links.' },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Empty buttons.' },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Missing document language.' },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'w1', _type: 'link', href: '/wcag/1-4-3' },
      ],
      children: [
        {
          _type: 'span',
          text: 'None of these is difficult to fix. Contrast issues are addressed by adjusting colors to meet ',
        },
        { _type: 'span', text: 'WCAG 1.4.3', marks: ['w1'] },
        {
          _type: 'span',
          text: ', and labels, alt text, and language attributes are basic markup. The problem is not a lack of technique; it is a lack of consistent attention.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'ARIA is growing, and often making things worse' }],
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'w2', _type: 'link', href: '/wcag/4-1-2' },
        { _key: 'r1', _type: 'link', href: '/reference/aria' },
      ],
      children: [
        {
          _type: 'span',
          text: 'ARIA usage rose 27% year over year, with the average page now carrying roughly 133 ARIA attributes. In theory ARIA should improve the experience for assistive technology users. In practice, pages that used ARIA averaged 59.1 errors, compared with 42 on pages that used no ARIA at all. That gap is a strong signal that ARIA is frequently misapplied. Getting ',
        },
        { _type: 'span', text: 'name, role, and value', marks: ['w2'] },
        { _type: 'span', text: ' right matters, and our ' },
        { _type: 'span', text: 'ARIA reference', marks: ['r1'] },
        { _type: 'span', text: ' underscores the first rule of ARIA: do not use it when native HTML will do the job.' },
      ],
    },
    {
      _type: 'block',
      style: 'blockquote',
      children: [
        {
          _type: 'span',
          text: 'These figures reflect only automatically detectable errors, so the real state of web accessibility is worse than the numbers suggest.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Why it matters' }],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Automated tools can only detect a fraction of WCAG failures, so every number in the WebAIM Million is a floor, not a ceiling. Problems that require human judgment, such as meaningful alt text, logical reading order, and keyboard operability, are not fully captured here. If nearly all of the top home pages fail on the things machines can catch, the barriers a real person encounters are almost certainly greater.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'For teams, the report is a practical roadmap. Because 96% of detectable errors sit in the same six buckets, targeting those categories delivers outsized returns. Add automated contrast and label checks to your build pipeline, enforce alt text and document language in content review, and treat ARIA as a scalpel rather than a default. Given that pages keep growing heavier, accessibility has to be part of everyday development rather than a one-time cleanup.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Sources' }],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      markDefs: [
        { _key: 's1', _type: 'link', href: 'https://webaim.org/projects/million/' },
      ],
      children: [{ _type: 'span', text: 'WebAIM: The WebAIM Million', marks: ['s1'] }],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      markDefs: [
        { _key: 's2', _type: 'link', href: 'https://webaim.org/blog/tolerating-inaccessibility/' },
      ],
      children: [{ _type: 'span', text: 'WebAIM Blog: Tolerating Inaccessibility', marks: ['s2'] }],
    },
  ],
}
