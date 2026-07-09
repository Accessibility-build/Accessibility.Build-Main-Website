import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import SensoryCharacteristicsDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.3.3 Sensory Characteristics - Complete Guide",
  path: "/wcag/1-3-3",
  description:
    "Complete guide to WCAG 1.3.3 Sensory Characteristics. Interactive examples of accessible instructions, avoiding color-only and shape-only references.",
  keywords: [
    "WCAG 1.3.3",
    "sensory characteristics",
    "instructions",
    "color blind",
    "accessible design",
    "visual cues",
    "audio cues",
  ],
  type: "article",
  image: "/api/og?title=WCAG%201.3.3%20Sensory%20Characteristics&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 1.3.3 Sensory Characteristics require?",
    a: "It requires that instructions for understanding and operating content do not rely solely on sensory characteristics of components such as shape, color, size, visual location, orientation, or sound. In plain terms, when you tell users how to find or use something, you must identify it by something they can perceive regardless of ability — usually its visible text or programmatic name. You may still mention the sensory cue as an extra hint, but it cannot be the only way to know which thing you mean. It is a Level A criterion and has been part of WCAG since 2.0.",
  },
  {
    q: "Does 1.3.3 mean I can never mention color, shape, or location?",
    a: "No. The word that matters is 'solely'. You are free to say 'click the green Save button in the top-right corner' because the word 'Save' identifies the control on its own — the color and location are just additional, redundant help. The failure is when the sensory cue is the ONLY identifier, as in 'click the green button' or 'use the menu on the right', where a user who cannot perceive color or position has nothing else to go on. Add a non-sensory identifier and the sensory cue becomes a bonus rather than a barrier.",
  },
  {
    q: "How is 1.3.3 different from 1.4.1 Use of Color?",
    a: "They overlap but 1.3.3 is broader. 1.4.1 Use of Color deals specifically with color as the only visual means of conveying information, indicating an action, or distinguishing an element. 1.3.3 covers color too, but also shape, size, visual location, orientation, and sound — and it is specifically about instructions for understanding and operating content. A page can pass 1.4.1 (color is not the issue) yet still fail 1.3.3 if its instructions rely on shape or position. Treat them as complementary: fix color for 1.4.1, and fix every sensory-only instruction for 1.3.3.",
  },
  {
    q: "Which sensory characteristics does the criterion name?",
    a: "The success criterion explicitly lists shape ('the round button'), color ('the green link'), size ('the large icon'), visual location ('the box on the right', 'the third column', 'below'), orientation ('portrait vs landscape'), and sound ('when you hear the beep'). Any instruction that leans only on one of these is at risk. The reliable fix in every case is the same: refer to the control or content by its visible name or label, which is perceivable through text, speech, and braille alike.",
  },
  {
    q: "What is the recommended fix for a sensory-only instruction?",
    a: "Reference the control by its visible text or accessible name rather than its appearance or position. 'Click Submit' works everywhere; 'click the button below' does not. If a control has no visible text — an icon-only button, for example — give it an accessible name and refer to that name in your instructions. This single habit, naming things instead of describing where or how they look, resolves the large majority of 1.3.3 issues and also makes your instructions clearer for sighted users on small screens where 'right' and 'below' shift around.",
  },
  {
    q: "How does 1.3.3 relate to 1.3.1 Info and Relationships?",
    a: "They are companion criteria under Guideline 1.3 Adaptable. 1.3.1 asks that structure and relationships conveyed visually are also available programmatically, so assistive technology can present them. 1.3.3 addresses the instructions that tell users how to operate that content, making sure those instructions do not depend on sensory perception. Together they ensure both the content's structure and the guidance for using it survive being converted into speech, braille, or a reflowed mobile layout.",
  },
]

