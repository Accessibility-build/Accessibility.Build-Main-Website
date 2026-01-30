'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle2, XCircle, Plus, AlertTriangle, ArrowDown, Loader2, ListOrdered, Database, Sparkles, Eye, EyeOff, Play, Zap, MousePointer, Info, Lightbulb, Code2, Keyboard, Users, Focus, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const generateItems = (count: number, startId: number = 1) => Array.from({ length: count }, (_, i) => ({
  id: startId + i,
  title: `Understanding WCAG Criterion ${(startId + i) % 50 + 1}.${(startId + i) % 4 + 1}`,
  excerpt: `A comprehensive guide to implementing and testing accessibility requirements for modern web applications. Learn the principles and techniques.`,
  date: new Date(2024, (startId + i) % 12, ((startId + i) % 28) + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}));

const sections = [
  { id: 'basic', label: 'Numbered Pages', icon: ListOrdered, color: 'bg-violet-500', textColor: 'text-violet-600' },
  { id: 'infinite', label: 'Infinite Scroll', icon: ArrowDown, color: 'bg-blue-500', textColor: 'text-blue-600' },
  { id: 'loadmore', label: 'Load More', icon: Plus, color: 'bg-green-500', textColor: 'text-green-600' },
  { id: 'cursor', label: 'Cursor Pagination', icon: Database, color: 'bg-orange-500', textColor: 'text-orange-600' },
  { id: 'issues', label: 'Common Mistakes', icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-600' },
];

export default function PaginationPatternPage() {
  const [activeSection, setActiveSection] = useState('basic');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative pt-8 pb-6 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <Link href="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors mb-4 group text-sm">
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Learn Hub
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/25">
              <ListOrdered className="w-8 h-8 text-white" />
            </div>
            <div>
              <Badge className="bg-violet-100 text-violet-700 border-violet-200 mb-1"><Sparkles className="w-3 h-3 mr-1" /> Comprehensive Guide</Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Accessible Pagination Patterns</h1>
              <p className="text-slate-500 mt-1">Every pattern from classic page numbers to infinite scroll</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
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

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {activeSection === 'basic' && <BasicPaginationSection />}
            {activeSection === 'infinite' && <InfiniteScrollSection />}
            {activeSection === 'loadmore' && <LoadMoreSection />}
            {activeSection === 'cursor' && <CursorPaginationSection />}
            {activeSection === 'issues' && <CommonIssuesSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============== REUSABLE COMPONENTS ==============

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
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-lg text-slate-600 max-w-4xl">{description}</p>
    </div>
  );
}

function KeyPoint({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-2 bg-violet-100 rounded-lg h-fit"><Icon className="w-5 h-5 text-violet-600" /></div>
      <div><h4 className="font-semibold text-slate-900 mb-1">{title}</h4><p className="text-sm text-slate-600">{children}</p></div>
    </div>
  );
}

function TipBox({ title, children, variant = 'info' }: { title: string; children: React.ReactNode; variant?: 'info' | 'warning' | 'success' }) {
  const styles = { info: 'bg-blue-50 border-blue-200 text-blue-800', warning: 'bg-amber-50 border-amber-200 text-amber-800', success: 'bg-green-50 border-green-200 text-green-800' };
  const icons = { info: Lightbulb, warning: AlertTriangle, success: CheckCircle2 };
  const Icon = icons[variant];
  return (
    <div className={cn("p-4 rounded-xl border", styles[variant])}>
      <div className="flex items-center gap-2 font-semibold mb-2"><Icon className="w-5 h-5" /> {title}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {title && <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2"><Code2 className="w-4 h-4" /> {title}</div>}
      <pre className="bg-slate-900 text-slate-100 p-4 overflow-x-auto text-sm"><code>{code}</code></pre>
    </div>
  );
}

// ============== SECTIONS ==============

function BasicPaginationSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [announcement, setAnnouncement] = useState('');
  const totalPages = 10;

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setAnnouncement(`Page ${page} of ${totalPages}`);
  };

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Classic Numbered Pagination" 
        description="The most common pagination pattern. The key ingredients: wrap in a <nav> landmark, use proper list structure, and indicate the current page with aria-current."
      />

      <div className="grid md:grid-cols-3 gap-4">
        <KeyPoint icon={Info} title="<nav> Landmark">
          Wrapping pagination in <code>&lt;nav aria-label="Pagination"&gt;</code> creates a landmark that screen reader users can jump to directly.
        </KeyPoint>
        <KeyPoint icon={Keyboard} title="aria-current='page'">
          This attribute tells screen readers which page is currently active. Without it, users only know visually which page is selected.
        </KeyPoint>
        <KeyPoint icon={Users} title="Descriptive Labels">
          Use <code>aria-label="Go to page 3"</code> on buttons. Generic "3" labels don't explain what the button does.
        </KeyPoint>
      </div>

      {/* Interactive Demo */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-violet-500" /> Try It Yourself</h3>
        <InteractiveDemo
          bad={<div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600 text-sm mb-4"><AlertTriangle className="w-4 h-4" /> <strong>Problem:</strong> No landmark, no list structure, no aria-current!</div>
            <div className="flex items-center justify-center gap-1 bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-slate-100 text-slate-500"><ChevronLeft className="w-5 h-5" /></div>
              {[1, 2, 3].map((p) => (<div key={p} className={cn("w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer text-sm", p === 1 ? "bg-violet-500 text-white" : "hover:bg-slate-100 text-slate-700")}>{p}</div>))}
              <div className="px-2 text-slate-400">...</div>
              <div className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-slate-100 text-slate-700">10</div>
              <div className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-slate-100 text-slate-500"><ChevronRight className="w-5 h-5" /></div>
            </div>
            <p className="text-sm text-red-600 mt-3">❌ VoiceOver: "1, 2, 3, 10" — no context that these are page numbers!</p>
          </div>}
          good={<div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-4"><CheckCircle2 className="w-4 h-4" /> <strong>Solution:</strong> Proper nav, list, and aria-current!</div>
            
            {/* Live region for page change announcements */}
            <div role="status" aria-live="polite" className="sr-only">{announcement}</div>
            
            <nav aria-label="Pagination" className="flex justify-center bg-white rounded-xl p-4 border border-slate-200">
              <ul className="flex items-center gap-1">
                <li>
                  <Button variant="ghost" size="icon" disabled={currentPage === 1} onClick={() => goToPage(Math.max(1, currentPage - 1))} aria-label="Go to previous page" className="h-10 w-10">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </li>
                {getVisiblePages().map((page, idx) => page === 'ellipsis' ? (
                  <li key={`e-${idx}`} className="px-2 text-slate-400" aria-hidden="true"><MoreHorizontal className="w-4 h-4" /></li>
                ) : (
                  <li key={page}>
                    <Button 
                      variant={currentPage === page ? "default" : "ghost"} 
                      size="icon" 
                      onClick={() => goToPage(page)} 
                      aria-current={currentPage === page ? "page" : undefined} 
                      aria-label={`Go to page ${page}${currentPage === page ? ', current page' : ''}`}
                      className={cn("h-10 w-10", currentPage === page && "bg-violet-500 hover:bg-violet-600 shadow-md")}
                    >
                      {page}
                    </Button>
                  </li>
                ))}
                <li>
                  <Button variant="ghost" size="icon" disabled={currentPage === totalPages} onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} aria-label="Go to next page" className="h-10 w-10">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </li>
              </ul>
            </nav>
            <p className="text-sm text-green-600 text-center mt-3">✅ VoiceOver: "Pagination, navigation. List 7 items. Go to page 1, current page, button."</p>
          </div>}
        />
      </div>

      {/* Code Examples */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700"><XCircle className="w-5 h-5" /> Don't: Divs with Click Handlers</h3>
          <CodeBlock code={`<!-- ❌ INACCESSIBLE -->
<div class="pagination">
  <div onclick="prevPage()">‹</div>
  <div onclick="goToPage(1)" class="active">1</div>
  <div onclick="goToPage(2)">2</div>
  <div onclick="goToPage(3)">3</div>
  <div onclick="nextPage()">›</div>
</div>

<!-- Problems:
- No keyboard access (divs aren't focusable)
- No landmark for navigation
- No indication of current page
- Screen reader can't understand structure -->`} />
        </div>
        <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700"><CheckCircle2 className="w-5 h-5" /> Do: Semantic Navigation</h3>
          <CodeBlock code={`<!-- ✅ ACCESSIBLE -->
<nav aria-label="Pagination">
  <ul>
    <li>
      <button aria-label="Previous page">‹</button>
    </li>
    <li>
      <button aria-current="page" aria-label="Page 1, current">
        1
      </button>
    </li>
    <li>
      <button aria-label="Go to page 2">2</button>
    </li>
    <li>
      <button aria-label="Next page">›</button>
    </li>
  </ul>
</nav>`} />
        </div>
      </div>

      <TipBox title="Announce Page Changes in SPAs" variant="info">
        In single-page applications, the page doesn't reload when changing pages. Use a live region to announce "Page 3 of 10" or update the document title to include the current page number.
      </TipBox>

      <TipBox title="Ellipsis is Decorative" variant="warning">
        The "..." (ellipsis) between page numbers is purely visual. Add <code>aria-hidden="true"</code> to hide it from screen readers—it adds no useful information.
      </TipBox>
    </div>
  );
}

