import { exportCSS } from "./css"
import { exportDTCG } from "./dtcg"
import { exportFigma } from "./figma"
import { exportKotlin } from "./kotlin"
import { exportSwift } from "./swift"
import { exportTailwindV3, exportTailwindV4 } from "./tailwind"
import type { ExportFile, ExportFormat, ExportInput } from "./types"

export function exportPalette(format: ExportFormat, input: ExportInput): ExportFile {
  switch (format) {
    case "css":
      return exportCSS(input)
    case "tailwind-v4":
      return exportTailwindV4(input)
    case "tailwind-v3":
      return exportTailwindV3(input)
    case "dtcg":
      return exportDTCG(input)
    case "figma":
      return exportFigma(input)
    case "swift":
      return exportSwift(input)
    case "kotlin":
      return exportKotlin(input)
    case "json":
      return {
        filename: `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`,
        language: "json",
        content: JSON.stringify(
          { name: input.name, scales: input.scales, tokens: input.tokens },
          null,
          2
        ),
      }
  }
}

export type { ExportFile, ExportFormat, ExportInput }
