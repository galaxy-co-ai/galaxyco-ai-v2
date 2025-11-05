'use client';

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-purple-500',
  iconBg = 'bg-purple-500/10',
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <p className={cn('text-sm mt-2', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {trend.value}
            </p>
          )}
        </div>
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
    </Card>
  );
}
