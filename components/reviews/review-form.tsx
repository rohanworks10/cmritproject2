'use client'

import { useEffect, useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export function ReviewForm({ targetId, targetType = 'song', onSubmitted, itemId, existingReview, onCancel }: { targetId?: string; targetType?: string; itemId?: string; onSubmitted?: (updated?: any) => void; existingReview?: any; onCancel?: () => void }) {
  const toast = useToast()
  const id = targetId || itemId || ''
  const [rating, setRating] = useState<number>(existingReview?.rating ?? 0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState<string>(existingReview?.title ?? '')
  const [text, setText] = useState<string>(existingReview?.comment ?? '')
  const [submitting, setSubmitting] = useState(false)
  const editing = !!existingReview

  useEffect(() => {
    // when existingReview changes, prefill
    if (existingReview) {
      setRating(existingReview.rating ?? 0)
      setTitle(existingReview.title ?? '')
      setText(existingReview.comment ?? '')
    }
  }, [existingReview])

  const submit = async () => {
    if (!text.trim() || rating === 0) return
    if (text.trim().length < 10) return
    setSubmitting(true)
    try {
      if (editing && existingReview?.id) {
        const res = await fetch(`/api/reviews/${encodeURIComponent(existingReview.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, title: title || undefined, text }),
        })
        const data = await res.json()
        if (!res.ok || !data?.success) {
          toast.toast({ title: 'Failed to update review', description: data?.error || 'Server error' })
        } else {
          toast.toast({ title: 'Review updated successfully' })
          window.dispatchEvent(new CustomEvent('reviews-changed'))
          onSubmitted?.(data.data)
        }
      } else {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetId: id, targetType, rating, title: title || undefined, text, userName: localStorage.getItem('reviewer_name') || 'You' }),
        })
        const data = await res.json()
        if (!res.ok || data?.error) {
          toast.toast({ title: 'Failed to post review', description: data?.error || 'Server error' })
        } else {
          // persist reviewer_name for future author detection
          try { localStorage.setItem('reviewer_name', (data.review?.userName) || (localStorage.getItem('reviewer_name') || 'You')) } catch {}
          toast.toast({ title: 'Review submitted' })
          setText('')
          setTitle('')
          setRating(0)
          window.dispatchEvent(new CustomEvent('reviews-changed'))
          // pass created review to parent so lists can update optimistically
          onSubmitted?.(data.review)
        }
      }
    } catch (err) {
      toast.toast({ title: 'Network error', description: 'Unable to reach server' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-foreground">Write a review</h3>
      <div className="mb-3">
        <input
          placeholder="Summarize your review (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>
      <div className="mb-4 flex items-center gap-1">
        <span className="mr-2 text-sm text-muted-foreground">Your rating:</span>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star className={s <= (hover || rating) ? 'h-6 w-6 fill-primary text-primary' : 'h-6 w-6 text-muted-foreground'} />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Share your thoughts about this song/interview..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4 min-h-24 resize-none bg-secondary"
      />
      <div className="mb-4 text-sm text-muted-foreground">{text.length} characters {text.length < 10 && <span className="text-red-500">(minimum 10)</span>}</div>
      <div className="flex items-center gap-2">
        <Button onClick={submit} disabled={submitting || !text.trim() || rating === 0 || text.trim().length < 10} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <MessageSquare className="mr-2 h-4 w-4" />
          {editing ? 'Update Review' : 'Submit Review'}
        </Button>
        {editing && (
          <Button variant="ghost" onClick={() => onCancel?.()}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}

export default ReviewForm
