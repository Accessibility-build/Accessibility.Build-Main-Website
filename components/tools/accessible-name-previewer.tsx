"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { computeAccessibleDescription, computeAccessibleName, getRole } from "dom-accessibility-api"
import { AlertTriangle, CheckCircle2, Bot, ClipboardCopy, Eye } from "lucide-react"

// What will a screen reader, or an AI agent, call this control?
//
// Both consume the same thing: the accessibility tree, where every element
// has a role and, if it is lucky, a name. This tool renders pasted markup in
// a sandboxed frame, runs the accessible name and description computation on
// every element that has a role, and shows the result two ways: as a table a
// developer can act on, and as the flat "agent view" a browser-use agent is
// handed, where an unnamed button is just "button".
//
// The name computation is dom-accessibility-api, the implementation used by
// Testing Library and jsdom, which follows the W3C accname algorithm. It is
// not a screen reader; real announcements add role-specific phrasing and vary
// by browser. What it gets right is the part that fails most: whether there
// is a name at all, and where it came from.

const EXAMPLES: { label: string; html: string }[] = [
  {
    label: "Icon button, no name",
    html: `<button class="cart"><svg width="20" height="20" aria-hidden="true"><path d="M2 2h16v16H2z"/></svg></button>
<button aria-label="Add to basket"><svg width="20" height="20" aria-hidden="true"><path d="M2 2h16v16H2z"/></svg></button>`,
  },
  {
    label: "Link wrapping an image",
    html: `<a href="/products/lamp"><img src="lamp.jpg"></a>
<a href="/products/lamp"><img src="lamp.jpg" alt="Brass desk lamp, £49"></a>
<a href="/products/lamp"><img src="lamp.jpg" alt=""> Brass desk lamp</a>`,
  },
  {
    label: "Form fields",
    html: `<input type="text" placeholder="Email">
<label>Email <input type="email"></label>
<label for="pw">Password</label> <input id="pw" type="password" aria-describedby="pw-help">
<p id="pw-help">At least twelve characters.</p>
<select><option>Choose a country</option></select>`,
  },
  {
    label: "Div pretending to be a button",
    html: `<div class="btn" onclick="checkout()">Checkout</div>
<div role="button" tabindex="0">Checkout</div>
<span role="checkbox" aria-checked="false">Remember me</span>`,
  },
  {
    label: "Read more, five times",
    html: `<h2>Winter sale</h2><p>Up to half price.</p><a href="/sale">Read more</a>
<h2>New arrivals</h2><p>Fresh this week.</p><a href="/new">Read more</a>
<h2>New arrivals</h2><p>Fresh this week.</p><a href="/new" aria-label="Read more about new arrivals">Read more</a>`,
  },
]

const INTERACTIVE = new Set([
  "button",
  "link",
  "textbox",
  "checkbox",
  "radio",
  "combobox",
  "listbox",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "treeitem",
])

interface Row {
  index: number
  tag: string
  role: string
  name: string
  description: string
  source: string
  interactive: boolean
  snippet: string
}

function nameSource(el: Element, name: string): string {
  if (!name) return "none"
  if (el.getAttribute("aria-labelledby")) return "aria-labelledby"
  if (el.getAttribute("aria-label")) return "aria-label"
  const tag = el.tagName.toLowerCase()
  if (tag === "img" || tag === "area") return el.getAttribute("alt") !== null ? "alt attribute" : "title attribute"
  if (tag === "input" && ["submit", "reset", "button"].includes((el as HTMLInputElement).type)) {
    return (el as HTMLInputElement).value ? "value attribute" : "default label"
  }
  if (tag === "input" && (el as HTMLInputElement).type === "image") return el.getAttribute("alt") ? "alt attribute" : "default label"
  if (["input", "select", "textarea", "meter", "progress", "output"].includes(tag)) {
    const id = el.getAttribute("id")
    const doc = el.ownerDocument
    if (id && doc.querySelector(`label[for="${CSS.escape(id)}"]`)) return "label element (for)"
    if (el.closest("label")) return "wrapping label element"
    if (el.getAttribute("title")) return "title attribute"
    if (el.getAttribute("placeholder")) return "placeholder (fallback)"
    return "unknown"
  }
  if (tag === "iframe") return el.getAttribute("title") ? "title attribute" : "unknown"
  if (el.querySelector("img[alt]:not([alt=''])") && !(el.textContent || "").trim()) return "alt of a child image"
  if ((el.textContent || "").trim()) return "text content"
  if (el.getAttribute("title")) return "title attribute"
  return "unknown"
}

function snippetOf(el: Element): string {
  const html = el.outerHTML.replace(/\s+/g, " ").trim()
  return html.length > 110 ? `${html.slice(0, 107)}...` : html
}

