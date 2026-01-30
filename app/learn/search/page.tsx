'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, CheckCircle2, XCircle, AlertTriangle, Sparkles, Eye, EyeOff, Play, Info, Lightbulb, Code2, Keyboard, Users, Loader2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const sections = [
    { id: 'combobox', label: 'Combobox Pattern', icon: Search, color: 'bg-indigo-500', textColor: 'text-indigo-600' },
    { id: 'keyboard', label: 'Keyboard Controls', icon: Keyboard, color: 'bg-violet-500', textColor: 'text-violet-600' },
    { id: 'announcements', label: 'Announcements', icon: Users, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { id: 'states', label: 'Loading & Empty', icon: Loader2, color: 'bg-orange-500', textColor: 'text-orange-600' },
    { id: 'issues', label: 'Common Mistakes', icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-600' },
];

const sampleData = [
    { id: 1, name: 'aria-label', description: 'Provides an accessible name for an element' },
    { id: 2, name: 'aria-labelledby', description: 'References another element as the label' },
    { id: 3, name: 'aria-describedby', description: 'References an element with additional description' },
    { id: 4, name: 'aria-expanded', description: 'Indicates if a control is expanded or collapsed' },
    { id: 5, name: 'aria-hidden', description: 'Hides an element from screen readers' },
    { id: 6, name: 'aria-live', description: 'Creates a live region for dynamic announcements' },
    { id: 7, name: 'aria-modal', description: 'Indicates a dialog is modal' },
    { id: 8, name: 'aria-selected', description: 'Indicates the selected state of an item' },
];

export default function SearchPatternPage() {
    const [activeSection, setActiveSection] = useState('combobox');

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[100px]" />
                <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[100px]" />
            </div>

            <div className="relative pt-8 pb-6 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <Link href="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 group text-sm">
                        <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Learn Hub
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
                            <Search className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-1"><Sparkles className="w-3 h-3 mr-1" /> Comprehensive Guide</Badge>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Search & Autocomplete</h1>
                            <p className="text-slate-500 mt-1">Combobox patterns, keyboard navigation, and result announcements</p>
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
                        {activeSection === 'combobox' && <ComboboxPatternSection />}
                        {activeSection === 'keyboard' && <KeyboardControlsSection />}
                        {activeSection === 'announcements' && <AnnouncementsSection />}
                        {activeSection === 'states' && <LoadingEmptySection />}
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
            <div className="p-2 bg-indigo-100 rounded-lg h-fit"><Icon className="w-5 h-5 text-indigo-600" /></div>
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

function AccessibleAutocomplete() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [announcement, setAnnouncement] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const filteredResults = query.length > 0
        ? sampleData.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    useEffect(() => {
        if (filteredResults.length > 0 && query) {
            setAnnouncement(`${filteredResults.length} results available`);
            setIsOpen(true);
        } else if (query && filteredResults.length === 0) {
            setAnnouncement('No results found');
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
        setActiveIndex(-1);
    }, [query, filteredResults.length]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % filteredResults.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => prev <= 0 ? filteredResults.length - 1 : prev - 1);
                break;
            case 'Enter':
                if (activeIndex >= 0) {
                    setQuery(filteredResults[activeIndex].name);
                    setIsOpen(false);
                    setAnnouncement(`Selected: ${filteredResults[activeIndex].name}`);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setActiveIndex(-1);
                break;
        }
    }, [isOpen, activeIndex, filteredResults]);

    const selectItem = (item: typeof sampleData[0]) => {
        setQuery(item.name);
        setIsOpen(false);
        setAnnouncement(`Selected: ${item.name}`);
        inputRef.current?.focus();
    };

    return (
        <div className="relative">
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls="search-listbox"
                    aria-activedescendant={activeIndex >= 0 ? `option-${filteredResults[activeIndex]?.id}` : undefined}
                    aria-autocomplete="list"
                    aria-label="Search ARIA attributes"
                    placeholder="Search ARIA attributes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query && filteredResults.length > 0 && setIsOpen(true)}
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900"
                />
                {query && (
                    <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full" aria-label="Clear search">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        ref={listRef}
                        id="search-listbox"
                        role="listbox"
                        aria-label="Search results"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                    >
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item, index) => (
                                <li
                                    key={item.id}
                                    id={`option-${item.id}`}
                                    role="option"
                                    aria-selected={index === activeIndex}
                                    onClick={() => selectItem(item)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={cn("px-4 py-3 cursor-pointer transition-colors", index === activeIndex ? "bg-indigo-50 text-indigo-900" : "hover:bg-slate-50")}
                                >
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-slate-500">{item.description}</div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-6 text-center text-slate-500">No results found for "{query}"</li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

function ComboboxPatternSection() {
    return (
        <div className="space-y-10">
            <SectionHeader title="Combobox Pattern" description="Search with autocomplete uses the combobox pattern: an input combined with a popup listbox of suggestions. The key roles are combobox, listbox, and option." />

            <div className="grid md:grid-cols-3 gap-4">
                <KeyPoint icon={Search} title="role='combobox'">The input element gets role="combobox" (or use native input with aria-autocomplete="list").</KeyPoint>
                <KeyPoint icon={Info} title="aria-expanded">Set to "true" when suggestions popup is visible, "false" when hidden.</KeyPoint>
                <KeyPoint icon={Users} title="aria-activedescendant">Points to the ID of the currently highlighted option, so screen readers track focus.</KeyPoint>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-indigo-500" /> Interactive Demo</h3>
                <p className="text-slate-600 mb-4">Type to search ARIA attributes. Use arrow keys to navigate, Enter to select, Escape to close.</p>
                <AccessibleAutocomplete />
            </div>

            <CodeBlock title="Combobox Structure" code={`<div>
  <!-- Live region for announcements -->
  <div role="status" aria-live="polite" className="sr-only">
    {announcement}
  </div>

  <!-- Input with combobox role -->
  <input
    type="text"
    role="combobox"
    aria-expanded={isOpen}
    aria-controls="search-listbox"
    aria-activedescendant={activeId}
    aria-autocomplete="list"
    aria-label="Search"
  />

  <!-- Listbox popup -->
  {isOpen && (
    <ul id="search-listbox" role="listbox" aria-label="Search results">
      <li id="option-1" role="option" aria-selected={activeIndex === 0}>
        Result 1
      </li>
      <li id="option-2" role="option" aria-selected={activeIndex === 1}>
        Result 2
      </li>
    </ul>
  )}
</div>`} />

            <TipBox title="aria-activedescendant vs Focus" variant="info">
                Virtual focus (aria-activedescendant) keeps real focus on the input so users can keep typing while browsing results. The highlighted option is communicated visually and to screen readers, but keyboard focus stays in the input.
            </TipBox>
        </div>
    );
}

function KeyboardControlsSection() {
    return (
        <div className="space-y-10">
            <SectionHeader title="Keyboard Controls" description="Users must be able to navigate search results and select items using only the keyboard. Arrow keys navigate, Enter selects, Escape closes." />

            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100"><tr><th scope="col" className="p-4 text-left font-semibold">Key</th><th scope="col" className="p-4 text-left font-semibold">Action</th><th scope="col" className="p-4 text-left font-semibold">Notes</th></tr></thead>
                    <tbody>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">↓</td><td className="p-4">Move to next option</td><td className="p-4 text-slate-500">Wraps to first if at end</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">↑</td><td className="p-4">Move to previous option</td><td className="p-4 text-slate-500">Wraps to last if at start</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">Enter</td><td className="p-4">Select highlighted option</td><td className="p-4 text-slate-500">Fills input and closes listbox</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">Escape</td><td className="p-4">Close listbox</td><td className="p-4 text-slate-500">Keeps current input value</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">Tab</td><td className="p-4">Move to next field</td><td className="p-4 text-slate-500">Can optionally select current option first</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <KeyPoint icon={Keyboard} title="Arrow Key Wrapping">When at the last option, Down arrow should wrap to the first option. Up from first should go to last.</KeyPoint>
                <KeyPoint icon={Info} title="Type While Navigating">Focus stays on input. Users can arrow through options AND continue typing—both should work together.</KeyPoint>
            </div>

            <CodeBlock title="Keyboard Handler" code={`const handleKeyDown = (e: React.KeyboardEvent) => {
  if (!isOpen) return;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault(); // Prevent cursor moving in input
      setActiveIndex(prev => (prev + 1) % results.length);
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      setActiveIndex(prev => prev <= 0 ? results.length - 1 : prev - 1);
      break;
      
    case 'Enter':
      if (activeIndex >= 0) {
        selectOption(results[activeIndex]);
      }
      break;
      
    case 'Escape':
      setIsOpen(false);
      setActiveIndex(-1);
      break;
  }
};`} />

            <TipBox title="e.preventDefault() is Essential" variant="warning">Without <code>e.preventDefault()</code> on arrow keys, the cursor will jump around in the input field while you're trying to navigate options!</TipBox>
        </div>
    );
}

function AnnouncementsSection() {
    return (
        <div className="space-y-10">
            <SectionHeader title="Screen Reader Announcements" description="Screen reader users need to know: when results appear, how many there are, which is selected, and when something is chosen. Use live regions for all of these." />

            <div className="grid md:grid-cols-2 gap-4">
                <KeyPoint icon={Users} title="Result Count">Announce "5 results available" when the listbox opens with results. This sets expectations.</KeyPoint>
                <KeyPoint icon={Info} title="Active Option">aria-activedescendant tells screen readers which option is highlighted as you arrow through.</KeyPoint>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">What Screen Readers Should Announce</h3>
                <table className="w-full text-sm">
                    <thead><tr><th className="text-left p-2 font-semibold">Event</th><th className="text-left p-2 font-semibold">Announcement</th></tr></thead>
                    <tbody className="divide-y divide-emerald-200">
                        <tr><td className="p-2">Results load</td><td className="p-2 text-slate-600">"5 results available"</td></tr>
                        <tr><td className="p-2">Arrow to option</td><td className="p-2 text-slate-600">"aria-label, option 1 of 5"</td></tr>
                        <tr><td className="p-2">Select option</td><td className="p-2 text-slate-600">"Selected: aria-label"</td></tr>
                        <tr><td className="p-2">No results</td><td className="p-2 text-slate-600">"No results found"</td></tr>
                        <tr><td className="p-2">Loading</td><td className="p-2 text-slate-600">"Loading results..."</td></tr>
                    </tbody>
                </table>
            </div>

            <CodeBlock title="Announcement Patterns" code={`// Live region for announcements
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>

// When results change:
useEffect(() => {
  if (results.length > 0) {
    setAnnouncement(\`\${results.length} results available\`);
  } else if (query && !loading) {
    setAnnouncement('No results found');
  }
}, [results, query, loading]);

// When option is selected:
const selectOption = (option) => {
  setQuery(option.name);
  setIsOpen(false);
  setAnnouncement(\`Selected: \${option.name}\`);
};`} />

            <TipBox title="aria-live='polite' vs 'assertive'" variant="info">Use <code>polite</code> for most announcements (waits for screen reader to finish). Use <code>assertive</code> only for critical/urgent messages like errors.</TipBox>
        </div>
    );
}

function LoadingEmptySection() {
    const [demoState, setDemoState] = useState<'idle' | 'loading' | 'results' | 'empty'>('idle');

    return (
        <div className="space-y-10">
            <SectionHeader title="Loading & Empty States" description="When fetching results, show a loading indicator and announce it. When there are no results, be clear about it. Both states need visual and audible feedback." />

            <div className="grid md:grid-cols-2 gap-4">
                <KeyPoint icon={Loader2} title="Loading State">Show a spinner, announce "Loading results...", and consider disabling submit while loading.</KeyPoint>
                <KeyPoint icon={AlertTriangle} title="Empty State">Don't just show nothing. Display "No results for [query]" and announce it to screen readers.</KeyPoint>
            </div>

            <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">State Demos</h3>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => setDemoState('idle')}>Idle</Button>
                    <Button variant="outline" size="sm" onClick={() => setDemoState('loading')}>Loading</Button>
                    <Button variant="outline" size="sm" onClick={() => setDemoState('results')}>Results</Button>
                    <Button variant="outline" size="sm" onClick={() => setDemoState('empty')}>No Results</Button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Search..." value={demoState === 'empty' || demoState === 'results' ? "example query" : ""} readOnly
                            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900" />
                        {demoState === 'loading' && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="w-5 h-5 text-indigo-500 animate-spin" /></div>
                        )}
                    </div>

                    {demoState === 'loading' && (
                        <div className="mt-2 bg-slate-50 rounded-xl p-4 text-center" role="status" aria-live="polite">
                            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto mb-2" />
                            <span className="text-slate-600">Loading results...</span>
                        </div>
                    )}

                    {demoState === 'results' && (
                        <ul className="mt-2 bg-white rounded-xl border border-slate-200 divide-y">
                            <li className="p-3 hover:bg-slate-50 cursor-pointer"><strong>aria-label</strong><br /><span className="text-sm text-slate-500">Provides an accessible name</span></li>
                            <li className="p-3 hover:bg-slate-50 cursor-pointer"><strong>aria-describedby</strong><br /><span className="text-sm text-slate-500">References a description</span></li>
                        </ul>
                    )}

                    {demoState === 'empty' && (
                        <div className="mt-2 bg-amber-50 rounded-xl p-4 text-center border border-amber-200" role="status" aria-live="polite">
                            <span className="text-amber-700">No results found for "example query"</span>
                        </div>
                    )}
                </div>
            </div>

            <CodeBlock title="State Handling" code={`// Show loading state
{loading && (
  <div role="status" aria-live="polite" className="p-4 text-center">
    <Spinner />
    <span className="sr-only">Loading results...</span>
  </div>
)}

// Show empty state
{!loading && query && results.length === 0 && (
  <div role="status" aria-live="polite" className="p-4 text-center">
    No results found for "{query}"
  </div>
)}

// Debounce API calls to avoid excessive loading states
const debouncedSearch = useMemo(
  () => debounce((q) => fetchResults(q), 300),
  []
);`} />

            <TipBox title="Debounce Your Search" variant="success">Don't fire an API request on every keystroke. Debounce by 200-300ms to reduce loading states and server load.</TipBox>
        </div>
    );
}

function CommonIssuesSection() {
    const issues = [
        { bad: 'No role="combobox" on input', fix: 'Add role="combobox" with aria-expanded and aria-controls', severity: 'high', why: 'Screen readers don\'t understand this is an autocomplete.' },
        { bad: 'Missing aria-activedescendant', fix: 'Point to the ID of the currently highlighted option', severity: 'high', why: 'Screen readers can\'t track which option is selected.' },
        { bad: 'Listbox not associated with input', fix: 'Use aria-controls on input pointing to listbox ID', severity: 'high', why: 'Screen readers don\'t know input and listbox are related.' },
        { bad: 'No result count announcement', fix: 'Announce "X results available" via aria-live region', severity: 'high', why: 'Screen reader users don\'t know results appeared.' },
        { bad: 'Arrow keys move cursor in input', fix: 'Use e.preventDefault() in arrow key handler', severity: 'medium', why: 'Confusing—cursor jumps while trying to navigate.' },
        { bad: 'Escape doesn\'t close listbox', fix: 'Handle Escape key to close popup', severity: 'medium', why: 'Expected keyboard behavior is missing.' },
        { bad: 'Mouse click doesn\'t return focus to input', fix: 'Call inputRef.current.focus() after selection', severity: 'medium', why: 'Users can\'t continue typing after mouse selection.' },
        { bad: 'No loading or empty state feedback', fix: 'Show and announce loading/empty states', severity: 'medium', why: 'Users don\'t know if search is working.' },
    ];

    return (
        <div className="space-y-10">
            <SectionHeader title="Common Autocomplete Mistakes" description="Making autocomplete accessible is challenging. Here are the most common issues and their fixes." />
            <div className="space-y-4">
                {issues.map((issue, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className={cn("p-2 rounded-lg flex-shrink-0", issue.severity === 'high' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600')}><XCircle className="w-5 h-5" /></div>
                            <div className="flex-1 min-w-0">
                                <Badge variant="outline" className={cn("mb-2", issue.severity === 'high' ? 'border-orange-300 text-orange-600' : 'border-yellow-300 text-yellow-600')}>{issue.severity}</Badge>
                                <div className="text-red-600 line-through opacity-75 mb-1 text-sm">{issue.bad}</div>
                                <div className="text-green-700 flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span className="font-medium">{issue.fix}</span></div>
                                <p className="text-sm text-slate-500">{issue.why}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <TipBox title="Testing Checklist" variant="success">
                <ol className="list-decimal list-inside space-y-1">
                    <li>Type and verify results appear</li>
                    <li>Arrow through results—does SR announce each?</li>
                    <li>Press Enter—is selection announced?</li>
                    <li>Press Escape—does listbox close?</li>
                    <li>With SR: is result count announced?</li>
                    <li>Test no results and loading states</li>
                </ol>
            </TipBox>
        </div>
    );
}
