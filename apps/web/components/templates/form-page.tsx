"use client";

import React from "react";
import { PageShell, PageShellProps } from "./page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WizardStep } from "@/components/organisms/wizard-step";

export interface FormStep {
  id: string;
  label: string;
  description?: string;
  content: React.ReactNode;
  isValid?: boolean;
}

export interface FormPageProps extends Omit<PageShellProps, "children"> {
  /** Multi-step wizard configuration */
  steps?: FormStep[];
  /** Current step index (0-based) */
  currentStep?: number;
  /** Step change handler */
  onStepChange?: (stepIndex: number) => void;
  /** Form submit handler */
  onSubmit?: () => void;
  /** Form cancel handler */
  onCancel?: () => void;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Is form submitting */
  isSubmitting?: boolean;
  /** Simple form content (no wizard) */
  children?: React.ReactNode;
  /** Max form width */
  formWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

/**
 * FormPage - Template for create/edit forms
 *
 * Features:
 * - Multi-step wizard support
 * - Progress indicator
 * - Navigation buttons
 * - Consistent layout
 * - All PageShell features (breadcrumbs, loading, error states)
 *
 * @example
 * ```tsx
 * // Simple form
 * <FormPage
 *   title="Create Agent"
 *   breadcrumbs={[{ label: 'Agents', href: '/agents' }, { label: 'Create' }]}
 *   onSubmit={handleSubmit}
 *   onCancel={() => router.push('/agents')}
 *   isSubmitting={isSubmitting}
 * >
 *   <FormFields />
 * </FormPage>
 *
 * // Multi-step wizard
 * <FormPage
 *   title="Create Agent"
 *   steps={[
 *     { id: 'basic', label: 'Basic Info', content: <BasicInfoStep /> },
 *     { id: 'config', label: 'Configuration', content: <ConfigStep /> },
 *     { id: 'review', label: 'Review', content: <ReviewStep /> }
 *   ]}
 *   currentStep={step}
 *   onStepChange={setStep}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export function FormPage({
  steps = [],
  currentStep = 0,
  onStepChange,
  onSubmit,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  isSubmitting = false,
  children,
  formWidth = "lg",
  ...pageShellProps
}: FormPageProps) {
  const isMultiStep = steps.length > 0;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepConfig = steps[currentStep];

  const formWidthClass = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  }[formWidth];

  const handleNext = () => {
    if (!isLastStep && onStepChange) {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep && onStepChange) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSubmit?.();
  };

  return (
    <PageShell
      {...pageShellProps}
      contentClassName={`mx-auto ${formWidthClass}`}
    >
      <Card className="p-6 sm:p-8">
        {/* Multi-step Wizard */}
        {isMultiStep ? (
          <div>
            {/* Wizard Step Indicator */}
            <WizardStep
              steps={steps.map((step) => ({
                id: step.id,
                label: step.label,
                description: step.description,
                isCompleted: steps.indexOf(step) < currentStep,
                isCurrent: steps.indexOf(step) === currentStep,
              }))}
              currentStep={currentStep}
              onStepChange={onStepChange || (() => {})}
            >
              {/* Wizard content managed by form-page */}
              <div />
            </WizardStep>

            {/* Step Content */}
            <div className="mt-8">{currentStepConfig?.content}</div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <div>
                {!isFirstStep && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {cancelText}
                </Button>

                {!isLastStep ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      isSubmitting ||
                      (currentStepConfig?.isValid !== undefined &&
                        !currentStepConfig.isValid)
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      (currentStepConfig?.isValid !== undefined &&
                        !currentStepConfig.isValid)
                    }
                  >
                    {isSubmitting ? "Saving..." : submitText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Simple Form */
          <form onSubmit={handleSubmit}>
            {/* Form Content */}
            <div className="space-y-6">{children}</div>

            {/* Submit Buttons */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {cancelText}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitText}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </PageShell>
  );
}
