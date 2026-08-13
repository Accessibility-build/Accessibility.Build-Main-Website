import { FAQStructuredData } from "./structured-data"

export interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  /** The single source of truth: these items are BOTH rendered and emitted as schema. */
  faqs: FaqItem[]
  /** Visible section heading. Pass null to render no heading. */
  title?: string | null
  /** Heading level for the section title, so callers keep a valid document outline. */
  as?: "h2" | "h3"
  className?: string
}

/**
 * Renders a visible FAQ list AND emits the matching FAQPage structured data from
 * the same array.
 *
 * Use this instead of calling <FAQStructuredData> directly. Google requires that
 * every question in FAQPage schema is present on the page for the user to read;
 * emitting schema for questions that are not rendered risks the rich result
 * being dropped or a manual action. Passing one array to both outputs means the
 * schema and the visible copy cannot drift apart.
 *
 * Answers stay collapsed behind <details> by default, which Google's FAQ
 * guidelines explicitly permit, since the content is on the page and reachable.
 */
export function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  as = "h2",
  className,
}: FaqSectionProps) {
  if (faqs.length === 0) return null

  const Heading = as

  return (
    <>
      <FAQStructuredData faqs={faqs} />
      <section className={className}>
        {title ? (
          <Heading className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            {title}
          </Heading>
        ) : null}
        <div className="space-y-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group border rounded-lg p-4 bg-card"
            >
              <summary className="cursor-pointer font-medium list-none flex items-center justify-between gap-2">
                {item.question}
                <span
                  aria-hidden="true"
                  className="ml-2 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform"
                >
                  &#9662;
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
