import type { Metadata } from "next"
import ColorPaletteGenerator from "@/components/tools/color-palette-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Palette, 
  Eye, 
  CheckCircle,
  Target,
  Paintbrush,
  Download,
  Sparkles
} from "lucide-react"

export const metadata: Metadata = {
  title: "Accessible Color Palette Generator | WCAG Compliant Colors | Free Tool | Accessibility.build",
  description:
    "Generate beautiful, accessible color palettes that meet WCAG contrast requirements. Create harmonious color schemes for web design with built-in accessibility validation.",
  keywords: "accessible color palette, WCAG colors, color scheme generator, accessible design, color contrast, web colors, design system colors",
}

export default function ColorPaletteGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-wide py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm font-medium">
                Free Tool • No Credits Required
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Color Palette Generator
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Generate beautiful, accessible color palettes that meet WCAG standards.
              <br className="hidden md:block" />
              Perfect for creating inclusive designs with harmonious color schemes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">WCAG Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Beautiful Harmonies</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Download className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Export Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Component */}
      <div className="container-wide pb-16">
        <ColorPaletteGenerator />
        
        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">WCAG Compliance</CardTitle>
                  <CardDescription>Meets Accessibility Standards</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All generated color combinations are tested against WCAG 2.2 contrast requirements, 
                ensuring your designs are accessible to users with visual impairments.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <Paintbrush className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Design System Ready</CardTitle>
                  <CardDescription>Perfect for UI/UX Teams</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate complete color palettes with primary, secondary, accent, and neutral colors. 
                Perfect for building consistent design systems and brand guidelines.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Multiple Export Formats</CardTitle>
                  <CardDescription>Ready for Any Tool</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Export your palettes in CSS, SCSS, Figma, Adobe Swatches, and more. 
                Seamlessly integrate with your existing design and development workflow.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              About Accessible Color Palettes
            </CardTitle>
            <CardDescription>
              Understanding color harmony and accessibility in design
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Why Accessibility Matters
              </h3>
              <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                <li>15% of the global population has some form of visual impairment</li>
                <li>Good contrast improves readability for everyone, not just those with disabilities</li>
                <li>Accessible design is often required by law (ADA, AODA, etc.)</li>
                <li>Better contrast can improve conversion rates and user engagement</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                Color Theory Basics
              </h3>
              <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                <li><strong>Complementary:</strong> Colors opposite on the color wheel (high contrast)</li>
                <li><strong>Analogous:</strong> Colors next to each other (harmonious)</li>
                <li><strong>Triadic:</strong> Three colors evenly spaced on the wheel</li>
                <li><strong>Monochromatic:</strong> Different shades of the same hue</li>
                <li><strong>Split-Complementary:</strong> Base color plus two adjacent to its complement</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                Best Practices
              </h3>
              <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                <li>Test your colors with actual users, including those with visual impairments</li>
                <li>Use tools like this generator to ensure WCAG compliance from the start</li>
                <li>Consider how colors will appear in different lighting conditions</li>
                <li>Don't rely solely on color to convey important information</li>
                <li>Create a consistent color system across your entire product</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 