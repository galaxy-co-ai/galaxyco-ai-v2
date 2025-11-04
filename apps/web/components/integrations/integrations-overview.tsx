/**
 * Integrations Overview Component
 * Shows connected integrations at a glance (for dashboard)
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageCircle, Users, Calendar, Plus, Settings, Loader2, Zap } from 'lucide-react';
import type { IntegrationType } from '@/lib/integrations/integration-config';

interface IntegrationStatus {
  id: IntegrationType;
  connected: boolean;
}

const integrationIcons: Record<IntegrationType, typeof Mail> = {
  gmail: Mail,
  slack: MessageCircle,
  hubspot: Users,
  'google-calendar': Calendar,
};

const integrationLabels: Record<IntegrationType, string> = {
  gmail: 'Gmail',
  slack: 'Slack',
  hubspot: 'HubSpot',
  'google-calendar': 'Google Calendar',
};

export function IntegrationsOverview() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkIntegrations() {
      try {
        const integrationIds: IntegrationType[] = ['gmail', 'slack', 'hubspot', 'google-calendar'];

        const statuses = await Promise.all(
          integrationIds.map(async (id) => {
            try {
              const response = await fetch(`/api/integrations/status?integrationId=${id}`);
              const data = await response.json();
              return { id, connected: data.connected };
            } catch (error) {
              return { id, connected: false };
            }
          }),
        );

        setIntegrations(statuses);
      } catch (error) {
        console.error('Failed to check integrations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkIntegrations();
  }, []);

  const connectedCount = integrations.filter((i) => i.connected).length;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading integrations...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Integrations</h3>
            <p className="text-sm text-muted-foreground">
              {connectedCount} of {integrations.length} connected
            </p>
          </div>
          <Link href="/settings/integrations">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </Link>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-2 gap-3">
          {integrations.map((integration) => {
            const Icon = integrationIcons[integration.id];
            const label = integrationLabels[integration.id];

            return (
              <div
                key={integration.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`rounded-lg p-2 ${
                    integration.connected ? 'bg-success/10' : 'bg-muted'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      integration.connected ? 'text-success' : 'text-muted-foreground'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{label}</div>
                  {integration.connected ? (
                    <Badge variant="default" className="text-xs mt-1 h-5">
                      Connected
                    </Badge>
                  ) : (
                    <div className="text-xs text-muted-foreground mt-1">Not connected</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          {connectedCount < integrations.length && (
            <Link href="/settings/integrations" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Connect More
              </Button>
            </Link>
          )}
          <Link href="/workflows/examples" className="flex-1">
            <Button size="sm" className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Browse Examples
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
