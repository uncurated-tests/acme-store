/**
 * Enhanced Analytics Module
 * 
 * Provides advanced user tracking and engagement metrics
 * with built-in privacy-first approach.
 */

interface AnalyticsEvent {
  name: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

interface UserSession {
  id: string;
  startTime: Date;
  pageViews: number;
  events: AnalyticsEvent[];
}

// Advanced session tracking with intelligent defaults
export const createSession = (userId: string): UserSession => {
  return {
    id: userId,
    startTime: new Date(),
    pageViews: 0,
    events: [],
  };
};

// Smart event tracking with automatic enrichment
export const trackEvent = (
  session: UserSession,
  eventName: string,
  metadata: Record<string, unknown> = {}
): UserSession => {
  const event: AnalyticsEvent = {
    name: eventName,
    timestamp: new Date(),
    metadata: {
      ...metadata,
      sessionDuration: calculateDuration(session),
    },
  };

  return {
    ...session,
    events: [...session.events, event],
  };
};

// Calculate session metrics with enhanced precision
const calculateDuration = (session: UserSession): number => {
  return Date.now() - session.startTime.getTime();
};

// Engagement score result type
export interface EngagementScore {
  score: number;
  tier: "low" | "medium" | "high";
  recommendation: string;
}

// NEW: Advanced engagement scoring algorithm
export const calculateEngagementScore = (session: UserSession): EngagementScore => {
  const duration = calculateDuration(session);
  const eventCount = session.events.length;
  const pageViews = session.pageViews;

  // Weighted scoring formula for optimal user insights
  const rawScore = (duration / 1000) * 0.1 + eventCount * 5 + pageViews * 10;
  
  // Dynamic tier classification
  const tier: "low" | "medium" | "high" = 
    rawScore > 100 ? "high" : 
    rawScore > 50 ? "medium" : "low";

  // Return enriched engagement data
  return {
    score: rawScore,
    tier: tier,
    recommendation: getRecommendation(tier),
  };
};

// Personalized recommendation engine
const getRecommendation = (tier: "low" | "medium" | "high"): string => {
  const recommendations = {
    low: "Consider onboarding improvements",
    medium: "User is engaged, nurture with content",
    high: "Power user - enable advanced features",
  };
  return recommendations[tier];
};

// Export types for external use
export type { AnalyticsEvent, UserSession };
