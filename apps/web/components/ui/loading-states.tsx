/**
 * Loading States & Skeletons
 *
 * Comprehensive loading components for better user experience during async operations.
 */

import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

// Base skeleton primitive
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

// Skeleton variants
export function SkeletonText({ lines = 1, className, ...props }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={generateUniqueId()} className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/4" : "w-full")} />
      ))}
    </div>
  );
}

export function SkeletonCircle({
  size = "md",
  className,
  ...props
}: SkeletonProps & {
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  return <Skeleton className={cn("rounded-full", sizeClasses[size], className)} {...props} />;
}

export function SkeletonCard({
  showAvatar = true,
  showImage = false,
  className,
  ...props
}: SkeletonProps & {
  showAvatar?: boolean;
  showImage?: boolean;
}) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      {showImage && <Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" />}
      <CardHeader>
        <div className="flex items-center space-x-4">
          {showAvatar && <SkeletonCircle size="md" />}
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <SkeletonText lines={3} />
          <div className="flex space-x-2 pt-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading button states
export interface LoadingButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loadingText?: string;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
}

export function LoadingButton({
  isLoading = false,
  children,
  className,
  variant = "default",
  size = "default",
  loadingText,
  disabled,
  onClick,
  ...props
}: LoadingButtonProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);

  const handleClick = async () => {
    if (onClick && !isLoading && !internalLoading) {
      setInternalLoading(true);
      try {
        await onClick();
      } finally {
        setInternalLoading(false);
      }
    }
  };

  const loading = isLoading || internalLoading;

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn("relative transition-all duration-200", loading && "cursor-not-allowed", className)}
      {...props}
    >
      {loading && (
        <Loader2 className={cn("animate-spin", size === "sm" ? "h-3 w-3" : "h-4 w-4", loadingText && "mr-2")} />
      )}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}

// Page loading states
export function PageLoader({ message = "Loading...", className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex h-64 w-full items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-muted animate-pulse" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  );
}

export function FullPageLoader({
  message = "Loading application...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center", className)}
    >
      <div className="flex flex-col items-center space-y-6 p-8">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <Sparkles className="absolute inset-0 h-6 w-6 m-5 text-primary animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold">{message}</h2>
          <p className="text-sm text-muted-foreground">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}

// Content loaders for specific layouts
export function ProfilePageLoader() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 pb-6 border-b">
        <SkeletonCircle size="xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Content Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <SkeletonCard showAvatar={false} />
        <SkeletonCard showAvatar={false} />
        <SkeletonCard showAvatar={false} />
        <SkeletonCard showAvatar={false} />
      </div>
    </div>
  );
}

export function DashboardLoader() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={generateUniqueId()}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <SkeletonCircle size="sm" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard showImage={true} />
          <SkeletonCard />
        </div>
        <div className="space-y-6">
          <SkeletonCard showAvatar={false} />
          <SkeletonCard showAvatar={false} />
        </div>
      </div>
    </div>
  );
}

export function ListLoader({ items = 5, showAvatar = true }: { items?: number; showAvatar?: boolean }) {
  return (
    <div className="space-y-4">
      {[...Array(items)].map(() => (
        <div key={generateUniqueId()} className="flex items-center space-x-4 p-4 border rounded-lg">
          {showAvatar && <SkeletonCircle size="md" />}
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

// Error states with retry
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 p-8 text-center", className)}>
      <div className="rounded-full bg-destructive/10 p-4">
        <svg
          className="h-8 w-8 text-destructive"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Error Icon</title>
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}

// Fade in animation wrapper
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={cn("animate-in fade-in duration-500", className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// Stagger animation for lists
export function StaggerContainer({
  children,
  staggerDelay = 100,
  className,
}: {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay}>{child}</FadeIn>
      ))}
    </div>
  );
}
