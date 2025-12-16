"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  UserCheck, 
  UserX, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Download,
  Mail,
  Calendar,
  Activity,
  BarChart3,
  Crown
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AdminUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  profileImageUrl: string | null
  credits: number
  totalCreditsEarned: number
  totalCreditsUsed: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  totalToolUsage: number
  totalAudits: number
  mostUsedTool?: string
}

interface UsersResponse {
  users: AdminUser[]
  total: number
}

export function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState('created')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showCreditDialog, setShowCreditDialog] = useState(false)
  const [showBulkCreditDialog, setShowBulkCreditDialog] = useState(false)
  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false)
  const [creditDialogUserId, setCreditDialogUserId] = useState<string | null>(null)
  const [selectedUserDetails, setSelectedUserDetails] = useState<AdminUser | null>(null)
  const [loadingUserDetails, setLoadingUserDetails] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditReason, setCreditReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  
  const { toast } = useToast()

  const fetchUserDetails = async (userId: string) => {
    setLoadingUserDetails(true)
    setShowUserDetailsDialog(true)
    try {
      // Since we already have user data, we can use it directly
      // But if we need more details, we could call an API endpoint
      const user = users.find(u => u.id === userId)
      if (user) {
        setSelectedUserDetails(user)
      } else {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive'
        })
        setShowUserDetailsDialog(false)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'destructive'
      })
      setShowUserDetailsDialog(false)
    } finally {
      setLoadingUserDetails(false)
    }
  }

  const exportUsers = () => {
    try {
      // Create CSV header
      const headers = ['Email', 'Name', 'Status', 'Credits', 'Total Credits Earned', 'Total Credits Used', 'Tool Usage', 'Audits', 'Most Used Tool', 'Created At']
      
      // Create CSV rows
      const rows = users.map(user => [
        user.email,
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        user.isActive ? 'Active' : 'Inactive',
        user.credits.toString(),
        user.totalCreditsEarned.toString(),
        user.totalCreditsUsed.toString(),
        user.totalToolUsage.toString(),
        user.totalAudits.toString(),
        user.mostUsedTool || 'N/A',
        new Date(user.createdAt).toLocaleDateString()
      ])
      
      // Combine header and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Success',
        description: `Exported ${users.length} users to CSV`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export users',
        variant: 'destructive'
      })
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: ((currentPage - 1) * pageSize).toString(),
        sortBy,
        sortOrder,
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter)
      }

      const response = await fetch(`/api/admin/users?${params}`)
      const data: UsersResponse = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setTotal(data.total)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch users',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        await fetchUsers()
        toast({
          title: 'Success',
          description: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to update user status',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      })
    } finally {
      setActionLoading(false)
    }
  }

  const assignCredits = async (userId: string, amount: number, reason: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, reason }),
      })

      if (response.ok) {
        await fetchUsers()
        toast({
          title: 'Success',
          description: `${amount} credits assigned successfully`,
        })
        setShowCreditDialog(false)
        setCreditAmount('')
        setCreditReason('')
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to assign credits',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign credits',
        variant: 'destructive'
      })
    } finally {
      setActionLoading(false)
    }
  }

  const bulkAssignCredits = async (userIds: string[], amount: number, reason: string) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/credits/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds, amount, reason }),
      })

      if (response.ok) {
        await fetchUsers()
        toast({
          title: 'Success',
          description: `Credits assigned to ${userIds.length} users`,
        })
        setShowBulkCreditDialog(false)
        setSelectedUsers([])
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const handleUserSelect = (userId: string, checked: boolean) => {
    setSelectedUsers(prev => 
      checked 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users.map(u => u.id) : [])
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, statusFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, total)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage users, view their activity, and assign credits
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportUsers} disabled={loading || users.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
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
          <form onSubmit={handleSearch} className="flex flex-col md:!flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by email, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="credits">Credits</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedUsers.length} users selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkCreditDialog(true)}
                  disabled={actionLoading}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Assign Credits
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUsers([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({total.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-slate-500 dark:text-slate-400">
                        No users found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            {user.profileImageUrl ? (
                              <img 
                                src={user.profileImageUrl} 
                                alt={user.firstName || user.email} 
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user.email
                              }
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {user.credits.toLocaleString()}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">
                            {user.totalCreditsEarned.toLocaleString()} earned
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {user.totalToolUsage} tools
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">
                            {user.totalAudits} audits
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchUserDetails(user.id)}
                            disabled={loadingUserDetails}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateUserStatus(user.id, !user.isActive)}
                            disabled={actionLoading}
                          >
                            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCreditDialogUserId(user.id)
                              setShowCreditDialog(true)
                            }}
                            disabled={actionLoading}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Showing {startIndex} to {endIndex} of {total.toLocaleString()} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credit Assignment Dialog */}
      <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="credit-amount">Credit Amount</Label>
              <Input
                id="credit-amount"
                type="number"
                placeholder="Enter credit amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="credit-reason">Reason</Label>
              <Textarea
                id="credit-reason"
                placeholder="Enter reason for credit assignment"
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreditDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => creditDialogUserId && assignCredits(creditDialogUserId, parseInt(creditAmount), creditReason)}
                disabled={actionLoading || !creditAmount || !creditReason}
              >
                {actionLoading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Assign Credits
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Credit Assignment Dialog */}
      <Dialog open={showBulkCreditDialog} onOpenChange={setShowBulkCreditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Assign Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Assigning credits to {selectedUsers.length} selected users
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
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBulkCreditDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => bulkAssignCredits(selectedUsers, parseInt(creditAmount), creditReason)}
                disabled={actionLoading || !creditAmount || !creditReason}
              >
                {actionLoading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Assign Credits
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={showUserDetailsDialog} onOpenChange={setShowUserDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {loadingUserDetails ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : selectedUserDetails ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  {selectedUserDetails.profileImageUrl ? (
                    <img 
                      src={selectedUserDetails.profileImageUrl} 
                      alt={selectedUserDetails.firstName || selectedUserDetails.email} 
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <span className="text-xl font-medium text-slate-600 dark:text-slate-400">
                      {(selectedUserDetails.firstName?.[0] || selectedUserDetails.email[0]).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedUserDetails.firstName && selectedUserDetails.lastName 
                      ? `${selectedUserDetails.firstName} ${selectedUserDetails.lastName}`
                      : selectedUserDetails.email
                    }
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{selectedUserDetails.email}</p>
                  <div className="mt-2">
                    <Badge variant={selectedUserDetails.isActive ? 'default' : 'secondary'}>
                      {selectedUserDetails.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Credits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedUserDetails.credits.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedUserDetails.totalCreditsEarned.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedUserDetails.totalCreditsUsed.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Tool Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedUserDetails.totalToolUsage}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">User ID</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{selectedUserDetails.id}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Most Used Tool</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedUserDetails.mostUsedTool 
                      ? selectedUserDetails.mostUsedTool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                      : 'N/A'
                    }
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Audits</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedUserDetails.totalAudits}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Member Since</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(selectedUserDetails.createdAt).toLocaleDateString()} 
                    ({formatDistanceToNow(new Date(selectedUserDetails.createdAt), { addSuffix: true })})
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Updated</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(selectedUserDetails.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreditDialogUserId(selectedUserDetails.id)
                    setShowCreditDialog(true)
                    setShowUserDetailsDialog(false)
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Assign Credits
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    updateUserStatus(selectedUserDetails.id, !selectedUserDetails.isActive)
                    setShowUserDetailsDialog(false)
                  }}
                >
                  {selectedUserDetails.isActive ? (
                    <>
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
} 