'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function FollowButton({ artistId, artistName }: { artistId: string; artistName: string }) {
  const [followed, setFollowed] = useState(false)

  useEffect(() => {
    const list = JSON.parse(window.localStorage.getItem('soundwave-subscribed-authors') || '[]')
    setFollowed(Array.isArray(list) && list.includes(artistId))
  }, [artistId])

  const updateLocalSubscriptions = (nextFollowed: boolean) => {
    const current = JSON.parse(window.localStorage.getItem('soundwave-subscribed-authors') || '[]')
    const list = Array.isArray(current) ? current : []
    const next = nextFollowed ? [...new Set([...list, artistId])] : list.filter((id: string) => id !== artistId)
    window.localStorage.setItem('soundwave-subscribed-authors', JSON.stringify(next))
  }

  const handleToggle = async () => {
    try {
      const res = await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: artistId, subscriberId: 'you' }),
      })
      const data = await res.json()
      if (data?.success) {
        setFollowed(data.data.subscribed)
        updateLocalSubscriptions(data.data.subscribed)
      }
    } catch (err) {
      // ignore
    }
  }

  return (
    <Button size="lg" variant={followed ? 'secondary' : 'ghost'} className="gap-2" onClick={handleToggle}>
      <Heart className="h-5 w-5" />
      {followed ? 'Following' : `Follow`}
    </Button>
  )
}
