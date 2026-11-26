import type { FindingCategory, Impact, Outcome } from "@/lib/url-audit/types"

/** What the auditor says about each of its own checks. axe-core rules carry their own text. */
export interface CustomRule {
  title: string
  description: string
  fix: string
  impact: Impact
  outcome: Outcome
  category: FindingCategory
  wcag: string[]
  level: "A" | "AA" | "AAA" | "Best practice"
}

export const CUSTOM_RULES: Record<string, CustomRule> = {
  // ---- keyboard pass (pressing Tab through the page) ----
  "ab-keyboard-trap": {
    title: "Keyboard focus gets stuck",
    description: "Pressing Tab stopped moving focus forward, and neither Escape nor Shift+Tab released it. Anyone using a keyboard or switch device cannot reach the rest of the page.",
    fix: "Find the component holding focus (often a custom widget, embedded player or modal script) and make sure Tab and Shift+Tab move out of it, or Escape closes it.",
    impact: "critical",
    outcome: "violation",
    category: "keyboard",
    wcag: ["2.1.2"],
    level: "A",
  },
  "ab-keyboard-trap-soft": {
    title: "Keyboard focus is held until Escape is pressed",
    description: "Tab cycles inside one component until Escape or Shift+Tab is pressed. That passes only if the page tells keyboard users how to move on.",
    fix: "Let Tab leave the component, or show a visible instruction such as \"Press Escape to leave the editor\".",
    impact: "serious",
    outcome: "review",
    category: "keyboard",
    wcag: ["2.1.2"],
    level: "A",
  },
  "ab-focus-not-visible": {
    title: "No visible focus indicator",
    description: "We pressed Tab to each control and compared screenshots with and without focus. These controls look identical either way, so sighted keyboard users cannot see where they are.",
    fix: "Add a clear :focus-visible style, for example outline: 2px solid currentColor; outline-offset: 2px. Never remove the outline without replacing it.",
    impact: "serious",
    outcome: "violation",
    category: "keyboard",
    wcag: ["2.4.7"],
    level: "AA",
  },
  "ab-focus-hidden-element": {
    title: "Focus lands on something you cannot see",
    description: "Tab moved focus to an element that is off-screen, transparent, clipped or not rendered, so nothing visible shows where focus went.",
    fix: "Remove hidden elements from the Tab order (tabindex=\"-1\", the hidden attribute or inert), or make them visible when they receive focus, as a skip link does.",
    impact: "serious",
    outcome: "violation",
    category: "keyboard",
    wcag: ["2.4.7"],
    level: "AA",
  },
  "ab-focus-uncertain": {
    title: "Focus indicator could not be confirmed",
    description: "These controls sit in an area that changes on its own (video, animation, carousel), so the screenshot comparison could not tell whether focus is visible.",
    fix: "Tab to each one yourself and confirm a visible indicator appears.",
    impact: "moderate",
    outcome: "review",
    category: "keyboard",
    wcag: ["2.4.7"],
    level: "AA",
  },
  "ab-focus-obscured": {
    title: "Focused element hidden behind other content",
    description: "When these controls received focus they were completely covered, usually by a sticky header, cookie banner or chat widget.",
    fix: "Add scroll-padding-top equal to the sticky header's height, and keep banners from covering the content behind them.",
    impact: "serious",
    outcome: "violation",
    category: "keyboard",
    wcag: ["2.4.11"],
    level: "AA",
  },
  "ab-focus-lost": {
    title: "Focus drops back to the page",
    description: "After some Tab presses focus went to the document itself before carrying on. Keyboard and screen reader users lose their place.",
    fix: "Check for elements that are removed or hidden while focused, and move focus somewhere sensible before removing them.",
    impact: "moderate",
    outcome: "review",
    category: "keyboard",
    wcag: ["2.4.3"],
    level: "A",
  },
  "ab-focus-order-jump": {
    title: "Focus jumps back up the page",
    description: "The Tab order moved a long way back up the page, which can mean the reading order and the focus order disagree.",
    fix: "Make the DOM order match the visual order rather than reordering with CSS or positive tabindex.",
    impact: "minor",
    outcome: "review",
    category: "keyboard",
    wcag: ["2.4.3"],
    level: "A",
  },

  // ---- layout ----
  "ab-reflow": {
    title: "Content scrolls sideways at 320 pixels wide",
    description: "At a 320 CSS pixel wide window, the width of a phone or a desktop zoomed to 400%, the page is wider than the screen. People who zoom have to scroll in two directions to read each line.",
    fix: "Replace fixed widths with max-width: 100%, let flex and grid rows wrap, and allow long words and URLs to break (overflow-wrap: anywhere).",
    impact: "serious",
    outcome: "violation",
    category: "layout",
    wcag: ["1.4.10"],
    level: "AA",
  },
  "ab-reflow-clipped": {
    title: "Content may be cut off at 320 pixels wide",
    description: "At 320 CSS pixels wide, these elements extend past the right edge, but the page hides horizontal overflow, so the part past the edge cannot be reached at all.",
    fix: "Let the content wrap instead of hiding the overflow. Check the elements listed at a narrow width.",
    impact: "serious",
    outcome: "review",
    category: "layout",
    wcag: ["1.4.10"],
    level: "AA",
  },
  "ab-text-spacing": {
    title: "Text is cut off when spacing is increased",
    description: "We applied the text spacing WCAG 1.4.12 names (line height 1.5, letter spacing 0.12em, word spacing 0.16em, paragraph spacing 2em). These containers started hiding their text. People with dyslexia often use exactly these settings.",
    fix: "Avoid fixed heights on text containers; use min-height and let them grow. Do not combine fixed heights with overflow: hidden.",
    impact: "moderate",
    outcome: "review",
    category: "layout",
    wcag: ["1.4.12"],
    level: "AA",
  },
  "ab-motion-ignored": {
    title: "Animations ignore the reduced-motion setting",
    description: "Animations that loop forever kept running after we turned on the operating system's \"reduce motion\" preference. Movement can trigger nausea and dizziness for people with vestibular disorders, and distracts people with attention difficulties.",
    fix: "Wrap decorative animation in @media (prefers-reduced-motion: no-preference), and give anything that moves for more than five seconds a pause button.",
    impact: "moderate",
    outcome: "review",
    category: "media",
    wcag: ["2.2.2"],
    level: "A",
  },
  "ab-small-text": {
    title: "Very small text",
    description: "Text set below 12 pixels is hard to read for many people with low vision, even before they zoom.",
    fix: "Use at least 14 to 16 pixels for body text and 12 pixels for fine print, in rem units so it follows the browser's text size.",
    impact: "minor",
    outcome: "review",
    category: "layout",
    wcag: [],
    level: "Best practice",
  },
  "ab-justified-text": {
    title: "Justified paragraphs",
    description: "Fully justified text creates uneven gaps between words (rivers), which makes reading harder for people with dyslexia.",
    fix: "Use text-align: left (or start) for paragraphs.",
    impact: "minor",
    outcome: "review",
    category: "layout",
    wcag: ["1.4.8"],
    level: "AAA",
  },

  // ---- images ----
  "ab-img-alt-filename": {
    title: "Alt text is a file name or a placeholder",
    description: "These images have alt text, which is all axe-core checks, but the text is a file name or a word like \"image\". A screen reader user hears that instead of what the image shows.",
    fix: "Write what the image conveys in this context. If it is decorative, use alt=\"\" so screen readers skip it.",
    impact: "serious",
    outcome: "violation",
    category: "images",
    wcag: ["1.1.1"],
    level: "A",
  },
  "ab-img-alt-quality": {
    title: "Alt text that could be better",
    description: "Alt text that starts with \"image of\" repeats what the screen reader already says, and very long alt text is tiring to listen to and cannot be paused.",
    fix: "Drop \"image of\"; keep alt text short and put long descriptions in visible text or a linked description.",
    impact: "minor",
    outcome: "review",
    category: "images",
    wcag: ["1.1.1"],
    level: "A",
  },

  // ---- forms ----
  "ab-input-placeholder-label": {
    title: "Fields labelled only by placeholder text",
    description: "The only label is placeholder text, which disappears as soon as someone types, is usually low contrast, and is not reliably announced by every screen reader.",
    fix: "Add a visible <label for=\"...\"> for each field. Keep the placeholder for an example format, if at all.",
    impact: "moderate",
    outcome: "review",
    category: "forms",
    wcag: ["3.3.2"],
    level: "A",
  },
  "ab-autocomplete-missing": {
    title: "Personal data fields without autocomplete",
    description: "Fields that look like they collect the user's own name, email, phone or address do not say so with the autocomplete attribute. Browsers and assistive tools cannot fill them in, which matters most to people with motor and memory impairments.",
    fix: "Add the matching token, for example autocomplete=\"email\", \"tel\", \"given-name\", \"postal-code\". Leave it off only for fields about someone else.",
    impact: "moderate",
    outcome: "review",
    category: "forms",
    wcag: ["1.3.5"],
    level: "AA",
  },
  "ab-required-not-exposed": {
    title: "Required fields not announced as required",
    description: "The label shows an asterisk or the word \"required\", but the field has no required or aria-required attribute, so screen readers do not announce it as required.",
    fix: "Add the required attribute (or aria-required=\"true\") to each required field, and explain what the asterisk means at the top of the form.",
    impact: "moderate",
    outcome: "violation",
    category: "forms",
    wcag: ["1.3.1", "3.3.2"],
    level: "A",
  },

  // ---- keyboard reach (DOM) ----
  "ab-role-not-focusable": {
    title: "Interactive roles a keyboard cannot reach",
    description: "These elements tell screen readers they are buttons, links, tabs or other controls, but they are not focusable, so keyboard users cannot reach or operate them.",
    fix: "Use a real <button> or <a href>. If that is impossible, add tabindex=\"0\" and handle Enter and Space.",
    impact: "serious",
    outcome: "violation",
    category: "keyboard",
    wcag: ["2.1.1"],
    level: "A",
  },
  "ab-clickable-not-focusable": {
    title: "Looks clickable, but a keyboard cannot reach it",
    description: "These elements show a pointer cursor, which usually means they respond to clicks, but they are not links, buttons or focusable. If they do something, keyboard users cannot do it.",
    fix: "If the element is interactive, make it a <button> or <a href>. If it is not, remove cursor: pointer.",
    impact: "moderate",
    outcome: "review",
    category: "keyboard",
    wcag: ["2.1.1"],
    level: "A",
  },

  // ---- links and navigation ----
  "ab-link-generic-text": {
    title: "Vague link text",
    description: "Links such as \"read more\" and \"click here\" make no sense out of context. Screen reader users often browse a list of links, where every one of these sounds the same.",
    fix: "Write link text that names the destination, or add the context with visually hidden text or aria-describedby.",
    impact: "moderate",
    outcome: "review",
    category: "navigation",
    wcag: ["2.4.4"],
    level: "A",
  },
  "ab-link-new-window": {
    title: "Links open a new window without warning",
    description: "These links open a new tab or window, but nothing tells people in advance. Screen reader users find the Back button no longer works.",
    fix: "Add \"(opens in a new tab)\" as visible or visually hidden text, or an icon with that text alternative.",
    impact: "minor",
    outcome: "review",
    category: "navigation",
    wcag: [],
    level: "Best practice",
  },
  "ab-link-file-type": {
    title: "Links to files do not say what the file is",
    description: "These links download a PDF, Word or similar file without saying so. People using assistive technology may land in an inaccessible document or app without warning.",
    fix: "Include the file type and size in the link text, for example \"Annual report (PDF, 2 MB)\".",
    impact: "minor",
    outcome: "review",
    category: "navigation",
    wcag: [],
    level: "Best practice",
  },
  "ab-title-generic": {
    title: "Page title does not describe the page",
    description: "The page title is generic, so people using screen readers, tabs or bookmarks cannot tell this page from others.",
    fix: "Use a title that names the page first and the site second, for example \"Pricing | Example Inc\".",
    impact: "moderate",
    outcome: "review",
    category: "navigation",
    wcag: ["2.4.2"],
    level: "A",
  },

  // ---- media ----
  "ab-video-captions": {
    title: "Video without a captions track",
    description: "These videos have no <track kind=\"captions\">. If they contain speech, Deaf and hard-of-hearing people miss it. Captions burned into the video also pass, so check by watching.",
    fix: "Add a WebVTT captions file with <track kind=\"captions\" srclang=\"en\" label=\"English\">, or confirm the video has no speech.",
    impact: "serious",
    outcome: "review",
    category: "media",
    wcag: ["1.2.2"],
    level: "A",
  },
  "ab-autoplay-video": {
    title: "Video plays automatically with no way to stop it",
    description: "These videos start on their own and run for more than five seconds with no controls. Moving content that cannot be paused distracts people with attention and reading difficulties.",
    fix: "Add controls, or a visible pause button, and respect prefers-reduced-motion by not autoplaying.",
    impact: "moderate",
    outcome: "review",
    category: "media",
    wcag: ["2.2.2"],
    level: "A",
  },
  "ab-fake-list": {
    title: "Lists built from paragraphs",
    description: "These paragraphs start with bullet characters or numbers, so they look like a list but are not marked up as one. Screen readers do not announce the list or how many items it has.",
    fix: "Use <ul> or <ol> with <li> items.",
    impact: "minor",
    outcome: "review",
    category: "structure",
    wcag: ["1.3.1"],
    level: "A",
  },
}

/** The criterion page on this site, which every 2.x success criterion has. */
export function scHelpUrl(sc: string | undefined): string {
  return sc ? `https://accessibility.build/wcag/${sc.replace(/\./g, "-")}` : "https://accessibility.build/guides/automated-vs-manual-accessibility-testing"
}