function InfiniteScrollSection() {
  const [items, setItems] = useState(() => generateItems(4));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setStatusMessage('Loading more articles...');
    setTimeout(() => {
      setItems((prev) => [...prev, ...generateItems(4, prev.length + 1)]);
      setLoading(false);
      setStatusMessage(`${items.length + 4} articles loaded`);
      if (items.length >= 12) setHasMore(false);
    }, 1000);
  }, [loading, hasMore, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.5 });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Infinite Scroll Pattern" 
        description="Content loads automatically as users scroll. While popular, this pattern has significant accessibility challenges that require careful handling."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <KeyPoint icon={AlertTriangle} title="Focus Management Challenge">
          When new items load, focus should NOT jump around. The user should stay where they are in the content flow.
        </KeyPoint>
        <KeyPoint icon={Users} title="Live Region Required">
          Screen readers can't see new content appearing. You MUST announce "Loading..." and "X items loaded" via aria-live region.
        </KeyPoint>
        <KeyPoint icon={Info} title="No Clear Boundary">
          Users don't know how much content exists. Consider showing "Showing 12 of 50 articles" or similar context.
        </KeyPoint>
        <KeyPoint icon={Keyboard} title="Provide Alternative">
          Some users can't use infinite scroll effectively. Provide a "View All" link or traditional pagination as fallback.
        </KeyPoint>
      </div>

      {/* Live Demo */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 p-6 rounded-2xl bg-blue-50 border border-blue-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-blue-500" /> Interactive Demo</h3>
          <p className="text-slate-600 mb-4">Scroll down in this container to load more articles. Watch the status announcements below.</p>
          
          {/* Live region for screen reader announcements */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{statusMessage}</div>
          
          <div className="max-h-[400px] overflow-y-auto rounded-xl bg-white border border-slate-200 p-4 space-y-3">
            {items.map((item, idx) => (
              <motion.article key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group bg-slate-50">
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 mb-2">{item.excerpt}</p>
                <span className="text-xs text-slate-400">{item.date}</span>
              </motion.article>
            ))}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-6">
                {loading && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Loading more...</span>
                  </div>
                )}
              </div>
            )}
            {!hasMore && <div className="text-center py-4 text-slate-500 text-sm">✅ All {items.length} articles loaded</div>}
          </div>

          {/* Visual status indicator */}
          <div className="mt-4 px-4 py-2 bg-blue-100 rounded-lg text-blue-700 text-sm">
            <strong>Status:</strong> {loading ? 'Loading...' : `${items.length} articles loaded`}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <TipBox title="Critical: Announce Loading States" variant="warning">
            Screen reader users have no idea new content is loading unless you tell them. Use an aria-live region:
            <code className="block mt-2 bg-amber-100 p-2 rounded text-xs">
              &lt;div role="status" aria-live="polite"&gt;{'{'}loading ? 'Loading...' : 'Done'{'}'}&lt;/div&gt;
            </code>
          </TipBox>

          <CodeBlock title="Essential Pattern" code={`// Hidden live region for announcements
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {loading 
    ? 'Loading more articles...' 
    : \`\${items.length} articles loaded\`}
</div>

// Intersection Observer trigger
<div ref={loadMoreRef}>
  {loading && <Spinner />}
</div>`} />
        </div>
      </div>

      <TipBox title="Consider Avoiding Infinite Scroll" variant="info">
        Infinite scroll can be frustrating for many users—not just those using assistive technology. Users can't bookmark a position, can't easily return to where they were, and may have trouble reaching the footer. Consider "Load More" buttons instead.
      </TipBox>
    </div>
  );
}

