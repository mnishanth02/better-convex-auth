/**
 * UI Polish & Micro-interactions Demo
 *
 * Comprehensive showcase of loading states, animations, design tokens, and micro-interactions.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";

// Loading States
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
  LoadingButton,
  PageLoader,
  ProfilePageLoader,
  DashboardLoader,
  ListLoader,
  ErrorState,
  FadeIn,
  StaggerContainer,
} from "@/components/ui/loading-states";

// Micro-interactions
import {
  HoverLift,
  AnimatedButton,
  LikeButton,
  StarRating,
  BookmarkButton,
  SuccessCheckmark,
  FloatingActionButton,
  AnimatedProgress,
  NotificationToast,
  PulseLoader,
  InteractiveCard,
  AnimatedCounter,
} from "@/components/ui/micro-interactions";

// Design Tokens
import {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Muted,
  Small,
  Space,
  Container,
  Section,
  Grid,
  Flex,
  StatusBadge,
  PriorityBadge,
  ElevatedCard,
  VisualSeparator,
  ColorPalette,
  TypographyScale,
  SpacingScale,
} from "@/components/ui/design-tokens";

import {
  Palette,
  Zap,
  Heart,
  Star,
  Bookmark,
  Timer,
  Sparkles,
  MousePointer,
  Eye,
  Gauge,
  Plus,
  Settings,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

export default function UIPolishPage() {
  const [loadingStates, setLoadingStates] = useState({
    button: false,
    page: false,
    list: false,
    profile: false,
    dashboard: false,
  });
  const [rating, setRating] = useState(4);
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedFAB, setExpandedFAB] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [counterValue, setCounterValue] = useState(1234);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAsyncAction = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const toggleLoading = (key: keyof typeof loadingStates) => {
    setLoadingStates((prev) => ({ ...prev, [key]: !prev[key] }));
    if (!loadingStates[key]) {
      setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, [key]: false }));
      }, 3000);
    }
  };

  return (
    <Container size="xl" className="py-8 space-y-12">
      <div className="text-center space-y-4">
        <H1>UI Polish & Micro-interactions</H1>
        <Lead>Comprehensive showcase of loading states, animations, and delightful interactions</Lead>
      </div>

      {/* Loading States Section */}
      <Section>
        <H2 className="mb-8">Loading States & Skeletons</H2>

        <Grid cols={{ sm: 1, md: 2 }} gap="lg">
          <ElevatedCard level={1}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Basic Skeletons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Small>Single line</Small>
                <Space size="xs" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div>
                <Small>Multiple lines</Small>
                <Space size="xs" />
                <SkeletonText lines={3} />
              </div>

              <div>
                <Small>Avatar</Small>
                <Space size="xs" />
                <SkeletonCircle size="lg" />
              </div>
            </CardContent>
          </ElevatedCard>

          <ElevatedCard level={1}>
            <CardHeader>
              <CardTitle>Loading Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoadingButton
                isLoading={loadingStates.button}
                onClick={() => toggleLoading("button")}
                loadingText="Processing..."
              >
                Click to Load
              </LoadingButton>

              <LoadingButton onClick={handleAsyncAction} variant="outline" loadingText="Uploading...">
                <Upload className="h-4 w-4 mr-2" />
                Async Action
              </LoadingButton>

              <div className="flex items-center gap-2">
                <PulseLoader size="md" />
                <Muted>Loading...</Muted>
              </div>
            </CardContent>
          </ElevatedCard>
        </Grid>

        <Space size="lg" />

        {/* Complex Loading States */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ElevatedCard level={2}>
            <CardHeader>
              <CardTitle>Page Loaders</CardTitle>
              <Flex gap="sm">
                <Button size="sm" variant="outline" onClick={() => toggleLoading("page")}>
                  Page
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleLoading("list")}>
                  List
                </Button>
              </Flex>
            </CardHeader>
            <CardContent>
              {loadingStates.page && <PageLoader message="Loading page..." />}
              {loadingStates.list && <ListLoader items={3} />}
              {!loadingStates.page && !loadingStates.list && <Muted>Click buttons above to see loaders</Muted>}
            </CardContent>
          </ElevatedCard>

          <div className="lg:col-span-2">
            <ElevatedCard level={2}>
              <CardHeader>
                <CardTitle>Complex Page States</CardTitle>
                <Flex gap="sm">
                  <Button size="sm" variant="outline" onClick={() => toggleLoading("profile")}>
                    Profile
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleLoading("dashboard")}>
                    Dashboard
                  </Button>
                </Flex>
              </CardHeader>
              <CardContent>
                {loadingStates.profile && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <ProfilePageLoader />
                  </div>
                )}
                {loadingStates.dashboard && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <DashboardLoader />
                  </div>
                )}
                {!loadingStates.profile && !loadingStates.dashboard && (
                  <Muted>Click buttons above to see page loaders</Muted>
                )}
              </CardContent>
            </ElevatedCard>
          </div>
        </div>
      </Section>

      {/* Micro-interactions Section */}
      <Section>
        <H2 className="mb-8">Micro-interactions & Animations</H2>

        <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
          <InteractiveCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Interactive Elements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Small>Like Button</Small>
                <Space size="xs" />
                <LikeButton
                  count={likeCount}
                  onToggle={(liked) => {
                    setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
                  }}
                />
              </div>

              <div>
                <Small>Star Rating</Small>
                <Space size="xs" />
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>

              <div>
                <Small>Bookmark Toggle</Small>
                <Space size="xs" />
                <BookmarkButton />
              </div>
            </CardContent>
          </InteractiveCard>

          <HoverLift>
            <ElevatedCard level={2}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Animated Buttons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatedButton variant="default">Ripple Effect</AnimatedButton>

                <AnimatedButton variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  With Icon
                </AnimatedButton>

                <div className="flex items-center gap-2">
                  <span>Success:</span>
                  <SuccessCheckmark show={showSuccess} />
                </div>
              </CardContent>
            </ElevatedCard>
          </HoverLift>

          <ElevatedCard level={1}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Progress & Counters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Small>Animated Progress</Small>
                <Space size="xs" />
                <AnimatedProgress value={progress} showPercentage color="primary" />
              </div>

              <div>
                <Small>Animated Counter</Small>
                <Space size="xs" />
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={counterValue} />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCounterValue((prev) => prev + Math.floor(Math.random() * 100))}
                >
                  Increment
                </Button>
              </div>
            </CardContent>
          </ElevatedCard>
        </Grid>

        <Space size="lg" />

        {/* Card Showcase */}
        <div>
          <H3 className="mb-6">Interactive Cards with Hover Effects</H3>
          <StaggerContainer staggerDelay={100}>
            {[
              { title: "Hover to Lift", desc: "Subtle scale and shadow on hover", icon: MousePointer },
              { title: "Animated Card", desc: "Smooth transitions and interactions", icon: Zap },
              { title: "Status Display", desc: "Visual feedback and states", icon: Eye },
            ].map((item) => (
              <HoverLift key={generateUniqueId()}>
                <InteractiveCard onClick={() => setShowToast(true)} className="cursor-pointer">
                  <CardContent className="p-6">
                    <Flex align="center" gap="md">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <H4>{item.title}</H4>
                        <Muted>{item.desc}</Muted>
                      </div>
                      <StatusBadge status="success" />
                    </Flex>
                  </CardContent>
                </InteractiveCard>
              </HoverLift>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Design Tokens Section */}
      <Section>
        <H2 className="mb-8">Design System & Tokens</H2>

        <div className="space-y-8">
          {/* Typography */}
          <ElevatedCard level={1}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Typography Scale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TypographyScale />
            </CardContent>
          </ElevatedCard>

          <Grid cols={{ sm: 1, md: 2 }} gap="lg">
            {/* Color Palette */}
            <ElevatedCard level={2}>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorPalette />
              </CardContent>
            </ElevatedCard>

            {/* Spacing */}
            <ElevatedCard level={2}>
              <CardHeader>
                <CardTitle>Spacing Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <SpacingScale />
              </CardContent>
            </ElevatedCard>
          </Grid>

          {/* Status & Priority Badges */}
          <ElevatedCard level={1}>
            <CardHeader>
              <CardTitle>Status & Priority Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid cols={{ sm: 2, md: 4 }} gap="md">
                <div>
                  <Small>Status Badges</Small>
                  <Space size="xs" />
                  <Flex direction="col" gap="xs">
                    <StatusBadge status="active" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="error" />
                    <StatusBadge status="success" />
                  </Flex>
                </div>

                <div>
                  <Small>Priority Levels</Small>
                  <Space size="xs" />
                  <Flex direction="col" gap="xs">
                    <PriorityBadge priority="low" />
                    <PriorityBadge priority="medium" />
                    <PriorityBadge priority="high" />
                    <PriorityBadge priority="urgent" />
                  </Flex>
                </div>

                <div>
                  <Small>Elevation Cards</Small>
                  <Space size="xs" />
                  <div className="space-y-2">
                    <ElevatedCard level={1} className="p-2 text-xs">
                      Level 1
                    </ElevatedCard>
                    <ElevatedCard level={2} className="p-2 text-xs">
                      Level 2
                    </ElevatedCard>
                    <ElevatedCard level={3} className="p-2 text-xs">
                      Level 3
                    </ElevatedCard>
                  </div>
                </div>

                <div>
                  <Small>Layout Utilities</Small>
                  <Space size="xs" />
                  <div className="space-y-2">
                    <div className="p-2 bg-muted rounded text-xs">Flex Layout</div>
                    <div className="p-2 bg-muted rounded text-xs">Grid System</div>
                    <div className="p-2 bg-muted rounded text-xs">Container</div>
                  </div>
                </div>
              </Grid>
            </CardContent>
          </ElevatedCard>
        </div>
      </Section>

      {/* Error States */}
      <Section>
        <H2 className="mb-8">Error States & Feedback</H2>

        <Grid cols={{ sm: 1, md: 2 }} gap="lg">
          <ElevatedCard level={1}>
            <CardContent className="p-0">
              <ErrorState
                title="Network Error"
                message="Unable to load content. Please check your connection and try again."
                onRetry={() => setShowToast(true)}
              />
            </CardContent>
          </ElevatedCard>

          <ElevatedCard level={1}>
            <CardContent className="p-0">
              <ErrorState
                title="Permission Denied"
                message="You don't have permission to access this resource."
                className="py-12"
              />
            </CardContent>
          </ElevatedCard>
        </Grid>
      </Section>

      {/* Floating Elements */}
      <FloatingActionButton
        expanded={expandedFAB}
        onClick={() => setExpandedFAB(!expandedFAB)}
        expandedContent={
          <Card className="p-4 w-48">
            <div className="space-y-2">
              <Button size="sm" variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="ghost" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </Card>
        }
      >
        <Plus className="h-6 w-6" />
      </FloatingActionButton>

      {/* Toast Notification */}
      {showToast && (
        <NotificationToast
          message="Action completed successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </Container>
  );
}
