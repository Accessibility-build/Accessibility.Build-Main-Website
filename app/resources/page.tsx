import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ExternalLink,
  BookOpen,
  Globe,
  Users,
  Wrench,
  Palette,
  TestTube,
  FileText,
  Heart,
  CheckCircle2,
  Star,
  Target,
  Shield,
  Sparkles
} from "lucide-react"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Comprehensive Accessibility Resources Hub | Tools, Guidelines & Learning Materials",
  description: "Complete collection of accessibility resources including WCAG guidelines, development tools, design resources, testing utilities, and learning materials. Everything you need for accessible web development.",
  keywords: [
    "accessibility resources",
    "WCAG guidelines", 
    "accessibility tools",
    "inclusive design",
    "a11y resources",
    "web accessibility",
    "accessibility testing",
    "accessibility training"
  ],
  image: "/og-image.png",
})

// Resource type definitions
interface Resource {
  name: string
  description: string
  url: string
  category: string
  type: "Free" | "Paid" | "Freemium" | "Open Source"
  lastVerified: string
  featured?: boolean
  popularity?: "High" | "Medium" | "Growing"
}

// Comprehensive resource database with verified links
const resources: Resource[] = [
  // Official Guidelines & Standards
  {
    name: "WCAG 2.2 Guidelines",
    description: "Official Web Content Accessibility Guidelines 2.2 from W3C. The definitive standard for web accessibility compliance with comprehensive success criteria and implementation guidance.",
    url: "https://www.w3.org/TR/WCAG22/",
    category: "Guidelines",
    type: "Free",
    lastVerified: "2024-12-20",
    featured: true,
    popularity: "High"
  },
  {
    name: "Understanding WCAG 2.2",
    description: "Detailed explanations and practical examples for each WCAG success criterion. Essential reading for understanding accessibility implementation with real-world context.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/",
    category: "Guidelines", 
    type: "Free",
    lastVerified: "2024-12-20",
    featured: true,
    popularity: "High"
  },
  {
    name: "WCAG 2.2 Quick Reference",
    description: "Interactive quick reference guide with all WCAG success criteria, techniques, and implementation examples. Perfect for developers and auditors.",
    url: "https://www.w3.org/WAI/WCAG22/quickref/",
    category: "Guidelines",
    type: "Free", 
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "WAI-ARIA Authoring Practices",
    description: "Comprehensive guide for implementing WAI-ARIA in web applications with patterns, examples, and best practices for dynamic content.",
    url: "https://www.w3.org/WAI/ARIA/apg/",
    category: "Guidelines",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "Section 508 Standards", 
    description: "US federal accessibility standards for digital content. Essential for government contractors and organizations serving federal agencies.",
    url: "https://www.section508.gov/",
    category: "Guidelines",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },

  // Development Tools
  {
    name: "axe DevTools",
    description: "Industry-leading accessibility testing browser extension. Automatically finds and reports accessibility issues with detailed remediation guidance.",
    url: "https://www.deque.com/axe/devtools/",
    category: "Tools",
    type: "Freemium",
    lastVerified: "2024-12-20",
    featured: true,
    popularity: "High"
  },
  {
    name: "WAVE Web Accessibility Evaluator",
    description: "Visual accessibility testing tool that provides detailed feedback about accessibility errors, alerts, and features directly on web pages.",
    url: "https://wave.webaim.org/",
    category: "Tools", 
    type: "Free",
    lastVerified: "2024-12-20",
    featured: true,
    popularity: "High"
  },
  {
    name: "Lighthouse Accessibility Audit",
    description: "Built-in Chrome DevTools accessibility auditing that provides actionable insights and performance metrics with automated scanning.",
    url: "https://developers.google.com/web/tools/lighthouse",
    category: "Tools",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "Pa11y Command Line Tool",
    description: "Automated accessibility testing tool for CI/CD pipelines. Test your websites for accessibility issues during development and deployment.",
    url: "https://pa11y.org/",
    category: "Tools",
    type: "Open Source",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },
  {
    name: "IBM Equal Access Checker",
    description: "Open-source accessibility testing tools integrated into browser dev tools for comprehensive accessibility analysis and reporting.",
    url: "https://www.ibm.com/able/toolkit/tools/",
    category: "Tools",
    type: "Open Source", 
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },
  {
    name: "Color Contrast Analyzer",
    description: "Desktop application for checking color contrast ratios to ensure WCAG compliance. Available for Windows and macOS with advanced features.",
    url: "https://www.tpgi.com/color-contrast-checker/",
    category: "Tools",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },

  // Learning Resources
  {
    name: "The A11Y Project",
    description: "Community-driven resource with guides, checklists, and tools for web accessibility. Perfect starting point for beginners with practical examples.",
    url: "https://www.a11yproject.com/",
    category: "Learning",
    type: "Free",
    lastVerified: "2024-12-20",
    featured: true,
    popularity: "High"
  },
  {
    name: "WebAIM Training Center",
    description: "Comprehensive accessibility training covering screen readers, WCAG compliance, testing techniques, and implementation best practices.",
    url: "https://webaim.org/",
    category: "Learning",
    type: "Free",
    lastVerified: "2024-12-20",
    featured: true,
    popularity: "High"
  },
  {
    name: "MDN Accessibility Guide",
    description: "Mozilla's comprehensive guide to web accessibility covering HTML semantics, CSS, JavaScript, and ARIA implementation with code examples.",
    url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility",
    category: "Learning",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "Deque University",
    description: "Professional accessibility training platform with comprehensive courses for developers, designers, testers, and content creators.",
    url: "https://dequeuniversity.com/",
    category: "Learning",
    type: "Paid",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "A11y Collective Courses",
    description: "Online accessibility courses focusing on practical skills for designers, developers, and content creators with hands-on projects.",
    url: "https://a11y-collective.com/",
    category: "Learning",
    type: "Paid",
    lastVerified: "2024-12-20",
    popularity: "Growing"
  },
  {
    name: "Web Accessibility by Google",
    description: "Free Udacity course covering web accessibility fundamentals, ARIA, focus management, and testing with real-world projects.",
    url: "https://www.udacity.com/course/web-accessibility--ud891",
    category: "Learning",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },

  // Design Resources
  {
    name: "Inclusive Design Principles",
    description: "Core principles for creating inclusive designs that work for everyone. Essential reading for designers and product teams with practical guidance.",
    url: "https://inclusivedesignprinciples.org/",
    category: "Design",
    type: "Free",
    lastVerified: "2024-12-20",
    featured: true,
    popularity: "High"
  },
  {
    name: "Stark Design Plugin",
    description: "Figma and Sketch plugin for checking color contrast, simulating color blindness, and ensuring accessible design workflows with real-time feedback.",
    url: "https://www.getstark.co/",
    category: "Design",
    type: "Freemium",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "Accessible Colors",
    description: "Tool for generating accessible color palettes that meet WCAG contrast requirements with beautiful design options and export capabilities.",
    url: "https://accessible-colors.com/",
    category: "Design",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },
  {
    name: "Color Safe",
    description: "Beautiful color palettes generator that ensures WCAG AA compliance for text and background color combinations with design inspiration.",
    url: "http://colorsafe.co/",
    category: "Design",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },
  {
    name: "Able Design System",
    description: "Open-source design system focused on accessibility with components, patterns, and guidelines for inclusive digital products.",
    url: "https://able.design/",
    category: "Design",
    type: "Open Source",
    lastVerified: "2024-12-20",
    popularity: "Growing"
  },

  // Community & Support
  {
    name: "WebAIM Discussion List",
    description: "Active email discussion list where accessibility professionals share knowledge, ask questions, and solve complex accessibility problems together.",
    url: "https://webaim.org/discussion/",
    category: "Community",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "A11y Slack Community",
    description: "Large active Slack workspace where accessibility professionals, developers, and advocates discuss best practices and share resources daily.",
    url: "https://web-a11y.slack.com/",
    category: "Community",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "Accessible For All GitHub",
    description: "Open-source community creating accessible web components, tools, and educational resources for developers with collaborative projects.",
    url: "https://github.com/AccessibleForAll",
    category: "Community",
    type: "Open Source",
    lastVerified: "2024-12-20",
    popularity: "Growing"
  },
  {
    name: "Reddit r/accessibility",
    description: "Active Reddit community discussing accessibility topics, sharing resources, and providing peer support for accessibility professionals.",
    url: "https://www.reddit.com/r/accessibility/",
    category: "Community",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },

  // Testing & Validation
  {
    name: "NVDA Screen Reader",
    description: "Free open-source screen reader for Windows. Essential tool for testing how your websites work with assistive technology and understanding user experience.",
    url: "https://www.nvaccess.org/",
    category: "Testing",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "HTML Validator",
    description: "W3C markup validation service that checks HTML code for errors that could affect accessibility and browser compatibility with detailed reports.",
    url: "https://validator.w3.org/",
    category: "Testing",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "ANDI Bookmarklet",
    description: "Accessible Name and Description Inspector - government-developed tool for testing accessibility features with comprehensive analysis.",
    url: "https://www.ssa.gov/accessibility/andi/help/install.html",
    category: "Testing",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },
  {
    name: "JAWS Screen Reader",
    description: "Popular commercial screen reader for comprehensive accessibility testing. Industry standard for professional accessibility auditing.",
    url: "https://www.freedomscientific.com/products/software/jaws/",
    category: "Testing",
    type: "Paid",
    lastVerified: "2024-12-20",
    popularity: "High"
  },

  // Browser Extensions
  {
    name: "axe DevTools Extension",
    description: "Browser extension version of axe accessibility testing tools. Quick accessibility scanning for any webpage with detailed issue reporting.",
    url: "https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd",
    category: "Browser Extensions",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "Lighthouse Extension",
    description: "Google's web quality auditing tool including accessibility checks, performance metrics, and SEO analysis with actionable recommendations.",
    url: "https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk",
    category: "Browser Extensions",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "High"
  },
  {
    name: "HeadingsMap Extension",
    description: "Visualize heading structure and document outline to ensure proper semantic hierarchy and navigation for screen reader users.",
    url: "https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi",
    category: "Browser Extensions",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  },
  {
    name: "Colour Contrast Analyser",
    description: "Browser extension for quick color contrast checking directly in the browser with WCAG compliance verification.",
    url: "https://chrome.google.com/webstore/detail/colour-contrast-analyser/dagdlcijhfbmgkjokkjicnnfimlebcll",
    category: "Browser Extensions",
    type: "Free",
    lastVerified: "2024-12-20",
    popularity: "Medium"
  }
]