export default function WCAG133Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.3: Sensory Characteristics"
        description="Instructions provided for understanding and operating content do not rely solely on sensory characteristics of components such as shape, color, size, visual location, orientation, or sound."
        criteria="1.3.3"
        level="A"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-3"
        category="Adaptable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.3.3 Sensory Characteristics", url: "https://accessibility.build/wcag/1-3-3" },
        ]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/wcag"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    WCAG Success Criteria
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    1.3.3 Sensory Characteristics
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Name things, don&rsquo;t describe them
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.3.3: Sensory Characteristics
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              &ldquo;Click the green button.&rdquo; &ldquo;See the box on the right.&rdquo;
              &ldquo;When you hear the beep&hellip;&rdquo; Instructions like these quietly exclude
              anyone who cannot perceive the cue they lean on. This criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                instructions never rely solely on shape, color, size, visual location,
                orientation, or sound
              </strong>
              . The fix is almost always the same: identify the thing by its name, and the
              sensory hint becomes a helpful extra rather than the only way in.
            </p>
          </header>

          {/* Official text callout */}
          <section
            aria-labelledby="official-text"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6"
          >
            <h2
              id="official-text"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3"
            >
              The success criterion, in full
            </h2>
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-blue-500 pl-4">
              Instructions provided for understanding and operating content do not rely solely
              on sensory characteristics of components such as shape, color, size, visual
              location, orientation, or sound.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The key word is <strong>solely</strong>. You may reference a sensory characteristic
              as long as it is not the <em>only</em> way to identify the component. A note in the
              specification adds that for requirements related to color specifically, you should
              also refer to{" "}
              <Link
                href="/wcag/1-4-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.1 Use of Color
              </Link>
              .
            </p>
          </section>

          {/* On this page */}
          <nav
            aria-label="On this page"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              On this page
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-blue-600 dark:text-blue-400">
              <li>
                <a className="hover:underline" href="#who-it-helps">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  What the requirement covers
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#demo">
                  Interactive demo
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Who it helps */}
          <section aria-labelledby="who-it-helps" className="mb-12">
            <h2
              id="who-it-helps"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              An instruction is only useful if the reader can act on it. When instructions lean
              on a single sensory cue, whole groups of users are locked out of following them:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Blind and low-vision users",
                  d: "A screen reader conveys no shape, color, or on-screen position. 'Click the round icon on the right' is meaningless; 'click Play' works perfectly.",
                },
                {
                  t: "Color-blind users",
                  d: "Roughly 1 in 12 men cannot reliably distinguish red from green. 'Press the green button' leaves them guessing between controls that look the same to them.",
                },
                {
                  t: "Deaf and hard-of-hearing users",
                  d: "Instructions that depend on sound — 'wait for the beep', 'listen for the chime' — never reach users who cannot hear the audio cue.",
                },
                {
                  t: "Mobile and responsive users",
                  d: "Layouts reflow: a menu 'on the right' on desktop moves to the top or into a drawer on a phone. Location-based instructions break as the design adapts.",
                },
                {
                  t: "Users with cognitive disabilities",
                  d: "A concrete name ('the Submit button') is easier to locate and remember than an abstract spatial or visual description of where something sits.",
                },
                {
                  t: "Voice-control users",
                  d: "People who operate a page by speaking control names ('click Submit') depend on those names existing — position and color are not something they can say.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What the requirement covers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The criterion targets <em>instructions</em> — any text that tells a user how to
              understand or operate content. It fails when the only way to identify the thing the
              instruction points at is a sensory characteristic. There are six named characteristics
              to watch for:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Shape",
                  d: "“Click the round button”, “select the square icon”. Shape is invisible to screen readers and unclear even to many sighted users.",
                },
                {
                  t: "Color",
                  d: "“Press the green button”, “fields marked in red are required”. Fails color-blind users; overlaps with 1.4.1 Use of Color.",
                },
                {
                  t: "Size",
                  d: "“The large button”, “the small link at the end”. Size is relative and changes when users zoom or reflow the page.",
                },
                {
                  t: "Visual location",
                  d: "“The menu on the right”, “the box below”, “instructions in the left column”. Position shifts by viewport and means nothing in a linear reading order.",
                },
                {
                  t: "Orientation",
                  d: "“Rotate to landscape and tap the bar along the top”. Orientation may be fixed by mounting or by the user’s own needs.",
                },
                {
                  t: "Sound",
                  d: "“When you hear the beep”, “listen for the chime”. Audio-only cues exclude deaf and hard-of-hearing users.",
                },
              ].map((item) => (
                <li
                  key={item.t}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{item.t}.</strong>{" "}
                    {item.d}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The fix: add a non-sensory identifier
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              You do not have to strip out sensory cues — you have to make sure they are never the{" "}
              <em>only</em> cue. Reference the control by its visible text or accessible name, and
              the sensory description becomes a helpful extra. &ldquo;Click the green Save
              button&rdquo; passes, because &ldquo;Save&rdquo; identifies the control on its own.
              This criterion is a close companion to{" "}
              <Link
                href="/wcag/1-3-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.3.1 Info and Relationships
              </Link>{" "}
              and is broader than{" "}
              <Link
                href="/wcag/1-4-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.1 Use of Color
              </Link>
              , which addresses color alone.
            </p>
          </section>

          {/* Pass / fail */}
          <section aria-labelledby="pass-fail" className="mb-12">
            <h2
              id="pass-fail"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                  ✓ Passes 1.3.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>&ldquo;Click the <strong>Save</strong> button to store your work.&rdquo;</li>
                  <li>
                    &ldquo;Use the <strong>Search</strong> field to find a product&rdquo; — named,
                    not &ldquo;the box at the top&rdquo;.
                  </li>
                  <li>
                    &ldquo;Required fields are marked with an asterisk (*) and the word
                    Required&rdquo; — text, not color alone.
                  </li>
                  <li>
                    &ldquo;Click the green <strong>Save</strong> button&rdquo; — color is fine because
                    &ldquo;Save&rdquo; identifies it.
                  </li>
                  <li>
                    &ldquo;A confirmation message appears when the upload finishes&rdquo; — a visible
                    cue, not just a beep.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.3.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>&ldquo;Click the green button to continue.&rdquo;</li>
                  <li>&ldquo;Select the round icon to play the video.&rdquo;</li>
                  <li>&ldquo;Use the menu on the right to navigate.&rdquo;</li>
                  <li>&ldquo;See the instructions in the box below.&rdquo;</li>
                  <li>&ldquo;When you hear the beep, your file is ready.&rdquo;</li>
                  <li>&ldquo;Tap the large button to submit.&rdquo;</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Color and shape: name the control
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Replace the sensory description with the control&rsquo;s visible label. The color and
              icon can stay — they just can&rsquo;t be the only identifier.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Instruction relies on color / shape alone -->
<p>To continue, click the green button.</p>
<p>Select the round option to subscribe.</p>
<button class="btn-green"></button>

<!-- ✓ Instruction names the control; color is a bonus -->
<p>To continue, click the "Save" button.</p>
<p>Select the "Monthly plan" option to subscribe.</p>
<button class="btn-green">Save</button>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Visual location: refer to labels, not position
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Position changes when a layout reflows and means nothing in a screen reader&rsquo;s
              linear order. Point to a named landmark or control instead.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Instruction relies on visual location -->
<p>Use the menu on the right to navigate.</p>
<p>Read the notes in the left-hand column.</p>
<p>Click the button below to submit.</p>

<!-- ✓ Instruction refers to a named element -->
<p>Use the "Main navigation" menu to move between sections.</p>
<p>Read the "Author notes" section for details.</p>
<p>Click the "Submit form" button when you are ready.</p>

<nav aria-label="Main navigation"> ... </nav>
<button>Submit form</button>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Sound and status: add a visible, programmatic cue
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              An audible signal alone excludes deaf users. Pair it with visible text and announce it
              to assistive technology with a live region.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ The only completion cue is a beep -->
<p>Listen for the beep when your upload finishes.</p>
<audio src="beep.mp3" autoplay></audio>

<!-- ✓ A visible message, announced to assistive tech -->
<p>A confirmation message appears when your upload finishes.</p>
<div role="status" aria-live="polite">
  Upload complete. Your file has been saved.
</div>`}</code>
            </pre>
          </section>

          {/* Interactive demo */}
          <section aria-labelledby="demo" className="mb-12">
            <h2
              id="demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Interactive demo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Switch between the sensory characteristics below to compare an instruction that relies
              solely on the cue with one that names the control. Toggle the color-blind view to see
              how a color-only instruction collapses when the color can&rsquo;t be told apart.
            </p>
            <SensoryCharacteristicsDemo />
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Instructions that identify a control only by color: 'click the green button', 'red fields are required'.",
                "Instructions that identify a control only by shape: 'press the round button', 'the square icon stops playback'.",
                "Instructions that identify a control only by size: 'tap the large button', 'the small link at the bottom'.",
                "Instructions that rely on visual location: 'the menu on the right', 'the box below', 'in the left column'.",
                "Instructions that rely on orientation: 'rotate to landscape and use the bar along the top'.",
                "Instructions that rely on sound: 'wait for the beep', 'listen for the chime to know it saved'.",
                "Icon-only controls with no visible label or accessible name, so there is no non-sensory way to refer to them.",
                "Help text and tutorials written against a fixed desktop layout, so 'top-right' and 'below' are wrong on mobile.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.3.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Find every instruction on the page",
                  d: "Scan body copy, form help text, tooltips, onboarding steps, and error messages for any sentence that tells the user how to find or operate something. These are the only places 1.3.3 applies.",
                },
                {
                  t: "Ask what identifies the target",
                  d: "For each instruction, note how it points at its target. If the only identifier is shape, color, size, location, orientation, or sound, it fails. If it also names the control ('the Save button'), it passes.",
                },
                {
                  t: "Read the page with a screen reader",
                  d: "Listen to each instruction as speech, with no visual context. 'Click the button on the right' becomes impossible to follow; 'click Submit' still works. Anything you can't act on by ear is a failure.",
                },
                {
                  t: "View through a color-blindness simulator",
                  d: "Use a simulator or browser extension to remove color distinctions. Any instruction that depended on 'the green one' versus 'the red one' will now be ambiguous.",
                },
                {
                  t: "Reflow and rotate the layout",
                  d: "Shrink to a mobile width and rotate the device. Instructions that named a position ('on the right', 'below') are now pointing at the wrong place — confirming they relied on visual location.",
                },
                {
                  t: "Mute the audio",
                  d: "Turn sound off and complete any flow that signals status audibly. If you can no longer tell when an action finished, the instruction relied solely on sound.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {step.t}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              For a structured audit, work through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <CriterionLinks number="1.3.3" />

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2
              id="faq"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
