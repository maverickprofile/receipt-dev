"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

export interface CreditsData {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  hasCredits: boolean;
  hasActiveSubscription: boolean;
  subscription: {
    planType: string;
    creditsPerPeriod: number;
    expiresAt: string | null;
  } | null;
}

export function useCredits() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<CreditsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!session?.user?.id) {
      setCredits(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/credits");

      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }

      const data = await response.json();
      setCredits(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setError("Failed to load credits");
      setCredits(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Fetch credits on mount and when session changes
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Listen for credit changes (after downloads)
  useEffect(() => {
    const handleCreditsChanged = () => {
      fetchCredits();
    };

    window.addEventListener("credits-changed", handleCreditsChanged);
    return () => {
      window.removeEventListener("credits-changed", handleCreditsChanged);
    };
  }, [fetchCredits]);

  return {
    credits,
    isLoading,
    error,
    refetch: fetchCredits,
  };
}
