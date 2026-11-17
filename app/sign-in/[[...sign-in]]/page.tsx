import type { Metadata } from "next"
import { SignIn } from "@clerk/nextjs"
import { AuthPageShell } from "@/components/auth/auth-page-shell"
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
    <AuthPageShell mode="sign-in">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl={signUpUrl}
        fallbackRedirectUrl={redirectTo}
        appearance={clerkEmbeddedAuthAppearance}
      />
    </AuthPageShell>
  )
}
