'use client';

import { Loader2, Check } from 'lucide-react';

interface ProgressStep {
  label: string;
  status: 'pending' | 'active' | 'complete';
}

interface ProgressStreamProps {
  steps: ProgressStep[];
  isOpen: boolean;
}

export function ProgressStream({ steps, isOpen }: ProgressStreamProps) {
  if (!isOpen) return null;

  const currentStep = steps.findIndex((s) => s.status === 'active') + 1;
  const progress = Math.round((steps.filter((s) => s.status === 'complete').length / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Building Your Agent...
        </h3>

        <div className="space-y-3 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {step.status === 'complete' ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              ) : step.status === 'active' ? (
                <Loader2 className="h-6 w-6 shrink-0 animate-spin text-primary" />
              ) : (
                <div className="h-6 w-6 shrink-0 rounded-full border-2 border-neutral-300 dark:border-neutral-700" />
              )}
              <span
                className={`text-sm ${
                  step.status === 'complete'
                    ? 'text-neutral-600 dark:text-neutral-400'
                    : step.status === 'active'
                    ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                    : 'text-neutral-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Progress</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
