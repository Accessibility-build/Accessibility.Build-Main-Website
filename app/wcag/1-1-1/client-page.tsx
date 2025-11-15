"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Info,
  Code,
  TestTube,
  FileImage,
  Play,
  Pause,
  Volume2,
  Download,
  Users,
  BookOpen,
  ListChecks,
  Lightbulb,
  Target,
  Heart,
  Brain,
  Accessibility,
  Monitor,
  Smartphone,
  Headphones
} from "lucide-react"

interface ExampleItem {
  src: string
  badAlt: string
  goodAlt: string
  explanation: string
  isDecorative?: boolean
  isButton?: boolean
  longDescription?: string
}

interface ExampleCategory {
  category: string
  items: ExampleItem[]
}

interface UserGroup {
  name: string
  description: string
  impact: string
  assistiveTech: string[]
  icon: React.ComponentType<{ className?: string }>
}

export default function WCAG111ClientPage() {
  const [showAltText, setShowAltText] = useState(false)
  const [customAltText, setCustomAltText] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Define affected user groups
  const affectedUserGroups: UserGroup[] = [
    {
      name: "Blind Users",
      description: "Users who cannot see images at all",
      impact: "Cannot perceive visual information without text alternatives",
      assistiveTech: ["Screen readers", "Refreshable braille displays"],
      icon: Eye
    },
    {
      name: "Low Vision Users",
      description: "Users with significant visual impairments",
      impact: "May have difficulty distinguishing details in images",
      assistiveTech: ["Screen magnifiers", "High contrast displays", "Screen readers"],
      icon: Eye
    },
    {
      name: "Users with Learning Disabilities",
      description: "Users who may have difficulty processing visual information",
      impact: "Text alternatives can provide clearer understanding",
      assistiveTech: ["Text-to-speech software", "Reading comprehension tools"],
      icon: Brain
    },
    {
      name: "Users with Slow Internet",
      description: "Users on slow connections who disable images",
      impact: "Cannot see images that fail to load",
      assistiveTech: ["Text-only browsers", "Data saving modes"],
      icon: Monitor
    },
    {
      name: "Search Engine Crawlers",
      description: "Automated systems that index web content",
      impact: "Cannot understand image content without alt text",
      assistiveTech: ["Web crawlers", "SEO analysis tools"],
      icon: Target
    }
  ]

  // Implementation procedure steps
  const procedureSteps = [
    {
      step: 1,
      title: "Identify Non-Text Content",
      description: "Audit your website to find all images, charts, diagrams, icons, and other non-text content",
      details: [
        "Use automated tools to scan for <img> tags",
        "Check for CSS background images that convey meaning",
        "Identify SVG graphics and icons",
        "Look for embedded media like charts and diagrams",
        "Review decorative elements that don't add meaning"
      ]
    },
    {
      step: 2,
      title: "Categorize Content Type",
      description: "Determine the purpose and function of each non-text element",
      details: [
        "Informative: Conveys important information",
        "Decorative: Purely aesthetic with no meaning",
        "Functional: Performs an action (buttons, links)",
        "Complex: Requires detailed description (charts, diagrams)",
        "Text images: Images that contain text"
      ]
    },
    {
      step: 3,
      title: "Write Appropriate Alt Text",
      description: "Create text alternatives based on content purpose and context",
      details: [
        "Keep alt text concise (usually under 125 characters)",
        "Focus on conveying the same information as the image",
        "Don't start with 'Image of' or 'Picture of'",
        "Use empty alt='' for decorative images",
        "Include relevant context from surrounding content"
      ]
    },
    {
      step: 4,
      title: "Handle Complex Content",
      description: "Provide detailed descriptions for complex images like charts and diagrams",
      details: [
        "Use longdesc attribute or nearby text",
        "Create data tables for chart information",
        "Provide step-by-step descriptions for processes",
        "Use structured markup for complex relationships",
        "Consider multiple formats (text, audio, tactile)"
      ]
    },
    {
      step: 5,
      title: "Test and Validate",
      description: "Verify that your alt text provides equivalent information",
      details: [
        "Use screen reader software to test",
        "Check with automated accessibility tools",
        "Get feedback from users with disabilities",
        "Validate HTML markup for proper implementation",
        "Test with images disabled in browser"
      ]
    },
    {
      step: 6,
      title: "Maintain and Update",
      description: "Keep alt text current and relevant as content changes",
      details: [
        "Update alt text when images are replaced",
        "Review alt text during content audits",
        "Train content creators on alt text best practices",
        "Implement content management workflows",
        "Monitor for missing or poor alt text"
      ]
    }
  ]

  const examples: ExampleCategory[] = [
    {
      category: "Informative Images",
      items: [
        {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
          badAlt: "chart",
          goodAlt: "Bar chart showing quarterly sales growth: Q1 $2.3M, Q2 $2.8M, Q3 $3.1M, Q4 $3.6M, demonstrating 57% year-over-year growth",
          explanation: "Describes the data and trends shown in the chart"
        },
        {
          src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
          badAlt: "office",
          goodAlt: "Modern open office space with collaborative workstations, natural lighting, and team members working on laptops",
          explanation: "Describes the environment and activity taking place"
        },
        {
          src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
          badAlt: "coding",
          goodAlt: "Developer writing JavaScript code on dual monitors showing a React application with component hierarchy",
          explanation: "Specifies the technology and context of the work"
        }
      ]
    },
    {
      category: "Decorative Images",
      items: [
        {
          src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
          badAlt: "abstract background",
          goodAlt: "",
          explanation: "Decorative pattern - empty alt attribute allows screen readers to skip",
          isDecorative: true
        },
        {
          src: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=300&fit=crop",
          badAlt: "geometric shapes",
          goodAlt: "",
          explanation: "Background design element - no informational value",
          isDecorative: true
        }
      ]
    },
    {
      category: "Functional Images",
      items: [
        {
          src: "https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=100&h=100&fit=crop",
          badAlt: "download icon",
          goodAlt: "Download PDF report",
          explanation: "Describes the action that will be performed",
          isButton: true
        },
        {
          src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop",
          badAlt: "search",
          goodAlt: "Search products",
          explanation: "Describes the function, not the appearance",
          isButton: true
        }
      ]
    },
    {
      category: "Complex Images",
      items: [
        {
          src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
          badAlt: "chart",
          goodAlt: "Line graph showing website traffic trends over 12 months",
          longDescription: "Detailed data: January 45K visitors, February 52K (+15%), March 48K (-8%), April 61K (+27%), May 58K (-5%), June 67K (+16%), July 72K (+7%), August 69K (-4%), September 78K (+13%), October 82K (+5%), November 88K (+7%), December 94K (+7%). Overall growth of 109% from start to end of year.",
          explanation: "Complex data requires both alt text and detailed description"
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Navigation */}
        <Button asChild variant="ghost" className="mb-8 hover:bg-blue-100 dark:hover:bg-blue-900/20">
          <Link href="/wcag">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to WCAG Success Criteria
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <FileImage className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                1.1.1 Non-text Content
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Level A
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-800 dark:border-blue-700 dark:text-blue-300">
                  Principle 1: Perceivable
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Success Criterion Statement */}
        <Card className="mb-12 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Info className="h-6 w-6 text-blue-600" />
              Success Criterion Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                All non-text content that is presented to the user has a text alternative that serves the equivalent purpose, 
                except for situations where the non-text content is purely decorative, is used only for visual formatting, 
                or is not presented to users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What This Means */}
        <Card className="mb-12 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
              What This Means
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Every image, chart, diagram, icon, and other non-text content on your website must have appropriate text alternatives 
              that convey the same information or function to users who cannot perceive the visual content.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Must Have Alt Text
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Informative images (photos, illustrations)</li>
                  <li>• Functional images (buttons, links)</li>
                  <li>• Complex images (charts, diagrams)</li>
                  <li>• Images of text</li>
                  <li>• Form input images</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Can Have Empty Alt Text
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Purely decorative images</li>
                  <li>• Background patterns</li>
                  <li>• Spacer images</li>
                  <li>• Images used only for visual formatting</li>
                  <li>• Adjacent text already describes the image</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why It's Important */}
        <Card className="mb-12 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Heart className="h-6 w-6 text-purple-600" />
              Why It's Important
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Accessibility className="h-6 w-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300">
                    Accessibility
                  </h3>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Ensures equal access to information for users with visual impairments, 
                  making your content inclusive and accessible to everyone.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                    SEO Benefits
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Search engines use alt text to understand image content, 
                  improving your website's search rankings and discoverability.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Monitor className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-800 dark:text-green-300">
                    Technical Reliability
                  </h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Provides fallback content when images fail to load due to 
                  slow connections, network issues, or disabled images.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who Is Affected */}
        <Card className="mb-12 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Users className="h-6 w-6 text-indigo-600" />
              Who Is Affected?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
              When non-text content lacks proper text alternatives, it creates barriers for various user groups:
            </p>
            
            <div className="space-y-6">
              {affectedUserGroups.map((group, index) => (
                <Card key={index} className="border-l-4 border-indigo-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                        <group.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                          {group.name}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 mb-3">
                          {group.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                              Impact Without Alt Text:
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {group.impact}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                              Common Assistive Technologies:
                            </h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400">
                              {group.assistiveTech.map((tech, techIndex) => (
                                <li key={techIndex}>• {tech}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Procedure */}
        <Card className="mb-12 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ListChecks className="h-6 w-6 text-orange-600" />
              Implementation Procedure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
              Follow these steps to ensure all non-text content has appropriate text alternatives:
            </p>
            
            <div className="space-y-6">
              {procedureSteps.map((step, index) => (
                <Card key={index} className="border-l-4 border-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2 text-lg">
                          {step.title}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                          {step.description}
                        </p>
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                          <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">
                            Implementation Details:
                          </h4>
                          <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex}>• {detail}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Examples */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              Interactive Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => setShowAltText(!showAltText)}
                variant={showAltText ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {showAltText ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {showAltText ? "Hide Alt Text" : "Show Alt Text"}
              </Button>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Toggle to see how alt text appears for screen reader users
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Examples by Category */}
        <div className="space-y-12">
          {examples.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 dark:text-white">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Image
                            src={item.src}
                            alt={showAltText ? item.goodAlt : item.badAlt}
                            width={400}
                            height={300}
                            className="rounded-lg border border-slate-200 dark:border-slate-700"
                          />
                          {showAltText && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Screen Reader Announces: "{item.goodAlt}"
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                              <div className="flex items-center gap-2 mb-2">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="font-medium text-red-800 dark:text-red-300">Bad Alt Text</span>
                              </div>
                              <code className="text-sm text-red-700 dark:text-red-300">
                                alt="{item.badAlt}"
                              </code>
                            </div>
                            
                            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-800 dark:text-green-300">Good Alt Text</span>
                              </div>
                              <code className="text-sm text-green-700 dark:text-green-300">
                                alt="{item.goodAlt}"
                              </code>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                              Why This Works:
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {item.explanation}
                            </p>
                          </div>
                          
                          {item.longDescription && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                                Long Description:
                              </h4>
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                {item.longDescription}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 