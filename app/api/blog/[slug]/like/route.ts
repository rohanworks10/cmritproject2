import { NextResponse } from 'next/server'
import { toggleBlogLike } from '@/lib/blog-storage'

interface Params {
  params: {
    slug: string
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json()
    const post = toggleBlogLike(params.slug, body?.isLiked)
    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: { likes: post.likes } })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to toggle like' }, { status: 500 })
  }
}
