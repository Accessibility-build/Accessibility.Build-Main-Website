"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import {
  Search, Copy, Check, ChevronDown, ChevronUp, Code, Monitor, Smartphone,
  Globe, AlertTriangle, CheckCircle, Info, Play, BookOpen, Zap, Eye, ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ariaRoles, ariaAttributes, nativeComparisons, commonMistakes,
  type AriaRole, type AriaAttribute,
} from "@/lib/data/aria-reference"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_COLORS: Record<string, string> = {
  widget: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  landmark: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "live-region": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  document: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  window: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  global: "bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
  relationship: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  "drag-drop": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
}

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "widget", label: "Widget Roles" },
  { value: "landmark", label: "Landmark Roles" },
  { value: "live-region", label: "Live Region" },
  { value: "document", label: "Document" },
  { value: "attributes", label: "Attributes" },
]

const playgroundPresets = [
  { label: "Button", html: '<div role="button" tabindex="0" aria-pressed="false">Toggle Dark Mode</div>' },
  { label: "Alert", html: '<div role="alert" aria-live="assertive">Form submitted successfully!</div>' },
  { label: "Dialog", html: '<div role="dialog" aria-modal="true" aria-labelledby="dlg-title">\n  <h2 id="dlg-title">Confirm Action</h2>\n  <p>Are you sure?</p>\n  <button>Yes</button>\n  <button>No</button>\n</div>' },
  { label: "Navigation", html: '<nav role="navigation" aria-label="Main">\n  <ul>\n    <li><a href="/">Home</a></li>\n    <li><a href="/about" aria-current="page">About</a></li>\n  </ul>\n</nav>' },
  { label: "Tab Panel", html: '<div role="tablist" aria-label="Settings">\n  <button role="tab" aria-selected="true" aria-controls="panel-1">General</button>\n  <button role="tab" aria-selected="false" aria-controls="panel-2">Advanced</button>\n</div>\n<div role="tabpanel" id="panel-1">General settings content</div>' },
  { label: "Combobox", html: '<label for="combo">Choose a fruit</label>\n<input id="combo" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="listbox1">\n<ul id="listbox1" role="listbox" hidden>\n  <li role="option">Apple</li>\n  <li role="option">Banana</li>\n</ul>' },
]

const IMPLICIT_ROLES: Record<string, string> = {
  A: "link", ARTICLE: "article", ASIDE: "complementary", BUTTON: "button",
  DETAILS: "group", DIALOG: "dialog", FOOTER: "contentinfo", FORM: "form",
  H1: "heading", H2: "heading", H3: "heading", H4: "heading", H5: "heading", H6: "heading",
  HEADER: "banner", HR: "separator", IMG: "img", INPUT: "textbox", LI: "listitem",
  MAIN: "main", NAV: "navigation", OL: "list", OPTION: "option", P: "paragraph",
  SECTION: "region", SELECT: "combobox", TABLE: "table", TEXTAREA: "textbox",
  UL: "list",
}

const faqItems = [
  { q: "What is WAI-ARIA?", a: "WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications) is a W3C specification that defines roles, states, and properties to make dynamic web content accessible to assistive technologies." },
  { q: "When should I use ARIA instead of native HTML?", a: "Only when there is no native HTML element that provides the semantics you need. The first rule of ARIA: do not use ARIA if you can use a native HTML element with the behavior built in." },
  { q: "What is the difference between aria-label and aria-labelledby?", a: "aria-label provides a string label directly, while aria-labelledby references the ID of a visible element whose text serves as the label. Prefer aria-labelledby when a visible label exists." },
  { q: "What are ARIA landmark roles?", a: "Landmark roles (banner, navigation, main, complementary, contentinfo, search, form, region) identify major page sections so assistive technology users can navigate between them quickly." },
  { q: "How do screen readers handle ARIA?", a: "Screen readers use ARIA roles, states, and properties to build an accessibility tree. When encountering an ARIA element, they announce its role, name, and current state." },
  { q: "What is the first rule of ARIA?", a: "Do not use ARIA if you can use a native HTML element or attribute with the semantics and behavior already built in. Native elements include keyboard interactions and accessibility support that ARIA alone cannot replicate." },
  { q: "What version of ARIA is current?", a: "WAI-ARIA 1.2 is the current W3C Recommendation (June 2023). WAI-ARIA 1.3 is in development as a Working Draft." },
  { q: "What are common ARIA mistakes?", a: "Using redundant roles on native elements, applying aria-hidden='true' on focusable elements, forgetting keyboard behavior for custom components, and mismatching roles with their required attributes." },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\bon\w+\s*=\s*\S+/gi, "")
    .replace(/javascript:/gi, "")
}

