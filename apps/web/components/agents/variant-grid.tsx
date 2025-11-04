'use client';

import { Check } from 'lucide-react';
import type { AgentVariant } from '@/lib/stores/agent-builder-store';

interface VariantGridProps {
  variants: AgentVariant[];
  onSelectVariant: (variant: AgentVariant) => void;
}

const VARIANT_COLORS = {
  basic: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
  },
  advanced: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
  },
  minimal: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-700',
  },
};

export function VariantGrid({ variants, onSelectVariant }: VariantGridProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Choose Your Agent Configuration</h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Select the version that best fits your needs
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {variants.map((variant) => {
          const colors = VARIANT_COLORS[variant.type];
          const stars =
            variant.type === 'basic' ? '⭐⭐' : variant.type === 'advanced' ? '⭐⭐⭐' : '⭐';

          return (
            <div
              key={variant.id}
              className={`group relative flex flex-col rounded-lg border-2 ${colors.border} bg-white dark:bg-neutral-900 p-6 hover:shadow-lg transition-all`}
            >
              {/* Badge */}
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full ${colors.bg} px-3 py-1 text-xs font-medium ${colors.text} uppercase tracking-wide mb-4`}
              >
                {variant.type} {stars}
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                {variant.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    ⚙️ {variant.estimatedSteps} Steps
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    🔌 {variant.integrations.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    ⏱️{' '}
                    {variant.complexity === 'low'
                      ? '~2 min setup'
                      : variant.complexity === 'medium'
                        ? '~5 min setup'
                        : '~10 min setup'}
                  </span>
                </div>
              </div>

              {/* Workflow Preview (Mini) */}
              <div className="border-t pt-4 mb-4">
                <p className="text-xs text-neutral-500 mb-2">Workflow Steps:</p>
                <div className="space-y-1">
                  {variant.workflow.slice(0, 3).map((node, idx) => (
                    <div
                      key={node.id}
                      className="text-xs text-neutral-600 dark:text-neutral-400 truncate"
                    >
                      {idx + 1}. {node.label}
                    </div>
                  ))}
                  {variant.workflow.length > 3 && (
                    <div className="text-xs text-neutral-500">
                      +{variant.workflow.length - 3} more steps
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => onSelectVariant(variant)}
                className={`mt-auto w-full inline-flex items-center justify-center gap-2 rounded-md ${colors.bg} ${colors.text} px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity`}
              >
                <Check className="h-4 w-4" />
                Select This Version
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
