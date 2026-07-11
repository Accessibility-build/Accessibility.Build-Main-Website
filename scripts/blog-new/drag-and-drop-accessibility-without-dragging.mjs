const span = (text, marks = []) => ({ _type: 'span', text, marks })
const block = (style, children, extra = {}) => ({ _type: 'block', style, children, ...extra })
const p = (text) => block('normal', [span(text)])
const h2 = (text) => block('h2', [span(text)])
const h3 = (text) => block('h3', [span(text)])
const item = (text, listItem = 'bullet') => block('normal', [span(text)], { listItem })
const linked = (children, markDefs) => block('normal', children, { markDefs })

export default {
  slug: 'drag-and-drop-accessibility-without-dragging',
  title: 'The Best Accessible Drag-and-Drop Interface Does Not Require Dragging',
  excerpt: 'Keyboard support alone does not satisfy WCAG 2.2 Dragging Movements. Learn the click, tap, menu, and form alternatives that make direct manipulation work for more people.',
  publishedAt: '2026-07-09T10:00:00Z',
  categoryTitles: ['Development', 'WCAG Guidelines'],
  seo: {
    metaTitle: 'Accessible Drag and Drop Without Requiring Dragging',
    metaDescription: 'Meet WCAG 2.2 Dragging Movements with practical alternatives for sortable lists, Kanban boards, sliders, maps, carousels, and uploads.',
    keywords: [
      'accessible drag and drop',
      'WCAG 2.5.7',
      'dragging movements accessibility',
      'keyboard drag and drop',
      'accessible sortable list',
      'accessible Kanban board',
      'pointer accessibility',
      'single pointer alternative',
    ],
  },
  body: [
    p('Drag-and-drop feels direct: grab a card, move a file, reorder a list, adjust a slider. The visual object follows the pointer, and the result appears immediate. That same interaction can be slow, imprecise, or impossible for someone using tremor-reduction software, eye gaze, a head pointer, a trackball, switch controls, voice input, or a touchscreen with limited dexterity.'),
    p('The accessible design move is not to remove dragging. Keep it for people who find it efficient. Add another way to achieve the same result without requiring a press-hold-move-release gesture.'),
    h2('The WCAG 2.2 requirement people misread'),
    linked(
      [
        span('Success Criterion 2.5.7 '),
        span('Dragging Movements', ['wcag']),
        span(' requires functionality that uses dragging to also work through a single pointer without dragging, unless dragging is essential or controlled by the user agent.'),
      ],
      [{ _key: 'wcag', _type: 'link', href: '/wcag/2-5-7' }],
    ),
    p('Keyboard support is required elsewhere in WCAG, but keyboard support by itself does not satisfy this criterion. A user on a touchscreen may not have a keyboard. A component can be fully keyboard operable and still fail Dragging Movements because its only pointer method requires dragging.'),
    p('The alternative can use one or several clicks or taps. It can be a menu, adjacent move buttons, a text input, directional controls, or a tap-to-select then tap-to-place interaction. It does not need to imitate the drag gesture.'),
    h2('Design the outcome before the gesture'),
    p('Teams often start with "How do we make this drag interaction accessible?" Start one level higher: "What outcome is the user trying to produce?" Reordering, assigning, choosing a value, moving a viewport, and uploading a file are different tasks. Each deserves an alternative shaped around its outcome.'),
    h3('Sortable lists'),
    p('Add Move up and Move down controls beside the selected item. For long lists, include Move to position with a numeric field or destination menu. Announce the result, such as "Quarterly report moved to position 2 of 8," without forcing focus to jump.'),
    item('Keep controls next to the item they affect.'),
    item('Disable or omit Move up on the first item and Move down on the last.'),
    item('Preserve focus on the moved item so repeated movement remains efficient.'),
    item('Update position text for screen-reader users after every change.'),
    h3('Kanban boards and schedulers'),
    p('A card menu can offer Move to column, Change status, or Assign to date. This is often faster than a keyboard simulation of spatial dragging because it exposes the actual data operation. After movement, confirm both the item and destination.'),
    p('Do not make users tab through every empty drop zone. A destination menu scales better, works on small screens, and remains understandable when columns are offscreen.'),
    h3('Sliders and color controls'),
    p('Native range inputs usually support keyboard operation, but a pointer user may still be expected to drag the thumb. Let the user tap the track to set a value, and provide a numeric input or stepper for precision. A color wheel should have text fields for a color value or a palette of selectable swatches.'),
    h3('Maps and canvases'),
    p('Provide directional pan buttons, zoom controls, and a searchable list of locations. Canvas-based floor plans and diagrams should expose equivalent structured controls outside the drawing surface. The visual surface can remain; it simply cannot be the only route to the information or action.'),
    h3('File uploads'),
    p('A drop zone must include a standard file picker. The visible control should say what can be uploaded, accepted formats, size limits, and whether multiple files are allowed. Pasting from the clipboard can be a useful additional method, but it should not replace the file input.'),
    h2('A small implementation pattern'),
    p('For a reorderable list, plain buttons are more robust than inventing a custom keyboard drag mode. The application state changes through the same move function whether the user drags or presses a button.'),
    {
      _type: 'code',
      language: 'tsx',
      filename: 'SortableItem.tsx',
      code: `function SortableItem({ item, index, count, move }) {
  return (
    <li>
      <span>{item.name}</span>
      <button
        type="button"
        onClick={() => move(index, index - 1)}
        disabled={index === 0}
        aria-label={\`Move \${item.name} up\`}
      >
        Move up
      </button>
      <button
        type="button"
        onClick={() => move(index, index + 1)}
        disabled={index === count - 1}
        aria-label={\`Move \${item.name} down\`}
      >
        Move down
      </button>
    </li>
  )
}`,
    },
    p('Add a polite status region for the movement confirmation. Keep the status short, update it only after a successful operation, and do not move focus into the region.'),
    h2('Common approaches that still fail'),
    item('A hidden keyboard shortcut with no visible or discoverable controls.'),
    item('Arrow-key support when pointer users must still drag.'),
    item('A menu that changes only the visual location while leaving the underlying order or reading order unchanged.'),
    item('Tiny move buttons that technically exist but are difficult to target.'),
    item('Instructions that say "drag or use your keyboard" without identifying the actual keys and resulting behavior.'),
    item('A touch interaction that replaces dragging with a directional swipe; a swipe is still a path-based gesture.'),
    h2('Test each input mode independently'),
    p('Do not infer pointer accessibility from keyboard success. Test mouse, single-finger touch, keyboard, screen reader, voice control, zoom, and reduced dexterity as separate modes. Confirm that every method produces the same data result and that status feedback is perceivable.'),
    item('Can a pointer user complete the action using only taps or clicks, with no held movement?'),
    item('Can a keyboard user reach, operate, and repeat the alternative efficiently?'),
    item('Does a screen reader announce the item, action, destination, and result?'),
    item('At 400 percent zoom, are controls visible without covering the object they affect?'),
    item('When an operation fails, does the interface explain what happened and preserve the user state?'),
    linked(
      [
        span('Run the interaction through the '),
        span('WCAG 2.2 checklist', ['checklist']),
        span(' and verify related requirements including keyboard access, focus order, target size, and status messages.'),
      ],
      [{ _key: 'checklist', _type: 'link', href: '/checklists/wcag-2-2' }],
    ),
    h2('The bottom line'),
    p('Dragging is a convenience, not a business requirement. Model the underlying action, expose a simple click or tap alternative, preserve keyboard support, and announce the result. The best alternative often improves the interface for everyone because it turns a precise physical gesture into an explicit command.'),
    h2('Sources'),
    linked(
      [span('W3C WAI: Understanding SC 2.5.7 Dragging Movements', ['s1'])],
      [{ _key: 's1', _type: 'link', href: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html' }],
    ),
    linked(
      [span('W3C WAI Technique G219: Alternative for Dragging Movements', ['s2'])],
      [{ _key: 's2', _type: 'link', href: 'https://www.w3.org/WAI/WCAG22/Techniques/general/G219' }],
    ),
  ],
}
