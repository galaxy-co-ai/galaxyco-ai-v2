/**
 * Onboarding Wizard Page
 * Template 7: Form/Wizard Flow
 * Multi-step onboarding with progress stepper, form validation, auto-save
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
}

interface FormData {
  // Step 1: Basics
  companyName: string;
  industry: string;
  teamSize: string;
  role: string;

  // Step 2: Goals
  primaryGoal: string;
  useCases: string[];
  timeline: string;

  // Step 3: Preferences
  notifications: boolean;
  emailDigest: string;
  aiProvider: string;
}

const steps: OnboardingStep[] = [
  {
    id: "basics",
    label: "Company Info",
    description: "Tell us about your company",
  },
  { id: "goals", label: "Goals", description: "What do you want to achieve?" },
  {
    id: "preferences",
    label: "Preferences",
    description: "Customize your experience",
  },
  {
    id: "complete",
    label: "Complete",
    description: "You&apos;re all set!",
  },
];

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Manufacturing",
  "Other",
];

const teamSizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

const roles = [
  "Founder / CEO",
  "Product Manager",
  "Engineer",
  "Sales / Marketing",
  "Operations",
  "Other",
];

const goals = [
  "Automate workflows",
  "Improve customer support",
  "Generate leads",
  "Analyze data",
  "Content creation",
];

const aiProviders = ["OpenAI", "Anthropic", "Google AI", "Mixed"];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    industry: "",
    teamSize: "",
    role: "",
    primaryGoal: "",
    useCases: [],
    timeline: "",
    notifications: true,
    emailDigest: "daily",
    aiProvider: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoSaved, setAutoSaved] = useState(false);

  // Auto-save simulation
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
  };

  const toggleUseCase = (useCase: string) => {
    const newUseCases = formData.useCases.includes(useCase)
      ? formData.useCases.filter((uc) => uc !== useCase)
      : [...formData.useCases, useCase];
    handleFieldChange("useCases", newUseCases);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.companyName)
        newErrors.companyName = "Company name is required";
      if (!formData.industry) newErrors.industry = "Please select an industry";
      if (!formData.teamSize) newErrors.teamSize = "Please select team size";
      if (!formData.role) newErrors.role = "Please select your role";
    } else if (step === 1) {
      if (!formData.primaryGoal)
        newErrors.primaryGoal = "Please select a primary goal";
      if (formData.useCases.length === 0)
        newErrors.useCases = "Select at least one use case";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Complete onboarding
        router.push("/dashboard");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all",
                    index < currentStep
                      ? "bg-success text-success-foreground"
                      : index === currentStep
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-background-subtle text-foreground-muted border-2 border-border",
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium hidden sm:block",
                    index <= currentStep
                      ? "text-foreground"
                      : "text-foreground-muted",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-12 sm:w-24 mx-2",
                    index < currentStep ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-background-elevated border border-border rounded-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {steps[currentStep].label}
              </h2>
              <p className="text-sm text-foreground-muted mt-1">
                {steps[currentStep].description}
              </p>
            </div>
            {autoSaved && (
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Auto-saved</span>
              </div>
            )}
          </div>

          {/* Step 1: Company Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Company Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    handleFieldChange("companyName", e.target.value)
                  }
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border bg-background-subtle transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                    "placeholder:text-foreground-subtle",
                    errors.companyName
                      ? "border-destructive focus:ring-destructive"
                      : "border-border",
                  )}
                  placeholder="Enter your company name"
                />
                {errors.companyName && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Industry <span className="text-destructive">*</span>
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) =>
                    handleFieldChange("industry", e.target.value)
                  }
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border bg-background-subtle transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                    errors.industry
                      ? "border-destructive focus:ring-destructive"
                      : "border-border",
                  )}
                >
                  <option value="">Select an industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.industry}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="teamSize"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Team Size <span className="text-destructive">*</span>
                </label>
                <select
                  id="teamSize"
                  value={formData.teamSize}
                  onChange={(e) =>
                    handleFieldChange("teamSize", e.target.value)
                  }
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border bg-background-subtle transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                    errors.teamSize
                      ? "border-destructive focus:ring-destructive"
                      : "border-border",
                  )}
                >
                  <option value="">Select team size</option>
                  {teamSizes.map((size) => (
                    <option key={size} value={size}>
                      {size} employees
                    </option>
                  ))}
                </select>
                {errors.teamSize && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.teamSize}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Your Role <span className="text-destructive">*</span>
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border bg-background-subtle transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                    errors.role
                      ? "border-destructive focus:ring-destructive"
                      : "border-border",
                  )}
                >
                  <option value="">Select your role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.role}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground">
                    <strong className="font-medium">Pro Tip:</strong> We use
                    this information to customize your workspace and recommend
                    relevant features. You can change these settings anytime.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Primary Goal <span className="text-destructive">*</span>
                </label>
                <div className="space-y-2">
                  {goals.map((goal) => (
                    <label
                      key={goal}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                        formData.primaryGoal === goal
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background-subtle hover:border-border-hover",
                      )}
                    >
                      <input
                        type="radio"
                        name="primaryGoal"
                        value={goal}
                        checked={formData.primaryGoal === goal}
                        onChange={(e) =>
                          handleFieldChange("primaryGoal", e.target.value)
                        }
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{goal}</span>
                    </label>
                  ))}
                </div>
                {errors.primaryGoal && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.primaryGoal}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Use Cases <span className="text-destructive">*</span>
                  <span className="text-foreground-muted font-normal ml-1">
                    (Select all that apply)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {goals.map((useCase) => (
                    <button
                      key={useCase}
                      type="button"
                      onClick={() => toggleUseCase(useCase)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                        formData.useCases.includes(useCase)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background-subtle text-foreground hover:border-border-hover",
                      )}
                    >
                      {useCase}
                    </button>
                  ))}
                </div>
                {errors.useCases && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.useCases}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  AI Provider
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {aiProviders.map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => handleFieldChange("aiProvider", provider)}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-colors",
                        formData.aiProvider === provider
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background-subtle hover:border-border-hover",
                      )}
                    >
                      <div className="font-medium text-foreground">
                        {provider}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background-subtle">
                <div>
                  <div className="font-medium text-foreground">
                    Enable notifications
                  </div>
                  <div className="text-sm text-foreground-muted mt-1">
                    Get updates on agent runs and important events
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleFieldChange("notifications", !formData.notifications)
                  }
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    formData.notifications ? "bg-primary" : "bg-border",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      formData.notifications
                        ? "translate-x-6"
                        : "translate-x-1",
                    )}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Digest
                </label>
                <select
                  value={formData.emailDigest}
                  onChange={(e) =>
                    handleFieldChange("emailDigest", e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                You&apos;re All Set!
              </h3>
              <p className="text-foreground-muted mb-8">
                Your workspace is ready. Let&apos;s start building with AI
                agents.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg border border-border bg-background-subtle">
                  <div className="font-semibold text-foreground mb-1">
                    Company
                  </div>
                  <div className="text-sm text-foreground-muted">
                    {formData.companyName}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-background-subtle">
                  <div className="font-semibold text-foreground mb-1">
                    Industry
                  </div>
                  <div className="text-sm text-foreground-muted">
                    {formData.industry}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-background-subtle">
                  <div className="font-semibold text-foreground mb-1">
                    Primary Goal
                  </div>
                  <div className="text-sm text-foreground-muted">
                    {formData.primaryGoal}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            Skip onboarding
          </button>
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-2.5 rounded-lg border border-border bg-background hover:bg-hover text-foreground transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-medium transition-colors flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? "Go to Dashboard" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
