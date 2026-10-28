import type { ReactNode } from "react"

// The root layout's skip link does not belong inside a widget iframed into
// someone else's site: it would be a keyboard stop that skips nothing, since
// embeds have no header to skip past. (The Curb assistant hides itself on
// /embed routes; see lib/assistant/config.ts.)
export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{".skip-link{display:none!important}"}</style>
      {children}
    </>
  )
}
