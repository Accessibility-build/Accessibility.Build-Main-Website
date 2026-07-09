import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { wcagCriteria, type SuccessCriterion } from "@/lib/wcag-data"
import { wcagPath } from "@/lib/wcag-pages"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle,
  Volume2,
  FileText,
  Eye,
  Keyboard,
  Timer,
  Target,
  Settings,
  BookOpen,
  ExternalLink,
  MousePointerClick,
  Type,
  Zap,
  Image as ImageIcon,
  HelpCircle,
} from "lucide-react"

export const metadata = createMetadata({
  title: "WCAG 2.2 Success Criteria: All 86 Guides & Examples",
  path: "/wcag",
  description:
    "In-depth guides to all 86 WCAG 2.2 success criteria — Level A, AA, and AAA — with plain-language explanations, testing methods, and implementation code.",
  keywords: ["WCAG", "success criteria", "accessibility guidelines", "Level A", "Level AA", "Level AAA", "WCAG 2.2"],
  image: "/api/og?title=WCAG%202.2%20Success%20Criteria&section=WCAG",
})

// One icon per guideline keeps the grid scannable without per-criterion bookkeeping.
const guidelineIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "1.1": ImageIcon,
  "1.2": Volume2,
  "1.3": Target,
  "1.4": Eye,
  "2.1": Keyboard,
  "2.2": Timer,
  "2.3": Zap,
  "2.4": MousePointerClick,
  "2.5": MousePointerClick,
  "3.1": Type,
  "3.2": HelpCircle,
  "3.3": FileText,
  "4.1": Settings,
}

function iconFor(criterion: SuccessCriterion) {
  const guidelineNumber = criterion.guideline.split(" ")[0]
  return guidelineIcons[guidelineNumber] ?? BookOpen
}

const levelStyles: Record<SuccessCriterion["level"], { badge: string; border: string; iconBg: string; iconColor: string }> = {
  A: {
    badge: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700",
    border: "border-l-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  AA: {
    badge: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700",
    border: "border-l-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  AAA: {
    badge: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700",
    border: "border-l-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
}

const principles = [
  "1. Perceivable",
  "2. Operable",
  "3. Understandable",
  "4. Robust",
]

function CriterionCard({ criterion }: { criterion: SuccessCriterion }) {
  const IconComponent = iconFor(criterion)
  const styles = levelStyles[criterion.level]
  const isNew22 = criterion.introduced === "2.2"

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-l-4 ${styles.border}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:!flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 w-full">
            <div className={`p-3 rounded-xl flex-shrink-0 ${styles.iconBg}`}>
              <IconComponent className={`h-6 w-6 ${styles.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mr-2">
                  {criterion.number} {criterion.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className={styles.badge}>Level {criterion.level}</Badge>
                  {isNew22 && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700"
                    >
                      New in 2.2
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-3">{criterion.description}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                <span>{criterion.principle}</span>
                <span className="hidden sm:inline">•</span>
                <span>{criterion.guideline}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button asChild className="w-full md:w-auto">
              <Link href={wcagPath(criterion.number)}>
                View Guide
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function WCAGIndexPage() {
  const levelACount = wcagCriteria.filter((sc) => sc.level === "A").length
  const levelAACount = wcagCriteria.filter((sc) => sc.level === "AA").length
  const levelAAACount = wcagCriteria.filter((sc) => sc.level === "AAA").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="container-wide py-12">
        {/* Back Navigation */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/checklists/wcag-2-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to WCAG Checklist
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                WCAG 2.2 Success Criteria
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                In-depth guides to all 86 success criteria with examples and implementation code
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Total Guides</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">{wcagCriteria.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Level A</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">{levelACount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Level AA</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">{levelAACount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Level AAA</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-1">{levelAAACount}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              About These Guides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Each success criterion guide provides comprehensive coverage including detailed explanations,
              interactive examples, testing methods, implementation code, and additional resources. The
              library covers every Level A, AA, and AAA criterion across all four WCAG principles,
              including the requirements introduced in WCAG 2.2.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">Interactive Examples</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">See good and bad implementations</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Testing Methods</p>
                  <p className="text-sm text-green-600 dark:text-green-300">Manual and automated testing approaches</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-200">Implementation Code</p>
                  <p className="text-sm text-purple-600 dark:text-purple-300">HTML, CSS, React examples</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success criteria grouped by principle, in spec order */}
        {principles.map((principle) => (
          <div key={principle} className="space-y-6 mt-12 first:mt-0">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{principle}</h2>
            <div className="grid gap-4">
              {wcagCriteria
                .filter((sc) => sc.principle === principle)
                .map((criterion) => (
                  <CriterionCard key={criterion.number} criterion={criterion} />
                ))}
            </div>
          </div>
        ))}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Put the Guidelines into Practice
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Work through every criterion with the interactive checklist, or test your site right now
              with our free accessibility tools.
            </p>
            <div className="flex flex-col sm:!flex-row gap-4 justify-center items-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/checklists/wcag-2-2">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  View Full Checklist
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/tools">
                  <Target className="mr-2 h-4 w-4" />
                  Accessibility Tools
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
