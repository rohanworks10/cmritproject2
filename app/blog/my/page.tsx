'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import BlogCard from '@/components/blog/blog-card'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'

export default function MyBlogsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('you')

  useEffect(() => {
    let authorId = 'you'
    const blogUser = window.localStorage.getItem('soundwave-blog-user')
    if (blogUser) {
      const parsed = JSON.parse(blogUser)
      authorId = parsed?.id || 'you'
      setUserId(authorId)
    }

    const fetchPosts = async () => {
      const response = await fetch(`/api/blog?authorIds=${authorId}`)
      const result = await response.json()
      if (result.success) {
        setPosts(result.data.filter((post: any) => post.authorId === authorId))
      }
      setLoading(false)
    }
    fetchPosts()

    const handleNewPost = (e: any) => {
      const post = e?.detail
      if (!post) return
      if (post.authorId !== authorId) return
      setPosts((current) => {
        if (current.find((p) => p.slug === post.slug)) return current
        return [post, ...current]
      })
    }
    window.addEventListener('soundwave:blog:created', handleNewPost as EventListener)

    return () => {
      window.removeEventListener('soundwave:blog:created', handleNewPost as EventListener)
    }
  }, [])

  const myPosts = useMemo(() => posts, [posts])

  return (
    <div className="min-h-screen pb-28">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">My Blog Posts</p>
            <h1 className="mt-2 text-3xl font-bold">Your drafts and published stories</h1>
          </div>
          <Link href="/blog/new">
            <Button>Write another blog</Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-3xl bg-border" />
            ))}
          </div>
        ) : myPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
            You don&apos;t have any posts yet. Start by writing your first blog.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
