/**
 * The marked area, in the image's own pixels. Pointer drags, arrow keys and the four number fields
 * all go through these helpers, so every route to the same area keeps it inside the image.
 */

export interface Area {
  x: number
  y: number
  width: number
  height: number
}

export type AreaField = keyof Area

export const MIN_AREA_SIZE = 2

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(Math.max(min, max), Math.round(value)))
}

/** Keeps an area inside a width by height image, shrinking it only if it is larger than the image. */
export function clampArea(area: Area, imageWidth: number, imageHeight: number): Area {
  const width = clampInt(area.width, MIN_AREA_SIZE, imageWidth)
  const height = clampInt(area.height, MIN_AREA_SIZE, imageHeight)
  return {
    x: clampInt(area.x, 0, imageWidth - width),
    y: clampInt(area.y, 0, imageHeight - height),
    width,
    height,
  }
}

/** Sets one field. Moving keeps the size; resizing keeps the position. */
export function withField(area: Area, field: AreaField, value: number, imageWidth: number, imageHeight: number): Area {
  switch (field) {
    case "x":
      return { ...area, x: clampInt(value, 0, imageWidth - area.width) }
    case "y":
      return { ...area, y: clampInt(value, 0, imageHeight - area.height) }
    case "width":
      return { ...area, width: clampInt(value, MIN_AREA_SIZE, imageWidth - area.x) }
    case "height":
      return { ...area, height: clampInt(value, MIN_AREA_SIZE, imageHeight - area.y) }
  }
}

/** The area between two corner points, as a pointer drag draws it. */
export function areaFromPoints(ax: number, ay: number, bx: number, by: number, imageWidth: number, imageHeight: number): Area {
  const left = Math.max(0, Math.floor(Math.min(ax, bx)))
  const top = Math.max(0, Math.floor(Math.min(ay, by)))
  const right = Math.min(imageWidth, Math.ceil(Math.max(ax, bx)))
  const bottom = Math.min(imageHeight, Math.ceil(Math.max(ay, by)))
  return { x: left, y: top, width: right - left, height: bottom - top }
}

/** One arrow-key step: moves the area, or with `resize` changes its width or height. */
export function nudgeArea(area: Area, key: string, resize: boolean, step: number, imageWidth: number, imageHeight: number): Area | null {
  const dx = key === "ArrowLeft" ? -step : key === "ArrowRight" ? step : 0
  const dy = key === "ArrowUp" ? -step : key === "ArrowDown" ? step : 0
  if (dx === 0 && dy === 0) return null
  if (resize) {
    return {
      ...area,
      width: clampInt(area.width + dx, MIN_AREA_SIZE, imageWidth - area.x),
      height: clampInt(area.height + dy, MIN_AREA_SIZE, imageHeight - area.y),
    }
  }
  return {
    ...area,
    x: clampInt(area.x + dx, 0, imageWidth - area.width),
    y: clampInt(area.y + dy, 0, imageHeight - area.height),
  }
}

/** A starting area in the middle of a new image, for the visitor to move onto the text. */
export function defaultArea(imageWidth: number, imageHeight: number): Area {
  return clampArea(
    { x: imageWidth * 0.15, y: imageHeight * 0.35, width: imageWidth * 0.7, height: imageHeight * 0.3 },
    imageWidth,
    imageHeight,
  )
}

export function sameArea(a: Area | null, b: Area | null): boolean {
  return !!a && !!b && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}
