'use client';

import React from 'react';
import { Select, Textarea, Input } from '@/components/ui/Input';
import { AgentBuilderState } from '@/hooks/use-agent-builder';
import { colors, spacing, typography, radius } from '@/lib/constants/design-system';

interface ConfigurationFormProps {
  configuration: AgentBuilderState['configuration'];
  errors: Record<string, string>;
  onChange: (updates: Partial<AgentBuilderState['configuration']>) => void;
  disabled?: boolean;
}

const TRIGGER_OPTIONS = [
  { value: 'webhook', label: 'Webhook - Trigger via API call' },
  { value: 'schedule', label: 'Schedule - Run on a schedule' },
  { value: 'manual', label: 'Manual - Run manually' },
  { value: 'event', label: 'Event - Trigger on system event' },
];

const AI_PROVIDER_OPTIONS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'custom', label: 'Custom Provider' },
];

const MODEL_OPTIONS: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: 'gpt-4', label: 'GPT-4 - Most capable' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo - Faster & cheaper' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo - Fast & efficient' },
  ],
  anthropic: [
    { value: 'claude-3-opus', label: 'Claude 3 Opus - Most capable' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet - Balanced' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku - Fastest' },
  ],
  custom: [
    { value: 'custom-model', label: 'Custom Model' },
  ],
};

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  configuration,
  errors,
  onChange,
  disabled = false,
}) => {
  const currentModelOptions = MODEL_OPTIONS[configuration.aiProvider] || MODEL_OPTIONS.openai;

  // Ensure model is valid for current provider
  const isModelValid = currentModelOptions.some(opt => opt.value === configuration.model);
  const displayModel = isModelValid ? configuration.model : currentModelOptions[0].value;

  React.useEffect(() => {
    if (!isModelValid) {
      onChange({ model: currentModelOptions[0].value });
    }
  }, [configuration.aiProvider, isModelValid, currentModelOptions, onChange]);

  return (
    <div style={{ marginBottom: spacing['2xl'] }}>
      {/* Section Header */}
      <div style={{ marginBottom: spacing.xl }}>
        <h2
          style={{
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.semibold,
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}
        >
          Configuration
        </h2>
        <p
          style={{
            fontSize: typography.sizes.sm,
            color: colors.text.secondary,
          }}
        >
          Configure how and when your agent runs
        </p>
      </div>

      {/* Trigger */}
      <Select
        label="Trigger Type"
        value={configuration.trigger}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ trigger: e.target.value as any })}
        options={TRIGGER_OPTIONS}
        disabled={disabled}
        helperText="Choose how this agent should be triggered"
      />

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: colors.border.default,
          margin: `${spacing.xl} 0`,
        }}
      />

      {/* AI Provider Section */}
      <div style={{ marginBottom: spacing.xl }}>
        <h3
          style={{
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.semibold,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          AI Settings
        </h3>
        <p
          style={{
            fontSize: typography.sizes.sm,
            color: colors.text.tertiary,
            marginBottom: spacing.lg,
          }}
        >
          Configure the AI model and behavior for this agent
        </p>

        {/* AI Provider */}
        <Select
          label="AI Provider"
          value={configuration.aiProvider}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ aiProvider: e.target.value as any })}
          options={AI_PROVIDER_OPTIONS}
          disabled={disabled}
          required
        />

        {/* Model */}
        <Select
          label="Model"
          value={displayModel}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ model: e.target.value })}
          options={currentModelOptions}
          disabled={disabled}
          required
          helperText="Choose the AI model to power this agent"
        />

        {/* Temperature Slider */}
        <div style={{ marginBottom: spacing.lg }}>
          <label
            style={{
              display: 'block',
              marginBottom: spacing.xs,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              color: colors.text.primary,
            }}
          >
            Temperature: {configuration.temperature.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={configuration.temperature}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ temperature: parseFloat(e.target.value) })}
            disabled={disabled}
            style={{
              width: '100%',
              marginBottom: spacing.xs,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: typography.sizes.xs,
              color: colors.text.tertiary,
            }}
          >
            <span>0.0 (Precise)</span>
            <span>1.0 (Balanced)</span>
            <span>2.0 (Creative)</span>
          </div>
          <p
            style={{
              marginTop: spacing.xs,
              fontSize: typography.sizes.sm,
              color: colors.text.tertiary,
            }}
          >
            Controls randomness. Lower values are more focused and deterministic, higher values are more creative.
          </p>
        </div>

        {/* System Prompt */}
        <Textarea
          label="System Prompt"
          value={configuration.systemPrompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ systemPrompt: e.target.value })}
          error={errors.systemPrompt}
          placeholder="You are a helpful AI assistant that..."
          required
          disabled={disabled}
          maxLength={2000}
          helperText={`${configuration.systemPrompt.length}/2000 characters - This defines the agent's behavior and personality`}
          style={{ minHeight: '160px', fontFamily: 'monospace' }}
        />

        {/* Max Tokens (Optional) */}
        <Input
          label="Max Tokens (Optional)"
          type="number"
          value={configuration.maxTokens?.toString() || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
            onChange({ maxTokens: value });
          }}
          error={errors.maxTokens}
          placeholder="e.g., 1000"
          disabled={disabled}
          min={1}
          max={128000}
          helperText="Maximum number of tokens to generate (leave empty for model default)"
        />
      </div>
    </div>
  );
};
