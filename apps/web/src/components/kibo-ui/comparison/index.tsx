/**
 * Kibo UI - Comparison Component (Temporary - Replace with official when available)
 * Before/after image comparison slider
 */

'use client';

import { cn } from '@/lib/utils';
import { useState, useRef, type MouseEvent, type TouchEvent } from 'react';

export interface ComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function Comparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
}: ComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only when mouse button is pressed
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-video w-full cursor-ew-resize overflow-hidden rounded-lg',
        className,
      )}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <img src={beforeImage} alt={beforeLabel} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white">
          {beforeLabel}
        </div>
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={afterImage} alt={afterLabel} className="h-full w-full object-cover" />
        <div className="absolute right-4 top-4 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white">
          {afterLabel}
        </div>
      </div>

      {/* Slider */}
      <div
        className="absolute inset-y-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg">
          <div className="flex gap-0.5">
            <div className="h-4 w-0.5 bg-gray-400" />
            <div className="h-4 w-0.5 bg-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
