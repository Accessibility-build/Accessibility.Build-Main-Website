"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Scale,
  ShieldCheck,
} from "lucide-react"

/**
 * EAA Scope Checker: a guided questionnaire that tells a business whether the
 * European Accessibility Act (Directive (EU) 2019/882) is likely to apply to
 * it. The logic mirrors the Directive: an EU consumer nexus, a covered product
 * or service category, and the service-provider microenterprise exemption.
 *
 * Educational guidance only, not legal advice. The wording of the results is
 * deliberately "likely / unlikely" because scope edge cases are for counsel.
 */

const SERVICE_CATEGORIES = [
  {
    id: "ecommerce",
    label: "E-commerce: we sell products or services to consumers online",
    detail: "Online shops, booking flows, paid subscriptions sold to consumers",
  },
  {
    id: "banking",
    label: "Consumer banking or payment services",
    detail: "Current accounts, credit, payment services offered to consumers",
  },
  {
    id: "ebooks",
    label: "E-books or e-reading software",
    detail: "Publishing or distributing e-books, or the software to read them",
  },
  {
    id: "transport",
    label: "Passenger transport websites, apps, or e-ticketing",
    detail: "Air, bus, rail, or waterborne passenger services and their digital channels",
  },
  {
    id: "telecoms",
    label: "Electronic communications services",
    detail: "Telephony, messaging, or internet access services",
  },
  {
    id: "avms",
    label: "Access to audiovisual media services",
    detail: "Streaming platforms, video-on-demand interfaces, programme guides",
  },
  {
    id: "terminals",
    label: "Self-service terminals",
    detail: "Payment terminals, ATMs, ticketing or check-in machines",
  },
  {
    id: "hardware",
    label: "Consumer computer hardware or operating systems",
    detail: "Computers, smartphones, tablets, or their operating systems",
  },
] as const

type CategoryId = (typeof SERVICE_CATEGORIES)[number]["id"]

type Step = "consumers" | "categories" | "micro" | "result"

type ResultKind = "in-scope" | "micro-exempt" | "out-of-scope-nexus" | "out-of-scope-category"

