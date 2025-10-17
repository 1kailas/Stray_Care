import { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin, Navigation, X } from 'lucide-react'
import { toast } from 'sonner'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapLocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void
  initialLat?: number
  initialLng?: number
}

interface LocationState {
  lat: number
  lng: number
  address?: string
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }: { 
  position: LocationState | null, 
  setPosition: (pos: LocationState) => void 
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      
      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        )
        const data = await response.json()
        const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        
        setPosition({ lat, lng, address })
        toast.success('Location selected!')
      } catch (error) {
        console.error('Geocoding error:', error)
        setPosition({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` })
      }
    },
  })

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]}>
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">Selected Location</p>
          <p className="text-xs text-gray-600 mt-1">{position.address}</p>
          <p className="text-xs text-gray-500 mt-1">
            Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

export function MapLocationPicker({ 
  onLocationSelect, 
  initialLat = 28.6139, // Default to New Delhi
  initialLng = 77.2090 
}: MapLocationPickerProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<LocationState | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          // Get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            )
            const data = await response.json()
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            
            setPosition({ lat, lng, address })
            setUserLocation([lat, lng])
            
            // Fly to user location
            if (mapRef.current) {
              mapRef.current.flyTo([lat, lng], 15, {
                duration: 1.5
              })
            }
            
            toast.success('Current location detected!')
          } catch (error) {
            console.error('Geocoding error:', error)
            setPosition({ lat, lng })
            setUserLocation([lat, lng])
          }
          
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          toast.error('Unable to get your location. Please select manually on the map.')
          setIsLoadingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser')
      setIsLoadingLocation(false)
    }
  }

  const handleConfirm = () => {
    if (position) {
      onLocationSelect(position.lat, position.lng, position.address)
      setOpen(false)
      toast.success('Location saved!')
    } else {
      toast.error('Please select a location on the map')
    }
  }

  const handleClear = () => {
    setPosition(null)
    toast.info('Location cleared')
  }

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <MapPin className="w-4 h-4" />
        Pick Location
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Select Dog Location
            </DialogTitle>
            <DialogDescription>
              Click anywhere on the map to pin the exact location where you found the dog, or use your current location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-4">
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="gap-2"
              >
                <Navigation className="w-4 h-4" />
                {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
              </Button>
              
              {position && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClear}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Selection
                </Button>
              )}
            </div>

            {/* Selected Location Info */}
            {position && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Selected Location:</p>
                <p className="text-xs text-blue-700 mt-1">{position.address || 'Address not available'}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Latitude: {position.lat.toFixed(6)}, Longitude: {position.lng.toFixed(6)}
                </p>
              </div>
            )}

            {/* Map Container */}
            <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={userLocation || [initialLat, initialLng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                ref={(map) => { if (map) mapRef.current = map }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              💡 Tip: Click on the map to drop a pin at the dog's location
            </p>
          </div>

          <DialogFooter className="px-6 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!position}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
