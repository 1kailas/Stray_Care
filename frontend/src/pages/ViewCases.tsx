import { useQuery } from '@tanstack/react-query'
import { dogReportsApi } from '@/lib/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Search, Filter } from 'lucide-react'
import { useState } from 'react'

export function ViewCases() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['dogReports'],
    queryFn: () => dogReportsApi.getAll(),
  })

  const filteredReports = reports.filter((report: any) =>
    report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">View Cases</h1>
          <p className="text-muted-foreground mt-1">
            Browse all reported stray dog cases
          </p>
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by location or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading cases...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report: any) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">{report.location}</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          report.status === 'RESCUED' ? 'default' :
                          report.status === 'INVESTIGATING' ? 'secondary' :
                          'outline'
                        }
                      >
                        {report.status}
                      </Badge>
                      <Badge
                        variant={
                          report.urgencyLevel === 'CRITICAL' || report.urgencyLevel === 'HIGH' 
                            ? 'destructive' 
                            : 'outline'
                        }
                      >
                        {report.urgencyLevel}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
