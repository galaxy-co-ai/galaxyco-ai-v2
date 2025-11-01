'use client';

import React, { useState } from 'react';
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  zIndex,
} from '@/lib/constants/design-system';

interface PublishConfirmationModalProps {
  agentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPublishing?: boolean;
}

export const PublishConfirmationModal: React.FC<PublishConfirmationModalProps> = ({
  agentName,
  onConfirm,
  onCancel,
  isPublishing = false,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setShowSuccess(true);
    setTimeout(() => {
      onCancel(); // Close modal after success animation
    }, 2000);
  };

  const checklistItems = [
    { id: 1, text: 'Agent name and description are clear', icon: '📝' },
    { id: 2, text: 'System prompt is properly configured', icon: '🤖' },
    { id: 3, text: 'AI model and parameters are set', icon: '⚙️' },
    { id: 4, text: 'Trigger type is configured', icon: '🎯' },
    { id: 5, text: 'Agent has been tested (optional)', icon: '🧪' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={!isPublishing && !showSuccess ? onCancel : undefined}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: zIndex.modal,
          animation: 'fadeIn 200ms ease-in-out',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          backgroundColor: colors.background.primary,
          borderRadius: radius.xl,
          boxShadow: shadows.xl,
          zIndex: zIndex.modal + 1,
          animation: 'slideUp 300ms ease-out',
        }}
      >
        {!showSuccess ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: spacing.xl,
                borderBottom: `1px solid ${colors.border.default}`,
              }}
            >
              <h2
                style={{
                  fontSize: typography.sizes['2xl'],
                  fontWeight: typography.weights.bold,
                  color: colors.text.primary,
                  margin: 0,
                  marginBottom: spacing.sm,
                }}
              >
                🚀 Publish Agent
              </h2>
              <p
                style={{
                  fontSize: typography.sizes.sm,
                  color: colors.text.secondary,
                  margin: 0,
                }}
              >
                You&apos;re about to publish <strong>{agentName}</strong>
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: spacing.xl }}>
              <p
                style={{
                  fontSize: typography.sizes.sm,
                  color: colors.text.secondary,
                  marginBottom: spacing.lg,
                }}
              >
                Before publishing, please confirm:
              </p>

              {/* Checklist */}
              <div style={{ marginBottom: spacing.xl }}>
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: spacing.md,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      backgroundColor: colors.background.secondary,
                      borderRadius: radius.md,
                    }}
                  >
                    <span style={{ fontSize: typography.sizes.xl }}>{item.icon}</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: typography.sizes.sm,
                        color: colors.text.primary,
                        paddingTop: '2px',
                      }}
                    >
                      {item.text}
                    </span>
                    <span
                      style={{
                        color: colors.successColor,
                        fontSize: typography.sizes.lg,
                      }}
                    >
                      ✓
                    </span>
                  </div>
                ))}
              </div>

              {/* Info Box */}
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
                  💡 Once published, this agent will be available for execution. You can pause or
                  edit it at any time.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: spacing.sm,
                padding: spacing.xl,
                borderTop: `1px solid ${colors.border.default}`,
              }}
            >
              <button
                type="button"
                onClick={onCancel}
                disabled={isPublishing}
                style={{
                  flex: 1,
                  padding: `${spacing.md} ${spacing.xl}`,
                  fontSize: typography.sizes.base,
                  fontWeight: typography.weights.medium,
                  color: colors.text.secondary,
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.md,
                  cursor: isPublishing ? 'not-allowed' : 'pointer',
                  opacity: isPublishing ? 0.5 : 1,
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  if (!isPublishing) {
                    e.currentTarget.style.backgroundColor = colors.background.secondary;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPublishing}
                style={{
                  flex: 1,
                  padding: `${spacing.md} ${spacing.xl}`,
                  fontSize: typography.sizes.base,
                  fontWeight: typography.weights.semibold,
                  color: colors.background.primary,
                  backgroundColor: colors.primaryColor,
                  border: 'none',
                  borderRadius: radius.md,
                  cursor: isPublishing ? 'not-allowed' : 'pointer',
                  opacity: isPublishing ? 0.7 : 1,
                  transition: 'all 200ms',
                  boxShadow: shadows.sm,
                }}
                onMouseEnter={(e) => {
                  if (!isPublishing) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPublishing) {
                    e.currentTarget.style.opacity = '1';
                  }
                }}
              >
                {isPublishing ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div
            style={{
              padding: spacing['4xl'],
              textAlign: 'center',
              animation: 'scaleIn 300ms ease-out',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                marginBottom: spacing.lg,
                animation: 'bounce 600ms ease-in-out',
              }}
            >
              ✨
            </div>
            <h2
              style={{
                fontSize: typography.sizes['2xl'],
                fontWeight: typography.weights.bold,
                color: colors.successColor,
                marginBottom: spacing.sm,
              }}
            >
              Agent Published!
            </h2>
            <p
              style={{
                fontSize: typography.sizes.base,
                color: colors.text.secondary,
              }}
            >
              {agentName} is now active and ready to use.
            </p>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </>
  );
};
