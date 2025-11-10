/**
 * Skip Links Component
 * 
 * Provides keyboard navigation shortcuts for accessibility.
 * Allows users to quickly jump to main content areas.
 */

"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

export interface SkipLink {
  id: string;
  label: string;
  href: string;
}

export interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultSkipLinks: SkipLink[] = [
  { id: "skip-to-main", label: "Skip to main content", href: "#main" },
  { id: "skip-to-nav", label: "Skip to navigation", href: "#navigation" },
  { id: "skip-to-footer", label: "Skip to footer", href: "#footer" },
];

export function SkipLinks({ links = defaultSkipLinks, className }: SkipLinksProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  const handleClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      // Ensure the target element is focusable
      const originalTabIndex = element.getAttribute("tabindex");
      element.setAttribute("tabindex", "-1");
      
      // Focus the element
      (element as HTMLElement).focus();
      
      // Restore original tabindex after focus
      if (originalTabIndex !== null) {
        element.setAttribute("tabindex", originalTabIndex);
      } else {
        element.removeAttribute("tabindex");
      }
    }
  };

  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Skip links"
      className={cn(
        "fixed left-4 top-4 z-50",
        !isVisible && "sr-only",
        className
      )}
    >
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.href);
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "hover:bg-primary/90"
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Hook for registering skip link targets
export function useSkipTarget(id: string) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (element) {
      element.id = id;
      
      // Ensure the element can receive focus
      if (!element.hasAttribute("tabindex")) {
        element.setAttribute("tabindex", "-1");
      }
      
      // Add scroll behavior for better UX
      element.style.scrollMarginTop = "1rem";
    }
  }, [id]);

  return ref;
}