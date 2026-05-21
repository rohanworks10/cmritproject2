export interface StoredNamedPlaylist {
  id: string
  name: string
  songIds: string[]
}

const NAMED_PLAYLISTS_KEY = 'soundwave-named-playlists'
const QUICK_PLAYLIST_KEY = 'soundwave-quick-playlist'

export function getNamedPlaylists(): StoredNamedPlaylist[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(NAMED_PLAYLISTS_KEY)
    return raw ? (JSON.parse(raw) as StoredNamedPlaylist[]) : []
  } catch {
    return []
  }
}

export function saveNamedPlaylists(playlists: StoredNamedPlaylist[]) {
  localStorage.setItem(NAMED_PLAYLISTS_KEY, JSON.stringify(playlists))
  window.dispatchEvent(new CustomEvent('playlists-changed'))
}

export function getQuickPlaylistIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(QUICK_PLAYLIST_KEY)
    if (raw) return JSON.parse(raw) as string[]

    // Migrate legacy key that stored full song objects
    const legacy = localStorage.getItem('userPlaylist')
    if (legacy) {
      const parsed = JSON.parse(legacy) as { id: string }[]
      const ids = parsed.map((s) => s.id).filter(Boolean)
      if (ids.length > 0) {
        saveQuickPlaylistIds(ids)
        localStorage.removeItem('userPlaylist')
        return ids
      }
    }
    return []
  } catch {
    return []
  }
}

export function saveQuickPlaylistIds(songIds: string[]) {
  localStorage.setItem(QUICK_PLAYLIST_KEY, JSON.stringify(songIds))
  window.dispatchEvent(new CustomEvent('playlists-changed'))
}
