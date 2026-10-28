import type { CollectedImage, CollectionResult, ImageControl, ImageKind } from "./types"

// The functions in this file run inside the rendered page through page.evaluate, so each one must
// be self-contained: no imports at runtime, no references to anything outside its own body. Types
// are fine, they disappear at compile time.
//
// collectImages finds every img (picture included), input type=image, area with an href, element
// with role=img and inline svg, skips what assistive technology never meets (display none,
// visibility hidden, aria-hidden, tracking pixels), and records what the rules and the AI review
// need: the alt and other name sources, size, position, the link or button around it and that
// control's other text, the figure caption, the nearest heading and some nearby text. Each audited
// element gets a data attribute so it can be found again for a screenshot.

export function collectImages(options: { max: number; attribute: string }): CollectionResult {
  const { max, attribute } = options

  const clean = (value: string | null | undefined, limit = 300): string | null => {
    if (value == null) return null
    const text = value.replace(/\s+/g, " ").trim()
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text
  }

  // Parent that steps out of shadow roots, so a link around a web component still counts.
  const parentOf = (node: Element): Element | null => {
    if (node.parentElement) return node.parentElement
    const root = node.getRootNode()
    return root instanceof ShadowRoot ? root.host : null
  }

  const closestAcross = (start: Element, selector: string): Element | null => {
    for (let node = parentOf(start); node; node = parentOf(node)) {
      if (node.matches(selector)) return node
    }
    return null
  }

  const hiddenFromAT = (element: Element): boolean => {
    for (let node: Element | null = element; node; node = parentOf(node)) {
      if (node.getAttribute("aria-hidden") === "true" || node.hasAttribute("inert")) return true
    }
    return false
  }

  const byId = (element: Element, id: string): Element | null => {
    const root = element.getRootNode() as Document | ShadowRoot
    return (typeof root.getElementById === "function" ? root.getElementById(id) : null) ?? document.getElementById(id)
  }

  const labelledBy = (element: Element): string | null => {
    const ids = (element.getAttribute("aria-labelledby") || "").split(/\s+/).filter(Boolean)
    if (!ids.length) return null
    const text = ids.map((id) => byId(element, id)?.textContent || "").join(" ")
    return clean(text)
  }

  // A small part of the accessible name computation: what the control's other content contributes,
  // leaving out the image being checked and anything hidden.
  const otherContent = (control: Element, skip: Element): string => {
    const parts: string[] = []
    let budget = 400
    const walk = (node: Node) => {
      if (budget <= 0 || node === skip) return
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ""
        if (text.trim()) {
          parts.push(text)
          budget -= text.length
        }
        return
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return
      const element = node as Element
      const tag = element.tagName.toLowerCase()
      if (["script", "style", "noscript", "template"].includes(tag)) return
      if (element.getAttribute("aria-hidden") === "true") return
      if (element !== control) {
        const style = getComputedStyle(element)
        if (style.display === "none" || style.visibility === "hidden") return
        const label = element.getAttribute("aria-label")
        if (label && label.trim()) {
          parts.push(label)
          return
        }
        if (tag === "img" || (tag === "input" && (element as HTMLInputElement).type === "image")) {
          const alt = element.getAttribute("alt") || element.getAttribute("title")
          if (alt) parts.push(alt)
          return
        }
        if (tag === "svg") {
          const title = element.querySelector("title")?.textContent
          if (title && title.trim()) parts.push(title)
          return
        }
      }
      if (tag === "slot") {
        const assigned = (element as HTMLSlotElement).assignedNodes({ flatten: true })
        if (assigned.length) {
          assigned.forEach(walk)
          return
        }
      }
      const shadow = (element as HTMLElement).shadowRoot
      const children = shadow ? shadow.childNodes : element.childNodes
      children.forEach(walk)
    }
    walk(control)
    return clean(parts.join(" "), 300) || ""
  }

  const describeControl = (element: Element): { node: Element; info: ImageControl } | null => {
    const node = closestAcross(element, 'a[href], button, [role="button"], [role="link"], [role="menuitem"], [role="tab"], summary')
    if (!node) return null
    const isLink = node.matches('a[href], [role="link"]')
    return {
      node,
      info: {
        kind: isLink ? "link" : "button",
        self: false,
        href: node instanceof HTMLAnchorElement ? node.href : null,
        label: labelledBy(node) || clean(node.getAttribute("aria-label")) || "",
        text: otherContent(node, element),
        title: clean(node.getAttribute("title")) || "",
      },
    }
  }

  const fileNameOf = (url: string | null): string | null => {
    if (!url) return null
    try {
      const last = new URL(url).pathname.split("/").filter(Boolean).pop()
      return last ? clean(decodeURIComponent(last), 120) : null
    } catch {
      return null
    }
  }

  const httpUrl = (value: string | null | undefined): string | null => {
    if (!value) return null
    try {
      const url = new URL(value, document.baseURI)
      return url.protocol === "http:" || url.protocol === "https:" ? url.toString().slice(0, 600) : null
    } catch {
      return null
    }
  }

  // Every root to search: the document and any open shadow roots.
  const roots: (Document | ShadowRoot)[] = [document]
  const everything = document.querySelectorAll("*")
  for (let i = 0; i < everything.length && i < 30000; i++) {
    const shadow = (everything[i] as HTMLElement).shadowRoot
    if (shadow) roots.push(shadow)
  }

  const seen = new Set<Element>()
  const candidates: { element: Element; kind: ImageKind }[] = []
  for (const root of roots) {
    root.querySelectorAll('img, input[type="image" i], area[href], [role="img"], svg').forEach((element) => {
      if (seen.has(element)) return
      seen.add(element)
      const tag = element.tagName.toLowerCase()
      let kind: ImageKind
      // Images inside role=img are presentational children of it, so only the outer one counts.
      if (tag !== "svg" && element.parentElement?.closest("[role='img']")) return
      if (tag === "img") kind = "img"
      else if (tag === "input") kind = "input-image"
      else if (tag === "area") kind = "area"
      else if (tag === "svg") {
        // Nested svg, or an svg inside an element that is itself the image, is part of that image.
        if (element.parentElement?.closest("svg, [role='img']")) return
        kind = "svg"
      } else {
        if (element.closest("svg")) return
        kind = "role-img"
      }
      candidates.push({ element, kind })
    })
  }

  let hidden = 0
  let tracking = 0
  type Pending = { element: Element; data: Omit<CollectedImage, "id" | "heading"> }
  const kept: Pending[] = []

  for (const { element, kind } of candidates) {
    // An area has no box of its own; its position is that of the image using the map.
    let boxElement: Element = element
    if (kind === "area") {
      const mapName = element.closest("map")?.getAttribute("name")
      const mapImage = mapName ? document.querySelector(`img[usemap="#${CSS.escape(mapName)}"]`) : null
      if (!mapImage) {
        hidden++
        continue
      }
      boxElement = mapImage
    }

    if (!boxElement.getClientRects().length) {
      hidden++
      continue
    }
    const style = getComputedStyle(boxElement)
    if (style.visibility === "hidden" || style.visibility === "collapse") {
      hidden++
      continue
    }
    const rect = boxElement.getBoundingClientRect()
    const isImg = kind === "img"
    const img = isImg ? (element as HTMLImageElement) : null
    if (rect.width <= 1 || rect.height <= 1 || (img && img.naturalWidth === 1 && img.naturalHeight === 1 && rect.width <= 2 && rect.height <= 2)) {
      if (isImg || kind === "input-image") tracking++
      else hidden++
      continue
    }

    const self = kind === "input-image" || kind === "area"
    const described = self ? null : describeControl(element)
    let control: ImageControl | null = described?.info ?? null
    if (self) {
      control = {
        kind: kind === "area" ? "link" : "button",
        self: true,
        href: kind === "area" ? (element as HTMLAreaElement).href : null,
        label: "",
        text: "",
        title: "",
      }
    }

    // Hidden from assistive technology means it needs no alt, unless hiding it left its link or
    // button with nothing to announce. Those are kept so the rules can report the empty control.
    const ariaHidden = hiddenFromAT(element)
    if (ariaHidden) {
      const controlHidden = described ? hiddenFromAT(described.node) : true
      const controlNamed = control ? Boolean(control.label || control.text || control.title) : true
      if (!described || controlHidden || controlNamed) {
        hidden++
        continue
      }
    }

    // currentSrc can be a lazy-loading placeholder (a data: URI); the real file is often in data-src.
    const src = img
      ? httpUrl(img.currentSrc) || httpUrl(img.getAttribute("data-src")) || httpUrl(img.getAttribute("data-lazy-src")) || httpUrl(img.getAttribute("src"))
      : kind === "input-image"
        ? httpUrl((element as HTMLInputElement).src)
        : null

    const figure = closestAcross(element, "figure")
    const caption = figure ? clean(Array.from(figure.children).find((child) => child.tagName.toLowerCase() === "figcaption")?.textContent) : null

    // Nearby text: the closest ancestor (above the control, if any) with a useful amount of text.
    let nearbyText: string | null = null
    let ancestor: Element | null = described?.node ?? element
    for (let depth = 0; depth < 6 && ancestor; depth++) {
      ancestor = parentOf(ancestor)
      if (!ancestor || ["body", "html", "main"].includes(ancestor.tagName.toLowerCase())) break
      const text = clean((ancestor as HTMLElement).innerText, 2000)
      if (text && text.length >= 30) {
        nearbyText = clean(text, 240)
        break
      }
    }

    const svgTitle =
      kind === "svg" ? clean(Array.from(element.children).find((child) => child.tagName.toLowerCase() === "title")?.textContent) : null

    kept.push({
      element,
      data: {
        kind,
        tag: element.tagName.toLowerCase(),
        alt: kind === "img" || kind === "input-image" || kind === "area" ? element.getAttribute("alt") : null,
        ariaLabel: clean(element.getAttribute("aria-label")),
        labelledbyText: labelledBy(element),
        title: clean(element.getAttribute("title")),
        role: element.getAttribute("role"),
        ariaHidden,
        svgTitle,
        src,
        fileName: fileNameOf(src),
        inPicture: Boolean(element.parentElement && element.parentElement.tagName.toLowerCase() === "picture"),
        naturalWidth: img ? img.naturalWidth : Math.round(rect.width),
        naturalHeight: img ? img.naturalHeight : Math.round(rect.height),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        x: Math.round(rect.left + window.scrollX),
        y: Math.round(rect.top + window.scrollY),
        // A data: URI is a lazy-loading placeholder, not the picture, unless it is all there is.
        loaded: img ? img.complete && img.naturalWidth > 0 && !(img.currentSrc.startsWith("data:") && src) : true,
        control,
        caption: caption || null,
        nearbyText,
      },
    })
  }

  // Visual order, top to bottom then left to right, so image 1 is the first a visitor sees.
  kept.sort((a, b) => a.data.y - b.data.y || a.data.x - b.data.x)
  const totalFound = kept.length
  const chosen = kept.slice(0, max)

  // Nearest heading before each image, by document order (light DOM; shadow content uses its host).
  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']"))
  const anchorOf = (element: Element): Element => {
    let node: Element = element
    while (node.getRootNode() instanceof ShadowRoot) node = (node.getRootNode() as ShadowRoot).host
    return node
  }
  const headingBefore = (element: Element): string | null => {
    const anchor = anchorOf(element)
    let low = 0
    let high = headings.length - 1
    let found = -1
    while (low <= high) {
      const middle = (low + high) >> 1
      const position = headings[middle].compareDocumentPosition(anchor)
      if (headings[middle] === anchor || position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        found = middle
        low = middle + 1
      } else {
        high = middle - 1
      }
    }
    return found >= 0 ? clean(headings[found].textContent, 120) : null
  }

  document.querySelectorAll(`[${attribute}]`).forEach((element) => element.removeAttribute(attribute))
  const images: CollectedImage[] = chosen.map((entry, index) => {
    entry.element.setAttribute(attribute, String(index + 1))
    return { id: index + 1, ...entry.data, heading: headingBefore(entry.element) }
  })

  // CSS background images have no alt text at all; count the visible ones so the report can say so.
  let backgroundImages = 0
  for (let i = 0; i < everything.length && i < 20000; i++) {
    const element = everything[i]
    const background = getComputedStyle(element).backgroundImage
    if (!background || !background.includes("url(")) continue
    const rect = element.getBoundingClientRect()
    if (rect.width >= 32 && rect.height >= 32) backgroundImages++
  }

  return {
    images,
    totalFound,
    truncated: totalFound > chosen.length,
    skipped: { hidden, tracking },
    backgroundImages,
    lang: clean(document.documentElement.getAttribute("lang"), 20) || "",
  }
}

