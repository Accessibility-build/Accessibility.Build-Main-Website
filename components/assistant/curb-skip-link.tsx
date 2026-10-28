"use client"

import { usePathname } from "next/navigation"
import { ASSISTANT_NAME, ASSISTANT_OPEN_EVENT, HIDDEN_ROUTE_PREFIXES, matchesPrefix } from "@/lib/assistant/config"

// A second skip link, straight after "Skip to main content". The floating "Ask Curb" button
// sits at the end of the page in tab order (over a hundred Tab presses on a long guide), so
// keyboard users get a way to open the assistant from the top of any page. It is a button
// because it opens a panel rather than going somewhere.
export function CurbSkipLink() {
  const pathname = usePathname() ?? "/"
  if (matchesPrefix(pathname, HIDDEN_ROUTE_PREFIXES)) return null
  return (
    <button type="button" className="skip-link" onClick={() => window.dispatchEvent(new Event(ASSISTANT_OPEN_EVENT))}>
      Ask {ASSISTANT_NAME}, the accessibility assistant
    </button>
  )
}
