import { checkWordDocument } from "./docx"
import { openOfficePackage, OfficeFileError, refuseByNameAndSize } from "./package"
import { checkPresentation } from "./pptx"
import type { OfficeReport } from "./types"
import type { ParseXml } from "./xml"

// Word and PowerPoint accessibility checks. Everything here is pure: it takes
// the file's bytes and an XML parser and returns a report, so it runs in the
// browser (the file never leaves the device) and in Node for tests.

export { OfficeFileError, refuseByNameAndSize, MAX_FILE_BYTES } from "./package"
export type { OfficeReport, CheckResult, Finding, Severity, CheckStatus } from "./types"
export type { ParseXml } from "./xml"

export function analyseOfficeFile(bytes: Uint8Array, fileName: string, parseXml: ParseXml): OfficeReport {
  const refusal = refuseByNameAndSize(fileName, bytes.byteLength)
  if (refusal) throw new OfficeFileError(refusal)
  const pkg = openOfficePackage(bytes, parseXml)
  return pkg.kind === "docx" ? checkWordDocument(pkg, fileName) : checkPresentation(pkg, fileName)
}
