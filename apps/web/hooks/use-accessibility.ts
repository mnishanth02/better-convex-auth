/**
 * Accessibility utilities and hooks
 *
 * Provides comprehensive accessibility features including:
 * - Keyboard navigation
 * - Focus management
 * - ARIA announcements
 * - Screen reader support
 */

"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// Types
export interface FocusableElement extends HTMLElement {
  focus(): void;
  blur(): void;
  disabled?: boolean;
  tabIndex: number;
}

export interface AriaLiveOptions {
  politeness?: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?: string;
}

// Focus Management Hook
export function useFocusManagement() {
  const focusableRef = useRef<FocusableElement | null>(null);
  const previousFocusRef = useRef<FocusableElement | null>(null);

  const setFocus = useCallback((element?: FocusableElement | null) => {
    if (element) {
      element.focus();
      focusableRef.current = element;
    }
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  const trapFocus = useCallback(
    (container: HTMLElement) => {
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement?.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement?.focus();
            }
          }
        }

        if (event.key === "Escape") {
          restoreFocus();
        }
      };

      container.addEventListener("keydown", handleKeyDown);

      // Store previous focus and set initial focus
      previousFocusRef.current = document.activeElement as FocusableElement;
      firstElement?.focus();

      return () => {
        container.removeEventListener("keydown", handleKeyDown);
      };
    },
    [restoreFocus],
  );

  return {
    setFocus,
    restoreFocus,
    trapFocus,
    focusableRef,
  };
}

// ARIA Live Region Hook
export function useAriaLive() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement("div");
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      liveRegion.id = "aria-live-region";
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, options: AriaLiveOptions = {}) => {
    const { politeness = "polite", atomic = true, relevant } = options;

    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute("aria-live", politeness);
      liveRegionRef.current.setAttribute("aria-atomic", atomic.toString());

      if (relevant) {
        liveRegionRef.current.setAttribute("aria-relevant", relevant);
      }

      // Clear and then set the message
      liveRegionRef.current.textContent = "";
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = message;
        }
      }, 100);
    }
  }, []);

  return { announce };
}

// Keyboard Navigation Hook
export function useKeyboardNavigation(
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void,
) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case "Escape":
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case "ArrowUp":
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case "ArrowDown":
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case "ArrowLeft":
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case "ArrowRight":
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
        default:
          break;
      }
    },
    [onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight],
  );

  return { handleKeyDown };
}

// Skip Link Hook
export function useSkipLinks() {
  const [skipLinks, setSkipLinks] = useState<Array<{ id: string; label: string }>>([]);

  const registerSkipLink = useCallback((id: string, label: string) => {
    setSkipLinks((prev) => {
      const exists = prev.find((link) => link.id === id);
      if (!exists) {
        return [...prev, { id, label }];
      }
      return prev;
    });
  }, []);

  const unregisterSkipLink = useCallback((id: string) => {
    setSkipLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  return {
    skipLinks,
    registerSkipLink,
    unregisterSkipLink,
  };
}

// Screen Reader Detection Hook
export function useScreenReader() {
  const [isScreenReader, setIsScreenReader] = useState(false);

  useEffect(() => {
    // Check for screen reader indicators
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasHighContrast = window.matchMedia("(prefers-contrast: high)").matches;
    const forcedColors = window.matchMedia("(forced-colors: active)").matches;

    // Simple heuristic for screen reader detection
    setIsScreenReader(mediaQuery.matches || hasHighContrast || forcedColors);

    const handler = (e: MediaQueryListEvent) => {
      setIsScreenReader(e.matches || hasHighContrast || forcedColors);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  return isScreenReader;
}

// Utility Functions
export function getFocusableElements(container: HTMLElement): FocusableElement[] {
  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(", ");

  return Array.from(container.querySelectorAll(focusableSelectors)) as FocusableElement[];
}

export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getAriaLabel(element: Element): string | null {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("aria-labelledby") ||
    (element as HTMLElement).innerText?.trim() ||
    null
  );
}

// ARIA Attributes Builder
export interface AriaAttributes {
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-hidden"?: boolean;
  "aria-live"?: "off" | "polite" | "assertive";
  "aria-atomic"?: boolean;
  "aria-busy"?: boolean;
  "aria-disabled"?: boolean;
  "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling";
  "aria-required"?: boolean;
  tabIndex?: number;
}

export function buildAriaAttributes(config: AriaAttributes): Record<string, any> {
  const attrs: Record<string, any> = {};

  Object.entries(config).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "boolean") {
        attrs[key] = value.toString();
      } else {
        attrs[key] = value;
      }
    }
  });

  return attrs;
}

// Roving Tabindex Hook
export function useRovingTabindex<T extends HTMLElement = HTMLElement>(
  items: T[],
  activeIndex: number,
  setActiveIndex: (index: number) => void,
) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
      if (items.length === 0) return;

      let newIndex = activeIndex;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          newIndex = (activeIndex + 1) % items.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          newIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
          break;
        case "Home":
          event.preventDefault();
          newIndex = 0;
          break;
        case "End":
          event.preventDefault();
          newIndex = items.length - 1;
          break;
        default:
          return;
      }

      setActiveIndex(newIndex);
      items[newIndex]?.focus();
    },
    [items, activeIndex, setActiveIndex],
  );

  // Set tabindex for all items
  useEffect(() => {
    items.forEach((item, index) => {
      if (item) {
        item.tabIndex = index === activeIndex ? 0 : -1;
      }
    });
  }, [items, activeIndex]);

  return { handleKeyDown };
}
