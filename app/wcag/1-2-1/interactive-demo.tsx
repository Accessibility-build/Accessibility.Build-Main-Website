"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
  Play,
  Subtitles,
  Eye,
} from "lucide-react"

// Speak text using the browser's SpeechSynthesis API, guarded for SSR/support.
function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.9
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

export default function AudioAltDemo() {
  const [showTranscript, setShowTranscript] = useState(false)
  const [activeAudio, setActiveAudio] = useState<string | null>(null)
  const [transcriptText, setTranscriptText] = useState("")

  const playAudio = (text: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    setActiveAudio(id)
    speak(text, () => setActiveAudio(null))
  }

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <Button
          onClick={() => setShowTranscript(!showTranscript)}
          variant={showTranscript ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {showTranscript ? (
            <Subtitles className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
          {showTranscript ? "Hide transcripts" : "Show transcripts"}
        </Button>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Toggle to simulate the experience of a deaf or hard-of-hearing user who
          relies on the text alternative instead of the audio.
        </p>
      </div>

      {/* Good audio example */}
      <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-6">
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Good example: podcast with a complete transcript
        </h3>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-green-600" />
              <span className="font-medium text-slate-900 dark:text-white">
                Web Accessibility Podcast — Episode 5
              </span>
            </div>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() =>
                playAudio(
                  "Host: Welcome to Web Accessibility Today. I'm Sarah Johnson. Guest: And I'm Mike Chen from the A11y Initiative. Host: Today we're discussing WCAG requirements for media content.",
                  "good-audio",
                )
              }
              disabled={activeAudio === "good-audio"}
            >
              <Play className="h-4 w-4 mr-2" />
              {activeAudio === "good-audio" ? "Playing…" : "Play sample"}
            </Button>
          </div>

          {showTranscript && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 mb-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Complete transcript
              </h4>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  <strong>[Host]:</strong> Welcome to Web Accessibility Today. I&apos;m
                  Sarah Johnson.
                </p>
                <p>
                  <strong>[Guest]:</strong> And I&apos;m Mike Chen from the A11y
                  Initiative.
                </p>
                <p>
                  <strong>[Host]:</strong> Today we&apos;re discussing WCAG requirements
                  for media content.
                </p>
                <p>
                  <em>[Background music fades in for 3 seconds, then fades out]</em>
                </p>
                <p>
                  <strong>[Host]:</strong> Mike, can you tell us about the key
                  principles?
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-green-100/60 dark:bg-green-950/30 p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
              Why this passes
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Full transcript with speaker identification.</li>
              <li>• Describes important non-speech sounds such as the music.</li>
              <li>• Findable, keyboard accessible, and read by assistive tech.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bad audio example */}
      <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-6">
        <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-4 flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          Failing example: audio with no transcript
        </h3>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-rose-600" />
              <span className="font-medium text-slate-900 dark:text-white">
                Important Company Policy Update
              </span>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                playAudio(
                  "This is an important announcement about our new remote work policy that affects all employees. Please listen carefully to understand the new requirements and deadlines.",
                  "bad-audio",
                )
              }
              disabled={activeAudio === "bad-audio"}
            >
              <Play className="h-4 w-4 mr-2" />
              {activeAudio === "bad-audio" ? "Playing…" : "Play audio"}
            </Button>
          </div>

          {showTranscript && (
            <div className="rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-100/70 dark:bg-rose-950/30 p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="h-4 w-4 text-rose-600" />
                <span className="font-medium text-rose-800 dark:text-rose-300">
                  No transcript available
                </span>
              </div>
              <p className="text-sm text-rose-700 dark:text-rose-300">
                Deaf and hard-of-hearing employees cannot access this important policy
                information at all.
              </p>
            </div>
          )}

          <div className="rounded-lg bg-rose-100/70 dark:bg-rose-950/30 p-4">
            <h4 className="font-medium text-rose-800 dark:text-rose-300 mb-1">
              Problems with this approach
            </h4>
            <ul className="text-sm text-rose-700 dark:text-rose-300 space-y-1">
              <li>• No transcript for deaf or hard-of-hearing users.</li>
              <li>• Critical information is completely inaccessible.</li>
              <li>• Fails WCAG 1.2.1 at Level A.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Video example */}
      <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-6">
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Good example: silent animation with a detailed text alternative
        </h3>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <div className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 p-6 mb-4 text-center text-slate-600 dark:text-slate-400">
            <VolumeX className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Silent animation would play here</p>
            <p className="text-xs">(Keyboard navigation demonstration — no audio)</p>
          </div>

          {showTranscript && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 mb-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Text description of the visual content
              </h4>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Step 1:</strong> The user presses Tab. Focus moves to the
                  search button, highlighted with a blue outline.
                </p>
                <p>
                  <strong>Step 2:</strong> Tab is pressed again. Focus moves to the main
                  navigation menu.
                </p>
                <p>
                  <strong>Step 3:</strong> Arrow keys move through the menu items: Home,
                  About, Services, Contact.
                </p>
                <p>
                  <strong>Step 4:</strong> Enter is pressed on &quot;Services&quot;,
                  opening a submenu.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-green-100/60 dark:bg-green-950/30 p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
              Why this passes
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Every visual action is described step by step.</li>
              <li>• Specific visual feedback (the blue outline) is captured.</li>
              <li>
                • A blind user gets the same information as a sighted viewer. An audio
                description track would satisfy the requirement too.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transcript practice */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Practice writing a transcript
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Draft a transcript for an audio clip. The live feedback below checks for
          speaker labels and descriptions of important sounds — the two things authors
          most often forget.
        </p>
        <label
          htmlFor="transcript-practice"
          className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
        >
          Your transcript
        </label>
        <Textarea
          id="transcript-practice"
          placeholder={"[Host]: Welcome to our show...\n[Guest]: Thanks for having me...\n[Background music fades in for 5 seconds]"}
          className="h-40 mb-3"
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
        />
        <div className="mb-4 text-sm" aria-live="polite">
          {transcriptText.length === 0 ? (
            <span className="text-rose-600 dark:text-rose-400">
              A transcript is required for audio-only content.
            </span>
          ) : !transcriptText.includes("[") || !transcriptText.includes("]") ? (
            <span className="text-amber-600 dark:text-amber-400">
              Consider using [Speaker] labels so readers can follow who is talking.
            </span>
          ) : transcriptText.toLowerCase().includes("music") ||
            transcriptText.toLowerCase().includes("sound") ||
            transcriptText.toLowerCase().includes("applause") ? (
            <span className="text-green-600 dark:text-green-400">
              Great — you included important non-speech sound information.
            </span>
          ) : (
            <span className="text-blue-600 dark:text-blue-400">
              Good structure. Add descriptions of important sounds (music, applause) if
              they carry meaning.
            </span>
          )}
        </div>
        <Button
          onClick={() =>
            playAudio(
              `Screen reader reading transcript: ${transcriptText}`,
              "transcript-test",
            )
          }
          disabled={!transcriptText || activeAudio === "transcript-test"}
          className="flex items-center gap-2"
        >
          <Volume2 className="h-4 w-4" />
          {activeAudio === "transcript-test" ? "Reading…" : "Read aloud"}
        </Button>
      </div>
    </div>
  )
}
