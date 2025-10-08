import { Card } from '../ui/Card';
import { colors, typography, spacing, radius } from '@/lib/constants/design-system';

interface Step {
  id: string;
  label: string;
  completed: boolean;
  icon: string;
}

interface ProgressTrackerProps {
  steps: Step[];
  onStepClick?: (stepId: string) => void;
}

export function ProgressTracker({ steps, onStepClick }: ProgressTrackerProps) {
  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card>
      <div style={{ marginBottom: spacing.lg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
          <h3
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              margin: 0,
            }}
          >
            Setup Progress
          </h3>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.primary[500],
            }}
          >
            {percentage}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: colors.neutral[100],
            borderRadius: radius.full,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
              transition: 'width 500ms ease',
              borderRadius: radius.full,
            }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => !step.completed && onStepClick?.(step.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              padding: spacing.md,
              background: step.completed ? colors.successLight : colors.neutral[50],
              borderRadius: radius.md,
              cursor: !step.completed && onStepClick ? 'pointer' : 'default',
              transition: `all 200ms ease`,
              border: `1px solid ${step.completed ? colors.successColor : colors.neutral[200]}`,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: step.completed ? colors.successColor : colors.neutral[0],
                color: step.completed ? colors.neutral[0] : colors.neutral[600],
                borderRadius: radius.full,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                flexShrink: 0,
              }}
            >
              {step.completed ? '✓' : step.icon}
            </div>
            <span
              style={{
                fontSize: typography.fontSize.base,
                color: step.completed ? colors.success.dark : colors.neutral[700],
                fontWeight: step.completed ? typography.fontWeight.medium : typography.fontWeight.normal,
                textDecoration: step.completed ? 'line-through' : 'none',
              }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {percentage === 100 && (
        <div
          style={{
            marginTop: spacing.lg,
            padding: spacing.lg,
            background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
            color: colors.neutral[0],
            borderRadius: radius.md,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: spacing.sm }}>🎉</div>
          <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
            Setup Complete!
          </div>
          <div style={{ fontSize: typography.fontSize.sm, opacity: 0.9, marginTop: spacing.xs }}>
            Your workspace is fully configured and ready to use
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * Hook to track workspace setup progress
 */
export function useWorkspaceProgress(workspace: any) {
  const onboardingProfile = workspace.settings?.onboardingProfile;
  // Note: Agent and tool tracking will be implemented when we have active agents
  const hasAgents = false;
  const hasConnectedTools = false;

  const steps = [
    {
      id: 'profile',
      label: 'Complete your profile',
      completed: !!onboardingProfile,
      icon: '👤',
    },
    {
      id: 'agent',
      label: 'Enable your first agent',
      completed: hasAgents,
      icon: '🤖',
    },
    {
      id: 'tools',
      label: 'Connect your tools',
      completed: hasConnectedTools,
      icon: '🔗',
    },
    {
      id: 'marketplace',
      label: 'Explore the marketplace',
      completed: false,
      icon: '🛍️',
    },
  ];

  return {
    steps,
    completedCount: steps.filter((s) => s.completed).length,
    totalCount: steps.length,
    percentage: Math.round((steps.filter((s) => s.completed).length / steps.length) * 100),
  };
}
