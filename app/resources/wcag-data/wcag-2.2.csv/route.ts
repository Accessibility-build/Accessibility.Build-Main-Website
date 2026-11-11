import { WCAG_DOWNLOAD_FILES, buildWcagCsv } from "@/lib/wcag-download"

// Prerendered at build from the committed W3C snapshot; nothing runs per request.
export const dynamic = "force-static"

export function GET() {
  const file = WCAG_DOWNLOAD_FILES.csv
  return new Response(buildWcagCsv(), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Access-Control-Allow-Origin": "*",
    },
  })
}
