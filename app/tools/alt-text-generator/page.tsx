import type { Metadata } from "next"
import AltTextGenerator from "@/components/tools/alt-text-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Eye, 
  Search,
  Users,
  Globe,
  Star,
  CheckCircle,
  Wand2
} from "lucide-react"

export const metadata: Metadata = {
  title: "AI-Powered Alt Text Generator | OpenAI GPT-4 Vision | Accessibility.build",
  description:
    "Generate professional, descriptive alt text for images using OpenAI GPT-4 Vision. Improve accessibility for screen readers with AI-powered descriptions that boost SEO and user experience.",
  keywords: "alt text generator, AI alt text, OpenAI GPT-4 Vision, accessibility, screen reader, SEO, image description",
}

export default function AltTextGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container-wide py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Powered by OpenAI GPT-4 Vision</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
              AI Alt Text Generator
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your images into accessible, SEO-optimized content with professional alt text powered by 
              <span className="font-semibold text-foreground"> OpenAI's most advanced vision model</span>
            </p>

            {/* Key Benefits Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>WCAG 2.2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span>Instant Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-600" />
                <span>Context-Aware AI</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-orange-600" />
                <span>SEO Optimized</span>
              </div>
            </div>

            {/* Credit Info */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-muted/50 border border-border">
              <Wand2 className="h-5 w-5 text-primary" />
              <span className="font-medium">1 Credit per Generation</span>
              <Badge variant="secondary" className="ml-2">New users get 100 free credits</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <AltTextGenerator />

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Screen Reader Accessibility</CardTitle>
                    <CardDescription>WCAG 2.2 AA Compliant</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate alt text that works perfectly with screen readers, helping blind and visually 
                  impaired users understand your visual content with detailed, contextual descriptions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                    <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">SEO Optimization</CardTitle>
                    <CardDescription>Boost Search Rankings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Search engines use alt text to understand and index images. Our AI creates SEO-friendly 
                  descriptions that improve your content's discoverability and search rankings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                    <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Universal Fallback</CardTitle>
                    <CardDescription>Always Accessible</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Alt text displays when images fail to load due to slow connections or technical issues, 
                  ensuring your content remains understandable in any situation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our advanced AI analyzes your images and generates professional alt text in seconds
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Upload or Link",
                  description: "Upload an image from your device or provide a URL. Supports all major formats up to 5MB.",
                  icon: "📤"
                },
                {
                  step: "2", 
                  title: "Add Context",
                  description: "Optionally provide context about your image's purpose to get more targeted descriptions.",
                  icon: "💭"
                },
                {
                  step: "3",
                  title: "Generate & Copy",
                  description: "Our AI creates professional alt text that you can instantly copy and use anywhere.",
                  icon: "✨"
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform -translate-x-8"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="mt-20">
            <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Alt Text Best Practices
                </CardTitle>
                <CardDescription className="text-lg">
                  Follow these guidelines to create the most effective alt text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Keep descriptions concise but descriptive (ideally under 125 characters)",
                    "Focus on the image's purpose and context within your content",
                    "Include important text that appears in the image", 
                    "Avoid starting with 'Image of' or 'Picture of'",
                    "Describe actions, emotions, and relevant visual details",
                    "Consider your audience and the image's role in your content"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
