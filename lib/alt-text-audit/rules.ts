import type { AltState, AuditedImage, CheckedImage, CollectedImage, Finding, NameSource, Outcome, WcagRef } from "./types"

// The free rule checks for the alt text checker. Pure functions over what the in-page collector
// found, so they run the same in Node tests, on the server and in the browser.
//
// A rule can only judge the text, never the picture: it knows "logo" is a placeholder and that a
// link with an empty-alt image and no other text has no name, but not whether "Two people at a
// desk" describes the photo. That judgement is the optional AI review, and in the end a person's.

export const WCAG: Record<"nonText" | "linkPurpose" | "nameRoleValue", WcagRef> = {
  nonText: { id: "1.1.1", name: "Non-text Content", href: "/wcag/1-1-1" },
  linkPurpose: { id: "2.4.4", name: "Link Purpose (In Context)", href: "/wcag/2-4-4" },
  nameRoleValue: { id: "4.1.2", name: "Name, Role, Value", href: "/wcag/4-1-2" },
}

/** Over this, alt text is hard to listen to and usually belongs in a caption or nearby text. */
export const MAX_ALT_LENGTH = 150

const PLACEHOLDER_WORDS = new Set([
  "image", "img", "images", "photo", "photos", "photograph", "picture", "pic", "logo", "icon", "graphic",
  "banner", "spacer", "placeholder", "untitled", "alt", "alt text", "alttext", "alt tag", "thumbnail", "thumb",
  "default", "null", "undefined", "none", "blank", "empty", "image description", "description", "test",
  "temp", "dummy", "figure", "artwork", "media", "asset", "file", "object object", "nan", "slide", "hero",
  "insert alt text", "alt text here", "enter alt text", "image alt", "image alt text", "your alt text",
  "unpopulated", "missing", "todo", "tbd", "no alt", "noalt", "alt missing", "missing alt", "lorem ipsum",
])

// A template variable or CMS token that was never filled in: [unpopulated], {alt}, %ALT%, ${title}.
const TEMPLATE_TOKEN = /^(?:\[[^\]\s]*\]|\{\{?[^}\s]*\}?\}|%[^%\s]+%|\$\{[^}\s]*\}|<[^>\s]+>)$/

// "Product image", "Hero banner", "Company logo": a label for the slot, not for what fills it.
const GENERIC_PHRASE =
  /^(?:the |an? |our |my |your )?(?:product|featured|feature|hero|banner|header|background|bg|main|default|thumbnail|preview|profile|post|article|cover|gallery|slider|slide|carousel|card|company|brand|site|website|page|blog|team|user|avatar|stock)\s+(?:image|img|photo|picture|pic|thumbnail|logo|icon|graphic|banner)$/

const REDUNDANT_PHRASE = /^(?:an? |the )?(?:image|picture|graphic|photo|photograph|pic)\s+(?:of|showing|depicting)\b/i

const LINK_PHRASE = /\b(?:click here|click to|tap here|link to|links to|go to link|read more|learn more|more info)\b/i

