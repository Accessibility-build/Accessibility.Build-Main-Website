'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, CheckCircle2, XCircle, AlertTriangle, Sparkles, Eye, EyeOff, ChevronRight as ChevronRightIcon, Info, Lightbulb, Code2, Keyboard, Users, GalleryHorizontal, Circle, Zap, Monitor, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const sections = [
    { id: 'basics', label: 'Carousel Basics', icon: GalleryHorizontal, color: 'bg-rose-500', textColor: 'text-rose-600' },
    { id: 'controls', label: 'Controls & Indicators', icon: Circle, color: 'bg-violet-500', textColor: 'text-violet-600' },
    { id: 'keyboard', label: 'Keyboard Navigation', icon: Keyboard, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { id: 'motion', label: 'Reduced Motion', icon: Settings, color: 'bg-sky-500', textColor: 'text-sky-600' },
    { id: 'issues', label: 'Common Mistakes', icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-600' },
];

const slides = [
    { id: 1, title: 'Accessible Design', description: 'Building for everyone', color: 'from-blue-500 to-cyan-500' },
    { id: 2, title: 'Keyboard Navigation', description: 'Full control without a mouse', color: 'from-violet-500 to-purple-500' },
    { id: 3, title: 'Screen Reader Support', description: 'Meaningful announcements', color: 'from-rose-500 to-pink-500' },
    { id: 4, title: 'Motion Preferences', description: 'Respecting user choices', color: 'from-emerald-500 to-green-500' },
];

export default function CarouselsPatternPage() {
    const [activeSection, setActiveSection] = useState('basics');

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[100px]" />
                <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-[100px]" />
            </div>

            <div className="relative pt-8 pb-6 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <Link href="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors mb-4 group text-sm">
                        <ChevronRightIcon className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Learn Hub
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/25">
                            <GalleryHorizontal className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <Badge className="bg-rose-100 text-rose-700 border-rose-200 mb-1"><Sparkles className="w-3 h-3 mr-1" /> Comprehensive Guide</Badge>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Accessible Carousels</h1>
                            <p className="text-slate-500 mt-1">Auto-play controls, keyboard navigation, and motion preferences</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex overflow-x-auto gap-2 no-scrollbar">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button key={section.id} onClick={() => setActiveSection(section.id)}
                                    className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border-2",
                                        isActive ? `${section.color} text-white border-transparent shadow-lg` : `bg-white ${section.textColor} border-slate-200 hover:border-slate-300`
                                    )}>
                                    <Icon className="w-4 h-4" /> {section.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 py-10">
                <AnimatePresence mode="wait">
                    <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        {activeSection === 'basics' && <CarouselBasicsSection />}
                        {activeSection === 'controls' && <ControlsSection />}
                        {activeSection === 'keyboard' && <KeyboardNavSection />}
                        {activeSection === 'motion' && <ReducedMotionSection />}
                        {activeSection === 'issues' && <CommonIssuesSection />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function InteractiveDemo({ bad, good }: { bad: React.ReactNode; good: React.ReactNode }) {
    const [showGood, setShowGood] = useState(false);
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-full w-fit">
                <button onClick={() => setShowGood(false)} className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all", !showGood ? "bg-red-500 text-white shadow-md" : "text-slate-600 hover:text-slate-900")}><EyeOff className="w-4 h-4" /> Inaccessible</button>
                <button onClick={() => setShowGood(true)} className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all", showGood ? "bg-green-500 text-white shadow-md" : "text-slate-600 hover:text-slate-900")}><Eye className="w-4 h-4" /> Accessible</button>
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={showGood ? 'good' : 'bad'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className={cn("p-6 rounded-2xl border-2", showGood ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
                    {showGood ? good : bad}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
    return <div className="mb-8"><h2 className="text-3xl font-bold text-slate-900 mb-3">{title}</h2><p className="text-lg text-slate-600 max-w-4xl">{description}</p></div>;
}

function KeyPoint({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-rose-100 rounded-lg h-fit"><Icon className="w-5 h-5 text-rose-600" /></div>
            <div><h4 className="font-semibold text-slate-900 mb-1">{title}</h4><p className="text-sm text-slate-600">{children}</p></div>
        </div>
    );
}

function TipBox({ title, children, variant = 'info' }: { title: string; children: React.ReactNode; variant?: 'info' | 'warning' | 'success' }) {
    const styles = { info: 'bg-blue-50 border-blue-200 text-blue-800', warning: 'bg-amber-50 border-amber-200 text-amber-800', success: 'bg-green-50 border-green-200 text-green-800' };
    const icons = { info: Lightbulb, warning: AlertTriangle, success: CheckCircle2 };
    const Icon = icons[variant];
    return <div className={cn("p-4 rounded-xl border", styles[variant])}><div className="flex items-center gap-2 font-semibold mb-2"><Icon className="w-5 h-5" /> {title}</div><div className="text-sm">{children}</div></div>;
}

function CodeBlock({ code, title }: { code: string; title?: string }) {
    return (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            {title && <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2"><Code2 className="w-4 h-4" /> {title}</div>}
            <pre className="bg-slate-900 text-slate-100 p-4 overflow-x-auto text-sm"><code>{code}</code></pre>
        </div>
    );
}

function AccessibleCarousel({ autoPlay = false }: { autoPlay?: boolean }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [announcement, setAnnouncement] = useState('');
    const carouselRef = useRef<HTMLDivElement>(null);

    const goToSlide = useCallback((index: number) => {
        const newIndex = (index + slides.length) % slides.length;
        setCurrentSlide(newIndex);
        setAnnouncement(`Slide ${newIndex + 1} of ${slides.length}: ${slides[newIndex].title}`);
    }, []);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => goToSlide(currentSlide + 1), 4000);
        return () => clearInterval(interval);
    }, [isPlaying, currentSlide, goToSlide]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') { goToSlide(currentSlide - 1); setIsPlaying(false); }
        if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); setIsPlaying(false); }
    };

    return (
        <div ref={carouselRef} role="region" aria-roledescription="carousel" aria-label="Featured accessibility concepts" className="relative" onKeyDown={handleKeyDown}>
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</div>

            <div className="relative overflow-hidden rounded-xl">
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {slides.map((slide, idx) => (
                        <div key={slide.id} role="group" aria-roledescription="slide" aria-label={`${idx + 1} of ${slides.length}`}
                            className={cn("min-w-full p-8 h-48 flex flex-col justify-center bg-gradient-to-r", slide.color)} aria-hidden={idx !== currentSlide}>
                            <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                            <p className="text-white/80">{slide.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => { goToSlide(currentSlide - 1); setIsPlaying(false); }} aria-label="Previous slide" className="h-10 w-10">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause auto-play" : "Start auto-play"} className="h-10 w-10">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { goToSlide(currentSlide + 1); setIsPlaying(false); }} aria-label="Next slide" className="h-10 w-10">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex gap-2" role="tablist" aria-label="Slide indicators">
                    {slides.map((_, idx) => (
                        <button key={idx} role="tab" aria-selected={idx === currentSlide} aria-label={`Go to slide ${idx + 1}`}
                            onClick={() => { goToSlide(idx); setIsPlaying(false); }}
                            className={cn("w-3 h-3 rounded-full transition-all", idx === currentSlide ? "bg-rose-500 w-6" : "bg-slate-300 hover:bg-slate-400")} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CarouselBasicsSection() {
    return (
        <div className="space-y-10">
            <SectionHeader title="Carousel Fundamentals" description="Carousels (or sliders) show multiple pieces of content in a rotating sequence. The key ARIA roles are region, group for slides, and live regions for announcements." />
            <div className="grid md:grid-cols-3 gap-4">
                <KeyPoint icon={GalleryHorizontal} title="role='region'">Wrap the carousel in a region with aria-roledescription="carousel" to identify it as a carousel widget.</KeyPoint>
                <KeyPoint icon={Info} title="Slide Groups">Each slide should be role="group" with aria-roledescription="slide" and label like "1 of 4".</KeyPoint>
                <KeyPoint icon={Users} title="Live Announcements">Use aria-live="polite" to announce slide changes: "Slide 2 of 4: Title".</KeyPoint>
            </div>

            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-rose-500" /> Interactive Demo</h3>
                <p className="text-slate-600 mb-4">Use the arrow buttons or dots to navigate. Try pressing Left/Right arrow keys when focused on the carousel.</p>
                <AccessibleCarousel autoPlay={false} />
            </div>

            <CodeBlock title="Carousel Structure" code={`<div role="region" 
     aria-roledescription="carousel" 
     aria-label="Featured content">
  
  <!-- Live region for announcements -->
  <div role="status" aria-live="polite" className="sr-only">
    Slide 2 of 4: Keyboard Navigation
  </div>
  
  <!-- Slides container -->
  <div>
    <div role="group" 
         aria-roledescription="slide" 
         aria-label="1 of 4"
         aria-hidden="false">
      <!-- Visible slide content -->
    </div>
    <div role="group" 
         aria-roledescription="slide" 
         aria-label="2 of 4"
         aria-hidden="true">
      <!-- Hidden slide content -->
    </div>
  </div>
</div>`} />

            <TipBox title="Hide Non-Visible Slides" variant="info">Use <code>aria-hidden="true"</code> on slides that are not currently visible. This prevents screen readers from reading all slides at once.</TipBox>
        </div>
    );
}

function ControlsSection() {
    return (
        <div className="space-y-10">
            <SectionHeader title="Controls & Indicators" description="Carousels need Previous/Next buttons, a Play/Pause control for auto-play, and slide indicators. All controls must have accessible labels." />
            <div className="grid md:grid-cols-3 gap-4">
                <KeyPoint icon={ChevronLeft} title="Previous/Next Buttons">Use clear aria-labels like "Previous slide" and "Next slide". Don't rely on icons alone.</KeyPoint>
                <KeyPoint icon={Pause} title="Play/Pause Control">If auto-play is enabled, users MUST be able to pause it. This is a WCAG requirement.</KeyPoint>
                <KeyPoint icon={Circle} title="Slide Indicators">Dot indicators should have role="tablist" with each dot as role="tab" and aria-selected for current.</KeyPoint>
            </div>

            <div className="p-6 rounded-2xl bg-violet-50 border border-violet-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Control Buttons Pattern</h3>
                <div className="flex gap-4 flex-wrap">
                    <Button variant="outline" className="gap-2"><ChevronLeft className="w-4 h-4" /> <span className="sr-only">Previous slide</span></Button>
                    <Button variant="outline" className="gap-2"><Pause className="w-4 h-4" /> <span className="sr-only">Pause auto-play</span></Button>
                    <Button variant="outline" className="gap-2"><Play className="w-4 h-4" /> <span className="sr-only">Start auto-play</span></Button>
                    <Button variant="outline" className="gap-2"><span className="sr-only">Next slide</span><ChevronRight className="w-4 h-4" /></Button>
                </div>
                <p className="text-sm text-violet-600 mt-4">⬆️ These buttons have <code>sr-only</code> text inside for screen readers</p>
            </div>

            <CodeBlock title="Accessible Controls" code={`<!-- Previous/Next -->
<button aria-label="Previous slide">
  <ChevronLeft />
</button>
<button aria-label="Next slide">
  <ChevronRight />
</button>

<!-- Play/Pause (required for auto-play carousels!) -->
<button aria-label={isPlaying ? "Pause auto-play" : "Start auto-play"}>
  {isPlaying ? <Pause /> : <Play />}
</button>

<!-- Slide indicators as tabs -->
<div role="tablist" aria-label="Slide indicators">
  <button role="tab" aria-selected="true" aria-label="Slide 1">●</button>
  <button role="tab" aria-selected="false" aria-label="Slide 2">○</button>
  <button role="tab" aria-selected="false" aria-label="Slide 3">○</button>
</div>`} />

            <TipBox title="WCAG 2.2.2: Pause, Stop, Hide" variant="warning">Auto-playing content that lasts more than 5 seconds MUST have a mechanism to pause, stop, or hide. No exceptions!</TipBox>
        </div>
    );
}

function KeyboardNavSection() {
    return (
        <div className="space-y-10">
            <SectionHeader title="Keyboard Navigation" description="Users should be able to navigate slides using arrow keys and Tab through controls without getting trapped." />

            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100"><tr><th scope="col" className="p-4 text-left font-semibold">Key</th><th scope="col" className="p-4 text-left font-semibold">Action</th><th scope="col" className="p-4 text-left font-semibold">Notes</th></tr></thead>
                    <tbody>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">←</td><td className="p-4">Go to previous slide</td><td className="p-4 text-slate-500">Also pauses auto-play</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">→</td><td className="p-4">Go to next slide</td><td className="p-4 text-slate-500">Also pauses auto-play</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">Tab</td><td className="p-4">Move through controls</td><td className="p-4 text-slate-500">Prev → Play/Pause → Next → Dots</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">Enter/Space</td><td className="p-4">Activate focused control</td><td className="p-4 text-slate-500">Native button behavior</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <KeyPoint icon={Keyboard} title="Pause on Interaction">When a user presses an arrow key or clicks a control, pause auto-play. They're actively navigating.</KeyPoint>
                <KeyPoint icon={Monitor} title="Pause on Hover/Focus">Consider pausing auto-play when the carousel has focus or mouse hover, so users can read content.</KeyPoint>
            </div>

            <CodeBlock title="Arrow Key Handler" code={`const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowLeft':
      goToSlide(currentSlide - 1);
      setIsPlaying(false); // Pause auto-play
      break;
    case 'ArrowRight':
      goToSlide(currentSlide + 1);
      setIsPlaying(false);
      break;
  }
};

<div 
  role="region" 
  aria-roledescription="carousel"
  tabIndex={0}  // Make carousel focusable for arrow keys
  onKeyDown={handleKeyDown}
>
  ...
</div>`} />

            <TipBox title="Don't Create Keyboard Traps" variant="success">Users must be able to Tab past the carousel to reach content below it. Don't focus-trap inside the carousel region.</TipBox>
        </div>
    );
}

function ReducedMotionSection() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <div className="space-y-10">
            <SectionHeader title="Respecting Motion Preferences" description="Some users have vestibular disorders that make animations nauseating. CSS prefers-reduced-motion lets you detect and respect their preference." />

            <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">Your Current Setting</h3>
                <div className="flex items-center gap-3">
                    <div className={cn("w-4 h-4 rounded-full", prefersReducedMotion ? "bg-amber-500" : "bg-green-500")} />
                    <span className="font-medium text-slate-700">
                        {prefersReducedMotion ? "You have reduced motion enabled" : "Standard motion (no reduction)"}
                    </span>
                </div>
                <p className="text-sm text-slate-600">
                    {prefersReducedMotion
                        ? "Your OS is set to reduce motion. Accessible carousels should disable auto-play and reduce animation."
                        : "To test reduced motion: System Preferences → Accessibility → Display → Reduce motion"}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <KeyPoint icon={Settings} title="Disable Auto-Play">When prefers-reduced-motion is enabled, disable auto-play entirely. Let users control navigation manually.</KeyPoint>
                <KeyPoint icon={Zap} title="Reduce Transitions">Replace sliding animations with instant cuts, or use very subtle fade effects instead of motion.</KeyPoint>
            </div>

            <CodeBlock title="Detecting Motion Preference" code={`// Check on mount
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

useEffect(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mq.matches);
  
  // Listen for changes
  const handler = (e) => setPrefersReducedMotion(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}, []);

// In carousel:
useEffect(() => {
  if (prefersReducedMotion) {
    setIsPlaying(false); // Disable auto-play
  }
}, [prefersReducedMotion]);

// In CSS:
@media (prefers-reduced-motion: reduce) {
  .carousel-slide {
    transition: none; /* Instant change, no animation */
  }
}`} />

            <TipBox title="CSS-Only Approach" variant="info">
                You can also handle this purely in CSS:
                <code className="block mt-2 bg-blue-100 p-2 rounded text-xs">
                    @media (prefers-reduced-motion: reduce) {'{'} .carousel {'{'} animation: none; {'}'} {'}'}
                </code>
            </TipBox>
        </div>
    );
}

function CommonIssuesSection() {
    const issues = [
        { bad: 'Auto-play with no pause control', fix: 'Always provide a visible play/pause button', severity: 'critical', why: 'WCAG 2.2.2 requires mechanisms to pause auto-playing content.' },
        { bad: 'No keyboard navigation', fix: 'Add arrow key support and ensure controls are focusable', severity: 'critical', why: 'Keyboard-only users cannot navigate the carousel.' },
        { bad: 'No slide change announcements', fix: 'Use aria-live="polite" to announce current slide', severity: 'high', why: 'Screen reader users don\'t know the content changed.' },
        { bad: 'All slides readable at once to SR', fix: 'Use aria-hidden="true" on non-visible slides', severity: 'high', why: 'Screen readers will read all slides sequentially.' },
        { bad: 'Arrow buttons have no labels', fix: 'Add aria-label="Previous slide" and "Next slide"', severity: 'high', why: 'Screen readers just say "button" with no context.' },
        { bad: 'Ignoring prefers-reduced-motion', fix: 'Disable auto-play and reduce animations when set', severity: 'high', why: 'Can cause nausea for users with vestibular disorders.' },
        { bad: 'Focus gets lost during slide transitions', fix: 'Keep focus on controls, don\'t move it during transitions', severity: 'medium', why: 'Disorienting for keyboard users.' },
        { bad: 'Dot indicators have no accessible names', fix: 'Add role="tab" and aria-label="Slide 1"', severity: 'medium', why: 'Dots are meaningless without labels.' },
    ];

    return (
        <div className="space-y-10">
            <SectionHeader title="Common Carousel Mistakes" description="Carousels are notoriously difficult to make accessible. Here are the most common issues and how to fix them." />
            <div className="space-y-4">
                {issues.map((issue, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className={cn("p-2 rounded-lg flex-shrink-0", issue.severity === 'critical' ? 'bg-red-100 text-red-600' : issue.severity === 'high' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600')}><XCircle className="w-5 h-5" /></div>
                            <div className="flex-1 min-w-0">
                                <Badge variant="outline" className={cn("mb-2", issue.severity === 'critical' ? 'border-red-300 text-red-600' : issue.severity === 'high' ? 'border-orange-300 text-orange-600' : 'border-yellow-300 text-yellow-600')}>{issue.severity}</Badge>
                                <div className="text-red-600 line-through opacity-75 mb-1 text-sm">{issue.bad}</div>
                                <div className="text-green-700 flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span className="font-medium">{issue.fix}</span></div>
                                <p className="text-sm text-slate-500">{issue.why}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <TipBox title="Consider: Do You Need a Carousel?" variant="warning">Studies show users often ignore carousels. Before building one, ask: would a static layout or simple tabs serve the content better? The most accessible carousel is no carousel.</TipBox>
        </div>
    );
}
