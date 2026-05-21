'use client'

import { useEffect, useState } from 'react'
import { ListMusic, Loader2, Plus } from 'lucide-react'
import { usePlaylist } from '@/contexts/playlist-context'
import type { PlaylistSong } from '@/contexts/playlist-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreatePlaylistDialog } from '@/components/playlists/create-playlist-dialog'
import { cn } from '@/lib/utils'

interface AddToPlaylistDialogProps {
  song: PlaylistSong | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddToPlaylistDialog({ song, open, onOpenChange }: AddToPlaylistDialogProps) {
  const {
    namedPlaylists,
    quickPlaylist,
    isLoading,
    addSongToPlaylist,
    addToQuickPlaylist,
  } = usePlaylist()
  const [showCreate, setShowCreate] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) setAddingId(null)
  }, [open, namedPlaylists, quickPlaylist])

  if (!song) return null

  const handleAdd = (playlistId: string) => {
    setAddingId(playlistId)
    if (playlistId === 'quick') {
      addToQuickPlaylist(song)
    } else {
      addSongToPlaylist(playlistId, song)
    }
    setAddingId(null)
  }

  const allPlaylists = [
    { id: 'quick', name: quickPlaylist.name, songs: quickPlaylist.songs },
    ...namedPlaylists,
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to playlist</DialogTitle>
            <DialogDescription className="truncate">
              {song.title} · {song.artist}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
              {allPlaylists.map((playlist) => {
                const alreadyIn = playlist.songs.some((s) => s.id === song.id)
                return (
                  <button
                    key={playlist.id}
                    type="button"
                    disabled={alreadyIn || addingId === playlist.id}
                    onClick={() => handleAdd(playlist.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                      alreadyIn
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-secondary'
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <ListMusic className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{playlist.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {playlist.songs.length} songs
                        {alreadyIn ? ' · Already added' : ''}
                      </p>
                    </div>
                    {addingId === playlist.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </button>
                )
              })}

              {namedPlaylists.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No custom playlists yet. Create one below.
                </p>
              )}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-4 w-4" />
            New playlist
          </Button>
        </DialogContent>
      </Dialog>

      <CreatePlaylistDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={() => setShowCreate(false)}
      />
    </>
  )
}
