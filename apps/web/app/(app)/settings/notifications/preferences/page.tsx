'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState({
    emailAgent: { success: true, error: true, start: false },
    emailWorkflow: { success: true, error: true, start: false },
    emailBilling: { all: true },
    emailSecurity: { all: true },
    pushAgent: { success: false, error: true, start: false },
    pushWorkflow: { success: false, error: true, start: false },
    slackAgent: { success: true, error: true, start: false },
  });

  const handleSave = () => {
    toast.success('Notification preferences saved');
  };

  const toggle = (category: string, key: string) => {
    setPreferences((prev) => {
      const cat = prev[category as keyof typeof prev] as Record<string, boolean>;
      return {
        ...prev,
        [category]: {
          ...cat,
          [key]: !cat[key],
        },
      };
    });
  };

  return (
    <PageShell
      title="Notification Preferences"
      subtitle="Manage how you receive notifications"
      breadcrumbs={[
        { label: 'Settings', href: '/settings' },
        { label: 'Notifications', href: '/settings/notifications' },
        { label: 'Preferences' },
      ]}
      actions={
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Agent Activity</h3>
              <div className="space-y-2">
                {['success', 'error', 'start'].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`email-agent-${type}`}
                      checked={preferences.emailAgent[type as keyof typeof preferences.emailAgent]}
                      onChange={() => toggle('emailAgent', type)}
                    />
                    <Label htmlFor={`email-agent-${type}`}>Agent {type} notifications</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Workflow Activity</h3>
              <div className="space-y-2">
                {['success', 'error', 'start'].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`email-workflow-${type}`}
                      checked={
                        preferences.emailWorkflow[type as keyof typeof preferences.emailWorkflow]
                      }
                      onChange={() => toggle('emailWorkflow', type)}
                    />
                    <Label htmlFor={`email-workflow-${type}`}>Workflow {type} notifications</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Billing & Security</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="email-billing"
                    checked={preferences.emailBilling.all}
                    onChange={() => toggle('emailBilling', 'all')}
                  />
                  <Label htmlFor="email-billing">Billing updates and invoices</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="email-security"
                    checked={preferences.emailSecurity.all}
                    onChange={() => toggle('emailSecurity', 'all')}
                  />
                  <Label htmlFor="email-security">Security alerts and account activity</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Push Notifications</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Agent Activity</h3>
              <div className="space-y-2">
                {['success', 'error', 'start'].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`push-agent-${type}`}
                      checked={preferences.pushAgent[type as keyof typeof preferences.pushAgent]}
                      onChange={() => toggle('pushAgent', type)}
                    />
                    <Label htmlFor={`push-agent-${type}`}>Agent {type} notifications</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Workflow Activity</h3>
              <div className="space-y-2">
                {['success', 'error', 'start'].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`push-workflow-${type}`}
                      checked={
                        preferences.pushWorkflow[type as keyof typeof preferences.pushWorkflow]
                      }
                      onChange={() => toggle('pushWorkflow', type)}
                    />
                    <Label htmlFor={`push-workflow-${type}`}>Workflow {type} notifications</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slack Integration */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Slack Integration</h2>
          <div className="space-y-2">
            {['success', 'error', 'start'].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`slack-agent-${type}`}
                  checked={preferences.slackAgent[type as keyof typeof preferences.slackAgent]}
                  onChange={() => toggle('slackAgent', type)}
                />
                <Label htmlFor={`slack-agent-${type}`}>Post {type} notifications to Slack</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
