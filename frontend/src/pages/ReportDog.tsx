import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Check } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dogReportsApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { MapLocationPicker } from '@/components/MapLocationPicker'

export function ReportDog() {
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address?: string
  } | null>(null)
  
  const queryClient = useQueryClient()

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: (data: any) => dogReportsApi.create(data),
    onSuccess: () => {
      // Invalidate queries to refresh dashboard immediately
      queryClient.invalidateQueries({ queryKey: ['dogReports'] })
      queryClient.invalidateQueries({ queryKey: ['dog-reports'] })
      toast.success('Dog reported successfully!')
      setIsSubmitting(false)
    },
    onError: (error: any) => {
      console.error('Error creating report:', error)
      toast.error(error.response?.data?.message || 'Failed to report dog. Please try again.')
      setIsSubmitting(false)
    },
  })
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to report a dog')
      return
    }
    
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    const reportData: any = {
      dogName: formData.get('dogName') || 'Unknown',
      description: formData.get('description'),
      condition: formData.get('condition'),
      location: selectedLocation?.address || formData.get('location'),
      priority: parseInt(formData.get('priority') as string) || 3,
      reporterName: user.name,
      reporterContact: formData.get('reporterContact') || user.email,
    }
    
    // Add coordinates if location was selected from map
    if (selectedLocation) {
      reportData.coordinates = {
        type: 'Point',
        coordinates: [selectedLocation.lng, selectedLocation.lat]
      }
    }
    
    createReportMutation.mutate(reportData)
    
    // Reset form and location
    e.currentTarget.reset()
    setSelectedLocation(null)
  }

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setSelectedLocation({ lat, lng, address })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Report a Stray Dog</h1>
        <p className="text-muted-foreground mt-1">
          Help us rescue a dog by providing detailed information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Report Details
          </CardTitle>
          <CardDescription>
            Please provide accurate information to help us locate and rescue the dog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dogName">Dog Name (Optional)</Label>
              <Input
                id="dogName"
                name="dogName"
                placeholder="e.g., Buddy (if known)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter address or use map picker"
                  value={selectedLocation?.address || ''}
                  onChange={(e) => {
                    if (!selectedLocation) {
                      // Allow manual input if no map selection
                      e.target.value = e.target.value
                    }
                  }}
                  required={!selectedLocation}
                  className={selectedLocation ? 'bg-green-50 border-green-500' : ''}
                />
                <MapLocationPicker onLocationSelect={handleLocationSelect} />
              </div>
              {selectedLocation && (
                <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
                  <Check className="w-3 h-3" />
                  <span>
                    Location pinned: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Click "Pick Location" to select exact location on map, or type address manually
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Dog Condition *</Label>
              <select
                id="condition"
                name="condition"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="HEALTHY">Healthy</option>
                <option value="INJURED">Injured</option>
                <option value="SICK">Sick</option>
                <option value="MALNOURISHED">Malnourished</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level *</Label>
              <select
                id="priority"
                name="priority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="3"
                required
              >
                <option value="5">5 - Low</option>
                <option value="4">4 - Medium</option>
                <option value="3">3 - Normal</option>
                <option value="2">2 - High</option>
                <option value="1">1 - Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reporterContact">Your Contact (Optional)</Label>
              <Input
                id="reporterContact"
                name="reporterContact"
                type="tel"
                placeholder="Phone number for updates"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the dog's appearance, behavior, and surroundings in detail..."
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !user}>
              {isSubmitting ? 'Submitting...' : user ? 'Submit Report' : 'Please Login to Report'}
            </Button>
            
            {!user && (
              <p className="text-sm text-center text-muted-foreground">
                You need to be logged in to report a stray dog
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
