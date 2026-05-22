'use client'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

export function BlogHeader({ post }: { post: any }) {
  return (
    <header className="mb-8 space-y-4 rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{post.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.views} views</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback>{post.author?.charAt(0) ?? '?'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-foreground">{post.author}</div>
            <div className="text-sm text-muted-foreground">{post.category}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {post.tags?.map((tag: string) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 rounded-full bg-secondary/70 px-4 py-2 text-sm font-medium text-foreground">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className={index < post.rating ? 'h-4 w-4 text-yellow-400' : 'h-4 w-4 text-border'} />
        ))}
        <span>{post.rating}/5</span>
      </div>
    </header>
  )
}

export default BlogHeader
