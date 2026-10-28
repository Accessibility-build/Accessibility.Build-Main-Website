import type { AiVerdictKind, CheckedImage, Outcome } from "./types"

export const OUTCOME_LABEL: Record<Outcome, string> = {
  fail: "Fails a rule",
  review: "Needs review",
  decorative: "Decorative and fine",
  pass: "No rule problems",
}

export const VERDICT_LABEL: Record<AiVerdictKind, string> = {
  accurate: "Accurate",
  incomplete: "Incomplete",
  inaccurate: "Inaccurate",
  should_be_decorative: "Should be decorative",
  decorative_and_fine: "Decorative and fine",
  needs_alt: "Missing: needs alt",
}

export const KIND_LABEL: Record<CheckedImage["kind"], string> = {
  img: "img",
  "input-image": "image button",
  area: "image map area",
  "role-img": 'role="img"',
  svg: "svg",
}

/** The current text alternative as a person should read it: verbatim, or a clear missing or empty state. */
export function currentAltLabel(image: CheckedImage): string {
  if (image.kind === "svg" || image.kind === "role-img") {
    if (image.ariaHidden) return "Hidden (aria-hidden)"
    return image.name ? `${image.nameSource}: ${image.name}` : "No name"
  }
  if (image.altState === "missing") return image.name ? `No alt attribute (${image.nameSource}: ${image.name})` : "No alt attribute"
  if (image.altState === "empty") return image.name ? `alt="" (${image.nameSource}: ${image.name})` : 'Empty (alt="")'
  return image.alt ?? ""
}

// A cell that starts with = + - or @ runs as a formula in Excel and Sheets; alt text comes from
// someone else's page, so it is neutralised with a leading apostrophe.
function cell(value: string | number | null | undefined): string {
  let text = value == null ? "" : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(images: CheckedImage[]): string {
  const header = [
    "Image",
    "Element",
    "Current alt",
    "Result",
    "Findings",
    "WCAG",
    "AI verdict",
    "AI reason",
    "Suggested alt",
    "Inside",
    "Link destination",
    "Source",
    "Rendered size",
  ]
  const rows = images.map((image) => {
    const criteria = Array.from(new Set(image.findings.flatMap((finding) => finding.wcag.map((ref) => ref.id))))
    return [
      image.id,
      KIND_LABEL[image.kind],
      currentAltLabel(image),
      OUTCOME_LABEL[image.outcome],
      image.findings.map((finding) => finding.title).join("; "),
      criteria.join(" "),
      image.ai ? VERDICT_LABEL[image.ai.verdict] : "",
      image.ai?.reason ?? "",
      image.ai ? image.ai.suggestedAlt || 'alt=""' : "",
      image.control && !image.control.self ? image.control.kind : "",
      image.control?.href ?? "",
      image.src ?? "",
      `${image.width}x${image.height}`,
    ]
      .map(cell)
      .join(",")
  })
  return [header.map(cell).join(","), ...rows].join("\r\n")
}
