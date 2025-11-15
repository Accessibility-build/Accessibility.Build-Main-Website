import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { CheckCircle, ArrowRight, Zap, Users, Target, Rocket, Globe, Code, Palette, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Welcome to Accessibility.build | Get Started",
  description: "Welcome to Accessibility.build! Complete your onboarding to start testing your websites for accessibility compliance.",
  robots: {
    index: false,
    follow: false
  }
}

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Accessibility.build",
    description: "Let's get you set up with everything you need to start testing accessibility",
    icon: Rocket,
    completed: true
  },
  {
    id: 2,
    title: "Choose Your Role",
    description: "Help us customize your experience based on how you'll use our tools",
    icon: Users,
    completed: false
  },
  {
    id: 3,
    title: "Set Your Goals",
    description: "What accessibility standards are you aiming to meet?",
    icon: Target,
    completed: false
  },
  {
    id: 4,
    title: "Try Our Tools",
    description: "Take a quick tour of our most popular accessibility testing tools",
    icon: Zap,
    completed: false
  }
]

const userRoles = [
  {
    id: "developer",
    title: "Developer",
    description: "I build websites and applications",
    icon: Code,
    features: ["API access", "Developer tools", "Code examples", "CI/CD integration"]
  },
  {
    id: "designer",
    title: "Designer",
    description: "I design user interfaces and experiences",
    icon: Palette,
    features: ["Color tools", "Design guidelines", "Visual testing", "Design system integration"]
  },
  {
    id: "manager",
    title: "Project Manager",
    description: "I manage projects and ensure compliance",
    icon: Shield,
    features: ["Team collaboration", "Reporting tools", "Compliance tracking", "Progress monitoring"]
  },
  {
    id: "agency",
    title: "Agency/Consultant",
    description: "I provide services to multiple clients",
    icon: Globe,
    features: ["Multi-client management", "White-label reports", "Bulk testing", "Client portals"]
  }
]

const goals = [
  {
    id: "wcag-aa",
    title: "WCAG 2.2 AA Compliance",
    description: "Meet the standard accessibility requirements",
    popular: true
  },
  {
    id: "wcag-aaa",
    title: "WCAG 2.2 AAA Compliance",
    description: "Achieve the highest accessibility standards",
    popular: false
  },
  {
    id: "ada-compliance",
    title: "ADA Compliance",
    description: "Ensure compliance with US accessibility laws",
    popular: true
  },
  {
    id: "section-508",
    title: "Section 508 Compliance",
    description: "Meet US federal accessibility requirements",
    popular: false
  },
  {
    id: "general-improvement",
    title: "General Accessibility Improvement",
    description: "Make my website more accessible to everyone",
    popular: true
  }
]

const quickTourTools = [
  {
    name: "Color Contrast Checker",
    description: "Test color combinations for WCAG compliance",
    href: "/tools/contrast-checker",
    icon: Palette,
    time: "2 min"
  },
  {
    name: "Alt Text Generator",
    description: "Generate AI-powered alt text for images",
    href: "/tools/alt-text-generator",
    icon: Zap,
    time: "3 min"
  },
  {
    name: "Accessibility Audit Helper",
    description: "Get comprehensive accessibility reports",
    href: "/tools/accessibility-audit-helper",
    icon: Shield,
    time: "5 min"
  }
]

export default async function OnboardingPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect("/sign-in")
  }

  // In a real app, you'd check if onboarding is already completed
  // and redirect to dashboard if so

  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Welcome to Accessibility.build!</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Let's get you set up in just a few minutes
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step 1 of 4</span>
              <span>25% Complete</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
        </div>

        {/* Current Step Content */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to Accessibility.build</CardTitle>
            <CardDescription className="text-lg">
              You've just joined thousands of developers, designers, and organizations who are making the web more accessible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Welcome Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">100 Free Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Start testing immediately with your welcome credits
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Powerful Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Access to all our accessibility testing tools
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">WCAG Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Test against WCAG 2.2 and 3.0 standards
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-center pt-6 border-t">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <p className="text-muted-foreground mb-6">
                We'll help you customize your experience and show you around our most popular tools.
              </p>
              <Button size="lg">
                Continue Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview of Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="opacity-60">
            <CardHeader className="text-center pb-4">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-lg">Choose Your Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Help us customize your experience
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader className="text-center pb-4">
              <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-lg">Set Your Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                What standards do you need to meet?
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader className="text-center pb-4">
              <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-lg">Try Our Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Quick tour of our testing tools
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Want to skip the setup and explore on your own?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tools">
                Browse Tools
              </Link>
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="font-semibold mb-2">Need Help Getting Started?</h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you succeed with accessibility testing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/help">
                  View Help Center
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
