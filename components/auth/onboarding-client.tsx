"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  Code2,
  FileText,
  Loader2,
  Palette,
  SearchCheck,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const roles = [
  { value: "developer", label: "Developer or engineer", detail: "I implement or test interfaces", icon: Code2 },
  { value: "designer", label: "Designer", detail: "I work on interaction, visual, or design-system decisions", icon: Palette },
  { value: "product", label: "Product, QA, or project lead", detail: "I organize requirements, testing, or delivery", icon: SearchCheck },
  { value: "content", label: "Content or document specialist", detail: "I work with web content, images, or documents", icon: FileText },
  { value: "consultant", label: "Accessibility consultant", detail: "I review or advise on accessibility work", icon: BookOpenCheck },
  { value: "other", label: "Another role", detail: "I use accessibility resources in another capacity", icon: UserRound },
] as const

const goals = [
  { value: "wcag-aa", label: "Understand or work toward WCAG 2.2 AA" },
  { value: "audit-existing-site", label: "Audit an existing website or application" },
  { value: "design-system", label: "Improve components or a design system" },
  { value: "documents", label: "Review images, PDFs, or compliance documents" },
  { value: "training", label: "Build accessibility knowledge" },
  { value: "service-support", label: "Evaluate professional accessibility support" },
] as const

type OnboardingClientProps = {
  nextPath: string
  firstName?: string
  initialRole?: string
  initialGoals: string[]
}

export function OnboardingClient({ nextPath, firstName, initialRole, initialGoals }: OnboardingClientProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(initialRole || "")
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialGoals)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const toggleGoal = (goal: string, checked: boolean) => {
    setSelectedGoals((current) => checked ? [...new Set([...current, goal])] : current.filter((item) => item !== goal))
  }

  const continueToGoals = () => {
    if (!role) {
      setError("Choose the role that most closely matches your work.")
      return
    }
    setError("")
    setStep(2)
  }

  const continueToReview = () => {
    if (selectedGoals.length === 0) {
      setError("Choose at least one accessibility goal.")
      return
    }
    setError("")
    setStep(3)
  }

  const finish = async () => {
    setSubmitting(true)
    setError("")
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, goals: selectedGoals }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || "Unable to save your preferences")
      }
      router.push(nextPath)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save your preferences")
      setSubmitting(false)
    }
  }

  const roleLabel = roles.find((item) => item.value === role)?.label
  const goalLabels = goals.filter((item) => selectedGoals.includes(item.value)).map((item) => item.label)

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50/60 dark:bg-slate-950">
      <div className="container-wide py-8 lg:py-14">
        <div className="mx-auto max-w-4xl">
          <header className="border-b pb-7">
            <p className="text-sm font-semibold uppercase text-primary">Account setup</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{firstName ? `Welcome, ${firstName}` : "Welcome to Accessibility.build"}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Choose a role and practical goals so the dashboard can provide more relevant starting points.</p>
            <div className="mt-6 max-w-xl">
              <div className="mb-2 flex justify-between text-sm text-muted-foreground"><span>Step {step} of 3</span><span>{Math.round((step / 3) * 100)}% complete</span></div>
              <Progress value={(step / 3) * 100} aria-label={`Onboarding step ${step} of 3`} />
            </div>
          </header>

          <section className="py-8" aria-live="polite">
            {step === 1 && (
              <fieldset>
                <legend className="text-2xl font-semibold">What best describes your work?</legend>
                <p className="mt-2 text-muted-foreground">This controls recommendations only. It does not enable or hide tools.</p>
                <RadioGroup value={role} onValueChange={setRole} className="mt-6 grid gap-3 md:grid-cols-2">
                  {roles.map((item) => {
                    const Icon = item.icon
                    return (
                      <Label key={item.value} htmlFor={`role-${item.value}`} className={cn("flex cursor-pointer items-start gap-4 border p-5 transition-colors", role === item.value && "border-primary bg-primary/5")}>
                        <RadioGroupItem id={`role-${item.value}`} value={item.value} className="mt-1" />
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        <span><span className="block font-semibold">{item.label}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.detail}</span></span>
                      </Label>
                    )
                  })}
                </RadioGroup>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend className="text-2xl font-semibold">What are you working toward?</legend>
                <p className="mt-2 text-muted-foreground">Choose every goal that is currently relevant.</p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {goals.map((item) => {
                    const checked = selectedGoals.includes(item.value)
                    return (
                      <Label key={item.value} htmlFor={`goal-${item.value}`} className={cn("flex min-h-20 cursor-pointer items-start gap-3 border p-4", checked && "border-primary bg-primary/5")}>
                        <Checkbox id={`goal-${item.value}`} checked={checked} onCheckedChange={(value) => toggleGoal(item.value, value === true)} />
                        <span className="leading-6">{item.label}</span>
                      </Label>
                    )
                  })}
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-semibold">Review your starting preferences</h2>
                <dl className="mt-6 divide-y border-y">
                  <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]"><dt className="font-semibold">Role</dt><dd className="text-muted-foreground">{roleLabel}</dd></div>
                  <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]"><dt className="font-semibold">Goals</dt><dd><ul className="space-y-2 text-muted-foreground">{goalLabels.map((label) => <li key={label} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{label}</li>)}</ul></dd></div>
                  <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]"><dt className="font-semibold">Next page</dt><dd className="break-all text-muted-foreground">{nextPath}</dd></div>
                </dl>
              </div>
            )}

            {error && <p className="mt-6 border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">{error}</p>}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
              <div>{step > 1 ? <Button type="button" variant="outline" onClick={() => { setError(""); setStep((current) => current - 1) }}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button> : <Button variant="ghost" asChild><Link href={nextPath}>Skip setup</Link></Button>}</div>
              {step === 1 && <Button type="button" onClick={continueToGoals}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>}
              {step === 2 && <Button type="button" onClick={continueToReview}>Review <ArrowRight className="ml-2 h-4 w-4" /></Button>}
              {step === 3 && <Button type="button" onClick={finish} disabled={submitting}>{submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving</> : <>Finish setup <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
