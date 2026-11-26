/** Only the private learning workspace, never the course catalogue or sales pages. */
export function isCourseLearningPath(pathname: string | null | undefined): boolean {
  return Boolean(pathname && /^\/courses\/[^/]+\/learn(?:\/|$)/.test(pathname))
}

/** Print render targets (a certificate, a course checklist) render alone, without site navigation. */
export function isCertificatePrintPath(pathname: string | null | undefined): boolean {
  return /^\/certificates\/[^/]+\/print\/?$/.test(pathname ?? "") || /^\/toolkit\/[^/]+\/checklist\/?$/.test(pathname ?? "")
}
