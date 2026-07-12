"use client"

import { useState } from "react"
import { useForm, ValidationError } from "@formspree/react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Globe2,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const serviceOptions = [
  ["accessibility-audit", "Accessibility audit"],
  ["remediation", "Remediation support"],
  ["design-review", "Design review"],
  ["user-testing", "Accessibility user testing"],
  ["training", "Accessibility training"],
  ["documentation", "Compliance documentation"],
  ["general", "General accessibility enquiry"],
] as const

const technologyOptions = [
  "React / Next.js",
  "Vue / Nuxt",
  "Angular",
  "WordPress",
  "Shopify",
  "Drupal",
  "Static HTML / custom frontend",
  "Mobile application",
  "PDF or document workflow",
  "Multiple or not yet known",
] as const

const deliverables = [
  { value: "spreadsheet", label: "Spreadsheet", description: "Structured findings for filtering, ownership, and remediation tracking.", icon: FileSpreadsheet },
  { value: "pdf", label: "PDF report", description: "A portable report for review, procurement, or internal distribution.", icon: ShieldCheck },
  { value: "private-web", label: "Private web report", description: "A private online version for navigating findings and evidence.", icon: Globe2 },
] as const

const procurementOptions = [
  ["nda", "NDA before access or discovery"],
  ["dpa-security", "DPA, security, or privacy review"],
  ["vendor-po", "Vendor onboarding or purchase order"],
  ["gst-invoice", "GST invoice or tax details"],
  ["questionnaire", "Accessibility or supplier questionnaire"],
  ["none", "No formal procurement requirements"],
] as const

type BriefData = {
  serviceType: string
  urls: string
  technology: string
  otherTechnology: string
  pageCount: string
  deliverable: string
  timeline: string
  targetDate: string
  budget: string
  procurement: string[]
  procurementNotes: string
  name: string
  email: string
  organization: string
  context: string
}

const initialData: BriefData = {
  serviceType: "",
  urls: "",
  technology: "",
  otherTechnology: "",
  pageCount: "",
  deliverable: "spreadsheet",
  timeline: "",
  targetDate: "",
  budget: "",
  procurement: [],
  procurementNotes: "",
  name: "",
  email: "",
  organization: "",
  context: "",
}

const serviceAliases: Record<string, BriefData["serviceType"]> = {
  audit: "accessibility-audit",
  "accessibility-audits": "accessibility-audit",
  "accessibility-audit": "accessibility-audit",
  remediation: "remediation",
  "remediation-support": "remediation",
  "design-review": "design-review",
  "design-reviews": "design-review",
  "user-testing": "user-testing",
  training: "training",
  "accessibility-training": "training",
  documentation: "documentation",
  "compliance-documentation": "documentation",
  general: "general",
}

const inputClass = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

type ProjectBriefBuilderProps = {
  requestedService?: string
  requestedPackage?: string
}

