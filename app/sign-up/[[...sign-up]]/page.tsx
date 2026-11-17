import type { Metadata } from "next"
import { SignUp } from "@clerk/nextjs"
import { AuthPageShell } from "@/components/auth/auth-page-shell"
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
    <AuthPageShell mode="sign-up">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl={signInUrl}
        fallbackRedirectUrl={onboardingUrl}
        appearance={clerkEmbeddedAuthAppearance}
      />
    </AuthPageShell>
  )
}