// Category configuration
const categories = [
  { id: "all", name: "All Resources", icon: Globe, description: "Complete collection of accessibility resources", count: resources.length },
  { id: "guidelines", name: "Guidelines", icon: FileText, description: "Official WCAG guidelines and standards", count: resources.filter(r => r.category === "Guidelines").length },
  { id: "tools", name: "Development Tools", icon: Wrench, description: "Testing and development utilities", count: resources.filter(r => r.category === "Tools").length },
  { id: "learning", name: "Learning", icon: BookOpen, description: "Courses, tutorials, and educational content", count: resources.filter(r => r.category === "Learning").length },
  { id: "design", name: "Design", icon: Palette, description: "Tools and guides for accessible design", count: resources.filter(r => r.category === "Design").length },
  { id: "community", name: "Community", icon: Users, description: "Forums, groups, and peer support", count: resources.filter(r => r.category === "Community").length },
  { id: "testing", name: "Testing", icon: TestTube, description: "Screen readers and validation tools", count: resources.filter(r => r.category === "Testing").length },
  { id: "browser-extensions", name: "Extensions", icon: Target, description: "Browser add-ons and extensions", count: resources.filter(r => r.category === "Browser Extensions").length }
]

// Helper function to get type badge styling
const getTypeBadge = (type: string) => {
  const styles = {
    "Free": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    "Paid": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800", 
    "Freemium": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    "Open Source": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
  }
  return styles[type as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-200"
}

// Helper function to get popularity badge
const getPopularityBadge = (popularity?: string) => {
  if (!popularity) return null
  const styles = {
    "High": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    "Medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    "Growing": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
  }
  return (
    <Badge className={`text-xs ${styles[popularity as keyof typeof styles]}`}>
      <Sparkles className="h-3 w-3 mr-1" />
      {popularity}
    </Badge>
  )
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container-wide py-12 md:py-16">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-xl"></div>
              <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-full shadow-lg">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
            Accessibility Resources Hub
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover the most comprehensive collection of verified accessibility resources. From WCAG guidelines to cutting-edge testing tools, 
            everything you need to create inclusive digital experiences that work for everyone.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="relative">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="font-medium">{resources.length} Verified Resources</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-medium">Community Curated</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Regularly Updated</span>
            </div>
          </div>
        </div>

        {/* Featured Resources Highlight */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Star className="h-7 w-7 text-yellow-500" />
              Featured Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked essential resources that every accessibility professional should know about
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {resources.filter(resource => resource.featured).map((resource, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 hover:-translate-y-1 bg-gradient-to-br from-background to-muted/30">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={`text-xs ${getTypeBadge(resource.type)}`}>
                        {resource.type}
                      </Badge>
                      {getPopularityBadge(resource.popularity)}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                    {resource.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-4 mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {resource.category}
                    </Badge>
                    <Button asChild size="sm" className="group/btn">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Visit <ExternalLink className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Navigation */}
        <Tabs defaultValue="all" className="space-y-8">
          <div className="flex justify-center w-full">
            <TabsList className="bg-muted/50 p-1.5 rounded-xl shadow-sm grid grid-cols-2 gap-2 w-full h-auto xs:grid-cols-2 sm:inline-flex sm:w-auto sm:gap-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="rounded-lg px-4 py-3 min-h-[50px] data-[state=active]:bg-background data-[state=active]:shadow-md text-sm font-medium transition-all hover:bg-background/50 w-full sm:w-auto"
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* All Resources */}
          <TabsContent value="all" className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Complete Resource Collection</h3>
              <p className="text-muted-foreground">Browse all {resources.length} verified accessibility resources across every category</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                      <div className="flex flex-col gap-1">
                        <Badge className={`text-xs ${getTypeBadge(resource.type)}`}>
                          {resource.type}
                        </Badge>
                        {getPopularityBadge(resource.popularity)}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                      {resource.name}
                      {resource.featured && (
                        <Star className="inline h-4 w-4 text-yellow-500 ml-2" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    <Button asChild className="w-full group/btn" size="sm">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Visit Resource <ExternalLink className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Category-specific Content */}
          {categories.slice(1).map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <category.icon className="h-6 w-6 text-primary" />
                  {category.name}
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources
                  .filter(resource => 
                    resource.category.toLowerCase() === category.id.replace('-', ' ') ||
                    (category.id === 'browser-extensions' && resource.category === 'Browser Extensions')
                  )
                  .map((resource, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-background to-muted/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <category.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className={`text-xs ${getTypeBadge(resource.type)}`}>
                              {resource.type}
                            </Badge>
                            {getPopularityBadge(resource.popularity)}
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                          {resource.name}
                          {resource.featured && (
                            <Star className="inline h-4 w-4 text-yellow-500 ml-2" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-4 mb-4 leading-relaxed">
                          {resource.description}
                        </p>
                        <Button asChild className="w-full group/btn" size="sm">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Visit Resource <ExternalLink className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Missing a Resource?</h3>
              <p className="text-muted-foreground mb-6">
                Know of an amazing accessibility resource that should be included? We're always looking to expand our collection with community recommendations.
              </p>
              <Button asChild size="lg">
                <Link href="/contact">
                  Suggest a Resource <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
