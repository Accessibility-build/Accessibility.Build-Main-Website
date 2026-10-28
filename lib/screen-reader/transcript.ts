import type { LineKind, Transcript, TranscriptLine } from "./types"
import { summarise, type Collected } from "./summaries"

// Turns Chrome's computed accessibility tree (CDP Accessibility.getFullAXTree) into a browse-mode
// style transcript: the lines a screen reader user would move through with the down arrow.
//
// The tree is what screen readers start from, but they each phrase it their own way, so the wording
// here is deliberately plain ("heading level 2, Pricing", "link, Contact us", "button, Menu,
// collapsed") and does not imitate any one product.
//
// Rules that keep it readable:
// - Ignored nodes are walked through, because their children can still be exposed.
// - generic and none add nothing; text inside them merges into lines. With element display values
//   from a DOM snapshot, inline elements join the text around them and block elements break it.
// - StaticText is the text; InlineTextBox (its layout fragments) is skipped.
// - A link, button or field is announced once with its name, and the text inside it that produced
//   the name is not read again. A heading reads its links inline: "heading level 3, link, Benefits".
// - Label, legend and caption text next to the control or table it names is not repeated.
//
// Pure: takes the raw nodes, so it can be tested on saved trees without a browser.

/** The parts of a CDP AXNode this module reads. Protocol.Accessibility.AXNode is assignable to it. */
export interface AXValueLike {
  type: string
  value?: unknown
}

export interface AXNameSourceLike {
  type: string
  attribute?: string
  nativeSource?: string
  value?: AXValueLike
  superseded?: boolean
}

export interface AXNodeLike {
  nodeId: string
  ignored: boolean
  role?: AXValueLike
  name?: AXValueLike & { sources?: AXNameSourceLike[] }
  value?: AXValueLike
  properties?: { name: string; value: AXValueLike }[]
  parentId?: string
  childIds?: string[]
  backendDOMNodeId?: number
}

/** The parts of DOMSnapshot.captureSnapshot's response that `displayMapFromSnapshot` reads. */
export interface DomSnapshotLike {
  documents: { nodes: { backendNodeId?: number[] }; layout: { nodeIndex: number[]; styles: number[][] } }[]
  strings: string[]
}

export interface TranscriptOptions {
  /** CSS display per backend DOM node id, from `displayMapFromSnapshot`. Without it, a heuristic decides. */
  display?: Map<number, string>
  /** Line cap. The page is still walked to the end for the summaries. */
  maxLines?: number
}

export const MAX_LINES = 1500
const MAX_DEPTH = 1000
/** Longest text line before it is split at a sentence or word boundary. */
const MAX_LINE_CHARS = 300
const MAX_NAME_CHARS = 300

/** Display values per backend node id, from DOMSnapshot.captureSnapshot({ computedStyles: ["display"] }). */
export function displayMapFromSnapshot(snapshot: DomSnapshotLike): Map<number, string> {
  const display = new Map<number, string>()
  for (const doc of snapshot.documents) {
    const backendIds = doc.nodes.backendNodeId
    if (!backendIds) continue
    doc.layout.nodeIndex.forEach((nodeIndex, i) => {
      const stringIndex = doc.layout.styles[i]?.[0]
      const backendId = backendIds[nodeIndex]
      if (stringIndex !== undefined && stringIndex >= 0 && backendId !== undefined) display.set(backendId, snapshot.strings[stringIndex])
    })
  }
  return display
}

const LANDMARKS: Record<string, string> = {
  banner: "banner",
  navigation: "navigation",
  main: "main",
  contentinfo: "content info",
  complementary: "complementary",
  region: "region",
  search: "search",
  form: "form",
}

/** Form fields, and what they are announced as. */
const FIELDS: Record<string, string> = {
  textbox: "edit",
  searchbox: "search edit",
  combobox: "combo box",
  PopUpButton: "combo box",
  listbox: "list box",
  checkbox: "check box",
  radio: "radio button",
  switch: "switch",
  slider: "slider",
  spinbutton: "spin button",
  date: "date edit",
  DateTime: "date and time edit",
  InputTime: "time edit",
  ColorWell: "colour picker",
}

