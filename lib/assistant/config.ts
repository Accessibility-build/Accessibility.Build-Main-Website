// Shared settings for Curb, the site's accessibility assistant. Imported by the widget
// (client) and the API route (server), so nothing secret belongs here.
//
// Curb is named after the curb cut: a change made for disabled people that turned out to
// help everyone. Rename it here and every label, prompt and announcement follows.

export const ASSISTANT_NAME = "Curb"
export const ASSISTANT_TAGLINE = "Accessibility assistant"
export const ASSISTANT_ENDPOINT = "/api/assistant"
export const ASSISTANT_FEEDBACK_ENDPOINT = "/api/assistant/feedback"
export const ASSISTANT_EVENTS_ENDPOINT = "/api/assistant/events"
/** Where the visitor is with the contact form in this chat. Sent with each question. */
export type LeadState = "none" | "offered" | "submitted" | "dismissed"
export const ASSISTANT_LEAD_ENDPOINT = "/api/assistant/lead"

/**
 * Separates the answer text from the metadata the server appends once the answer is complete
 * (whether to show the contact form, and what to prefill it with). The model never writes it.
 */
export const META_SEPARATOR = "\u001e"

export interface LeadOffer {
  services: string[]
  prefill: { name: string; email: string; organisation: string; website: string; message: string }
}

/** Window event the "Ask Curb" skip link dispatches to open the panel. */
export const ASSISTANT_OPEN_EVENT = "curb-assistant:open"

export const ASSISTANT_LIMITS = {
  /** Longest question a visitor can send. */
  maxQuestionChars: 1000,
  /** Earlier messages sent back as conversation history. */
  maxHistoryMessages: 10,
  /** Characters of the current page's text sent with each question. */
  maxPageChars: 6000,
  /** Messages kept in sessionStorage between page loads. */
  maxStoredMessages: 30,
} as const

/** Routes where the widget is not shown at all. */
export const HIDDEN_ROUTE_PREFIXES = ["/embed", "/admin"]

/**
 * Routes that can show a visitor's own data (account, billing, scan results). The widget
 * still works there, but it does not send the page's text with the question.
 */
export const PRIVATE_ROUTE_PREFIXES = [
  "/dashboard",
  "/billing",
  "/account",
  "/settings",
  "/profile",
  "/onboarding",
  "/welcome",
  "/reports",
  "/sign-in",
  "/sign-up",
  "/desktop/connect",
]

export function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export interface AssistantSource {
  path: string
  title: string
}

/**
 * Every reply starts with a marker such as "[[lang:fr]]" naming the language it is written in,
 * so the widget can set the lang attribute on it (WCAG 3.1.2 Language of Parts) and screen
 * readers switch pronunciation. The marker is never shown or stored.
 */
const LANGUAGE_MARKER = /^\s*\[\[lang:([A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*)\]\]\s*/

export function splitLanguageMarker(raw: string): { lang: string | null; text: string; pending: boolean } {
  const match = raw.match(LANGUAGE_MARKER)
  if (match) return { lang: match[1].toLowerCase(), text: raw.slice(match[0].length), pending: false }
  // The first streamed characters may be a marker that has not finished arriving.
  const trimmed = raw.trimStart()
  if (trimmed.startsWith("[") && !trimmed.includes("]]") && trimmed.length < 24) return { lang: null, text: "", pending: true }
  return { lang: null, text: raw, pending: false }
}
