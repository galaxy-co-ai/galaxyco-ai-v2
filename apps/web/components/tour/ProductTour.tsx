'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { colors, typography, spacing, radius, shadows } from '@/lib/constants/design-system';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface ProductTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function ProductTour({ steps, onComplete, onSkip }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkipTour = () => {
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 300ms ease',
        }}
        onClick={handleSkipTour}
      />

      {/* Tour Card */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          maxWidth: '500px',
          width: '90%',
        }}
      >
        <div
          style={{
            background: colors.neutral[0],
            borderRadius: radius.xl,
            boxShadow: shadows.xl,
            padding: spacing['2xl'],
            fontFamily: typography.fontFamily.sans,
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.primary[500],
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Step {currentStep + 1} of {steps.length}
              </span>
              <button
                onClick={handleSkipTour}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.xl,
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <h3
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
                marginBottom: spacing.sm,
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontSize: typography.fontSize.base,
                color: colors.neutral[600],
                margin: 0,
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              {step.description}
            </p>
          </div>

          {/* Progress Dots */}
          <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xl }}>
            {steps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentStep ? '24px' : '8px',
                  height: '8px',
                  borderRadius: radius.full,
                  background: index === currentStep ? colors.primary[500] : colors.neutral[200],
                  transition: 'all 300ms ease',
                }}
              />
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: spacing.md }}>
              {currentStep > 0 && (
                <Button variant="ghost" onClick={handlePrevious}>
                  ← Previous
                </Button>
              )}
            </div>
            <div style={{ display: 'flex', gap: spacing.md }}>
              {currentStep < steps.length - 1 ? (
                <>
                  <Button variant="ghost" onClick={handleSkipTour}>
                    Skip Tour
                  </Button>
                  <Button onClick={handleNext}>
                    Next →
                  </Button>
                </>
              ) : (
                <Button onClick={handleComplete}>
                  Get Started 🚀
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Hook to manage product tour state
 */
export function useProductTour(tourId: string) {
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    // Check if user has seen this tour
    const seen = localStorage.getItem(`tour_${tourId}_completed`);
    setHasSeenTour(seen === 'true');
  }, [tourId]);

  const markTourComplete = () => {
    localStorage.setItem(`tour_${tourId}_completed`, 'true');
    setHasSeenTour(true);
  };

  const resetTour = () => {
    localStorage.removeItem(`tour_${tourId}_completed`);
    setHasSeenTour(false);
  };

  return {
    hasSeenTour,
    markTourComplete,
    resetTour,
  };
}

/**
 * Default dashboard tour steps
 */
export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to GalaxyCo.ai! 👋',
    description: 'Let\'s take a quick tour to help you get started with your AI-powered workspace.',
  },
  {
    id: 'progress',
    title: 'Track Your Setup Progress',
    description: 'This panel shows your workspace setup progress. Complete each step to unlock the full power of your agents.',
  },
  {
    id: 'agents',
    title: 'Your Agents',
    description: 'These are the AI agents from your starter pack. Click "Enable" to activate them and start automating tasks.',
  },
  {
    id: 'actions',
    title: 'Next Best Actions',
    description: 'Follow these suggested actions to get the most out of your workspace quickly.',
  },
  {
    id: 'create',
    title: 'Create Custom Agents',
    description: 'Click "Create Agent" anytime to build your own custom AI agents tailored to your specific workflows.',
  },
];
