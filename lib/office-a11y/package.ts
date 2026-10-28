import { unzipSync } from "fflate"
import type { OfficeKind } from "./types"
import { parseRelationships, relsPathFor, type ParseXml, type Relationship } from "./xml"

// Opening the package: refuse what we cannot read with a sentence the visitor
// can act on, unzip only the XML parts the checks need (never the pictures or
// media, which are most of a file's size), and hand out parsed parts on
// demand.

export const MAX_FILE_BYTES = 50 * 1024 * 1024
/** Uncompressed XML the checks will read. Far above any real document; stops zip bombs. */
const MAX_XML_BYTES = 400 * 1024 * 1024

/** An error whose message is written for the visitor. */
export class OfficeFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OfficeFileError"
  }
}

const WORD_EXT = ["docx", "docm", "dotx", "dotm"]
const POWERPOINT_EXT = ["pptx", "pptm", "ppsx", "potx"]

function extensionOf(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name.trim())
  return m ? m[1].toLowerCase() : ""
}

/**
 * Checks that need only the name and size, so the page can refuse a file
 * before reading a byte of it. Returns the sentence to show, or null.
 */
export function refuseByNameAndSize(name: string, size: number): string | null {
  const ext = extensionOf(name)
  if (ext === "doc" || ext === "dot" || ext === "rtf") {
    return "This is an older Word format that this checker cannot read. Open it in Word, select File > Save As, choose Word Document (.docx), then check the new file."
  }
  if (ext === "ppt" || ext === "pps" || ext === "pot") {
    return "This is an older PowerPoint format that this checker cannot read. Open it in PowerPoint, select File > Save As, choose PowerPoint Presentation (.pptx), then check the new file."
  }
  if (["xlsx", "xlsm", "xls", "csv", "ods"].includes(ext)) {
    return "Spreadsheets are not supported. This checker reads Word documents (.docx) and PowerPoint presentations (.pptx)."
  }
  if (ext === "pdf") {
    return "This checker reads Word and PowerPoint files. For a PDF, use the PDF accessibility checker."
  }
  if (ext === "odt" || ext === "odp") {
    return "OpenDocument files are not supported. Save the file as .docx or .pptx, then check it."
  }
  if (![...WORD_EXT, ...POWERPOINT_EXT].includes(ext)) {
    return "Choose a Word document (.docx) or a PowerPoint presentation (.pptx)."
  }
  if (size === 0) return "This file is empty."
  if (size > MAX_FILE_BYTES) {
    return `This file is ${(size / 1024 / 1024).toFixed(0)} MB. The limit is 50 MB. Large files are usually large because of pictures or video: compress them (in Word or PowerPoint, select a picture, then Picture Format > Compress Pictures) and try again.`
  }
  return null
}

function startsWith(bytes: Uint8Array, sig: number[]): boolean {
  if (bytes.length < sig.length) return false
  return sig.every((b, i) => bytes[i] === b)
}

/** "EncryptedPackage" in UTF-16LE: the stream name Office uses for a password-protected file. */
function containsEncryptedPackage(bytes: Uint8Array): boolean {
  const needle = Array.from("EncryptedPackage").flatMap((ch) => [ch.charCodeAt(0), 0])
  const limit = Math.min(bytes.length, 4 * 1024 * 1024) - needle.length
  outer: for (let i = 0; i < limit; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (bytes[i + j] !== needle[j]) continue outer
    }
    return true
  }
  return false
}

/** Folders whose XML no check reads; skipping them keeps unzipping fast. */
const SKIP_PREFIXES = [
  "customXml/",
  "word/glossary/",
  "word/embeddings/",
  "word/media/",
  "word/charts/",
  "word/diagrams/",
  "word/theme/",
  "ppt/embeddings/",
  "ppt/media/",
  "ppt/charts/",
  "ppt/diagrams/",
  "ppt/theme/",
  "ppt/notesSlides/",
  "ppt/notesMasters/",
  "ppt/handoutMasters/",
  "ppt/slideLayouts/",
  "ppt/ink/",
  "ppt/tags/",
]

export interface OfficePackage {
  kind: OfficeKind
  /** The main part: word/document.xml or ppt/presentation.xml in almost every file. */
  mainPart: string
  has(name: string): boolean
  names(): string[]
  /** Parsed part, or null when the package does not have it. Throws OfficeFileError when it is not XML. */
  xml(name: string): Document | null
  /** Relationships of a part, by id. */
  rels(partName: string): Map<string, Relationship>
}

