export interface ScopeCheckerRequest {
  url: string
  maxPages?: number
  maxDepth?: number
  includeSubdomains?: boolean
}

export interface ScopeCheckerPage {
  url: string
  title: string
  statusCode: number
  depth: number
  contentType: string
  discoveredFrom?: string
}

export interface ScopeCheckerDocument {
  url: string
  fileType: string
  discoveredFrom?: string
}

export interface ScopeCheckerExternalLink {
  url: string
  discoveredFrom?: string
}

export interface ScopeCheckerIssue {
  url: string
  message: string
}

export interface ScopeCheckerChunk {
  chunk: number
  fromIndex: number
  toIndex: number
  pages: ScopeCheckerPage[]
}

export interface ScopeCheckerResult {
  baseUrl: string
  startedAt: string
  completedAt: string
  elapsedMs: number
  timedOut: boolean
  scannedPages: number
  discoveredUrls: number
  pages: ScopeCheckerPage[]
  documents: ScopeCheckerDocument[]
  externalLinks: ScopeCheckerExternalLink[]
  chunks: ScopeCheckerChunk[]
  issues: ScopeCheckerIssue[]
  limits: {
    maxPages: number
    maxDepth: number
    maxDurationMs: number
  }
}
