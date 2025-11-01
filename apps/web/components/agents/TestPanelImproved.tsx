'use client';

import React, { useState } from 'react';
import { executeAgent } from '@/lib/actions/agent-actions';
import { colors, spacing, typography, radius, shadows } from '@/lib/constants/design-system';

interface TestPanelImprovedProps {
  agentId?: string;
  agentName: string;
  agentType: string;
  isOpen: boolean;
  onClose: () => void;
  onTestComplete?: (result: any) => void;
}

// Define simple input templates based on agent type
const getInputTemplate = (agentType: string) => {
  switch (agentType) {
    case 'scope':
    case 'email':
      return {
        fields: [
          {
            name: 'subject',
            label: 'Email Subject',
            type: 'text',
            placeholder: 'Q1 Planning Meeting',
            required: false,
          },
          {
            name: 'email_content',
            label: 'Email Content',
            type: 'textarea',
            placeholder: "Hi team, let's schedule our Q1 planning meeting for next week...",
            required: true,
          },
        ],
      };
    case 'call':
      return {
        fields: [
          {
            name: 'transcript',
            label: 'Call Transcript',
            type: 'textarea',
            placeholder:
              "Customer: Hi, I'm interested in your enterprise plan...\nAgent: Great! Let me tell you about our features...",
            required: true,
          },
        ],
      };
    case 'note':
      return {
        fields: [
          {
            name: 'note_content',
            label: 'Note Content',
            type: 'textarea',
            placeholder: 'Meeting with product team. Discussed new features for Q2...',
            required: true,
          },
        ],
      };
    case 'task':
      return {
        fields: [
          {
            name: 'task_description',
            label: 'Task Description',
            type: 'textarea',
            placeholder: 'Review and approve the new homepage design by Friday...',
            required: true,
          },
        ],
      };
    case 'content':
      return {
        fields: [
          {
            name: 'topic',
            label: 'Content Topic',
            type: 'text',
            placeholder: 'AI in Healthcare',
            required: true,
          },
          {
            name: 'tone',
            label: 'Tone',
            type: 'select',
            options: ['Professional', 'Casual', 'Technical', 'Friendly'],
            required: false,
          },
          {
            name: 'length',
            label: 'Target Length',
            type: 'select',
            options: ['Short (100 words)', 'Medium (300 words)', 'Long (500+ words)'],
            required: false,
          },
        ],
      };
    default:
      return {
        fields: [
          {
            name: 'input',
            label: 'Input Text',
            type: 'textarea',
            placeholder: 'Enter your input here...',
            required: true,
          },
        ],
      };
  }
};