const IMAGE_EXTENSION = /\.(?:jpe?g|png|gif|webp|avif|svg|bmp|tiff?|heic|ico)(?:\?.*)?$/i
const CAMERA_NAME = /^(?:img|dsc|dscn|dsc_|dcim|pxl|mvimg|gopr|image|photo|screenshot|screen shot|capture|scan)[-_ ]?\d{2,}/i
const HASH_LIKE = /^(?:[a-f0-9]{16,}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i

/** Lower case, accents and punctuation removed, spaces collapsed. For comparing two texts. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function stemOf(fileName: string | null): string | null {
  if (!fileName) return null
  return fileName.replace(/\.[a-z0-9]{2,5}$/i, "").toLowerCase()
}

export function looksLikeFileName(alt: string, fileName: string | null): boolean {
  const text = alt.trim()
  if (!text) return false
  if (IMAGE_EXTENSION.test(text) || CAMERA_NAME.test(text) || HASH_LIKE.test(text)) return true
  if (/\s/.test(text)) return false
  const stem = stemOf(fileName)
  if (stem && stem.length >= 3 && text.toLowerCase() === stem) return true
  // brass_desk_lamp or hero-banner-desktop: words joined the way file names are, not the way people write.
  return text.length >= 6 && (/_/.test(text) || /[a-z]-[a-z]+-[a-z]/i.test(text))
}

export function isPlaceholder(alt: string): boolean {
  if (TEMPLATE_TOKEN.test(alt.trim())) return true
  const text = normalizeText(alt).replace(/\s*\d+$/, "").trim()
  if (!text) return /^[\s\p{P}\p{S}\d]+$/u.test(alt) // "-", "*", "#", "1"
  return PLACEHOLDER_WORDS.has(text) || GENERIC_PHRASE.test(text)
}

/** True when one text adds nothing to the other: the same words, or the alt already inside it. */
export function repeats(alt: string, other: string): boolean {
  const a = normalizeText(alt)
  const b = normalizeText(other)
  if (!a || !b) return false
  if (a === b) return true
  if (a.length >= 12 && b.includes(a)) return true
  return b.length >= 12 && a.includes(b) && b.length >= a.length * 0.6
}

function altStateOf(image: CollectedImage): AltState {
  if (image.alt === null) return "missing"
  return image.alt.trim() ? "present" : "empty"
}

function nameOf(image: CollectedImage): { name: string; source: NameSource } {
  if (image.ariaHidden) return { name: "", source: "none" }
  if (image.labelledbyText) return { name: image.labelledbyText, source: "aria-labelledby" }
  if (image.ariaLabel) return { name: image.ariaLabel, source: "aria-label" }
  if (image.kind === "svg") {
    if (image.svgTitle) return { name: image.svgTitle, source: "svg title" }
  } else if (image.kind !== "role-img" && image.alt !== null) {
    // alt="" ends the computation: the image is decorative even if it has a title.
    return { name: image.alt.trim(), source: image.alt.trim() ? "alt" : "none" }
  }
  if (image.title) return { name: image.title, source: "title" }
  return { name: "", source: "none" }
}

const controlWord = (image: CollectedImage) => (image.control?.kind === "button" ? "button" : "link")

const controlCriteria = (image: CollectedImage) =>
  image.control?.kind === "button" ? [WCAG.nonText, WCAG.nameRoleValue] : [WCAG.nonText, WCAG.linkPurpose]

/** Checks one image on its own. Duplicates across images are added by auditImages. */
export function checkImage(image: CollectedImage): AuditedImage {
  const altState = altStateOf(image)
  const { name, source } = nameOf(image)
  const findings: Finding[] = []
  const control = image.control
  const controlHasOtherName = Boolean(control && !control.self && (control.label || control.text || control.title))
  const onlyContent = Boolean(control && !controlHasOtherName)
  const presentational = image.role === "presentation" || image.role === "none"
  let decorative = false

  // 1. Does it have a text alternative at all?
  if (image.ariaHidden) {
    // Only collected when hiding it left its control empty; step 2 reports that.
    decorative = true
  } else if (image.kind === "img" || image.kind === "input-image" || image.kind === "area") {
    if (presentational && !name) {
      decorative = true
      if (altState === "missing") {
        findings.push({
          rule: "presentation-role",
          severity: "advice",
          title: `role="${image.role}" without alt=""`,
          detail: 'The role hides the image, but some tools and older screen readers still look for the alt attribute. Add alt="" as well.',
          wcag: [WCAG.nonText],
        })
      }
    } else if (altState === "missing" && source === "none") {
      findings.push({
        rule: "missing-alt",
        severity: "fail",
        title: "No alt attribute",
        detail:
          "Without an alt attribute, screen readers often read out the file name or say just \"image\". Add alt text that says what the image contributes, or alt=\"\" if it is decorative.",
        wcag: [WCAG.nonText],
      })
    } else if (altState === "missing" && source === "title") {
      findings.push({
        rule: "title-only",
        severity: "warning",
        title: "Only a title attribute",
        detail:
          "The title gives the image a name, but it only appears as a tooltip on mouse hover, never on touch screens or to keyboard users, and some screen readers skip it. Put the text in the alt attribute.",
        wcag: [WCAG.nonText],
      })
    } else if (altState === "empty" && source === "none") {
      decorative = !control?.self
      if (image.alt !== "" && image.alt !== null) {
        findings.push({
          rule: "whitespace-alt",
          severity: "advice",
          title: "Alt is only spaces",
          detail: 'Most screen readers treat a space as empty, but not all. Use alt="" with nothing between the quotes.',
          wcag: [WCAG.nonText],
        })
      }
    }
  } else if (!name) {
    if (presentational) {
      decorative = true
    } else if (image.kind === "role-img" || image.role === "img") {
      findings.push({
        rule: "role-img-no-name",
        severity: "fail",
        title: 'role="img" with no name',
        detail:
          'An element with role="img" is announced as an image, so it needs a name: add aria-label, or aria-labelledby pointing at visible text. If it is decorative, remove the role and add aria-hidden="true".',
        wcag: [WCAG.nonText],
      })
    } else if (control) {
      // An unnamed icon inside a control: fine when the control has its own name, but hide it.
      decorative = controlHasOtherName
      if (controlHasOtherName) {
        findings.push({
          rule: "svg-no-name",
          severity: "advice",
          title: "Icon could be hidden",
          detail: `The ${controlWord(image)} has its own name, so this icon adds nothing. Add aria-hidden="true" to the svg so no screen reader announces an unlabelled image.`,
          wcag: [WCAG.nonText],
        })
      }
    } else {
      findings.push({
        rule: "svg-no-name",
        severity: "warning",
        title: "SVG with no name, not hidden",
        detail:
          'If this graphic is decorative, add aria-hidden="true". If it carries information, add role="img" and aria-label (or a title element) that says what it shows.',
        wcag: [WCAG.nonText],
      })
    }
  }

  // 2. Does the link or button it sits in end up with a name?
  if (control && !name && (control.self || !controlHasOtherName)) {
    const what = control.self
      ? image.kind === "area"
        ? "This image map area is a link"
        : "This image is a button"
      : `This image is the only content of a ${controlWord(image)}`
    const why = image.ariaHidden
      ? "it is hidden with aria-hidden"
      : altState === "empty"
        ? 'its alt="" marks it as decorative'
        : "it has no alt text"
    findings.push({
      rule: "control-no-name",
      severity: "fail",
      title: `The ${controlWord(image)} has no name`,
      detail: `${what}, and ${why}, so a screen reader announces only "${controlWord(image)}"${control.href ? " or the web address" : ""}. Give the image alt text that says ${control.kind === "link" ? "where the link goes" : "what the button does"}.`,
      wcag: controlCriteria(image),
    })
  }

  // 3. Is the text that is there any good?
  if (name && source !== "title" && source !== "aria-labelledby") {
    if (looksLikeFileName(name, image.fileName)) {
      findings.push({
        rule: "file-name",
        severity: "fail",
        title: "File name used as alt",
        detail: "A file name tells a screen reader user nothing about the image. Replace it with what the image shows or does.",
        wcag: [WCAG.nonText],
      })
    } else if (isPlaceholder(name)) {
      findings.push({
        rule: "placeholder",
        severity: "fail",
        title: "Placeholder alt text",
        detail: `"${name}" names the kind of thing, not this one. Say what it shows (for a logo, the organisation's name), or use alt="" if it is decorative.`,
        wcag: [WCAG.nonText],
      })
    }
    if (REDUNDANT_PHRASE.test(name)) {
      findings.push({
        rule: "redundant-phrase",
        severity: "advice",
        title: 'Starts with "image of"',
        detail: 'Screen readers already announce that it is an image. Drop the "image of" or "picture of" and start with what it shows.',
        wcag: [WCAG.nonText],
      })
    }
    if (LINK_PHRASE.test(name)) {
      findings.push({
        rule: "link-phrase",
        severity: "warning",
        title: control?.kind === "link" ? 'Says "click here" or "link to"' : "Reads like link text",
        detail:
          control?.kind === "link"
            ? 'Screen readers already announce a link, and "click here" says nothing about where it goes. Name the destination instead.'
            : 'Phrases like "click here" or "link to" describe an action, not the image. Describe what it shows.',
        wcag: control?.kind === "link" ? [WCAG.linkPurpose, WCAG.nonText] : [WCAG.nonText],
      })
    }
    if (name.length > MAX_ALT_LENGTH) {
      findings.push({
        rule: "too-long",
        severity: "warning",
        title: `Long alt text (${name.length} characters)`,
        detail:
          "Long alt text cannot be paused or skimmed. Keep the alt to the essentials and move the detail into a visible caption or nearby text, or link to a longer description.",
        wcag: [WCAG.nonText],
      })
    }
    if (image.caption && repeats(name, image.caption)) {
      findings.push({
        rule: "repeats-caption",
        severity: "warning",
        title: "Repeats the caption",
        detail:
          'Screen reader users hear the same words twice. Use the alt for what the caption does not say, or alt="" if the caption already describes the image fully.',
        wcag: [WCAG.nonText],
      })
    }
    if (control && !control.self && control.text && repeats(name, control.text)) {
      findings.push({
        rule: "repeats-link-text",
        severity: "warning",
        title: `Repeats the ${controlWord(image)} text`,
        detail: `The ${controlWord(image)} already says "${control.text}", so its name is read twice. Use alt="" on the image.`,
        wcag: [WCAG.nonText, ...(control.kind === "link" ? [WCAG.linkPurpose] : [])],
      })
    }
  }

  return { ...image, altState, name, nameSource: source, decorative, onlyContent, findings, outcome: outcomeOf(findings, decorative) }
}

function outcomeOf(findings: Finding[], decorative: boolean): Outcome {
  if (findings.some((finding) => finding.severity === "fail")) return "fail"
  if (findings.some((finding) => finding.severity === "warning")) return "review"
  return decorative ? "decorative" : "pass"
}

/**
 * A key for "probably the same picture": the path without size variants, so a thumbnail and a large
 * crop of one photo match. Drops -300x200, _400x, @2x, numeric-only segments (Guardian-style
 * /0_0_4928_3285/master/1000.jpg) and Cloudinary-style transformation segments (w_400,c_fill).
 */
export function pictureKey(src: string | null): string | null {
  if (!src) return null
  try {
    const url = new URL(src)
    const segments = url.pathname
      .toLowerCase()
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.replace(/(?:[-_]\d{2,4}x\d{0,4}|@\dx|[-_](?:scaled|thumb|thumbnail|small|medium|large))(?=\.[a-z0-9]+$)/, ""))
      .filter((segment) => !/^[\d_x.-]+$/.test(segment.replace(/\.[a-z0-9]+$/, "")))
      .filter((segment) => !/^(?:[a-z]{1,2}_[a-z0-9.]+,?)+$/.test(segment))
    return `${url.hostname}/${segments.join("/")}`
  } catch {
    return src
  }
}

