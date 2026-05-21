import { songs } from '@/data/mockData'

const NAMED_PLAYLISTS_KEY = 'soundwave-named-playlists'
const QUICK_PLAYLIST_KEY = 'soundwave-quick-playlist'

export function resolveSongsFromIds(songIds) {
  return songIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean)
}

function readNamedRaw() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(NAMED_PLAYLISTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeNamedRaw(playlists) {
  localStorage.setItem(NAMED_PLAYLISTS_KEY, JSON.stringify(playlists))
  window.dispatchEvent(new CustomEvent('playlists-changed', { detail: playlists }))
}

export function getQuickPlaylistIds() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(QUICK_PLAYLIST_KEY)
    if (raw) return JSON.parse(raw)

    const legacy = localStorage.getItem('userPlaylist')
    if (legacy) {
      const parsed = JSON.parse(legacy)
      const ids = parsed.map((s) => (typeof s === 'string' ? s : s.id)).filter(Boolean)
      if (ids.length > 0) {
        localStorage.setItem(QUICK_PLAYLIST_KEY, JSON.stringify(ids))
        localStorage.removeItem('userPlaylist')
        return ids
      }
    }
    return []
  } catch {
    return []
  }
}

export function saveQuickPlaylistIds(ids) {
  localStorage.setItem(QUICK_PLAYLIST_KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent('playlists-changed'))
}

export function loadAllPlaylists() {
  const named = readNamedRaw()
  const quickIds = getQuickPlaylistIds()
  return {
    namedPlaylists: named.map((p) => ({
      id: p.id,
      name: p.name,
      songIds: p.songIds || [],
      songs: resolveSongsFromIds(p.songIds || []),
      createdAt: p.createdAt || Date.now(),
    })),
    quickPlaylist: {
      id: 'quick',
      name: 'Quick Playlist',
      songIds: quickIds,
      songs: resolveSongsFromIds(quickIds),
    },
  }
}

export function playlistNameExists(name, excludeId = null) {
  const normalized = name.trim().toLowerCase()
  if (!normalized) return false
  const { namedPlaylists } = loadAllPlaylists()
  return namedPlaylists.some(
    (p) => p.id !== excludeId && p.name.trim().toLowerCase() === normalized
  )
}

export function createPlaylist(name) {
  const trimmed = name.trim()
  if (!trimmed) {
    return { ok: false, error: 'Playlist name is required' }
  }
  if (playlistNameExists(trimmed)) {
    return { ok: false, error: 'A playlist with this name already exists' }
  }

  const stored = readNamedRaw()
  const newPlaylist = {
    id: `playlist-${Date.now()}`,
    name: trimmed,
    songIds: [],
    createdAt: Date.now(),
  }
  const updated = [...stored, newPlaylist]
  writeNamedRaw(updated)

  return {
    ok: true,
    playlist: {
      ...newPlaylist,
      songs: [],
    },
  }
}

export function deletePlaylist(playlistId) {
  const stored = readNamedRaw()
  const updated = stored.filter((p) => p.id !== playlistId)
  writeNamedRaw(updated)
  return { ok: true }
}

export function addSongToPlaylist(playlistId, songId) {
  if (playlistId === 'quick') {
    const ids = getQuickPlaylistIds()
    if (ids.includes(songId)) {
      return { ok: false, error: 'Song already in Quick Playlist' }
    }
    saveQuickPlaylistIds([...ids, songId])
    return { ok: true }
  }

  const stored = readNamedRaw()
  const playlist = stored.find((p) => p.id === playlistId)
  if (!playlist) return { ok: false, error: 'Playlist not found' }
  if (playlist.songIds.includes(songId)) {
    return { ok: false, error: 'Song already in playlist' }
  }

  const updated = stored.map((p) =>
    p.id === playlistId ? { ...p, songIds: [...p.songIds, songId] } : p
  )
  writeNamedRaw(updated)
  return { ok: true }
}

export function removeSongFromPlaylist(playlistId, songId) {
  if (playlistId === 'quick') {
    saveQuickPlaylistIds(getQuickPlaylistIds().filter((id) => id !== songId))
    return { ok: true }
  }

  const stored = readNamedRaw()
  const updated = stored.map((p) =>
    p.id === playlistId ? { ...p, songIds: p.songIds.filter((id) => id !== songId) } : p
  )
  writeNamedRaw(updated)
  return { ok: true }
}
