/** Clerk's verification and recovery steps live under these catch-all routes. */
export function isAuthPath(pathname: string | null | undefined): boolean {
  return Boolean(pathname && /^\/(?:sign-in|sign-up)(?:\/|$)/.test(pathname))
}

export function isDashboardPath(pathname: string | null | undefined): boolean {
  return Boolean(pathname && /^\/dashboard(?:\/|$)/.test(pathname))
}

export function isAccountWorkspacePath(pathname: string | null | undefined): boolean {
  return isAuthPath(pathname) || isDashboardPath(pathname)
}
