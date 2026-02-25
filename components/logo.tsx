import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={cn("h-8 w-8", className)} aria-hidden="true">
      {/* Monochrome treatment */}
      <defs>
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Base shape */}
      <circle cx="24" cy="24" r="22" fill="#0A0A0A" filter="url(#logoShadow)" />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.5" />

      {/* "A" letter stylized */}
      <path d="M24 10 L14 38 L18 38 L20 32 L28 32 L30 38 L34 38 L24 10 Z" fill="#FFFFFF" strokeLinejoin="round" />

      {/* Crossbar of the "A" */}
      <path d="M21 28 L27 28 L24 19 L21 28 Z" fill="#0A0A0A" />

      {/* Accessibility wave symbol */}
      <path d="M14 22 Q24 16 34 22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 26 Q24 32 34 26" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}
