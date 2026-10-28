// XML helpers shared by the Word and PowerPoint checks.
//
// Office files are zip packages of XML parts. Every element and most
// attributes are namespaced, and the prefixes (w:, a:, p:) are only a
// convention: a file can bind any prefix it likes. So nothing here matches
// on a qualified name. Elements are found by local name and then filtered by
// namespace URI, with both the Transitional and the Strict URI accepted.
//
// The parser is injected (a function from string to Document) so the same
// code runs on the browser's DOMParser and on jsdom in tests.

export type ParseXml = (xml: string) => Document

export const NS = {
  w: ["http://schemas.openxmlformats.org/wordprocessingml/2006/main", "http://purl.oclc.org/ooxml/wordprocessingml/main"],
  a: ["http://schemas.openxmlformats.org/drawingml/2006/main", "http://purl.oclc.org/ooxml/drawingml/main"],
  p: ["http://schemas.openxmlformats.org/presentationml/2006/main", "http://purl.oclc.org/ooxml/presentationml/main"],
  r: ["http://schemas.openxmlformats.org/officeDocument/2006/relationships", "http://purl.oclc.org/ooxml/officeDocument/relationships"],
  wp: ["http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing", "http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing"],
  pic: ["http://schemas.openxmlformats.org/drawingml/2006/picture", "http://purl.oclc.org/ooxml/drawingml/picture"],
  wps: ["http://schemas.microsoft.com/office/word/2010/wordprocessingShape"],
  wpg: ["http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"],
  wpc: ["http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"],
  mc: ["http://schemas.openxmlformats.org/markup-compatibility/2006"],
  v: ["urn:schemas-microsoft-com:vml"],
  adec: ["http://schemas.microsoft.com/office/drawing/2017/decorative"],
  p14: ["http://schemas.microsoft.com/office/powerpoint/2010/main"],
  dc: ["http://purl.org/dc/elements/1.1/"],
  ep: ["http://schemas.openxmlformats.org/officeDocument/2006/extended-properties", "http://purl.oclc.org/ooxml/officeDocument/extendedProperties"],
  rel: ["http://schemas.openxmlformats.org/package/2006/relationships"],
} as const

export type NsKey = keyof typeof NS

/** Graphic types, identified by the uri on a:graphicData. */
export const GRAPHIC_URI = {
  picture: "drawingml/2006/picture",
  chart: "drawingml/2006/chart",
  chartex: "drawing/2014/chartex",
  diagram: "drawingml/2006/diagram",
  table: "drawingml/2006/table",
  wordShape: "word/2010/wordprocessingShape",
  wordGroup: "word/2010/wordprocessingGroup",
  wordCanvas: "word/2010/wordprocessingCanvas",
  ole: "presentationml/2006/ole",
} as const

export function inNs(el: Element, ns: NsKey): boolean {
  return (NS[ns] as readonly string[]).includes(el.namespaceURI ?? "")
}

export function isEl(node: Node | null | undefined, ns: NsKey, local: string): boolean {
  return !!node && node.nodeType === 1 && (node as Element).localName === local && inNs(node as Element, ns)
}

/** Every descendant element with this local name in this namespace, in document order. */
export function descendants(root: Element | Document, ns: NsKey, local: string): Element[] {
  // A plain walk rather than getElementsByTagNameNS: the live collection it
  // returns is slow to index in some DOM implementations (jsdom scans for a
  // named item on every access), and this is linear everywhere.
  const uris = NS[ns] as readonly string[]
  const out: Element[] = []
  let node: Node | null = root.firstChild
  while (node) {
    if (node.nodeType === 1) {
      const el = node as Element
      if (el.localName === local && uris.includes(el.namespaceURI ?? "")) out.push(el)
      if (el.firstChild) {
        node = el.firstChild
        continue
      }
    }
    while (node && node !== root && !node.nextSibling) node = node.parentNode
    if (!node || node === root) break
    node = node.nextSibling
  }
  return out
}

/** Direct child elements, optionally only those with this local name in this namespace. */
export function children(el: Element | null | undefined, ns?: NsKey, local?: string): Element[] {
  const out: Element[] = []
  if (!el) return out
  for (let n = el.firstChild; n; n = n.nextSibling) {
    if (n.nodeType !== 1) continue
    if (ns && local && !isEl(n, ns, local)) continue
    out.push(n as Element)
  }
  return out
}

export function child(el: Element | null | undefined, ns: NsKey, local: string): Element | null {
  if (!el) return null
  for (let n = el.firstChild; n; n = n.nextSibling) {
    if (isEl(n, ns, local)) return n as Element
  }
  return null
}

