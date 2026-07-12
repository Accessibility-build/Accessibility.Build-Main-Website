"use client"

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { 
  CreditCard, 
  Plus, 
  Users, 
  TrendingUp, 
  RefreshCw,
  Gift,
  Activity,
  BarChart3
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCreditsDistributed: number
  totalCreditsUsed: number
  totalToolUsage: number
  totalAudits: number
}

const BULK_ASSIGNMENT_BATCH_SIZE = 100
const USER_PAGE_SIZE = 200

type UserIdPage = {
  users: Array<{ id: string }>
  total: number
}

export function AdminCreditsClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [bulkOperation, setBulkOperation] = useState<'all_users' | 'active_users' | 'inactive_users'>('all_users')
  const [creditAmount, setCreditAmount] = useState('')
  const [creditReason, setCreditReason] = useState('')
  const [bulkConfirmValue, setBulkConfirmValue] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  
  const { toast } = useToast()

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()

      if (response.ok) {
        setStats(data)
      } else {
        const message = data?.error || 'Failed to fetch statistics'
        setLoadError(message)
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to fetch statistics')
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const handleBulkCreditAssignment = async () => {
    if (!creditAmount || !creditReason) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    const parsedAmount = Number(creditAmount)
    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Credit amount must be a positive integer',
        variant: 'destructive'
      })
      return
    }

    setActionLoading(true)
    try {
      const userIds: string[] = []
      let offset = 0
      let totalUsersToLoad = Number.POSITIVE_INFINITY

      while (userIds.length < totalUsersToLoad) {
        const usersResponse = await fetch(`/api/admin/users?${new URLSearchParams({
          limit: String(USER_PAGE_SIZE),
          offset: String(offset),
          ...(bulkOperation === 'active_users' && { isActive: 'true' }),
          ...(bulkOperation === 'inactive_users' && { isActive: 'false' })
        })}`)
        const usersData = await usersResponse.json() as UserIdPage & { error?: string }

        if (!usersResponse.ok) {
          throw new Error(usersData.error || 'Failed to fetch users')
        }

        totalUsersToLoad = usersData.total
        userIds.push(...usersData.users.map((user) => user.id))
        offset += usersData.users.length

        if (usersData.users.length === 0) break
      }
      
      if (userIds.length === 0) {
        toast({
          title: 'Error',
          description: 'No users found for the selected criteria',
          variant: 'destructive'
        })
        return
      }

      const expectedUserCount = bulkOperation === 'all_users'
        ? stats?.totalUsers ?? 0
        : bulkOperation === 'active_users'
          ? stats?.activeUsers ?? 0
          : (stats?.totalUsers ?? 0) - (stats?.activeUsers ?? 0)

      if (userIds.length !== expectedUserCount) {
        await fetchStats()
        toast({
          title: 'Audience changed',
          description: `Expected ${expectedUserCount} users but loaded ${userIds.length}. Review the updated totals and confirm again.`,
          variant: 'destructive'
        })
        setBulkConfirmValue('')
        return
      }

      let totalSuccessful = 0
      let totalFailed = 0

      for (let i = 0; i < userIds.length; i += BULK_ASSIGNMENT_BATCH_SIZE) {
        const batchUserIds = userIds.slice(i, i + BULK_ASSIGNMENT_BATCH_SIZE)
        const response = await fetch('/api/admin/credits/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userIds: batchUserIds,
            amount: parsedAmount,
            reason: creditReason
          }),
        })

        const responseBody = await response.json()

        if (!response.ok) {
          throw new Error(responseBody.error || 'Failed to assign bulk credits')
        }

        totalSuccessful += responseBody?.result?.successful ?? batchUserIds.length
        totalFailed += responseBody?.result?.failed ?? 0
      }

      await fetchStats()
      toast({
        title: totalFailed === 0 ? 'Success' : 'Partial Success',
        description: totalFailed === 0
          ? `Credits assigned to ${totalSuccessful} users successfully`
          : `Assigned credits to ${totalSuccessful} users, ${totalFailed} failed`,
        variant: totalFailed === 0 ? 'default' : 'destructive'
      })

      if (totalSuccessful > 0) {
        setShowBulkDialog(false)
        setCreditAmount('')
        setCreditReason('')
        setBulkConfirmValue('')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to assign bulk credits',
        variant: 'destructive'
      })
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading credit statistics...
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <AdminPageHeader eyebrow="People and revenue" title="Credits" description="Review credit distribution and grant account balances in auditable, API-safe batches." />
        <div className="rounded-md border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">
          <p className="font-semibold">Credit statistics could not be loaded</p>
          <p className="mt-2 text-sm">{loadError || 'The dashboard API returned no data.'}</p>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={fetchStats}>Try again</Button>
        </div>
      </div>
    )
  }

  const bulkTargetCount = bulkOperation === 'all_users'
    ? stats.totalUsers
    : bulkOperation === 'active_users'
      ? stats.activeUsers
      : stats.totalUsers - stats.activeUsers
  const bulkConfirmationMatches = bulkConfirmValue.trim() === String(bulkTargetCount) && bulkTargetCount > 0

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="People and revenue"
        title="Credits"
        description="Review credit distribution and grant account balances in auditable, API-safe batches."
        actions={
          <>
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => setShowBulkDialog(true)}
            disabled={stats.totalUsers === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Bulk Credit Assignment
          </Button>
          </>
        }
      />

      {/* Credit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalUsers.toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active:</span>
              <span className="text-sm font-medium">{stats.activeUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Credits Distributed</CardTitle>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalCreditsDistributed.toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Across all users
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Credits Used</CardTitle>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalCreditsUsed.toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Recorded across user accounts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Audits Completed</CardTitle>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalAudits.toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total audits
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              Bulk Credit Operations
            </CardTitle>
            <CardDescription>
              Assign credits to multiple users at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setBulkOperation('all_users')
                    setShowBulkDialog(true)
                  }}
                >
                  <Users className="h-6 w-6 text-blue-600" />
                  <div className="text-center">
                    <div className="font-medium">All Users</div>
                    <div className="text-xs text-muted-foreground">{stats.totalUsers} users</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setBulkOperation('active_users')
                    setShowBulkDialog(true)
                  }}
                >
                  <Users className="h-6 w-6 text-green-600" />
                  <div className="text-center">
                    <div className="font-medium">Active Users</div>
                    <div className="text-xs text-muted-foreground">{stats.activeUsers} users</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setBulkOperation('inactive_users')
                    setShowBulkDialog(true)
                  }}
                >
                  <Users className="h-6 w-6 text-slate-600" />
                  <div className="text-center">
                    <div className="font-medium">Inactive Users</div>
                    <div className="text-xs text-muted-foreground">{stats.totalUsers - stats.activeUsers} users</div>
                  </div>
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  💡 Quick Actions
                </h4>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <div>• Reward active users with bonus credits</div>
                  <div>• Welcome new users with starter credits</div>
                  <div>• Motivate inactive users to return</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Credit Analytics
            </CardTitle>
            <CardDescription>
              Key metrics and insights about credit usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">Average Credits per User</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Based on total distribution</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalUsers > 0 ? Math.round(stats.totalCreditsDistributed / stats.totalUsers) : 0}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">Credits per Tool Usage</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Average cost efficiency</div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalToolUsage > 0 ? (stats.totalCreditsUsed / stats.totalToolUsage).toFixed(1) : 0}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">Active User Rate</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Percentage of active users</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Credit Assignment Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={(open) => {
        setShowBulkDialog(open)
        if (!open) setBulkConfirmValue('')
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Credit Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Target:</strong> {
                  bulkOperation === 'all_users' ? `All ${stats.totalUsers} users` :
                  bulkOperation === 'active_users' ? `${stats.activeUsers} active users` :
                  `${stats.totalUsers - stats.activeUsers} inactive users`
                }
              </p>
            </div>
            
            <div>
              <Label htmlFor="bulk-credit-amount">Credit Amount per User</Label>
              <Input
                id="bulk-credit-amount"
                type="number"
                placeholder="Enter credit amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                min="1"
              />
            </div>
            
            <div>
              <Label htmlFor="bulk-credit-reason">Reason</Label>
              <Textarea
                id="bulk-credit-reason"
                placeholder="Enter reason for credit assignment"
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
              />
            </div>

            {creditAmount && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Total credits to be assigned:</strong>{' '}
                  {(Math.max(0, Number(creditAmount) || 0) * (
                    bulkOperation === 'all_users' ? stats.totalUsers :
                    bulkOperation === 'active_users' ? stats.activeUsers :
                    stats.totalUsers - stats.activeUsers
                  )).toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="bulk-credit-confirmation">Type {bulkTargetCount} to confirm this audience</Label>
              <Input
                id="bulk-credit-confirmation"
                inputMode="numeric"
                value={bulkConfirmValue}
                onChange={(event) => setBulkConfirmValue(event.target.value)}
                placeholder={String(bulkTargetCount)}
                aria-describedby="bulk-credit-confirmation-help"
              />
              <p id="bulk-credit-confirmation-help" className="mt-2 text-xs leading-5 text-muted-foreground">Credits cannot be removed from this screen after assignment. The reason is written to the audit trail.</p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBulkDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkCreditAssignment}
                disabled={actionLoading || !creditAmount || !creditReason || !bulkConfirmationMatches}
              >
                {actionLoading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Assign Credits
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
