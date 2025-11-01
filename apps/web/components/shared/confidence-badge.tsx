import { cn, getConfidenceColor } from '@/lib/utils';

interface ConfidenceBadgeProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceBadge({ score, showLabel = true, className }: ConfidenceBadgeProps) {
  const color = getConfidenceColor(score);
  const percentage = Math.round(score * 100);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-confidence-high/10 text-confidence-high': color === 'high',
          'bg-confidence-medium/10 text-confidence-medium': color === 'medium',
          'bg-confidence-low/10 text-confidence-low': color === 'low',
        },
        className,
      )}
    >
      <div
        className={cn('h-1.5 w-1.5 rounded-full', {
          'bg-confidence-high': color === 'high',
          'bg-confidence-medium': color === 'medium',
          'bg-confidence-low': color === 'low',
        })}
      />
      {showLabel && <span>{percentage}%</span>}
    </div>
  );
}
