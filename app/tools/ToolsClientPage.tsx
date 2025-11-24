"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRight,
    Palette,
    ImageIcon,
    Search,
    Zap,
    CheckCircle,
    Star,
    Users,
    Clock,
    Target,
    Code,
    Shield,
    Coins,
    Hash,
    Paintbrush,
    Smartphone,
    Lock,
    FileText,
    Grid3X3,
    Sparkles,
    Globe
} from "lucide-react"
import TrialStatusBanner from "@/components/trial-status-banner"

// Featured tools for quick access
const featuredTools = [
    {
        title: "AI Accessibility Audit",
        description: "Get expert WCAG analysis instantly",
        icon: Search,
        href: "/tools/accessibility-audit-helper",
        gradient: "from-green-500 to-teal-500",
        popular: true
    },
    {
        title: "AI Alt Text Generator",
        description: "Generate perfect alt text with AI",
        icon: ImageIcon,
        href: "/tools/alt-text-generator",
        gradient: "from-blue-500 to-cyan-500",
        popular: true
    },
    {
        title: "Color Contrast Checker",
        description: "Instantly verify WCAG color standards",
        icon: Palette,
        href: "/tools/contrast-checker",
        gradient: "from-purple-500 to-pink-500",
        popular: true
    }
]

// Accessibility-focused tools
const accessibilityTools = [
    {
        title: "Heading Structure Analyzer",
        shortTitle: "Heading Analyzer",
        description: "Optimize your heading hierarchy for both SEO rankings and screen reader accessibility. Analyze H1-H6 structure with actionable recommendations.",
        features: ["SEO Optimization", "Screen Reader Support", "WCAG 2.2 Compliance", "Instant Analysis"],
        icon: Hash,
        gradient: "from-green-500 to-emerald-500",
        bgPattern: "heading-pattern",
        slug: "heading-analyzer",
        pricing: "Free",
        credits: 0,
        popular: true,
        stats: { users: "New!", tests: "Growing" }
    },
    {
        title: "Advanced Color Palette Generator",
        shortTitle: "Palette Generator",
        description: "Generate beautiful, accessible color palettes using color theory. Create harmonious WCAG-compliant color schemes for professional designs.",
        features: ["Color Theory Based", "WCAG Compliant", "Multiple Harmonies", "Export Ready"],
        icon: Paintbrush,
        gradient: "from-pink-500 to-rose-500",
        bgPattern: "palette-pattern",
        slug: "color-palette-generator",
        pricing: "Free",
        credits: 0,
        popular: true,
        stats: { users: "New!", palettes: "Growing" }
    },
    {
        title: "Color Contrast Checker",
        shortTitle: "Contrast Checker",
        description: "Instantly verify color combinations meet WCAG standards with support for both WCAG 2.2 and cutting-edge WCAG 3.0 APCA guidelines.",
        features: ["WCAG 2.2 & 3.0 Support", "Real-time Testing", "Accessible Palettes", "Export Results"],
        icon: Palette,
        gradient: "from-purple-500 to-pink-500",
        bgPattern: "contrast-pattern",
        slug: "contrast-checker",
        pricing: "Free",
        credits: 0,
        popular: false,
        stats: { users: "15K+", tests: "500K+" }
    },
    {
        title: "AI Alt Text Generator",
        shortTitle: "Alt Text AI",
        description: "Generate perfect, contextual alt text for images using advanced AI vision models. Improve accessibility and SEO effortlessly.",
        features: ["GPT-4 Vision", "Context-Aware", "SEO Optimized", "Bulk Processing"],
        icon: ImageIcon,
        gradient: "from-blue-500 to-cyan-500",
        bgPattern: "image-pattern",
        slug: "alt-text-generator",
        pricing: "1 Credit",
        credits: 1,
        popular: true,
        stats: { users: "8K+", generations: "50K+" }
    },
    {
        title: "AI Accessibility Audit Helper",
        shortTitle: "Audit Helper",
        description: "Get expert accessibility consulting powered by AI. Describe issues, share code, and receive comprehensive WCAG analysis with implementation guides.",
        features: ["Expert Analysis", "Code Recommendations", "WCAG Mapping", "Step-by-step Guides"],
        icon: Search,
        gradient: "from-green-500 to-teal-500",
        bgPattern: "audit-pattern",
        slug: "accessibility-audit-helper",
        pricing: "1 Credit",
        credits: 1,
        popular: false,
        stats: { users: "New!", audits: "Growing" }
    },
    {
        title: "Mobile Accessibility Checker",
        shortTitle: "Mobile Checker",
        description: "Test mobile-specific accessibility requirements including touch targets, mobile WCAG compliance, and responsive design accessibility.",
        features: ["Touch Target Analysis", "Mobile WCAG Testing", "Performance Impact", "Multi-Device Testing"],
        icon: Smartphone,
        gradient: "from-indigo-500 to-blue-500",
        bgPattern: "mobile-pattern",
        slug: "mobile-accessibility-checker",
        pricing: "2 Credits",
        credits: 2,
        popular: true,
        stats: { users: "New!", tests: "Growing" }
    },
    {
        title: "AI Accessibility Code Generator",
        shortTitle: "Code Generator",
        description: "Generate production-ready accessible components with comprehensive AI analysis. Get detailed WCAG 2.2 compliant code with explanations, examples, and implementation guides.",
        features: ["AI-Powered Analysis", "Detailed Explanations", "Multiple Examples", "Implementation Guides"],
        icon: Code,
        gradient: "from-purple-500 to-violet-500",
        bgPattern: "code-pattern",
        slug: "accessibility-code-generator",
        pricing: "2 Credits",
        credits: 2,
        popular: true,
        stats: { users: "New!", generated: "Growing" }
    },
    {
        title: "URL Accessibility Auditor",
        shortTitle: "URL Auditor",
        description: "Comprehensive website accessibility testing powered by axe-core and AI analysis. Get detailed WCAG compliance reports with actionable recommendations.",
        features: ["axe-core Testing", "AI Analysis", "WCAG Compliance", "Priority Fixes"],
        icon: Shield,
        gradient: "from-red-500 to-orange-500",
        bgPattern: "scanner-pattern",
        slug: "url-accessibility-auditor",
        pricing: "5 Credits",
        credits: 5,
        popular: false,
        stats: { users: "New!", scans: "Starting" }
    },
]

