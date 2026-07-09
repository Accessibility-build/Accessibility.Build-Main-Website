import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

// Dynamic Open Graph image generator.
// Usage: /api/og?title=<url-encoded title>&section=<badge label>
// Referenced from page metadata across WCAG guides, blog posts, and content sections.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rawTitle = searchParams.get("title") || "Accessibility.build"
  const section = searchParams.get("section") || ""
  const title = rawTitle.length > 120 ? `${rawTitle.slice(0, 117)}…` : rawTitle

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              A
            </div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>Accessibility.build</div>
          </div>
          {section ? (
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                padding: "10px 24px",
                borderRadius: 999,
                background: "rgba(59, 130, 246, 0.25)",
                border: "1px solid rgba(147, 197, 253, 0.5)",
                color: "#bfdbfe",
              }}
            >
              {section}
            </div>
          ) : null}
        </div>

        <div
          style={{
            fontSize: title.length > 70 ? 52 : 64,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, color: "#93c5fd" }}>accessibility.build</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"].map((c) => (
              <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
