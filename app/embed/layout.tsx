import type { ReactNode } from "react"

// Two root-layout pieces do not belong inside a widget iframed into someone
// else's site. The SAIRO script floats an "Ask a question" chat button over
// every page, so embeds hide its shadow host (the script tag itself stays in the
// root layout, where SAIRO's install check expects it). The skip link would be
// a keyboard stop that skips nothing, since embeds have no header to skip past.
export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{"[data-sairo],.skip-link{display:none!important}"}</style>
      {children}
    </>
  )
}
