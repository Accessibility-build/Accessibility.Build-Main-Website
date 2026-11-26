"use client"
import { useEffect, useRef, useState } from "react"
import { CERTIFICATE_HEIGHT, CERTIFICATE_WIDTH, CertificateDocument, type CertificateView } from "@/components/courses/certificate-document"

/**
 * Shows the fixed certificate design scaled down uniformly to the available width, so it keeps its
 * exact look on any screen instead of reflowing. The text stays real text for assistive technology.
 */
export function CertificateScaled({ cert, headingLevel = 3 }: { cert: CertificateView; headingLevel?: 1 | 2 | 3 }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.28)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(Math.min(1, (el.clientWidth - 8) / CERTIFICATE_WIDTH)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={box} className="w-full min-w-0 overflow-hidden p-1">
      <div className="mx-auto overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-300 dark:ring-slate-700" style={{ width: CERTIFICATE_WIDTH * scale, height: CERTIFICATE_HEIGHT * scale }}>
        <div style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <CertificateDocument cert={cert} headingLevel={headingLevel} />
        </div>
      </div>
    </div>
  )
}
