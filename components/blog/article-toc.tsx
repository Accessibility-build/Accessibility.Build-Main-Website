'use client'

import { useEffect, useState } from 'react'

type TocItem = { id: string; text: string; level: number }

function slugify(text: string, index: number) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return base || `section-${index}`
}

/**
 * Sticky, scroll-spy table of contents built from the rendered article's
 * headings. Assigns ids to headings that lack them, then highlights the
 * section currently in view. Rendered only on wide screens.
 */
export function ArticleToc({ containerId = 'article-body' }: { containerId?: string }) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    const headings = Array.from(container.querySelectorAll('h2, h3')) as HTMLElement[]
    const used = new Set<string>()
    const list: TocItem[] = headings.map((heading, index) => {
      let id = heading.id
      if (!id) {
        id = slugify(heading.textContent || '', index)
        let unique = id
        let n = 1
        while (used.has(unique)) unique = `${id}-${n++}`
        id = unique
        heading.id = id
      }
      used.add(id)
      return { id, text: heading.textContent || '', level: Number(heading.tagName[1]) }
    })
    setItems(list)

    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId((visible[0].target as HTMLElement).id)
      },
      { rootMargin: '-96px 0px -66% 0px', threshold: [0, 1] }
    )
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [containerId])

  if (items.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="font-sans text-sm">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        On this page
      </div>
      <ul className="space-y-1 border-l border-slate-200 dark:border-slate-800">
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`-ml-px block border-l-2 py-1 transition-colors ${
                  item.level === 3 ? 'pl-6' : 'pl-4'
                } ${
                  active
                    ? 'border-blue-500 font-medium text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
