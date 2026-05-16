const LIKED_SONGS_KEY = 'soundwave-liked-songs'

export function getLikedSongIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LIKED_SONGS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function setLikedSongIds(ids: string[]) {
  localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent('liked-songs-changed'))
}

export function isSongLiked(songId: string): boolean {
  return getLikedSongIds().includes(songId)
}

export function toggleLikedSong(songId: string): boolean {
  const ids = getLikedSongIds()
  const liked = ids.includes(songId)
  const next = liked ? ids.filter((id) => id !== songId) : [...ids, songId]
  setLikedSongIds(next)
  return !liked
}
