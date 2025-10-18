"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "GalaxyCo.ai",
    supportEmail: "support@galaxyco.ai",
    signupsEnabled: true,
    maintenanceMode: false,
    twoFactorRequired: false,
  });

  return (
    <PageShell
      title="Platform Settings"
      subtitle="Configure global platform settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Settings" },
      ]}
    >
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="signups">Enable New Signups</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to create accounts
                  </p>
                </div>
                <Switch
                  id="signups"
                  checked={settings.signupsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, signupsEnabled: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put platform in maintenance mode
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Reset</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Require 2FA for All Users</Label>
                  <p className="text-sm text-muted-foreground">
                    Enforce two-factor authentication
                  </p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, twoFactorRequired: checked })
                  }
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Reset</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Integration Settings</h3>
            <p className="text-muted-foreground">
              Configure third-party integrations and API keys
            </p>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Billing Settings</h3>
            <p className="text-muted-foreground">
              Configure payment processors and billing options
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
