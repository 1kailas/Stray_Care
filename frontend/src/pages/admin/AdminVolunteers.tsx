import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { volunteersApi, Volunteer, volunteerTasksApi, VolunteerTask } from '@/lib/api'
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
  Users, Search, Download, Check, X, Calendar,
  Mail, Phone, Clock, Award, TrendingUp, Trash2, MoreVertical, Plus, ListTodo
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function AdminVolunteers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    dueDate: ''
  })

  const queryClient = useQueryClient()

  // Fetch volunteers
  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ['admin-volunteers'],
    queryFn: volunteersApi.getAll
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => volunteersApi.updateStatus(id, 'APPROVED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] })
      queryClient.invalidateQueries({ queryKey: ['volunteers'] })
      toast.success('Volunteer approved successfully')
      setViewDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to approve volunteer')
    }
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (id: string) => volunteersApi.updateStatus(id, 'REJECTED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] })
      queryClient.invalidateQueries({ queryKey: ['volunteers'] })
      toast.success('Volunteer rejected')
      setViewDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to reject volunteer')
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => volunteersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] })
      queryClient.invalidateQueries({ queryKey: ['volunteers'] })
      toast.success('Volunteer deleted successfully')
      setViewDialogOpen(false)
    },
    onError: (error: any) => {
      console.error('Failed to delete volunteer:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
      toast.error(`Failed to delete volunteer: ${errorMessage}`)
    }
  })

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: Partial<VolunteerTask>) => volunteerTasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] })
      queryClient.invalidateQueries({ queryKey: ['volunteers'] })
      toast.success('Task assigned successfully')
      setTaskDialogOpen(false)
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
    },
    onError: (error: any) => {
      console.error('Failed to assign task:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
      toast.error(`Failed to assign task: ${errorMessage}`)
    }
  })

  const handleAssignTask = () => {
    if (!selectedVolunteer) return
    
    if (!taskForm.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    createTaskMutation.mutate({
      volunteerId: selectedVolunteer.id,
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate || undefined,
      status: 'PENDING',
      assignedDate: new Date().toISOString()
    })
  }

  // Filter volunteers
  const filteredVolunteers = volunteers.filter((volunteer: Volunteer) => {
    const matchesSearch = searchTerm === '' || 
      volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.experience?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || volunteer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = {
    total: volunteers.length,
    pending: volunteers.filter((v: Volunteer) => v.status === 'PENDING').length,
    approved: volunteers.filter((v: Volunteer) => v.status === 'APPROVED').length,
    rejected: volunteers.filter((v: Volunteer) => v.status === 'REJECTED').length
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      PENDING: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      APPROVED: { variant: 'default', className: 'bg-green-100 text-green-700 border-green-200' },
      REJECTED: { variant: 'destructive', className: 'bg-red-100 text-red-700 border-red-200' }
    }
    const config = variants[status] || variants.PENDING
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Address', 'Experience', 'Availability', 'Status', 'Created Date'],
      ...filteredVolunteers.map((v: Volunteer) => [
        v.id,
        v.name || '',
        v.email || '',
        v.phoneNumber || '',
        v.address || '',
        v.experience || '',
        v.availability || '',
        v.status,
        new Date(v.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `volunteers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Volunteers exported successfully')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Volunteer Management</h1>
        <p className="text-slate-500 mt-1">
          Review and manage volunteer applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Volunteers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              All applications
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.pending}</div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.approved}</div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Active volunteers</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.rejected}</div>
              <X className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Declined applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Volunteers</CardTitle>
          <CardDescription>Search and filter volunteer applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or experience..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Applications ({filteredVolunteers.length})</CardTitle>
          <CardDescription>Manage all volunteer applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500">
                      No volunteers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVolunteers.map((volunteer: Volunteer) => (
                    <TableRow key={volunteer.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{volunteer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="flex items-center gap-1 text-slate-600">
                            <Mail className="h-3 w-3" />
                            {volunteer.email}
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Phone className="h-3 w-3" />
                            {volunteer.phoneNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{volunteer.availability}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{volunteer.experience}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(volunteer.createdAt), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedVolunteer(volunteer)
                            setViewDialogOpen(true)
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Volunteer Application Details</DialogTitle>
            <DialogDescription>
              Review volunteer application and take action
            </DialogDescription>
          </DialogHeader>
          {selectedVolunteer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <p className="text-slate-900">{selectedVolunteer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedVolunteer.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-900">{selectedVolunteer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <p className="text-slate-900">{selectedVolunteer.phoneNumber}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Address</label>
                <p className="text-slate-900 mt-1">{selectedVolunteer.address}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Experience</label>
                <p className="text-slate-900 mt-1">{selectedVolunteer.experience}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Availability</label>
                <p className="text-slate-900 mt-1">{selectedVolunteer.availability}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Applied Date</label>
                <p className="text-slate-900 mt-1">
                  {new Date(selectedVolunteer.createdAt).toLocaleDateString()} - {formatDistanceToNow(new Date(selectedVolunteer.createdAt), { addSuffix: true })}
                </p>
              </div>

              {selectedVolunteer.status === 'PENDING' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => approveMutation.mutate(selectedVolunteer.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Volunteer
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => rejectMutation.mutate(selectedVolunteer.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
              
              {/* Assign Task button - only for approved volunteers */}
              {selectedVolunteer.status === 'APPROVED' && (
                <div className="pt-4 border-t">
                  <Button
                    variant="default"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setTaskDialogOpen(true)
                      setViewDialogOpen(false)
                    }}
                  >
                    <ListTodo className="h-4 w-4 mr-2" />
                    Assign Task
                  </Button>
                </div>
              )}
              
              {/* Delete button - always visible */}
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm(`Are you sure you want to permanently delete ${selectedVolunteer.name}? This action cannot be undone.`)) {
                      deleteMutation.mutate(selectedVolunteer.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Volunteer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Task to Volunteer</DialogTitle>
            <DialogDescription>
              {selectedVolunteer && `Assign a new task to ${selectedVolunteer.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Task Title *</Label>
              <Input
                id="task-title"
                placeholder="e.g., Feed dogs at shelter"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Provide details about the task..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select 
                  value={taskForm.priority} 
                  onValueChange={(value: any) => setTaskForm({ ...taskForm, priority: value })}
                >
                  <SelectTrigger id="task-priority" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-due-date">Due Date (Optional)</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAssignTask}
                disabled={createTaskMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Assign Task
              </Button>
              <Button
                onClick={() => setTaskDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
