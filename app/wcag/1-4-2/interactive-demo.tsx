"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Timer,
} from "lucide-react"

// A one-second silent WAV, looped, so the demo is genuinely audible-capable
// without shipping a real asset or startling the user. Same source the old
// page used for its simulation.
const SILENT_AUDIO =
  "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCF+x/DZgyEFl"

export default function AudioControlDemo() {
  // Compliant player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([50])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Non-compliant auto-play simulation state
  const [badPlaying, setBadPlaying] = useState(false)
  const [badSeconds, setBadSeconds] = useState(0)

  // Keep the real audio element in sync with volume / mute state.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
      audioRef.current.muted = isMuted
      audioRef.current.loop = true
    }
  }, [volume, isMuted])

  // Drive the fake "how long has it been auto-playing" counter.
  useEffect(() => {
    if (!badPlaying) return
    const id = setInterval(() => {
      setBadSeconds((s) => {
        if (s >= 8) {
          setBadPlaying(false)
          return 0
        }
        return s + 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [badPlaying])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying) {
      el.pause()
      setIsPlaying(false)
    } else {
      el.currentTime = 0
      void el.play().catch(() => {
        /* autoplay policies may reject silent playback; state still reflects intent */
      })
      setIsPlaying(true)
    }
  }

  const stop = () => {
    const el = audioRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
    setIsPlaying(false)
  }

  const toggleMute = () => setIsMuted((m) => !m)

  const startBadAudio = () => {
    setBadSeconds(0)
    setBadPlaying(true)
  }

  return (
    <div className="space-y-8">
      {/* Hidden real audio element controlled by the compliant player */}
      <audio ref={audioRef} src={SILENT_AUDIO} aria-hidden="true" />

      {/* Compliant example */}
      <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-6">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
            Compliant: user-controlled audio
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
          Nothing plays until you press Play, and you can pause or stop it at any
          time. The volume slider changes the audio level{" "}
          <em>independently of your operating-system volume</em> — exactly what
          1.4.2 asks for.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Button onClick={togglePlay} variant="outline" size="sm" className="gap-2">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={stop} variant="outline" size="sm" className="gap-2">
            <Square className="h-4 w-4" />
            Stop
          </Button>
          <Button
            onClick={toggleMute}
            variant="outline"
            size="sm"
            className="gap-2"
            aria-pressed={isMuted}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <label
            htmlFor="demo-volume"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Volume
          </label>
          <div className="flex-1 max-w-xs">
            <Slider
              id="demo-volume"
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              aria-label="Audio volume"
            />
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400 w-12 tabular-nums">
            {volume[0]}%
          </span>
        </div>

        {isPlaying && (
          <div className="mt-4 rounded-lg border border-green-200 dark:border-green-800 bg-white/60 dark:bg-slate-900/40 p-3 text-sm text-green-800 dark:text-green-300">
            Audio is playing at {volume[0]}%{isMuted ? " (muted)" : ""}. You are in
            control — pause, stop, or mute whenever you like.
          </div>
        )}
      </div>

      {/* Non-compliant example */}
      <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-300">
            Non-compliant: audio that just starts
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
          This simulates background audio that auto-plays on page load with no
          pause, stop, or volume control. For a screen-reader user it would drown
          out their speech output for as long as it runs. Press the button to see
          the problem play out (no real sound is emitted).
        </p>

        <Button
          onClick={startBadAudio}
          variant="destructive"
          size="sm"
          className="gap-2"
          disabled={badPlaying}
        >
          <AlertTriangle className="h-4 w-4" />
          Simulate auto-playing audio
        </Button>

        {badPlaying && (
          <div className="mt-4 rounded-lg border border-rose-200 dark:border-rose-800 bg-white/60 dark:bg-slate-900/40 p-4">
            <p className="font-medium text-rose-800 dark:text-rose-300 mb-2">
              Audio is auto-playing and cannot be stopped.
            </p>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
              <Timer className="h-4 w-4" aria-hidden="true" />
              <span className="tabular-nums">
                Playing for {badSeconds}s
                {badSeconds > 3 && " — already past the 3-second limit, this fails 1.4.2"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
