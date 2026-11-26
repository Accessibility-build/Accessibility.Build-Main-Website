import { Logo } from "@/components/logo"
import { formatCertificateDate } from "@/lib/courses/certificate-rules"

export interface CertificateView {
  code: string
  recipientName: string
  courseTitle: string
  summary: string
  skills: string[]
  issuedAt: Date | string
  verifyUrl: string
  /** Null or absent: the certificate does not expire. */
  expiresAt?: Date | string | null
  revoked?: boolean
}

/** A4 landscape at 96 CSS px per inch. The certificate is a document with one fixed design. */
export const CERTIFICATE_WIDTH = 1123
export const CERTIFICATE_HEIGHT = 794

const NAVY = "#0b1b3f"
const INK = "#0f172a"
const MUTED = "#3f4a63"
const ACCENT = "#1e3a8a"

function nameSize(name: string) {
  return name.length <= 22 ? 60 : name.length <= 32 ? 50 : name.length <= 46 ? 42 : 34
}

/** Decorative seal: ring text and the brand mark. Hidden from assistive technology. */
export function CertificateSeal({ size = 168, id = "seal" }: { size?: number; id?: string }) {
  const ringId = `${id}-ring`.replace(/[^a-zA-Z0-9_-]/g, "")
  const ring = "ACCESSIBLE DESIGN · WCAG 2.2 AA · ACCESSIBLE DESIGN · WCAG 2.2 AA · "
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 200 200" width={size} height={size}>
      <defs><path id={ringId} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="#c7d2fe" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="64" fill="#ffffff" />
      <circle cx="100" cy="100" r="58" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="2 4" />
      <text fill="#e0e7ff" fontSize="10.5" fontWeight="700" letterSpacing="2" style={{ fontFamily: "inherit" }}>
        <textPath href={`#${ringId}`} textLength="486" lengthAdjust="spacing">{ring}</textPath>
      </text>
      <svg x="64" y="64" width="72" height="72" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill={ACCENT} />
        <path d="M24 10 L14 38 L18 38 L20 32 L28 32 L30 38 L34 38 L24 10 Z" fill="#ffffff" />
        <path d="M21 28 L27 28 L24 19 L21 28 Z" fill={ACCENT} />
        <path d="M14 22 Q24 16 34 22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M14 26 Q24 32 34 26" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </svg>
  )
}

/**
 * The certificate itself, laid out at a fixed size so it looks identical on screen, in print and in
 * the downloadable PDF. Content is real text in a semantic article, so the tagged PDF reads in order.
 */
export function CertificateDocument({ cert, headingLevel = 1 }: { cert: CertificateView; headingLevel?: 1 | 2 | 3 }) {
  const H = (["h1", "h2", "h3"] as const)[headingLevel - 1]
  const Sub = (["h2", "h3", "h4"] as const)[headingLevel - 1]
  const issued = formatCertificateDate(cert.issuedAt)
  return (
    <article
      aria-labelledby={`cert-${cert.code}-title`}
      className="relative flex flex-row-reverse overflow-hidden bg-white font-sans"
      style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, color: INK, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      <div className="relative flex flex-1 flex-col px-16 py-14">
        <div aria-hidden="true" className="absolute right-0 top-0 h-2 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, #0e7490)` }} />
        <H id={`cert-${cert.code}-title`} className="text-[15px] font-bold uppercase tracking-[0.32em]" style={{ color: ACCENT }}>Certificate of completion</H>
        <p className="mt-12 text-[18px]" style={{ color: MUTED }}>This certifies that</p>
        <p className="mt-2 break-words font-extrabold leading-[1.08] tracking-tight" style={{ fontSize: nameSize(cert.recipientName), color: INK }}>{cert.recipientName}</p>
        <div aria-hidden="true" className="mt-6 h-[3px] w-28 rounded-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, #0e7490)` }} />
        <p className="mt-6 text-[18px]" style={{ color: MUTED }}>has successfully completed the online course</p>
        <p className="mt-1 text-[32px] font-bold tracking-tight" style={{ color: INK }}>{cert.courseTitle}</p>
        <p className="mt-4 max-w-[600px] text-[15.5px] leading-relaxed" style={{ color: MUTED }}>{cert.summary}</p>
        {cert.skills.length ? (
          <>
            <Sub className="sr-only">Skills covered</Sub>
            <ul role="list" className="mt-6 flex max-w-[680px] flex-wrap gap-2">
              {cert.skills.map((s) => <li key={s} className="rounded-full border px-3 py-1 text-[13px] font-medium" style={{ borderColor: "#c7d2fe", background: "#eef2ff", color: ACCENT }}>{s}</li>)}
            </ul>
          </>
        ) : null}
        <div className="mt-auto flex items-end justify-between border-t pt-6" style={{ borderColor: "#e2e8f0" }}>
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" foreground={ACCENT} background="#ffffff" />
            <div><p className="text-[16px] font-bold" style={{ color: INK }}>Accessibility.build</p><p className="text-[13px]" style={{ color: MUTED }}>Issuer</p></div>
          </div>
          <p className="text-right text-[13px]" style={{ color: MUTED }}>Completed on<br /><span className="text-[16px] font-bold" style={{ color: INK }}>{issued}</span></p>
        </div>
      </div>

      <div className="relative flex shrink-0 flex-col justify-between px-11 py-12 text-white" style={{ width: 330, background: `linear-gradient(160deg, ${NAVY} 0%, #12296b 62%, ${ACCENT} 100%)` }}>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 330 794" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <circle cx="330" cy="0" r="210" fill="#ffffff" fillOpacity="0.05" />
          <circle cx="0" cy="794" r="260" fill="#ffffff" fillOpacity="0.05" />
        </svg>
        <div className="relative flex items-center gap-3">
          <Logo className="h-12 w-12" foreground="#ffffff" background={NAVY} />
          <p className="text-[22px] font-bold tracking-tight">Accessibility.build</p>
        </div>
        <div className="relative flex justify-center"><CertificateSeal id={`cert-${cert.code}`} /></div>
        <dl className="relative space-y-3.5 text-[13px] leading-snug">
          <div><dt className="font-semibold uppercase tracking-[0.18em] text-[#c7d2fe]">Credential ID</dt><dd className="mt-1 font-mono text-[17px] font-semibold tracking-wider">{cert.code}</dd></div>
          <div><dt className="font-semibold uppercase tracking-[0.18em] text-[#c7d2fe]">Issued</dt><dd className="mt-1 text-[15px] font-semibold">{issued}</dd></div>
          {cert.expiresAt ? <div><dt className="font-semibold uppercase tracking-[0.18em] text-[#c7d2fe]">Valid until</dt><dd className="mt-1 text-[15px] font-semibold">{formatCertificateDate(cert.expiresAt)}</dd></div> : null}
          <div><dt className="font-semibold uppercase tracking-[0.18em] text-[#c7d2fe]">Verify</dt><dd className="mt-1 text-[13px] font-medium">{cert.verifyUrl.replace(/^https?:\/\//, "").replace(/\/[^/]+$/, "/")}<br /><span className="font-mono">{cert.verifyUrl.split("/").pop()}</span></dd></div>
        </dl>
      </div>

      {cert.revoked ? (
        <div className="absolute left-1/2 top-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] py-3 text-center text-[28px] font-extrabold uppercase tracking-[0.4em] text-white" style={{ background: "#991b1b" }}>Revoked</div>
      ) : null}
    </article>
  )
}