export default function AccessibleNamePreviewer() {
  const [html, setHtml] = useState(EXAMPLES[0].html)
  const [rows, setRows] = useState<Row[]>([])
  const [status, setStatus] = useState<string>("Paste markup, or pick an example, then run.")
  const [copied, setCopied] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const textareaId = useId()
  const resultsId = useId()

  const analyse = useCallback(() => {
    const frame = frameRef.current
    if (!frame) return
    const doc = frame.contentDocument
    if (!doc) return
    doc.open()
    doc.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body>${html}</body></html>`)
    doc.close()

    const all = Array.from(doc.body.querySelectorAll("*"))
    const out: Row[] = []
    let i = 0
    for (const el of all) {
      let role = ""
      try {
        role = getRole(el) || ""
      } catch {
        role = ""
      }
      const tag = el.tagName.toLowerCase()
      if (!role) {
        // Elements with no role are still worth showing when they look like
        // controls: a div with an onclick is the classic agent-invisible button.
        const looksLikeControl = el.hasAttribute("onclick") || (el.hasAttribute("tabindex") && !["a", "button", "input", "select", "textarea"].includes(tag))
        if (!looksLikeControl) continue
      }
      let name = ""
      let description = ""
      try {
        name = computeAccessibleName(el).trim()
        description = computeAccessibleDescription(el).trim()
      } catch {
        name = ""
      }
      const effectiveRole = role || "(none)"
      out.push({
        index: ++i,
        tag,
        role: effectiveRole,
        name,
        description,
        source: role ? nameSource(el, name) : "no role: not exposed as a control",
        interactive: INTERACTIVE.has(role) || (!role && (el.hasAttribute("onclick") || el.hasAttribute("tabindex"))),
        snippet: snippetOf(el),
      })
    }
    setRows(out)
    const unnamed = out.filter((r) => r.interactive && !r.name).length
    const noRole = out.filter((r) => r.role === "(none)").length
    setStatus(
      out.length === 0
        ? "No elements with a role were found in that markup."
        : `${out.length} element${out.length === 1 ? "" : "s"} with a role. ${unnamed} interactive element${unnamed === 1 ? "" : "s"} without an accessible name${noRole ? `, ${noRole} clickable element${noRole === 1 ? "" : "s"} with no role at all` : ""}.`,
    )
  }, [html])

  useEffect(() => {
    analyse()
    // Run once on mount for the default example.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const agentView = useMemo(
    () =>
      rows
        .map((r) => {
          if (r.role === "(none)") return `  (nothing: <${r.tag}> has no role, so it is not in the tree)`
          return `- ${r.role}${r.name ? ` "${r.name}"` : ""}${r.description ? `  [description: ${r.description}]` : ""}`
        })
        .join("\n"),
    [rows],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(agentView)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const unnamedCount = rows.filter((r) => r.interactive && !r.name).length

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <label htmlFor={textareaId} className="block text-sm font-semibold text-slate-900 dark:text-white">
            HTML to check
          </label>
          <textarea
            id={textareaId}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={12}
            spellCheck={false}
            className="mt-2 w-full rounded-md border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            aria-describedby={`${textareaId}-help`}
          />
          <p id={`${textareaId}-help`} className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Rendered in a sandboxed frame with scripts disabled. Nothing leaves your browser.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={analyse}
              className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Show what gets announced
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">Examples:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => setHtml(ex.html)}
                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Bot className="h-4 w-4" aria-hidden="true" />
              The agent view
            </h2>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre
            aria-label="Accessibility tree as an agent or screen reader receives it"
            className="mt-2 min-h-[12rem] overflow-x-auto rounded-md border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 dark:border-slate-800"
          >
            {agentView || "(run to see the tree)"}
          </pre>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            This is the shape of the accessibility tree a browser-use agent is given: role, then name.
            A line that reads only <code className="font-mono">button</code> is a control the agent
            cannot tell apart from any other unnamed button, and a screen reader announces the same
            way.
          </p>
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`flex items-start gap-3 rounded-md border p-4 text-sm ${
          unnamedCount > 0
            ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
            : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
        }`}
      >
        {unnamedCount > 0 ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <p>{status}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table id={resultsId} className="w-full border-collapse text-sm">
          <caption className="sr-only">Each element with a role: its role, accessible name, where the name came from, and the markup</caption>
          <thead>
            <tr>
              {["#", "Element", "Role", "Accessible name", "Name comes from", "Description"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500 dark:text-slate-400">
                  Nothing to show yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const bad = r.interactive && !r.name
                return (
                  <tr key={r.index} className="align-top">
                    <td className="border-b border-slate-200 px-3 py-2 font-mono text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">{r.index}</td>
                    <td className="max-w-[22rem] border-b border-slate-200 px-3 py-2 font-mono text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300">
                      <span className="break-all">{r.snippet}</span>
                    </td>
                    <td className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-slate-800 dark:border-slate-800 dark:text-slate-200">{r.role}</td>
                    <td className={`border-b border-slate-200 px-3 py-2 dark:border-slate-800 ${bad ? "font-semibold text-rose-800 dark:text-rose-300" : "text-slate-900 dark:text-white"}`}>
                      {r.name ? `"${r.name}"` : bad ? "No accessible name" : r.role === "(none)" ? "Not in the tree" : "(empty)"}
                    </td>
                    <td className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-slate-600 dark:border-slate-800 dark:text-slate-400">{r.source}</td>
                    <td className="border-b border-slate-200 px-3 py-2 text-slate-600 dark:border-slate-800 dark:text-slate-400">{r.description || ""}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <iframe
        ref={frameRef}
        title="Sandboxed rendering of the pasted markup, used only for computation"
        sandbox="allow-same-origin"
        className="h-px w-px opacity-0"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
