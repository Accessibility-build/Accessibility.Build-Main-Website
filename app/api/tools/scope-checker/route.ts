import { NextRequest, NextResponse } from "next/server"
import type {
  ScopeCheckerChunk,
  ScopeCheckerDocument,
  ScopeCheckerExternalLink,
  ScopeCheckerIssue,
  ScopeCheckerPage,
  ScopeCheckerRequest,
  ScopeCheckerResult,
} from "@/lib/scope-checker-types"

export const runtime = "nodejs"
export const maxDuration = 120

const MAX_DURATION_MS = 120_000
const INTERNAL_DEADLINE_BUFFER_MS = 2_500
const FETCH_TIMEOUT_MS = 12_000
const MAX_HTML_BYTES = 1_500_000
const MAX_LINKS_PER_PAGE = 600
const MAX_SITEMAPS = 25
const MAX_EXTERNAL_LINKS = 1_000
const MAX_ISSUES = 250
const CHUNK_SIZE = 50

const DEFAULT_MAX_PAGES = 200
const DEFAULT_MAX_DEPTH = 3
const MAX_MAX_PAGES = 1_000
const MAX_MAX_DEPTH = 6

const DOCUMENT_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "csv",
  "txt",
  "rtf",
  "odt",
  "ods",
  "odp",
  "epub",
  "zip",
  "rar",
  "7z",
  "gz",
  "tar",
  "xml",
  "json",
])

const DOCUMENT_CONTENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/rtf",
  "text/csv",
  "application/zip",
  "application/x-rar-compressed",
  "application/gzip",
]

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  nbsp: " ",
}

interface CrawlQueueItem {
  url: string
  depth: number
  discoveredFrom?: string
}

function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(String(value), 10)
  if (Number.isNaN(parsed)) {
    return fallback
  }
  return Math.min(Math.max(parsed, min), max)
}

function pushIssue(issues: ScopeCheckerIssue[], url: string, message: string): void {
  if (issues.length >= MAX_ISSUES) {
    return
  }

  const normalizedMessage = message.trim().slice(0, 260)
  issues.push({
    url,
    message: normalizedMessage,
  })
}

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/^www\./, "")
}

function isPrivateIPv4(hostname: string): boolean {
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!ipv4) {
    return false
  }

  const octets = ipv4.slice(1).map((part) => Number.parseInt(part, 10))
  if (octets.some((octet) => octet < 0 || octet > 255)) {
    return true
  }

  const [a, b] = octets
  if (a === 10 || a === 127) {
    return true
  }
  if (a === 192 && b === 168) {
    return true
  }
  if (a === 172 && b >= 16 && b <= 31) {
    return true
  }
  return false
}

function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase()
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    isPrivateIPv4(normalized)
  )
}

function normalizeInputUrl(rawUrl: string): URL | null {
  const trimmed = rawUrl.trim()
  if (!trimmed) {
    return null
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function canonicalizeUrl(url: URL): string {
  const normalized = new URL(url.toString())
  normalized.hash = ""
  normalized.username = ""
  normalized.password = ""
  normalized.hostname = normalized.hostname.toLowerCase()

  if ((normalized.protocol === "https:" && normalized.port === "443") || (normalized.protocol === "http:" && normalized.port === "80")) {
    normalized.port = ""
  }

  normalized.search = ""

  if (normalized.pathname.length > 1) {
    normalized.pathname = normalized.pathname.replace(/\/+$/, "")
  }

  return normalized.toString()
}

function isSameSite(candidate: URL, base: URL, includeSubdomains: boolean): boolean {
  const candidateHost = normalizeHostname(candidate.hostname)
  const baseHost = normalizeHostname(base.hostname)

  if (candidateHost === baseHost) {
    return true
  }

  if (!includeSubdomains) {
    return false
  }

  return candidateHost.endsWith(`.${baseHost}`)
}

function getFileExtension(urlString: string): string | null {
  try {
    const pathname = new URL(urlString).pathname
    const lastSegment = pathname.split("/").pop() || ""
    const extension = lastSegment.includes(".") ? lastSegment.split(".").pop() : null
    if (!extension) {
      return null
    }
    return extension.toLowerCase()
  } catch {
    return null
  }
}

function isDocumentUrl(urlString: string): boolean {
  const extension = getFileExtension(urlString)
  if (!extension) {
    return false
  }
  return DOCUMENT_EXTENSIONS.has(extension)
}

function isDocumentContentType(contentType: string): boolean {
  const normalized = contentType.toLowerCase()
  return DOCUMENT_CONTENT_TYPES.some((type) => normalized.includes(type))
}

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_match, entity: string) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = Number.parseInt(entity.slice(2), 16)
      return Number.isFinite(code) ? String.fromCodePoint(code) : _match
    }

    if (entity.startsWith("#")) {
      const code = Number.parseInt(entity.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : _match
    }

    return ENTITY_MAP[entity] ?? _match
  })
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, " ")
}

