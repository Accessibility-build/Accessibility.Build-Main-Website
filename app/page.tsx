'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileText,
  Lightbulb,
  Palette,
  Users,
  Sparkles,
  ArrowUpRight,
  Shield,
  Zap,
  Target,
  Globe,
  Star,
  TrendingUp,
  Award,
  Eye,
  Settings,
  BookOpen,
  Headphones,
  MousePointer,
  Brain,
  CheckSquare,
  Wrench,
  Flame,
  Search,
  BarChart3,
  ExternalLink,
  Layers,
  GitCompareArrows,
  Compass
} from "lucide-react"
import { InteractiveHero } from "@/components/interactive-hero"
import { useEffect, useRef } from "react"
import { RelatedContent } from "@/components/seo/related-content"
import { homepageMetricOrder } from "@/lib/public-metrics"

// Animation hook for intersection observer
function useIntersectionObserver() {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            entry.target.classList.remove('opacity-0', 'translate-y-8')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Add initial styles
    element.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out')

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return elementRef
}

// Metadata is defined in layout.tsx, so we don't need to redefine it here

export default function HomePage() {
  const featuresRef = useIntersectionObserver()
  const statsRef = useIntersectionObserver()
  const toolsRef = useIntersectionObserver()
  const questionsRef = useIntersectionObserver()
  const servicesRef = useIntersectionObserver()
  const wcag3Ref = useIntersectionObserver()
  const hellRef = useIntersectionObserver()
  const ctaRef = useIntersectionObserver()
  const homepageMetricCards = [
    { icon: Shield, metric: homepageMetricOrder[0] },
    { icon: CheckCircle2, metric: homepageMetricOrder[1] },
    { icon: Globe, metric: homepageMetricOrder[2] },
    { icon: BookOpen, metric: homepageMetricOrder[3] },
  ]

  return (
    <div>
      {/* Hero Section */}
      <InteractiveHero />

      {/* Statistics Section - New */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/30">
        <div ref={statsRef} className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {homepageMetricCards.map(({ icon: Icon, metric }) => (
              <div key={metric.id} className="text-center group">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{metric.value}</div>
                <div className="text-slate-600 dark:text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div ref={featuresRef} className="container-wide">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything You Need for{" "}
              <span className="text-blue-600 dark:text-blue-400">Web Accessibility</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Comprehensive tools, resources, and expert services to help you create inclusive digital experiences that work for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Professional Tools Card */}
            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-700"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                    Tool Suite
                  </Badge>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Professional Tools
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Advanced accessibility testing and analysis tools powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">AI Accessibility Audit Helper</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">AI-powered Alt Text Generator</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Color Contrast Checker with WCAG validation</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Heading Structure Analyzer</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button asChild variant="outline" className="w-full group/btn border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                    <Link href="/tools">
                      Explore All Tools
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Expert Guides Card */}
            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-slate-700"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                    Expert Content
                  </Badge>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                  Expert Guides & Resources
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  In-depth articles, tutorials, and best practices from accessibility experts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Complete WCAG 2.2 Implementation Guide</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Accessible Form Design Patterns</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Keyboard Navigation Best Practices</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Screen Reader Testing Guides</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button asChild variant="outline" className="w-full group/btn border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <Link href="/blog">
                      Read Expert Articles
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Professional Services Card */}
            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-slate-600"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-slate-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                    Enterprise
                  </Badge>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Professional Services
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Expert consulting, training, and remediation services for your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Comprehensive Accessibility Audits</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Team Training & Workshops</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Code Remediation Support</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Ongoing Compliance Monitoring</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button asChild variant="outline" className="w-full group/btn border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                    <Link href="/services">
                      View All Services
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The 4 Types of Accessibility Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div ref={toolsRef} className="container-wide">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
              <Eye className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              The 4 Types of{" "}
              <span className="text-slate-700 dark:text-slate-300">Accessibility</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Understanding the full spectrum of user needs helps create truly inclusive digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Visual Accessibility */}
            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 hover:shadow-xl bg-white dark:bg-slate-800">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardHeader className="text-center pb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white mb-3">Visual</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  For users with blindness, low vision, or color blindness
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Screen reader support</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>High contrast options</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Alternative text</span>
                </div>
              </CardContent>
            </Card>

            {/* Auditory Accessibility */}
            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-500 hover:shadow-xl bg-white dark:bg-slate-800">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-500 to-slate-600"></div>
              <CardHeader className="text-center pb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-slate-600 to-slate-700 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white mb-3">Auditory</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  For users who are deaf or hard of hearing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span>Video captions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span>Audio transcripts</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span>Visual alerts</span>
                </div>
              </CardContent>
            </Card>

            {/* Motor/Physical Accessibility */}
            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 hover:shadow-xl bg-white dark:bg-slate-800">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-slate-500"></div>
              <CardHeader className="text-center pb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-slate-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MousePointer className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white mb-3">Motor/Physical</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  For users with mobility or dexterity limitations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Keyboard navigation</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Large click targets</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Voice controls</span>
                </div>
              </CardContent>
            </Card>

            {/* Cognitive Accessibility */}
            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-500 hover:shadow-xl bg-white dark:bg-slate-800">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-500 to-slate-600"></div>
              <CardHeader className="text-center pb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-slate-600 to-slate-700 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white mb-3">Cognitive</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  For users with learning or attention disabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span>Clear language</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span>Consistent layouts</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span>Error prevention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA for Types */}
          <div className="text-center mt-16">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Learn more about implementing these accessibility types in your projects
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/faq">
                View Detailed FAQ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Questions Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div ref={questionsRef} className="container-wide">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Most Asked{" "}
              <span className="text-blue-600 dark:text-blue-400">Accessibility Questions</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Get instant answers to the most common accessibility questions from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* WCAG Principles */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                    WCAG
                  </Badge>
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  What are the 4 principles of accessibility?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  <strong className="text-blue-600 dark:text-blue-400">POUR:</strong> Perceivable, Operable, Understandable, and Robust - the foundational principles that guide all accessibility implementation.
                </p>
                <Button asChild variant="outline" size="sm" className="group/btn border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                  <Link href="/blog/understanding-wcag-2-2">
                    Learn WCAG 2.2
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* ADA vs WCAG */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                    Legal
                  </Badge>
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                  What's the difference between ADA and WCAG?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  <strong>ADA</strong> is U.S. federal law requiring accessibility, while <strong>WCAG</strong> provides the technical standards. WCAG 2.1 Level AA is the de facto standard for ADA compliance.
                </p>
                <Button asChild variant="outline" size="sm" className="group/btn border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Link href="/faq">
                    Understand Compliance
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Accessibility Tools */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                    Popular
                  </Badge>
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  What are accessibility tools?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Software and utilities that help developers create inclusive digital experiences by testing compliance, generating accessible code, and simulating assistive technologies.
                </p>
                <Button asChild variant="outline" size="sm" className="group/btn border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                  <Link href="/tools">
                    Explore Our Tools
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ CTA */}
          <div className="text-center mt-16">
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
              Have more questions about accessibility tools and best practices?
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white group">
              <Link href="/faq">
                View Complete FAQ
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WCAG 3.0 Preview Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-teal-50/60 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-teal-200/20 dark:bg-teal-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-200/20 dark:bg-blue-600/5 rounded-full blur-3xl"></div>

        <div ref={wcag3Ref} className="relative container-wide">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-700 mb-6 px-4 py-2 text-sm">
                Working Draft — 2026
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                The Future of Accessibility:{" "}
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                  WCAG 3.0
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
                The next generation of accessibility standards is being developed. With 12 guideline categories, outcomes-based
                testing, and scope beyond web content — get ahead of the curve.
              </p>
            </div>

            {/* Key Changes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-800/60 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md w-fit mb-4">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">12 Guideline Categories</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The 4 POUR principles evolve into 12 functional categories covering new areas like cognitive accessibility and algorithmic fairness.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800/60 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Outcomes-Based Testing</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Moving beyond binary pass/fail to graduated scoring that measures real user impact rather than checkbox compliance.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800/60 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-md w-fit mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Beyond Web Content</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Expanded scope covering native apps, authoring tools, user agents, IoT devices, and virtual/augmented reality.
                </p>
              </div>
            </div>

            {/* CTA Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg">
                <Link href="/wcag-3">
                  Explore the Full WCAG 3.0 Guide
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Link href="/wcag-3/comparison">
                  <GitCompareArrows className="mr-2 h-5 w-5" />
                  WCAG 3.0 vs 2.2 Comparison
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Resources Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="container-wide">
          <RelatedContent
            content="accessibility tools wcag compliance color contrast alt text mobile accessibility heading structure testing audit checklist"
            maxItems={6}
            showDescriptions={true}
          />
        </div>
      </section>

      {/* A11y Hell Experience Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-100 via-red-50/50 to-orange-50/30 dark:bg-slate-950 dark:from-slate-950 dark:via-red-950/20 dark:to-slate-950">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-200/30 dark:bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/30 dark:bg-orange-600/5 rounded-full blur-3xl"></div>

        <div ref={hellRef} className="relative container-wide">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <Badge className="bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30 mb-6 px-4 py-2 text-sm">
                <Flame className="h-4 w-4 mr-2" />
                Interactive Experience
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Experience Accessibility{" "}
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Hell</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Explore real accessibility barriers with hands-on failure demos so your team can feel the impact before users do.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
              {[
                { value: "Real-world", label: "Barrier Cases" },
                { value: "Hands-on", label: "Guided Demos" },
                { value: "Mapped", label: "Severity Levels" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Feature Mini-Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-500/30 transition-all duration-300 group shadow-sm hover:shadow-lg">
                <div className="p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl w-fit shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Issue Explorer</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Browse every accessibility failure with WCAG references and test protocols.</p>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all duration-300 group shadow-sm hover:shadow-lg">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl w-fit shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Practice Lab</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Scenario drills with personas and revealable official findings.</p>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-300 group shadow-sm hover:shadow-lg">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl w-fit shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Impact Center</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Review business and user impact signals across all severity levels.</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl shadow-red-600/20 dark:shadow-red-900/30 group">
                <a href="https://hell.accessibility.build" target="_blank" rel="noopener noreferrer">
                  <Flame className="mr-2 h-5 w-5" />
                  Enter A11y Hell
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-lg px-8 py-6 rounded-xl group">
                <Link href="/hell">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
        <div ref={ctaRef} className="container-wide">
          <div className="max-w-5xl mx-auto text-center">
            {/* Hero messaging */}
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-8">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Make Your Website{" "}
              <span className="text-blue-600 dark:text-blue-400">Accessible?</span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build inclusive digital experiences with a practical accessibility workflow your team can apply release after release.
            </p>

            {/* Value propositions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl mb-4 shadow-lg">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Free Tools Available</h3>
                <p className="text-slate-600 dark:text-slate-400">Start with our free accessibility tools - no signup required</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Expert Support</h3>
                <p className="text-slate-600 dark:text-slate-400">Get support with accessibility audits, remediation guidance, and delivery planning</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-xl mb-4 shadow-lg">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Proven Results</h3>
                <p className="text-slate-600 dark:text-slate-400">Use evidence-based checklists and implementation patterns aligned with WCAG requirements</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="group bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4">
                <Link href="/tools">
                  Try Our Tools Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-2">
                <Link href="/contact">Get Expert Help</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-3xl mx-auto">
              {homepageMetricCards.map(({ metric }) => (
                <div key={`${metric.id}-cta`}>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{metric.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
