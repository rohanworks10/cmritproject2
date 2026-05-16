'use client'

import { useCallback, useEffect, useState } from 'react'
import { getLikedSongIds, toggleLikedSong } from '@/lib/likes-storage'

export function useLikedSongs() {
  const [likedIds, setLikedIds] = useState<string[]>([])

  const refresh = useCallback(() => {
    setLikedIds(getLikedSongIds())
  }, [])

  useEffect(() => {
    refresh()
    const onChange = () => refresh()
    window.addEventListener('liked-songs-changed', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('liked-songs-changed', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [refresh])

  const isLiked = useCallback((songId: string) => likedIds.includes(songId), [likedIds])

  const toggleLike = useCallback(
    (songId: string) => {
      toggleLikedSong(songId)
      refresh()
    },
    [refresh]
  )

  return { likedIds, isLiked, toggleLike }
}
