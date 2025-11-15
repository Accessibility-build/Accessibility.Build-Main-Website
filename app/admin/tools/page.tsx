import { requireAdmin } from '@/lib/admin-auth'
import { getToolPerformanceMetrics } from '@/lib/admin-utils'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Zap, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  Minus
} from 'lucide-react'

export const metadata = {
  title: 'Tool Analytics | Admin Dashboard',
  description: 'Analyze tool performance and usage metrics',
}

export default async function AdminToolsPage() {
  // Verify admin access
  await requireAdmin()

  // Get tool performance metrics for different time periods
  const [dailyMetrics, weeklyMetrics, monthlyMetrics] = await Promise.all([
    getToolPerformanceMetrics(1),
    getToolPerformanceMetrics(7),
    getToolPerformanceMetrics(30)
  ])

  const getPerformanceColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  const getPerformanceIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />
      case 'down': return <TrendingDown className="h-4 w-4" />
      default: return <Minus className="h-4 w-4" />
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSuccessRateIcon = (rate: number) => {
    if (rate >= 95) return <CheckCircle className="h-4 w-4" />
    if (rate >= 80) return <AlertCircle className="h-4 w-4" />
    return <AlertCircle className="h-4 w-4" />
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tool Analytics</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Monitor tool performance, usage patterns, and success rates
            </p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Last 24 Hours</CardTitle>
              <CardDescription>Tool usage and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Usage</span>
                  <span className="font-medium">
                    {dailyMetrics.reduce((sum, tool) => sum + tool.totalUsage, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Avg Success Rate</span>
                  <span className="font-medium">
                    {dailyMetrics.length > 0 
                      ? (dailyMetrics.reduce((sum, tool) => sum + tool.successRate, 0) / dailyMetrics.length).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Active Tools</span>
                  <span className="font-medium">{dailyMetrics.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Last 7 Days</CardTitle>
              <CardDescription>Weekly performance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Usage</span>
                  <span className="font-medium">
                    {weeklyMetrics.reduce((sum, tool) => sum + tool.totalUsage, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Avg Success Rate</span>
                  <span className="font-medium">
                    {weeklyMetrics.length > 0 
                      ? (weeklyMetrics.reduce((sum, tool) => sum + tool.successRate, 0) / weeklyMetrics.length).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Credits Spent</span>
                  <span className="font-medium">
                    {weeklyMetrics.reduce((sum, tool) => sum + tool.totalCreditsSpent, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Last 30 Days</CardTitle>
              <CardDescription>Monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Usage</span>
                  <span className="font-medium">
                    {monthlyMetrics.reduce((sum, tool) => sum + tool.totalUsage, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Avg Success Rate</span>
                  <span className="font-medium">
                    {monthlyMetrics.length > 0 
                      ? (monthlyMetrics.reduce((sum, tool) => sum + tool.successRate, 0) / monthlyMetrics.length).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Credits Spent</span>
                  <span className="font-medium">
                    {monthlyMetrics.reduce((sum, tool) => sum + tool.totalCreditsSpent, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tool Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tool Performance Details (Last 30 Days)
            </CardTitle>
            <CardDescription>
              Comprehensive metrics for each tool including usage, success rates, and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyMetrics.map((tool) => (
                <div key={tool.tool} className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {tool.tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {tool.totalUsage} total uses in the last 30 days
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${getPerformanceColor(tool.popularityTrend)}`}>
                        {getPerformanceIcon(tool.popularityTrend)}
                        <Badge variant={
                          tool.popularityTrend === 'up' ? 'default' : 
                          tool.popularityTrend === 'down' ? 'destructive' : 'secondary'
                        }>
                          {tool.popularityTrend}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Success Rate */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={getSuccessRateColor(tool.successRate)}>
                          {getSuccessRateIcon(tool.successRate)}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Success Rate
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {tool.successRate.toFixed(1)}%
                      </div>
                      <Progress value={tool.successRate} className="h-2" />
                    </div>

                    {/* Average Processing Time */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Avg Processing Time
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {tool.avgProcessingTime > 0 
                          ? `${(tool.avgProcessingTime / 1000).toFixed(1)}s`
                          : 'N/A'
                        }
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {tool.avgProcessingTime > 2000 
                          ? 'Slow' 
                          : tool.avgProcessingTime > 1000 
                            ? 'Medium' 
                            : 'Fast'
                        }
                      </div>
                    </div>

                    {/* Credits Spent */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Credits Spent
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {tool.totalCreditsSpent}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {tool.totalUsage > 0 
                          ? `${(tool.totalCreditsSpent / tool.totalUsage).toFixed(1)} per use`
                          : 'N/A'
                        }
                      </div>
                    </div>

                    {/* Usage Trend */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Usage Trend
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Last 24h</span>
                          <span className="font-medium">{tool.last24Hours}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Last 7d</span>
                          <span className="font-medium">{tool.last7Days}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Last 30d</span>
                          <span className="font-medium">{tool.last30Days}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Insights
            </CardTitle>
            <CardDescription>
              Key insights and recommendations based on tool performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Top Performing Tools */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  🏆 Top Performing Tools
                </h4>
                <div className="space-y-1">
                  {monthlyMetrics
                    .filter(tool => tool.successRate >= 95)
                    .slice(0, 3)
                    .map(tool => (
                      <div key={tool.tool} className="text-sm text-green-700 dark:text-green-300">
                        • {tool.tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - {tool.successRate.toFixed(1)}% success rate
                      </div>
                    ))}
                </div>
              </div>

              {/* Tools Needing Attention */}
              {monthlyMetrics.some(tool => tool.successRate < 80) && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    ⚠️ Tools Needing Attention
                  </h4>
                  <div className="space-y-1">
                    {monthlyMetrics
                      .filter(tool => tool.successRate < 80)
                      .map(tool => (
                        <div key={tool.tool} className="text-sm text-red-700 dark:text-red-300">
                          • {tool.tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - {tool.successRate.toFixed(1)}% success rate
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Trending Tools */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  📈 Trending Tools
                </h4>
                <div className="space-y-1">
                  {monthlyMetrics
                    .filter(tool => tool.popularityTrend === 'up')
                    .slice(0, 3)
                    .map(tool => (
                      <div key={tool.tool} className="text-sm text-blue-700 dark:text-blue-300">
                        • {tool.tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - {tool.last7Days} uses this week
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 