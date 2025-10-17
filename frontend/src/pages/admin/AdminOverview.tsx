import { useQuery } from '@tanstack/react-query'
import { 
  Users, Heart, DollarSign, AlertCircle, TrendingUp, 
  Dog, Clock, Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { dogReportsApi, adoptionsApi, volunteersApi, donationsApi } from '@/lib/api'
import { Progress } from '@/components/ui/progress'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

export function AdminOverview() {
  // Fetch all data
  const { data: reports = [] } = useQuery({
    queryKey: ['dogReports'],
    queryFn: dogReportsApi.getAll
  })

  const { data: adoptions = [] } = useQuery({
    queryKey: ['adoptions'],
    queryFn: adoptionsApi.getAll
  })

  const { data: volunteers = [] } = useQuery({
    queryKey: ['volunteers'],
    queryFn: volunteersApi.getAll
  })

  const { data: donations = [] } = useQuery({
    queryKey: ['donations'],
    queryFn: donationsApi.getAll
  })

  // Calculate statistics
  const stats = {
    reports: {
      total: reports.length,
      pending: reports.filter(r => r.status === 'PENDING').length,
      inProgress: reports.filter(r => r.status === 'IN_PROGRESS').length,
      rescued: reports.filter(r => r.status === 'RESCUED').length,
      trend: '+12%'
    },
    adoptions: {
      total: adoptions.length,
      pending: adoptions.filter(a => a.status === 'PENDING').length,
      approved: adoptions.filter(a => a.status === 'APPROVED').length,
      completed: adoptions.filter(a => a.status === 'COMPLETED').length,
      trend: '+8%'
    },
    volunteers: {
      total: volunteers.length,
      pending: volunteers.filter(v => v.status === 'PENDING').length,
      approved: volunteers.filter(v => v.status === 'APPROVED').length,
      trend: '+15%'
    },
    donations: {
      total: donations
        .filter((d: any) => d.status === 'COMPLETED')
        .reduce((sum, d) => sum + (d.amount || 0), 0),
      count: donations.filter((d: any) => d.status === 'COMPLETED').length,
      thisMonth: donations.filter((d: any) => {
        const date = new Date(d.createdAt)
        const now = new Date()
        return d.status === 'COMPLETED' && 
          date.getMonth() === now.getMonth() && 
          date.getFullYear() === now.getFullYear()
      }).reduce((sum, d) => sum + (d.amount || 0), 0),
      trend: '+23%'
    }
  }

  // Recent activities
  const recentActivities = [
    ...reports.slice(0, 3).map(r => ({
      type: 'report',
      title: `Dog report: ${r.dogName || 'Unknown dog'} (${r.location.substring(0, 30)}${r.location.length > 30 ? '...' : ''})`,
      time: r.createdAt,
      status: r.status
    })),
    ...adoptions.slice(0, 3).map(a => ({
      type: 'adoption',
      title: `Adoption request for ${a.dogName || 'a dog'}`,
      time: a.createdAt,
      status: a.status
    })),
    ...volunteers.slice(0, 2).map(v => ({
      type: 'volunteer',
      title: `Volunteer application from ${v.name}`,
      time: v.createdAt,
      status: v.status
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">
          Welcome back! Here's what's happening with Stray DogCare today.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Dog Reports Card */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Dog Reports
              </CardDescription>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {stats.reports.pending} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.reports.total}</div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{stats.reports.trend}</span>
              <span className="text-slate-500">vs last month</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">In Progress:</span>
                <span className="font-medium">{stats.reports.inProgress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Rescued:</span>
                <span className="font-medium text-green-600">{stats.reports.rescued}</span>
              </div>
            </div>
            <Link to="/admin/dog-reports">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Manage Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Adoptions Card */}
        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Adoptions
              </CardDescription>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                {stats.adoptions.pending} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.adoptions.total}</div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{stats.adoptions.trend}</span>
              <span className="text-slate-500">vs last month</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Approved:</span>
                <span className="font-medium">{stats.adoptions.approved}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Completed:</span>
                <span className="font-medium text-green-600">{stats.adoptions.completed}</span>
              </div>
            </div>
            <Link to="/admin/adoptions">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Review Requests
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Volunteers Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Volunteers
              </CardDescription>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {stats.volunteers.pending} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.volunteers.total}</div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{stats.volunteers.trend}</span>
              <span className="text-slate-500">vs last month</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Approved:</span>
                <span className="font-medium text-green-600">{stats.volunteers.approved}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Applications:</span>
                <span className="font-medium">{stats.volunteers.total}</span>
              </div>
            </div>
            <Link to="/admin/volunteers">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Manage Volunteers
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Donations Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Donations
              </CardDescription>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                This Month
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.donations.total.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{stats.donations.trend}</span>
              <span className="text-slate-500">vs last month</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">This Month:</span>
                <span className="font-medium">₹{stats.donations.thisMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Donors:</span>
                <span className="font-medium">{stats.donations.count}</span>
              </div>
            </div>
            <Link to="/admin/donations">
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Donations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/dog-reports">
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="mr-2 h-4 w-4" />
                Review Pending Reports ({stats.reports.pending})
              </Button>
            </Link>
            <Link to="/admin/adoptions">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="mr-2 h-4 w-4" />
                Process Adoption Requests ({stats.adoptions.pending})
              </Button>
            </Link>
            <Link to="/admin/volunteers">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Approve Volunteers ({stats.volunteers.pending})
              </Button>
            </Link>
            <Link to="/admin/dogs">
              <Button variant="outline" className="w-full justify-start">
                <Dog className="mr-2 h-4 w-4" />
                Add New Dog to Database
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'report' ? 'bg-orange-100' :
                      activity.type === 'adoption' ? 'bg-pink-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.type === 'report' && <AlertCircle className="h-4 w-4 text-orange-600" />}
                      {activity.type === 'adoption' && <Heart className="h-4 w-4 text-pink-600" />}
                      {activity.type === 'volunteer' && <Users className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>Overview of platform performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Response Rate</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">User Satisfaction</span>
                <span className="font-medium">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Success Rate</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
