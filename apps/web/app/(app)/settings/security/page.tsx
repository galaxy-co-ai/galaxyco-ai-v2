"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { PageShell } from "@/components/templates/page-shell";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Key,
  Smartphone,
  Monitor,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const activeSessions = [
  {
    id: "1",
    device: "Chrome on MacOS",
    location: "San Francisco, CA",
    ipAddress: "192.168.1.1",
    lastActive: "Just now",
    isCurrent: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "San Francisco, CA",
    ipAddress: "192.168.1.2",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "3",
    device: "Chrome on Windows",
    location: "New York, NY",
    ipAddress: "192.168.2.1",
    lastActive: "1 day ago",
    isCurrent: false,
  },
];

export default function SecuritySettingsPage() {
  const { currentWorkspace } = useWorkspace();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSecurity() {
      if (!currentWorkspace?.id) return;

      try {
        const res = await fetch(
          `/api/workspaces/current/security?workspaceId=${currentWorkspace.id}`,
        );
        if (!res.ok) throw new Error("Failed to fetch security settings");
        const data = await res.json();
        setTwoFactorEnabled(data.security.twoFactorRequired || false);
      } catch (error) {
        toast.error("Failed to load security settings");
      } finally {
        setIsPageLoading(false);
      }
    }

    fetchSecurity();
  }, [currentWorkspace?.id]);

  const handleSubmit = async () => {
    if (!currentWorkspace?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/workspaces/current/security", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          twoFactorRequired: twoFactorEnabled,
        }),
      });

      if (!res.ok) throw new Error("Failed to update security settings");
      toast.success("Security settings updated");
    } catch (error) {
      toast.error("Failed to update security settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageShell
      title="Security Settings"
      subtitle="Manage your account security and authentication"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/settings" },
        { label: "Security" },
      ]}
    >
      <div className="space-y-8">
        {/* Password */}
        <Card className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Password</h3>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <Button>Update Password</Button>
          </div>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  Two-Factor Authentication
                </h3>
                {twoFactorEnabled ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Disabled
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">
                  Use an authenticator app to generate verification codes
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            {twoFactorEnabled && (
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm font-medium">Recovery Codes</p>
                <p className="mb-3 text-xs text-muted-foreground">
                  Save these codes in a secure place. You can use them to access
                  your account if you lose your device.
                </p>
                <Button variant="outline" size="sm">
                  <Key className="mr-2 h-4 w-4" />
                  View Recovery Codes
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Active Sessions */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Manage devices that are currently logged in to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Sign Out All Devices
            </Button>
          </div>
          <div className="space-y-3 border-t border-border pt-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.location} • {session.ipAddress}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last active: {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button variant="ghost" size="sm">
                    Sign Out
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Security Notifications */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">
              Security Notifications
            </h3>
            <p className="text-sm text-muted-foreground">
              Control how you receive security-related notifications
            </p>
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts for suspicious activity
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Login Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone logs in from a new device
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Account Changes</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when account settings are modified
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Account Recovery */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">Account Recovery</h3>
            <p className="text-sm text-muted-foreground">
              Set up recovery options in case you lose access to your account
            </p>
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recovery Email</p>
                <p className="text-sm text-muted-foreground">
                  recovery@example.com
                </p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Recovery Phone</p>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
