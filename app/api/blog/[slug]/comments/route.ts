import { NextResponse } from 'next/server'
import { addCommentToBlog, getCommentsForBlog } from '@/lib/blog-storage'

interface Params {
  params: {
    slug: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const comments = getCommentsForBlog(params.slug)
    return NextResponse.json({ success: true, data: comments })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to load comments' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json()
    const text = String(body?.text || '').trim()
    if (!text) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 })
    }

    const comment = addCommentToBlog(params.slug, {
      blogSlug: params.slug,
      parentId: body?.parentId ? String(body.parentId) : undefined,
      userId: String(body?.userId || 'guest'),
      userName: String(body?.userName || 'You'),
      userAvatar: body?.userAvatar ? String(body.userAvatar) : undefined,
      text,
    })

    return NextResponse.json({ success: true, data: comment })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 })
  }
}
