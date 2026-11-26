"use client"
import { useEffect, useRef, useState } from "react"
import { ExternalLink, Play } from "lucide-react"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
const link = `inline-flex min-h-11 items-center gap-1.5 rounded font-semibold text-blue-700 underline underline-offset-2 hover:decoration-2 dark:text-blue-300 ${ring}`

/**
 * A third-party demonstration video. Nothing is requested from the video host until the learner
 * presses play, and the written summary carries the lesson for anyone who does not watch.
 */
export function LessonVideo({ headingId, title, videoId, duration, credit, license, url, sourceUrl, summary }: {
  headingId: string
  title: string
  videoId: string
  duration: string
  credit: string
  license: string
  url: string
  sourceUrl: string
  summary: string
}) {
  const [playing, setPlaying] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)
  // The play button is replaced by the player, so focus has to follow it.
  useEffect(() => { if (playing) frame.current?.focus() }, [playing])
  return (
    <figure aria-labelledby={headingId} className="max-w-4xl overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
      <div className="relative aspect-video w-full bg-slate-950">
        {playing ? (
          <iframe
            ref={frame}
            title={`Video: ${title}`}
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&cc_load_policy=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className={`absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center text-white hover:bg-slate-900 ${ring}`}>
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-blue-700"><Play aria-hidden="true" focusable="false" className="h-7 w-7 translate-x-0.5" fill="currentColor" /></span>
            <span className="text-lg font-semibold">Play video: {title}<span className="sr-only">. </span></span>
            <span className="text-sm text-slate-200">{duration}. Playing loads the video from YouTube, with captions turned on.</span>
          </button>
        )}
      </div>
      <figcaption className="space-y-3 border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
        <p id={headingId} className="scroll-mt-4 text-lg font-semibold text-slate-900 dark:text-white"><span className="sr-only">Video: </span>{title} <span className="font-normal text-slate-600 dark:text-slate-400">({duration})</span></p>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">What the video shows</p>
          <p className="mt-1 max-w-[46rem] text-base leading-relaxed text-slate-700 dark:text-slate-300">{summary}</p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">Video by {credit}. License: {license}.</p>
        <ul role="list" className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <li><a href={url} rel="noopener noreferrer" className={link}>Watch on YouTube<ExternalLink aria-hidden="true" focusable="false" className="h-4 w-4" /></a></li>
          <li><a href={sourceUrl} rel="noopener noreferrer" className={link}>Read the publisher&apos;s page<ExternalLink aria-hidden="true" focusable="false" className="h-4 w-4" /></a></li>
        </ul>
      </figcaption>
    </figure>
  )
}
