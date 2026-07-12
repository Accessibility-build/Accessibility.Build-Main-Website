"use client"

import { useMemo, useRef, useState } from "react"
import { ArrowLeftRight, Binary, Check, Copy, Download, FileUp, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type ConversionMode = "encode" | "decode"
type InputType = "text" | "file"

function bytesToBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000
  let binary = ""
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

function encodeUtf8(value: string): string {
  return bytesToBase64(new TextEncoder().encode(value))
}

function decodeUtf8(value: string): string {
  const normalized = value.trim().replace(/^data:[^,]+,/, "").replace(/\s+/g, "")
  const binary = atob(normalized)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
}

export default function Base64Converter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<ConversionMode>("encode")
  const [inputType, setInputType] = useState<InputType>("text")
  const [fileName, setFileName] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const inputBytes = useMemo(() => new TextEncoder().encode(input).byteLength, [input])
  const outputBytes = useMemo(() => new TextEncoder().encode(output).byteLength, [output])

  const convert = () => {
    if (!input.trim()) {
      toast.error("Enter content to convert")
      return
    }

    try {
      setOutput(mode === "encode" ? encodeUtf8(input) : decodeUtf8(input))
    } catch {
      setOutput("")
      toast.error(mode === "decode" ? "This is not valid UTF-8 Base64 content" : "The input could not be encoded")
    }
  }

  const loadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      setFileName(file.name)
      setMode("encode")
      setOutput(bytesToBase64(bytes))
      toast.success(`${file.name} encoded locally`)
    } catch {
      toast.error("The file could not be read")
    }
  }

  const swap = () => {
    if (!output) return
    setInput(output)
    setOutput("")
    setFileName(null)
    setInputType("text")
    setMode((current) => (current === "encode" ? "decode" : "encode"))
  }

  const clear = () => {
    setInput("")
    setOutput("")
    setFileName(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = mode === "encode" ? `${fileName || "encoded"}.base64.txt` : "decoded.txt"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-labelledby="base64-heading" className="mx-auto max-w-5xl">
      <div className="mb-7">
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Developer utility</p>
        <h1 id="base64-heading" className="mt-1 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-white">
          Base64 encoder and decoder
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
          Convert Unicode text or files entirely in your browser. Nothing is uploaded or retained.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Conversion direction">
            {(["encode", "decode"] as const).map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={mode === item ? "default" : "ghost"}
                onClick={() => {
                  setMode(item)
                  setOutput("")
                }}
                aria-pressed={mode === item}
                className="capitalize"
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => {
              setInput(mode === "encode" ? "Accessibility works best when it is built in." : "QWNjZXNzaWJpbGl0eSB3b3JrcyBiZXN0IHdoZW4gaXQgaXMgYnVpbHQgaW4u")
              setInputType("text")
              setFileName(null)
              setOutput("")
            }}>
              Load sample
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={clear} disabled={!input && !output && !fileName}>
              <RotateCcw aria-hidden="true" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label htmlFor="base64-input" className="font-semibold text-slate-900 dark:text-white">Input</label>
              {mode === "encode" && (
                <div className="flex gap-1" role="group" aria-label="Input type">
                  {(["text", "file"] as const).map((item) => (
                    <Button key={item} type="button" size="sm" variant={inputType === item ? "secondary" : "ghost"} onClick={() => setInputType(item)} aria-pressed={inputType === item} className="capitalize">
                      {item}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {inputType === "file" && mode === "encode" ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                <FileUp className="h-8 w-8 text-slate-400" aria-hidden="true" />
                <p className="mt-3 font-medium text-slate-900 dark:text-white">{fileName || "Choose a file"}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The file is read and encoded locally.</p>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                  Browse files
                </Button>
                <input ref={fileInputRef} type="file" className="sr-only" onChange={loadFile} />
              </div>
            ) : (
              <Textarea
                id="base64-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={mode === "encode" ? "Enter Unicode text" : "Paste Base64 content"}
                spellCheck={false}
                className="min-h-[260px] resize-y font-mono text-sm"
              />
            )}

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {inputType === "file" && fileName ? fileName : `${input.length.toLocaleString()} characters · ${inputBytes.toLocaleString()} bytes`}
              </span>
              {inputType === "text" || mode === "decode" ? (
                <Button type="button" size="sm" onClick={convert}>Convert</Button>
              ) : null}
            </div>
          </div>

          <div className="p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900 dark:text-white">Output</h2>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" onClick={swap} disabled={!output} aria-label="Use output as the next input">
                  <ArrowLeftRight aria-hidden="true" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={copyOutput} disabled={!output} aria-label="Copy output">
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={downloadOutput} disabled={!output} aria-label="Download output">
                  <Download aria-hidden="true" />
                </Button>
              </div>
            </div>
            <Textarea
              value={output}
              readOnly
              aria-label="Conversion output"
              placeholder="Converted content appears here"
              className="min-h-[260px] resize-y bg-slate-50 font-mono text-sm dark:bg-slate-950"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
              <span>{output.length.toLocaleString()} characters · {outputBytes.toLocaleString()} bytes</span>
              <span className="inline-flex items-center gap-1"><Binary className="h-3.5 w-3.5" aria-hidden="true" />Local conversion</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

