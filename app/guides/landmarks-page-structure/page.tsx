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

const pageTitle = "ARIA Landmarks & Page Structure: A Complete Accessibility Guide"
const pageDescription =
  "Landmarks and headings are the two maps a screen reader user navigates by. This guide covers the eight landmark roles and the HTML that gives them to you, the scoping rule almost everyone misses (header and footer are only landmarks at the top level), the section trap where a section is not a landmark until you name it, one main and naming repeated regions, the heading map and the HTML5 outline myth, complete coverage, and how screen reader users jump around a page by structure. Copy-ready HTML mapped to WCAG 2.2 (1.3.1)."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "aria landmarks",
    "landmark roles",
    "html landmarks",
    "page structure accessibility",
    "semantic html accessibility",
    "accessible page structure",
    "landmark regions",
    "banner landmark",
    "main landmark",
    "navigation landmark",
    "complementary landmark",
    "contentinfo landmark",
    "region role",
    "search landmark",
    "section vs region aria",
    "html5 sectioning elements",
    "html5 document outline",
    "heading structure accessibility",
    "one main per page",
    "how to label landmarks",
    "screen reader landmark navigation",
    "wcag 1.3.1",
  ],
  alternates: {
    canonical: "/guides/landmarks-page-structure",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/landmarks-page-structure",
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
      `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Landmarks & Page Structure",
    url: "https://accessibility.build/guides/landmarks-page-structure",
  },
]

const faqs = [
  {
    question: "What are ARIA landmarks?",
    answer:
      "Landmarks are the named regions of a page that a screen reader can list and jump between, the way a sighted user glances at the header, the main column, the sidebar, and the footer. There are eight landmark roles: banner, navigation, main, complementary, contentinfo, search, form, and region. You almost never write these roles by hand, because the HTML5 sectioning elements provide them for free: header maps to banner, nav to navigation, main to main, aside to complementary, and footer to contentinfo. Landmarks matter because they give a non-visual user the same overview and the same shortcuts a sighted user gets from layout. Without them, a screen reader user faces one undifferentiated stream of content with no way to skip to the part they want.",
  },
  {
    question: "What is the difference between a landmark and a heading?",
    answer:
      "They are two separate navigation maps, and an accessible page provides both. Landmarks are the handful of big regions: this is the banner, this is the main content, this is the sidebar. Headings are the fine-grained outline inside those regions: the page title, then its sections and subsections. A screen reader user moves between landmarks to reach the right area, then moves between headings to find the right spot within it. Landmarks answer where am I on the page, and headings answer what is the structure of this content. Providing landmarks but no headings leaves users lost inside a region; providing headings but no landmarks makes them wade through the header and nav every time.",
  },
  {
    question: "Do I need role=\"banner\" if I already use a header element?",
    answer:
      "No. A top-level header element already exposes the banner role automatically, so adding role=\"banner\" is redundant. The same is true for the other native elements: nav is already navigation, main is already main, aside is already complementary, and footer is already contentinfo. The first rule of ARIA applies here: if a native HTML element gives you the role, use it and do not add the ARIA role on top. You only reach for an explicit role attribute when you cannot use the native element, for example role=\"search\" on a form, or a role on a div in a codebase that cannot change its markup.",
  },
  {
    question: "Why is my section element not showing up as a landmark?",
    answer:
      "Because a section only becomes a region landmark when it has an accessible name. An unnamed section exposes no role to assistive technology at all; it is treated as a generic container, invisible in the landmarks list. To turn a section into a landmark, give it a name with aria-labelledby pointing at its heading, or with aria-label. This is deliberate: if every section were automatically a landmark, a content-heavy page would flood the landmarks list with dozens of unlabeled regions. Name the few sections that are genuinely major regions of the page, and let ordinary headings organize the rest.",
  },
  {
    question: "How many main elements can a page have?",
    answer:
      "One. A page has exactly one main landmark, and it holds the primary content unique to that page, everything that is not the repeated header, navigation, sidebar, or footer. More than one main makes the region ambiguous, so a screen reader user pressing the shortcut to jump to main no longer has a single destination; some assistive technology ignores the extras or reports an error. If you are using a client-side router and swap the page content, keep swapping the contents of the same single main element rather than mounting a second one.",
  },
  {
    question: "Is the HTML5 document outline real? Can I use h1 for every section?",
    answer:
      "No, and you should not. The HTML5 specification once described a document outline algorithm in which each sectioning element such as section or article would restart the heading scope, so you could use an h1 in every section and the browser would compute the real levels from the nesting. No browser and no screen reader ever implemented it, and it was removed from the specification. In practice, heading level comes only from the actual tag you use, so a page of nested h1 elements reads to a screen reader as many top-level headings with no hierarchy. Use explicit h1 through h6 levels that reflect the real structure, one h1 per page, and do not skip levels.",
  },
  {
    question: "How do I label two navigation landmarks so they are not confused?",
    answer:
      "Give each one a distinct accessible name with aria-label or aria-labelledby. Two nav elements both announce as navigation, so a screen reader user hears navigation, navigation with no way to tell them apart. Label the main site navigation aria-label=\"Primary\" and the one in the footer aria-label=\"Footer\", and they become Primary navigation and Footer navigation. Do not put the word navigation in the label itself, because the role already contributes it: aria-label=\"Primary navigation\" is announced as Primary navigation, navigation. The same rule applies to any repeated landmark type, such as two complementary regions or two named sections.",
  },
  {
    question: "Do landmarks replace skip links?",
    answer:
      "Not entirely, because they serve different audiences. Landmarks are the bypass mechanism for screen reader users, who can jump straight to the main landmark and skip the repeated header. But a sighted keyboard user who does not run a screen reader has no landmark shortcut, so they still need a visible skip link to bypass the navigation. The accessible answer is to provide both: proper landmarks for screen reader users and a skip link for keyboard users, along with a clean heading structure that serves everyone. They reinforce each other rather than competing, which is why WCAG 2.4.1 accepts any of them as a valid bypass.",
  },
]

const antiPatterns = [
  {
    bad: "The whole page is built from div elements with no landmarks.",
    why: "A screen reader user gets no region map and no way to skip repeated content; the page is one undifferentiated stream (weakens 1.3.1 and 2.4.1).",
    fix: "Use the native sectioning elements: header, nav, main, aside, and footer, so the page exposes banner, navigation, main, complementary, and contentinfo for free.",
  },
  {
    bad: "The page has two main elements, or none.",
    why: "The jump-to-main shortcut has no single destination, so the primary bypass target is ambiguous and some assistive technology reports an error (fails 1.3.1).",
    fix: "Use exactly one main element per page, holding the primary content, and keep swapping its contents on client-side route changes instead of mounting a second one.",
  },
  {
    bad: "Two nav or two aside regions with no accessible name.",
    why: "Both announce identically, as navigation, navigation, so a screen reader user cannot tell the primary nav from the footer nav (fails 4.1.2).",
    fix: "Give each repeated landmark a unique accessible name with aria-label or aria-labelledby, and do not include the role word (navigation, region) in the name.",
  },
  {
    bad: "Section elements scattered everywhere in the hope they create landmarks.",
    why: "An unnamed section exposes no role at all, so it does nothing for structure, while naming every section would flood the landmarks list with noise.",
    fix: "Name only the few sections that are genuinely major page regions with aria-labelledby, and use ordinary headings to organize everything else.",
  },
  {
    bad: "Heading levels are skipped, or headings are chosen for their font size.",
    why: "Jumping from h2 to h4 breaks the outline a screen reader builds, and marking text as a heading only to make it big misrepresents the structure (weakens 1.3.1 and 2.4.10).",
    fix: "Use one h1 and then sequential levels that reflect the real hierarchy, and control visual size with CSS, never by picking a different heading level.",
  },
  {
    bad: "A top-level footer is nested inside main or an article, expecting it to stay contentinfo.",
    why: "banner and contentinfo only apply at the top level; nested inside a sectioning element, header and footer expose no landmark role, so the region silently disappears from the map.",
    fix: "Keep the page banner and contentinfo as direct top-level regions, and treat header and footer inside cards or articles as ordinary content.",
  },
  {
    bad: "An aria-label duplicates the role word, like aria-label=\"Main content region\".",
    why: "The role is already announced, so the user hears the word twice: Main content region, region, which is verbose and confusing.",
    fix: "Name the purpose only. Let the role speak for itself and write labels like Primary, Footer, or Related articles.",
  },
]

export default function LandmarksPageStructureGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
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
                    Landmarks &amp; Page Structure
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
                Implementation Guide &bull; Updated August 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                ARIA Landmarks &amp; Page Structure
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A sighted user sees a page&rsquo;s structure at a glance: header
                on top, main column in the middle, sidebar to one side, footer at
                the bottom. A screen reader user gets that same structure only if
                you put it in the markup. This guide covers the two maps they
                navigate by, landmarks and headings, the eight landmark roles and
                the HTML that provides them, the scoping and naming rules almost
                everyone gets wrong, and how real screen readers jump around a
                page by structure. Copy-ready HTML mapped to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Page Structure Is an Accessibility Feature
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you look at a web page, you take in its structure before
                  you read a single word. Your eye separates the banner across the
                  top, the main article in the center, the related links down the
                  side, and the legal text in the footer, and you jump straight to
                  whichever one you came for. That instant overview is a genuine
                  feature of the page, and it is entirely visual. A screen reader
                  user cannot glance. They receive the page as a linear stream,
                  one element after another, and the only way they get the same
                  overview is if the structure is written into the HTML so their
                  software can expose it.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two mechanisms carry that structure, and they are complementary.
                  Landmarks are the small set of major regions, the banner, the
                  navigation, the main content, the sidebar, the footer. Headings
                  are the fine-grained outline inside those regions, from the
                  page&rsquo;s h1 down through its sections and subsections. A
                  screen reader lets a user list all the landmarks on a page and
                  jump between them, and separately list all the headings and jump
                  between those. Together they reproduce, for a non-visual user,
                  the scanning a sighted user does with their eyes.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The idea that ties this guide together
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Landmarks and headings are two navigation maps that most
                    developers never see, because they are exposed to assistive
                    technology rather than drawn on the screen. When you use{" "}
                    <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
                    <code>&lt;main&gt;</code>, <code>&lt;aside&gt;</code>, and{" "}
                    <code>&lt;footer&gt;</code>, and a clean sequence of heading
                    levels, you are not decorating; you are drawing both maps. Skip
                    those elements and reach for <code>&lt;div&gt;</code> for
                    everything, and the page has no map at all: a screen reader
                    user has to read it top to bottom every time, with no way to
                    skip the parts they have already heard.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is not an edge case for a few users. Structure is the
                  backbone of{" "}
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.1 Info and Relationships
                  </Link>
                  , one of the most-cited WCAG failures on the web, and it is what
                  makes the bypass mechanisms in{" "}
                  <Link href="/guides/skip-links" className="text-blue-600 dark:text-blue-400 hover:underline">
                    skip links and bypass blocks
                  </Link>{" "}
                  possible in the first place. Good structure also happens to be
                  the cheapest accessibility win there is: it is mostly a matter of
                  choosing the right element, and it helps everyone, including
                  search engines that read your page&rsquo;s outline the same way.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How Page Structure Maps to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The highlighted row,{" "}
                <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.3.1 Info and Relationships
                </Link>
                , is the heart of the matter: the structure a sighted user
                perceives visually must also be exposed in the markup. The other
                rows are the criteria a well-structured page satisfies along the
                way, from the bypass that landmarks enable to the accessible names
                that keep two regions of the same type apart.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to landmarks, headings,
                    and page structure, their conformance level, and how each one
                    applies
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
                        How it applies to page structure
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The regions and outline a sighted user sees must be exposed in code. Landmarks convey the major regions and headings convey the content hierarchy, so assistive technology can present the same structure.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.1 Bypass Blocks
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Landmark regions are an accepted way to skip repeated content: a screen reader user jumps straight to the main landmark past the header and navigation.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.2 Page Titled
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The document title is the top of the structure. A descriptive, unique title names the page in the tab, in history, and in the screen reader&rsquo;s announcement when the page loads.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.2 Meaningful Sequence
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The reading order that assistive technology and the keyboard follow is the DOM order, not the visual order. Source order must make sense even when CSS moves things around.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.6 Headings and Labels
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Headings and the accessible names of landmarks must describe the topic or purpose of the content they head, so the outline and the landmarks list are useful, not generic.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Each landmark exposes a role. When two landmarks share a role, such as two navigation regions, each needs a distinct accessible name so they can be told apart.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.10 Section Headings
                        </Link>
                      </th>
                      <td className="px-4 py-3">AAA</td>
                      <td className="px-4 py-3">Where content is organized into sections, headings are used to mark them. This is the fine-grained half of the structure, and it is an enhancement above AA.</td>
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

          {/* 1. The eight landmark roles */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Eight Landmark Roles, and the HTML That Gives Them to You
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  There are eight landmark roles in ARIA, and for five of them
                  there is a native HTML element that provides the role
                  automatically. The single most important rule of this guide
                  follows the{" "}
                  <Link href="/guides/using-aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                    first rule of ARIA
                  </Link>
                  : if a native element gives you the landmark, use the native
                  element and do not add the role attribute on top. Writing{" "}
                  <code>&lt;header role=&quot;banner&quot;&gt;</code> is redundant,
                  and a <code>&lt;div role=&quot;main&quot;&gt;</code> is a worse
                  version of <code>&lt;main&gt;</code>.
                </p>
                <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      The eight ARIA landmark roles, the native HTML element that
                      provides each one, and what the region is for
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Landmark role</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Native HTML</th>
                        <th scope="col" className="px-4 py-3 font-semibold">What it is for</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">banner</th>
                        <td className="px-4 py-3 align-top"><code>&lt;header&gt;</code> at the top level</td>
                        <td className="px-4 py-3 align-top">Site-orientation content repeated across pages: the logo, site name, and often the primary navigation and search.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">navigation</th>
                        <td className="px-4 py-3 align-top"><code>&lt;nav&gt;</code></td>
                        <td className="px-4 py-3 align-top">A group of navigation links. A page can have several; name each one.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">main</th>
                        <td className="px-4 py-3 align-top"><code>&lt;main&gt;</code></td>
                        <td className="px-4 py-3 align-top">The primary content unique to this page. Exactly one per page.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">complementary</th>
                        <td className="px-4 py-3 align-top"><code>&lt;aside&gt;</code></td>
                        <td className="px-4 py-3 align-top">Supporting content that makes sense on its own: related links, a pull quote, an ad rail.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">contentinfo</th>
                        <td className="px-4 py-3 align-top"><code>&lt;footer&gt;</code> at the top level</td>
                        <td className="px-4 py-3 align-top">Information about the page: copyright, legal links, contact, footer navigation.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">search</th>
                        <td className="px-4 py-3 align-top"><code>&lt;search&gt;</code>, or <code>role=&quot;search&quot;</code> on a form</td>
                        <td className="px-4 py-3 align-top">The search facility for the site or page. The native <code>&lt;search&gt;</code> element is newer; <code>role=&quot;search&quot;</code> on the form is the widely supported technique.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">form</th>
                        <td className="px-4 py-3 align-top"><code>&lt;form&gt;</code> with an accessible name</td>
                        <td className="px-4 py-3 align-top">A significant form region. A form becomes a landmark only when it has a name; use it for major forms, not every input group.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">region</th>
                        <td className="px-4 py-3 align-top"><code>&lt;section&gt;</code> with an accessible name</td>
                        <td className="px-4 py-3 align-top">A major section important enough to be a landmark. Only counts when named, so use it sparingly.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Put the common ones together and a well-structured page has a
                  clean skeleton that reads as a map before you add any content:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<body>
  <header>                        <!-- banner -->
    <a class="skip-link" href="#main">Skip to main content</a>
    <a href="/"><img src="/logo.svg" alt="Acme"></a>
    <nav aria-label="Primary">    <!-- navigation -->
      <ul> ... </ul>
    </nav>
    <search>                      <!-- search -->
      <form role="search">
        <label for="q">Search Acme</label>
        <input id="q" type="search" name="q">
        <button type="submit">Search</button>
      </form>
    </search>
  </header>

  <main id="main">                <!-- main: exactly one -->
    <h1>Accessible page structure</h1>
    <p> ... primary content ... </p>

    <aside aria-label="Related guides">  <!-- complementary -->
      <h2>Related guides</h2>
      <ul> ... </ul>
    </aside>
  </main>

  <footer>                        <!-- contentinfo -->
    <nav aria-label="Footer">     <!-- navigation, named -->
      <ul> ... </ul>
    </nav>
    <p>&copy; 2026 Acme</p>
  </footer>
</body>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  That is the target shape. The rest of this guide is about the
                  rules that decide whether these elements actually become the
                  landmarks you expect, because several of them do not behave the
                  way their tag names suggest.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Scoping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. Landmark Scoping: the Rule Almost Everyone Misses
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Here is the detail that trips up even experienced developers:{" "}
                  <code>&lt;header&gt;</code> and <code>&lt;footer&gt;</code> only
                  expose the banner and contentinfo landmark roles when they are at
                  the top level of the document. Nested inside a{" "}
                  <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>,{" "}
                  <code>&lt;aside&gt;</code>, <code>&lt;nav&gt;</code>, or{" "}
                  <code>&lt;section&gt;</code>, a <code>&lt;header&gt;</code> or{" "}
                  <code>&lt;footer&gt;</code> exposes no landmark role at all; it is
                  treated as an ordinary container. This is by design, and it is
                  usually what you want.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Think about a page that lists twenty article cards, each with its
                  own <code>&lt;header&gt;</code> holding the title and its own{" "}
                  <code>&lt;footer&gt;</code> holding the byline. If every one of
                  those became a landmark, the landmarks list would fill with
                  twenty banners and twenty contentinfos, which is useless. Because
                  banner and contentinfo are scoped to the top level only, you get
                  exactly one of each, the page banner and the page footer, and the
                  card headers and footers stay quiet. The scoping is protecting
                  you.
                </p>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    Where scoping bites: the disappearing footer
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The flip side is that if you accidentally move your page
                    footer inside <code>&lt;main&gt;</code>, or wrap the whole page
                    body in a single <code>&lt;section&gt;</code> or{" "}
                    <code>&lt;article&gt;</code>, the top-level{" "}
                    <code>&lt;header&gt;</code> and <code>&lt;footer&gt;</code>{" "}
                    silently lose their banner and contentinfo roles, and those
                    landmarks vanish from the map. Keep the page banner and the
                    page footer as direct children of <code>&lt;body&gt;</code> (or
                    of a simple layout wrapper that is not a sectioning element), so
                    they stay at the top level.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Not every element is scoped this way. The table below shows which
                  landmarks are always exposed and which depend on where they sit
                  or whether they are named.
                </p>
                <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-4">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      Which HTML elements always expose a landmark role and which
                      depend on their position in the document or on having an
                      accessible name
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Element</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Becomes a landmark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code></th>
                        <td className="px-4 py-3 align-top">Always, wherever they sit in the document.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code></th>
                        <td className="px-4 py-3 align-top">Only at the top level. Nested inside main, article, aside, nav, or section they expose no landmark role.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>&lt;aside&gt;</code></th>
                        <td className="px-4 py-3 align-top">At the top level, always complementary. Nested inside article or section it is complementary only if it has an accessible name; otherwise it is a generic container.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>&lt;section&gt;</code></th>
                        <td className="px-4 py-3 align-top">Only when it has an accessible name, and then it is a region. Unnamed, it exposes no role.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>&lt;form&gt;</code></th>
                        <td className="px-4 py-3 align-top">Only when it has an accessible name, and then it is a form landmark. Unnamed, it is not a landmark.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>&lt;search&gt;</code> / <code>role=&quot;search&quot;</code></th>
                        <td className="px-4 py-3 align-top">Always a search landmark.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The practical takeaway: use <code>&lt;header&gt;</code> and{" "}
                  <code>&lt;footer&gt;</code> freely inside cards and articles for
                  clean markup, knowing they will not pollute the landmarks list,
                  and be deliberate about keeping the page-level banner and
                  contentinfo where the scoping rule can find them.
                </p>
              </div>
            </div>
          </section>

          {/* 3. One main + naming */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. One Main, and Naming Repeated Landmarks
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two rules govern how many landmarks you have and how a user tells
                  them apart.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Exactly one main
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A page has one <code>&lt;main&gt;</code> landmark, and it holds
                  the content unique to that page, everything that is not the
                  repeated banner, navigation, sidebar, or footer. The main
                  landmark is the destination the whole bypass model points at:
                  when a screen reader user presses the shortcut to jump to main,
                  there must be a single, unambiguous target. Two main elements
                  break that, and some assistive technology flags it as an error or
                  ignores the extra one. In a single-page app, keep one main and
                  swap its contents as the route changes, rather than mounting a
                  second main per view.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Name every repeated landmark
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When a page has more than one landmark of the same type, each one
                  needs a distinct accessible name, or the user cannot tell them
                  apart. Two <code>&lt;nav&gt;</code> regions both announce as
                  &ldquo;navigation&rdquo;, so a user browsing the landmarks list
                  hears &ldquo;navigation, navigation&rdquo; with no way to choose.
                  Give each a name with <code>aria-label</code> or{" "}
                  <code>aria-labelledby</code>:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<nav aria-label="Primary">        <!-- announced: "Primary navigation" -->
  <ul> ... </ul>
</nav>

<nav aria-label="Breadcrumb">     <!-- announced: "Breadcrumb navigation" -->
  <ol> ... </ol>
</nav>

<nav aria-label="Footer">         <!-- announced: "Footer navigation" -->
  <ul> ... </ul>
</nav>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two rules keep those names clean. First, do not put the role word
                  in the name. The role already contributes &ldquo;navigation&rdquo;,
                  so <code>aria-label=&quot;Primary navigation&quot;</code> is read
                  as &ldquo;Primary navigation, navigation&rdquo;; write{" "}
                  <code>Primary</code>. Second, when there is a visible heading that
                  already names the region, point at it with{" "}
                  <code>aria-labelledby</code> instead of retyping the text, so the
                  name stays in sync:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<aside aria-labelledby="related-heading">
  <h2 id="related-heading">Related articles</h2>
  <ul> ... </ul>
</aside>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This naming is the{" "}
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2 Name, Role, Value
                  </Link>{" "}
                  tie-in for structure: the role comes from the element, and you
                  supply the name that distinguishes one instance from another. The{" "}
                  <code>Breadcrumb</code> navigation above is a pattern in its own
                  right; for marking the current page with{" "}
                  <code>aria-current</code>, hiding the separators from assistive
                  technology, and keeping the visible trail in sync with{" "}
                  <code>BreadcrumbList</code> structured data, see the{" "}
                  <Link href="/guides/accessible-breadcrumbs" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible breadcrumbs guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* 4. The section trap */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. The Section Trap: a Section Is Only a Landmark When You Name It
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A common misconception is that wrapping content in{" "}
                  <code>&lt;section&gt;</code> makes it a landmark. It does not. A{" "}
                  <code>&lt;section&gt;</code> exposes the region landmark role{" "}
                  <em>only</em> when it has an accessible name. An unnamed{" "}
                  <code>&lt;section&gt;</code> is, to assistive technology, an
                  ordinary generic container: it adds nothing to the landmarks
                  list, and a screen reader will not announce entering or leaving
                  it. So a page sprinkled with a dozen bare{" "}
                  <code>&lt;section&gt;</code> tags has, from a landmark point of
                  view, no extra structure at all.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To turn a section into a region landmark, name it, usually by
                  pointing <code>aria-labelledby</code> at its heading:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Not a landmark: unnamed section, exposed as a generic container -->
<section>
  <h2>Pricing</h2>
  ...
</section>

<!-- A region landmark: the section is named by its heading -->
<section aria-labelledby="pricing-heading">
  <h2 id="pricing-heading">Pricing</h2>
  ...
</section>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The requirement to name it is deliberate, and it points to the
                  right way to use region. If every <code>&lt;section&gt;</code>{" "}
                  became a landmark automatically, a long article split into ten
                  sections would show ten regions in the landmarks list, drowning
                  the useful landmarks (banner, main, footer) in noise. So the
                  guidance is to be sparing: reserve named regions for a small
                  number of genuinely major areas of the page that a user might
                  reasonably want to jump to, such as a distinct
                  &ldquo;Filters&rdquo; panel beside a product grid, or the main
                  regions of a dashboard. For everything else, an ordinary heading
                  already provides the structure, and it does so without adding to
                  the landmark count.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    A simple decision for section vs heading
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Would a user want a landmark shortcut straight to this area,
                    the way they jump to main or search? If yes, and there are only
                    a few such areas, make it a named{" "}
                    <code>&lt;section&gt;</code> (a region). If it is just the next
                    part of the reading flow, use a heading and a plain{" "}
                    <code>&lt;section&gt;</code> or <code>&lt;div&gt;</code>. When
                    in doubt, prefer a heading: the heading map can be as detailed
                    as you like, whereas the landmarks list works best when it
                    stays short.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The same &ldquo;named or nothing&rdquo; rule applies to{" "}
                  <code>&lt;form&gt;</code>: a form is a landmark only when it has
                  an accessible name, so a labeled login or checkout form becomes a
                  form landmark, while a small unnamed inline form does not clutter
                  the list. The dedicated{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible forms guide
                  </Link>{" "}
                  covers labeling and grouping inside forms in depth.
                </p>
              </div>
            </div>
          </section>

          {/* 5. The heading map + outline myth */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. The Heading Map: the Other Half of Page Structure
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Landmarks give the few big regions; headings give the outline
                  inside them, and screen reader users rely on headings even more
                  heavily than on landmarks. In WebAIM&rsquo;s surveys of screen
                  reader users, navigating by heading is consistently one of the
                  most-used ways to find information on a page. A user lists all
                  the headings, reads the outline like a table of contents, and
                  jumps to the one they want. That only works if your heading
                  levels tell the truth about the structure.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The three heading rules
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  First, one <code>&lt;h1&gt;</code> per page, naming what the page
                  is about. It is the root of the outline, and it usually matches
                  the main subject in the <code>&lt;title&gt;</code>. Second, do
                  not skip levels going down: an <code>&lt;h2&gt;</code> can be
                  followed by an <code>&lt;h3&gt;</code>, but jumping from{" "}
                  <code>&lt;h2&gt;</code> straight to <code>&lt;h4&gt;</code> leaves
                  a gap in the outline that tells a screen reader user a level is
                  missing. (You can jump back up any number of levels when a
                  section ends; the no-skipping rule is about going deeper.) Third,
                  heading level is about structure, not size: never pick a heading
                  level because you want bigger or smaller text. Mark up the real
                  level and use CSS for the appearance.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<h1>Accessible page structure</h1>
  <h2>Landmarks</h2>
    <h3>The eight roles</h3>
    <h3>Scoping</h3>
  <h2>Headings</h2>
    <h3>The three rules</h3>

<!-- Wrong: the visual designer wanted a small heading, so h4 was used -->
<h2>Landmarks</h2>
<h4>The eight roles</h4>   <!-- skipped h3: the outline now has a hole -->`}</code></pre>
                </div>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    The HTML5 document outline is a myth
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You may have read that with HTML5 you can use{" "}
                    <code>&lt;h1&gt;</code> inside every{" "}
                    <code>&lt;section&gt;</code> and <code>&lt;article&gt;</code>,
                    and the browser will compute the real heading levels from the
                    nesting. That was a proposed &ldquo;document outline
                    algorithm&rdquo;, and it was never implemented by a single
                    browser or screen reader. It has since been removed from the
                    HTML specification, which now explicitly tells authors to use{" "}
                    <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code> to
                    convey structure. In reality, a page of nested{" "}
                    <code>&lt;h1&gt;</code> elements reads to a screen reader as a
                    flat pile of top-level headings with no hierarchy. Always set
                    heading levels explicitly.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Landmarks and headings answer different questions, and a good
                  page answers both. Reach for a landmark when a user would want a
                  shortcut to a whole region; reach for a heading to organize the
                  content within a region. Where the two overlap, name the landmark
                  from its heading with <code>aria-labelledby</code> so the region
                  in the landmarks list and the entry in the headings list carry
                  the same words. For a deeper look at how headings underpin the
                  bypass model, see the{" "}
                  <Link href="/guides/skip-links" className="text-blue-600 dark:text-blue-400 hover:underline">
                    skip links and bypass blocks guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* 6. Complete coverage + reading order */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Complete Coverage and Reading Order
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Leave no content outside a landmark
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A useful goal, and one the landmark checkers enforce, is that all
                  of the page&rsquo;s perceivable content sits inside some landmark.
                  When a chunk of content falls between the landmarks, in a bare{" "}
                  <code>&lt;div&gt;</code> that is a sibling of{" "}
                  <code>&lt;main&gt;</code> rather than inside it, a user navigating
                  by landmark can jump right over it and never know it is there.
                  The fix is almost always to put that content where it belongs:
                  inside <code>&lt;main&gt;</code> if it is primary content, inside
                  the banner or footer if it is chrome, or into its own named region
                  if it is genuinely a separate area. If a stray wrapper exists only
                  for layout, it can stay a <code>&lt;div&gt;</code>, as long as its
                  contents live inside a landmark.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Source order is the reading order
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Structure is not only about which regions exist; it is also about
                  the order they come in. Assistive technology and the keyboard
                  follow the DOM order, the order elements appear in the HTML source,
                  not the order CSS paints them on the screen. Flexbox{" "}
                  <code>order</code>, grid placement, and absolute positioning can
                  move a block visually without moving it in the DOM, and when they
                  disagree, a screen reader user and a keyboard user experience the
                  source order. This is{" "}
                  <Link href="/wcag/1-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.2 Meaningful Sequence
                  </Link>
                  : the sequence in which content is read must preserve its meaning.
                  A classic failure is a &ldquo;visually first&rdquo; call to action
                  that is placed last in the DOM, so keyboard users reach it only
                  after everything else. Keep the DOM order sensible and use CSS for
                  presentation, not to reorder content that a non-visual user needs
                  in a particular sequence.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The page title sits above it all
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The top of the structure is the document{" "}
                  <code>&lt;title&gt;</code>. It is the first thing a screen reader
                  announces when a page loads, it names the tab and the browser
                  history entry, and it is what people see in a list of open tabs or
                  search results. A descriptive, unique, front-loaded title, such as
                  &ldquo;Pricing, Acme&rdquo; rather than &ldquo;Acme&rdquo; on every
                  page, satisfies{" "}
                  <Link href="/wcag/2-4-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.2 Page Titled
                  </Link>{" "}
                  and is the difference between a user knowing which page they landed
                  on and having to explore to find out.
                </p>
              </div>
            </div>
          </section>

          {/* 7. How SR users navigate by structure */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. How Screen Reader Users Navigate by Structure
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All of this only matters because of what it lets users do. Every
                  major screen reader offers single-key or rotor navigation by
                  landmark and by heading, and this is where structure turns into
                  speed. A user who knows the page has a main landmark and a clean
                  heading outline does not read from the top; they jump. Knowing
                  these commands also makes your own testing far faster.
                </p>
                <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      How the major screen readers navigate between landmarks and
                      headings, and how to list all of them
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Screen reader</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Move by landmark / region</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Move by heading</th>
                        <th scope="col" className="px-4 py-3 font-semibold">List everything</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">NVDA</Link>{" "}(Windows)
                        </th>
                        <td className="px-4 py-3 align-top"><code>D</code> and <code>Shift+D</code> for the next and previous landmark.</td>
                        <td className="px-4 py-3 align-top"><code>H</code> and <code>Shift+H</code>, or number keys <code>1</code> to <code>6</code> for a specific level.</td>
                        <td className="px-4 py-3 align-top">Elements List, <code>NVDA+F7</code>, then choose Landmarks or Headings.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          <Link href="/guides/jaws-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">JAWS</Link>{" "}(Windows)
                        </th>
                        <td className="px-4 py-3 align-top"><code>R</code> and <code>Shift+R</code> cycle through regions, the JAWS term for landmarks.</td>
                        <td className="px-4 py-3 align-top"><code>H</code> and <code>Shift+H</code>, or number keys <code>1</code> to <code>6</code>.</td>
                        <td className="px-4 py-3 align-top">Headings list with <code>Insert+F6</code>.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">VoiceOver</Link>{" "}(macOS)
                        </th>
                        <td className="px-4 py-3 align-top">Open the rotor with <code>VO+U</code> and arrow to the Landmarks menu.</td>
                        <td className="px-4 py-3 align-top"><code>VO+Command+H</code>, or the Headings menu in the rotor.</td>
                        <td className="px-4 py-3 align-top">The rotor, <code>VO+U</code>, lists landmarks and headings in separate menus.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  On mobile, the pattern is the same through a gesture rather than a
                  key: VoiceOver on iOS and{" "}
                  <Link href="/guides/talkback-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    TalkBack
                  </Link>{" "}
                  on Android both have a rotor or reading-control that includes
                  Landmarks and Headings, so a user swipes to move between your
                  regions and headings the same way. The lesson for you as a builder
                  is that a clean structure is not a checkbox; it is a set of
                  working shortcuts your users press dozens of times a day.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Testing Page Structure
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  See the map for yourself
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The fastest first check is to visualize the landmarks and outline
                  a page exposes. Browser extensions such as a dedicated landmarks
                  viewer, the structure panel in WAVE, or the accessibility tree in
                  your browser&rsquo;s developer tools all draw the regions and the
                  heading hierarchy for you. Open one and ask a simple question:
                  does this match what a sighted user sees? There should be one
                  banner, one main, one contentinfo, a named navigation for each
                  distinct nav, and a heading outline with a single h1 and no gaps.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Confirm it with a screen reader
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Then use the commands from the previous section. Open the
                  landmarks list and confirm every region has a clear name and there
                  are no surprises, no duplicate unnamed navs, no accidental extra
                  banners from a nested header. Open the headings list and read it
                  like a table of contents: it should make sense on its own and let
                  you predict what is in each section. If the outline reads as a
                  logical summary of the page, your structure is sound.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  What tools catch, and what they do not
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Automated checkers such as{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  are genuinely good at the mechanical structural rules: a missing or
                  duplicated main, a page with no h1, skipped heading levels, content
                  outside all landmarks, and two landmarks of the same type without
                  distinct names. Run them and fix what they flag. What they cannot
                  judge is whether the structure is <em>right</em>: whether your h1
                  actually describes the page, whether a landmark&rsquo;s name is
                  meaningful, whether the region you marked as main is really the
                  main content, or whether the outline matches the visual design. As
                  the{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>{" "}
                  explains, structure is a place where the machine gets you to a
                  valid page and a human decides whether it is a good one. For where
                  this fits in a full review, see the{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessibility audit guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Page Structure Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the errors that turn up most in real structural audits.
                Most come back to two habits: reaching for <code>&lt;div&gt;</code>{" "}
                when a semantic element exists, and assuming an element becomes a
                landmark without checking the scoping and naming rules.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common page structure anti-patterns, why each one fails, and the
                    fix
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
                The Page Structure Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Native elements carry the regions.</strong>{" "}
                  The page uses <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
                  <code>&lt;main&gt;</code>, <code>&lt;aside&gt;</code>, and{" "}
                  <code>&lt;footer&gt;</code> rather than <code>&lt;div&gt;</code> with landmark roles bolted on.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Exactly one main.</strong>{" "}
                  There is a single <code>&lt;main&gt;</code> holding the page&rsquo;s
                  unique content, and client-side routing swaps its contents rather than mounting a second one.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Banner and contentinfo are top level.</strong>{" "}
                  The page <code>&lt;header&gt;</code> and <code>&lt;footer&gt;</code>{" "}
                  are direct top-level regions, not nested inside main or a section where they lose their role.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Repeated landmarks are named.</strong>{" "}
                  Every duplicate landmark type, such as two navs, has a distinct{" "}
                  <code>aria-label</code> or <code>aria-labelledby</code>, without the role word in the name.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Sections are landmarks only when intended.</strong>{" "}
                  Named <code>&lt;section&gt;</code> regions are reserved for a few major
                  areas; the rest of the content is organized with headings.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">One h1, no skipped levels.</strong>{" "}
                  There is a single <code>&lt;h1&gt;</code>, heading levels never jump
                  a level going deeper, and level is chosen for structure, not font size.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No content outside a landmark.</strong>{" "}
                  Every perceivable block sits inside a landmark, so nothing is skipped
                  by a user navigating region to region.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Source order matches reading order.</strong>{" "}
                  The DOM order makes sense on its own, and CSS is used for appearance,
                  not to reorder content non-visual users depend on.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The title names the page.</strong>{" "}
                  Each page has a unique, descriptive, front-loaded{" "}
                  <code>&lt;title&gt;</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Verified with a screen reader.</strong>{" "}
                  The landmarks list and the headings list have been opened in a real
                  screen reader and match what a sighted user sees.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Structure First, Then the Bypass
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Landmarks are the bypass for screen reader users; a visible skip
                  link is the bypass for sighted keyboard users. Build both on top of
                  a clean structure, and see exactly how structure satisfies Info and
                  Relationships.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/guides/skip-links">
                      Skip Links &amp; Bypass Blocks Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/wcag/1-3-1">
                      WCAG 1.3.1 Info and Relationships
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
                content="aria landmarks landmark roles html landmarks page structure semantic html accessibility accessible page structure landmark regions banner navigation main complementary contentinfo search form region role section vs region html5 sectioning elements header footer nav aside main aria-label aria-labelledby one main per page naming landmarks repeated navigation heading structure heading levels h1 skipped heading levels html5 document outline myth meaningful sequence reading order source order page title screen reader landmark navigation nvda jaws voiceover rotor bypass blocks skip links info and relationships 1.3.1 1.3.2 2.4.1 2.4.2 2.4.6 2.4.10 4.1.2"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
