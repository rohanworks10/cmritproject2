import { NextResponse } from 'next/server'
import { updateReview, deleteReview, findReviewById } from '@/lib/review-storage'

interface Params {
  params: { id: string }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json()
    const { rating, title, text } = body || {}
    const userId = body?.userId

    const existing = findReviewById(params.id)
    if (!existing) return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })

    // Only allow author to edit (if userId provided)
    if (existing.userId && userId && existing.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 })
    }

    const update = {}
    if (typeof rating === 'number') (update as any).rating = rating
    if (typeof title === 'string') (update as any).title = title.slice(0, 80)
    if (typeof text === 'string') (update as any).comment = text.trim()

    const updated = updateReview(params.id, userId, update)
    if (!updated) return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 400 })
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => ({}))
    const userId = body?.userId
    const ok = deleteReview(params.id, userId)
    if (!ok) return NextResponse.json({ success: false, error: 'Not found or not authorized' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 })
  }
}
