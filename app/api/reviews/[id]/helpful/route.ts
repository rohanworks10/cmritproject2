import { NextResponse } from 'next/server'
import { toggleHelpful, findReviewById } from '@/lib/review-storage'

interface Params {
  params: { id: string }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => ({}))
    const userId = body?.userId
    const review = findReviewById(params.id)
    if (!review) return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
    const result = toggleHelpful(params.id, userId)
    if (!result) return NextResponse.json({ success: false, error: 'Failed to toggle helpful' }, { status: 400 })
    return NextResponse.json({ success: true, data: { likesCount: result.review.likes, liked: result.liked } })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to toggle helpful' }, { status: 500 })
  }
}
