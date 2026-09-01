import { FAQStructuredData } from "@/components/seo/structured-data"

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
}

/**
 * Service-page FAQ list.
 *
 * Renders every answer into the server HTML and emits the matching FAQPage
 * schema from the same array, so the two cannot drift apart.
 *
 * This deliberately uses <details> rather than the Radix Accordion it used
 * before. Radix unmounts collapsed content, so the answers existed only inside
 * the JSON-LD and never appeared in the served markup. Search crawlers and AI
 * answer engines that harvest visible prose (most of them do, rather than
 * mining structured data) saw six questions with no answers. <details> keeps
 * the same collapsed-by-default interaction while leaving the text in the DOM,
 * which Google's FAQ guidance explicitly permits.
 */
export function FAQSection({ faqs }: FAQSectionProps) {
  if (faqs.length === 0) return null

  return (
    <>
      <FAQStructuredData faqs={faqs} />
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group border border-border rounded-lg px-6 py-4 bg-card"
            >
              <summary className="cursor-pointer text-lg font-medium list-none flex items-center justify-between gap-2">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="ml-2 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform"
                >
                  &#9662;
                </span>
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
