/**
 * Add Integration Node Button
 * Button for Flow Builder to add integration nodes
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { CompactIntegrationPicker } from './integration-picker';
import { IntegrationNodeConfig } from './integration-node-config';
import type { IntegrationType } from '@/lib/integrations/integration-config';

interface AddIntegrationNodeButtonProps {
  onAdd: (nodeData: {
    integration: IntegrationType;
    action: string;
    parameters: Record<string, any>;
  }) => void;
}

export function AddIntegrationNodeButton({ onAdd }: AddIntegrationNodeButtonProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationType | null>(null);

  function handleIntegrationSelect(integrationId: IntegrationType) {
    setSelectedIntegration(integrationId);
    setIsPickerOpen(false);
    setIsConfigOpen(true);
  }

  function handleConfigSave(config: { action: string; parameters: Record<string, any> }) {
    if (!selectedIntegration) return;

    onAdd({
      integration: selectedIntegration,
      action: config.action,
      parameters: config.parameters,
    });

    setIsConfigOpen(false);
    setSelectedIntegration(null);
  }

  return (
    <>
      {/* Integration Picker Dialog */}
      <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Integration</DialogTitle>
            <DialogDescription>Select an integration to add to your workflow</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <CompactIntegrationPicker
              onSelect={handleIntegrationSelect}
              selectedIntegration={selectedIntegration || undefined}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Integration Config Dialog */}
      {selectedIntegration && (
        <IntegrationNodeConfig
          isOpen={isConfigOpen}
          onClose={() => {
            setIsConfigOpen(false);
            setSelectedIntegration(null);
          }}
          integrationId={selectedIntegration}
          onSave={handleConfigSave}
        />
      )}
    </>
  );
}
