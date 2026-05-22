'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import BlogComments from './blog-comments'
import { Heart, Star, Bell, MessageCircle } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-storage'

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-border'}`}
    />
  ))
}

export default function BlogDetail({ post }: { post: BlogPost }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [subscribed, setSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)

  useEffect(() => {
    const likedBlog = JSON.parse(window.localStorage.getItem('soundwave-liked-blogs') || '[]')
    setLiked(Array.isArray(likedBlog) && likedBlog.includes(post.slug))
    const subscriptions = JSON.parse(window.localStorage.getItem('soundwave-subscribed-authors') || '[]')
    setSubscribed(Array.isArray(subscriptions) && subscriptions.includes(post.authorId))
    setSubscriberCount(Array.isArray(subscriptions) ? subscriptions.length : 0)
  }, [post.authorId, post.slug])

  const stars = useMemo(() => renderStars(post.rating), [post.rating])

  const updateLocalLikes = (nextLiked: boolean) => {
    const current = JSON.parse(window.localStorage.getItem('soundwave-liked-blogs') || '[]')
    const list = Array.isArray(current) ? current : []
    const next = nextLiked ? [...new Set([...list, post.slug])] : list.filter((slug) => slug !== post.slug)
    window.localStorage.setItem('soundwave-liked-blogs', JSON.stringify(next))
  }

  const updateLocalSubscriptions = (nextSubscribed: boolean) => {
    const current = JSON.parse(window.localStorage.getItem('soundwave-subscribed-authors') || '[]')
    const list = Array.isArray(current) ? current : []
    const next = nextSubscribed ? [...new Set([...list, post.authorId])] : list.filter((id) => id !== post.authorId)
    window.localStorage.setItem('soundwave-subscribed-authors', JSON.stringify(next))
  }

  const handleLike = async () => {
    const response = await fetch(`/api/blog/${post.slug}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLiked: liked }),
    })
    const result = await response.json()
    if (result.success) {
      setLiked(!liked)
      setLikes(result.data.likes)
      updateLocalLikes(!liked)
    }
  }

  const handleSubscribe = async () => {
    const response = await fetch('/api/blog/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: post.authorId, subscriberId: 'you' }),
    })
    const result = await response.json()
    if (result.success) {
      setSubscribed(result.data.subscribed)
      setSubscriberCount(result.data.count)
      updateLocalSubscriptions(result.data.subscribed)
    }
  }

  const formattedDate = new Date(post.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="h-[320px] w-full rounded-3xl object-cover" />
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{post.author}</span>
                </div>
                <span>•</span>
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{post.views} views</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-3 py-1 text-foreground">
                {stars}
                <span className="ml-1">({post.rating}/5)</span>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-3 py-1 text-foreground">
                <MessageCircle className="h-4 w-4" /> {post.commentsCount} comments
              </div>
            </div>
          </div>

          <aside className="space-y-4 rounded-3xl border border-border bg-background p-6">
            <div className="space-y-3">
              <Button variant={liked ? 'secondary' : 'default'} className="w-full" onClick={handleLike}>
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                {liked ? 'Liked' : 'Like'} {likes}
              </Button>
              <Button variant={subscribed ? 'secondary' : 'default'} className="w-full" onClick={handleSubscribe}>
                <Bell className="h-4 w-4" />
                {subscribed ? 'Subscribed ✓' : `Subscribe to ${post.author}`}
              </Button>
              <div className="rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Author subscribers</p>
                <p>{subscriberCount} {subscriberCount === 1 ? 'subscriber' : 'subscribers'}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="prose max-w-none prose-a:text-primary prose-img:rounded-3xl" dangerouslySetInnerHTML={{ __html: post.content }} />
      </section>

      <BlogComments slug={post.slug} />
    </div>
  )
}
