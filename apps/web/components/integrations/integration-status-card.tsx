/**
 * Integration Status Card
 * Shows connection status and allows reconnect/disconnect
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageCircle, Users, Calendar, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { initiateOAuthFlow } from '@/lib/integrations/oauth-client';
import { toast } from 'sonner';
import type { IntegrationType } from '@/lib/integrations/integration-config';
import { DisconnectIntegrationDialog } from './disconnect-integration-dialog';

interface IntegrationStatusCardProps {
  integrationId: IntegrationType;
  onReconnect?: () => void;
  onDisconnect?: () => void;
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

const integrationDescriptions: Record<IntegrationType, string> = {
  gmail: 'Send and receive emails',
  slack: 'Post messages and read channels',
  hubspot: 'Manage contacts and deals',
  'google-calendar': 'Create and manage calendar events',
};

export function IntegrationStatusCard({
  integrationId,
  onReconnect,
  onDisconnect,
}: IntegrationStatusCardProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded: isAuthLoaded } = useAuth();

  const Icon = integrationIcons[integrationId] || Mail;
  const label = integrationLabels[integrationId] || integrationId;
  const description = integrationDescriptions[integrationId] || '';

  // Check connection status (wait for auth to load first)
  useEffect(() => {
    async function checkStatus() {
      // Wait for Clerk auth to load before making request
      if (!isAuthLoaded) {
        return;
      }

      try {
        const response = await fetch(`/api/integrations/status?integrationId=${integrationId}`);
        const data = await response.json();
        setIsConnected(data.connected);
      } catch (error) {
        console.error('Failed to check integration status:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkStatus();
  }, [integrationId, isAuthLoaded]);

  async function handleReconnect() {
    setIsReconnecting(true);

    try {
      // Use direct OAuth flow (bypasses backend API auth issues)
      initiateOAuthFlow(integrationId);
      // Note: User will be redirected to OAuth provider, so no need to reset state
    } catch (error) {
      console.error('OAuth initiation error:', error);
      toast.error('Failed to start OAuth flow');
      setIsReconnecting(false);
    }
  }

  function handleDisconnectSuccess() {
    setIsConnected(false);
    onDisconnect?.();
  }

  if (isLoading || !isAuthLoaded) {
    return (
      <Card
        className="p-6"
        role="status"
        aria-label={`Loading ${label} integration status`}
        aria-busy="true"
      >
        <div className="flex items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-hidden="true" />
          <div>
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2" />
          </div>
        </div>
      </Card>
    );
  }

  const statusText = isConnected ? 'Connected' : 'Not connected';
  const cardAriaLabel = `${label} integration: ${statusText}`;
  const descriptionId = `${integrationId}-description`;

  return (
    <Card
      className="p-6"
      role="article"
      aria-label={cardAriaLabel}
      aria-describedby={descriptionId}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-muted p-3" aria-hidden="true">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{label}</h3>
              {isConnected ? (
                <Badge
                  variant="default"
                  className="gap-1"
                  role="status"
                  aria-label={`${label} is connected`}
                >
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="gap-1"
                  role="status"
                  aria-label={`${label} is not connected`}
                >
                  <XCircle className="h-3 w-3" aria-hidden="true" />
                  Not Connected
                </Badge>
              )}
            </div>
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isConnected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReconnect}
                disabled={isReconnecting}
                aria-label={`Reconnect ${label} integration`}
                aria-busy={isReconnecting}
              >
                {isReconnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Reconnecting...
                  </>
                ) : (
                  'Reconnect'
                )}
              </Button>
              <DisconnectIntegrationDialog
                integrationId={integrationId}
                integrationLabel={label}
                onSuccess={handleDisconnectSuccess}
              />
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleReconnect}
              disabled={isReconnecting}
              aria-label={`Connect ${label} integration`}
              aria-busy={isReconnecting}
            >
              {isReconnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
