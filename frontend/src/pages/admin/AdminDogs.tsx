import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dogsApi, Dog } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { 
  Dog as DogIcon, Search, Download, Plus, Edit, Trash2, Eye,
  Activity, Heart, TrendingUp, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export function AdminDogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: 0,
    gender: 'MALE',
    size: 'MEDIUM',
    description: '',
    healthStatus: '',
    vaccinated: false,
    neutered: false,
    temperament: '',
    goodWithKids: false,
    goodWithPets: false,
    specialNeeds: '',
    status: 'AVAILABLE'
  })

  const queryClient = useQueryClient()

  // Fetch dogs
  const { data: dogs = [], isLoading } = useQuery({
    queryKey: ['admin-dogs'],
    queryFn: dogsApi.getAll
  })

  // Add dog mutation
  const addMutation = useMutation({
    mutationFn: (data: any) => dogsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dogs'] })
      toast.success('Dog record added successfully')
      setAddDialogOpen(false)
      setFormData({ 
        name: '', breed: '', age: 0, gender: 'MALE', size: 'MEDIUM', 
        description: '', healthStatus: '', vaccinated: false, neutered: false,
        temperament: '', goodWithKids: false, goodWithPets: false,
        specialNeeds: '', status: 'AVAILABLE'
      })
    },
    onError: () => {
      toast.error('Failed to add dog record')
    }
  })

  // Update dog mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dogsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dogs'] })
      toast.success('Dog record updated successfully')
      setEditDialogOpen(false)
    },
    onError: () => {
      toast.error('Failed to update dog record')
    }
  })

  // Delete dog mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => dogsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dogs'] })
      toast.success('Dog record deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete dog record')
    }
  })

  // Filter dogs
  const filteredDogs = dogs.filter((dog: Dog) => {
    const matchesSearch = searchTerm === '' || 
      dog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.temperament?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || dog.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = {
    total: dogs?.length || 0,
    available: dogs?.filter((d: Dog) => d.status === 'AVAILABLE').length || 0,
    pending: dogs?.filter((d: Dog) => d.status === 'PENDING').length || 0,
    adopted: dogs?.filter((d: Dog) => d.status === 'ADOPTED').length || 0,
    vaccinated: dogs?.filter((d: Dog) => d.vaccinated).length || 0,
    neutered: dogs?.filter((d: Dog) => d.neutered).length || 0,
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      AVAILABLE: { variant: 'secondary', className: 'bg-green-100 text-green-700 border-green-200' },
      PENDING: { variant: 'default', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      ADOPTED: { variant: 'default', className: 'bg-blue-100 text-blue-700 border-blue-200' }
    }
    const config = variants[status] || variants.AVAILABLE
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>
  }
  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Breed', 'Age', 'Gender', 'Size', 'Status', 'Temperament', 'Vaccinated', 'Neutered', 'Date'],
      ...filteredDogs.map((d: Dog) => [
        d.id,
        d.name || '',
        d.breed || '',
        d.age || '',
        d.gender || '',
        d.size || '',
        d.status,
        d.temperament || '',
        d.vaccinated ? 'Yes' : 'No',
        d.neutered ? 'Yes' : 'No',
        d.addedDate ? new Date(d.addedDate).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dogs-database-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Dogs database exported successfully')
  }

  const handleEdit = (dog: Dog) => {
    setSelectedDog(dog)
    setFormData({
      name: dog.name,
      breed: dog.breed,
      age: dog.age,
      gender: dog.gender,
      size: dog.size,
      description: dog.description,
      healthStatus: dog.healthStatus || '',
      vaccinated: dog.vaccinated,
      neutered: dog.neutered,
      temperament: dog.temperament || '',
      goodWithKids: dog.goodWithKids || false,
      goodWithPets: dog.goodWithPets || false,
      specialNeeds: dog.specialNeeds || '',
      status: dog.status
    })
    setEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (selectedDog) {
      updateMutation.mutate({ id: selectedDog.id, data: formData })
    }
  }

  const handleAdd = () => {
    addMutation.mutate(formData)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dogs Database</h1>
          <p className="text-slate-500 mt-1">
            Comprehensive database of all dog reports and rescues
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Dogs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <DogIcon className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.available}</div>
              <Activity className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.pending}</div>
              <AlertCircle className="h-6 w-6 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Adopted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.adopted}</div>
              <Heart className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Vaccinated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.vaccinated}</div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Neutered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-900">{stats.neutered}</div>
              <Heart className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Dogs</CardTitle>
          <CardDescription>Search and filter dog records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by location or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="REPORTED">Reported</SelectItem>
                <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                <SelectItem value="RESCUED">Rescued</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dogs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Dogs ({filteredDogs.length})</CardTitle>
          <CardDescription>Comprehensive dog records database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Temperament</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500">
                      No dog records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDogs.map((dog) => (
                    <TableRow key={dog.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="font-medium">{dog.name}</div>
                      </TableCell>
                      <TableCell>{dog.breed}</TableCell>
                      <TableCell>{dog.age} months</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-slate-400" />
                          {dog.temperament || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(dog.status)}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {dog.addedDate ? formatDistanceToNow(new Date(dog.addedDate), { addSuffix: true }) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDog(dog)
                              setViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(dog)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this record?')) {
                                deleteMutation.mutate(dog.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dog Record Details</DialogTitle>
            <DialogDescription>Complete information about this dog</DialogDescription>
          </DialogHeader>
          {selectedDog && (
            <div className="space-y-4">
              {selectedDog.photos && selectedDog.photos.length > 0 && (
                <div>
                  <img 
                    src={selectedDog.photos[0]} 
                    alt={selectedDog.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <p className="text-slate-900">{selectedDog.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Breed</label>
                  <p className="text-slate-900">{selectedDog.breed}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Age</label>
                  <p className="text-slate-900">{selectedDog.age} months</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Gender</label>
                  <p className="text-slate-900">{selectedDog.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Size</label>
                  <p className="text-slate-900">{selectedDog.size}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Temperament</label>
                  <p className="text-slate-900">{selectedDog.temperament || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDog.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Vaccinated</label>
                  <p className="text-slate-900">{selectedDog.vaccinated ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Neutered</label>
                  <p className="text-slate-900">{selectedDog.neutered ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Good with Kids</label>
                  <p className="text-slate-900">{selectedDog.goodWithKids ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Good with Pets</label>
                  <p className="text-slate-900">{selectedDog.goodWithPets ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <p className="text-slate-900 mt-1">{selectedDog.description}</p>
              </div>
              {selectedDog.healthStatus && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Health Status</label>
                  <p className="text-slate-900 mt-1">{selectedDog.healthStatus}</p>
                </div>
              )}
              {selectedDog.specialNeeds && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Special Needs</label>
                  <p className="text-slate-900 mt-1">{selectedDog.specialNeeds}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Dog Record</DialogTitle>
            <DialogDescription>Update dog record information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Breed</label>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Enter breed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Age</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Size</label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => setFormData({ ...formData, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMALL">Small</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LARGE">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Temperament</label>
                <Input
                  value={formData.temperament}
                  onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                  placeholder="e.g. Friendly, Calm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ADOPTED">Adopted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Health Status</label>
              <Textarea
                value={formData.healthStatus}
                onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                placeholder="Enter health status and medical history"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Special Needs</label>
              <Textarea
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                placeholder="Enter any special needs"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog - Same form as Edit */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Dog Record</DialogTitle>
            <DialogDescription>Create a new dog record in the database</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Breed</label>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Enter breed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Age (months)</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  placeholder="Enter age in months"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Size</label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => setFormData({ ...formData, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMALL">Small</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LARGE">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Temperament</label>
                <Input
                  value={formData.temperament}
                  onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                  placeholder="e.g. Friendly, Calm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ADOPTED">Adopted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Health Status</label>
              <Textarea
                value={formData.healthStatus}
                onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                placeholder="Enter health status and medical history"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Special Needs</label>
              <Textarea
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                placeholder="Enter any special needs"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