function decode(bytes: Uint8Array): string {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder("utf-16le").decode(bytes)
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder("utf-16be").decode(bytes)
  return new TextDecoder("utf-8").decode(bytes)
}

/**
 * Unzip an Office file and identify it. Throws OfficeFileError with a
 * sentence for the visitor when the file is protected, old, damaged or not
 * Word or PowerPoint at all.
 */
export function openOfficePackage(bytes: Uint8Array, parseXml: ParseXml): OfficePackage {
  // Password-protected .docx and .pptx files are not zips: Office wraps the
  // encrypted package in the same compound file format the old .doc used.
  if (startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) {
    if (containsEncryptedPackage(bytes)) {
      throw new OfficeFileError(
        "This file is password-protected, so it cannot be read. Remove the password (File > Info > Protect Document or Protect Presentation > Encrypt with Password, then clear it), save, and check the copy. Remember to protect it again afterwards if you need to.",
      )
    }
    throw new OfficeFileError(
      "This file is in an older Word or PowerPoint format, even though its name ends in .docx or .pptx. Open it, select File > Save As, choose the .docx or .pptx format, then check the new file.",
    )
  }
  if (!startsWith(bytes, [0x50, 0x4b, 0x03, 0x04])) {
    throw new OfficeFileError("This file is not a Word or PowerPoint file, or it is damaged. Try opening it in Word or PowerPoint and saving it again.")
  }

  let xmlBytes = 0
  let tooBig = false
  let files: Record<string, Uint8Array>
  try {
    files = unzipSync(bytes, {
      filter: (file) => {
        const name = file.name
        if (!/\.(xml|rels)$/i.test(name)) return false
        if (SKIP_PREFIXES.some((p) => name.startsWith(p))) return false
        xmlBytes += file.originalSize
        if (xmlBytes > MAX_XML_BYTES) {
          tooBig = true
          return false
        }
        return true
      },
    })
  } catch {
    throw new OfficeFileError("This file could not be unzipped, so it is probably damaged. Try opening it in Word or PowerPoint and saving it again.")
  }
  if (tooBig) {
    throw new OfficeFileError("This file holds more text and structure than the checker can read in a browser. Split it into smaller files and check each one.")
  }

  const cache = new Map<string, Document | null>()
  const relsCache = new Map<string, Map<string, Relationship>>()

  const xml = (name: string): Document | null => {
    if (cache.has(name)) return cache.get(name) ?? null
    const data = files[name]
    if (!data) {
      cache.set(name, null)
      return null
    }
    let doc: Document | null = null
    try {
      doc = parseXml(decode(data))
    } catch {
      doc = null
    }
    if (!doc || !doc.documentElement || doc.getElementsByTagNameNS("*", "parsererror").length > 0) {
      throw new OfficeFileError(
        `Part of this file (${name}) could not be read. The file may be damaged, or nested more deeply than a browser can handle, such as tables inside tables many levels deep. Try opening it in Word or PowerPoint and saving it again.`,
      )
    }
    cache.set(name, doc)
    return doc
  }

  const rels = (partName: string) => {
    const key = relsPathFor(partName)
    let map = relsCache.get(key)
    if (!map) {
      map = parseRelationships(xml(key))
      relsCache.set(key, map)
    }
    return map
  }

  // The package's own relationships say which part is the document.
  let mainPart = ""
  for (const rel of parseRelationships(xml("_rels/.rels")).values()) {
    if (/\/officeDocument$/.test(rel.type)) {
      mainPart = rel.target.replace(/^\//, "")
      break
    }
  }
  if (!mainPart || !files[mainPart]) {
    mainPart = ["word/document.xml", "ppt/presentation.xml", "xl/workbook.xml"].find((p) => files[p]) ?? ""
  }

  let kind: OfficeKind
  if (mainPart.startsWith("word/")) kind = "docx"
  else if (mainPart.startsWith("ppt/")) kind = "pptx"
  else if (mainPart.startsWith("xl/")) {
    throw new OfficeFileError("This is an Excel workbook. This checker reads Word documents (.docx) and PowerPoint presentations (.pptx).")
  } else {
    throw new OfficeFileError("This zip file is not a Word document or a PowerPoint presentation.")
  }
  if (!files[mainPart]) {
    throw new OfficeFileError("This file is missing its main document part, so it is probably damaged. Try opening it in Word or PowerPoint and saving it again.")
  }

  return {
    kind,
    mainPart,
    has: (name) => name in files,
    names: () => Object.keys(files),
    xml,
    rels,
  }
}
