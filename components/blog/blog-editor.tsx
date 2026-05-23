'use client'

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Star, Upload, ImagePlus, Sparkles } from 'lucide-react'

const categories = [
  'Artist Interview',
  'Album Review',
  'Concert Review',
  'Music News',
  'Opinion',
  'Behind the Scenes',
]

function normalizeTag(value: string) {
  const cleaned = value.trim().replace(/^#/, '').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')
  return cleaned ? `#${cleaned.toLowerCase()}` : ''
}

export default function BlogEditor() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState(categories[0])
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [status, setStatus] = useState<'draft' | 'published'>('published')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Write your story, review, or behind-the-scenes notes...' })],
    content: '',
    editorProps: {
      attributes: {
        class:
          'min-h-[240px] w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none prose prose-sm prose-a:text-primary prose-img:rounded-lg prose-strong:text-foreground',
      },
    },
  })

  useEffect(() => {
    if (!window.localStorage.getItem('soundwave-blog-user')) {
      window.localStorage.setItem('soundwave-blog-user', JSON.stringify({ id: 'you', name: 'You' }))
    }
  }, [])

  const contentHtml = useMemo(() => editor?.getHTML() || '', [editor])
  const textContent = useMemo(() => editor?.getText() || '', [editor])
  const wordCount = useMemo(
    () => textContent.trim().split(/\s+/).filter(Boolean).length,
    [textContent],
  )
  const charCount = textContent.length

  const addTag = () => {
    const normalized = normalizeTag(tagInput)
    if (normalized && !tags.includes(normalized)) {
      setTags((current) => [...current, normalized])
    }
    setTagInput('')
  }

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      addTag()
    }
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCoverPreview(String(reader.result || ''))
      setCoverUrl(String(reader.result || ''))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (targetStatus: 'draft' | 'published') => {
    console.log('[BlogEditor] handleSubmit called', { targetStatus, title, category, rating })
    // Apply sensible defaults instead of blocking publish
    const safeTitle = title.trim() || 'Untitled'
    const safeRating = typeof rating === 'number' && rating >= 0 ? rating : 0
    const safeTags = Array.isArray(tags) ? tags : []
    setStatus(targetStatus)
    setSubmitting(true)
    setMessage('')
    const excerpt = textContent.trim().slice(0, 140)
    const body = {
      title: safeTitle,
      excerpt,
      coverImage: coverUrl || undefined,
      content: contentHtml || '',
      tags: safeTags,
      category,
      rating: safeRating,
      author: 'You',
      authorId: 'you',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      status: targetStatus,
    }
    console.log('[BlogEditor] sending POST /api/blog', body)

    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    console.log('[BlogEditor] fetch completed', { ok: response.ok, status: response.status })
    const result = await response.json()
    console.log('[BlogEditor] response json', result)
    setSubmitting(false)

    if (!response.ok || !result.success) {
      setMessage(result.error || 'Unable to save your post.')
      return
    }

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('soundwave:blog:created', { detail: result.data }))
      }
    } catch (e) {
      // ignore
    }

    router.push(`/blog/${result.data.slug}`)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Write a new blog</h1>
            <p className="text-sm text-muted-foreground">Publish reviews, interviews, and music stories from your perspective.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => handleSubmit('draft')} disabled={submitting}>
              Save Draft
            </Button>
            <Button size="sm" onClick={() => handleSubmit('published')} disabled={submitting}>
              Publish
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Title</label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="A headline that captures the story"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Body</label>
              <EditorContent editor={editor} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Cover image URL</label>
                <Input
                  value={coverUrl}
                  onChange={(event) => {
                    setCoverUrl(event.target.value)
                    setCoverPreview(event.target.value)
                  }}
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Upload cover</label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="w-full" asChild>
                    <label htmlFor="blog-cover-upload" className="flex w-full cursor-pointer items-center justify-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </label>
                  </Button>
                  <input
                    id="blog-cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>

            {coverPreview && (
              <div className="rounded-3xl overflow-hidden border border-border bg-muted">
                <img src={coverPreview} alt="Cover preview" className="h-56 w-full object-cover" />
              </div>
            )}
          </div>

          <aside className="space-y-6 rounded-3xl border border-border bg-background/50 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Star rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoveredRating || rating)
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className={
                        'rounded-full p-2 transition ' +
                        (active ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground')
                      }
                      aria-label={`Set ${star} stars`}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{hoveredRating || rating}/5 stars selected</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Hashtags</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type a tag and press Enter"
                />
                <Button variant="secondary" type="button" onClick={addTag} className="shrink-0">
                  Add
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="inline-flex items-center gap-2">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                      className="text-muted-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-3xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Post stats</span>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span>Words</span>
                  <strong>{wordCount}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Characters</span>
                  <strong>{charCount}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Status</span>
                  <strong>{status === 'draft' ? 'Draft' : 'Publish'}</strong>
                </div>
              </div>
            </div>

            {message && <p className="text-sm text-destructive">{message}</p>}
          </aside>
        </div>
      </section>
    </div>
  )
}
