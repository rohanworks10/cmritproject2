import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  authorId: string
  authorAvatar?: string
  coverImage?: string
  tags: string[]
  category: string
  rating: number
  likes: number
  views: number
  commentsCount: number
  status: 'published' | 'draft'
  content: string
}

export interface BlogComment {
  id: string
  blogSlug: string
  parentId?: string
  userId?: string
  userName: string
  userAvatar?: string
  text: string
  date: string
  likes: number
}

export interface BlogSubscription {
  authorId: string
  subscriberIds: string[]
}

const POSTS_FILE = path.join(process.cwd(), 'data', 'blogPosts.json')
const COMMENTS_FILE = path.join(process.cwd(), 'data', 'blogComments.json')
const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'blogSubscriptions.json')

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback
    const raw = fs.readFileSync(filePath, 'utf-8')
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(filePath: string, data: T) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

function makeSlug(title: string) {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${normalized}-${Date.now()}`
}

export function getAllBlogPosts(): BlogPost[] {
  return readJson<BlogPost[]>(POSTS_FILE, [])
}

export function getPublishedBlogPosts(): BlogPost[] {
  return getAllBlogPosts()
    .filter((post) => post.status === 'published')
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug)
}

export function getTrendingTags(limit = 10) {
  const counts = getPublishedBlogPosts().reduce<Record<string, number>>((acc, post) => {
    post.tags.forEach((tag) => {
      const key = tag.replace(/^#/, '').toLowerCase()
      acc[key] = (acc[key] ?? 0) + 1
    })
    return acc
  }, {})

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag]) => `#${tag}`)
}

export function addBlogPost(post: Omit<BlogPost, 'slug' | 'date' | 'likes' | 'views' | 'commentsCount'>) {
  const existing = getAllBlogPosts()
  const slug = makeSlug(post.title)
  const nextPost: BlogPost = {
    ...post,
    slug,
    date: new Date().toISOString(),
    likes: 0,
    views: 0,
    commentsCount: 0,
  }
  writeJson(POSTS_FILE, [nextPost, ...existing])
  return nextPost
}

export function updateBlogPost(slug: string, update: Partial<BlogPost>) {
  const posts = getAllBlogPosts()
  const next = posts.map((post) => (post.slug === slug ? { ...post, ...update } : post))
  writeJson(POSTS_FILE, next)
  return next.find((post) => post.slug === slug)
}

export function toggleBlogLike(slug: string, isCurrentlyLiked?: boolean) {
  const post = getBlogPostBySlug(slug)
  if (!post) return null
  const likes = isCurrentlyLiked ? Math.max(post.likes - 1, 0) : post.likes + 1
  return updateBlogPost(slug, { likes })
}

export function incrementBlogViews(slug: string) {
  const post = getBlogPostBySlug(slug)
  if (!post) return null
  return updateBlogPost(slug, { views: post.views + 1 })
}

function getAllComments(): BlogComment[] {
  return readJson<BlogComment[]>(COMMENTS_FILE, [])
}

function writeAllComments(comments: BlogComment[]) {
  writeJson(COMMENTS_FILE, comments)
}

export function getCommentsForBlog(slug: string) {
  return getAllComments()
    .filter((comment) => comment.blogSlug === slug)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export function addCommentToBlog(blogSlug: string, comment: Omit<BlogComment, 'id' | 'date' | 'likes'>) {
  const comments = getAllComments()
  const next: BlogComment = {
    ...comment,
    id: `comment-${Date.now()}`,
    date: new Date().toISOString(),
    likes: 0,
  }
  writeAllComments([next, ...comments])
  const post = getBlogPostBySlug(blogSlug)
  if (post) {
    updateBlogPost(blogSlug, { commentsCount: (post.commentsCount ?? 0) + 1 })
  }
  return next
}

export function deleteComment(blogSlug: string, commentId: string, userName?: string) {
  const comments = getAllComments()
  const target = comments.find((comment) => comment.id === commentId && comment.blogSlug === blogSlug)
  if (!target) return false
  if (userName && target.userName !== userName && userName !== 'Admin') return false
  const remaining = comments.filter((comment) => comment.id !== commentId && comment.parentId !== commentId)
  writeAllComments(remaining)
  const post = getBlogPostBySlug(blogSlug)
  if (post) {
    updateBlogPost(blogSlug, { commentsCount: Math.max((post.commentsCount ?? 1) - 1, 0) })
  }
  return true
}

export function toggleCommentLike(blogSlug: string, commentId: string, isCurrentlyLiked?: boolean) {
  const comments = getAllComments()
  const updated = comments.map((comment) => {
    if (comment.blogSlug === blogSlug && comment.id === commentId) {
      return { ...comment, likes: isCurrentlyLiked ? Math.max(comment.likes - 1, 0) : comment.likes + 1 }
    }
    return comment
  })
  writeAllComments(updated)
  return updated.find((comment) => comment.id === commentId)
}

function getAllSubscriptions(): BlogSubscription[] {
  return readJson<BlogSubscription[]>(SUBSCRIPTIONS_FILE, [])
}

function writeAllSubscriptions(subscriptions: BlogSubscription[]) {
  writeJson(SUBSCRIPTIONS_FILE, subscriptions)
}

export function toggleSubscription(authorId: string, subscriberId: string) {
  const subscriptions = getAllSubscriptions()
  const record = subscriptions.find((item) => item.authorId === authorId)
  const existingIds = record?.subscriberIds ?? []
  const isSubscribed = existingIds.includes(subscriberId)
  const nextIds = isSubscribed ? existingIds.filter((id) => id !== subscriberId) : [...existingIds, subscriberId]
  const nextRecords = record
    ? subscriptions.map((item) => (item.authorId === authorId ? { ...item, subscriberIds: nextIds } : item))
    : [...subscriptions, { authorId, subscriberIds: nextIds }]
  writeAllSubscriptions(nextRecords)
  return { subscribed: !isSubscribed, count: nextIds.length }
}

export function getSubscriptionCount(authorId: string) {
  const subscriptions = getAllSubscriptions()
  return subscriptions.find((item) => item.authorId === authorId)?.subscriberIds.length ?? 0
}

export function getSubscribedAuthorIds(subscriberId: string) {
  return getAllSubscriptions()
    .filter((item) => item.subscriberIds.includes(subscriberId))
    .map((item) => item.authorId)
}