/** Controls announced on one line, whose contents are not read again. */
const ATOMIC: Record<string, string> = {
  menuitem: "menu item",
  menuitemcheckbox: "menu item check box",
  menuitemradio: "menu item radio button",
  tab: "tab",
  option: "option",
  MenuListOption: "option",
  treeitem: "tree item",
  progressbar: "progress bar",
  meter: "meter",
  scrollbar: "scroll bar",
  Video: "video",
  Audio: "audio",
  math: "math",
  PluginObject: "embedded object",
  EmbeddedObject: "embedded object",
}

/** Containers announced when the reader enters them, without an end line. */
const ENTERED: Record<string, string> = {
  radiogroup: "radio group",
  toolbar: "toolbar",
  menu: "menu",
  menubar: "menu bar",
  tablist: "tab list",
  tree: "tree view",
}

const BUTTON_ROLES = new Set(["button", "DisclosureTriangle"])
const IMAGE_ROLES = new Set(["image", "img"])
const TABLE_ROLES: Record<string, string> = { table: "table", grid: "grid", treegrid: "tree grid" }
const LIST_ROLES = new Set(["list", "directory", "DescriptionList"])
const CELL_ROLES = new Set(["cell", "gridcell", "columnheader", "rowheader"])
const DIALOG_ROLES: Record<string, string> = { dialog: "dialog", alertdialog: "alert dialog" }
/** Text that names something next to it: a label, a fieldset legend, a table caption. */
const NAMING_ROLES = new Set(["labeltext", "legend", "caption"])
/** Roles whose only effect on reading is where lines break, decided by the element's display. */
const TRANSPARENT_ROLES = new Set(["generic", "none", "presentation", "emphasis", "strong", "mark", "code", "time", "subscript", "superscript", "Abbr", "contentdeletion", "contentinsertion", "Ruby", "LabelText", "Legend"])
const INLINE_FALLBACK_ROLES = new Set(["emphasis", "strong", "mark", "code", "time", "subscript", "superscript", "Abbr", "contentdeletion", "contentinsertion", "Ruby", "LabelText"])

/** A transcript line plus what the builder needs while it works, stripped before it is returned. */
interface WorkingLine extends TranscriptLine {
  name?: string
  fromNamingText?: boolean
}

