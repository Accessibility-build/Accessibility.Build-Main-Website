import type { Box } from "@/lib/focus-order/types"

// Code that runs inside the visitor's page. `installHelpers` is passed to page.evaluate whole, so
// it must not refer to anything outside its own body: no imports, no module constants. It puts one
// object on window under HELPERS_KEY, and the server then makes small calls into it for each Tab
// press instead of shipping the same code on every evaluate.

export const HELPERS_KEY = "__a11yBuildFocusOrder"

// Final states only: no transitions or animations mid-way, no blinking caret (it would read as an
// indicator in a text field), and no smooth scrolling, so an element stays where it was measured.
// Applied as a constructed stylesheet, which a strict Content-Security-Policy does not block.
export const FREEZE_CSS = `*, *::before, *::after {
  transition: none !important;
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  animation-iteration-count: 1 !important;
  caret-color: transparent !important;
  scroll-behavior: auto !important;
}`

export type HiddenReason = "not-rendered" | "transparent" | "clipped" | "off-screen"

export interface StopDetails {
  tag: string
  roleAttr: string
  tabindex: number | null
  selector: string
  name: string
  frame: boolean
  pinned: boolean
  inDialog: boolean
  /** Viewport coordinates while focused. */
  rect: Box
  scrollX: number
  scrollY: number
  hidden: HiddenReason | null
  /** The part of the element inside the viewport and its clipping containers, viewport coordinates. */
  visibleBox: Box | null
  covered: "none" | "partial" | "full"
  coveredBy: string | null
  style: Record<string, string>
}

export type InspectResult = { kind: "none" } | { kind: "element"; id: number; isNew: boolean; details: StopDetails | null }

export interface MeasuredTarget {
  tag: string
  role: string
  name: string
  selector: string
  /** Page coordinates, measured with the page scrolled to the top. */
  box: Box
  exempt: "inline" | "user-agent" | null
  ancestors: number[]
  /** Inside a fixed or sticky container (a header, a cookie banner): a separate layer over the page. */
  pinned: boolean
}

export interface PageHelpers {
  stops: Element[]
  start(css: string): void
  inspect(): InspectResult
  blur(id: number): Record<string, string> | null
  refocus(id: number): { ok: boolean; focusVisible: boolean }
  finish(): void
  markers(): (Box | null)[]
  positiveTabindex(): { count: number; selectors: string[] }
  unvisitedFocusable(): number
  allInDialog(ids: number[]): boolean
  /** Closes a cookie consent dialog that is holding focus, preferring its reject button. Returns the button's label. */
  dismissConsent(ids: number[]): string | null
  /** Every visible interactive target; selector, name and exceptions only for those under `minSize`. */
  measureTargets(minSize: number): MeasuredTarget[]
}

