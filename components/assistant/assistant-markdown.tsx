import { Fragment, type ReactNode } from "react"
import Link from "next/link"

// A deliberately small Markdown renderer for assistant answers. It builds React elements
// (never HTML strings), so model output cannot inject markup, and it only links to site
// paths and http(s) or mailto URLs. Supported: paragraphs, bullet and numbered lists, fenced
// code, inline code, bold, italic, links and block quotes. Headings render as bold paragraphs
// so they do not break the page's heading outline. It is called on every streamed chunk, so
// an unclosed code fence simply runs to the end of the text.

function safeHref(url: string): string | null {
  if (url.startsWith("/") && !url.startsWith("//")) return url
  if (url.startsWith("#")) return url
  if (/^(https?:\/\/|mailto:)/i.test(url)) return url
  return null
}

const INLINE =
  /(`[^`\n]+`)|\[([^\]\n]+)\]\(([^)\s]+)\)|\*\*([^*\n]+)\*\*|__([^_\n]+)__|\*([^*\s][^*\n]*?)\*|(?<![A-Za-z0-9])_([^_\s][^_\n]*?)_(?![A-Za-z0-9])/

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  let rest = text
  let i = 0
  while (rest) {
    const match = INLINE.exec(rest)
    if (!match) {
      out.push(rest)
      break
    }
    if (match.index > 0) out.push(rest.slice(0, match.index))
    const key = `${keyPrefix}-${i++}`
    const [whole, code, linkText, linkUrl, bold1, bold2, em1, em2] = match
    if (code) {
      out.push(
        <code key={key} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
          {code.slice(1, -1)}
        </code>,
      )
    } else if (linkText) {
      const href = safeHref(linkUrl)
      const children = inline(linkText, key)
      const className =
        "font-medium text-primary underline underline-offset-2 hover:decoration-2"
      if (!href) out.push(<Fragment key={key}>{children}</Fragment>)
      else if (href.startsWith("/") || href.startsWith("#"))
        out.push(
          <Link key={key} href={href} className={className}>
            {children}
          </Link>,
        )
      else
        out.push(
          <a key={key} href={href} className={className} rel="noopener noreferrer">
            {children}
          </a>,
        )
    } else if (bold1 || bold2) {
      out.push(
        <strong key={key} className="font-semibold text-foreground">
          {inline(bold1 || bold2, key)}
        </strong>,
      )
    } else if (em1 || em2) {
      out.push(<em key={key}>{inline(em1 || em2, key)}</em>)
    } else {
      out.push(whole)
    }
    rest = rest.slice(match.index + whole.length)
  }
  return out
}

type Block =
  | { type: "p"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "list"; ordered: boolean; start: number; items: string[] }

function parse(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n")
  const blocks: Block[] = []
  let paragraph: string[] = []
  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") })
    paragraph = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = line.match(/^\s*```\s*([\w+-]*)/)
    if (fence) {
      flush()
      const body: string[] = []
      i++
      while (i < lines.length && !/^\s*```/.test(lines[i])) body.push(lines[i++])
      blocks.push({ type: "code", lang: fence[1], text: body.join("\n") })
      continue
    }
    if (!line.trim()) {
      flush()
      continue
    }
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.*)$/)
    if (heading) {
      flush()
      blocks.push({ type: "heading", text: heading[1] })
      continue
    }
    const quote = line.match(/^\s{0,3}>\s?(.*)$/)
    if (quote) {
      flush()
      const previous = blocks[blocks.length - 1]
      if (previous?.type === "quote") previous.text += ` ${quote[1]}`
      else blocks.push({ type: "quote", text: quote[1] })
      continue
    }
    const item = line.match(/^\s*(?:([-*+])|(\d+)[.)])\s+(.*)$/)
    if (item) {
      flush()
      const ordered = Boolean(item[2])
      const previous = blocks[blocks.length - 1]
      if (previous?.type === "list" && previous.ordered === ordered) previous.items.push(item[3])
      else blocks.push({ type: "list", ordered, start: ordered ? Number(item[2]) : 1, items: [item[3]] })
      continue
    }
    // A wrapped line directly under a list item continues that item.
    const previous = blocks[blocks.length - 1]
    if (!paragraph.length && previous?.type === "list" && /^\s{2,}\S/.test(line)) {
      previous.items[previous.items.length - 1] += ` ${line.trim()}`
      continue
    }
    paragraph.push(line.trim())
  }
  flush()
  return blocks
}

export function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-3 break-words text-sm leading-6 text-foreground">
      {parse(content).map((block, i) => {
        const key = `b${i}`
        switch (block.type) {
          case "code":
            return (
              <pre
                key={key}
                className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-100 dark:bg-black"
                tabIndex={0}
                role="group"
                aria-label={block.lang ? `${block.lang} code example` : "Code example"}
              >
                <code>{block.text}</code>
              </pre>
            )
          case "list": {
            const items = block.items.map((item, j) => <li key={`${key}-${j}`}>{inline(item, `${key}-${j}`)}</li>)
            return block.ordered ? (
              <ol key={key} start={block.start} className="list-decimal space-y-1 pl-5">
                {items}
              </ol>
            ) : (
              <ul key={key} className="list-disc space-y-1 pl-5">
                {items}
              </ul>
            )
          }
          case "heading":
            return (
              <p key={key} className="font-semibold text-foreground">
                {inline(block.text, key)}
              </p>
            )
          case "quote":
            return (
              <blockquote key={key} className="border-l-2 border-primary pl-3 text-muted-foreground">
                {inline(block.text, key)}
              </blockquote>
            )
          default:
            return <p key={key}>{inline(block.text, key)}</p>
        }
      })}
    </div>
  )
}

/** Plain text for the screen reader announcement once an answer is complete. */
export function markdownToPlainText(content: string): string {
  return content
    .replace(/```[\w+-]*\n?/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim()
}
