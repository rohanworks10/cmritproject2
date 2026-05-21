'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { songs } from '@/data/mockData'
import {
  addSongToPlaylist as addSongService,
  createPlaylist as createPlaylistService,
  deletePlaylist as deletePlaylistService,
  loadAllPlaylists,
  removeSongFromPlaylist as removeSongService,
} from '@/lib/playlist/playlistService'

export type PlaylistSong = (typeof songs)[number]

export interface UserPlaylist {
  id: string
  name: string
  songIds: string[]
  songs: PlaylistSong[]
  createdAt?: number
}

interface PlaylistContextValue {
  namedPlaylists: UserPlaylist[]
  quickPlaylist: UserPlaylist
  isLoading: boolean
  isSaving: boolean
  refreshPlaylists: () => void
  createPlaylist: (name: string) => Promise<UserPlaylist | null>
  deletePlaylist: (playlistId: string) => void
  addSongToPlaylist: (playlistId: string, song: PlaylistSong) => boolean
  removeSongFromPlaylist: (playlistId: string, songId: string) => void
  addToQuickPlaylist: (song: PlaylistSong) => boolean
  removeFromQuickPlaylist: (songId: string) => void
  getPlaylistById: (id: string) => UserPlaylist | undefined
}

const PlaylistContext = createContext<PlaylistContextValue | null>(null)

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [namedPlaylists, setNamedPlaylists] = useState<UserPlaylist[]>([])
  const [quickPlaylist, setQuickPlaylist] = useState<UserPlaylist>({
    id: 'quick',
    name: 'Quick Playlist',
    songIds: [],
    songs: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const syncFromStorage = useCallback(() => {
    const data = loadAllPlaylists()
    setNamedPlaylists(data.namedPlaylists)
    setQuickPlaylist(data.quickPlaylist)
  }, [])

  useEffect(() => {
    syncFromStorage()
    setIsLoading(false)

    const onChange = () => syncFromStorage()
    window.addEventListener('playlists-changed', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('playlists-changed', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [syncFromStorage])

  const createPlaylist = useCallback(
    async (name: string): Promise<UserPlaylist | null> => {
      setIsSaving(true)
      try {
        const result = createPlaylistService(name)
        if (!result.ok) {
          toast.error(result.error || 'Could not create playlist')
          return null
        }
        syncFromStorage()
        toast.success(`Created "${result.playlist.name}"`)
        return {
          ...result.playlist,
          songs: [],
        }
      } finally {
        setIsSaving(false)
      }
    },
    [syncFromStorage]
  )

  const deletePlaylist = useCallback(
    (playlistId: string) => {
      setIsSaving(true)
      deletePlaylistService(playlistId)
      syncFromStorage()
      toast.success('Playlist deleted')
      setIsSaving(false)
    },
    [syncFromStorage]
  )

  const addSongToPlaylist = useCallback(
    (playlistId: string, song: PlaylistSong) => {
      const result = addSongService(playlistId, song.id)
      if (!result.ok) {
        toast.info(result.error || 'Could not add song')
        return false
      }
      syncFromStorage()
      const playlist = loadAllPlaylists().namedPlaylists.find((p) => p.id === playlistId)
      const name =
        playlistId === 'quick' ? 'Quick Playlist' : playlist?.name || 'playlist'
      toast.success(`Added to "${name}"`)
      return true
    },
    [syncFromStorage]
  )

  const removeSongFromPlaylist = useCallback(
    (playlistId: string, songId: string) => {
      removeSongService(playlistId, songId)
      syncFromStorage()
      toast.success('Removed from playlist')
    },
    [syncFromStorage]
  )

  const addToQuickPlaylist = useCallback(
    (song: PlaylistSong) => addSongToPlaylist('quick', song),
    [addSongToPlaylist]
  )

  const removeFromQuickPlaylist = useCallback(
    (songId: string) => removeSongFromPlaylist('quick', songId),
    [removeSongFromPlaylist]
  )

  const getPlaylistById = useCallback(
    (id: string) => {
      if (id === 'quick') return quickPlaylist
      return namedPlaylists.find((p) => p.id === id)
    },
    [namedPlaylists, quickPlaylist]
  )

  const value = useMemo(
    () => ({
      namedPlaylists,
      quickPlaylist,
      isLoading,
      isSaving,
      refreshPlaylists: syncFromStorage,
      createPlaylist,
      deletePlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      addToQuickPlaylist,
      removeFromQuickPlaylist,
      getPlaylistById,
    }),
    [
      namedPlaylists,
      quickPlaylist,
      isLoading,
      isSaving,
      syncFromStorage,
      createPlaylist,
      deletePlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      addToQuickPlaylist,
      removeFromQuickPlaylist,
      getPlaylistById,
    ]
  )

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}

export function usePlaylist() {
  const ctx = useContext(PlaylistContext)
  if (!ctx) throw new Error('usePlaylist must be used within PlaylistProvider')
  return ctx
}
