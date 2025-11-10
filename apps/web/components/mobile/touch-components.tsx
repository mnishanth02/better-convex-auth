/**
 * Mobile Touch Components
 *
 * Touch-optimized components for mobile devices with proper touch targets,
 * gestures, and haptic feedback.
 */

"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

// Touch target size constants
export const TOUCH_TARGET_SIZE = {
  MINIMUM: 44, // 44px minimum for accessibility
  COMFORTABLE: 48, // 48px for comfortable interaction
  LARGE: 56, // 56px for primary actions
} as const;

// Mobile-optimized button component
export interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "comfortable" | "large" | "minimum";
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  haptic?: boolean;
  children: React.ReactNode;
}

export const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ size = "comfortable", variant = "default", haptic = true, className, onClick, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic && "vibrate" in navigator) {
        navigator.vibrate(50);
      }
      onClick?.(e);
    };

    const getSizeClasses = () => {
      switch (size) {
        case "minimum":
          return "min-h-[44px] min-w-[44px] px-3 py-2 text-sm";
        case "large":
          return "min-h-[56px] min-w-[56px] px-6 py-3 text-base";
        default:
          return "min-h-[48px] min-w-[48px] px-4 py-2.5 text-sm";
      }
    };

    const getVariantClasses = () => {
      switch (variant) {
        case "outline":
          return "border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground";
        case "secondary":
          return "bg-secondary text-secondary-foreground shadow hover:bg-secondary/80";
        case "ghost":
          return "hover:bg-accent hover:text-accent-foreground";
        case "link":
          return "text-primary underline-offset-4 hover:underline";
        default:
          return "bg-primary text-primary-foreground shadow hover:bg-primary/90";
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-95 transform",
          "touch-manipulation select-none", // Improves touch responsiveness
          getSizeClasses(),
          getVariantClasses(),
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);

MobileButton.displayName = "MobileButton";

// Swipeable card component
export interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  className?: string;
  hapticFeedback?: boolean;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  className,
  hapticFeedback = true,
}: SwipeableCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [deltaX, setDeltaX] = React.useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setIsActive(true);
      setStartX(touch.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!isActive || !touch) return;
    const currentX = touch.clientX;
    setDeltaX(currentX - startX);
  };

  const handleTouchEnd = () => {
    setIsActive(false);

    const threshold = 100; // Minimum swipe distance

    if (Math.abs(deltaX) > threshold) {
      if (hapticFeedback && "vibrate" in navigator) {
        navigator.vibrate(50);
      }

      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (Math.abs(deltaX) < 10 && onTap) {
      // Small movement, consider it a tap
      if (hapticFeedback && "vibrate" in navigator) {
        navigator.vibrate(30);
      }
      onTap();
    }

    setDeltaX(0);
    setStartX(0);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative select-none touch-manipulation transition-transform duration-200",
        "active:scale-[0.98]",
        className,
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        transform: `translateX(${deltaX * 0.1}px) scale(${isActive ? 0.98 : 1})`,
      }}
    >
      {children}
    </div>
  );
}

// Mobile viewport hook
export function useMobileViewport() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [orientation, setOrientation] = React.useState<"portrait" | "landscape">("portrait");
  const [viewportHeight, setViewportHeight] = React.useState(0);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? "landscape" : "portrait");

      // Use visual viewport height if available (better for mobile)
      const height = window.visualViewport?.height ?? window.innerHeight;
      setViewportHeight(height);
    };

    checkMobile();

    const handleResize = () => {
      checkMobile();
    };

    const handleOrientationChange = () => {
      // Delay to allow for orientation change to complete
      setTimeout(checkMobile, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Listen for visual viewport changes (mobile keyboard, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", checkMobile);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", checkMobile);
      }
    };
  }, []);

  return {
    isMobile,
    orientation,
    viewportHeight,
    isKeyboardOpen: viewportHeight > 0 && viewportHeight < window.screen.height * 0.75,
  };
}

// Touch feedback hook
export function useTouchFeedback() {
  const provideFeedback = React.useCallback((type: "light" | "medium" | "heavy" = "light") => {
    if ("vibrate" in navigator) {
      const vibrationPattern = {
        light: 30,
        medium: 50,
        heavy: 100,
      };
      navigator.vibrate(vibrationPattern[type]);
    }
  }, []);

  return { provideFeedback };
}
