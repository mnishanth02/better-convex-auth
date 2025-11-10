/**
 * Image & Performance Optimization Demo
 *
 * Comprehensive showcase of optimized images, performance monitoring, and optimization techniques.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

// Image optimization components
import {
  OptimizedImage,
  OptimizedAvatar,
  ImageGallery,
  HeroImage,
  ZoomableImage,
  ImagePlaceholder,
  useImagePerformance,
} from "@/components/ui/optimized-image";

// Performance monitoring components
import { PerformanceDashboard, useWebVitals, usePerformanceMonitoring } from "@/components/ui/performance-monitoring";

// Design tokens
import {
  Container,
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Muted,
  Space,
  Grid,
  Flex,
  ElevatedCard,
} from "@/components/ui/design-tokens";

import {
  Image as ImageIcon,
  Gauge,
  Zap,
  Monitor,
  Camera,
  Download,
  Users,
  TrendingUp,
  Settings,
  Eye,
  Clock,
  Database,
} from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

export default function ImagePerformancePage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadingTest, setLoadingTest] = useState(false);
  const vitals = useWebVitals();
  const performanceMetrics = usePerformanceMonitoring();
  const { metrics: imageMetrics, trackImageLoad, trackImageError } = useImagePerformance();

  // Sample image data
  const galleryImages = [
    {
      src: "https://picsum.photos/400/300?random=1",
      alt: "Sample image 1",
      caption: "Optimized with Next.js Image",
      width: 400,
      height: 300,
    },
    {
      src: "https://picsum.photos/400/300?random=2",
      alt: "Sample image 2",
      caption: "Lazy loaded with intersection observer",
      width: 400,
      height: 300,
    },
    {
      src: "https://picsum.photos/400/300?random=3",
      alt: "Sample image 3",
      caption: "Progressive JPEG with blur placeholder",
      width: 400,
      height: 300,
    },
    {
      src: "https://picsum.photos/400/300?random=4",
      alt: "Sample image 4",
      caption: "WebP format for modern browsers",
      width: 400,
      height: 300,
    },
    {
      src: "https://picsum.photos/400/300?random=5",
      alt: "Sample image 5",
      caption: "Responsive with multiple sizes",
      width: 400,
      height: 300,
    },
    {
      src: "https://picsum.photos/400/300?random=6",
      alt: "Sample image 6",
      caption: "CDN optimized delivery",
      width: 400,
      height: 300,
    },
  ];

  const avatarUsers = [
    { name: "Alice Johnson", src: "https://picsum.photos/100/100?random=10", role: "Designer" },
    { name: "Bob Smith", src: "https://picsum.photos/100/100?random=11", role: "Developer" },
    { name: "Carol Davis", src: "https://picsum.photos/100/100?random=12", role: "Manager" },
    { name: "David Wilson", src: "https://picsum.photos/100/100?random=13", role: "Analyst" },
  ];

  const performHeavyTask = async () => {
    setLoadingTest(true);

    // Simulate heavy computation
    await new Promise((resolve) => {
      const start = performance.now();
      while (performance.now() - start < 2000) {
        // Heavy computation simulation
        Math.random() * Math.random();
      }
      resolve(undefined);
    });

    setLoadingTest(false);
  };

  const optimizationFeatures = [
    {
      icon: Zap,
      title: "Lazy Loading",
      description: "Images load only when they enter the viewport using Intersection Observer API",
      benefits: ["Faster initial page load", "Reduced bandwidth usage", "Better Core Web Vitals"],
    },
    {
      icon: Database,
      title: "Format Optimization",
      description: "Automatic WebP/AVIF format selection with fallbacks for older browsers",
      benefits: ["50% smaller file sizes", "Better compression", "Maintains image quality"],
    },
    {
      icon: Monitor,
      title: "Responsive Images",
      description: "Multiple image sizes generated automatically for different screen densities",
      benefits: ["Perfect image sizing", "Reduced data usage", "Crisp on all devices"],
    },
    {
      icon: TrendingUp,
      title: "Performance Monitoring",
      description: "Real-time Core Web Vitals tracking with actionable recommendations",
      benefits: ["LCP optimization", "CLS prevention", "FID improvement"],
    },
  ];

  return (
    <Container size="xl" className="py-8 space-y-12">
      <div className="text-center space-y-4">
        <H1>Image & Performance Optimization</H1>
        <Lead>Next.js Image optimization, lazy loading, performance monitoring, and Core Web Vitals</Lead>
      </div>

      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="images">Optimized Images</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Optimized Images Tab */}
        <TabsContent value="images" className="space-y-8">
          <div>
            <H2 className="mb-6">Image Components Showcase</H2>

            {/* Hero Image */}
            <div className="mb-8">
              <H3 className="mb-4">Hero Image with Overlay</H3>
              <HeroImage
                src="https://picsum.photos/1200/400?random=20"
                alt="Hero banner"
                height="h-64"
                overlay
                overlayContent={
                  <div className="text-white">
                    <H2 className="text-white mb-2">Optimized Hero Image</H2>
                    <P className="text-white/90">Priority loading, perfect sizing, and WebP format</P>
                  </div>
                }
              />
            </div>

            {/* Avatar Gallery */}
            <div className="mb-8">
              <H3 className="mb-4">Optimized Avatars</H3>
              <ElevatedCard level={1}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Grid cols={{ sm: 2, md: 4 }} gap="md">
                    {avatarUsers.map((user) => (
                      <Flex key={generateUniqueId()} direction="col" align="center" gap="sm" className="text-center">
                        <OptimizedAvatar
                          src={user.src}
                          alt={user.name}
                          size="xl"
                          initials={user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        />
                        <div>
                          <P className="font-medium text-sm">{user.name}</P>
                          <Muted>{user.role}</Muted>
                        </div>
                      </Flex>
                    ))}
                  </Grid>
                </CardContent>
              </ElevatedCard>
            </div>

            {/* Zoomable Images */}
            <div className="mb-8">
              <H3 className="mb-4">Interactive Images</H3>
              <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
                <ElevatedCard level={2}>
                  <CardContent className="p-4">
                    <ZoomableImage
                      src="https://picsum.photos/300/200?random=30"
                      alt="Zoomable image"
                      width={300}
                      height={200}
                      className="w-full"
                    />
                    <Space size="sm" />
                    <P className="text-sm">Click to zoom, rotate, or download</P>
                  </CardContent>
                </ElevatedCard>

                <ElevatedCard level={2}>
                  <CardContent className="p-4">
                    <OptimizedImage
                      src="https://picsum.photos/300/200?random=31"
                      alt="Optimized image"
                      width={300}
                      height={200}
                      className="w-full rounded-lg"
                      showLoadingIndicator
                    />
                    <Space size="sm" />
                    <P className="text-sm">Optimized with blur placeholder</P>
                  </CardContent>
                </ElevatedCard>

                <ElevatedCard level={2}>
                  <CardContent className="p-4">
                    <ImagePlaceholder width={300} height={200} text="Placeholder" className="w-full" />
                    <Space size="sm" />
                    <P className="text-sm">Graceful fallback for missing images</P>
                  </CardContent>
                </ElevatedCard>
              </Grid>
            </div>

            {/* Image Gallery */}
            <div>
              <H3 className="mb-4">Lazy-loaded Gallery</H3>
              <ElevatedCard level={1}>
                <CardContent className="p-6">
                  <ImageGallery images={galleryImages} columns={3} onImageClick={setSelectedImageIndex} />
                  <Space size="md" />
                  <Muted>Click any image to view details. All images are lazy-loaded and optimized.</Muted>
                </CardContent>
              </ElevatedCard>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-8">
          <div>
            <H2 className="mb-6">Performance Dashboard</H2>
            <PerformanceDashboard />
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-8">
          <div>
            <H2 className="mb-6">Real-time Monitoring</H2>

            <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
              {/* Image Performance */}
              <ElevatedCard level={2}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Image Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Muted>Loaded</Muted>
                      <P className="text-2xl font-bold text-green-600">{imageMetrics.loadedImages}</P>
                    </div>
                    <div>
                      <Muted>Failed</Muted>
                      <P className="text-2xl font-bold text-red-600">{imageMetrics.failedImages}</P>
                    </div>
                  </div>
                  <div>
                    <Muted>Average Load Time</Muted>
                    <P className="text-lg font-semibold">{imageMetrics.averageLoadTime.toFixed(0)}ms</P>
                  </div>
                </CardContent>
              </ElevatedCard>

              {/* Core Web Vitals Summary */}
              <ElevatedCard level={2}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Core Web Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Flex justify="between" align="center">
                    <Muted>LCP</Muted>
                    <Badge variant={vitals.LCP <= 2500 ? "default" : "destructive"}>{vitals.LCP.toFixed(0)}ms</Badge>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Muted>INP</Muted>
                    <Badge variant={vitals.INP <= 200 ? "default" : "destructive"}>{vitals.INP.toFixed(0)}ms</Badge>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Muted>CLS</Muted>
                    <Badge variant={vitals.CLS <= 0.1 ? "default" : "destructive"}>{vitals.CLS.toFixed(3)}</Badge>
                  </Flex>
                </CardContent>
              </ElevatedCard>

              {/* Runtime Performance */}
              <ElevatedCard level={2}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Runtime Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Muted>Memory Usage</Muted>
                    <P className="text-lg font-semibold">{performanceMetrics.memoryUsage.toFixed(1)} MB</P>
                  </div>
                  <div>
                    <Muted>Component Renders</Muted>
                    <P className="text-lg font-semibold">{performanceMetrics.componentRenders}</P>
                  </div>
                  <Button onClick={performHeavyTask} disabled={loadingTest} size="sm" className="w-full">
                    {loadingTest ? "Running..." : "Test Performance"}
                  </Button>
                </CardContent>
              </ElevatedCard>
            </Grid>
          </div>
        </TabsContent>

        {/* Optimization Features Tab */}
        <TabsContent value="optimization" className="space-y-8">
          <div>
            <H2 className="mb-6">Optimization Features</H2>

            <Grid cols={{ sm: 1, md: 2 }} gap="lg">
              {optimizationFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <ElevatedCard key={generateUniqueId()} level={2}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <P className="text-sm text-muted-foreground">{feature.description}</P>
                      <div>
                        <H4 className="mb-2 text-sm">Benefits:</H4>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit) => (
                            <li
                              key={generateUniqueId()}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-green-500 mt-0.5">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </ElevatedCard>
                );
              })}
            </Grid>

            <Space size="lg" />

            {/* Best Practices */}
            <ElevatedCard level={1}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Optimization Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="md">
                  <div>
                    <H4 className="mb-2">Image Optimization</H4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Use Next.js Image component</li>
                      <li>• Enable WebP/AVIF formats</li>
                      <li>• Implement lazy loading</li>
                      <li>• Optimize image sizes</li>
                      <li>• Use blur placeholders</li>
                    </ul>
                  </div>

                  <div>
                    <H4 className="mb-2">Performance</H4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Monitor Core Web Vitals</li>
                      <li>• Use React.memo for expensive components</li>
                      <li>• Implement code splitting</li>
                      <li>• Optimize bundle size</li>
                      <li>• Enable compression</li>
                    </ul>
                  </div>

                  <div>
                    <H4 className="mb-2">Loading States</H4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Show skeleton screens</li>
                      <li>• Implement progressive enhancement</li>
                      <li>• Use Suspense boundaries</li>
                      <li>• Preload critical resources</li>
                      <li>• Cache aggressively</li>
                    </ul>
                  </div>
                </Grid>
              </CardContent>
            </ElevatedCard>
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
