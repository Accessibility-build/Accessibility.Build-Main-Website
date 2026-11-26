// The DOM checks the URL auditor runs inside the rendered page, after axe-core and before the
// keyboard pass. Each one looks for a failure pattern axe-core does not test, or tests only for
// presence: alt text that is a file name, controls a keyboard cannot reach, placeholder-only
// labels, personal-data fields without autocomplete, video without captions, and so on.
//
// `collectPageChecks` is passed to page.evaluate, so it is serialised and must be self-contained:
// every helper lives inside it, and it may only use its arguments and the DOM.

export interface RawCheckNode {
  selector: string
  html: string
  note?: string
}

export interface RawCheck {
  id: string
  count: number
  nodes: RawCheckNode[]
}

export interface RawPageFacts {
  lang: string | null
  title: string
  headings: { level: number; text: string }[]
  headingCount: number
  landmarks: { main: number; nav: number; header: number; footer: number; search: number; aside: number }
  images: number
  imagesWithAlt: number
  decorativeImages: number
  links: number
  buttons: number
  forms: number
  formFields: number
  passwordFields: number
  tables: number
  iframes: number
  videos: number
  audio: number
  embeddedPlayers: number
  disclosureControls: number
  draggable: number
  overlay: string | null
  statementLink: string | null
  skipLink: boolean
  runningAnimations: number
}

export interface RawPageChecks {
  checks: RawCheck[]
  facts: RawPageFacts
}

export interface OverlaySignature {
  name: string
  scriptPatterns: string[]
  domPatterns: string[]
  globalVars: string[]
}

