import { Metadata } from "next";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Conversion Analytics | GalaxyCo.ai",
  description: "Track conversion rates and funnel performance",
};

export default function ConversionsAnalyticsPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Conversion Analytics</h1>
        <p className="text-foreground-muted">
          Track conversion rates and funnel performance across your workflows
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Overall Conversion Rate
            </span>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">24.8%</span>
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3.2%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Total Conversions
            </span>
            <Users className="h-5 w-5 text-success" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">1,847</span>
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Revenue Generated
            </span>
            <DollarSign className="h-5 w-5 text-warning" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">$47.2K</span>
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.4%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Avg. Time to Convert
            </span>
            <Target className="h-5 w-5 text-foreground-muted" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">3.2d</span>
            <span className="flex items-center text-sm text-destructive">
              <TrendingDown className="h-4 w-4 mr-1" />
              +0.4d
            </span>
          </div>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Conversion Funnel</h2>
        <div className="space-y-4">
          {[
            { stage: "Visitors", count: 12450, percentage: 100, dropOff: 0 },
            { stage: "Sign Ups", count: 4980, percentage: 40, dropOff: 60 },
            { stage: "Activated", count: 3486, percentage: 28, dropOff: 12 },
            { stage: "Trial Started", count: 2490, percentage: 20, dropOff: 8 },
            { stage: "Converted", count: 1847, percentage: 14.8, dropOff: 5.2 },
          ].map((stage, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{stage.stage}</span>
                  {stage.dropOff > 0 && (
                    <Badge variant="secondary" size="sm">
                      {stage.dropOff}% drop-off
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground-muted">
                    {stage.count.toLocaleString()}
                  </span>
                  <span className="font-semibold">{stage.percentage}%</span>
                </div>
              </div>
              <div className="relative h-12 bg-background-subtle rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 flex items-center px-4"
                  style={{ width: `${stage.percentage}%` }}
                >
                  <span className="text-sm text-primary-foreground font-medium">
                    {stage.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Converting Workflows */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Top Converting Workflows</h2>
        <div className="space-y-4">
          {[
            {
              name: "Email Nurture Campaign",
              conversions: 487,
              rate: 32.4,
              trend: "up",
            },
            {
              name: "Product Demo Follow-up",
              conversions: 356,
              rate: 28.7,
              trend: "up",
            },
            {
              name: "Trial Expiration Reminder",
              conversions: 289,
              rate: 24.1,
              trend: "down",
            },
            {
              name: "Onboarding Sequence",
              conversions: 245,
              rate: 19.8,
              trend: "up",
            },
          ].map((workflow, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{workflow.name}</h3>
                <p className="text-sm text-foreground-muted">
                  {workflow.conversions} conversions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{workflow.rate}%</span>
                {workflow.trend === "up" ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Conversion by Channel */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Conversion by Channel</h2>
        <div className="space-y-4">
          {[
            {
              channel: "Email",
              conversions: 847,
              rate: 31.2,
              color: "primary",
            },
            { channel: "Chat", conversions: 456, rate: 25.8, color: "success" },
            {
              channel: "Web Form",
              conversions: 334,
              rate: 18.4,
              color: "warning",
            },
            {
              channel: "Phone",
              conversions: 210,
              rate: 12.7,
              color: "destructive",
            },
          ].map((channel, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{channel.channel}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground-muted">
                    {channel.conversions} conversions
                  </span>
                  <span className="font-semibold">{channel.rate}%</span>
                </div>
              </div>
              <div className="h-2 bg-background-subtle rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${channel.color} rounded-full`}
                  style={{ width: `${channel.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
