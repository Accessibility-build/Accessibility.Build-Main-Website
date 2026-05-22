"use client"

import { type CSSProperties, useMemo } from "react"
import type { TypographyTokens, TypeStyle } from "@/lib/typography/tokens"

export type SpecimenKey = "marketing" | "documentation" | "blog" | "dashboard" | "longform"

export const SPECIMENS: { key: SpecimenKey; label: string }[] = [
  { key: "marketing", label: "Marketing" },
  { key: "documentation", label: "Documentation" },
  { key: "blog", label: "Blog" },
  { key: "dashboard", label: "Dashboard" },
  { key: "longform", label: "Long-form" },
]

interface PreviewProps {
  tokens: TypographyTokens
  /** Background hex (from the palette tool, or a neutral default). */
  background?: string
  /** Foreground hex for body text. */
  foreground?: string
  /** Muted hex for secondary text. */
  muted?: string
  /** Accent hex for links + highlights. */
  accent?: string
  /** Apply WCAG 1.4.12 text-spacing overrides. */
  applyTextSpacingOverride?: boolean
  /** Specimen to render. */
  specimen: SpecimenKey
}

function styleToCss(t: TypographyTokens, s: TypeStyle, override?: boolean): CSSProperties {
  const ls = override
    ? `${Math.max(0.12, s.letterSpacingEm)}em`
    : `${s.letterSpacingEm}em`
  const lh = override ? Math.max(1.5, s.lineHeight) : s.lineHeight
  return {
    fontFamily: t.fonts[s.fontFamily],
    fontSize: s.fontSize,
    lineHeight: lh,
    letterSpacing: ls,
    fontWeight: s.fontWeight,
  }
}

function bodyParagraphStyle(t: TypographyTokens, override: boolean): CSSProperties {
  return {
    ...styleToCss(t, t.styles.body, override),
    maxWidth: t.bodyMaxWidth,
    marginBlockEnd: override ? `max(2em, ${t.paragraphSpacing})` : t.paragraphSpacing,
    wordSpacing: override ? "0.16em" : undefined,
  }
}

export function TypographyPreview(props: PreviewProps) {
  const { tokens, specimen, applyTextSpacingOverride } = props
  const background = props.background ?? "#ffffff"
  const foreground = props.foreground ?? "#0b0f19"
  const muted = props.muted ?? "#475569"
  const accent = props.accent ?? "#2563eb"

  const wrapperStyle: CSSProperties = useMemo(
    () => ({ backgroundColor: background, color: foreground, padding: "2rem 1.5rem", borderRadius: "0.75rem" }),
    [background, foreground]
  )

  return (
    <article
      className="overflow-x-auto rounded-xl border"
      style={{ ...wrapperStyle, borderColor: muted + "33" }}
    >
      {specimen === "marketing" && (
        <MarketingSpecimen
          tokens={tokens}
          muted={muted}
          accent={accent}
          override={!!applyTextSpacingOverride}
        />
      )}
      {specimen === "documentation" && (
        <DocumentationSpecimen
          tokens={tokens}
          muted={muted}
          accent={accent}
          override={!!applyTextSpacingOverride}
        />
      )}
      {specimen === "blog" && (
        <BlogSpecimen
          tokens={tokens}
          muted={muted}
          accent={accent}
          override={!!applyTextSpacingOverride}
        />
      )}
      {specimen === "dashboard" && (
        <DashboardSpecimen
          tokens={tokens}
          muted={muted}
          accent={accent}
          override={!!applyTextSpacingOverride}
        />
      )}
      {specimen === "longform" && (
        <LongformSpecimen
          tokens={tokens}
          muted={muted}
          accent={accent}
          override={!!applyTextSpacingOverride}
        />
      )}
    </article>
  )
}

