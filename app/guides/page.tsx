import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Keyboard,
  AudioLines,
  ArrowRight,
  PlayCircle,
  Code2,
  Download,
  Clock,
  Signal,
  FileCode2,
  FormInput,
  Palette,
} from "lucide-react"
import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  ...createMetadata({
    title: "Accessibility Guides | Comprehensive Interactive References",
    description:
      "In-depth, interactive guides for web accessibility. Keyboard accessibility, screen reader testing, and more with live demos and downloadable checklists.",
    keywords: [
      "accessibility guides",
      "keyboard accessibility guide",
      "screen reader guide",
      "accessibility reference",
      "wcag implementation guides",
    ],
    type: "website",
  }),
  alternates: {
    canonical: "https://accessibility.build/guides",
  },
}

const guides = [
  {
    title: "Accessible Color Palette Guide",
    description:
      "Create WCAG-aware color systems for real UI states. Learn how to test buttons, cards, forms, alerts, links, charts, focus rings, disabled states, hover states, and dark mode before colors enter your design system.",
    icon: Palette,
    difficulty: "Beginner",
    readingTime: "20 min",
    topics: ["WCAG Contrast", "Design Tokens", "Dark Mode", "UI States"],
    href: "/guides/accessible-color-palettes",
    gradient: "from-blue-600 to-emerald-600",
  },
  {
    title: "Complete Keyboard Accessibility Guide",
    description:
      "Master keyboard accessibility from fundamentals to advanced patterns. Learn focus management, skip navigation links, roving tabindex, and how to identify and fix keyboard traps with hands-on interactive demos.",
    icon: Keyboard,
    difficulty: "Intermediate",
    readingTime: "30 min",
    topics: ["Focus Management", "Skip Links", "Roving Tabindex", "Keyboard Traps"],
    href: "/guides/keyboard-accessibility",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    title: "Screen Reader Testing Guide",
    description:
      "A practical guide to testing your websites and applications with the most popular screen readers. Covers NVDA and JAWS on Windows, VoiceOver on macOS and iOS, and TalkBack on Android with step-by-step workflows.",
    icon: AudioLines,
    difficulty: "Intermediate",
    readingTime: "35 min",
    topics: ["NVDA", "JAWS", "VoiceOver", "TalkBack"],
    href: "/guides/screen-reader-testing",
    gradient: "from-violet-600 to-purple-600",
  },
]

const comingSoonGuides = [
  {
    title: "ARIA Patterns Guide",
    description:
      "Comprehensive reference for WAI-ARIA design patterns including combobox, dialog, menu, tabs, and tree view with accessible implementations.",
    icon: FileCode2,
  },
  {
    title: "Accessible Forms Guide",
    description:
      "Build forms that work for everyone. Labels, error handling, validation, grouping, and multi-step form patterns with full keyboard and screen reader support.",
    icon: FormInput,
  },
]

const difficultyColors: Record<string, string> = {
  Beginner:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  Intermediate:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Advanced:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide pt-12 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 dark:from-white dark:via-emerald-200 dark:to-emerald-400 bg-clip-text text-transparent leading-tight">
              Accessibility Guides
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              In-depth, interactive guides that go beyond theory. Each guide
              includes live demos, real code examples, and downloadable
              checklists so you can apply what you learn immediately.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                  <PlayCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Interactive Demos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Code Examples
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <Download className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Free Downloads
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Cards */}
      <section className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <Card
                key={guide.title}
                className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${guide.gradient}`}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-r ${guide.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={difficultyColors[guide.difficulty]}>
                        <Signal className="h-3 w-3 mr-1" />
                        {guide.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-200 dark:border-slate-700"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {guide.readingTime}
                      </Badge>
                    </div>
                  </div>

                  <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    {guide.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Topic pills */}
                  <div className="flex flex-wrap gap-2">
                    {guide.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full group/btn border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                  >
                    <Link href={guide.href}>
                      Read Guide
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="container-wide pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {comingSoonGuides.map((guide) => {
              const Icon = guide.icon
              return (
                <Card
                  key={guide.title}
                  className="relative overflow-hidden border-slate-200 dark:border-slate-700 opacity-60"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700" />

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl">
                        <Icon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400"
                      >
                        Coming Soon
                      </Badge>
                    </div>

                    <CardTitle className="text-xl text-slate-500 dark:text-slate-400">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400 dark:text-slate-500 leading-relaxed mt-2">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="container-wide pb-16 md:pb-20">
        <RelatedContent
          links={[
            {
              url: "/research",
              title: "Accessibility Research & Reports",
              description:
                "Original data-driven research on web accessibility trends.",
              type: "article",
            },
            {
              url: "/checklists",
              title: "WCAG Checklists",
              description:
                "Step-by-step checklists for WCAG 2.2 compliance.",
              type: "checklist",
            },
            {
              url: "/tools",
              title: "Accessibility Testing Tools",
              description:
                "Test your site with our free accessibility scanning tools.",
              type: "tool",
            },
          ]}
        />
      </section>
    </div>
  )
}
