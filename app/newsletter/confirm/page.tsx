import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { confirmSubscription } from "./actions"

export const metadata: Metadata = {
  title: "Confirm Your Subscription",
  description: "Confirm your Accessibility.build email subscription.",
  robots: { index: false, follow: false },
}

type ConfirmPageProps = {
  searchParams?: Promise<{ token?: string | string[]; status?: string | string[] }>
}

const MESSAGES = {
  confirmed: {
    heading: "You are subscribed",
    body: "Thanks for confirming. We will send practical accessibility updates now and then, and every email has an unsubscribe link.",
  },
  invalid: {
    heading: "This link does not work",
    body: "It may already have been used, or it was copied incompletely. If you are not subscribed yet, sign up again from the footer of any page.",
  },
  expired: {
    heading: "This link has expired",
    body: "Confirmation links last seven days. Sign up again from the footer of any page and we will send a new one.",
  },
} as const

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function NewsletterConfirmPage({ searchParams }: ConfirmPageProps) {
  const params = searchParams ? await searchParams : undefined
  const token = first(params?.token)
  const status = first(params?.status)
  const message = status && status in MESSAGES ? MESSAGES[status as keyof typeof MESSAGES] : null

  return (
    <div className="container mx-auto max-w-xl px-4 py-16 sm:py-24">
      {message ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight">{message.heading}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{message.body}</p>
          <p className="mt-8">
            <Link href="/blog" className="font-medium text-primary underline underline-offset-4">
              Read recent accessibility guides
            </Link>
          </p>
        </>
      ) : token ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight">Confirm your subscription</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Press the button to start getting Accessibility.build email updates. If you did not ask for this, close
            this page and you will not be added.
          </p>
          <form action={confirmSubscription} className="mt-8">
            <input type="hidden" name="token" value={token} />
            <Button type="submit" size="lg">
              Confirm my subscription
            </Button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight">{MESSAGES.invalid.heading}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{MESSAGES.invalid.body}</p>
        </>
      )}
    </div>
  )
}
