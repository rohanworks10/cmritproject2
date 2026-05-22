'use client'

import ReviewList from './review-list'
import ReviewForm from './review-form'

export function ReviewSection({
  targetId,
  targetType = 'song',
  itemId,
}: {
  targetId?: string
  targetType?: 'song' | 'interview' | string
  itemId?: string
}) {
  const id = targetId || itemId || ''
  return (
    <div className="space-y-8">
      <ReviewList targetId={id} targetType={targetType} />
      <ReviewForm targetId={id} targetType={targetType} />
    </div>
  )
}

export default ReviewSection
