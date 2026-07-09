"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  AudioWaveform,
  FileText,
  Eye,
  EyeOff,
  VideoIcon,
} from "lucide-react"

interface Description {
  start: number
  end: number
  text: string
}

const descriptions: Description[] = [
  { start: 0, end: 4, text: "A woman in a blue suit stands in front of a whiteboard covered with accessibility diagrams." },
  { start: 4, end: 8, text: "She points to a flowchart showing website navigation paths and user interactions." },
  { start: 8, end: 12, text: "Close-up of her hands typing on a laptop keyboard, demonstrating assistive technology." },
  { start: 12, end: 16, text: "The screen shows code examples with highlighted ARIA labels and semantic HTML." },
  { start: 16, end: 20, text: "She gestures toward the audience while explaining accessibility best practices." },
]

export default function MediaAltDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDescriptionOn, setAudioDescriptionOn] = useState(true)
  const [showMediaAlternative, setShowMediaAlternative] = useState(false)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + 1 >= 20 ? 0 : prev + 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const currentDescription =
    descriptions.find((d) => currentTime >= d.start && currentTime < d.end)?.text || ""

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          A video with audio description
        </h3>

        {/* Mock video surface */}
        <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-4">
          <div className="aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              {audioDescriptionOn ? (
                <VideoIcon className="h-14 w-14 mx-auto mb-2 opacity-75" aria-hidden="true" />
              ) : (
                <EyeOff className="h-14 w-14 mx-auto mb-2 opacity-75" aria-hidden="true" />
              )}
              <p className="text-sm opacity-75">Accessibility Training Video</p>
            </div>
          </div>

          {audioDescriptionOn && currentDescription && (
            <div className="absolute top-4 left-4 right-4 bg-emerald-600/90 text-white p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <AudioWaveform className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Audio description
                </span>
              </div>
              <p className="text-sm">{currentDescription}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-slate-100 dark:bg-slate-800 p-3 mb-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400 tabular-nums">
              {formatTime(currentTime)} / 0:20
            </span>
          </div>
          <Button
            size="sm"
            variant={audioDescriptionOn ? "default" : "outline"}
            onClick={() => setAudioDescriptionOn((a) => !a)}
            className="flex items-center gap-2"
          >
            {audioDescriptionOn ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {audioDescriptionOn ? "Audio description on" : "Audio description off"}
          </Button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          Press play and toggle the description off. With it off, a blind user gets only
          the dialogue — the actions, gestures, and on-screen code are lost. That gap is
          exactly what WCAG 1.2.3 asks you to close.
        </p>
      </div>

      {/* Media alternative */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowMediaAlternative((s) => !s)}
          className="flex items-center gap-2"
          aria-expanded={showMediaAlternative}
        >
          <FileText className="h-4 w-4" />
          {showMediaAlternative ? "Hide" : "Show"} full text media alternative
        </Button>

        {showMediaAlternative && (
          <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Complete media alternative
            </h4>
            <p>
              <strong>Scene:</strong> A training video filmed in a modern conference room.
              The presenter, a woman in a navy blue suit, stands beside a wall-mounted
              whiteboard.
            </p>
            <p>
              <strong>0:00–0:04:</strong> She points to a hand-drawn flowchart showing
              website navigation paths.{" "}
              <em>
                &ldquo;Welcome to our accessibility workshop. Today we&rsquo;ll learn how
                to make websites more accessible.&rdquo;
              </em>
            </p>
            <p>
              <strong>0:08–0:12:</strong> The camera zooms to her laptop, showing a code
              editor. She points to lines containing ARIA labels and alt text.{" "}
              <em>
                &ldquo;Semantic HTML and ARIA labels help screen readers understand page
                structure.&rdquo;
              </em>
            </p>
            <p>
              This standalone document conveys both the dialogue and the visual content,
              satisfying 1.2.3 as a media alternative even without a separate audio
              description track.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
