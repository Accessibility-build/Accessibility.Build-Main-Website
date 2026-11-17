// Small, static icon set for the DOM-owned practice UI. No HTML or remote assets.
const paths = {
  exam: ["M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3", "M9 2h6v4H9z", "m8 13 3 3 5-6"],
  topics: ["m3 6 1.5 1.5L7 5", "M11 6h10", "m3 12 1.5 1.5L7 11", "M11 12h10", "m3 18 1.5 1.5L7 17", "M11 18h10"],
  quiz: ["m13 2-9 12h7l-1 8 10-12h-7l1-8Z"],
  review: ["M3 11a9 9 0 1 1 2.7 7.4", "M3 4v7h7", "M12 7v5l3 2"],
  cards: ["M8 8h13v13H8z", "M16 4H4v12", "M12 12h5", "M12 16h3"],
  previous: ["M20 12H4", "m10 6-6 6 6 6"],
  next: ["M4 12h16", "m14 6 6 6-6 6"],
  flag: ["M5 21V3", "M5 4c5-4 9 4 14 0v10c-5 4-9-4-14 0"],
  pause: ["M6 4h4v16H6z", "M14 4h4v16h-4z"],
  play: ["m8 4 12 8-12 8V4Z"],
  download: ["M12 3v12", "m7 10 5 5 5-5", "M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"],
  save: ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z", "M7 3v6h9V3", "M7 21v-7h10v7"],
  list: ["M9 6h12", "M9 12h12", "M9 18h12", "M3 6h1", "M3 12h1", "M3 18h1"],
  check: ["m5 12 4 4L19 6"],
  home: ["m3 10 9-7 9 7", "M5 9v12h14V9", "M9 21v-8h6v8"],
  reveal: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z", "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"],
} as const

export type PracticeIconName = keyof typeof paths

/** Icons accompany visible text; they never supply the control's accessible name. */
export function createPracticeIcon(name: PracticeIconName, owner: Document = document): SVGSVGElement {
  const namespace = "http://www.w3.org/2000/svg"
  const icon = owner.createElementNS(namespace, "svg")
  const attributes = {
    viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor",
    "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round",
    "aria-hidden": "true", focusable: "false", class: "practice-icon", "data-practice-icon": name,
  }
  for (const [key, value] of Object.entries(attributes)) icon.setAttribute(key, value)
  for (const data of paths[name]) {
    const path = owner.createElementNS(namespace, "path")
    path.setAttribute("d", data)
    icon.appendChild(path)
  }
  return icon
}
