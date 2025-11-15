export interface SuccessCriterion {
  number: string
  title: string
  level: 'A' | 'AA' | 'AAA'
  description: string
  guideline: string
  principle: string
  version: '2.0' | '2.1' | '2.2'
  introduced: '2.0' | '2.1' | '2.2'
}

export const wcagCriteria: SuccessCriterion[] = [
  // Principle 1: Perceivable - Text Alternatives
  {
    number: "1.1.1",
    title: "Non-text Content",
    level: "A",
    description: "All non-text content has appropriate text alternatives that serve the equivalent purpose.",
    guideline: "1.1 Text Alternatives",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },

  // Principle 1: Perceivable - Time-based Media
  {
    number: "1.2.1",
    title: "Audio-only and Video-only (Prerecorded)",
    level: "A",
    description: "Provide alternatives for prerecorded audio-only and video-only content.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.2.2",
    title: "Captions (Prerecorded)",
    level: "A",
    description: "Captions are provided for all prerecorded audio content in synchronized media.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.2.3",
    title: "Audio Description or Media Alternative (Prerecorded)",
    level: "A",
    description: "Audio description or full text alternative is provided for prerecorded video content.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.2.4",
    title: "Captions (Live)",
    level: "AA",
    description: "Captions are provided for all live audio content in synchronized media.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.2.5",
    title: "Audio Description (Prerecorded)",
    level: "AA",
    description: "Audio description is provided for all prerecorded video content.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.2.6",
    title: "Sign Language (Prerecorded)",
    level: "AAA",
    description: "Sign language interpretation is provided for all prerecorded audio content.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.2.7",
    title: "Extended Audio Description (Prerecorded)",
    level: "AAA",
    description: "Extended audio description is provided when regular audio description is insufficient.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.2.8",
    title: "Media Alternative (Prerecorded)",
    level: "AAA",
    description: "A text alternative is provided for all prerecorded synchronized media.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.2.9",
    title: "Audio-only (Live)",
    level: "AAA",
    description: "A text alternative is provided for live audio-only content.",
    guideline: "1.2 Time-based Media",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },

  // Principle 1: Perceivable - Adaptable
  {
    number: "1.3.1",
    title: "Info and Relationships",
    level: "A",
    description: "Information, structure, and relationships can be programmatically determined.",
    guideline: "1.3 Adaptable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.3.2",
    title: "Meaningful Sequence",
    level: "A",
    description: "Content can be presented in a meaningful sequence without losing meaning.",
    guideline: "1.3 Adaptable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.3.3",
    title: "Sensory Characteristics",
    level: "A",
    description: "Instructions don't rely solely on sensory characteristics of components.",
    guideline: "1.3 Adaptable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.0"
  },
  {
    number: "1.3.4",
    title: "Orientation",
    level: "AA",
    description: "Content does not restrict its view to a single display orientation.",
    guideline: "1.3 Adaptable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.3.5",
    title: "Identify Input Purpose",
    level: "AA",
    description: "The purpose of input fields can be programmatically determined.",
    guideline: "1.3 Adaptable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.3.6",
    title: "Identify Purpose",
    level: "AAA",
    description: "The purpose of User Interface Components can be programmatically determined.",
    guideline: "1.3 Adaptable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 1: Perceivable - Distinguishable
  {
    number: "1.4.1",
    title: "Use of Color",
    level: "A",
    description: "Color is not used as the only visual means of conveying information.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.2",
    title: "Audio Control",
    level: "A",
    description: "Audio that plays automatically can be paused, stopped, or controlled.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.3",
    title: "Contrast (Minimum)",
    level: "AA",
    description: "Text has a contrast ratio of at least 4.5:1 (3:1 for large text).",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.4",
    title: "Resize Text",
    level: "AA",
    description: "Text can be resized up to 200% without loss of content or functionality.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.5",
    title: "Images of Text",
    level: "AA",
    description: "Text is used instead of images of text, except for customizable or essential images.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.6",
    title: "Contrast (Enhanced)",
    level: "AAA",
    description: "Text has a contrast ratio of at least 7:1 (4.5:1 for large text).",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.7",
    title: "Low or No Background Audio",
    level: "AAA",
    description: "Audio content has no background sounds or they can be turned off.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.8",
    title: "Visual Presentation",
    level: "AAA",
    description: "Text content presentation can be adjusted by the user.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.9",
    title: "Images of Text (No Exception)",
    level: "AAA",
    description: "Images of text are only used for decoration or where essential.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.10",
    title: "Reflow",
    level: "AA",
    description: "Content can be presented without horizontal scrolling at 320 CSS pixels width.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.11",
    title: "Non-text Contrast",
    level: "AA",
    description: "UI components and graphical objects have sufficient contrast (3:1 minimum).",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.12",
    title: "Text Spacing",
    level: "AA",
    description: "No loss of content when text spacing is adjusted within certain parameters.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "1.4.13",
    title: "Content on Hover or Focus",
    level: "AA",
    description: "Additional content triggered by hover or focus can be dismissed and doesn't interfere.",
    guideline: "1.4 Distinguishable",
    principle: "1. Perceivable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 2: Operable - Keyboard Accessible
  {
    number: "2.1.1",
    title: "Keyboard",
    level: "A",
    description: "All functionality is available from a keyboard interface.",
    guideline: "2.1 Keyboard Accessible",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.1.2",
    title: "No Keyboard Trap",
    level: "A",
    description: "Focus can be moved away from any component using standard keyboard methods.",
    guideline: "2.1 Keyboard Accessible",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.1.3",
    title: "Keyboard (No Exception)",
    level: "AAA",
    description: "All functionality is available from a keyboard interface without exception.",
    guideline: "2.1 Keyboard Accessible",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.1.4",
    title: "Character Key Shortcuts",
    level: "A",
    description: "Single character key shortcuts can be turned off or remapped.",
    guideline: "2.1 Keyboard Accessible",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 2: Operable - Enough Time
  {
    number: "2.2.1",
    title: "Timing Adjustable",
    level: "A",
    description: "Users can turn off, adjust, or extend time limits.",
    guideline: "2.2 Enough Time",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.2.2",
    title: "Pause, Stop, Hide",
    level: "A",
    description: "Moving, blinking, or auto-updating content can be paused, stopped, or hidden.",
    guideline: "2.2 Enough Time",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.2.3",
    title: "No Timing",
    level: "AAA",
    description: "Timing is not an essential part of the event or activity.",
    guideline: "2.2 Enough Time",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.2.4",
    title: "Interruptions",
    level: "AAA",
    description: "Interruptions can be postponed or suppressed by the user.",
    guideline: "2.2 Enough Time",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.2.5",
    title: "Re-authenticating",
    level: "AAA",
    description: "User data is preserved when a session expires and re-authentication is required.",
    guideline: "2.2 Enough Time",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.2.6",
    title: "Timeouts",
    level: "AAA",
    description: "Users are warned of the duration of inactivity that could cause data loss.",
    guideline: "2.2 Enough Time",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 2: Operable - Seizures and Physical Reactions
  {
    number: "2.3.1",
    title: "Three Flashes or Below Threshold",
    level: "A",
    description: "Content does not contain anything that flashes more than three times per second.",
    guideline: "2.3 Seizures and Physical Reactions",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.3.2",
    title: "Three Flashes",
    level: "AAA",
    description: "Web pages do not contain anything that flashes more than three times per second.",
    guideline: "2.3 Seizures and Physical Reactions",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.3.3",
    title: "Animation from Interactions",
    level: "AAA",
    description: "Motion animation triggered by interaction can be disabled.",
    guideline: "2.3 Seizures and Physical Reactions",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 2: Operable - Navigable
  {
    number: "2.4.1",
    title: "Bypass Blocks",
    level: "A",
    description: "A mechanism is available to bypass blocks of content that are repeated.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.2",
    title: "Page Titled",
    level: "A",
    description: "Web pages have titles that describe topic or purpose.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.3",
    title: "Focus Order",
    level: "A",
    description: "Focusable components receive focus in an order that preserves meaning.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.4",
    title: "Link Purpose (In Context)",
    level: "A",
    description: "The purpose of each link can be determined from link text or context.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.5",
    title: "Multiple Ways",
    level: "AA",
    description: "More than one way is available to locate a page within a set of pages.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.6",
    title: "Headings and Labels",
    level: "AA",
    description: "Headings and labels describe topic or purpose.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.7",
    title: "Focus Visible",
    level: "AA",
    description: "Any keyboard operable interface has a visible focus indicator.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.8",
    title: "Location",
    level: "AAA",
    description: "Information about the user's location within a set of pages is available.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.9",
    title: "Link Purpose (Link Only)",
    level: "AAA",
    description: "The purpose of each link can be identified from the link text alone.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.10",
    title: "Section Headings",
    level: "AAA",
    description: "Section headings are used to organize the content.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.11",
    title: "Focus Not Obscured (Minimum)",
    level: "AA",
    description: "When a component receives keyboard focus, it is not entirely hidden.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.12",
    title: "Focus Not Obscured (Enhanced)",
    level: "AAA",
    description: "When a component receives keyboard focus, no part of it is hidden.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.4.13",
    title: "Focus Appearance",
    level: "AAA",
    description: "The focus indicator has sufficient size and contrast.",
    guideline: "2.4 Navigable",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 2: Operable - Input Modalities
  {
    number: "2.5.1",
    title: "Pointer Gestures",
    level: "A",
    description: "Functionality that uses multipoint or path-based gestures has alternatives.",
    guideline: "2.5 Input Modalities",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.5.2",
    title: "Pointer Cancellation",
    level: "A",
    description: "Functions triggered by single pointer can be cancelled or undone.",
    guideline: "2.5 Input Modalities",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.5.3",
    title: "Label in Name",
    level: "A",
    description: "The accessible name contains the visible label text.",
    guideline: "2.5 Input Modalities",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.5.4",
    title: "Motion Actuation",
    level: "A",
    description: "Functionality triggered by device motion can be disabled and has alternatives.",
    guideline: "2.5 Input Modalities",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.5.5",
    title: "Target Size (Enhanced)",
    level: "AAA",
    description: "Target size is at least 44 by 44 CSS pixels except in specific cases.",
    guideline: "2.5 Input Modalities",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.5.6",
    title: "Concurrent Input Mechanisms",
    level: "AAA",
    description: "Content does not restrict use of input modalities.",
    guideline: "2.5 Input Modalities",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.5.7",
    title: "Dragging Movements",
    level: "AA",
    description: "Functionality that uses dragging has a single pointer alternative.",
    guideline: "2.5 Input Modalities",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "2.5.8",
    title: "Target Size (Minimum)",
    level: "AA",
    description: "Target size is at least 24 by 24 CSS pixels except in specific cases.",
    guideline: "2.5 Input Modalities",
    principle: "2. Operable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 3: Understandable - Readable
  {
    number: "3.1.1",
    title: "Language of Page",
    level: "A",
    description: "The default human language of each page can be programmatically determined.",
    guideline: "3.1 Readable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.1.2",
    title: "Language of Parts",
    level: "AA",
    description: "The human language of each passage can be programmatically determined.",
    guideline: "3.1 Readable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.1.3",
    title: "Unusual Words",
    level: "AAA",
    description: "A mechanism is available for identifying specific definitions of words.",
    guideline: "3.1 Readable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.1.4",
    title: "Abbreviations",
    level: "AAA",
    description: "A mechanism for identifying the expanded form of abbreviations is available.",
    guideline: "3.1 Readable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.1.5",
    title: "Reading Level",
    level: "AAA",
    description: "Text requires reading ability no higher than lower secondary education level.",
    guideline: "3.1 Readable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.1.6",
    title: "Pronunciation",
    level: "AAA",
    description: "A mechanism is available for identifying pronunciation of words.",
    guideline: "3.1 Readable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 3: Understandable - Predictable
  {
    number: "3.2.1",
    title: "On Focus",
    level: "A",
    description: "When a component receives focus, it does not initiate a change of context.",
    guideline: "3.2 Predictable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.2.2",
    title: "On Input",
    level: "A",
    description: "Changing settings of a component does not automatically cause context changes.",
    guideline: "3.2 Predictable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.2.3",
    title: "Consistent Navigation",
    level: "AA",
    description: "Navigational mechanisms are repeated in the same relative order.",
    guideline: "3.2 Predictable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.2.4",
    title: "Consistent Identification",
    level: "AA",
    description: "Components with the same functionality are identified consistently.",
    guideline: "3.2 Predictable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.2.5",
    title: "Change on Request",
    level: "AAA",
    description: "Changes of context are initiated only by user request.",
    guideline: "3.2 Predictable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.2.6",
    title: "Consistent Help",
    level: "A",
    description: "Help mechanisms appear in the same relative order across pages.",
    guideline: "3.2 Predictable",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 3: Understandable - Input Assistance
  {
    number: "3.3.1",
    title: "Error Identification",
    level: "A",
    description: "Input errors are automatically detected and described to the user.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.3.2",
    title: "Labels or Instructions",
    level: "A",
    description: "Labels or instructions are provided when content requires user input.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.3.3",
    title: "Error Suggestion",
    level: "AA",
    description: "Input error suggestions are provided when errors are detected.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.3.4",
    title: "Error Prevention (Legal, Financial, Data)",
    level: "AA",
    description: "Important transactions can be reversed, checked, or confirmed.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.3.5",
    title: "Help",
    level: "AAA",
    description: "Context-sensitive help is available.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.3.6",
    title: "Error Prevention (All)",
    level: "AAA",
    description: "All user input can be checked and confirmed before submission.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.3.7",
    title: "Redundant Entry",
    level: "A",
    description: "Information previously entered is either auto-populated or selectable.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.3.8",
    title: "Accessible Authentication (Minimum)",
    level: "AA",
    description: "Authentication methods don't rely solely on cognitive function tests.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "3.3.9",
    title: "Accessible Authentication (Enhanced)",
    level: "AAA",
    description: "Authentication methods don't rely on cognitive function tests.",
    guideline: "3.3 Input Assistance",
    principle: "3. Understandable",
    version: "2.2",
    introduced: "2.1"
  },

  // Principle 4: Robust - Compatible
  {
    number: "4.1.2",
    title: "Name, Role, Value",
    level: "A",
    description: "Name, role, and value can be programmatically determined for UI components.",
    guideline: "4.1 Compatible",
    principle: "4. Robust",
    version: "2.2",
    introduced: "2.1"
  },
  {
    number: "4.1.3",
    title: "Status Messages",
    level: "AA",
    description: "Status messages can be programmatically determined through role or properties.",
    guideline: "4.1 Compatible",
    principle: "4. Robust",
    version: "2.2",
    introduced: "2.1"
  }
]

export const getWCAGStats = () => {
  const total = wcagCriteria.length
  const byLevel = {
    A: wcagCriteria.filter(c => c.level === 'A').length,
    AA: wcagCriteria.filter(c => c.level === 'AA').length,
    AAA: wcagCriteria.filter(c => c.level === 'AAA').length
  }
  
  const byPrinciple = wcagCriteria.reduce((acc, criterion) => {
    acc[criterion.principle] = (acc[criterion.principle] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return { total, byLevel, byPrinciple }
} 