'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BlogCard from './blog-card'
import { Sparkles } from 'lucide-react'

const categories = [
  'All',
  'Artist Interview',
  'Album Review',
  'Concert Review',
  'Music News',
  'Opinion',
  'Behind the Scenes',
]

const sortOptions = ['Newest', 'Most Liked', 'Most Commented']

function normalizeTag(tag: string) {
  const value = tag.trim().replace(/^#/, '')
  return value ? `#${value}` : ''
}

export default function BlogListing() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'All')
  const [filterSort, setFilterSort] = useState(searchParams.get('sort') || 'Newest')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get('tag') ? `#${searchParams.get('tag')}` : null,
  )
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all')
  const [subscribedAuthors, setSubscribedAuthors] = useState<string[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [pageReady, setPageReady] = useState(false)

  useEffect(() => {
    setPageReady(true)
    const subscriptionList = JSON.parse(window.localStorage.getItem('soundwave-subscribed-authors') || '[]')
    setSubscribedAuthors(Array.isArray(subscriptionList) ? subscriptionList : [])
    const savedLikes = JSON.parse(window.localStorage.getItem('soundwave-liked-blogs') || '[]')
    setLikedPosts(new Set(Array.isArray(savedLikes) ? savedLikes : []))
    if (!window.localStorage.getItem('soundwave-blog-user')) {
      window.localStorage.setItem('soundwave-blog-user', JSON.stringify({ id: 'you', name: 'You' }))
    }
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const response = await fetch('/api/blog')
      const result = await response.json()
      setLoading(false)
      if (result.success) {
        setPosts(result.data)
        setLikeCounts(Object.fromEntries(result.data.map((post: any) => [post.slug, post.likes])))
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    setFilterCategory(searchParams.get('category') || 'All')
    setFilterSort(searchParams.get('sort') || 'Newest')
    setSearchQuery(searchParams.get('q') || '')
    setSelectedTag(searchParams.get('tag') ? `#${searchParams.get('tag')}` : null)
    setActiveTab(searchParams.get('tab') || 'all')
  }, [searchParams])

  useEffect(() => {
    if (!pageReady) return
    window.localStorage.setItem('soundwave-liked-blogs', JSON.stringify([...likedPosts]))
  }, [likedPosts, pageReady])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filterCategory !== 'All' && post.category !== filterCategory) return false
      if (selectedTag && !post.tags.some((tag: string) => tag.replace(/^#/, '').toLowerCase() === selectedTag.replace(/^#/, '').toLowerCase())) return false
      if (
        searchQuery &&
        !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
        return false
      if (activeTab === 'following') {
        return subscribedAuthors.includes(post.authorId)
      }
      return true
    })
  }, [posts, filterCategory, selectedTag, searchQuery, activeTab, subscribedAuthors])

  const sortedPosts = useMemo(() => {
    const copy = [...filteredPosts]
    if (filterSort === 'Most Liked') return copy.sort((a, b) => b.likes - a.likes)
    if (filterSort === 'Most Commented') return copy.sort((a, b) => b.commentsCount - a.commentsCount)
    return copy.sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }, [filteredPosts, filterSort])

  const trendingTags = useMemo(() => {
    const counts = posts.reduce<Record<string, number>>((acc, post) => {
      post.tags.forEach((tag: string) => {
        const value = tag.replace(/^#/, '').toLowerCase()
        acc[value] = (acc[value] ?? 0) + 1
      })
      return acc
    }, {})
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => `#${tag}`)
  }, [posts])

  const updateUrl = (params: Record<string, string | null>) => {
    const search = new URLSearchParams(searchParams as any)
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) search.delete(key)
      else search.set(key, value)
    })
    const query = search.toString()
    router.push(`/blog${query ? `?${query}` : ''}`)
  }

  const handleTagClick = (tag: string) => {
    const normalized = normalizeTag(tag)
    const isSameTag = selectedTag && normalized.replace(/^#/, '').toLowerCase() === selectedTag.replace(/^#/, '').toLowerCase()
    const nextTag = isSameTag ? null : normalized
    setSelectedTag(nextTag)
    updateUrl({ tag: nextTag ? nextTag.replace(/^#/, '') : null, tab: 'all', q: null, category: null })
  }

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId)
    setLikedPosts((prev) => {
      const next = new Set(prev)
      isLiked ? next.delete(postId) : next.add(postId)
      return next
    })
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + (isLiked ? -1 : 1),
    }))

    try {
      const response = await fetch(`/api/blog/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLiked }),
      })
      const result = await response.json()
      if (!result.success) throw new Error('Failed to toggle like')
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: result.data.likes,
      }))
    } catch {
      setLikedPosts((prev) => {
        const next = new Set(prev)
        isLiked ? next.add(postId) : next.delete(postId)
        return next
      })
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? 0) + (isLiked ? 1 : -1),
      }))
    }
  }

  const hasBlogUser = pageReady && Boolean(window.localStorage.getItem('soundwave-blog-user'))

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog</h1>
            <p className="text-sm text-muted-foreground">Stories, reviews, and conversations from the Soundwave community.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/blog/new">
              <Button>Write a Blog</Button>
            </Link>
            {hasBlogUser && (
              <Link href="/blog/my">
                <Button variant="outline">My Blogs</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                value={searchQuery}
                placeholder="Search title or hashtag"
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    setSelectedTag(null)
                    updateUrl({ q: searchQuery || null, tag: null, tab: 'all', category: null })
                  }
                }}
                className="min-w-0"
              />
              <select
                value={filterSort}
                onChange={(event) => {
                  setFilterSort(event.target.value)
                  updateUrl({ sort: event.target.value, tab: activeTab })
                }}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFilterCategory(option)
                    updateUrl({ category: option !== 'All' ? option : null, tab: 'all' })
                  }}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    filterCategory === option ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {['all', 'following'].map((tabName) => (
                <button
                  key={tabName}
                  type="button"
                  onClick={() => {
                    setActiveTab(tabName)
                    setSelectedTag(null)
                    updateUrl({ tab: tabName, category: 'All', q: null, tag: null })
                  }}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeTab === tabName ? 'bg-primary text-primary-foreground' : 'border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {tabName === 'following' ? 'Following' : 'All'}
                </button>
              ))}
            </div>

            {selectedTag && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
                <span>
                  Showing posts tagged <strong>{selectedTag}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleTagClick(selectedTag)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
                >
                  ✕ Clear filter
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-60 animate-pulse rounded-3xl bg-border" />
                ))}
              </div>
            ) : sortedPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
                {selectedTag ? (
                  <>
                    No posts found for <strong>{selectedTag}</strong>. Be the first to write one!
                  </>
                ) : (
                  'No blog posts found. Try a different search or filter.'
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedPosts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    liked={likedPosts.has(post.slug)}
                    likes={likeCounts[post.slug] ?? post.likes}
                    onToggleLike={handleLike}
                    selectedTag={selectedTag}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <h2 className="font-semibold text-foreground">Trending Hashtags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => {
                const isActive = selectedTag && normalizeTag(tag).replace(/^#/, '').toLowerCase() === selectedTag.replace(/^#/, '').toLowerCase()
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      isActive
                        ? 'border border-primary bg-primary text-primary-foreground'
                        : 'border border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
            <div className="rounded-3xl border border-border bg-background p-4 text-sm text-muted-foreground">
              Filter by a hashtag to see posts with the same vibe. Click any tag to update the view.
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
