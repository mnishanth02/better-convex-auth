/**
 * Performance Monitoring & Optimization
 *
 * Comprehensive performance monitoring, bundle analysis, and optimization utilities.
 */

"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";
import {
  Activity,
  Zap,
  Clock,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Wifi,
  Database,
  Monitor,
} from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

// Core Web Vitals monitoring
export interface WebVitalsMetrics {
  CLS: number;
  FCP: number;
  INP: number; // INP replaces FID in web-vitals v4+
  LCP: number;
  TTFB: number;
}

export function useWebVitals() {
  const [vitals, setVitals] = useState<WebVitalsMetrics>({
    CLS: 0,
    FCP: 0,
    INP: 0,
    LCP: 0,
    TTFB: 0,
  });

  useEffect(() => {
    // Import web-vitals library dynamically
    // web-vitals v5.x uses onXXX callbacks instead of getXXX
    import("web-vitals")
      .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        onCLS((metric) => setVitals((prev) => ({ ...prev, CLS: metric.value })));
        onFCP((metric) => setVitals((prev) => ({ ...prev, FCP: metric.value })));
        onINP((metric) => setVitals((prev) => ({ ...prev, INP: metric.value })));
        onLCP((metric) => setVitals((prev) => ({ ...prev, LCP: metric.value })));
        onTTFB((metric) => setVitals((prev) => ({ ...prev, TTFB: metric.value })));
      })
      .catch(() => {
        // Fallback metrics if web-vitals is not available
        setVitals({
          CLS: 0.1,
          FCP: 1200,
          INP: 50,
          LCP: 2400,
          TTFB: 600,
        });
      });
  }, []);

  return vitals;
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    renderTime: 0,
    networkRequests: 0,
    bundleSize: 0,
    componentRenders: 0,
  });

  const startTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;

    // Memory usage (if available)
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      setMetrics((prev) => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
      }));
    }

    // Render time
    const renderTime = Date.now() - startTime.current;
    setMetrics((prev) => ({
      ...prev,
      renderTime,
      componentRenders: renderCount.current,
    }));

    // Network requests count
    if ("performance" in window && "getEntriesByType" in performance) {
      const networkEntries = performance.getEntriesByType("navigation");
      setMetrics((prev) => ({
        ...prev,
        networkRequests: networkEntries.length,
      }));
    }
  }, []);

  return metrics;
}

