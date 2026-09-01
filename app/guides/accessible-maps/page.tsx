import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, ListChecks } from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const pageTitle = "Accessible Maps: Interactive Maps & Store Locators"
const pageDescription =
  "An interactive map is a picture of spatial data, so the accessible version is usually the same information delivered as text and structured controls, not the pixels. Learn how to decide what job the map is doing, build the map-plus-list pattern where the list is the source of truth, add titles to embedded maps, make markers and pan and zoom controls keyboard operable, provide single-pointer alternatives to dragging, handle static maps and alt text, make choropleth and data maps accessible as charts, and test the whole thing. Copy-ready HTML mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessible maps",
    "map accessibility",
    "accessible interactive map",
    "accessible store locator",
    "google maps accessibility",
    "leaflet accessibility",
    "mapbox accessibility",
    "keyboard accessible map",
    "accessible map alternative",
    "map alt text",
    "accessible data map",
    "choropleth accessibility",
    "screen reader map",
    "embedded map accessibility",
    "accessible location finder",
    "map marker accessibility",
    "wcag maps",
    "geospatial accessibility",
  ],
  alternates: {
    canonical: "/guides/accessible-maps",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-maps",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Maps",
    url: "https://accessibility.build/guides/accessible-maps",
  },
]

const faqs = [
  {
    question: "Do interactive maps have to be accessible?",
    answer:
      "Yes, when the map delivers information or a function people need. A store locator that is the only way to find a branch, a service-area map, a transit map, or a data map that carries a statistic are all covered by the same accessibility obligations as the rest of the page, and store locators in particular are a recurring subject of ADA web accessibility complaints. The important nuance is how you satisfy the requirement: you rarely have to make the map canvas itself perfect. You have to make the task the map supports achievable without the map, by providing an equivalent path in text and structured controls. A purely decorative map that carries no information can simply be hidden from assistive technology instead.",
  },
  {
    question: "What is the best way to make a store locator accessible?",
    answer:
      "Build it as a map plus a list, and treat the list as the source of truth. The accessible experience is a labeled search or filter form and a real list or table of results, where each result gives the name, address, distance, and hours as text and offers the same actions as the map, such as a Get directions link and a Select control. Wire the visual map to that list so selecting a result updates the map, never the other way around. A screen reader user or a keyboard-only user should be able to search, read the results, and get directions to a location without ever interacting with the map. When the result count changes, announce it with a live region. The map then becomes a helpful visual enhancement layered on top of an experience that already works without it.",
  },
  {
    question: "Is Google Maps or an embedded map accessible by default?",
    answer:
      "Partly, and not enough to rely on. A Google Maps embed and the major mapping libraries include some keyboard support and some assistive-technology labeling, and that is genuinely better than a hand-built canvas with nothing. But an embed still needs a descriptive title on its iframe so a screen reader announces what the frame contains, and it still does not, on its own, give a non-visual user a usable way to complete your specific task, such as finding the nearest of your twelve stores. You still owe an equivalent non-map path, the list, and you still need to test the keyboard and screen reader experience yourself rather than assuming the provider handled it. Treat the provider's accessibility as a starting point, not a finished job.",
  },
  {
    question: "How do I write alt text for a map image?",
    answer:
      "Describe what the map communicates in this context, not the fact that it is a map. For a contact page, alt text such as \"Map showing Acme Coffee at 5th and Main, two blocks north of Central Station\" carries the useful information, whereas \"map\" carries none. A pin dropped on a tile does not tell a screen reader anything, so the location has to live in the alt text or, better, in real HTML text next to the image. Always pair a static map with the address written out as live text and a Get directions link, which is what most people use anyway. If the map is purely decorative and the address is already in text nearby, give the image an empty alt attribute so it is skipped rather than described redundantly.",
  },
  {
    question: "Should I put role=\"application\" on my map?",
    answer:
      "Usually no. role=\"application\" tells a screen reader to stop intercepting keystrokes and pass them straight to the widget, which switches off the browse-mode shortcuts blind users rely on to read and navigate. That is only appropriate if you have genuinely implemented full keyboard operation for everything inside the map, panning, zooming, reaching and activating every marker, and reading their information. If you have not, role=\"application\" traps the user in a region where their normal reading commands no longer work and there is nothing to operate in their place. The safer default is to expose the map as a labeled region or group, give it an accessible name, and let the list carry the real interaction. Reach for role=\"application\" only when you have built and tested the keyboard experience to match it.",
  },
  {
    question: "How do people who cannot see the map get the location?",
    answer:
      "From text and controls that sit alongside the map, not from the map itself. The address is written out as live HTML text, there is a Get directions link that hands off to the user's preferred maps app, and for a locator there is a list of results with distances and actions. This is the same principle as an image needing a text alternative: whatever the map shows a sighted user, a non-visual user gets the equivalent in a form their assistive technology can read. Designing this way helps far more people than screen reader users. It also serves anyone on a slow connection where the map has not loaded, anyone who prefers to copy an address as text, and search engines indexing your locations.",
  },
  {
    question: "How do I make map markers keyboard accessible?",
    answer:
      "Every marker a mouse user can click must be a real, focusable, named control, a button or a link, not a div or an image with a click handler bolted on. Its accessible name must identify the place, for example \"Acme Coffee, 5th and Main\", rather than \"marker\" or the file name of a pin graphic. The popup or infowindow that opens when a marker is activated behaves like a dialog: move focus into it, let Escape close it, and build its content from real HTML. The harder problem is scale. Hundreds of markers become hundreds of tab stops and a wall of announcements, so cluster them, or better, make the list the primary way people reach a location and keep direct marker interaction as an enhancement rather than the only route.",
  },
  {
    question: "How do I make a data map like a choropleth or heat map accessible?",
    answer:
      "Treat it as a chart that happens to use geography for its axes. A choropleth, heat map, or bubble map encodes data in color or size across regions, and just like any data visualization its accessible form is the underlying data as a table, region by value, plus a short text summary of the takeaway, for example \"Sales were highest in the West region and lowest in the Northeast.\" Do not make the colored map the only way to read the numbers, and do not rely on color alone to distinguish categories, which fails Use of Color. The accessible charts guide covers the data-table-as-text-alternative pattern in depth, and it applies directly to maps that are really data visualizations.",
  },
]