export function installHelpers(key: string): void {
  const FOCUSABLE =
    'a[href], area[href], button, input:not([type="hidden"]), select, textarea, summary, iframe, [tabindex], [contenteditable=""], [contenteditable="true"]'
  // Interactive by nature or by role. Elements that are targets only because of a tabindex are
  // added separately, so a tabindex of -1 on a plain element does not make it one.
  const NATIVE_TARGETS = [
    'a[href]', 'area[href]', 'button', 'input:not([type="hidden"])', 'select', 'textarea', 'summary',
    '[role="button"]', '[role="link"]', '[role="checkbox"]', '[role="radio"]', '[role="switch"]', '[role="tab"]',
    '[role="menuitem"]', '[role="menuitemcheckbox"]', '[role="menuitemradio"]', '[role="option"]', '[role="slider"]',
    '[role="spinbutton"]', '[role="combobox"]', '[role="textbox"]', '[role="searchbox"]', '[role="treeitem"]',
    '[contenteditable=""]', '[contenteditable="true"]',
  ].join(", ")
  const TARGETS = `${NATIVE_TARGETS}, [tabindex]`
  const FRAME_TAGS = new Set(["iframe", "frame", "object", "embed"])
  const REPLACED = new Set(["img", "video", "canvas", "svg", "iframe", "picture", "input", "textarea", "select", "button", "object", "embed"])

  const parentOf = (node: Element): Element | null => {
    if (node.parentElement) return node.parentElement
    const root = node.getRootNode()
    return root instanceof ShadowRoot ? root.host : null
  }

  const deepActive = (): Element | null => {
    let el = document.activeElement
    while (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement
    return el
  }

  const cleanClass = (el: Element): string => {
    const first = Array.from(el.classList).find((name) => /^[a-zA-Z][\w-]{1,40}$/.test(name))
    return first ? `.${first}` : ""
  }

  const selectorOf = (el: Element): string => {
    const root = el.getRootNode() as Document | ShadowRoot
    const prefix = root instanceof ShadowRoot ? `${selectorOf(root.host)} >>> ` : ""
    const parts: string[] = []
    let node: Element | null = el
    for (let depth = 0; node && depth < 10; depth += 1) {
      const tag = node.tagName.toLowerCase()
      if (node.id && /^[A-Za-z][\w-]*$/.test(node.id) && root.querySelectorAll(`#${CSS.escape(node.id)}`).length === 1) {
        parts.unshift(`#${node.id}`)
        break
      }
      let part = tag + cleanClass(node)
      const parent: Element | null = node.parentElement
      if (parent) {
        const same = Array.from(parent.children).filter((child) => child.tagName === node!.tagName)
        if (same.length > 1) part += `:nth-of-type(${same.indexOf(node) + 1})`
      }
      parts.unshift(part)
      if (tag === "body") break
      if (depth >= 1) {
        try {
          if (root.querySelectorAll(parts.join(" > ")).length === 1) break
        } catch {
          // An odd class name made the selector invalid; keep climbing.
        }
      }
      node = parent
    }
    return prefix + parts.join(" > ")
  }

  const squash = (text: string | null | undefined) => (text || "").replace(/\s+/g, " ").trim()
  const clip = (text: string) => (text.length > 80 ? `${text.slice(0, 77)}...` : text)

  // A short approximation of the accessible name. The focus run asks Chrome's accessibility tree
  // instead and only falls back to this; the targets run uses it because it measures hundreds.
  const nameOf = (el: Element): string => {
    const labelledBy = el.getAttribute("aria-labelledby")
    if (labelledBy) {
      const root = el.getRootNode() as Document | ShadowRoot
      const text = labelledBy
        .split(/\s+/)
        .map((id) => squash(root.getElementById?.(id)?.textContent))
        .filter(Boolean)
        .join(" ")
      if (text) return clip(text)
    }
    const label = squash(el.getAttribute("aria-label"))
    if (label) return clip(label)
    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
      const fromLabels = Array.from(el.labels ?? [])
        .map((node) => squash(node.innerText || node.textContent))
        .join(" ")
      if (fromLabels) return clip(fromLabels)
      if (el instanceof HTMLInputElement && ["submit", "button", "reset"].includes(el.type) && el.value) return clip(el.value)
      if (el instanceof HTMLInputElement && el.type === "image" && el.alt) return clip(el.alt)
      const placeholder = squash(el.getAttribute("placeholder"))
      if (placeholder) return clip(placeholder)
      return clip(squash(el.getAttribute("title")))
    }
    if (el instanceof HTMLImageElement || el instanceof HTMLAreaElement) return clip(squash(el.getAttribute("alt") || el.getAttribute("title")))
    const text = squash(el instanceof HTMLElement ? el.innerText : el.textContent)
    if (text) return clip(text)
    const img = el.querySelector("img[alt]")
    if (img && squash(img.getAttribute("alt"))) return clip(squash(img.getAttribute("alt")))
    const svgTitle = el.querySelector("svg title")
    if (svgTitle && squash(svgTitle.textContent)) return clip(squash(svgTitle.textContent))
    return clip(squash(el.getAttribute("title")))
  }

  const isPinned = (el: Element): boolean => {
    for (let node: Element | null = el; node && node !== document.documentElement; node = parentOf(node)) {
      const position = getComputedStyle(node).position
      if (position === "fixed" || position === "sticky") return true
    }
    return false
  }

  const describe = (el: Element): string => {
    const tag = el.tagName.toLowerCase()
    if (el.id && /^[A-Za-z][\w-]*$/.test(el.id)) return `${tag}#${el.id}`
    return tag + cleanClass(el)
  }

  /** Clipped by an ancestor's overflow, or by the clip / clip-path tricks visually hidden text uses. */
  const clippedBox = (el: Element): { left: number; top: number; right: number; bottom: number; hiddenByClip: boolean } => {
    const rect = el.getBoundingClientRect()
    let { left, top, right, bottom } = rect
    let hiddenByClip = false
    for (let node: Element | null = el; node && node !== document.body && node !== document.documentElement; node = parentOf(node)) {
      const style = getComputedStyle(node)
      if (/rect\(\s*(0|1)px,?\s*(0|1)px,?\s*(0|1)px,?\s*(0|1)px\s*\)/.test(style.clip) || /inset\(\s*50%/.test(style.clipPath)) {
        hiddenByClip = true
        break
      }
      if (node !== el) {
        const clipX = style.overflowX !== "visible"
        const clipY = style.overflowY !== "visible"
        if (clipX || clipY) {
          const box = node.getBoundingClientRect()
          if (clipX) {
            left = Math.max(left, box.left)
            right = Math.min(right, box.right)
          }
          if (clipY) {
            top = Math.max(top, box.top)
            bottom = Math.min(bottom, box.bottom)
          }
        }
      }
      // A fixed element escapes the overflow of everything above it.
      if (style.position === "fixed") break
    }
    return { left, top, right, bottom, hiddenByClip }
  }

  const alpha = (colour: string): number => {
    const match = colour.match(/rgba?\(([^)]+)\)/)
    if (!match) return colour === "transparent" ? 0 : 1
    const parts = match[1].split(/[\s,/]+/).filter(Boolean)
    return parts.length >= 4 ? parseFloat(parts[3]) : 1
  }

  /** Whether `top`, or anything between it and the focused element's ancestors, paints something solid. */
  const paintsOver = (top: Element, el: Element): boolean => {
    for (let node: Element | null = top; node && !node.contains(el); node = parentOf(node)) {
      const style = getComputedStyle(node)
      if (parseFloat(style.opacity) < 0.1) return false
      if (REPLACED.has(node.tagName.toLowerCase())) return true
      // A dimming overlay at half opacity leaves the content readable; only near-solid layers hide it.
      if (alpha(style.backgroundColor) > 0.8 || style.backgroundImage !== "none") return true
      if (node === top && Array.from(node.childNodes).some((child) => child.nodeType === 3 && squash(child.textContent))) return true
    }
    return false
  }

  const coverage = (el: Element, box: Box): { covered: "none" | "partial" | "full"; coveredBy: string | null } => {
    const root = el.getRootNode() as Document | ShadowRoot
    const inset = (size: number, fraction: number) => Math.min(Math.max(size * fraction, 1), size - 1)
    const within = (rect: Box) => {
      const left = Math.max(rect.x, box.x)
      const top = Math.max(rect.y, box.y)
      const right = Math.min(rect.x + rect.width, box.x + box.width)
      const bottom = Math.min(rect.y + rect.height, box.y + box.height)
      return right - left >= 1 && bottom - top >= 1 ? { x: left, y: top, width: right - left, height: bottom - top } : null
    }
    // A link that wraps across lines has a bounding box that takes in the text around it, so
    // sample each line box rather than the corners of the whole.
    const fragments = Array.from(el.getClientRects())
      .map((rect) => within({ x: rect.left, y: rect.top, width: rect.width, height: rect.height }))
      .filter((rect): rect is Box => !!rect)
    const points =
      fragments.length > 1
        ? fragments.slice(0, 4).flatMap((rect) => [0.15, 0.5, 0.85].map((fx) => [rect.x + inset(rect.width, fx), rect.y + rect.height / 2]))
        : [
            [0.5, 0.5],
            [0.15, 0.15],
            [0.85, 0.15],
            [0.15, 0.85],
            [0.85, 0.85],
          ].map(([fx, fy]) => [box.x + inset(box.width, fx), box.y + inset(box.height, fy)])
    let tested = 0
    let covered = 0
    let coveredBy: string | null = null
    for (const [x, y] of points) {
      if (x < 0 || y < 0 || x >= window.innerWidth || y >= window.innerHeight) continue
      const stack = root.elementsFromPoint(x, y)
      if (!stack.length) continue
      tested += 1
      const top = stack[0]
      if (top === el || el.contains(top) || top.contains(el)) continue
      if (!paintsOver(top, el)) continue
      covered += 1
      if (!coveredBy) {
        let cover: Element = top
        for (let node: Element | null = top; node && !node.contains(el); node = parentOf(node)) {
          const position = getComputedStyle(node).position
          if (position === "fixed" || position === "sticky") {
            cover = node
            coveredBy = `${describe(node)} (position: ${position})`
            break
          }
        }
        coveredBy ??= describe(cover)
        const text = squash(cover instanceof HTMLElement ? cover.innerText : cover.textContent)
        if (text) coveredBy += `, which starts "${text.length > 40 ? `${text.slice(0, 37)}...` : text}"`
      }
    }
    if (tested === 0 || covered === 0) return { covered: "none", coveredBy: null }
    return { covered: covered === tested ? "full" : "partial", coveredBy }
  }

  const visibleLabel = (el: Element): { label: HTMLLabelElement; box: Box } | null => {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) return null
    for (const label of Array.from(el.labels ?? [])) {
      const rect = label.getBoundingClientRect()
      const left = Math.max(rect.left, 0)
      const top = Math.max(rect.top, 0)
      const right = Math.min(rect.right, window.innerWidth)
      const bottom = Math.min(rect.bottom, window.innerHeight)
      if (right - left >= 4 && bottom - top >= 4) return { label, box: { x: left, y: top, width: right - left, height: bottom - top } }
    }
    return null
  }

  const styleOf = (el: Element): Record<string, string> => {
    const s = getComputedStyle(el)
    const pseudo = ["::before", "::after"]
      .map((which) => {
        const p = getComputedStyle(el, which)
        return p.content === "none" ? "" : [p.content, p.backgroundColor, p.borderBottomColor, p.boxShadow, p.opacity, p.transform, p.outlineStyle].join(" ")
      })
      .join("|")
    return {
      outline: s.outlineStyle === "none" || parseFloat(s.outlineWidth) === 0 ? "none" : `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor} ${s.outlineOffset}`,
      "box shadow": s.boxShadow,
      border: [s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor, s.borderTopWidth, s.borderBottomWidth].join(" "),
      background: `${s.backgroundColor} ${s.backgroundImage}`,
      "text colour": s.color,
      underline: `${s.textDecorationLine} ${s.textDecorationColor}`,
      "pseudo-element": pseudo,
    }
  }

  const visible = (el: Element) =>
    el.getClientRects().length > 0 &&
    (typeof el.checkVisibility !== "function" || el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true }))

  const helpers: PageHelpers = {
    stops: [],

    start(css) {
      try {
        const sheet = new CSSStyleSheet()
        sheet.replaceSync(css)
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
      } catch {
        // Very old engines; Chrome supports constructed sheets, which also get past a strict CSP.
      }
      window.scrollTo(0, 0)
      // Tab from wherever the page left focus, as a visitor would. Only when a script has already
      // focused something (autofocus) move the starting point back to the top of the document, so
      // the run covers the whole order. Without that, the first Tab follows the browser's own
      // order, positive tabindex first.
      const active = deepActive()
      if (!active || active === document.body || active === document.documentElement) return
      ;(active as HTMLElement).blur?.()
      const anchor = document.createElement("span")
      anchor.tabIndex = -1
      anchor.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:hidden"
      document.body.prepend(anchor)
      anchor.focus({ preventScroll: true })
      anchor.remove()
    },

    inspect() {
      const el = deepActive()
      if (!el || el === document.body || el === document.documentElement) return { kind: "none" }
      let id = helpers.stops.indexOf(el)
      if (id >= 0) return { kind: "element", id, isNew: false, details: null }
      helpers.stops.push(el)
      id = helpers.stops.length - 1

      const tag = el.tagName.toLowerCase()
      const rect = el.getBoundingClientRect()
      const tabindexAttr = el.getAttribute("tabindex")
      const parsed = tabindexAttr === null ? NaN : parseInt(tabindexAttr, 10)
      let hidden: HiddenReason | null = null
      let visibleBox: Box | null = null
      if (!el.getClientRects().length) hidden = "not-rendered"
      else {
        const clipped = clippedBox(el)
        if (clipped.hiddenByClip || clipped.right - clipped.left < 2 || clipped.bottom - clipped.top < 2) hidden = "clipped"
        else {
          const left = Math.max(clipped.left, 0)
          const top = Math.max(clipped.top, 0)
          const right = Math.min(clipped.right, window.innerWidth)
          const bottom = Math.min(clipped.bottom, window.innerHeight)
          if (right - left < 1 || bottom - top < 1) hidden = "off-screen"
          else visibleBox = { x: left, y: top, width: right - left, height: bottom - top }
        }
        // A transparent control laid over a styled one (a custom checkbox, a CSS-only menu toggle)
        // keeps its box, so the pixel test can still find the indicator its sibling shows.
        if (!hidden && typeof el.checkVisibility === "function" && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) {
          hidden = "transparent"
        }
      }
      // A visually hidden checkbox or radio usually shows its focus on its label. Test the label's
      // area instead, and let the pixels decide whether anything visible changed.
      const proxy = hidden && hidden !== "transparent" ? visibleLabel(el) : null
      if (proxy) visibleBox = proxy.box
      const cover = visibleBox ? coverage(proxy?.label ?? el, visibleBox) : { covered: "none" as const, coveredBy: null }

      return {
        kind: "element",
        id,
        isNew: true,
        details: {
          tag,
          roleAttr: el.getAttribute("role") || "",
          tabindex: Number.isNaN(parsed) ? null : parsed,
          selector: selectorOf(el),
          name: nameOf(el),
          frame: FRAME_TAGS.has(tag),
          pinned: isPinned(el),
          inDialog: !!el.closest('dialog[open], [role="dialog"], [role="alertdialog"], [aria-modal="true"]'),
          rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          hidden,
          visibleBox,
          covered: cover.covered,
          coveredBy: cover.coveredBy,
          style: styleOf(el),
        },
      }
    },

    blur(id) {
      const el = helpers.stops[id] as HTMLElement | undefined
      if (!el?.isConnected) return null
      // Move focus to an invisible holder rather than calling blur(). Widgets that close on
      // focusout check where focus went; with blur() it goes nowhere, and some (search
      // suggestions, menus) stay open over later stops.
      let holder = document.getElementById(`${key}-holder`)
      if (!holder) {
        holder = document.createElement("span")
        holder.id = `${key}-holder`
        holder.tabIndex = -1
        holder.setAttribute("aria-hidden", "true")
        holder.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;outline:none"
        document.body.appendChild(holder)
      }
      holder.focus({ preventScroll: true })
      if (deepActive() !== holder) el.blur()
      return styleOf(el)
    },

    refocus(id) {
      const el = helpers.stops[id] as HTMLElement | undefined
      if (!el?.isConnected) return { ok: false, focusVisible: false }
      el.focus({ preventScroll: true })
      const ok = deepActive() === el
      if (!ok) {
        // The element stopped being focusable once focus left it (a menu that closed). Put the
        // Tab starting point back where it is, so the next Tab carries on from there.
        const marker = document.createElement("span")
        marker.tabIndex = -1
        marker.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden"
        el.after(marker)
        marker.focus({ preventScroll: true })
        marker.remove()
      }
      return { ok, focusVisible: ok && el.matches(":focus-visible") }
    },

    finish() {
      const active = deepActive()
      if (active && active !== document.body) (active as HTMLElement).blur?.()
      window.scrollTo(0, 0)
    },

    markers() {
      return helpers.stops.map((el) => {
        if (!el.isConnected || !el.getClientRects().length) return null
        const rect = el.getBoundingClientRect()
        if (rect.width < 1 && rect.height < 1) return null
        return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, width: rect.width, height: rect.height }
      })
    },

    positiveTabindex() {
      const found = Array.from(document.querySelectorAll("[tabindex]")).filter((el) => parseInt(el.getAttribute("tabindex") || "", 10) > 0)
      return { count: found.length, selectors: found.slice(0, 10).map(selectorOf) }
    },

    unvisitedFocusable() {
      const visited = new Set(helpers.stops)
      return Array.from(document.querySelectorAll(FOCUSABLE)).filter((el) => {
        if (visited.has(el) || (el as HTMLElement).tabIndex < 0) return false
        if ((el as HTMLButtonElement).disabled || el.closest("[inert]")) return false
        if (helpers.stops.some((stop) => stop.contains(el))) return false
        return visible(el)
      }).length
    },

    allInDialog(ids) {
      return ids.every((id) => !!helpers.stops[id]?.closest('dialog[open], [role="dialog"], [role="alertdialog"], [aria-modal="true"]'))
    },

    dismissConsent(ids) {
      const first = ids.map((id) => helpers.stops[id]).find((el) => el?.isConnected)
      const dialog = first?.closest('dialog[open], [role="dialog"], [role="alertdialog"], [aria-modal="true"]')
      if (!dialog || !/cookie|consent|privacy|tracking|personal data/i.test(squash(dialog.textContent))) return null
      const buttons = Array.from(dialog.querySelectorAll('button, a[href], [role="button"], input[type="button"], input[type="submit"]')).filter(visible)
      const pick = (pattern: RegExp) => buttons.find((button) => pattern.test(nameOf(button)))
      const choice =
        pick(/reject|decline|refuse|deny|disagree|necessary|essential only|only essential|without accepting|do not accept/i) ??
        pick(/^(close|dismiss|x|×)$|\bclose\b/i) ??
        pick(/accept|agree|allow|got it|^ok(ay)?$|continue/i)
      if (!choice) return null
      ;(choice as HTMLElement).click()
      return nameOf(choice) || "its main button"
    },

    measureTargets(minSize) {
      const elements = Array.from(document.querySelectorAll(TARGETS)).filter((el) => {
        const tabindex = el.getAttribute("tabindex")
        if (tabindex !== null && !(parseInt(tabindex, 10) >= 0) && !el.matches(NATIVE_TARGETS)) return false
        if ((el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true" || el.closest("[inert]")) return false
        if (!visible(el)) return false
        if (getComputedStyle(el).pointerEvents === "none") return false
        const clipped = clippedBox(el)
        if (clipped.hiddenByClip || clipped.right - clipped.left < 2 || clipped.bottom - clipped.top < 2) return false
        const rect = el.getBoundingClientRect()
        return rect.right + window.scrollX > 0 && rect.bottom + window.scrollY > 0
      })
      const indexOf = new Map(elements.map((el, i) => [el, i]))
      // The inline exception: the target sits in a sentence, so its height is set by the line of
      // text. Words that are not part of any target must share a line with it. Text elsewhere in
      // the same block (a price or description under a product link) does not count.
      const inSentence = (el: Element): boolean => {
        let block = el.parentElement
        while (block && getComputedStyle(block).display === "inline") block = block.parentElement
        if (!block) return false
        const lines = Array.from(el.getClientRects())
        if (!lines.length) return false
        const sameLine = (rect: DOMRect) =>
          lines.some((line) => {
            const overlap = Math.min(rect.bottom, line.bottom) - Math.max(rect.top, line.top)
            const gap = Math.max(rect.left - line.right, line.left - rect.right, 0)
            return overlap > Math.min(rect.height, line.height) / 2 && gap < 2 * line.height
          })
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
        const range = document.createRange()
        let seen = 0
        for (let node = walker.nextNode(); node && seen < 300; node = walker.nextNode()) {
          seen += 1
          const parent = node.parentElement
          if (!parent || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(parent.tagName)) continue
          if (!/\p{L}{2,}/u.test(node.textContent || "")) continue
          const owner = parent.closest(TARGETS)
          if (owner && block.contains(owner)) continue
          range.selectNodeContents(node)
          if (Array.from(range.getClientRects()).some(sameLine)) return true
        }
        return false
      }

      // Native controls left at the browser's default size are exempt. Compare against the same
      // control in an empty frame, which has no author styles at all.
      let cleanDoc: Document | null = null
      let frame: HTMLIFrameElement | null = null
      const defaultSize = (el: Element): { width: number; height: number } | null => {
        if (!cleanDoc) {
          frame = document.createElement("iframe")
          frame.setAttribute("aria-hidden", "true")
          frame.tabIndex = -1
          frame.style.cssText = "position:absolute;left:-10000px;top:0;width:800px;height:300px;border:0;visibility:hidden"
          document.body.appendChild(frame)
          cleanDoc = frame.contentDocument
          if (!cleanDoc) return null
          try {
            cleanDoc.open()
            cleanDoc.write("<!doctype html><html><head></head><body></body></html>")
            cleanDoc.close()
          } catch {
            // Trusted Types can refuse document.write; the quirks-mode blank document still works.
          }
        }
        const copy = cleanDoc.createElement(el.tagName.toLowerCase())
        if (el instanceof HTMLInputElement) {
          ;(copy as HTMLInputElement).type = el.type
          if (el.hasAttribute("value")) (copy as HTMLInputElement).value = el.value
          if (el.hasAttribute("size")) copy.setAttribute("size", el.getAttribute("size") || "")
        } else if (el instanceof HTMLSelectElement) {
          for (const option of Array.from(el.options).slice(0, 50)) {
            const item = cleanDoc.createElement("option")
            item.textContent = option.textContent
            copy.appendChild(item)
          }
          ;(copy as HTMLSelectElement).selectedIndex = el.selectedIndex
        } else {
          copy.textContent = el.textContent
        }
        cleanDoc.body.appendChild(copy)
        const rect = copy.getBoundingClientRect()
        copy.remove()
        return { width: rect.width, height: rect.height }
      }

      const pinnedCache = new Map<Element, boolean>()
      const pinnedLayer = (el: Element | null): boolean => {
        if (!el || el === document.documentElement) return false
        const known = pinnedCache.get(el)
        if (known !== undefined) return known
        const position = getComputedStyle(el).position
        const pinned = position === "fixed" || position === "sticky" || pinnedLayer(parentOf(el))
        pinnedCache.set(el, pinned)
        return pinned
      }

      const nativeControl = (el: Element) =>
        el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLButtonElement || el instanceof HTMLTextAreaElement

      const results = elements.map((el): MeasuredTarget => {
        const style = getComputedStyle(el)
        const own = el.getBoundingClientRect()
        let left = own.left
        let top = own.top
        let right = own.right
        let bottom = own.bottom
        // An inline link's box is its line of text; an image inside it is clickable too.
        if (style.display === "inline") {
          for (const child of Array.from(el.querySelectorAll("*")).slice(0, 30)) {
            const position = getComputedStyle(child).position
            if (position === "absolute" || position === "fixed") continue
            const rect = child.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) continue
            left = Math.min(left, rect.left)
            top = Math.min(top, rect.top)
            right = Math.max(right, rect.right)
            bottom = Math.max(bottom, rect.bottom)
          }
        }
        const box = { x: left + window.scrollX, y: top + window.scrollY, width: right - left, height: bottom - top }
        const ancestors: number[] = []
        for (let node = parentOf(el); node; node = parentOf(node)) {
          const index = indexOf.get(node)
          if (index !== undefined) ancestors.push(index)
        }
        const small = box.width < minSize || box.height < minSize
        let exempt: MeasuredTarget["exempt"] = null
        if (small) {
          if (style.display === "inline" && inSentence(el)) exempt = "inline"
          else if (nativeControl(el) && style.appearance !== "none") {
            const size = defaultSize(el)
            if (size && Math.abs(size.width - own.width) <= 1 && Math.abs(size.height - own.height) <= 1) exempt = "user-agent"
          }
        }
        return {
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute("role") || "",
          name: nameOf(el),
          selector: small ? selectorOf(el) : "",
          box,
          exempt,
          ancestors,
          pinned: pinnedLayer(el),
        }
      })
      ;(frame as HTMLIFrameElement | null)?.remove()
      return results
    },
  }

  Object.defineProperty(window, key, { value: helpers, configurable: true })
}
