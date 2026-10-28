"use client"

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import posthog from "posthog-js"
import { ArrowUp, MessageCircle, RotateCcw, Square, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import {
  ASSISTANT_ENDPOINT,
  ASSISTANT_EVENTS_ENDPOINT,
  ASSISTANT_FEEDBACK_ENDPOINT,
  ASSISTANT_LIMITS,
  ASSISTANT_NAME,
  ASSISTANT_TAGLINE,
  ASSISTANT_OPEN_EVENT,
  HIDDEN_ROUTE_PREFIXES,
  PRIVATE_ROUTE_PREFIXES,
  matchesPrefix,
  splitLanguageMarker,
  type AssistantSource,
} from "@/lib/assistant/config"
import { AssistantMarkdown, markdownToPlainText } from "./assistant-markdown"

interface ChatMessage {
  id: string
  /** Id of the analytics row the server wrote for this answer, used for feedback. */
  serverId?: string
  role: "user" | "assistant"
  content: string
  /** BCP 47 language of the text, from the reply's language marker (WCAG 3.1.2). */
  lang?: string
  sources?: AssistantSource[]
  error?: boolean
  stopped?: boolean
  feedback?: "helpful" | "unhelpful"
}

const STORAGE_KEY = "curb-assistant:conversation"

function newId() {
  return Math.random().toString(36).slice(2, 10)
}

function newConversationId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${newId()}${newId()}`
}

interface AssistantEvent {
  type: "opened" | "suggestion_clicked" | "source_clicked" | "answer_link_clicked" | "new_chat"
  conversationId?: string
  messageId?: string
  path?: string
  detail?: string
}

/** Reports a widget interaction for /admin/assistant. A beacon survives the page navigating away. */
function track(event: AssistantEvent) {
  const body = JSON.stringify(event)
  try {
    if (navigator.sendBeacon?.(ASSISTANT_EVENTS_ENDPOINT, body)) return
  } catch {
    // Fall through to fetch.
  }
  void fetch(ASSISTANT_EVENTS_ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => undefined)
}

/** Starter questions that fit the kind of page the visitor is on. */
function suggestionsFor(pathname: string): string[] {
  if (pathname.startsWith("/wcag/")) {
    return ["Explain this criterion with an example", "How do I test for this?", "What are the most common failures?"]
  }
  if (pathname.startsWith("/wcag-3")) return ["Summarize this page", "How is WCAG 3 different from WCAG 2.2?"]
  if (pathname.startsWith("/tools/")) {
    return ["How do I use this tool?", "How should I read the results?", "What can this tool not check?"]
  }
  if (pathname.startsWith("/research/")) {
    return ["What are the key findings here?", "Where does this data come from?", "Summarize this page"]
  }
  if (pathname.startsWith("/compliance/")) {
    return ["Who does this law apply to?", "What are the deadlines?", "What do I need to do to comply?"]
  }
  if (/^\/(guides|learn|blog|cases|checklists|reference)\//.test(pathname)) {
    return ["Summarize this page", "Show me a code example", "Which WCAG criteria does this cover?"]
  }
  if (pathname.startsWith("/services") || pathname === "/pricing") {
    return ["What does an accessibility audit include?", "Which service fits a small website?"]
  }
  return [
    "What changed in WCAG 2.2?",
    "Does my website legally have to be accessible?",
    "Which tool should I start with?",
  ]
}

/** The visible text of the page the visitor is on, so questions about "this page" work. */
function currentPage() {
  const path = window.location.pathname
  let content = ""
  if (!matchesPrefix(path, PRIVATE_ROUTE_PREFIXES)) {
    const main = document.getElementById("main-content")
    content = (main?.innerText ?? "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n+/g, "\n")
      .trim()
      .slice(0, ASSISTANT_LIMITS.maxPageChars)
  }
  return { path, title: document.title, content }
}

interface StoredChat {
  conversationId: string
  messages: ChatMessage[]
}

function readStored(): StoredChat {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<StoredChat>) : null
    if (parsed && typeof parsed.conversationId === "string" && Array.isArray(parsed.messages)) {
      return {
        conversationId: parsed.conversationId,
        messages: parsed.messages.filter((m) => m && typeof m.content === "string"),
      }
    }
  } catch {
    // Unreadable or blocked storage starts a fresh chat.
  }
  return { conversationId: newConversationId(), messages: [] }
}

function writeStored(chat: StoredChat) {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...chat, messages: chat.messages.slice(-ASSISTANT_LIMITS.maxStoredMessages) }),
    )
  } catch {
    // Storage can be blocked (private windows, strict settings). The chat still works.
  }
}

export function CurbAssistant() {
  const pathname = usePathname() ?? "/"
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState("")
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  // What the polite status region says. The body carries its own language so a reply in
  // French is read with French pronunciation.
  const [announcement, setAnnouncement] = useState<{ prefix?: string; body: string; lang?: string }>({ body: "" })

  const panelId = useId()
  const titleId = useId()
  const hintId = useId()
  const inputId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const returnFocusRef = useRef(false)
  const hydratedRef = useRef(false)

  const hidden = matchesPrefix(pathname, HIDDEN_ROUTE_PREFIXES)

  useEffect(() => {
    const stored = readStored()
    setConversationId(stored.conversationId)
    setMessages(stored.messages)
    hydratedRef.current = true
  }, [])

  useEffect(() => {
    if (hydratedRef.current && !streaming && conversationId) writeStored({ conversationId, messages })
  }, [messages, streaming, conversationId])

  // Clicks on links in answers and in "Related on this site", including keyboard activation,
  // which also fires click. Listened for natively so the conversation region stays a plain region.
  useEffect(() => {
    const region = scrollRef.current
    if (!open || !region) return
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest("a")
      if (!link) return
      track({
        type: link.closest("[data-sources]") ? "source_clicked" : "answer_link_clicked",
        conversationId,
        messageId: link.closest("[data-message-id]")?.getAttribute("data-message-id") || undefined,
        path: window.location.pathname,
        detail: link.getAttribute("href") ?? "",
      })
    }
    region.addEventListener("click", onClick)
    return () => region.removeEventListener("click", onClick)
  }, [open, conversationId])

  // The "Ask Curb" skip link at the top of every page opens the panel without tabbing through
  // the whole page to the floating button.
  useEffect(() => {
    const onOpen = () => {
      setOpen(true)
      track({ type: "opened", conversationId, path: window.location.pathname, detail: "skip link" })
    }
    window.addEventListener(ASSISTANT_OPEN_EVENT, onOpen)
    return () => window.removeEventListener(ASSISTANT_OPEN_EVENT, onOpen)
  }, [conversationId])

  // Screen reader users cannot see the character count, so the limit is announced as it nears.
  const limitStageRef = useRef(0)
  useEffect(() => {
    const left = ASSISTANT_LIMITS.maxQuestionChars - input.length
    const stage = left <= 0 ? 2 : left <= 100 ? 1 : 0
    if (stage > limitStageRef.current) {
      setAnnouncement({ body: stage === 2 ? "Character limit reached." : `${left} characters left.` })
    }
    limitStageRef.current = stage
  }, [input])

  const close = useCallback((restoreFocus: boolean) => {
    returnFocusRef.current = restoreFocus
    setOpen(false)
  }, [])

  // Focus moves into the panel when it opens, and back to the launcher when it closes from
  // inside. Escape closes it from anywhere on the page, so a visitor can always uncover
  // whatever the panel sits on top of without moving focus (WCAG 2.4.11).
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
      return
    }
    if (returnFocusRef.current) {
      returnFocusRef.current = false
      requestAnimationFrame(() => launcherRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      // Escape also cancels an input method composition; leave that alone.
      if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return
      const inside = panelRef.current?.contains(document.activeElement) ?? false
      close(inside)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  // Follow the answer as it streams in, unless the visitor has scrolled up to read.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight
  }, [messages, open])

  // Patches one message by id, so an answer still streaming after "Start a new chat" cannot
  // write into the fresh conversation.
  const update = (id: string, patch: Partial<ChatMessage>) => {
    setMessages((current) => current.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  const send = async (text: string) => {
    const question = text.trim().slice(0, ASSISTANT_LIMITS.maxQuestionChars)
    if (!question || streaming) return

    const userMessage: ChatMessage = { id: newId(), role: "user", content: question }
    const history = [...messages, userMessage]
      .filter((m) => !m.error && m.content.trim())
      .slice(-ASSISTANT_LIMITS.maxHistoryMessages)
      .map(({ role, content }) => ({ role, content }))
    const answerId = newId()
    setMessages((current) => [...current, userMessage, { id: answerId, role: "assistant", content: "" }])
    setInput("")
    setStreaming(true)
    setAnnouncement({ body: `${ASSISTANT_NAME} is writing an answer.` })
    posthog.capture("assistant_question_sent", { path: pathname, length: question.length })

    const controller = new AbortController()
    abortRef.current = controller
    let answer = ""
    try {
      const response = await fetch(ASSISTANT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, conversationId, page: currentPage() }),
        signal: controller.signal,
      })
      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null
        throw new Error(data?.message || data?.error || "Something went wrong. Please try again.")
      }
      const serverId = response.headers.get("X-Assistant-Message-Id") ?? undefined
      if (serverId) update(answerId, { serverId })
      let sources: AssistantSource[] = []
      try {
        sources = JSON.parse(decodeURIComponent(response.headers.get("X-Assistant-Sources") ?? "")) as AssistantSource[]
      } catch {
        sources = []
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        const part = splitLanguageMarker(answer)
        update(answerId, { content: part.text, lang: part.lang ?? undefined })
      }
      answer += decoder.decode()
      const { text: finalText, lang } = splitLanguageMarker(answer)
      if (!finalText.trim()) throw new Error("No answer came back. Please try again.")
      update(answerId, { content: finalText, lang: lang ?? undefined, sources })
      // The question was written in the language the reply came back in.
      if (lang) update(userMessage.id, { lang })
      setAnnouncement({ prefix: `${ASSISTANT_NAME} replied:`, body: markdownToPlainText(finalText), lang: lang ?? undefined })
    } catch (error) {
      if (controller.signal.aborted) {
        update(answerId, { content: splitLanguageMarker(answer).text, stopped: true })
        setAnnouncement({ body: "Answer stopped." })
      } else {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again."
        update(answerId, { content: message, error: true })
        setAnnouncement({ body: message })
      }
    } finally {
      abortRef.current = null
      setStreaming(false)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    void send(input)
  }

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void send(input)
    }
  }

  const startOver = () => {
    abortRef.current?.abort()
    track({ type: "new_chat", conversationId, path: pathname })
    setConversationId(newConversationId())
    setMessages([])
    setAnnouncement({ body: "Started a new chat." })
    inputRef.current?.focus()
  }

  const rate = (message: ChatMessage, feedback: ChatMessage["feedback"]) => {
    setMessages((current) => current.map((m) => (m.id === message.id ? { ...m, feedback } : m)))
    posthog.capture("assistant_feedback", { path: pathname, feedback })
    if (!message.serverId) return
    void fetch(ASSISTANT_FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: message.serverId, conversationId, feedback: feedback ?? null }),
    }).catch(() => undefined)
  }

  // Grow the textarea with its content, up to about six lines.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input, open])

  if (hidden) return null

  const offset = "var(--consent-banner-height, 0px)"
  const suggestions = suggestionsFor(pathname)
  const remaining = ASSISTANT_LIMITS.maxQuestionChars - input.length

  return (
    <div data-assistant="">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement.prefix ? `${announcement.prefix} ` : ""}
        <span lang={announcement.lang}>{announcement.body}</span>
      </div>

      {!open && (
        <button
          ref={launcherRef}
          type="button"
          data-floating-control=""
          aria-expanded={false}
          aria-controls={panelId}
          onClick={() => {
            setOpen(true)
            posthog.capture("assistant_opened", { path: pathname })
            track({ type: "opened", conversationId, path: pathname })
          }}
          style={{ bottom: `calc(1rem + ${offset})` }}
          className="fixed right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-transparent bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-blue-700 dark:hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          Ask {ASSISTANT_NAME}
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          data-floating-control=""
          style={{
            bottom: `calc(1rem + ${offset})`,
            height: `min(40rem, calc(100dvh - 2rem - ${offset}))`,
          }}
          className="fixed inset-x-2 z-40 flex flex-col overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background text-foreground shadow-2xl shadow-slate-900/20 sm:inset-x-auto sm:right-4 sm:w-[26rem] dark:shadow-black/50"
        >
          <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
            <Logo className="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="text-base font-semibold leading-5 text-foreground">
                {ASSISTANT_NAME}
              </h2>
              <p className="text-xs text-muted-foreground">{ASSISTANT_TAGLINE}</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={startOver}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">Start a new chat</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => close(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Close {ASSISTANT_NAME}</span>
            </button>
          </div>

          <div
            ref={scrollRef}
            role="region"
            aria-label="Conversation"
            aria-busy={streaming}
            tabIndex={0}
            className="min-h-[12rem] flex-1 overflow-y-auto px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            {messages.length === 0 ? (
              <div className="space-y-4 text-sm leading-6 text-foreground">
                <p>
                  Hi, I am {ASSISTANT_NAME}. Ask me about accessibility, WCAG, or anything on Accessibility.build.
                  I can also explain the page you are on.
                </p>
                <div>
                  <p id={`${panelId}-try`} className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Try asking
                  </p>
                  <ul aria-labelledby={`${panelId}-try`} className="space-y-2">
                    {suggestions.map((suggestion) => (
                      <li key={suggestion}>
                        <button
                          type="button"
                          onClick={() => {
                            track({ type: "suggestion_clicked", conversationId, path: pathname, detail: suggestion })
                            void send(suggestion)
                          }}
                          className="w-full rounded-2xl border border-border bg-background px-3.5 py-2 text-left text-sm text-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <ol className="space-y-5">
                {messages.map((message, index) => {
                  const isLast = index === messages.length - 1
                  const pending = streaming && isLast && message.role === "assistant"
                  if (message.role === "user") {
                    return (
                      <li key={message.id} className="flex justify-end">
                        <div lang={message.lang} className="max-w-[85%] rounded-2xl rounded-br-md border border-transparent bg-primary px-3.5 py-2 text-sm leading-6 text-primary-foreground">
                          <h3 className="sr-only">You said</h3>
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                      </li>
                    )
                  }
                  return (
                    <li key={message.id} data-message-id={message.serverId}>
                      <h3 className="sr-only">{ASSISTANT_NAME} said</h3>
                      {message.error ? (
                        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                          {message.content}
                        </p>
                      ) : message.content ? (
                        <div lang={message.lang}>
                          <AssistantMarkdown content={message.content} />
                        </div>
                      ) : pending ? (
                        <p className="text-sm text-muted-foreground">
                          Thinking
                          <span aria-hidden="true" className="motion-safe:animate-pulse">
                            ...
                          </span>
                        </p>
                      ) : null}
                      {message.stopped && (
                        <p className="mt-2 text-xs text-muted-foreground">You stopped this answer.</p>
                      )}
                      {!pending && message.sources && message.sources.length > 0 && (
                        <div data-sources="" className="mt-3 border-t border-border pt-2">
                          <p id={`${message.id}-related`} className="text-xs font-semibold text-muted-foreground">
                            Related on this site
                          </p>
                          <ul aria-labelledby={`${message.id}-related`} className="mt-1 space-y-1">
                            {message.sources.map((source) => (
                              <li key={source.path} className="text-sm">
                                <Link
                                  href={source.path}
                                  className="font-medium text-primary underline underline-offset-2 hover:decoration-2"
                                >
                                  {source.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {!pending && !message.error && message.content && (
                        <div className="mt-2 flex items-center gap-1" role="group" aria-label="Was this answer helpful?">
                          {(
                            [
                              ["helpful", ThumbsUp, "Helpful"],
                              ["unhelpful", ThumbsDown, "Not helpful"],
                            ] as const
                          ).map(([value, Icon, label]) => (
                            <button
                              key={value}
                              type="button"
                              aria-pressed={message.feedback === value}
                              onClick={() => rate(message, message.feedback === value ? undefined : value)}
                              className={cn(
                                "inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                message.feedback === value && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                              )}
                            >
                              <Icon aria-hidden="true" className="h-4 w-4" />
                              <span className="sr-only">{label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}
          </div>

          <form onSubmit={onSubmit} className="shrink-0 border-t border-border px-3 pb-3 pt-3">
            <label htmlFor={inputId} className="sr-only">
              Ask {ASSISTANT_NAME} a question
            </label>
            <div className="flex items-end gap-2 rounded-2xl border border-slate-500 bg-background px-3 py-2 transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
              <textarea
                ref={inputRef}
                id={inputId}
                rows={1}
                value={input}
                maxLength={ASSISTANT_LIMITS.maxQuestionChars}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onInputKeyDown}
                aria-describedby={hintId}
                placeholder="Ask about accessibility or this page"
                className="max-h-40 min-h-6 flex-1 resize-none bg-transparent text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Square aria-hidden="true" className="h-3.5 w-3.5" />
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent bg-primary text-primary-foreground transition-colors hover:bg-blue-700 dark:hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                  <ArrowUp aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </button>
              )}
            </div>
            <p id={hintId} className="mt-2 text-xs leading-5 text-muted-foreground">
              {remaining < 150 ? `${remaining} characters left. ` : "Enter to send, Shift and Enter for a new line. "}
              Answers draw on this site and general accessibility knowledge, can be wrong, and are not legal advice.
              Questions are kept for 90 days to improve {ASSISTANT_NAME}.{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                Privacy
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  )
}