export const TestPanelImproved: React.FC<TestPanelImprovedProps> = ({
  agentId,
  agentName,
  agentType,
  isOpen,
  onClose,
  onTestComplete,
}) => {
  const template = getInputTemplate(agentType);

  // Initialize form state from template
  const initialFormState = template.fields.reduce(
    (acc, field) => {
      acc[field.name] = '';
      return acc;
    },
    {} as Record<string, string>,
  );

  const [formData, setFormData] = useState(initialFormState);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [useLiveMode, setUseLiveMode] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleRunTest = async () => {
    if (!agentId) {
      setError('Agent must be saved before testing');
      return;
    }

    // Validate required fields
    const missingFields = template.fields
      .filter((field) => field.required && !formData[field.name]?.trim())
      .map((field) => field.label);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      // Convert form data to JSON input
      const inputs = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (value.trim()) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Execute agent via API (mock or live mode)
      const mode = useLiveMode ? 'live' : 'mock';
      const result = await executeAgent(agentId, inputs, mode);

      setTestResult(result);
      onTestComplete?.(result);
    } catch (err: any) {
      setError(err.message || 'Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormState);
    setTestResult(null);
    setError(null);
  };

  const handleCopyOutput = () => {
    if (testResult) {
      navigator.clipboard.writeText(JSON.stringify(testResult, null, 2));
    }
  };

  const generatedJson = JSON.stringify(
    Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value.trim()) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    ),
    null,
    2,
  );

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
          width: window.innerWidth <= 640 ? '100%' : '500px',
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
          {/* Execution Mode Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              marginBottom: spacing.lg,
              padding: spacing.md,
              backgroundColor: colors.background.secondary,
              borderRadius: radius.md,
              border: `1px solid ${colors.border.default}`,
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  marginBottom: spacing.xs,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.medium,
                  color: colors.text.primary,
                }}
              >
                Execution Mode
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: typography.sizes.xs,
                  color: colors.text.tertiary,
                }}
              >
                {useLiveMode ? '🚀 Live execution with real AI' : '🎭 Mock mode (instant response)'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUseLiveMode(!useLiveMode)}
              disabled={isRunning}
              style={{
                position: 'relative',
                width: '56px',
                height: '32px',
                backgroundColor: useLiveMode ? colors.primaryColor : colors.background.tertiary,
                borderRadius: radius.full,
                border: `1px solid ${colors.border.default}`,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                transition: 'all 200ms',
                opacity: isRunning ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: useLiveMode ? '26px' : '3px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: colors.background.primary,
                  borderRadius: radius.full,
                  boxShadow: shadows.sm,
                  transition: 'all 200ms',
                }}
              />
            </button>
          </div>

          {/* Input Form */}
          <div style={{ marginBottom: spacing.xl }}>
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
                Input Fields
              </label>
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.medium,
                  color: colors.text.secondary,
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.sm,
                  cursor: 'pointer',
                }}
              >
                {showJson ? '📝 Show Form' : '{ } Show JSON'}
              </button>
            </div>

            {showJson ? (
              // JSON View
              <textarea
                value={generatedJson}
                readOnly
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
                }}
              />
            ) : (
              // Form View
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.md,
                }}
              >
                {template.fields.map((field) => (
                  <div key={field.name}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: spacing.xs,
                        fontSize: typography.sizes.sm,
                        color: colors.text.secondary,
                      }}
                    >
                      {field.label}
                      {field.required && <span style={{ color: colors.danger }}> *</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        disabled={isRunning}
                        style={{
                          width: '100%',
                          minHeight: '100px',
                          padding: spacing.sm,
                          fontSize: typography.sizes.sm,
                          fontFamily: typography.fontFamily.sans,
                          color: colors.text.primary,
                          backgroundColor: colors.background.secondary,
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: radius.md,
                          resize: 'vertical',
                          outline: 'none',
                          opacity: isRunning ? 0.6 : 1,
                        }}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        disabled={isRunning}
                        style={{
                          width: '100%',
                          padding: spacing.sm,
                          fontSize: typography.sizes.sm,
                          fontFamily: typography.fontFamily.sans,
                          color: colors.text.primary,
                          backgroundColor: colors.background.secondary,
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: radius.md,
                          outline: 'none',
                          opacity: isRunning ? 0.6 : 1,
                        }}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        disabled={isRunning}
                        style={{
                          width: '100%',
                          padding: spacing.sm,
                          fontSize: typography.sizes.sm,
                          fontFamily: typography.fontFamily.sans,
                          color: colors.text.primary,
                          backgroundColor: colors.background.secondary,
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: radius.md,
                          outline: 'none',
                          opacity: isRunning ? 0.6 : 1,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p
                style={{
                  marginTop: spacing.sm,
                  fontSize: typography.sizes.sm,
                  color: colors.danger,
                  margin: 0,
                }}
              >
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: spacing.sm,
              marginBottom: spacing.xl,
            }}
          >
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
                backgroundColor: colors.primaryColor,
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

                  {testResult.metrics.cost !== undefined && (
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.background.tertiary,
                        borderRadius: radius.sm,
                        fontSize: typography.sizes.xs,
                        color: colors.text.secondary,
                      }}
                    >
                      💰 ${testResult.metrics.cost.toFixed(4)}
                    </div>
                  )}

                  {testResult.metrics.latencyMs && (
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.background.tertiary,
                        borderRadius: radius.sm,
                        fontSize: typography.sizes.xs,
                        color: colors.text.secondary,
                      }}
                    >
                      ⚡ {testResult.metrics.latencyMs}ms
                    </div>
                  )}

                  {testResult.metrics.model && (
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.background.tertiary,
                        borderRadius: radius.sm,
                        fontSize: typography.sizes.xs,
                        color: colors.text.secondary,
                      }}
                    >
                      🤖 {testResult.metrics.model}
                    </div>
                  )}

                  <div
                    style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      backgroundColor: testResult.success ? colors.successColor : colors.danger,
                      borderRadius: radius.sm,
                      fontSize: typography.sizes.xs,
                      color: colors.background.primary,
                    }}
                  >
                    {testResult.success ? '✓ Success' : '✗ Failed'}
                  </div>

                  {testResult.mode && (
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor:
                          testResult.mode === 'mock' ? colors.warningColor : colors.primaryColor,
                        borderRadius: radius.sm,
                        fontSize: typography.sizes.xs,
                        color: colors.background.primary,
                      }}
                    >
                      {testResult.mode === 'mock' ? '🎭 Mock' : '🚀 Live'}
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
                💡 <strong>Tip:</strong> Fill in the form fields above and click &quot;Run
                Test&quot;. Toggle Live Mode to test with real AI (requires API keys in settings).
                Mock mode gives you instant results without using API credits!
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
