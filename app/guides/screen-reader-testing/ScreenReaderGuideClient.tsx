"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Monitor, Smartphone, Apple, Download, Volume2, Headphones,
  CheckSquare, ExternalLink, Info, ChevronDown, Keyboard,
  Navigation, FormInput, Image, Table2, AlertCircle, LayoutGrid
} from "lucide-react"

/* -------------------------------------------------------------------------- */
/*  Inline Helper Components                                                   */
/* -------------------------------------------------------------------------- */

function CommandTable({ commands }: { commands: { action: string; shortcut: string }[] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            <th scope="col" className="text-left p-3 font-semibold text-slate-900 dark:text-white">Action</th>
            <th scope="col" className="text-left p-3 font-semibold text-slate-900 dark:text-white">Shortcut</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((cmd, i) => (
            <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
              <td className="p-3 text-slate-700 dark:text-slate-300">{cmd.action}</td>
              <td className="p-3"><kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono border border-slate-200 dark:border-slate-600">{cmd.shortcut}</kbd></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ScreenReaderCard({ name, platform, cost, icon, downloadUrl, children }: {
  name: string; platform: string; cost: string; icon: React.ReactNode; downloadUrl?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">{icon}</div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">{platform}</Badge>
              <Badge variant="outline" className={cost === "Free" || cost.startsWith("Free") ? "text-green-600 border-green-300" : "text-amber-600 border-amber-300"}>{cost}</Badge>
            </div>
          </div>
        </div>
        {downloadUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />Download
            </a>
          </Button>
        )}
      </div>
      {children}
    </div>
  )
}

function InfoBox({ children, variant = "info" }: { children: React.ReactNode; variant?: "info" | "warning" | "tip" }) {
  const styles = {
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    tip: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
  }
  return <div className={cn("rounded-lg border p-4 my-4 text-sm", styles[variant])}>{children}</div>
}

/* -------------------------------------------------------------------------- */
/*  Sections for TOC                                                           */
/* -------------------------------------------------------------------------- */

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "nvda", title: "NVDA (Windows)" },
  { id: "jaws", title: "JAWS (Windows)" },
  { id: "voiceover-mac", title: "VoiceOver (macOS)" },
  { id: "voiceover-ios", title: "VoiceOver (iOS)" },
  { id: "talkback", title: "TalkBack (Android)" },
  { id: "command-reference", title: "Command Reference" },
  { id: "testing-scenarios", title: "Testing Scenarios" },
  { id: "checklist", title: "Testing Checklist" },
]

/* -------------------------------------------------------------------------- */
/*  Checklist data                                                             */
/* -------------------------------------------------------------------------- */

