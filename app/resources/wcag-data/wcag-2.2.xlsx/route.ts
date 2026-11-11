import { WCAG_DOWNLOAD_FILES } from "@/lib/wcag-download"
import { buildWcagXlsx } from "@/lib/wcag-download-xlsx"

// Prerendered at build from the committed W3C snapshot; nothing runs per request.
export const dynamic = "force-static"

export function GET() {
  const file = WCAG_DOWNLOAD_FILES.xlsx
  return new Response(new Uint8Array(buildWcagXlsx()), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    },
  })
}
