"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Optional speech for the screen reader preview, through the browser's own speechSynthesis voices.
// It never starts on its own. Each transcript line is one utterance, so the page can highlight the
// line being spoken, and pausing cancels the current line and resumes from it: pause() and resume()
// on speechSynthesis are unreliable across browsers.

export type SpeechState = "stopped" | "playing" | "paused"

export interface SpeechItem {
  /** The line's position in the full transcript. */
  index: number
  text: string
}

export function useSpeech() {
  // The panel using this only mounts in the browser, after results arrive, so this is never server rendered.
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURI] = useState("")
  const [rate, setRate] = useState(1)
  const [state, setState] = useState<SpeechState>("stopped")
  // Each play gets a session number; callbacks from a cancelled session do nothing.
  const session = useRef(0)
  const settings = useRef({ rate: 1, voiceURI: "", voices: [] as SpeechSynthesisVoice[] })
  // Chrome can drop an utterance's end event if nothing holds a reference to it.
  const current = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    settings.current = { rate, voiceURI, voices }
  }, [rate, voiceURI, voices])

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const synth = window.speechSynthesis
    const load = () => {
      const list = synth.getVoices().slice()
      list.sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name))
      setVoices(list)
    }
    load()
    synth.addEventListener("voiceschanged", load)
    return () => {
      synth.removeEventListener("voiceschanged", load)
      session.current += 1
      synth.cancel()
    }
  }, [])

  /** Speaks the queue in order, calling onLine as each line starts. */
  const play = useCallback((queue: SpeechItem[], onLine: (index: number) => void, onFinish?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const synth = window.speechSynthesis
    synth.cancel()
    session.current += 1
    const id = session.current
    setState("playing")

    const speak = (position: number) => {
      if (session.current !== id) return
      const item = queue[position]
      if (!item) {
        current.current = null
        setState("stopped")
        onFinish?.()
        return
      }
      onLine(item.index)
      const utterance = new SpeechSynthesisUtterance(item.text)
      const { rate: speed, voiceURI: chosen, voices: available } = settings.current
      utterance.rate = speed
      const voice = available.find((candidate) => candidate.voiceURI === chosen)
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      }
      utterance.onend = () => speak(position + 1)
      utterance.onerror = (event) => {
        if (session.current !== id || event.error === "interrupted" || event.error === "canceled") return
        current.current = null
        setState("stopped")
      }
      current.current = utterance
      synth.speak(utterance)
    }
    speak(0)
  }, [])

  const halt = useCallback((next: SpeechState) => {
    session.current += 1
    current.current = null
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel()
    setState(next)
  }, [])

  const pause = useCallback(() => halt("paused"), [halt])
  const stop = useCallback(() => halt("stopped"), [halt])

  return { supported, voices, voiceURI, setVoiceURI, rate, setRate, state, play, pause, stop }
}
