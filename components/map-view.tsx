"use client"

import { useState } from "react"
import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Location {
  id: string
  title: string
  location: string
  latitude: number
  longitude: number
  imageUrl: string
}

interface MapViewProps {
  savedLocations: Location[]
}

export default function MapView({ savedLocations }: MapViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [zoom, setZoom] = useState(2)

  // Calculate bounds for all locations
  const calculateCenter = () => {
    if (savedLocations.length === 0) return { lat: 20, lng: 0 }
    const latSum = savedLocations.reduce((sum, loc) => sum + loc.latitude, 0)
    const lngSum = savedLocations.reduce((sum, loc) => sum + loc.longitude, 0)
    return {
      lat: latSum / savedLocations.length,
      lng: lngSum / savedLocations.length,
    }
  }

  const center = calculateCenter()

  // Simple mercator projection for demonstration
  const projectPoint = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100
    const y = ((90 - lat) / 180) * 100
    return { x, y }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background gap-4 p-4 md:p-6 animate-fade-in">
      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden shadow-lg border border-border animate-scale-in">
        {/* Map Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Location Points */}
        {savedLocations.map((location) => {
          const point = projectPoint(location.latitude, location.longitude)
          const isSelected = selectedLocation?.id === location.id

          return (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  isSelected ? "bg-accent scale-150 shadow-lg" : "bg-primary shadow-md hover:scale-125"
                }`}
              />
              <div
                className={`absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-foreground bg-card px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                  isSelected ? "opacity-100" : ""
                }`}
              >
                {location.location}
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {savedLocations.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <MapPin className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No saved destinations yet</p>
            <p className="text-sm">Save destinations to see them on the map</p>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
          <Button
            size="sm"
            variant="outline"
            className="h-10 w-10 p-0 bg-transparent"
            onClick={() => setZoom(Math.min(zoom + 1, 5))}
          >
            +
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-10 w-10 p-0 bg-transparent"
            onClick={() => setZoom(Math.max(zoom - 1, 1))}
          >
            −
          </Button>
        </div>

        {/* Location Info Popup */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:top-4 md:right-4 md:left-auto md:w-80 bg-card rounded-lg shadow-lg z-20 border border-border overflow-hidden">
            <div className="aspect-video bg-muted overflow-hidden">
              <img
                src={selectedLocation.imageUrl || "/placeholder.svg"}
                alt={selectedLocation.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedLocation.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {selectedLocation.location}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Coordinates: {selectedLocation.latitude.toFixed(2)}, {selectedLocation.longitude.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Locations List */}
      <div className="md:w-80 bg-card rounded-lg shadow-lg border border-border overflow-hidden flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <h2 className="font-semibold text-lg">Saved Destinations</h2>
          <p className="text-xs opacity-90">
            {savedLocations.length} location{savedLocations.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {savedLocations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm text-center p-4">
              Save destinations from Explore to see them here
            </div>
          ) : (
            <div className="divide-y divide-border">
              {savedLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`w-full text-left p-4 smooth-transition hover:bg-muted hover-lift ${
                    selectedLocation?.id === location.id ? "bg-primary/10 scale-[1.02]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={location.imageUrl || "/placeholder.svg"}
                        alt={location.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">{location.title}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{location.location}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
