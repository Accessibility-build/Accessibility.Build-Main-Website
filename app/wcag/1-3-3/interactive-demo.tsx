"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Palette,
  Circle,
  Square,
  Triangle,
  MapPin,
  Volume1,
  Play,
} from "lucide-react"

type ExampleKey = "color" | "shape" | "position" | "sound"

const selectors: { key: ExampleKey; label: string; icon: typeof Palette }[] = [
  { key: "color", label: "Color", icon: Palette },
  { key: "shape", label: "Shape", icon: Circle },
  { key: "position", label: "Position", icon: MapPin },
  { key: "sound", label: "Sound", icon: Volume1 },
]

export default function SensoryCharacteristicsDemo() {
  const [colorBlindMode, setColorBlindMode] = useState(false)
  const [selected, setSelected] = useState<ExampleKey>("color")

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        {selectors.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={selected === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(key)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setColorBlindMode(!colorBlindMode)}
          className="flex items-center gap-2 ml-auto"
        >
          {colorBlindMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {colorBlindMode ? "Normal view" : "Color-blind view"}
        </Button>
      </div>

      {/* Color example */}
      {selected === "color" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-rose-800 dark:text-rose-300 mb-3">
              <XCircle className="h-5 w-5" /> Relies on color only
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              &ldquo;To save, click the green button. To cancel, click the red button.&rdquo;
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                className={`px-6 py-2 rounded text-white font-medium ${
                  colorBlindMode ? "bg-slate-500" : "bg-green-600"
                }`}
              />
              <button
                className={`px-6 py-2 rounded text-white font-medium ${
                  colorBlindMode ? "bg-slate-600" : "bg-red-600"
                }`}
              />
            </div>
            {colorBlindMode && (
              <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">
                Both buttons look identical — the instruction is unusable.
              </p>
            )}
          </div>
          <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-300 mb-3">
              <CheckCircle className="h-5 w-5" /> Names the control
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              &ldquo;To save, click the <strong>Save</strong> button. To cancel, click the{" "}
              <strong>Cancel</strong> button.&rdquo;
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                className={`px-6 py-2 rounded text-white font-medium ${
                  colorBlindMode ? "bg-slate-500" : "bg-green-600"
                }`}
              >
                Save
              </button>
              <button
                className={`px-6 py-2 rounded text-white font-medium ${
                  colorBlindMode ? "bg-slate-600" : "bg-red-600"
                }`}
              >
                Cancel
              </button>
            </div>
            <p className="mt-3 text-sm text-green-700 dark:text-green-300">
              Even without color, the visible labels identify each button.
            </p>
          </div>
        </div>
      )}

      {/* Shape example */}
      {selected === "shape" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-rose-800 dark:text-rose-300 mb-3">
              <XCircle className="h-5 w-5" /> Relies on shape only
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              &ldquo;Press the round button to play, the square button to stop.&rdquo;
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="p-3 bg-blue-600 rounded-full">
                <Circle className="h-5 w-5 text-white fill-current" />
              </button>
              <button className="p-3 bg-blue-600 rounded">
                <Square className="h-5 w-5 text-white fill-current" />
              </button>
              <button className="p-3 bg-blue-600 rounded">
                <Triangle className="h-5 w-5 text-white fill-current" />
              </button>
            </div>
            <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">
              Screen-reader users perceive no shape, and the icons carry no name.
            </p>
          </div>
          <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-300 mb-3">
              <CheckCircle className="h-5 w-5" /> Names the control
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              &ldquo;Press <strong>Play</strong> to start, <strong>Stop</strong> to end.&rdquo;
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="flex flex-col items-center gap-1 p-3 bg-blue-600 rounded">
                <Play className="h-5 w-5 text-white" />
                <span className="text-white text-xs">Play</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-blue-600 rounded">
                <Square className="h-5 w-5 text-white fill-current" />
                <span className="text-white text-xs">Stop</span>
              </button>
            </div>
            <p className="mt-3 text-sm text-green-700 dark:text-green-300">
              Visible labels make each control identifiable to everyone.
            </p>
          </div>
        </div>
      )}

      {/* Position example */}
      {selected === "position" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-rose-800 dark:text-rose-300 mb-3">
              <XCircle className="h-5 w-5" /> Relies on location only
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              &ldquo;Use the menu on the right. Click the button at the bottom to submit.&rdquo;
            </p>
            <div className="relative min-h-40 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded">
              <div className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900/20 p-2 rounded text-xs">
                Menu
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Submit</button>
              </div>
            </div>
            <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">
              Position shifts by screen size and means nothing to a screen reader.
            </p>
          </div>
          <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-300 mb-3">
              <CheckCircle className="h-5 w-5" /> Names the control
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              &ldquo;Use the <strong>Navigation</strong> menu. Click <strong>Submit Form</strong> when
              ready.&rdquo;
            </p>
            <div className="space-y-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded">
                <p className="font-medium text-blue-800 dark:text-blue-200 text-sm">Navigation</p>
              </div>
              <div className="text-center">
                <button className="px-6 py-2 bg-blue-600 text-white rounded font-medium text-sm">
                  Submit Form
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-green-700 dark:text-green-300">
              Named references work at any screen size and for any input method.
            </p>
          </div>
        </div>
      )}

      {/* Sound example */}
      {selected === "sound" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-rose-800 dark:text-rose-300 mb-3">
              <XCircle className="h-5 w-5" /> Relies on sound only
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              &ldquo;Listen for the beep to know the upload finished.&rdquo;
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-center">
              <Volume1 className="h-7 w-7 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Uploading…</p>
              <p className="text-xs text-slate-500 mt-1">(audible beep is the only cue)</p>
            </div>
            <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">
              Deaf and hard-of-hearing users never receive the completion signal.
            </p>
          </div>
          <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-300 mb-3">
              <CheckCircle className="h-5 w-5" /> Provides a visible cue
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              &ldquo;A confirmation message appears when your upload is complete.&rdquo;
            </p>
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded text-center border border-green-300 dark:border-green-700">
              <CheckCircle className="h-7 w-7 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Upload complete</p>
            </div>
            <p className="mt-3 text-sm text-green-700 dark:text-green-300">
              A visible, text-based confirmation reaches every user.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
