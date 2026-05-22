'use client'

import { cn } from '@/lib/utils'
import { Star, Heart, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'
import ReviewForm from './review-form'
import { useToast } from '@/hooks/use-toast'

interface ReviewCardProps {
  review: {
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
    helpfulBy?: string[]
  }
}

export function ReviewCard({ review, onUpdate, onDelete }: ReviewCardProps & { onUpdate?: (r: any) => void; onDelete?: (id: string) => void }) {
  const initials = review.userName ? review.userName.charAt(0).toUpperCase() : '?'
  const [likes, setLikes] = useState(review.likes ?? 0)
  const [liked, setLiked] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const toast = useToast()

  const reviewerId = typeof window !== 'undefined' ? localStorage.getItem('reviewer_id') : null
  const reviewerName = typeof window !== 'undefined' ? localStorage.getItem('reviewer_name') : null
  const isAuthor = !!((review.userId && reviewerId && review.userId === reviewerId) || (!review.userId && reviewerName && review.userName === reviewerName))

  const toggleHelpful = async () => {
    // optimistic
    setLiked((v) => !v)
    setLikes((c: number) => (liked ? Math.max(c - 1, 0) : c + 1))
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(review.id)}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data?.success && data?.data) {
        setLikes(data.data.likesCount ?? likes)
        setLiked(!!data.data.liked)
      }
    } catch (e) {
      setLiked((v) => !v)
      setLikes((c: number) => (liked ? c + 1 : Math.max(c - 1, 0)))
    }
  }

  const handleDelete = async () => {
    // optimistic: remove from UI
    try {
      onDelete?.(review.id)
      setConfirmDelete(false)
      const res = await fetch(`/api/reviews/${encodeURIComponent(review.id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        toast.toast({ title: 'Failed to delete review', description: data?.error || 'Server error' })
        // revert by reloading reviews
        window.dispatchEvent(new CustomEvent('reviews-changed'))
      } else {
        toast.toast({ title: 'Review deleted' })
        window.dispatchEvent(new CustomEvent('reviews-changed'))
      }
    } catch (err) {
      toast.toast({ title: 'Network error', description: 'Unable to delete review' })
      window.dispatchEvent(new CustomEvent('reviews-changed'))
    }
  }

  const handleUpdateFromForm = (updated: any) => {
    setEditing(false)
    if (updated) {
      onUpdate?.(updated)
    } else {
      // reload list
      window.dispatchEvent(new CustomEvent('reviews-changed'))
    }
  }

  if (editing) {
    return <ReviewForm existingReview={review} onSubmitted={handleUpdateFromForm} onCancel={() => setEditing(false)} />
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">{initials}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">{review.userName}</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn('h-4 w-4', s <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground')} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{new Date(review.createdAt || review.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              {isAuthor && (
                <>
                  <button type="button" onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(true)} className="text-muted-foreground hover:text-foreground">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="mt-3 text-secondary-foreground">{review.comment}</p>
          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={toggleHelpful} className={`inline-flex items-center gap-2 text-sm transition ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}>
              <Heart className="h-4 w-4" /> Helpful {likes}
            </button>
          </div>
          {confirmDelete && (
            <div className="mt-3 rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-700">Are you sure you want to delete this review?</p>
              <div className="mt-2 flex gap-2">
                <button onClick={handleDelete} className="rounded bg-red-600 px-3 py-1 text-white">Yes, delete</button>
                <button onClick={() => setConfirmDelete(false)} className="rounded border border-border px-3 py-1">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
