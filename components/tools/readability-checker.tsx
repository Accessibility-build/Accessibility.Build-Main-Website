"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2, ClipboardPaste, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UrlCheckForm } from "@/components/tools/url-check-form"
import { SiteScanHandoff } from "@/components/tools/site-scan-handoff"
import { postTool } from "@/lib/render/client"
import { analyseReadability, THRESHOLDS, type FindingKind, type ReadabilityReport } from "@/lib/readability/analyse"
import { extractReadableText, MIN_EXTRACTED_WORDS, type ExtractedText } from "@/lib/readability/extract"
import { LOWER_SECONDARY_GRADE } from "@/lib/readability/formulas"
import { cn } from "@/lib/utils"
import { FINDING_META, FINDING_ORDER } from "./readability-checker/finding-meta"
import { ReadabilityPassage } from "./readability-checker/passage"

// Readability Checker: six readability formulas, an average grade and reading age, and
// plain-language findings highlighted in the text.
//
// Pasted text never leaves the browser. In URL mode the server fetches the HTML (with the
// shared private-address guard) and returns it as a string; DOMParser turns it into an inert
// document here, so the page's scripts never run and nothing from it is put into this page's
// DOM. Only the extracted text is rendered, as React text.

const EXAMPLE = `Residents are advised that, in accordance with the revised waste management policy, the collection of garden waste will be discontinued during the winter months in order to facilitate the redeployment of operational personnel to other essential services across the borough.

Applications for the replacement of damaged containers must be submitted via the online portal prior to the commencement of the new collection schedule. The HWRC remains open at weekends. Additional information regarding eligibility is available upon request.

We know this change matters to you. If you have a question, call us or use the form on our website. We will reply within five working days.`

type Source =
  | { kind: "text" }
  | { kind: "url"; finalUrl: string; host: string; extracted: ExtractedText }

const SOURCE_LABEL: Record<ExtractedText["source"], string> = {
  main: "the main content area",
  article: "the article",
  body: "the page body, without navigation, header and footer",
}

const defaultEnabled = () =>
  Object.fromEntries(FINDING_ORDER.map((kind) => [kind, FINDING_META[kind].defaultOn])) as Record<FindingKind, boolean>

const fmt = (value: number) => value.toLocaleString("en-GB")
const LIST_LIMIT = 30

