'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, AlertTriangle, Sparkles, Eye, EyeOff, Play, ChevronRight, Info, Lightbulb, Code2, Keyboard, Users, Focus, MessageSquare, Lock, MousePointer, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const sections = [
    { id: 'basics', label: 'Dialog Basics', icon: MessageSquare, color: 'bg-sky-500', textColor: 'text-sky-600' },
    { id: 'focus', label: 'Focus Management', icon: Focus, color: 'bg-violet-500', textColor: 'text-violet-600' },
    { id: 'keyboard', label: 'Keyboard Controls', icon: Keyboard, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { id: 'backdrop', label: 'Backdrop & Scroll', icon: Lock, color: 'bg-orange-500', textColor: 'text-orange-600' },
    { id: 'issues', label: 'Common Mistakes', icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-600' },
];

export default function ModalsPatternPage() {
    const [activeSection, setActiveSection] = useState('basics');

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[100px]" />
                <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[100px]" />
            </div>

            <div className="relative pt-8 pb-6 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <Link href="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors mb-4 group text-sm">
                        <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Learn Hub
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-lg shadow-sky-500/25">
                            <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <Badge className="bg-sky-100 text-sky-700 border-sky-200 mb-1"><Sparkles className="w-3 h-3 mr-1" /> Comprehensive Guide</Badge>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Accessible Modal Dialogs</h1>
                            <p className="text-slate-500 mt-1">Focus trapping, keyboard controls, and proper announcements</p>
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
                        {activeSection === 'basics' && <DialogBasicsSection />}
                        {activeSection === 'focus' && <FocusManagementSection />}
                        {activeSection === 'keyboard' && <KeyboardControlsSection />}
                        {activeSection === 'backdrop' && <BackdropScrollSection />}
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
            <div className="p-2 bg-sky-100 rounded-lg h-fit"><Icon className="w-5 h-5 text-sky-600" /></div>
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

function AccessibleModal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            previousActiveElement.current?.focus();
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { onClose(); return; }
        if (e.key === 'Tab') {
            const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusable?.length) return;
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 focus:outline-none"
                onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
                <div className="flex items-center justify-between mb-4">
                    <h2 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Close dialog"><X className="w-5 h-5 text-slate-500" /></button>
                </div>
                {children}
            </div>
        </div>
    );
}

function DialogBasicsSection() {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div className="space-y-10">
            <SectionHeader title="Modal Dialog Fundamentals" description="Modal dialogs interrupt the user's workflow. The key ARIA attributes are role='dialog', aria-modal='true', and aria-labelledby to connect the dialog to its title." />
            <div className="grid md:grid-cols-3 gap-4">
                <KeyPoint icon={MessageSquare} title="role='dialog'">Tells screen readers this is a dialog requiring user attention before returning to the main content.</KeyPoint>
                <KeyPoint icon={Lock} title="aria-modal='true'">Indicates the dialog is modal—content behind it is inert and shouldn't be accessible.</KeyPoint>
                <KeyPoint icon={Info} title="aria-labelledby">Points to the dialog's title element. Users hear "Dialog: [title]" when it opens.</KeyPoint>
            </div>
            <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-sky-500" /> Interactive Demo</h3>
                <p className="text-slate-600 mb-4">Click the button to open an accessible modal. Try pressing Escape, clicking outside, or using Tab.</p>
                <Button onClick={() => setModalOpen(true)} className="bg-sky-500 hover:bg-sky-600"><ExternalLink className="w-4 h-4 mr-2" /> Open Accessible Modal</Button>
                <AccessibleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Dialog">
                    <p className="text-slate-600 mb-4">This modal demonstrates proper accessibility patterns:</p>
                    <ul className="text-sm text-slate-600 space-y-2 mb-6">
                        <li>✅ Focus moves into the modal on open</li>
                        <li>✅ Escape key closes the modal</li>
                        <li>✅ Tab key cycles through focusable elements</li>
                        <li>✅ Focus returns to trigger button on close</li>
                    </ul>
                    <div className="flex gap-3">
                        <Button onClick={() => setModalOpen(false)} className="flex-1">Confirm</Button>
                        <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
                    </div>
                </AccessibleModal>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700"><XCircle className="w-5 h-5" /> Don't: Generic Div</h3>
                    <CodeBlock code={`<!-- ❌ INACCESSIBLE -->
<div class="modal">
  <div class="modal-content">
    <span onclick="close()">&times;</span>
    <h2>My Modal</h2>
  </div>
</div>`} />
                </div>
                <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700"><CheckCircle2 className="w-5 h-5" /> Do: Semantic Dialog</h3>
                    <CodeBlock code={`<!-- ✅ ACCESSIBLE -->
<div role="dialog" 
     aria-modal="true" 
     aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm</h2>
  <button aria-label="Close">×</button>
</div>`} />
                </div>
            </div>
            <TipBox title="Use Native <dialog> When Possible" variant="info">The HTML <code>&lt;dialog&gt;</code> element with <code>showModal()</code> provides focus trapping and Escape handling automatically.</TipBox>
        </div>
    );
}

