// Shared rules and shapes for case study comments.
//
// This module is imported by the browser bundle, so it must stay free of Node
// built-ins and database types. Anything needing those lives in
// lib/case-comments-server.ts.

export const COMMENT_MIN_LENGTH = 2
export const COMMENT_MAX_LENGTH = 2000

export interface CommentValidationResult {
  ok: boolean
  /** Field-level errors, keyed by input name so the UI can link to them. */
  errors: Record<string, string>
  /** Normalised body, present only when ok is true. */
  value?: string
}

/**
 * Validates and normalises a comment body. Control characters are stripped and
 * runs of blank lines collapsed, but the text is otherwise left alone: it is
 * escaped at render time by React, never interpolated into HTML.
 */
export function validateCommentBody(raw: unknown): CommentValidationResult {
  const errors: Record<string, string> = {}

  if (typeof raw !== "string") {
    errors.body = "Write a comment before posting."
    return { ok: false, errors }
  }

  const normalised = raw
    // Strip control characters, keeping tab and newline.
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  if (normalised.length < COMMENT_MIN_LENGTH) {
    errors.body = "Write a comment before posting."
  } else if (normalised.length > COMMENT_MAX_LENGTH) {
    errors.body = `Comments are limited to ${COMMENT_MAX_LENGTH.toLocaleString("en-US")} characters. Yours is ${normalised.length.toLocaleString("en-US")}.`
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, errors: {}, value: normalised }
}

/** The comment shape sent to the browser. Never includes IP or user agent. */
export interface PublicComment {
  id: string
  authorName: string
  authorImage: string | null
  body: string
  createdAt: string
  /** True when the comment was written by the site owner. */
  isAuthor: boolean
}
