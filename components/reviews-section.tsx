'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ThumbsUp, MessageSquare } from 'lucide-react'
import { Review } from '@/lib/music-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ReviewsSectionProps {
  reviews: Review[]
  songTitle: string
}

export function ReviewsSection({ reviews, songTitle }: ReviewsSectionProps) {
  const [userReview, setUserReview] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set())

  const toggleLike = (reviewId: string) => {
    setLikedReviews((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-5 w-5',
                    star <= averageRating
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Write a review */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Write a review for &quot;{songTitle}&quot;</h3>
        <div className="mb-4 flex items-center gap-1">
          <span className="mr-2 text-sm text-muted-foreground">Your rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setUserRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  star <= (hoveredRating || userRating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
                )}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Share your thoughts about this song..."
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
          className="mb-4 min-h-24 resize-none bg-secondary"
        />
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!userReview || userRating === 0}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Submit Review
        </Button>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-card/80"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={review.userAvatar}
                  alt={review.userName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{review.userName}</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-4 w-4',
                          star <= review.rating
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="mt-3 leading-relaxed text-secondary-foreground">{review.comment}</p>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(review.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-sm transition-colors',
                      likedReviews.has(review.id)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <ThumbsUp
                      className={cn('h-4 w-4', likedReviews.has(review.id) && 'fill-current')}
                    />
                    <span>
                      {review.likes + (likedReviews.has(review.id) ? 1 : 0)} helpful
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
