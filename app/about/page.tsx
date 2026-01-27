import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Heart, Code, Target, Mail, Brain, AlertCircle, Zap, Shield, Lightbulb } from "lucide-react"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "About Accessibility.build | Making the Web Accessible",
  description: "Learn about our mission to make web accessibility tools and education accessible to everyone.",
  keywords: ["accessibility", "web accessibility", "a11y", "WCAG", "inclusive design"]
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Brain className="h-4 w-4" />
            AI-Powered Accessibility Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white leading-tight mb-8 tracking-tight">
            Making the Web
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Accessible
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12 max-w-4xl mx-auto">
            We build intelligent tools and resources to help developers create accessible web experiences for everyone.
          </p>
        </div>
      </section>

      {/* Main AI Philosophy Section - Hero Treatment */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-8">
              <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6">
                <Brain className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Our Core Philosophy
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-2xl md:text-4xl font-bold mb-8 leading-relaxed">
              "AI cannot fix accessibility issues,<br className="hidden md:block" />
              but AI can help us make <br className="hidden md:block" />
              the world more accessible."
            </blockquote>
            
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-300" />
                  The Reality
                </h3>
                <p className="text-white/90 leading-relaxed">
                  True accessibility requires human understanding, empathy, and intentional design decisions. 
                  AI is a powerful tool, but it cannot replace human judgment in creating inclusive experiences.
                </p>
              </div>
              
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-300" />
                  Our Approach
                </h3>
                <p className="text-white/90 leading-relaxed">
                  We use AI to empower developers with insights, recommendations, and efficient workflows—
                  enhancing human capability rather than replacing human responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - Minimalist Grid */}
      <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              What We Do
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We combine cutting-edge AI technology with human-centered design principles
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 w-fit mb-6">
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  AI-Powered Tools
                  </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Smart accessibility testing, code generation, and analysis tools that enhance developer productivity
                  </p>
                </div>
              </div>
              
            <div className="group">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-4 w-fit mb-6">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Human-Centered Education
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Comprehensive guides and resources that focus on understanding real user needs and experiences
                    </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 w-fit mb-6">
                  <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Inclusive Community
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Supporting developers in building truly inclusive digital experiences for everyone
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-4 bg-slate-100 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Empowering developers to create accessible experiences
              </p>
            </div>
            
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">50K+</div>
              <div className="text-xl text-slate-600 dark:text-slate-300">Developers Empowered</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4">1M+</div>
              <div className="text-xl text-slate-600 dark:text-slate-300">Accessibility Insights</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-green-600 dark:text-green-400 mb-4">30+</div>
              <div className="text-xl text-slate-600 dark:text-slate-300">Tools & Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Side by Side */}
      <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Mission</h2>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                To make web accessibility tools and knowledge accessible to everyone, 
                using AI to enhance human capability rather than replace human responsibility.
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-3">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Vision</h2>
                  </div>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                A web where accessibility is the default, not an afterthought, 
                achieved through the thoughtful combination of AI assistance and human empathy.
                    </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Help us make the web more accessible for everyone—with AI as our ally, not our solution.
              </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              <Link href="/tools">
                Explore Our Tools <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg">
              <Link href="/contact">
                Get in Touch <Mail className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
        </div>
      </section>
    </div>
  )
}
