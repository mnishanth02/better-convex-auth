/**
 * Accessible Button Component
 *
 * Enhanced button with comprehensive accessibility features:
 * - Proper ARIA attributes
 * - Keyboard navigation
 * - Loading states
 * - Focus management
 * - Screen reader announcements
 */

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useAriaLive, generateId, buildAriaAttributes } from "@/hooks/use-accessibility";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  announceOnClick?: string;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      announceOnClick,
      disabled,
      onClick,
      children,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-expanded": ariaExpanded,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const { announce } = useAriaLive();
    const buttonId = React.useMemo(() => generateId("button"), []);

    // Generate description ID if loading text is provided
    const descriptionId = React.useMemo(() => {
      return loadingText ? generateId("button-desc") : undefined;
    }, [loadingText]);

    const isDisabled = disabled || loading;

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (loading || disabled) {
          event.preventDefault();
          return;
        }

        // Announce action to screen readers
        if (announceOnClick) {
          announce(announceOnClick);
        }

        onClick?.(event);
      },
      [loading, disabled, announceOnClick, announce, onClick],
    );

    // Build ARIA attributes
    const ariaAttributes = buildAriaAttributes({
      "aria-label": ariaLabel || (loading && loadingText ? loadingText : undefined),
      "aria-describedby": ariaDescribedBy || descriptionId,
      "aria-expanded": ariaExpanded,
      "aria-busy": loading,
      "aria-disabled": isDisabled,
    });

    const buttonContent = (
      <>
        {loading && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading</span>
          </>
        )}
        {children}
        {loadingText && descriptionId && (
          <div id={descriptionId} className="sr-only">
            {loading ? loadingText : ""}
          </div>
        )}
      </>
    );

    return (
      <Comp
        ref={ref}
        id={buttonId}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        onClick={handleClick}
        {...ariaAttributes}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  },
);

AccessibleButton.displayName = "AccessibleButton";

export { AccessibleButton, buttonVariants };
