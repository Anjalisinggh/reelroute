"use client"

import { MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  activeTab?: string
  onBack?: () => void
}

export default function Header({ activeTab, onBack }: HeaderProps) {
  const showBackButton = activeTab && activeTab !== "explore"

  return (
    <header className="bg-primary text-primary-foreground shadow-sm sticky top-0 z-40 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/20 mr-2 smooth-transition hover:scale-110"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="bg-primary-foreground text-primary p-2 rounded-lg smooth-transition hover:scale-110 hover:rotate-3 animate-float">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="animate-slide-in-right">
            <h1 className="text-xl md:text-2xl font-bold">ReelRoute</h1>
            <p className="text-xs opacity-90">Discover. Save. Travel.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center text-primary font-semibold">
            U
          </div>
        </div>
      </div>
    </header>
  )
}
