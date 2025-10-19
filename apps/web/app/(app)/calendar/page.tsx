"use client";

import { useState, useEffect } from "react";
import { DetailPage } from "@/components/templates/detail-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useWorkspace } from "@/contexts/workspace-context";
import { toast } from "sonner";
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

interface CalendarEvent {
  id: string;
  workspaceId: string;
  title: string;
  description: string | null;
  location: string | null;
  meetingUrl: string | null;
  startTime: string;
  endTime: string;
  timezone: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule: string | null;
  createdBy: string;
  attendees: any;
  customerId: string | null;
  projectId: string | null;
  tags: string[] | null;
  reminders: any;
  createdAt: string;
  updatedAt: string;
}

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

function UpcomingEvents({ events }: { events: CalendarEvent[] }) {
  const typeColors = {
    meeting: "default",
    demo: "secondary",
    standup: "outline",
    review: "default",
    "one-on-one": "secondary",
  } as const;

  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <p className="text-sm text-muted-foreground">No upcoming events</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {events.map((event) => (
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
                    <span>{new Date(event.startTime).toLocaleString()}</span>
                    {event.endTime && (
                      <span>• {new Date(event.endTime).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <Badge variant="default">
                  {event.isAllDay ? "All Day" : "Event"}
                </Badge>
              </div>

              {/* Event Details */}
              <div className="space-y-2">
                {event.location && (
                  <div className="flex items-center gap-2 text-sm">
                    {event.meetingUrl ||
                    event.location?.toLowerCase().includes("virtual") ? (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-muted-foreground">
                      {event.location}
                    </span>
                  </div>
                )}

                {/* Attendees */}
                {event.attendees &&
                  Array.isArray(event.attendees) &&
                  event.attendees.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex -space-x-2">
                        {event.attendees
                          .slice(0, 3)
                          .map((attendee: any, index: number) => (
                            <Avatar
                              key={index}
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${attendee.name || attendee.email}`}
                              alt={attendee.name || attendee.email}
                              fallback={(attendee.name || attendee.email || "U")
                                .slice(0, 2)
                                .toUpperCase()}
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
                {event.meetingUrl && (
                  <Button size="sm" asChild>
                    <a
                      href={event.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Join
                    </a>
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
  const { currentWorkspace } = useWorkspace();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/calendar?workspaceId=${currentWorkspace.id}&limit=100`,
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast.error("Failed to load calendar events");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Calculate metrics from real data
  const today = new Date();
  const todayEvents = events.filter((e) => {
    const eventDate = new Date(e.startTime);
    return eventDate.toDateString() === today.toDateString();
  });

  const thisWeekEvents = events.filter((e) => {
    const eventDate = new Date(e.startTime);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= today && eventDate <= weekFromNow;
  });

  const totalHours = thisWeekEvents.reduce((sum, e) => {
    const start = new Date(e.startTime);
    const end = new Date(e.endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const dynamicMetrics = [
    {
      label: "Events Today",
      value: todayEvents.length.toString(),
      change: `${todayEvents.length} scheduled`,
      trend: "neutral" as const,
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      label: "This Week",
      value: thisWeekEvents.length.toString(),
      change: `${thisWeekEvents.length} upcoming`,
      trend: "neutral" as const,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "Total Hours",
      value: `${totalHours.toFixed(1)}h`,
      change: "scheduled",
      trend: "neutral" as const,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "Total Events",
      value: events.length.toString(),
      change: "all time",
      trend: "neutral" as const,
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const tabs = [
    {
      id: "calendar",
      label: "Calendar",
      content: <CalendarView />,
    },
    {
      id: "upcoming",
      label: "Upcoming",
      content: <UpcomingEvents events={events} />,
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
      metrics={dynamicMetrics}
      tabs={tabs}
      defaultTab="upcoming"
    />
  );
}
