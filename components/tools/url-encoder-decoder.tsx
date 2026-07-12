"use client"

import { useState } from "react"
import { ArrowLeftRight, Check, Copy, Link2, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type ConversionMode = "encode" | "decode"
type EncodingScope = "component" | "full-url"

const samples: Record<EncodingScope, string> = {
  component: "hello world & accessibility=true",
  "full-url": "https://example.com/search?q=hello world&lang=en",
}

export default function URLEncoderDecoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<ConversionMode>("encode")
  const [scope, setScope] = useState<EncodingScope>("component")
  const [copied, setCopied] = useState(false)

  const convert = () => {
    if (!input.trim()) {
      toast.error("Enter a URL or component to convert")
      return
    }

    try {
      if (mode === "encode") {
        setOutput(scope === "component" ? encodeURIComponent(input) : encodeURI(input))
      } else {
        setOutput(scope === "component" ? decodeURIComponent(input) : decodeURI(input))
      }
    } catch {
      setOutput("")
      toast.error("The value contains an invalid percent-encoding sequence")
    }
  }

  const swap = () => {
    if (!output) return
    setInput(output)
    setOutput("")
    setMode((current) => (current === "encode" ? "decode" : "encode"))
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const clear = () => {
    setInput("")
    setOutput("")
  }

  return (
    <section aria-labelledby="url-converter-heading" className="mx-auto max-w-5xl">
      <div className="mb-7">
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Developer utility</p>
        <h1 id="url-converter-heading" className="mt-1 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-white">
          URL encoder and decoder
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
          Encode a query value or preserve the structure of a complete URL. Conversion happens locally in your browser.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Conversion direction">
              {(["encode", "decode"] as const).map((item) => (
                <Button key={item} type="button" size="sm" variant={mode === item ? "default" : "ghost"} onClick={() => { setMode(item); setOutput("") }} aria-pressed={mode === item} className="capitalize">
                  {item}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Encoding scope">
              <Button type="button" size="sm" variant={scope === "component" ? "secondary" : "ghost"} onClick={() => { setScope("component"); setOutput("") }} aria-pressed={scope === "component"}>
                Component
              </Button>
              <Button type="button" size="sm" variant={scope === "full-url" ? "secondary" : "ghost"} onClick={() => { setScope("full-url"); setOutput("") }} aria-pressed={scope === "full-url"}>
                Full URL
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => { setInput(samples[scope]); setOutput("") }}>
              Load sample
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={clear} disabled={!input && !output}>
              <RotateCcw aria-hidden="true" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 lg:border-b-0 lg:border-r">
            <label htmlFor="url-input" className="font-semibold text-slate-900 dark:text-white">Input</label>
            <Textarea
              id="url-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={scope === "full-url" ? "https://example.com/search?q=hello world" : "query value or path segment"}
              spellCheck={false}
              className="mt-3 min-h-[240px] resize-y font-mono text-sm"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">{input.length.toLocaleString()} characters</span>
              <Button type="button" size="sm" onClick={convert}>{mode === "encode" ? "Encode" : "Decode"}</Button>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900 dark:text-white">Output</h2>
              <div className="flex gap-1">
                <Button type="button" size="icon" variant="ghost" onClick={swap} disabled={!output} aria-label="Use output as the next input">
                  <ArrowLeftRight aria-hidden="true" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={copyOutput} disabled={!output} aria-label="Copy output">
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </Button>
              </div>
            </div>
            <Textarea
              value={output}
              readOnly
              aria-label="Conversion output"
              placeholder="Converted value appears here"
              className="mt-3 min-h-[240px] resize-y bg-slate-50 font-mono text-sm dark:bg-slate-950"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
              <span>{output.length.toLocaleString()} characters</span>
              <span className="inline-flex items-center gap-1"><Link2 className="h-3.5 w-3.5" aria-hidden="true" />{scope === "component" ? "URL component" : "Complete URL"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-white">Component mode</h2>
          <p className="mt-1 leading-6 text-slate-600 dark:text-slate-400">Use for a query value, path segment, or form value. Reserved URL characters are encoded.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-white">Full URL mode</h2>
          <p className="mt-1 leading-6 text-slate-600 dark:text-slate-400">Use for a complete address. The scheme, slashes, query separators, and fragment marker are preserved.</p>
        </div>
      </div>
    </section>
  )
}
