"use client";

import React from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface WizardStepConfig {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

export interface WizardStepProps {
  steps: WizardStepConfig[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
  onNext?: () => void | Promise<void>;
  onPrev?: () => void;
  onComplete?: () => void | Promise<void>;
  nextLabel?: string;
  prevLabel?: string;
  completeLabel?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  showStepNumbers?: boolean;
  allowStepClick?: boolean;
  className?: string;
}

export const WizardStep: React.FC<WizardStepProps> = ({
  steps,
  currentStep,
  onStepChange,
  children,
  onNext,
  onPrev,
  onComplete,
  nextLabel = "Next",
  prevLabel = "Back",
  completeLabel = "Complete",
  isNextDisabled,
  isLoading,
  showStepNumbers = true,
  allowStepClick = false,
  className,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepConfig = steps[currentStep];

  const handleStepClick = (stepIndex: number) => {
    if (!allowStepClick) return;
    if (stepIndex <= currentStep) {
      onStepChange(stepIndex);
    }
  };

  const handleNext = async () => {
    if (isLastStep && onComplete) {
      await onComplete();
    } else if (onNext) {
      await onNext();
    }
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Progress Stepper */}
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isClickable = allowStepClick && index <= currentStep;

            return (
              <li
                key={step.id}
                className={cn(
                  "relative flex-1",
                  index < steps.length - 1 && "pr-8 sm:pr-16",
                )}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-5 right-0 left-1/2 -z-10 h-0.5 bg-border">
                    <div
                      className={cn(
                        "h-full bg-primary transition-all duration-500",
                        isCompleted ? "w-full" : "w-0",
                      )}
                    />
                  </div>
                )}

                {/* Step Button */}
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "group relative flex flex-col items-center",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg",
                    isClickable && "cursor-pointer",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {/* Icon/Number Circle */}
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                      isActive &&
                        "border-primary bg-primary text-primary-foreground scale-110",
                      isCompleted &&
                        "border-primary bg-primary text-primary-foreground",
                      !isActive &&
                        !isCompleted &&
                        "border-border bg-background text-muted-foreground",
                      isClickable &&
                        !isActive &&
                        "group-hover:border-primary group-hover:bg-accent",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : step.icon ? (
                      <span className="h-5 w-5">{step.icon}</span>
                    ) : showStepNumbers ? (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    ) : null}
                  </div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <span
                      className={cn(
                        "block text-xs sm:text-sm font-medium transition-colors",
                        isActive && "text-foreground",
                        isCompleted && "text-foreground",
                        !isActive && !isCompleted && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                      {step.optional && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (optional)
                        </span>
                      )}
                    </span>
                    {step.description && (
                      <span className="hidden sm:block mt-0.5 text-xs text-muted-foreground">
                        {step.description}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
        {/* Step Header */}
        {currentStepConfig && (
          <div className="mb-6 border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {currentStepConfig.label}
            </h2>
            {currentStepConfig.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {currentStepConfig.description}
              </p>
            )}
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[200px]">{children}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isFirstStep || isLoading}
          className="min-w-[100px]"
        >
          <ChevronLeft className="h-4 w-4 mr-1.5" />
          {prevLabel}
        </Button>

        <div className="flex-1 text-center text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isNextDisabled || isLoading}
          className="min-w-[100px]"
        >
          {isLastStep ? completeLabel : nextLabel}
          {!isLastStep && <ChevronRight className="h-4 w-4 ml-1.5" />}
        </Button>
      </div>
    </div>
  );
};

WizardStep.displayName = "WizardStep";
