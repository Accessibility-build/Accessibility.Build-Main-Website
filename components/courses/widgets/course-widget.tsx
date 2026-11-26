"use client"
import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import type { CourseWidgetId } from "@/lib/courses/types"

const loading = () => <p className="text-sm text-slate-600 dark:text-slate-400">Loading the interactive example…</p>
// Each widget loads only when a lesson uses it.
const WIDGETS = {
  "text-scaling": dynamic(() => import("./text-scaling").then((m) => m.TextScaling), { loading }),
  "caption-styler": dynamic(() => import("./caption-styler").then((m) => m.CaptionStyler), { loading }),
  "screen-reader-preview": dynamic(() => import("./screen-reader-preview").then((m) => m.ScreenReaderPreview), { loading }),
  "alt-text-writer": dynamic(() => import("./alt-text-writer").then((m) => m.AltTextWriter), { loading }),
  "form-error-designer": dynamic(() => import("./form-error-designer").then((m) => m.FormErrorDesigner), { loading }),
  "component-states": dynamic(() => import("./component-states").then((m) => m.ComponentStates), { loading }),
  "heading-outline": dynamic(() => import("./heading-outline").then((m) => m.HeadingOutline), { loading }),
  "link-text": dynamic(() => import("./link-text").then((m) => m.LinkText), { loading }),
  "contrast-checker": dynamic(() => import("./contrast-checker").then((m) => m.ContrastChecker), { loading }),
  "color-vision": dynamic(() => import("./color-vision").then((m) => m.ColorVision), { loading }),
  "focus-indicator": dynamic(() => import("./focus-indicator").then((m) => m.FocusIndicator), { loading }),
  "target-size": dynamic(() => import("./target-size").then((m) => m.TargetSize), { loading }),
  "text-spacing": dynamic(() => import("./text-spacing").then((m) => m.TextSpacing), { loading }),
  reflow: dynamic(() => import("./reflow").then((m) => m.Reflow), { loading }),
  "reduced-motion": dynamic(() => import("./reduced-motion").then((m) => m.ReducedMotion), { loading }),
  "focus-order": dynamic(() => import("./focus-order").then((m) => m.FocusOrder), { loading }),
  "annotation-overlay": dynamic(() => import("./annotation-overlay").then((m) => m.AnnotationOverlay), { loading }),
} satisfies Record<CourseWidgetId, unknown>

export function CourseWidget({ widget, preset, idPrefix }: { widget: CourseWidgetId; preset?: Record<string, string>; idPrefix: string }) {
  const Widget = WIDGETS[widget] as ComponentType<{ preset?: Record<string, string>; idPrefix: string }> | undefined
  if (!Widget) return null
  return <Widget preset={preset} idPrefix={idPrefix} />
}
