import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export function Education() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Education & Awareness</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Learn About Dog Care
          </CardTitle>
          <CardDescription>Resources and guides for dog welfare</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Educational content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
