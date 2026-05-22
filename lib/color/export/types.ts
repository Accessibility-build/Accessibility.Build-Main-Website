import type { PaletteScales } from "../scales"
import type { TokenSet } from "../tokens"

export interface ExportInput {
  name: string
  scales: PaletteScales
  tokens: TokenSet
  /** Optional prefix for token names (e.g. "brand" → --brand-primary-500). */
  prefix?: string
}

export type ExportFormat =
  | "css"
  | "tailwind-v4"
  | "tailwind-v3"
  | "dtcg"
  | "figma"
  | "swift"
  | "kotlin"
  | "json"

export interface ExportFile {
  filename: string
  language: string
  content: string
}

export function kebab(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "palette"
}

export function prefixed(prefix: string | undefined, name: string): string {
  return prefix ? `${prefix}-${name}` : name
}
