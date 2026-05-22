'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageSquare, Star } from 'lucide-react'

export function BlogCard({
  post,
  liked,
  likes,
  onToggleLike,
  selectedTag,
  onTagClick,
}: {
  post: any
  liked?: boolean
  likes?: number
  onToggleLike?: (slug: string) => void
  selectedTag?: string | null
  onTagClick?: (tag: string) => void
}) {
  const formattedDate = new Date(post.date).toLocaleDateString()
  const activeTagValue = selectedTag?.replace(/^#/, '').toLowerCase()
  const displayLikes = likes ?? post.likes

  return (
    <div className="group overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className="block">
          <img src={post.coverImage} alt={post.title} className="h-48 w-full object-cover" />
        </Link>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          {post.tags.slice(0, 3).map((tag: string) => {
            const normalizedTag = tag.startsWith('#') ? tag : `#${tag}`
            const isActive = activeTagValue
              ? normalizedTag.replace(/^#/, '').toLowerCase() === activeTagValue
              : false
            return onTagClick ? (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(normalizedTag)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  isActive
                    ? 'border border-primary bg-primary text-primary-foreground'
                    : 'border border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {normalizedTag}
              </button>
            ) : (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            )
          })}
        </div>

        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary">{post.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold uppercase text-muted-foreground">
              {post.author?.charAt(0) ?? '?'}
            </div>
            <div>
              <div className="font-medium text-foreground">{post.author}</div>
              <div>{formattedDate}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className={index < post.rating ? 'h-4 w-4' : 'h-4 w-4 text-border'} />
              ))}
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs">
              {onToggleLike ? (
                <button
                  type="button"
                  onClick={() => onToggleLike(post.slug)}
                  className={`inline-flex items-center gap-1 transition ${
                    liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {displayLikes}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-3.5 w-3.5" />
                  {displayLikes}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                {post.commentsCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
