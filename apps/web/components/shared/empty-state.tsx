import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
      <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
        <Icon className="h-8 w-8 text-neutral-600 dark:text-neutral-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
