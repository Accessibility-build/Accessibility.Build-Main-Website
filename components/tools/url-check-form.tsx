"use client"

import { useId, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface UrlCheckFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  /** Button text, for example "Check this page". */
  submitLabel: string
  /** Button text while loading, for example "Loading the page". */
  loadingLabel?: string
  label?: string
  help?: ReactNode
  error?: string | null
  /** Extra options (checkboxes, selects) shown under the field, inside the form. */
  children?: ReactNode
  className?: string
}

/**
 * The address field shared by the URL tools, so they look and behave the same: one labelled field,
 * a submit button that shows progress, help text tied to the field, and an error the field points
 * to. Loading announcements belong to the tool's own status region, which knows what is happening.
 */
export function UrlCheckForm({
  value,
  onChange,
  onSubmit,
  loading,
  submitLabel,
  loadingLabel = "Checking",
  label = "Page address",
  help,
  error,
  children,
  className,
}: UrlCheckFormProps) {
  const id = useId()
  const helpId = `${id}-help`
  const errorId = `${id}-error`
  const describedBy = [help ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (!loading) onSubmit()
      }}
      className={cn("rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6", className)}
    >
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900 dark:text-white">
        {label}
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Input
          id={id}
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="https://example.com"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="h-11 bg-background text-base sm:flex-1"
        />
        <Button type="submit" className="h-11 px-5 text-base" aria-disabled={loading || undefined}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              {loadingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      {help && (
        <p id={helpId} className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {help}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </form>
  )
}
