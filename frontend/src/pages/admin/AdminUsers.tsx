import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi, User } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { 
  Users, Search, Download, UserX, Eye, Calendar,
  Mail, Activity, TrendingUp, UserCheck, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const queryClient = useQueryClient()

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: usersApi.getAll
  })

  // Debug: log all users to see what we're getting from the backend
  console.log('All users from backend:', users)
  console.log('Number of users:', users.length)
  if (error) {
    console.error('Error fetching users:', error)
  }

    // Change role mutation
  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersApi.changeRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User role updated successfully')
    },
    onError: () => toast.error('Failed to update role')
  })

  // Suspend user mutation
  const suspendMutation = useMutation({
    mutationFn: (id: string) => usersApi.toggleStatus(id, 'SUSPENDED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User suspended successfully')
    },
    onError: () => toast.error('Failed to suspend user')
  })

  // Activate user mutation
  const activateMutation = useMutation({
    mutationFn: (id: string) => usersApi.toggleStatus(id, 'ACTIVE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User activated successfully')
    },
    onError: () => toast.error('Failed to activate user')
  })

  // Filter users - Show ALL users (including admins for debugging)
  // TODO: Previously filtered out admins - removed for debugging
  const regularUsers = users // Show all users
  
  const filteredUsers = regularUsers.filter((user: User) => {
    const matchesSearch = searchTerm === '' || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  // Calculate stats - for ALL users now
  const stats = {
    total: regularUsers.length,
    admins: regularUsers.filter((u: User) => u.role === 'ADMIN').length,
    active: regularUsers.filter((u: User) => u.status !== 'SUSPENDED').length,
    suspended: regularUsers.filter((u: User) => u.status === 'SUSPENDED').length
  }

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN') {
      return <Badge className="bg-blue-600">ADMIN</Badge>
    }
    return <Badge variant="outline">USER</Badge>
  }

  const getStatusBadge = (status?: string) => {
    if (status === 'SUSPENDED') {
      return <Badge variant="destructive">SUSPENDED</Badge>
    }
    return <Badge className="bg-green-100 text-green-700">ACTIVE</Badge>
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Role', 'Status', 'Joined', 'Last Login'],
      ...filteredUsers.map((u: User) => [
        u.id,
        u.name || '',
        u.email || '',
        u.role,
        u.status || 'ACTIVE',
        new Date(u.createdAt).toLocaleDateString(),
        u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Users exported successfully')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading users...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Failed to load users</h2>
          <p className="text-slate-500 mt-2">
            {(error as any)?.message || 'Unknown error occurred'}
          </p>
          <p className="text-sm text-slate-400 mt-1">Check browser console for details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">
          Manage all users and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.admins}</div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Admin accounts</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.active}</div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Active accounts</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Suspended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.suspended}</div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Suspended accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
          <CardDescription>Search and filter user accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: User) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {user.lastLogin ? (
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
                          </div>
                        ) : (
                          'Never'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user)
                              setViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.status === 'SUSPENDED' ? (
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => activateMutation.mutate(user.id)}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => suspendMutation.mutate(user.id)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user account
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <p className="text-slate-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Role</label>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Joined</label>
                  <p className="text-slate-900 mt-1">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Last Login</label>
                  <p className="text-slate-900 mt-1">
                    {selectedUser.lastLogin 
                      ? new Date(selectedUser.lastLogin).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Change Role</label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={selectedUser.role === 'USER' ? 'default' : 'outline'}
                      onClick={() => changeRoleMutation.mutate({ id: selectedUser.id, role: 'USER' })}
                      className="flex-1"
                    >
                      Set as User
                    </Button>
                    <Button
                      variant={selectedUser.role === 'ADMIN' ? 'default' : 'outline'}
                      onClick={() => changeRoleMutation.mutate({ id: selectedUser.id, role: 'ADMIN' })}
                      className="flex-1"
                    >
                      Set as Admin
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Account Status</label>
                  <div className="flex gap-2 mt-2">
                    {selectedUser.status === 'SUSPENDED' ? (
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => activateMutation.mutate(selectedUser.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activate Account
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => suspendMutation.mutate(selectedUser.id)}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Suspend Account
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
