import { ApiKeyManager } from '@/components/settings/ApiKeyManager';
import { colors, spacing, typography, radius, shadows } from '@/lib/constants/design-system';

export default function SettingsPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background.primary,
        padding: spacing.xl,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <h1
            style={{
              fontSize: typography.sizes['3xl'],
              fontWeight: typography.weights.bold,
              color: colors.text.primary,
              margin: 0,
              marginBottom: spacing.xs,
            }}
          >
            ⚙️ Settings
          </h1>
          <p
            style={{
              fontSize: typography.sizes.base,
              color: colors.text.secondary,
              margin: 0,
            }}
          >
            Manage your workspace configuration and integrations
          </p>
        </div>

        {/* Settings Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
          {/* API Keys Section */}
          <section
            style={{
              backgroundColor: colors.background.secondary,
              borderRadius: radius.lg,
              border: `1px solid ${colors.border.default}`,
              padding: spacing.xl,
              boxShadow: shadows.sm,
            }}
          >
            <div style={{ marginBottom: spacing.lg }}>
              <h2
                style={{
                  fontSize: typography.sizes.xl,
                  fontWeight: typography.weights.bold,
                  color: colors.text.primary,
                  margin: 0,
                  marginBottom: spacing.xs,
                }}
              >
                🔑 AI Provider API Keys
              </h2>
              <p
                style={{
                  fontSize: typography.sizes.sm,
                  color: colors.text.tertiary,
                  margin: 0,
                }}
              >
                Configure API keys to enable live execution of AI agents. Keys are encrypted and stored securely.
              </p>
            </div>
            <ApiKeyManager />
          </section>

          {/* Future Settings Sections */}
          <section
            style={{
              backgroundColor: colors.background.secondary,
              borderRadius: radius.lg,
              border: `1px solid ${colors.border.default}`,
              padding: spacing.xl,
              boxShadow: shadows.sm,
              opacity: 0.6,
            }}
          >
            <div style={{ marginBottom: spacing.lg }}>
              <h2
                style={{
                  fontSize: typography.sizes.xl,
                  fontWeight: typography.weights.bold,
                  color: colors.text.primary,
                  margin: 0,
                  marginBottom: spacing.xs,
                }}
              >
                👥 Team Management
              </h2>
              <p
                style={{
                  fontSize: typography.sizes.sm,
                  color: colors.text.tertiary,
                  margin: 0,
                }}
              >
                Coming soon: Invite team members and manage permissions
              </p>
            </div>
          </section>

          <section
            style={{
              backgroundColor: colors.background.secondary,
              borderRadius: radius.lg,
              border: `1px solid ${colors.border.default}`,
              padding: spacing.xl,
              boxShadow: shadows.sm,
              opacity: 0.6,
            }}
          >
            <div style={{ marginBottom: spacing.lg }}>
              <h2
                style={{
                  fontSize: typography.sizes.xl,
                  fontWeight: typography.weights.bold,
                  color: colors.text.primary,
                  margin: 0,
                  marginBottom: spacing.xs,
                }}
              >
                🔔 Notifications
              </h2>
              <p
                style={{
                  fontSize: typography.sizes.sm,
                  color: colors.text.tertiary,
                  margin: 0,
                }}
              >
                Coming soon: Configure notification preferences
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
