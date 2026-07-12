import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { OnboardingClient } from "@/components/auth/onboarding-client"
import { safeAuthRedirect } from "@/lib/auth-redirect"
import { getUser } from "@/lib/credits"

export const metadata: Metadata = {
  title: "Set Up Your Account",
  description: "Choose practical Accessibility.build preferences and start using the tools and resources relevant to your work.",
  robots: { index: false, follow: false },
}

type OnboardingPageProps = {
  searchParams?: Promise<{ next?: string | string[] }>
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const clerkUser = await currentUser()
  const params = searchParams ? await searchParams : undefined
  const nextPath = safeAuthRedirect(params?.next, "/dashboard")

  if (!clerkUser) {
    const returnPath = nextPath === "/dashboard"
      ? "/onboarding"
      : `/onboarding?next=${encodeURIComponent(nextPath)}`
    redirect(`/sign-in?redirect_url=${encodeURIComponent(returnPath)}`)
  }

  const user = await getUser()
  const metadata = user.metadata && typeof user.metadata === "object" && !Array.isArray(user.metadata)
    ? user.metadata as Record<string, unknown>
    : {}

  if (metadata.onboardingCompleted === true) {
    redirect(nextPath)
  }

  return (
    <OnboardingClient
      nextPath={nextPath}
      firstName={clerkUser.firstName || undefined}
      initialRole={typeof metadata.accessibilityRole === "string" ? metadata.accessibilityRole : undefined}
      initialGoals={Array.isArray(metadata.accessibilityGoals) ? metadata.accessibilityGoals.filter((goal): goal is string => typeof goal === "string") : []}
    />
  )
}