/** Follow a chain of direct children: path(el, ["w", "pPr"], ["w", "pStyle"]). */
export function path(el: Element | null | undefined, ...steps: [NsKey, string][]): Element | null {
  let cur: Element | null = el ?? null
  for (const [ns, local] of steps) {
    cur = child(cur, ns, local)
    if (!cur) return null
  }
  return cur
}

/**
 * An attribute value. Pass a namespace for qualified attributes (w:val, r:id)
 * and null for the plain ones DrawingML uses (descr, name, type).
 */
export function attr(el: Element | null | undefined, ns: NsKey | null, local: string): string | null {
  if (!el) return null
  if (ns === null) return el.getAttribute(local)
  for (const uri of NS[ns]) {
    const v = el.getAttributeNS(uri, local)
    if (v !== null && v !== "") return v
    if (v === "" && el.hasAttributeNS(uri, local)) return ""
  }
  return null
}

/** Nearest ancestor with this local name in this namespace. */
export function ancestor(el: Element, ns: NsKey, local: string): Element | null {
  for (let n = el.parentNode; n && n.nodeType === 1; n = n.parentNode) {
    if (isEl(n, ns, local)) return n as Element
  }
  return null
}

/** OOXML on/off values: absent val means on. */
export function isOn(el: Element | null, ns: NsKey | null = "w", local = "val"): boolean {
  if (!el) return false
  const v = attr(el, ns, local)
  if (v === null) return true
  return !["0", "false", "off", "none"].includes(v.toLowerCase())
}

/** Concatenated a:t text under a DrawingML element (PowerPoint shapes, table cells). */
export function drawingText(el: Element): string {
  return descendants(el, "a", "t")
    .map((t) => t.textContent ?? "")
    .join("")
}

/**
 * Replace each mc:AlternateContent with the content of its first mc:Choice.
 *
 * Choice and Fallback describe the same object twice (a DrawingML picture and
 * its VML fallback, a video and its poster image, an equation and a picture
 * of it). Reading both would count every image twice, so the package is
 * flattened to the Choice an up-to-date Office would render before any check
 * runs. Nested blocks are handled because the array is in document order and
 * blocks inside a discarded Fallback are no longer connected.
 */
export function flattenAlternateContent(doc: Document): void {
  for (const ac of descendants(doc, "mc", "AlternateContent")) {
    if (!ac.isConnected || !ac.parentNode) continue
    const keep = child(ac, "mc", "Choice") ?? child(ac, "mc", "Fallback")
    const parent = ac.parentNode
    if (keep) {
      while (keep.firstChild) parent.insertBefore(keep.firstChild, ac)
    }
    parent.removeChild(ac)
  }
}

/** The decorative flag Office 365 writes into a:extLst on docPr and cNvPr. */
export function isMarkedDecorative(props: Element | null): boolean {
  if (!props) return false
  for (const el of descendants(props, "adec", "decorative")) {
    if (isOn(el, null)) return true
  }
  return false
}

/** Alt text from a wp:docPr or cNvPr: the description, or the older title field. */
export function altTextOf(props: Element | null): string {
  if (!props) return ""
  const descr = (props.getAttribute("descr") ?? "").trim()
  if (descr) return descr
  return (props.getAttribute("title") ?? "").trim()
}

export interface Relationship {
  id: string
  type: string
  target: string
  external: boolean
}

export function parseRelationships(doc: Document | null): Map<string, Relationship> {
  const out = new Map<string, Relationship>()
  if (!doc) return out
  for (const el of descendants(doc, "rel", "Relationship")) {
    const id = el.getAttribute("Id")
    if (!id) continue
    out.set(id, {
      id,
      type: el.getAttribute("Type") ?? "",
      target: el.getAttribute("Target") ?? "",
      external: (el.getAttribute("TargetMode") ?? "").toLowerCase() === "external",
    })
  }
  return out
}

/** The rels part that belongs to a part: word/document.xml -> word/_rels/document.xml.rels. */
export function relsPathFor(partName: string): string {
  const slash = partName.lastIndexOf("/")
  const dir = slash >= 0 ? partName.slice(0, slash + 1) : ""
  return `${dir}_rels/${partName.slice(slash + 1)}.rels`
}

/** Resolve a relationship target against the part that holds it. */
export function resolvePartName(fromPart: string, target: string): string {
  if (target.startsWith("/")) return target.slice(1)
  const base = fromPart.split("/").slice(0, -1)
  for (const seg of target.split("/")) {
    if (seg === "" || seg === ".") continue
    if (seg === "..") base.pop()
    else base.push(seg)
  }
  return base.join("/")
}

/** Short, single-line excerpt for a finding's location. */
export function excerpt(text: string, max = 60): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 3).trimEnd()}...`
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`
}
