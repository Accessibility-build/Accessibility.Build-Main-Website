'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRight,
    ArrowUpRight,
    Flame,
    AlertTriangle,
    EyeOff,
    EarOff,
    MousePointer,
    Brain,
    Clock,
    Users,
    Search,
    Target,
    BarChart3,
    BookOpen,
    Zap,
    CheckCircle2,
    ExternalLink,
    Activity,
    Crosshair,
    FileText,
    TrendingUp,
} from "lucide-react"
import { useEffect, useRef } from "react"

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

        element.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out')
        observer.observe(element)

        return () => observer.disconnect()
    }, [])

    return elementRef
}

const severityLevels = [
    {
        level: "CRITICAL",
        count: 6,
        color: "from-red-600 to-red-700",
        borderColor: "border-red-200 dark:border-red-500/30",
        textColor: "text-red-600 dark:text-red-400",
        badgeColor: "bg-red-600",
        title: "Complete Blockers",
        description: "Users cannot proceed. Task completion is impossible.",
        issues: ["Keyboard Trap", "Focus Trap in Drawer", "Missing Alt on Functional Images", "No Error Announcement", "No Visible Focus", "Autoplay Audio"],
    },
    {
        level: "HIGH",
        count: 6,
        color: "from-orange-500 to-orange-600",
        borderColor: "border-orange-200 dark:border-orange-500/30",
        textColor: "text-orange-600 dark:text-orange-400",
        badgeColor: "bg-orange-600",
        title: "Major Barriers",
        description: "Extremely difficult. Users struggle significantly.",
        issues: ["Missing Form Labels", "Keyboard-Inaccessible Select", "Low Contrast", "No Landmark Regions", "Misleading Focus Order", "Color-Only Errors"],
    },
    {
        level: "MEDIUM",
        count: 5,
        color: "from-yellow-500 to-yellow-600",
        borderColor: "border-yellow-200 dark:border-yellow-500/30",
        textColor: "text-yellow-600 dark:text-yellow-400",
        badgeColor: "bg-yellow-600",
        title: "Moderate Issues",
        description: "Frustrating and confusing. Poor user experience.",
        issues: ["Heading Level Chaos", "Ambiguous Link Text", "No Skip Link", "Auto-Advancing Carousel", "Tiny Touch Targets"],
    },
    {
        level: "LOW",
        count: 4,
        color: "from-blue-500 to-blue-600",
        borderColor: "border-blue-200 dark:border-blue-500/30",
        textColor: "text-blue-600 dark:text-blue-400",
        badgeColor: "bg-blue-600",
        title: "Minor Friction",
        description: "Annoying but workable. Still needs fixing.",
        issues: ["Redundant ARIA", "Missing Lang Attribute", "Decorative Image Alt Noise", "Tables Without Headers"],
    },
]

const features = [
    {
        icon: Search,
        title: "Issue Explorer",
        description: "Browse every demo with impact notes, WCAG references, and reproducible test steps.",
        href: "https://hell.accessibility.build/issues",
        color: "from-red-600 to-red-700",
    },
    {
        icon: Target,
        title: "Audit Practice Lab",
        description: "Run 5 realistic scenario drills with personas and reveal official findings.",
        href: "https://hell.accessibility.build/practice-lab",
        color: "from-orange-500 to-orange-600",
    },
    {
        icon: Activity,
        title: "Mission Mode",
        description: "Run full-task failure simulations with live telemetry tracking.",
        href: "https://hell.accessibility.build/mission-mode",
        color: "from-yellow-500 to-yellow-600",
    },
    {
        icon: BarChart3,
        title: "Impact Center",
        description: "Review business and user impact signals across all severity levels.",
        href: "https://hell.accessibility.build/impact",
        color: "from-purple-500 to-purple-600",
    },
    {
        icon: BookOpen,
        title: "Resources Hub",
        description: "Playbooks, WCAG maps, case studies, and templates for your team.",
        href: "https://hell.accessibility.build/resources",
        color: "from-blue-500 to-blue-600",
    },
]

const personas = [
    {
        icon: EyeOff,
        title: "Blind Users",
        description: "Controls become unlabeled or misleading. Navigation relies entirely on screen readers.",
        color: "from-red-600 to-red-700",
    },
    {
        icon: EarOff,
        title: "Deaf Users",
        description: "Audio-first content has no equivalent path. Alerts and feedback are missed.",
        color: "from-orange-500 to-orange-600",
    },
    {
        icon: MousePointer,
        title: "Motor Users",
        description: "Tiny controls and keyboard traps block task completion entirely.",
        color: "from-yellow-500 to-yellow-600",
    },
    {
        icon: Brain,
        title: "Cognitive",
        description: "Motion and inconsistent structure overload users with processing demands.",
        color: "from-purple-500 to-purple-600",
    },
    {
        icon: Users,
        title: "Older Adults",
        description: "Low contrast and missing focus indicators reduce usability to frustrating levels.",
        color: "from-blue-500 to-blue-600",
    },
    {
        icon: Clock,
        title: "Temporary Limits",
        description: "Injuries and situational barriers turn minor issues into complete blockers.",
        color: "from-teal-500 to-teal-600",
    },
]