// General utility tools
const utilityTools = [
    {
        title: "Image Color Picker",
        shortTitle: "Color Picker",
        description: "Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly. Export color palettes in multiple formats for your design projects.",
        features: ["Color Extraction", "Multiple Formats", "Palette Export", "Instant Copy"],
        icon: Palette,
        gradient: "from-purple-500 to-pink-500",
        bgPattern: "color-pattern",
        slug: "image-color-picker",
        pricing: "Free",
        credits: 0,
        popular: true,
        stats: { users: "New!", colors: "Growing" }
    },
    {
        title: "Base64 Encoder/Decoder",
        shortTitle: "Base64 Converter",
        description: "Encode and decode text or files to/from Base64 format. Perfect for data transmission, storage, and web development tasks.",
        features: ["Text & File Support", "Encode/Decode", "Size Analysis", "Instant Copy"],
        icon: Lock,
        gradient: "from-blue-500 to-indigo-500",
        bgPattern: "encode-pattern",
        slug: "base64-converter",
        pricing: "Free",
        credits: 0,
        popular: true,
        stats: { users: "New!", conversions: "Growing" }
    },
    {
        title: "URL Encoder/Decoder",
        shortTitle: "URL Converter",
        description: "Encode and decode URLs for safe transmission. Handle special characters, spaces, and international characters in URLs and query parameters.",
        features: ["URL Encoding", "Special Characters", "Query Parameters", "Examples"],
        icon: Globe,
        gradient: "from-green-500 to-teal-500",
        bgPattern: "url-pattern",
        slug: "url-encoder-decoder",
        pricing: "Free",
        credits: 0,
        popular: false,
        stats: { users: "New!", urls: "Growing" }
    },
    {
        title: "Password Generator",
        shortTitle: "Password Gen",
        description: "Generate secure, customizable passwords with various options for length, character sets, and complexity requirements.",
        features: ["Secure Generation", "Custom Rules", "Multiple Options", "Instant Copy"],
        icon: Lock,
        gradient: "from-orange-500 to-red-500",
        bgPattern: "security-pattern",
        slug: "password-generator",
        pricing: "Free",
        credits: 0,
        popular: false,
        stats: { users: "5K+", generated: "25K+" }
    },
    {
        title: "JSON Formatter & Validator",
        shortTitle: "JSON Formatter",
        description: "Format, validate, and beautify JSON data with syntax highlighting, error detection, and minification options.",
        features: ["Format & Beautify", "Syntax Validation", "Error Detection", "Minify Option"],
        icon: FileText,
        gradient: "from-yellow-500 to-orange-500",
        bgPattern: "data-pattern",
        slug: "json-formatter",
        pricing: "Free",
        credits: 0,
        popular: false,
        stats: { users: "3K+", formatted: "15K+" }
    }
]

