export function safeAuthRedirect(value: string | string[] | undefined, fallback: string) {
  const candidate = Array.isArray(value) ? value[0] : value
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback
  }

  // Browsers normalize backslashes as URL separators, so /\host can leave the site.
  if (candidate.includes("\\") || /[\u0000-\u001f\u007f]/.test(candidate)) {
    return fallback
  }

  return candidate
}