const antiPatterns = [
  {
    bad: "The map is the only way to find a location or read the data.",
    why: "A keyboard or screen reader user who cannot operate the map has no path to the information at all, so the task is impossible for them (fails 1.1.1 and 2.1.1).",
    fix: "Provide an equivalent non-map path: a list or table of the locations or data with the same details and actions, usable entirely without the map.",
  },
  {
    bad: "An embedded map iframe with no title.",
    why: "A screen reader announces only \"frame\" with no idea what it contains, so the user cannot tell whether it matters or what to do with it (fails 4.1.2 and 1.1.1).",
    fix: "Give the iframe a descriptive title that says what the map shows, for example \"Map of Acme store locations\", and still provide the list.",
  },
  {
    bad: "Markers are divs or images with click handlers.",
    why: "They are not focusable and expose no name or role, so a keyboard user cannot reach them and a screen reader user does not know they exist (fails 2.1.1 and 4.1.2).",
    fix: "Use real button or anchor elements whose accessible name identifies the place, or drive selection from the accessible results list instead.",
  },
  {
    bad: "Panning and zooming work only by mouse drag, scroll, or pinch.",
    why: "There is no keyboard path and no single-pointer alternative, excluding keyboard users and people who cannot perform a sustained drag (fails 2.1.1 and 2.5.7).",
    fix: "Add keyboard support and visible pan and zoom buttons that move the map with a single tap or click.",
  },
  {
    bad: "role=\"application\" on a map with no real keyboard implementation.",
    why: "It suppresses the screen reader's browse-mode reading commands but offers nothing operable in their place, trapping the user in an unusable region.",
    fix: "Expose the map as a labeled region and carry the real interaction in the list, or actually build and test full keyboard operation before using role=\"application\".",
  },
  {
    bad: "Address, hours, or values baked into the map image or a marker tooltip only.",
    why: "That text cannot be read by a screen reader, resized, or reflowed, and it disappears if the map fails to load (fails 1.1.1, 1.4.4, and 1.4.10).",
    fix: "Put the address, hours, and any data in live HTML text beside the map, and use the map to reinforce it rather than to hold it.",
  },
]

