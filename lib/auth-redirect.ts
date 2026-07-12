export function safeAuthRedirect(value: string | string[] | undefined, fallback: string) {
  const candidate = Array.isArray(value) ? value[0] : value
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback
  }

  if (/[\u0000-\u001f\u007f]/.test(candidate)) {
    return fallback
  }

  return candidate
}