function cleanText(value: string): string {
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim()
}

function parseAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {}
  const attributeRegex = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g

  let match = attributeRegex.exec(tag)
  while (match) {
    const key = match[1].toLowerCase()
    const value = match[2] ?? match[3] ?? match[4] ?? ""
    attributes[key] = value
    match = attributeRegex.exec(tag)
  }

  return attributes
}

function extractMetaTitle(html: string): string | null {
  const metaRegex = /<meta\b[^>]*>/gi

  let match = metaRegex.exec(html)
  while (match) {
    const tag = match[0]
    const attributes = parseAttributes(tag)
    const property = (attributes.property ?? attributes.name ?? "").toLowerCase()
    const content = attributes.content ?? ""

    if ((property === "og:title" || property === "twitter:title") && content.trim()) {
      return cleanText(content)
    }

    match = metaRegex.exec(html)
  }

  return null
}

function extractPageTitle(html: string, fallbackUrl: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch?.[1]) {
    const title = cleanText(stripTags(titleMatch[1]))
    if (title) {
      return title
    }
  }

  const metaTitle = extractMetaTitle(html)
  if (metaTitle) {
    return metaTitle
  }

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match?.[1]) {
    const h1 = cleanText(stripTags(h1Match[1]))
    if (h1) {
      return h1
    }
  }

  return fallbackUrl
}

