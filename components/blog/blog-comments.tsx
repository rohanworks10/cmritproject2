'use client'

import { useEffect, useMemo, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Heart, MessageCircle, CornerUpLeft, Trash2 } from 'lucide-react'
import type { BlogComment } from '@/lib/blog-storage'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export default function BlogComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [text, setText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likedComments, setLikedComments] = useState<string[]>([])

  const fetchComments = async () => {
    setLoading(true)
    const response = await fetch(`/api/blog/${slug}/comments`)
    const result = await response.json()
    setLoading(false)
    if (result.success) {
      setComments(result.data)
    }
  }

  useEffect(() => {
    const storedLikes = JSON.parse(window.localStorage.getItem('soundwave-liked-comments') || '[]')
    if (Array.isArray(storedLikes)) setLikedComments(storedLikes)
    fetchComments()
  }, [slug])

  const saveLikedComments = (next: string[]) => {
    window.localStorage.setItem('soundwave-liked-comments', JSON.stringify(next))
    setLikedComments(next)
  }

  const handlePost = async (parentId?: string) => {
    const bodyText = parentId ? replyText.trim() : text.trim()
    if (!bodyText) return
    setError('')

    const response = await fetch(`/api/blog/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: bodyText,
        parentId,
        userId: 'you',
        userName: 'You',
      }),
    })
    const result = await response.json()
    if (result.success) {
      setComments((current) => [result.data, ...current])
      if (parentId) {
        setReplyTo(null)
        setReplyText('')
      } else {
        setText('')
      }
    } else {
      setError(result.error || 'Unable to post comment')
    }
  }

  const handleToggleCommentLike = async (commentId: string) => {
    const isLiked = likedComments.includes(commentId)
    const response = await fetch(`/api/blog/${slug}/comments/${commentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLiked }),
    })
    const result = await response.json()
    if (!result.success) return

    setComments((current) =>
      current.map((comment) =>
        comment.id === commentId ? { ...comment, likes: result.data.likes } : comment,
      ),
    )
    saveLikedComments(isLiked ? likedComments.filter((id) => id !== commentId) : [...likedComments, commentId])
  }

  const handleDelete = async (commentId: string, userName: string) => {
    const response = await fetch(`/api/blog/${slug}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName }),
    })
    const result = await response.json()
    if (result.success) {
      setComments((current) => current.filter((comment) => comment.id !== commentId && comment.parentId !== commentId))
    }
  }

  const topLevelComments = useMemo(
    () => comments.filter((comment) => !comment.parentId),
    [comments],
  )

  if (loading) {
    return (
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Comments</h2>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-3xl bg-border" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="text-sm text-muted-foreground">Join the conversation and reply to the latest posts.</p>
        </div>

        <div className="flex gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{text.trim().split(/\s+/).filter(Boolean).length} words</span>
              <Button onClick={() => handlePost()} disabled={!text.trim()}>Post Comment</Button>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {topLevelComments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to share your thoughts.
          </div>
        ) : (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <div key={comment.id} className="rounded-3xl border border-border bg-background p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{comment.userName}</span>
                      <span>{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="whitespace-pre-line text-sm text-foreground">{comment.text}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <button type="button" className="inline-flex items-center gap-2" onClick={() => handleToggleCommentLike(comment.id)}>
                        <Heart className={`h-4 w-4 ${likedComments.includes(comment.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        {comment.likes}
                      </button>
                      <button type="button" className="inline-flex items-center gap-2" onClick={() => setReplyTo(comment.id)}>
                        <CornerUpLeft className="h-4 w-4" /> Reply
                      </button>
                      {comment.userName === 'You' && (
                        <button type="button" className="inline-flex items-center gap-2 text-destructive" onClick={() => handleDelete(comment.id, comment.userName)}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      )}
                    </div>
                    {replyTo === comment.id && (
                      <div className="rounded-3xl border border-border bg-card p-4">
                        <Textarea
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          placeholder={`Reply to ${comment.userName}`}
                          rows={3}
                        />
                        <div className="mt-3 flex justify-end gap-2">
                          <Button variant="outline" onClick={() => { setReplyTo(null); setReplyText('') }}>Cancel</Button>
                          <Button onClick={() => handlePost(comment.id)} disabled={!replyText.trim()}>Post Reply</Button>
                        </div>
                      </div>
                    )}
                    {comments.some((reply) => reply.parentId === comment.id) && (
                      <div className="mt-4 space-y-4 border-l border-border pl-4">
                        {comments.filter((reply) => reply.parentId === comment.id).map((reply) => (
                          <div key={reply.id} className="rounded-3xl border border-border bg-background p-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">{reply.userName}</span>
                              <span>{new Date(reply.date).toLocaleDateString()}</span>
                            </div>
                            <p className="mt-2 text-sm text-foreground">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
