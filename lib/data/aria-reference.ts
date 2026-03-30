// ARIA Reference Data
// Comprehensive data for ARIA roles, attributes, native comparisons, and common mistakes

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface AriaRole {
  name: string
  category: "widget" | "document" | "landmark" | "live-region" | "window"
  description: string
  nativeEquivalent?: string
  requiredAttributes: string[]
  supportedAttributes: string[]
  requiredChildren?: string[]
  requiredParent?: string[]
  screenReaderBehavior: {
    nvda: string
    jaws: string
    voiceover: string
  }
  keyboardPattern?: string
  wcagCriteria: string[]
  codeExample: {
    html: string
    react?: string
  }
  commonMistakes: string[]
  ariaVersion: "1.0" | "1.1" | "1.2"
  isDeprecated: boolean
}

export interface AriaAttribute {
  name: string
  type: "state" | "property"
  category: "widget" | "live-region" | "drag-drop" | "relationship" | "global"
  description: string
  valueType: string
  defaultValue?: string
  usedWith: string[]
  screenReaderBehavior: {
    nvda: string
    jaws: string
    voiceover: string
  }
  vsComparison?: {
    compareTo: string
    whenToUse: string
    whenToUseOther: string
  }
  codeExample: {
    good: string
    bad: string
  }
  wcagCriteria: string[]
}

export interface NativeComparison {
  ariaRole: string
  nativeHtml: string
  recommendation: string
  reason: string
}

export interface CommonMistake {
  id: number
  title: string
  description: string
  badCode: string
  goodCode: string
  impact: string
  wcagCriteria: string
}

// ---------------------------------------------------------------------------
// ARIA Roles (25 most important)
// ---------------------------------------------------------------------------

