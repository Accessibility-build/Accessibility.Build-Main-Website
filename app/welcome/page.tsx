import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Gift, 
  CheckCircle, 
  ArrowRight, 
  Zap,
  Palette,
  ImageIcon,
  Search,
  BookOpen,
  Users,
  Star,
  Target,
  Sparkles,
  CreditCard,
  Trophy,
  Rocket
} from "lucide-react"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Welcome to Accessibility.build | Your Account is Ready!",
  description: "Welcome to your accessibility journey! Get started with 100 free credits and explore professional accessibility tools to make the web more inclusive.",
  keywords: [
    "welcome accessibility.build",
    "new user onboarding",
    "accessibility tools account",
    "free credits"
  ]
})

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container-wide py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                🎉 Welcome to Accessibility.build!
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Your account is ready and you've received <strong>100 free credits</strong> to start building more accessible digital experiences.
              </p>
              
              {/* Credits Highlight */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                <Gift className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold">100 Free Credits Available</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary">$10 Value</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-16">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Account Created</h3>
                <p className="text-sm text-muted-foreground">You're all set and ready to go!</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 mb-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">100 Free Credits</h3>
                <p className="text-sm text-muted-foreground">No payment required to start testing</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 mb-4">
                  <Rocket className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Ready to Launch</h3>
                <p className="text-sm text-muted-foreground">Start with our most popular tools</p>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started Guide */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Get Started in 3 Simple Steps
              </CardTitle>
              <CardDescription>
                Follow these steps to make the most of your accessibility tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Choose Your First Tool</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Start with our free Color Contrast Checker or try our AI-powered Alt Text Generator.
                    </p>
                    <Link href="/tools">
                      <Button variant="outline" size="sm">
                        Browse Tools <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Run Your First Audit</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use the URL Accessibility Auditor to test any website for WCAG compliance.
                    </p>
                    <Link href="/tools/url-accessibility-auditor">
                      <Button variant="outline" size="sm">
                        Start Audit <Target className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Learn & Improve</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Explore our resources, guides, and best practices to build better accessible experiences.
                    </p>
                    <Link href="/resources">
                      <Button variant="outline" size="sm">
                        View Resources <BookOpen className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most Popular Tools */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Start with Our Most Popular Tools
              </h2>
              <p className="text-muted-foreground">
                These tools are loved by thousands of developers and designers worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Color Contrast Checker */}
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20">
                      FREE
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">Color Contrast Checker</CardTitle>
                  <CardDescription>
                    Ensure your colors meet WCAG accessibility standards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Most Popular</span>
                    <Users className="w-4 h-4 ml-2" />
                    <span>10K+ users</span>
                  </div>
                  <Link href="/tools/contrast-checker">
                    <Button className="w-full" size="sm">
                      Try It Free <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* AI Alt Text Generator */}
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20">
                      1 Credit
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">AI Alt Text Generator</CardTitle>
                  <CardDescription>
                    Generate descriptive alt text for images using AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>AI-Powered</span>
                    <Users className="w-4 h-4 ml-2" />
                    <span>5K+ users</span>
                  </div>
                  <Link href="/tools/alt-text-generator">
                    <Button className="w-full" size="sm">
                      Generate Alt Text <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Accessibility Audit Helper */}
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/20">
                      2 Credits
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">AI Accessibility Audit</CardTitle>
                  <CardDescription>
                    Get expert AI analysis of accessibility issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span>Expert Analysis</span>
                    <Users className="w-4 h-4 ml-2" />
                    <span>3K+ users</span>
                  </div>
                  <Link href="/tools/accessibility-audit-helper">
                    <Button className="w-full" size="sm">
                      Start Audit <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6">Ready to dive deeper?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button variant="default" size="lg">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="outline" size="lg">
                  Explore All Tools
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="lg">
                  Learn More
                  <BookOpen className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 