function extractLinksFromHtml(html: string): string[] {
  const links: string[] = []
  const anchorRegex = /<a\b[^>]*?\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>`]+))/gi

  let match = anchorRegex.exec(html)
  while (match) {
    const href = (match[1] ?? match[2] ?? match[3] ?? "").trim()
    if (href) {
      links.push(href)
    }
    match = anchorRegex.exec(html)
  }

  return links
}

function extractLocsFromXml(xml: string): string[] {
  const locs: string[] = []
  const locRegex = /<loc>\s*([^<]+?)\s*<\/loc>/gi

  let match = locRegex.exec(xml)
  while (match) {
    const loc = cleanText(match[1])
    if (loc) {
      locs.push(loc)
    }
    match = locRegex.exec(xml)
  }

  return locs
}

function resolveAbsoluteUrl(rawUrl: string, baseUrl: string): URL | null {
  const lower = rawUrl.trim().toLowerCase()
  if (!lower || lower.startsWith("#")) {
    return null
  }
  if (lower.startsWith("mailto:") || lower.startsWith("tel:") || lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return null
  }

  try {
    const resolved = new URL(rawUrl, baseUrl)
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
      return null
    }
    return resolved
  } catch {
    return null
  }
}

function mergeUint8Arrays(chunks: Uint8Array[], totalLength: number): Uint8Array {
  const merged = new Uint8Array(totalLength)
  let offset = 0

  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.length
  }

  return merged
}

async function readBodyTextWithLimit(response: Response, maxBytes: number): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) {
    return response.text()
  }

  const chunks: Uint8Array[] = []
  let total = 0

  while (total < maxBytes) {
    const { done, value } = await reader.read()
    if (done || !value) {
      break
    }

    const remaining = maxBytes - total
    if (value.byteLength > remaining) {
      chunks.push(value.slice(0, remaining))
      total += remaining
      break
    }

    chunks.push(value)
    total += value.byteLength
  }

  await reader.cancel().catch(() => undefined)

  const bytes = mergeUint8Arrays(chunks, total)
  return new TextDecoder().decode(bytes)
}

async function fetchWithTimeout(url: string, timeoutMs: number, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchWithDeadline(url: string, deadline: number, init?: RequestInit): Promise<Response> {
  const remaining = deadline - Date.now() - 300
  if (remaining <= 500) {
    throw new Error("Time budget exceeded")
  }

  const timeoutMs = Math.max(1_000, Math.min(FETCH_TIMEOUT_MS, remaining))
  return fetchWithTimeout(url, timeoutMs, init)
}

async function discoverSitemapUrls(
  baseUrl: URL,
  deadline: number,
  issues: ScopeCheckerIssue[]
): Promise<string[]> {
  const sitemapUrls = new Set<string>([
    `${baseUrl.origin}/sitemap.xml`,
    `${baseUrl.origin}/sitemap_index.xml`,
  ])
  const robotsUrl = `${baseUrl.origin}/robots.txt`

  if (Date.now() >= deadline - 2_000) {
    return Array.from(sitemapUrls)
  }

  try {
    const robotsResponse = await fetchWithDeadline(robotsUrl, deadline, {
      headers: {
        "User-Agent": "Accessibility.build Scope Checker/1.0",
        "Accept": "text/plain,*/*;q=0.8",
      },
      redirect: "follow",
    })

    if (!robotsResponse.ok) {
      return Array.from(sitemapUrls)
    }

    const robotsText = await readBodyTextWithLimit(robotsResponse, 200_000)
    const sitemapLineRegex = /^\s*Sitemap:\s*(\S+)\s*$/gim

    let match = sitemapLineRegex.exec(robotsText)
    while (match) {
      const sitemap = resolveAbsoluteUrl(match[1], baseUrl.origin)
      if (sitemap) {
        sitemapUrls.add(canonicalizeUrl(sitemap))
      }
      match = sitemapLineRegex.exec(robotsText)
    }
  } catch (error) {
    pushIssue(
      issues,
      robotsUrl,
      `Unable to read robots.txt: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }

  return Array.from(sitemapUrls)
}

