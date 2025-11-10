/**
 * Accessible Navigation Component
 *
 * Navigation with comprehensive accessibility features:
 * - Keyboard navigation (arrow keys, home/end)
 * - ARIA attributes
 * - Focus management
 * - Screen reader support
 * - Mobile menu with focus trapping
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  useFocusManagement,
  useKeyboardNavigation,
  useRovingTabindex,
  useAriaLive,
  buildAriaAttributes,
} from "@/hooks/use-accessibility";
import { AccessibleButton } from "./accessible-button";
import { generateUniqueId } from "@/lib/utils";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  external?: boolean;
}

export interface AccessibleNavigationProps {
  items: NavigationItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
  label?: string;
  showMobileMenu?: boolean;
}

export function AccessibleNavigation({
  items,
  className,
  orientation = "horizontal",
  label = "Main navigation",
  showMobileMenu = true,
}: AccessibleNavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { trapFocus, restoreFocus } = useFocusManagement();
  const { announce } = useAriaLive();

  // Refs for navigation items
  const navRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileNavRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  // Find current active item
  React.useEffect(() => {
    const currentIndex = items.findIndex((item) => item.href === pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, items]);

  // Keyboard navigation for desktop nav
  const { handleKeyDown: handleDesktopKeyDown } = useRovingTabindex(
    navRefs.current.filter((ref): ref is HTMLAnchorElement => ref !== null),
    activeIndex,
    setActiveIndex,
  );

  // Keyboard navigation for mobile menu
  const { handleKeyDown: handleMobileKeyDown } = useKeyboardNavigation(
    undefined, // onEnter
    () => {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    }, // onEscape
  );

  // Mobile menu focus management
  React.useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const cleanup = trapFocus(mobileMenuRef.current);
      announce("Mobile menu opened", { politeness: "polite" });

      return () => {
        cleanup?.();
        announce("Mobile menu closed", { politeness: "polite" });
      };
    }
  }, [mobileMenuOpen, trapFocus, announce]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavItemClick = (index: number) => {
    setActiveIndex(index);
    setMobileMenuOpen(false);
  };

  const renderNavItem = (item: NavigationItem, index: number, isMobile: boolean = false) => {
    const isActive = item.href === pathname;
    const ref = isMobile ? mobileNavRefs : navRefs;
    const Icon = item.icon;

    return (
      <Link
        key={item.id}
        ref={(el) => {
          if (ref.current) {
            ref.current[index] = el;
          }
        }}
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        onClick={() => handleNavItemClick(index)}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          isMobile && "w-full justify-start",
        )}
        aria-current={isActive ? "page" : undefined}
        aria-describedby={item.description ? `${item.id}-desc` : undefined}
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        <span>{item.label}</span>
        {item.external && <span className="sr-only">(opens in new tab)</span>}
        {item.description && (
          <span id={`${item.id}-desc`} className="sr-only">
            {item.description}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn("hidden md:flex", className)} aria-label={label}>
        <ul
          className={cn("flex gap-1", orientation === "vertical" && "flex-col")}
          role="menubar"
          aria-orientation={orientation}
          onKeyDown={(e) => handleDesktopKeyDown(e.nativeEvent)}
        >
          {items.map((item, index) => (
            <li key={item.id} role="none">
              {renderNavItem(item, index)}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <>
          {/* Mobile Menu Button */}
          <AccessibleButton
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            announceOnClick={mobileMenuOpen ? "Navigation menu closed" : "Navigation menu opened"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </AccessibleButton>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              aria-hidden="true"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            id="mobile-navigation"
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r shadow-lg transform transition-transform duration-200 md:hidden",
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            )}
            aria-hidden={!mobileMenuOpen}
            onKeyDown={handleMobileKeyDown}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">{label}</h2>
                <AccessibleButton
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </AccessibleButton>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4" aria-label={label}>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={item.id} role="none">
                      {renderNavItem(item, index, true)}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Breadcrumb Navigation Component
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AccessibleBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function AccessibleBreadcrumb({ items, className }: AccessibleBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={generateUniqueId()} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-muted-foreground" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast ? "text-foreground font-medium" : "text-muted-foreground")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
