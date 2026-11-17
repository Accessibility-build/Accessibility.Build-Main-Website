import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { getUserStats } from "@/lib/credits"
import { DashboardView, type DashboardStats } from "@/components/dashboard/dashboard-view"

export const metadata: Metadata = {
  title: "Your Dashboard | Accessibility.build",
  description: "Start an accessibility check, review your recent activity, and find your credits, courses, and downloads.",
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect("/sign-in?redirect_url=%2Fdashboard")

  let stats: DashboardStats | null = null
  try {
    stats = await getUserStats()
  } catch (error) {
    console.error("Dashboard error:", error)
  }

  return <DashboardView firstName={user.firstName} stats={stats} />
}
