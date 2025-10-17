import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Search, Download, Eye, Trash2, MapPin,
  Calendar, User, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import { dogReportsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export function AdminDogReports() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Fetch reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin-dogReports'],
    queryFn: dogReportsApi.getAll
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      dogReportsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dogReports'] })
      queryClient.invalidateQueries({ queryKey: ['dogReports'] })
      toast.success('Status updated successfully')
    },
    onError: (error: any) => {
      console.error('Failed to update status:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
      toast.error(`Failed to update status: ${errorMessage}`)
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => dogReportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dogReports'] })
      queryClient.invalidateQueries({ queryKey: ['dogReports'] })
      toast.success('Report deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete report')
    }
  })

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.dogName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesUrgency = priorityFilter === 'all' || report.urgencyLevel === priorityFilter

    return matchesSearch && matchesStatus && matchesUrgency
  })

  // Statistics
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'PENDING').length,
    assigned: reports.filter(r => r.status === 'ASSIGNED').length,
    inProgress: reports.filter(r => r.status === 'IN_PROGRESS').length,
    rescued: reports.filter(r => r.status === 'RESCUED').length,
    completed: reports.filter(r => r.status === 'COMPLETED').length,
    closed: reports.filter(r => r.status === 'CLOSED').length,
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      PENDING: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-700' },
      ASSIGNED: { variant: 'secondary', className: 'bg-purple-100 text-purple-700' },
      IN_PROGRESS: { variant: 'secondary', className: 'bg-blue-100 text-blue-700' },
      RESCUED: { variant: 'secondary', className: 'bg-green-100 text-green-700' },
      COMPLETED: { variant: 'secondary', className: 'bg-teal-100 text-teal-700' },
      CLOSED: { variant: 'secondary', className: 'bg-gray-100 text-gray-700' },
    }
    const config = variants[status] || variants.PENDING
    return <Badge variant={config.variant} className={config.className}>{status.replace('_', ' ')}</Badge>
  }

  const getUrgencyBadge = (urgency: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      CRITICAL: { variant: 'destructive', className: '' },
      HIGH: { variant: 'secondary', className: 'bg-orange-100 text-orange-700' },
      MEDIUM: { variant: 'outline', className: '' },
      LOW: { variant: 'outline', className: 'text-slate-500' },
    }
    const config = variants[urgency] || variants.MEDIUM
    return <Badge variant={config.variant} className={config.className}>{urgency}</Badge>
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Dog Name', 'Location', 'Status', 'Urgency', 'Reporter', 'Date', 'Description'],
      ...filteredReports.map(r => [
        r.id,
        r.dogName || 'Unknown',
        r.location,
        r.status,
        r.urgencyLevel,
        r.reportedBy?.name || 'Anonymous',
        new Date(r.createdAt).toLocaleDateString(),
        r.description
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dog-reports-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Report exported successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dog Reports Management</h1>
          <p className="text-slate-500 mt-1">
            Manage and track all stray dog reports
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Pending
            </CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> In Progress
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Rescued
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.rescued}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl text-teal-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Closed</CardDescription>
            <CardTitle className="text-2xl text-gray-600">{stats.closed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search dog name, location, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESCUED">Rescued</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency Levels</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports ({filteredReports.length})</CardTitle>
          <CardDescription>
            {statusFilter !== 'all' && `Filtered by status: ${statusFilter}`}
            {priorityFilter !== 'all' && ` | Priority: ${priorityFilter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No reports found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Dog Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-xs">
                      {report.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {report.dogName || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="truncate max-w-[200px]" title={report.location}>
                          {report.location}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getUrgencyBadge(report.urgencyLevel)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={report.status}
                        onValueChange={(status) =>
                          updateStatusMutation.mutate({ id: report.id, status })
                        }
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ASSIGNED">Assigned</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESCUED">Rescued</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{report.reportedBy?.name || 'Anonymous'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedReport(report)
                            setViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this report?')) {
                              deleteMutation.mutate(report.id)
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dog Report Details</DialogTitle>
            <DialogDescription>
              Complete information about this dog report
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              {/* Dog Name - Prominent Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Label className="text-slate-500 text-xs">Dog Name</Label>
                <div className="text-2xl font-bold text-blue-900">
                  {selectedReport.dogName || 'Unknown Dog'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Report ID</Label>
                  <div className="font-mono text-sm">{selectedReport.id}</div>
                </div>
                <div>
                  <Label className="text-slate-500">Date Reported</Label>
                  <div>{new Date(selectedReport.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <Label className="text-slate-500">Urgency Level</Label>
                  <div className="mt-1">{getUrgencyBadge(selectedReport.urgencyLevel)}</div>
                </div>
              </div>

              {selectedReport.condition && (
                <div>
                  <Label className="text-slate-500">Dog Condition</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-sm">
                      {selectedReport.condition}
                    </Badge>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-slate-500">Location</Label>
                <div className="flex items-center gap-2 mt-1 p-3 bg-slate-50 rounded-md">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{selectedReport.location}</span>
                </div>
                {selectedReport.coordinates && (
                  <div className="text-xs text-slate-500 mt-1">
                    Coordinates: {selectedReport.coordinates.coordinates?.[1]?.toFixed(6)}, {selectedReport.coordinates.coordinates?.[0]?.toFixed(6)}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-slate-500">Description</Label>
                <div className="mt-1 p-3 bg-slate-50 rounded-md text-sm whitespace-pre-wrap">
                  {selectedReport.description || 'No description provided'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Reporter Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    {selectedReport.reportedBy?.name || selectedReport.reporterName || 'Anonymous'}
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500">Reporter Contact</Label>
                  <div>{selectedReport.reportedBy?.email || selectedReport.reporterContact || 'Not provided'}</div>
                </div>
              </div>

              {selectedReport.priority && (
                <div>
                  <Label className="text-slate-500">Priority Level</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedReport.priority}</Badge>
                  </div>
                </div>
              )}

              {selectedReport.imageUrl && (
                <div>
                  <Label className="text-slate-500">Photo</Label>
                  <img
                    src={selectedReport.imageUrl}
                    alt="Dog Report"
                    className="mt-2 w-full rounded-lg border"
                  />
                </div>
              )}

              {selectedReport.photos && selectedReport.photos.length > 0 && (
                <div>
                  <Label className="text-slate-500">Photos</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedReport.photos.map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Dog photo ${index + 1}`}
                        className="w-full rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedReport.updatedAt && (
                <div className="text-xs text-slate-500 border-t pt-3 mt-3">
                  Last updated: {new Date(selectedReport.updatedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
