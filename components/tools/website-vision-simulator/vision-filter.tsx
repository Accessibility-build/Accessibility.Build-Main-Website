import type { FilterPrimitive } from "@/lib/vision/filters"

/**
 * One inline SVG filter, referenced from CSS as `filter: url(#id)`. The id comes from the caller's
 * useId, so two simulators (or the palette studio's fixed CVD ids) on one page cannot collide.
 *
 * Colour matrices and blur run in linearRGB, which is what the Machado matrices and optical blur
 * assume; the contrast step runs in sRGB so it matches CSS contrast(). Both are set explicitly
 * rather than left to the default.
 */
export function VisionFilter({ id, primitives }: { id: string; primitives: FilterPrimitive[] }) {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          {primitives.map((primitive, index) => {
            if (primitive.kind === "matrix") {
              return <feColorMatrix key={index} type="matrix" values={primitive.values.join(" ")} colorInterpolationFilters="linearRGB" />
            }
            if (primitive.kind === "blur") {
              return <feGaussianBlur key={index} stdDeviation={primitive.stdDeviation} edgeMode="duplicate" colorInterpolationFilters="linearRGB" />
            }
            return (
              <feComponentTransfer key={index} colorInterpolationFilters="sRGB">
                <feFuncR type="linear" slope={primitive.slope} intercept={primitive.intercept} />
                <feFuncG type="linear" slope={primitive.slope} intercept={primitive.intercept} />
                <feFuncB type="linear" slope={primitive.slope} intercept={primitive.intercept} />
              </feComponentTransfer>
            )
          })}
        </filter>
      </defs>
    </svg>
  )
}
