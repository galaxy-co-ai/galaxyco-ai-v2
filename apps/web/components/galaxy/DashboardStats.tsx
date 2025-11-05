'use client';

import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsPillProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: 'blue' | 'green' | 'purple' | 'orange';
  className?: string;
}

const variantConfig = {
  blue: {
    gradient: 'from-blue-500/10 to-blue-500/20',
    text: 'text-blue-600',
    shadow:
      'shadow-[0_2px_10px_rgb(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgb(59,130,246,0.25)]',
  },
  green: {
    gradient: 'from-green-500/10 to-green-500/20',
    text: 'text-green-600',
    shadow: 'shadow-[0_2px_10px_rgb(34,197,94,0.15)] hover:shadow-[0_4px_20px_rgb(34,197,94,0.25)]',
  },
  purple: {
    gradient: 'from-purple-500/10 to-purple-500/20',
    text: 'text-purple-600',
    shadow:
      'shadow-[0_2px_10px_rgb(168,85,247,0.15)] hover:shadow-[0_4px_20px_rgb(168,85,247,0.25)]',
  },
  orange: {
    gradient: 'from-orange-500/10 to-orange-500/20',
    text: 'text-orange-600',
    shadow:
      'shadow-[0_2px_10px_rgb(249,115,22,0.15)] hover:shadow-[0_4px_20px_rgb(249,115,22,0.25)]',
  },
};

export function StatsPill({
  icon: Icon,
  label,
  value,
  variant = 'blue',
  className,
}: StatsPillProps) {
  const config = variantConfig[variant];

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-8 px-4 rounded-full border-0',
        `bg-gradient-to-br ${config.gradient}`,
        config.text,
        config.shadow,
        'transition-all duration-200',
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 mr-2" />
      <span className="text-xs font-medium">
        {value} {label}
      </span>
    </Badge>
  );
}

interface DashboardStatsProps {
  stats: {
    label: string;
    value: string | number;
    icon: LucideIcon;
    variant: 'blue' | 'green' | 'purple' | 'orange';
  }[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {stats.map((stat) => (
        <StatsPill
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          variant={stat.variant}
        />
      ))}
    </div>
  );
}
