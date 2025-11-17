"use client"

import { useState } from "react"
import { Calendar, MapPin, Trash2, Plus, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Location {
  id: string
  title: string
  location: string
  latitude: number
  longitude: number
  imageUrl: string
}

interface TripItinerary {
  date: string
  destination: string
  notes: string
}

interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  itinerary: TripItinerary[]
  destinations: string[]
}

interface TripPlannerProps {
  savedLocations: Location[]
}

export default function TripPlanner({ savedLocations }: TripPlannerProps) {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: "1",
      name: "European Summer Adventure",
      startDate: "2025-06-01",
      endDate: "2025-06-21",
      destinations: ["Santorini, Greece", "Tokyo, Japan"],
      itinerary: [
        { date: "2025-06-01", destination: "Santorini, Greece", notes: "Arrive and settle in. Watch sunset at Oia." },
        { date: "2025-06-02", destination: "Santorini, Greece", notes: "Visit ancient ruins and beaches." },
      ],
    },
  ])
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(trips[0] || null)
  const [newTripName, setNewTripName] = useState("")
  const [showNewTripForm, setShowNewTripForm] = useState(false)

  const createTrip = () => {
    if (!newTripName.trim()) return

    const newTrip: Trip = {
      id: Date.now().toString(),
      name: newTripName,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      itinerary: [],
      destinations: [],
    }

    setTrips([...trips, newTrip])
    setSelectedTrip(newTrip)
    setNewTripName("")
    setShowNewTripForm(false)
  }

  const deleteTrip = (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id))
    if (selectedTrip?.id === id) {
      setSelectedTrip(trips.length > 1 ? trips[0] : null)
    }
  }

  const addDestinationToTrip = (location: Location) => {
    if (!selectedTrip) return

    const updatedTrips = trips.map((trip) => {
      if (trip.id === selectedTrip.id) {
        if (!trip.destinations.includes(location.location)) {
          return {
            ...trip,
            destinations: [...trip.destinations, location.location],
            itinerary: [
              ...trip.itinerary,
              {
                date: trip.endDate || new Date().toISOString().split("T")[0],
                destination: location.location,
                notes: `Visit ${location.title}`,
              },
            ],
          }
        }
      }
      return trip
    })

    setTrips(updatedTrips)
    const updated = updatedTrips.find((t) => t.id === selectedTrip.id)
    if (updated) setSelectedTrip(updated)
  }

  const removeDestinationFromTrip = (destinationToRemove: string) => {
    if (!selectedTrip) return

    const updatedTrips = trips.map((trip) => {
      if (trip.id === selectedTrip.id) {
        return {
          ...trip,
          destinations: trip.destinations.filter((d) => d !== destinationToRemove),
          itinerary: trip.itinerary.filter((i) => i.destination !== destinationToRemove),
        }
      }
      return trip
    })

    setTrips(updatedTrips)
    const updated = updatedTrips.find((t) => t.id === selectedTrip.id)
    if (updated) setSelectedTrip(updated)
  }

  return (
    <main className="flex-1 px-4 py-6 md:px-6 bg-gradient-to-br from-background to-secondary/5 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-pretty">Plan Your Adventures</h1>
          <p className="text-muted-foreground">Create trips, organize destinations, and build your perfect itinerary</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trips List */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col animate-fade-in-up">
            <div className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <h2 className="font-semibold text-lg">My Trips</h2>
              <p className="text-xs opacity-90">
                {trips.length} trip{trips.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {trips.map((trip, index) => (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  className={`w-full text-left p-4 smooth-transition hover:bg-muted hover-lift ${
                    selectedTrip?.id === trip.id ? "bg-primary/10 scale-[1.02]" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="font-medium text-foreground">{trip.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {trip.destinations.length} destination{trip.destinations.length !== 1 ? "s" : ""}
                  </p>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              {showNewTripForm ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Trip name..."
                    value={newTripName}
                    onChange={(e) => setNewTripName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createTrip()}
                    className="w-full px-3 py-2 bg-input border border-input rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={createTrip} className="flex-1">
                      Create
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowNewTripForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowNewTripForm(true)} className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Trip
                </Button>
              )}
            </div>
          </Card>

          {/* Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTrip ? (
              <>
                {/* Trip Header */}
                <Card className="overflow-hidden animate-fade-in-up hover-lift">
                  <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedTrip.name}</h2>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(selectedTrip.startDate).toLocaleDateString()} -{" "}
                            {new Date(selectedTrip.endDate).toLocaleDateString()}
                          </div>
                          <div>{selectedTrip.destinations.length} stops</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTrip(selectedTrip.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedTrip.destinations.map((dest) => (
                        <div
                          key={dest}
                          className="inline-flex items-center gap-2 bg-card px-3 py-1 rounded-full border border-border"
                        >
                          <MapPin className="w-3 h-3 text-primary" />
                          <span className="text-sm">{dest}</span>
                          <button
                            onClick={() => removeDestinationFromTrip(dest)}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Add Destinations */}
                {savedLocations.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-4">Add Saved Destinations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => addDestinationToTrip(location)}
                          disabled={selectedTrip.destinations.includes(location.location)}
                          className={`p-3 rounded-lg border border-border transition-colors text-left ${
                            selectedTrip.destinations.includes(location.location)
                              ? "bg-primary/10 border-primary/50 opacity-60"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-foreground text-sm truncate">{location.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {location.location}
                              </p>
                            </div>
                            {selectedTrip.destinations.includes(location.location) && (
                              <Check className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Itinerary */}
                <Card className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">
                    Itinerary ({selectedTrip.itinerary.length} days)
                  </h3>
                  {selectedTrip.itinerary.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Add destinations to create your itinerary
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedTrip.itinerary.map((item, idx) => (
                        <div key={idx} className="flex gap-4 pb-3 border-b border-border last:border-0">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                              {idx + 1}
                            </div>
                            {idx < selectedTrip.itinerary.length - 1 && <div className="w-0.5 h-8 bg-border mt-2" />}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                            <p className="font-medium text-foreground text-sm mt-1">{item.destination}</p>
                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Create a new trip to get started</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