export default function EaaScopeChecker() {
  const [step, setStep] = useState<Step>("consumers")
  const [euConsumers, setEuConsumers] = useState<"yes" | "no" | null>(null)
  const [categories, setCategories] = useState<CategoryId[]>([])
  const [noneSelected, setNoneSelected] = useState(false)
  const [micro, setMicro] = useState<"yes" | "no" | "unsure" | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const focusHeading = () => {
    // Move focus to the step heading so keyboard and screen reader users land
    // at the start of the new step instead of on a button that just vanished.
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  const goTo = (next: Step) => {
    setStep(next)
    focusHeading()
  }

  const toggleCategory = (id: CategoryId) => {
    setNoneSelected(false)
    setCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const chooseNone = () => {
    setCategories([])
    setNoneSelected(true)
  }

  const reset = () => {
    setEuConsumers(null)
    setCategories([])
    setNoneSelected(false)
    setMicro(null)
    goTo("consumers")
  }

  const result: ResultKind =
    euConsumers === "no"
      ? "out-of-scope-nexus"
      : noneSelected
        ? "out-of-scope-category"
        : micro === "yes" && !categories.includes("terminals") && !categories.includes("hardware")
          ? "micro-exempt"
          : "in-scope"

  const stepNumber = step === "consumers" ? 1 : step === "categories" ? 2 : step === "micro" ? 3 : 4

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardContent className="p-6 sm:p-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4" aria-hidden="true">
          Step {stepNumber} of 4
        </p>

        {step === "consumers" && (
          <section aria-labelledby="scope-step-heading">
            <h2
              id="scope-step-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold text-slate-900 dark:text-white mb-2 outline-none"
            >
              Do you offer products or services to consumers in the EU?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              This includes selling online to consumers located in an EU member state, wherever
              your company is established. Business-to-business sales alone do not count. Ireland
              is in the EU; Great Britain is not, but GB companies selling into the EU are caught.
            </p>
            <fieldset>
              <legend className="sr-only">
                Do you offer products or services to consumers in the EU?
              </legend>
              <div className="space-y-3">
                {[
                  { value: "yes" as const, label: "Yes, we serve consumers in the EU" },
                  { value: "no" as const, label: "No, we are B2B only or have no EU customers" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950/30"
                  >
                    <input
                      type="radio"
                      name="eu-consumers"
                      value={option.value}
                      checked={euConsumers === option.value}
                      onChange={() => setEuConsumers(option.value)}
                      className="mt-1 h-4 w-4"
                    />
                    <span className="text-slate-800 dark:text-slate-200">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                disabled={euConsumers === null}
                onClick={() => goTo(euConsumers === "no" ? "result" : "categories")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {step === "categories" && (
          <section aria-labelledby="scope-step-heading">
            <h2
              id="scope-step-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold text-slate-900 dark:text-white mb-2 outline-none"
            >
              Which of these do you provide?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Select everything that applies. These are the product and service categories the
              Directive names. E-commerce is the broadest: an ordinary online shop selling to
              consumers is in it.
            </p>
            <fieldset>
              <legend className="sr-only">Product and service categories you provide</legend>
              <div className="space-y-3">
                {SERVICE_CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950/30"
                  >
                    <input
                      type="checkbox"
                      checked={categories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="mt-1 h-4 w-4"
                    />
                    <span>
                      <span className="block text-slate-800 dark:text-slate-200">{cat.label}</span>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">
                        {cat.detail}
                      </span>
                    </span>
                  </label>
                ))}
                <label className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950/30">
                  <input
                    type="checkbox"
                    checked={noneSelected}
                    onChange={() => (noneSelected ? setNoneSelected(false) : chooseNone())}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-slate-800 dark:text-slate-200">None of these</span>
                </label>
              </div>
            </fieldset>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => goTo("consumers")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-2.5 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </button>
              <button
                type="button"
                disabled={categories.length === 0 && !noneSelected}
                onClick={() => goTo(noneSelected ? "result" : "micro")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {step === "micro" && (
          <section aria-labelledby="scope-step-heading">
            <h2
              id="scope-step-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold text-slate-900 dark:text-white mb-2 outline-none"
            >
              Are you a microenterprise?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Under the Directive a microenterprise has fewer than 10 employees AND an annual
              turnover or balance sheet total not exceeding 2 million euro. Both conditions must
              hold.
            </p>
            <fieldset>
              <legend className="sr-only">Are you a microenterprise?</legend>
              <div className="space-y-3">
                {[
                  { value: "yes" as const, label: "Yes, under 10 employees and up to 2 million euro turnover" },
                  { value: "no" as const, label: "No, we are larger than that" },
                  { value: "unsure" as const, label: "Not sure" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950/30"
                  >
                    <input
                      type="radio"
                      name="microenterprise"
                      value={option.value}
                      checked={micro === option.value}
                      onChange={() => setMicro(option.value)}
                      className="mt-1 h-4 w-4"
                    />
                    <span className="text-slate-800 dark:text-slate-200">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => goTo("categories")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-2.5 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </button>
              <button
                type="button"
                disabled={micro === null}
                onClick={() => goTo("result")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                See my result
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {step === "result" && (
          <section aria-labelledby="scope-step-heading">
            <div role="status">
              {result === "in-scope" && (
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <Scale className="h-8 w-8 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <h2
                      id="scope-step-heading"
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-2xl font-bold text-slate-900 dark:text-white outline-none"
                    >
                      The EAA likely applies to you
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    You serve consumers in the EU in at least one covered category
                    {micro === "unsure" && ", and since you are not certain you qualify as a microenterprise you should assume the obligations apply until you have checked"}
                    . The accessibility requirements have applied since 28 June 2025. The
                    practical route to conformity is EN 301 549, which incorporates WCAG at
                    Level AA for web content and apps.
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400 mb-6 list-disc pl-5">
                    <li>
                      Establish where you stand with an audit against WCAG 2.2 AA:{" "}
                      <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                        fixed-price audits from $950
                      </Link>{" "}
                      or see a{" "}
                      <Link href="/sample-audit-report" className="text-blue-600 dark:text-blue-400 hover:underline">
                        sample report
                      </Link>
                      .
                    </li>
                    <li>
                      Understand the standard:{" "}
                      <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                        EN 301 549 explained
                      </Link>{" "}
                      and the{" "}
                      <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                        WCAG 2.2 checklist
                      </Link>
                      .
                    </li>
                    <li>
                      Selling in Ireland? Enforcement there is criminal:{" "}
                      <Link href="/compliance/eaa-ireland" className="text-blue-600 dark:text-blue-400 hover:underline">
                        the EAA in Ireland
                      </Link>
                      .
                    </li>
                    <li>
                      Publish the required accessibility information:{" "}
                      <Link href="/guides/how-to-write-an-accessibility-statement" className="text-blue-600 dark:text-blue-400 hover:underline">
                        how to write an accessibility statement
                      </Link>
                      .
                    </li>
                  </ul>
                </div>
              )}

              {result === "micro-exempt" && (
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <Building2 className="h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <h2
                      id="scope-step-heading"
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-2xl font-bold text-slate-900 dark:text-white outline-none"
                    >
                      Likely exempt as a service-provider microenterprise
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    Microenterprises providing services (fewer than 10 employees and no more than
                    2 million euro turnover) are exempt from the EAA service requirements. Three
                    cautions before you close the tab: you should be able to show documentation if
                    you rely on the exemption, you lose it the moment you grow past either
                    threshold, and if you also place covered products on the market the product
                    rules still reach you with lighter documentation duties.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    Accessibility also remains a market advantage and, in the UK, the Equality Act
                    duty applies regardless of size:{" "}
                    <Link href="/compliance/uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                      UK web accessibility law
                    </Link>
                    . A light-touch check with our{" "}
                    <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                      free page auditor
                    </Link>{" "}
                    costs nothing.
                  </p>
                </div>
              )}

              {result === "out-of-scope-nexus" && (
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <h2
                      id="scope-step-heading"
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-2xl font-bold text-slate-900 dark:text-white outline-none"
                    >
                      The EAA likely does not apply to you today
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    Without consumers in the EU, the Directive&apos;s consumer-facing obligations
                    do not attach. Two things can change that quickly: starting to sell to EU
                    consumers (a single EU-facing checkout can do it), and other laws that apply
                    where you do operate, such as the UK Equality Act or the ADA in the United
                    States.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    See{" "}
                    <Link href="/compliance/uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                      UK law
                    </Link>
                    ,{" "}
                    <Link href="/compliance/ada" className="text-blue-600 dark:text-blue-400 hover:underline">
                      ADA compliance
                    </Link>
                    , or the full{" "}
                    <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                      global laws tracker
                    </Link>
                    .
                  </p>
                </div>
              )}

              {result === "out-of-scope-category" && (
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <HelpCircle className="h-8 w-8 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <h2
                      id="scope-step-heading"
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-2xl font-bold text-slate-900 dark:text-white outline-none"
                    >
                      Possibly out of scope, but check the e-commerce net
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    None of the named categories applies on your answers. One caution: the
                    e-commerce category is wider than people expect. If consumers in the EU can
                    buy anything from you through a website or app, that sales journey is an
                    e-commerce service and is covered even if your core business is not on the
                    list. Purely informational sites with no consumer transactions are the
                    typical genuinely-out-of-scope case.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    Other laws may still apply where you operate:{" "}
                    <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                      see the global laws tracker
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-2.5 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Start again
              </button>
              <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Guidance only, not legal advice. Edge cases belong with your lawyer.
              </p>
            </div>
          </section>
        )}

        {step !== "result" && (
          <p className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Nothing you enter leaves your browser. No answers are stored or sent.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
