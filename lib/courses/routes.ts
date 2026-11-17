/** Only the private learning workspace, never the course catalogue or sales pages. */
export function isCourseLearningPath(pathname: string | null | undefined): boolean {
  return Boolean(pathname && /^\/courses\/[^/]+\/learn(?:\/|$)/.test(pathname))
}
