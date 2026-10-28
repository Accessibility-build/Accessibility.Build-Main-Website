/**
 * Browser-side helper for the URL tools. Every tool route answers errors as `{ error }`, and the
 * shared rate limiter answers 429 as `{ error, message }`; this returns the sentence to show.
 */
export async function postTool<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error
    throw new Error("We couldn't reach the server. Check your connection and try again.")
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data?.message || data?.error
    throw new Error(
      typeof message === "string" && message
        ? message
        : response.status === 504
          ? "The check took too long. Try again, or try a lighter page."
          : "The check failed. Please try again.",
    )
  }
  return data as T
}
