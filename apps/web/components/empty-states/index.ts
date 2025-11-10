/**
 * Empty States Components
 * 
 * Centralized exports for all empty state components.
 * Provides consistent empty state patterns across the application.
 */

export { EmptyDashboard } from "./empty-dashboard";
export { EmptyProfile } from "./empty-profile";
export { EmptyAdmin } from "./empty-admin";
export { EmptyGeneric, EmptySearch, EmptyError } from "./empty-generic";

// Common empty state configurations
export const EMPTY_STATES = {
  dashboard: {
    title: "Welcome to your dashboard",
    description: "Start building something amazing with Better Auth",
  },
  profile: {
    title: "Complete your profile",
    description: "Add personal details to make your account more secure",
  },
  admin: {
    noAccess: {
      title: "Access denied",
      description: "You don't have permission to access this area",
    },
    noData: {
      title: "Welcome to admin panel",
      description: "Manage users, settings, and monitor activity",
    },
    setupRequired: {
      title: "Setup required",
      description: "Configure the admin panel to get started",
    },
  },
  search: {
    title: "No results found",
    description: "Try adjusting your search criteria",
  },
  error: {
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again",
  },
} as const;