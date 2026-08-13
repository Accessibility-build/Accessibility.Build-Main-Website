"use client"

import { ClipboardList } from "lucide-react"
import { ProjectBriefBuilder } from "@/components/contact/project-brief-builder"
import { QuickContactForm } from "@/components/contact/quick-contact-form"

type ContactFormProps = {
  requestedService?: string
  requestedPackage?: string
  requestedTopic?: string
}

/**
 * The quick message is the default and only visible path. The detailed project
 * brief is still here, but opt-in.
 *
 * It used to be one of two tabs, which forced a choice before anyone could type
 * a single character, and the "quick" tab was itself eight fields deep. Field
 * count is the strongest lever on form conversion, so the default path is now
 * three required fields and the fourteen-field brief opens only when someone
 * actually wants to scope a project.
 *
 * The brief is a SIBLING of the quick form, never a child: both render their own
 * <form>, and nested forms are invalid HTML (the inner one is dropped by the
 * parser, so the brief would silently stop submitting).
 */
export function ContactForm({ requestedService, requestedPackage, requestedTopic }: ContactFormProps) {
  // Arriving from a services or pricing page is a strong signal that the person
  // came to scope work, so open the brief for them.
  const briefOpenByDefault = Boolean(requestedService || requestedPackage)

  return (
    <div className="space-y-8">
      <QuickContactForm requestedTopic={requestedTopic} />

      <details
        open={briefOpenByDefault}
        className="group rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
      >
        <summary className="cursor-pointer list-none rounded-xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <span className="flex items-start gap-3">
            <ClipboardList
              className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">
                Planning a full accessibility project?
                <span aria-hidden="true" className="ml-2 inline-block text-muted-foreground transition-transform group-open:rotate-90">
                  &#9656;
                </span>
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                Open the detailed brief to share scope, standard, timeline, and procurement
                requirements up front. Useful for a quote, but never required to reach me.
              </span>
            </span>
          </span>
        </summary>
        <div className="border-t border-slate-200 p-5 dark:border-slate-800 sm:p-6">
          <ProjectBriefBuilder
            requestedService={requestedService}
            requestedPackage={requestedPackage}
          />
        </div>
      </details>
    </div>
  )
}