const checklistData: { title: string; items: string[] }[] = [
  {
    title: "Page Structure",
    items: [
      "Page has a unique, descriptive <title> element",
      "Heading hierarchy is logical with no skipped levels (H1 followed by H2, not H4)",
      "Landmark regions are present and correctly labeled (main, nav, banner, contentinfo)",
      "A skip-to-main-content link is the first focusable element and functions correctly",
      "The lang attribute on the <html> element matches the page language",
    ],
  },
  {
    title: "Navigation",
    items: [
      "All navigation items are reachable and operable with a screen reader",
      "The current page is indicated programmatically (aria-current=\"page\")",
      "Dropdown and submenu toggles announce their expanded or collapsed state",
    ],
  },
  {
    title: "Forms",
    items: [
      "Every input has a programmatically associated label (<label> or aria-labelledby)",
      "Required fields are announced as required (required attribute or aria-required=\"true\")",
      "Inline error messages are linked to their fields via aria-describedby",
      "Form submission success or failure is announced via aria-live region or focus management",
    ],
  },
  {
    title: "Images & Media",
    items: [
      "Informative images have concise, descriptive alt text",
      "Decorative images are hidden from screen readers (alt=\"\" or CSS background)",
      "Complex images (charts, infographics) have a long text alternative",
    ],
  },
  {
    title: "Interactive Elements",
    items: [
      "All buttons and links have accessible names that describe their purpose",
      "Custom widgets announce their role, name, and state correctly",
      "Modals trap focus, are announced when opened, and return focus when closed",
    ],
  },
  {
    title: "Dynamic Content",
    items: [
      "Status messages and notifications use aria-live regions (polite or assertive as appropriate)",
      "Loading states are communicated to screen readers (aria-busy, aria-live announcements)",
      "Content that updates dynamically does not cause unexpected focus changes or loss of context",
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function ScreenReaderGuideClient() {
  const [activeSection, setActiveSection] = useState("introduction")
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean[]>>({})

  // Initialize checklist state
  useEffect(() => {
    const initial: Record<string, boolean[]> = {}
    checklistData.forEach((group) => {
      initial[group.title] = new Array(group.items.length).fill(false)
    })
    setCheckedItems(initial)
  }, [])

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const toggleCheckItem = (groupTitle: string, index: number) => {
    setCheckedItems((prev) => {
      const next = { ...prev }
      const arr = [...(next[groupTitle] || [])]
      arr[index] = !arr[index]
      next[groupTitle] = arr
      return next
    })
  }

  const handleDownloadPdf = async () => {
    try {
      const { default: jsPDF } = await import("jspdf")
      const doc = new jsPDF()
      let y = 20

      doc.setFontSize(20)
      doc.text("Screen Reader Testing Checklist", 20, y)
      y += 15

      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text("Generated from accessibility.build/guides/screen-reader-testing", 20, y)
      y += 15

      checklistData.forEach((group) => {
        if (y > 260) {
          doc.addPage()
          y = 20
        }

        doc.setFontSize(14)
        doc.setTextColor(0)
        doc.text(group.title, 20, y)
        y += 8

        doc.setFontSize(10)
        doc.setTextColor(60)
        group.items.forEach((item) => {
          if (y > 275) {
            doc.addPage()
            y = 20
          }
          // Draw checkbox square
          doc.rect(22, y - 3.5, 4, 4)
          // Wrap long text
          const lines = doc.splitTextToSize(item, 155)
          doc.text(lines, 30, y)
          y += lines.length * 5 + 3
        })

        y += 6
      })

      doc.save("screen-reader-testing-checklist.pdf")
    } catch {
      // Fallback: open print dialog
      if (typeof window !== "undefined") {
        window.print()
      }
    }
  }

  return (
    <>
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0zMHY2aC02VjRoNnptMCAxMHY2aC02di02aDZ6bTAgMTB2NmgtNnYtNmg2em0xMC0yMHY2aC02di02aDZ6bTAgMTB2NmgtNnYtNmg2em0wIDEwdjZoLTZ2LTZoNnptMCAxMHY2aC02di02aDZ6bS0yMC0zMHY2aC02VjRoNnptMCAxMHY2aC02di02aDZ6bTAgMTB2NmgtNnYtNmg2em0wIDEwdjZoLTZ2LTZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 relative">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-blue-500/30 text-white border-blue-400/30">
              Comprehensive Guide
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Screen Reader Testing Guide
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mb-6">
            The complete reference for testing websites with NVDA, JAWS,
            VoiceOver, and TalkBack. Includes setup instructions, command
            references, testing procedures, and downloadable checklists.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <Volume2 className="h-4 w-4" />
              <span>5 Screen Readers Covered</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <Keyboard className="h-4 w-4" />
              <span>60+ Commands</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <Headphones className="h-4 w-4" />
              <span>6 Testing Scenarios</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <CheckSquare className="h-4 w-4" />
              <span>Downloadable Checklist</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex gap-8">
          {/* Sticky TOC Sidebar - hidden on mobile, visible on lg+ */}
          <aside className="hidden lg:block w-64 shrink-0">
            <nav className="sticky top-24 space-y-1" aria-label="Table of contents">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">
                On this page
              </p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200",
                    activeSection === section.id
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-medium border-l-2 border-blue-600"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content area */}
          <main className="flex-1 min-w-0 space-y-16">

            {/* ================================================================ */}
            {/* SECTION 1: INTRODUCTION                                          */}
            {/* ================================================================ */}
            <section id="introduction" className="scroll-mt-24 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Introduction
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-400">
                A screen reader is assistive technology software that converts on-screen content
                into synthesized speech or refreshable braille output. Screen readers enable people
                who are blind, have low vision, or have certain cognitive disabilities to perceive and
                interact with digital content. Rather than simply reading text aloud, screen readers
                interpret the structure, roles, states, and relationships of interface elements,
                giving users a comprehensive understanding of a web page without relying on visual
                presentation.
              </p>

              <p className="text-slate-600 dark:text-slate-400">
                Screen readers work by accessing the <strong className="text-slate-900 dark:text-white">accessibility tree</strong>,
                a structured representation of the page that the browser builds from the HTML DOM. The browser
                exposes this tree through platform-specific accessibility APIs -- UI Automation on Windows,
                NSAccessibility on macOS, and AccessibilityService on Android. When your HTML uses proper semantic
                elements (headings, lists, buttons, form labels) and ARIA attributes where needed, the accessibility
                tree accurately represents the page. When it does not, the screen reader experience breaks down,
                sometimes rendering a site completely unusable.
              </p>

              {/* Market share table */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Screen Reader Market Share
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800">
                        <th scope="col" className="text-left p-3 font-semibold text-slate-900 dark:text-white">Screen Reader</th>
                        <th scope="col" className="text-left p-3 font-semibold text-slate-900 dark:text-white">Platform</th>
                        <th scope="col" className="text-left p-3 font-semibold text-slate-900 dark:text-white">Cost</th>
                        <th scope="col" className="text-left p-3 font-semibold text-slate-900 dark:text-white">Market Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-900 dark:text-white">JAWS</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Windows</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">$90/yr or $1,000+</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">~40%</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-900 dark:text-white">NVDA</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Windows</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Free (open source)</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">~30%</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-900 dark:text-white">VoiceOver</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">macOS / iOS</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Free (built-in)</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">~15%</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-900 dark:text-white">TalkBack</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Android</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Free (built-in)</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">~10%</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-900 dark:text-white">Narrator</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Windows</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">Free (built-in)</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">~5%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  Source: WebAIM Screen Reader User Survey (approximate figures based on primary screen reader usage)
                </p>
              </div>

              {/* Browser pairing recommendations */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Recommended Browser Pairings
                </h3>
                <InfoBox variant="info">
                  <p className="mb-2"><strong className="text-slate-900 dark:text-white">Each screen reader works best with a specific browser.</strong> Using the wrong pairing can produce misleading test results.</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li><strong>NVDA + Firefox</strong> -- Recommended starting point. The best free combination for comprehensive testing.</li>
                    <li><strong>JAWS + Chrome or Edge</strong> -- The industry-standard enterprise pairing. JAWS also works well with Firefox.</li>
                    <li><strong>VoiceOver + Safari</strong> -- Required on Apple platforms. Safari is the only browser that fully exposes macOS/iOS accessibility APIs to VoiceOver.</li>
                    <li><strong>TalkBack + Chrome</strong> -- The standard pairing for Android mobile testing.</li>
                  </ul>
                </InfoBox>
              </div>

              <InfoBox variant="tip">
                <strong className="text-slate-900 dark:text-white">You do not need to test with every screen reader.</strong>{" "}
                Start with NVDA + Firefox for the best free testing experience. This single combination
                catches the vast majority of accessibility issues. Add VoiceOver testing when you need to
                cover macOS or iOS. Add JAWS only when required by your organization&apos;s testing policy
                or to reproduce a specific user-reported issue.
              </InfoBox>
            </section>

            {/* ================================================================ */}
            {/* SECTION 2: NVDA                                                  */}
            {/* ================================================================ */}
            <section id="nvda" className="scroll-mt-24 space-y-6">
              <ScreenReaderCard
                name="NVDA"
                platform="Windows"
                cost="Free"
                icon={<Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                downloadUrl="https://www.nvaccess.org/download/"
              >
                <p className="text-slate-600 dark:text-slate-400">
                  NVDA (NonVisual Desktop Access) is a free, open-source screen reader for Windows.
                  It is the recommended starting point for developers new to screen reader testing because
                  it costs nothing, receives frequent updates, and pairs excellently with Firefox.
                </p>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Setup Steps
                  </h4>
                  <ol className="space-y-3 text-slate-600 dark:text-slate-400 list-decimal list-inside">
                    <li>
                      <strong className="text-slate-900 dark:text-white">Download:</strong> Go to{" "}
                      <a href="https://www.nvaccess.org/download/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">
                        nvaccess.org/download <ExternalLink className="inline h-3 w-3 ml-0.5" />
                      </a>{" "}
                      and download the latest version. The installer is approximately 40 MB.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">Install:</strong> Run the installer. You can choose to install NVDA on your system or create a portable copy on a USB drive for use on machines where you cannot install software.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">Configure:</strong> On first launch, a Welcome Dialog appears. Check &quot;Use Caps Lock as an NVDA modifier key&quot; if you are on a laptop without an Insert key. Select your preferred keyboard layout (Desktop or Laptop).
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">Launch:</strong> NVDA runs in the system tray. Right-click the tray icon or press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono border border-slate-300 dark:border-slate-600">NVDA + N</kbd> to open the NVDA menu for preferences, tools, and help.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Key Settings to Configure
                  </h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 shrink-0">-</span>
                      <span><strong className="text-slate-900 dark:text-white">Speech rate:</strong> Preferences &rarr; Settings &rarr; Speech. Start at 40-50% speed while learning; experienced users typically run at 70-80%.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 shrink-0">-</span>
                      <span><strong className="text-slate-900 dark:text-white">Browse mode:</strong> Preferences &rarr; Settings &rarr; Browse Mode. Enable &quot;Automatic focus mode for focus changes&quot; so NVDA switches to focus mode when you enter form fields.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 shrink-0">-</span>
                      <span><strong className="text-slate-900 dark:text-white">Speech viewer:</strong> Tools &rarr; Speech Viewer. Opens a text window showing everything NVDA speaks, which is invaluable when learning.</span>
                    </li>
                  </ul>
                </div>

                <InfoBox variant="info">
                  <strong className="text-slate-900 dark:text-white">NVDA modifier key:</strong>{" "}
                  In Desktop keyboard layout, the modifier is <kbd className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs font-mono">Insert</kbd>.
                  In Laptop keyboard layout, it is <kbd className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs font-mono">Caps Lock</kbd>.
                  You can enable both simultaneously in preferences. Throughout this guide, &quot;NVDA&quot; in shortcuts refers to whichever modifier key you have configured.
                </InfoBox>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Essential Commands
                  </h4>
                  <CommandTable
                    commands={[
                      { action: "Start / Stop NVDA", shortcut: "Ctrl + Alt + N" },
                      { action: "Stop speaking", shortcut: "Ctrl" },
                      { action: "Read from cursor", shortcut: "NVDA + Down Arrow" },
                      { action: "Read current line", shortcut: "NVDA + Up Arrow" },
                      { action: "Next heading", shortcut: "H" },
                      { action: "Next link", shortcut: "K" },
                      { action: "Next form field", shortcut: "F" },
                      { action: "Next button", shortcut: "B" },
                      { action: "Next landmark", shortcut: "D" },
                      { action: "Elements list", shortcut: "NVDA + F7" },
                      { action: "Toggle browse / focus mode", shortcut: "NVDA + Space" },
                      { action: "Read page title", shortcut: "NVDA + T" },
                      { action: "Next table", shortcut: "T" },
                      { action: "Navigate table cells", shortcut: "Ctrl + Alt + Arrow keys" },
                    ]}
                  />
                </div>

                <InfoBox variant="tip">
                  <strong className="text-slate-900 dark:text-white">Browse mode vs. Focus mode:</strong>{" "}
                  In browse mode, single letter keys (H, K, F, B, D, T) navigate by element type. In focus mode,
                  keystrokes are passed directly to the web page, which is necessary for typing in form fields.
                  NVDA announces which mode you are in. Press{" "}
                  <kbd className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900 rounded text-xs font-mono">NVDA + Space</kbd>{" "}
                  to toggle manually, or let NVDA switch automatically when you Tab into a form field.
                </InfoBox>
              </ScreenReaderCard>
            </section>

            {/* ================================================================ */}
            {/* SECTION 3: JAWS                                                  */}
            {/* ================================================================ */}
            <section id="jaws" className="scroll-mt-24 space-y-6">
              <ScreenReaderCard
                name="JAWS"
                platform="Windows"
                cost="$90/year"
                icon={<Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                downloadUrl="https://www.freedomscientific.com/products/software/jaws/"
              >
                <p className="text-slate-600 dark:text-slate-400">
                  JAWS (Job Access With Speech) by Freedom Scientific is the most widely used commercial
                  screen reader, holding approximately 40% of the desktop screen reader market. It is the
                  industry standard in enterprise and government environments and includes advanced scripting
                  capabilities for customizing behavior on specific applications and websites.
                </p>

                <InfoBox variant="warning">
                  <strong className="text-slate-900 dark:text-white">Free evaluation mode:</strong>{" "}
                  JAWS is a commercial product, but it runs in a fully functional <strong>40-minute demo mode</strong> without
                  purchase. After 40 minutes it requires a system restart, then you can use it for another 40 minutes.
                  This is sufficient for most testing sessions. Download from{" "}
                  <a href="https://www.freedomscientific.com/products/software/jaws/" target="_blank" rel="noopener noreferrer" className="text-amber-700 dark:text-amber-400 underline hover:no-underline">
                    freedomscientific.com <ExternalLink className="inline h-3 w-3 ml-0.5" />
                  </a>.
                </InfoBox>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Essential Commands
                  </h4>
                  <CommandTable
                    commands={[
                      { action: "Stop speaking", shortcut: "Ctrl" },
                      { action: "Say current line", shortcut: "Insert + Up Arrow" },
                      { action: "Say all (read from cursor)", shortcut: "Insert + Down Arrow" },
                      { action: "Next heading", shortcut: "H" },
                      { action: "Headings list", shortcut: "Insert + F6" },
                      { action: "Links list", shortcut: "Insert + F7" },
                      { action: "Forms list", shortcut: "Insert + F5" },
                      { action: "Next landmark", shortcut: "; (semicolon)" },
                      { action: "Toggle virtual cursor", shortcut: "Insert + Z" },
                      { action: "JAWS find", shortcut: "Ctrl + Insert + F" },
                    ]}
                  />
                </div>

                <InfoBox variant="info">
                  <strong className="text-slate-900 dark:text-white">Virtual Cursor:</strong>{" "}
                  JAWS calls its browse mode the &quot;Virtual Cursor.&quot; When the virtual cursor is on,
                  single-letter navigation keys work (H for headings, K for links, F for form fields). When
                  it is off, keystrokes pass through to the application. Toggle with{" "}
                  <kbd className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs font-mono">Insert + Z</kbd>.
                </InfoBox>
              </ScreenReaderCard>
            </section>

            {/* ================================================================ */}
            {/* SECTION 4: VOICEOVER macOS                                       */}
            {/* ================================================================ */}
            <section id="voiceover-mac" className="scroll-mt-24 space-y-6">
              <ScreenReaderCard
                name="VoiceOver"
                platform="macOS"
                cost="Free (built-in)"
                icon={<Apple className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              >
                <p className="text-slate-600 dark:text-slate-400">
                  VoiceOver is Apple&apos;s built-in screen reader for macOS. It ships with every Mac and
                  requires no installation. VoiceOver must be used with Safari for the most accurate web
                  testing, as Safari is the only macOS browser that fully exposes accessibility APIs to VoiceOver.
                </p>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Getting Started
                  </h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 shrink-0">-</span>
                      <span><strong className="text-slate-900 dark:text-white">Enable:</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono border border-slate-300 dark:border-slate-600">Cmd + F5</kbd>, or go to System Settings &rarr; Accessibility &rarr; VoiceOver and toggle it on.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 shrink-0">-</span>
                      <span><strong className="text-slate-900 dark:text-white">VO modifier:</strong> The VoiceOver modifier key is <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono border border-slate-300 dark:border-slate-600">Ctrl + Option</kbd>, abbreviated as &quot;VO&quot; throughout this guide and in Apple&apos;s documentation.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Essential Commands
                  </h4>
                  <CommandTable
                    commands={[
                      { action: "Toggle VoiceOver", shortcut: "Cmd + F5" },
                      { action: "Stop speaking", shortcut: "Ctrl" },
                      { action: "Read from cursor", shortcut: "VO + A" },
                      { action: "Next element", shortcut: "VO + Right Arrow" },
                      { action: "Previous element", shortcut: "VO + Left Arrow" },
                      { action: "Interact with group", shortcut: "VO + Shift + Down Arrow" },
                      { action: "Stop interacting", shortcut: "VO + Shift + Up Arrow" },
                      { action: "Activate element", shortcut: "VO + Space" },
                      { action: "Open Rotor", shortcut: "VO + U" },
                      { action: "Next heading", shortcut: "VO + Cmd + H" },
                      { action: "Next link", shortcut: "VO + Cmd + L" },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    The Rotor (VO + U)
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    The Rotor is VoiceOver&apos;s most powerful feature. It opens a navigable list where
                    you can switch between headings, links, landmarks, form controls, tables, and more using
                    the Left and Right arrow keys. Within each category, use the Up and Down arrow keys to
                    select a specific item, then press Enter to navigate to it. Press Escape to close the Rotor.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    The Rotor gives you a bird&apos;s-eye view of the page structure. Use it to verify that
                    your heading hierarchy is logical, that all landmarks are labeled correctly, and that form
                    controls have proper accessible names. If elements are missing from the Rotor categories,
                    they are likely missing the semantic HTML or ARIA attributes needed for screen reader recognition.
                  </p>
                </div>
              </ScreenReaderCard>
            </section>

            {/* ================================================================ */}
            {/* SECTION 5: VOICEOVER iOS                                         */}
            {/* ================================================================ */}
            <section id="voiceover-ios" className="scroll-mt-24 space-y-6">
              <ScreenReaderCard
                name="VoiceOver"
                platform="iOS"
                cost="Free (built-in)"
                icon={<Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              >
                <p className="text-slate-600 dark:text-slate-400">
                  VoiceOver on iOS uses touch-based gestures instead of keyboard commands. It is the dominant
                  screen reader on mobile devices and essential for testing mobile web experiences. Enable it
                  via Settings &rarr; Accessibility &rarr; VoiceOver, or configure the Accessibility Shortcut
                  (triple-click the Side button) for quick toggling during testing sessions.
                </p>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Touch Gesture Commands
                  </h4>
                  <CommandTable
                    commands={[
                      { action: "Next element", shortcut: "Swipe right" },
                      { action: "Previous element", shortcut: "Swipe left" },
                      { action: "Activate element", shortcut: "Double-tap" },
                      { action: "Read from top", shortcut: "Two-finger swipe up" },
                      { action: "Read from cursor", shortcut: "Two-finger swipe down" },
                      { action: "Pause / Resume speaking", shortcut: "Two-finger tap" },
                      { action: "Scroll", shortcut: "Three-finger swipe up/down" },
                      { action: "Change navigation mode", shortcut: "Rotor (two-finger twist)" },
                      { action: "Navigate by rotor setting", shortcut: "Swipe up/down" },
                    ]}
                  />
                </div>

                <InfoBox variant="tip">
                  <strong className="text-slate-900 dark:text-white">The iOS Rotor:</strong>{" "}
                  Place two fingers on the screen and twist them as if turning a dial. Each position represents
                  a navigation mode: Headings, Links, Form Controls, Landmarks, and more. Once a mode is selected,
                  swipe up or down to jump between items of that type. This is how mobile VoiceOver users navigate
                  complex pages efficiently.
                </InfoBox>
              </ScreenReaderCard>
            </section>

            {/* ================================================================ */}
            {/* SECTION 6: TALKBACK                                              */}
            {/* ================================================================ */}
            <section id="talkback" className="scroll-mt-24 space-y-6">
              <ScreenReaderCard
                name="TalkBack"
                platform="Android"
                cost="Free (built-in)"
                icon={<Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              >
                <p className="text-slate-600 dark:text-slate-400">
                  TalkBack is Google&apos;s built-in screen reader for Android devices. Enable it via
                  Settings &rarr; Accessibility &rarr; TalkBack. On many devices, you can also hold both
                  volume keys for three seconds to toggle TalkBack on and off quickly.
                </p>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Gesture Commands
                  </h4>
                  <CommandTable
                    commands={[
                      { action: "Next element", shortcut: "Swipe right" },
                      { action: "Previous element", shortcut: "Swipe left" },
                      { action: "Activate element", shortcut: "Double-tap" },
                      { action: "Next heading", shortcut: "Swipe up then right" },
                      { action: "Next link", shortcut: "Swipe down then right" },
                      { action: "Previous heading", shortcut: "Swipe up then left" },
                      { action: "Scroll forward", shortcut: "Two-finger swipe up" },
                      { action: "Scroll backward", shortcut: "Two-finger swipe down" },
                      { action: "TalkBack menu", shortcut: "Three-finger tap" },
                      { action: "Home / Back", shortcut: "Swipe up then down" },
                    ]}
                  />
                </div>

                <InfoBox variant="info">
                  <strong className="text-slate-900 dark:text-white">Reading Controls:</strong>{" "}
                  Swipe down then up to cycle through reading control modes: Headings, Links, Controls,
                  Characters, Words, Lines, and Paragraphs. Once a mode is selected, swipe up or down to
                  navigate by that element type. This is TalkBack&apos;s equivalent of the VoiceOver Rotor.
                </InfoBox>
              </ScreenReaderCard>
            </section>

            {/* ================================================================ */}
            {/* SECTION 7: COMMAND REFERENCE                                     */}
            {/* ================================================================ */}
            <section id="command-reference" className="scroll-mt-24 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Command Reference
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Compare the 10 most common testing tasks across all screen readers. Select a tab
                to view the commands for each screen reader.
              </p>

              <Tabs defaultValue="nvda-ref" className="w-full">
                <TabsList className="flex flex-wrap h-auto gap-1">
                  <TabsTrigger value="nvda-ref" className="text-xs sm:text-sm">NVDA</TabsTrigger>
                  <TabsTrigger value="jaws-ref" className="text-xs sm:text-sm">JAWS</TabsTrigger>
                  <TabsTrigger value="vo-mac-ref" className="text-xs sm:text-sm">VoiceOver (Mac)</TabsTrigger>
                  <TabsTrigger value="vo-ios-ref" className="text-xs sm:text-sm">VoiceOver (iOS)</TabsTrigger>
                  <TabsTrigger value="talkback-ref" className="text-xs sm:text-sm">TalkBack</TabsTrigger>
                </TabsList>

                <TabsContent value="nvda-ref">
                  <CommandTable
                    commands={[
                      { action: "Navigate by headings", shortcut: "H / Shift + H" },
                      { action: "Navigate by links", shortcut: "K / Shift + K" },
                      { action: "Navigate by landmarks", shortcut: "D / Shift + D" },
                      { action: "Navigate by form fields", shortcut: "F / Shift + F" },
                      { action: "Read current element", shortcut: "NVDA + Up Arrow" },
                      { action: "Read all from cursor", shortcut: "NVDA + Down Arrow" },
                      { action: "Stop speaking", shortcut: "Ctrl" },
                      { action: "Open elements list", shortcut: "NVDA + F7" },
                      { action: "Toggle browse / focus mode", shortcut: "NVDA + Space" },
                      { action: "Activate element", shortcut: "Enter or NVDA + Enter" },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="jaws-ref">
                  <CommandTable
                    commands={[
                      { action: "Navigate by headings", shortcut: "H / Shift + H" },
                      { action: "Navigate by links", shortcut: "Tab (unvisited) or K" },
                      { action: "Navigate by landmarks", shortcut: "; / Shift + ;" },
                      { action: "Navigate by form fields", shortcut: "F / Shift + F" },
                      { action: "Read current element", shortcut: "Insert + Up Arrow" },
                      { action: "Read all from cursor", shortcut: "Insert + Down Arrow" },
                      { action: "Stop speaking", shortcut: "Ctrl" },
                      { action: "Open elements list", shortcut: "Insert + F6 (headings) / Insert + F7 (links)" },
                      { action: "Toggle virtual cursor", shortcut: "Insert + Z" },
                      { action: "Activate element", shortcut: "Enter" },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="vo-mac-ref">
                  <CommandTable
                    commands={[
                      { action: "Navigate by headings", shortcut: "VO + Cmd + H" },
                      { action: "Navigate by links", shortcut: "VO + Cmd + L" },
                      { action: "Navigate by landmarks", shortcut: "VO + Cmd + N (Web Spots)" },
                      { action: "Navigate by form fields", shortcut: "VO + Cmd + J" },
                      { action: "Read current element", shortcut: "VO + F3" },
                      { action: "Read all from cursor", shortcut: "VO + A" },
                      { action: "Stop speaking", shortcut: "Ctrl" },
                      { action: "Open Rotor", shortcut: "VO + U" },
                      { action: "Enter / exit group", shortcut: "VO + Shift + Down / Up Arrow" },
                      { action: "Activate element", shortcut: "VO + Space" },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="vo-ios-ref">
                  <CommandTable
                    commands={[
                      { action: "Navigate by headings", shortcut: "Rotor to Headings, swipe down" },
                      { action: "Navigate by links", shortcut: "Rotor to Links, swipe down" },
                      { action: "Navigate by landmarks", shortcut: "Rotor to Landmarks, swipe down" },
                      { action: "Navigate by form fields", shortcut: "Rotor to Form Controls, swipe down" },
                      { action: "Read current element", shortcut: "Tap on element" },
                      { action: "Read all from cursor", shortcut: "Two-finger swipe down" },
                      { action: "Stop speaking", shortcut: "Two-finger tap" },
                      { action: "Open Rotor", shortcut: "Two-finger twist" },
                      { action: "Toggle browse / focus mode", shortcut: "N/A (touch-based)" },
                      { action: "Activate element", shortcut: "Double-tap" },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="talkback-ref">
                  <CommandTable
                    commands={[
                      { action: "Navigate by headings", shortcut: "Swipe up then right" },
                      { action: "Navigate by links", shortcut: "Swipe down then right" },
                      { action: "Navigate by landmarks", shortcut: "Reading Controls: Landmarks, swipe down" },
                      { action: "Navigate by form fields", shortcut: "Reading Controls: Controls, swipe down" },
                      { action: "Read current element", shortcut: "Tap on element" },
                      { action: "Read all from cursor", shortcut: "TalkBack menu: Read from next item" },
                      { action: "Stop speaking", shortcut: "Two-finger tap" },
                      { action: "Open reading controls", shortcut: "Swipe down then up" },
                      { action: "Toggle browse / focus mode", shortcut: "N/A (touch-based)" },
                      { action: "Activate element", shortcut: "Double-tap" },
                    ]}
                  />
                </TabsContent>
              </Tabs>
            </section>

            {/* ================================================================ */}
            {/* SECTION 8: TESTING SCENARIOS                                     */}
            {/* ================================================================ */}
            <section id="testing-scenarios" className="scroll-mt-24 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Testing Scenarios
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Follow these six scenarios to systematically test the most critical accessibility
                concerns with a screen reader. Each scenario describes what to test, the expected
                behavior, and the most common failures.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Scenario 1: Page Structure */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg text-slate-900 dark:text-white">Page Structure</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">What to Test</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Navigate by headings (H key) and verify a logical hierarchy: one H1, then H2s, H3s, with no skipped levels</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Check landmarks using the elements list or Rotor (main, nav, banner, contentinfo)</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Read the page title (NVDA + T) and verify it is unique and descriptive</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Expected Behavior</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Headings reflect the visual structure and hierarchy of the page</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>At least main, navigation, and banner landmarks are present</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Page title follows the pattern &quot;Page Name - Site Name&quot;</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Common Failures</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Skipped heading levels (H1 followed by H4)</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>No landmarks defined, so the elements list is empty</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Generic page title like &quot;Home&quot; or &quot;Untitled&quot;</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario 2: Navigation Menus */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg text-slate-900 dark:text-white">Navigation Menus</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">What to Test</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Tab through all navigation items and verify they are links or buttons</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Open dropdown submenus and verify the toggle announces expanded/collapsed</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Check that the current page link is indicated</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Expected Behavior</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Navigation is inside a &lt;nav&gt; element announced as &quot;navigation&quot;</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Submenu buttons announce aria-expanded state (&quot;expanded&quot; / &quot;collapsed&quot;)</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Current page uses aria-current=&quot;page&quot; and is announced accordingly</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Common Failures</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Nav items are divs with click handlers instead of proper links</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Dropdown toggle lacks aria-expanded, so state is invisible</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>No indication of which page is currently active</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario 3: Forms */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <FormInput className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg text-slate-900 dark:text-white">Forms</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">What to Test</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Tab to each form field and verify the label is announced</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Check that required fields announce &quot;required&quot;</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Submit the form with errors and verify error messages are announced when focusing the invalid field</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Expected Behavior</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Each field announces: label, type (text, email, etc.), and required state</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Error messages are linked via aria-describedby and read when the field is focused</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Submission success or failure is announced to the user</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Common Failures</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Placeholder text used as the only label (disappears on input)</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Required state communicated only by a visual red asterisk</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Error messages appear visually but are not linked to inputs</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario 4: Images */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Image className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg text-slate-900 dark:text-white">Images</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">What to Test</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Navigate to each image and listen for the alt text description</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Verify decorative images are not announced at all</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Check that complex images (charts, infographics) have a long text description</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Expected Behavior</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Informative images announce concise, meaningful descriptions</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Decorative images with alt=&quot;&quot; are completely skipped by the screen reader</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Complex images provide equivalent information via figcaption or aria-describedby</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Common Failures</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Alt text is a filename like &quot;IMG_3842.jpg&quot; or &quot;banner-final-v2.png&quot;</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Missing alt attribute causes screen reader to announce the full file URL</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Decorative images have alt text, adding noise to the reading experience</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario 5: Dynamic Content */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg text-slate-900 dark:text-white">Dynamic Content</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">What to Test</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Trigger notifications and toast messages to verify they are announced automatically</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Test loading states (spinners, skeleton screens) for screen reader announcements</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Open modals, accordions, and tabs to verify content is announced and focus is managed</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Expected Behavior</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Notifications use aria-live=&quot;polite&quot; or role=&quot;status&quot; and are announced without focus moving</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Loading states announce &quot;Loading&quot; and completion via live regions</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Modals move focus inside when opened and return focus to the trigger when closed</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Common Failures</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Content updates silently with no aria-live region</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Loading spinners are purely visual with no text alternative</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>Modal opens but focus remains behind it on the page</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario 6: Tables */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Table2 className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg text-slate-900 dark:text-white">Tables</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">What to Test</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Navigate to a data table (T key in NVDA) and verify it is announced as a table with row and column count</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Use Ctrl + Alt + Arrow keys to move between cells and verify headers are announced</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">-</span>Check for a caption that describes the table&apos;s purpose</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Expected Behavior</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Column headers (&lt;th scope=&quot;col&quot;&gt;) are read aloud when moving to a cell in that column</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Row headers (&lt;th scope=&quot;row&quot;&gt;) are read when moving to a cell in that row</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 shrink-0">-</span>Table caption is announced when entering the table</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Common Failures</h5>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>All cells use &lt;td&gt; with no &lt;th&gt; elements, so headers are never announced</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>No scope attribute on header cells, breaking header-cell association</li>
                        <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">-</span>CSS grid or flexbox layout presented as a &lt;table&gt;, confusing navigation</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ================================================================ */}
            {/* SECTION 9: TESTING CHECKLIST                                     */}
            {/* ================================================================ */}
            <section id="checklist" className="scroll-mt-24 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Testing Checklist
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Use this interactive checklist to track your screen reader testing progress.
                    Check off each item as you verify it. Download a PDF version to use offline.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="gap-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                  onClick={handleDownloadPdf}
                >
                  <Download className="h-4 w-4" />
                  Download Checklist as PDF
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {checklistData.map((group) => {
                  const checked = checkedItems[group.title] || []
                  const completedCount = checked.filter(Boolean).length

                  return (
                    <div key={group.title} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {group.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            completedCount === group.items.length
                              ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                              : ""
                          )}
                        >
                          {completedCount}/{group.items.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {group.items.map((item, i) => (
                          <label
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={checked[i] || false}
                              onChange={() => toggleCheckItem(group.title, i)}
                              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span
                              className={cn(
                                "text-sm",
                                checked[i]
                                  ? "text-slate-400 dark:text-slate-500 line-through"
                                  : "text-slate-700 dark:text-slate-300"
                              )}
                            >
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  )
}