export default function ReadabilityChecker() {
  const [mode, setMode] = useState<"text" | "url">("text")
  const [text, setText] = useState("")
  const [textError, setTextError] = useState<string | null>(null)
  const [url, setUrl] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [notice, setNotice] = useState<{ kind: "shell" | "language"; message: string } | null>(null)
  const [report, setReport] = useState<ReadabilityReport | null>(null)
  const [source, setSource] = useState<Source | null>(null)
  const [enabled, setEnabled] = useState<Record<FindingKind, boolean>>(defaultEnabled)
  const abortRef = useRef<AbortController | null>(null)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const id = useId()
  const textareaId = `${id}-text`

  // Focus moves once the results have rendered. A requestAnimationFrame here was not enough in URL
  // mode: after an await, React commits later than the next frame, so the heading did not exist yet.
  const focusResultsRef = useRef(false)
  useEffect(() => {
    if (!report || !focusResultsRef.current) return
    focusResultsRef.current = false
    resultsHeadingRef.current?.focus()
  }, [report])

  const showResults = (next: ReadabilityReport, nextSource: Source, message: string) => {
    focusResultsRef.current = true
    setReport(next)
    setSource(nextSource)
    setEnabled(defaultEnabled())
    setStatus(message)
  }

  const summary = (r: ReadabilityReport) =>
    `Checked ${fmt(r.counts.words)} words. Average grade ${r.scores.averageGrade}, reading age ${r.readingAge.label}. ${r.findings.length} findings.`

  const checkText = () => {
    abortRef.current?.abort()
    setNotice(null)
    const result = analyseReadability(text)
    if (result.counts.words === 0) {
      setTextError("Paste or type some text to check.")
      setStatus("")
      textareaRef.current?.focus()
      return
    }
    setTextError(null)
    showResults(result, { kind: "text" }, summary(result))
  }

  const checkUrl = async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setUrlError(null)
    setNotice(null)
    setStatus("Fetching the page. This usually takes a few seconds.")
    try {
      const data = await postTool<{ html: string; finalUrl: string }>("/api/tools/readability-checker", { url }, controller.signal)
      // DOMParser builds an inert document: no scripts run and no images or styles load.
      const doc = new DOMParser().parseFromString(data.html, "text/html")
      const extracted = extractReadableText(doc)
      const host = new URL(data.finalUrl).hostname
      if (extracted.wordCount < MIN_EXTRACTED_WORDS) {
        const message = `We found ${extracted.wordCount === 0 ? "no" : `only ${extracted.wordCount}`} words of text in the HTML of ${host}. The page probably builds its content with JavaScript, which this tool does not run. Copy the text from the page and paste it in the Paste text tab instead.`
        // Results from an earlier page would sit under a notice about this one, so clear them.
        setReport(null)
        setSource(null)
        setNotice({ kind: "shell", message })
        setStatus(message)
        return
      }
      const result = analyseReadability(extracted.text, { explainedAbbreviations: extracted.explainedAbbreviations })
      const language = extracted.language?.toLowerCase()
      const languageNotice =
        language && !language.startsWith("en")
          ? `This page says its language is "${extracted.language}". The formulas and word lists here are for English, so treat the scores with caution.`
          : null
      setNotice(languageNotice ? { kind: "language", message: languageNotice } : null)
      showResults(
        result,
        { kind: "url", finalUrl: data.finalUrl, host, extracted },
        `Loaded ${host}. ${summary(result)}${languageNotice ? ` ${languageNotice}` : ""}`,
      )
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return
      setUrlError((error as Error).message)
      setStatus("")
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
        setLoading(false)
      }
    }
  }

  const switchToPaste = () => {
    setMode("text")
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  return (
    <div>
      <Tabs value={mode} onValueChange={(value) => setMode(value as "text" | "url")}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="text" className="px-4 py-2">
            Paste text
          </TabsTrigger>
          <TabsTrigger value="url" className="px-4 py-2">
            Check a web page
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              checkText()
            }}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <label htmlFor={textareaId} className="block text-sm font-semibold text-slate-900 dark:text-white">
              Text to check
            </label>
            <textarea
              id={textareaId}
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={12}
              aria-invalid={textError ? true : undefined}
              aria-describedby={textError ? `${textareaId}-error ${textareaId}-help` : `${textareaId}-help`}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white p-3 text-base leading-7 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {textError && (
              <p id={`${textareaId}-error`} role="alert" className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
                {textError}
              </p>
            )}
            <p id={`${textareaId}-help`} className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              English text, up to {fmt(THRESHOLDS.maxCharacters)} characters. Put a blank line or a new line between
              paragraphs and headings. Nothing you paste leaves your browser.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="submit" className="h-11 px-5 text-base">
                Check readability
              </Button>
              <Button type="button" variant="outline" className="h-11" onClick={() => setText(EXAMPLE)}>
                <ClipboardPaste className="mr-2 h-4 w-4" aria-hidden="true" />
                Use an example
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="url" className="mt-4">
          <UrlCheckForm
            value={url}
            onChange={setUrl}
            onSubmit={checkUrl}
            loading={loading}
            submitLabel="Check this page"
            loadingLabel="Fetching the page"
            error={urlError}
            help="We fetch the page's HTML and read its main content, leaving out navigation, headers, footers and hidden text. Pages that build their text with JavaScript can't be read this way: paste their text instead."
          />
        </TabsContent>
      </Tabs>

      {/* When the notice box below shows the same message, the status stays for screen readers only. */}
      <p
        role="status"
        aria-live="polite"
        className={cn("mt-3 min-h-[1.5rem] text-sm text-slate-600 dark:text-slate-400", notice?.message === status && "sr-only")}
      >
        {status}
      </p>

      {notice && (
        <div className="mt-2 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p>{notice.message}</p>
            {notice.kind === "shell" && (
              <button
                type="button"
                onClick={switchToPaste}
                className="mt-2 font-semibold text-amber-950 underline underline-offset-2 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-amber-100"
              >
                Paste the text instead
              </button>
            )}
          </div>
        </div>
      )}

      {report && source && (
        <Results report={report} source={source} enabled={enabled} setEnabled={setEnabled} headingRef={resultsHeadingRef} />
      )}

      {/* Keyed by address: the handoff reads defaultValue only when it mounts. */}
      <SiteScanHandoff
        key={source?.kind === "url" ? source.finalUrl : "pasted-text"}
        source="readability_checker"
        className="mt-12"
        heading="Readable text is one part of an accessible page"
        body="Plain language helps everyone, but most accessibility failures are in the code: missing labels, low contrast, keyboard traps. Scan the page for those too."
        defaultValue={source?.kind === "url" ? source.finalUrl : ""}
      />
    </div>
  )
}

