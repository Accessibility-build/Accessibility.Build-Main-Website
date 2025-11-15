import type { Metadata } from "next"
import MobileAccessibilityChecker from "@/components/tools/mobile-accessibility-checker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, 
  Eye, 
  Hand,
  Gauge,
  Monitor
} from "lucide-react"

export const metadata: Metadata = {
  title: "Mobile Accessibility Checker | Touch Targets & Mobile WCAG | Accessibility.build",
  description:
    "Test mobile accessibility with focus on touch targets, mobile-specific WCAG requirements, and responsive design compliance. Ensure your mobile experience is accessible.",
  keywords: "mobile accessibility, touch targets, mobile WCAG, responsive accessibility, mobile screen reader, accessibility testing",
}

export default function MobileAccessibilityCheckerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-wide py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm font-medium">
                2 Credits • Mobile First
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Mobile Accessibility Checker
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Test mobile-specific accessibility requirements including touch targets, 
              <br className="hidden md:block" />
              viewport settings, and mobile-first WCAG compliance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hand className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Touch Target Testing</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gauge className="h-5 w-5 text-green-600" />
                <span className="font-medium">Performance Impact</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Monitor className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Multi-Device Testing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Component */}
      <div className="container-wide pb-16">
        <MobileAccessibilityChecker />
        
        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <Hand className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Touch Target Analysis</CardTitle>
                  <CardDescription>WCAG 2.2 AA Compliance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automatically detect touch targets smaller than 44x44px and identify potential 
                issues for users with motor impairments or limited dexterity.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                  <Gauge className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mobile Performance</CardTitle>
                  <CardDescription>Speed & Accessibility</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Measure how accessibility features impact mobile performance and get 
                recommendations for optimizing both speed and inclusive design.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <Monitor className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Device Testing</CardTitle>
                  <CardDescription>Multi-Device Simulation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Test across different mobile devices, screen sizes, and orientations to ensure 
                consistent accessibility across the mobile ecosystem.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Mobile Accessibility Requirements
            </CardTitle>
            <CardDescription>
              Key considerations for mobile-first accessible design
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Hand className="h-4 w-4 text-blue-600" />
                Touch Target Guidelines
              </h3>
              <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                <li>Minimum touch target size: 44x44px (WCAG 2.2 AA)</li>
                <li>Adequate spacing between interactive elements</li>
                <li>Consider thumb reach zones and one-handed usage</li>
                <li>Ensure targets work for both touch and stylus input</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                Mobile Screen Reader Support
              </h3>
              <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                <li>Optimize for VoiceOver (iOS) and TalkBack (Android)</li>
                <li>Ensure swipe gestures work with screen readers</li>
                <li>Test reading order and navigation flow</li>
                <li>Verify custom gestures don't conflict with assistive technology</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-purple-600" />
                Responsive Design Best Practices
              </h3>
              <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                <li>Ensure content reflows properly at different zoom levels</li>
                <li>Test portrait and landscape orientations</li>
                <li>Verify form inputs work on mobile keyboards</li>
                <li>Check that focus indicators are visible on mobile</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 