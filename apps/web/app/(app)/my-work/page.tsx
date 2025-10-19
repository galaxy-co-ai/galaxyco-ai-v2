/**
 * My Work Hub - GalaxyCo.ai 2.0
 * Central entry point for daily workflow
 * Aggregates: Tasks, Calendar, Inbox, Notifications
 * October 19, 2025
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWorkspace } from "@/contexts/workspace-context";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Mail,
  Bell,
  Calendar,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees?: any;
}

interface InboxMessage {
  id: string;
  subject: string;
  preview: string;
  senderName: string;
  status: string;
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

export default function MyWorkHub() {
  const { currentWorkspace } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkData() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [tasksRes, eventsRes, messagesRes, notificationsRes] =
          await Promise.all([
            fetch(`/api/tasks?workspaceId=${currentWorkspace.id}&limit=5`),
            fetch(`/api/calendar?workspaceId=${currentWorkspace.id}&limit=5`),
            fetch(`/api/inbox?workspaceId=${currentWorkspace.id}&limit=5`),
            fetch(
              `/api/notifications?workspaceId=${currentWorkspace.id}&limit=5`,
            ),
          ]);

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks || tasksData.data || []);
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData.events || eventsData.data || []);
        }

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setMessages(messagesData.messages || messagesData.data || []);
        }

        if (notificationsRes.ok) {
          const notificationsData = await notificationsRes.json();
          setNotifications(
            notificationsData.notifications || notificationsData.data || [],
          );
        }
      } catch (error) {
        console.error("Failed to fetch work data:", error);
        toast.error("Failed to load your work dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkData();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const pendingTasks = tasks.filter(
    (t) => t.status === "todo" || t.status === "in_progress",
  );
  const unreadMessages = messages.filter((m) => m.status === "unread");
  const todayEvents = events.filter((e) => {
    const eventDate = new Date(e.startTime);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Work</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your daily workflow at a glance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {pendingTasks.length} Tasks
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {todayEvents.length} Events
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {unreadMessages.length} Unread
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Tasks Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Tasks</h2>
              </div>
              <Link href="/tasks">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>All caught up! No pending tasks.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-hover transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        task.priority === "high"
                          ? "bg-destructive"
                          : task.priority === "medium"
                            ? "bg-warning"
                            : "bg-muted"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.status.replace("_", " ")}
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Calendar Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Today&apos;s Schedule</h2>
              </div>
              <Link href="/calendar">
                <Button variant="ghost" size="sm">
                  View Calendar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {todayEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No events scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-hover transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                      <span className="text-xs font-medium">
                        {new Date(event.startTime).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.startTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(event.endTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Inbox Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Inbox</h2>
                {unreadMessages.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadMessages.length}
                  </Badge>
                )}
              </div>
              <Link href="/inbox">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Inbox is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 5).map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-hover transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium">
                        {message.senderName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {message.senderName}
                        </p>
                        {message.status === "unread" && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-foreground truncate mt-1">
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {message.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notifications Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <Link href="/notifications">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No new notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-hover transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      {notification.type === "warning" ||
                      notification.type === "error" ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
