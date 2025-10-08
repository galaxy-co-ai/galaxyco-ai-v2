'use client';

import React, { useState } from 'react';
import { testAgent } from '@/lib/actions/agent-actions';
import { colors, spacing, typography, radius, shadows } from '@/lib/constants/design-system';

interface TestPanelProps {
  agentId?: string;
  agentName: string;
  isOpen: boolean;
  onClose: () => void;
  onTestComplete?: (result: any) => void;
}

export const TestPanel: React.FC<TestPanelProps> = ({
  agentId,
  agentName,
  isOpen,
  onClose,
  onTestComplete,
}) => {
  const [inputJson, setInputJson] = useState('{\n  "emailThread": "Sample email content here..."\n}');
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const handleRunTest = async () => {
    if (!agentId) {
      setError('Agent must be saved before testing');
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      // Parse JSON input
      const inputs = JSON.parse(inputJson);

      // Call test API
      const result = await testAgent(agentId, { inputs, mode: 'mock' }, 'workspace-id-placeholder');
      
      setTestResult(result);
      onTestComplete?.(result);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON input. Please check your syntax.');
      } else {
        setError(err.message || 'Test execution failed');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setInputJson('{\n  \n}');
    setTestResult(null);
    setError(null);
  };

  const handleCopyOutput = () => {
    if (testResult) {
      navigator.clipboard.writeText(JSON.stringify(testResult, null, 2));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
          display: window.innerWidth <= 640 ? 'block' : 'none',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: window.innerWidth <= 640 ? '100%' : '450px',
          backgroundColor: colors.background.primary,
          borderLeft: `1px solid ${colors.border.default}`,
          boxShadow: shadows.xl,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 300ms ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: spacing.lg,
            borderBottom: `1px solid ${colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: typography.sizes.xl,
                fontWeight: typography.weights.bold,
                color: colors.text.primary,
                margin: 0,
                marginBottom: spacing.xs,
              }}
            >
              🧪 Test Agent
            </h2>
            <p
              style={{
                fontSize: typography.sizes.sm,
                color: colors.text.secondary,
                margin: 0,
              }}
            >
              {agentName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              cursor: 'pointer',
              fontSize: typography.sizes.lg,
              color: colors.text.tertiary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: spacing.lg }}>
          {/* Mock Mode Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xs,
              padding: `${spacing.xs} ${spacing.sm}`,
              backgroundColor: colors.background.tertiary,
              color: colors.text.secondary,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.medium,
              borderRadius: radius.full,
              border: `1px solid ${colors.border.default}`,
              marginBottom: spacing.md,
            }}
          >
            🎭 Mock Mode
          </div>

          {/* Input Section */}
          <div style={{ marginBottom: spacing.xl }}>
            <label
              style={{
                display: 'block',
                marginBottom: spacing.sm,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                color: colors.text.primary,
              }}
            >
              Input JSON
            </label>
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              disabled={isRunning}
              placeholder='{\n  "key": "value"\n}'
              style={{
                width: '100%',
                minHeight: '200px',
                padding: spacing.md,
                fontSize: typography.sizes.sm,
                fontFamily: 'monospace',
                color: colors.text.primary,
                backgroundColor: colors.background.secondary,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                resize: 'vertical',
                outline: 'none',
                opacity: isRunning ? 0.6 : 1,
              }}
            />
            {error && (
              <p
                style={{
                  marginTop: spacing.xs,
                  fontSize: typography.sizes.sm,
                  color: colors.danger,
                }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.xl }}>
            <button
              type="button"
              onClick={handleRunTest}
              disabled={isRunning || !agentId}
              style={{
                flex: 1,
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.sizes.base,
                fontWeight: typography.weights.semibold,
                color: colors.background.primary,
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: radius.md,
                cursor: isRunning || !agentId ? 'not-allowed' : 'pointer',
                opacity: isRunning || !agentId ? 0.6 : 1,
                transition: 'all 200ms',
                boxShadow: shadows.sm,
              }}
            >
              {isRunning ? '⏳ Running...' : '▶️ Run Test'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isRunning}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.sizes.base,
                fontWeight: typography.weights.medium,
                color: colors.text.secondary,
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning ? 0.6 : 1,
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => {
                if (!isRunning) {
                  e.currentTarget.style.backgroundColor = colors.background.secondary;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Clear
            </button>
          </div>

          {/* Results Section */}
          {testResult && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: spacing.sm,
                }}
              >
                <label
                  style={{
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.medium,
                    color: colors.text.primary,
                  }}
                >
                  Output
                </label>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                  <button
                    type="button"
                    onClick={() => setShowRaw(!showRaw)}
                    style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      fontSize: typography.sizes.xs,
                      fontWeight: typography.weights.medium,
                      color: colors.text.secondary,
                      backgroundColor: 'transparent',
                      border: `1px solid ${colors.border.default}`,
                      borderRadius: radius.sm,
                      cursor: 'pointer',
                      transition: 'all 200ms',
                    }}
                  >
                    {showRaw ? 'Pretty' : 'Raw'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyOutput}
                    style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      fontSize: typography.sizes.xs,
                      fontWeight: typography.weights.medium,
                      color: colors.text.secondary,
                      backgroundColor: 'transparent',
                      border: `1px solid ${colors.border.default}`,
                      borderRadius: radius.sm,
                      cursor: 'pointer',
                      transition: 'all 200ms',
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: spacing.md,
                  backgroundColor: colors.background.secondary,
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.md,
                  marginBottom: spacing.md,
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: typography.sizes.sm,
                    fontFamily: 'monospace',
                    color: colors.text.primary,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {showRaw ? JSON.stringify(testResult) : JSON.stringify(testResult, null, 2)}
                </pre>
              </div>

              {/* Metrics */}
              {testResult.metrics && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                  {testResult.metrics.tokens && (
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.background.tertiary,
                        borderRadius: radius.sm,
                        fontSize: typography.sizes.xs,
                        color: colors.text.secondary,
                      }}
                    >
                      🎯 {testResult.metrics.tokens} tokens
                    </div>
                  )}
                  {testResult.metrics.latency && (
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.background.tertiary,
                        borderRadius: radius.sm,
                        fontSize: typography.sizes.xs,
                        color: colors.text.secondary,
                      }}
                    >
                      ⚡ {testResult.metrics.latency}ms
                    </div>
                  )}
                  {testResult.metrics.status && (
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: testResult.metrics.status === 'success' ? colors.success : colors.danger,
                        borderRadius: radius.sm,
                        fontSize: typography.sizes.xs,
                        color: colors.background.primary,
                      }}
                    >
                      {testResult.metrics.status === 'success' ? '✓' : '✗'} {testResult.metrics.status}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          {!testResult && (
            <div
              style={{
                padding: spacing.md,
                backgroundColor: colors.background.tertiary,
                borderRadius: radius.md,
                border: `1px solid ${colors.border.default}`,
              }}
            >
              <p
                style={{
                  fontSize: typography.sizes.xs,
                  color: colors.text.tertiary,
                  margin: 0,
                }}
              >
                💡 <strong>Tip:</strong> Enter valid JSON inputs above and click "Run Test" to see mock results. Save your agent first to enable testing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};
