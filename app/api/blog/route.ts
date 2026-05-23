import { NextResponse } from 'next/server'
import { addBlogPost, getPublishedBlogPosts, getSubscribedAuthorIds, getAllBlogPosts } from '@/lib/blog-storage'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const tag = url.searchParams.get('tag')?.replace(/^#/, '').toLowerCase()
    const category = url.searchParams.get('category')
    const sort = url.searchParams.get('sort')
    const query = url.searchParams.get('q')?.toLowerCase() || ''
    const authorIds = url
      .searchParams.get('authorIds')
      ?.split(',')
      .map((authorId) => authorId.trim())
      .filter(Boolean)

    let posts = authorIds && authorIds.length ? getAllBlogPosts() : getPublishedBlogPosts()

    if (authorIds && authorIds.length) {
      posts = posts.filter((post) => authorIds.includes(post.authorId))
    }

    if (category) {
      posts = posts.filter((post) => post.category.toLowerCase() === category.toLowerCase())
    }

    if (tag) {
      posts = posts.filter((post) =>
        post.tags.some((t) => t.replace(/^#/, '').toLowerCase() === tag),
      )
    }

    if (query) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((t) => t.toLowerCase().includes(query)),
      )
    }

    if (sort === 'Most Liked') {
      posts = posts.sort((a, b) => b.likes - a.likes)
    } else if (sort === 'Most Commented') {
      posts = posts.sort((a, b) => b.commentsCount - a.commentsCount)
    } else {
      posts = posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))
    }

    return NextResponse.json({ success: true, data: posts })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to load blog posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('[API] POST /api/blog body:', body)
    const { title, excerpt, coverImage, content, tags, category, rating, author, authorId, authorAvatar, status } = body || {}

    // Apply sensible defaults for missing fields instead of rejecting
    const safeTitle = String(title || 'Untitled').trim()
    const safeExcerpt = String(excerpt || '').trim()
    const safeContent = String(content || '')
    const safeTags = Array.isArray(tags) ? tags.map((tag) => String(tag).trim()) : []
    const safeCategory = String(category || 'Uncategorized')
    const safeRating = typeof rating === 'number' && !Number.isNaN(rating) ? Number(rating) : 0
    const safeAuthor = String(author || 'You')
    const safeAuthorId = String(authorId || 'you')

    const post = addBlogPost({
      title: safeTitle,
      excerpt: safeExcerpt,
      coverImage: coverImage ? String(coverImage).trim() : undefined,
      content: safeContent,
      tags: safeTags,
      category: safeCategory,
      rating: safeRating,
      author: safeAuthor,
      authorId: safeAuthorId,
      authorAvatar: authorAvatar ? String(authorAvatar) : undefined,
      status: status === 'draft' ? 'draft' : 'published',
    })
    console.log('[API] created post', post.slug)

    return NextResponse.json({ success: true, data: post })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 })
  }
}
