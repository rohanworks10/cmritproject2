'use client'

import { useEffect, useState } from 'react'
import ReviewCard from './review-card'

interface Review {
  id: string
  userId?: string
  userName: string
  userAvatar?: string | null
  rating: number
  title?: string
  comment: string
  createdAt?: string
  date?: string
  likes?: number
}

export function ReviewList({
  targetId,
  targetType = 'song',
  itemId,
}: {
  targetId?: string
  targetType?: 'song' | 'interview' | string
  itemId?: string
}) {
  const id = targetId || itemId || ''
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [average, setAverage] = useState<number>(0)
  const [totalCount, setTotalCount] = useState<number>(0)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reviews?targetId=${encodeURIComponent(id)}&targetType=${encodeURIComponent(targetType as string)}`)
      const data = await res.json()
      setReviews(data.reviews ?? [])
      setAverage(data.average ?? 0)
      // support older responses that used `count`
      setTotalCount(typeof data.totalCount === 'number' ? data.totalCount : (typeof data.count === 'number' ? data.count : 0))
    } catch (e) {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    load()
    const onChange = () => load()
    window.addEventListener('reviews-changed', onChange)
    return () => window.removeEventListener('reviews-changed', onChange)
  }, [id, targetType])

  const recomputeStats = (list: Review[]) => {
    const total = list.length
    const avg = total ? list.reduce((a, r) => a + (r.rating || 0), 0) / total : 0
    setReviews(list)
    setTotalCount(total)
    setAverage(Number(avg.toFixed(2)))
  }

  const handleUpdate = (updated: any) => {
    const next = reviews.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    recomputeStats(next)
  }

  const handleDelete = (idToRemove: string) => {
    const next = reviews.filter((r) => r.id !== idToRemove)
    recomputeStats(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
        {totalCount > 0 && <span className="text-muted-foreground">({totalCount})</span>}
        {totalCount > 0 && <span className="ml-2 font-semibold text-foreground">{average.toFixed(1)}</span>}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center text-muted-foreground">
          No reviews yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewList
