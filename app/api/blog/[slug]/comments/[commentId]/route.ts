import { NextResponse } from 'next/server'
import { deleteComment } from '@/lib/blog-storage'

interface Params {
  params: {
    slug: string
    commentId: string
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => ({}))
    const deleted = deleteComment(params.slug, params.commentId, body?.userName ? String(body.userName) : undefined)
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Unable to delete comment' }, { status: 400 })
    }
    return NextResponse.json({ success: true, data: { commentId: params.commentId } })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to delete comment' }, { status: 500 })
  }
}
