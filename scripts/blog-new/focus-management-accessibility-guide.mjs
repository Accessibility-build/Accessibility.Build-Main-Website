const span = (text, marks = []) => ({ _type: 'span', text, marks })
const block = (style, children, extra = {}) => ({ _type: 'block', style, children, ...extra })
const p = (text) => block('normal', [span(text)])
const h2 = (text) => block('h2', [span(text)])
const h3 = (text) => block('h3', [span(text)])
const item = (text, listItem = 'bullet') => block('normal', [span(text)], { listItem })
const linked = (children, markDefs) => block('normal', children, { markDefs })

export default {
  slug: 'focus-management-accessibility-guide',
  title: 'Focus Management: The Accessibility Skill Most Developers Skip',
  excerpt: 'Where keyboard focus goes after a click, a route change, or a closed dialog decides whether your app is usable. A practical guide to focus order, focus-visible, focus trapping, roving tabindex, and restoring focus — with copy-paste patterns.',
  publishedAt: '2026-07-11T14:00:00Z',
  categoryTitles: ['Development', 'WCAG Guidelines'],
  seo: {
    metaTitle: 'Focus Management in Web Accessibility: A Developer Guide',
    metaDescription: 'Learn keyboard focus management for accessible apps: focus order, :focus-visible, focus trapping in modals, roving tabindex, skip links, and restoring focus after route changes.',
    keywords: [
      'focus management accessibility',
      'keyboard focus management',
      'focus trap',
      'roving tabindex',
      'focus-visible',
      'restore focus after modal',
      'focus management react',
      'skip link',
      'tabindex accessibility',
      'WCAG 2.4.3 focus order',
    ],
  },
  body: [
    p('Most accessibility work is about what the user can see and read. Focus management is about something quieter: where the keyboard is right now. When someone navigates with the Tab key, a screen reader, a switch device, or voice control, the focused element is their cursor, their pointer, and their sense of place all at once. Move it carelessly — or lose track of it entirely — and the interface becomes a maze.'),
    p('This guide covers the focus decisions that come up in real applications: styling the focus indicator, ordering focusable elements, sending focus into and out of dialogs, building composite widgets, and putting focus somewhere sensible after a single-page route change. Every pattern here is something you can apply the same afternoon.'),
    h2('What "focus" actually is'),
    p('Exactly one element in a document holds keyboard focus at any time — you can read it in JavaScript as document.activeElement. Focus is what receives key events, what a screen reader announces as you move, and what a browser scrolls into view. Interactive HTML elements (links, buttons, inputs, selects, textareas) are focusable by default and appear in the tab order. Everything else is not, unless you opt in with tabindex.'),
    p('The three rules of tabindex are short and rarely bent:'),
    item('tabindex="0" adds an element to the natural tab order, in DOM position. Use it for custom interactive components built from non-interactive elements.'),
    item('tabindex="-1" makes an element programmatically focusable — you can call .focus() on it — but keeps it out of the Tab sequence. This is the workhorse of focus management.'),
    item('A positive tabindex ("1" or higher) forces an element earlier in the tab order than the DOM would suggest. It almost always creates surprises for other elements on the page. Treat it as an anti-pattern.'),
    h2('Rule one: never delete the focus indicator'),
    linked(
      [
        span('The single most common accessibility regression is the CSS reset that removes the focus outline. WCAG 2.2 '),
        span('Success Criterion 2.4.7 Focus Visible', ['sc247']),
        span(' requires a visible indicator on any keyboard-focusable element, and 2.4.11 Focus Not Obscured means that indicator must not be hidden behind sticky headers, cookie bars, or other overlays.'),
      ],
      [{ _key: 'sc247', _type: 'link', href: '/wcag/2-4-7' }],
    ),
    p('The fix is not to keep the browser default forever; it is to design a deliberate indicator and show it when it matters. The :focus-visible pseudo-class lets you show a strong ring for keyboard users while suppressing it for mouse clicks, which is usually why teams removed the outline in the first place.'),
    {
      _type: 'code',
      language: 'css',
      filename: 'focus.css',
      code: `/* Never do this on its own */
:focus { outline: none; }

/* Do this instead: a clear, non-color-only indicator */
:focus-visible {
  outline: 3px solid #1a56db;
  outline-offset: 2px;
  border-radius: 3px;
}

/* Keep a fallback for browsers without :focus-visible */
:focus:not(:focus-visible) { outline: none; }`,
    },
    linked(
      [
        span('Give the ring enough contrast against both the component and the page background, and at least a 3:1 contrast ratio to satisfy '),
        span('SC 1.4.11 Non-text Contrast', ['sc1411']),
        span('. An outline plus an offset reads clearly on light and dark surfaces without relying on color alone.'),
      ],
      [{ _key: 'sc1411', _type: 'link', href: '/wcag/1-4-11' }],
    ),
    h2('Rule two: keep the tab order logical'),
    linked(
      [
        span('SC 2.4.3 Focus Order', ['sc243']),
        span(' requires that focus moves in an order that preserves meaning and operability. In practice, that means your DOM order should match your visual reading order. When you reposition content with CSS — flexbox order, grid placement, absolute positioning — the tab sequence still follows the DOM, so a visually top-right button might receive focus last.'),
      ],
      [{ _key: 'sc243', _type: 'link', href: '/wcag/2-4-3' }],
    ),
    item('Order elements in the DOM the way they should be read and operated, then style position with CSS.'),
    item('Avoid the CSS order and grid-placement properties for anything interactive unless the visual and DOM order still agree.'),
    item('Never use positive tabindex to patch a broken order — fix the DOM instead.'),
    item('When new content appears (an expanded panel, an inserted row), make sure it lands in a sensible place in the sequence rather than at the end of the page.'),
    h2('Skip links: the fastest win'),
    p('A keyboard user should not have to tab through fifty navigation links to reach the main content on every page. A skip link is the first focusable element on the page; it is visually hidden until focused, and it moves focus to the main region when activated.'),
    {
      _type: 'code',
      language: 'html',
      filename: 'skip-link.html',
      code: `<a class="skip-link" href="#main">Skip to main content</a>
<!-- ... header, nav ... -->
<main id="main" tabindex="-1">
  <!-- page content -->
</main>`,
    },
    p('The tabindex="-1" on the target matters: without it, some browsers move the document position but not keyboard focus, so the next Tab press starts from the top again. Style the link to sit off-screen and animate into view on :focus so sighted keyboard users can see where they are jumping.'),
    h2('Focus trapping in dialogs'),
    p('When a modal dialog is open, focus must stay inside it. If Tab can escape to the page behind the dialog, a screen-reader user can silently wander into content they cannot see, with no way to know the dialog is still there. A correct dialog does four things:'),
    item('Moves focus into the dialog when it opens — to the first meaningful control, the heading, or the close button, but not into an empty container.'),
    item('Loops Tab and Shift+Tab within the dialog so focus cannot leave while it is open.'),
    item('Closes on the Escape key.'),
    item('Restores focus to the element that opened it when it closes — usually the trigger button.'),
    p('The last point is the one teams forget. If you open a dialog, close it, and drop focus back to the top of the document, the user loses their place completely. Capture the trigger before opening and return to it after closing.'),
    {
      _type: 'code',
      language: 'tsx',
      filename: 'useReturnFocus.ts',
      code: `function useReturnFocus(isOpen: boolean) {
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Remember what had focus before we opened
      triggerRef.current = document.activeElement as HTMLElement
    } else if (triggerRef.current) {
      // Return focus when we close
      triggerRef.current.focus()
      triggerRef.current = null
    }
  }, [isOpen])
}`,
    },
    linked(
      [
        span('Native <dialog> with showModal() gives you trapping, Escape handling, and an inert background for free, and is the recommended starting point today. If you build a custom dialog, follow the '),
        span('modal dialog pattern', ['modals']),
        span(' and pair it with the ARIA Authoring Practices dialog guidance rather than reinventing the keyboard behavior.'),
      ],
      [{ _key: 'modals', _type: 'link', href: '/learn/modals' }],
    ),
    h2('Composite widgets: one tab stop, arrow keys inside'),
    p('Menus, tabs, toolbars, radio groups, tree views, and grids should not put every child in the tab order. A toolbar with twelve buttons should be a single tab stop; the user reaches it once with Tab, then moves between the buttons with arrow keys. There are two accepted techniques for this.'),
    h3('Roving tabindex'),
    p('At any moment, exactly one item in the group has tabindex="0" and the rest have tabindex="-1". Arrow keys move the tabindex="0" to a new item and call .focus() on it. This keeps DOM focus on a real element, which is the most robust approach across assistive technology.'),
    {
      _type: 'code',
      language: 'tsx',
      filename: 'Toolbar.tsx',
      code: `function Toolbar({ actions }: { actions: Action[] }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: React.KeyboardEvent) {
    const last = actions.length - 1
    let next = active
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else return
    e.preventDefault()
    setActive(next)
    refs.current[next]?.focus()
  }

  return (
    <div role="toolbar" aria-label="Formatting" onKeyDown={onKeyDown}>
      {actions.map((a, i) => (
        <button
          key={a.id}
          ref={(el) => (refs.current[i] = el)}
          tabIndex={i === active ? 0 : -1}
          onClick={a.run}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}`,
    },
    h3('aria-activedescendant'),
    p('The alternative keeps real DOM focus on a container (a listbox or combobox input) and points aria-activedescendant at the id of the "virtually" focused child. It suits large lists and comboboxes where moving real focus per item is awkward. Roving tabindex is the safer default for most menus, tabs, and toolbars; reach for aria-activedescendant when a text input must retain focus while a related list is navigated.'),
    h2('Focus after single-page navigation'),
    p('In a multi-page site, clicking a link loads a new document and the browser resets focus to the top — screen readers announce the new page title automatically. Single-page apps break that contract: the URL changes, the view swaps, but focus stays on the now-removed link, and nothing is announced. Users are stranded on stale content.'),
    p('After a client-side route change, move focus to a sensible landing point — usually the new page’s H1 or main region — so the next Tab continues from the right place and screen readers register the change.'),
    {
      _type: 'code',
      language: 'tsx',
      filename: 'RouteFocus.tsx',
      code: `function RouteFocus() {
  const pathname = usePathname()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Focus the new page heading after navigation
    headingRef.current?.focus()
  }, [pathname])

  return (
    <h1 ref={headingRef} tabIndex={-1}>
      {/* page title */}
    </h1>
  )
}`,
    },
    p('Prefer focusing the heading or main landmark over a generic live-region announcement; moving real focus both announces the change and repositions the keyboard. Do not scroll the page unexpectedly — pass { preventScroll: true } to .focus() when you manage scrolling separately.'),
    h2('Common focus-management mistakes'),
    item('Removing outlines globally with outline: none and never adding a replacement.'),
    item('Calling .focus() on a container that has no accessible name, so the screen reader announces nothing useful.'),
    item('Setting focus on page load into a search box or ad, hijacking the user before they have oriented.'),
    linked(
      [
        span('Triggering a context change purely because an element received focus, which fails '),
        span('SC 3.2.1 On Focus', ['sc321']),
        span(' — focus should never, by itself, submit a form, open a new window, or move focus elsewhere.'),
      ],
      [{ _key: 'sc321', _type: 'link', href: '/wcag/3-2-1' }],
    ),
    linked(
      [
        span('Creating a keyboard trap where focus enters a widget and cannot leave with standard keys, which fails '),
        span('SC 2.1.2 No Keyboard Trap', ['sc212']),
        span('. A dialog traps focus on purpose and releases it on close; an accidental trap has no exit.'),
      ],
      [{ _key: 'sc212', _type: 'link', href: '/wcag/2-1-2' }],
    ),
    item('Leaving focus on a button that gets removed or disabled after a click, dropping focus to the body.'),
    item('Rendering off-screen or hidden content that is still in the tab order — hide it with display:none, the hidden attribute, or inert so it leaves the sequence.'),
    h2('How to test focus management'),
    p('Focus problems are invisible in a static screenshot and often invisible to automated scanners, so test by driving the keyboard yourself.'),
    item('Put the mouse away. Tab through the whole page from the top and confirm you can see the focus indicator on every stop.'),
    item('Check that the order matches the visual reading order and that focus never jumps somewhere surprising.'),
    item('Open every dialog, menu, and popover; confirm focus enters, cannot escape while open, closes on Escape, and returns to the trigger.'),
    item('Operate composite widgets with arrow keys and verify they are a single tab stop.'),
    item('Navigate between routes and confirm focus lands somewhere sensible each time.'),
    linked(
      [
        span('Add a screen reader to the pass — '),
        span('NVDA, VoiceOver, or JAWS', ['srtest']),
        span(' — because focus that looks fine visually can still announce the wrong thing. Then run the interaction through the '),
        span('WCAG 2.2 checklist', ['checklist']),
        span(' alongside your broader '),
        span('keyboard accessibility', ['keyboard']),
        span(' review.'),
      ],
      [
        { _key: 'srtest', _type: 'link', href: '/guides/screen-reader-testing' },
        { _key: 'checklist', _type: 'link', href: '/checklists/wcag-2-2' },
        { _key: 'keyboard', _type: 'link', href: '/guides/keyboard-accessibility' },
      ],
    ),
    h2('Frequently asked questions'),
    h3('Is it ever acceptable to use outline: none?'),
    p('Yes — when you replace it with an equally visible indicator, such as a box-shadow ring or a border change with sufficient contrast. What fails WCAG is removing the indicator with nothing in its place. Scope removal to :focus:not(:focus-visible) so keyboard users still get a ring.'),
    h3('What is the difference between :focus and :focus-visible?'),
    p(':focus matches whenever an element is focused, including after a mouse click. :focus-visible matches only when the browser heuristically decides an indicator should be shown — typically keyboard and other non-pointer interactions. Use :focus-visible for the visible ring so mouse users are not distracted while keyboard users are supported.'),
    h3('Should I move focus to the modal container or to a control inside it?'),
    p('Move focus to a meaningful element: the first interactive control, the dialog heading, or the close button. Avoid focusing an empty wrapper. If you focus the dialog element itself, give it an accessible name with aria-labelledby so the screen reader announces its purpose.'),
    h3('Do I still need focus management with a framework component library?'),
    p('Mostly the library handles trapping and roving tabindex for you, but you still own the seams: restoring focus after your own custom flows, focusing after route changes, and not deleting the focus indicator in your global styles. Verify the behavior rather than assuming it.'),
    h2('The bottom line'),
    p('Focus management is a small set of habits: keep a visible indicator, keep the DOM order honest, trap focus in dialogs and give it back on close, make composite widgets a single tab stop, and land focus somewhere sensible after every navigation. None of it requires new tools — just tabbing through your own interface with the mouse set aside and fixing what you find.'),
    h2('Sources'),
    linked(
      [span('W3C WAI: Understanding SC 2.4.3 Focus Order', ['s1'])],
      [{ _key: 's1', _type: 'link', href: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html' }],
    ),
    linked(
      [span('W3C WAI: Understanding SC 2.4.7 Focus Visible', ['s2'])],
      [{ _key: 's2', _type: 'link', href: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html' }],
    ),
    linked(
      [span('ARIA Authoring Practices Guide: Developing a Keyboard Interface', ['s3'])],
      [{ _key: 's3', _type: 'link', href: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/' }],
    ),
    linked(
      [span('MDN: :focus-visible pseudo-class', ['s4'])],
      [{ _key: 's4', _type: 'link', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible' }],
    ),
  ],
}