const steps = [
    {
        number: "01",
        title: "Pick a Severity",
        description: "Start with Critical when you need to align executives fast, then move downward for cumulative friction.",
        icon: Crosshair,
    },
    {
        number: "02",
        title: "Run the Demo",
        description: "Use keyboard-only interaction and screen reader simulation to reproduce failure in under two minutes.",
        icon: Zap,
    },
    {
        number: "03",
        title: "Document Impact",
        description: "Capture user harm and business risk with WCAG reference tied to each scenario.",
        icon: FileText,
    },
    {
        number: "04",
        title: "Prioritize Fixes",
        description: "Move from isolated bug reports to sequenced remediation by user impact.",
        icon: TrendingUp,
    },
]

export default function HellPage() {
    const heroRef = useIntersectionObserver()
    const statsRef = useIntersectionObserver()
    const severityRef = useIntersectionObserver()
    const featuresRef = useIntersectionObserver()
    const personasRef = useIntersectionObserver()
    const stepsRef = useIntersectionObserver()
    const ctaRef = useIntersectionObserver()

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/20 dark:from-slate-950 dark:via-red-950/20 dark:to-slate-950">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-200/30 dark:bg-red-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-200/30 dark:bg-orange-600/10 rounded-full blur-3xl"></div>

                <div ref={heroRef} className="relative container-wide text-center">
                    <Badge className="bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30 mb-6 px-4 py-2 text-sm">
                        <Flame className="h-4 w-4 mr-2" />
                        Interactive Accessibility Failure Demos
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
                        Feel the{" "}
                        <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                            Breakdown
                        </span>
                        <br />
                        Before Users Do
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                        This is not a checklist. It&apos;s an impact cockpit for teams that need to show exactly
                        how inaccessible flows fail real people — with 21 fully modeled demos.
                    </p>

                    <blockquote className="text-lg text-slate-500 dark:text-slate-500 italic mb-10 max-w-2xl mx-auto border-l-4 border-red-400 dark:border-red-500/50 pl-6">
                        &quot;Every inaccessible interaction is a real person being excluded.&quot;
                    </blockquote>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl shadow-red-600/20 dark:shadow-red-900/30 group">
                            <a href="https://hell.accessibility.build" target="_blank" rel="noopener noreferrer">
                                <Flame className="mr-2 h-5 w-5" />
                                Launch A11y Hell
                                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-lg px-8 py-6 rounded-xl group">
                            <a href="https://hell.accessibility.build/issues" target="_blank" rel="noopener noreferrer">
                                <Search className="mr-2 h-5 w-5" />
                                Browse All Issues
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-16 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <div ref={statsRef} className="container-wide">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {[
                            { value: "96.3%", label: "Homepages Fail WCAG" },
                            { value: "1.3B", label: "People Impacted" },
                            { value: "$13T", label: "Spending Power" },
                            { value: "4,605", label: "Lawsuits in 2023" },
                            { value: "21", label: "Modeled Demos" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Severity Atlas */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950">
                <div ref={severityRef} className="container-wide">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-600/20 rounded-full mb-6">
                            <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Severity{" "}
                            <span className="bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">Atlas</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            Start where user harm is highest. Every issue is mapped by severity with WCAG references and reproducible test protocols.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {severityLevels.map((severity) => (
                            <Card key={severity.level} className={`group relative overflow-hidden ${severity.borderColor} border bg-white dark:bg-slate-900/80 hover:shadow-xl transition-all duration-500`}>
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${severity.color}`}></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge className={`${severity.badgeColor} text-white border-0`}>
                                            {severity.count} {severity.level}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">{severity.title}</CardTitle>
                                    <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
                                        {severity.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {severity.issues.slice(0, 3).map((issue) => (
                                        <div key={issue} className="flex items-center space-x-2">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${severity.color}`}></div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{issue}</span>
                                        </div>
                                    ))}
                                    {severity.issues.length > 3 && (
                                        <div className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                                            + {severity.issues.length - 3} more issues
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button asChild variant="outline" size="lg" className="border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-700 dark:hover:text-red-300 rounded-xl group">
                            <a href="https://hell.accessibility.build/issues" target="_blank" rel="noopener noreferrer">
                                Explore All 21 Issues
                                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Feature Showcase */}
            <section className="py-24 bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900">
                <div ref={featuresRef} className="container-wide">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-600/20 rounded-full mb-6">
                            <Zap className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Explore the{" "}
                            <span className="bg-gradient-to-r from-orange-600 to-yellow-500 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">Platform</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            Five specialized tools to help your team see, feel, and document accessibility failures before users hit them.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => {
                            const Icon = feature.icon
                            return (
                                <a
                                    key={feature.title}
                                    href={feature.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                >
                                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-500 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700">
                                        <CardHeader>
                                            <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl w-fit shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="h-7 w-7 text-white" />
                                            </div>
                                            <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2">
                                                {feature.title}
                                                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Who Gets Blocked */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900">
                <div ref={personasRef} className="container-wide">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-600/20 rounded-full mb-6">
                            <Users className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Real People,{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Repeated Barriers</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            These are not edge cases. They are everyday users blocked by avoidable interaction failures.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {personas.map((persona) => {
                            const Icon = persona.icon
                            return (
                                <Card key={persona.title} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-500 group hover:shadow-lg">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 bg-gradient-to-r ${persona.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <CardTitle className="text-lg text-slate-900 dark:text-white">{persona.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{persona.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
                <div ref={stepsRef} className="container-wide">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-600/20 rounded-full mb-6">
                            <Target className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            From Demo to Decision in{" "}
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">Four Moves</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            Run the demos with your team, capture the failures, and convert them into a remediation roadmap users can actually feel.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step) => {
                            const Icon = step.icon
                            return (
                                <div key={step.number} className="relative group">
                                    <div className="text-6xl font-bold text-slate-100 dark:text-slate-800 group-hover:text-slate-200 dark:group-hover:text-slate-700 transition-colors absolute -top-4 -left-2">
                                        {step.number}
                                    </div>
                                    <div className="relative pt-10 pl-4">
                                        <div className="p-2 bg-yellow-100 dark:bg-gradient-to-r dark:from-yellow-500/20 dark:to-orange-500/20 rounded-lg w-fit mb-4">
                                            <Icon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{step.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Practice Lab Highlight */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950">
                <div className="container-wide">
                    <div className="max-w-5xl mx-auto">
                        <Card className="border-orange-200 dark:border-orange-500/20 bg-gradient-to-br from-orange-50 via-white to-white dark:from-slate-900 dark:via-orange-950/10 dark:to-slate-900 overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                <div className="p-8 lg:p-12">
                                    <Badge className="bg-orange-100 dark:bg-orange-600/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30 mb-6">
                                        <Target className="h-3 w-3 mr-1" />
                                        Audit Practice Lab
                                    </Badge>
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                        Train Your Audit Skills
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                        Five realistic single-page scenarios with personas, time constraints, and hidden issues. Run the drill, find the problems, then reveal the official findings to benchmark your skills.
                                    </p>
                                    <div className="space-y-3 mb-8">
                                        {["Support Intake Crisis", "Enterprise Invoice Escalation", "Follow-Up Booking Deadline", "Checkout Under Shipping Cutoff", "Live Operations Alert Desk"].map((scenario) => (
                                            <div key={scenario} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-4 w-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-300 text-sm">{scenario}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button asChild className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl group">
                                        <a href="https://hell.accessibility.build/practice-lab" target="_blank" rel="noopener noreferrer">
                                            Open Practice Lab
                                            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>
                                    </Button>
                                </div>
                                <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-orange-100/50 to-red-100/30 dark:from-orange-600/5 dark:to-red-600/5">
                                    <div className="text-center space-y-6">
                                        <div className="text-8xl font-bold text-orange-300 dark:text-orange-500/20">5</div>
                                        <div className="text-slate-500 dark:text-slate-500 text-lg">Scenarios</div>
                                        <div className="text-5xl font-bold text-orange-300 dark:text-orange-500/20">20</div>
                                        <div className="text-slate-500 dark:text-slate-500 text-lg">Issues to Detect</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/20 dark:from-red-950/30 dark:via-slate-950 dark:to-orange-950/20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-200/20 dark:bg-red-600/5 rounded-full blur-3xl"></div>

                <div ref={ctaRef} className="relative container-wide text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-600/20 rounded-full mb-8">
                        <Flame className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                        See the barrier.{" "}
                        <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 dark:from-red-400 dark:via-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                            Feel the impact.
                        </span>
                        <br />
                        Fix with urgency.
                    </h2>

                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Build with visibility, not assumptions. Run the demos with your team and convert failures into a remediation roadmap.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg px-10 py-6 rounded-xl shadow-2xl shadow-red-600/20 dark:shadow-red-900/30 group">
                            <a href="https://hell.accessibility.build" target="_blank" rel="noopener noreferrer">
                                <Flame className="mr-2 h-5 w-5" />
                                Enter A11y Hell
                                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-lg px-10 py-6 rounded-xl group">
                            <a href="https://hell.accessibility.build/issues/critical" target="_blank" rel="noopener noreferrer">
                                Start with Critical
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-600">
                        An initiative by{" "}
                        <Link href="/" className="text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-4">
                            Accessibility.build
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )
}
