'use client';

import { useState } from 'react';
import { Rocket, AlertCircle, Check, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScheduleConfig } from './schedule-config';
import type { ScheduleConfigInput } from '@/lib/agents/types';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string | null;
  agentName: string;
  onDeploy: (scheduleConfig: ScheduleConfigInput) => Promise<void>;
}

export function DeployModal({
  isOpen,
  onClose,
  agentId,
  agentName,
  onDeploy,
}: DeployModalProps) {
  const [scheduleConfig, setScheduleConfig] = useState<Partial<ScheduleConfigInput>>({
    triggerType: 'manual',
    timezone: 'America/Chicago',
    enabled: true,
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDeploy = async () => {
    // Validation
    if (scheduleConfig.triggerType === 'scheduled' && !scheduleConfig.cron) {
      setError('Please configure a schedule');
      return;
    }

    if (!scheduleConfig.triggerType) {
      setError('Please select a trigger type');
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      await onDeploy(scheduleConfig as ScheduleConfigInput);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Deploy error:', err);
      setError(err instanceof Error ? err.message : 'Failed to deploy agent');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleClose = () => {
    if (!isDeploying) {
      onClose();
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Deploy Agent</DialogTitle>
              <DialogDescription className="mt-1">
                Configure how "{agentName}" should be triggered
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Success State */}
        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Agent Deployed!
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {agentName} is now active and ready to run
            </p>
          </div>
        ) : (
          <>
            {/* Configuration */}
            <div className="py-4">
              <ScheduleConfig config={scheduleConfig} onChange={setScheduleConfig} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isDeploying}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={isDeploying || !scheduleConfig.triggerType}
                className="min-w-[120px]"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Deploy
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
