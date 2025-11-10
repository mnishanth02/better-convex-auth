/**
 * Mobile UX Demo Page
 *
 * Comprehensive demonstration of mobile-optimized components and interactions.
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  MobileContainer,
  ResponsiveGrid,
  MobileStack,
  MobileDrawer,
  MobileFAB,
  MobileSpacing,
  useResponsiveBreakpoint,
} from "@/components/mobile/responsive-layout";
import { MobileButton, SwipeableCard, useMobileViewport, useTouchFeedback } from "@/components/mobile/touch-components";
import {
  Smartphone,
  Tablet,
  Monitor,
  Vibrate,
  Hand,
  MousePointerClick,
  Zap,
  Layers,
  Grid3X3,
  Menu,
  Plus,
  Heart,
  Star,
  Share,
  ChevronRight,
} from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

export default function MobileUXPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [likedCards, setLikedCards] = useState<Set<number>>(new Set());
  const { currentBreakpoint, isMobile, isTablet, isDesktop } = useResponsiveBreakpoint();
  const { orientation, viewportHeight, isKeyboardOpen } = useMobileViewport();
  const { provideFeedback } = useTouchFeedback();

  const handleCardSwipe = (cardId: number, direction: "left" | "right") => {
    provideFeedback("medium");

    if (direction === "right") {
      setLikedCards((prev) => new Set([...prev, cardId]));
    } else {
      setLikedCards((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
    }
  };

  const deviceInfo = [
    {
      icon: Smartphone,
      label: "Mobile",
      active: isMobile,
      description: "Optimized for touch",
    },
    {
      icon: Tablet,
      label: "Tablet",
      active: isTablet,
      description: "Balanced experience",
    },
    {
      icon: Monitor,
      label: "Desktop",
      active: isDesktop,
      description: "Full feature set",
    },
  ];

  const features = [
    {
      icon: MousePointerClick,
      title: "Touch Targets",
      description: "44px minimum touch targets for comfortable interaction",
      demo: (
        <div className="flex gap-2">
          <MobileButton size="minimum">44px</MobileButton>
          <MobileButton size="comfortable">48px</MobileButton>
          <MobileButton size="large">56px</MobileButton>
        </div>
      ),
    },
    {
      icon: Hand,
      title: "Swipe Gestures",
      description: "Intuitive swipe interactions with haptic feedback",
      demo: (
        <SwipeableCard
          onSwipeLeft={() => provideFeedback("light")}
          onSwipeRight={() => provideFeedback("medium")}
          onTap={() => provideFeedback("light")}
          className="p-4 border-2 border-dashed border-muted-foreground/50 rounded-lg"
        >
          <p className="text-sm text-center">Swipe left/right or tap me!</p>
        </SwipeableCard>
      ),
    },
    {
      icon: Vibrate,
      title: "Haptic Feedback",
      description: "Tactile responses for better user experience",
      demo: (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => provideFeedback("light")}>
            Light
          </Button>
          <Button size="sm" variant="outline" onClick={() => provideFeedback("medium")}>
            Medium
          </Button>
          <Button size="sm" variant="outline" onClick={() => provideFeedback("heavy")}>
            Heavy
          </Button>
        </div>
      ),
    },
    {
      icon: Layers,
      title: "Responsive Layouts",
      description: "Mobile-first design with smooth breakpoint transitions",
      demo: (
        <ResponsiveGrid cols={{ default: 2, md: 3, lg: 4 }} gap="sm">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-primary/20 rounded flex items-center justify-center text-xs">
              {i}
            </div>
          ))}
        </ResponsiveGrid>
      ),
    },
  ];

  const demoCards = [
    { id: 1, title: "Swipe Demo 1", content: "Swipe right to like, left to pass" },
    { id: 2, title: "Swipe Demo 2", content: "Try different gestures" },
    { id: 3, title: "Swipe Demo 3", content: "Feel the haptic feedback" },
  ];

  return (
    <MobileContainer className="pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mobile UX</h1>
        <p className="text-muted-foreground">Touch-optimized components and interactions for mobile devices</p>
      </div>

      {/* Device Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Breakpoint</p>
              <Badge variant="outline">{currentBreakpoint}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Orientation</p>
              <Badge variant="outline">{orientation}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <Badge variant="outline">{viewportHeight}px</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Keyboard</p>
              <Badge variant={isKeyboardOpen ? "default" : "outline"}>{isKeyboardOpen ? "Open" : "Closed"}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {deviceInfo.map((device) => {
              const Icon = device.icon;
              return (
                <div
                  key={device.label}
                  className={`flex-1 p-3 rounded-lg border ${
                    device.active ? "border-primary bg-primary/10" : "border-muted"
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${device.active ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-sm font-medium">{device.label}</p>
                  <p className="text-xs text-muted-foreground">{device.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <ResponsiveGrid cols={{ default: 1, md: 2 }} gap="md" className="mb-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={generateUniqueId()}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5" />
                  {feature.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardHeader>
              <CardContent>{feature.demo}</CardContent>
            </Card>
          );
        })}
      </ResponsiveGrid>

      {/* Swipe Cards Demo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Swipeable Cards</CardTitle>
          <p className="text-sm text-muted-foreground">Swipe right to like, left to pass. Tap for quick actions.</p>
        </CardHeader>
        <CardContent>
          <MobileStack spacing="md">
            {demoCards.map((card) => (
              <SwipeableCard
                key={card.id}
                onSwipeLeft={() => handleCardSwipe(card.id, "left")}
                onSwipeRight={() => handleCardSwipe(card.id, "right")}
                onTap={() => setDrawerOpen(true)}
                className="p-4 border rounded-lg bg-card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {likedCards.has(card.id) ? (
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    ) : (
                      <Heart className="h-5 w-5 text-muted-foreground" />
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </SwipeableCard>
            ))}
          </MobileStack>
        </CardContent>
      </Card>

      {/* Mobile Interactions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mobile Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <MobileStack spacing="md">
            {/* Touch Buttons */}
            <div>
              <h4 className="font-medium mb-3">Touch-Optimized Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <MobileButton size="minimum" variant="outline">
                  Small
                </MobileButton>
                <MobileButton size="comfortable">Comfortable</MobileButton>
                <MobileButton size="large" variant="outline">
                  Large Touch Area
                </MobileButton>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="font-medium mb-3">Quick Action Bar</h4>
              <div className="flex gap-2 p-3 bg-muted rounded-lg">
                <MobileButton size="comfortable" variant="ghost">
                  <Heart className="h-5 w-5" />
                </MobileButton>
                <MobileButton size="comfortable" variant="ghost">
                  <Star className="h-5 w-5" />
                </MobileButton>
                <MobileButton size="comfortable" variant="ghost">
                  <Share className="h-5 w-5" />
                </MobileButton>
                <MobileButton size="comfortable" variant="ghost" onClick={() => setDrawerOpen(true)}>
                  <Menu className="h-5 w-5" />
                </MobileButton>
              </div>
            </div>
          </MobileStack>
        </CardContent>
      </Card>

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile UX Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <MobileStack spacing="sm">
            <div>
              <h4 className="font-medium mb-2">Touch Targets</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Minimum 44x44px for touch targets</li>
                <li>• 48x48px for comfortable interaction</li>
                <li>• 56x56px for primary actions</li>
                <li>• Adequate spacing between targets</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Gestures</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Swipe gestures for navigation</li>
                <li>• Pull-to-refresh for data updates</li>
                <li>• Long press for context menus</li>
                <li>• Pinch-to-zoom for media</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Responsive Design</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Mobile-first approach</li>
                <li>• Fluid grid systems</li>
                <li>• Flexible images and media</li>
                <li>• Progressive enhancement</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Performance</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Optimize for slower networks</li>
                <li>• Lazy load content</li>
                <li>• Minimize bundle size</li>
                <li>• Use hardware acceleration</li>
              </ul>
            </div>
          </MobileStack>
        </CardContent>
      </Card>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Mobile Actions">
        <MobileStack spacing="md">
          <p className="text-muted-foreground">
            This is a mobile drawer component. You can swipe down or tap outside to close it.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <MobileButton variant="outline">Action 1</MobileButton>
            <MobileButton variant="outline">Action 2</MobileButton>
          </div>

          <MobileSpacing size="md" />

          <MobileButton onClick={() => setDrawerOpen(false)} className="w-full">
            Close Drawer
          </MobileButton>
        </MobileStack>
      </MobileDrawer>

      {/* Floating Action Button */}
      <MobileFAB onClick={() => setDrawerOpen(true)} position="bottom-right">
        <Plus className="h-6 w-6" />
      </MobileFAB>
    </MobileContainer>
  );
}
