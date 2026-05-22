import { NextResponse } from 'next/server'
import {
  getReviewsForTarget,
  addReviewForTarget,
  getAverageForTarget,
} from '@/lib/review-storage'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const targetId = url.searchParams.get('targetId') || url.searchParams.get('itemId') || ''
    const targetType = url.searchParams.get('targetType') || 'song'
    if (!targetId) return NextResponse.json({ reviews: [], average: 0, count: 0, ratingBreakdown: {} })
    const reviews = getReviewsForTarget(targetType, targetId)
    const avg = getAverageForTarget(targetType, targetId)
    return NextResponse.json({ reviews, average: avg.average, totalCount: avg.count, ratingBreakdown: avg.breakdown })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const targetId = body?.targetId || body?.itemId
    const targetType = body?.targetType || 'song'
    const rating = Number(body?.rating)
    const text = String(body?.text ?? body?.comment ?? '')
    const title = body?.title ? String(body.title).slice(0, 80) : undefined
    const userName = body?.userName ?? 'Anonymous'

    if (!targetId || !text || !rating) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }
    if (text.trim().length < 10) {
      return NextResponse.json({ error: 'Review text must be at least 10 characters' }, { status: 400 })
    }
    if (!['song', 'interview'].includes(targetType)) {
      return NextResponse.json({ error: 'Invalid targetType' }, { status: 400 })
    }

    // Prevent duplicate review by same userName for the same target
    const existing = getReviewsForTarget(targetType, targetId).find((r) => (r.userName || '').toLowerCase() === String(userName).toLowerCase())
    if (existing) {
      return NextResponse.json({ error: 'User has already reviewed this item' }, { status: 409 })
    }

    const created = addReviewForTarget(targetType, targetId, {
      userName: userName ?? 'Anonymous',
      rating,
      title,
      comment: text.trim(),
    })
    const avg = getAverageForTarget(targetType, targetId)
    return NextResponse.json({ review: created, average: avg.average, totalCount: avg.count, ratingBreakdown: avg.breakdown })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
