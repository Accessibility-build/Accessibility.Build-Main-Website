import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Activity,
  ArrowRight,
  CircleDollarSign,
  Clock3,
  Coins,
  History,
  MailPlus,
  SearchCheck,
  TrendingDown,
  TrendingUp,
  UsersRound,
  Wrench,
} from "lucide-react"
import { requireAdmin } from "@/lib/admin-auth"
import { getDashboardStats, getToolPerformanceMetrics } from "@/lib/admin-utils"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { DashboardRefreshButton } from "@/components/admin/dashboard-refresh-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Admin Dashboard",
  description: "Operational overview for users, billing, tool reliability, and recent activity",
  robots: { index: false, follow: false },
}

function formatToolName(tool: string) {
  return tool.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatCurrency(amountInMinorUnits: number, currency: "USD" | "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountInMinorUnits / 100)
}

const quickActions = [
  { href: "/admin/users", label: "Review users", description: "Search accounts and access", icon: UsersRound },
  { href: "/admin/credits", label: "Manage credits", description: "Grant and review balances", icon: Coins },
  { href: "/admin/billing", label: "Open billing", description: "Resolve orders and payments", icon: CircleDollarSign },
  { href: "/admin/marketing", label: "Create campaign", description: "Prepare and test email", icon: MailPlus },
  { href: "/admin/seo-dashboard", label: "Review SEO", description: "Inspect content signals", icon: SearchCheck },
  { href: "/admin/audit-log", label: "View audit log", description: "Trace administrative actions", icon: History },
]

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [dashboardStats, toolMetrics] = await Promise.all([
    getDashboardStats(),
    getToolPerformanceMetrics(7),
  ])

  const activeRate = dashboardStats.totalUsers > 0
    ? (dashboardStats.activeUsers / dashboardStats.totalUsers) * 100
    : 0
  const toolsNeedingAttention = toolMetrics.filter((tool) => tool.totalUsage > 0 && tool.successRate < 90)
  const hasRevenue = dashboardStats.revenueThisMonthByCurrency.usd > 0 || dashboardStats.revenueThisMonthByCurrency.inr > 0

  return (
    <AdminLayout>
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Operations overview"
          title="Admin dashboard"
          description="A current view of accounts, billing exceptions, tool reliability, and activity that may need attention."
          actions={<DashboardRefreshButton />}
        />

        <section aria-labelledby="key-metrics-heading">
          <h2 id="key-metrics-heading" className="sr-only">Key metrics</h2>
          <dl className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b p-5 sm:border-r xl:border-b-0">
              <dt className="text-sm text-slate-500">Users</dt>
              <dd className="mt-2 text-2xl font-semibold">{dashboardStats.totalUsers.toLocaleString()}</dd>
              <p className="mt-1 text-xs text-slate-500">{dashboardStats.activeUsers.toLocaleString()} active ({activeRate.toFixed(0)}%)</p>
            </div>
            <div className="border-b p-5 xl:border-b-0 xl:border-r">
              <dt className="text-sm text-slate-500">Credits distributed</dt>
              <dd className="mt-2 text-2xl font-semibold">{dashboardStats.totalCreditsDistributed.toLocaleString()}</dd>
              <p className="mt-1 text-xs text-slate-500">Lifetime issued balance</p>
            </div>
            <div className="border-b p-5 sm:border-r xl:border-b-0">
              <dt className="text-sm text-slate-500">Tool executions</dt>
              <dd className="mt-2 text-2xl font-semibold">{dashboardStats.totalToolUsage.toLocaleString()}</dd>
              <p className="mt-1 text-xs text-slate-500">Recorded all time</p>
            </div>
            <div className="border-b p-5 xl:border-b-0 xl:border-r">
              <dt className="text-sm text-slate-500">URL audits</dt>
              <dd className="mt-2 text-2xl font-semibold">{dashboardStats.totalAudits.toLocaleString()}</dd>
              <p className="mt-1 text-xs text-slate-500">Completed records</p>
            </div>
            <div className="p-5 sm:col-span-2 xl:col-span-1">
              <dt className="text-sm text-slate-500">Paid this month</dt>
              <dd className="mt-2 text-base font-semibold">
                {hasRevenue ? (
                  <span className="flex flex-col gap-1">
                    {dashboardStats.revenueThisMonthByCurrency.usd > 0 ? <span>{formatCurrency(dashboardStats.revenueThisMonthByCurrency.usd, "USD")}</span> : null}
                    {dashboardStats.revenueThisMonthByCurrency.inr > 0 ? <span>{formatCurrency(dashboardStats.revenueThisMonthByCurrency.inr, "INR")}</span> : null}
                  </span>
                ) : "No paid orders"}
              </dd>
              {dashboardStats.revenueThisMonthByCurrency.other > 0 ? <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">Unclassified currency total: {dashboardStats.revenueThisMonthByCurrency.other}</p> : null}
            </div>
          </dl>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]" aria-labelledby="attention-heading">
          <div className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-300">Action queue</p>
                <h2 id="attention-heading" className="mt-2 text-xl font-semibold">Needs attention</h2>
              </div>
              <Activity className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">Billing exceptions</p>
                  <p className="mt-1 text-sm text-slate-500">Orders marked for manual action</p>
                </div>
                <Badge variant={dashboardStats.billingActionRequired > 0 ? "destructive" : "secondary"}>{dashboardStats.billingActionRequired}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">Tools below 90% success</p>
                  <p className="mt-1 text-sm text-slate-500">Active tools in the last seven days</p>
                </div>
                <Badge variant={toolsNeedingAttention.length > 0 ? "destructive" : "secondary"}>{toolsNeedingAttention.length}</Badge>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/admin/billing">Review billing <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/tools">Review tools</Link>
              </Button>
            </div>
          </div>

          <div className="min-w-0 rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-6 dark:border-slate-800">
              <h2 className="text-xl font-semibold">Tool health, last seven days</h2>
              <p className="mt-1 text-sm text-slate-500">Usage, completion rate, and processing time from recorded executions.</p>
            </div>
            {toolMetrics.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950/60">
                    <tr>
                      <th className="px-5 py-3 font-semibold" scope="col">Tool</th>
                      <th className="px-5 py-3 text-right font-semibold" scope="col">Uses</th>
                      <th className="px-5 py-3 text-right font-semibold" scope="col">Success</th>
                      <th className="px-5 py-3 text-right font-semibold" scope="col">Average</th>
                      <th className="px-5 py-3 text-right font-semibold" scope="col">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {toolMetrics.slice(0, 8).map((tool) => (
                      <tr key={tool.tool}>
                        <th className="px-5 py-4 font-medium" scope="row">{formatToolName(tool.tool)}</th>
                        <td className="px-5 py-4 text-right tabular-nums">{tool.totalUsage.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right tabular-nums">{tool.successRate.toFixed(1)}%</td>
                        <td className="px-5 py-4 text-right tabular-nums">{tool.avgProcessingTime > 0 ? `${(tool.avgProcessingTime / 1000).toFixed(1)}s` : "Not recorded"}</td>
                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex items-center gap-1">
                            {tool.popularityTrend === "up" ? <TrendingUp className="h-4 w-4 text-emerald-700" aria-hidden="true" /> : tool.popularityTrend === "down" ? <TrendingDown className="h-4 w-4 text-amber-700" aria-hidden="true" /> : null}
                            {tool.popularityTrend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Wrench className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
                <p className="mt-3 font-medium">No tool executions in this period</p>
                <p className="mt-1 text-sm text-slate-500">Metrics will appear after recorded tool activity.</p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-semibold">Recent activity</h2>
                <p className="mt-1 text-sm text-slate-500">Latest account and product events.</p>
              </div>
              <Button asChild variant="outline" size="sm"><Link href="/admin/audit-log">Audit log</Link></Button>
            </div>
            {dashboardStats.recentActivity.length > 0 ? (
              <ol className="divide-y divide-slate-200 dark:divide-slate-800">
                {dashboardStats.recentActivity.slice(0, 8).map((activity, index) => (
                  <li key={`${activity.type}-${activity.timestamp.toISOString()}-${index}`} className="flex gap-3 px-6 py-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                      <Activity className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-medium [overflow-wrap:anywhere]">{activity.description}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="p-8 text-center text-sm text-slate-500">No recent activity is available.</p>
            )}
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-500">Open a common administrative workflow.</p>
            <ul className="mt-5 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {quickActions.map(({ href, label, description, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="group flex min-h-14 items-center gap-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                    <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="block truncate text-xs text-slate-500">{description}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
