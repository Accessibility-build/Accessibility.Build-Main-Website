import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  /** Fixed colours for documents (for example the certificate). Defaults follow the site theme. */
  foreground?: string
  background?: string
}

export function Logo({ className, foreground = "hsl(var(--foreground))", background = "hsl(var(--background))" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={cn("h-8 w-8 shrink-0 transition-colors", className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* Theme-driven mark: foreground ring with inverse glyph for light/dark adaptation. */}
      <circle cx="24" cy="24" r="22" fill={foreground} />

      {/* "A" letter stylized */}
      <path
        d="M24 10 L14 38 L18 38 L20 32 L28 32 L30 38 L34 38 L24 10 Z"
        fill={background}
        strokeLinejoin="round"
      />

      {/* Crossbar of the "A" */}
      <path d="M21 28 L27 28 L24 19 L21 28 Z" fill={foreground} />

      {/* Accessibility wave symbol */}
      <path d="M14 22 Q24 16 34 22" stroke={background} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 26 Q24 32 34 26" stroke={background} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}