interface TreeNode { id: string; role: string; name: string; states: string }

function buildAccessibilityTree(html: string): TreeNode[] {
  if (typeof window === "undefined") return []
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const nodes: TreeNode[] = []
    let idx = 0

    function walk(el: Element) {
      const role =
        el.getAttribute("role") ||
        IMPLICIT_ROLES[el.tagName] ||
        (el.tagName === "DIV" || el.tagName === "SPAN" ? "generic" : el.tagName.toLowerCase())

      const name =
        el.getAttribute("aria-label") ||
        (el.getAttribute("aria-labelledby")
          ? doc.getElementById(el.getAttribute("aria-labelledby")!)?.textContent?.trim() || ""
          : "") ||
        el.getAttribute("alt") ||
        el.getAttribute("title") ||
        (el.children.length === 0 ? el.textContent?.trim() || "" : "")

      const stateAttrs = Array.from(el.attributes)
        .filter((a) => a.name.startsWith("aria-") && a.name !== "aria-label" && a.name !== "aria-labelledby")
        .map((a) => `${a.name}="${a.value}"`)
        .join(" ")

      if (role !== "generic" || name || stateAttrs) {
        nodes.push({ id: `node-${idx++}`, role, name, states: stateAttrs })
      }

      Array.from(el.children).forEach(walk)
    }

    Array.from(doc.body.children).forEach(walk)
    return nodes
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CodeDisplay({ code, title, variant, id, copiedId, onCopy }: {
  code: string; title?: string; variant?: "good" | "bad"; id: string
  copiedId: string | null; onCopy: (text: string, id: string) => void
}) {
  const borderClass = variant === "good" ? "border-l-4 border-l-green-500" : variant === "bad" ? "border-l-4 border-l-red-500" : ""
  return (
    <div className={`rounded-lg overflow-hidden border border-border ${borderClass}`}>
      <div className="flex items-center justify-between bg-muted px-4 py-2">
        <span className="text-xs font-medium flex items-center gap-2">
          {variant === "good" && <CheckCircle className="w-3 h-3 text-green-600" />}
          {variant === "bad" && <AlertTriangle className="w-3 h-3 text-red-600" />}
          {title || "HTML"}
        </span>
        <button onClick={() => onCopy(code, id)} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted-foreground/10" aria-label="Copy code">
          {copiedId === id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className="font-mono text-sm bg-slate-950 text-slate-100 dark:bg-slate-900 p-4 overflow-x-auto"><code>{code}</code></pre>
    </div>
  )
}

function ScreenReaderTable({ behavior }: { behavior: { nvda: string; jaws: string; voiceover: string } }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden text-sm">
      <table className="w-full">
        <thead><tr className="bg-muted">
          <th className="px-3 py-2 text-left font-medium">Screen Reader</th>
          <th className="px-3 py-2 text-left font-medium">Announcement</th>
        </tr></thead>
        <tbody>
          <tr className="border-t border-border">
            <td className="px-3 py-2 flex items-center gap-2"><Monitor className="w-4 h-4 text-muted-foreground" /> NVDA</td>
            <td className="px-3 py-2">{behavior.nvda}</td>
          </tr>
          <tr className="border-t border-border">
            <td className="px-3 py-2 flex items-center gap-2"><Monitor className="w-4 h-4 text-muted-foreground" /> JAWS</td>
            <td className="px-3 py-2">{behavior.jaws}</td>
          </tr>
          <tr className="border-t border-border">
            <td className="px-3 py-2 flex items-center gap-2"><Smartphone className="w-4 h-4 text-muted-foreground" /> VoiceOver</td>
            <td className="px-3 py-2">{behavior.voiceover}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AriaReferenceClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [expandedAttr, setExpandedAttr] = useState<string | null>(null)
  const [playgroundHtml, setPlaygroundHtml] = useState('<button aria-label="Close dialog">X</button>')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedComparison, setExpandedComparison] = useState<number | null>(null)
  const [expandedMistake, setExpandedMistake] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  // -- Filter logic --
  const filteredRoles = useMemo(() => {
    if (activeFilter === "attributes") return []
    const q = searchQuery.toLowerCase()
    return ariaRoles.filter((r) => {
      const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      const matchesFilter = activeFilter === "all" || r.category === activeFilter
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, activeFilter])

  const filteredAttributes = useMemo(() => {
    if (!["all", "attributes"].includes(activeFilter)) return []
    const q = searchQuery.toLowerCase()
    return ariaAttributes.filter((a) => {
      const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      return matchesSearch
    })
  }, [searchQuery, activeFilter])

  const totalItems = ariaRoles.length + ariaAttributes.length
  const shownItems = filteredRoles.length + filteredAttributes.length

  // -- Playground accessibility tree --
  const [accessibilityTree, setAccessibilityTree] = useState<TreeNode[]>([])
  useEffect(() => {
    const sanitized = sanitizeHtml(playgroundHtml)
    setAccessibilityTree(buildAccessibilityTree(sanitized))
  }, [playgroundHtml])

  const sanitizedHtml = useMemo(() => sanitizeHtml(playgroundHtml), [playgroundHtml])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">

      {/* ================================================================= */}
      {/* Section A: Search + Filters                                       */}
      {/* ================================================================= */}
      <section aria-label="Search and filter ARIA reference">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles, attributes, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg rounded-xl border-violet-200 dark:border-violet-800/50 focus-visible:ring-violet-500"
            aria-label="Search ARIA roles and attributes"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          {FILTER_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={activeFilter === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(opt.value)}
              className={activeFilter === opt.value ? "bg-violet-600 hover:bg-violet-700 text-white" : ""}
            >
              {opt.label}
            </Button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">
            Showing {shownItems} of {totalItems} items
          </span>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Section B: Quick Comparisons                                      */}
      {/* ================================================================= */}
      <section aria-label="Quick comparisons">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-violet-600" /> Quick Comparisons
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Comparison 1: aria-label vs aria-labelledby vs aria-describedby */}
          <Card className="border-violet-200 dark:border-violet-800/50">
            <CardHeader className="cursor-pointer" onClick={() => setExpandedComparison(expandedComparison === 0 ? null : 0)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">aria-label vs aria-labelledby vs aria-describedby</CardTitle>
                {expandedComparison === 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardHeader>
            {expandedComparison === 0 && (
              <CardContent>
                <div className="overflow-x-auto text-sm">
                  <table className="w-full">
                    <thead><tr className="bg-muted"><th className="px-2 py-1.5 text-left">Attribute</th><th className="px-2 py-1.5 text-left">Purpose</th><th className="px-2 py-1.5 text-left">When to Use</th><th className="px-2 py-1.5 text-left">Screen Reader</th></tr></thead>
                    <tbody>
                      <tr className="border-t"><td className="px-2 py-1.5 font-mono text-xs">aria-label</td><td className="px-2 py-1.5">Defines a string label directly</td><td className="px-2 py-1.5">When no visible text label exists</td><td className="px-2 py-1.5">Announces the label text</td></tr>
                      <tr className="border-t"><td className="px-2 py-1.5 font-mono text-xs">aria-labelledby</td><td className="px-2 py-1.5">References another element&apos;s ID as label</td><td className="px-2 py-1.5">When visible label text exists elsewhere</td><td className="px-2 py-1.5">Announces the referenced element&apos;s text</td></tr>
                      <tr className="border-t"><td className="px-2 py-1.5 font-mono text-xs">aria-describedby</td><td className="px-2 py-1.5">References supplementary description</td><td className="px-2 py-1.5">For additional context (instructions, errors)</td><td className="px-2 py-1.5">Announces after a pause</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Comparison 2: role="button" vs <button> */}
          <Card className="border-violet-200 dark:border-violet-800/50">
            <CardHeader className="cursor-pointer" onClick={() => setExpandedComparison(expandedComparison === 1 ? null : 1)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">role=&quot;button&quot; vs &lt;button&gt;</CardTitle>
                {expandedComparison === 1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardHeader>
            {expandedComparison === 1 && (
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <p className="font-semibold text-green-700 dark:text-green-300 mb-2">&lt;button&gt; (free)</p>
                    <ul className="space-y-1 text-xs">
                      <li>Keyboard focus</li><li>Enter/Space activation</li><li>Click events</li><li>Form submission</li><li>Disabled state</li><li>Accessible role</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-red-700 dark:text-red-300 mb-2">role=&quot;button&quot; (manual)</p>
                    <ul className="space-y-1 text-xs">
                      <li>Add tabindex=&quot;0&quot;</li><li>Add keydown handler</li><li>Add click handler</li><li>No form support</li><li>Manage aria-disabled</li><li>Style focus ring</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Comparison 3: aria-hidden vs display:none vs visibility:hidden */}
          <Card className="border-violet-200 dark:border-violet-800/50">
            <CardHeader className="cursor-pointer" onClick={() => setExpandedComparison(expandedComparison === 2 ? null : 2)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">aria-hidden vs display:none vs visibility:hidden</CardTitle>
                {expandedComparison === 2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardHeader>
            {expandedComparison === 2 && (
              <CardContent>
                <div className="overflow-x-auto text-sm">
                  <table className="w-full">
                    <thead><tr className="bg-muted"><th className="px-2 py-1.5 text-left">Method</th><th className="px-2 py-1.5 text-left">Visible</th><th className="px-2 py-1.5 text-left">In A11y Tree</th><th className="px-2 py-1.5 text-left">Focusable</th><th className="px-2 py-1.5 text-left">Use When</th></tr></thead>
                    <tbody>
                      <tr className="border-t"><td className="px-2 py-1.5 font-mono text-xs">aria-hidden=&quot;true&quot;</td><td className="px-2 py-1.5">Yes</td><td className="px-2 py-1.5">No</td><td className="px-2 py-1.5">Yes (danger!)</td><td className="px-2 py-1.5">Decorative visuals</td></tr>
                      <tr className="border-t"><td className="px-2 py-1.5 font-mono text-xs">display: none</td><td className="px-2 py-1.5">No</td><td className="px-2 py-1.5">No</td><td className="px-2 py-1.5">No</td><td className="px-2 py-1.5">Completely hidden content</td></tr>
                      <tr className="border-t"><td className="px-2 py-1.5 font-mono text-xs">visibility: hidden</td><td className="px-2 py-1.5">No</td><td className="px-2 py-1.5">No</td><td className="px-2 py-1.5">No</td><td className="px-2 py-1.5">Reserve layout space</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Section C: ARIA Roles Grid                                        */}
      {/* ================================================================= */}
      {filteredRoles.length > 0 && (
        <section aria-label="ARIA roles">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-600" /> ARIA Roles
            <Badge variant="secondary" className="ml-2">{filteredRoles.length}</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => {
              const isExpanded = expandedRole === role.name
              return (
                <Card key={role.name} className="border-violet-100 dark:border-violet-900/30 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedRole(isExpanded ? null : role.name)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1.5">
                        <CardTitle className="font-mono text-lg font-bold">{role.name}</CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge className={CATEGORY_COLORS[role.category]}>{role.category}</Badge>
                          <Badge variant="outline" className="text-xs">ARIA {role.ariaVersion}</Badge>
                          {role.nativeEquivalent && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                              Use {role.nativeEquivalent} instead
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">{role.description}</CardDescription>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-4 border-t pt-4">
                      {/* Code Example */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1"><Code className="w-4 h-4" /> Code Example</h4>
                        <CodeDisplay code={role.codeExample.html} title="HTML" id={`role-${role.name}`} copiedId={copiedId} onCopy={copyToClipboard} />
                      </div>

                      {/* Screen Reader Behavior */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Screen Reader Behavior</h4>
                        <ScreenReaderTable behavior={role.screenReaderBehavior} />
                      </div>

                      {/* Keyboard Pattern */}
                      {role.keyboardPattern && (
                        <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800">
                          <h4 className="text-sm font-semibold mb-1">Keyboard Pattern</h4>
                          <p className="text-sm text-muted-foreground">{role.keyboardPattern}</p>
                        </div>
                      )}

                      {/* Required Attributes */}
                      {role.requiredAttributes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Required Attributes</h4>
                          <div className="flex flex-wrap gap-1">{role.requiredAttributes.map((a) => <Badge key={a} variant="outline" className="font-mono text-xs">{a}</Badge>)}</div>
                        </div>
                      )}

                      {/* WCAG Criteria */}
                      {role.wcagCriteria.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">WCAG Criteria</h4>
                          <div className="flex flex-wrap gap-1">{role.wcagCriteria.map((c) => (
                            <a key={c} href={`https://www.w3.org/WAI/WCAG21/Understanding/${c.replace(/\./g, "")}`} target="_blank" rel="noopener noreferrer">
                              <Badge variant="outline" className="font-mono text-xs hover:bg-violet-100 dark:hover:bg-violet-900/40">{c} <ExternalLink className="w-3 h-3 ml-1" /></Badge>
                            </a>
                          ))}</div>
                        </div>
                      )}

                      {/* Common Mistakes */}
                      {role.commonMistakes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Common Mistakes</h4>
                          <ul className="space-y-1">{role.commonMistakes.map((m, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />{m}
                            </li>
                          ))}</ul>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* Section D: ARIA Attributes Grid                                   */}
      {/* ================================================================= */}
      {filteredAttributes.length > 0 && (
        <section aria-label="ARIA attributes">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" /> ARIA Attributes
            <Badge variant="secondary" className="ml-2">{filteredAttributes.length}</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAttributes.map((attr) => {
              const isExpanded = expandedAttr === attr.name
              return (
                <Card key={attr.name} className="border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedAttr(isExpanded ? null : attr.name)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1.5">
                        <CardTitle className="font-mono text-lg font-bold">{attr.name}</CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge className={attr.type === "state" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"}>
                            {attr.type}
                          </Badge>
                          <Badge className={CATEGORY_COLORS[attr.category]}>{attr.category}</Badge>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">{attr.description}</CardDescription>
                    <p className="text-xs text-muted-foreground mt-1">Value: {attr.valueType}</p>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-4 border-t pt-4">
                      <CodeDisplay code={attr.codeExample.good} title="Do" variant="good" id={`attr-good-${attr.name}`} copiedId={copiedId} onCopy={copyToClipboard} />
                      <CodeDisplay code={attr.codeExample.bad} title="Don't" variant="bad" id={`attr-bad-${attr.name}`} copiedId={copiedId} onCopy={copyToClipboard} />

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Screen Reader Behavior</h4>
                        <ScreenReaderTable behavior={attr.screenReaderBehavior} />
                      </div>

                      {attr.vsComparison && (
                        <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 text-sm space-y-1">
                          <p className="font-semibold">vs {attr.vsComparison.compareTo}</p>
                          <p><span className="font-medium">Use {attr.name}:</span> {attr.vsComparison.whenToUse}</p>
                          <p><span className="font-medium">Use {attr.vsComparison.compareTo}:</span> {attr.vsComparison.whenToUseOther}</p>
                        </div>
                      )}

                      {attr.wcagCriteria.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">WCAG Criteria</h4>
                          <div className="flex flex-wrap gap-1">{attr.wcagCriteria.map((c) => (
                            <a key={c} href={`https://www.w3.org/WAI/WCAG21/Understanding/${c.replace(/\./g, "")}`} target="_blank" rel="noopener noreferrer">
                              <Badge variant="outline" className="font-mono text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/40">{c} <ExternalLink className="w-3 h-3 ml-1" /></Badge>
                            </a>
                          ))}</div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* Section E: Live ARIA Playground                                    */}
      {/* ================================================================= */}
      <section aria-label="Live ARIA playground">
        <Card className="border-2 border-violet-200 dark:border-violet-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Play className="w-6 h-6 text-violet-600" /> Live ARIA Playground
            </CardTitle>
            <CardDescription>
              Write HTML with ARIA attributes and see how assistive technology interprets it.
            </CardDescription>
            <div className="pt-2">
              <label htmlFor="playground-preset" className="text-sm font-medium mr-2">Load preset:</label>
              <select
                id="playground-preset"
                className="text-sm rounded-md border border-border bg-background px-3 py-1.5"
                onChange={(e) => {
                  const preset = playgroundPresets.find((p) => p.label === e.target.value)
                  if (preset) setPlaygroundHtml(preset.html)
                }}
                defaultValue=""
              >
                <option value="" disabled>Choose an example...</option>
                {playgroundPresets.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: Editor */}
              <div>
                <label htmlFor="playground-editor" className="text-sm font-medium block mb-2">HTML Editor</label>
                <textarea
                  id="playground-editor"
                  className="font-mono text-sm w-full h-48 p-4 rounded-lg border bg-slate-950 text-green-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
                  value={playgroundHtml}
                  onChange={(e) => setPlaygroundHtml(e.target.value)}
                  spellCheck={false}
                />
              </div>

              {/* Right: Output */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Rendered Preview</p>
                  <div
                    className="p-4 border rounded-lg min-h-[60px] bg-background"
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Accessibility Tree
                  </p>
                  <div className="p-4 border rounded-lg bg-muted font-mono text-sm space-y-1 min-h-[60px]">
                    {accessibilityTree.length === 0 ? (
                      <p className="text-muted-foreground italic">No accessible elements detected.</p>
                    ) : (
                      accessibilityTree.map((node) => (
                        <div key={node.id} className="flex flex-wrap gap-x-2">
                          <span className="text-violet-600 dark:text-violet-400">role=&quot;{node.role}&quot;</span>
                          {node.name && <span className="text-green-600 dark:text-green-400">name=&quot;{node.name}&quot;</span>}
                          {node.states && <span className="text-amber-600 dark:text-amber-400">{node.states}</span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ================================================================= */}
      {/* Section F: ARIA vs Native HTML Table                              */}
      {/* ================================================================= */}
      <section aria-label="ARIA versus native HTML comparison">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-violet-600" /> ARIA vs Native HTML
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-3 text-left font-semibold">ARIA Role</th>
                    <th className="px-4 py-3 text-left font-semibold">Native HTML</th>
                    <th className="px-4 py-3 text-left font-semibold">Recommendation</th>
                    <th className="px-4 py-3 text-left font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {nativeComparisons.map((c) => (
                    <tr key={c.ariaRole} className="border-t border-border">
                      <td className="px-4 py-3 font-mono">{c.ariaRole}</td>
                      <td className="px-4 py-3 font-mono">{c.nativeHtml}</td>
                      <td className="px-4 py-3">
                        <Badge className={c.recommendation.toLowerCase().includes("always") || c.recommendation.toLowerCase().includes("strong")
                          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                        }>
                          {c.recommendation}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ================================================================= */}
      {/* Section G: Common ARIA Mistakes                                   */}
      {/* ================================================================= */}
      <section aria-label="Common ARIA mistakes">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-600" /> Common ARIA Mistakes
        </h2>
        <div className="space-y-4">
          {commonMistakes.map((mistake) => {
            const isOpen = expandedMistake === mistake.id
            return (
              <Card key={mistake.id} className="border-amber-100 dark:border-amber-900/30">
                <CardHeader className="cursor-pointer" onClick={() => setExpandedMistake(isOpen ? null : mistake.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                      <CardTitle className="text-base">{mistake.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">{mistake.impact}</Badge>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                  </div>
                </CardHeader>
                {isOpen && (
                  <CardContent className="space-y-4 border-t pt-4">
                    <p className="text-sm text-muted-foreground">{mistake.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CodeDisplay code={mistake.badCode} title="Don't" variant="bad" id={`mistake-bad-${mistake.id}`} copiedId={copiedId} onCopy={copyToClipboard} />
                      <CodeDisplay code={mistake.goodCode} title="Do" variant="good" id={`mistake-good-${mistake.id}`} copiedId={copiedId} onCopy={copyToClipboard} />
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">WCAG {mistake.wcagCriteria}</Badge>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* Section H: FAQ                                                    */}
      {/* ================================================================= */}
      <section aria-label="Frequently asked questions">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-violet-600" /> Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqItems.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                aria-expanded={expandedFaq === i}
              >
                {faq.q}
                {expandedFaq === i ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