const fileKey = (image: CollectedImage) => pictureKey(image.src)

/** Runs every rule over the page's images, including the one that compares images with each other. */
export function auditImages(images: CollectedImage[]): AuditedImage[] {
  const audited = images.map(checkImage)

  const groups = new Map<string, AuditedImage[]>()
  for (const image of audited) {
    if (!image.name || image.kind === "svg" || image.kind === "role-img" || !image.src) continue
    const key = normalizeText(image.name)
    if (key.length < 2) continue
    groups.set(key, [...(groups.get(key) ?? []), image])
  }
  for (const group of groups.values()) {
    const files = new Set(group.map(fileKey))
    if (files.size < 2) continue
    for (const image of group) {
      const others = group.filter((other) => other !== image && fileKey(other) !== fileKey(image)).map((other) => other.id)
      if (!others.length) continue
      const list = others.length > 5 ? `${others.slice(0, 5).join(", ")} and ${others.length - 5} more` : others.join(", ")
      image.findings.push({
        rule: "duplicate-alt",
        severity: "warning",
        title: "Same alt as different images",
        detail: `Image${others.length === 1 ? "" : "s"} ${list} show${others.length === 1 ? "s" : ""} a different file with the same alt text. If the images differ, the alt text should say how.`,
        wcag: [WCAG.nonText],
      })
      image.outcome = outcomeOf(image.findings, image.decorative)
    }
  }
  return audited
}

