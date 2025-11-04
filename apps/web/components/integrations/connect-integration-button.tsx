/**
 * Connect Integration Button
 * Beautiful button that triggers OAuth flow for an integration
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, MessageCircle, Users, Calendar } from 'lucide-react';
import { connectIntegration } from '@/lib/integrations/nango-client';
import { toast } from 'sonner';
import type { IntegrationType } from '@/lib/integrations/integration-config';

interface ConnectIntegrationButtonProps {
  integrationId: IntegrationType;
  onSuccess?: (connectionId: string) => void;
  onError?: (error: string) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
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

export function ConnectIntegrationButton({
  integrationId,
  onSuccess,
  onError,
  variant = 'default',
  size = 'default',
  className,
}: ConnectIntegrationButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const Icon = integrationIcons[integrationId] || Mail;
  const label = integrationLabels[integrationId] || integrationId;

  async function handleConnect() {
    setIsConnecting(true);

    try {
      await connectIntegration(integrationId, {
        onSuccess: (connectionId) => {
          toast.success(`Successfully connected to ${label}!`);
          onSuccess?.(connectionId);
          setIsConnecting(false);
        },
        onError: (error) => {
          toast.error(`Failed to connect to ${label}: ${error}`);
          onError?.(error);
          setIsConnecting(false);
        },
        onClose: () => {
          // User closed the modal
          setIsConnecting(false);
        },
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(`Failed to connect to ${label}`);
      setIsConnecting(false);
    }
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant={variant}
      size={size}
      className={className}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Icon className="h-4 w-4 mr-2" />
          Connect {label}
        </>
      )}
    </Button>
  );
}
