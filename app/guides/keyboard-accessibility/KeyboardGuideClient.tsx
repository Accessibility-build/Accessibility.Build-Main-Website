"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Keyboard,
  Eye,
  SkipForward,
  Focus,
  ArrowLeftRight,
  Lock,
  Maximize2,
  Settings,
  CheckSquare,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  Download,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Inline helper: CodeBlock
// ---------------------------------------------------------------------------
function CodeBlock({
  code,
  language = "typescript",
  title,
  variant,
}: {
  code: string
  language?: string
  title?: string
  variant?: "good" | "bad" | "neutral"
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden border my-4",
        variant === "good"
          ? "border-green-300 dark:border-green-700"
          : variant === "bad"
            ? "border-red-300 dark:border-red-700"
            : "border-slate-200 dark:border-slate-700"
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
        <div className="flex items-center gap-2">
          {variant === "good" && (
            <Badge className="bg-green-600 text-white text-xs">
              &#10003; Accessible
            </Badge>
          )}
          {variant === "bad" && (
            <Badge className="bg-red-600 text-white text-xs">
              &#10007; Inaccessible
            </Badge>
          )}
          <span className="text-sm text-slate-300">{title || language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          className="text-slate-300 hover:text-white h-7"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre className="p-4 bg-slate-900 text-slate-100 overflow-x-auto text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline helper: DemoContainer
// ---------------------------------------------------------------------------
function DemoContainer({
  title,
  instructions,
  children,
}: {
  title: string
  instructions?: string
  children: React.ReactNode
}) {
  return (
    <div className="border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 bg-blue-50/50 dark:bg-blue-950/20 my-6">
      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant="outline"
          className="text-blue-600 dark:text-blue-400 border-blue-300"
        >
          Interactive Demo
        </Badge>
      </div>
      {instructions && (
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0" /> {instructions}
        </p>
      )}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline helper: InfoBox
// ---------------------------------------------------------------------------
function InfoBox({
  children,
  variant = "info",
}: {
  children: React.ReactNode
  variant?: "info" | "warning" | "success"
}) {
  const styles = {
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    warning:
      "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
    success:
      "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
  }
  return (
    <div className={cn("rounded-lg border p-4 my-4 text-sm", styles[variant])}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// TOC sections
// ---------------------------------------------------------------------------
const sections = [
  { id: "introduction", title: "Introduction", icon: Keyboard },
  { id: "fundamentals", title: "Fundamentals", icon: Eye },
  { id: "skip-links", title: "Skip Links", icon: SkipForward },
  { id: "focus-management", title: "Focus Management", icon: Focus },
  { id: "roving-tabindex", title: "Roving Tabindex", icon: ArrowLeftRight },
  { id: "keyboard-traps", title: "Keyboard Traps", icon: Lock },
  { id: "focus-trapping", title: "Modal Focus Trapping", icon: Maximize2 },
  { id: "custom-widgets", title: "Custom Widgets", icon: Settings },
  { id: "testing-checklist", title: "Testing Checklist", icon: CheckSquare },
]

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function KeyboardGuideClient() {
  const [activeSection, setActiveSection] = useState("introduction")
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>(
    {}
  )

  // ---- Intersection Observer for active section tracking ----
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-20% 0px -75% 0px", threshold: 0 }
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  // ---- Checklist helpers ----
  const toggleChecklist = (index: number) => {
    setChecklistState((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const checklistItems = [
    "Can you Tab to all interactive elements?",
    "Is the tab order logical and follows visual layout?",
    "Are focus indicators clearly visible?",
    "Can you activate all controls with Enter/Space?",
    "Can you navigate custom widgets with arrow keys?",
    "Are there any keyboard traps?",
    "Do modals trap and return focus correctly?",
    "Do skip navigation links work?",
    "Can you access all content without a mouse?",
    "Does focus move correctly for dynamic content?",
  ]

  const downloadChecklist = async () => {
    try {
      const { default: jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      doc.setFontSize(18)
      doc.text("Keyboard Accessibility Testing Checklist", 20, 20)

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text("Source: accessibility.build/guides/keyboard-accessibility", 20, 28)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      checklistItems.forEach((item, i) => {
        const yPos = 40 + i * 12
        const mark = checklistState[i] ? "[x]" : "[ ]"
        doc.text(`${mark}  ${i + 1}. ${item}`, 20, yPos)
      })

      const instructionsY = 40 + checklistItems.length * 12 + 10
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      doc.text("Instructions:", 20, instructionsY)
      doc.text(
        "- Disconnect your mouse before testing",
        20,
        instructionsY + 8
      )
      doc.text(
        "- Navigate the entire page using only keyboard",
        20,
        instructionsY + 16
      )
      doc.text(
        "- Key commands: Tab, Shift+Tab, Enter, Space, Arrow keys, Escape",
        20,
        instructionsY + 24
      )
      doc.text("- Mark each item as you verify it", 20, instructionsY + 32)

      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text("Generated by Accessibility.build", 20, instructionsY + 48)

      doc.save("keyboard-accessibility-checklist.pdf")
    } catch {
      // Fallback to plain text download if jsPDF is not available
      const text = [
        "KEYBOARD ACCESSIBILITY TESTING CHECKLIST",
        "=========================================",
        "Source: accessibility.build/guides/keyboard-accessibility",
        "",
        ...checklistItems.map(
          (item, i) =>
            `${checklistState[i] ? "[x]" : "[ ]"} ${i + 1}. ${item}`
        ),
        "",
        "Instructions:",
        "- Disconnect your mouse before testing",
        "- Navigate the entire page using only keyboard",
        "- Key commands: Tab, Shift+Tab, Enter, Space, Arrow keys, Escape",
        "- Mark each item as you verify it",
        "",
        "Generated by Accessibility.build",
      ].join("\n")

      const blob = new Blob([text], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "keyboard-accessibility-checklist.txt"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // ===========================================================================
  // Skip Link Demo
  // ===========================================================================
  const skipLinkMainRef = useRef<HTMLDivElement>(null)
  const [skipLinkVisible, setSkipLinkVisible] = useState(false)

  // ===========================================================================
  // Focus Management Demo
  // ===========================================================================
  const [fmItems, setFmItems] = useState(["Item 1", "Item 2", "Item 3"])
  const [fmLoading, setFmLoading] = useState(false)
  const [fmJustAdded, setFmJustAdded] = useState(false)
  const fmNewItemRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (fmJustAdded && fmNewItemRef.current) {
      fmNewItemRef.current.focus()
      setFmJustAdded(false)
    }
  }, [fmJustAdded, fmItems])

  const loadMoreItems = useCallback(() => {
    setFmLoading(true)
    setTimeout(() => {
      const nextIndex = fmItems.length + 1
      setFmItems((prev) => [
        ...prev,
        `Item ${nextIndex}`,
        `Item ${nextIndex + 1}`,
        `Item ${nextIndex + 2}`,
      ])
      setFmLoading(false)
      setFmJustAdded(true)
    }, 500)
  }, [fmItems.length])

  // ===========================================================================
  // Roving Tabindex Demo
  // ===========================================================================
  const [rovingActive, setRovingActive] = useState(0)
  const rovingRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rovingItems = [
    { label: "Bold", char: "B" },
    { label: "Italic", char: "I" },
    { label: "Underline", char: "U" },
    { label: "Link", char: "L" },
  ]

  useEffect(() => {
    rovingRefs.current[rovingActive]?.focus()
  }, [rovingActive])

  const handleRovingKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      setRovingActive((index + 1) % rovingItems.length)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setRovingActive(
        (index - 1 + rovingItems.length) % rovingItems.length
      )
    } else if (e.key === "Home") {
      e.preventDefault()
      setRovingActive(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setRovingActive(rovingItems.length - 1)
    }
  }

  // ===========================================================================
  // Keyboard Trap Demo
  // ===========================================================================
  const [trapActive, setTrapActive] = useState(false)

  const handleTrapKeyDown = (e: React.KeyboardEvent) => {
    if (trapActive && e.key === "Tab") {
      e.preventDefault() // This IS the trap
    }
    if (e.key === "Escape") {
      setTrapActive(false)
    }
  }

  // ===========================================================================
  // Modal Focus Trapping Demo
  // ===========================================================================
  const [modalOpen, setModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const modalTriggerRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (modalOpen) {
      previousFocusRef.current = document.activeElement
      setTimeout(() => {
        modalRef.current?.focus()
      }, 50)
    } else if (previousFocusRef.current) {
      ;(previousFocusRef.current as HTMLElement)?.focus()
      previousFocusRef.current = null
    }
  }, [modalOpen])

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setModalOpen(false)
      return
    }
    if (e.key === "Tab") {
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) return
      const first = focusable[0] as HTMLElement
      const last = focusable[focusable.length - 1] as HTMLElement
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  // ===========================================================================
  // Render
  // ===========================================================================
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* ---------------------------------------------------------------- */}
          {/* TOC Sidebar                                                       */}
          {/* ---------------------------------------------------------------- */}
          <nav className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-3">
                On This Page
              </h2>
              <ul className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          document
                            .getElementById(section.id)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all",
                          activeSection === section.id
                            ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium border-l-2 border-blue-600"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {section.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          {/* ---------------------------------------------------------------- */}
          {/* Main Content                                                      */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex-1 min-w-0 max-w-4xl">
            {/* ============================================================ */}
            {/* 1. INTRODUCTION                                                */}
            {/* ============================================================ */}
            <section id="introduction" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Keyboard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Introduction
                </h2>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  Keyboard accessibility ensures that every feature on your
                  website can be reached and operated using only a keyboard --
                  no mouse or touch input required. According to the CDC,
                  approximately <strong>26% of adults in the United States</strong> have
                  some form of disability, and roughly <strong>7.5%</strong> have a motor
                  disability that affects their ability to use a pointing device.
                  These numbers represent tens of millions of people who may
                  depend entirely on keyboard navigation to interact with the
                  web.
                </p>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  The reach of keyboard accessibility extends far beyond users
                  with permanent disabilities. Power users prefer keyboard
                  shortcuts for speed and efficiency. Screen reader users rely
                  on the keyboard as their primary navigation interface since
                  screen readers are inherently keyboard-driven tools. People
                  with temporary injuries -- a broken arm, recovering from
                  surgery, or dealing with repetitive strain injury -- also
                  depend on keyboard access. By building keyboard-accessible
                  interfaces, you serve all of these groups simultaneously.
                </p>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  The Web Content Accessibility Guidelines (WCAG) encode these
                  requirements into specific, testable success criteria. The
                  four most directly relevant are:{" "}
                  <strong>2.1.1 Keyboard</strong> (all functionality must be
                  operable via keyboard),{" "}
                  <strong>2.1.2 No Keyboard Trap</strong> (focus can always be
                  moved away from any component),{" "}
                  <strong>2.4.3 Focus Order</strong> (navigation sequence must
                  be logical and meaningful), and{" "}
                  <strong>2.4.7 Focus Visible</strong> (the keyboard focus
                  indicator must always be clearly visible). This guide covers
                  all four in depth, with interactive demos and production-ready
                  code examples.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Badge className="bg-blue-600 text-white text-xs mb-2">
                      Level A
                    </Badge>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      2.1.1
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Keyboard
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Badge className="bg-blue-600 text-white text-xs mb-2">
                      Level A
                    </Badge>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      2.1.2
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No Keyboard Trap
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Badge className="bg-blue-600 text-white text-xs mb-2">
                      Level A
                    </Badge>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      2.4.3
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Focus Order
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Badge className="bg-yellow-600 text-white text-xs mb-2">
                      Level AA
                    </Badge>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      2.4.7
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Focus Visible
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ============================================================ */}
            {/* 2. FUNDAMENTALS                                                */}
            {/* ============================================================ */}
            <section id="fundamentals" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Fundamentals
                </h2>
              </div>

              <div className="space-y-8">
                {/* Tab Order */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Tab Order
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    When a user presses the Tab key, the browser moves focus to
                    the next focusable element in the <strong>DOM order</strong>{" "}
                    -- the order elements appear in your HTML source. This is
                    why your source order should match your visual layout. Using
                    CSS to visually rearrange elements (via{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      flexbox order
                    </code>
                    ,{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      grid positioning
                    </code>
                    , or{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      absolute positioning
                    </code>
                    ) without matching the DOM order creates a disorienting
                    experience for keyboard users.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    The{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      tabindex
                    </code>{" "}
                    attribute controls how elements participate in the tab
                    sequence. Use{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      tabindex=&quot;0&quot;
                    </code>{" "}
                    to add a non-interactive element to the natural tab order.
                    Use{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      tabindex=&quot;-1&quot;
                    </code>{" "}
                    to make an element focusable via JavaScript but not via Tab.
                    Never use positive values like{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      tabindex=&quot;5&quot;
                    </code>{" "}
                    -- they override the natural DOM order and create an
                    unpredictable, maintenance-nightmare tab sequence.
                  </p>
                  <InfoBox variant="warning">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Never use positive tabindex values.</strong> They
                        override the natural tab order and make maintenance
                        extremely difficult. Stick to{" "}
                        <code className="font-mono">0</code> and{" "}
                        <code className="font-mono">-1</code>.
                      </span>
                    </div>
                  </InfoBox>
                </div>

                {/* Native vs Custom Elements */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Native vs Custom Elements
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    Semantic HTML elements like{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      &lt;button&gt;
                    </code>
                    ,{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      &lt;a href&gt;
                    </code>
                    , and{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      &lt;input&gt;
                    </code>{" "}
                    are keyboard-accessible by default. A button can be activated
                    with Enter or Space. A link can be followed with Enter. Form
                    inputs accept keyboard input naturally. When you use a{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      &lt;div&gt;
                    </code>{" "}
                    or{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      &lt;span&gt;
                    </code>{" "}
                    as an interactive element, you lose all built-in behavior and
                    must manually add{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      tabindex
                    </code>
                    ,{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      role
                    </code>
                    ,{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      onKeyDown
                    </code>
                    , and{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      onClick
                    </code>{" "}
                    handlers. Always prefer native elements when a suitable one
                    exists.
                  </p>
                </div>

                {/* Focus Indicators */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Focus Indicators
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    WCAG 2.4.7 requires that the keyboard focus indicator is
                    visible at all times. The modern approach is to use{" "}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                      :focus-visible
                    </code>{" "}
                    which only shows the focus ring for keyboard navigation (not
                    mouse clicks), giving you the best of both worlds. Never
                    remove the browser default outline without providing a
                    high-contrast replacement.
                  </p>

                  <CodeBlock
                    code={`:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}`}
                    language="css"
                    title="focus-indicators.css"
                    variant="good"
                  />

                  <CodeBlock
                    code={`*:focus {
  outline: none; /* NEVER do this without a replacement! */
}`}
                    language="css"
                    title="never-do-this.css"
                    variant="bad"
                  />
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* 3. SKIP LINKS                                                  */}
            {/* ============================================================ */}
            <section id="skip-links" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <SkipForward className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Skip Links
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Skip navigation links are anchor links placed at the very
                  beginning of a page. They are visually hidden until they
                  receive keyboard focus, at which point they slide into view.
                  When activated, they move focus directly to the main content
                  area, allowing keyboard users to bypass the header, navigation
                  menus, and other repetitive blocks that appear on every page.
                  Without skip links, a keyboard user visiting your site must
                  press Tab through every single navigation link on every page
                  load before reaching the content.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  WCAG Success Criterion 2.4.1 (Bypass Blocks) requires a
                  mechanism for skipping repeated content. Skip links are the
                  simplest, most universally supported approach. They are
                  typically implemented as the very first element inside the{" "}
                  <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                    &lt;body&gt;
                  </code>{" "}
                  tag, styled off-screen by default, and animated into view on
                  focus.
                </p>
              </div>

              <DemoContainer
                title="Skip Link Demo"
                instructions="Press Tab to focus into this demo. The skip link will appear at the top-left. Press Enter to jump past the nav links directly to the main content area."
              >
                <div className="relative bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {/* Skip link */}
                  <a
                    href="#demo-main-content"
                    className={cn(
                      "absolute left-2 z-50 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400",
                      skipLinkVisible ? "top-2" : "-top-12"
                    )}
                    onFocus={() => setSkipLinkVisible(true)}
                    onBlur={() => setSkipLinkVisible(false)}
                    onClick={(e) => {
                      e.preventDefault()
                      skipLinkMainRef.current?.focus()
                    }}
                  >
                    Skip to main content
                  </a>

                  {/* Mini header */}
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        Logo
                      </span>
                      <nav className="flex gap-2">
                        {["Home", "About", "Contact", "Blog"].map((label) => (
                          <a
                            key={label}
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {label}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Mini main content */}
                  <div
                    ref={skipLinkMainRef}
                    id="demo-main-content"
                    tabIndex={-1}
                    className="p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-b-lg"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
                      Main Content Area
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Focus landed here after activating the skip link,
                      bypassing all four navigation links above.
                    </p>
                  </div>
                </div>
              </DemoContainer>

              <CodeBlock
                code={`<!-- Place as the FIRST element inside <body> -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/blog">Blog</a>
  </nav>
</header>

<main id="main-content" tabindex="-1">
  <!-- Your page content -->
</main>`}
                language="html"
                title="skip-link.html"
                variant="good"
              />

              <CodeBlock
                code={`.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #1d4ed8;
  color: white;
  padding: 8px 16px;
  z-index: 100;
  font-size: 14px;
  font-weight: 500;
  border-radius: 0 0 4px 0;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 0;
}`}
                language="css"
                title="skip-link.css"
                variant="good"
              />
            </section>

            {/* ============================================================ */}
            {/* 4. FOCUS MANAGEMENT                                            */}
            {/* ============================================================ */}
            <section id="focus-management" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Focus className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Focus Management
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  In static HTML pages, focus management happens naturally -- the
                  user tabs through elements in sequence. But modern web
                  applications are dynamic: content loads asynchronously, pages
                  change without full reloads, and elements appear and disappear
                  in response to user actions. In these situations, you must
                  programmatically move focus to keep keyboard users oriented.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  When to Manage Focus
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                  <li>
                    <strong>After SPA page navigation:</strong> Move focus to the
                    new page heading or main content area.
                  </li>
                  <li>
                    <strong>After adding dynamic content:</strong> When a "Load
                    more" button adds items, move focus to the first new item.
                  </li>
                  <li>
                    <strong>After removing content:</strong> Move focus to the
                    next or previous sibling, never leave it on a removed
                    element.
                  </li>
                  <li>
                    <strong>After form submission:</strong> Move focus to a
                    success or error message so screen readers announce it
                    immediately.
                  </li>
                </ul>
              </div>

              <DemoContainer
                title="Focus Management Demo"
                instructions='Click "Load 3 More Items" and notice that focus automatically moves to the first new item. This is focus management in action.'
              >
                <div className="space-y-3">
                  <ul
                    className="space-y-1"
                    role="list"
                    aria-label="Dynamic item list"
                  >
                    {fmItems.map((item, i) => (
                      <li
                        key={item}
                        ref={
                          i === fmItems.length - 3 && fmJustAdded
                            ? fmNewItemRef
                            : null
                        }
                        tabIndex={
                          i === fmItems.length - 3 && fmJustAdded
                            ? -1
                            : undefined
                        }
                        className="px-3 py-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={loadMoreItems}
                    disabled={fmLoading}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {fmLoading ? "Loading..." : "Load 3 More Items"}
                  </Button>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    After loading, focus moves to the first new item via a{" "}
                    <code className="font-mono">useRef</code> +{" "}
                    <code className="font-mono">.focus()</code> pattern.
                  </p>
                </div>
              </DemoContainer>

              <CodeBlock
                code={`import { useRef, useEffect, useState } from 'react';

function DynamicList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [justAdded, setJustAdded] = useState(false);
  const newItemRef = useRef<HTMLLIElement>(null);

  // Move focus to the first new item after loading
  useEffect(() => {
    if (justAdded && newItemRef.current) {
      newItemRef.current.focus();
      setJustAdded(false);
    }
  }, [justAdded, items]);

  const loadMore = () => {
    const nextIndex = items.length + 1;
    setItems(prev => [
      ...prev,
      \`Item \${nextIndex}\`,
      \`Item \${nextIndex + 1}\`,
      \`Item \${nextIndex + 2}\`,
    ]);
    setJustAdded(true);
  };

  return (
    <div>
      <ul>
        {items.map((item, i) => (
          <li
            key={item}
            ref={i === items.length - 3 && justAdded ? newItemRef : null}
            tabIndex={i === items.length - 3 && justAdded ? -1 : undefined}
          >
            {item}
          </li>
        ))}
      </ul>
      <button onClick={loadMore}>Load more items</button>
    </div>
  );
}`}
                language="typescript"
                title="FocusManagement.tsx"
                variant="good"
              />
            </section>

            {/* ============================================================ */}
            {/* 5. ROVING TABINDEX                                             */}
            {/* ============================================================ */}
            <section id="roving-tabindex" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <ArrowLeftRight className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Roving Tabindex
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Consider a toolbar with 10 buttons. If every button were in
                  the tab order, a user would need to press Tab 10 times to move
                  past the toolbar. The roving tabindex pattern solves this:
                  only <strong>one</strong> element in the group has{" "}
                  <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                    tabindex=&quot;0&quot;
                  </code>
                  , making it the single tab stop. All other elements have{" "}
                  <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                    tabindex=&quot;-1&quot;
                  </code>
                  . Arrow keys move focus (and the{" "}
                  <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                    tabindex=&quot;0&quot;
                  </code>{" "}
                  designation) between items within the group.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  This pattern is used in toolbars, tab lists, menu bars, tree
                  views, and radio groups. The user Tabs into the widget, uses
                  Arrow keys to navigate within it, and Tabs out to the next
                  component. Home jumps to the first item, End jumps to the
                  last. This drastically reduces the number of keystrokes
                  required to navigate past composite widgets.
                </p>
              </div>

              <DemoContainer
                title="Roving Tabindex Toolbar"
                instructions="Tab into the toolbar. Use Left/Right Arrow keys to move between buttons. Tab again to exit. Home/End jump to first/last button."
              >
                <div className="space-y-4">
                  <div
                    role="toolbar"
                    aria-label="Text formatting"
                    className="flex gap-1 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-fit"
                  >
                    {rovingItems.map((item, i) => (
                      <button
                        key={item.label}
                        ref={(el) => {
                          rovingRefs.current[i] = el
                        }}
                        tabIndex={i === rovingActive ? 0 : -1}
                        onKeyDown={(e) => handleRovingKeyDown(e, i)}
                        onClick={() => setRovingActive(i)}
                        aria-label={item.label}
                        aria-pressed={i === rovingActive}
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
                          i === rovingActive
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        )}
                      >
                        {item.char} - {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-xs">
                        Tab
                      </kbd>{" "}
                      enter/exit
                    </span>
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-xs">
                        Arrow keys
                      </kbd>{" "}
                      move between buttons
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Active:{" "}
                    <strong className="text-slate-700 dark:text-slate-200">
                      {rovingItems[rovingActive].label}
                    </strong>{" "}
                    (tabindex=&quot;0&quot;). All others have tabindex=&quot;-1&quot;.
                  </p>
                </div>
              </DemoContainer>

              <CodeBlock
                code={`import { useState, useRef, useEffect } from 'react';

function Toolbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = ['Bold', 'Italic', 'Underline', 'Link'];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Move DOM focus whenever activeIndex changes
  useEffect(() => {
    buttonRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setActiveIndex((index + 1) % items.length);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setActiveIndex((index - 1 + items.length) % items.length);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
    }
  };

  return (
    <div role="toolbar" aria-label="Formatting options">
      {items.map((item, i) => (
        <button
          key={item}
          ref={(el) => { buttonRefs.current[i] = el; }}
          tabIndex={i === activeIndex ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onClick={() => setActiveIndex(i)}
          aria-pressed={i === activeIndex}
        >
          {item}
        </button>
      ))}
    </div>
  );
}`}
                language="typescript"
                title="RovingTabindex.tsx"
                variant="good"
              />
            </section>

            {/* ============================================================ */}
            {/* 6. KEYBOARD TRAPS                                              */}
            {/* ============================================================ */}
            <section id="keyboard-traps" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Keyboard Traps
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  A keyboard trap occurs when a keyboard user navigates into a
                  component and cannot navigate out using the keyboard alone.
                  The Tab key and Shift+Tab either do nothing or cycle within
                  the same component indefinitely. Common causes include custom
                  widgets that intercept Tab key events without allowing escape,
                  embedded third-party iframes (ads, chat widgets, video
                  players), JavaScript event listeners that call{" "}
                  <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                    e.preventDefault()
                  </code>{" "}
                  on all keydown events, and auto-focus loops where a blur
                  handler immediately refocuses the same element.
                </p>

                <InfoBox variant="warning">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>WCAG 2.1.2 (No Keyboard Trap):</strong> If
                      keyboard focus can be moved to a component using a
                      keyboard interface, then focus must be movable away from
                      that component using only a keyboard. If it requires more
                      than standard keys (Tab, Shift+Tab, Arrow keys), the user
                      must be advised of the method.
                    </span>
                  </div>
                </InfoBox>
              </div>

              <DemoContainer
                title="Keyboard Trap Demo"
                instructions='Switch between the "Bad" and "Good" tabs to compare. In the Bad tab, activating the trap prevents Tab from working. Press Escape to exit the trap.'
              >
                <Tabs defaultValue="bad">
                  <TabsList className="mb-4">
                    <TabsTrigger value="bad">Bad: Keyboard Trap</TabsTrigger>
                    <TabsTrigger value="good">Good: No Trap</TabsTrigger>
                  </TabsList>

                  <TabsContent value="bad">
                    <div
                      onKeyDown={handleTrapKeyDown}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-colors",
                        trapActive
                          ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                          Custom Widget (Trap Demo)
                        </h4>
                        {trapActive && (
                          <Badge className="bg-red-600 text-white text-xs animate-pulse">
                            Trapped!
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                        {trapActive
                          ? "You are now trapped! Tab does nothing. Press Escape to exit."
                          : 'Click "Activate Trap" to simulate a keyboard trap.'}
                      </p>
                      <div className="flex gap-2">
                        {!trapActive ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setTrapActive(true)}
                          >
                            Activate Trap
                          </Button>
                        ) : (
                          <>
                            <input
                              type="text"
                              placeholder="Try Tabbing out..."
                              className="px-3 py-1 text-sm border border-red-300 dark:border-red-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <Button
                              size="sm"
                              onClick={() => setTrapActive(false)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Press Escape to Exit
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="good">
                    <div className="p-4 rounded-lg border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">
                        Custom Widget (No Trap)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                        This widget correctly allows keyboard navigation in and
                        out. Tab moves through elements normally.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Focus here..."
                          className="px-3 py-1 text-sm border border-green-300 dark:border-green-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <Button size="sm" variant="outline">
                          Action
                        </Button>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-2 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Tab works normally -- no keyboard trap.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </DemoContainer>

              <InfoBox variant="info">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    For more examples of keyboard traps and how to detect them,
                    visit the{" "}
                    <a
                      href="/bad/keyboard"
                      className="underline hover:no-underline font-medium"
                    >
                      Keyboard Accessibility Bad Examples
                    </a>{" "}
                    page.
                  </span>
                </div>
              </InfoBox>

              <CodeBlock
                code={`// BAD: This creates a keyboard trap!
element.addEventListener('keydown', (e) => {
  e.preventDefault(); // Prevents ALL keys including Tab
  // Handle your custom keys here
});

// BAD: Auto-focus loop
input.addEventListener('blur', () => {
  input.focus(); // User can never leave this input
});`}
                language="typescript"
                title="keyboard-trap-causes.ts"
                variant="bad"
              />

              <CodeBlock
                code={`// GOOD: Only prevent default for the keys you handle
element.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    handleArrowNavigation(e.key);
  }
  // Tab, Shift+Tab, Escape pass through naturally
});

// GOOD: Validate on blur without trapping
input.addEventListener('blur', () => {
  validateField(input); // Validate but do NOT refocus
});`}
                language="typescript"
                title="keyboard-trap-prevention.ts"
                variant="good"
              />
            </section>

            {/* ============================================================ */}
            {/* 7. MODAL FOCUS TRAPPING                                        */}
            {/* ============================================================ */}
            <section id="focus-trapping" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Maximize2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Modal Focus Trapping
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Modal dialogs are the single exception to the &quot;no keyboard
                  trap&quot; rule. When a modal is open, focus{" "}
                  <em>should</em> be trapped inside it because the background
                  content is inert and not visible to the user. Without focus
                  trapping, a keyboard user could Tab behind the modal into
                  content they cannot see, which is even more disorienting than
                  the trap itself.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Requirements for Accessible Modals
                </h3>
                <ol className="space-y-2 text-slate-700 dark:text-slate-300 list-decimal list-inside">
                  <li>
                    <strong>Focus moves into the modal</strong> when it opens
                    (to the modal container or first focusable element).
                  </li>
                  <li>
                    <strong>Tab cycles within the modal only.</strong> From the
                    last element, Tab wraps to the first. From the first,
                    Shift+Tab wraps to the last.
                  </li>
                  <li>
                    <strong>Escape closes the modal.</strong> This is the
                    standard convention users expect.
                  </li>
                  <li>
                    <strong>Focus returns to the trigger</strong> when the modal
                    closes, so the user resumes where they left off.
                  </li>
                  <li>
                    <strong>Background content is inert.</strong> Use{" "}
                    <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                      aria-modal=&quot;true&quot;
                    </code>{" "}
                    and{" "}
                    <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                      role=&quot;dialog&quot;
                    </code>
                    .
                  </li>
                </ol>
              </div>

              <DemoContainer
                title="Modal Focus Trapping Demo"
                instructions="Click 'Open Dialog' to open the modal. Try Tab (cycles within), Shift+Tab (wraps backward), and Escape (closes and returns focus to the button)."
              >
                <div className="relative">
                  <Button
                    ref={modalTriggerRef}
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Open Dialog
                  </Button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Focus is trapped inside the dialog. Escape closes it. Focus
                    returns to this button on close.
                  </p>

                  {modalOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 bg-black/50 z-40"
                        aria-hidden="true"
                        onClick={() => setModalOpen(false)}
                      />
                      {/* Modal */}
                      <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Example accessible dialog"
                        ref={modalRef}
                        tabIndex={-1}
                        onKeyDown={handleModalKeyDown}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-6"
                      >
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          Accessible Dialog
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          Focus is trapped within this dialog. Tab cycles between
                          the input, Close, and Confirm buttons. Press Escape to
                          close, and focus will return to the trigger button.
                        </p>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Type something..."
                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setModalOpen(false)}
                            >
                              Close
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => setModalOpen(false)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <Info className="h-3 w-3 flex-shrink-0" />
                          Focus cycles: Input, Close, Confirm -- then wraps back
                          to Input.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </DemoContainer>

              <CodeBlock
                code={`import { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 1. Store the currently focused element
      previousFocusRef.current = document.activeElement;
      // 2. Move focus into the modal
      modalRef.current?.focus();
    } else if (previousFocusRef.current) {
      // 4. Return focus to the trigger on close
      (previousFocusRef.current as HTMLElement)?.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 3. Escape closes the modal
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    // 2. Trap Tab within the modal
    if (e.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus(); // Wrap backward
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus(); // Wrap forward
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="backdrop" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Modal title"
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </>
  );
}`}
                language="typescript"
                title="AccessibleModal.tsx"
                variant="good"
              />
            </section>

            {/* ============================================================ */}
            {/* 8. CUSTOM WIDGETS                                              */}
            {/* ============================================================ */}
            <section id="custom-widgets" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Custom Widgets
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  When building custom interactive widgets -- dropdown menus, tab
                  panels, tree views, sliders, comboboxes -- you must implement
                  the keyboard patterns that users expect based on the WAI-ARIA
                  Authoring Practices Guide. These conventions are what
                  assistive technology users learn and rely on. Deviating from
                  them means your widget will be unpredictable and unusable for
                  keyboard-only users.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  The table below summarizes the expected keyboard interactions
                  for common widget types. When building any custom widget,
                  always consult the{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    WAI-ARIA Authoring Practices Guide
                  </a>{" "}
                  for the full specification.
                </p>
              </div>

              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th
                        scope="col"
                        className="text-left px-4 py-3 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                      >
                        Widget
                      </th>
                      <th
                        scope="col"
                        className="text-left px-4 py-3 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                      >
                        Keys
                      </th>
                      <th
                        scope="col"
                        className="text-left px-4 py-3 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                      >
                        Behavior
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Button
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Enter
                        </kbd>{" "}
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Space
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Activate
                      </td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Link
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Enter
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Navigate
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Checkbox
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Space
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Toggle
                      </td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Radio Group
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Arrow keys
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Select option
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Tab Panel
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Arrow keys
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Switch tabs
                      </td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Menu
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Arrow keys
                        </kbd>{" "}
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Enter
                        </kbd>{" "}
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Escape
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Navigate, select, close
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Dialog
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Tab
                        </kbd>{" "}
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Escape
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Cycle focus, close
                      </td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Combobox
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Arrow keys
                        </kbd>{" "}
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Enter
                        </kbd>{" "}
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Escape
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Navigate, select, close
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                        Slider
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">
                          Arrow keys
                        </kbd>
                      </td>
                      <td className="px-4 py-3 border border-slate-200 dark:border-slate-700">
                        Adjust value
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ============================================================ */}
            {/* 9. TESTING CHECKLIST                                            */}
            {/* ============================================================ */}
            <section id="testing-checklist" className="scroll-mt-24 mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Testing Checklist
                </h2>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                Use this checklist every time you build or audit a page.
                Disconnect your mouse, put it in a drawer, and navigate the
                entire page using only your keyboard. Mark each item as you
                verify it. You can download a PDF copy of this checklist using
                the button below.
              </p>

              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="pt-6">
                  <ol className="space-y-3">
                    {checklistItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <button
                          onClick={() => toggleChecklist(index)}
                          className={cn(
                            "mt-0.5 shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                            checklistState[index]
                              ? "bg-green-600 border-green-600 text-white"
                              : "border-slate-300 dark:border-slate-600 hover:border-blue-400"
                          )}
                          aria-label={`${checklistState[index] ? "Unmark" : "Mark"}: ${item}`}
                          role="checkbox"
                          aria-checked={checklistState[index] || false}
                        >
                          {checklistState[index] && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                        <span
                          className={cn(
                            "text-sm leading-relaxed",
                            checklistState[index]
                              ? "text-slate-400 dark:text-slate-500 line-through"
                              : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          <strong className="font-medium">
                            {index + 1}.
                          </strong>{" "}
                          {item}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {Object.values(checklistState).filter(Boolean).length} of{" "}
                      {checklistItems.length} items completed
                    </p>
                    <Button
                      onClick={downloadChecklist}
                      variant="outline"
                      size="sm"
                      className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download PDF Checklist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