export const ariaRoles: AriaRole[] = [
  // ── WIDGET ROLES ──────────────────────────────────────────────────────
  {
    name: "button",
    category: "widget",
    description:
      "An interactive element that triggers an action when activated by the user via click, touch, or keyboard.",
    nativeEquivalent: "<button>",
    requiredAttributes: [],
    supportedAttributes: [
      "aria-disabled",
      "aria-expanded",
      "aria-haspopup",
      "aria-pressed",
      "aria-label",
      "aria-labelledby",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "Button, [name]"',
      jaws: 'Announces "[name], Button"',
      voiceover: 'Announces "[name], button"',
    },
    keyboardPattern: "Space or Enter to activate",
    wcagCriteria: ["4.1.2", "2.1.1"],
    codeExample: {
      html: `<button type="button">Save</button>`,
      react: `<button onClick={handleSave}>Save</button>`,
    },
    commonMistakes: [
      "Using <div> or <span> with role='button' instead of native <button>",
      "Not adding keyboard event handlers when using a non-native element",
      "Missing accessible name via text content, aria-label, or aria-labelledby",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "checkbox",
    category: "widget",
    description:
      "An input that allows the user to toggle between checked, unchecked, and optionally mixed states.",
    nativeEquivalent: '<input type="checkbox">',
    requiredAttributes: ["aria-checked"],
    supportedAttributes: [
      "aria-disabled",
      "aria-required",
      "aria-invalid",
      "aria-readonly",
      "aria-label",
      "aria-labelledby",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "[name], checkbox, not checked" or "checked"',
      jaws: 'Announces "[name], checkbox, not checked" or "checked"',
      voiceover: 'Announces "[name], unticked, tick box" or "ticked, tick box"',
    },
    keyboardPattern: "Space to toggle checked state",
    wcagCriteria: ["4.1.2", "1.3.1"],
    codeExample: {
      html: `<input type="checkbox" id="agree">
<label for="agree">I agree</label>`,
      react: `<label>
  <input type="checkbox" checked={agreed} onChange={toggle} />
  I agree
</label>`,
    },
    commonMistakes: [
      "Using role='checkbox' without managing aria-checked state",
      "Forgetting to associate a visible label",
      "Not handling Space key on custom checkbox implementations",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "combobox",
    category: "widget",
    description:
      "A composite widget combining a text input with a popup that helps the user set the value of the input.",
    nativeEquivalent: "<select> with <datalist>",
    requiredAttributes: ["aria-expanded", "aria-controls"],
    supportedAttributes: [
      "aria-activedescendant",
      "aria-autocomplete",
      "aria-haspopup",
      "aria-label",
      "aria-labelledby",
      "aria-required",
      "aria-invalid",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "[name], combo box, collapsed" and current value',
      jaws: 'Announces "[name], combo box, edit, type in text"',
      voiceover: 'Announces "[name], combo box, collapsed"',
    },
    keyboardPattern:
      "Down Arrow opens popup, Up/Down navigates options, Enter selects, Escape closes",
    wcagCriteria: ["4.1.2", "1.3.1", "3.2.2"],
    codeExample: {
      html: `<label for="city">City</label>
<input id="city" role="combobox"
  aria-expanded="false" aria-controls="city-list">
<ul id="city-list" role="listbox" hidden>
  <li role="option">New York</li>
</ul>`,
      react: `<label htmlFor="city">City</label>
<input id="city" role="combobox"
  aria-expanded={open} aria-controls="city-list"
  aria-activedescendant={activeId} />`,
    },
    commonMistakes: [
      "Not updating aria-expanded when the popup opens/closes",
      "Missing aria-controls pointing to the listbox id",
      "Failing to manage aria-activedescendant for virtual focus",
    ],
    ariaVersion: "1.2",
    isDeprecated: false,
  },
  {
    name: "dialog",
    category: "widget",
    description:
      "A window overlaid on the primary content, requiring user interaction. Typically a modal or non-modal dialog.",
    nativeEquivalent: "<dialog>",
    requiredAttributes: [],
    supportedAttributes: [
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "aria-modal",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "Dialog, [title]" on focus',
      jaws: 'Announces "[title], dialog" and enters forms mode',
      voiceover: 'Announces "[title], web dialog"',
    },
    keyboardPattern:
      "Tab/Shift+Tab cycles through focusable elements; Escape closes the dialog",
    wcagCriteria: ["4.1.2", "2.4.3", "1.3.1"],
    codeExample: {
      html: `<div role="dialog" aria-labelledby="dlg-title"
  aria-modal="true">
  <h2 id="dlg-title">Confirm Delete</h2>
  <p>Are you sure?</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>`,
      react: `<dialog ref={dialogRef} aria-labelledby="dlg-title">
  <h2 id="dlg-title">Confirm Delete</h2>
  <p>Are you sure?</p>
  <button onClick={onCancel}>Cancel</button>
</dialog>`,
    },
    commonMistakes: [
      "Not trapping focus inside the dialog when modal",
      "Forgetting to return focus to the trigger element on close",
      "Missing aria-labelledby or aria-label for the dialog title",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "link",
    category: "widget",
    description:
      "An interactive reference to a resource; activating it causes navigation to that resource.",
    nativeEquivalent: "<a href>",
    requiredAttributes: [],
    supportedAttributes: [
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "aria-disabled",
      "aria-current",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "Link, [name]"',
      jaws: 'Announces "[name], link"',
      voiceover: 'Announces "[name], link"',
    },
    keyboardPattern: "Enter to activate",
    wcagCriteria: ["4.1.2", "2.4.4", "2.4.9"],
    codeExample: {
      html: `<a href="/about">About Us</a>`,
      react: `<Link href="/about">About Us</Link>`,
    },
    commonMistakes: [
      "Using <a> without an href attribute which removes link semantics",
      'Using vague link text like "Click here" or "Read more"',
      "Opening links in new windows without warning users",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "listbox",
    category: "widget",
    description:
      "A widget that allows the user to select one or more items from a list of options.",
    nativeEquivalent: "<select>",
    requiredAttributes: [],
    supportedAttributes: [
      "aria-activedescendant",
      "aria-disabled",
      "aria-expanded",
      "aria-label",
      "aria-labelledby",
      "aria-multiselectable",
      "aria-orientation",
      "aria-required",
    ],
    requiredChildren: ["option"],
    screenReaderBehavior: {
      nvda: 'Announces "[name], list box" and selected option',
      jaws: 'Announces "[name], list box, [selected value]"',
      voiceover: 'Announces "[name], list box, [count] items"',
    },
    keyboardPattern:
      "Up/Down Arrow to navigate options, Enter or Space to select, Home/End for first/last",
    wcagCriteria: ["4.1.2", "1.3.1"],
    codeExample: {
      html: `<label id="color-lbl">Color</label>
<ul role="listbox" aria-labelledby="color-lbl">
  <li role="option" aria-selected="true">Red</li>
  <li role="option">Blue</li>
</ul>`,
    },
    commonMistakes: [
      "Not managing aria-selected on option children",
      "Forgetting keyboard navigation between options",
      "Using listbox when a native <select> would suffice",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "menu",
    category: "widget",
    description:
      "A widget offering a list of actions or functions the user can invoke. Behaves like a desktop application menu.",
    nativeEquivalent: undefined,
    requiredAttributes: [],
    supportedAttributes: [
      "aria-activedescendant",
      "aria-label",
      "aria-labelledby",
      "aria-orientation",
    ],
    requiredChildren: ["menuitem", "menuitemcheckbox", "menuitemradio"],
    screenReaderBehavior: {
      nvda: 'Announces "Menu, [name]"',
      jaws: 'Announces "[name], menu"',
      voiceover: 'Announces "[name], menu, [count] items"',
    },
    keyboardPattern:
      "Up/Down Arrow to navigate items, Enter to activate, Escape to close",
    wcagCriteria: ["4.1.2", "2.1.1"],
    codeExample: {
      html: `<button aria-haspopup="true" aria-expanded="false">
  Actions
</button>
<ul role="menu" aria-label="Actions">
  <li role="menuitem">Cut</li>
  <li role="menuitem">Copy</li>
</ul>`,
    },
    commonMistakes: [
      "Using role='menu' for site navigation instead of <nav>",
      "Not implementing roving tabindex or aria-activedescendant",
      "Missing keyboard support for arrow key navigation",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "menuitem",
    category: "widget",
    description:
      "An option in a menu or menubar. Must be contained within a menu, menubar, or group within those.",
    nativeEquivalent: undefined,
    requiredAttributes: [],
    supportedAttributes: [
      "aria-disabled",
      "aria-label",
      "aria-labelledby",
      "aria-haspopup",
      "aria-expanded",
    ],
    requiredParent: ["menu", "menubar", "group"],
    screenReaderBehavior: {
      nvda: 'Announces "[name], menu item"',
      jaws: 'Announces "[name]" within menu context',
      voiceover: 'Announces "[name], menu item, [position] of [total]"',
    },
    keyboardPattern: "Enter or Space to activate, arrow keys to move between items",
    wcagCriteria: ["4.1.2"],
    codeExample: {
      html: `<ul role="menu">
  <li role="menuitem">Save</li>
  <li role="menuitem">Save As...</li>
</ul>`,
    },
    commonMistakes: [
      "Placing menuitem outside of a menu or menubar context",
      "Not making menuitems focusable with tabindex",
      "Using menuitem for navigation links instead of regular links",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "option",
    category: "widget",
    description:
      "A selectable item within a listbox, combobox popup, or select.",
    nativeEquivalent: "<option>",
    requiredAttributes: ["aria-selected"],
    supportedAttributes: [
      "aria-disabled",
      "aria-label",
      "aria-labelledby",
      "aria-checked",
    ],
    requiredParent: ["listbox", "group"],
    screenReaderBehavior: {
      nvda: 'Announces "[name], [position] of [total]"',
      jaws: 'Announces "[name], [position] of [total]"',
      voiceover: 'Announces "[name], [position] of [total]"',
    },
    keyboardPattern: "Managed by parent listbox; Enter or Space to select",
    wcagCriteria: ["4.1.2", "1.3.1"],
    codeExample: {
      html: `<ul role="listbox" aria-label="Fruit">
  <li role="option" aria-selected="false">Apple</li>
  <li role="option" aria-selected="true">Banana</li>
</ul>`,
    },
    commonMistakes: [
      "Forgetting aria-selected on each option",
      "Not updating aria-selected when the selection changes",
      "Placing option outside a listbox or group container",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "progressbar",
    category: "widget",
    description:
      "Displays the progress of a long-running task, either determinate (known percentage) or indeterminate.",
    nativeEquivalent: "<progress>",
    requiredAttributes: [],
    supportedAttributes: [
      "aria-valuenow",
      "aria-valuemin",
      "aria-valuemax",
      "aria-valuetext",
      "aria-label",
      "aria-labelledby",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "[name], progress bar, [value]%"',
      jaws: 'Announces "[name], progress bar, [value] percent"',
      voiceover: 'Announces "[name], [value]%, progress indicator"',
    },
    wcagCriteria: ["4.1.2", "1.3.1"],
    codeExample: {
      html: `<div role="progressbar" aria-label="Upload"
  aria-valuenow="60" aria-valuemin="0"
  aria-valuemax="100">
  60%
</div>`,
    },
    commonMistakes: [
      "Forgetting aria-valuemin and aria-valuemax for determinate progress",
      "Not providing an accessible name via aria-label or aria-labelledby",
      "Using progressbar for static percentages that do not change over time",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "radio",
    category: "widget",
    description:
      "One option within a radio group; only one radio in the group can be checked at a time.",
    nativeEquivalent: '<input type="radio">',
    requiredAttributes: ["aria-checked"],
    supportedAttributes: [
      "aria-disabled",
      "aria-label",
      "aria-labelledby",
      "aria-required",
    ],
    requiredParent: ["radiogroup"],
    screenReaderBehavior: {
      nvda: 'Announces "[name], radio button, not selected" or "selected"',
      jaws: 'Announces "[name], radio button, not selected, [position] of [total]"',
      voiceover: 'Announces "[name], radio button, [position] of [total], selected/not selected"',
    },
    keyboardPattern:
      "Arrow keys to move selection within group, Space to select",
    wcagCriteria: ["4.1.2", "1.3.1"],
    codeExample: {
      html: `<div role="radiogroup" aria-label="Size">
  <label><input type="radio" name="size" value="s"> Small</label>
  <label><input type="radio" name="size" value="m"> Medium</label>
</div>`,
      react: `<fieldset>
  <legend>Size</legend>
  <label><input type="radio" name="size" value="s" /> Small</label>
  <label><input type="radio" name="size" value="m" /> Medium</label>
</fieldset>`,
    },
    commonMistakes: [
      "Placing radios outside of a radiogroup or fieldset",
      "Not using the same name attribute for native radio inputs",
      "Forgetting to manage aria-checked on custom radio implementations",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "slider",
    category: "widget",
    description:
      "An input where the user selects a value from a given range by moving a thumb along a track.",
    nativeEquivalent: '<input type="range">',
    requiredAttributes: [
      "aria-valuenow",
      "aria-valuemin",
      "aria-valuemax",
    ],
    supportedAttributes: [
      "aria-disabled",
      "aria-label",
      "aria-labelledby",
      "aria-orientation",
      "aria-valuetext",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "[name], slider, [value]"',
      jaws: 'Announces "[name], slider, [value]"',
      voiceover: 'Announces "[name], [value], adjustable"',
    },
    keyboardPattern:
      "Left/Down Arrow decreases, Right/Up Arrow increases, Home/End for min/max",
    wcagCriteria: ["4.1.2", "1.3.1"],
    codeExample: {
      html: `<label for="vol">Volume</label>
<input type="range" id="vol" min="0" max="100"
  value="50">`,
    },
    commonMistakes: [
      "Not providing aria-valuemin and aria-valuemax on custom sliders",
      "Failing to update aria-valuenow as the thumb moves",
      "Missing keyboard support for arrow keys and Home/End",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "switch",
    category: "widget",
    description:
      "A toggle that represents an on/off value, similar to a checkbox but with clear binary semantics.",
    nativeEquivalent: undefined,
    requiredAttributes: ["aria-checked"],
    supportedAttributes: [
      "aria-disabled",
      "aria-label",
      "aria-labelledby",
      "aria-readonly",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "[name], switch, on" or "off"',
      jaws: 'Announces "[name], switch, on" or "off"',
      voiceover: 'Announces "[name], switch button, on" or "off"',
    },
    keyboardPattern: "Space to toggle, Enter may also toggle",
    wcagCriteria: ["4.1.2", "1.3.1"],
    codeExample: {
      html: `<button role="switch" aria-checked="false"
  aria-label="Dark mode">
  Dark mode
</button>`,
      react: `<button
  role="switch"
  aria-checked={darkMode}
  onClick={() => setDarkMode(!darkMode)}
>
  Dark mode
</button>`,
    },
    commonMistakes: [
      "Not updating aria-checked on state change",
      "Using switch for actions that do not represent a binary on/off state",
      "Forgetting keyboard interaction (Space to toggle)",
    ],
    ariaVersion: "1.1",
    isDeprecated: false,
  },
  {
    name: "tab",
    category: "widget",
    description:
      "A grouping label for a tabpanel, used within a tablist to enable switching between panels.",
    nativeEquivalent: undefined,
    requiredAttributes: ["aria-selected"],
    supportedAttributes: [
      "aria-controls",
      "aria-disabled",
      "aria-label",
      "aria-labelledby",
    ],
    requiredParent: ["tablist"],
    screenReaderBehavior: {
      nvda: 'Announces "[name], tab, selected, [position] of [total]"',
      jaws: 'Announces "[name], tab, [position] of [total]"',
      voiceover: 'Announces "[name], selected, tab, [position] of [total]"',
    },
    keyboardPattern:
      "Left/Right Arrow to navigate tabs, Space or Enter to activate, Home/End for first/last",
    wcagCriteria: ["4.1.2", "1.3.1", "2.1.1"],
    codeExample: {
      html: `<div role="tablist" aria-label="Account">
  <button role="tab" aria-selected="true"
    aria-controls="panel-1">Profile</button>
  <button role="tab" aria-selected="false"
    aria-controls="panel-2">Settings</button>
</div>
<div role="tabpanel" id="panel-1">
  Profile content
</div>`,
      react: `<div role="tablist" aria-label="Account">
  {tabs.map((t, i) => (
    <button key={t.id} role="tab"
      aria-selected={activeTab === i}
      onClick={() => setActiveTab(i)}>{t.label}</button>
  ))}
</div>`,
    },
    commonMistakes: [
      "Not managing aria-selected across tabs when switching",
      "Missing aria-controls linking each tab to its tabpanel",
      "Failing to implement arrow key navigation between tabs",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "tabpanel",
    category: "widget",
    description:
      "A container for the content associated with a tab. Shown or hidden based on the active tab.",
    nativeEquivalent: undefined,
    requiredAttributes: [],
    supportedAttributes: [
      "aria-label",
      "aria-labelledby",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "Tab panel, [name]"',
      jaws: 'Announces "[name], tab panel"',
      voiceover: 'Announces "[name], tab panel"',
    },
    keyboardPattern: "Tab moves focus into the panel content",
    wcagCriteria: ["4.1.2", "1.3.1"],
    codeExample: {
      html: `<div role="tabpanel" id="panel-1"
  aria-labelledby="tab-1" tabindex="0">
  <p>Panel content here.</p>
</div>`,
    },
    commonMistakes: [
      "Not linking the panel back to its tab via aria-labelledby",
      "Forgetting to make the tabpanel focusable with tabindex='0'",
      "Leaving hidden panels in the DOM without hiding them from assistive technology",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "textbox",
    category: "widget",
    description:
      "A single-line or multi-line text input field where the user can enter free-form text.",
    nativeEquivalent: '<input type="text"> or <textarea>',
    requiredAttributes: [],
    supportedAttributes: [
      "aria-activedescendant",
      "aria-autocomplete",
      "aria-disabled",
      "aria-invalid",
      "aria-label",
      "aria-labelledby",
      "aria-multiline",
      "aria-placeholder",
      "aria-readonly",
      "aria-required",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "[name], edit, [value]"',
      jaws: 'Announces "[name], edit, type in text, [value]"',
      voiceover: 'Announces "[name], text field, [value]"',
    },
    keyboardPattern: "Standard text editing keys; Tab to move away",
    wcagCriteria: ["4.1.2", "1.3.1", "3.3.2"],
    codeExample: {
      html: `<label for="email">Email</label>
<input type="email" id="email" required>`,
      react: `<label htmlFor="email">Email</label>
<input type="email" id="email"
  value={email} onChange={e => setEmail(e.target.value)} />`,
    },
    commonMistakes: [
      "Using a <div contenteditable> without role='textbox' and proper ARIA",
      "Missing a visible or accessible label for the text field",
      "Not conveying required or error states to assistive technology",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "tooltip",
    category: "widget",
    description:
      "A contextual popup displaying a short description for an element, shown on hover or focus.",
    nativeEquivalent: "title attribute (limited)",
    requiredAttributes: [],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: "Announces tooltip content as the element's description",
      jaws: "Announces tooltip content as supplementary description",
      voiceover: 'Announces "[name], help tag: [tooltip text]"',
    },
    keyboardPattern: "Appears on focus, dismissible with Escape",
    wcagCriteria: ["1.4.13", "4.1.2"],
    codeExample: {
      html: `<button aria-describedby="tip-1">Delete</button>
<div role="tooltip" id="tip-1">
  Permanently remove this item
</div>`,
    },
    commonMistakes: [
      "Not linking the tooltip to its trigger with aria-describedby",
      "Tooltip not dismissible with Escape key",
      "Tooltip disappears when user moves mouse to read it",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },

  // ── LANDMARK ROLES ────────────────────────────────────────────────────
  {
    name: "banner",
    category: "landmark",
    description:
      "Identifies the site-wide header, usually containing the logo, site title, and global navigation.",
    nativeEquivalent: "<header> (when not nested)",
    requiredAttributes: [],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: 'Announces "Banner landmark" or "Banner, [name]"',
      jaws: 'Announces "Banner region" or "Banner region, [name]"',
      voiceover: 'Announces "Banner" in landmarks rotor',
    },
    wcagCriteria: ["1.3.1", "2.4.1"],
    codeExample: {
      html: `<header>
  <a href="/">My Site</a>
  <nav>...</nav>
</header>`,
    },
    commonMistakes: [
      "Nesting <header> inside <article> or <section> which removes the banner role",
      "Having multiple banner landmarks without distinguishing labels",
      "Manually adding role='banner' when <header> already provides it",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "navigation",
    category: "landmark",
    description:
      "A collection of navigational links for the site or page. Maps directly to the <nav> element.",
    nativeEquivalent: "<nav>",
    requiredAttributes: [],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: 'Announces "Navigation landmark, [name]"',
      jaws: 'Announces "Navigation region, [name]"',
      voiceover: 'Announces "[name], navigation" in landmarks rotor',
    },
    wcagCriteria: ["1.3.1", "2.4.1"],
    codeExample: {
      html: `<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>`,
      react: `<nav aria-label="Main">
  <ul>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/about">About</Link></li>
  </ul>
</nav>`,
    },
    commonMistakes: [
      "Having multiple <nav> elements without unique aria-label to distinguish them",
      "Using role='navigation' instead of the native <nav> element",
      "Using <nav> for non-navigation content like forms",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "main",
    category: "landmark",
    description:
      "Identifies the primary content of the page. There should be only one visible main landmark per page.",
    nativeEquivalent: "<main>",
    requiredAttributes: [],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: 'Announces "Main landmark"',
      jaws: 'Announces "Main region"',
      voiceover: 'Announces "Main" in landmarks rotor',
    },
    wcagCriteria: ["1.3.1", "2.4.1"],
    codeExample: {
      html: `<main>
  <h1>Welcome</h1>
  <p>Page content here.</p>
</main>`,
    },
    commonMistakes: [
      "Having more than one visible <main> element on the same page",
      "Nesting <main> inside <article> or <section>",
      "Forgetting the <main> landmark entirely so skip-nav links have no target",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "search",
    category: "landmark",
    description:
      "Identifies a region containing search functionality, typically a search form or input.",
    nativeEquivalent: "<search> (HTML 5.2+)",
    requiredAttributes: [],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: 'Announces "Search landmark"',
      jaws: 'Announces "Search region"',
      voiceover: 'Announces "Search" in landmarks rotor',
    },
    wcagCriteria: ["1.3.1", "2.4.1"],
    codeExample: {
      html: `<search>
  <label for="q">Search</label>
  <input type="search" id="q">
  <button type="submit">Go</button>
</search>`,
    },
    commonMistakes: [
      "Wrapping the entire page in a search role",
      "Not labelling the search landmark when there are multiple search regions",
      "Using role='search' on an input instead of on the containing form/region",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "region",
    category: "landmark",
    description:
      "A perceivable section of the page with a specific purpose that should be included in a landmark summary.",
    nativeEquivalent: "<section> (when labelled)",
    requiredAttributes: [],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: 'Announces "[name] region"',
      jaws: 'Announces "[name] region"',
      voiceover: 'Announces "[name]" in landmarks rotor',
    },
    wcagCriteria: ["1.3.1", "2.4.1"],
    codeExample: {
      html: `<section aria-labelledby="features-heading">
  <h2 id="features-heading">Features</h2>
  <p>Feature content here.</p>
</section>`,
    },
    commonMistakes: [
      "Using <section> without a label which does not create a landmark",
      "Overusing regions which clutters the landmark list for screen reader users",
      "Confusing region with generic container elements like <div>",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "contentinfo",
    category: "landmark",
    description:
      "Identifies the site-wide footer containing copyright, contact, and legal links.",
    nativeEquivalent: "<footer> (when not nested)",
    requiredAttributes: [],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: 'Announces "Content information landmark"',
      jaws: 'Announces "Content info region"',
      voiceover: 'Announces "Content information" in landmarks rotor',
    },
    wcagCriteria: ["1.3.1", "2.4.1"],
    codeExample: {
      html: `<footer>
  <p>&copy; 2025 My Company</p>
  <nav aria-label="Legal">...</nav>
</footer>`,
    },
    commonMistakes: [
      "Nesting <footer> inside <article> or <section> which removes the contentinfo role",
      "Having multiple contentinfo landmarks without distinguishing labels",
      "Putting primary navigation in the footer landmark",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },

  // ── DOCUMENT ROLES ────────────────────────────────────────────────────
  {
    name: "heading",
    category: "document",
    description:
      "A heading for a section of the page. Must include aria-level to indicate the nesting depth.",
    nativeEquivalent: "<h1> - <h6>",
    requiredAttributes: ["aria-level"],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: 'Announces "Heading level [n], [text]"',
      jaws: 'Announces "Heading level [n], [text]"',
      voiceover: 'Announces "Heading level [n], [text]"',
    },
    keyboardPattern: "H key in browse mode jumps to next heading",
    wcagCriteria: ["1.3.1", "2.4.6", "2.4.10"],
    codeExample: {
      html: `<h2>Section Title</h2>
<!-- or custom: -->
<div role="heading" aria-level="2">Section Title</div>`,
    },
    commonMistakes: [
      "Using role='heading' without aria-level",
      "Skipping heading levels (e.g. h2 to h4) which breaks document outline",
      "Using heading markup for styling rather than structural hierarchy",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "img",
    category: "document",
    description:
      "Identifies content that represents an image, whether a single <img> or a composite of elements forming an image.",
    nativeEquivalent: '<img alt="...">',
    requiredAttributes: [],
    supportedAttributes: ["aria-label", "aria-labelledby"],
    screenReaderBehavior: {
      nvda: 'Announces "Graphic, [name]"',
      jaws: 'Announces "Graphic, [name]"',
      voiceover: 'Announces "[name], image"',
    },
    wcagCriteria: ["1.1.1"],
    codeExample: {
      html: `<img src="/logo.png" alt="Company Logo">
<!-- decorative: -->
<img src="/divider.png" alt="">`,
    },
    commonMistakes: [
      "Using role='img' without an accessible name",
      "Not marking decorative images with alt='' or role='presentation'",
      "Using CSS background images for meaningful content without text alternative",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },

  // ── LIVE REGION ROLES ─────────────────────────────────────────────────
  {
    name: "alert",
    category: "live-region",
    description:
      "A live region conveying important, time-sensitive information. Automatically announced by screen readers.",
    nativeEquivalent: undefined,
    requiredAttributes: [],
    supportedAttributes: [
      "aria-atomic",
      "aria-label",
      "aria-labelledby",
      "aria-live",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "Alert, [message text]" immediately',
      jaws: 'Announces "Alert, [message text]" immediately',
      voiceover: 'Announces "[message text]" as an alert notification',
    },
    wcagCriteria: ["4.1.3"],
    codeExample: {
      html: `<div role="alert">
  Form submitted successfully!
</div>`,
      react: `{error && (
  <div role="alert">{error}</div>
)}`,
    },
    commonMistakes: [
      "Using alert for non-urgent information like help text",
      "Putting the alert role on an element that is already in the DOM at page load",
      "Using too many alerts which overwhelms screen reader users",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
  {
    name: "status",
    category: "live-region",
    description:
      "A live region for advisory information that is not urgent enough for an alert. Announced at the next polite opportunity.",
    nativeEquivalent: '<output>',
    requiredAttributes: [],
    supportedAttributes: [
      "aria-atomic",
      "aria-label",
      "aria-labelledby",
      "aria-live",
    ],
    screenReaderBehavior: {
      nvda: 'Announces "[message text]" politely after current speech',
      jaws: 'Announces "[message text]" at the next pause',
      voiceover: 'Announces "[message text]" politely',
    },
    wcagCriteria: ["4.1.3"],
    codeExample: {
      html: `<div role="status">
  3 results found
</div>`,
    },
    commonMistakes: [
      "Using role='status' for urgent error messages (use alert instead)",
      "Updating status content too frequently causing excessive announcements",
      "Not using aria-atomic='true' when the entire status message should be re-read",
    ],
    ariaVersion: "1.0",
    isDeprecated: false,
  },
]

// ---------------------------------------------------------------------------
// ARIA Attributes (20 most important)
// ---------------------------------------------------------------------------

export const ariaAttributes: AriaAttribute[] = [
  {
    name: "aria-label",
    type: "property",
    category: "global",
    description:
      "Provides an accessible name for an element when no visible text label is present.",
    valueType: "string",
    usedWith: ["All elements"],
    screenReaderBehavior: {
      nvda: "Uses aria-label as the element's announced name",
      jaws: "Uses aria-label as the element's announced name",
      voiceover: "Uses aria-label as the element's announced name",
    },
    vsComparison: {
      compareTo: "aria-labelledby",
      whenToUse:
        "When there is no visible text in the DOM that serves as a label",
      whenToUseOther:
        "When a visible text element already exists and can be referenced by ID",
    },
    codeExample: {
      good: `<button aria-label="Close dialog">
  <svg><!-- X icon --></svg>
</button>`,
      bad: `<button>
  <svg><!-- X icon --></svg>
</button>
<!-- No accessible name at all -->`,
    },
    wcagCriteria: ["4.1.2", "1.1.1"],
  },
  {
    name: "aria-labelledby",
    type: "property",
    category: "relationship",
    description:
      "References the ID of an element whose text content provides the accessible name.",
    valueType: "ID reference (space-separated list)",
    usedWith: ["All elements"],
    screenReaderBehavior: {
      nvda: "Reads the referenced element's text as the name",
      jaws: "Reads the referenced element's text as the name",
      voiceover: "Reads the referenced element's text as the name",
    },
    vsComparison: {
      compareTo: "aria-label",
      whenToUse:
        "When a visible label already exists on the page and should be reused",
      whenToUseOther:
        "When no visible text exists and you need to define the label in code only",
    },
    codeExample: {
      good: `<h2 id="section-title">Billing</h2>
<form aria-labelledby="section-title">...</form>`,
      bad: `<h2>Billing</h2>
<form aria-label="Billing">...</form>
<!-- Duplicates visible text unnecessarily -->`,
    },
    wcagCriteria: ["4.1.2", "1.3.1"],
  },
  {
    name: "aria-describedby",
    type: "property",
    category: "relationship",
    description:
      "References the ID of an element providing additional descriptive text for the current element.",
    valueType: "ID reference (space-separated list)",
    usedWith: ["All elements"],
    screenReaderBehavior: {
      nvda: 'Announces description after a brief pause: "[name], [role]... [description]"',
      jaws: 'Announces description after the name and role: "[name], [role], [description]"',
      voiceover: "Announces description as supplementary after the element's name",
    },
    vsComparison: {
      compareTo: "aria-labelledby",
      whenToUse:
        "For supplementary information that is not the element's primary name",
      whenToUseOther:
        "For the element's primary accessible name",
    },
    codeExample: {
      good: `<label for="pw">Password</label>
<input type="password" id="pw"
  aria-describedby="pw-help">
<p id="pw-help">Must be 8+ characters</p>`,
      bad: `<label for="pw">Password</label>
<input type="password" id="pw">
<p>Must be 8+ characters</p>
<!-- Help text not linked to the input -->`,
    },
    wcagCriteria: ["1.3.1", "3.3.2"],
  },
  {
    name: "aria-hidden",
    type: "state",
    category: "global",
    description:
      "Removes the element and its children from the accessibility tree while keeping it visually rendered.",
    valueType: "true | false | undefined",
    defaultValue: "undefined",
    usedWith: ["All elements"],
    screenReaderBehavior: {
      nvda: "Element is completely ignored when true",
      jaws: "Element is completely ignored when true",
      voiceover: "Element is completely ignored when true",
    },
    codeExample: {
      good: `<button>
  <svg aria-hidden="true"><!-- icon --></svg>
  Save
</button>`,
      bad: `<button aria-hidden="true">
  Important Action
</button>
<!-- Hides an interactive element from AT -->`,
    },
    wcagCriteria: ["4.1.2", "1.3.1"],
  },
  {
    name: "aria-expanded",
    type: "state",
    category: "widget",
    description:
      "Indicates whether a collapsible section, menu, or other grouping controlled by this element is expanded or collapsed.",
    valueType: "true | false | undefined",
    defaultValue: "undefined",
    usedWith: ["button", "combobox", "link", "menuitem", "tab"],
    screenReaderBehavior: {
      nvda: 'Announces "expanded" or "collapsed" after the element name',
      jaws: 'Announces "expanded" or "collapsed" after the element name',
      voiceover: 'Announces "expanded" or "collapsed" after the element name',
    },
    codeExample: {
      good: `<button aria-expanded="false"
  aria-controls="menu-1">Menu</button>
<ul id="menu-1" hidden>...</ul>`,
      bad: `<button>Menu</button>
<ul style="display:none">...</ul>
<!-- No expanded state communicated -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
  {
    name: "aria-controls",
    type: "property",
    category: "relationship",
    description:
      "Identifies the element(s) whose content or presence is controlled by the current element.",
    valueType: "ID reference (space-separated list)",
    usedWith: ["button", "combobox", "tab", "scrollbar"],
    screenReaderBehavior: {
      nvda: "Not announced, but JAWS uses it for Ctrl+Insert+M navigation",
      jaws: "Allows JAWS+Alt+M to jump to the controlled element",
      voiceover: "Not announced; relationship is programmatically available",
    },
    codeExample: {
      good: `<button aria-expanded="false"
  aria-controls="panel-1">Details</button>
<div id="panel-1" hidden>...</div>`,
      bad: `<button aria-expanded="false">Details</button>
<div hidden>...</div>
<!-- No programmatic relationship -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
  {
    name: "aria-live",
    type: "property",
    category: "live-region",
    description:
      "Indicates that an element will be updated dynamically and defines the politeness level for announcements.",
    valueType: '"off" | "polite" | "assertive"',
    defaultValue: "off",
    usedWith: ["Any element that receives dynamic content updates"],
    screenReaderBehavior: {
      nvda: 'polite: waits for current speech; assertive: interrupts immediately',
      jaws: 'polite: queued after current speech; assertive: interrupts immediately',
      voiceover: 'polite: announced at next pause; assertive: announced immediately',
    },
    codeExample: {
      good: `<div aria-live="polite">
  <!-- Content updated by JS -->
</div>`,
      bad: `<div>
  <!-- Dynamic content without live region -->
</div>`,
    },
    wcagCriteria: ["4.1.3"],
  },
  {
    name: "aria-atomic",
    type: "property",
    category: "live-region",
    description:
      "When true, the entire live region is re-read on any change. When false, only the changed nodes are announced.",
    valueType: "true | false",
    defaultValue: "false",
    usedWith: ["Elements with aria-live or implicit live region roles"],
    screenReaderBehavior: {
      nvda: "true: re-reads the whole region; false: reads only changed text",
      jaws: "true: re-reads the whole region; false: reads only changed text",
      voiceover: "true: re-reads the whole region; false: reads only changed text",
    },
    codeExample: {
      good: `<div role="status" aria-atomic="true">
  Score: <span>42</span>
</div>`,
      bad: `<div role="status">
  Score: <span>42</span>
</div>
<!-- Only "42" is announced, not "Score: 42" -->`,
    },
    wcagCriteria: ["4.1.3"],
  },
  {
    name: "aria-checked",
    type: "state",
    category: "widget",
    description:
      'Indicates the current checked state of checkboxes, radio buttons, and switches. Supports "mixed" for indeterminate.',
    valueType: '"true" | "false" | "mixed" | undefined',
    defaultValue: "undefined",
    usedWith: ["checkbox", "radio", "switch", "menuitemcheckbox", "menuitemradio"],
    screenReaderBehavior: {
      nvda: 'Announces "checked", "not checked", or "partially checked"',
      jaws: 'Announces "checked", "not checked", or "partially checked"',
      voiceover: 'Announces "ticked", "unticked", or "mixed"',
    },
    codeExample: {
      good: `<div role="checkbox" aria-checked="false"
  tabindex="0">Remember me</div>`,
      bad: `<div role="checkbox" tabindex="0">
  Remember me
</div>
<!-- Missing aria-checked state -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
  {
    name: "aria-disabled",
    type: "state",
    category: "widget",
    description:
      "Indicates the element is perceivable but not operable. Unlike the HTML disabled attribute, it does not prevent focus.",
    valueType: "true | false",
    defaultValue: "false",
    usedWith: ["All interactive elements"],
    screenReaderBehavior: {
      nvda: 'Announces "unavailable" or "dimmed" after the element name',
      jaws: 'Announces "unavailable" after the element name',
      voiceover: 'Announces "dimmed" after the element name',
    },
    codeExample: {
      good: `<button aria-disabled="true"
  tabindex="0">Submit</button>`,
      bad: `<button style="opacity: 0.5; pointer-events: none;">
  Submit
</button>
<!-- Visually disabled but no AT indication -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
  {
    name: "aria-selected",
    type: "state",
    category: "widget",
    description:
      "Indicates the current selected state within widgets like tabs, listboxes, grids, and trees.",
    valueType: "true | false | undefined",
    defaultValue: "undefined",
    usedWith: ["option", "tab", "gridcell", "row", "treeitem"],
    screenReaderBehavior: {
      nvda: 'Announces "selected" or "not selected"',
      jaws: 'Announces "selected" or "not selected"',
      voiceover: 'Announces "selected" or does not indicate unselected',
    },
    codeExample: {
      good: `<div role="tab" aria-selected="true">
  Active Tab
</div>`,
      bad: `<div role="tab" class="active">
  Active Tab
</div>
<!-- Visual-only selection, not communicated to AT -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
  {
    name: "aria-required",
    type: "property",
    category: "widget",
    description:
      "Indicates that user input is required on an element before a form can be submitted.",
    valueType: "true | false",
    defaultValue: "false",
    usedWith: ["textbox", "combobox", "listbox", "radiogroup", "checkbox"],
    screenReaderBehavior: {
      nvda: 'Announces "required" after the element name',
      jaws: 'Announces "required" after the element name',
      voiceover: 'Announces "required" after the element name',
    },
    codeExample: {
      good: `<label for="name">Name *</label>
<input id="name" required aria-required="true">`,
      bad: `<label for="name">Name *</label>
<input id="name">
<!-- Visual asterisk but no programmatic required -->`,
    },
    wcagCriteria: ["3.3.2", "1.3.1"],
  },
  {
    name: "aria-invalid",
    type: "state",
    category: "widget",
    description:
      "Indicates that the value entered does not conform to the expected format or validation rules.",
    valueType: '"true" | "false" | "grammar" | "spelling"',
    defaultValue: "false",
    usedWith: ["textbox", "combobox", "listbox", "checkbox", "radio"],
    screenReaderBehavior: {
      nvda: 'Announces "invalid entry" after the field',
      jaws: 'Announces "invalid data" or "invalid entry"',
      voiceover: 'Announces "invalid data"',
    },
    codeExample: {
      good: `<input id="email" type="email"
  aria-invalid="true"
  aria-errormessage="email-err">
<p id="email-err">Please enter a valid email</p>`,
      bad: `<input id="email" type="email" class="error">
<p class="error-text">Please enter a valid email</p>
<!-- Error not programmatically associated -->`,
    },
    wcagCriteria: ["3.3.1", "3.3.3"],
  },
  {
    name: "aria-pressed",
    type: "state",
    category: "widget",
    description:
      "Indicates the current pressed state of a toggle button. Differentiates toggle buttons from regular buttons.",
    valueType: '"true" | "false" | "mixed" | undefined',
    defaultValue: "undefined",
    usedWith: ["button"],
    screenReaderBehavior: {
      nvda: 'Announces "toggle button, pressed" or "not pressed"',
      jaws: 'Announces "toggle button, pressed" or "not pressed"',
      voiceover: 'Announces "selected, toggle button" or "toggle button"',
    },
    codeExample: {
      good: `<button aria-pressed="false">
  Bold
</button>`,
      bad: `<button class="active">Bold</button>
<!-- Toggle state not communicated to AT -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
  {
    name: "aria-haspopup",
    type: "property",
    category: "widget",
    description:
      "Indicates that the element can trigger a popup such as a menu, listbox, tree, grid, or dialog.",
    valueType: '"true" | "false" | "menu" | "listbox" | "tree" | "grid" | "dialog"',
    defaultValue: "false",
    usedWith: ["button", "link", "menuitem", "tab"],
    screenReaderBehavior: {
      nvda: 'Announces "has popup" or "has submenu" after the element name',
      jaws: 'Announces "has popup" or "menu" after the element name',
      voiceover: 'Announces "pop-up button" when true or "menu"',
    },
    codeExample: {
      good: `<button aria-haspopup="menu"
  aria-expanded="false">Options</button>`,
      bad: `<button>Options</button>
<!-- User has no idea activating this opens a menu -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
  {
    name: "aria-current",
    type: "state",
    category: "widget",
    description:
      "Indicates the current item within a set of related elements, such as the current page in navigation.",
    valueType: '"page" | "step" | "location" | "date" | "time" | "true" | "false"',
    defaultValue: "false",
    usedWith: ["link", "listitem", "option", "treeitem"],
    screenReaderBehavior: {
      nvda: 'Announces "current page" or "current [type]"',
      jaws: 'Announces "current page" or "current [type]"',
      voiceover: 'Announces "current page" or "current [type]"',
    },
    codeExample: {
      good: `<nav aria-label="Main">
  <a href="/" aria-current="page">Home</a>
  <a href="/about">About</a>
</nav>`,
      bad: `<nav>
  <a href="/" class="active">Home</a>
  <a href="/about">About</a>
</nav>
<!-- Current page indicated only visually -->`,
    },
    wcagCriteria: ["1.3.1", "2.4.8"],
  },
  {
    name: "aria-modal",
    type: "property",
    category: "widget",
    description:
      "Indicates that a dialog is modal, meaning interaction is restricted to the dialog's contents.",
    valueType: "true | false",
    defaultValue: "false",
    usedWith: ["dialog", "alertdialog"],
    screenReaderBehavior: {
      nvda: "Restricts virtual buffer navigation to the dialog contents",
      jaws: "Restricts virtual cursor to the dialog contents",
      voiceover: "Limits VO navigation to elements within the dialog",
    },
    codeExample: {
      good: `<div role="dialog" aria-modal="true"
  aria-labelledby="title">
  <h2 id="title">Settings</h2>
</div>`,
      bad: `<div role="dialog" aria-labelledby="title">
  <h2 id="title">Settings</h2>
</div>
<!-- Missing aria-modal allows reading behind -->`,
    },
    wcagCriteria: ["4.1.2", "2.4.3"],
  },
  {
    name: "aria-valuenow",
    type: "property",
    category: "widget",
    description:
      "Defines the current value for range widgets such as sliders, progress bars, and spin buttons.",
    valueType: "number",
    usedWith: ["progressbar", "scrollbar", "slider", "spinbutton"],
    screenReaderBehavior: {
      nvda: "Announces the numeric value or aria-valuetext if present",
      jaws: "Announces the numeric value or aria-valuetext if present",
      voiceover: "Announces the numeric value or aria-valuetext if present",
    },
    codeExample: {
      good: `<div role="slider" aria-valuenow="50"
  aria-valuemin="0" aria-valuemax="100"
  aria-label="Volume">50%</div>`,
      bad: `<div role="slider" aria-label="Volume">
  50%
</div>
<!-- No value attributes for AT to announce -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
  {
    name: "aria-errormessage",
    type: "property",
    category: "widget",
    description:
      "References the ID of the element containing the error message for the current element when aria-invalid is true.",
    valueType: "ID reference",
    usedWith: ["textbox", "combobox", "listbox", "checkbox", "radio"],
    screenReaderBehavior: {
      nvda: "Announces the referenced error text when aria-invalid is true",
      jaws: "Announces the referenced error text when field is focused and invalid",
      voiceover: "Announces the referenced error text after the field description",
    },
    vsComparison: {
      compareTo: "aria-describedby",
      whenToUse:
        "For error messages that should only be announced when the input is invalid",
      whenToUseOther:
        "For general help text that should always be available, not only on error",
    },
    codeExample: {
      good: `<input aria-invalid="true"
  aria-errormessage="err-1">
<p id="err-1" role="alert">
  Email is required
</p>`,
      bad: `<input aria-invalid="true">
<p class="error">Email is required</p>
<!-- Error message not linked to input -->`,
    },
    wcagCriteria: ["3.3.1", "3.3.3"],
  },
  {
    name: "aria-activedescendant",
    type: "property",
    category: "relationship",
    description:
      "Identifies the currently active descendant within a composite widget, enabling virtual focus without moving DOM focus.",
    valueType: "ID reference",
    usedWith: ["combobox", "grid", "listbox", "menu", "radiogroup", "tablist", "tree"],
    screenReaderBehavior: {
      nvda: "Announces the referenced element as if it has focus",
      jaws: "Announces the referenced element as the focused item",
      voiceover: "Announces the referenced element as the active item",
    },
    vsComparison: {
      compareTo: "roving tabindex",
      whenToUse:
        "When DOM focus stays on the container and visual focus is managed via JS",
      whenToUseOther:
        "When DOM focus actually moves to each child element (tabindex='0' / '-1')",
    },
    codeExample: {
      good: `<input role="combobox"
  aria-activedescendant="opt-2"
  aria-controls="opts">
<ul role="listbox" id="opts">
  <li role="option" id="opt-1">Apple</li>
  <li role="option" id="opt-2">Banana</li>
</ul>`,
      bad: `<input role="combobox" aria-controls="opts">
<ul role="listbox" id="opts">
  <li role="option">Apple</li>
  <li role="option">Banana</li>
</ul>
<!-- No active descendant tracking -->`,
    },
    wcagCriteria: ["4.1.2"],
  },
]

// ---------------------------------------------------------------------------
// Native HTML vs ARIA Comparisons
// ---------------------------------------------------------------------------

export const nativeComparisons: NativeComparison[] = [
  {
    ariaRole: 'role="button"',
    nativeHtml: "<button>",
    recommendation: "Use native <button>",
    reason:
      "Native buttons include keyboard support, focus management, and form submission for free.",
  },
  {
    ariaRole: 'role="link"',
    nativeHtml: '<a href="...">',
    recommendation: "Use native <a> with href",
    reason:
      "Native links are focusable, support right-click and middle-click, and are recognized by crawlers.",
  },
  {
    ariaRole: 'role="checkbox"',
    nativeHtml: '<input type="checkbox">',
    recommendation: "Use native checkbox",
    reason:
      "Native checkboxes handle checked state, keyboard toggling, and form data automatically.",
  },
  {
    ariaRole: 'role="radio" + role="radiogroup"',
    nativeHtml: '<input type="radio"> in <fieldset>',
    recommendation: "Use native radio inputs",
    reason:
      "Native radios handle mutual exclusion, arrow key navigation, and group labelling via fieldset/legend.",
  },
  {
    ariaRole: 'role="textbox"',
    nativeHtml: '<input type="text"> or <textarea>',
    recommendation: "Use native input/textarea",
    reason:
      "Native inputs include built-in validation, autocomplete, and mobile keyboard optimization.",
  },
  {
    ariaRole: 'role="navigation"',
    nativeHtml: "<nav>",
    recommendation: "Use native <nav>",
    reason:
      "The <nav> element automatically creates a navigation landmark without requiring role.",
  },
  {
    ariaRole: 'role="banner"',
    nativeHtml: "<header> (top-level)",
    recommendation: "Use native <header>",
    reason:
      "A top-level <header> element automatically maps to the banner landmark role.",
  },
  {
    ariaRole: 'role="contentinfo"',
    nativeHtml: "<footer> (top-level)",
    recommendation: "Use native <footer>",
    reason:
      "A top-level <footer> element automatically maps to the contentinfo landmark role.",
  },
  {
    ariaRole: 'role="main"',
    nativeHtml: "<main>",
    recommendation: "Use native <main>",
    reason:
      "The <main> element provides the main landmark and is recognized by skip-navigation implementations.",
  },
  {
    ariaRole: 'role="heading" aria-level="N"',
    nativeHtml: "<h1> through <h6>",
    recommendation: "Use native heading elements",
    reason:
      "Native headings are recognized by browser outline algorithms, screen reader quick navigation, and SEO.",
  },
  {
    ariaRole: 'role="list" + role="listitem"',
    nativeHtml: "<ul>/<ol> + <li>",
    recommendation: "Use native list elements",
    reason:
      "Native lists provide automatic item counting and nesting semantics to screen readers.",
  },
  {
    ariaRole: 'role="img"',
    nativeHtml: '<img alt="...">',
    recommendation: "Use native <img> with alt",
    reason:
      "Native img elements are optimized for lazy loading, responsive sizes, and alt text handling.",
  },
  {
    ariaRole: 'role="dialog"',
    nativeHtml: "<dialog>",
    recommendation: "Use native <dialog>",
    reason:
      "The native dialog element provides built-in modal behavior, focus trapping, and Escape to close.",
  },
  {
    ariaRole: 'role="progressbar"',
    nativeHtml: "<progress>",
    recommendation: "Use native <progress>",
    reason:
      "The native progress element handles determinate/indeterminate states with built-in accessibility.",
  },
  {
    ariaRole: 'role="slider"',
    nativeHtml: '<input type="range">',
    recommendation: "Use native range input",
    reason:
      "Native range inputs provide keyboard support, min/max handling, and step increments automatically.",
  },
]

// ---------------------------------------------------------------------------
// Common Mistakes
// ---------------------------------------------------------------------------

export const commonMistakes: CommonMistake[] = [
  {
    id: 1,
    title: "Div used as a button",
    description:
      "Using a div or span as an interactive button without keyboard support or ARIA role.",
    badCode: `<div class="btn" onclick="save()">Save</div>`,
    goodCode: `<button type="button" onclick="save()">Save</button>`,
    impact:
      "Keyboard users cannot activate the element; screen readers do not announce it as a button.",
    wcagCriteria: "4.1.2",
  },
  {
    id: 2,
    title: "Missing alt text on images",
    description:
      "Images without alt attributes are announced by their file name or ignored entirely.",
    badCode: `<img src="/hero.jpg">`,
    goodCode: `<img src="/hero.jpg" alt="Team collaborating in office">`,
    impact:
      "Screen reader users have no idea what the image conveys; fails WCAG 1.1.1.",
    wcagCriteria: "1.1.1",
  },
  {
    id: 3,
    title: "aria-hidden on focusable elements",
    description:
      "Applying aria-hidden to elements that are still focusable creates ghost focus traps.",
    badCode: `<button aria-hidden="true">Close</button>`,
    goodCode: `<button aria-hidden="true" tabindex="-1"
  disabled>Close</button>
<!-- Or remove aria-hidden if the button should be usable -->`,
    impact:
      "Screen reader users land on the element via Tab but hear nothing; extremely confusing.",
    wcagCriteria: "4.1.2",
  },
  {
    id: 4,
    title: "Missing form labels",
    description:
      "Input fields without associated labels leave screen reader users guessing what to enter.",
    badCode: `<input type="text" placeholder="Email">`,
    goodCode: `<label for="email">Email</label>
<input type="text" id="email" placeholder="e.g. user@example.com">`,
    impact:
      "Screen readers announce the field as an unlabelled text input; fails WCAG 1.3.1 and 3.3.2.",
    wcagCriteria: "1.3.1",
  },
  {
    id: 5,
    title: "Color as the only indicator",
    description:
      "Using color alone to indicate errors, required fields, or status conveys nothing to colorblind users.",
    badCode: `<input class="border-red-500" type="text">
<!-- Red border is the only error indicator -->`,
    goodCode: `<input type="text" aria-invalid="true"
  aria-errormessage="err-msg">
<p id="err-msg" class="text-red-600">
  This field is required
</p>`,
    impact:
      "Users who cannot perceive color miss the error state; fails WCAG 1.4.1.",
    wcagCriteria: "1.4.1",
  },
  {
    id: 6,
    title: "Missing skip navigation link",
    description:
      "Without a skip link, keyboard users must tab through the entire header on every page.",
    badCode: `<header>
  <nav><!-- 20+ links --></nav>
</header>
<main>...</main>`,
    goodCode: `<a href="#main" class="sr-only focus:not-sr-only">
  Skip to main content
</a>
<header>...</header>
<main id="main">...</main>`,
    impact:
      "Keyboard users waste significant time tabbing past repetitive navigation; fails WCAG 2.4.1.",
    wcagCriteria: "2.4.1",
  },
  {
    id: 7,
    title: "Auto-playing media without controls",
    description:
      "Audio or video that plays automatically with no way to pause disrupts screen reader users.",
    badCode: `<video autoplay src="/promo.mp4"></video>`,
    goodCode: `<video controls src="/promo.mp4">
  <track kind="captions" src="/captions.vtt">
</video>`,
    impact:
      "Interferes with screen reader audio; users cannot stop the media; fails WCAG 1.4.2.",
    wcagCriteria: "1.4.2",
  },
  {
    id: 8,
    title: "Incorrect heading hierarchy",
    description:
      "Skipping heading levels (e.g. h1 to h3) breaks the document outline for assistive technology.",
    badCode: `<h1>Page Title</h1>
<h3>Subsection</h3>
<!-- Skipped h2 -->`,
    goodCode: `<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>`,
    impact:
      "Screen reader users navigating by heading get a broken outline; fails WCAG 1.3.1.",
    wcagCriteria: "1.3.1",
  },
  {
    id: 9,
    title: "Focus not managed in single-page apps",
    description:
      "After a route change in an SPA, focus remains on the old content or is lost entirely.",
    badCode: `// Route change with no focus management
router.push('/dashboard')`,
    goodCode: `// After route change, move focus
router.push('/dashboard')
nextTick(() => {
  document.getElementById('main-heading')?.focus()
})`,
    impact:
      "Screen reader users are stranded at the top of the old page or in limbo; fails WCAG 2.4.3.",
    wcagCriteria: "2.4.3",
  },
  {
    id: 10,
    title: "Using role='menu' for site navigation",
    description:
      "The menu role is designed for application-style menus (like desktop app menus), not site navigation links.",
    badCode: `<ul role="menu">
  <li role="menuitem"><a href="/">Home</a></li>
  <li role="menuitem"><a href="/about">About</a></li>
</ul>`,
    goodCode: `<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>`,
    impact:
      "Screen readers switch to application mode, breaking normal link navigation expectations.",
    wcagCriteria: "4.1.2",
  },
]
