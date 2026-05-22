import { NextResponse } from 'next/server'
import { addBlogPost, getPublishedBlogPosts, getSubscribedAuthorIds } from '@/lib/blog-storage'

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

    let posts = getPublishedBlogPosts()

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
    const { title, excerpt, coverImage, content, tags, category, rating, author, authorId, authorAvatar, status } = body || {}

    if (!title || !excerpt || !content || !category || typeof rating !== 'number' || !author || !authorId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const post = addBlogPost({
      title: String(title).trim(),
      excerpt: String(excerpt).trim(),
      coverImage: coverImage ? String(coverImage).trim() : undefined,
      content: String(content),
      tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()) : [],
      category: String(category),
      rating: Number(rating),
      author: String(author),
      authorId: String(authorId),
      authorAvatar: authorAvatar ? String(authorAvatar) : undefined,
      status: status === 'draft' ? 'draft' : 'published',
    })

    return NextResponse.json({ success: true, data: post })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 })
  }
}
