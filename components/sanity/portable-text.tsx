'use client'

import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-10 -mx-4 sm:-mx-8 lg:-mx-12">
        <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={urlFor(value).width(1200).height(675).url()}
            alt={value.alt || 'Blog image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
          />
        </div>
        {value.caption && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center italic font-medium">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl sm:text-5xl font-bold mt-16 mb-8 text-slate-900 dark:text-white leading-tight tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl sm:text-4xl font-bold mt-14 mb-6 text-slate-900 dark:text-white leading-tight tracking-tight scroll-mt-20">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl sm:text-3xl font-bold mt-12 mb-5 text-slate-900 dark:text-white leading-tight tracking-tight scroll-mt-20">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl sm:text-2xl font-bold mt-10 mb-4 text-slate-900 dark:text-white leading-tight tracking-tight scroll-mt-20">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg sm:text-xl leading-relaxed mb-8 text-slate-700 dark:text-slate-300 font-normal">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-8 pr-6 my-10 italic text-xl sm:text-2xl text-slate-700 dark:text-slate-300 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent py-6 rounded-r-xl shadow-sm relative">
        <span className="text-6xl text-blue-500/20 absolute -top-4 -left-2 font-serif leading-none">"</span>
        <div className="relative z-10">{children}</div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-none mb-8 space-y-3 text-lg sm:text-xl text-slate-700 dark:text-slate-300">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-none mb-8 space-y-3 text-lg sm:text-xl text-slate-700 dark:text-slate-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="flex items-start gap-4 mb-3">
        <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
        <div className="flex-1">{children}</div>
      </li>
    ),
    number: ({ children }: any) => (
      <li className="flex items-start gap-4 mb-3 relative">
        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
          {/* Number will be added via CSS counter */}
        </span>
        <div className="flex-1">{children}</div>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-slate-800 dark:text-slate-200">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
        {children}
      </code>
    ),
    link: ({ value, children }: any) => (
      <a
        href={value.href}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 decoration-2 decoration-blue-600/30 hover:decoration-blue-600 dark:decoration-blue-400/30 dark:hover:decoration-blue-400 font-medium transition-all duration-200"
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : undefined}
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

export default function PortableTextRenderer({ 
  content, 
  className = '' 
}: PortableTextRendererProps) {
  return (
    <div className={`prose-content ${className}`}>
      <PortableText value={content} components={components} />
    </div>
  )
} 
 
 