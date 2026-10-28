import Link from "next/link"
import { requireAdmin } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminAssistantClient } from "@/components/admin/admin-assistant-client"
import { DashboardRefreshButton } from "@/components/admin/dashboard-refresh-button"
import { ASSISTANT_NAME } from "@/lib/assistant/config"
import { purgeExpiredAssistantData, ASSISTANT_RETENTION_DAYS } from "@/lib/assistant/analytics"
import { getAssistantStats, RANGE_OPTIONS, REPORT_TIME_ZONE, REPORT_TIME_ZONE_LABEL, type RangeDays } from "@/lib/assistant/admin-stats"
import { cn } from "@/lib/utils"

export const metadata = {
  title: `${ASSISTANT_NAME} Analytics | Admin Dashboard`,
  description: `Usage, answer quality, cost and conversations for the ${ASSISTANT_NAME} assistant`,
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

const RANGE_LABELS: Record<RangeDays, string> = { 1: "24 hours", 7: "7 days", 30: "30 days", 90: "90 days" }

export default async function AdminAssistantPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  await requireAdmin("/admin/assistant")
  const requested = Number((await searchParams).range)
  const range: RangeDays = (RANGE_OPTIONS as readonly number[]).includes(requested) ? (requested as RangeDays) : 7

  // Retention is enforced here as well as on write, so expired rows never show.
  await purgeExpiredAssistantData()
  const stats = await getAssistantStats(range)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Operations"
          title={`${ASSISTANT_NAME} analytics`}
          description={`What visitors ask the ${ASSISTANT_NAME} assistant, where they ask it, how well it answers, and what it costs. Days and hours are in ${REPORT_TIME_ZONE_LABEL}. Conversations are kept for ${ASSISTANT_RETENTION_DAYS} days.`}
          actions={
            <>
              <nav aria-label="Time range" className="flex flex-wrap gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800">
                {RANGE_OPTIONS.map((option) => (
                  <Link
                    key={option}
                    href={`/admin/assistant?range=${option}`}
                    aria-current={option === range ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-slate-300 dark:hover:bg-slate-800",
                      option === range && "bg-teal-700 text-white hover:bg-teal-700 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-400",
                    )}
                  >
                    {RANGE_LABELS[option]}
                  </Link>
                ))}
              </nav>
              <DashboardRefreshButton />
            </>
          }
        />

        {stats.state === "missing" ? (
          <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-semibold">The analytics tables do not exist yet.</p>
            <p className="mt-1">
              Apply <code className="font-mono">drizzle/0015_assistant_analytics.sql</code> to the database. Until then {ASSISTANT_NAME} keeps
              answering, but nothing is recorded.
            </p>
          </div>
        ) : stats.state === "error" ? (
          <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-5 text-sm leading-6 text-red-950 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100">
            <p className="font-semibold">The analytics could not be loaded.</p>
            <p className="mt-1 font-mono text-xs">{stats.message}</p>
          </div>
        ) : (
          <AdminAssistantClient
            stats={stats}
            rangeLabel={RANGE_LABELS[range]}
            timeZone={REPORT_TIME_ZONE}
            timeZoneLabel={REPORT_TIME_ZONE_LABEL}
          />
        )}
      </div>
    </AdminLayout>
  )
}
