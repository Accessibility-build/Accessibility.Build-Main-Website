import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle,
  Image as ImageIcon,
  Volume2,
  FileText,
  Eye,
  Keyboard,
  Timer,
  Target,
  Settings,
  BookOpen,
  ExternalLink,
  Link2,
  MousePointerClick,
  Type,
  Zap,
  Pause,
  AlertCircle
} from "lucide-react"

export const metadata = createMetadata({
  title: "WCAG Success Criteria - Detailed Guides with Interactive Examples",
  description:
    "Comprehensive guides to WCAG success criteria with detailed explanations, interactive examples, testing methods, and implementation code. Level A and AA criteria covered.",
  keywords: ["WCAG", "success criteria", "accessibility guidelines", "Level A", "Level AA", "interactive examples"]
})

interface SuccessCriterion {
  number: string
  title: string
  level: 'A' | 'AA'
  description: string
  principle: string
  guideline: string
  icon: React.ComponentType<{ className?: string }>
  available: boolean
  comingSoon?: boolean
  new22?: boolean
}

const successCriteria: SuccessCriterion[] = [
  // Level A Criteria
  {
    number: "1.1.1",
    title: "Non-text Content",
    level: "A",
    description: "All non-text content has appropriate text alternatives that serve the equivalent purpose.",
    principle: "1. Perceivable",
    guideline: "1.1 Text Alternatives",
    icon: ImageIcon,
    available: true
  },
  {
    number: "1.2.1",
    title: "Audio-only and Video-only (Prerecorded)",
    level: "A",
    description: "Provide alternatives for prerecorded audio-only and video-only content.",
    principle: "1. Perceivable",
    guideline: "1.2 Time-based Media",
    icon: Volume2,
    available: true
  },
  {
    number: "1.2.2",
    title: "Captions (Prerecorded)",
    level: "A",
    description: "Captions are provided for all prerecorded audio content in synchronized media.",
    principle: "1. Perceivable",
    guideline: "1.2 Time-based Media",
    icon: FileText,
    available: true
  },
  {
    number: "1.2.3",
    title: "Audio Description or Media Alternative (Prerecorded)",
    level: "A",
    description: "Audio description or full text alternative is provided for prerecorded video content.",
    principle: "1. Perceivable",
    guideline: "1.2 Time-based Media",
    icon: Volume2,
    available: true
  },
  {
    number: "1.3.1",
    title: "Info and Relationships",
    level: "A",
    description: "Information, structure, and relationships can be programmatically determined.",
    principle: "1. Perceivable",
    guideline: "1.3 Adaptable",
    icon: Target,
    available: true
  },
  {
    number: "1.3.2",
    title: "Meaningful Sequence",
    level: "A",
    description: "Content can be presented in a meaningful sequence without losing meaning.",
    principle: "1. Perceivable",
    guideline: "1.3 Adaptable",
    icon: Target,
    available: true
  },
  {
    number: "1.3.3",
    title: "Sensory Characteristics",
    level: "A",
    description: "Instructions don't rely solely on sensory characteristics of components.",
    principle: "1. Perceivable",
    guideline: "1.3 Adaptable",
    icon: Eye,
    available: true
  },
  {
    number: "1.4.1",
    title: "Use of Color",
    level: "A",
    description: "Color is not used as the only visual means of conveying information.",
    principle: "1. Perceivable",
    guideline: "1.4 Distinguishable",
    icon: Eye,
    available: true
  },
  {
    number: "1.4.2",
    title: "Audio Control",
    level: "A",
    description: "Provide a way to pause, stop, or control the volume of audio that plays automatically.",
    principle: "1. Perceivable",
    guideline: "1.4 Distinguishable",
    icon: Pause,
    available: true
  },
  {
    number: "2.1.1",
    title: "Keyboard",
    level: "A",
    description: "All functionality is operable through a keyboard interface without specific timings.",
    principle: "2. Operable",
    guideline: "2.1 Keyboard Accessible",
    icon: Keyboard,
    available: true
  },
  {
    number: "2.1.2",
    title: "No Keyboard Trap",
    level: "A",
    description: "Keyboard focus can be moved away from any component using only the keyboard.",
    principle: "2. Operable",
    guideline: "2.1 Keyboard Accessible",
    icon: Keyboard,
    available: true
  },
  {
    number: "2.1.4",
    title: "Character Key Shortcuts",
    level: "A",
    description: "Single-character key shortcuts can be turned off, remapped, or are active only on focus.",
    principle: "2. Operable",
    guideline: "2.1 Keyboard Accessible",
    icon: Keyboard,
    available: true
  },
  {
    number: "2.2.1",
    title: "Timing Adjustable",
    level: "A",
    description: "Users can turn off, adjust, or extend time limits set by the content.",
    principle: "2. Operable",
    guideline: "2.2 Enough Time",
    icon: Timer,
    available: true
  },
  {
    number: "2.2.2",
    title: "Pause, Stop, Hide",
    level: "A",
    description: "Moving, blinking, scrolling, or auto-updating content can be paused, stopped, or hidden.",
    principle: "2. Operable",
    guideline: "2.2 Enough Time",
    icon: Pause,
    available: true
  },
  {
    number: "2.3.1",
    title: "Three Flashes or Below Threshold",
    level: "A",
    description: "Content does not flash more than three times per second, protecting against seizures.",
    principle: "2. Operable",
    guideline: "2.3 Seizures and Physical Reactions",
    icon: Zap,
    available: true
  },
  {
    number: "2.4.1",
    title: "Bypass Blocks",
    level: "A",
    description: "A mechanism is available to bypass blocks of repeated content, such as a skip link.",
    principle: "2. Operable",
    guideline: "2.4 Navigable",
    icon: Keyboard,
    available: true
  },
  {
    number: "2.4.2",
    title: "Page Titled",
    level: "A",
    description: "Web pages have titles that describe their topic or purpose.",
    principle: "2. Operable",
    guideline: "2.4 Navigable",
    icon: Type,
    available: true
  },
  {
    number: "2.4.3",
    title: "Focus Order",
    level: "A",
    description: "Components receive focus in an order that preserves meaning and operability.",
    principle: "2. Operable",
    guideline: "2.4 Navigable",
    icon: Target,
    available: true
  },
  {
    number: "2.4.4",
    title: "Link Purpose (In Context)",
    level: "A",
    description: "The purpose of each link can be determined from its text or its surrounding context.",
    principle: "2. Operable",
    guideline: "2.4 Navigable",
    icon: Link2,
    available: true
  },

  // Level AA Criteria
  {
    number: "1.4.3",
    title: "Contrast (Minimum)",
    level: "AA",
    description: "Text has a contrast ratio of at least 4.5:1 (3:1 for large text).",
    principle: "1. Perceivable",
    guideline: "1.4 Distinguishable",
    icon: Eye,
    available: true
  },
  {
    number: "2.5.8",
    title: "Target Size (Minimum)",
    level: "AA",
    description: "Targets for pointer input are at least 24×24 CSS pixels, unless an exception applies.",
    principle: "2. Operable",
    guideline: "2.5 Input Modalities",
    icon: MousePointerClick,
    available: true,
    new22: true
  },
  {
    number: "4.1.2",
    title: "Name, Role, Value",
    level: "A",
    description: "Name and role of every UI component can be programmatically determined; states, properties, and values can be set and changes announced to assistive technologies.",
    principle: "4. Robust",
    guideline: "4.1 Compatible",
    icon: Settings,
    available: true
  },
  {
    number: "3.3.2",
    title: "Labels or Instructions",
    level: "A",
    description: "Labels or instructions are provided when content requires user input, so people know what to enter and how.",
    principle: "3. Understandable",
    guideline: "3.3 Input Assistance",
    icon: FileText,
    available: true
  },
  {
    number: "3.3.1",
    title: "Error Identification",
    level: "A",
    description: "When an input error is automatically detected, the field in error is identified and the error is described to the user in text.",
    principle: "3. Understandable",
    guideline: "3.3 Input Assistance",
    icon: AlertCircle,
    available: true
  },
  {
    number: "2.4.7",
    title: "Focus Visible",
    level: "AA",
    description: "Any keyboard-operable interface has a mode where the keyboard focus indicator is visible, so users can always see which element has focus.",
    principle: "2. Operable",
    guideline: "2.4 Navigable",
    icon: MousePointerClick,
    available: true
  },
  {
    number: "1.4.11",
    title: "Non-text Contrast",
    level: "AA",
    description: "User interface components and meaningful graphics have a contrast ratio of at least 3:1 against adjacent colors, so borders, states, focus indicators, icons, and charts stay perceivable.",
    principle: "1. Perceivable",
    guideline: "1.4 Distinguishable",
    icon: Eye,
    available: true
  }
]

