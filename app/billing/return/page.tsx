import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { PaymentReturnStatus } from "@/components/billing/payment-return-status"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Confirming your payment", robots: { index: false, follow: false } }

export default async function PaymentReturnPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams
  const user = await currentUser()
  const orderId = typeof order === "string" && /^[0-9a-f-]{36}$/i.test(order) ? order : null
  if (!user) redirect(`/sign-in?redirect_url=${encodeURIComponent(`/billing/return${orderId ? `?order=${orderId}` : ""}`)}`)
  if (!orderId) redirect("/billing")
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <PaymentReturnStatus orderId={orderId} />
      </div>
    </div>
  )
}
