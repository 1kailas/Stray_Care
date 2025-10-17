import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell } from 'lucide-react'

export function Notifications() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Your Updates
          </CardTitle>
          <CardDescription>Stay informed about rescue activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No new notifications</p>
        </CardContent>
      </Card>
    </div>
  )
}