export default function AccessibleMapsGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route="/guides/accessible-maps" title={pageTitle} description={pageDescription} datePublished="2026-08-14" />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Accessible Maps
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Implementation Guide
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Maps &amp; Geospatial Content
              </h1>
              <PageByline route="/guides/accessible-maps" className="mb-5" />
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                An interactive map is a picture of spatial data. Just like a
                chart, the accessible version is usually the same information
                delivered as text and structured controls, not the pixels. So the
                real work is deciding what job the map is doing, then providing
                that job as an equivalent path anyone can use, with the visual map
                layered on top as an enhancement. This guide covers store
                locators, embedded maps, markers, static maps, and data maps end
                to end, mapped to WCAG 2.2, with copy-ready HTML.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Maps Are Their Own Accessibility Problem
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A map is a visual model of spatial relationships. For a sighted
                  mouse user it is intuitive: glance, drag, click a pin, read the
                  popup. For everyone else it can fall apart. A keyboard user
                  meets a widget that may not take focus, or a scatter of pins
                  that are not real controls. A screen reader user meets an
                  unlabeled <code>&lt;div&gt;</code>, or the opposite problem, a
                  firehose of hundreds of markers with no structure. A low-vision
                  user finds the street names are baked into the map tiles as
                  images of text that will not resize or reflow. A user who cannot
                  perform a sustained drag finds that panning works only by
                  dragging.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Trying to make the map canvas itself perfect for all of these
                  people is a losing battle, and usually the wrong goal. The map
                  is almost never the point. The point is the{" "}
                  <em>task</em> the map supports: find the nearest store, see
                  where a service is available, understand which regions lead on
                  some metric. That task can be delivered in a form every user can
                  operate, and the accessible version of a map is built around
                  that idea.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The reframe that decides everything
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Decide what job the map is doing, then provide that job as
                    text and structured controls, and treat the visual map as an
                    enhancement on top. You do not have to make the pixels
                    accessible; you have to make the task achievable without them.
                    That single principle drives almost every technique in this
                    guide: hide a decorative map, replace a single-location map
                    with an address and a static image, and back an interactive
                    locator or data map with a real list or table that is the
                    source of truth.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is not a niche concern. Store locators, branch finders,
                  service-area maps, and government service maps are common
                  targets in web accessibility complaints, precisely because a map
                  is often the only way a site lets someone find something they
                  need. Where an organization is covered by the ADA, Section 508,
                  or the European Accessibility Act, a map that carries essential
                  information or function carries the same obligations as the rest
                  of the page. The good news is that the fix, an equivalent path
                  in text, also helps people on slow connections, people who want
                  to copy an address, and search engines indexing your locations.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How Map Accessibility Maps to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The highlighted row,{" "}
                <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.1.1 Non-text Content
                </Link>
                , is the one maps fail most often, because the location or data
                the map shows lives only in the pixels and never in text. The rest
                are the criteria a well-built map experience must also satisfy,
                from keyboard operation to a single-pointer alternative for
                dragging.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to interactive maps,
                    their conformance level, and how each one applies to building
                    an accessible map
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Criterion
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        How it applies to maps
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.1.1 Non-text Content
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The map&rsquo;s information must exist as text: an embedded map needs a title, markers need names, and any location or value shown only on the map must also be available as HTML text.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Panning, zooming, and every marker or control must be operable by keyboard, or an equivalent keyboard-operable list must provide the same function.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">A locator&rsquo;s results are a real list or table, its filters are labeled form controls, and the tie between a result and its marker is programmatic, not visual only.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Markers, zoom buttons, and custom controls must expose a real name and role; a marker built from a div with a click handler has neither.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Routes, regions, and marker categories must be distinguishable without color alone; add labels, patterns, or a text and table equivalent.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The focused marker or control needs a visible focus indicator that stands out against the busy, variable map background.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.3 Contrast (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Your own labels, legends, and overlay text on or beside the map need 4.5:1 (3:1 for large text).</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Map controls, route lines, and marker icons need 3:1 against their background; a pale route on a pale map fails.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The locator and its controls must reflow to a single column at 320px; baked-in tile text cannot reflow, another reason the data must live in your HTML.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.7 Dragging Movements
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Pan-by-drag needs a single-pointer alternative: visible pan and zoom buttons that move the map with a tap or click.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                Each criterion links to its full reference and interactive demo.
                The complete{" "}
                <Link
                  href="/wcag"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 criteria
                </Link>{" "}
                are one click away.
              </p>
            </div>
          </section>

          {/* 1. Decide the job */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. Decide What Job the Map Is Doing
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every accessibility decision about a map flows from one question:
                  what is this map <em>for</em>? Most maps fall into three jobs,
                  and each has a different, much simpler answer than &ldquo;make
                  the canvas perfect.&rdquo;
                </p>
                <div className="not-prose grid gap-4 md:grid-cols-3 my-6">
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Decorative or illustrative
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A stylized map in a hero, a &ldquo;we are global&rdquo;
                      backdrop, a texture. It carries no information the user
                      needs. Hide it from assistive technology with{" "}
                      <code>aria-hidden=&quot;true&quot;</code>, or{" "}
                      <code>alt=&quot;&quot;</code> if it is an{" "}
                      <code>&lt;img&gt;</code>, and do not make people tab through
                      it.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      One fixed location
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A contact page &ldquo;find us here.&rdquo; The essential
                      information is the address and how to get there, which
                      belong in text. A static map image with meaningful alt, plus
                      a Get directions link, serves more people than an embedded
                      interactive map.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Explore many places or data
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A store locator, a property search, a choropleth. The
                      accessible experience is a list or table of the results or
                      data with the same filters and actions, and the map is a
                      visual layer on top. The list is the source of truth.
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Naming the job first is what keeps the work proportionate. Two of
                  the three answers barely touch the map at all. Only the third,
                  the interactive locator or data map, needs the fuller treatment,
                  and even there the heavy lifting happens in the list beside the
                  map, not in the map canvas. The rest of this guide follows that
                  order.
                </p>
              </div>
            </div>
          </section>

          {/* 2. The map + list pattern */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. The Text Alternative: the Map-plus-List Pattern
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the centerpiece technique, and it is the geospatial
                  version of a rule you may know from{" "}
                  <Link href="/guides/accessible-charts" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible charts
                  </Link>
                  : the accessible form of a picture of data is the data itself, as
                  text. For a locator, everything a sighted user reads off the map,
                  which stores exist, where they are, how far, and what you can do
                  about each one, must be available as a real{" "}
                  <strong className="text-slate-900 dark:text-white">
                    list or table of results
                  </strong>{" "}
                  with the same actions.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- The accessible source of truth: a labeled search, a live count, and a real list -->
<form role="search" aria-label="Find a store">
  <label for="near">Search near</label>
  <input id="near" name="near" type="text" autocomplete="postal-code">
  <button type="submit">Search</button>
</form>

<!-- Announce how many results the search returned -->
<p aria-live="polite">12 stores found near 90210.</p>

<ul aria-label="Store search results">
  <li>
    <h3>Acme Coffee, Central</h3>
    <p>5th and Main, Springfield &middot; 0.4 miles &middot; Open until 8pm</p>
    <a href="https://maps.example/dir?to=acme-central">Get directions</a>
    <button type="button" data-store="acme-central">Show on map</button>
  </li>
  <li>
    <h3>Acme Coffee, Riverside</h3>
    <p>18 Canal Street, Springfield &middot; 1.1 miles &middot; Open until 6pm</p>
    <a href="https://maps.example/dir?to=acme-riverside">Get directions</a>
    <button type="button" data-store="acme-riverside">Show on map</button>
  </li>
</ul>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A few rules make this pattern hold together:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The list is the source of truth; the map mirrors it.
                    </strong>{" "}
                    Build the list first and wire the map to it, so the{" "}
                    <code>Show on map</code> button pans the map to a result. A
                    keyboard or screen reader user completes the whole task,
                    search, read results, get directions, from the list, never
                    needing to touch the map.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Announce result changes.
                    </strong>{" "}
                    When a search or filter updates the results, update a polite{" "}
                    <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                      live region
                    </Link>{" "}
                    with the new count, so a screen reader user knows the page
                    responded rather than being left in silence.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Use real structure.
                    </strong>{" "}
                    Results are a genuine <code>&lt;ul&gt;</code> or a semantic{" "}
                    <Link href="/guides/accessible-data-tables" className="text-blue-600 dark:text-blue-400 hover:underline">
                      data table
                    </Link>
                    , the filters are labeled{" "}
                    <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                      form controls
                    </Link>
                    , and each result&rsquo;s actions are real links and buttons
                    with names that identify the place.
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    Do not dump every marker into the DOM as a focusable element
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Making a locator accessible does not mean turning five hundred
                    pins into five hundred tab stops. That is its own failure: a
                    keyboard user tabs forever and a screen reader user hears an
                    endless list of markers. Filter to a manageable set, paginate
                    or cluster the rest, and let the results list, not the raw
                    markers, be how people move through locations. Reach a place by
                    reading its list entry, not by tabbing across the map.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Static maps */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Static Maps: the Simplest Accessible Answer
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For the &ldquo;one fixed location&rdquo; job, a static map image
                  is simpler and more robust than an interactive embed. A static
                  image from a maps provider, or even a screenshot, with real alt
                  text and the address written out beside it, gives everyone the
                  information without a widget to operate, a script to load, or a
                  keyboard trap to escape.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- A static map: the location lives in the alt text AND in real HTML beside it -->
<figure>
  <img
    src="/static-map-acme-central.png"
    alt="Map showing Acme Coffee at 5th and Main, two blocks north of Central Station"
    width="600" height="300" style="max-width:100%;height:auto;">
  <figcaption>
    <address>
      Acme Coffee, 5th and Main, Springfield
    </address>
    <a href="https://maps.example/dir?to=acme-central">Get directions</a>
  </figcaption>
</figure>

<!-- Decorative map, with the address already in text nearby: skip it -->
<img src="/hero-map-texture.png" alt="" aria-hidden="true">`}</code></pre>
                </div>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Alt text carries the meaning, not the word &ldquo;map.&rdquo;
                    </strong>{" "}
                    Describe what the map tells the reader in context, the place
                    and where it sits, since a pin on a tile conveys nothing to a
                    screen reader. This is a straight application of{" "}
                    <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.1.1 Non-text Content
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Always pair it with the address as live text.
                    </strong>{" "}
                    Put the address in real HTML, ideally in an{" "}
                    <code>&lt;address&gt;</code> element, plus a Get directions
                    link that hands off to the user&rsquo;s maps app. Do not let
                    the only copy of the address be baked into the image, which
                    also fails{" "}
                    <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.5 Images of Text
                    </Link>{" "}
                    and{" "}
                    <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.10 Reflow
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      A decorative map gets an empty alt.
                    </strong>{" "}
                    If the map is purely illustrative and the real address is
                    already text nearby, use <code>alt=&quot;&quot;</code> so
                    assistive technology skips the redundant image rather than
                    describing it.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Interactive and embedded maps */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Interactive and Embedded Maps
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you do need a live map, the two common forms are an embedded
                  iframe from a provider and a JavaScript map built with a library
                  such as Leaflet, Mapbox GL, Google Maps, or OpenLayers. Both need
                  work, and neither removes your obligation to provide the list for
                  the real interaction.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Embedded iframe maps
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  An embedded map is an <code>&lt;iframe&gt;</code>, and every
                  iframe needs a <code>title</code> so a screen reader announces
                  what the frame contains instead of just &ldquo;frame.&rdquo; The
                  title satisfies{" "}
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2 Name, Role, Value
                  </Link>{" "}
                  for the frame, but it does not make the map&rsquo;s contents
                  operable, so the list still carries the task.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- An embedded map needs a descriptive title; the list still does the real work -->
<iframe
  title="Map of Acme Coffee store locations in Springfield"
  src="https://maps.example/embed?q=acme+springfield"
  width="600" height="450" style="border:0;max-width:100%;"
  loading="lazy"></iframe>`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  JavaScript map libraries
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A scripted map needs an accessible name and a keyboard story:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Name the map container.
                    </strong>{" "}
                    Give the map element an <code>aria-label</code> such as
                    &ldquo;Map of store locations&rdquo; so it is announced as a
                    meaningful region rather than an anonymous block.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Make pan and zoom keyboard operable.
                    </strong>{" "}
                    Most libraries can pan with the arrow keys and zoom with{" "}
                    <code>+</code> and <code>-</code> once the map has focus
                    (Leaflet enables this by default and makes the map focusable),
                    but do not stop there. Surface{" "}
                    <strong className="text-slate-900 dark:text-white">
                      visible, focusable zoom and pan buttons
                    </strong>{" "}
                    so the controls are discoverable and satisfy{" "}
                    <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.1.1 Keyboard
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Those buttons are also your 2.5.7 answer.
                    </strong>{" "}
                    Panning by mouse drag is a dragging movement, so it needs a
                    single-pointer alternative. Pan and zoom buttons that move the
                    map with one tap satisfy{" "}
                    <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.5.7 Dragging Movements
                    </Link>
                    . Make sure the library&rsquo;s controls are enabled and
                    reachable rather than hidden.
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    role=&quot;application&quot; is a loaded gun
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Putting <code>role=&quot;application&quot;</code> on a map tells
                    the screen reader to stop intercepting keys and pass them to the
                    widget, which switches off the browse-mode reading commands
                    blind users depend on. Only use it if you have genuinely built
                    full keyboard operation for everything inside, panning, zooming,
                    reaching and reading every marker. If you have not, it traps the
                    user in a region where their normal commands no longer work and
                    nothing replaces them. The safer default is a labeled region and
                    letting the list carry the interaction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Markers and popups */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Markers, Pins, and Popups
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When markers are interactive, they have to be real controls. A
                  pin a mouse user can click must be a{" "}
                  <code>&lt;button&gt;</code> or an <code>&lt;a&gt;</code>, focusable
                  and named, not a <code>&lt;div&gt;</code> or an{" "}
                  <code>&lt;img&gt;</code> with a click handler that no keyboard can
                  reach and no screen reader can find. The accessible name must{" "}
                  <em>identify the place</em>, not describe the graphic.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- A marker is a real, named button, not a div with an onclick -->
<button type="button" class="marker" data-store="acme-central"
        aria-label="Acme Coffee, 5th and Main. Show details.">
  <img src="/pin.svg" alt="" width="24" height="32">
</button>`}</code></pre>
                </div>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Name every marker by its place.
                    </strong>{" "}
                    &ldquo;Acme Coffee, 5th and Main&rdquo; tells a screen reader
                    user which location they are on. &ldquo;Marker&rdquo; or a pin
                    file name tells them nothing (4.1.2). The pin image inside gets
                    an empty alt, since the button already carries the name.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Treat the popup like a dialog.
                    </strong>{" "}
                    When a marker opens an infowindow, move focus into it, let{" "}
                    <kbd>Escape</kbd> close it and return focus to the marker, and
                    build its content from real HTML. This is the{" "}
                    <Link href="/guides/accessible-dialog" className="text-blue-600 dark:text-blue-400 hover:underline">
                      dialog and disclosure pattern
                    </Link>{" "}
                    applied to the map.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not signal a marker&rsquo;s meaning by color alone.
                    </strong>{" "}
                    If a red pin means &ldquo;closed&rdquo; and a green pin means
                    &ldquo;open,&rdquo; that difference must also be in the
                    accessible name or a text label, not the color of the icon
                    (
                    <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.1 Use of Color
                    </Link>
                    ).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Mind the scale.
                    </strong>{" "}
                    Hundreds of markers become hundreds of tab stops. Cluster them,
                    or keep the list as the primary way people reach a location and
                    let direct marker interaction be an enhancement, not the only
                    route.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Color, contrast, and text on maps */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Color, Contrast, and Text on Maps
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Maps are visually dense, which makes contrast and color harder
                  than on a plain page, and the provider&rsquo;s own tiles are
                  outside your control. That is one more reason the important
                  information also lives in your HTML, but there is still plenty
                  you own on top of the map.
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Baked-in tile text cannot resize or reflow.
                    </strong>{" "}
                    Street and label text rendered into map tiles is an image of
                    text, so it does not respond to{" "}
                    <Link href="/wcag/1-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.4 Resize Text
                    </Link>{" "}
                    or{" "}
                    <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.10 Reflow
                    </Link>
                    . You cannot fix the provider&rsquo;s tiles, so keep your own
                    overlay labels, legends, and callouts as live HTML text, and
                    offer zoom controls so users can enlarge the view.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Give controls, routes, and markers 3:1 non-text contrast.
                    </strong>{" "}
                    Zoom buttons, your custom controls, route lines, and marker
                    icons all need 3:1 against the background under{" "}
                    <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.11 Non-text Contrast
                    </Link>
                    . A thin pale route drawn over a pale map fails, so give routes
                    and markers a contrasting outline or casing that holds up over
                    a variable background.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Never encode meaning in color alone.
                    </strong>{" "}
                    Colored routes, regions, and categories need a second cue, a
                    label, a pattern, or a text and table equivalent, so a
                    color-blind user gets the same information (1.4.1).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Keep the focus indicator visible.
                    </strong>{" "}
                    A focused marker or control needs a clear focus ring that
                    stands out against the map (
                    <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.4.7 Focus Visible
                    </Link>
                    ). A subtle default outline vanishes over busy tiles.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 7. Data maps */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Data Maps: a Choropleth Is a Chart
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A choropleth, a heat map, or a bubble map is not really a map in
                  the navigational sense. It is a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    data visualization that uses geography for its axes
                  </strong>
                  , encoding a value in the color or size of each region. That
                  means the same rule as any chart applies: the accessible form is
                  the underlying data as a table, region by value, plus a short
                  text summary of the takeaway.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- A choropleth needs its data as a table and a plain-language summary -->
<figure>
  <div role="img" aria-label="Choropleth of 2026 sales by US region">
    <!-- the colored SVG or canvas map -->
  </div>
  <figcaption>Sales were highest in the West and lowest in the Northeast.</figcaption>
</figure>

<table>
  <caption>2026 sales by region (US dollars, millions)</caption>
  <thead>
    <tr><th scope="col">Region</th><th scope="col">Sales</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">West</th><td>48.2</td></tr>
    <tr><th scope="row">South</th><td>39.7</td></tr>
    <tr><th scope="row">Midwest</th><td>31.4</td></tr>
    <tr><th scope="row">Northeast</th><td>22.9</td></tr>
  </tbody>
</table>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Do not make the colored map the only way to read the numbers, and
                  do not rely on color alone to separate categories. The{" "}
                  <Link href="/guides/accessible-charts" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible charts guide
                  </Link>{" "}
                  covers the data-table-as-text-alternative pattern in full, and
                  the{" "}
                  <Link href="/guides/accessible-data-tables" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible data tables guide
                  </Link>{" "}
                  covers building the table itself with a caption and{" "}
                  <code>th scope</code> headers. Both apply directly to a map that
                  is really a chart.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Testing an Accessible Map
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The most important test is whether the task works without the
                  map, so start there and only then check the map itself. Automated
                  tools catch a missing iframe title and some unlabeled controls,
                  but they cannot tell you whether an equivalent non-map path
                  exists, which is the thing that matters most.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Keyboard only, without touching the map
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Put the mouse away and complete the whole task from the list:
                  search or filter, read the results, get directions, select a
                  location. If you can do that without ever entering the map, the
                  core experience is sound. Then Tab into the map itself and
                  confirm you can pan and zoom with the keyboard, reach any markers,
                  and that the map is skippable rather than a trap.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Screen reader
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  With{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>
                  ,{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>
                  , or{" "}
                  <Link href="/guides/talkback-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    TalkBack
                  </Link>
                  , confirm each result and its actions are announced, that the
                  result count is announced when it changes, and that the map is
                  either a cleanly labeled, skippable region or exposes named
                  controls, not a wall of unlabeled pins.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Zoom, pointer, and contrast
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At 200% browser zoom and 320px width, confirm the locator list
                  and controls reflow to a single column and the page does not
                  scroll sideways. Confirm every drag has a single-pointer
                  alternative and pinch-zoom has button equivalents (2.5.7). Check
                  that your controls, routes, and markers meet 3:1 contrast. For
                  where this fits in a wider process, see the{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessibility audit guide
                  </Link>{" "}
                  and the{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>
                  , which explains why the manual pass is the one that catches what
                  matters here.
                </p>
              </div>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Map Accessibility Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the errors that turn up most in real map audits. Every
                one comes back to the same root cause: the map is treated as the
                experience, instead of an enhancement on top of an experience that
                already works without it.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common map accessibility anti-patterns, why each one fails, and
                    the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Anti-pattern</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {antiPatterns.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The Accessible Map Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">The job is named.</strong>{" "}
                  You know whether this map is decorative, shows one location, or
                  lets people explore many, and you have built the matching answer.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">There is an equivalent non-map path.</strong>{" "}
                  Anything the map is the way to do, find a store, read a value, can
                  also be done from a list, table, or text without the map.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The list is the source of truth.</strong>{" "}
                  Results are a real list or table with the same details and
                  actions, and the map is wired to the list, not the reverse.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Result changes are announced.</strong>{" "}
                  A search or filter updates a polite live region with the new
                  count so screen reader users know the page responded.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Embedded maps have a title.</strong>{" "}
                  Every map <code>&lt;iframe&gt;</code> has a descriptive{" "}
                  <code>title</code>, and decorative maps are hidden from assistive
                  technology.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Markers are real, named controls.</strong>{" "}
                  Interactive pins are buttons or links whose name identifies the
                  place, and popups behave like dialogs with focus and Escape.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Pan and zoom work by keyboard and by tap.</strong>{" "}
                  Visible pan and zoom buttons operate the map with a single click,
                  satisfying both keyboard and single-pointer requirements.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Nothing depends on color alone.</strong>{" "}
                  Routes, regions, and marker categories carry a label, pattern, or
                  text equivalent as well as color.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Contrast and focus hold up on the map.</strong>{" "}
                  Controls, routes, and markers meet 3:1, and the focus indicator
                  stays visible against busy tiles.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">A data map ships its data.</strong>{" "}
                  A choropleth or heat map includes the underlying values as a table
                  and a plain-language summary of the takeaway.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Build the Equivalent Path First
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  A map is easy once the task works without it. Start with the two
                  techniques that carry an accessible map: a real results list or
                  table, and a single-pointer alternative to every drag.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/guides/accessible-data-tables">
                      Accessible Data Tables Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/wcag/2-5-7">
                      WCAG 2.5.7 Dragging Movements
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details key={i} className="group border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessible maps map accessibility interactive map store locator branch finder location finder embedded map google maps leaflet mapbox openlayers map alt text static map marker pin popup infowindow keyboard accessible map pan zoom single pointer alternative dragging movements 2.5.7 choropleth heat map data map data visualization data table text alternative iframe title role application labeled region live region results list use of color non-text contrast reflow images of text screen reader testing 1.1.1 2.1.1 1.3.1 4.1.2 1.4.1 1.4.11 1.4.10"
                title="Related Guides & References"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
