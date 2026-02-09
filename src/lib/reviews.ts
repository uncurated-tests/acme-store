/**
 * Product Reviews Module
 *
 * Handles fetching, submitting, and aggregating product reviews.
 */

import type { Review, Product } from "./types";

// Mock review data
const mockReviews: Review[] = [
  {
    id: "rev_001",
    productId: "prod_001",
    userId: "user_001",
    userName: "Alice Johnson",
    rating: 5,
    title: "Best headphones I've ever owned",
    content:
      "The noise cancellation is incredible. I use these daily for work calls and music. Battery life easily lasts a full week of use.",
    helpful: 42,
    notHelpful: 3,
    verified: true,
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-05-10"),
  },
  {
    id: "rev_002",
    productId: "prod_001",
    userId: "user_002",
    userName: "Bob Smith",
    rating: 4,
    title: "Great sound, slightly tight fit",
    content:
      "Audio quality is top-notch. My only complaint is they feel a bit tight after 3+ hours of continuous use. Otherwise fantastic.",
    helpful: 18,
    notHelpful: 1,
    verified: true,
    createdAt: new Date("2024-04-22"),
    updatedAt: new Date("2024-04-22"),
    response: {
      content:
        "Thanks for the feedback! The ear cushions do loosen up after the first week of use.",
      respondedBy: "Acme Support",
      respondedAt: new Date("2024-04-23"),
    },
  },
  {
    id: "rev_003",
    productId: "prod_003",
    userId: "user_003",
    userName: "Carol Davis",
    rating: 5,
    title: "Super comfortable and sustainable",
    content:
      "Love that this is organic cotton. The fit is perfect and it held up great after multiple washes.",
    helpful: 29,
    notHelpful: 0,
    verified: true,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-01"),
  },
];

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  recommendationPercentage: number;
}

export interface ReviewSortOption {
  field: "date" | "rating" | "helpful";
  direction: "asc" | "desc";
}

/**
 * Get all reviews for a specific product.
 */
export function getReviewsByProductId(
  productId: string,
  sort?: ReviewSortOption
): Review[] {
  let reviews = mockReviews.filter((r) => r.productId === productId);

  if (sort) {
    reviews.sort((a, b) => {
      const dir = sort.direction === "asc" ? 1 : -1;
      switch (sort.field) {
        case "date":
          return dir * (a.createdAt.getTime() - b.createdAt.getTime());
        case "rating":
          return dir * (a.rating - b.rating);
        case "helpful":
          return dir * (a.helpful - b.helpful);
        default:
          return 0;
      }
    });
  }

  return reviews;
}

/**
 * Compute an aggregate summary for a product's reviews.
 *
 * BUG: The function signature says it accepts a Product but the
 * implementation accesses `product.id` which is correct, however
 * callers will pass a plain `string` productId, causing a type mismatch.
 */
export function getReviewSummary(product: Product): ReviewSummary {
  const reviews = mockReviews.filter((r) => r.productId === product.id);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
  });

  const recommendationPercentage =
    totalReviews > 0
      ? (reviews.filter((r) => r.rating >= 4).length / totalReviews) * 100
      : 0;

  return {
    averageRating,
    totalReviews,
    ratingDistribution,
    recommendationPercentage,
  };
}

/**
 * Submit a new review.
 *
 * BUG: The `rating` parameter is typed as `string` here, but the Review
 * interface expects `number`. This will cause a type error downstream.
 */
export function submitReview(
  productId: string,
  userId: string,
  userName: string,
  rating: string, // BUG: should be `number`
  title: string,
  content: string
): Review {
  const newReview: Review = {
    id: `rev_${Date.now()}`,
    productId,
    userId,
    userName,
    rating, // Type error: string is not assignable to number
    title,
    content,
    helpful: 0,
    notHelpful: 0,
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockReviews.push(newReview);
  return newReview;
}
