"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  CreditCard, 
  Plus, 
  Users, 
  TrendingUp, 
  RefreshCw,
  Gift,
  DollarSign,
  Activity,
  BarChart3,
  Download
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCreditsDistributed: number
  totalToolUsage: number
  totalAudits: number
}

export function AdminCreditsClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [bulkOperation, setBulkOperation] = useState<'all_users' | 'active_users' | 'inactive_users'>('all_users')
  const [creditAmount, setCreditAmount] = useState('')
  const [creditReason, setCreditReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  
  const { toast } = useToast()

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()

      if (response.ok) {
        setStats(data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch statistics',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkCreditAssignment = async () => {
    if (!creditAmount || !creditReason) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    setActionLoading(true)
    try {
      // First, get users based on the selected criteria
      const usersResponse = await fetch(`/api/admin/users?${new URLSearchParams({
        limit: '1000',
        ...(bulkOperation === 'active_users' && { isActive: 'true' }),
        ...(bulkOperation === 'inactive_users' && { isActive: 'false' })
      })}`)
      
      const usersData = await usersResponse.json()
      
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users')
      }

      const userIds = usersData.users.map((user: any) => user.id)
      
      if (userIds.length === 0) {
        toast({
          title: 'Error',
          description: 'No users found for the selected criteria',
          variant: 'destructive'
        })
        return
      }

      // Assign credits to selected users
      const response = await fetch('/api/admin/credits/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds,
          amount: parseInt(creditAmount),
          reason: creditReason
        }),
      })

      if (response.ok) {
        await fetchStats()
        toast({
          title: 'Success',
          description: `Credits assigned to ${userIds.length} users successfully`,
        })
        setShowBulkDialog(false)
        setCreditAmount('')
        setCreditReason('')
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to assign bulk credits',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign bulk credits',
        variant: 'destructive'
      })
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading credit statistics...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Credit Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage credits, view statistics, and perform bulk operations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => setShowBulkDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Bulk Credit Assignment
          </Button>
        </div>
      </div>

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
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Credit Usage</CardTitle>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalToolUsage.toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Tool executions
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
                  {stats.totalToolUsage > 0 ? (stats.totalCreditsDistributed / stats.totalToolUsage).toFixed(1) : 0}
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
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
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
                  {(parseInt(creditAmount) * (
                    bulkOperation === 'all_users' ? stats.totalUsers :
                    bulkOperation === 'active_users' ? stats.activeUsers :
                    stats.totalUsers - stats.activeUsers
                  )).toLocaleString()}
                </p>
              </div>
            )}
            
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
                disabled={actionLoading || !creditAmount || !creditReason}
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