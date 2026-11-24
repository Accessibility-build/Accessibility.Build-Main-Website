import Link from "next/link"
import { GuideShell, GuideTable, guideMetadata } from "@/components/guides/guide-shell"
import type { FaqItem } from "@/components/seo/faq-section"

// Search Console, Nov 2026: "nvda vs jaws" and "jaws vs nvda" ranked 12 to 13 with separate
// NVDA and JAWS guides but no comparison. Facts checked 24 Nov 2026:
// - NVDA 2026.3.1, 9 Nov 2026 (github.com/nvaccess/nvda/releases); free, donations optional.
// - JAWS 2027.2610.428, November 2026 (support.freedomscientific.com/Downloads/JAWS).
// - Prices from store.vispero.com (the Freedom Scientific store redirects there).
// - WebAIM Screen Reader User Survey #11 (Jul to Aug 2026, 1,780 responses).
// Restamp when either vendor ships a major version or WebAIM publishes survey #12.

const route = "/guides/nvda-vs-jaws"
const title = "NVDA vs JAWS: Which Screen Reader to Test With"
const description =
  "NVDA vs JAWS compared for accessibility testing: 2026 usage from WebAIM's survey, price, browsers, browse and forms mode differences, and which to test first."
const datePublished = "2026-11-24"

export const metadata = guideMetadata({
  route,
  title,
  description,
  datePublished,
  keywords: [
    "nvda vs jaws",
    "jaws vs nvda",
    "nvda or jaws for testing",
    "best screen reader for accessibility testing",
    "jaws price",
    "is nvda free",
    "screen reader market share 2026",
    "webaim screen reader survey",
  ],
})

const faqs: FaqItem[] = [
  {
    question: "Is NVDA or JAWS more popular?",
    answer:
      "JAWS. In WebAIM's Screen Reader User Survey #11 (2026), 55.0% of respondents named JAWS as their primary desktop screen reader and 32.9% named NVDA. Both are widely used: 69.2% said they commonly use JAWS and 59.3% NVDA. The previous survey, in early 2024, had them much closer at 40.5% and 37.7%.",
  },
  {
    question: "Is NVDA as good as JAWS for testing?",
    answer:
      "For finding most web barriers, yes. NVDA is free, follows the accessibility tree closely and is the easiest way for a team to start. JAWS adds more heuristics that can mask broken markup, and it is the primary reader for more users, especially in workplaces. If you can only test with one, start with NVDA and Chrome; add JAWS before release for anything used at work or by government audiences.",
  },
  {
    question: "How much does JAWS cost?",
    answer:
      "On the official Vispero store in November 2026: JAWS Home Annual is $104.50 a year (US only, non-commercial use), a JAWS Professional subscription is $1,003 a year, and perpetual licences with a software maintenance agreement are $1,572 (Home) and $2,316.50 (Professional). Unlicensed, JAWS runs in a 40-minute demo mode that is enough for short test sessions.",
  },
  {
    question: "Is NVDA really free?",
    answer:
      "Yes. NVDA is free, open-source software from NV Access, an Australian charity. Donations are optional. NV Access also sells training and support, but no licence is needed to use NVDA, including at work.",
  },
  {
    question: "Which browser should I use with NVDA and JAWS?",
    answer:
      "Chrome first. In WebAIM's 2026 survey the most common pairings were JAWS with Chrome (31.2%), NVDA with Chrome (17.3%), JAWS with Edge (17.0%) and NVDA with Firefox (9.1%). Testing JAWS with Chrome and NVDA with Chrome or Firefox covers the large majority of desktop screen reader users.",
  },
  {
    question: "Do I also need to test with VoiceOver?",
    answer:
      "Yes, if your audience uses Apple devices, and on mobile almost certainly: 72.2% of WebAIM's 2026 respondents use VoiceOver on mobile and 29.5% use TalkBack. On desktop, VoiceOver is primary for 6.5%.",
  },
]

const sections = [
  { id: "at-a-glance", title: "At a glance" },
  { id: "usage", title: "Who uses which (2026 data)" },
  { id: "behaviour", title: "Differences that change test results" },
  { id: "which-first", title: "Which to test with first" },
  { id: "setup", title: "Setting up a test machine" },
]

