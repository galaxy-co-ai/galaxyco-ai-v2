import { Card } from "../ui/card";

interface Step {
  id: string;
  label: string;
  completed: boolean;
  icon: string;
}

interface ProgressTrackerProps {
  steps: Step[];
  onStepClick?: (stepId: string) => void;
}

export function ProgressTracker({ steps, onStepClick }: ProgressTrackerProps) {
  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold m-0">Setup Progress</h3>
          <span className="text-sm font-semibold text-blue-600">
            {percentage}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => !step.completed && onStepClick?.(step.id)}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              step.completed
                ? "bg-green-50 border-green-500"
                : "bg-gray-50 border-gray-200"
            } ${
              !step.completed && onStepClick
                ? "cursor-pointer hover:bg-gray-100"
                : "cursor-default"
            }`}
          >
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full text-lg font-semibold shrink-0 ${
                step.completed
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {step.completed ? "✓" : step.icon}
            </div>
            <span
              className={`${
                step.completed
                  ? "text-green-800 font-medium line-through"
                  : "text-gray-700"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {percentage === 100 && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="font-semibold mb-1">Setup Complete!</div>
          <div className="text-sm opacity-90">
            Your workspace is fully configured and ready to use
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * Hook to track workspace setup progress
 */
export function useWorkspaceProgress(workspace: any) {
  const onboardingProfile = workspace.settings?.onboardingProfile;
  // Note: Agent and tool tracking will be implemented when we have active agents
  const hasAgents = false;
  const hasConnectedTools = false;

  const steps = [
    {
      id: "profile",
      label: "Complete your profile",
      completed: !!onboardingProfile,
      icon: "👤",
    },
    {
      id: "agent",
      label: "Enable your first agent",
      completed: hasAgents,
      icon: "🤖",
    },
    {
      id: "tools",
      label: "Connect your tools",
      completed: hasConnectedTools,
      icon: "🔗",
    },
    {
      id: "marketplace",
      label: "Explore the marketplace",
      completed: false,
      icon: "🛍️",
    },
  ];

  return {
    steps,
    completedCount: steps.filter((s) => s.completed).length,
    totalCount: steps.length,
    percentage: Math.round(
      (steps.filter((s) => s.completed).length / steps.length) * 100,
    ),
  };
}
