'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown, CheckCircle2, XCircle, AlertTriangle, Edit3, X, Save, Smartphone, Monitor, Table as TableIcon, ListChecks, Pencil, Sparkles, Eye, EyeOff, Play, Zap, ChevronRight, Info, Lightbulb, Code2, Keyboard, MousePointer, Users, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface Employee {
  id: number; name: string; role: string; department: string; status: 'Active' | 'Offline' | 'Busy'; salary: number;
}

const sampleData: Employee[] = [
  { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', department: 'Engineering', status: 'Active', salary: 95000 },
  { id: 2, name: 'Bob Smith', role: 'Product Manager', department: 'Product', status: 'Busy', salary: 110000 },
  { id: 3, name: 'Carol Williams', role: 'UX Designer', department: 'Design', status: 'Offline', salary: 85000 },
  { id: 4, name: 'David Brown', role: 'Data Analyst', department: 'Analytics', status: 'Active', salary: 78000 },
  { id: 5, name: 'Emma Davis', role: 'Backend Developer', department: 'Engineering', status: 'Active', salary: 102000 },
];

const sections = [
  { id: 'basic', label: 'Semantic Tables', icon: TableIcon, color: 'bg-blue-500', textColor: 'text-blue-600' },
  { id: 'sortable', label: 'Sortable Tables', icon: ArrowUpDown, color: 'bg-violet-500', textColor: 'text-violet-600' },
  { id: 'responsive', label: 'Responsive Design', icon: Smartphone, color: 'bg-orange-500', textColor: 'text-orange-600' },
  { id: 'selectable', label: 'Row Selection', icon: ListChecks, color: 'bg-green-500', textColor: 'text-green-600' },
  { id: 'editable', label: 'Inline Editing', icon: Pencil, color: 'bg-pink-500', textColor: 'text-pink-600' },
  { id: 'issues', label: 'Common Mistakes', icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-600' },
];

export default function TablePatternPage() {
  const [activeSection, setActiveSection] = useState('basic');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative pt-8 pb-6 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <Link href="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-4 group text-sm">
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Learn Hub
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
              <TableIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-1"><Sparkles className="w-3 h-3 mr-1" /> Comprehensive Guide</Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Accessible Data Tables</h1>
              <p className="text-slate-500 mt-1">Master every aspect of building tables that work for everyone</p>
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
            {activeSection === 'basic' && <BasicTableSection />}
            {activeSection === 'sortable' && <SortableTableSection />}
            {activeSection === 'responsive' && <ResponsiveTableSection />}
            {activeSection === 'selectable' && <SelectableTableSection />}
            {activeSection === 'editable' && <EditableTableSection />}
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
        <button onClick={() => setShowGood(false)} className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all", !showGood ? "bg-red-500 text-white shadow-md" : "text-slate-600 hover:text-slate-900")}>
          <EyeOff className="w-4 h-4" /> Inaccessible
        </button>
        <button onClick={() => setShowGood(true)} className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all", showGood ? "bg-green-500 text-white shadow-md" : "text-slate-600 hover:text-slate-900")}>
          <Eye className="w-4 h-4" /> Accessible
        </button>
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
      <div className="p-2 bg-blue-100 rounded-lg h-fit"><Icon className="w-5 h-5 text-blue-600" /></div>
      <div><h4 className="font-semibold text-slate-900 mb-1">{title}</h4><p className="text-sm text-slate-600">{children}</p></div>
    </div>
  );
}

function TipBox({ title, children, variant = 'info' }: { title: string; children: React.ReactNode; variant?: 'info' | 'warning' | 'success' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };
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

function BasicTableSection() {
  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Semantic HTML Tables" 
        description="The foundation of accessible tables is using native HTML elements. Screen readers rely on semantic markup to understand table structure, announce row/column counts, and enable navigation between cells."
      />

      {/* Why It Matters */}
      <div className="grid md:grid-cols-3 gap-4">
        <KeyPoint icon={Users} title="Screen Reader Navigation">
          Users can navigate between cells using arrow keys, jump to headers, and understand relationships between data.
        </KeyPoint>
        <KeyPoint icon={Keyboard} title="Keyboard Accessibility">
          Native table elements support keyboard navigation out of the box, with no JavaScript required.
        </KeyPoint>
        <KeyPoint icon={Info} title="Proper Announcements">
          Screen readers announce "Table with 5 rows and 4 columns" and read column headers with each cell.
        </KeyPoint>
      </div>

      {/* Interactive Demo */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-blue-500" /> Try It Yourself</h3>
        <InteractiveDemo
          bad={<div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600 text-sm mb-4"><AlertTriangle className="w-4 h-4" /> <strong>Problem:</strong> Screen readers see this as random text, not a table structure!</div>
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
              <div className="flex bg-slate-100 font-semibold text-sm text-slate-700"><div className="flex-1 p-3">Name</div><div className="flex-1 p-3">Role</div><div className="flex-1 p-3">Department</div></div>
              {sampleData.slice(0, 3).map((emp) => (<div key={emp.id} className="flex border-t border-slate-200 text-sm text-slate-600"><div className="flex-1 p-3">{emp.name}</div><div className="flex-1 p-3">{emp.role}</div><div className="flex-1 p-3">{emp.department}</div></div>))}
            </div>
            <p className="text-sm text-red-700 mt-3">❌ VoiceOver reads: "Alice Johnson, Frontend Developer, Engineering" — no context about columns!</p>
          </div>}
          good={<div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-4"><CheckCircle2 className="w-4 h-4" /> <strong>Solution:</strong> Screen readers can navigate by row and column!</div>
            <table className="w-full border border-slate-300 rounded-lg overflow-hidden bg-white text-sm">
              <caption className="sr-only">Employee Directory - Team Members</caption>
              <thead className="bg-slate-100"><tr>
                <th scope="col" className="p-3 text-left font-semibold text-slate-700">Name</th>
                <th scope="col" className="p-3 text-left font-semibold text-slate-700">Role</th>
                <th scope="col" className="p-3 text-left font-semibold text-slate-700">Department</th>
              </tr></thead>
              <tbody>{sampleData.slice(0, 3).map((emp) => (<tr key={emp.id} className="border-t border-slate-200 hover:bg-slate-50"><td className="p-3 text-slate-900">{emp.name}</td><td className="p-3 text-slate-600">{emp.role}</td><td className="p-3 text-slate-600">{emp.department}</td></tr>))}</tbody>
            </table>
            <p className="text-sm text-green-700 mt-3">✅ VoiceOver reads: "Name column, Alice Johnson. Role column, Frontend Developer" — full context!</p>
          </div>}
        />
      </div>

      {/* Code Examples */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700"><XCircle className="w-5 h-5" /> Don't: "Div Soup" Tables</h3>
          <CodeBlock code={`<!-- ❌ INACCESSIBLE -->
<div class="table">
  <div class="row header">
    <div class="cell">Name</div>
    <div class="cell">Role</div>
  </div>
  <div class="row">
    <div class="cell">Alice</div>
    <div class="cell">Developer</div>
  </div>
</div>

<!-- Screen reader has NO idea this is tabular data -->`} />
        </div>
        <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700"><CheckCircle2 className="w-5 h-5" /> Do: Semantic HTML</h3>
          <CodeBlock code={`<!-- ✅ ACCESSIBLE -->
<table>
  <caption>Employee Directory</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>Developer</td>
    </tr>
  </tbody>
</table>`} />
        </div>
      </div>

      {/* Key Elements */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Essential Table Elements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100">
              <tr><th scope="col" className="p-4 text-left font-semibold">Element</th><th scope="col" className="p-4 text-left font-semibold">Purpose</th><th scope="col" className="p-4 text-left font-semibold">Screen Reader Benefit</th></tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="p-4 font-mono text-blue-600">&lt;table&gt;</td><td className="p-4">Container for tabular data</td><td className="p-4">Announces "Table with X rows, Y columns"</td></tr>
              <tr className="border-t bg-slate-50"><td className="p-4 font-mono text-blue-600">&lt;caption&gt;</td><td className="p-4">Title/description of the table</td><td className="p-4">Read first, gives users context before navigating</td></tr>
              <tr className="border-t"><td className="p-4 font-mono text-blue-600">&lt;thead&gt;</td><td className="p-4">Groups header rows</td><td className="p-4">Distinguishes headers from data rows</td></tr>
              <tr className="border-t bg-slate-50"><td className="p-4 font-mono text-blue-600">&lt;th scope="col"&gt;</td><td className="p-4">Column header cell</td><td className="p-4">Read with each cell in that column</td></tr>
              <tr className="border-t"><td className="p-4 font-mono text-blue-600">&lt;th scope="row"&gt;</td><td className="p-4">Row header cell</td><td className="p-4">Read with each cell in that row</td></tr>
              <tr className="border-t bg-slate-50"><td className="p-4 font-mono text-blue-600">&lt;tbody&gt;</td><td className="p-4">Groups data rows</td><td className="p-4">Separates data from headers and footers</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <TipBox title="Pro Tip: Visually Hidden Captions" variant="info">
        If you don't want a visible caption, use <code className="bg-blue-100 px-1 rounded">className="sr-only"</code> to hide it visually while keeping it accessible. Never skip the caption—it's crucial for screen reader users to understand what the table contains.
      </TipBox>
    </div>
  );
}

function SortableTableSection() {
  const [sortColumn, setSortColumn] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending' | 'none'>('none');
  const [announcement, setAnnouncement] = useState('');

  const sortedData = useMemo(() => {
    if (!sortColumn || sortDirection === 'none') return sampleData;
    return [...sampleData].sort((a, b) => {
      const aVal = a[sortColumn], bVal = b[sortColumn];
      if (typeof aVal === 'string' && typeof bVal === 'string') return sortDirection === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      if (typeof aVal === 'number' && typeof bVal === 'number') return sortDirection === 'ascending' ? aVal - bVal : bVal - aVal;
      return 0;
    });
  }, [sortColumn, sortDirection]);

  const handleSort = (column: keyof Employee) => {
    let newDirection: 'ascending' | 'descending' | 'none' = 'ascending';
    if (sortColumn === column) {
      if (sortDirection === 'ascending') newDirection = 'descending';
      else if (sortDirection === 'descending') newDirection = 'none';
    }
    setSortColumn(newDirection === 'none' ? null : column);
    setSortDirection(newDirection);
    setAnnouncement(newDirection === 'none' ? 'Sort removed' : `Sorted by ${column}, ${newDirection}`);
  };

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Sortable Table Headers" 
        description="Interactive sort controls must be keyboard accessible and communicate the current sort state to screen readers using ARIA attributes."
      />

      <div className="grid md:grid-cols-3 gap-4">
        <KeyPoint icon={Keyboard} title="Keyboard Access">
          Sort buttons must be focusable and activatable with Enter or Space. Use actual <code>&lt;button&gt;</code> elements inside <code>&lt;th&gt;</code>.
        </KeyPoint>
        <KeyPoint icon={Info} title="aria-sort Attribute">
          The <code>aria-sort</code> attribute on <code>&lt;th&gt;</code> tells screen readers if the column is sorted ascending, descending, or not sorted.
        </KeyPoint>
        <KeyPoint icon={Users} title="Visual + ARIA Indicators">
          Don't rely on icons alone. Screen readers can't see ↑↓ arrows—they need <code>aria-sort</code> to announce sort state.
        </KeyPoint>
      </div>

      {/* Live Demo */}
      <div className="p-6 rounded-2xl bg-violet-50 border border-violet-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-violet-500" /> Interactive Demo</h3>
        <p className="text-slate-600 mb-4">Click any column header to sort. Try using Tab to focus headers, then press Enter to sort.</p>
        
        {/* Live region for announcements */}
        <div role="status" aria-live="polite" className="sr-only">{announcement}</div>
        
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <caption className="sr-only">Employee directory, sortable by clicking column headers</caption>
            <thead>
              <tr className="bg-slate-50">
                {(['name', 'role', 'department', 'salary'] as const).map((col) => (
                  <th key={col} scope="col" aria-sort={sortColumn === col ? sortDirection : undefined} className="text-left p-0">
                    <button onClick={() => handleSort(col)} className="w-full flex items-center justify-between p-4 font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500 transition-all">
                      <span className="capitalize">{col}</span>
                      <span className="ml-2">
                        {sortColumn === col && sortDirection !== 'none' ? (
                          sortDirection === 'ascending' ? <ChevronUp className="w-4 h-4 text-violet-600" /> : <ChevronDown className="w-4 h-4 text-violet-600" />
                        ) : <ChevronsUpDown className="w-4 h-4 text-slate-400" />}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{emp.name}</td>
                  <td className="p-4 text-slate-600">{emp.role}</td>
                  <td className="p-4 text-slate-600">{emp.department}</td>
                  <td className="p-4 text-slate-600">${emp.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortColumn && sortDirection !== 'none' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 px-4 py-2 bg-violet-100 rounded-lg text-violet-700 text-sm inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Table sorted by <strong>{sortColumn}</strong> ({sortDirection})
          </motion.div>
        )}
      </div>

      {/* Code Example */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Implementation Pattern</h3>
        <CodeBlock title="Sortable Table Header" code={`<th scope="col" aria-sort="ascending">
  <button onClick={handleSort}>
    Name
    <ChevronUp aria-hidden="true" />
  </button>
</th>

// aria-sort values:
// - "ascending"  → Sorted A-Z or 1-9
// - "descending" → Sorted Z-A or 9-1
// - "none"       → Not currently sorted
// - (omit entirely if column is not sortable)`} />
      </div>

      <TipBox title="Announce Sort Changes" variant="success">
        Use a live region (<code>aria-live="polite"</code>) to announce when sort changes: "Table sorted by Name, ascending". This helps screen reader users know their action worked.
      </TipBox>

      <TipBox title="Three-State Sorting" variant="info">
        Best practice: Click once for ascending, twice for descending, three times to remove sort. Users should be able to return to the original order.
      </TipBox>
    </div>
  );
}

function ResponsiveTableSection() {
  const [viewMode, setViewMode] = useState<'scroll' | 'stacked'>('scroll');

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Responsive Table Patterns" 
        description="Tables on mobile screens are challenging. Here are two proven approaches that maintain accessibility while adapting to smaller viewports."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <KeyPoint icon={Monitor} title="Horizontal Scroll Pattern">
          Keep the table intact but allow horizontal scrolling. Users can swipe/drag to see all columns. Best for data that must stay in table format.
        </KeyPoint>
        <KeyPoint icon={Smartphone} title="Stacked Cards Pattern">
          Transform rows into cards on mobile. Each card shows all data for one item. Better for browsing when comparing rows isn't critical.
        </KeyPoint>
      </div>

      {/* Pattern Selector */}
      <div className="flex gap-3 flex-wrap">
        <Button variant={viewMode === 'scroll' ? 'default' : 'outline'} onClick={() => setViewMode('scroll')} className={cn("gap-2", viewMode === 'scroll' && "bg-orange-500 hover:bg-orange-600")}>
          <Monitor className="w-4 h-4" /> Horizontal Scroll
        </Button>
        <Button variant={viewMode === 'stacked' ? 'default' : 'outline'} onClick={() => setViewMode('stacked')} className={cn("gap-2", viewMode === 'stacked' && "bg-orange-500 hover:bg-orange-600")}>
          <Smartphone className="w-4 h-4" /> Stacked Cards
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'scroll' ? (
          <motion.div key="scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Horizontal Scroll Pattern</h3>
              <p className="text-slate-600 mb-4">The table stays intact. On mobile, users scroll horizontally. Add <code>tabindex="0"</code> to the scroll container for keyboard users.</p>
              
              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500" tabIndex={0} role="region" aria-label="Scrollable employee table">
                <table className="w-full min-w-[700px] text-sm">
                  <caption className="sr-only">Employee directory - scroll horizontally to see all columns</caption>
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Name</th>
                      <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Role</th>
                      <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Department</th>
                      <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Status</th>
                      <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((emp) => (
                      <tr key={emp.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="p-4 text-slate-900 font-medium">{emp.name}</td>
                        <td className="p-4 text-slate-600">{emp.role}</td>
                        <td className="p-4 text-slate-600">{emp.department}</td>
                        <td className="p-4"><Badge variant={emp.status === 'Active' ? 'default' : 'secondary'} className={emp.status === 'Active' ? 'bg-green-500' : ''}>{emp.status}</Badge></td>
                        <td className="p-4 text-slate-600">${emp.salary.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <CodeBlock title="Scrollable Container with Keyboard Support" code={`<div 
  role="region" 
  aria-label="Employee data table"
  tabIndex={0}  // Makes container keyboard focusable
  className="overflow-x-auto focus:ring-2 focus:ring-blue-500"
>
  <table className="min-w-[700px]">
    <caption className="sr-only">
      Employee directory - scroll horizontally to see all columns
    </caption>
    <!-- table content -->
  </table>
</div>`} />
          </motion.div>
        ) : (
          <motion.div key="stacked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Stacked Cards Pattern</h3>
              <p className="text-slate-600 mb-4">On mobile, transform each row into a card. Use definition lists (<code>&lt;dl&gt;</code>) for semantic key-value pairs.</p>
              
              <div className="grid gap-4">
                {sampleData.map((emp, idx) => (
                  <motion.article key={emp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} 
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-slate-900">{emp.name}</h3>
                      <Badge variant={emp.status === 'Active' ? 'default' : 'secondary'} className={emp.status === 'Active' ? 'bg-green-500' : ''}>{emp.status}</Badge>
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                      <div><dt className="text-slate-500 font-medium">Role</dt><dd className="text-slate-700">{emp.role}</dd></div>
                      <div><dt className="text-slate-500 font-medium">Department</dt><dd className="text-slate-700">{emp.department}</dd></div>
                      <div><dt className="text-slate-500 font-medium">Salary</dt><dd className="text-green-600 font-semibold">${emp.salary.toLocaleString()}</dd></div>
                    </dl>
                  </motion.article>
                ))}
              </div>
            </div>

            <CodeBlock title="Card Layout with Definition List" code={`<article className="card">
  <h3>{employee.name}</h3>
  <dl>
    <div>
      <dt>Role</dt>
      <dd>{employee.role}</dd>
    </div>
    <div>
      <dt>Department</dt>
      <dd>{employee.department}</dd>
    </div>
  </dl>
</article>

<!-- Using <dl>, <dt>, <dd> creates semantic key-value pairs
     Screen readers announce: "Role, definition, Frontend Developer" -->`} />
          </motion.div>
        )}
      </AnimatePresence>

      <TipBox title="When to Use Which Pattern" variant="info">
        <strong>Use Horizontal Scroll</strong> when users need to compare values across rows (e.g., financial data, comparison tables).<br/>
        <strong>Use Stacked Cards</strong> when users browse one item at a time (e.g., employee directory, product listings).
      </TipBox>
    </div>
  );
}

function SelectableTableSection() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  
  const toggleAll = () => {
    if (selectedIds.size === sampleData.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(sampleData.map((e) => e.id)));
  };

  const isAllSelected = selectedIds.size === sampleData.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < sampleData.length;

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Selectable Table Rows" 
        description="Multi-select functionality with checkboxes requires proper labeling, indeterminate state handling, and keyboard support for selecting ranges."
      />

      <div className="grid md:grid-cols-3 gap-4">
        <KeyPoint icon={MousePointer} title="Hidden but Descriptive Labels">
          Every checkbox needs an accessible label. Use <code>sr-only</code> class to hide "Select Alice Johnson" visually while keeping it available to screen readers.
        </KeyPoint>
        <KeyPoint icon={Info} title="Indeterminate State">
          When some (but not all) rows are selected, the "select all" checkbox should show the indeterminate state (—) and set <code>indeterminate</code> property via JavaScript.
        </KeyPoint>
        <KeyPoint icon={Keyboard} title="Bulk Actions">
          When rows are selected, show available bulk actions (Delete, Export, etc.) and announce the selection count to screen readers.
        </KeyPoint>
      </div>

      {/* Live Demo */}
      <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-green-500" /> Interactive Demo</h3>
        <p className="text-slate-600 mb-4">Select individual rows or use the header checkbox to select all. Notice how the header checkbox shows a dash (—) when partially selected.</p>

        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <caption className="sr-only">Selectable employee list</caption>
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="p-4 w-12">
                  <label className="sr-only">Select all employees</label>
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                    onChange={toggleAll}
                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                </th>
                <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Name</th>
                <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Role</th>
                <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Department</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((emp) => (
                <tr key={emp.id} className={cn("border-t border-slate-200 transition-colors", selectedIds.has(emp.id) ? "bg-green-50" : "hover:bg-slate-50")}>
                  <td className="p-4">
                    <label className="sr-only">Select {emp.name}</label>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(emp.id)} 
                      onChange={() => toggleSelect(emp.id)}
                      className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-4 font-medium text-slate-900">{emp.name}</td>
                  <td className="p-4 text-slate-600">{emp.role}</td>
                  <td className="p-4 text-slate-600">{emp.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-4">
            <span className="px-4 py-2 bg-green-100 rounded-lg text-green-700 text-sm font-medium">
              {selectedIds.size} of {sampleData.length} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Export Selected</Button>
              <Button size="sm" variant="destructive">Delete Selected</Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Code Example */}
      <CodeBlock title="Checkbox with Accessible Label" code={`<td>
  <label className="sr-only">Select {employee.name}</label>
  <input 
    type="checkbox"
    checked={isSelected}
    onChange={() => toggleSelect(employee.id)}
    aria-describedby="selection-instructions"
  />
</td>

<!-- For the "select all" checkbox: -->
<input
  type="checkbox"
  checked={allSelected}
  ref={(el) => { 
    if (el) el.indeterminate = someButNotAllSelected; 
  }}
  onChange={toggleAll}
/>

<!-- indeterminate must be set via JavaScript, not HTML attribute -->`} />

      <TipBox title="Announce Selection Changes" variant="success">
        Use a live region to announce: "3 employees selected" when selection changes. This helps screen reader users track their selections without leaving the table.
      </TipBox>
    </div>
  );
}

function EditableTableSection() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLButtonElement | null>(null);

  const startEdit = (emp: Employee, buttonEl: HTMLButtonElement) => {
    previousFocusRef.current = buttonEl;
    setEditingId(emp.id);
    setEditValue(emp.name);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    // Return focus to the edit button
    setTimeout(() => previousFocusRef.current?.focus(), 0);
  };

  const saveEdit = () => {
    // In real app, save the value here
    cancelEdit();
  };

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Inline Table Editing" 
        description="Allow users to edit cells directly in the table. This requires careful focus management—when editing starts, move focus to the input; when editing ends, return focus to a logical location."
      />

      <div className="grid md:grid-cols-3 gap-4">
        <KeyPoint icon={Keyboard} title="Focus Management">
          When entering edit mode, focus the input. When exiting (save/cancel), return focus to the edit button or the cell itself.
        </KeyPoint>
        <KeyPoint icon={Info} title="Keyboard Shortcuts">
          Support Enter to save, Escape to cancel. Announce these shortcuts to screen reader users via <code>aria-describedby</code>.
        </KeyPoint>
        <KeyPoint icon={AlertTriangle} title="Announce State Changes">
          Use a live region to announce "Editing Alice Johnson" and "Changes saved" or "Edit cancelled" for screen reader users.
        </KeyPoint>
      </div>

      {/* Live Demo */}
      <div className="p-6 rounded-2xl bg-pink-50 border border-pink-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-pink-500" /> Interactive Demo</h3>
        <p className="text-slate-600 mb-4">Click the edit button to modify a name. Press <strong>Enter</strong> to save or <strong>Escape</strong> to cancel. Notice how focus moves to the input and back.</p>

        <div id="edit-instructions" className="sr-only">Press Enter to save changes, or Escape to cancel</div>

        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <caption className="sr-only">Editable employee directory</caption>
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Name</th>
                <th scope="col" className="p-4 text-left text-slate-700 font-semibold">Role</th>
                <th scope="col" className="p-4 text-left text-slate-700 font-semibold w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-200">
                  <td className="p-4">
                    {editingId === emp.id ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        aria-label={`Editing name for ${emp.name}`}
                        aria-describedby="edit-instructions"
                        className="w-full px-3 py-2 border border-pink-400 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                    ) : (
                      <span className="font-medium text-slate-900">{emp.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600">{emp.role}</td>
                  <td className="p-4">
                    {editingId === emp.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit} className="bg-green-500 hover:bg-green-600">
                          <Save className="w-4 h-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => startEdit(emp, e.currentTarget)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <Edit3 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CodeBlock title="Focus Management Pattern" code={`// Store reference to trigger button
const previousFocusRef = useRef<HTMLButtonElement>(null);

const startEdit = (emp, buttonEl) => {
  previousFocusRef.current = buttonEl;
  setEditing(true);
  setTimeout(() => inputRef.current?.focus(), 0);
};

const cancelEdit = () => {
  setEditing(false);
  // Return focus to the button that triggered edit mode
  setTimeout(() => previousFocusRef.current?.focus(), 0);
};

// In the input:
<input
  ref={inputRef}
  aria-label={\`Editing \${emp.name}\`}
  aria-describedby="edit-help"
  onKeyDown={(e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }}
/>

<div id="edit-help" className="sr-only">
  Press Enter to save, Escape to cancel
</div>`} />

      <TipBox title="Critical: Don't Trap Focus" variant="warning">
        When entering edit mode, don't trap focus in the input. Users should still be able to Tab away if they want—just make sure you handle the "abandoned" edit state gracefully (either auto-save or discard changes).
      </TipBox>
    </div>
  );
}

function CommonIssuesSection() {
  const issues = [
    { bad: 'Using <div> elements styled to look like tables', fix: 'Use semantic <table>, <tr>, <th>, <td> elements', severity: 'critical', why: 'Screen readers cannot navigate div-based "tables" using table navigation commands.' },
    { bad: 'Missing <caption> or aria-label on table', fix: 'Always provide a title/description for the table', severity: 'critical', why: 'Users need to know what the table contains before deciding to explore it.' },
    { bad: 'Color-only indicators for sort direction', fix: 'Use icons AND aria-sort attribute on <th>', severity: 'high', why: 'Color-blind users and screen reader users cannot perceive color-based indicators.' },
    { bad: 'Sort buttons not keyboard accessible', fix: 'Use <button> elements inside <th> for sort controls', severity: 'critical', why: 'Keyboard users cannot activate onclick handlers on non-interactive elements.' },
    { bad: 'No visible focus styles on interactive elements', fix: 'Add clear :focus-visible styles to buttons and inputs', severity: 'high', why: 'Keyboard users cannot see where they are in the table.' },
    { bad: 'Checkboxes without labels', fix: 'Add sr-only labels like "Select [Name]"', severity: 'critical', why: 'Screen readers will just say "checkbox" with no context.' },
    { bad: 'Edit mode doesn\'t manage focus', fix: 'Move focus to input on edit, return on save/cancel', severity: 'high', why: 'Users lose their place when entering/exiting edit mode.' },
    { bad: 'Responsive tables that hide data', fix: 'Use horizontal scroll or transform to cards', severity: 'medium', why: 'Hidden data is inaccessible to all users.' },
  ];

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Common Accessibility Mistakes" 
        description="These are the most frequent table accessibility issues we see in production. Use this as a checklist when reviewing your table implementations."
      />

      <div className="space-y-4">
        {issues.map((issue, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className={cn("p-2 rounded-lg flex-shrink-0", 
                issue.severity === 'critical' ? 'bg-red-100 text-red-600' : 
                issue.severity === 'high' ? 'bg-orange-100 text-orange-600' : 
                'bg-yellow-100 text-yellow-600'
              )}>
                <XCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={cn(
                    issue.severity === 'critical' ? 'border-red-300 text-red-600' : 
                    issue.severity === 'high' ? 'border-orange-300 text-orange-600' : 
                    'border-yellow-300 text-yellow-600'
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
          <li>Navigate the table with VoiceOver/NVDA—can you understand the structure?</li>
          <li>Tab through all interactive elements—is the focus order logical?</li>
          <li>Activate sort buttons with Enter/Space—does it work?</li>
          <li>Check color contrast with browser dev tools—4.5:1 minimum for text</li>
          <li>Test at 200% zoom—does the table remain usable?</li>
        </ol>
      </TipBox>
    </div>
  );
}
