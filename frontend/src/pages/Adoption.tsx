import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adoptionsApi, api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Heart, PlusCircle, Filter, Search, Dog, Calendar, CheckCircle, Upload, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

export function Adoption() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [selectedDog, setSelectedDog] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  // Fetch adoptions
  const { data: adoptions = [], isLoading } = useQuery({
    queryKey: ['adoptions'],
    queryFn: () => adoptionsApi.getAll(),
  })

  // Add dog mutation
  const addDogMutation = useMutation({
    mutationFn: (data: any) => adoptionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adoptions'] })
      setShowAddDialog(false)
      toast.success('Dog added for adoption successfully!')
    },
    onError: () => {
      toast.error('Failed to add dog for adoption')
    },
  })

  // Request adoption mutation (updates existing adoption record with user details)
  const requestAdoptionMutation = useMutation({
    mutationFn: (data: any) => adoptionsApi.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adoptions'] })
      setShowRequestDialog(false)
      setSelectedDog(null)
      toast.success('Adoption request submitted successfully! Wait for admin approval.')
    },
    onError: () => {
      toast.error('Failed to submit adoption request')
    },
  })

  // Handle add dog form submission
  const handleAddDog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const breed = formData.get('breed') as string
    const age = formData.get('age') as string
    const description = formData.get('description') as string
    
    let imageUrl = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb'
    
    // Upload image if selected
    if (selectedImage) {
      setUploading(true)
      try {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedImage)
        
        const response = await api.post('/upload/image', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        if (response.data.success) {
          imageUrl = `http://localhost:5000${response.data.data.url}`
        }
      } catch (error) {
        console.error('Failed to upload image:', error)
        toast.error('Failed to upload image, using default')
      } finally {
        setUploading(false)
      }
    }
    
    const data = {
      dogName: formData.get('name'),
      dogDescription: `${breed}, ${age} year${parseInt(age) === 1 ? '' : 's'} old. ${description}`,
      dogPhotoUrl: imageUrl,
      status: 'APPROVED', // APPROVED status means dog is available for adoption
    }
    addDogMutation.mutate(data)
  }
  
  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Clear image selection
  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview('')
  }

  // Handle adoption request form submission
  const handleRequestAdoption = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      ...selectedDog,
      adopterName: user?.name || formData.get('name'),
      adopterEmail: user?.email || formData.get('email'),
      adopterContact: formData.get('phone'),
      adopterAddress: formData.get('address'),
      notes: formData.get('notes'),
      status: 'PENDING',
      applicationDate: new Date().toISOString(),
    }
    requestAdoptionMutation.mutate(data)
  }

  // Filter adoptions
  const filteredAdoptions = adoptions.filter((adoption: any) => {
    const matchesSearch = adoption.dogName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adoption.dogDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || adoption.status === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700'
      case 'PENDING':
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700'
      case 'REJECTED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Dog className="w-12 h-12 animate-bounce mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading adoption listings...</p>
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
            <Heart className="w-8 h-8 text-red-500" />
            Adoption Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Find your perfect companion and give them a loving home
          </p>
        </div>
        {/* Allow ALL users to add dogs for adoption */}
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Dog for Adoption
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Adopted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Dogs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adoptions.filter((a: any) => a.status === 'APPROVED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adoptions.filter((a: any) => a.status === 'PENDING' || a.status === 'UNDER_REVIEW').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successfully Adopted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adoptions.filter((a: any) => a.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adoption Listings */}
      {filteredAdoptions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Dog className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No dogs found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Check back later for available dogs'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAdoptions.map((adoption: any) => (
            <Card key={adoption.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 relative">
                {adoption.dogPhotoUrl || adoption.dogImageUrl ? (
                  <img
                    src={adoption.dogPhotoUrl || adoption.dogImageUrl}
                    alt={adoption.dogName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Dog className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                <Badge className={`absolute top-2 right-2 ${getStatusColor(adoption.status)}`}>
                  {adoption.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {adoption.dogName}
                  {adoption.status === 'COMPLETED' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </CardTitle>
                <CardDescription>
                  {adoption.dogDescription || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {adoption.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    Notes: {adoption.notes}
                  </p>
                )}
                {adoption.applicationDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="w-3 h-3" />
                    Applied: {new Date(adoption.applicationDate).toLocaleDateString()}
                  </div>
                )}
                {/* Show Request Adoption button only for APPROVED dogs without adopter info (available) */}
                {adoption.status === 'APPROVED' && user?.role !== 'ADMIN' && !adoption.adopterEmail && !adoption.adopterName && (
                  <Button
                    onClick={() => {
                      setSelectedDog(adoption)
                      setShowRequestDialog(true)
                    }}
                    className="w-full gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Request Adoption
                  </Button>
                )}
                {/* Show pending/under review status */}
                {(adoption.status === 'PENDING' || adoption.status === 'UNDER_REVIEW') && adoption.adopterEmail && (
                  <div className="space-y-2">
                    {adoption.adopterEmail === user?.email ? (
                      <div className="text-sm text-center py-2 bg-yellow-50 text-yellow-700 rounded font-medium">
                        ⏳ Your adoption request is under review
                      </div>
                    ) : (
                      <div className="text-sm text-center py-2 bg-blue-50 text-blue-700 rounded">
                        📝 Adoption application submitted
                      </div>
                    )}
                    {adoption.adopterName && (
                      <p className="text-xs text-muted-foreground text-center">
                        Applicant: {adoption.adopterName}
                      </p>
                    )}
                  </div>
                )}
                {/* Show completed status */}
                {adoption.status === 'COMPLETED' && (
                  <div className="text-sm text-center py-2 bg-green-50 text-green-700 rounded font-medium">
                    ✅ Successfully Adopted!
                  </div>
                )}
                {adoption.status === 'REJECTED' && adoption.adopterId === user?.id && (
                  <div className="text-sm text-center py-2 bg-red-50 text-red-700 rounded">
                    Application was not approved
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dog Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleAddDog}>
            <DialogHeader>
              <DialogTitle>Add Dog for Adoption</DialogTitle>
              <DialogDescription>
                Add a new dog to the adoption center
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Dog Name *</Label>
                <Input id="name" name="name" placeholder="e.g., Max" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="breed">Breed *</Label>
                  <Input id="breed" name="breed" placeholder="e.g., Golden Retriever" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age (years) *</Label>
                  <Input id="age" name="age" type="number" placeholder="2" required min="0" max="20" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dogImage">Dog Photo *</Label>
                <div className="space-y-3">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        id="dogImage"
                        name="dogImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <label htmlFor="dogImage" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload dog photo</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedImage?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about this wonderful dog..."
                  rows={4}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setShowAddDialog(false)
                clearImage()
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={addDogMutation.isPending || uploading}>
                {uploading ? 'Uploading Image...' : addDogMutation.isPending ? 'Adding...' : 'Add Dog'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Adoption Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleRequestAdoption}>
            <DialogHeader>
              <DialogTitle>Request Adoption for {selectedDog?.dogName}</DialogTitle>
              <DialogDescription>
                Fill in your details to submit an adoption request
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!user && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input id="name" name="name" placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" placeholder="+1 234 567 8900" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Your full address..."
                  rows={2}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Why do you want to adopt this dog?</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Tell us why you'd be a great match..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowRequestDialog(false)
                  setSelectedDog(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={requestAdoptionMutation.isPending}>
                {requestAdoptionMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