/**
 * Scrolls one marked image into the middle of the viewport and returns the part of it that is
 * really visible, in document coordinates for a screenshot clip. Returns a reason instead when a
 * screenshot would show something else: a carousel slide that is clipped away or faded out.
 *
 * Everything except the image is then hidden with visibility, which keeps the layout as it is but
 * leaves the image alone on a grey background: cookie banners, sticky headers, popups and headline
 * text laid over the image do not end up in the screenshot, where the model would read them as
 * part of the image. Grey keeps both white and black transparent icons visible. SVG resources
 * (symbol, defs, clipPath, mask) stay visible so sprite icons drawn with use still render.
 */
export async function locateForCapture(options: {
  attribute: string
  id: number
}): Promise<{ x: number; y: number; width: number; height: number } | { skip: string }> {
  const { attribute, id } = options
  const selector = `[${attribute}="${id}"]`
  let element: Element | null = document.querySelector(selector)
  if (!element) {
    for (const host of Array.from(document.querySelectorAll("*"))) {
      const found = (host as HTMLElement).shadowRoot?.querySelector(selector)
      if (found) {
        element = found
        break
      }
    }
  }
  if (!element) return { skip: "not found" }

  // An open consent dialog often locks scrolling (body fixed, overflow hidden), which would leave
  // every image below the first screen out of reach. Unlock it once.
  if (!document.getElementById("alt-check-unlock")) {
    const body = getComputedStyle(document.body)
    const html = getComputedStyle(document.documentElement)
    const rules: string[] = []
    if (body.position === "fixed") rules.push("body { position: static !important; top: auto !important; }")
    if (body.overflowY === "hidden" || html.overflowY === "hidden") rules.push("html, body { overflow: visible !important; }")
    const unlock = document.createElement("style")
    unlock.id = "alt-check-unlock"
    unlock.textContent = rules.join(" ")
    document.head.appendChild(unlock)
  }

  element.scrollIntoView({ block: "center", inline: "center" })
  await new Promise((resolve) => setTimeout(resolve, 150))

  // Scrolling to it can start a lazy load that the first pass never reached; give it a moment.
  if (element instanceof HTMLImageElement) {
    const image = element
    const ready = () => image.complete && image.naturalWidth > 0 && !image.currentSrc.startsWith("data:")
    for (let waited = 0; !ready() && waited < 1500; waited += 100) await new Promise((resolve) => setTimeout(resolve, 100))
    if (!ready()) return { skip: "not loaded" }
    // Loaded is not yet painted: decode it and let two frames pass before the screenshot.
    await Promise.race([image.decode().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 1000))])
    await new Promise((resolve) => {
      setTimeout(resolve, 300)
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    })
  }

  const rect = element.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return { skip: "too small" }

  let opacity = 1
  for (let node: Element | null = element; node; node = node.parentElement) {
    opacity *= Number(getComputedStyle(node).opacity || 1)
  }
  if (opacity < 0.4) return { skip: "transparent" }

  const viewport = { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }
  const intersect = (a: typeof viewport, b: typeof viewport) => ({
    left: Math.max(a.left, b.left),
    top: Math.max(a.top, b.top),
    right: Math.min(a.right, b.right),
    bottom: Math.min(a.bottom, b.bottom),
  })
  const area = (box: typeof viewport) => Math.max(0, box.right - box.left) * Math.max(0, box.bottom - box.top)

  const onScreen = intersect({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }, viewport)
  if (area(onScreen) <= 0) return { skip: "off screen" }
  let visible = onScreen
  for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node)
    if (style.overflowX === "visible" && style.overflowY === "visible") continue
    const box = node.getBoundingClientRect()
    visible = intersect(visible, { left: box.left, top: box.top, right: box.right, bottom: box.bottom })
  }
  if (area(visible) < area(onScreen) * 0.5) return { skip: "clipped" }

  let isolate = document.getElementById("alt-check-isolate")
  if (!isolate) {
    isolate = document.createElement("style")
    isolate.id = "alt-check-isolate"
    document.head.appendChild(isolate)
  }
  // Shadow roots do not see document styles, so an image inside one is shown together with its host.
  const shown = [selector]
  for (let root = element.getRootNode(); root instanceof ShadowRoot; root = root.host.getRootNode()) {
    root.host.setAttribute(`${attribute}-host`, String(id))
    shown.push(`[${attribute}-host="${id}"]`)
  }
  const resources = ["symbol", "defs", "clipPath", "mask", "pattern", "marker"]
  const visibleSelectors = [...shown, ...resources].map((part) => `${part}, ${part} *`).join(", ")
  isolate.textContent = `html { background: #808080 !important; } * { visibility: hidden !important; } ${visibleSelectors} { visibility: visible !important; }`

  const offsetX = window.visualViewport?.pageLeft ?? window.scrollX
  const offsetY = window.visualViewport?.pageTop ?? window.scrollY
  return {
    x: visible.left + offsetX,
    y: visible.top + offsetY,
    width: visible.right - visible.left,
    height: visible.bottom - visible.top,
  }
}
