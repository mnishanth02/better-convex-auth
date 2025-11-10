/**
 * Generic Empty State Component
 * 
 * Reusable empty state component for various scenarios.
 * Customizable with different icons, messages, and actions.
 */

"use client";

import { Button } from "@workspace/ui/components/button";
import { 
  type LucideIcon,
  Search,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface EmptyGenericProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  illustration?: React.ReactNode;
  className?: string;
}

export function EmptyGeneric({ 
  icon: Icon = Search,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration,
  className
}: EmptyGenericProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] p-8 text-center ${className}`}>
      {/* Illustration or Icon */}
      {illustration || (
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-md space-y-3">
        <h3 className="text-xl font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {primaryAction && (
            <ActionButton
              {...primaryAction}
              variant="default"
              size="default"
              isPrimary
            />
          )}
          
          {secondaryAction && (
            <ActionButton
              {...secondaryAction}
              variant="outline"
              size="default"
            />
          )}
        </div>
      )}
    </div>
  );
}

// Helper component for action buttons
interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant: "default" | "outline";
  size: "default" | "lg";
  loading?: boolean;
  isPrimary?: boolean;
}

function ActionButton({
  label,
  onClick,
  href,
  variant,
  size,
  loading = false,
  isPrimary = false
}: ActionButtonProps) {
  const buttonContent = (
    <>
      {loading && (
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
      )}
      {label}
      {isPrimary && !loading && (
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      )}
    </>
  );

  if (href) {
    return (
      <Button
        variant={variant}
        size={size}
        className={isPrimary ? "group" : ""}
        disabled={loading}
        asChild
      >
        <Link href={href}>
          {buttonContent}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={isPrimary ? "group" : ""}
      onClick={onClick}
      disabled={loading}
    >
      {buttonContent}
    </Button>
  );
}

// Pre-configured empty states for common scenarios
export function EmptySearch({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyGeneric
      icon={Search}
      title="No results found"
      description="Try adjusting your search criteria or clearing filters to see more results."
      primaryAction={{
        label: "Clear Filters",
        onClick: onClearFilters
      }}
    />
  );
}

export function EmptyError({ 
  onRetry, 
  retryLoading = false 
}: { 
  onRetry?: () => void;
  retryLoading?: boolean;
}) {
  return (
    <EmptyGeneric
      title="Something went wrong"
      description="We couldn't load this content. Please try again."
      primaryAction={{
        label: "Try Again",
        onClick: onRetry,
        loading: retryLoading
      }}
    />
  );
}