import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserWorkspaces } from "@/lib/actions/workspace-actions";
import { Card } from "@/components/ui/Card";
import { colors, typography, spacing } from "@/lib/constants/design-system";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has any workspaces
  const workspaces = await getUserWorkspaces();
  if (workspaces.length === 0) {
    redirect("/onboarding");
  }

  // Get current workspace (first one for now, we'll add switching later)
  const currentWorkspace = workspaces[0];

  return (
    <div
      style={{
        padding: spacing["2xl"],
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: spacing["2xl"] }}>
        <h1
          style={{
            fontSize: typography.sizes["3xl"],
            fontWeight: typography.weights.bold,
            color: colors.text.primary,
            margin: 0,
            marginBottom: spacing.xs,
          }}
        >
          🚀 Dashboard
        </h1>
        <p
          style={{
            fontSize: typography.sizes.base,
            color: colors.text.secondary,
            margin: 0,
          }}
        >
          Welcome to GalaxyCo.ai 2.0
        </p>
      </div>

      {/* Cards Grid - 24px spacing between cards */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: spacing.xl }}
      >
        {/* Current Workspace Card - Converted to white with accent border */}
        <Card variant="outlined" hover>
          <div
            style={{
              borderLeft: `4px solid ${colors.primary[500]}`,
              paddingLeft: spacing.lg,
              marginLeft: `-${spacing.xl}`,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: spacing.lg,
                fontSize: typography.sizes["2xl"],
                fontWeight: typography.weights.semibold,
                color: colors.text.primary,
              }}
            >
              🏢 Current Workspace
            </h2>
            <div
              style={{
                display: "grid",
                gap: spacing.sm,
                fontSize: typography.sizes.base,
              }}
            >
              <div style={{ color: colors.text.primary }}>
                <strong>Name:</strong>{" "}
                <span style={{ color: colors.text.secondary }}>
                  {currentWorkspace.name}
                </span>
              </div>
              <div style={{ color: colors.text.primary }}>
                <strong>Role:</strong>{" "}
                <span
                  style={{
                    color: colors.primary[600],
                    fontWeight: typography.weights.semibold,
                    textTransform: "uppercase",
                    fontSize: typography.sizes.sm,
                  }}
                >
                  {currentWorkspace.role}
                </span>
              </div>
              <div
                style={{
                  fontSize: typography.sizes.sm,
                  color: colors.text.tertiary,
                  marginTop: spacing.xs,
                }}
              >
                URL: galaxyco.ai/{currentWorkspace.slug}
              </div>
            </div>
          </div>
        </Card>

        {/* User Profile Card */}
        <Card hover>
          <h2
            style={{
              marginTop: 0,
              marginBottom: spacing.lg,
              fontSize: typography.sizes["2xl"],
              fontWeight: typography.weights.semibold,
              color: colors.text.primary,
            }}
          >
            👤 User Profile
          </h2>
          <div style={{ display: "grid", gap: spacing.sm }}>
            <div style={{ fontSize: typography.sizes.sm }}>
              <strong style={{ color: colors.text.primary }}>
                Clerk User ID:
              </strong>{" "}
              <span
                style={{
                  color: colors.text.secondary,
                  fontFamily: typography.fontFamily.mono,
                }}
              >
                {userId}
              </span>
            </div>
            {user?.emailAddresses?.[0]?.emailAddress && (
              <div style={{ fontSize: typography.sizes.sm }}>
                <strong style={{ color: colors.text.primary }}>Email:</strong>{" "}
                <span style={{ color: colors.text.secondary }}>
                  {user.emailAddresses[0].emailAddress}
                </span>
              </div>
            )}
            {user?.firstName && (
              <div style={{ fontSize: typography.sizes.sm }}>
                <strong style={{ color: colors.text.primary }}>Name:</strong>{" "}
                <span style={{ color: colors.text.secondary }}>
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Phase 6 Progress Card */}
        <Card
          variant="outlined"
          style={{
            backgroundColor: colors.success.light,
            borderColor: colors.success.DEFAULT,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: spacing.lg,
              fontSize: typography.sizes.xl,
              fontWeight: typography.weights.semibold,
              color: colors.success.dark,
            }}
          >
            ✅ Phase 6 Progress
          </h3>
          <ul
            style={{
              marginBottom: 0,
              paddingLeft: spacing.xl,
              color: colors.success.dark,
              lineHeight: 1.8,
            }}
          >
            <li>✅ Step 1: Clerk authentication integrated</li>
            <li>✅ Step 2: User sync to database via webhooks</li>
            <li>✅ Step 3: Workspace creation flow complete</li>
            <li>✅ Step 4: Workspace switching with persistence</li>
            <li>🔄 Step 5: API authentication guards (next)</li>
            <li>🔄 Step 6: End-to-end testing</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
