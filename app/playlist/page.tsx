'use client'

import { useState } from 'react'
import { usePlayer } from '@/hooks/use-player'
import { SongCard } from '@/components/song-card'
import { Navigation } from '@/components/navigation'
import { ListMusic, Plus, Trash2, X } from 'lucide-react'

export default function PlaylistPage() {
  const {
    userPlaylist,
    removeFromPlaylist,
    playSong,
    namedPlaylists,
    createNamedPlaylist,
    deleteNamedPlaylist,
    removeFromNamedPlaylist,
  } = usePlayer()

  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    if (!newName.trim()) return
    createNamedPlaylist(newName.trim())
    setNewName('')
    setShowModal(false)
  }

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      {/* Create Playlist Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Create Playlist</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Playlist name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="mb-4 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Quick Playlist */}
        <div className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ListMusic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Quick Playlist</h2>
                <p className="text-sm text-muted-foreground">{userPlaylist.length} songs</p>
              </div>
            </div>
            {userPlaylist.length > 0 && (
              <button
                onClick={() => playSong(userPlaylist[0])}
                className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                ▶ Play All
              </button>
            )}
          </div>

          {userPlaylist.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border py-12 text-center">
              <ListMusic className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Click ➕ on any song to add it here</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card">
              {userPlaylist.map((song, index) => (
                <div
                  key={song.id}
                  className={`flex items-center ${index < userPlaylist.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="flex-1">
                    <SongCard song={song} variant="list" showRank={index + 1} />
                  </div>
                  <button
                    onClick={() => removeFromPlaylist(song.id)}
                    className="mr-3 rounded-full p-2 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Named Playlists */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">My Playlists</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create Playlist
            </button>
          </div>

          {namedPlaylists.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border py-12 text-center">
              <Plus className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No playlists yet</h3>
              <p className="text-muted-foreground">Click "Create Playlist" to make your first one</p>
            </div>
          ) : (
            <div className="space-y-8">
              {namedPlaylists.map((playlist) => (
                <div key={playlist.id}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <ListMusic className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{playlist.name}</h3>
                        <p className="text-xs text-muted-foreground">{playlist.songs.length} songs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {playlist.songs.length > 0 && (
                        <button
                          onClick={() => playSong(playlist.songs[0])}
                          className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                        >
                          ▶ Play
                        </button>
                      )}
                      <button
                        onClick={() => deleteNamedPlaylist(playlist.id)}
                        className="rounded-full p-2 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {playlist.songs.length === 0 ? (
                    <div className="rounded-xl border border-border py-8 text-center text-sm text-muted-foreground">
                      No songs yet — add songs using the ··· menu
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border bg-card">
                      {playlist.songs.map((song, index) => (
                        <div
                          key={song.id}
                          className={`flex items-center ${index < playlist.songs.length - 1 ? 'border-b border-border' : ''}`}
                        >
                          <div className="flex-1">
                            <SongCard song={song} variant="list" showRank={index + 1} />
                          </div>
                          <button
                            onClick={() => removeFromNamedPlaylist(playlist.id, song.id)}
                            className="mr-3 rounded-full p-2 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}