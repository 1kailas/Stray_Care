import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adoptionsApi, volunteersApi, donationsApi, dogReportsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/store/auth'
import { 
  Shield, Users, Heart, DollarSign, Dog, 
  CheckCircle, XCircle, Clock, TrendingUp, AlertCircle 
} from 'lucide-react'
import { toast } from 'sonner'

export function AdminDashboard() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  // Check if user is admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Only administrators can access this page.</p>
        </div>
      </div>
    )
  }

  // Fetch all data
  const { data: adoptions = [] } = useQuery({
    queryKey: ['adoptions'],
    queryFn: () => adoptionsApi.getAll(),
  })

  const { data: volunteers = [] } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => volunteersApi.getAll(),
  })

  const { data: donations = [] } = useQuery({
    queryKey: ['donations'],
    queryFn: () => donationsApi.getAll(),
  })

  const { data: dogReports = [] } = useQuery({
    queryKey: ['dogReports'],
    queryFn: () => dogReportsApi.getAll(),
  })

  // Mutations
  const approveVolunteerMutation = useMutation({
    mutationFn: (id: string) => volunteersApi.updateStatus(id, 'APPROVED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] })
      toast.success('Volunteer approved successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to approve volunteer')
    },
  })

  const rejectVolunteerMutation = useMutation({
    mutationFn: (id: string) => volunteersApi.updateStatus(id, 'REJECTED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] })
      toast.success('Volunteer application rejected')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reject volunteer')
    },
  })

  const approveAdoptionMutation = useMutation({
    mutationFn: (id: string) => adoptionsApi.updateStatus(id, 'APPROVED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adoptions'] })
      toast.success('Adoption request approved!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to approve adoption')
    },
  })

  const rejectAdoptionMutation = useMutation({
    mutationFn: (id: string) => adoptionsApi.updateStatus(id, 'REJECTED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adoptions'] })
      toast.success('Adoption request rejected')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reject adoption')
    },
  })

  const updateReportStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      dogReportsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogReports'] })
      toast.success('Report status updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update report status')
    },
  })

  // Calculate stats
  const pendingAdoptions = adoptions.filter((a: any) => a.status === 'PENDING')
  const pendingVolunteers = volunteers.filter((v: any) => v.status === 'PENDING')
  const activeReports = dogReports.filter((r: any) => r.status === 'INVESTIGATING' || r.status === 'REPORTED')
  const totalDonations = donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and oversee all platform activities
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Dog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dogReports.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeReports.length} active cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {donations.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers.length}</div>
            <p className="text-xs text-muted-foreground">
              {volunteers.filter((v: any) => v.status === 'ACTIVE' || v.status === 'APPROVED').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adoptions</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adoptions.length}</div>
            <p className="text-xs text-muted-foreground">
              {adoptions.filter((a: any) => a.status === 'ADOPTED' || a.status === 'COMPLETED').length} successful
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Adoptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pendingAdoptions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires review</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Volunteers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{pendingVolunteers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Applications to review</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Critical Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {dogReports.filter((r: any) => r.urgencyLevel === 'CRITICAL').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Urgent attention needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      <Tabs defaultValue="adoptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="adoptions">
            Pending Adoptions ({pendingAdoptions.length})
          </TabsTrigger>
          <TabsTrigger value="volunteers">
            Pending Volunteers ({pendingVolunteers.length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            Dog Reports ({activeReports.length})
          </TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="adoptions">
          <Card>
            <CardHeader>
              <CardTitle>Adoption Requests Awaiting Approval</CardTitle>
              <CardDescription>Review and approve or reject adoption applications</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingAdoptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pending adoption requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAdoptions.map((adoption: any) => (
                    <div
                      key={adoption.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{adoption.dogName}</h4>
                          <Badge variant="outline">{adoption.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Requested by: {adoption.adopterName || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Contact: {adoption.adopterContact} • {adoption.adopterEmail}
                        </p>
                        {adoption.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            "{adoption.notes}"
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveAdoptionMutation.mutate(adoption.id)}
                          disabled={approveAdoptionMutation.isPending}
                          className="gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectAdoptionMutation.mutate(adoption.id)}
                          disabled={rejectAdoptionMutation.isPending}
                          className="gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Applications Awaiting Approval</CardTitle>
              <CardDescription>Review and approve or reject volunteer applications</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingVolunteers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pending volunteer applications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVolunteers.map((volunteer: any) => (
                    <div
                      key={volunteer.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{volunteer.name}</h4>
                          <Badge variant="outline">{volunteer.role || 'Volunteer'}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Contact: {volunteer.contact || volunteer.phoneNumber} • {volunteer.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Area: {volunteer.area || 'Not specified'} • Availability: {volunteer.availability || 'Not specified'}
                        </p>
                        {volunteer.experience && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Experience: {volunteer.experience}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveVolunteerMutation.mutate(volunteer.id)}
                          disabled={approveVolunteerMutation.isPending}
                          className="gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectVolunteerMutation.mutate(volunteer.id)}
                          disabled={rejectVolunteerMutation.isPending}
                          className="gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Dog Reports Management</CardTitle>
              <CardDescription>Update status and manage reported stray dog cases</CardDescription>
            </CardHeader>
            <CardContent>
              {dogReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dog className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No dog reports found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dogReports.map((report: any) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'REPORTED':
                          return 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        case 'INVESTIGATING':
                          return 'bg-blue-100 text-blue-800 border-blue-300'
                        case 'RESCUED':
                          return 'bg-green-100 text-green-800 border-green-300'
                        case 'CLOSED':
                          return 'bg-gray-100 text-gray-800 border-gray-300'
                        default:
                          return 'bg-gray-100 text-gray-800 border-gray-300'
                      }
                    }

                    return (
                      <div
                        key={report.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{report.dogName || 'Unnamed Dog'}</h4>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            {report.urgencyLevel === 'CRITICAL' && (
                              <Badge variant="destructive">Critical</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <strong>Location:</strong> {report.location || 'Unknown'}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            <strong>Condition:</strong> {report.condition || 'Not specified'}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            <strong>Reported by:</strong> {report.reporterName || 'Anonymous'}
                          </p>
                          {report.reporterContact && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Contact:</strong> {report.reporterContact}
                            </p>
                          )}
                          {report.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              "{report.description}"
                            </p>
                          )}
                        </div>
                        <div className="ml-4 min-w-[180px]">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Update Status
                          </label>
                          <Select
                            value={report.status}
                            onValueChange={(status) =>
                              updateReportStatusMutation.mutate({ id: report.id, status })
                            }
                            disabled={updateReportStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="REPORTED">Reported</SelectItem>
                              <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                              <SelectItem value="RESCUED">Rescued</SelectItem>
                              <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reported</span>
                    <span className="font-bold">
                      {dogReports.filter((r: any) => r.status === 'REPORTED').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Investigating</span>
                    <span className="font-bold">
                      {dogReports.filter((r: any) => r.status === 'INVESTIGATING').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rescued</span>
                    <span className="font-bold text-green-600">
                      {dogReports.filter((r: any) => r.status === 'RESCUED').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Closed</span>
                    <span className="font-bold">
                      {dogReports.filter((r: any) => r.status === 'CLOSED').length}
                    </span>
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adoption Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available</span>
                    <span className="font-bold">
                      {adoptions.filter((a: any) => a.status === 'AVAILABLE').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Review</span>
                    <span className="font-bold text-orange-600">
                      {adoptions.filter((a: any) => a.status === 'PENDING' || a.status === 'UNDER_REVIEW').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Approved</span>
                    <span className="font-bold text-green-600">
                      {adoptions.filter((a: any) => a.status === 'APPROVED').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-bold text-blue-600">
                      {adoptions.filter((a: any) => a.status === 'COMPLETED' || a.status === 'ADOPTED').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volunteer Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending</span>
                    <span className="font-bold text-orange-600">
                      {volunteers.filter((v: any) => v.status === 'PENDING').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active</span>
                    <span className="font-bold text-green-600">
                      {volunteers.filter((v: any) => v.status === 'ACTIVE' || v.status === 'APPROVED').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tasks Completed</span>
                    <span className="font-bold">
                      {volunteers.reduce((sum: number, v: any) => sum + (v.completedCases || 0), 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Amount</span>
                    <span className="font-bold text-green-600">
                      ₹{totalDonations.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Donors</span>
                    <span className="font-bold">{donations.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Donation</span>
                    <span className="font-bold">
                      ₹{donations.length > 0 ? Math.round(totalDonations / donations.length) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start gap-2">
              <Dog className="w-4 h-4" />
              View All Reports
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Heart className="w-4 h-4" />
              Manage Adoptions
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Users className="w-4 h-4" />
              Manage Volunteers
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <TrendingUp className="w-4 h-4" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