interface ResultsProps {
  report: ReadabilityReport
  source: Source
  enabled: Record<FindingKind, boolean>
  setEnabled: (next: Record<FindingKind, boolean>) => void
  headingRef: React.RefObject<HTMLHeadingElement | null>
}

function Results({ report, source, enabled, setEnabled, headingRef }: ResultsProps) {
  const id = useId()
  const { scores, counts } = report
  const above = report.aboveLowerSecondary
  const kindsFound = FINDING_ORDER.filter((kind) => report.byKind[kind].length > 0)

  const scoreRows: [string, string, string][] = [
    ["Flesch Reading Ease", `${scores.fleschReadingEase} (${report.fleschBand.toLowerCase()})`, "0 to 100, higher is easier. 60 to 70 is usually described as plain English."],
    ["Flesch-Kincaid Grade", String(scores.fleschKincaidGrade), "US school grade, from words per sentence and syllables per word."],
    ["Gunning Fog", String(scores.gunningFog), "Grade from sentence length and the share of words with three or more syllables."],
    ["SMOG", String(scores.smog), "Grade from words of three or more syllables, scaled to 30 sentences."],
    ["Coleman-Liau", String(scores.colemanLiau), "Grade from letters per word and sentences per 100 words."],
    ["Automated Readability Index", String(scores.automatedReadabilityIndex), "Grade from characters per word and words per sentence."],
    ["Average grade", String(scores.averageGrade), "The mean of the five grade scores above."],
  ]

  return (
    <section aria-labelledby={`${id}-heading`} className="mt-10">
      <h2
        id={`${id}-heading`}
        ref={headingRef}
        tabIndex={-1}
        className="scroll-mt-28 rounded-sm font-serif text-2xl font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white sm:text-3xl"
      >
        Results
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {source.kind === "url" ? (
          <>
            Text from {SOURCE_LABEL[source.extracted.source]} of{" "}
            <span className="font-medium text-slate-900 dark:text-white">{source.finalUrl}</span>
            {source.extracted.title ? <> (&ldquo;{source.extracted.title}&rdquo;)</> : null}.{" "}
          </>
        ) : (
          <>Your pasted text. </>
        )}
        {fmt(counts.words)} words, {fmt(counts.sentences)} sentences, {fmt(counts.paragraphs)} paragraphs or headings.
      </p>

      <div
        className={cn(
          "mt-6 flex items-start gap-3 rounded-lg border p-4 leading-7",
          above
            ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
            : "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
        )}
      >
        {above ? (
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
        )}
        <div>
          <h3 className="font-semibold">
            {above ? "Above lower secondary level" : "At or below lower secondary level"}
          </h3>
          <p>
            {above
              ? `The average grade is ${scores.averageGrade}, above the roughly grade ${LOWER_SECONDARY_GRADE} that WCAG 3.1.5 Reading Level uses as its benchmark. To meet 3.1.5, offer a plain-language summary or a simpler version alongside this text, or simplify the text itself.`
              : `The average grade is ${scores.averageGrade}, at or below roughly grade ${LOWER_SECONDARY_GRADE}. WCAG 3.1.5 Reading Level asks for nothing extra at this level.`}
          </p>
          <p className="mt-1 text-sm">
            3.1.5 is Level AAA, so it is advice for most sites rather than a legal requirement, and every score
            here is an estimate from word and sentence length.
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Average grade", String(scores.averageGrade), "US school grade, five formulas"],
          ["Reading age", report.readingAge.label, "Years old, from the average grade"],
          ["Flesch Reading Ease", String(scores.fleschReadingEase), `${report.fleschBand}, out of 100`],
        ].map(([label, value, note]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{value}</dd>
            <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">{note}</dd>
          </div>
        ))}
      </dl>

      {report.warnings.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {report.warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-2">
              <Info className="mt-1 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              {warning}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Readability scores for the checked text</caption>
          <thead>
            <tr>
              {["Formula", "Score", "What it measures"].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {scoreRows.map(([name, value, meaning]) => (
              <tr key={name} className="align-top">
                <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                  {name}
                </th>
                <td className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
                  {value}
                </td>
                <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {report.wordsPerSentence} words per sentence and {report.syllablesPerWord} syllables per word on average.
      </p>

      <h3 className="mt-10 font-serif text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
        Plain-language findings
      </h3>
      {kindsFound.length === 0 ? (
        <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
          No long or hard sentences, passive voice, wordy phrases, unexplained abbreviations or long paragraphs found.
        </p>
      ) : (
        <>
          <fieldset className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <legend className="px-1 text-sm font-semibold text-slate-900 dark:text-white">Highlight in the text</legend>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {FINDING_ORDER.map((kind) => {
                const count = report.byKind[kind].length
                const inputId = `${id}-toggle-${kind}`
                return (
                  <div key={kind} className="flex items-center gap-2">
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={enabled[kind]}
                      disabled={count === 0}
                      onChange={() => setEnabled({ ...enabled, [kind]: !enabled[kind] })}
                      className="h-4 w-4 shrink-0 accent-teal-700"
                    />
                    <label htmlFor={inputId} className={cn("text-sm text-slate-800 dark:text-slate-200", count === 0 && "text-slate-500 dark:text-slate-400")}>
                      {FINDING_META[kind].title}: {count}
                    </label>
                  </div>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-4 space-y-3">
            {kindsFound.map((kind) => {
              const items = report.byKind[kind]
              const meta = FINDING_META[kind]
              return (
                <details key={kind} className="group rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <summary className="cursor-pointer rounded-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white">
                    {meta.title} ({items.length})
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{meta.explanation}</p>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {items.slice(0, LIST_LIMIT).map((finding) => (
                      <li key={`${finding.anchor}-${finding.kind}`}>
                        <a
                          href={`#${finding.anchor}`}
                          className="font-medium text-teal-800 underline underline-offset-2 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-300"
                        >
                          {finding.excerpt}
                        </a>
                        {finding.suggestion && <> : try &ldquo;{finding.suggestion}&rdquo;</>}
                        {finding.detail && <span className="text-slate-600 dark:text-slate-400"> ({finding.detail})</span>}
                      </li>
                    ))}
                  </ol>
                  {items.length > LIST_LIMIT && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Showing the first {LIST_LIMIT} of {items.length}. The rest are highlighted in the text below.
                    </p>
                  )}
                </details>
              )
            })}
          </div>
        </>
      )}

      <h3 id={`${id}-passage`} className="mt-10 font-serif text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
        Your text, highlighted
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
        Each highlight has a label in a box after it (or before it, for whole sentences) and its own underline or
        border style. Screen readers hear the same label. Links in the findings lists jump to each one.
      </p>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <ReadabilityPassage report={report} enabled={enabled} />
      </div>
    </section>
  )
}
