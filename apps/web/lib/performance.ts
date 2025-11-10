"use client";

import React, { useCallback, useEffect, useRef } from "react";

/**
 * Performance monitoring utilities for tracking Core Web Vitals
 * and component render performance
 */

interface PerformanceMetrics {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta?: number;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TTFB: { good: 800, needsImprovement: 1800 },
  TTI: { good: 3500, needsImprovement: 7300 },
};

function getRating(metric: string, value: number): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.needsImprovement) return "needs-improvement";
  return "poor";
}

/**
 * Hook to measure component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderStart = useRef<number>(0);
  const mountTime = useRef<number>(0);


  useEffect(() => {
    mountTime.current = performance.now();

    return () => {
      if (mountTime.current) {
        const mountDuration = performance.now() - mountTime.current;
        console.log(`[Performance] ${componentName} mount time: ${mountDuration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  const measureRender = useCallback(
    (operationName?: string) => {
      renderStart.current = performance.now();

      return () => {
        if (renderStart.current) {
          const duration = performance.now() - renderStart.current;
          const operation = operationName || "render";
          console.log(`[Performance] ${componentName} ${operation}: ${duration.toFixed(2)}ms`);

          if (duration > 16.67) {
            // More than one frame (60fps)
            console.warn(
              `[Performance Warning] ${componentName} ${operation} took ${duration.toFixed(2)}ms (>16.67ms)`,
            );
          }
        }
      };
    },
    [componentName],
  );

  return { measureRender };
}

/**
 * Hook to track Web Vitals
 */
export function useWebVitals() {
  const metrics = useRef<PerformanceMetrics[]>([]);

  const trackMetric = useCallback((metric: PerformanceMetrics) => {
    metrics.current.push(metric);

    console.log(`[Web Vital] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // You could send to analytics service here
      // analytics.track('web-vital', metric);
    }
  }, []);

  useEffect(() => {
    // Track Core Web Vitals using the Web Vitals API
    if (typeof window !== "undefined" && "performance" in window) {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            trackMetric({
              name: "FCP",
              value: entry.startTime,
              rating: getRating("FCP", entry.startTime),
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ["paint"] });
      } catch (e) {
        // Paint timing not supported
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        if (lastEntry) {
          trackMetric({
            name: "LCP",
            value: lastEntry.startTime,
            rating: getRating("LCP", lastEntry.startTime),
          });
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // LCP not supported
      }

      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
      };
    }
  }, [trackMetric]);

  return { metrics: metrics.current, trackMetric };
}

/**
 * Performance-optimized component wrapper
 */
export function withPerformanceMonitoring<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName?: string,
) {
  const name = componentName || Component.displayName || Component.name || "UnknownComponent";

  return function PerformanceMonitoredComponent(props: T) {
    const { measureRender } = useRenderPerformance(name);

    useEffect(() => {
      const endMeasure = measureRender("mount");
      return endMeasure;
    }, [measureRender]);

    return React.createElement(Component, props);
  };
}
