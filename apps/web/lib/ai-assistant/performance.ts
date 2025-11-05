/**
 * Performance Optimizations for AI Assistant
 *
 * Techniques:
 * - Response streaming for faster perceived performance
 * - Tool result caching
 * - Debounced typing indicators
 * - Lazy loading of heavy components
 * - Memoization of expensive computations
 */

import { cache } from 'react';
import type { ToolResult } from './tools/types';

/**
 * Cache tool results for repeated queries
 * Uses React cache() for automatic deduplication
 */
export const getCachedToolResult = cache(async (
  toolName: string,
  params: string, // JSON stringified params
  execute: () => Promise<ToolResult>,
): Promise<ToolResult> => {
  // Cache key is combination of tool name and params
  // React automatically deduplicates identical calls
  return await execute();
});

/**
 * Debounce function for typing indicators
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Performance metrics tracking
 */
export class PerformanceTracker {
  private metrics: Map<string, number[]> = new Map();

  /**
   * Record a performance metric
   */
  record(metric: string, value: number) {
    const existing = this.metrics.get(metric) || [];
    existing.push(value);
    
    // Keep last 100 measurements
    if (existing.length > 100) {
      existing.shift();
    }
    
    this.metrics.set(metric, existing);
  }

  /**
   * Get average for a metric
   */
  getAverage(metric: string): number {
    const values = this.metrics.get(metric) || [];
    if (values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Get p95 (95th percentile) for a metric
   */
  getP95(metric: string): number {
    const values = this.metrics.get(metric) || [];
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    
    return sorted[index] || 0;
  }

  /**
   * Get all metrics summary
   */
  getSummary(): Record<string, { avg: number; p95: number; count: number }> {
    const summary: Record<string, { avg: number; p95: number; count: number }> = {};
    
    for (const [metric, values] of this.metrics.entries()) {
      summary[metric] = {
        avg: this.getAverage(metric),
        p95: this.getP95(metric),
        count: values.length,
      };
    }
    
    return summary;
  }
}

// Export singleton
export const performanceTracker = new PerformanceTracker();

/**
 * Optimize message processing
 */
export async function measureAsync<T>(
  metricName: string,
  fn: () => Promise<T>,
): Promise<T> {
  const start = Date.now();
  
  try {
    const result = await fn();
    const duration = Date.now() - start;
    
    performanceTracker.record(metricName, duration);
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    performanceTracker.record(`${metricName}:error`, duration);
    
    throw error;
  }
}