export default function NvdaVsJawsPage() {
  return (
    <GuideShell
      route={route}
      crumb="NVDA vs JAWS"
      badge="Comparison"
      title={title}
      h1="NVDA vs JAWS: which screen reader should you test with?"
      description={description}
      datePublished={datePublished}
      sections={sections}
      faqs={faqs}
      relatedContent="nvda jaws screen reader testing voiceover talkback screen reader survey 2026 browse mode forms mode keyboard testing"
      intro={
        <p>
          JAWS and NVDA are the two Windows screen readers that matter for web testing. JAWS is commercial and is the
          primary screen reader for most desktop users; NVDA is free and nearly as widely used. They read the same page
          differently often enough that a serious test plan includes both.
        </p>
      }
    >
      <h2 id="at-a-glance">At a glance</h2>
      <GuideTable caption="NVDA and JAWS compared">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">NVDA</th>
            <th scope="col">JAWS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Maker</th>
            <td>NV Access (Australian charity)</td>
            <td>Freedom Scientific, part of Vispero</td>
          </tr>
          <tr>
            <th scope="row">Latest version (Nov 2026)</th>
            <td>2026.3.1, released 9 November 2026</td>
            <td>JAWS 2027, released November 2026</td>
          </tr>
          <tr>
            <th scope="row">Price</th>
            <td>Free, open source. Donations optional.</td>
            <td>Home Annual $104.50/yr (US, non-commercial); Professional $1,003/yr; perpetual from $1,572</td>
          </tr>
          <tr>
            <th scope="row">Free way to test</th>
            <td>Install it</td>
            <td>40-minute demo mode, restart to continue</td>
          </tr>
          <tr>
            <th scope="row">Primary desktop reader (WebAIM 2026)</th>
            <td>32.9%</td>
            <td>55.0%</td>
          </tr>
          <tr>
            <th scope="row">Commonly used (WebAIM 2026)</th>
            <td>59.3%</td>
            <td>69.2%</td>
          </tr>
          <tr>
            <th scope="row">Reading modes</th>
            <td>Browse mode and focus mode</td>
            <td>Virtual cursor and forms mode</td>
          </tr>
          <tr>
            <th scope="row">Output log for testers</th>
            <td>Speech Viewer (Tools menu)</td>
            <td>Speech history</td>
          </tr>
        </tbody>
      </GuideTable>

      <h2 id="usage">Who uses which (2026 data)</h2>
      <p>
        WebAIM&rsquo;s <a href="https://webaim.org/projects/screenreadersurvey11/">Screen Reader User Survey #11</a>{" "}
        (July to August 2026, 1,780 responses) is the best public data. It shows a marked swing back to JAWS since the
        previous survey:
      </p>
      <GuideTable caption="Primary desktop screen reader, WebAIM surveys 10 and 11">
        <thead>
          <tr>
            <th scope="col">Screen reader</th>
            <th scope="col">Primary, survey #11 (2026)</th>
            <th scope="col">Primary, survey #10 (2024)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>JAWS</td><td>55.0%</td><td>40.5%</td></tr>
          <tr><td>NVDA</td><td>32.9%</td><td>37.7%</td></tr>
          <tr><td>VoiceOver (macOS)</td><td>6.5%</td><td>9.7%</td></tr>
          <tr><td>Narrator</td><td>0.4%</td><td>0.7%</td></tr>
        </tbody>
      </GuideTable>
      <p>
        Survey respondents are self-selected, so treat the shares as a guide to who you are serving rather than a market
        census. Our <Link href="/research/screen-reader-survey-2026">analysis of the 2026 survey</Link> breaks the results
        down further.
      </p>

      <h2 id="behaviour">Differences that change test results</h2>
      <h3>JAWS guesses more, NVDA reports what is there</h3>
      <p>
        JAWS applies heuristics to repair poor markup, for example announcing nearby text as the label of an unlabelled
        field. That helps users, but it means a page can sound fine in JAWS while the accessibility tree is broken. NVDA
        tends to read the tree more literally, so missing names and wrong roles show up sooner. This is the main reason
        NVDA is the better first test.
      </p>
      <h3>Browse mode and forms mode</h3>
      <p>
        Both readers read web pages through a virtual buffer: NVDA calls it browse mode, JAWS the virtual cursor. Arrow
        keys and single-letter shortcuts (H for headings, for example) move through it. When you reach a text
        field or other control, they switch to focus mode (NVDA) or forms mode (JAWS) so key presses go to the page.
        Custom widgets that rely on arrow keys, such as <Link href="/guides/accessible-tabs">tabs</Link>,{" "}
        <Link href="/guides/accessible-menu">menus</Link> and <Link href="/guides/accessible-data-grid">grids</Link>, only work
        if their roles tell the screen reader to switch modes. Test each one in both readers.
      </p>
      <h3>Live regions and newer ARIA</h3>
      <p>
        Announcements from <code>aria-live</code> regions differ in timing and in whether repeated messages are read.
        Support for newer attributes also varies: NVDA reads <code>aria-details</code> summaries with NVDA+D, JAWS 2027
        moved its command to Insert+Shift+D, and <code>aria-description</code> is still read inconsistently. Test{" "}
        <Link href="/guides/accessible-notifications">toasts and status messages</Link> in both.
      </p>

      <h2 id="which-first">Which to test with first</h2>
      <ol>
        <li><strong>NVDA with Chrome</strong> during development. It is free, quick to install and exposes markup errors.</li>
        <li><strong>JAWS with Chrome</strong> before release, especially for products used at work, in government or in education, where JAWS is common.</li>
        <li><strong>VoiceOver with Safari on iPhone</strong> for anything people use on mobile.</li>
        <li><strong>NVDA with Firefox</strong> and <strong>JAWS with Edge</strong> when you have time for broader coverage.</li>
      </ol>
      <p>
        No screen reader replaces checking the code. Pair listening with an automated scan and the manual checks in our{" "}
        <Link href="/guides/screen-reader-testing">screen reader testing guide</Link>.
      </p>

      <h2 id="setup">Setting up a test machine</h2>
      <ul>
        <li>
          Install NVDA from <a href="https://www.nvaccess.org/download/">nvaccess.org</a> and open Tools, then Speech
          Viewer, so you can read what was spoken. Full setup is in our{" "}
          <Link href="/guides/nvda-screen-reader-testing">NVDA testing guide</Link>.
        </li>
        <li>
          Install JAWS from Freedom Scientific. Without a licence it runs for 40 minutes before you need to restart
          Windows. Commands are in our <Link href="/guides/jaws-screen-reader-testing">JAWS testing guide</Link>.
        </li>
        <li>
          On a Mac, run Windows in a virtual machine. Both readers work there, though a laptop keyboard needs the
          CapsLock modifier layout.
        </li>
        <li>Keep the browser and screen reader on current versions; old pairings produce bugs your users do not see.</li>
      </ul>
    </GuideShell>
  )
}
