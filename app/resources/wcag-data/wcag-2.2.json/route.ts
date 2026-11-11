import { WCAG_DOWNLOAD_FILES, buildWcagJson } from "@/lib/wcag-download"

// Prerendered at build from the committed W3C snapshot; nothing runs per request.
export const dynamic = "force-static"

export function GET() {
  const file = WCAG_DOWNLOAD_FILES.json
  // inline, so scripts and browsers can read it directly; the page's link
  // carries a download attribute for people who want the file.
  return new Response(buildWcagJson(), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `inline; filename="${file.filename}"`,
      "Access-Control-Allow-Origin": "*",
    },
  })
}
