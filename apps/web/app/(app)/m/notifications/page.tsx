/**
 * Mobile Notifications Page
 * Simplified notifications for mobile
 */

import { Bot, Check, AlertCircle, Info } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Agent completed successfully",
    description: "Sales Outreach agent finished - 12 leads found",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "Agent started",
    description: "Email Campaign agent is now running",
    time: "5m ago",
    read: false,
  },
  {
    id: 3,
    type: "error",
    title: "Agent failed",
    description: "Data Sync encountered an error - check logs",
    time: "15m ago",
    read: true,
  },
  {
    id: 4,
    type: "success",
    title: "Workflow deployed",
    description: "New workflow is now active",
    time: "1h ago",
    read: true,
  },
];

export default function MobileNotificationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <button className="text-sm text-primary hover:text-primary-hover font-medium">
          Mark all read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => {
          const Icon =
            notification.type === "success"
              ? Check
              : notification.type === "error"
                ? AlertCircle
                : Info;
          const bgColor =
            notification.type === "success"
              ? "bg-success/10"
              : notification.type === "error"
                ? "bg-destructive/10"
                : "bg-primary/10";
          const iconColor =
            notification.type === "success"
              ? "text-success"
              : notification.type === "error"
                ? "text-destructive"
                : "text-primary";

          return (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border bg-background-elevated ${
                notification.read
                  ? "border-border"
                  : "border-primary bg-primary/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground mb-1">
                    {notification.title}
                  </div>
                  <div className="text-sm text-foreground-muted mb-2">
                    {notification.description}
                  </div>
                  <div className="text-xs text-foreground-muted">
                    {notification.time}
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
