import Link from "next/link"
import { GuideShell, GuideTable, GuideCode, guideMetadata } from "@/components/guides/guide-shell"
import type { FaqItem } from "@/components/seo/faq-section"

// Search Console, Nov 2026: dozens of variants of "wcag 3.0 apca vs wcag 2.2 contrast" and
// "wcag 2.2 contrast ratio formula relative luminance" ranked 4 to 16, and "apca contrast
// checker" 18, with no page comparing the two. Status facts checked 24 Nov 2026 against the
// 10 Sep 2026 WCAG 3 Working Draft (contrast measure "to be determined", APCA not named).
// Example values computed with lib/color/apca.ts (APCA-W3) and the WCAG 2.2 formula;
// rerun them if either implementation changes.

const route = "/guides/apca-vs-wcag-contrast"
const title = "APCA vs WCAG 2 Contrast: Formula, Lc Levels, Status"
const description =
  "How the WCAG 2.2 contrast ratio and APCA Lc are calculated, where they disagree with real color examples, APCA's status in WCAG 3, and which one to follow in 2026."
const datePublished = "2026-11-24"

export const metadata = guideMetadata({
  route,
  title,
  description,
  datePublished,
  keywords: [
    "apca vs wcag",
    "wcag 3.0 apca vs wcag 2.2 contrast",
    "apca contrast",
    "apca lc values",
    "wcag 2.2 contrast ratio formula",
    "relative luminance formula",
    "apca wcag 3 status",
    "wcag contrast 4.5 3.0",
  ],
})

const faqs: FaqItem[] = [
  {
    question: "Is APCA part of WCAG 3?",
    answer:
      "Not at present. The 10 September 2026 WCAG 3 Working Draft says the contrast algorithm is yet to be determined and does not mention APCA. APCA was developed for the WCAG 3 effort and remains the best-known candidate, but no W3C standard requires it.",
  },
  {
    question: "Should I use APCA instead of the WCAG 2 contrast ratio?",
    answer:
      "Not instead of it. Laws such as the ADA Title II rule and EN 301 549 require WCAG 2.1 or 2.2, so you must meet 4.5:1 and 3:1. APCA is useful as a second check, especially for dark mode, thin fonts and colored buttons, where it catches pairs that pass WCAG 2 but read poorly.",
  },
  {
    question: "What APCA Lc value equals a 4.5:1 contrast ratio?",
    answer:
      "There is no fixed conversion, because APCA depends on which color is the text and the ratio does not. Gray #767676 on white is 4.54:1 and Lc 71.6; reverse the colors and it is still 4.54:1 but Lc -77.0. APCA's own guidance treats Lc 60 as a minimum for content text and Lc 75 to 90 for body text.",
  },
  {
    question: "What is the WCAG 2.2 contrast ratio formula?",
    answer:
      "(L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 of the darker. Relative luminance is 0.2126 R + 0.7152 G + 0.0722 B, after converting each sRGB channel to linear light. Ratios run from 1:1 to 21:1.",
  },
  {
    question: "Why does APCA give negative numbers?",
    answer:
      "The sign shows polarity. Positive Lc means dark text on a light background; negative means light text on a dark background. Use the absolute value when comparing against the targets.",
  },
]

const sections = [
  { id: "summary", title: "The short version" },
  { id: "wcag2", title: "How the WCAG 2.2 ratio works" },
  { id: "apca", title: "How APCA works" },
  { id: "disagree", title: "Where they disagree" },
  { id: "status", title: "APCA's status in WCAG 3" },
  { id: "practice", title: "What to do in 2026" },
]

