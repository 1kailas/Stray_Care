import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export function AdminReports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Report Management
          </CardTitle>
          <CardDescription>View and manage all dog reports</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Report management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
