import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { volunteersApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, Clock, CheckCircle, XCircle, Heart } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

export function Volunteer() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)

  // Fetch volunteers
  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => volunteersApi.getAll(),
  })

  // Register volunteer mutation
  const registerMutation = useMutation({
    mutationFn: (data: any) => volunteersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] })
      setShowRegisterDialog(false)
      toast.success('Volunteer application submitted successfully!')
    },
    onError: () => {
      toast.error('Failed to submit volunteer application')
    },
  })

  // Handle registration form submission
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      userId: user?.id,
      name: user?.name || formData.get('name'),
      email: user?.email || formData.get('email'),
      contact: formData.get('phone'),
      address: formData.get('address'),
      area: formData.get('area'),
      availability: formData.get('availability'),
      experience: formData.get('experience'),
      certifications: formData.get('certifications'),
      role: formData.get('role'),
      status: 'PENDING',
    }
    registerMutation.mutate(data)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'ACTIVE':
        return 'bg-green-100 text-green-700'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'REJECTED':
      case 'INACTIVE':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'REJECTED':
      case 'INACTIVE':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  // Check if user has already applied
  const userApplication = volunteers.find((v: any) => v.userId === user?.id || v.email === user?.email)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Users className="w-12 h-12 animate-bounce mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading volunteer information...</p>
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
            <Users className="w-8 h-8 text-primary" />
            Volunteer Portal
            {user?.role === 'ADMIN' && (
              <Badge variant="default" className="ml-2">Admin View</Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'ADMIN'
              ? 'View volunteer applications and manage volunteer team'
              : 'Join our team and make a difference in the lives of stray dogs'}
          </p>
        </div>
        {!userApplication && user?.role !== 'ADMIN' && (
          <Button onClick={() => setShowRegisterDialog(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Become a Volunteer
          </Button>
        )}
      </div>

      {/* User's Application Status */}
      {userApplication && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Application</span>
              <Badge className={getStatusColor(userApplication.status)}>
                {getStatusIcon(userApplication.status)}
                <span className="ml-1">{userApplication.status}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground">{(userApplication as any).role || 'General Volunteer'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Availability</p>
                <p className="text-sm text-muted-foreground">{userApplication.availability || 'Not specified'}</p>
              </div>
              {userApplication.status === 'APPROVED' || (userApplication as any).status === 'ACTIVE' ? (
                <>
                  <div>
                    <p className="text-sm font-medium">Tasks Completed</p>
                    <p className="text-sm text-muted-foreground">{(userApplication as any).completedCases || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Assigned Cases</p>
                    <p className="text-sm text-muted-foreground">{(userApplication as any).assignedCases?.length || 0}</p>
                  </div>
                </>
              ) : userApplication.status === 'PENDING' ? (
                <div className="col-span-2">
                  <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded">
                    ⏳ Your application is under review. We'll notify you once it's processed.
                  </p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Why Volunteer */}
      <Card>
        <CardHeader>
          <CardTitle>Why Volunteer With Us?</CardTitle>
          <CardDescription>Join a community of passionate animal lovers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Make an Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Directly help rescue and care for stray dogs in need
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Build Community</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with like-minded people who care about animals
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Flexible Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Volunteer at times that work best for you
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Roles</CardTitle>
          <CardDescription>Choose the role that matches your skills and interests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🍖 Feeder</h3>
              <p className="text-sm text-muted-foreground">
                Help feed stray dogs in your area regularly
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🚑 Rescuer</h3>
              <p className="text-sm text-muted-foreground">
                Respond to emergency rescue calls and save dogs
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">⚕️ Veterinary Support</h3>
              <p className="text-sm text-muted-foreground">
                Provide medical care and support for injured dogs
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🚗 Transport</h3>
              <p className="text-sm text-muted-foreground">
                Help transport dogs to vets and shelters
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🏠 Foster</h3>
              <p className="text-sm text-muted-foreground">
                Temporarily house dogs until they find homes
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📱 Digital Support</h3>
              <p className="text-sm text-muted-foreground">
                Help with social media, photography, and awareness
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {volunteers.filter((v: any) => v.status === 'ACTIVE' || v.status === 'APPROVED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {volunteers.filter((v: any) => v.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {volunteers.reduce((sum: number, v: any) => sum + (v.completedCases || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleRegister}>
            <DialogHeader>
              <DialogTitle>Become a Volunteer</DialogTitle>
              <DialogDescription>
                Fill in your details to join our volunteer team
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!user && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" placeholder="+1 234 567 8900" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="area">Area/Location *</Label>
                  <Input id="area" name="area" placeholder="e.g., Downtown, Suburb" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Full Address *</Label>
                <Textarea id="address" name="address" placeholder="Your complete address..." rows={2} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Preferred Role *</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FEEDER">Feeder</SelectItem>
                      <SelectItem value="RESCUER">Rescuer</SelectItem>
                      <SelectItem value="VET">Veterinary Support</SelectItem>
                      <SelectItem value="TRANSPORT">Transport</SelectItem>
                      <SelectItem value="FOSTER">Foster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="availability">Availability *</Label>
                  <Select name="availability" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekends">Weekends</SelectItem>
                      <SelectItem value="Weekdays">Weekdays</SelectItem>
                      <SelectItem value="Anytime">Anytime</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">Experience with Dogs/Animals *</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  placeholder="Tell us about your experience with dogs or animal care..."
                  rows={3}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="certifications">Certifications (Optional)</Label>
                <Input
                  id="certifications"
                  name="certifications"
                  placeholder="e.g., First Aid, Veterinary Assistant"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRegisterDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