export default function ToolsClientPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container-wide py-16 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                                <Zap className="h-8 w-8 text-primary" />
                            </div>
                            <Badge variant="secondary" className="text-sm font-medium">
                                AI-Powered Suite
                            </Badge>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Accessibility Tools
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                            Professional accessibility testing and compliance tools powered by AI.
                            <br className="hidden md:block" />
                            Ensure your website is accessible to everyone.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-5 w-5" />
                                <span className="font-medium">25,000+ Users</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="font-medium">WCAG 2.2 & 3.0</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-5 w-5" />
                                <span className="font-medium">Instant Results</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trial Status Banner */}
            <div className="container-wide pb-8">
                <div className="max-w-6xl mx-auto">
                    <TrialStatusBanner />
                </div>
            </div>

            {/* Quick Access Tools */}
            <div className="container-wide pb-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl md:text-3xl font-bold">Quick Access</h2>
                        </div>
                        <p className="text-muted-foreground">Jump straight to our most popular tools or explore everything we offer</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Featured Tools */}
                        {featuredTools.map((tool, index) => {
                            const IconComponent = tool.icon
                            return (
                                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
                                    <CardContent className="p-6">
                                        <div className="text-center space-y-4">
                                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                                                <IconComponent className="h-8 w-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                                                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                                                <Button asChild size="sm" className="w-full group/btn">
                                                    <Link href={tool.href}>
                                                        Launch Tool
                                                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </Button>
                                            </div>
                                            {tool.popular && (
                                                <Badge className="bg-orange-500 text-white border-0">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Popular
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}

                        {/* Explore All Tools */}
                        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-dashed border-primary/50 hover:border-primary bg-gradient-to-br from-primary/5 to-primary/10">
                            <CardContent className="p-6 h-full flex flex-col">
                                <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
                                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:scale-110 transition-transform">
                                        <Grid3X3 className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-primary">Explore All Tools</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Discover our complete suite of {accessibilityTools.length + utilityTools.length} accessibility and utility tools
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full group/btn border-primary/50 hover:bg-primary hover:text-white"
                                            onClick={() => {
                                                document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth' })
                                            }}
                                        >
                                            View All Tools
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* All Tools Section */}
            <div id="all-tools" className="container-wide pb-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-12">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Shield className="h-6 w-6 text-green-600" />
                                <h2 className="text-3xl font-bold text-foreground">
                                    Accessibility & WCAG Tools
                                </h2>
                            </div>
                            <p className="text-lg text-muted-foreground">
                                Comprehensive tools for testing, analyzing, and improving website accessibility compliance
                            </p>
                        </div>
                    </div>

                    {/* Accessibility Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                        {accessibilityTools.map((tool, index) => {
                            const IconComponent = tool.icon
                            return (
                                <Card
                                    key={index}
                                    className="group relative overflow-hidden border-2 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
                                >
                                    {/* Popular Badge */}
                                    {tool.popular && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                                                <Star className="h-3 w-3 mr-1" />
                                                Popular
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Gradient Header */}
                                    <div className={`relative h-32 bg-gradient-to-br ${tool.gradient} overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                                        {/* Decorative Pattern */}
                                        <div className="absolute inset-0 opacity-20">
                                            {tool.bgPattern === 'heading-pattern' && (
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_2px,transparent_2px),linear-gradient(-45deg,rgba(255,255,255,0.15)_2px,transparent_2px)] bg-[length:12px_12px]"></div>
                                            )}
                                            {tool.bgPattern === 'palette-pattern' && (
                                                <div className="absolute inset-0 bg-[linear-gradient(60deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(120deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:18px_18px]"></div>
                                            )}
                                            {tool.bgPattern === 'contrast-pattern' && (
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)] bg-[length:20px_20px]"></div>
                                            )}
                                            {tool.bgPattern === 'image-pattern' && (
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:16px_16px]"></div>
                                            )}
                                            {tool.bgPattern === 'audit-pattern' && (
                                                <div className="absolute inset-0 bg-[conic-gradient(from_45deg,rgba(255,255,255,0.1),transparent_50%,rgba(255,255,255,0.1))] bg-[length:24px_24px]"></div>
                                            )}
                                            {tool.bgPattern === 'mobile-pattern' && (
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2)_2px,transparent_2px),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
                                            )}
                                            {tool.bgPattern === 'code-pattern' && (
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:14px_14px]"></div>
                                            )}
                                            {tool.bgPattern === 'scanner-pattern' && (
                                                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                                            )}
                                        </div>

                                        {/* Tool Icon */}
                                        <div className="absolute bottom-4 left-6">
                                            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                                                <IconComponent className="h-8 w-8 text-white" />
                                            </div>
                                        </div>

                                        {/* Accessibility Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-green-100 text-green-800 border-0 shadow-sm">
                                                <Shield className="h-3 w-3 mr-1" />
                                                Accessibility
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-1 ml-2">
                                                {tool.credits > 0 ? (
                                                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                                                        <Coins className="h-3 w-3 mr-1" />
                                                        {tool.pricing}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                        Free
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <CardDescription className="text-base leading-relaxed text-muted-foreground">
                                            {tool.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pt-0 pb-6">
                                        {/* Features */}
                                        <div className="space-y-3 mb-6">
                                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Key Features</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {tool.features.map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                                        <span className="text-muted-foreground">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg mb-6">
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-foreground">{tool.stats.users}</div>
                                                <div className="text-xs text-muted-foreground">Users</div>
                                            </div>
                                            <div className="w-px h-8 bg-border"></div>
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-foreground">{Object.values(tool.stats)[1]}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {tool.slug.includes('generator') ? 'Generated' : tool.slug.includes('checker') ? 'Tests' : 'Audits'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <Button asChild className="w-full group/btn bg-green-600 hover:bg-green-700">
                                            <Link href={`/tools/${tool.slug}`}>
                                                <span className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4" />
                                                    Launch {tool.shortTitle}
                                                </span>
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Utility Tools Section */}
            <div className="container-wide pb-16">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-12">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Target className="h-6 w-6 text-blue-600" />
                                <h2 className="text-3xl font-bold text-foreground">
                                    Developer Utility Tools
                                </h2>
                            </div>
                            <p className="text-lg text-muted-foreground">
                                Additional productivity tools for developers and content creators
                            </p>
                        </div>
                    </div>

                    {/* Utility Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                        {utilityTools.map((tool, index) => {
                            const IconComponent = tool.icon
                            return (
                                <Card
                                    key={index}
                                    className="group relative overflow-hidden border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
                                >
                                    {/* Popular Badge */}
                                    {tool.popular && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                                                <Star className="h-3 w-3 mr-1" />
                                                Popular
                                            </Badge>
                                        </div>
                                    )}
                                    {/* Gradient Header */}
                                    <div className={`relative h-32 bg-gradient-to-br ${tool.gradient} overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                                        {/* Decorative Pattern */}
                                        <div className="absolute inset-0 opacity-20">
                                            {tool.bgPattern === 'color-pattern' && (
                                                <div className="absolute inset-0 bg-[linear-gradient(60deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(120deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:18px_18px]"></div>
                                            )}
                                            {tool.bgPattern === 'encode-pattern' && (
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:14px_14px]"></div>
                                            )}
                                            {tool.bgPattern === 'url-pattern' && (
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2)_1px,transparent_1px),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:16px_16px]"></div>
                                            )}
                                            {tool.bgPattern === 'security-pattern' && (
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_2px,transparent_2px),linear-gradient(-45deg,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:16px_16px]"></div>
                                            )}
                                            {tool.bgPattern === 'data-pattern' && (
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_2px,transparent_2px),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                                            )}
                                        </div>

                                        {/* Tool Icon */}
                                        <div className="absolute bottom-4 left-6">
                                            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                                                <IconComponent className="h-8 w-8 text-white" />
                                            </div>
                                        </div>

                                        {/* Utility Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-blue-100 text-blue-800 border-0 shadow-sm">
                                                <Target className="h-3 w-3 mr-1" />
                                                Utility
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-1 ml-2">
                                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                    Free
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardDescription className="text-base leading-relaxed text-muted-foreground">
                                            {tool.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pt-0 pb-6">
                                        {/* Features */}
                                        <div className="space-y-3 mb-6">
                                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Key Features</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {tool.features.map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                                        <span className="text-muted-foreground">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg mb-6">
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-foreground">{tool.stats.users}</div>
                                                <div className="text-xs text-muted-foreground">Users</div>
                                            </div>
                                            <div className="w-px h-8 bg-border"></div>
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-foreground">{Object.values(tool.stats)[1]}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {tool.slug.includes('generator') ? 'Generated' : 'Processed'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <Button asChild className="w-full group/btn bg-blue-600 hover:bg-blue-700">
                                            <Link href={`/tools/${tool.slug}`}>
                                                <span className="flex items-center gap-2">
                                                    <Target className="h-4 w-4" />
                                                    Launch {tool.shortTitle}
                                                </span>
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Common Tools Questions */}
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-4">Common Accessibility Tool Questions</h3>
                            <p className="text-muted-foreground">Frequently asked questions about our accessibility tools</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h4 className="font-semibold mb-2">What are accessibility tools?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Accessibility tools help developers and designers ensure their websites and applications are usable by people with disabilities. They test for WCAG compliance, color contrast, and other accessibility standards.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h4 className="font-semibold mb-2">Which accessibility tool should I use first?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Start with our AI Accessibility Audit Helper for comprehensive analysis of your specific accessibility challenges, then use our Color Contrast Checker for quick color validation wins.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h4 className="font-semibold mb-2">Are these tools free to use?</h4>
                                <p className="text-sm text-muted-foreground">
                                    We offer both free and premium tools. Basic tools like the contrast checker are free forever, while AI-powered tools require credits for advanced analysis.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h4 className="font-semibold mb-2">Do these tools check WCAG compliance?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Yes! Our tools are built around WCAG 2.2 guidelines and also support the latest WCAG 3.0 standards for comprehensive accessibility testing.
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