export default function WCAGIndexPage() {
  const levelACount = successCriteria.filter(sc => sc.level === 'A').length
  const levelAACount = successCriteria.filter(sc => sc.level === 'AA').length
  const availableCount = successCriteria.filter(sc => sc.available).length

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
                WCAG Success Criteria
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Detailed guides with interactive examples and implementation code
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
                <p className="text-2xl font-bold text-blue-600 mt-1">{successCriteria.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Available Now</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">{availableCount}</p>
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
              interactive examples, testing methods, implementation code, and additional resources.
              Our library spans Level A and Level AA criteria across all four WCAG principles, including
              new WCAG 2.2 requirements such as 2.5.8 Target Size (Minimum).
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

        {/* Success Criteria List */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Level A Success Criteria</h2>
          
          <div className="grid gap-4">
            {successCriteria.filter(sc => sc.level === 'A').map((criterion) => {
              const IconComponent = criterion.icon
              
              return (
                <Card key={criterion.number} className={`transition-all duration-200 ${
                  criterion.available 
                    ? 'hover:shadow-lg hover:scale-[1.01] border-l-4 border-l-green-500' 
                    : 'opacity-75 border-l-4 border-l-slate-300'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:!flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 w-full">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${
                          criterion.available ? 'bg-green-100 dark:bg-green-900/20' : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${
                            criterion.available ? 'text-green-600 dark:text-green-400' : 'text-slate-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mr-2">
                              {criterion.number} {criterion.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                                Level {criterion.level}
                              </Badge>
                              {criterion.available && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                                  Available
                                </Badge>
                              )}
                              {criterion.comingSoon && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700">
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mb-3">
                            {criterion.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>{criterion.principle}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{criterion.guideline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        {criterion.available ? (
                          <Button asChild className="w-full md:w-auto">
                            <Link href={`/wcag/${criterion.number.replace(/\./g, '-')}`}>
                              View Guide
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button disabled className="w-full md:w-auto">
                            Coming Soon
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="space-y-6 mt-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Level AA Success Criteria</h2>
          
          <div className="grid gap-4">
            {successCriteria.filter(sc => sc.level === 'AA').map((criterion) => {
              const IconComponent = criterion.icon
              
              return (
                <Card key={criterion.number} className={`transition-all duration-200 ${
                  criterion.available 
                    ? 'hover:shadow-lg hover:scale-[1.01] border-l-4 border-l-blue-500' 
                    : 'opacity-75 border-l-4 border-l-slate-300'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:!flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 w-full">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${
                          criterion.available ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${
                            criterion.available ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mr-2">
                              {criterion.number} {criterion.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                                Level {criterion.level}
                              </Badge>
                              {criterion.new22 && (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700">
                                  New in 2.2
                                </Badge>
                              )}
                              {criterion.available && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                                  Available
                                </Badge>
                              )}
                              {criterion.comingSoon && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700">
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mb-3">
                            {criterion.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>{criterion.principle}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{criterion.guideline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        {criterion.available ? (
                          <Button asChild className="w-full md:w-auto">
                            <Link href={`/wcag/${criterion.number.replace(/\./g, '-')}`}>
                              View Guide
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button disabled className="w-full md:w-auto">
                            Coming Soon
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              More Guides Coming Soon
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              We're continuously adding more detailed guides for each WCAG success criterion. 
              Each guide includes comprehensive examples, testing methods, and implementation code 
              to help you build accessible web applications.
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