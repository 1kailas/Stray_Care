import { useQuery } from '@tanstack/react-query'
import { dogReportsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertCircle, Heart, DollarSign, 
  CheckCircle, Clock, AlertTriangle 
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { user } = useAuthStore()
  
  const { data: reports = [] } = useQuery({
    queryKey: ['dogReports'],
    queryFn: () => dogReportsApi.getAll(),
  })

  const stats = [
    {
      title: 'Total Reports',
      value: reports.length,
      icon: AlertCircle,
      description: 'Dogs reported',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Cases',
      value: reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length,
      icon: Clock,
      description: 'In progress',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Rescued',
      value: reports.filter(r => r.status === 'RESCUED').length,
      icon: CheckCircle,
      description: 'Successfully rescued',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Critical',
      value: reports.filter(r => r.urgencyLevel === 'CRITICAL').length,
      icon: AlertTriangle,
      description: 'Urgent attention needed',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  const recentReports = reports.slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-white/90">
          Here's what's happening with stray dog rescues today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Latest dog reports from the community</CardDescription>
        </CardHeader>
        <CardContent>
          {recentReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No reports yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{report.location}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        report.status === 'ASSIGNED' ? 'bg-purple-100 text-purple-700' :
                        report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        report.status === 'RESCUED' ? 'bg-green-100 text-green-700' :
                        report.status === 'COMPLETED' ? 'bg-teal-100 text-teal-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        report.urgencyLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        report.urgencyLevel === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        report.urgencyLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {report.urgencyLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/report-dog">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Report a Dog</CardTitle>
              <CardDescription>
                Found a stray dog? Report it to our rescue team
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Card className="h-full border-dashed">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <CardTitle>Adopt a Dog</CardTitle>
            <CardDescription>
              Give a rescued dog a loving forever home
            </CardDescription>
          </CardHeader>
        </Card>

        <Link to="/donations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Support our rescue operations and care for dogs
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
