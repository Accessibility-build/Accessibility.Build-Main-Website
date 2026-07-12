import type { Metadata } from "next"
import Link from "next/link"
import { SignUp } from "@clerk/nextjs"
import { ArrowRight, CheckCircle2, Gift, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { clerkEmbeddedAuthAppearance } from "@/lib/clerk-auth-appearance"
import { safeAuthRedirect } from "@/lib/auth-redirect"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an Accessibility.build account with welcome credits and access to account-based accessibility tools.",
  robots: { index: false, follow: false },
}

type SignUpPageProps = {
  searchParams?: Promise<{ redirect_url?: string | string[] }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = searchParams ? await searchParams : undefined
  const requestedDestination = safeAuthRedirect(params?.redirect_url, "/dashboard")
  const onboardingUrl = requestedDestination === "/dashboard"
    ? "/onboarding"
    : `/onboarding?next=${encodeURIComponent(requestedDestination)}`
  const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(requestedDestination)}`

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50/60 dark:bg-slate-950">
      <div className="container-wide py-6 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 max-w-2xl lg:mb-8">
            <p className="text-sm font-semibold uppercase text-primary">Create an account</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Start using Accessibility.build</h1>
            <p className="mt-3 leading-7 text-muted-foreground">
              New accounts receive 100 welcome credits. No payment method is required to begin.
            </p>
          </header>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <Card className="w-full max-w-md overflow-hidden">
              <CardHeader className="border-b p-5 text-left">
                <h2 className="text-xl font-semibold">Account details</h2>
                <CardDescription>Use your email or an available identity provider.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <SignUp
                  path="/sign-up"
                  routing="path"
                  signInUrl={signInUrl}
                  fallbackRedirectUrl={onboardingUrl}
                  appearance={clerkEmbeddedAuthAppearance}
                />
              </CardContent>
            </Card>

            <aside className="hidden border-l pl-7 lg:block" aria-labelledby="sign-up-benefits-heading">
              <h2 id="sign-up-benefits-heading" className="text-lg font-semibold">Account basics</h2>
              <ul className="mt-5 space-y-5 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-3"><Gift className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>100 welcome credits for account-based tools</span></li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>No credit card required</span></li>
                <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>Profile and authentication controls through Clerk</span></li>
              </ul>
              <p className="mt-7 border-t pt-5 text-sm text-muted-foreground">Already have an account?</p>
              <Link href={signInUrl} className="mt-2 inline-flex items-center font-semibold text-primary underline-offset-4 hover:underline">
                Sign in <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
