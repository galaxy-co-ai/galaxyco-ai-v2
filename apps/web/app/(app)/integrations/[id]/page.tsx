import { Metadata } from "next";
import { ArrowLeft, Settings, ExternalLink, Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const metadata: Metadata = {
  title: "Integration Details | GalaxyCo.ai",
  description: "Configure and manage integration",
};

// Mock integration data
const integration = {
  id: "salesforce",
  name: "Salesforce",
  description: "Sync contacts, leads, and opportunities with Salesforce CRM",
  category: "CRM",
  status: "connected",
  logo: "🔵",
  website: "https://salesforce.com",
  features: [
    "Two-way contact sync",
    "Lead management",
    "Opportunity tracking",
    "Custom field mapping",
    "Real-time updates",
  ],
  pricing: "Free",
  connectedAt: "2025-10-15",
  lastSync: "2 hours ago",
};

export default function IntegrationDetailPage() {
  const isConnected = integration.status === "connected";

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/integrations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Integrations
              </Link>
            </Button>
          </div>
          {isConnected && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Integration Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-16 w-16 rounded-lg bg-background-subtle flex items-center justify-center text-4xl">
              {integration.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold">{integration.name}</h1>
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {integration.status}
                </Badge>
              </div>
              <p className="text-foreground-muted mb-3">
                {integration.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-foreground-muted">
                  Category: {integration.category}
                </span>
                <span className="text-foreground-muted">·</span>
                <span className="text-foreground-muted">
                  {integration.pricing}
                </span>
                <span className="text-foreground-muted">·</span>
                <a
                  href={integration.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Visit website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {isConnected ? (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-sm text-foreground-muted mb-1">
                  Connected on{" "}
                  {new Date(integration.connectedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-foreground-muted">
                  Last synced: {integration.lastSync}
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Disconnect
              </Button>
            </div>
          ) : (
            <Button size="lg" className="w-full">
              Connect {integration.name}
            </Button>
          )}
        </Card>

        {/* Features */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Features</h2>
          <ul className="space-y-3">
            {integration.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Settings (if connected) */}
        {isConnected && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Auto-sync</p>
                  <p className="text-sm text-foreground-muted">
                    Automatically sync data every hour
                  </p>
                </div>
                <Switch defaultChecked aria-label="Toggle auto-sync" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Two-way sync</p>
                  <p className="text-sm text-foreground-muted">
                    Sync changes in both directions
                  </p>
                </div>
                <Switch defaultChecked aria-label="Toggle two-way sync" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email notifications</p>
                  <p className="text-sm text-foreground-muted">
                    Get notified about sync errors
                  </p>
                </div>
                <Switch aria-label="Toggle email notifications" />
              </div>
            </div>
          </Card>
        )}

        {/* Sync History */}
        {isConnected && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Sync Activity</h2>
            <div className="space-y-3">
              {[
                {
                  time: "2 hours ago",
                  status: "success",
                  message: "Synced 45 contacts",
                },
                {
                  time: "1 day ago",
                  status: "success",
                  message: "Synced 12 leads",
                },
                {
                  time: "2 days ago",
                  status: "error",
                  message: "Sync failed: API rate limit",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                >
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      activity.status === "success"
                        ? "bg-success"
                        : "bg-destructive"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-foreground-muted">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
