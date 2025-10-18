"use client";

import React from "react";
import { PageShell } from "@/components/templates/page-shell";
import { CheckCircle2, AlertCircle, XCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceStatus = "operational" | "degraded" | "down";

interface Service {
  name: string;
  status: ServiceStatus;
  uptime: string;
  responseTime: string;
}

interface Incident {
  id: string;
  title: string;
  status: "resolved" | "investigating" | "monitoring";
  date: string;
  updates: Array<{
    timestamp: string;
    message: string;
  }>;
}

const statusConfig: Record<
  ServiceStatus,
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  operational: {
    icon: CheckCircle2,
    label: "Operational",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  degraded: {
    icon: AlertCircle,
    label: "Degraded Performance",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  down: {
    icon: XCircle,
    label: "Service Down",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
};

const services: Service[] = [
  {
    name: "API Gateway",
    status: "operational",
    uptime: "99.99%",
    responseTime: "142ms",
  },
  {
    name: "Web Application",
    status: "operational",
    uptime: "99.98%",
    responseTime: "89ms",
  },
  {
    name: "Agent Execution Engine",
    status: "operational",
    uptime: "99.95%",
    responseTime: "2.3s",
  },
  {
    name: "Document Storage",
    status: "operational",
    uptime: "99.99%",
    responseTime: "124ms",
  },
  {
    name: "Authentication Service",
    status: "operational",
    uptime: "100%",
    responseTime: "67ms",
  },
  {
    name: "Webhooks & Integrations",
    status: "operational",
    uptime: "99.97%",
    responseTime: "198ms",
  },
];

const incidents: Incident[] = [
  {
    id: "1",
    title: "Scheduled Maintenance - Database Upgrade",
    status: "resolved",
    date: "2025-10-10",
    updates: [
      {
        timestamp: "2025-10-10 02:00 UTC",
        message: "Maintenance started. Services temporarily unavailable.",
      },
      {
        timestamp: "2025-10-10 02:45 UTC",
        message: "Database upgrade in progress. 80% complete.",
      },
      {
        timestamp: "2025-10-10 03:15 UTC",
        message: "Maintenance completed. All services restored.",
      },
    ],
  },
  {
    id: "2",
    title: "API Response Time Slowdown",
    status: "resolved",
    date: "2025-09-28",
    updates: [
      {
        timestamp: "2025-09-28 14:22 UTC",
        message: "We are investigating reports of slow API response times.",
      },
      {
        timestamp: "2025-09-28 14:45 UTC",
        message: "Issue identified: database query optimization needed.",
      },
      {
        timestamp: "2025-09-28 15:30 UTC",
        message: "Fix deployed. Performance restored to normal levels.",
      },
    ],
  },
];

export default function StatusPage() {
  const allOperational = services.every(
    (service) => service.status === "operational",
  );

  return (
    <PageShell
      title="System Status"
      subtitle="Real-time status of GalaxyCo.ai services"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Status" }]}
    >
      <div className="space-y-8">
        {/* Overall Status Banner */}
        <div
          className={cn(
            "rounded-lg border-2 p-6",
            allOperational
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
              : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
          )}
        >
          <div className="flex items-center gap-3">
            {allOperational ? (
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            )}
            <div>
              <h2 className="text-xl font-bold">
                {allOperational
                  ? "All Systems Operational"
                  : "Some Services Degraded"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {allOperational
                  ? "All services are running smoothly"
                  : "We&apos;re experiencing issues with some services"}
              </p>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Service Status</h3>
          <div className="space-y-3">
            {services.map((service) => {
              const config = statusConfig[service.status];
              const Icon = config.icon;

              return (
                <div
                  key={service.name}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          config.className,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {config.label}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-8 text-sm">
                      <div className="text-right">
                        <p className="font-semibold">{service.uptime}</p>
                        <p className="text-muted-foreground">Uptime</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{service.responseTime}</p>
                        <p className="text-muted-foreground">Response Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Uptime Chart Placeholder */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">90-Day Uptime History</h3>
          </div>
          <div className="flex items-end gap-1 h-24">
            {Array.from({ length: 90 }).map((_, i) => {
              const height = 85 + Math.random() * 15;
              const isDown = Math.random() < 0.02;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-sm transition-all hover:opacity-80",
                    isDown
                      ? "bg-red-500 dark:bg-red-600"
                      : "bg-green-500 dark:bg-green-600",
                  )}
                  style={{ height: `${height}%` }}
                  title={`Day ${i + 1}: ${isDown ? "Incident" : "Operational"}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Incident History */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Incidents</h3>
          {incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold mb-1">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(incident.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        incident.status === "resolved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : incident.status === "monitoring"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
                      )}
                    >
                      {incident.status === "resolved"
                        ? "Resolved"
                        : incident.status === "monitoring"
                          ? "Monitoring"
                          : "Investigating"}
                    </span>
                  </div>

                  {/* Updates Timeline */}
                  <div className="space-y-3 border-l-2 border-border pl-4 ml-2">
                    {incident.updates.map((update, index) => (
                      <div key={index}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {update.timestamp}
                        </p>
                        <p className="text-sm">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">
                No Recent Incidents
              </h4>
              <p className="text-muted-foreground">
                All services have been running smoothly
              </p>
            </div>
          )}
        </div>

        {/* Subscribe to Updates */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h4 className="font-semibold mb-2">Subscribe to Status Updates</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Get notified when we post new incidents or maintenance windows
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
