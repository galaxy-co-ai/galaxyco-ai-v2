import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserWorkspaces } from '@/lib/actions/workspace-actions';

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user has any workspaces
  const workspaces = await getUserWorkspaces();
  if (workspaces.length === 0) {
    redirect('/onboarding');
  }

  // Get current workspace (first one for now, we'll add switching later)
  const currentWorkspace = workspaces[0];

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>🚀 Dashboard</h1>
        <p style={{ color: '#666' }}>Welcome to GalaxyCo.ai 2.0</p>
      </div>

      <div
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '1.5rem' }}>🏢 Current Workspace</h2>
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '1.1rem' }}>
          <div>
            <strong>Name:</strong> {currentWorkspace.name}
          </div>
          <div>
            <strong>Role:</strong> {currentWorkspace.role.toUpperCase()}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            URL: galaxyco.ai/{currentWorkspace.slug}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h2 style={{ marginTop: 0 }}>👤 User Profile</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div>
            <strong>Clerk User ID:</strong> {userId}
          </div>
          {user?.emailAddresses?.[0]?.emailAddress && (
            <div>
              <strong>Email:</strong> {user.emailAddresses[0].emailAddress}
            </div>
          )}
          {user?.firstName && (
            <div>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#d4edda',
          borderRadius: '12px',
          border: '1px solid #28a745',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#155724' }}>✅ Phase 6 Progress</h3>
        <ul style={{ marginBottom: 0, color: '#155724' }}>
          <li>✅ Step 1: Clerk authentication integrated</li>
          <li>✅ Step 2: User sync to database via webhooks</li>
          <li>✅ Step 3: Workspace creation flow complete</li>
          <li>🔄 Step 4: Workspace switching (in progress)</li>
          <li>🔄 Step 5: API authentication guards</li>
          <li>🔄 Step 6: End-to-end testing</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a
          href="/api/auth/signout"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#dc3545',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '500',
          }}
        >
          Sign Out
        </a>
      </div>
    </div>
  );
}