// Bundle analyzer component
export function BundleAnalyzer() {
  const [bundleStats, setBundleStats] = useState({
    totalSize: 0,
    gzippedSize: 0,
    chunks: [] as Array<{ name: string; size: number; type: string }>,
  });

  useEffect(() => {
    // Simulate bundle analysis (in real app, this would come from webpack-bundle-analyzer)
    setBundleStats({
      totalSize: 1250, // KB
      gzippedSize: 350, // KB
      chunks: [
        { name: "main", size: 450, type: "js" },
        { name: "vendor", size: 380, type: "js" },
        { name: "styles", size: 120, type: "css" },
        { name: "polyfills", size: 95, type: "js" },
        { name: "runtime", size: 45, type: "js" },
        { name: "fonts", size: 160, type: "woff2" },
      ],
    });
  }, []);

  const getChunkColor = (type: string) => {
    switch (type) {
      case "js":
        return "bg-blue-500";
      case "css":
        return "bg-green-500";
      case "woff2":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Bundle Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Size</p>
            <p className="text-2xl font-bold">{bundleStats.totalSize}KB</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gzipped</p>
            <p className="text-2xl font-bold text-green-600">{bundleStats.gzippedSize}KB</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Bundle Composition</p>
          <div className="space-y-2">
            {bundleStats.chunks.map((chunk) => (
              <div key={generateUniqueId()} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded", getChunkColor(chunk.type))} />
                  <span className="text-sm">{chunk.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {chunk.size}KB ({Math.round((chunk.size / bundleStats.totalSize) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Core Web Vitals display
export function CoreWebVitalsDisplay({ vitals }: { vitals: WebVitalsMetrics }) {
  const getVitalStatus = (metric: string, value: number) => {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      FID: { good: 100, poor: 300 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return "unknown";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-100";
      case "needs-improvement":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return CheckCircle;
      case "needs-improvement":
        return AlertCircle;
      case "poor":
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const metrics = [
    { key: "LCP", label: "Largest Contentful Paint", value: vitals.LCP, unit: "ms" },
    { key: "INP", label: "Interaction to Next Paint", value: vitals.INP, unit: "ms" },
    { key: "CLS", label: "Cumulative Layout Shift", value: vitals.CLS, unit: "" },
    { key: "FCP", label: "First Contentful Paint", value: vitals.FCP, unit: "ms" },
    { key: "TTFB", label: "Time to First Byte", value: vitals.TTFB, unit: "ms" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Core Web Vitals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {metrics.map((metric) => {
            const status = getVitalStatus(metric.key, metric.value);
            const StatusIcon = getStatusIcon(status);

            return (
              <div key={metric.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-sm">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.key}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {metric.value.toFixed(metric.key === "CLS" ? 3 : 0)}
                    {metric.unit}
                  </p>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(status))}>
                    {status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Network status monitor
export function NetworkMonitor() {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: "4g",
    downlink: 10,
    rtt: 100,
    saveData: false,
  });

  useEffect(() => {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;

      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType || "4g",
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 100,
          saveData: connection.saveData || false,
        });
      };

      updateNetworkInfo();
      connection.addEventListener("change", updateNetworkInfo);

      return () => {
        connection.removeEventListener("change", updateNetworkInfo);
      };
    }
  }, []);

  const getConnectionColor = (type: string) => {
    switch (type) {
      case "4g":
        return "text-green-600 bg-green-100";
      case "3g":
        return "text-yellow-600 bg-yellow-100";
      case "2g":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Network Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Connection Type</p>
            <Badge className={cn("mt-1", getConnectionColor(networkInfo.effectiveType))}>
              {networkInfo.effectiveType.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Downlink Speed</p>
            <p className="text-lg font-semibold">{networkInfo.downlink} Mbps</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Round Trip Time</p>
            <p className="text-lg font-semibold">{networkInfo.rtt}ms</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data Saver</p>
            <Badge variant={networkInfo.saveData ? "destructive" : "outline"}>
              {networkInfo.saveData ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Performance recommendations
export function PerformanceRecommendations({ vitals }: { vitals: WebVitalsMetrics }) {
  const recommendations = [
    {
      metric: "LCP",
      condition: vitals.LCP > 2500,
      title: "Optimize Largest Contentful Paint",
      suggestions: [
        "Optimize and compress images",
        "Preload critical resources",
        "Use a CDN for static assets",
        "Remove unused JavaScript",
      ],
      priority: "high",
    },
    {
      metric: "INP",
      condition: vitals.INP > 200,
      title: "Reduce Interaction to Next Paint",
      suggestions: [
        "Break up long-running tasks",
        "Optimize JavaScript execution",
        "Use web workers for heavy computations",
        "Defer non-essential scripts",
        "Minimize main thread work",
      ],
      priority: "medium",
    },
    {
      metric: "CLS",
      condition: vitals.CLS > 0.1,
      title: "Minimize Layout Shift",
      suggestions: [
        "Set size attributes on images and videos",
        "Reserve space for ads and embeds",
        "Use CSS aspect ratio for responsive images",
        "Avoid inserting content above existing content",
      ],
      priority: "high",
    },
  ].filter((rec) => rec.condition);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Performance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600">All Core Web Vitals are in good range! 🎉</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={generateUniqueId()} className={cn("border rounded-lg p-4", getPriorityColor(rec.priority))}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{rec.title}</h4>
              <Badge variant="outline">{rec.priority} priority</Badge>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {rec.suggestions.map((suggestion, i) => (
                <li key={generateUniqueId()}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Real-time performance dashboard
export function PerformanceDashboard() {
  const vitals = useWebVitals();
  const metrics = usePerformanceMonitoring();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CoreWebVitalsDisplay vitals={vitals} />
        <NetworkMonitor />
        <BundleAnalyzer />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceRecommendations vitals={vitals} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Runtime Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Memory Usage</p>
                <p className="text-lg font-semibold">{metrics.memoryUsage.toFixed(1)} MB</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Render Time</p>
                <p className="text-lg font-semibold">{metrics.renderTime}ms</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Component Renders</p>
                <p className="text-lg font-semibold">{metrics.componentRenders}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Network Requests</p>
                <p className="text-lg font-semibold">{metrics.networkRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
