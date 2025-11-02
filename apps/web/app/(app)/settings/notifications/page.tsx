'use client';

import { useState, useEffect } from 'react';
import { FormPage } from '@/components/templates/form-page';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Bell, Mail, Smartphone, Monitor } from 'lucide-react';

type NotificationPreferences = {
  email?: {
    agentUpdates?: boolean;
    workflowAlerts?: boolean;
    teamActivity?: boolean;
    weeklySummary?: boolean;
    securityAlerts?: boolean;
  };
  push?: {
    agentUpdates?: boolean;
    workflowAlerts?: boolean;
    teamActivity?: boolean;
    mentions?: boolean;
  };
  inApp?: {
    agentUpdates?: boolean;
    workflowAlerts?: boolean;
    teamActivity?: boolean;
    mentions?: boolean;
    comments?: boolean;
  };
};

export default function NotificationsSettingsPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Email Notifications
  const [emailAgentUpdates, setEmailAgentUpdates] = useState(true);
  const [emailWorkflowAlerts, setEmailWorkflowAlerts] = useState(true);
  const [emailTeamActivity, setEmailTeamActivity] = useState(false);
  const [emailWeeklySummary, setEmailWeeklySummary] = useState(true);
  const [emailSecurityAlerts, setEmailSecurityAlerts] = useState(true);

  // Push Notifications
  const [pushAgentUpdates, setPushAgentUpdates] = useState(true);
  const [pushWorkflowAlerts, setPushWorkflowAlerts] = useState(true);
  const [pushTeamActivity, setPushTeamActivity] = useState(false);
  const [pushMentions, setPushMentions] = useState(true);

  // In-App Notifications
  const [inAppAgentUpdates, setInAppAgentUpdates] = useState(true);
  const [inAppWorkflowAlerts, setInAppWorkflowAlerts] = useState(true);
  const [inAppTeamActivity, setInAppTeamActivity] = useState(true);
  const [inAppMentions, setInAppMentions] = useState(true);
  const [inAppComments, setInAppComments] = useState(true);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const res = await fetch('/api/users/me/preferences');
        if (!res.ok) throw new Error('Failed to fetch preferences');
        const data = await res.json();
        const prefs = data.preferences.notifications as NotificationPreferences;

        // Set email preferences
        if (prefs?.email) {
          setEmailAgentUpdates(prefs.email.agentUpdates ?? true);
          setEmailWorkflowAlerts(prefs.email.workflowAlerts ?? true);
          setEmailTeamActivity(prefs.email.teamActivity ?? false);
          setEmailWeeklySummary(prefs.email.weeklySummary ?? true);
          setEmailSecurityAlerts(prefs.email.securityAlerts ?? true);
        }

        // Set push preferences
        if (prefs?.push) {
          setPushAgentUpdates(prefs.push.agentUpdates ?? true);
          setPushWorkflowAlerts(prefs.push.workflowAlerts ?? true);
          setPushTeamActivity(prefs.push.teamActivity ?? false);
          setPushMentions(prefs.push.mentions ?? true);
        }

        // Set in-app preferences
        if (prefs?.inApp) {
          setInAppAgentUpdates(prefs.inApp.agentUpdates ?? true);
          setInAppWorkflowAlerts(prefs.inApp.workflowAlerts ?? true);
          setInAppTeamActivity(prefs.inApp.teamActivity ?? true);
          setInAppMentions(prefs.inApp.mentions ?? true);
          setInAppComments(prefs.inApp.comments ?? true);
        }
      } catch (error) {
        toast.error('Failed to load notification preferences');
      } finally {
        setIsPageLoading(false);
      }
    }

    fetchPreferences();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const preferences = {
        notifications: {
          email: {
            agentUpdates: emailAgentUpdates,
            workflowAlerts: emailWorkflowAlerts,
            teamActivity: emailTeamActivity,
            weeklySummary: emailWeeklySummary,
            securityAlerts: emailSecurityAlerts,
          },
          push: {
            agentUpdates: pushAgentUpdates,
            workflowAlerts: pushWorkflowAlerts,
            teamActivity: pushTeamActivity,
            mentions: pushMentions,
          },
          inApp: {
            agentUpdates: inAppAgentUpdates,
            workflowAlerts: inAppWorkflowAlerts,
            teamActivity: inAppTeamActivity,
            mentions: inAppMentions,
            comments: inAppComments,
          },
        },
      };

      const res = await fetch('/api/users/me/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!res.ok) throw new Error('Failed to update preferences');
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (isPageLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <FormPage
      title="Notification Preferences"
      subtitle="Control how and when you receive notifications"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', href: '/settings' },
        { label: 'Notifications' },
      ]}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    >
      <div className="space-y-8">
        {/* Email Notifications */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
              <Mail className="size-5 text-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Agent Updates</p>
                <p className="text-sm text-muted-foreground">
                  When your agents complete tasks or encounter errors
                </p>
              </div>
              <Switch checked={emailAgentUpdates} onCheckedChange={setEmailAgentUpdates} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Workflow Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Critical workflow failures and status changes
                </p>
              </div>
              <Switch checked={emailWorkflowAlerts} onCheckedChange={setEmailWorkflowAlerts} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Team Activity</p>
                <p className="text-sm text-muted-foreground">
                  When team members make changes or leave comments
                </p>
              </div>
              <Switch checked={emailTeamActivity} onCheckedChange={setEmailTeamActivity} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">
                  A digest of your workspace activity every week
                </p>
              </div>
              <Switch checked={emailWeeklySummary} onCheckedChange={setEmailWeeklySummary} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Important security and account updates
                </p>
              </div>
              <Switch
                checked={emailSecurityAlerts}
                onCheckedChange={setEmailSecurityAlerts}
                disabled
              />
            </div>
          </div>
        </Card>

        {/* Push Notifications */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
              <Smartphone className="size-5 text-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your mobile devices
              </p>
            </div>
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Agent Updates</p>
                <p className="text-sm text-muted-foreground">Real-time updates from your agents</p>
              </div>
              <Switch checked={pushAgentUpdates} onCheckedChange={setPushAgentUpdates} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Workflow Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Immediate alerts for critical workflow issues
                </p>
              </div>
              <Switch checked={pushWorkflowAlerts} onCheckedChange={setPushWorkflowAlerts} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Team Activity</p>
                <p className="text-sm text-muted-foreground">Updates from team members</p>
              </div>
              <Switch checked={pushTeamActivity} onCheckedChange={setPushTeamActivity} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Mentions</p>
                <p className="text-sm text-muted-foreground">
                  When someone mentions you in a comment
                </p>
              </div>
              <Switch checked={pushMentions} onCheckedChange={setPushMentions} />
            </div>
          </div>
        </Card>

        {/* In-App Notifications */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="size-5 text-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">In-App Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Show notifications in the app notification center
              </p>
            </div>
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Agent Updates</p>
                <p className="text-sm text-muted-foreground">
                  Agent execution results and status changes
                </p>
              </div>
              <Switch checked={inAppAgentUpdates} onCheckedChange={setInAppAgentUpdates} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Workflow Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Workflow status and error notifications
                </p>
              </div>
              <Switch checked={inAppWorkflowAlerts} onCheckedChange={setInAppWorkflowAlerts} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Team Activity</p>
                <p className="text-sm text-muted-foreground">Team member actions and updates</p>
              </div>
              <Switch checked={inAppTeamActivity} onCheckedChange={setInAppTeamActivity} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Mentions</p>
                <p className="text-sm text-muted-foreground">
                  When you are mentioned in discussions
                </p>
              </div>
              <Switch checked={inAppMentions} onCheckedChange={setInAppMentions} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Comments & Replies</p>
                <p className="text-sm text-muted-foreground">
                  New comments and replies on your items
                </p>
              </div>
              <Switch checked={inAppComments} onCheckedChange={setInAppComments} />
            </div>
          </div>
        </Card>

        {/* Notification Schedule */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
              <Monitor className="size-5 text-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Notification Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Control when you receive notifications
              </p>
            </div>
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Pause All Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable all non-critical notifications
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Do Not Disturb</p>
                <p className="text-sm text-muted-foreground">
                  Automatically enabled from 10 PM to 8 AM
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </FormPage>
  );
}
