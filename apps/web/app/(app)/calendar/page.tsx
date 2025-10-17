"use client";

import { DetailPage } from "@/components/templates/detail-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
} from "lucide-react";

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Q4 Strategy Planning",
    type: "meeting",
    date: "2025-10-17",
    time: "09:00 AM",
    duration: "2 hours",
    location: "Conference Room A",
    attendees: [
      {
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      {
        name: "Emily Rodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      },
    ],
    status: "upcoming",
  },
  {
    id: "2",
    title: "Client Demo - Acme Corp",
    type: "demo",
    date: "2025-10-17",
    time: "02:00 PM",
    duration: "1 hour",
    location: "Virtual (Zoom)",
    attendees: [
      {
        name: "David Kim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
    ],
    status: "upcoming",
  },
  {
    id: "3",
    title: "Team Standup",
    type: "standup",
    date: "2025-10-18",
    time: "09:30 AM",
    duration: "30 minutes",
    location: "Virtual (Teams)",
    attendees: [
      {
        name: "Jessica Martinez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      },
      {
        name: "Robert Taylor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      },
    ],
    status: "upcoming",
  },
  {
    id: "4",
    title: "Product Roadmap Review",
    type: "review",
    date: "2025-10-18",
    time: "03:00 PM",
    duration: "1.5 hours",
    location: "Conference Room B",
    attendees: [
      {
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
    ],
    status: "upcoming",
  },
  {
    id: "5",
    title: "1:1 with Engineering Lead",
    type: "one-on-one",
    date: "2025-10-19",
    time: "10:00 AM",
    duration: "30 minutes",
    location: "Office",
    attendees: [
      {
        name: "Emily Rodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      },
    ],
    status: "upcoming",
  },
];

const calendarMetrics = [
  {
    label: "Events Today",
    value: "3",
    change: "2 upcoming",
    trend: "neutral" as const,
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  {
    label: "This Week",
    value: "12",
    change: "vs 10 last week",
    trend: "up" as const,
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: "Total Hours",
    value: "18.5h",
    change: "scheduled",
    trend: "neutral" as const,
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: "Meetings",
    value: "8",
    change: "67% of events",
    trend: "neutral" as const,
    icon: <Users className="h-5 w-5" />,
  },
];

function CalendarView() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {today.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Today
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days (simplified) */}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2; // Start from day -2 to fill the grid
            const isToday = day === today.getDate();

            return (
              <div
                key={i}
                className={`aspect-square p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                  isToday ? "bg-primary/10 border-primary" : ""
                }`}
              >
                <div
                  className={`text-sm ${
                    isToday ? "font-bold text-primary" : "text-muted-foreground"
                  }`}
                >
                  {day > 0 && day <= 31 ? day : ""}
                </div>
                {/* Event dots */}
                {day === 17 && (
                  <div className="flex gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function UpcomingEvents() {
  const typeColors = {
    meeting: "default",
    demo: "secondary",
    standup: "outline",
    review: "default",
    "one-on-one": "secondary",
  } as const;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">{event.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString()} at{" "}
                      {event.time}
                    </span>
                    <span>• {event.duration}</span>
                  </div>
                </div>
                <Badge
                  variant={typeColors[event.type as keyof typeof typeColors]}
                >
                  {event.type.charAt(0).toUpperCase() +
                    event.type.slice(1).replace("-", " ")}
                </Badge>
              </div>

              {/* Event Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {event.location.includes("Virtual") ? (
                    <Video className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-muted-foreground">
                    {event.location}
                  </span>
                </div>

                {/* Attendees */}
                {event.attendees.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar
                          key={index}
                          src={attendee.avatar}
                          alt={attendee.name}
                          fallback={attendee.name.slice(0, 2).toUpperCase()}
                          size="sm"
                          className="border-2 border-background"
                        />
                      ))}
                    </div>
                    {event.attendees.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{event.attendees.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {event.location.includes("Virtual") && (
                  <Button size="sm">
                    <Video className="mr-2 h-4 w-4" />
                    Join
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WeekView() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">This Week</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Week view coming soon. Use calendar view or upcoming events for now.
        </p>
        <div className="grid gap-4 md:grid-cols-7">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="p-4 rounded-lg border border-border">
              <div className="text-sm font-medium mb-2">{day}</div>
              <div className="text-xs text-muted-foreground">No events</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function CalendarPage() {
  const tabs = [
    {
      id: "calendar",
      label: "Calendar",
      content: <CalendarView />,
    },
    {
      id: "upcoming",
      label: "Upcoming",
      content: <UpcomingEvents />,
    },
    {
      id: "week",
      label: "Week",
      content: <WeekView />,
    },
  ];

  return (
    <DetailPage
      title="Calendar"
      subtitle="Manage your schedule and upcoming events"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Calendar" }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      }
      metrics={calendarMetrics}
      tabs={tabs}
      defaultTab="upcoming"
    />
  );
}