function LoadMoreSection() {
  const [items, setItems] = useState(() => generateItems(3));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const newItemRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleLoadMore = () => {
    setLoading(true);
    setStatusMessage('Loading more articles...');
    setTimeout(() => {
      const newItems = generateItems(3, items.length + 1);
      setItems((prev) => [...prev, ...newItems]);
      setLoading(false);
      setStatusMessage(`Loaded ${newItems.length} new articles. ${items.length + 3} total.`);
      if (items.length >= 9) setHasMore(false);
      // Move focus to first new item after render
      setTimeout(() => {
        newItemRef.current?.focus();
      }, 100);
    }, 1000);
  };

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Load More Button Pattern" 
        description="A more accessible alternative to infinite scroll. Users explicitly request more content, and you have a clear opportunity for focus management."
      />

      <div className="grid md:grid-cols-3 gap-4">
        <KeyPoint icon={MousePointer} title="User-Initiated">
          Unlike infinite scroll, the user decides when to load more. This gives them control and predictability.
        </KeyPoint>
        <KeyPoint icon={Focus} title="Focus Management">
          After loading, move focus to the first new item. This helps keyboard and screen reader users find the new content.
        </KeyPoint>
        <KeyPoint icon={Users} title="Clear Announcements">
          Announce "Loading..." when clicked, then "Loaded 10 new articles" when complete. Users need to know what happened.
        </KeyPoint>
      </div>

      {/* Live Demo */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 p-6 rounded-2xl bg-green-50 border border-green-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-green-500" /> Interactive Demo</h3>
          <p className="text-slate-600 mb-4">Click "Load More" and notice how <strong>focus moves to the first new article</strong>. This is critical for accessibility!</p>
          
          {/* Live region */}
          <div role="status" aria-live="polite" className="sr-only">{statusMessage}</div>
          
          <div className="space-y-3">
            {items.map((item, idx) => {
              const isFirstNewItem = idx === items.length - 3 && items.length > 3;
              return (
                <motion.article 
                  key={item.id} 
                  ref={isFirstNewItem ? newItemRef : undefined}
                  tabIndex={isFirstNewItem ? -1 : undefined}
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: idx * 0.03 }}
                  className={cn(
                    "p-4 bg-white rounded-xl border border-slate-200 hover:border-green-300 transition-all cursor-pointer shadow-sm",
                    "focus:ring-2 focus:ring-green-500 focus:outline-none"
                  )}
                >
                  <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 mb-2">{item.excerpt}</p>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </motion.article>
              );
            })}
          </div>
          
          {hasMore ? (
            <div className="flex justify-center mt-6">
              <Button onClick={handleLoadMore} disabled={loading} size="lg" className="gap-2 bg-green-500 hover:bg-green-600">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</> : <><Plus className="w-5 h-5" /> Load More Articles</>}
              </Button>
            </div>
          ) : (
            <div className="text-center mt-6 text-slate-500">✅ All {items.length} articles loaded</div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <TipBox title="Focus Management is Critical" variant="success">
            The key to making "Load More" accessible: after new content loads, move focus to the first new item. The item needs <code>tabIndex="-1"</code> to be focusable.
          </TipBox>

          <CodeBlock title="Focus Pattern" code={`// Reference to first new item
const newItemRef = useRef(null);

const handleLoadMore = async () => {
  setLoading(true);
  const newItems = await fetchMore();
  setItems([...items, ...newItems]);
  setLoading(false);
  
  // After state updates and render
  setTimeout(() => {
    newItemRef.current?.focus();
  }, 100);
};

// First new item needs tabIndex
<article
  ref={isFirstNewItem ? newItemRef : null}
  tabIndex={isFirstNewItem ? -1 : undefined}
>
  ...
</article>`} />

          <TipBox title="Button State During Loading" variant="info">
            Disable the button and change text to "Loading..." while fetching. This prevents double-clicks and tells screen readers the action is in progress.
          </TipBox>
        </div>
      </div>
    </div>
  );
}

