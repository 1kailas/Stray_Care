import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Search, Download, Eye, Check, X, User, Mail, Phone, Calendar, Dog, Trash2
} from 'lucide-react'
import { adoptionsApi } from '@/lib/api'
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
import { Textarea } from '@/components/ui/textarea'

export function AdminAdoptions() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAdoption, setSelectedAdoption] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')

  // Fetch adoptions
  const { data: adoptions = [], isLoading } = useQuery({
    queryKey: ['admin-adoptions'],
    queryFn: adoptionsApi.getAll
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => adoptionsApi.update(id, { status: 'APPROVED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-adoptions'] })
      queryClient.invalidateQueries({ queryKey: ['adoptions'] })
      toast.success('Adoption approved successfully')
      setViewDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to approve adoption')
    }
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (id: string) => adoptionsApi.update(id, { status: 'REJECTED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-adoptions'] })
      queryClient.invalidateQueries({ queryKey: ['adoptions'] })
      toast.success('Adoption rejected')
      setViewDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to reject adoption')
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adoptionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-adoptions'] })
      queryClient.invalidateQueries({ queryKey: ['adoptions'] })
      toast.success('Adoption deleted successfully')
      setViewDialogOpen(false)
    },
    onError: (error: any) => {
      console.error('Failed to delete adoption:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
      toast.error(`Failed to delete adoption: ${errorMessage}`)
    }
  })

  // Filter adoptions
  const filteredAdoptions = adoptions.filter(adoption => {
    const matchesSearch = 
      adoption.dogName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.adopterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.adopterEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || adoption.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Statistics
  const stats = {
    total: adoptions.length,
    pending: adoptions.filter(a => a.status === 'PENDING').length,
    underReview: adoptions.filter(a => a.status === 'UNDER_REVIEW').length,
    approved: adoptions.filter(a => a.status === 'APPROVED').length,
    successful: adoptions.filter(a => a.status === 'APPROVED' || a.status === 'COMPLETED').length,
    rejected: adoptions.filter(a => a.status === 'REJECTED').length,
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      PENDING: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-700' },
      UNDER_REVIEW: { variant: 'secondary', className: 'bg-blue-100 text-blue-700' },
      APPROVED: { variant: 'secondary', className: 'bg-green-100 text-green-700' },
      REJECTED: { variant: 'secondary', className: 'bg-red-100 text-red-700' },
      COMPLETED: { variant: 'secondary', className: 'bg-purple-100 text-purple-700' },
    }
    const config = variants[status] || variants.PENDING
    return <Badge variant={config.variant} className={config.className}>{status.replace('_', ' ')}</Badge>
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Dog Name', 'Adopter Name', 'Email', 'Phone', 'Status', 'Date'],
      ...filteredAdoptions.map(a => [
        a.id,
        a.dogName || 'Unknown',
        a.adopterName || '',
        a.adopterEmail || '',
        a.adopterContact || '',
        a.status,
        new Date(a.createdAt).toLocaleDateString(),
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `adoptions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Adoptions exported successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Adoption Requests Management</h1>
          <p className="text-slate-500 mt-1">
            Review and process adoption applications
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
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.underReview}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Successful</CardDescription>
            <CardTitle className="text-2xl text-purple-600">{stats.successful}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search dog name, adopter name, email..."
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
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adoptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Adoption Requests ({filteredAdoptions.length})</CardTitle>
          <CardDescription>
            {statusFilter !== 'all' && `Filtered by status: ${statusFilter.replace('_', ' ')}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : filteredAdoptions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No adoption requests found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Dog Name</TableHead>
                  <TableHead>Adopter</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdoptions.map((adoption) => (
                  <TableRow key={adoption.id}>
                    <TableCell className="font-mono text-xs">
                      {adoption.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dog className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{adoption.dogName || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{adoption.adopterName || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="text-xs">{adoption.adopterEmail}</span>
                        </div>
                        {adoption.adopterContact && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span className="text-xs">{adoption.adopterContact}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(adoption.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(adoption.createdAt), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAdoption(adoption)
                            setViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {adoption.status === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => approveMutation.mutate(adoption.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => rejectMutation.mutate(adoption.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete this adoption request for ${adoption.dogName}?`)) {
                              deleteMutation.mutate(adoption.id)
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

      {/* View/Review Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adoption Request Details</DialogTitle>
            <DialogDescription>
              Review and process this adoption application
            </DialogDescription>
          </DialogHeader>
          {selectedAdoption && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Request ID</Label>
                  <div className="font-mono text-sm">{selectedAdoption.id}</div>
                </div>
                <div>
                  <Label className="text-slate-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedAdoption.status)}</div>
                </div>
                <div>
                  <Label className="text-slate-500">Dog Name</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Dog className="h-4 w-4" />
                    <span className="font-medium">{selectedAdoption.dogName}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500">Date Submitted</Label>
                  <div>{new Date(selectedAdoption.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Adopter Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-500">Name</Label>
                    <div>{selectedAdoption.adopterName || 'Not provided'}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedAdoption.adopterEmail}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedAdoption.adopterContact || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Address</Label>
                    <div>{selectedAdoption.adopterAddress || 'Not provided'}</div>
                  </div>
                </div>
              </div>

              {selectedAdoption.message && (
                <div className="border-t pt-4">
                  <Label className="text-slate-500">Adopter's Message</Label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-md text-sm">
                    {selectedAdoption.message}
                  </div>
                </div>
              )}

              {selectedAdoption.status === 'PENDING' && (
                <div className="border-t pt-4">
                  <Label className="text-slate-500">Review Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add any notes about this application..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() => approveMutation.mutate(selectedAdoption.id)}
                      disabled={approveMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve Adoption
                    </Button>
                    <Button
                      onClick={() => rejectMutation.mutate(selectedAdoption.id)}
                      disabled={rejectMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject Application
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Delete button - always visible */}
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm(`Are you sure you want to permanently delete this adoption request for ${selectedAdoption.dogName}? This action cannot be undone.`)) {
                      deleteMutation.mutate(selectedAdoption.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Adoption Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