export function collectPageChecks(maxNodes: number, overlays: OverlaySignature[]): RawPageChecks {
  const results: Record<string, RawCheck> = {}
  const add = (id: string, el: Element, note?: string) => {
    const entry = (results[id] ??= { id, count: 0, nodes: [] })
    entry.count += 1
    if (entry.nodes.length < maxNodes) entry.nodes.push({ selector: selectorFor(el), html: snippet(el), ...(note ? { note } : {}) })
  }

  // ---------- helpers ----------

  function cssEscape(value: string): string {
    return typeof CSS !== "undefined" && CSS.escape ? CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, "\\$&")
  }

  function selectorFor(el: Element): string {
    const parts: string[] = []
    let node: Element | null = el
    while (node && node.nodeType === 1 && parts.length < 5) {
      const tag = node.tagName.toLowerCase()
      if (tag === "html") break
      const id = node.getAttribute("id")
      if (id && /^[A-Za-z][\w-]{0,60}$/.test(id) && document.querySelectorAll(`#${cssEscape(id)}`).length === 1) {
        parts.unshift(`#${cssEscape(id)}`)
        return parts.join(" > ")
      }
      let part = tag
      const parent: Element | null = node.parentElement
      if (parent) {
        const sameTag = Array.from(parent.children).filter((child) => child.tagName === node!.tagName)
        if (sameTag.length > 1) part += `:nth-of-type(${sameTag.indexOf(node) + 1})`
      }
      parts.unshift(part)
      node = parent
    }
    return parts.join(" > ")
  }

  function snippet(el: Element): string {
    const html = el.outerHTML || ""
    if (html.length <= 280) return html
    const open = html.match(/^<[^>]{0,400}>/)?.[0] ?? html.slice(0, 240)
    return open.length > 400 ? `${open.slice(0, 400)}…` : `${open}…`
  }

  function hiddenFromAT(el: Element): boolean {
    return !!el.closest("[aria-hidden='true'], [inert]")
  }

  function isVisible(el: Element): boolean {
    const style = getComputedStyle(el)
    if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") return false
    if (parseFloat(style.opacity) === 0) return false
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }

  function textOf(el: Element): string {
    // Text plus image alternatives, the way a link or button gets its name from content.
    let out = ""
    const walk = (node: Node) => {
      if (node.nodeType === 3) out += node.textContent ?? ""
      else if (node.nodeType === 1) {
        const element = node as Element
        if (element.getAttribute("aria-hidden") === "true") return
        const tag = element.tagName.toLowerCase()
        if (tag === "script" || tag === "style" || tag === "noscript") return
        if (tag === "img" || (tag === "input" && (element as HTMLInputElement).type === "image")) out += ` ${element.getAttribute("alt") ?? ""} `
        else if (tag === "svg") out += ` ${element.getAttribute("aria-label") ?? element.querySelector("title")?.textContent ?? ""} `
        else if (element.getAttribute("aria-label")) out += ` ${element.getAttribute("aria-label")} `
        else element.childNodes.forEach(walk)
      }
    }
    el.childNodes.forEach(walk)
    return out.replace(/\s+/g, " ").trim()
  }

  function idsText(ids: string): string {
    return ids
      .split(/\s+/)
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => !!node)
      .map((node) => textOf(node) || node.textContent || "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
  }

  function accessibleName(el: Element): string {
    const labelledby = el.getAttribute("aria-labelledby")
    if (labelledby) {
      const text = idsText(labelledby)
      if (text) return text
    }
    const label = el.getAttribute("aria-label")
    if (label && label.trim()) return label.trim()
    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
      const fromLabels = Array.from(el.labels ?? [])
        .map((node) => textOf(node))
        .join(" ")
        .trim()
      if (fromLabels) return fromLabels
      return (el.getAttribute("title") || "").trim()
    }
    return textOf(el) || (el.getAttribute("title") || "").trim()
  }

  const NATIVE_FOCUSABLE = "a[href], area[href], button, input:not([type='hidden']), select, textarea, summary, iframe, [contenteditable=''], [contenteditable='true'], audio[controls], video[controls]"
  const INTERACTIVE_ROLES = new Set([
    "button", "link", "checkbox", "radio", "switch", "tab", "menuitem", "menuitemcheckbox", "menuitemradio",
    "option", "treeitem", "slider", "spinbutton", "combobox", "textbox", "searchbox",
  ])

  // ---------- facts ----------

  const all = Array.from(document.querySelectorAll("body *")).slice(0, 8000)

  const headingEls = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']")).filter((el) => !hiddenFromAT(el))
  const headings = headingEls.slice(0, 60).map((el) => {
    const aria = parseInt(el.getAttribute("aria-level") || "", 10)
    const level = /^h[1-6]$/i.test(el.tagName) && !el.getAttribute("role") ? parseInt(el.tagName.slice(1), 10) : Number.isFinite(aria) ? aria : 2
    return { level, text: (textOf(el) || "(empty heading)").slice(0, 120) }
  })

  const count = (selector: string) => Array.from(document.querySelectorAll(selector)).filter((el) => !hiddenFromAT(el)).length
  const imgs = Array.from(document.querySelectorAll("img"))
  const formFields = Array.from(document.querySelectorAll("input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='reset']):not([type='image']), select, textarea")).filter(
    (el) => isVisible(el) || (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")),
  )
  const iframes = Array.from(document.querySelectorAll("iframe"))
  const playerHosts = /youtube(-nocookie)?\.com|youtu\.be|vimeo\.com|wistia\.(com|net)|brightcove|jwplayer|vidyard|loom\.com|dailymotion|twitch\.tv/i

  // Overlay widgets: script URLs, element ids and classes, and window globals.
  let overlay: string | null = null
  const scriptSrcs = Array.from(document.querySelectorAll("script[src]")).map((s) => (s.getAttribute("src") || "").toLowerCase())
  const inline = Array.from(document.querySelectorAll("script:not([src])"))
    .map((s) => (s.textContent || "").toLowerCase().slice(0, 20000))
    .join(" ")
  const markup = Array.from(document.querySelectorAll("[id], [class]"))
    .slice(0, 6000)
    .map((el) => `${el.id} ${typeof el.className === "string" ? el.className : ""}`.toLowerCase())
    .join(" ")
  for (const vendor of overlays) {
    const scriptHit = vendor.scriptPatterns.some((pattern) => scriptSrcs.some((src) => src.includes(pattern.toLowerCase())) || inline.includes(pattern.toLowerCase()))
    const domHit = vendor.domPatterns.some((pattern) => pattern.length > 5 && markup.includes(pattern.toLowerCase()))
    const globalHit = vendor.globalVars.some((name) => name.length > 4 && name in window)
    if (scriptHit || domHit || globalHit) {
      overlay = vendor.name
      break
    }
  }

  const anchors = Array.from(document.querySelectorAll("a[href]")) as HTMLAnchorElement[]
  const statement = anchors.find((a) => /accessibility\s*(statement|policy|conformance|commitment)?/i.test(textOf(a)) && !/^(skip|jump)/i.test(textOf(a)))
  const focusables = Array.from(document.querySelectorAll(NATIVE_FOCUSABLE + ", [tabindex]:not([tabindex='-1'])")).slice(0, 5)
  const skipLink = focusables.some((el) => el instanceof HTMLAnchorElement && (el.getAttribute("href") || "").startsWith("#") && /skip|jump to|go to (main )?content|main content/i.test(textOf(el)))

  let runningAnimations = 0
  try {
    runningAnimations = document
      .getAnimations()
      .filter((animation) => animation.playState === "running" && animation.effect?.getComputedTiming().iterations === Infinity).length
  } catch {
    runningAnimations = 0
  }

  const facts: RawPageFacts = {
    lang: document.documentElement.getAttribute("lang"),
    title: document.title || "",
    headings,
    headingCount: headingEls.length,
    landmarks: {
      main: count("main, [role='main']"),
      nav: count("nav, [role='navigation']"),
      header: count("body > header, [role='banner'], body > * > header:not(article header):not(section header)"),
      footer: count("body > footer, [role='contentinfo'], body > * > footer:not(article footer):not(section footer)"),
      search: count("search, [role='search']"),
      aside: count("aside, [role='complementary']"),
    },
    images: imgs.length + count("[role='img']"),
    imagesWithAlt: imgs.filter((img) => (img.getAttribute("alt") || "").trim().length > 0).length,
    decorativeImages: imgs.filter((img) => img.getAttribute("alt") === "" || /^(presentation|none)$/.test(img.getAttribute("role") || "")).length,
    links: anchors.length,
    buttons: count("button, [role='button'], input[type='submit'], input[type='button']"),
    forms: count("form"),
    formFields: formFields.length,
    passwordFields: count("input[type='password']"),
    tables: count("table:not([role='presentation']):not([role='none'])"),
    iframes: iframes.length,
    videos: count("video"),
    audio: count("audio"),
    embeddedPlayers: iframes.filter((frame) => playerHosts.test(frame.getAttribute("src") || "")).length,
    disclosureControls: count("[aria-haspopup]:not([aria-haspopup='false']), [aria-expanded]"),
    draggable: count("[draggable='true']"),
    overlay,
    statementLink: statement ? statement.href : null,
    skipLink,
    runningAnimations,
  }

  // ---------- links ----------

  const GENERIC = new Set([
    "click here", "here", "click", "read more", "more", "learn more", "see more", "view more", "find out more", "more info",
    "more information", "details", "continue", "continue reading", "link", "this", "this link", "go", "view", "see all", "info",
  ])
  const FILE_TYPE = /\.(pdf|docx?|xlsx?|pptx?|csv|zip|rtf|odt)(?:[?#]|$)/i
  for (const a of anchors) {
    if (hiddenFromAT(a) || !isVisible(a)) continue
    const name = accessibleName(a)
    const plain = name.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ").trim()
    if (plain && GENERIC.has(plain) && !a.getAttribute("aria-describedby")) add("ab-link-generic-text", a, `Announced as "${name}"`)

    const target = (a.getAttribute("target") || "").toLowerCase()
    if (target && !["_self", "_parent", "_top"].includes(target)) {
      const described = a.getAttribute("aria-describedby") ? idsText(a.getAttribute("aria-describedby")!) : ""
      if (!/new (window|tab)|opens|external|nueva|nouvel|neues/i.test(`${name} ${described} ${a.getAttribute("title") || ""}`)) add("ab-link-new-window", a, name ? `"${name.slice(0, 80)}"` : undefined)
    }

    const fileMatch = (a.getAttribute("href") || "").match(FILE_TYPE)
    if (fileMatch) {
      const ext = fileMatch[1].toLowerCase()
      const mentions = new RegExp(`${ext.replace(/x$/, "")}|word|excel|powerpoint|spreadsheet|document|download|\\d+\\s?(kb|mb)`, "i")
      if (!mentions.test(`${name} ${a.getAttribute("title") || ""}`)) add("ab-link-file-type", a, `Links to a .${ext} file`)
    }
  }

  // ---------- images ----------

  const FILENAME = /\.(jpe?g|png|gif|webp|svg|avif|bmp|tiff?)$|^(img|image|dsc|dscn|pxl|photo|screenshot|screen shot|unnamed|untitled)[\s_-]*\d+/i
  const PLACEHOLDER_ALT = new Set(["image", "img", "photo", "picture", "pic", "graphic", "icon", "untitled", "spacer", "blank", "alt", "alt text", "null", "undefined", "logo image", "image description", "placeholder"])
  for (const img of imgs) {
    const alt = img.getAttribute("alt")
    if (alt === null || hiddenFromAT(img) || /^(presentation|none)$/.test(img.getAttribute("role") || "")) continue
    const trimmed = alt.trim()
    if (!trimmed) continue
    if (FILENAME.test(trimmed) || PLACEHOLDER_ALT.has(trimmed.toLowerCase())) {
      add("ab-img-alt-filename", img, `alt="${trimmed.slice(0, 80)}"`)
    } else if (/^(an? )?(image|picture|photo|photograph|graphic) of\b/i.test(trimmed)) {
      add("ab-img-alt-quality", img, `Starts with "${trimmed.split(" ").slice(0, 3).join(" ")}"; screen readers already say it is an image`)
    } else if (trimmed.length > 150) {
      add("ab-img-alt-quality", img, `alt is ${trimmed.length} characters long`)
    }
  }

  // ---------- forms ----------

  const TEXT_TYPES = new Set(["text", "email", "tel", "url", "search", "password", "number", ""])
  const PERSONAL = /(^|[\s_.\-[\]])(e-?mail|phone|tel|mobile|first.?name|last.?name|given.?name|family.?name|surname|full.?name|fname|lname|zip|postal|post.?code|postcode|address|street|city|town|country|username|user.?name|birthday|dob|organi[sz]ation|company)([\s_.\-[\]]|$)/i
  for (const field of formFields) {
    if (hiddenFromAT(field)) continue
    const input = field as HTMLInputElement
    const type = field instanceof HTMLInputElement ? (input.getAttribute("type") || "text").toLowerCase() : field.tagName.toLowerCase()

    // Placeholder-only labels.
    const isTextLike = field instanceof HTMLTextAreaElement || (field instanceof HTMLInputElement && TEXT_TYPES.has(type))
    const placeholder = (field.getAttribute("placeholder") || "").trim()
    const hasLabel =
      !!field.getAttribute("aria-label")?.trim() ||
      !!(field.getAttribute("aria-labelledby") && idsText(field.getAttribute("aria-labelledby")!)) ||
      Array.from((field as HTMLInputElement).labels ?? []).some((label) => textOf(label).length > 0) ||
      !!field.getAttribute("title")?.trim()
    if (isTextLike && placeholder && !hasLabel && isVisible(field)) add("ab-input-placeholder-label", field, `Only label is the placeholder "${placeholder.slice(0, 60)}"`)

    // Personal data without autocomplete (1.3.5).
    if (field instanceof HTMLInputElement && TEXT_TYPES.has(type) && type !== "search" && type !== "password" && !input.readOnly && !field.closest("[role='search'], search")) {
      const hint = `${field.getAttribute("name") || ""} ${field.id} ${placeholder} ${accessibleName(field)}`
      const autocomplete = (field.getAttribute("autocomplete") || "").trim().toLowerCase()
      const looksPersonal = type === "email" || type === "tel" || PERSONAL.test(hint)
      if (looksPersonal && (!autocomplete || autocomplete === "off" || autocomplete === "on")) {
        add("ab-autocomplete-missing", field, autocomplete ? `autocomplete="${autocomplete}"` : `type="${type}", no autocomplete attribute`)
      }
    }

    // A visual "required" marker that is not exposed to assistive technology.
    const required = field.hasAttribute("required") || field.getAttribute("aria-required") === "true"
    if (!required) {
      const labelText = Array.from((field as HTMLInputElement).labels ?? [])
        .map((label) => label.textContent || "")
        .join(" ")
      if (/\*|\(required\)|\brequired\b/i.test(labelText) && isVisible(field)) add("ab-required-not-exposed", field, `Label "${labelText.replace(/\s+/g, " ").trim().slice(0, 60)}" marks it required`)
    }
  }

  // ---------- keyboard reach ----------

  for (const el of Array.from(document.querySelectorAll("[role]"))) {
    const role = (el.getAttribute("role") || "").trim().split(/\s+/)[0]
    if (!INTERACTIVE_ROLES.has(role)) continue
    if (el.matches(NATIVE_FOCUSABLE) || el.hasAttribute("tabindex")) continue
    if (el.getAttribute("aria-disabled") === "true" || el.hasAttribute("disabled")) continue
    if (hiddenFromAT(el) || el.closest("[aria-activedescendant]") || !isVisible(el)) continue
    // A child of a native control (a span with role=button inside a button) is reached through its parent.
    if (el.parentElement?.closest(NATIVE_FOCUSABLE + ", [tabindex]")) continue
    add("ab-role-not-focusable", el, `role="${role}" "${accessibleName(el).slice(0, 60)}"`)
  }

  let pointerScanned = 0
  for (const el of all) {
    if (pointerScanned > 6000) break
    pointerScanned += 1
    const tag = el.tagName.toLowerCase()
    if (tag === "label" || tag === "option" || tag === "svg" || tag === "path" || el.closest("svg")) continue
    if (el.matches(NATIVE_FOCUSABLE) || el.hasAttribute("tabindex") || el.hasAttribute("role")) continue
    const style = getComputedStyle(el)
    if (style.cursor !== "pointer") continue
    const parent = el.parentElement
    if (parent && getComputedStyle(parent).cursor === "pointer") continue
    if (el.closest("a[href], button, label, summary, [role], [tabindex], [contenteditable='true']")) continue
    if (el.querySelector(NATIVE_FOCUSABLE + ", [tabindex]:not([tabindex='-1'])")) continue
    if (hiddenFromAT(el) || !isVisible(el)) continue
    const rect = el.getBoundingClientRect()
    if (rect.width < 8 || rect.height < 8) continue
    const label = textOf(el).slice(0, 60)
    if (!label && !el.querySelector("img, svg")) continue
    add("ab-clickable-not-focusable", el, label ? `"${label}"${el.hasAttribute("onclick") ? ", has an onclick handler" : ""}` : el.hasAttribute("onclick") ? "Has an onclick handler" : undefined)
  }

  // ---------- media ----------

  for (const video of Array.from(document.querySelectorAll("video"))) {
    if (hiddenFromAT(video)) continue
    const tracks = Array.from(video.querySelectorAll("track")).filter((track) => /^(captions|subtitles)$/i.test(track.getAttribute("kind") || "subtitles"))
    const decorative = video.muted && !video.controls
    if (!decorative && tracks.length === 0) add("ab-video-captions", video, video.controls ? "Has controls but no captions track" : undefined)
    const moving = video.autoplay || !video.paused
    const long = video.loop || !Number.isFinite(video.duration) || video.duration > 5
    if (moving && long && !video.controls && isVisible(video)) add("ab-autoplay-video", video, video.loop ? "Plays automatically on a loop with no controls" : "Plays automatically with no controls")
  }

  // ---------- text ----------

  let textScanned = 0
  for (const el of all) {
    if (textScanned > 5000) break
    const ownText = Array.from(el.childNodes)
      .filter((node) => node.nodeType === 3)
      .map((node) => node.textContent || "")
      .join("")
      .trim()
    if (ownText.length < 20) continue
    textScanned += 1
    if (hiddenFromAT(el) || !isVisible(el)) continue
    const style = getComputedStyle(el)
    const size = parseFloat(style.fontSize)
    if (size > 0 && size < 12) add("ab-small-text", el, `${Math.round(size * 10) / 10}px: "${ownText.slice(0, 50)}"`)
    if (style.textAlign === "justify" && ownText.length > 150) add("ab-justified-text", el, `"${ownText.slice(0, 50)}…"`)
  }

  const BULLET = /^\s*([•·▪‣◦●○■□➢➤✓✔]|[-–*]\s|\d{1,2}[.)]\s)/
  for (const p of Array.from(document.querySelectorAll("p"))) {
    if (!BULLET.test(p.textContent || "")) continue
    const next = p.nextElementSibling
    const prev = p.previousElementSibling
    const siblingBullet = (node: Element | null) => !!node && node.tagName === "P" && BULLET.test(node.textContent || "")
    if (siblingBullet(next) && !siblingBullet(prev) && !hiddenFromAT(p) && isVisible(p)) add("ab-fake-list", p, `"${(p.textContent || "").trim().slice(0, 50)}"`)
  }

  return { checks: Object.values(results), facts }
}

/**
 * Text-spacing probe (WCAG 1.4.12): record which text containers already clip their content, apply
 * the spacing the criterion names, and list the containers that start clipping.
 */
export function probeTextSpacing(phase: "before" | "after", maxNodes: number): { clipped: RawCheckNode[]; count: number } {
  const KEY = "__a11yBuildTextSpacing"
  const store = window as unknown as Record<string, Set<Element> | undefined>
  const clips = (el: Element) => {
    const style = getComputedStyle(el)
    const hides = (value: string) => value === "hidden" || value === "clip"
    const vertical = hides(style.overflowY) && el.scrollHeight > el.clientHeight + 2
    const horizontal = hides(style.overflowX) && el.scrollWidth > el.clientWidth + 2 && style.textOverflow !== "ellipsis"
    return vertical || horizontal
  }
  const candidates = Array.from(document.querySelectorAll("body *"))
    .slice(0, 6000)
    .filter((el) => {
      if (el.closest("[aria-hidden='true']")) return false
      const text = Array.from(el.childNodes).some((node) => node.nodeType === 3 && (node.textContent || "").trim().length > 2) || !!el.querySelector("p, span, a, li, h1, h2, h3, h4, label")
      if (!text) return false
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0 && rect.height < 600
    })

  if (phase === "before") {
    store[KEY] = new Set(candidates.filter(clips))
    const style = document.createElement("style")
    style.id = KEY
    style.textContent =
      "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }"
    document.head.appendChild(style)
    return { clipped: [], count: 0 }
  }

  const before = store[KEY] ?? new Set<Element>()
  const newly = candidates.filter((el) => !before.has(el) && clips(el))
  // Keep the innermost clipping containers: a wrapper clipping because its child does adds nothing.
  const innermost = newly.filter((el) => !newly.some((other) => other !== el && el.contains(other)))
  document.getElementById(KEY)?.remove()
  const describe = (el: Element) => {
    const html = el.outerHTML || ""
    const open = html.match(/^<[^>]{0,300}>/)?.[0] ?? html.slice(0, 200)
    return html.length <= 240 ? html : `${open}…`
  }
  const pathOf = (el: Element) => {
    const parts: string[] = []
    let node: Element | null = el
    while (node && parts.length < 4 && node.tagName.toLowerCase() !== "html") {
      if (node.id && /^[A-Za-z][\w-]{0,60}$/.test(node.id)) {
        parts.unshift(`#${node.id}`)
        break
      }
      const parent: Element | null = node.parentElement
      const same = parent ? Array.from(parent.children).filter((child) => child.tagName === node!.tagName) : []
      parts.unshift(node.tagName.toLowerCase() + (same.length > 1 ? `:nth-of-type(${same.indexOf(node) + 1})` : ""))
      node = parent
    }
    return parts.join(" > ")
  }
  return {
    count: innermost.length,
    clipped: innermost.slice(0, maxNodes).map((el) => ({
      selector: pathOf(el),
      html: describe(el),
      note: `"${(el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60)}" is cut off`,
    })),
  }
}

/**
 * Reflow probe (WCAG 1.4.10), run after the viewport is set to 320 CSS px wide: how wide the page
 * is, and the innermost elements that stick out past the right edge.
 */
export function probeReflow(maxNodes: number): { scrollWidth: number; viewport: number; clippedByRoot: boolean; culprits: RawCheckNode[]; count: number; textual: boolean } {
  const viewport = document.documentElement.clientWidth || window.innerWidth
  const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0)
  const rootStyle = getComputedStyle(document.documentElement)
  const bodyStyle = document.body ? getComputedStyle(document.body) : rootStyle
  const clippedByRoot = /hidden|clip/.test(rootStyle.overflowX) || /hidden|clip/.test(bodyStyle.overflowX)
  // Two-dimensional content (data tables, maps, diagrams, video, code) is exempt from reflow.
  const EXEMPT = "table, pre, code, canvas, video, iframe, svg, math, [role='application'], [role='grid'], [role='img']"
  const insideScroller = (el: Element) => {
    let node = el.parentElement
    while (node && node !== document.body) {
      const style = getComputedStyle(node)
      if (/auto|scroll/.test(style.overflowX)) return true
      if (/hidden|clip/.test(style.overflowX) && node.getBoundingClientRect().right <= viewport + 1) return true
      node = node.parentElement
    }
    return false
  }
  const over = Array.from(document.querySelectorAll("body *"))
    .slice(0, 6000)
    .filter((el) => {
      if (el.closest(EXEMPT) || el.closest("[aria-hidden='true']")) return false
      const style = getComputedStyle(el)
      if (style.position === "fixed" || style.visibility === "hidden" || style.display === "none") return false
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return false
      return rect.right > viewport + 4 && rect.left < viewport && !insideScroller(el)
    })
  const innermost = over.filter((el) => !over.some((other) => other !== el && el.contains(other)))
  const textual = innermost.some((el) => (el.textContent || "").trim().length > 3 || el.matches("a, button, input, select, textarea, img"))
  const pathOf = (el: Element) => {
    const parts: string[] = []
    let node: Element | null = el
    while (node && parts.length < 4 && node.tagName.toLowerCase() !== "html") {
      if (node.id && /^[A-Za-z][\w-]{0,60}$/.test(node.id)) {
        parts.unshift(`#${node.id}`)
        break
      }
      const parent: Element | null = node.parentElement
      const same = parent ? Array.from(parent.children).filter((child) => child.tagName === node!.tagName) : []
      parts.unshift(node.tagName.toLowerCase() + (same.length > 1 ? `:nth-of-type(${same.indexOf(node) + 1})` : ""))
      node = parent
    }
    return parts.join(" > ")
  }
  const describe = (el: Element) => {
    const html = el.outerHTML || ""
    const open = html.match(/^<[^>]{0,300}>/)?.[0] ?? html.slice(0, 200)
    return html.length <= 240 ? html : `${open}…`
  }
  return {
    scrollWidth,
    viewport,
    clippedByRoot,
    textual,
    count: innermost.length,
    culprits: innermost
      .sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right)
      .slice(0, maxNodes)
      .map((el) => ({ selector: pathOf(el), html: describe(el), note: `Reaches ${Math.round(el.getBoundingClientRect().right)}px on a ${viewport}px wide screen` })),
  }
}
