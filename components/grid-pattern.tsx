import { cn } from "@/lib/utils"

interface GridPatternProps {
  className?: string
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: number[][]
  containerClassName?: string
}

export function GridPattern({
  className,
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares = [[0, 1]],
  containerClassName,
}: GridPatternProps) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", containerClassName)}>
      <svg className={cn("absolute left-0 top-0 h-full w-full", className)} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
            <path d="M.5 0V40M0 .5H40" fill="none" stroke="currentColor" strokeOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        {squares && (
          <g fill="currentColor" fillOpacity="0.05">
            {squares.map(([x, y]) => (
              <rect key={`${x}-${y}`} width={width} height={height} x={x * width} y={y * height} />
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}
