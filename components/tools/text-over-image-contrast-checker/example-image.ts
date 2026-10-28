import type { Area } from "./geometry"

/**
 * The built-in example, drawn on a canvas so there is no asset to ship: a white headline over a sky
 * that runs from deep blue to almost white, with the sun behind the end of the words. The left of
 * the headline passes and the right does not, which is the usual way hero images fail.
 */

export const EXAMPLE_SIZE = { width: 1200, height: 630 }

/** Generous enough to hold both lines whatever system font draws them. */
export const EXAMPLE_AREA: Area = { x: 60, y: 190, width: 900, height: 230 }

export async function createExampleImage(): Promise<Blob> {
  const { width, height } = EXAMPLE_SIZE
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available in this browser.")

  const sky = ctx.createLinearGradient(0, 0, width, 0)
  sky.addColorStop(0, "#0b3d91")
  sky.addColorStop(0.5, "#4f9bd9")
  sky.addColorStop(1, "#eef5fb")
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, height)

  const sun = ctx.createRadialGradient(900, 250, 20, 900, 250, 280)
  // Pale yellow rather than white, so the sun is background and not mistaken for the white text.
  sun.addColorStop(0, "rgba(255, 238, 186, 1)")
  sun.addColorStop(1, "rgba(255, 238, 186, 0)")
  ctx.fillStyle = sun
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = "#1f4d2b"
  ctx.beginPath()
  ctx.moveTo(0, 520)
  ctx.bezierCurveTo(320, 430, 640, 570, width, 470)
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()
  ctx.fill()

  const font = "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.textBaseline = "alphabetic"
  ctx.font = `700 112px ${font}`
  ctx.fillText("Summer sale", 80, 300, 860)
  ctx.font = `500 44px ${font}`
  ctx.fillText("Up to half price on garden furniture", 84, 380, 860)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The example image could not be drawn."))), "image/png")
  })
}
