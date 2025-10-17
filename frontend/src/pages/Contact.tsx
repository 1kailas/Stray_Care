import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Contact() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Phone
            </CardTitle>
            <CardDescription>Call us for emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">+1 (555) 123-4567</p>
            <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email
            </CardTitle>
            <CardDescription>Send us a message</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">info@straydogcare.org</p>
            <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address
            </CardTitle>
            <CardDescription>Visit our rescue center</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">123 Rescue Avenue, Animal City, AC 12345</p>
            <p className="text-sm text-muted-foreground mt-1">Open Mon-Fri: 9AM - 6PM</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
