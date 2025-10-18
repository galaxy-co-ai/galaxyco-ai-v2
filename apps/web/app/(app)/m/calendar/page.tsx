import { Metadata } from "next";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Calendar | GalaxyCo.ai",
  description: "Mobile calendar and events",
};

// Mock events data
const events = [
  {
    id: "1",
    title: "Team Standup",
    time: "09:00 AM",
    duration: "30 min",
    location: "Zoom",
    type: "meeting",
    color: "primary",
  },
  {
    id: "2",
    title: "Client Demo - Acme Corp",
    time: "11:00 AM",
    duration: "1 hour",
    location: "Conference Room A",
    type: "demo",
    color: "success",
  },
  {
    id: "3",
    title: "Lunch with Marketing Team",
    time: "12:30 PM",
    duration: "1 hour",
    location: "The Bistro",
    type: "social",
    color: "secondary",
  },
  {
    id: "4",
    title: "Product Review",
    time: "02:00 PM",
    duration: "45 min",
    location: "Zoom",
    type: "meeting",
    color: "primary",
  },
  {
    id: "5",
    title: "Strategy Planning",
    time: "04:00 PM",
    duration: "2 hours",
    location: "Conference Room B",
    type: "workshop",
    color: "warning",
  },
];

export default function MobileCalendarPage() {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Calendar</h1>
          <Button variant="outline" size="sm">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Month
          </Button>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center justify-between">
          <button
            className="p-2 hover:bg-background-subtle rounded-md touch-manipulation"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold">{dayName}</p>
            <p className="text-sm text-foreground-muted">{monthDay}</p>
          </div>
          <button
            className="p-2 hover:bg-background-subtle rounded-md touch-manipulation"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Mini Week View */}
        <div className="flex gap-1 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - 3 + i);
            const isToday = i === 3;

            return (
              <button
                key={i}
                className={`flex flex-col items-center justify-center min-w-[48px] h-16 rounded-lg transition-colors touch-manipulation ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-background-subtle"
                }`}
                aria-label={`View ${date.toLocaleDateString()}`}
                aria-current={isToday ? "date" : undefined}
              >
                <span className="text-xs font-medium">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-lg font-semibold mt-1">
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-border bg-card p-4 active:bg-background-subtle transition-colors"
            >
              {/* Time and Badge */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-foreground-muted" />
                  <span className="text-sm font-medium">{event.time}</span>
                  <span className="text-sm text-foreground-muted">
                    · {event.duration}
                  </span>
                </div>
                <Badge variant="secondary" size="sm">
                  {event.type}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-base mb-2">{event.title}</h3>

              {/* Location */}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-foreground-muted" />
                  <span className="text-sm text-foreground-muted">
                    {event.location}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  Join
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarIcon className="h-12 w-12 text-foreground-muted mb-3" />
            <p className="text-foreground-muted">No events scheduled</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-elevation-high flex items-center justify-center active:scale-95 transition-transform touch-manipulation"
        aria-label="Add new event"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
