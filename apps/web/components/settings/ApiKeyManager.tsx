'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { colors, spacing, typography, radius } from '@/lib/constants/design-system';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ApiKeyManagerProps {
  className?: string;
}

interface ConfiguredProviders {
  openai: boolean;
  anthropic: boolean;
}

export function ApiKeyManager({ className }: ApiKeyManagerProps) {
  const { workspace } = useWorkspace();
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [configuredProviders, setConfiguredProviders] = useState<ConfiguredProviders>({
    openai: false,
    anthropic: false,
  });

  useEffect(() => {
    loadConfiguredProviders();
  }, [workspace?.id]);

  const loadConfiguredProviders = async () => {
    if (!workspace?.id) return;

    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/api-keys`);
      if (response.ok) {
        const data = await response.json();
        setConfiguredProviders(data.providers);
      }
    } catch (error) {
      console.error('Failed to load configured providers:', error);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter an API key' });
      return;
    }

    if (!workspace) {
      setMessage({ type: 'error', text: 'No workspace selected' });
      return;
    }

    setIsTestingConnection(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/api-keys/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          apiKey,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setMessage({ type: 'success', text: `${selectedProvider} API key is valid!` });
      } else {
        setMessage({ type: 'error', text: data.message || 'API key is invalid' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to test connection' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter an API key' });
      return;
    }

    if (!workspace) {
      setMessage({ type: 'error', text: 'No workspace selected' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/api-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          apiKey,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `${selectedProvider} API key saved successfully!` });
        setApiKey('');
        await loadConfiguredProviders();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save API key' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save API key' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = async (provider: 'openai' | 'anthropic') => {
    if (!confirm(`Remove ${provider} API key?`)) return;

    if (!workspace) {
      setMessage({ type: 'error', text: 'No workspace selected' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/workspaces/${workspace.id}/api-keys?provider=${provider}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setMessage({ type: 'success', text: `${provider} API key removed` });
        await loadConfiguredProviders();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to remove API key' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to remove API key' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <div style={{ marginBottom: spacing.xl }}>
        <h2
          style={{
            fontSize: typography.sizes['2xl'],
            fontWeight: typography.weights.bold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          🔑 API Keys
        </h2>
        <p style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
          Configure your AI provider API keys to enable live agent execution
        </p>
      </div>

      {/* Configured Providers Status */}
      <div style={{ marginBottom: spacing.xl, display: 'flex', gap: spacing.md }}>
        <div
          style={{
            flex: 1,
            padding: spacing.md,
            backgroundColor: configuredProviders.openai
              ? colors.successLight
              : colors.background.secondary,
            border: `1px solid ${configuredProviders.openai ? colors.successColor : colors.border.default}`,
            borderRadius: radius.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <span style={{ fontSize: typography.sizes.lg }}>
              {configuredProviders.openai ? '✅' : '⚪'}
            </span>
            <span
              style={{
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                color: colors.text.primary,
              }}
            >
              OpenAI
            </span>
          </div>
          {configuredProviders.openai && (
            <button
              onClick={() => handleDeleteKey('openai')}
              style={{
                marginTop: spacing.xs,
                fontSize: typography.sizes.xs,
                color: colors.danger,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Remove
            </button>
          )}
        </div>

        <div
          style={{
            flex: 1,
            padding: spacing.md,
            backgroundColor: configuredProviders.anthropic
              ? colors.successLight
              : colors.background.secondary,
            border: `1px solid ${configuredProviders.anthropic ? colors.successColor : colors.border.default}`,
            borderRadius: radius.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <span style={{ fontSize: typography.sizes.lg }}>
              {configuredProviders.anthropic ? '✅' : '⚪'}
            </span>
            <span
              style={{
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                color: colors.text.primary,
              }}
            >
              Anthropic
            </span>
          </div>
          {configuredProviders.anthropic && (
            <button
              onClick={() => handleDeleteKey('anthropic')}
              style={{
                marginTop: spacing.xs,
                fontSize: typography.sizes.xs,
                color: colors.danger,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Add/Update Key Form */}
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
          Provider
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value as 'openai' | 'anthropic')}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: spacing.md,
            fontSize: typography.sizes.base,
            color: colors.text.primary,
            backgroundColor: colors.background.primary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.md,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
        </select>
      </div>

      <Input
        label="API Key"
        type="password"
        value={apiKey}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
        placeholder={`Enter your ${selectedProvider} API key`}
        disabled={isLoading}
        helperText="Your API key is encrypted and stored securely"
      />

      {/* Message */}
      {message && (
        <div
          style={{
            marginTop: spacing.md,
            padding: spacing.md,
            backgroundColor:
              message.type === 'success' ? colors.successLight : colors.dangerLight,
            border: `1px solid ${message.type === 'success' ? colors.successColor : colors.danger}`,
            borderRadius: radius.md,
            fontSize: typography.sizes.sm,
            color: message.type === 'success' ? colors.success.dark : colors.danger,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.md }}>
        <Button
          onClick={handleTestConnection}
          disabled={isLoading || isTestingConnection || !apiKey.trim()}
          style={{ flex: 1 }}
        >
          {isTestingConnection ? 'Testing...' : 'Test Connection'}
        </Button>
        <Button
          onClick={handleSaveKey}
          disabled={isLoading || isTestingConnection || !apiKey.trim()}
          style={{ flex: 1 }}
        >
          {isLoading ? 'Saving...' : 'Save Key'}
        </Button>
      </div>

      {/* Info */}
      <div
        style={{
          marginTop: spacing.xl,
          padding: spacing.md,
          backgroundColor: colors.background.secondary,
          borderRadius: radius.md,
          fontSize: typography.sizes.xs,
          color: colors.text.tertiary,
        }}
      >
        💡 <strong>Tip:</strong> Get your API keys from{' '}
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primaryColor, textDecoration: 'underline' }}
        >
          OpenAI
        </a>{' '}
        or{' '}
        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primaryColor, textDecoration: 'underline' }}
        >
          Anthropic
        </a>
      </div>
    </Card>
  );
}
