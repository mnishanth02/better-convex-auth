/**
 * Mobile Responsive Layout Components
 *
 * Mobile-first responsive layout components with proper breakpoints
 * and mobile-specific optimizations.
 */

"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: 640, // Small devices (landscape phones)
  md: 768, // Medium devices (tablets)
  lg: 1024, // Large devices (laptops)
  xl: 1280, // Extra large devices (large laptops)
  "2xl": 1536, // 2X Large devices (larger desktops)
} as const;

// Mobile container with safe areas
export interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function MobileContainer({ children, className, fullHeight = false, padding = "md" }: MobileContainerProps) {
  const paddingClasses = {
    none: "",
    sm: "px-4 py-2",
    md: "px-6 py-4",
    lg: "px-8 py-6",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto",
        "safe-area-inset", // Use CSS safe area insets
        fullHeight && "min-h-screen",
        paddingClasses[padding],
        className,
      )}
      style={{
        // CSS safe area support for notched devices
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      {children}
    </div>
  );
}

// Mobile-first grid system
export interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = "md",
  className,
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const getGridClasses = () => {
    let classes = `grid-cols-${cols.default}`;

    if (cols.sm) classes += ` sm:grid-cols-${cols.sm}`;
    if (cols.md) classes += ` md:grid-cols-${cols.md}`;
    if (cols.lg) classes += ` lg:grid-cols-${cols.lg}`;
    if (cols.xl) classes += ` xl:grid-cols-${cols.xl}`;

    return classes;
  };

  return <div className={cn("grid", getGridClasses(), gapClasses[gap], className)}>{children}</div>;
}

// Mobile-optimized stack layout
export interface MobileStackProps {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
}

export function MobileStack({ children, spacing = "md", align = "stretch", className }: MobileStackProps) {
  const spacingClasses = {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
    xl: "space-y-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  return <div className={cn("flex flex-col", spacingClasses[spacing], alignClasses[align], className)}>{children}</div>;
}

// Mobile bottom sheet/drawer
export interface MobileDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}

export function MobileDrawer({ children, isOpen, onClose, title, className }: MobileDrawerProps) {
  const [startY, setStartY] = React.useState<number>(0);
  const [currentY, setCurrentY] = React.useState<number>(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  // Handle touch events for swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setStartY(touch.clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    if (touch) {
      const y = touch.clientY;
      const diff = y - startY;

      // Only allow downward movement
      if (diff > 0) {
        setCurrentY(diff);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Close drawer if dragged down more than 100px
    if (currentY > 100) {
      onClose();
    }

    setCurrentY(0);
    setStartY(0);
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <fase postive> */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            onClose();
          }
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background rounded-t-xl z-50",
          "max-h-[90vh] overflow-hidden",
          "transform transition-transform duration-300 ease-out",
          className,
        )}
        style={{
          transform: `translateY(${currentY}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center p-4">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 pb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}

// Mobile floating action button
export interface MobileFABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  size?: "md" | "lg";
  children: React.ReactNode;
}

export const MobileFAB = React.forwardRef<HTMLButtonElement, MobileFABProps>(
  ({ position = "bottom-right", size = "lg", className, children, ...props }, ref) => {
    const positionClasses = {
      "bottom-right": "fixed bottom-4 right-4 md:bottom-6 md:right-6",
      "bottom-left": "fixed bottom-4 left-4 md:bottom-6 md:left-6",
      "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 md:bottom-6",
    };

    const sizeClasses = {
      md: "w-12 h-12",
      lg: "w-14 h-14",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-lg",
          "hover:bg-primary/90 active:scale-95",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "z-50",
          positionClasses[position],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

MobileFAB.displayName = "MobileFAB";

// Mobile-aware spacing component
export interface MobileSpacingProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
}

export function MobileSpacing({ size = "md", responsive = true }: MobileSpacingProps) {
  const spacingClasses = responsive
    ? {
        xs: "h-2 md:h-3",
        sm: "h-4 md:h-6",
        md: "h-6 md:h-8",
        lg: "h-8 md:h-12",
        xl: "h-12 md:h-16",
      }
    : {
        xs: "h-2",
        sm: "h-4",
        md: "h-6",
        lg: "h-8",
        xl: "h-12",
      };

  return <div className={spacingClasses[size]} />;
}

// Hook for responsive breakpoints
export function useResponsiveBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<keyof typeof BREAKPOINTS>("sm");
  const [isMobile, setIsMobile] = React.useState(true);

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= BREAKPOINTS["2xl"]) {
        setCurrentBreakpoint("2xl");
        setIsMobile(false);
      } else if (width >= BREAKPOINTS.xl) {
        setCurrentBreakpoint("xl");
        setIsMobile(false);
      } else if (width >= BREAKPOINTS.lg) {
        setCurrentBreakpoint("lg");
        setIsMobile(false);
      } else if (width >= BREAKPOINTS.md) {
        setCurrentBreakpoint("md");
        setIsMobile(false);
      } else {
        setCurrentBreakpoint("sm");
        setIsMobile(true);
      }
    };

    checkBreakpoint();

    const handleResize = () => {
      checkBreakpoint();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    currentBreakpoint,
    isMobile,
    isTablet: currentBreakpoint === "md",
    isDesktop: ["lg", "xl", "2xl"].includes(currentBreakpoint),
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
  };
}
