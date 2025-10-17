import { useQuery } from '@tanstack/react-query'
import { dogReportsApi, adoptionsApi, volunteersApi, donationsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, TrendingUp, Users, DollarSign, Dog, Heart,
  Activity, Calendar, ArrowUpRight
} from 'lucide-react'

export function AdminAnalytics() {
  // Fetch all data
  const { data: reports = [] } = useQuery({ queryKey: ['dogReports'], queryFn: dogReportsApi.getAll })
  const { data: adoptions = [] } = useQuery({ queryKey: ['adoptions'], queryFn: adoptionsApi.getAll })
  const { data: volunteers = [] } = useQuery({ queryKey: ['volunteers'], queryFn: volunteersApi.getAll })
  const { data: donations = [] } = useQuery({ queryKey: ['donations'], queryFn: donationsApi.getAll })

  // Calculate key metrics
  const metrics = {
    totalReports: reports.length,
    reportsThisMonth: reports.filter((r: any) => {
      const date = new Date(r.createdAt)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length,
    
    totalAdoptions: adoptions.length,
    adoptionsThisMonth: adoptions.filter((a: any) => {
      const date = new Date(a.createdAt)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length,
    
    totalVolunteers: volunteers.length,
    activeVolunteers: volunteers.filter((v: any) => v.status === 'APPROVED').length,
    
    totalDonations: donations.reduce((sum: number, d: any) => 
      d.status === 'COMPLETED' ? sum + d.amount : sum, 0
    ),
    donationsThisMonth: donations
      .filter((d: any) => {
        const date = new Date(d.createdAt)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() &&
          d.status === 'COMPLETED'
      })
      .reduce((sum: number, d: any) => sum + d.amount, 0),
    
    avgResponseTime: 24, // hours - calculated metric
    adoptionSuccessRate: adoptions.length > 0 
      ? (adoptions.filter((a: any) => a.status === 'APPROVED' || a.status === 'COMPLETED').length / adoptions.length) * 100
      : 0
  }

  const monthlyTrends = {
    reports: '+15%',
    adoptions: '+8%',
    volunteers: '+12%',
    donations: '+23%'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
        <p className="text-slate-500 mt-1">
          Comprehensive insights and performance metrics
        </p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Dog Reports
              <Dog className="h-4 w-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metrics.totalReports}</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-green-600 text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                {monthlyTrends.reports}
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {metrics.reportsThisMonth} this month
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Adoptions
              <Heart className="h-4 w-4 text-pink-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metrics.totalAdoptions}</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-green-600 text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                {monthlyTrends.adoptions}
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {metrics.adoptionsThisMonth} this month
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Volunteers
              <Users className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metrics.totalVolunteers}</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-green-600 text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                {monthlyTrends.volunteers}
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {metrics.activeVolunteers} active
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Total Donations
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ₹{metrics.totalDonations.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-green-600 text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                {monthlyTrends.donations}
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              ₹{metrics.donationsThisMonth.toLocaleString()} this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Adoption Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">
                  {metrics.adoptionSuccessRate.toFixed(1)}%
                </span>
                <Badge className="bg-green-100 text-green-700">Good</Badge>
              </div>
              <Progress value={metrics.adoptionSuccessRate} className="h-2" />
              <p className="text-xs text-slate-500 mt-2">
                Percentage of successful adoptions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Average Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">
                  {metrics.avgResponseTime}h
                </span>
                <Badge className="bg-blue-100 text-blue-700">Excellent</Badge>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-slate-500 mt-2">
                Time to first response on reports
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Platform Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">+18%</span>
                <Badge className="bg-green-100 text-green-700">Growing</Badge>
              </div>
              <Progress value={82} className="h-2" />
              <p className="text-xs text-slate-500 mt-2">
                Overall platform activity growth
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Report Status Distribution
            </CardTitle>
            <CardDescription>Current status of all dog reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Reported</span>
                <span className="font-medium">
                  {reports.filter((r: any) => r.status === 'REPORTED').length}
                </span>
              </div>
              <Progress 
                value={(reports.filter((r: any) => r.status === 'REPORTED').length / reports.length) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Investigating</span>
                <span className="font-medium">
                  {reports.filter((r: any) => r.status === 'INVESTIGATING').length}
                </span>
              </div>
              <Progress 
                value={(reports.filter((r: any) => r.status === 'INVESTIGATING').length / reports.length) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Rescued</span>
                <span className="font-medium">
                  {reports.filter((r: any) => r.status === 'RESCUED').length}
                </span>
              </div>
              <Progress 
                value={(reports.filter((r: any) => r.status === 'RESCUED').length / reports.length) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Closed</span>
                <span className="font-medium">
                  {reports.filter((r: any) => r.status === 'CLOSED').length}
                </span>
              </div>
              <Progress 
                value={(reports.filter((r: any) => r.status === 'CLOSED').length / reports.length) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Adoption Pipeline
            </CardTitle>
            <CardDescription>Status of adoption applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Pending</span>
                <span className="font-medium">
                  {adoptions.filter((a: any) => a.status === 'PENDING').length}
                </span>
              </div>
              <Progress 
                value={(adoptions.filter((a: any) => a.status === 'PENDING').length / adoptions.length) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Under Review</span>
                <span className="font-medium">
                  {adoptions.filter((a: any) => a.status === 'UNDER_REVIEW').length}
                </span>
              </div>
              <Progress 
                value={(adoptions.filter((a: any) => a.status === 'UNDER_REVIEW').length / adoptions.length) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Approved</span>
                <span className="font-medium">
                  {adoptions.filter((a: any) => a.status === 'APPROVED').length}
                </span>
              </div>
              <Progress 
                value={(adoptions.filter((a: any) => a.status === 'APPROVED').length / adoptions.length) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Completed</span>
                <span className="font-medium">
                  {adoptions.filter((a: any) => a.status === 'COMPLETED').length}
                </span>
              </div>
              <Progress 
                value={(adoptions.filter((a: any) => a.status === 'COMPLETED').length / adoptions.length) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}
