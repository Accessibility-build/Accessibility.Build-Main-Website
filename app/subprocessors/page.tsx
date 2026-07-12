import { ExternalLink, ServerCog } from "lucide-react"
import { subprocessors } from "@/lib/authority-content"
import { company, legalLastUpdated } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Service Provider and Subprocessor Register",
  path: "/subprocessors",
  description:
    "A current functional register of service providers that may process data for Accessibility.build accounts, hosting, payments, AI tools, content, analytics, forms, and email.",
  keywords: ["Accessibility.build subprocessors", "accessibility platform service providers", "data processor register"],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

export default function SubprocessorsPage() {
  return (
    <div className="container-wide py-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="border-b pb-8">
          <ServerCog className="h-8 w-8 text-primary" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold uppercase text-primary">Data transparency</p>
          <h1 className="mt-3 text-4xl font-semibold">Service Provider and Subprocessor Register</h1>
          <p className="mt-4 max-w-4xl text-lg leading-7 text-muted-foreground">
            Providers are listed by function. A provider receives data only when the relevant website, account, payment, communication, or AI feature is used.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last reviewed: {legalLastUpdated}</p>
        </header>

        <div className="mt-10 overflow-x-auto border">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <caption className="sr-only">Accessibility.build service providers and their processing functions</caption>
            <thead className="bg-muted/60">
              <tr>
                <th scope="col" className="border-b p-4 font-semibold">Provider</th>
                <th scope="col" className="border-b p-4 font-semibold">Purpose</th>
                <th scope="col" className="border-b p-4 font-semibold">Data categories</th>
                <th scope="col" className="border-b p-4 font-semibold">When used</th>
                <th scope="col" className="border-b p-4 font-semibold">Provider policy</th>
              </tr>
            </thead>
            <tbody>
              {subprocessors.map((provider) => (
                <tr key={provider.provider} className="align-top">
                  <th scope="row" className="border-b p-4 font-semibold">{provider.provider}</th>
                  <td className="border-b p-4 leading-6 text-muted-foreground">{provider.purpose}</td>
                  <td className="border-b p-4 leading-6 text-muted-foreground">{provider.data}</td>
                  <td className="border-b p-4 leading-6 text-muted-foreground">{provider.conditional}</td>
                  <td className="border-b p-4">
                    <a href={provider.policy} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-medium text-primary underline">
                      View policy <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-10 grid gap-8 border-t pt-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Change notification</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              This register is updated when a material provider or processing function changes. Customers with a separately agreed data-processing notification term receive notice through the agreed channel.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Questions or objections</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Contact <a className="font-medium text-foreground underline" href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a> with the provider, processing function, and concern. Applicable contractual and legal rights remain unchanged.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
