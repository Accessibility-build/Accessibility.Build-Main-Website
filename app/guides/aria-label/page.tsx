import Link from "next/link"
import { GuideShell, GuideTable, GuideCode, guideMetadata } from "@/components/guides/guide-shell"
import type { FaqItem } from "@/components/seo/faq-section"

// Search Console, Nov 2026: "aria label", "aria-label", "aria labels", "aria-labelledby",
// "aria label angular", "html aria label" and "aria describedby" drew about 900 impressions
// a year at positions 50 to 60, with only an old blog post ranking. This guide is the
// dedicated answer. Name computation facts follow the W3C Accessible Name and Description
// Computation 1.2 and WAI-ARIA 1.2 (roles with "name prohibited").

const route = "/guides/aria-label"
const title = "aria-label vs aria-labelledby vs aria-describedby"
const description =
  "When to use aria-label, aria-labelledby and aria-describedby, how browsers pick an accessible name, where aria-label is ignored, and examples for HTML, React and Angular."
const datePublished = "2026-11-24"

export const metadata = guideMetadata({
  route,
  title,
  description,
  datePublished,
  keywords: [
    "aria-label",
    "aria label",
    "aria-labelledby",
    "aria-describedby",
    "aria-label vs aria-labelledby",
    "aria-label html",
    "aria-label angular",
    "aria-label example",
    "aria description",
    "accessible name",
  ],
})

const faqs: FaqItem[] = [
  {
    question: "What is the difference between aria-label and aria-labelledby?",
    answer:
      "aria-label gives an element its accessible name as a string written in the attribute. aria-labelledby points to the ID of one or more other elements and uses their text as the name. Prefer aria-labelledby when the label text is already visible on the page, because the name then stays in sync with what sighted users read and is translated with the page. If both are present, aria-labelledby wins.",
  },
  {
    question: "Does aria-label work on a div or span?",
    answer:
      "Not reliably. A div or span with no role has the generic role, and WAI-ARIA 1.2 prohibits naming it. Some screen readers ignore the label and others read it inconsistently. Give the element a real role first (a button, a region, a group, an image) or put the text in the content instead.",
  },
  {
    question: "Should I use aria-label or title?",
    answer:
      "Use visible text first, then aria-labelledby, then aria-label. The title attribute is the last fallback in name computation, shows only on mouse hover, never appears for keyboard or touch users, and is read inconsistently. Do not rely on title for anything people need.",
  },
  {
    question: "Does aria-label override the text inside a button or link?",
    answer:
      "Yes. aria-label replaces the name a button or link would otherwise get from its content. That is why aria-label=\"Close\" on a button that visibly says \"Cancel\" is a WCAG 2.5.3 Label in Name failure: a voice-control user who says \"click Cancel\" cannot activate it. Keep the visible words in the accessible name, ideally at the start.",
  },
  {
    question: "How do I add aria-label in Angular?",
    answer:
      "Use attribute binding for dynamic values: [attr.aria-label]=\"label\". A static value needs no binding: aria-label=\"Close dialog\". For aria-labelledby and aria-describedby, bind the ID the same way: [attr.aria-labelledby]=\"titleId\".",
  },
  {
    question: "Is aria-describedby read automatically?",
    answer:
      "Usually, but after the name, role and state, and sometimes after a pause. Some users turn descriptions off. Use it for supporting information such as a password rule or an error message, never for the only copy of something essential.",
  },
]

const sections = [
  { id: "short-answer", title: "The short answer" },
  { id: "name-order", title: "How browsers pick the name" },
  { id: "aria-label", title: "aria-label" },
  { id: "aria-labelledby", title: "aria-labelledby" },
  { id: "aria-describedby", title: "aria-describedby" },
  { id: "where-ignored", title: "Where aria-label does nothing" },
  { id: "mistakes", title: "Common mistakes" },
  { id: "frameworks", title: "React, Angular and Vue" },
  { id: "testing", title: "How to test it" },
]

