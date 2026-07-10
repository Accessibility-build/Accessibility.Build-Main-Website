'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { Check, Copy } from 'lucide-react'

// Multi-line code block with a filename/language bar and a copy button.
function CodeBlock({ value }: { value: { code?: string; language?: string; filename?: string } }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (!value.code) return
    navigator.clipboard?.writeText(value.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">{value.filename || value.language || 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-slate-400 transition-colors hover:text-white"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-slate-100">{value.code}</code>
      </pre>
    </figure>
  )
}

const components = {
  types: {
    image: ({ value }: any) => (
      <figure className="not-prose my-10">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 shadow-sm dark:bg-slate-800">
          <Image
            src={urlFor(value).width(1400).height(788).url()}
            alt={value.alt || ''}
            fill
            sizes="(max-width: 768px) 100vw, 736px"
            className="object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="mt-3 text-center font-sans text-sm italic text-slate-500 dark:text-slate-400">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    code: ({ value }: any) => <CodeBlock value={value} />,
  },
  marks: {
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
}

interface PortableTextRendererProps {
  content: any
  className?: string
}

export default function PortableTextRenderer({ content, className = '' }: PortableTextRendererProps) {
  return (
    <div className={`prose-content ${className}`}>
      <PortableText value={content} components={components} />
    </div>
  )
}
