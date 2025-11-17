"use client"

import { useState } from "react"
import { Bell, Trash2, CheckCircle2, AlertCircle, Calendar, MapPin, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Reminder {
  id: string
  tripName: string
  destination: string
  date: string
  type: "before-trip" | "check-in" | "custom"
  message: string
  completed: boolean
  daysBeforeTrip?: number
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      tripName: "European Summer Adventure",
      destination: "Santorini, Greece",
      date: "2025-05-31",
      type: "before-trip",
      message: "Trip starts in 1 day! Pack your bags and prepare for takeoff.",
      completed: false,
      daysBeforeTrip: 1,
    },
    {
      id: "2",
      tripName: "European Summer Adventure",
      destination: "Santorini, Greece",
      date: "2025-06-01",
      type: "check-in",
      message: "You've arrived in Santorini! Check in at your accommodation and explore Oia for sunset.",
      completed: false,
    },
    {
      id: "3",
      tripName: "European Summer Adventure",
      destination: "Tokyo, Japan",
      date: "2025-06-15",
      type: "before-trip",
      message: "Get ready to experience Tokyo! Research local restaurants and transportation.",
      completed: false,
      daysBeforeTrip: 7,
    },
  ])

  const [showNewReminder, setShowNewReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    tripName: "",
    destination: "",
    date: "",
    message: "",
    type: "check-in" as const,
  })

  // Calculate upcoming reminders
  const today = new Date().toISOString().split("T")[0]
  const upcomingReminders = reminders
    .filter((r) => r.date >= today && !r.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastReminders = reminders
    .filter((r) => r.date < today || r.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const completeReminder = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)))
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id))
  }

  const addReminder = () => {
    if (!newReminder.tripName || !newReminder.destination || !newReminder.date || !newReminder.message) {
      return
    }

    setReminders([
      ...reminders,
      {
        id: Date.now().toString(),
        ...newReminder,
        completed: false,
      },
    ])

    setNewReminder({
      tripName: "",
      destination: "",
      date: "",
      message: "",
      type: "check-in",
    })
    setShowNewReminder(false)
  }

  const ReminderCard = ({ reminder, isUpcoming }: { reminder: Reminder; isUpcoming: boolean }) => {
    const daysUntil = Math.ceil((new Date(reminder.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    const icon =
      reminder.type === "before-trip" ? (
        <AlertCircle className="w-5 h-5 text-accent" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-primary" />
      )

    return (
      <Card
        className={`p-4 border-l-4 smooth-transition hover-lift ${
          reminder.completed
            ? "border-l-muted opacity-60 bg-muted/20"
            : reminder.type === "before-trip"
              ? "border-l-accent"
              : "border-l-primary"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <button
            onClick={() => completeReminder(reminder.id)}
            className="flex-shrink-0 mt-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {reminder.completed ? (
              <CheckCircle2 className="w-6 h-6 text-primary" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-muted-foreground hover:border-foreground" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {icon}
              <h3 className={`font-semibold text-foreground ${reminder.completed ? "line-through" : ""}`}>
                {reminder.tripName}
              </h3>
            </div>

            <p className={`text-sm ${reminder.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {reminder.message}
            </p>

            <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {reminder.destination}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(reminder.date).toLocaleDateString()}
                {isUpcoming && daysUntil > 0 && (
                  <span className="ml-1 bg-primary/20 text-primary px-2 py-0.5 rounded">{daysUntil}d away</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => deleteReminder(reminder.id)}
            className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </Card>
    )
  }

  return (
    <main className="flex-1 px-4 py-6 md:px-6 bg-gradient-to-br from-background to-secondary/5 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-pretty">Smart Reminders</h1>
          <p className="text-muted-foreground">Stay organized with timely notifications for your trips</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover-lift animate-fade-in-up animate-delay-100">
            <p className="text-sm text-muted-foreground mb-2">Upcoming Reminders</p>
            <p className="text-2xl font-bold text-foreground">{upcomingReminders.length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover-lift animate-fade-in-up animate-delay-200">
            <p className="text-sm text-muted-foreground mb-2">Completed</p>
            <p className="text-2xl font-bold text-foreground">{reminders.filter((r) => r.completed).length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover-lift animate-fade-in-up animate-delay-300">
            <p className="text-sm text-muted-foreground mb-2">Total Reminders</p>
            <p className="text-2xl font-bold text-foreground">{reminders.length}</p>
          </Card>
        </div>

        <div className="mb-6">
          {showNewReminder ? (
            <Card className="p-6 mb-6">
              <h2 className="font-semibold text-lg text-foreground mb-4">Create New Reminder</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Trip Name</label>
                  <input
                    type="text"
                    placeholder="e.g., European Summer Adventure"
                    value={newReminder.tripName}
                    onChange={(e) => setNewReminder({ ...newReminder, tripName: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Destination</label>
                  <input
                    type="text"
                    placeholder="e.g., Tokyo, Japan"
                    value={newReminder.destination}
                    onChange={(e) => setNewReminder({ ...newReminder, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Reminder Type</label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-input border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="check-in">Check-in</option>
                    <option value="before-trip">Before Trip</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    placeholder="What should we remind you about?"
                    value={newReminder.message}
                    onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-input border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={addReminder} className="flex-1">
                    Create Reminder
                  </Button>
                  <Button onClick={() => setShowNewReminder(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Button onClick={() => setShowNewReminder(true)} className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Reminder
            </Button>
          )}
        </div>

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Upcoming ({upcomingReminders.length})</h2>
            </div>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} isUpcoming={true} />
              ))}
            </div>
          </div>
        )}

        {/* Past Reminders */}
        {pastReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 text-muted-foreground">
              Past ({pastReminders.length})
            </h2>
            <div className="space-y-3">
              {pastReminders.slice(0, 5).map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} isUpcoming={false} />
              ))}
            </div>
            {pastReminders.length > 5 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                +{pastReminders.length - 5} more past reminders
              </p>
            )}
          </div>
        )}

        {reminders.length === 0 && (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No reminders yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first reminder to stay organized</p>
          </Card>
        )}
      </div>
    </main>
  )
}
