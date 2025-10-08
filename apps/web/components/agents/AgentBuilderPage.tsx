'use client';

import React, { useState, useEffect } from 'react';
import { useAgentBuilder } from '@/hooks/use-agent-builder';
import { BasicInfoForm } from './BasicInfoForm';
import { ConfigurationForm } from './ConfigurationForm';
import { AdvancedSettings } from './AdvancedSettings';
import { PublishConfirmationModal } from './PublishConfirmationModal';
import { TemplateLibrary } from './TemplateLibrary';
import { AgentTemplate } from '@/lib/constants/agent-templates';
import { colors, spacing, typography, radius, shadows } from '@/lib/constants/design-system';

export const AgentBuilderPage: React.FC = () => {
  const {
    state,
    applyTemplate,
    updateBasicInfo,
    updateConfiguration,
    saveDraft,
    publish,
  } = useAgentBuilder();

  const [showTemplateLibrary, setShowTemplateLibrary] = useState(true);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    timeout: undefined,
    maxRetries: undefined,
    rateLimitPerMinute: undefined,
    enableLogging: true,
    enableCaching: false,
    cacheTTL: undefined,
  });

  const handleTemplateSelect = (template: AgentTemplate | null) => {
    if (template) {
      applyTemplate(template);
    }
    setShowTemplateLibrary(false);
  };

  const handleSaveDraft = async () => {
    const success = await saveDraft();
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handlePublish = async () => {
    const success = await publish();
    if (success) {
      setPublishSuccess(true);
      setShowPublishModal(false);
      setTimeout(() => setPublishSuccess(false), 3000);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S / Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (state.isDirty && !state.isSaving) {
          handleSaveDraft();
        }
      }
      // Cmd+Enter / Ctrl+Enter to publish
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!state.isSaving) {
          setShowPublishModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isDirty, state.isSaving]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background.tertiary,
      }}
    >
      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <PublishConfirmationModal
          agentName={state.basicInfo.name || 'Untitled Agent'}
          onConfirm={handlePublish}
          onCancel={() => setShowPublishModal(false)}
          isPublishing={state.isSaving}
        />
      )}

      {/* Top Toolbar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: colors.background.primary,
          borderBottom: `1px solid ${colors.border.default}`,
          padding: `${spacing.md} ${spacing.xl}`,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left Side - Title & Status */}
          <div>
            <h1
              style={{
                fontSize: typography.sizes['2xl'],
                fontWeight: typography.weights.bold,
                color: colors.text.primary,
                margin: 0,
              }}
            >
              {state.agentId ? 'Edit Agent' : 'Create New Agent'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs }}>
              <span
                style={{
                  fontSize: typography.sizes.sm,
                  color: colors.text.tertiary,
                }}
              >
                Status: <strong style={{ color: colors.text.secondary }}>{state.status}</strong>
              </span>
              {state.isDirty && !state.isSaving && (
                <span
                  style={{
                    fontSize: typography.sizes.xs,
                    color: colors.warning,
                  }}
                >
                  • Unsaved changes
                </span>
              )}
              {state.isSaving && (
                <span
                  style={{
                    fontSize: typography.sizes.xs,
                    color: colors.primary,
                  }}
                >
                  • Saving...
                </span>
              )}
            </div>
            {/* Keyboard shortcuts hint */}
            <p
              style={{
                fontSize: typography.sizes.xs,
                color: colors.text.tertiary,
                marginTop: spacing.xs,
                margin: 0,
              }}
            >
              ⌨️ <kbd>Cmd+S</kbd> to save • <kbd>Cmd+Enter</kbd> to publish
            </p>
          </div>

          {/* Right Side - Actions */}
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <button
              type="button"
              onClick={() => setShowTemplateLibrary(true)}
              disabled={state.isSaving}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                color: colors.text.secondary,
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                cursor: state.isSaving ? 'not-allowed' : 'pointer',
                opacity: state.isSaving ? 0.6 : 1,
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => {
                if (!state.isSaving) {
                  e.currentTarget.style.backgroundColor = colors.background.secondary;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              📚 Change Template
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={state.isSaving || !state.isDirty}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                color: colors.background.primary,
                backgroundColor: colors.text.secondary,
                border: 'none',
                borderRadius: radius.md,
                cursor: state.isSaving || !state.isDirty ? 'not-allowed' : 'pointer',
                opacity: state.isSaving || !state.isDirty ? 0.6 : 1,
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => {
                if (!state.isSaving && state.isDirty) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (!state.isSaving && state.isDirty) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              💾 Save Draft
            </button>

            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              disabled={state.isSaving}
              style={{
                padding: `${spacing.sm} ${spacing.xl}`,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.semibold,
                color: colors.background.primary,
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: radius.md,
                cursor: state.isSaving ? 'not-allowed' : 'pointer',
                opacity: state.isSaving ? 0.6 : 1,
                transition: 'all 200ms',
                boxShadow: shadows.sm,
              }}
              onMouseEnter={(e) => {
                if (!state.isSaving) {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.boxShadow = shadows.md;
                }
              }}
              onMouseLeave={(e) => {
                if (!state.isSaving) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.boxShadow = shadows.sm;
                }
              }}
            >
              🚀 Publish Agent
            </button>
          </div>
        </div>
      </div>

      {/* Success Messages */}
      {(saveSuccess || publishSuccess) && (
        <div
          style={{
            position: 'fixed',
            top: spacing.xl,
            right: spacing.xl,
            zIndex: 100,
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: colors.success,
            color: colors.background.primary,
            borderRadius: radius.lg,
            boxShadow: shadows.lg,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            animation: 'fadeIn 200ms ease-in-out',
          }}
        >
          {saveSuccess && '✓ Draft saved successfully!'}
          {publishSuccess && '✓ Agent published successfully!'}
        </div>
      )}

      {/* Error Messages */}
      {(state.errors.save || state.errors.publish) && (
        <div
          style={{
            position: 'fixed',
            top: spacing.xl,
            right: spacing.xl,
            zIndex: 100,
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: colors.danger,
            color: colors.background.primary,
            borderRadius: radius.lg,
            boxShadow: shadows.lg,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            animation: 'fadeIn 200ms ease-in-out',
          }}
        >
          {state.errors.save || state.errors.publish}
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: `${spacing['3xl']} ${spacing.xl}`,
        }}
      >
        {/* Form Container */}
        <div
          style={{
            backgroundColor: colors.background.primary,
            borderRadius: radius.xl,
            padding: spacing['3xl'],
            boxShadow: shadows.md,
          }}
        >
          {/* Basic Info Form */}
          <BasicInfoForm
            basicInfo={state.basicInfo}
            errors={state.errors}
            onChange={updateBasicInfo}
            disabled={state.isSaving}
          />

          {/* Divider */}
          <div
            style={{
              height: '2px',
              backgroundColor: colors.border.default,
              margin: `${spacing['2xl']} 0`,
            }}
          />

          {/* Configuration Form */}
          <ConfigurationForm
            configuration={state.configuration}
            errors={state.errors}
            onChange={updateConfiguration}
            disabled={state.isSaving}
          />

          {/* Advanced Settings */}
          <AdvancedSettings
            settings={advancedSettings}
            onChange={(updates) => setAdvancedSettings({ ...advancedSettings, ...updates })}
            disabled={state.isSaving}
          />

          {/* Bottom Action Bar (Mobile Friendly) */}
          <div
            style={{
              marginTop: spacing['2xl'],
              paddingTop: spacing.xl,
              borderTop: `1px solid ${colors.border.default}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: spacing.sm,
            }}
          >
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={state.isSaving || !state.isDirty}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                fontSize: typography.sizes.base,
                fontWeight: typography.weights.medium,
                color: colors.background.primary,
                backgroundColor: colors.text.secondary,
                border: 'none',
                borderRadius: radius.md,
                cursor: state.isSaving || !state.isDirty ? 'not-allowed' : 'pointer',
                opacity: state.isSaving || !state.isDirty ? 0.6 : 1,
                transition: 'all 200ms',
              }}
            >
              💾 Save Draft
            </button>

            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              disabled={state.isSaving}
              style={{
                padding: `${spacing.md} ${spacing['2xl']}`,
                fontSize: typography.sizes.base,
                fontWeight: typography.weights.semibold,
                color: colors.background.primary,
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: radius.md,
                cursor: state.isSaving ? 'not-allowed' : 'pointer',
                opacity: state.isSaving ? 0.6 : 1,
                transition: 'all 200ms',
                boxShadow: shadows.sm,
              }}
            >
              🚀 Publish Agent
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p
          style={{
            marginTop: spacing.xl,
            textAlign: 'center',
            fontSize: typography.sizes.sm,
            color: colors.text.tertiary,
          }}
        >
          Changes are automatically saved every 30 seconds. You can also save manually anytime.
        </p>
      </div>
    </div>
  );
};
