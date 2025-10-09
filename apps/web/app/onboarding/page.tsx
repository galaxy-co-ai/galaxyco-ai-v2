'use client';

import { useState } from 'react';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { OnboardingProfile } from '@/lib/constants/onboarding';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async (profile: OnboardingProfile) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting onboarding profile:', {
        role: profile.persona.role,
        industry: profile.persona.industry,
        starterPack: profile.starterPack.recommendedId,
      });

      // Save onboarding profile and create workspace
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to complete onboarding';
        console.error('Onboarding API error:', {
          status: response.status,
          error: errorMessage,
          data,
        });
        throw new Error(errorMessage);
      }

      console.log('Workspace created successfully:', {
        workspaceId: data.workspaceId,
        workspaceName: data.workspaceName,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      console.error('Onboarding error:', error);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div>
      {error && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '600px',
            width: '90%',
            padding: '16px 20px',
            background: '#FEE2E2',
            border: '2px solid #DC2626',
            borderRadius: '8px',
            color: '#7F1D1D',
            fontSize: '14px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Error</div>
            <div>{error}</div>
          </div>
          <button
            onClick={handleRetry}
            style={{
              padding: '8px 16px',
              background: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      <OnboardingWizard onComplete={handleComplete} isLoading={isLoading} />
    </div>
  );
}
