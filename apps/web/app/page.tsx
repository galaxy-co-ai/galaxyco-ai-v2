export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🚀 GalaxyCo.ai 2.0</h1>
      <p>Make multi-agent AI useful in minutes.</p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>✅ Web App Running</h2>
        <ul>
          <li>Next.js: ✅</li>
          <li>Clerk Auth: ✅</li>
          <li>Environment: {process.env.NEXT_PUBLIC_ENV || 'development'}</li>
        </ul>
      </div>
    </main>
  );
}