function FocusManagementSection() {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div className="space-y-10">
            <SectionHeader title="Focus Management" description="When a modal opens, focus must move into it. When it closes, focus must return to the trigger element." />
            <div className="grid md:grid-cols-3 gap-4">
                <KeyPoint icon={Focus} title="Move Focus on Open">Move focus to the modal container (with tabIndex="-1") or the first focusable element.</KeyPoint>
                <KeyPoint icon={Keyboard} title="Trap Focus Inside">Tab and Shift+Tab should cycle through focusable elements within the modal only.</KeyPoint>
                <KeyPoint icon={Users} title="Return Focus on Close">Store a reference to the trigger element. When modal closes, return focus to it.</KeyPoint>
            </div>
            <div className="p-6 rounded-2xl bg-violet-50 border border-violet-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-violet-500" /> Focus Flow Demo</h3>
                <p className="text-slate-600 mb-4">Open the modal and press Tab repeatedly. Notice how focus stays trapped inside.</p>
                <Button onClick={() => setModalOpen(true)} className="bg-violet-500 hover:bg-violet-600"><ExternalLink className="w-4 h-4 mr-2" /> Test Focus Trap</Button>
                <AccessibleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Focus Trap Demo">
                    <p className="text-slate-600 mb-4">Press Tab to cycle through these buttons:</p>
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full">First Button</Button>
                        <Button variant="outline" className="w-full">Second Button</Button>
                        <Button variant="outline" className="w-full">Third Button</Button>
                    </div>
                    <div className="mt-4 pt-4 border-t"><Button onClick={() => setModalOpen(false)} className="w-full">Close Modal</Button></div>
                </AccessibleModal>
            </div>
            <CodeBlock title="Focus Trap Implementation" code={`const previousActiveElement = useRef<HTMLElement>(null);
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    previousActiveElement.current = document.activeElement;
    modalRef.current?.focus();
  }
}, [isOpen]);

const handleClose = () => {
  setIsOpen(false);
  previousActiveElement.current?.focus();
};`} />
            <TipBox title="Where Should Initial Focus Go?" variant="info"><strong>Confirmation dialogs:</strong> Focus "Cancel" for destructive actions.<br /><strong>Form dialogs:</strong> Focus the first input field.</TipBox>
        </div>
    );
}

function KeyboardControlsSection() {
    return (
        <div className="space-y-10">
            <SectionHeader title="Keyboard Controls" description="Modals must be fully operable with keyboard. Essential: Escape to close, Tab to move forward, Shift+Tab to move backward." />
            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100"><tr><th scope="col" className="p-4 text-left font-semibold">Key</th><th scope="col" className="p-4 text-left font-semibold">Action</th><th scope="col" className="p-4 text-left font-semibold">Notes</th></tr></thead>
                    <tbody>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">Escape</td><td className="p-4">Close the modal</td><td className="p-4 text-slate-500">Required. Always implement.</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">Tab</td><td className="p-4">Move to next focusable element</td><td className="p-4 text-slate-500">Must stay trapped within modal</td></tr>
                        <tr className="border-t"><td className="p-4 font-mono bg-slate-50">Shift + Tab</td><td className="p-4">Move to previous element</td><td className="p-4 text-slate-500">Must stay trapped within modal</td></tr>
                    </tbody>
                </table>
            </div>
            <CodeBlock title="Keyboard Handler" code={`const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') { onClose(); return; }
  if (e.key === 'Tab') {
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
};`} />
            <TipBox title="Test Without a Mouse" variant="success">Unplug your mouse and try to use your modal with keyboard only. Can you open, navigate, and close it?</TipBox>
        </div>
    );
}

