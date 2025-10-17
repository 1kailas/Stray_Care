import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { donationsApi } from '@/lib/api'
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
  DollarSign, Search, Download, Eye, Calendar, CreditCard,
  TrendingUp, Users, Wallet, ArrowUpRight
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface Donation {
  id: string
  donorName?: string
  donorEmail?: string
  donorPhone?: string
  amount: number
  paymentMethod?: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  message?: string
  createdAt: string
  completedAt?: string
}

export function AdminDonations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)

  // Fetch donations
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: donationsApi.getAll
  })

  // Filter donations
  const filteredDonations = donations.filter((donation: Donation) => {
    const matchesSearch = searchTerm === '' || 
      donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalAmount = donations.reduce((sum: number, d: Donation) => 
    d.status === 'COMPLETED' ? sum + d.amount : sum, 0
  )
  
  const thisMonthAmount = donations
    .filter((d: Donation) => {
      const donationDate = new Date(d.createdAt)
      const now = new Date()
      return d.status === 'COMPLETED' && 
        donationDate.getMonth() === now.getMonth() && 
        donationDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum: number, d: Donation) => sum + d.amount, 0)

  const uniqueDonors = new Set(
    donations
      .filter((d: Donation) => d.status === 'COMPLETED')
      .map((d: Donation) => d.donorEmail)
  ).size

  const avgDonation = donations.filter((d: Donation) => d.status === 'COMPLETED').length > 0
    ? totalAmount / donations.filter((d: Donation) => d.status === 'COMPLETED').length
    : 0

  const stats = {
    total: donations.length,
    totalAmount,
    thisMonthAmount,
    uniqueDonors,
    avgDonation,
    pending: donations.filter((d: Donation) => d.status === 'PENDING').length,
    pendingAmount: donations
      .filter((d: Donation) => d.status === 'PENDING')
      .reduce((sum: number, d: Donation) => sum + d.amount, 0),
    completed: donations.filter((d: Donation) => d.status === 'COMPLETED').length,
    failed: donations.filter((d: Donation) => d.status === 'FAILED').length
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      PENDING: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      COMPLETED: { variant: 'default', className: 'bg-green-100 text-green-700 border-green-200' },
      FAILED: { variant: 'destructive', className: 'bg-red-100 text-red-700 border-red-200' }
    }
    const config = variants[status] || variants.PENDING
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Donor Name', 'Email', 'Phone', 'Amount', 'Payment Method', 'Status', 'Date', 'Message'],
      ...filteredDonations.map((d: Donation) => [
        d.id,
        d.donorName || '',
        d.donorEmail || '',
        d.donorPhone || '',
        d.amount,
        d.paymentMethod || '',
        d.status,
        new Date(d.createdAt).toLocaleDateString(),
        d.message || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Donations exported successfully')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Donations Management</h1>
        <p className="text-slate-500 mt-1">
          Track and manage all donations and financial contributions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">
                ₹{stats.totalAmount.toLocaleString()}
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              All time donations
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">
                ₹{stats.thisMonthAmount.toLocaleString()}
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              Current month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Unique Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.uniqueDonors}</div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Total contributors</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Average Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">
                ₹{Math.round(stats.avgDonation).toLocaleString()}
              </div>
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Per donation</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <p className="text-xs text-slate-500 mt-1">Successful donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              ₹{stats.pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">{stats.pending} pending transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.failed}</div>
            <p className="text-xs text-slate-500 mt-1">Failed transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Donations</CardTitle>
          <CardDescription>Search and filter donation records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by donor name or email..."
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
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Donations ({filteredDonations.length})</CardTitle>
          <CardDescription>Complete donation transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500">
                      No donations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonations.map((donation: Donation) => (
                    <TableRow key={donation.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        {donation.donorName || 'Anonymous'}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {donation.donorEmail || 'N/A'}
                      </TableCell>
                      <TableCell className="font-bold text-green-700">
                        ₹{donation.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <CreditCard className="h-3 w-3" />
                          {donation.paymentMethod || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDonation(donation)
                              setViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>Complete donation transaction information</DialogDescription>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Donor Name</label>
                  <p className="text-slate-900">{selectedDonation.donorName || 'Anonymous'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Amount</label>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{selectedDonation.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-900">{selectedDonation.donorEmail || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <p className="text-slate-900">{selectedDonation.donorPhone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Payment Method</label>
                  <p className="text-slate-900">{selectedDonation.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDonation.status)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Donation Date</label>
                <p className="text-slate-900 mt-1">
                  {new Date(selectedDonation.createdAt).toLocaleString()} 
                  {' '}({formatDistanceToNow(new Date(selectedDonation.createdAt), { addSuffix: true })})
                </p>
              </div>

              {selectedDonation.completedAt && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Completed At</label>
                  <p className="text-slate-900 mt-1">
                    {new Date(selectedDonation.completedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedDonation.message && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Message</label>
                  <p className="text-slate-900 mt-1 p-3 bg-slate-50 rounded-lg">
                    {selectedDonation.message}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-slate-700">Transaction ID</label>
                <p className="text-slate-900 mt-1 font-mono text-sm">{selectedDonation.id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