async function collectSitemapPageUrls(
  initialSitemaps: string[],
  baseUrl: URL,
  includeSubdomains: boolean,
  deadline: number,
  issues: ScopeCheckerIssue[]
): Promise<Set<string>> {
  const pageUrls = new Set<string>()
  const queue = [...initialSitemaps]
  const visitedSitemaps = new Set<string>()

  while (queue.length > 0 && visitedSitemaps.size < MAX_SITEMAPS && Date.now() < deadline - 1_000) {
    const sitemapUrl = queue.shift()
    if (!sitemapUrl || visitedSitemaps.has(sitemapUrl)) {
      continue
    }

    visitedSitemaps.add(sitemapUrl)

    try {
      const response = await fetchWithDeadline(sitemapUrl, deadline, {
        headers: {
          "User-Agent": "Accessibility.build Scope Checker/1.0",
          "Accept": "application/xml,text/xml,text/plain,*/*;q=0.5",
        },
        redirect: "follow",
      })

      if (!response.ok) {
        continue
      }

      const xml = await readBodyTextWithLimit(response, 1_200_000)
      const locs = extractLocsFromXml(xml)
      const isSitemapIndex = /<sitemapindex[\s>]/i.test(xml)

      for (const loc of locs) {
        const resolved = resolveAbsoluteUrl(loc, sitemapUrl)
        if (!resolved) {
          continue
        }

        const canonical = canonicalizeUrl(resolved)

        if (!isSameSite(resolved, baseUrl, includeSubdomains)) {
          continue
        }

        if (isSitemapIndex || canonical.endsWith(".xml")) {
          if (!visitedSitemaps.has(canonical) && queue.length < MAX_SITEMAPS) {
            queue.push(canonical)
          }
          continue
        }

        pageUrls.add(canonical)
      }
    } catch (error) {
      pushIssue(
        issues,
        sitemapUrl,
        `Unable to process sitemap: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  return pageUrls
}

function createChunks(pages: ScopeCheckerPage[]): ScopeCheckerChunk[] {
  const chunks: ScopeCheckerChunk[] = []

  for (let index = 0; index < pages.length; index += CHUNK_SIZE) {
    const chunkPages = pages.slice(index, index + CHUNK_SIZE)
    chunks.push({
      chunk: chunks.length + 1,
      fromIndex: index + 1,
      toIndex: index + chunkPages.length,
      pages: chunkPages,
    })
  }

  return chunks
}

export async function POST(request: NextRequest) {
  const startedAt = new Date()
  const startedAtMs = Date.now()

  try {
    const body = (await request.json()) as ScopeCheckerRequest
    const parsedUrl = normalizeInputUrl(body.url ?? "")

    if (!parsedUrl) {
      return NextResponse.json(
        { error: "Please provide a valid URL (e.g. https://example.com)" },
        { status: 400 }
      )
    }

    if (isBlockedHostname(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: "Local, private, and loopback hosts are not allowed." },
        { status: 400 }
      )
    }

    const maxPages = clampInt(body.maxPages, DEFAULT_MAX_PAGES, 10, MAX_MAX_PAGES)
    const maxDepth = clampInt(body.maxDepth, DEFAULT_MAX_DEPTH, 1, MAX_MAX_DEPTH)
    const includeSubdomains = Boolean(body.includeSubdomains)

    const deadline = Date.now() + MAX_DURATION_MS - INTERNAL_DEADLINE_BUFFER_MS

    const issues: ScopeCheckerIssue[] = []
    const pages = new Map<string, ScopeCheckerPage>()
    const documents = new Map<string, ScopeCheckerDocument>()
    const externalLinks = new Map<string, ScopeCheckerExternalLink>()
    const queued = new Set<string>()
    const visited = new Set<string>()
    const queue: CrawlQueueItem[] = []
    let scannedPages = 0

    const enqueueUrl = (url: string, depth: number, discoveredFrom?: string) => {
      if (queued.has(url) || visited.has(url) || pages.has(url) || documents.has(url)) {
        return
      }
      if (depth > maxDepth) {
        return
      }

      queue.push({ url, depth, discoveredFrom })
      queued.add(url)
    }

    const baseUrlCanonical = canonicalizeUrl(parsedUrl)
    enqueueUrl(baseUrlCanonical, 0)

    const sitemapUrls = await discoverSitemapUrls(parsedUrl, deadline, issues)
    const sitemapPageUrls = await collectSitemapPageUrls(
      sitemapUrls,
      parsedUrl,
      includeSubdomains,
      deadline,
      issues
    )

    for (const sitemapPageUrl of sitemapPageUrls) {
      if (isDocumentUrl(sitemapPageUrl)) {
        const extension = getFileExtension(sitemapPageUrl) ?? "file"
        documents.set(sitemapPageUrl, {
          url: sitemapPageUrl,
          fileType: extension.toUpperCase(),
          discoveredFrom: "sitemap.xml",
        })
      } else {
        enqueueUrl(sitemapPageUrl, 1, "sitemap.xml")
      }
    }

    while (queue.length > 0 && pages.size < maxPages && Date.now() < deadline) {
      const item = queue.shift()
      if (!item) {
        break
      }

      queued.delete(item.url)

      if (visited.has(item.url)) {
        continue
      }

      visited.add(item.url)
      scannedPages += 1

      try {
        const response = await fetchWithDeadline(item.url, deadline, {
          headers: {
            "User-Agent": "Accessibility.build Scope Checker/1.0",
            "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
          },
          redirect: "follow",
        })

        const responseUrl = normalizeInputUrl(response.url)
        if (responseUrl && !isSameSite(responseUrl, parsedUrl, includeSubdomains)) {
          if (externalLinks.size < MAX_EXTERNAL_LINKS) {
            const canonicalExternal = canonicalizeUrl(responseUrl)
            if (!externalLinks.has(canonicalExternal)) {
              externalLinks.set(canonicalExternal, {
                url: canonicalExternal,
                discoveredFrom: item.url,
              })
            }
          }
          continue
        }

        const contentTypeRaw = response.headers.get("content-type") ?? ""
        const contentType = contentTypeRaw.split(";")[0].trim().toLowerCase()
        const statusCode = response.status

        if (isDocumentUrl(item.url) || isDocumentContentType(contentType)) {
          const extension = getFileExtension(item.url) ?? "file"
          if (!documents.has(item.url)) {
            documents.set(item.url, {
              url: item.url,
              fileType: extension.toUpperCase(),
              discoveredFrom: item.discoveredFrom,
            })
          }
          continue
        }

        const html = await readBodyTextWithLimit(response, MAX_HTML_BYTES)
        const title = extractPageTitle(html, item.url)

        pages.set(item.url, {
          url: item.url,
          title,
          statusCode,
          depth: item.depth,
          contentType: contentType || "unknown",
          discoveredFrom: item.discoveredFrom,
        })

        if (item.depth >= maxDepth || pages.size >= maxPages) {
          continue
        }

        const links = extractLinksFromHtml(html)
        let checkedLinks = 0

        for (const rawLink of links) {
          if (checkedLinks >= MAX_LINKS_PER_PAGE || Date.now() >= deadline) {
            break
          }
          checkedLinks += 1

          const resolved = resolveAbsoluteUrl(rawLink, item.url)
          if (!resolved) {
            continue
          }

          const canonical = canonicalizeUrl(resolved)
          if (canonical === item.url) {
            continue
          }

          if (isSameSite(resolved, parsedUrl, includeSubdomains)) {
            if (isDocumentUrl(canonical)) {
              if (!documents.has(canonical)) {
                const extension = getFileExtension(canonical) ?? "file"
                documents.set(canonical, {
                  url: canonical,
                  fileType: extension.toUpperCase(),
                  discoveredFrom: item.url,
                })
              }
            } else {
              enqueueUrl(canonical, item.depth + 1, item.url)
            }
            continue
          }

          if (externalLinks.size < MAX_EXTERNAL_LINKS && !externalLinks.has(canonical)) {
            externalLinks.set(canonical, {
              url: canonical,
              discoveredFrom: item.url,
            })
          }
        }
      } catch (error) {
        pushIssue(
          issues,
          item.url,
          `Unable to crawl URL: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      }
    }

    const completedAt = new Date()
    const timedOut = Date.now() >= deadline

    const pagesList = Array.from(pages.values())
    const documentsList = Array.from(documents.values())
    const externalLinksList = Array.from(externalLinks.values())
    const chunks = createChunks(pagesList)

    const result: ScopeCheckerResult = {
      baseUrl: baseUrlCanonical,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      elapsedMs: Date.now() - startedAtMs,
      timedOut,
      scannedPages,
      discoveredUrls: pagesList.length + documentsList.length + externalLinksList.length,
      pages: pagesList,
      documents: documentsList,
      externalLinks: externalLinksList,
      chunks,
      issues,
      limits: {
        maxPages,
        maxDepth,
        maxDurationMs: MAX_DURATION_MS,
      },
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to run scope checker.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