function CursorPaginationSection() {
  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Cursor/Keyset Pagination" 
        description="A backend pattern for efficiently paginating large datasets. The frontend accessibility requirements remain the same—it's about HOW you fetch data, not how you display it."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <KeyPoint icon={Database} title="What is Cursor Pagination?">
          Instead of "give me page 5", you say "give me 10 items after this cursor token". More efficient for databases and handles real-time data changes.
        </KeyPoint>
        <KeyPoint icon={RotateCcw} title="Limitation: No Page Jumping">
          Users can only go forward/backward, not jump to page 50. This usually means using "Load More" or "Next/Previous" UI patterns.
        </KeyPoint>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-orange-500" /> How It Works</h3>
          <p className="text-slate-600 mb-4">The API response includes a cursor token pointing to the next batch of results.</p>
          <CodeBlock title="API Response" code={`// First request
GET /api/articles?limit=10

// Response
{
  "data": [...10 articles...],
  "nextCursor": "eyJpZCI6MTAsInRzIjoxNzA0MDY3MjAwfQ==",
  "hasMore": true
}

// Next request uses the cursor
GET /api/articles?limit=10&cursor=eyJpZCI6MTAsIn...

// The cursor encodes position info (like last ID or timestamp)
// Server uses it to fetch the next batch efficiently`} />
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Frontend Accessibility</h3>
          <p className="text-slate-600 mb-4">The backend pagination method doesn't change your accessibility requirements:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Same ARIA patterns apply</strong>
                <p className="text-sm text-slate-600">Use nav landmarks, aria-label, proper button semantics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Still need live regions</strong>
                <p className="text-sm text-slate-600">Announce loading states and when new content arrives</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Focus management still required</strong>
                <p className="text-sm text-slate-600">Move focus to new content after loading</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Often paired with "Load More" UI</strong>
                <p className="text-sm text-slate-600">Since you can't jump to page N, Load More is a natural fit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TipBox title="Cursor Pagination Benefits" variant="success">
        <ul className="list-disc list-inside space-y-1">
          <li>More efficient for large datasets (no OFFSET slowdown)</li>
          <li>Handles items being added/removed between requests</li>
          <li>Better for real-time feeds where order matters</li>
          <li>Common in GraphQL APIs (Relay-style connections)</li>
        </ul>
      </TipBox>

      <TipBox title="When to Use Numbered Pages Instead" variant="info">
        If users need to jump to specific pages (e.g., legal documents, book chapters, search results), offset-based pagination with numbered pages may be more appropriate despite being less efficient.
      </TipBox>
    </div>
  );
}

