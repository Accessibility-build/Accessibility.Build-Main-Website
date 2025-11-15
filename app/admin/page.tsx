import { requireAdmin } from '@/lib/admin-auth'
import { getDashboardStats, getToolPerformanceMetrics } from '@/lib/admin-utils'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardRefreshButton } from '@/components/admin/dashboard-refresh-button'
import { 
  Users, 
  Activity, 
  CreditCard, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Shield,
  Eye,
  Clock,
  Zap
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const metadata = {
  title: 'Admin Dashboard | Accessibility.build',
  description: 'Administrative dashboard for managing users, credits, and analytics',
}

export default async function AdminDashboardPage() {
  // Verify admin access
  await requireAdmin()

  // Get dashboard data
  const [dashboardStats, toolMetrics] = await Promise.all([
    getDashboardStats(),
    getToolPerformanceMetrics(7) // Last 7 days
  ])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Overview of your platform's performance and user activity
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <DashboardRefreshButton />
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Admin Mode</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</CardTitle>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats.totalUsers.toLocaleString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Active:</span>
                <Badge variant="secondary" className="text-xs">
                  {dashboardStats.activeUsers}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Credits</CardTitle>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats.totalCreditsDistributed.toLocaleString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Distributed to users
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Tool Usage</CardTitle>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats.totalToolUsage.toLocaleString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total executions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Audits</CardTitle>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats.totalAudits.toLocaleString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Completed audits
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tool Performance and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Tool Performance (Last 7 Days)
              </CardTitle>
              <CardDescription>
                How each tool is performing in terms of usage and success rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {toolMetrics.slice(0, 5).map((tool) => (
                  <div key={tool.tool} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {tool.tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="flex items-center gap-1">
                          {tool.popularityTrend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                          {tool.popularityTrend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                          <Badge variant={tool.popularityTrend === 'up' ? 'default' : tool.popularityTrend === 'down' ? 'destructive' : 'secondary'} className="text-xs">
                            {tool.popularityTrend}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {tool.totalUsage} uses
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {tool.successRate.toFixed(1)}% success
                        </div>
                        {tool.avgProcessingTime > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {(tool.avgProcessingTime / 1000).toFixed(1)}s avg
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {tool.last7Days}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        this week
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest user signups and tool usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardStats.recentActivity.slice(0, 8).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'user_signup' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      activity.type === 'tool_usage' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      'bg-green-100 dark:bg-green-900/20'
                    }`}>
                      {activity.type === 'user_signup' && <Users className="h-3 w-3 text-blue-600" />}
                      {activity.type === 'tool_usage' && <Activity className="h-3 w-3 text-purple-600" />}
                      {activity.type === 'audit_completed' && <BarChart3 className="h-3 w-3 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.description}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Top Performing Tools (Last 30 Days)
            </CardTitle>
            <CardDescription>
              Most popular tools by usage count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardStats.topTools.map((tool, index) => (
                <div key={tool.tool} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {tool.tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {tool.usage} uses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 