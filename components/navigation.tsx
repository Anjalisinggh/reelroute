"use client"

import { Map, Compass, Heart, Clock, Bell } from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: "explore", label: "Explore", icon: Compass },
    { id: "saved", label: "Saved", icon: Heart },
    { id: "map", label: "Map", icon: Map },
    { id: "trips", label: "Trips", icon: Clock },
    { id: "reminders", label: "Reminders", icon: Bell },
  ]

  return (
    <nav className="border-t border-border bg-card sticky bottom-0 px-4 py-3 shadow-lg md:hidden animate-fade-in-up">
      <div className="max-w-6xl mx-auto flex justify-around gap-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg smooth-transition text-xs font-medium hover:scale-110 ${
                activeTab === tab.id 
                  ? "text-primary bg-primary/10 scale-105" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className={`w-5 h-5 smooth-transition ${activeTab === tab.id ? "animate-float" : ""}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
