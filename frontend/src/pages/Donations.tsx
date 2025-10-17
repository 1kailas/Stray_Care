import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { donationsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Heart, TrendingUp, Users, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

const DONATION_AMOUNTS = [100, 500, 1000, 2500, 5000]

export function Donations() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showDonateDialog, setShowDonateDialog] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  // Fetch donations
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: () => donationsApi.getAll(),
  })

  // Create donation mutation
  const donateMutation = useMutation({
    mutationFn: (data: any) => donationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
      queryClient.invalidateQueries({ queryKey: ['donations-total'] })
      setShowDonateDialog(false)
      setSelectedAmount(null)
      setCustomAmount('')
      toast.success('Thank you for your generous donation!')
    },
    onError: () => {
      toast.error('Failed to process donation')
    },
  })

  // Handle donation form submission
  const handleDonate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const amount = selectedAmount || parseFloat(customAmount)
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount')
      return
    }

    const data = {
      amount,
      currency: 'INR',
      donorName: user?.name || formData.get('name'),
      donorEmail: user?.email || formData.get('email'),
      message: formData.get('message'),
      purpose: formData.get('purpose'),
      paymentMethod: formData.get('paymentMethod'),
      status: 'COMPLETED', // Mark as completed immediately
      transactionId: `TXN-${Date.now()}`,
    }
    donateMutation.mutate(data)
  }

  // Calculate stats - only count COMPLETED donations
  const completedDonations = donations.filter((d: any) => d.status === 'COMPLETED')
  
  const monthlyDonations = completedDonations.filter((d: any) => {
    const donationDate = new Date(d.createdAt || d.donationDate)
    const now = new Date()
    return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear()
  })

  const totalRaised = completedDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0)
  const monthlyTotal = monthlyDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0)
  const avgDonation = completedDonations.length > 0 ? totalRaised / completedDonations.length : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <DollarSign className="w-12 h-12 animate-bounce mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading donation information...</p>
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
            <DollarSign className="w-8 h-8 text-green-600" />
            Donation Portal
          </h1>
          <p className="text-muted-foreground mt-1">
            Support our mission to help stray dogs
          </p>
        </div>
        <Button onClick={() => setShowDonateDialog(true)} size="lg" className="gap-2">
          <Heart className="w-5 h-5" />
          Donate Now
        </Button>
      </div>

      {/* Impact Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl">Your Donations Save Lives 🐕💚</CardTitle>
          <CardDescription>Every contribution helps rescue, feed, and care for stray dogs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">₹{totalRaised.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Raised</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{completedDonations.length}</p>
                <p className="text-sm text-muted-foreground">Generous Donors</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">₹{Math.round(avgDonation)}</p>
                <p className="text-sm text-muted-foreground">Average Donation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{monthlyDonations.length} donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medical Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{donations.filter((d: any) => d.purpose === 'MEDICAL').reduce((s: number, d: any) => s + d.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">For treatments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Food Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{donations.filter((d: any) => d.purpose === 'FOOD').reduce((s: number, d: any) => s + d.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">For feeding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rescue Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{donations.filter((d: any) => d.purpose === 'RESCUE').reduce((s: number, d: any) => s + d.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">For operations</p>
          </CardContent>
        </Card>
      </div>

      {/* Donation History and Impact */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Donations</TabsTrigger>
          <TabsTrigger value="impact">Our Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Latest contributions from our amazing supporters</CardDescription>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No donations yet. Be the first to contribute!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {donations.slice(0, 10).map((donation: any) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{donation.donorName || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">{donation.message || 'No message'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{donation.amount?.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {donation.purpose || 'GENERAL'}
                          </Badge>
                          {donation.createdAt && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(donation.createdAt || donation.donationDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>What Your Donation Does</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="text-2xl">🍖</div>
                  <div>
                    <p className="font-semibold">₹100</p>
                    <p className="text-sm text-muted-foreground">Feeds 5 dogs for a day</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">💉</div>
                  <div>
                    <p className="font-semibold">₹500</p>
                    <p className="text-sm text-muted-foreground">Vaccinates one dog</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">🏥</div>
                  <div>
                    <p className="font-semibold">₹2,000</p>
                    <p className="text-sm text-muted-foreground">Emergency medical treatment</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">🏠</div>
                  <div>
                    <p className="font-semibold">₹5,000</p>
                    <p className="text-sm text-muted-foreground">Shelter care for one month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Our Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dogs Rescued</span>
                    <span className="font-bold">150+</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: '75%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vaccinations Given</span>
                    <span className="font-bold">300+</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Successful Adoptions</span>
                    <span className="font-bold">80+</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: '65%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Community Volunteers</span>
                    <span className="font-bold">50+</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600" style={{ width: '70%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Donate Dialog */}
      <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleDonate}>
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
              <DialogDescription>
                Every contribution helps us save more lives
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Amount Selection */}
              <div className="space-y-3">
                <Label>Select Amount</Label>
                <div className="grid grid-cols-5 gap-2">
                  {DONATION_AMOUNTS.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={selectedAmount === amount ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount('')
                      }}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customAmount">Or Enter Custom Amount</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="grid gap-2">
                <Label htmlFor="purpose">Donation Purpose *</Label>
                <Select name="purpose" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General Fund</SelectItem>
                    <SelectItem value="MEDICAL">Medical Treatment</SelectItem>
                    <SelectItem value="FOOD">Food & Nutrition</SelectItem>
                    <SelectItem value="SHELTER">Shelter Maintenance</SelectItem>
                    <SelectItem value="RESCUE">Rescue Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Details */}
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

              {/* Payment Method */}
              <div className="grid gap-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select name="paymentMethod" required>
                  <SelectTrigger>
                    <CreditCard className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                    <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="grid gap-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Leave a message of support..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDonateDialog(false)
                  setSelectedAmount(null)
                  setCustomAmount('')
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={donateMutation.isPending}>
                {donateMutation.isPending ? 'Processing...' : `Donate ₹${selectedAmount || customAmount || '0'}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
