'use client'

import { useCallback, useEffect, useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const REVIEWS_KEY = 'soundwave-song-reviews'

interface StoredReview {
  id: string
  songId: string
  rating: number
  comment: string
  date: string
  userName: string
}

function readAll(): Record<string, StoredReview[]> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(REVIEWS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, StoredReview[]>) : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, StoredReview[]>) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(data))
  window.dispatchEvent(new CustomEvent('song-reviews-changed'))
}

function getReviewsForSong(songId: string): StoredReview[] {
  return readAll()[songId] ?? []
}

function addReviewForSong(
  songId: string,
  review: Omit<StoredReview, 'id' | 'songId' | 'date'>
): StoredReview {
  const all = readAll()
  const stored: StoredReview = {
    ...review,
    id: `review-${Date.now()}`,
    songId,
    date: new Date().toISOString(),
  }
  all[songId] = [stored, ...(all[songId] ?? [])]
  writeAll(all)
  return stored
}

interface ReviewsSectionProps {
  songId: string
  songTitle: string
}

export function ReviewsSection({ songId, songTitle }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<StoredReview[]>([])
  const [userReview, setUserReview] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const loadReviews = useCallback(() => {
    setReviews(getReviewsForSong(songId))
  }, [songId])

  useEffect(() => {
    loadReviews()
    const onChange = () => loadReviews()
    window.addEventListener('song-reviews-changed', onChange)
    return () => window.removeEventListener('song-reviews-changed', onChange)
  }, [loadReviews])

  const handleSubmit = () => {
    if (!userReview.trim() || userRating === 0) return
    addReviewForSong(songId, {
      rating: userRating,
      comment: userReview.trim(),
      userName: 'You',
    })
    setUserReview('')
    setUserRating(0)
    loadReviews()
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
        {reviews.length > 0 && (
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-5 w-5',
                    star <= Math.round(averageRating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Write a review for &quot;{songTitle}&quot;</h3>
        <div className="mb-4 flex items-center gap-1">
          <span className="mr-2 text-sm text-muted-foreground">Your rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
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
          type="button"
          onClick={handleSubmit}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!userReview.trim() || userRating === 0}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Submit Review
        </Button>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center text-muted-foreground">
            No reviews yet. Be the first to share your thoughts.
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-card/80"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-foreground">{review.userName}</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'h-4 w-4',
                        star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}
