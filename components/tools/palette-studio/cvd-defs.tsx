import { cvdSvgMatrixValues } from "@/lib/color/cvd"

/**
 * Inline SVG `<filter>` defs for CVD simulation. Reference via
 * `style={{ filter: 'url(#cvd-protanopia)' }}` on any element.
 */
export function CVDFilterDefs() {
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="cvd-protanopia">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={cvdSvgMatrixValues("protanopia")}
          />
        </filter>
        <filter id="cvd-deuteranopia">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={cvdSvgMatrixValues("deuteranopia")}
          />
        </filter>
        <filter id="cvd-tritanopia">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={cvdSvgMatrixValues("tritanopia")}
          />
        </filter>
      </defs>
    </svg>
  )
}
