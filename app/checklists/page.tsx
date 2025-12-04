import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Star, 
  Clock,
  ArrowRight,
  Download,
  Eye,
  CheckSquare,
  Target,
  Sparkles,
  Award,
  Zap
} from "lucide-react"

export const metadata = createMetadata({
  title: "WCAG Checklist - Professional Accessibility Checklists | WCAG 2.2 & More",
  description:
    "Access comprehensive, interactive WCAG checklist covering WCAG 2.2 and other standards. Professional tools for developers, designers, and QA teams to ensure digital inclusion. Export to Excel and PDF.",
  keywords: [
    "wcag checklist",
    "WCAG checklist",
    "accessibility checklist",
    "compliance audit",
    "digital accessibility",
    "inclusive design",
    "WCAG 2.2 checklist",
    "WCAG checklist excel"
  ]
})

export default function ChecklistsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-slate-600/5 to-blue-600/10"></div>
        <div className="relative container-wide py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur-xl opacity-25 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-full">
                    <CheckSquare className="w-14 h-14 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 bg-clip-text text-transparent mb-8">
                Accessibility Checklists
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Professional, interactive checklists to ensure your digital products meet the highest accessibility standards. 
                Designed for developers, designers, and QA teams building inclusive experiences.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="flex items-center px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Interactive & Real-time</span>
                </div>
                <div className="flex items-center px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
                  <Download className="w-5 h-5 text-slate-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Export to Excel & PDF</span>
                </div>
                <div className="flex items-center px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
                  <Award className="w-5 h-5 text-slate-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Industry Standard</span>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                <div className="group">
                  <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">78</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">WCAG 2.2 Criteria</div>
                    <div className="mt-2 text-xs text-slate-500">Complete coverage</div>
                  </div>
                </div>

                <div className="group">
                  <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-700 dark:text-slate-300 mb-2">5K+</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Teams Using</div>
                    <div className="mt-2 text-xs text-slate-500">Monthly active</div>
                  </div>
                </div>

                <div className="group">
                  <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">98%</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Accuracy Rate</div>
                    <div className="mt-2 text-xs text-slate-500">Verified standards</div>
                  </div>
                </div>

                <div className="group">
                  <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-700 dark:text-slate-300 mb-2">24/7</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Available</div>
                    <div className="mt-2 text-xs text-slate-500">Always updated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Checklist */}
      <div className="relative py-16">
        <div className="container-wide">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-6">
                🌟 Featured Checklist
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Our comprehensive WCAG 2.2 checklist - the gold standard for web accessibility compliance
              </p>
            </div>

            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-slate-600/5 to-blue-600/5"></div>
                <CardHeader className="relative bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 pb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl">
                        <Shield className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-slate-800 bg-clip-text text-transparent mb-2">
                          WCAG 2.2 Interactive Checklist
                        </CardTitle>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">
                          Complete coverage of all 78 success criteria with interactive tracking
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 text-sm px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                      <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-sm px-3 py-1">
                        Free
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative p-8">
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                        <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
                        Key Features
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800/20 rounded-xl border border-blue-100 dark:border-blue-800">
                          <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-blue-800 dark:text-blue-300">Interactive Progress Tracking</div>
                            <div className="text-sm text-blue-700 dark:text-blue-400">Check off completed criteria with real-time progress updates</div>
                          </div>
                        </div>
                        <div className="flex items-start p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/20 dark:to-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-700">
                          <Download className="w-5 h-5 text-slate-600 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-slate-800 dark:text-slate-300">Professional Export Options</div>
                            <div className="text-sm text-slate-700 dark:text-slate-400">Generate Excel reports and PDF documentation for stakeholders</div>
                          </div>
                        </div>
                        <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800/20 rounded-xl border border-blue-100 dark:border-blue-800">
                          <Target className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-blue-800 dark:text-blue-300">Advanced Filtering & Search</div>
                            <div className="text-sm text-blue-700 dark:text-blue-400">Filter by level, principle, or search specific criteria</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                        <Award className="w-6 h-6 text-slate-600 mr-3" />
                        Coverage Details
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">30</div>
                          <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Level A</div>
                          <div className="text-xs text-blue-500 mt-1">Basic</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/20 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-1">24</div>
                          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">Level AA</div>
                          <div className="text-xs text-slate-500 mt-1">Standard</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">24</div>
                          <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Level AAA</div>
                          <div className="text-xs text-blue-500 mt-1">Enhanced</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                          <Zap className="w-4 h-4 text-blue-600 mr-2" />
                          Perfect For:
                        </h4>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Web developers & designers
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                            QA teams & accessibility auditors
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Product managers & compliance officers
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 text-lg px-8 py-4 rounded-xl">
                      <Link href="/checklists/wcag-2-2" className="flex items-center gap-3">
                        <Eye className="w-5 h-5" />
                        Start Checklist
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-lg px-8 py-4 rounded-xl">
                      <Link href="/checklists/wcag-2-2" className="flex items-center gap-3">
                        <Download className="w-5 h-5" />
                        Preview Features
          </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="relative py-16 bg-gradient-to-r from-slate-900/5 via-slate-800/5 to-slate-900/5">
        <div className="container-wide">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-6">
                🚀 Coming Soon
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                We're continuously expanding our checklist library to cover all aspects of digital accessibility
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mobile Accessibility Checklist */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                      Q2 2025
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                    Mobile Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    Comprehensive checklist for mobile app accessibility covering iOS, Android, and cross-platform guidelines.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Touch Targets</Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Screen Readers</Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Gestures</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* ARIA Patterns Checklist */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl">
                      <CheckSquare className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/20 dark:text-slate-300 dark:border-slate-600">
                      Q3 2025
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                    ARIA Design Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    Interactive checklist for implementing ARIA design patterns correctly in complex web applications.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Components</Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Landmarks</Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">States</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Section 508 Checklist */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                      Q4 2025
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                    Section 508 Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    Government accessibility standards checklist for federal agencies and contractors in the United States.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Federal</Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Legal</Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Compliance</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-16">
        <div className="container-wide">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-slate-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
              <div className="relative">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Build More Accessible Products?
                </h2>
                <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                  Join thousands of developers and designers using our checklists to create inclusive digital experiences. 
                  Start with our WCAG 2.2 checklist today - it's completely free!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold">
                    <Link href="/checklists/wcag-2-2" className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      Start Free Checklist
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl font-semibold">
                    <Link href="/contact" className="flex items-center gap-3">
                      <Users className="w-5 h-5" />
                      Contact Our Team
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