export function countOutcomes(images: AuditedImage[]): Record<Outcome, number> {
  const counts: Record<Outcome, number> = { fail: 0, review: 0, decorative: 0, pass: 0 }
  for (const image of images) counts[image.outcome]++
  return counts
}

/**
 * Which images to send to the AI review, best first: missing alt, then images that are the only
 * content of a link or button, then large images, then the rest that have alt text. The review
 * takes them in this order until it has captured enough, so this returns more than it needs.
 * Images that have not loaded or are icon-sized are left out, and each file is reviewed once.
 */
export function rankForReview(images: AuditedImage[]): AuditedImage[] {
  const tier = (image: AuditedImage): number => {
    if (image.altState === "missing" && (image.nameSource === "none" || image.nameSource === "title") && !image.ariaHidden && image.kind !== "svg" && image.kind !== "role-img") return 0
    if (image.onlyContent) return 1
    if (image.width * image.height >= 200 * 200) return 2
    if (image.name) return 3
    return 4
  }
  const seenFiles = new Set<string>()
  return images
    .filter((image) => image.loaded && image.width >= 16 && image.height >= 16 && image.kind !== "area")
    .map((image) => ({ image, tier: tier(image) }))
    .filter((entry) => entry.tier < 4)
    .sort((a, b) => a.tier - b.tier || (a.tier === 2 ? b.image.width * b.image.height - a.image.width * a.image.height : a.image.id - b.image.id))
    .map((entry) => entry.image)
    .filter((image) => {
      const key = image.src ? image.src.split("?")[0] : null
      if (!key) return true
      if (seenFiles.has(key)) return false
      seenFiles.add(key)
      return true
    })
}

export type FilterGroup = "failures" | "review" | "fine"

const AI_PROBLEMS = new Set(["incomplete", "inaccurate", "should_be_decorative", "needs_alt"])

/** The filter an image belongs to, combining the rules with the AI verdict when there is one. */
export function filterGroupOf(image: CheckedImage): FilterGroup {
  if (image.outcome === "fail") return "failures"
  if (image.outcome === "review") return "review"
  if (image.ai && AI_PROBLEMS.has(image.ai.verdict)) return "review"
  return "fine"
}
