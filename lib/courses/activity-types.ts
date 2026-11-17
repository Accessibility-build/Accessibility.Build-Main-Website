/** Generic activity shapes. Authored lessons and activities stay in the private course store. */
export interface CourseSource {
  title: string
  url: string
  version?: string
  reviewedAt?: string
  context?: "exam" | "practice" | "unconfirmed"
}

export interface ActivityStep {
  id: string
  prompt: string
  options: Array<{ id: string; text: string; feedback: string }>
  answer: string
  hint?: string
}

/** Checks establish only the named property, never full WCAG conformance. */
export interface LabCheck {
  id: string
  label: string
  selector?: string
  attribute?: string
  equals?: string
  textIncludes?: string
  minCount?: number
  maxCount?: number
  /** An authored source pattern, useful for a small CSS/JavaScript inspection exercise. */
  pattern?: string
}

export interface CourseActivity {
  id: string
  version: string
  kind: "case" | "lab"
  title: string
  brief: string
  outcomes: string[]
  objectiveRefs: string[]
  minutes: number
  steps: ActivityStep[]
  reflection: { prompt: string; criteria: string[]; example: string }
  sources: CourseSource[]
  starterCode?: string
  solutionCode?: string
  checks?: LabCheck[]
  manualChecks?: string[]
  hints?: string[]
  transfer: { prompt: string; options: Array<{ text: string; feedback: string }>; answer: number }
}

export interface ActivityState {
  version: string
  answers: Record<string, string>
  checked: string[]
  code?: string
  reflection: string
  criteria: string[]
  manual: string[]
  transfer?: string
  confidence?: "low" | "medium" | "high"
  completedAt?: string
}

export interface LabCheckResult {
  id: string
  label: string
  passed: boolean
}
