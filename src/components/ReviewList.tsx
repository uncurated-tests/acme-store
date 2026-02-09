"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";
import { getReviewsByProductId, getReviewSummary } from "@/lib/reviews";
import type { ReviewSortOption } from "@/lib/reviews";
import { Badge, Button } from "./ui";

interface ReviewListProps {
  productId: string;
  initialSort?: ReviewSortOption;
}

export function ReviewList({ productId, initialSort }: ReviewListProps) {
  const [sort, setSort] = useState<ReviewSortOption>(
    initialSort ?? { field: "date", direction: "desc" }
  );

  const reviews = getReviewsByProductId(productId, sort);

  // BUG: getReviewSummary expects a `Product` object, but we're passing a
  // plain `string` (productId). This is a type error.
  const summary = getReviewSummary(productId);

  const ratingBars = [5, 4, 3, 2, 1];

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
        Customer Reviews
      </h2>

      {/* Summary */}
      <div className="mt-4 flex items-start gap-8 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="text-center">
          <div className="text-4xl font-bold text-zinc-900 dark:text-white">
            {summary.averageRating.toFixed(1)}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            {summary.totalReviews} reviews
          </div>
        </div>

        <div className="flex-1 space-y-1">
          {ratingBars.map((stars) => {
            const count = summary.ratingDistribution[stars] || 0;
            const pct =
              summary.totalReviews > 0
                ? (count / summary.totalReviews) * 100
                : 0;
            return (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-12 text-right text-zinc-600 dark:text-zinc-400">
                  {stars} star
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-zinc-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sort controls */}
      <div className="mt-6 flex items-center gap-2">
        <span className="text-sm text-zinc-500">Sort by:</span>
        {(["date", "rating", "helpful"] as const).map((field) => (
          <Button
            key={field}
            variant={sort.field === field ? "primary" : "outline"}
            size="sm"
            onClick={() =>
              setSort({
                field,
                direction:
                  sort.field === field && sort.direction === "desc"
                    ? "asc"
                    : "desc",
              })
            }
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Button>
        ))}
      </div>

      {/* Review list */}
      <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-zinc-500">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </div>
    </section>
  );
}

interface ReviewItemProps {
  review: Review;
}

function ReviewItem({ review }: ReviewItemProps) {
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  return (
    <article className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
            {review.userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="font-medium text-zinc-900 dark:text-white">
              {review.userName}
            </div>
            <div className="text-xs text-zinc-500">
              {review.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>

        {review.verified && (
          <Badge variant="success" size="sm">
            Verified Purchase
          </Badge>
        )}
      </div>

      {/* Stars */}
      <div className="mt-3 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${
              i < review.rating
                ? "text-yellow-400"
                : "text-zinc-300 dark:text-zinc-600"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">
        {review.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {review.content}
      </p>

      {/* Helpful */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <button
          className="flex items-center gap-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          onClick={() => setHelpfulClicked(true)}
          disabled={helpfulClicked}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H7v-8l3-6V3a1 1 0 011-1h.5a2 2 0 012 2v4z"
            />
          </svg>
          Helpful ({review.helpful + (helpfulClicked ? 1 : 0)})
        </button>
      </div>

      {/* Store response */}
      {review.response && (
        <div className="mt-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Response from {review.response.respondedBy}
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {review.response.content}
          </p>
        </div>
      )}
    </article>
  );
}
