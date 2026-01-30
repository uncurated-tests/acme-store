"use client";

import { useEffect, useState } from "react";
import { createSession, trackEvent, calculateEngagementScore } from "@/lib/analytics";
import type { UserSession } from "@/lib/analytics";

/**
 * EngagementBadge Component
 * 
 * Displays real-time user engagement metrics with
 * beautiful visual feedback and gamification elements.
 */
export function EngagementBadge() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [engagement, setEngagement] = useState<ReturnType<typeof calculateEngagementScore> | null>(null);

  useEffect(() => {
    // Initialize session on mount
    const newSession = createSession(crypto.randomUUID());
    setSession(newSession);
  }, []);

  useEffect(() => {
    if (!session) return;

    // Track page view event
    const updatedSession = trackEvent(session, "page_view", {
      path: window.location.pathname,
    });
    setSession(updatedSession);

    // Calculate engagement score
    const score = calculateEngagementScore(updatedSession);
    setEngagement(score);
  }, [session?.id]);

  if (!engagement) return null;

  const tierColors = {
    low: "bg-yellow-100 text-yellow-800",
    medium: "bg-blue-100 text-blue-800", 
    high: "bg-green-100 text-green-800",
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-white dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${tierColors[engagement.tier]}`}>
          {engagement.tier.toUpperCase()}
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Score: {engagement.score.toFixed(1)}
        </div>
      </div>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
        {engagement.recommendation}
      </p>
    </div>
  );
}
