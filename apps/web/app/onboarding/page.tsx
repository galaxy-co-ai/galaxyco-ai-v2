'use client';

import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { OnboardingProfile } from '@/lib/constants/onboarding';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = async (profile: OnboardingProfile) => {
    try {
      // Save onboarding profile and create workspace
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      const { workspaceId } = await response.json();
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return <OnboardingWizard onComplete={handleComplete} />;
}
