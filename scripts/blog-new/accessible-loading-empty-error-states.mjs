const span = (text, marks = []) => ({ _type: 'span', text, marks })
const block = (style, children, extra = {}) => ({ _type: 'block', style, children, ...extra })
const p = (text) => block('normal', [span(text)])
const h2 = (text) => block('h2', [span(text)])
const h3 = (text) => block('h3', [span(text)])
const item = (text, listItem = 'bullet') => block('normal', [span(text)], { listItem })
const linked = (children, markDefs) => block('normal', children, { markDefs })

export default {
  slug: 'accessible-loading-empty-error-states',
  title: 'Nothing Happened: Accessibility for Loading, Empty, and Error States',
  excerpt: 'The hardest interface to understand is often the one between actions. Make loading, no-results, success, timeout, and error states perceivable without creating noisy announcements.',
  publishedAt: '2026-07-08T14:00:00Z',
  categoryTitles: ['Development', 'Design Systems'],
  seo: {
    metaTitle: 'Accessible Loading, Empty, Success, and Error States',
    metaDescription: 'Design accessible async UI states with useful status messages, stable focus, clear errors, reduced motion, and practical ARIA live-region patterns.',
    keywords: [
      'accessible loading state',
      'accessible error messages',
      'ARIA live region',
      'WCAG status messages',
      'accessible empty state',
      'screen reader loading announcement',
      'accessible skeleton screen',
      'async accessibility',
    ],
  },
  body: [
    p('A user activates Search. The button changes color, cards disappear, a skeleton flashes, and new results arrive. Visually, the sequence may feel obvious. To a screen-reader user, someone at high zoom, or a person who needs more processing time, the same interface can feel like nothing happened and then the page silently rearranged itself.'),
    p('Loading, empty, success, timeout, and error states are not decoration around the product. They are the conversation that tells users whether the product heard them, what it is doing, and what they can do next.'),
    h2('Start with a state model, not an aria-live attribute'),
    p('Before choosing ARIA, list the states the component can enter. A search experience may be idle, loading, partially loaded, successful with results, successful with no results, failed, offline, or timed out. Each state needs a visual message, a programmatic message when appropriate, and a focus decision.'),
    item('Visual message: what can a sighted user see, including at high zoom and with color removed?'),
    item('Programmatic message: what change should assistive technology announce without moving focus?'),
    item('Focus decision: should focus stay where it is, move to a new task, or return after a dismissed layer?'),
    p('Most state changes should not move focus. Search results appearing, an item being saved, or a background upload completing can be announced while the user remains on the control they are using. Move focus only when the next step genuinely requires immediate interaction, such as a blocking error dialog.'),
    h2('Loading: acknowledge the action without narrating the spinner'),
    p('A loading state should confirm that work began and prevent duplicate actions where necessary. Use plain language tied to the task: "Searching products," "Uploading annual-report.pdf," or "Checking contrast." Avoid generic announcements such as "Please wait" when the user may have several processes running.'),
    p('For operations lasting less than a moment, an announcement may create more noise than value. For longer work, announce the start once and the result once. Do not repeatedly announce changing spinner text or every percentage point.'),
    {
      _type: 'code',
      language: 'html',
      filename: 'loading-status.html',
      code: `<button type="submit" aria-describedby="search-status">
  Search
</button>

<p id="search-status" role="status" aria-atomic="true">
  Searching products...
</p>`,
    },
    p('The status role has polite live-region behavior. Put the region in the document before the update occurs so assistive technology can observe its content changing. Replace its text with a concise result such as "18 products found" when the operation completes.'),
    h2('Skeleton screens need meaning outside their animation'),
    p('A skeleton communicates layout visually but usually contains no information for a screen reader. Hide decorative skeleton shapes from the accessibility tree and provide one textual status for the region. Respect reduced-motion preferences and avoid shimmer effects that can distract people with vestibular, attention, or cognitive disabilities.'),
    p('Do not place disabled-looking fake buttons and headings into the focus order. The loading placeholder should not create a temporary navigation structure that vanishes as the user reaches it.'),
    h2('Empty states must explain which kind of empty'),
    p('"No data" can mean at least four things: the user has not created anything, filters removed all matches, data is still syncing, or the request failed. Collapsing these into one empty illustration leaves users guessing.'),
    h3('First-use empty state'),
    p('Explain what belongs here and provide the primary action: "No reports yet. Run your first audit." Keep the action specific and available to keyboard and voice users.'),
    h3('No search results'),
    p('Repeat the query or active filters in text, announce the result count, and provide a direct way to clear or edit filters. Do not silently substitute unrelated results without saying that the criteria changed.'),
    h3('Permission-based empty state'),
    p('If content exists but the user cannot view it, say that access is restricted and identify the next step. "Nothing here" is inaccurate and can cause users to repeat work.'),
    h2('Errors should identify, explain, and preserve'),
    linked(
      [
        span('WCAG requires detected input errors to be identified and described in text. When a correction is known, '),
        span('Error Suggestion', ['errors']),
        span(' requires the interface to provide it unless doing so would compromise security or the purpose of the content.'),
      ],
      [{ _key: 'errors', _type: 'link', href: '/wcag/3-3-3' }],
    ),
    p('A useful error answers three questions: what failed, why if it is safe to say, and what the user can do next. "Something went wrong" answers none of them. "We could not upload annual-report.pdf because it is larger than 20 MB. Choose a smaller file" lets the user recover.'),
    item('Keep valid input. Never erase an entire form because one request failed.'),
    item('Associate field errors with their controls and include a visible text message, not color alone.'),
    item('At submission, provide an error summary that links to each invalid field when the form is long.'),
    item('Move focus only when necessary and tell the user where it moved.'),
    item('For server errors, offer retry, save, contact, or alternate-channel actions that actually work.'),
    h2('Success messages need the same care'),
    p('Silent success creates uncertainty. Users may repeat a payment, upload, or save because they did not perceive the update. Announce the completed action with enough specificity to distinguish it from other work: "Billing address saved" or "Three files uploaded."'),
    p('Do not announce every autosave. A persistent visual "Saved" indicator and announcements only for meaningful transitions or failures usually create a calmer experience.'),
    h2('Prevent live-region noise'),
    p('Live regions are powerful because they interrupt the current reading stream. That is also why they are easy to misuse.'),
    item('Use polite status messages for normal progress and results.'),
    item('Reserve assertive alerts for urgent information that requires immediate attention.'),
    item('Announce the outcome, not every DOM mutation that produced it.'),
    item('Keep one stable region per task instead of mounting many competing regions.'),
    item('Debounce rapidly changing results so typing in a search field does not trigger an announcement after every character.'),
    item('Test the spoken sequence with real screen readers; DOM inspection cannot reveal timing and interruption problems.'),
    h2('A test script for every asynchronous component'),
    item('Activate the control with keyboard and confirm an immediate visible response.', 'number'),
    item('Listen for one useful loading announcement when the wait is meaningful.', 'number'),
    item('Confirm focus remains stable while content updates.', 'number'),
    item('Test results, no results, slow network, offline, timeout, validation error, and server error.', 'number'),
    item('Verify retry does not duplicate the original action or erase user input.', 'number'),
    item('Repeat at 400 percent zoom, with reduced motion, and with a screen reader.', 'number'),
    linked(
      [
        span('Use the '),
        span('accessible forms guide', ['forms']),
        span(' for field-level patterns and the '),
        span('screen-reader testing guide', ['screen']),
        span(' to verify announcement timing.'),
      ],
      [
        { _key: 'forms', _type: 'link', href: '/guides/accessible-forms' },
        { _key: 'screen', _type: 'link', href: '/guides/screen-reader-testing' },
      ],
    ),
    h2('The bottom line'),
    p('The moments between click and result are part of the interface. Name each state, decide what users need to see and hear, keep focus predictable, preserve their work, and make recovery explicit. When the system has nothing to show, it still has something important to say.'),
    h2('Sources'),
    linked(
      [span('W3C WAI: Understanding SC 4.1.3 Status Messages', ['s1'])],
      [{ _key: 's1', _type: 'link', href: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html' }],
    ),
    linked(
      [span('W3C WAI Technique ARIA22: Using role=status', ['s2'])],
      [{ _key: 's2', _type: 'link', href: 'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22' }],
    ),
    linked(
      [span('W3C WAI: Understanding SC 3.3.1 Error Identification', ['s3'])],
      [{ _key: 's3', _type: 'link', href: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html' }],
    ),
  ],
}