export default function ApcaVsWcagContrastPage() {
  return (
    <GuideShell
      route={route}
      crumb="APCA vs WCAG 2 contrast"
      badge="Color and contrast"
      title={title}
      h1="APCA vs WCAG 2 contrast: how they differ and which to follow"
      description={description}
      datePublished={datePublished}
      sections={sections}
      faqs={faqs}
      relatedContent="apca wcag contrast ratio 1.4.3 1.4.11 relative luminance contrast checker dark mode contrast oklch color systems accessible color palettes wcag 3"
      intro={
        <p>
          WCAG 2.2 measures contrast as a ratio between two luminances. APCA, the Accessible Perceptual Contrast
          Algorithm, models how people actually perceive text and gives a lightness contrast value, Lc. They agree on most
          pairs and disagree sharply on some. Only one of them is a legal requirement today.
        </p>
      }
    >
      <h2 id="summary">The short version</h2>
      <GuideTable caption="WCAG 2.2 contrast ratio and APCA compared">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">WCAG 2.2 ratio</th>
            <th scope="col">APCA</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">Output</th><td>1:1 to 21:1</td><td>Lc, about -108 to +106</td></tr>
          <tr><th scope="row">Text or background matters?</th><td>No, swapping colors gives the same ratio</td><td>Yes, polarity changes the score</td></tr>
          <tr><th scope="row">Font size and weight</th><td>Two buckets: normal and large text</td><td>Targets vary continuously with size and weight</td></tr>
          <tr><th scope="row">Main targets</th><td>4.5:1 text, 3:1 large text and UI (AA)</td><td>Lc 75 to 90 body, Lc 60 content, Lc 45 headlines</td></tr>
          <tr><th scope="row">Status</th><td>Normative in WCAG 2.1 and 2.2; required by law</td><td>Not in any W3C standard</td></tr>
        </tbody>
      </GuideTable>

      <h2 id="wcag2">How the WCAG 2.2 ratio works</h2>
      <p>First convert each sRGB channel (0 to 255) to linear light, then weight the channels by how bright they look:</p>
      <GuideCode label="WCAG 2.2 relative luminance and contrast ratio">{`channel = value / 255
linear  = channel <= 0.04045 ? channel / 12.92
                             : ((channel + 0.055) / 1.055) ^ 2.4
L       = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear

contrast ratio = (L_lighter + 0.05) / (L_darker + 0.05)`}</GuideCode>
      <p>The thresholds:</p>
      <ul>
        <li><Link href="/wcag/1-4-3">1.4.3 Contrast (Minimum), AA</Link>: 4.5:1 for normal text, 3:1 for large text (at least 24px, or about 18.66px bold).</li>
        <li><Link href="/wcag/1-4-6">1.4.6 Contrast (Enhanced), AAA</Link>: 7:1 and 4.5:1.</li>
        <li><Link href="/wcag/1-4-11">1.4.11 Non-text Contrast, AA</Link>: 3:1 for interface components and meaningful graphics.</li>
      </ul>
      <p>
        The thresholds are absolute: 4.49:1 fails. Check any pair in our{" "}
        <Link href="/tools/contrast-checker">contrast checker</Link>, which shows the WCAG ratio and an APCA reading side by
        side.
      </p>

      <h2 id="apca">How APCA works</h2>
      <p>
        APCA converts colors to screen luminance with a simple 2.4 exponent, applies a soft clamp near black, then uses
        different exponents for dark-on-light and light-on-dark text. That is why it reports a signed Lc value instead of a
        symmetric ratio. Its published guidance sets minimum Lc values by use:
      </p>
      <GuideTable caption="APCA Lc guidance levels">
        <thead>
          <tr><th scope="col">Lc</th><th scope="col">Use</th></tr>
        </thead>
        <tbody>
          <tr><td>90</td><td>Preferred for body text (about 18px at weight 300 or heavier)</td></tr>
          <tr><td>75</td><td>Minimum for body text</td></tr>
          <tr><td>60</td><td>Minimum for content text that is not body copy</td></tr>
          <tr><td>45</td><td>Minimum for large, heavy text such as headlines</td></tr>
          <tr><td>30</td><td>Absolute minimum for any other text, such as placeholders</td></tr>
          <tr><td>15</td><td>Minimum for non-text elements that must be seen</td></tr>
        </tbody>
      </GuideTable>
      <p>
        Source: <a href="https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell">APCA in a Nutshell</a>. Fuller APCA
        lookup tables refine these by exact font size and weight.
      </p>

      <h2 id="disagree">Where they disagree</h2>
      <p>Calculated with the WCAG 2.2 formula and the APCA-W3 algorithm used in our tools:</p>
      <GuideTable caption="Example color pairs scored by WCAG 2.2 and APCA">
        <thead>
          <tr>
            <th scope="col">Text on background</th>
            <th scope="col">WCAG 2.2</th>
            <th scope="col">APCA Lc</th>
            <th scope="col">What it shows</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>#767676 on #FFFFFF</td><td>4.54:1, passes AA</td><td>71.6</td><td>The classic &ldquo;lightest gray that passes&rdquo; is below APCA&rsquo;s Lc 75 body minimum.</td></tr>
          <tr><td>#FFFFFF on #767676</td><td>4.54:1, passes AA</td><td>-77.0</td><td>Same ratio, different Lc: polarity matters to APCA.</td></tr>
          <tr><td>#9CA3AF on #111827</td><td>6.99:1, passes AA</td><td>-51.0</td><td>Dark mode gray text WCAG 2 rates highly reads as weak in APCA.</td></tr>
          <tr><td>#FFFFFF on #FF6B00</td><td>2.86:1, fails</td><td>-59.0</td><td>White on orange fails WCAG 2 but scores close to APCA&rsquo;s content minimum.</td></tr>
          <tr><td>#000000 on #FF6B00</td><td>7.36:1, passes AAA</td><td>50.3</td><td>WCAG 2 strongly prefers black on orange; APCA rates it lower than white.</td></tr>
          <tr><td>#000000 on #2563EB</td><td>4.06:1, fails AA</td><td>29.2</td><td>Both reject black on mid blue; APCA far more firmly.</td></tr>
          <tr><td>#FFFFFF on #2563EB</td><td>5.17:1, passes AA</td><td>-80.2</td><td>Both agree white works on this blue.</td></tr>
        </tbody>
      </GuideTable>
      <p>
        The pattern: WCAG 2 tends to overrate contrast in dark color schemes and on dark mid-tones, and underrate white text
        on saturated colors such as orange. Those are the cases where checking both is worthwhile. See also our{" "}
        <Link href="/tools/dark-mode-contrast-checker">dark mode contrast checker</Link>.
      </p>

      <h2 id="status">APCA&rsquo;s status in WCAG 3</h2>
      <p>
        APCA was created for the WCAG 3 effort, and many articles still describe it as &ldquo;the WCAG 3 contrast
        method.&rdquo; That is not accurate today. The{" "}
        <a href="https://www.w3.org/TR/wcag-3.0/">10 September 2026 WCAG 3 Working Draft</a> lists &ldquo;Text contrast
        sufficient&rdquo; as a developing requirement whose measure is &ldquo;to be determined&rdquo;, says the contrast
        algorithm is yet to be decided, and does not name APCA. WCAG 3 itself is not expected to become a W3C
        Recommendation before 2028; see <Link href="/wcag-3">our WCAG 3 overview</Link> for the timeline.
      </p>

      <h2 id="practice">What to do in 2026</h2>
      <ol>
        <li><strong>Meet WCAG 2.2 AA.</strong> 4.5:1 for text, 3:1 for large text and interface parts. This is what audits, contracts and laws test.</li>
        <li><strong>Use APCA as a second opinion</strong> for dark mode, thin or small type, and text on brand colors.</li>
        <li><strong>When they conflict, satisfy WCAG 2 first</strong>, then adjust lightness until APCA is also comfortable. Our{" "}
          <Link href="/tools/color-palette-generator">accessible palette generator</Link> and{" "}
          <Link href="/guides/oklch-apca-color-systems">OKLCH color systems guide</Link> make that easier.</li>
        <li><strong>Do not claim APCA conformance</strong> as a substitute for WCAG in an accessibility statement or VPAT.</li>
      </ol>
    </GuideShell>
  )
}
