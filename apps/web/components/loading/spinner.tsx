'use client';

import { Spinner as KiboSpinner } from '@/src/components/kibo-ui/spinner';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'throbber' | 'pinwheel' | 'ring' | 'bars';
}

/**
 * Loading Spinner Component (Kibo UI)
 *
 * Animated spinner for loading states using Kibo UI Spinner
 */
export function Spinner({ size = 'md', className, variant = 'default' }: SpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return <KiboSpinner variant={variant} size={sizeMap[size]} className={cn(className)} />;
}

/**
 * Inline Loading Component
 */
export function InlineLoading({
  text = 'Loading...',
  size = 'md',
  className,
}: {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Spinner size={size} />
      <span className={textSizes[size]}>{text}</span>
    </div>
  );
}

/**
 * Centered Loading Component
 */
export function CenteredLoading({
  text = 'Loading...',
  size = 'md',
  className,
  minHeight = '200px',
}: {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  minHeight?: string;
}) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center space-y-2', className)}
      style={{ minHeight }}
    >
      <Spinner size={size} />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

/**
 * Full Screen Loading Component
 */
export function FullScreenLoading({
  text = 'Loading...',
  backdrop = true,
}: {
  text?: string;
  backdrop?: boolean;
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        backdrop && 'bg-background/80 backdrop-blur-sm',
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="xl" />
        <p className="text-lg font-medium">{text}</p>
      </div>
    </div>
  );
}

/**
 * Button Loading Component
 */
export function ButtonLoading({
  children,
  isLoading,
  loadingText,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  [key: string]: any;
}) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center',
        isLoading && 'cursor-not-allowed opacity-70',
        props.className,
      )}
    >
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}

/**
 * Content Loading Overlay
 */
export function ContentLoadingOverlay({
  isLoading,
  children,
  text = 'Loading...',
}: {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center space-x-2 bg-background border rounded-lg px-4 py-2 shadow-lg">
            <Spinner size="sm" />
            <span className="text-sm font-medium">{text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Progress Loading Bar
 */
export function ProgressBar({
  progress,
  className,
  showPercentage = false,
}: {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Loading...</span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Dots Loading Animation
 */
export function DotsLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'h-2 w-2 rounded-full bg-current animate-pulse',
            index === 0 && 'animation-delay-0',
            index === 1 && 'animation-delay-150',
            index === 2 && 'animation-delay-300',
          )}
          style={{
            animationDelay: `${index * 150}ms`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Pulsing Loading Component
 */
export function PulseLoading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('animate-pulse', className)}>{children}</div>;
}
