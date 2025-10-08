import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <SignIn
        appearance={{
          elements: {
            rootBox: {
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
            card: {
              borderRadius: '16px',
            },
          },
        }}
      />
    </div>
  );
}
