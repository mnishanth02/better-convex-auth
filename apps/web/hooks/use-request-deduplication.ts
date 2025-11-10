"use client";

import { useCallback, useRef } from "react";

/**
 * Hook for request deduplication to prevent multiple identical API calls
 * Useful for preventing multiple auth checks when components mount simultaneously
 */
export function useRequestDeduplication<T>() {
  const pendingRequests = useRef<Map<string, Promise<T>>>(new Map());

  const deduplicatedRequest = useCallback(async (key: string, requestFn: () => Promise<T>): Promise<T> => {
    // Check if request is already pending
    const existing = pendingRequests.current.get(key);
    if (existing) {
      return existing;
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Clean up after request completes
      pendingRequests.current.delete(key);
    });

    // Store the pending request
    pendingRequests.current.set(key, promise);

    return promise;
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      pendingRequests.current.delete(key);
    } else {
      pendingRequests.current.clear();
    }
  }, []);

  return { deduplicatedRequest, clearCache };
}

/**
 * Higher-order hook that wraps auth-related requests with deduplication
 * Prevents multiple user profile fetches when multiple components need auth data
 */
export function useAuthRequestDeduplication() {
  const { deduplicatedRequest, clearCache } = useRequestDeduplication<any>();

  const getUserProfile = useCallback(
    async (userId: string) => {
      return deduplicatedRequest(`user-profile-${userId}`, async () => {
        // This would be your actual auth API call
        // For now, return a placeholder since we're using Convex
        return { id: userId, profile: "cached" };
      });
    },
    [deduplicatedRequest],
  );

  const getSessionData = useCallback(async () => {
    return deduplicatedRequest("session-data", async () => {
      // This would be your actual session API call
      return { session: "cached" };
    });
  }, [deduplicatedRequest]);

  return {
    getUserProfile,
    getSessionData,
    clearAuthCache: clearCache,
  };
}