/* ─────────────────────────────────────────────────────────────────── Marketing */
function MarketingSpecimen({
  tokens,
  muted,
  accent,
  override,
}: {
  tokens: TypographyTokens
  muted: string
  accent: string
  override: boolean
}) {
  return (
    <div className="space-y-4">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
        style={{ ...styleToCss(tokens, tokens.styles.caption, override), backgroundColor: accent + "1a", color: accent }}
      >
        New · v2.0
      </span>
      <h1 style={styleToCss(tokens, tokens.styles.display, override)}>
        Type that everyone can read.
      </h1>
      <p style={{ ...styleToCss(tokens, tokens.styles.lead, override), maxWidth: tokens.bodyMaxWidth, color: muted }}>
        Build a typography system that meets WCAG 2.2, scales fluidly across viewports,
        and stays readable for people with low vision, dyslexia, and cognitive disabilities.
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          style={{
            ...styleToCss(tokens, tokens.styles.body, override),
            backgroundColor: accent,
            color: "#fff",
            padding: "0.625rem 1.125rem",
            borderRadius: "0.5rem",
            border: 0,
            fontWeight: 600,
          }}
        >
          Get started
        </button>
        <a
          style={{
            ...styleToCss(tokens, tokens.styles.body, override),
            color: accent,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
          href="#"
        >
          Read the docs →
        </a>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── Docs */
function DocumentationSpecimen({
  tokens,
  muted,
  accent,
  override,
}: {
  tokens: TypographyTokens
  muted: string
  accent: string
  override: boolean
}) {
  return (
    <div className="space-y-4" style={{ maxWidth: tokens.bodyMaxWidth }}>
      <p style={{ ...styleToCss(tokens, tokens.styles.caption, override), color: muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Getting started
      </p>
      <h1 style={styleToCss(tokens, tokens.styles.h1, override)}>Installation</h1>
      <p style={bodyParagraphStyle(tokens, override)}>
        The Accessibility.build SDK ships as an ESM-first package and supports both Node and
        modern browsers. Install it with your package manager of choice:
      </p>
      <pre
        style={{
          ...styleToCss(tokens, tokens.styles.code, override),
          backgroundColor: muted + "1a",
          color: muted,
          padding: "0.875rem 1rem",
          borderRadius: "0.5rem",
          overflowX: "auto",
        }}
      >
        <code>npm install @accessibility-build/sdk</code>
      </pre>
      <h2 style={styleToCss(tokens, tokens.styles.h2, override)}>Configuration</h2>
      <p style={bodyParagraphStyle(tokens, override)}>
        Initialize the client with your project key. We recommend keeping the key in an
        environment variable. See the <a href="#" style={{ color: accent, textDecoration: "underline" }}>environment guide</a> for details.
      </p>
      <h3 style={styleToCss(tokens, tokens.styles.h3, override)}>Verifying the install</h3>
      <p style={bodyParagraphStyle(tokens, override)}>
        Run <code style={{ ...styleToCss(tokens, tokens.styles.code, override), backgroundColor: muted + "1a", padding: "0.1em 0.35em", borderRadius: "0.25rem" }}>npx a11y diagnose</code> to confirm everything is wired up.
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── Blog */
function BlogSpecimen({
  tokens,
  muted,
  accent,
  override,
}: {
  tokens: TypographyTokens
  muted: string
  accent: string
  override: boolean
}) {
  return (
    <div className="space-y-3" style={{ maxWidth: tokens.bodyMaxWidth }}>
      <p style={{ ...styleToCss(tokens, tokens.styles.caption, override), color: muted }}>
        May 22, 2026 · 7 min read
      </p>
      <h1 style={styleToCss(tokens, tokens.styles.h1, override)}>
        Why your dark mode is failing low-vision users
      </h1>
      <p style={{ ...styleToCss(tokens, tokens.styles.lead, override), color: muted }}>
        Dark mode looks fashionable on a marketing slide, but inverted palettes routinely
        ship without verifying contrast or reading rhythm — and that's where the
        accessibility regressions hide.
      </p>
      <p style={bodyParagraphStyle(tokens, override)}>
        Inverted palettes shift the perceptual weight of text against background in ways
        that the WCAG 2.2 ratio model doesn't always capture. APCA exists precisely because
        the luminance ratio fails for light text on dark surfaces — what scores 4.7:1 can
        still strain a low-vision reader after a paragraph or two.
      </p>
      <p style={bodyParagraphStyle(tokens, override)}>
        The fix isn't to abandon dark mode. It's to grade both polarities with both
        contrast models and to push your design system to surface the failures before they
        reach production. That's what we built the Studio to do.
      </p>
      <h2 style={styleToCss(tokens, tokens.styles.h2, override)}>The three checks that matter</h2>
      <p style={bodyParagraphStyle(tokens, override)}>
        <a style={{ color: accent, textDecoration: "underline" }} href="#">
          Skip ahead to the checklist
        </a>{" "}
        — or read the rationale first.
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────── Dashboard */
function DashboardSpecimen({
  tokens,
  muted,
  accent,
  override,
}: {
  tokens: TypographyTokens
  muted: string
  accent: string
  override: boolean
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { label: "MRR", value: "$48,210", delta: "+12.4%", trend: "up" as const },
        { label: "Active users", value: "12,438", delta: "+820", trend: "up" as const },
        { label: "Bounce rate", value: "32.4%", delta: "−1.8%", trend: "down" as const },
      ].map((s) => (
        <div
          key={s.label}
          style={{
            border: `1px solid ${muted}33`,
            borderRadius: "0.625rem",
            padding: "0.875rem 1rem",
          }}
        >
          <p style={{ ...styleToCss(tokens, tokens.styles.caption, override), color: muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {s.label}
          </p>
          <p style={{ ...styleToCss(tokens, tokens.styles.h2, override), marginTop: "0.25rem" }}>{s.value}</p>
          <p style={{ ...styleToCss(tokens, tokens.styles.small, override), color: s.trend === "up" ? "#16a34a" : "#dc2626" }}>
            {s.delta}
          </p>
        </div>
      ))}
      <div
        className="md:col-span-3"
        style={{
          border: `1px solid ${muted}33`,
          borderRadius: "0.625rem",
          padding: "1rem 1.25rem",
        }}
      >
        <p style={{ ...styleToCss(tokens, tokens.styles.h4, override) }}>This week</p>
        <p style={{ ...styleToCss(tokens, tokens.styles.body, override), color: muted, marginTop: "0.25rem" }}>
          Conversions are up across both onboarding flows. The new Accessibility tier is now responsible for
          22% of paid signups — a +6 pp shift from last week.
        </p>
        <a
          style={{
            ...styleToCss(tokens, tokens.styles.small, override),
            color: accent,
            textDecoration: "underline",
            marginTop: "0.5rem",
            display: "inline-block",
          }}
          href="#"
        >
          View breakdown
        </a>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── Longform */
function LongformSpecimen({
  tokens,
  muted,
  accent,
  override,
}: {
  tokens: TypographyTokens
  muted: string
  accent: string
  override: boolean
}) {
  return (
    <div className="space-y-3" style={{ maxWidth: tokens.bodyMaxWidth }}>
      <h1 style={styleToCss(tokens, tokens.styles.h1, override)}>
        Chapter one — a quiet morning in the harbor
      </h1>
      <p style={{ ...styleToCss(tokens, tokens.styles.lead, override), color: muted }}>
        The fog had not yet lifted when the first of the boats began their slow drift out of the cove,
        each carrying with it the small, patient hopes of a working town.
      </p>
      <p style={bodyParagraphStyle(tokens, override)}>
        I have always thought that long-form reading is the most demanding test a typography system
        can face. Marketing copy forgives an over-tight tracking; a single dashboard cell can survive
        a slightly muddy line-height. But six paragraphs of body text will surface every careless
        choice — the line-length that runs an inch too wide, the leading that's just shy of where the
        eye expects to land, the letterforms that fight your reading rhythm rather than support it.
      </p>
      <p style={bodyParagraphStyle(tokens, override)}>
        The trick is to set the body first, and to set it well — generous line-height, a 65-character
        measure, a typeface chosen for reading rather than for being noticed. Everything else descends
        from that one decision. Skip it, and the rest of your scale will spend the next year apologizing
        for what should have been settled in fifteen minutes.
      </p>
      <p style={{ ...styleToCss(tokens, tokens.styles.small, override), color: muted, fontStyle: "italic" }}>
        — From <a href="#" style={{ color: accent, textDecoration: "underline" }}>the typographer's notebook</a>
      </p>
    </div>
  )
}
