import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vaccinationsApi, dogReportsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Syringe, PlusCircle, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

const VACCINE_TYPES = [
  'Rabies',
  'Distemper',
  'Parvovirus',
  'Hepatitis',
  'Leptospirosis',
  'Bordetella',
  'Influenza',
  'Coronavirus',
]

export function Vaccination() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Fetch vaccinations
  const { data: vaccinations = [], isLoading } = useQuery({
    queryKey: ['vaccinations'],
    queryFn: () => vaccinationsApi.getAll(),
  })

  // Fetch dog reports for selection
  const { data: dogReports = [] } = useQuery({
    queryKey: ['dogReports'],
    queryFn: () => dogReportsApi.getAll(),
  })

  // Add vaccination mutation
  const addVaccinationMutation = useMutation({
    mutationFn: (data: any) => vaccinationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations'] })
      setShowAddDialog(false)
      toast.success('Vaccination record added successfully!')
    },
    onError: () => {
      toast.error('Failed to add vaccination record')
    },
  })

  // Handle add vaccination
  const handleAddVaccination = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const vaccinationDate = new Date(formData.get('vaccinationDate') as string)
    const nextDueDate = new Date(vaccinationDate)
    nextDueDate.setMonth(nextDueDate.getMonth() + 12) // Default: 1 year

    const selectedDogId = formData.get('dogReportId') as string
    const selectedDog = dogReports.find((d: any) => d.id === selectedDogId)

    const data = {
      dogReportId: selectedDogId,
      dogName: selectedDog?.location || 'Unknown',
      vaccineType: formData.get('vaccineType'),
      vaccinationDate: vaccinationDate.toISOString(),
      nextDueDate: nextDueDate.toISOString(),
      veterinarianName: formData.get('veterinarianName'),
      notes: formData.get('notes'),
    }
    addVaccinationMutation.mutate(data)
  }

  // Check if vaccination is due
  const isDue = (nextDueDate: string) => {
    const due = new Date(nextDueDate)
    const now = new Date()
    const daysUntilDue = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDue
  }

  const getStatusBadge = (nextDueDate: string) => {
    const days = isDue(nextDueDate)
    if (days < 0) {
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Overdue</Badge>
    } else if (days <= 30) {
      return <Badge variant="outline" className="gap-1 border-orange-500 text-orange-700"><Clock className="w-3 h-3" />Due Soon</Badge>
    } else {
      return <Badge variant="outline" className="gap-1 border-green-500 text-green-700"><CheckCircle className="w-3 h-3" />Up to Date</Badge>
    }
  }

  // Calculate stats
  const overdue = vaccinations.filter((v: any) => isDue(v.nextDueDate) < 0).length
  const dueSoon = vaccinations.filter((v: any) => {
    const days = isDue(v.nextDueDate)
    return days >= 0 && days <= 30
  }).length
  const upToDate = vaccinations.filter((v: any) => isDue(v.nextDueDate) > 30).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Syringe className="w-12 h-12 animate-bounce mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading vaccination records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Syringe className="w-8 h-8 text-primary" />
            Vaccination Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage vaccination schedules for rescued dogs
          </p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'VOLUNTEER') && (
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Vaccination Record
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vaccinations.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Up to Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{upToDate}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Due Soon (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{dueSoon}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Vaccination Records */}
      {vaccinations.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Syringe className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No vaccination records yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking vaccinations to ensure all dogs are protected
            </p>
            {(user?.role === 'ADMIN' || user?.role === 'VOLUNTEER') && (
              <Button onClick={() => setShowAddDialog(true)}>Add First Record</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vaccinations.map((vaccination: any) => (
            <Card key={vaccination.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{vaccination.dogName}</CardTitle>
                    <CardDescription>
                      <span className="font-medium">{vaccination.vaccineType}</span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(vaccination.nextDueDate)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vaccinated On</p>
                    <p className="font-medium">
                      {new Date(vaccination.vaccinationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Due</p>
                    <p className="font-medium">
                      {new Date(vaccination.nextDueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {vaccination.veterinarianName && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Veterinarian</p>
                    <p className="font-medium">{vaccination.veterinarianName}</p>
                  </div>
                )}
                {vaccination.notes && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Notes</p>
                    <p className="text-sm line-clamp-2">{vaccination.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Vaccination Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleAddVaccination}>
            <DialogHeader>
              <DialogTitle>Add Vaccination Record</DialogTitle>
              <DialogDescription>
                Record a new vaccination for a dog
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dogReportId">Select Dog *</Label>
                <Select name="dogReportId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a dog" />
                  </SelectTrigger>
                  <SelectContent>
                    {dogReports.map((dog: any) => (
                      <SelectItem key={dog.id} value={dog.id}>
                        {dog.location} - {dog.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vaccineType">Vaccine Type *</Label>
                  <Select name="vaccineType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                      {VACCINE_TYPES.map((vaccine) => (
                        <SelectItem key={vaccine} value={vaccine}>
                          {vaccine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vaccinationDate">Vaccination Date *</Label>
                  <Input
                    id="vaccinationDate"
                    name="vaccinationDate"
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="veterinarianName">Veterinarian Name *</Label>
                <Input
                  id="veterinarianName"
                  name="veterinarianName"
                  placeholder="Dr. Smith"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addVaccinationMutation.isPending}>
                {addVaccinationMutation.isPending ? 'Adding...' : 'Add Record'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
