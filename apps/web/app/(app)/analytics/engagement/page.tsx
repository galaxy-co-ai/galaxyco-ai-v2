import { Metadata } from "next";
import { Activity, Users, Clock, MousePointer, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Engagement Analytics | GalaxyCo.ai",
  description: "Track user engagement and activity metrics",
};

export default function EngagementAnalyticsPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Engagement Analytics</h1>
        <p className="text-foreground-muted">
          Monitor user engagement and activity across your platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Daily Active Users
            </span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">3,247</span>
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.2%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Avg. Session Duration
            </span>
            <Clock className="h-5 w-5 text-success" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">12m 34s</span>
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +1.5m
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Engagement Rate
            </span>
            <Activity className="h-5 w-5 text-warning" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">68.4%</span>
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +4.1%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Actions per Session
            </span>
            <MousePointer className="h-5 w-5 text-foreground-muted" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">24.7</span>
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3.2
            </span>
          </div>
        </Card>
      </div>

      {/* User Activity Heatmap */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Activity by Day & Hour</h2>
        <div className="overflow-x-auto">
          <div className="inline-grid grid-cols-[auto_repeat(24,minmax(0,1fr))] gap-1 min-w-max">
            {/* Hour Headers */}
            <div />
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="text-xs text-center text-foreground-muted px-1"
              >
                {i}
              </div>
            ))}

            {/* Days */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <>
                <div
                  key={day}
                  className="text-xs text-foreground-muted pr-2 flex items-center"
                >
                  {day}
                </div>
                {Array.from({ length: 24 }, (_, hour) => {
                  const intensity = Math.random(); // Mock data
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`h-8 rounded ${
                        intensity > 0.7
                          ? "bg-primary"
                          : intensity > 0.5
                            ? "bg-primary/70"
                            : intensity > 0.3
                              ? "bg-primary/40"
                              : "bg-background-subtle"
                      }`}
                      title={`${day} ${hour}:00`}
                    />
                  );
                })}
              </>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-foreground-muted">
          <span>Low activity</span>
          <div className="flex gap-1">
            <div className="h-4 w-4 bg-background-subtle rounded" />
            <div className="h-4 w-4 bg-primary/40 rounded" />
            <div className="h-4 w-4 bg-primary/70 rounded" />
            <div className="h-4 w-4 bg-primary rounded" />
          </div>
          <span>High activity</span>
        </div>
      </Card>

      {/* Top Features Used */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Most Used Features</h2>
        <div className="space-y-4">
          {[
            { feature: "Agent Builder", usage: 8734, percentage: 92 },
            { feature: "Workflow Automation", usage: 7456, percentage: 78 },
            { feature: "Contact Management", usage: 6892, percentage: 72 },
            { feature: "Analytics Dashboard", usage: 5234, percentage: 55 },
            { feature: "API Integration", usage: 4187, percentage: 44 },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.feature}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground-muted">
                    {item.usage.toLocaleString()} users
                  </span>
                  <Badge variant="secondary" size="sm">
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
              <div className="h-2 bg-background-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* User Retention */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">User Retention</h2>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {[
            "Day 1",
            "Day 7",
            "Day 14",
            "Day 30",
            "Day 60",
            "Day 90",
            "Day 180",
          ].map((label) => (
            <div
              key={label}
              className="text-xs text-center text-foreground-muted"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[100, 87, 76, 68, 54, 47, 41].map((percentage, index) => (
            <div key={index} className="text-center">
              <div className="h-24 bg-background-subtle rounded-lg mb-2 relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary"
                  style={{ height: `${percentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{percentage}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