export function ProjectBriefBuilder({ requestedService, requestedPackage }: ProjectBriefBuilderProps) {
  const [submission, handleSubmit] = useForm("xpwdbywd")
  const [step, setStep] = useState(1)
  const [data, setData] = useState<BriefData>(() => {
    const serviceType = requestedService ? serviceAliases[requestedService.toLowerCase()] || "" : ""
    const packageName = requestedPackage?.trim().replace(/[-_]+/g, " ")
    return {
      ...initialData,
      serviceType,
      context: packageName ? `Selected pricing package: ${packageName}` : "",
    }
  })
  const [error, setError] = useState("")

  const setField = (field: keyof BriefData, value: string) => {
    setData((current) => ({ ...current, [field]: value }))
  }

  const toggleProcurement = (value: string, checked: boolean) => {
    setData((current) => {
      if (value === "none" && checked) return { ...current, procurement: ["none"] }
      const withoutNone = current.procurement.filter((item) => item !== "none" && item !== value)
      return { ...current, procurement: checked ? [...withoutNone, value] : withoutNone }
    })
  }

  const serviceLabel = serviceOptions.find(([value]) => value === data.serviceType)?.[1] || "Not selected"
  const procurementLabels = procurementOptions.filter(([value]) => data.procurement.includes(value)).map(([, label]) => label)
  const deliverableLabel = deliverables.find((item) => item.value === data.deliverable)?.label || "Not selected"
  const technologyLabel = data.technology === "Other" ? data.otherTechnology : data.technology

  const validateStep = (currentStep: number) => {
    if (currentStep === 1 && !data.serviceType) return "Choose the service or enquiry type."
    if (currentStep === 1 && !data.technology) return "Choose the primary technology or content type."
    if (currentStep === 1 && data.technology === "Other" && !data.otherTechnology.trim()) return "Describe the technology or content type."
    if (currentStep === 1 && (!data.pageCount || Number(data.pageCount) < 1)) return "Enter an approximate page, screen, or template count."
    if (currentStep === 2 && !data.deliverable) return "Choose a preferred deliverable."
    if (currentStep === 2 && !data.timeline) return "Choose the expected timeline."
    if (currentStep === 2 && !data.budget) return "Choose a budget range or select that the budget is not set."
    if (currentStep === 2 && data.procurement.length === 0) return "Select the applicable procurement requirements or choose none."
    if (currentStep === 3 && !data.name.trim()) return "Enter your name."
    if (currentStep === 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "Enter a valid email address."
    return ""
  }

  const advance = () => {
    const message = validateStep(step)
    if (message) {
      setError(message)
      return
    }
    setError("")
    setStep((current) => Math.min(3, current + 1))
  }

  const formSummary = [
    ["Service", serviceLabel],
    ["URLs", data.urls.trim() || "To be shared during discovery"],
    ["Technology", technologyLabel || "Not selected"],
    ["Approximate scope", `${data.pageCount || "0"} pages, screens, or templates`],
    ["Deliverable", deliverableLabel],
    ["Timeline", data.targetDate ? `${data.timeline} - target ${data.targetDate}` : data.timeline],
    ["Budget", data.budget],
    ["Procurement", procurementLabels.join(", ") || "Not selected"],
  ]

  const submitBrief = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = validateStep(3)
    if (message) {
      setError(message)
      return
    }

    setError("")
    const honeypot = new FormData(event.currentTarget).get("_gotcha")
    const form = new FormData()
    form.append("form_type", "Accessibility service project brief")
    form.append("service_type", serviceLabel)
    form.append("urls", data.urls || "Not supplied")
    form.append("technology", technologyLabel || "Not supplied")
    form.append("page_count", data.pageCount)
    form.append("deliverable", deliverableLabel)
    form.append("timeline", data.timeline)
    form.append("target_date", data.targetDate || "Not supplied")
    form.append("budget", data.budget)
    form.append("procurement_requirements", procurementLabels.join(", "))
    form.append("procurement_notes", data.procurementNotes || "Not supplied")
    form.append("name", data.name)
    form.append("email", data.email)
    form.append("organization", data.organization || "Not supplied")
    form.append("project_context", data.context || "Not supplied")
    form.append("_gotcha", typeof honeypot === "string" ? honeypot : "")
    await handleSubmit(form)
  }

  if (submission.succeeded) {
    return (
      <div className="py-10 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">Project brief received</h3>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">Thank you. The scope, delivery preferences, and procurement requirements will normally be reviewed within two business days.</p>
        <Button type="button" variant="outline" className="mt-6" onClick={() => { setData(initialData); setStep(1); window.location.reload() }}>Start another brief</Button>
      </div>
    )
  }

  return (
    <form onSubmit={submitBrief} noValidate>
      <div className="border-b pb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Step {step} of 3</span><span>{Math.round((step / 3) * 100)}% complete</span></div>
        <Progress value={(step / 3) * 100} className="mt-2" aria-label={`Project brief step ${step} of 3`} />
        <ol className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm" aria-label="Project brief steps">
          {["Scope", "Delivery", "Contact and review"].map((label, index) => <li key={label} className={cn("border-t pt-2", step === index + 1 ? "border-primary font-semibold text-foreground" : "text-muted-foreground")}>{label}</li>)}
        </ol>
      </div>

      {step === 1 && (
        <fieldset className="space-y-6 py-7">
          <legend className="text-2xl font-semibold">Project scope</legend>
          <p className="text-sm leading-6 text-muted-foreground">Approximate information is enough. Do not include passwords, private customer data, or confidential files.</p>
          <div className="space-y-2">
            <Label htmlFor="brief-service">Service type <span aria-hidden="true" className="text-red-600">*</span></Label>
            <select id="brief-service" value={data.serviceType} onChange={(event) => setField("serviceType", event.target.value)} className={inputClass} required>
              <option value="">Choose a service</option>
              {serviceOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brief-urls">Public URLs or representative routes</Label>
            <Textarea id="brief-urls" value={data.urls} onChange={(event) => setField("urls", event.target.value)} rows={4} placeholder={"https://example.com\nhttps://example.com/checkout"} aria-describedby="brief-urls-help" />
            <p id="brief-urls-help" className="text-xs text-muted-foreground">One URL per line. Leave blank when access will be arranged later.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brief-technology">Primary technology or content type <span aria-hidden="true" className="text-red-600">*</span></Label>
              <select id="brief-technology" value={data.technology} onChange={(event) => setField("technology", event.target.value)} className={inputClass} required>
                <option value="">Choose a technology</option>
                {technologyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brief-page-count">Approximate pages, screens, or templates <span aria-hidden="true" className="text-red-600">*</span></Label>
              <Input id="brief-page-count" type="number" min="1" max="100000" inputMode="numeric" value={data.pageCount} onChange={(event) => setField("pageCount", event.target.value)} placeholder="12" required />
            </div>
          </div>
          {data.technology === "Other" && <div className="space-y-2"><Label htmlFor="brief-other-technology">Describe the technology or content type <span aria-hidden="true" className="text-red-600">*</span></Label><Input id="brief-other-technology" value={data.otherTechnology} onChange={(event) => setField("otherTechnology", event.target.value)} required /></div>}
        </fieldset>
      )}

      {step === 2 && (
        <div className="space-y-8 py-7">
          <fieldset>
            <legend className="text-2xl font-semibold">Preferred deliverable</legend>
            <RadioGroup value={data.deliverable} onValueChange={(value) => setField("deliverable", value)} className="mt-5 grid gap-3 md:grid-cols-3">
              {deliverables.map((item) => { const Icon = item.icon; return <Label key={item.value} htmlFor={`deliverable-${item.value}`} className={cn("flex cursor-pointer flex-col border p-4", data.deliverable === item.value && "border-primary bg-primary/5")}><div className="flex items-center gap-3"><RadioGroupItem id={`deliverable-${item.value}`} value={item.value} /><Icon className="h-5 w-5 text-primary" aria-hidden="true" /><span className="font-semibold">{item.label}</span></div><span className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</span></Label> })}
            </RadioGroup>
          </fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="brief-timeline">Timeline <span aria-hidden="true" className="text-red-600">*</span></Label><select id="brief-timeline" value={data.timeline} onChange={(event) => setField("timeline", event.target.value)} className={inputClass} required><option value="">Choose a timeline</option><option>Within 2 weeks</option><option>3 to 4 weeks</option><option>1 to 2 months</option><option>More than 2 months</option><option>Flexible or not yet set</option></select></div>
          </div>
          <div className="space-y-2"><Label htmlFor="brief-budget">Budget range <span aria-hidden="true" className="text-red-600">*</span></Label><select id="brief-budget" value={data.budget} onChange={(event) => setField("budget", event.target.value)} className={inputClass} required><option value="">Choose a range</option><option>Under USD 1,000</option><option>USD 1,000 to 3,000</option><option>USD 3,000 to 7,500</option><option>USD 7,500 or more</option><option>Budget not yet set - recommend a scope</option></select></div>
          <fieldset>
            <legend className="font-semibold">Procurement requirements <span aria-hidden="true" className="text-red-600">*</span></legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">{procurementOptions.map(([value, label]) => { const checked = data.procurement.includes(value); return <Label key={value} htmlFor={`procurement-${value}`} className={cn("flex min-h-16 cursor-pointer items-start gap-3 border p-4", checked && "border-primary bg-primary/5")}><Checkbox id={`procurement-${value}`} checked={checked} onCheckedChange={(state) => toggleProcurement(value, state === true)} /><span className="leading-6">{label}</span></Label> })}</div>
          </fieldset>
          <div className="space-y-2"><Label htmlFor="brief-procurement-notes">Procurement notes</Label><Textarea id="brief-procurement-notes" value={data.procurementNotes} onChange={(event) => setField("procurementNotes", event.target.value)} rows={3} placeholder="Vendor forms, payment terms, security review, or invoice instructions" /></div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 py-7">
          <fieldset>
            <legend className="text-2xl font-semibold">Contact details</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="brief-name">Name <span aria-hidden="true" className="text-red-600">*</span></Label><Input id="brief-name" name="name" autoComplete="name" value={data.name} onChange={(event) => setField("name", event.target.value)} required /><ValidationError prefix="Name" field="name" errors={submission.errors} /></div>
              <div className="space-y-2"><Label htmlFor="brief-email">Email <span aria-hidden="true" className="text-red-600">*</span></Label><Input id="brief-email" name="email" type="email" autoComplete="email" value={data.email} onChange={(event) => setField("email", event.target.value)} required /><ValidationError prefix="Email" field="email" errors={submission.errors} /></div>
              <div className="space-y-2 sm:col-span-2"><Label htmlFor="brief-organization">Organization</Label><Input id="brief-organization" autoComplete="organization" value={data.organization} onChange={(event) => setField("organization", event.target.value)} /></div>
              <div className="space-y-2 sm:col-span-2"><Label htmlFor="brief-context">Additional context or important workflows</Label><Textarea id="brief-context" value={data.context} onChange={(event) => setField("context", event.target.value)} rows={4} placeholder="Describe high-priority journeys, known barriers, previous testing, or expected outcomes" /></div>
            </div>
          </fieldset>
          <section aria-labelledby="brief-review-heading" className="border-t pt-6">
            <h3 id="brief-review-heading" className="text-xl font-semibold">Review brief</h3>
            <dl className="mt-4 divide-y border-y">{formSummary.map(([term, detail]) => <div key={term} className="grid gap-1 py-3 text-sm sm:grid-cols-[10rem_1fr]"><dt className="font-semibold">{term}</dt><dd className="whitespace-pre-wrap break-words text-muted-foreground">{detail}</dd></div>)}</dl>
          </section>
        </div>
      )}

      {error && <p className="border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">{error}</p>}
      {submission.errors && Object.keys(submission.errors).length > 0 && <p className="border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">The brief could not be sent. Review the contact details or email contact@accessibility.build.</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
        <div>{step > 1 ? <Button type="button" variant="outline" onClick={() => { setError(""); setStep((current) => current - 1) }}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button> : <span className="text-sm text-muted-foreground">Required fields are marked with an asterisk.</span>}</div>
        {step < 3 ? <Button type="button" onClick={advance}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button> : <Button type="submit" disabled={submission.submitting}>{submission.submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending brief</> : <><Mail className="mr-2 h-4 w-4" />Send project brief</>}</Button>}
      </div>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    </form>
  )
}
