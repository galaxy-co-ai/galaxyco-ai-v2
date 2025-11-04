/**
 * Integration Picker
 * Shows all available integrations and allows user to connect
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageCircle, Users, Calendar } from 'lucide-react';
import { ConnectIntegrationButton } from './connect-integration-button';
import {
  getAllIntegrations,
  getIntegrationsByCategory,
  type IntegrationType,
  type IntegrationConfig,
} from '@/lib/integrations/integration-config';

interface IntegrationPickerProps {
  category?: IntegrationConfig['category'];
  onConnect?: (integrationId: IntegrationType, connectionId: string) => void;
  selectedIntegration?: IntegrationType;
}

const integrationIcons: Record<IntegrationType, typeof Mail> = {
  gmail: Mail,
  slack: MessageCircle,
  hubspot: Users,
  'google-calendar': Calendar,
};

const categoryColors: Record<IntegrationConfig['category'], string> = {
  communication: 'bg-blue-500',
  crm: 'bg-orange-500',
  productivity: 'bg-green-500',
};

export function IntegrationPicker({
  category,
  onConnect,
  selectedIntegration,
}: IntegrationPickerProps) {
  const integrations = category ? getIntegrationsByCategory(category) : getAllIntegrations();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map((integration) => {
        const Icon = integrationIcons[integration.id] || Mail;
        const isSelected = selectedIntegration === integration.id;

        return (
          <Card
            key={integration.id}
            className={`p-6 hover:shadow-md transition-shadow ${
              isSelected ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`rounded-lg ${categoryColors[integration.category]} bg-opacity-10 p-3`}
              >
                <Icon
                  className={`h-6 w-6 ${categoryColors[integration.category].replace('bg-', 'text-')}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{integration.name}</h3>
                  <Badge variant="outline" className="text-xs capitalize">
                    {integration.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {integration.actions.slice(0, 3).map((action) => (
                    <Badge key={action.id} variant="secondary" className="text-xs">
                      {action.name}
                    </Badge>
                  ))}
                  {integration.actions.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{integration.actions.length - 3} more
                    </Badge>
                  )}
                </div>
                <ConnectIntegrationButton
                  integrationId={integration.id}
                  onSuccess={(connectionId) => {
                    onConnect?.(integration.id, connectionId);
                  }}
                  size="sm"
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Compact Integration Picker (for dropdowns/modals)
 */
export function CompactIntegrationPicker({
  onSelect,
  selectedIntegration,
}: {
  onSelect: (integrationId: IntegrationType) => void;
  selectedIntegration?: IntegrationType;
}) {
  const integrations = getAllIntegrations();

  return (
    <div className="space-y-2">
      {integrations.map((integration) => {
        const Icon = integrationIcons[integration.id] || Mail;
        const isSelected = selectedIntegration === integration.id;

        return (
          <button
            key={integration.id}
            onClick={() => onSelect(integration.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
            }`}
          >
            <div className={`rounded-lg ${categoryColors[integration.category]} bg-opacity-10 p-2`}>
              <Icon
                className={`h-4 w-4 ${categoryColors[integration.category].replace('bg-', 'text-')}`}
              />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{integration.name}</div>
              <div className="text-xs text-muted-foreground">
                {integration.actions.length} actions available
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
