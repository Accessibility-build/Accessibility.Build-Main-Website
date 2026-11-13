import Link from "next/link"
import { Check } from "lucide-react"
import { formatUsd, sellableKeyFor, type Product } from "@/lib/products"
import { ProductCheckoutButton } from "./product-checkout-button"

/**
 * Licence cards with a buy button each. Card checkout goes through Dodo Payments (merchant of record,
 * so sales tax and VAT are handled at checkout). When Dodo is not configured the card offers buying by
 * invoice through the contact page instead of a dead button.
 */
export function BuyBox({ product, headingId = "buy-heading", deliveryNote }: { product: Product; headingId?: string; deliveryNote?: string }) {
  const checkoutOn = Boolean(process.env.DODO_PAYMENTS_API_KEY) && (process.env.BILLING_ENABLED ?? process.env.DODO_BILLING_ENABLED ?? "true").toLowerCase() === "true"
  return (
    <section id="buy" aria-labelledby={headingId} className="scroll-mt-24">
      <h2 id={headingId} className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Choose a licence
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        One-off payment. {deliveryNote ?? `${product.format}. Download from your account straight after payment.`} Version {product.version}, updated {product.updated}.
      </p>
      <ul className="grid gap-6 md:grid-cols-2" role="list">
        {product.licences.map((l) => (
          <li key={l.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{l.name} licence</h3>
            <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
              {formatUsd(l.price)}
              <span className="ml-2 text-base font-normal text-slate-600 dark:text-slate-400">one-off</span>
            </p>
            <p className="mt-3 flex gap-2 text-slate-700 dark:text-slate-300">
              <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              <span>{l.who}</span>
            </p>
            <div className="mt-6 flex-1" />
            {checkoutOn ? (
              <ProductCheckoutButton item={sellableKeyFor(product, l.id)} label="Buy now" ariaLabel={`Buy now: ${l.name} licence, ${formatUsd(l.price)}`} />
            ) : (
              <>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  Buy by invoice
                </Link>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Card checkout is opening soon. Contact us with the product and licence you want, and we will set up your access once the invoice is paid.
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        {checkoutOn ? "Secure checkout by Dodo Payments, our merchant of record. Any sales tax or VAT is added at checkout. " : "Prices exclude any sales tax or VAT. "}
        You need a free Accessibility.build account to buy, so your purchase is linked to it. See our{" "}
        <Link href="/refund" className="underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-400">refund policy</Link>{" "}
        and{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-400">terms</Link>.
      </p>
    </section>
  )
}