export default function AriaLabelGuidePage() {
  return (
    <GuideShell
      route={route}
      crumb="aria-label"
      badge="ARIA guide"
      title={title}
      h1="aria-label, aria-labelledby and aria-describedby: when to use each"
      description={description}
      datePublished={datePublished}
      sections={sections}
      faqs={faqs}
      relatedContent="aria-label aria-labelledby aria-describedby accessible name name role value 4.1.2 label in name 2.5.3 using aria screen reader testing accessible name previewer forms labels"
      intro={
        <p>
          All three attributes change what a screen reader announces, but they do different jobs. Two of them set
          an element&rsquo;s <strong>accessible name</strong> (what it is called) and one sets its{" "}
          <strong>description</strong> (extra detail). Pick the wrong one and you either hide visible text from
          assistive technology or announce a label nobody can see.
        </p>
      }
    >
      <h2 id="short-answer">The short answer</h2>
      <GuideTable caption="Which attribute to use">
        <thead>
          <tr>
            <th scope="col">Attribute</th>
            <th scope="col">Sets</th>
            <th scope="col">Takes</th>
            <th scope="col">Use it when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>aria-labelledby</code></td>
            <td>Name</td>
            <td>One or more IDs</td>
            <td>The label is already visible on the page, such as a heading over a dialog or a section.</td>
          </tr>
          <tr>
            <td><code>aria-label</code></td>
            <td>Name</td>
            <td>A text string</td>
            <td>There is no visible text to point to, such as an icon-only button.</td>
          </tr>
          <tr>
            <td><code>aria-describedby</code></td>
            <td>Description</td>
            <td>One or more IDs</td>
            <td>The control already has a name and needs supporting detail: a hint, a format, an error.</td>
          </tr>
        </tbody>
      </GuideTable>
      <p>
        Before any of them, try native HTML. A <code>&lt;label for&gt;</code> on a form field, <code>alt</code> on an
        image, or real text inside a button names the element without ARIA and works everywhere. The first rule of
        ARIA is not to use it when HTML already does the job.
      </p>

      <h2 id="name-order">How browsers pick the name</h2>
      <p>
        Browsers compute one accessible name per element, following the W3C Accessible Name and Description
        Computation. Simplified, they take the first of these that produces text:
      </p>
      <ol>
        <li><code>aria-labelledby</code>, joining the text of every referenced element in order.</li>
        <li><code>aria-label</code>.</li>
        <li>The native label: <code>&lt;label&gt;</code>, <code>alt</code>, <code>&lt;caption&gt;</code>, <code>&lt;legend&gt;</code> and so on.</li>
        <li>The element&rsquo;s own content, for roles that take their name from content (buttons, links, headings, tabs, options).</li>
        <li><code>title</code>, and for inputs <code>placeholder</code>, as a last resort.</li>
      </ol>
      <p>
        Two consequences catch people out. An <code>aria-label</code> on a link silently replaces the link text, and an{" "}
        <code>aria-labelledby</code> beats an <code>aria-label</code> on the same element. Check what you actually get
        with our <Link href="/tools/accessible-name-previewer">accessible name previewer</Link>.
      </p>

      <h2 id="aria-label">aria-label</h2>
      <p>The classic case is a control that shows an icon and no words:</p>
      <GuideCode label="aria-label on an icon-only button">{`<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>`}</GuideCode>
      <p>
        Hide the icon itself with <code>aria-hidden=&quot;true&quot;</code> so it is not announced as a stray image. Other
        good uses: telling apart several <code>&lt;nav&gt;</code> landmarks (<code>aria-label=&quot;Primary&quot;</code>,{" "}
        <code>aria-label=&quot;Footer&quot;</code>) and naming a search field whose only visible label is a magnifying
        glass.
      </p>
      <p>
        Keep it short, write it as a name rather than an instruction (&ldquo;Close dialog&rdquo;, not &ldquo;Click to close
        the dialog&rdquo;), and do not repeat the role: screen readers already say &ldquo;button&rdquo;. Because the text
        lives in an attribute, some machine translation tools leave it untranslated, which is one more reason to prefer
        visible text where you can.
      </p>

      <h2 id="aria-labelledby">aria-labelledby</h2>
      <p>Point at text that is already on screen, so the name and the visible label cannot drift apart:</p>
      <GuideCode label="aria-labelledby on a dialog">{`<div role="dialog" aria-modal="true" aria-labelledby="dlg-title">
  <h2 id="dlg-title">Delete project</h2>
  ...
</div>`}</GuideCode>
      <p>It can combine several IDs, including the element&rsquo;s own, to build a fuller name:</p>
      <GuideCode label="aria-labelledby combining two IDs">{`<h3 id="plan-pro">Pro plan</h3>
<a href="/checkout/pro" id="buy-pro" aria-labelledby="buy-pro plan-pro">Buy now</a>
<!-- Announced as "Buy now Pro plan, link" -->`}</GuideCode>
      <p>
        The referenced text is used even if that element is hidden with <code>hidden</code> or{" "}
        <code>display:none</code>, which is handy for a label you do not want to show. Two limits: it is not followed
        more than one step (an element referenced by <code>aria-labelledby</code> does not contribute its own{" "}
        <code>aria-labelledby</code>), and every ID must exist, or that part of the name is silently dropped.
      </p>

      <h2 id="aria-describedby">aria-describedby</h2>
      <p>Descriptions add detail after the name, role and state:</p>
      <GuideCode label="aria-describedby for a hint and an error">{`<label for="pw">Password</label>
<input id="pw" type="password" aria-describedby="pw-hint pw-error" aria-invalid="true">
<p id="pw-hint">At least 12 characters.</p>
<p id="pw-error">Password is too short.</p>`}</GuideCode>
      <p>
        A screen reader says something like &ldquo;Password, edit, invalid entry. At least 12 characters. Password is too
        short.&rdquo; Users can turn descriptions off or move on before they finish, so do not put the only copy of
        essential information in a description. A newer attribute, <code>aria-description</code>, takes a string
        instead of an ID. It is in the ARIA 1.3 draft and support across screen readers is still uneven, so prefer{" "}
        <code>aria-describedby</code> with visible text.
      </p>

      <h2 id="where-ignored">Where aria-label does nothing</h2>
      <p>
        WAI-ARIA 1.2 prohibits naming some roles. Browsers and screen readers may drop the label or read it
        unpredictably. The ones that matter most in practice:
      </p>
      <ul>
        <li><strong>A plain <code>&lt;div&gt;</code> or <code>&lt;span&gt;</code></strong>, which has the generic role.</li>
        <li><code>role=&quot;presentation&quot;</code> and <code>role=&quot;none&quot;</code>.</li>
        <li>Text-level roles: <code>paragraph</code>, <code>code</code>, <code>strong</code>, <code>emphasis</code>, <code>subscript</code>, <code>superscript</code>, <code>insertion</code>, <code>deletion</code> and <code>caption</code>.</li>
      </ul>
      <p>
        If an element needs a name, it needs a role that can carry one. Often the honest fix is to make it a real{" "}
        <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;section&gt;</code> or <code>&lt;img&gt;</code>.
      </p>

      <h2 id="mistakes">Common mistakes</h2>
      <ul>
        <li>
          <strong>Label that contradicts the visible text.</strong> A button that shows &ldquo;Search&rdquo; but has{" "}
          <code>aria-label=&quot;Find products&quot;</code> fails <Link href="/wcag/2-5-3">2.5.3 Label in Name</Link>, because
          voice-control users say what they see.
        </li>
        <li>
          <strong>aria-label on every link.</strong> Overriding good link text with long labels makes pages slower to
          use. Fix vague text like &ldquo;Read more&rdquo; by writing better text, or add the subject with{" "}
          <code>aria-labelledby</code> or visually hidden text inside the link.
        </li>
        <li>
          <strong>Duplicating a native label.</strong> An input with both <code>&lt;label&gt;</code> and an{" "}
          <code>aria-label</code> uses only the <code>aria-label</code>. Remove one.
        </li>
        <li>
          <strong>Broken ID references.</strong> Generated or duplicated IDs (common in components rendered twice) leave
          the name empty. Check that every referenced ID is unique and present.
        </li>
        <li>
          <strong>Redundant role words.</strong> <code>aria-label=&quot;Menu button&quot;</code> is announced as &ldquo;Menu
          button, button&rdquo;.
        </li>
      </ul>
      <p>
        Missing or wrong names on controls are failures of <Link href="/wcag/4-1-2">4.1.2 Name, Role, Value</Link>.
      </p>

      <h2 id="frameworks">React, Angular and Vue</h2>
      <p>
        <strong>React</strong> keeps ARIA attributes hyphenated, unlike most JSX props:
      </p>
      <GuideCode label="React example">{`<button type="button" aria-label="Close dialog" onClick={onClose}>
  <XIcon aria-hidden="true" />
</button>

// Generate stable IDs for aria-labelledby and aria-describedby
const hintId = useId()
<input aria-describedby={hintId} />
<p id={hintId}>At least 12 characters.</p>`}</GuideCode>
      <p>
        <strong>Angular</strong> needs attribute binding for dynamic values:
      </p>
      <GuideCode label="Angular example">{`<button type="button" [attr.aria-label]="closeLabel">
  <mat-icon aria-hidden="true">close</mat-icon>
</button>

<section [attr.aria-labelledby]="headingId">
  <h2 [id]="headingId">Billing</h2>
</section>`}</GuideCode>
      <p>
        <strong>Vue</strong> binds them like any attribute: <code>:aria-label=&quot;closeLabel&quot;</code>. In every
        framework, make sure IDs are unique per component instance. More patterns are in our{" "}
        <Link href="/guides/react-accessibility">React</Link>, <Link href="/guides/angular-accessibility">Angular</Link>{" "}
        and <Link href="/guides/vue-accessibility">Vue</Link> guides.
      </p>

      <h2 id="testing">How to test it</h2>
      <ol>
        <li>
          Open the browser&rsquo;s accessibility inspector (Chrome and Edge: Elements, then Accessibility; Firefox:
          Accessibility panel) and read the computed name and description.
        </li>
        <li>
          Run an automated check. axe and Lighthouse flag empty names, broken ID references and prohibited{" "}
          <code>aria-label</code> use.
        </li>
        <li>
          Listen with a screen reader. Tab through with NVDA or VoiceOver and confirm each control is announced the way
          its visible label reads. Our <Link href="/guides/screen-reader-testing">screen reader testing guide</Link>{" "}
          covers the commands.
        </li>
        <li>
          Try voice control. Say the visible label (&ldquo;click Search&rdquo;) in Voice Control or Dragon. If nothing
          happens, the name does not contain the label.
        </li>
      </ol>
    </GuideShell>
  )
}
