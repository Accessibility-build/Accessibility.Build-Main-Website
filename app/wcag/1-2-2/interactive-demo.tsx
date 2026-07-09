"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const mockCaptions = [
  { start: 0, end: 3, text: "Welcome to our accessibility workshop." },
  { start: 3, end: 6, text: "[Dr. Lee]: Today we'll learn about video captions." },
  { start: 6, end: 9, text: "[Upbeat music starts] Captions help deaf and hard of hearing users." },
  { start: 9, end: 12, text: "They also help people in noisy or sound-off environments." },
  { start: 12, end: 15, text: "[Applause] Let's see how to implement them properly." },
]

const fmt = (s: number) => `0:${s.toString().padStart(2, "0")}`

export default function CaptionsDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCaptions, setShowCaptions] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [captionText, setCaptionText] = useState("")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + 1 >= 15) {
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying])

  const activeCaption =
    mockCaptions.find((c) => currentTime >= c.start && currentTime < c.end)?.text ??
    "Welcome to our accessibility workshop."

  const hasTiming = /\d+:\d+/.test(captionText)
  const hasNonSpeech = captionText.includes("[") && captionText.includes("]")
  const feedback =
    captionText.trim().length === 0
      ? { tone: "rose", msg: "Captions are required — a video with audio and no captions fails 1.2.2." }
      : !hasTiming
        ? { tone: "amber", msg: "Add timestamps (e.g. 0:00 - 0:03) so captions can be synchronized." }
        : !hasNonSpeech
          ? { tone: "blue", msg: "Add speaker labels and non-speech audio, e.g. [Dr. Lee]: or [applause]." }
          : { tone: "green", msg: "Strong captions — timed, with speaker identification and non-speech sounds." }

  const feedbackClasses: Record<string, string> = {
    rose: "border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300",
    amber: "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300",
    blue: "border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300",
    green: "border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300",
  }

  return (
    <div className="space-y-8">
      {/* Simulated player */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <Button
            onClick={() => setShowCaptions((v) => !v)}
            variant={showCaptions ? "default" : "outline"}
          >
            {showCaptions ? "Hide captions" : "Show captions"}
          </Button>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Turn captions off to experience the video the way a deaf or hard-of-hearing
            user would without them.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-slate-900">
          <div className="aspect-video flex items-center justify-center">
            <div className="text-center text-white/80">
              <p className="text-sm">Accessibility Workshop (simulated video)</p>
              <p className="text-xs text-white/50 mt-1">Audio plays here</p>
            </div>
          </div>
          {showCaptions && (
            <div className="absolute inset-x-4 bottom-4 rounded border border-white/20 bg-black/85 px-3 py-2">
              <p className="text-center text-sm font-medium text-white">{activeCaption}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded bg-slate-100 dark:bg-slate-800 p-3">
          <Button size="sm" onClick={() => setIsPlaying((v) => !v)}>
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {fmt(currentTime)} / 0:15
          </span>
        </div>

        {showCaptions && (
          <div className="mt-4 rounded bg-slate-50 dark:bg-slate-900/40 p-4">
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
              Full caption track
            </h3>
            <div className="space-y-1 text-sm">
              {mockCaptions.map((c) => {
                const active = currentTime >= c.start && currentTime < c.end
                return (
                  <p
                    key={c.start}
                    className={
                      active
                        ? "font-medium text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400"
                    }
                  >
                    {fmt(c.start)} - {fmt(c.end)}: {c.text}
                  </p>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Practice box */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
          Practice writing captions
        </h3>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          Write captions for a short clip. Include timestamps, speaker identification,
          and non-speech audio — the feedback updates as you type.
        </p>
        <Textarea
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value)}
          placeholder={`0:00 - 0:03: Welcome to our tutorial.
0:03 - 0:06: [Instructor]: Today we'll learn navigation.
0:06 - 0:09: [Upbeat music starts]
0:09 - 0:12: First, let's open the screen reader...`}
          className="h-40"
        />
        <div
          className={`mt-3 rounded-lg border p-3 text-sm ${feedbackClasses[feedback.tone]}`}
        >
          {feedback.msg}
        </div>
      </div>
    </div>
  )
}
