// Provenance of lib/data/w3c-wcag22.json, the committed snapshot of W3C's
// machine-readable WCAG 2.2 file. The JSON is byte-for-byte what W3C served;
// do not edit it. To refresh: download the source URL again, replace the JSON,
// update every field below, then run `node scripts/check-wcag-download.mjs`.

export const W3C_WCAG22_META = {
  sourceUrl: "https://www.w3.org/WAI/WCAG22/wcag.json",
  readmeUrl: "https://github.com/w3c/wcag/tree/main/11ty/json#readme",
  /** Local date the file was downloaded (Asia/Kolkata). */
  retrievedOn: "2026-11-11",
  /** HTTP Date header of the download response. */
  retrievedAt: "2026-11-10T23:12:28Z",
  /** HTTP Last-Modified header W3C sent with the file. */
  sourceLastModified: "2026-11-06T08:56:14Z",
  bytes: 516695,
  sha256: "b6bedebc86e96c4989722dd7ebb49eb604f8b832de04f7a570430c5ebee097e6",

  /** The WCAG 2.2 document the data comes from. */
  specTitle: "Web Content Accessibility Guidelines (WCAG) 2.2",
  specLatestUrl: "https://www.w3.org/TR/WCAG22/",
  specDatedUrl: "https://www.w3.org/TR/2024/REC-WCAG22-20241212/",
  specStatus: "W3C Recommendation 12 December 2024",
  specStatusIso: "2024-12-12",
  /** Copyright line as printed in the WCAG 2.2 Recommendation. */
  copyrightNotice:
    "Copyright © 2020-2024 World Wide Web Consortium. W3C® liability, trademark and document use rules apply.",
  licenceName: "W3C Document License",
  licenceUrl: "https://www.w3.org/copyright/document-license-2023/",
  usingWaiMaterialUrl: "https://www.w3.org/WAI/about/using-wai-material/",
} as const
