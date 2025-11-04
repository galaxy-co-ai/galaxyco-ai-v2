/**
 * Integration Node Configuration Component
 * Allows users to configure integration actions in the Flow Builder
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  getIntegration,
  type IntegrationType,
  type IntegrationAction,
} from '@/lib/integrations/integration-config';
import { ConnectIntegrationButton } from './connect-integration-button';

interface IntegrationNodeConfigProps {
  isOpen: boolean;
  onClose: () => void;
  integrationId: IntegrationType;
  onSave: (config: { action: IntegrationAction; parameters: Record<string, any> }) => void;
  initialConfig?: {
    action: IntegrationAction;
    parameters: Record<string, any>;
  };
}

export function IntegrationNodeConfig({
  isOpen,
  onClose,
  integrationId,
  onSave,
  initialConfig,
}: IntegrationNodeConfigProps) {
  const [selectedAction, setSelectedAction] = useState<IntegrationAction | null>(
    initialConfig?.action || null,
  );
  const [parameters, setParameters] = useState<Record<string, any>>(
    initialConfig?.parameters || {},
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  const integration = getIntegration(integrationId);

  // Check if user has connected this integration
  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch(`/api/integrations/status?integrationId=${integrationId}`);
        const data = await response.json();
        setIsConnected(data.connected);
      } catch (error) {
        console.error('Failed to check connection:', error);
        setIsConnected(false);
      } finally {
        setIsCheckingConnection(false);
      }
    }

    if (isOpen) {
      checkConnection();
    }
  }, [integrationId, isOpen]);

  function handleParameterChange(inputId: string, value: any) {
    setParameters((prev) => ({
      ...prev,
      [inputId]: value,
    }));
  }

  function handleSave() {
    if (!selectedAction) return;

    onSave({
      action: selectedAction,
      parameters,
    });

    onClose();
  }

  if (!integration) {
    return null;
  }

  const selectedActionConfig = integration.actions.find((a) => a.id === selectedAction);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure {integration.name} Action</DialogTitle>
          <DialogDescription>
            Set up how this node will interact with {integration.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Connection Status */}
          {isCheckingConnection ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Checking connection status...</span>
            </div>
          ) : !isConnected ? (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">Connection Required</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You need to connect your {integration.name} account before using this
                    integration.
                  </p>
                  <ConnectIntegrationButton
                    integrationId={integrationId}
                    onSuccess={() => setIsConnected(true)}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-sm text-success flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              Connected to {integration.name}
            </div>
          )}

          {/* Action Selection */}
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select
              value={selectedAction || undefined}
              onValueChange={(value) => setSelectedAction(value as IntegrationAction)}
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                {integration.actions.map((action) => (
                  <SelectItem key={action.id} value={action.id}>
                    <div>
                      <div className="font-medium">{action.name}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Parameters */}
          {selectedActionConfig && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">Parameters</h4>
                <Badge variant="outline" className="text-xs">
                  {selectedActionConfig.inputs.filter((i) => i.required).length} required
                </Badge>
              </div>

              {selectedActionConfig.inputs.map((input) => (
                <div key={input.id} className="space-y-2">
                  <Label htmlFor={input.id}>
                    {input.name}
                    {input.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {input.description && (
                    <p className="text-xs text-muted-foreground">{input.description}</p>
                  )}
                  {input.type === 'select' && input.options ? (
                    <Select
                      value={parameters[input.id]}
                      onValueChange={(value) => handleParameterChange(input.id, value)}
                    >
                      <SelectTrigger id={input.id}>
                        <SelectValue placeholder={input.placeholder || 'Select an option'} />
                      </SelectTrigger>
                      <SelectContent>
                        {input.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : input.type === 'string' && input.id.toLowerCase().includes('body') ? (
                    <Textarea
                      id={input.id}
                      value={parameters[input.id] || ''}
                      onChange={(e) => handleParameterChange(input.id, e.target.value)}
                      placeholder={input.placeholder}
                      rows={4}
                    />
                  ) : (
                    <Input
                      id={input.id}
                      type={
                        input.type === 'email'
                          ? 'email'
                          : input.type === 'number'
                            ? 'number'
                            : 'text'
                      }
                      value={parameters[input.id] || ''}
                      onChange={(e) =>
                        handleParameterChange(
                          input.id,
                          input.type === 'number' ? Number(e.target.value) : e.target.value,
                        )
                      }
                      placeholder={input.placeholder}
                      required={input.required}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedAction || !isConnected}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
