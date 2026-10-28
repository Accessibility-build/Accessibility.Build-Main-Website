// Text rules that Word and PowerPoint share: link text, alt text quality and
// document titles. Pure string functions, no XML.

const GENERIC_LINK_TEXT = new Set([
  "click here",
  "click",
  "here",
  "link",
  "this link",
  "click this link",
  "more",
  "read more",
  "learn more",
  "more info",
  "more information",
  "details",
  "this",
  "see here",
  "go",
  "go here",
  "this page",
  "website",
])

export type LinkTextProblem = "empty" | "url" | "generic"

/**
 * What, if anything, is wrong with a link's visible text. A bare domain such
 * as gov.uk and an email address are left alone: people often need to see
 * those, and they say where the link goes.
 */
export function linkTextProblem(text: string): LinkTextProblem | null {
  const clean = text.replace(/\s+/g, " ").trim()
  if (!clean) return "empty"
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return null
  if (/^(https?:\/\/|ftp:\/\/|www\.)\S+$/i.test(clean)) return "url"
  if (/^[\w-]+(\.[\w-]+)+\/\S+$/.test(clean)) return "url"
  const words = clean.toLowerCase().replace(/[.,:;!?()[\]"'\u2018\u2019\u201c\u201d]+/g, "").trim()
  if (GENERIC_LINK_TEXT.has(words)) return "generic"
  return null
}

export function linkTextMessage(problem: LinkTextProblem, text: string, hasImage = false): string {
  switch (problem) {
    case "empty":
      return hasImage
        ? "A linked picture has no alt text, so the link has no name. A screen reader announces only that there is a link."
        : "This link has no text, so a screen reader announces only that there is a link."
    case "url":
      return `The link text is a web address ("${shorten(text)}"). Screen readers read the whole address aloud, which is slow and rarely says where the link goes.`
    case "generic":
      return `The link text "${text.trim()}" does not say where the link goes. People who list the links in a document hear it with no context.`
  }
}

function shorten(text: string, max = 70): string {
  const clean = text.replace(/\s+/g, " ").trim()
  return clean.length > max ? `${clean.slice(0, max - 3)}...` : clean
}

export type AltTextProblem = "auto" | "filename" | "redundant-prefix" | "long"

/**
 * Alt text that is present but probably not doing its job. Office 365 writes
 * captions ending "Description automatically generated" (and, in newer
 * builds, "AI-generated content may be incorrect"); those were never reviewed
 * by a person.
 */
export function altTextProblem(alt: string): AltTextProblem | null {
  const clean = alt.replace(/\s+/g, " ").trim()
  if (!clean) return null
  if (/description automatically generated|ai-generated content may be incorrect/i.test(clean)) return "auto"
  if (/\.(png|jpe?g|gif|bmp|svg|tiff?|emf|wmf|heic|webp)$/i.test(clean)) return "filename"
  if (/^(img|dsc|dscn|image|screenshot|screen shot|photo|picture|pic)[\s_-]?\d+/i.test(clean)) return "filename"
  if (/^(an? )?(image|picture|photo|photograph|graphic|icon) of\b/i.test(clean)) return "redundant-prefix"
  if (clean.length > 250) return "long"
  return null
}

export function altTextMessage(problem: AltTextProblem, alt: string): string {
  const quoted = `"${shorten(alt, 80)}"`
  switch (problem) {
    case "auto":
      return `The alt text ${quoted} was generated automatically and has not been edited. Check that it says what the picture means in this document, then delete the generated note.`
    case "filename":
      return `The alt text ${quoted} looks like a file name, which tells a screen reader user nothing about the picture.`
    case "redundant-prefix":
      return `The alt text ${quoted} starts with words such as "image of". Screen readers already say it is a picture, so start with what it shows.`
    case "long":
      return `The alt text is ${alt.trim().length} characters long. Keep alt text to a sentence or two and put longer descriptions, such as chart data, in the document text.`
  }
}

/** Titles Office fills in by default, or that are just the file name. */
export function titleProblem(title: string, fileName: string): string | null {
  const clean = title.trim()
  const lower = clean.toLowerCase()
  if (/^(document|presentation|doc|untitled|title|new document|new presentation)\s*\d*$/.test(lower)) {
    return `The title "${clean}" is a default, not a description of this file.`
  }
  if (/^(powerpoint presentation|microsoft word( - .*)?|word document|slide \d+|click to add title)$/.test(lower)) {
    return `The title "${clean}" is a default, not a description of this file.`
  }
  if (/\.(docx?|pptx?|dotx|potx|ppsx|pdf)$/i.test(clean)) {
    return `The title "${clean}" is a file name. Use words that describe the content.`
  }
  const base = fileName.replace(/\.[^.]+$/, "").toLowerCase()
  if (base && lower === base && /[_-]/.test(base) && !/\s/.test(base)) {
    return `The title "${clean}" is the file name. Use words that describe the content.`
  }
  return null
}

/** A BCP 47-looking tag that names a real language (x-none means "no language"). */
export function isUsableLanguage(tag: string | null | undefined): tag is string {
  if (!tag) return false
  const t = tag.trim()
  if (!t || /^x-none$/i.test(t)) return false
  return /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i.test(t)
}
