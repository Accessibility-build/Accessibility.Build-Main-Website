import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Circle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Interactive WCAG Checklist | Accessibility.build",
  description: "Interactive accessibility checklist based on WCAG guidelines. Track your progress and ensure compliance with web accessibility standards.",
  keywords: "interactive checklist, WCAG, accessibility compliance, web accessibility audit",
}

export default function InteractiveChecklistPage() {
  return (
    <div className="container-wide py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/checklists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checklists
          </Link>
        </Button>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          <h1 className="text-4xl font-bold">Interactive WCAG Checklist</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            An interactive tool to guide you through accessibility compliance checks based on WCAG 2.2 guidelines.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-muted-foreground" />
              Interactive Progress Tracking
            </CardTitle>
            <CardDescription>
              Check off items as you complete them and track your overall compliance progress.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-muted-foreground" />
              WCAG 2.2 Guidelines
            </CardTitle>
            <CardDescription>
              Complete checklist covering all WCAG 2.2 Level A and AA success criteria.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-muted-foreground" />
              Export Reports
            </CardTitle>
            <CardDescription>
              Generate compliance reports and export your progress for stakeholder review.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Interactive Checklist Coming Soon</CardTitle>
            <CardDescription>
              We're building an advanced interactive checklist tool that will help you systematically
              review and ensure WCAG compliance across your digital properties.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                In the meantime, you can use our static WCAG 2.2 checklist or explore our other accessibility tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/checklists/wcag-2-2">View WCAG 2.2 Checklist</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/tools">Explore Tools</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 