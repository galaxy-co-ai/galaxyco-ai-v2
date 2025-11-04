/**
 * Disconnect Integration Dialog
 * Confirmation dialog for disconnecting an integration
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { IntegrationType } from '@/lib/integrations/integration-config';

interface DisconnectIntegrationDialogProps {
  integrationId: IntegrationType;
  integrationLabel: string;
  onSuccess?: () => void;
}

export function DisconnectIntegrationDialog({
  integrationId,
  integrationLabel,
  onSuccess,
}: DisconnectIntegrationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  async function handleDisconnect() {
    setIsDisconnecting(true);

    try {
      const response = await fetch('/api/integrations/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to disconnect');
      }

      toast.success(`Successfully disconnected from ${integrationLabel}`);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error(
        `Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsDisconnecting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          aria-label={`Disconnect ${integrationLabel} integration`}
        >
          Disconnect
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-labelledby="disconnect-dialog-title"
        aria-describedby="disconnect-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="disconnect-dialog-title" className="flex items-center gap-2">
            <AlertTriangle
              className="h-5 w-5 text-destructive"
              aria-hidden="true"
              role="img"
              aria-label="Warning"
            />
            Disconnect {integrationLabel}?
          </DialogTitle>
          <DialogDescription id="disconnect-dialog-description">
            This will remove your connection to {integrationLabel}. Any workflows using this
            integration will stop working until you reconnect.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDisconnecting}
            aria-label="Cancel disconnection"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            aria-label={`Confirm disconnect ${integrationLabel}`}
            aria-busy={isDisconnecting}
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                Disconnecting...
              </>
            ) : (
              'Disconnect'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
