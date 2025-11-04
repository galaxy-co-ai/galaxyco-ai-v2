'use client';

import { useState } from 'react';
import { Clock, Webhook, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { TriggerType, ScheduleConfigInput } from '@/lib/agents/types';
import { SCHEDULE_PRESETS, TIMEZONE_OPTIONS } from '@/lib/agents/types';

interface ScheduleConfigProps {
  config: Partial<ScheduleConfigInput>;
  onChange: (config: Partial<ScheduleConfigInput>) => void;
}

export function ScheduleConfig({ config, onChange }: ScheduleConfigProps) {
  const [selectedPreset, setSelectedPreset] = useState('daily-9am');

  const handleTriggerTypeChange = (type: TriggerType) => {
    onChange({ ...config, triggerType: type });
  };

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    if (value !== 'custom') {
      const preset = SCHEDULE_PRESETS.find((p) => p.value === value);
      if (preset?.cron) {
        onChange({ ...config, cron: preset.cron });
      }
    }
  };

  const handleCronChange = (cron: string) => {
    onChange({ ...config, cron });
    setSelectedPreset('custom');
  };

  return (
    <div className="space-y-6">
      {/* Trigger Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Trigger Type</Label>
        <RadioGroup
          value={config.triggerType || 'manual'}
          onValueChange={(value: string) => handleTriggerTypeChange(value as TriggerType)}
          className="space-y-3"
        >
          <div className="flex items-start space-x-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
            <RadioGroupItem value="manual" id="manual" className="mt-0.5" />
            <div className="flex-1">
              <label
                htmlFor="manual"
                className="flex items-center gap-2 font-medium text-sm cursor-pointer"
              >
                <Clock className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                Manual
              </label>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Run manually or via API call
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
            <RadioGroupItem value="scheduled" id="scheduled" className="mt-0.5" />
            <div className="flex-1">
              <label
                htmlFor="scheduled"
                className="flex items-center gap-2 font-medium text-sm cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                Scheduled
              </label>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Run on a recurring schedule
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
            <RadioGroupItem value="webhook" id="webhook" className="mt-0.5" />
            <div className="flex-1">
              <label
                htmlFor="webhook"
                className="flex items-center gap-2 font-medium text-sm cursor-pointer"
              >
                <Webhook className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                Webhook
              </label>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Trigger via external webhook
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Scheduled Configuration */}
      {config.triggerType === 'scheduled' && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <div className="space-y-2">
            <Label htmlFor="schedule-preset" className="text-sm font-medium">
              Schedule
            </Label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger id="schedule-preset">
                <SelectValue placeholder="Select a schedule" />
              </SelectTrigger>
              <SelectContent>
                {SCHEDULE_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{preset.label}</span>
                      {preset.description && (
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {preset.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPreset === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="cron" className="text-sm font-medium">
                Cron Expression
              </Label>
              <Input
                id="cron"
                placeholder="0 9 * * *"
                value={config.cron || ''}
                onChange={(e) => handleCronChange(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Format: minute hour day month weekday (e.g., 0 9 * * * = 9 AM daily)
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-sm font-medium">
              Timezone
            </Label>
            <Select
              value={config.timezone || 'America/Chicago'}
              onValueChange={(value) => onChange({ ...config, timezone: value })}
            >
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Webhook Configuration */}
      {config.triggerType === 'webhook' && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Webhook URL (will be generated)
            </p>
            <code className="text-xs text-neutral-600 dark:text-neutral-400 break-all">
              https://api.galaxyco.ai/webhooks/agents/[agent-id]
            </code>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3">
              A secret key will be provided after activation for authenticating webhook requests.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