function CommonIssuesSection() {
  const issues = [
    { bad: 'Using <div> elements with onClick instead of <button>', fix: 'Use semantic <button> elements for pagination controls', severity: 'critical', why: 'Divs are not focusable or activatable with keyboard by default.' },
    { bad: 'Missing <nav> landmark wrapper', fix: 'Wrap pagination in <nav aria-label="Pagination">', severity: 'high', why: 'Screen reader users can\'t jump to pagination without a landmark.' },
    { bad: 'Icon-only buttons without accessible labels', fix: 'Add aria-label="Previous page" or "Next page"', severity: 'critical', why: 'Screen readers will say "button" with no indication of what it does.' },
    { bad: 'Color-only indication of current page', fix: 'Use aria-current="page" attribute on current page button', severity: 'high', why: 'Color-blind users and screen reader users can\'t perceive color differences.' },
    { bad: 'Removing disabled buttons from DOM', fix: 'Keep disabled buttons with disabled attribute + aria-disabled', severity: 'medium', why: 'Users need to know Previous exists even on page 1.' },
    { bad: 'No announcement when page changes in SPA', fix: 'Use aria-live region or update document title', severity: 'high', why: 'Screen reader users don\'t know content has changed without an announcement.' },
    { bad: 'Infinite scroll with no loading announcements', fix: 'Announce "Loading..." and "X items loaded" via aria-live', severity: 'critical', why: 'Screen reader users have no idea new content appeared.' },
    { bad: 'Focus lost after loading new content', fix: 'Move focus to first new item (with tabIndex=-1)', severity: 'high', why: 'Users lose their place and have to navigate from the top again.' },
    { bad: 'Truncated page numbers (ellipsis) announced to screen readers', fix: 'Hide ellipsis with aria-hidden="true"', severity: 'low', why: 'Announcing "ellipsis" provides no useful information.' },
    { bad: 'No keyboard trap escape for infinite scroll', fix: 'Ensure users can Tab past the loading content', severity: 'medium', why: 'Users might get stuck if infinite scroll keeps loading above footer.' },
  ];

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Common Pagination Mistakes" 
        description="These are the most frequent accessibility issues we encounter. Use this as a checklist when implementing or reviewing pagination."
      />

      <div className="space-y-4">
        {issues.map((issue, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className={cn("p-2 rounded-lg flex-shrink-0", 
                issue.severity === 'critical' ? 'bg-red-100 text-red-600' : 
                issue.severity === 'high' ? 'bg-orange-100 text-orange-600' : 
                issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-slate-100 text-slate-600'
              )}>
                <XCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={cn(
                    issue.severity === 'critical' ? 'border-red-300 text-red-600' : 
                    issue.severity === 'high' ? 'border-orange-300 text-orange-600' : 
                    issue.severity === 'medium' ? 'border-yellow-300 text-yellow-600' :
                    'border-slate-300 text-slate-600'
                  )}>
                    {issue.severity}
                  </Badge>
                </div>
                <div className="text-red-600 line-through opacity-75 mb-1 text-sm">{issue.bad}</div>
                <div className="text-green-700 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> 
                  <span className="font-medium">{issue.fix}</span>
                </div>
                <p className="text-sm text-slate-500">{issue.why}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <TipBox title="Testing Checklist" variant="success">
        <ol className="list-decimal list-inside space-y-1">
          <li>Navigate pagination with Tab key—can you reach all controls?</li>
          <li>Activate buttons with Enter and Space—do they work?</li>
          <li>Test with VoiceOver/NVDA—is the current page announced?</li>
          <li>Navigate to a navigation landmark—does Pagination appear?</li>
          <li>Check that disabled buttons are still perceivable</li>
          <li>For Load More: does focus move to new content?</li>
          <li>For infinite scroll: are loading states announced?</li>
        </ol>
      </TipBox>
    </div>
  );
}
