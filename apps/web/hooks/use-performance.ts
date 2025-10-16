"use client";

import { useEffect } from "react";

interface PerformanceMetrics {
  pageLoadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

export function usePerformanceMonitoring() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Collect Web Vitals
    const collectMetrics = () => {
      const metrics: PerformanceMetrics = {};

      // Page Load Time
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      }

      // First Contentful Paint
      const paintEntries = performance.getEntriesByType("paint");
      const fcp = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint",
      );
      if (fcp) {
        metrics.firstContentfulPaint = fcp.startTime;
      }

      // Log performance metrics in development
      if (process.env.NODE_ENV === "development") {
        console.log("🚀 Performance Metrics:", {
          ...metrics,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
        });
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === "production") {
        // Could send to analytics service here
        // analytics.track('page_performance', metrics);
      }
    };

    // Collect metrics after page load
    if (document.readyState === "complete") {
      setTimeout(collectMetrics, 1000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(collectMetrics, 1000);
      });
    }

    // Monitor long tasks (> 50ms)
    if ("PerformanceObserver" in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn("⚠️ Long Task detected:", {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ["longtask"] });
      } catch (e) {
        // Long task API not supported
      }

      // Cleanup
      return () => {
        longTaskObserver.disconnect();
      };
    }
  }, []);
}

// Hook for API performance monitoring
export function useApiPerformance() {
  return {
    measureApiCall: async <T>(
      apiCall: () => Promise<T>,
      endpoint: string,
    ): Promise<T> => {
      const start = performance.now();

      try {
        const result = await apiCall();
        const duration = performance.now() - start;

        if (process.env.NODE_ENV === "development") {
          console.log(`🔥 API Performance: ${endpoint}`, {
            duration: `${duration.toFixed(2)}ms`,
            success: true,
          });
        }

        // Log slow APIs
        if (duration > 2000) {
          console.warn(
            `🐌 Slow API detected: ${endpoint} took ${duration.toFixed(2)}ms`,
          );
        }

        return result;
      } catch (error) {
        const duration = performance.now() - start;

        if (process.env.NODE_ENV === "development") {
          console.error(`❌ API Error: ${endpoint}`, {
            duration: `${duration.toFixed(2)}ms`,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        throw error;
      }
    },
  };
}
