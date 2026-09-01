import type { Metadata } from "next"
import Link from "next/link"
import {
  CriteriaTable,
  ExplainerBlock,
  ExplainerProse,
  FailureList,
  KeyboardTable,
  PatternExplainer,
} from "@/components/learn/pattern-explainer"

const title = "Accessible Carousel Pattern"
const description =
  "Build accessible carousels with proper controls and indicators, keyboard navigation, reduced-motion support, and fixes for common mistakes."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/carousels" },
  openGraph: {
    title,
    description,
    url: "/learn/carousels",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}&section=Learn`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function CarouselsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PatternExplainer id="carousel-explainer" title="Understanding the Carousel Pattern">
        <ExplainerProse>
          <p>
            A carousel, also sold as a slider or slideshow, shows a series of
            panels in the same space, one or a few at a time, with controls to
            move between them and often a timer that advances them on its own.
            Its accessibility problems come from three places: motion the user
            did not ask for, controls that are not real controls, and content
            that is hidden from sight but still exposed to assistive technology,
            or the reverse.
          </p>
          <p>
            The demo above shows the shape of a working solution. The whole
            widget is a landmark region with{" "}
            <code>aria-roledescription=&quot;carousel&quot;</code> and a name.
            Each slide is a group with{" "}
            <code>aria-roledescription=&quot;slide&quot;</code> and a
            &quot;2 of 4&quot; label, and slides that are off screen carry{" "}
            <code>aria-hidden=&quot;true&quot;</code>. Previous, Next, and
            Play/Pause are buttons with names that change with their state, the
            indicator dots are a tablist whose selected tab is the current
            slide, a polite live region announces &quot;Slide 2 of 4&quot; with
            the slide title, and any manual navigation pauses auto-play.
          </p>
        </ExplainerProse>

        <ExplainerBlock title="WCAG 2.2 Success Criteria Involved">
          <CriteriaTable
            items={[
              { number: "2.2.2", note: "Anything that auto-advances for more than five seconds needs a way to pause, stop, or hide it. A visible Pause button that keeps its state is the standard answer." },
              { number: "2.1.1", note: "Every slide must be reachable with the keyboard through the buttons; arrow keys are a convenience, not a substitute." },
              { number: "4.1.2", note: "Previous, Next, Play/Pause, and each indicator expose a name, a role, and, for the indicators, the selected state." },
              { number: "1.3.1", note: "The slides are identified as a set and the position is available as text, not only as a row of dots." },
              { number: "1.1.1", note: "Image slides need alternative text that carries the slide's message; purely decorative backgrounds get an empty alt." },
              { number: "2.4.3", note: "Changing slide must not move or drop focus; the control the user pressed keeps it." },
              { number: "2.4.7", note: "Controls that sit over photographs need a focus indicator that stays visible on every slide's background." },
              { number: "2.5.8", note: "Indicator dots and arrow buttons need a 24 by 24 CSS pixel target, or enough spacing that 24 pixel circles centred on them do not overlap. Tiny dots are a routine failure." },
              { number: "4.1.3", note: "A slide change that does not move focus must be announced through a live region so it is not a silent update." },
              { number: "2.3.3", note: "Level AAA, so not required for AA conformance, but respecting prefers-reduced-motion by removing the slide transition and disabling auto-play is the expected behaviour." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="Expected Keyboard Interaction">
          <KeyboardTable
            caption="Keyboard interaction for the carousel demo"
            rows={[
              { keys: "Tab", action: "Moves through the controls in order: Previous, Play/Pause, Next, then each indicator dot. Focus is never trapped inside the carousel." },
              { keys: "Enter or Space", action: "Activates the focused control: changes slide, toggles auto-play, or jumps to the chosen slide." },
              { keys: "Left arrow", action: "While any control inside the carousel has focus: shows the previous slide and pauses auto-play." },
              { keys: "Right arrow", action: "While any control inside the carousel has focus: shows the next slide and pauses auto-play." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="The Failures We See Most Often">
          <FailureList
            items={[
              {
                title: "Auto-play with no way to stop it.",
                detail: "The rotation runs for the life of the page, or the pause control appears only on hover, which keyboard and touch users never trigger. Screen reader users have the content change under them mid-sentence.",
              },
              {
                title: "Hidden slides are still in the accessibility tree.",
                detail: "All five slides are read out in sequence, and Tab lands on links inside slides that are scrolled out of view, so focus vanishes. The opposite mistake, hiding the visible slide, is just as common in libraries that animate with clones.",
              },
              {
                title: "Controls that are not controls.",
                detail: "Arrows drawn with CSS on a div, dots with no names, a Play/Pause icon whose accessible name never changes, or a whole slide made clickable without being a link.",
              },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="Before You Build One">
          <ExplainerProse>
            <p>
              Ask whether the carousel is carrying information anyone needs to
              see. Content after the first slide is rarely reached, and every
              slide beyond the first is content you have chosen to hide by
              default. A stacked layout, a short list of cards, or a set of tabs
              usually communicates the same material with none of the timing,
              focus, and announcement problems above. If a carousel is required,
              default it to paused, keep the Pause button visible, and honour
              the reduced-motion preference.
            </p>
            <p>
              To test yours: unplug the mouse and reach every slide; confirm a
              screen reader hears one slide at a time and hears the change;
              check the pause control with a keyboard; measure the dots; and
              enable reduced motion in the operating system to confirm the
              transition and the timer switch off. There is no separate
              in-depth guide for carousels yet, so the criterion pages linked in
              the table are the reference, along with the W3C{" "}
              <a
                href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                ARIA Authoring Practices carousel pattern
              </a>
              . The{" "}
              <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                2.2.2 Pause, Stop, Hide page
              </Link>{" "}
              covers the timing rules in detail.
            </p>
          </ExplainerProse>
        </ExplainerBlock>
      </PatternExplainer>
    </>
  )
}
