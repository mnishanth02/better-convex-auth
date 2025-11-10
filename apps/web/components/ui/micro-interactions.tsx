/**
 * Micro-interactions & Animations
 *
 * Delightful micro-interactions and animations to enhance user experience.
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Heart, Star, ThumbsUp, Bookmark, Share, Check, X, Plus, Minus, ArrowRight } from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

// Hover lift effect
export function HoverLift({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg", className)} {...props}>
      {children}
    </div>
  );
}

// Animated button with ripple effect
export interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showRipple?: boolean;
}

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  showRipple = true,
  ...props
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (e: React.MouseEvent) => {
    if (!showRipple || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e: React.MouseEvent) => {
    createRipple(e);
    onClick?.(e);
  };

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:scale-105 active:scale-95",
        "focus:ring-2 focus:ring-primary/20",
        className,
      )}
      {...props}
    >
      {children}

      {showRipple &&
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
            }}
          />
        ))}
    </Button>
  );
}

// Like button with heart animation
export function LikeButton({
  isLiked: initialLiked = false,
  onToggle,
  className,
  count,
}: {
  isLiked?: boolean;
  onToggle?: (liked: boolean) => void;
  className?: string;
  count?: number;
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    setIsAnimating(true);
    onToggle?.(!isLiked);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "group transition-all duration-200 hover:bg-red-50 hover:text-red-600",
        isLiked && "text-red-600",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isLiked && "fill-current text-red-600",
          isAnimating && "animate-bounce scale-125",
        )}
      />
      {count !== undefined && <span className="ml-1 text-sm">{count}</span>}
    </Button>
  );
}

// Star rating with hover effects
export function StarRating({
  rating = 0,
  maxRating = 5,
  onRatingChange,
  readonly = false,
  size = "md",
}: {
  rating?: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (newRating: number) => {
    if (readonly) return;

    setIsAnimating(true);
    onRatingChange?.(newRating);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= (hoveredRating || rating);

        return (
          <button
            key={generateUniqueId()}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHoveredRating(starRating)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            onClick={() => handleClick(starRating)}
            className={cn(
              "transition-all duration-150",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default",
              isAnimating && starRating <= rating && "animate-pulse",
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-150",
                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

// Bookmark toggle with animation
export function BookmarkButton({
  isBookmarked: initialBookmarked = false,
  onToggle,
  className,
}: {
  isBookmarked?: boolean;
  onToggle?: (bookmarked: boolean) => void;
  className?: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsBookmarked(!isBookmarked);
    setIsAnimating(true);
    onToggle?.(!isBookmarked);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        "transition-all duration-200 hover:bg-blue-50 hover:text-blue-600",
        isBookmarked && "text-blue-600",
        className,
      )}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isBookmarked && "fill-current",
          isAnimating && "animate-pulse scale-110",
        )}
      />
    </Button>
  );
}

// Success checkmark animation
export function SuccessCheckmark({
  show = true,
  size = "md",
  className,
}: {
  show?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  if (!show) return null;

  return (
    <div
      className={cn(
        "rounded-full bg-green-500 flex items-center justify-center",
        "animate-in zoom-in duration-300",
        sizeClasses[size],
        className,
      )}
    >
      <Check className="h-3 w-3 text-white animate-in zoom-in duration-200 delay-100" />
    </div>
  );
}

// Floating action button with expand animation
export function FloatingActionButton({
  children,
  onClick,
  className,
  expanded = false,
  expandedContent,
  position = "bottom-right",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  expanded?: boolean;
  expandedContent?: React.ReactNode;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}) {
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      <div className="relative">
        {/* Expanded content */}
        {expanded && expandedContent && (
          <div className="absolute bottom-16 right-0 mb-2 animate-in slide-in-from-bottom duration-200">
            {expandedContent}
          </div>
        )}

        {/* Main FAB */}
        <Button
          size="icon"
          onClick={onClick}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "bg-primary hover:bg-primary/90",
            expanded && "rotate-45",
          )}
        >
          {children}
        </Button>
      </div>
    </div>
  );
}

// Progress indicator with animation
export function AnimatedProgress({
  value = 0,
  max = 100,
  className,
  showPercentage = false,
  color = "primary",
}: {
  value?: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  color?: "primary" | "secondary" | "green" | "red" | "yellow";
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  const percentage = (animatedValue / max) * 100;

  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 ease-out rounded-full", colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && <div className="text-sm text-muted-foreground mt-1 text-right">{Math.round(percentage)}%</div>}
    </div>
  );
}

// Notification toast with slide animation
export function NotificationToast({
  message,
  type = "info",
  onClose,
  autoClose = true,
  duration = 4000,
}: {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const typeStyles = {
    info: "bg-blue-50 text-blue-900 border-blue-200",
    success: "bg-green-50 text-green-900 border-green-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
    error: "bg-red-50 text-red-900 border-red-200",
  };

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border shadow-lg",
        "animate-in slide-in-from-top duration-300",
        !isVisible && "animate-out slide-out-to-top duration-300",
        typeStyles[type],
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{icons[type]}</span>
          <span className="text-sm font-medium">{message}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-transparent"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Pulse loading dots
export function PulseLoader({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("bg-current rounded-full animate-pulse", sizeClasses[size])}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
}

// Card with hover effects
export function InteractiveCard({
  children,
  onClick,
  className,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 cursor-pointer",
        "hover:shadow-md hover:scale-[1.02]",
        "active:scale-[0.98]",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Card>
  );
}

// Animated counter
export function AnimatedCounter({
  value,
  duration = 1000,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className={cn("tabular-nums", className)}>{count.toLocaleString()}</span>;
}
