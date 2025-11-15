import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={cn("h-8 w-8", className)} aria-hidden="true">
      {/* Main circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--a11y-purple))" />
          <stop offset="100%" stopColor="hsl(var(--a11y-teal))" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main circle */}
      <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" filter="url(#shadow)" />

      {/* "A" letter stylized */}
      <path d="M24 10 L14 38 L18 38 L20 32 L28 32 L30 38 L34 38 L24 10 Z" fill="white" strokeLinejoin="round" />

      {/* Crossbar of the "A" */}
      <path d="M21 28 L27 28 L24 19 L21 28 Z" fill="url(#logoGradient)" />

      {/* Accessibility wave symbol */}
      <path d="M14 22 Q24 16 34 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 26 Q24 32 34 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}
