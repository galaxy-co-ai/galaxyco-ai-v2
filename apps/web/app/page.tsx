import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🚀 GalaxyCo.ai 2.0</h1>
      <p style={{ fontSize: '1.25rem', color: '#666' }}>Make multi-agent AI useful in minutes.</p>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f0f0', borderRadius: '12px' }}>
        <h2>✅ Web App Running</h2>
        <ul>
          <li>Next.js: ✅</li>
          <li>Clerk Auth: ✅</li>
          <li>Environment: {process.env.NEXT_PUBLIC_ENV || 'development'}</li>
          <li>Authentication: {userId ? '✅ Signed In' : '🔒 Not Signed In'}</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        {userId ? (
          <Link
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: '#667eea',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
            }}
          >
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <Link
              href="/sign-in"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500',
              }}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                border: '2px solid #667eea',
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
