import { NextResponse } from 'next/server'
import { toggleCommentLike } from '@/lib/blog-storage'

interface Params {
  params: {
    slug: string
    commentId: string
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json()
    const comment = toggleCommentLike(params.slug, params.commentId, body?.isLiked)
    if (!comment) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: comment })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to toggle comment like' }, { status: 500 })
  }
}
