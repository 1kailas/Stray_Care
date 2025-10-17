import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Map } from 'lucide-react'

export function MapView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Interactive Map</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Dog Reports Map
          </CardTitle>
          <CardDescription>View all reported dogs on an interactive map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map integration coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