function BackdropScrollSection() {
    return (
        <div className="space-y-10">
            <SectionHeader title="Backdrop & Scroll Lock" description="When a modal is open, background content should be dimmed and inert. Users shouldn't scroll or interact with content behind." />
            <div className="grid md:grid-cols-2 gap-4">
                <KeyPoint icon={Lock} title="Disable Background Scroll">Set <code>document.body.style.overflow = 'hidden'</code> when modal opens. Restore on close!</KeyPoint>
                <KeyPoint icon={MousePointer} title="Click Outside to Close">Common but not sufficient alone. Always provide a visible close button too.</KeyPoint>
            </div>
            <InteractiveDemo
                bad={<div className="space-y-4">
                    <div className="flex items-center gap-2 text-red-600 text-sm mb-4"><AlertTriangle className="w-4 h-4" /> Page scrolls behind modal, background is interactive!</div>
                    <div className="relative p-4 border border-slate-200 rounded-lg bg-white">
                        <div className="absolute inset-0 bg-black/20 rounded-lg" />
                        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xs mx-auto z-10 border">
                            <h3 className="font-bold mb-2">Bad Modal</h3>
                            <p className="text-sm text-slate-600 mb-3">Background is still interactive!</p>
                            <button className="px-4 py-2 bg-slate-200 rounded">Close</button>
                        </div>
                    </div>
                </div>}
                good={<div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 text-sm mb-4"><CheckCircle2 className="w-4 h-4" /> Background is locked and dimmed!</div>
                    <div className="relative p-4 border border-slate-200 rounded-lg bg-white">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg" aria-hidden="true" />
                        <div className="relative bg-white p-4 rounded-lg shadow-2xl max-w-xs mx-auto z-10 border-2 border-sky-200">
                            <h3 className="font-bold mb-2 text-slate-900">Good Modal</h3>
                            <p className="text-sm text-slate-600 mb-3">Background is locked and blurred.</p>
                            <button className="px-4 py-2 bg-sky-500 text-white rounded">Close</button>
                        </div>
                    </div>
                </div>}
            />
            <CodeBlock title="Scroll Lock Pattern" code={`useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);`} />
            <TipBox title="aria-hidden on Backdrop" variant="info">The backdrop overlay should have <code>aria-hidden="true"</code>. It's purely decorative.</TipBox>
        </div>
    );
}

function CommonIssuesSection() {
    const issues = [
        { bad: 'No role="dialog" attribute', fix: 'Add role="dialog" aria-modal="true"', severity: 'critical', why: 'Screen readers don\'t know this is a dialog.' },
        { bad: 'Focus doesn\'t move to modal on open', fix: 'Move focus to modal or first focusable element', severity: 'critical', why: 'Keyboard users are stuck behind the modal.' },
        { bad: 'No focus trap—Tab escapes the modal', fix: 'Implement focus trap cycling', severity: 'critical', why: 'Users can Tab to invisible content.' },
        { bad: 'Focus doesn\'t return on close', fix: 'Store trigger reference, focus it on close', severity: 'high', why: 'Users lose their place in the page.' },
        { bad: 'Escape key doesn\'t close modal', fix: 'Listen for Escape and call close handler', severity: 'critical', why: 'Universally expected behavior.' },
        { bad: 'Close button has no accessible label', fix: 'Add aria-label="Close dialog"', severity: 'high', why: 'Screen readers just say "button".' },
    ];
    return (
        <div className="space-y-10">
            <SectionHeader title="Common Modal Mistakes" description="Modal accessibility issues can completely block users. These are the most critical problems to avoid." />
            <div className="space-y-4">
                {issues.map((issue, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className={cn("p-2 rounded-lg flex-shrink-0", issue.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600')}><XCircle className="w-5 h-5" /></div>
                            <div className="flex-1 min-w-0">
                                <Badge variant="outline" className={cn("mb-2", issue.severity === 'critical' ? 'border-red-300 text-red-600' : 'border-orange-300 text-orange-600')}>{issue.severity}</Badge>
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
                    <li>Open modal with keyboard (Enter/Space)</li>
                    <li>Confirm focus moves into the modal</li>
                    <li>Tab through—focus should cycle, not escape</li>
                    <li>Press Escape—modal should close</li>
                    <li>Confirm focus returns to the trigger</li>
                </ol>
            </TipBox>
        </div>
    );
}
