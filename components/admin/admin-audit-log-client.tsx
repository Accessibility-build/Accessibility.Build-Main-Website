"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Activity, 
  Shield, 
  User, 
  CreditCard, 
  RefreshCw,
  Download,
  Calendar,
  Eye,
  Filter,
  X
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AdminAuditLog {
  id: string
  adminId: string
  adminEmail: string
  action: string
  targetUserId?: string
  details: Record<string, any>
  timestamp: Date
}

interface AuditLogResponse {
  actions: AdminAuditLog[]
  total: number
  limit: number
}

export function AdminAuditLogClient({ initialActions }: { initialActions: AdminAuditLog[] }) {
  const [auditLog, setAuditLog] = useState<AdminAuditLog[]>(initialActions)
  const [loading, setLoading] = useState(false)
  const [filteredLog, setFilteredLog] = useState<AdminAuditLog[]>(initialActions)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [adminFilter, setAdminFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const { toast } = useToast()

  const fetchAuditLog = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/audit-log?limit=200')
      const data: AuditLogResponse = await response.json()
      
      if (response.ok) {
        setAuditLog(data.actions)
        setFilteredLog(data.actions)
        toast({
          title: 'Success',
          description: 'Audit log refreshed',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch audit log',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch audit log',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...auditLog]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.targetUserId && log.targetUserId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by action type
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    // Filter by admin
    if (adminFilter !== 'all') {
      filtered = filtered.filter(log => log.adminEmail === adminFilter)
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date()
      let cutoffDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setDate(now.getDate() - 30)
          break
        default:
          cutoffDate = new Date(0)
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= cutoffDate)
    }

    setFilteredLog(filtered)
  }, [searchTerm, actionFilter, adminFilter, dateFilter, auditLog])

  const exportAuditLog = () => {
    try {
      // Create CSV header
      const headers = ['Timestamp', 'Admin Email', 'Action', 'Target User ID', 'Details']
      
      // Create CSV rows
      const rows = filteredLog.map(log => [
        new Date(log.timestamp).toISOString(),
        log.adminEmail || 'Unknown',
        log.action,
        log.targetUserId || 'N/A',
        JSON.stringify(log.details)
      ])
      
      // Combine header and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n')
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-log-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Success',
        description: `Exported ${filteredLog.length} audit log entries to CSV`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export audit log',
        variant: 'destructive'
      })
    }
  }

  const exportAuditLogJSON = () => {
    try {
      const jsonContent = JSON.stringify(filteredLog, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-log-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Success',
        description: `Exported ${filteredLog.length} audit log entries to JSON`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export audit log',
        variant: 'destructive'
      })
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'user_status_update':
        return <User className="h-4 w-4" />
      case 'credit_assignment':
        return <CreditCard className="h-4 w-4" />
      case 'bulk_credit_assignment':
        return <CreditCard className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'user_status_update':
        return 'text-blue-600'
      case 'credit_assignment':
        return 'text-green-600'
      case 'bulk_credit_assignment':
        return 'text-purple-600'
      default:
        return 'text-slate-600'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'user_status_update':
        return 'User Status'
      case 'credit_assignment':
        return 'Credit Assignment'
      case 'bulk_credit_assignment':
        return 'Bulk Credits'
      default:
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const formatActionDetails = (action: string, details: any) => {
    switch (action) {
      case 'user_status_update':
        return `Set user status to ${details.newStatus}`
      case 'credit_assignment':
        return `Assigned ${details.amount} credits - ${details.reason}`
      case 'bulk_credit_assignment':
        return `Assigned ${details.amount} credits to ${details.totalUsers} users - ${details.reason}`
      default:
        return 'Admin action performed'
    }
  }

  const uniqueAdmins = Array.from(new Set(auditLog.map(log => log.adminEmail).filter(Boolean)))
  const uniqueActions = Array.from(new Set(auditLog.map(log => log.action)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Audit Log</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track all administrative actions and changes
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchAuditLog} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportAuditLog} disabled={filteredLog.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportAuditLogJSON} disabled={filteredLog.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search audit log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {getActionLabel(action)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={adminFilter} onValueChange={setAdminFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Admins</SelectItem>
                {uniqueAdmins.map(email => (
                  <SelectItem key={email} value={email}>
                    {email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || actionFilter !== 'all' || adminFilter !== 'all' || dateFilter !== 'all') && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setActionFilter('all')
                  setAdminFilter('all')
                  setDateFilter('all')
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Showing {filteredLog.length} of {auditLog.length} entries
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Actions</CardTitle>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredLog.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Filtered entries
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">User Updates</CardTitle>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredLog.filter(log => log.action === 'user_status_update').length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Status changes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Credit Actions</CardTitle>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredLog.filter(log => log.action.includes('credit')).length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Credit assignments
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Recent Activity</CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredLog.filter(log => {
                  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
                  return new Date(log.timestamp) > dayAgo
                }).length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Last 24 hours
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Actions Log
          </CardTitle>
          <CardDescription>
            Chronological record of all administrative actions performed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLog.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-slate-500 dark:text-slate-400">
                        No audit log entries found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLog.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                          </div>
                          <Badge variant="secondary">
                            {getActionLabel(log.action)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {log.adminEmail || 'Unknown Admin'}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">
                            {log.adminId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.targetUserId ? (
                          <div className="text-sm">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {log.targetUserId}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          {formatActionDetails(log.action, log.details)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Activity Timeline
          </CardTitle>
          <CardDescription>
            Latest administrative actions in chronological order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLog.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  log.action === 'user_status_update' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  log.action === 'credit_assignment' ? 'bg-green-100 dark:bg-green-900/20' :
                  log.action === 'bulk_credit_assignment' ? 'bg-purple-100 dark:bg-purple-900/20' :
                  'bg-slate-100 dark:bg-slate-800'
                }`}>
                  <div className={getActionColor(log.action)}>
                    {getActionIcon(log.action)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {getActionLabel(log.action)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {formatActionDetails(log.action, log.details)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Admin: {log.adminEmail || log.adminId}</span>
                    {log.targetUserId && (
                      <span>Target: {log.targetUserId}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLog.length === 0 && (
              <div className="text-center py-8">
                <div className="text-slate-500 dark:text-slate-400">
                  No recent activities to display
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

