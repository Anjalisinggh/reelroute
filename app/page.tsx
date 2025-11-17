"use client"

import { useState } from "react"
import { Heart, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import MapView from "@/components/map-view"
import TripPlanner from "@/components/trip-planner"
import Reminders from "@/components/reminders"

interface Reel {
  id: string
  title: string
  location: string
  description: string
  imageUrl: string
  isSaved: boolean
  latitude: number
  longitude: number
}

const SAMPLE_REELS: Reel[] = [
  {
    id: "1",
    title: "Sunset at Santorini",
    location: "Santorini, Greece",
    description: "Watch the most breathtaking sunset overlooking the Aegean Sea",
    imageUrl: "/santorini.jpg",
    isSaved: false,
    latitude: 36.3932,
    longitude: 25.4615,
  },
  {
    id: "2",
    title: "Tokyo Street Life",
    location: "Tokyo, Japan",
    description: "Experience the vibrant energy of Tokyo neon-lit streets",
    imageUrl: "/tokyo.jpg",
    isSaved: false,
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    id: "3",
    title: "Bali Rice Terraces",
    location: "Ubud, Bali",
    description: "Stunning emerald rice paddies in the heart of Bali",
    imageUrl: "/bali.jpg",
    isSaved: false,
    latitude: -8.5069,
    longitude: 115.2625,
  },
  {
    id: "4",
    title: "Northern Lights",
    location: "Reykjavik, Iceland",
    description: "Dancing aurora borealis over the Icelandic landscape",
    imageUrl: "/north.jpg",
    isSaved: false,
    latitude: 64.1466,
    longitude: -21.9426,
  },
  {
    id: "5",
    title: "Machu Picchu Wonder",
    location: "Cusco, Peru",
    description: "Ancient Inca ruins rising from the clouds",
    imageUrl: "/machu.png",
    isSaved: false,
    latitude: -13.1631,
    longitude: -72.545,
  },
  {
    id: "6",
    title: "Great Wall Hike",
    location: "Beijing, China",
    description: "Epic views along the legendary Great Wall",
    imageUrl: "/greatwall.jpg",
    isSaved: false,
    latitude: 40.4319,
    longitude: 116.5704,
  },
]

export default function Home() {
  const [reels, setReels] = useState<Reel[]>(SAMPLE_REELS)
  const [activeTab, setActiveTab] = useState("explore")

  const savedReels = reels.filter((reel) => reel.isSaved)
  const savedLocations = savedReels.map((reel) => ({
    id: reel.id,
    title: reel.title,
    location: reel.location,
    latitude: reel.latitude,
    longitude: reel.longitude,
    imageUrl: reel.imageUrl,
  }))

  const toggleSaveReel = (id: string) => {
    setReels(reels.map((reel) => (reel.id === id ? { ...reel, isSaved: !reel.isSaved } : reel)))
  }

  const deleteReel = (id: string) => {
    setReels(reels.filter((reel) => reel.id !== id))
  }

  const handleBack = () => {
    setActiveTab("explore")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onBack={handleBack} />

      {activeTab === "map" ? (
        <div className="animate-fade-in animate-scale-in">
          <MapView savedLocations={savedLocations} />
        </div>
      ) : activeTab === "trips" ? (
        <div className="animate-fade-in animate-scale-in">
          <TripPlanner savedLocations={savedLocations} />
        </div>
      ) : activeTab === "reminders" ? (
        <div className="animate-fade-in animate-scale-in">
          <Reminders />
        </div>
      ) : (
        <main className="flex-1 px-4 py-6 md:px-6 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-pretty">
                    {activeTab === "explore" ? "Discover Travel Destinations" : "Your Saved Adventures"}
                  </h1>
                  <p className="text-muted-foreground">
                    {activeTab === "explore"
                      ? `Find your next destination. Save reels and build your trip. (${reels.length} available)`
                      : `You have ${savedReels.length} saved destination${savedReels.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveTab("explore")}
                    variant={activeTab === "explore" ? "default" : "outline"}
                    size="sm"
                    className="smooth-transition hover:scale-105"
                  >
                    Explore
                  </Button>
                  <Button
                    onClick={() => setActiveTab("saved")}
                    variant={activeTab === "saved" ? "default" : "outline"}
                    size="sm"
                    className="smooth-transition hover:scale-105"
                  >
                    Saved ({savedReels.length})
                  </Button>
                  <Button
                    onClick={() => setActiveTab("map")}
                    variant={activeTab === "map" ? "default" : "outline"}
                    size="sm"
                    className="smooth-transition hover:scale-105"
                  >
                    Map
                  </Button>
                  <Button
                    onClick={() => setActiveTab("trips")}
                    variant={activeTab === "trips" ? "default" : "outline"}
                    size="sm"
                    className="smooth-transition hover:scale-105"
                  >
                    Trips
                  </Button>
                  <Button
                    onClick={() => setActiveTab("reminders")}
                    variant={activeTab === "reminders" ? "default" : "outline"}
                    size="sm"
                    className="smooth-transition hover:scale-105"
                  >
                    Reminders
                  </Button>
                </div>
              </div>
            </div>

            {(activeTab === "explore" ? reels : savedReels).length === 0 ? (
              <Card className="p-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {activeTab === "explore"
                    ? "No destinations available"
                    : "No saved adventures yet. Start exploring to save your favorites!"}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === "explore" ? reels : savedReels).map((reel, index) => (
                  <Card
                    key={reel.id}
                    className="overflow-hidden hover-lift flex flex-col h-full animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-64 bg-muted overflow-hidden group">
                      <img
                        src={reel.imageUrl || "/placeholder.svg"}
                        alt={reel.title}
                        className="w-full h-full object-cover smooth-transition group-hover:scale-110"
                      />
                      <button
                        onClick={() => toggleSaveReel(reel.id)}
                        className="absolute top-3 right-3 glass-effect hover:scale-110 rounded-full p-2 smooth-transition shadow-lg backdrop-blur-sm"
                        aria-label={reel.isSaved ? "Remove from favorites" : "Save to favorites"}
                      >
                        <Heart
                          className={`w-5 h-5 smooth-transition ${
                            reel.isSaved ? "fill-accent text-accent scale-110" : "text-foreground hover:text-accent hover:scale-110"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-col flex-1 p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg text-pretty">{reel.title}</h3>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            {reel.location}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{reel.description}</p>

                      {activeTab === "saved" && (
                        <button
                          onClick={() => deleteReel(reel.id)}
                          className="flex items-center justify-center gap-2 py-2 px-3 text-sm text-foreground hover:bg-muted rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