export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .replace(/[​﻿­]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function clip(text: string, max = MAX_NAME_CHARS): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

function roleOf(node: AXNodeLike): string {
  return String(node.role?.value ?? "")
}

function nameOf(node: AXNodeLike): string {
  return normalizeText(node.name?.value)
}

/** Where the accessible name came from: "contents", "attribute", "relatedElement" and so on. */
function nameSource(node: AXNodeLike): { type: string; attribute?: string } | null {
  const used = node.name?.sources?.find((source) => source.value !== undefined && !source.superseded && normalizeText(source.value.value))
  return used ? { type: used.type, attribute: used.attribute ?? used.nativeSource } : null
}

function prop(node: AXNodeLike, name: string): unknown {
  return node.properties?.find((p) => p.name === name)?.value.value
}

/** Text that is only punctuation or symbols, such as a decorative quote mark or a bar between links. */
function hasWords(text: string): boolean {
  return /[\p{L}\p{N}\p{Extended_Pictographic}]/u.test(text)
}

/** Splits a long run of text at sentence ends, then at spaces, so each line is a readable length. */
function splitText(text: string): string[] {
  if (text.length <= MAX_LINE_CHARS) return [text]
  const sentences = text.match(/[^.!?]+(?:[.!?]+["'”’)\]]*\s*|$)/g) ?? [text]
  const out: string[] = []
  let current = ""
  const push = (piece: string) => {
    if ((current + piece).length > MAX_LINE_CHARS && current) {
      out.push(current.trim())
      current = ""
    }
    current += piece
  }
  for (const sentence of sentences) {
    if (sentence.length <= MAX_LINE_CHARS) {
      push(sentence)
      continue
    }
    for (const word of sentence.split(/(?<=\s)/)) push(word)
  }
  if (current.trim()) out.push(current.trim())
  return out
}

function simplify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\(required\)|\*|:$/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/** The states a screen reader adds after the name, in a common order. */
export function statesOf(node: AXNodeLike, role: string): string[] {
  const states: string[] = []
  const checked = prop(node, "checked")
  if (checked !== undefined) {
    const value = String(checked)
    if (role === "switch") states.push(value === "true" ? "on" : "off")
    else states.push(value === "mixed" ? "partially checked" : value === "true" ? "checked" : "not checked")
  }
  const pressed = prop(node, "pressed")
  if (pressed !== undefined) states.push(String(pressed) === "mixed" ? "partially pressed" : String(pressed) === "true" ? "pressed" : "not pressed")
  const expanded = prop(node, "expanded")
  if (expanded !== undefined) states.push(expanded === true || expanded === "true" ? "expanded" : "collapsed")
  if (prop(node, "selected") === true) states.push("selected")
  const level = prop(node, "level")
  if (role === "treeitem" && typeof level === "number") states.push(`level ${level}`)
  const popup = String(prop(node, "hasPopup") ?? "false")
  if (popup !== "false" && role !== "combobox") {
    const kind: Record<string, string> = { true: "menu", menu: "menu", listbox: "list box", dialog: "dialog", grid: "grid", tree: "tree" }
    states.push(`has pop-up ${kind[popup] ?? "menu"}`)
  }
  if (role === "textbox" && prop(node, "multiline") === true) states.push("multi line")
  if (prop(node, "required") === true) states.push("required")
  const invalid = prop(node, "invalid")
  if (invalid !== undefined && String(invalid) !== "false") states.push("invalid entry")
  if (prop(node, "readonly") === true && FIELDS[role]) states.push("read only")
  if (prop(node, "disabled") === true) states.push("unavailable")
  return states
}

/** The current value of a field or range, when it adds something to the name. */
function valueOf(node: AXNodeLike, role: string, name: string): string {
  if (role === "checkbox" || role === "radio" || role === "switch") return ""
  const text = normalizeText(prop(node, "valuetext") ?? node.value?.value)
  if (!text || text === name) return ""
  return clip(text, 80)
}

function announce(parts: (string | undefined | false)[]): string {
  return parts.filter((part): part is string => Boolean(part)).join(", ")
}

class Builder {
  private readonly byId = new Map<string, AXNodeLike>()
  private readonly display?: Map<number, string>
  private readonly maxLines: number
  private readonly seen = new Set<string>()
  readonly lines: WorkingLine[] = []
  readonly collected: Collected = { headings: [], landmarks: [], links: [], fields: [], images: [], buttons: [] }
  truncated = false
  overflow = 0
  private buffer = ""
  private bufferFromNaming = false
  private namingDepth = 0
  /** Above zero inside a link that contains a heading, where every line is read as part of the link. */
  private linkPrefix = 0
  /** Whether that link has a name, which makes an unnamed icon inside it go unannounced. */
  private prefixLinkNamed = false

  constructor(nodes: AXNodeLike[], options: TranscriptOptions) {
    for (const node of nodes) this.byId.set(node.nodeId, node)
    this.display = options.display
    this.maxLines = options.maxLines ?? MAX_LINES
  }

  children(node: AXNodeLike): AXNodeLike[] {
    const out: AXNodeLike[] = []
    for (const id of node.childIds ?? []) {
      const child = this.byId.get(id)
      if (child) out.push(child)
    }
    return out
  }

  // Lines

  private emit(line: WorkingLine): number | undefined {
    if (this.linkPrefix > 0 && line.kind !== "heading") {
      line.text = `link, ${line.text}`
      line.link = true
    }
    // A label read just before the field it names is said again as the field's name.
    const previous = this.lines[this.lines.length - 1]
    if (previous?.fromNamingText && line.name && (line.kind === "field" || line.kind === "button" || line.kind === "table")) {
      const label = simplify(previous.text)
      if (label && simplify(line.name).includes(label) && !this.truncated) this.lines.pop()
    }
    if (this.truncated || this.lines.length >= this.maxLines) {
      this.truncated = true
      this.overflow += 1
      return undefined
    }
    this.lines.push(line)
    return this.lines.length - 1
  }

  private pushText(text: string) {
    this.buffer += text
    if (this.namingDepth > 0) this.bufferFromNaming = true
  }

  /** Ends the current run of text and emits it as one or more lines. */
  flush() {
    // Text that resumes after a link often starts with its punctuation: ". Scotland, Wales and".
    const text = normalizeText(this.buffer).replace(/^[,.;:]+\s+/, "")
    const fromNaming = this.bufferFromNaming
    this.buffer = ""
    this.bufferFromNaming = false
    if (!text || !hasWords(text)) return
    if (fromNaming) {
      // A label read just after the checkbox, radio button or group it names is not repeated.
      const previous = this.lines[this.lines.length - 1]
      const names = previous && (previous.kind === "field" || previous.kind === "button" || previous.kind === "table" || previous.kind === "other")
      if (names && previous.name && !this.truncated && simplify(previous.name).includes(simplify(text))) return
    }
    for (const piece of splitText(text)) this.emit({ text: piece, kind: "text", fromNamingText: fromNaming || undefined })
  }

  // Layout

  /** Whether an element starts its own line. Inline elements join the text around them. */
  private isBlock(node: AXNodeLike, role: string): boolean {
    if (!TRANSPARENT_ROLES.has(role) && !node.ignored) return true
    if (this.display) {
      const display = node.backendDOMNodeId !== undefined ? this.display.get(node.backendDOMNodeId) : undefined
      // No layout box: display: contents, or not rendered. Either way it adds no break.
      if (!display) return false
      return !display.startsWith("inline") && display !== "contents"
    }
    if (INLINE_FALLBACK_ROLES.has(role)) return false
    // Without display values: a wrapper sitting beside loose text is most likely inline.
    const parent = node.parentId ? this.byId.get(node.parentId) : undefined
    return !(parent && this.children(parent).some((sibling) => roleOf(sibling) === "StaticText" && !sibling.ignored))
  }

  private visitChildren(node: AXNodeLike, depth: number) {
    for (const child of this.children(node)) this.visit(child, depth + 1)
  }

  private visitContainer(node: AXNodeLike, role: string, depth: number) {
    const block = this.isBlock(node, role)
    const naming = NAMING_ROLES.has(role.toLowerCase()) && !node.ignored
    if (block || naming) this.flush()
    if (naming) this.namingDepth += 1
    this.visitChildren(node, depth)
    if (block || naming) this.flush()
    if (naming) this.namingDepth -= 1
  }

  // The walk

  visit(node: AXNodeLike, depth = 0) {
    if (depth > MAX_DEPTH || this.seen.has(node.nodeId)) return
    this.seen.add(node.nodeId)
    const role = roleOf(node)
    if (role === "InlineTextBox" || role === "ListMarker") return
    if (node.ignored) return this.visitContainer(node, role, depth)

    if (role === "StaticText") return this.pushText(String(node.name?.value ?? ""))
    if (role === "LineBreak") return this.flush()
    if (role === "heading") return this.heading(node, depth)
    if (role === "link") return this.link(node, depth)
    if (BUTTON_ROLES.has(role)) return this.control(node, role, depth)
    if (FIELDS[role]) return this.control(node, role, depth)
    if (ATOMIC[role]) return this.control(node, role, depth)
    if (IMAGE_ROLES.has(role)) return this.image(node, this.linkPrefix > 0)
    if (role === "Iframe") return this.frame(node)
    if (role === "separator") {
      this.flush()
      this.emit({ text: "separator", kind: "other" })
      return
    }
    if (LANDMARKS[role] && ((role !== "region" && role !== "form") || nameOf(node))) return this.landmark(node, role, depth)
    if (LIST_ROLES.has(role)) return this.list(node, role, depth)
    if (TABLE_ROLES[role]) return this.table(node, role, depth)
    if (role === "columnheader" || role === "rowheader") return this.headerCell(node, role)
    if (DIALOG_ROLES[role]) return this.wrapped(node, depth, DIALOG_ROLES[role], "dialog")
    if (ENTERED[role] || (role === "group" && nameOf(node))) {
      this.flush()
      this.emit({ text: announce([ENTERED[role] ?? "group", nameOf(node)]), kind: "other", name: nameOf(node) })
      this.visitChildren(node, depth)
      this.flush()
      return
    }
    this.visitContainer(node, role, depth)
  }

  private heading(node: AXNodeLike, depth: number) {
    this.flush()
    const level = typeof prop(node, "level") === "number" ? (prop(node, "level") as number) : 2
    const name = nameOf(node)
    const inline = this.inlineContent(node, depth)
    // A heading named by aria-label reads the label; one named by its contents reads them inline.
    const source = nameSource(node)
    const content = source && source.type !== "contents" ? clip(name) : inline.text || clip(name)
    const linked = inline.hasLink || this.linkPrefix > 0
    const index = this.emit({
      text: announce([`heading level ${level}`, this.linkPrefix > 0 && "link", content]),
      kind: "heading",
      level,
      link: linked || undefined,
      name,
    })
    this.collected.headings.push({ level, name, line: index })
    for (const record of inline.records) record.line = index
  }

  private headerCell(node: AXNodeLike, role: string) {
    this.flush()
    const inline = this.inlineContent(node, 0)
    const index = this.emit({
      text: announce([role === "columnheader" ? "column header" : "row header", inline.text]),
      kind: "table",
      link: inline.hasLink || undefined,
      name: nameOf(node),
    })
    for (const record of inline.records) record.line = index
  }

  /**
   * Reads a heading or header cell as one line, the way browse mode does: its text, plus any link,
   * image or control inside it, announced in place. Those still reach the summaries.
   */
  private inlineContent(node: AXNodeLike, depth: number) {
    const parts: string[] = []
    const records: { line?: number }[] = []
    let text = ""
    let hasLink = false
    const endText = () => {
      const clean = normalizeText(text)
      if (clean && hasWords(clean)) parts.push(clean)
      text = ""
    }
    const walk = (current: AXNodeLike, level: number) => {
      for (const child of this.children(current)) {
        if (level > MAX_DEPTH || this.seen.has(child.nodeId)) continue
        this.seen.add(child.nodeId)
        const role = roleOf(child)
        if (role === "InlineTextBox" || role === "ListMarker") continue
        if (child.ignored || TRANSPARENT_ROLES.has(role) || role === "paragraph") {
          const block = this.isBlock(child, role)
          if (block) text += " "
          walk(child, level + 1)
          if (block) text += " "
          continue
        }
        if (role === "StaticText") {
          text += String(child.name?.value ?? "")
          continue
        }
        if (role === "LineBreak") {
          text += " "
          continue
        }
        endText()
        if (role === "link") {
          const name = nameOf(child)
          hasLink = true
          const image = this.soleImage(child, name)
          parts.push(announce(["link", image && "image", clip(name)]))
          const record = { name, url: String(prop(child, "url") ?? ""), line: undefined as number | undefined }
          this.collected.links.push(record)
          records.push(record)
          this.swallow(child, name, records, level, "distinct")
        } else if (IMAGE_ROLES.has(role)) {
          const name = nameOf(child)
          if (name) parts.push(announce(["image", clip(name)]))
          records.push(this.recordImage(child, false))
        } else if (BUTTON_ROLES.has(role) || FIELDS[role] || ATOMIC[role]) {
          const name = nameOf(child)
          parts.push(announce([this.controlLabel(child, role), clip(name), ...statesOf(child, role)]))
          records.push(this.recordControl(child, role, undefined))
          this.swallow(child, name, records, level, BUTTON_ROLES.has(role) ? "distinct" : "none")
        } else {
          walk(child, level + 1)
        }
      }
    }
    walk(node, depth)
    endText()
    return { text: parts.join(", "), hasLink, records }
  }

  private link(node: AXNodeLike, depth: number) {
    this.flush()
    const name = nameOf(node)
    const url = String(prop(node, "url") ?? "")
    const record = { name, url, line: undefined as number | undefined }
    this.collected.links.push(record)

    // A link wrapping a heading (a card) is read line by line, each line marked as part of the link,
    // so the heading still shows up in the outline and nothing is read twice.
    if (this.linkPrefix === 0 && this.hasDescendant(node, (child) => roleOf(child) === "heading" && !child.ignored)) {
      const first = this.lines.length
      this.linkPrefix += 1
      this.prefixLinkNamed = Boolean(name)
      this.visitChildren(node, depth)
      this.flush()
      this.linkPrefix -= 1
      this.prefixLinkNamed = false
      record.line = this.lines.length > first ? first : undefined
      return
    }

    const image = this.soleImage(node, name)
    record.line = this.emit({
      text: announce(["link", image && "image", clip(name)]),
      kind: "link",
      name,
    })
    const inside: { line?: number }[] = []
    this.swallow(node, name, inside, depth, "distinct")
    for (const item of inside) item.line = record.line
  }

  private control(node: AXNodeLike, role: string, depth: number) {
    this.flush()
    if (role === "Video" || role === "Audio") return this.media(node, role)
    const name = nameOf(node)
    const kind: LineKind = BUTTON_ROLES.has(role) ? "button" : FIELDS[role] ? "field" : "other"
    const index = this.emit({
      text: announce([this.controlLabel(node, role), clip(name), valueOf(node, role, name), ...statesOf(node, role)]),
      kind,
      name,
    })
    this.recordControl(node, role, index)
    // A list box's options, a tree item's children and a menu item's submenu are content to read.
    const inside: { line?: number }[] = []
    const nested = role === "listbox" || role === "treeitem" || role === "menuitem" ? "read" : BUTTON_ROLES.has(role) ? "distinct" : "none"
    this.swallow(node, name, inside, depth, nested)
    for (const item of inside) item.line = index
  }

  /**
   * Media files are not downloaded for the preview, so Chrome names the player with its playback
   * error and marks it unavailable. Neither is what a visitor would hear.
   */
  private media(node: AXNodeLike, role: string) {
    const name = nameOf(node)
    const real = /^unable to play media\.?$/i.test(name) ? "" : name
    this.emit({
      text: announce([ATOMIC[role], clip(real)]),
      kind: "other",
      name: real,
      note: "Media is not loaded in this preview, so the player's own controls are not shown",
    })
    const inside: { line?: number }[] = []
    this.swallow(node, real, inside, 0, "none")
  }

  private controlLabel(node: AXNodeLike, role: string): string {
    if (BUTTON_ROLES.has(role)) return prop(node, "pressed") !== undefined ? "toggle button" : "button"
    return FIELDS[role] ?? ATOMIC[role] ?? role
  }

  /**
   * Walks what is inside a link or control without reading its text again. Images go to the image
   * summary. Nested controls depend on `nested`: "read" reads them all (a list box's options, a tree
   * item's children), "distinct" reads only those whose name the container's name does not already
   * include (a button inside a link), "none" reads none (a select's options, a tab's contents).
   */
  private swallow(node: AXNodeLike, containerName: string, records: { line?: number }[], depth: number, nested: "read" | "distinct" | "none") {
    const container = simplify(containerName)
    const walk = (current: AXNodeLike, level: number) => {
      for (const child of this.children(current)) {
        if (level > MAX_DEPTH || this.seen.has(child.nodeId)) continue
        const role = roleOf(child)
        if (IMAGE_ROLES.has(role) && !child.ignored) {
          this.seen.add(child.nodeId)
          records.push(this.recordImage(child, true))
          continue
        }
        const control = !child.ignored && (role === "link" || role === "heading" || BUTTON_ROLES.has(role) || Boolean(FIELDS[role] || ATOMIC[role]))
        if (control && nested !== "none") {
          const name = simplify(nameOf(child))
          if (nested === "read" || !name || !container.includes(name)) {
            this.visit(child, level)
            continue
          }
          // Repeats the container's name (a button inside a link, say): counted, not read again.
          if (role === "link") {
            const record = { name: nameOf(child), url: String(prop(child, "url") ?? ""), line: undefined as number | undefined }
            this.collected.links.push(record)
            records.push(record)
          } else if (role !== "heading") records.push(this.recordControl(child, role, undefined))
        }
        this.seen.add(child.nodeId)
        walk(child, level + 1)
      }
    }
    walk(node, depth)
  }

  /** True when a link's only content is one image whose text alternative is the link's name. */
  private soleImage(node: AXNodeLike, name: string): boolean {
    if (!name || nameSource(node)?.type !== "contents") return false
    let images = 0
    let text = ""
    const walk = (current: AXNodeLike) => {
      for (const child of this.children(current)) {
        const role = roleOf(child)
        if (IMAGE_ROLES.has(role) && !child.ignored) {
          if (nameOf(child)) images += 1
        } else if (role === "StaticText" && !child.ignored) text += String(child.name?.value ?? "")
        else walk(child)
      }
    }
    walk(node)
    return images === 1 && !normalizeText(text)
  }

  private image(node: AXNodeLike, insideControl: boolean) {
    this.flush()
    const name = nameOf(node)
    const record = this.recordImage(node, insideControl)
    // An unnamed SVG icon inside a named link is not announced; an <img> with no alt still is.
    if (!name && insideControl && this.prefixLinkNamed && !record.isImg) return
    record.line = this.emit({ text: name ? announce(["image", clip(name)]) : "unlabelled image", kind: "image", name })
  }

  private recordImage(node: AXNodeLike, insideControl: boolean) {
    // An <img> lists alt among its name sources; an SVG or role="img" element does not.
    const isImg = Boolean(node.name?.sources?.some((source) => source.attribute === "alt"))
    const record = { name: nameOf(node), isImg, insideControl, src: String(prop(node, "url") ?? ""), line: undefined as number | undefined }
    this.collected.images.push(record)
    return record
  }

  private recordControl(node: AXNodeLike, role: string, line: number | undefined) {
    const record = {
      label: this.controlLabel(node, role),
      name: nameOf(node),
      states: [valueOf(node, role, nameOf(node)), ...statesOf(node, role)].filter(Boolean).join(", "),
      line,
    }
    if (BUTTON_ROLES.has(role)) this.collected.buttons.push(record)
    else if (FIELDS[role]) this.collected.fields.push(record)
    return record
  }

  private frame(node: AXNodeLike) {
    this.flush()
    this.emit({
      text: announce(["frame", clip(nameOf(node))]),
      kind: "frame",
      name: nameOf(node),
      note: "The frame's content is not included in this preview",
      issue: nameOf(node) ? undefined : "Frame has no title",
    })
  }

  private landmark(node: AXNodeLike, role: string, depth: number) {
    const label = LANDMARKS[role]
    const name = nameOf(node)
    this.flush()
    const index = this.emit({ text: announce([`${label} landmark`, clip(name)]), kind: "landmark", name })
    this.collected.landmarks.push({ role, label, name, line: index })
    this.visitChildren(node, depth)
    this.flush()
    this.emit({ text: `end of ${label} landmark`, kind: "landmark" })
  }

  private wrapped(node: AXNodeLike, depth: number, label: string, kind: LineKind) {
    this.flush()
    this.emit({ text: announce([label, clip(nameOf(node))]), kind, name: nameOf(node) })
    this.visitChildren(node, depth)
    this.flush()
    this.emit({ text: `end of ${label}`, kind })
  }

  private list(node: AXNodeLike, role: string, depth: number) {
    const items = this.countWithin(node, role === "DescriptionList" ? new Set(["term"]) : new Set(["listitem"]), new Set([...LIST_ROLES]))
    if (items === 0) return this.visitContainer(node, role, depth)
    this.flush()
    this.emit({ text: announce(["list", clip(nameOf(node), 120), `${items} ${items === 1 ? "item" : "items"}`]), kind: "list" })
    this.visitChildren(node, depth)
    this.flush()
    this.emit({ text: "end of list", kind: "list" })
  }

  private table(node: AXNodeLike, role: string, depth: number) {
    const tableRoles = new Set(Object.keys(TABLE_ROLES))
    const rows = this.findWithin(node, new Set(["row"]), tableRoles)
    const columns = rows.reduce((max, row) => Math.max(max, this.countWithin(row, CELL_ROLES, tableRoles)), 0)
    this.flush()
    const name = nameOf(node)
    this.emit({
      text: announce([
        TABLE_ROLES[role],
        clip(name),
        `${rows.length} ${rows.length === 1 ? "row" : "rows"}`,
        `${columns} ${columns === 1 ? "column" : "columns"}`,
      ]),
      kind: "table",
      name,
    })
    this.visitChildren(node, depth)
    this.flush()
    this.emit({ text: `end of ${TABLE_ROLES[role]}`, kind: "table" })
  }

  /** Descendants with one of `roles`, not looking inside them or inside a nested `stop` container. */
  private findWithin(node: AXNodeLike, roles: Set<string>, stop: Set<string>): AXNodeLike[] {
    const found: AXNodeLike[] = []
    const walk = (current: AXNodeLike, level: number) => {
      if (level > MAX_DEPTH) return
      for (const child of this.children(current)) {
        const role = roleOf(child)
        if (!child.ignored && roles.has(role)) found.push(child)
        else if (child.ignored || !stop.has(role)) walk(child, level + 1)
      }
    }
    walk(node, 0)
    return found
  }

  private countWithin(node: AXNodeLike, roles: Set<string>, stop: Set<string>): number {
    return this.findWithin(node, roles, stop).length
  }

  private hasDescendant(node: AXNodeLike, test: (child: AXNodeLike) => boolean): boolean {
    const stack = [...this.children(node)]
    let guard = 0
    while (stack.length && guard++ < 5000) {
      const current = stack.pop()!
      if (test(current)) return true
      stack.push(...this.children(current))
    }
    return false
  }
}

function findRoot(nodes: AXNodeLike[]): AXNodeLike | undefined {
  return nodes.find((node) => roleOf(node) === "RootWebArea" && !node.parentId) ?? nodes.find((node) => !node.parentId) ?? nodes[0]
}

/** Builds the transcript and summaries from the nodes of Accessibility.getFullAXTree. */
export function buildTranscript(nodes: AXNodeLike[], options: TranscriptOptions = {}): Transcript {
  const builder = new Builder(nodes, options)
  const root = findRoot(nodes)
  if (root) {
    builder.visit(root)
    builder.flush()
  }
  const lines: TranscriptLine[] = builder.lines.map(({ name: _name, fromNamingText: _fromNamingText, ...line }) => line)
  const summaries = summarise(builder.collected, lines)
  return {
    title: root ? nameOf(root) : "",
    lines,
    truncated: builder.truncated,
    totalLines: lines.length + builder.overflow,
    summaries,
  }
}
