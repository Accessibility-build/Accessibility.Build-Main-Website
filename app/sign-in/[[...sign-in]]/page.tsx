import type { Metadata } from "next"
import Link from "next/link"
import { SignIn } from "@clerk/nextjs"
import { ArrowRight, History, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { clerkEmbeddedAuthAppearance } from "@/lib/clerk-auth-appearance"
import { safeAuthRedirect } from "@/lib/auth-redirect"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to review accessibility tool activity, credits, reports, billing, and account settings.",
  robots: { index: false, follow: false },
}

type SignInPageProps = {
  searchParams?: Promise<{ redirect_url?: string | string[] }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = searchParams ? await searchParams : undefined
  const redirectTo = safeAuthRedirect(params?.redirect_url, "/dashboard")
  const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(redirectTo)}`

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50/60 dark:bg-slate-950">
      <div className="container-wide py-6 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 max-w-2xl lg:mb-8">
            <p className="text-sm font-semibold uppercase text-primary">Account access</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Sign in to Accessibility.build</h1>
            <p className="mt-3 leading-7 text-muted-foreground">
              Continue to your requested page, review account activity, or resume accessibility work.
            </p>
          </header>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <Card className="w-full max-w-md overflow-hidden">
              <CardHeader className="border-b p-5 text-left">
                <h2 className="text-xl font-semibold">Account sign in</h2>
                <CardDescription>Use your email or an available identity provider.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <SignIn
                  path="/sign-in"
                  routing="path"
                  signUpUrl={signUpUrl}
                  fallbackRedirectUrl={redirectTo}
                  appearance={clerkEmbeddedAuthAppearance}
                />
              </CardContent>
            </Card>

            <aside className="hidden border-l pl-7 lg:block" aria-labelledby="sign-in-support-heading">
              <h2 id="sign-in-support-heading" className="text-lg font-semibold">What your account includes</h2>
              <ul className="mt-5 space-y-5 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-3"><History className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>Credit and recent tool-usage history</span></li>
                <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>Authentication and account security managed through Clerk</span></li>
              </ul>
              <p className="mt-7 border-t pt-5 text-sm text-muted-foreground">New to Accessibility.build?</p>
              <Link href={signUpUrl} className="mt-2 inline-flex items-center font-semibold text-primary underline-offset-4 hover:underline">
                Create an account <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
