'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePlaylist } from '@/contexts/playlist-context'
import { usePlayer } from '@/hooks/use-player'
import { SongCard } from '@/components/song-card'
import { Navigation } from '@/components/navigation'
import { CreatePlaylistDialog } from '@/components/playlists/create-playlist-dialog'
import { ListMusic, Plus, Trash2, Loader2 } from 'lucide-react'

export default function PlaylistPage() {
  const {
    quickPlaylist,
    namedPlaylists,
    deletePlaylist,
    removeSongFromPlaylist,
    removeFromQuickPlaylist,
    isLoading,
    isSaving,
  } = usePlaylist()
  const { playSong } = usePlayer()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <CreatePlaylistDialog open={showCreate} onOpenChange={setShowCreate} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading playlists...
          </div>
        ) : (
          <>
            <section className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ListMusic className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Quick Playlist</h2>
                    <p className="text-sm text-muted-foreground">
                      {quickPlaylist.songs.length} songs
                    </p>
                  </div>
                </div>
                {quickPlaylist.songs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => playSong(quickPlaylist.songs[0], quickPlaylist.songs)}
                    className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    ▶ Play All
                  </button>
                )}
              </div>

              {quickPlaylist.songs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border py-12 text-center">
                  <ListMusic className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Use ➕ on any song to add tracks here</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card">
                  {quickPlaylist.songs.map((song, index) => (
                    <div
                      key={song.id}
                      className={`flex items-center ${
                        index < quickPlaylist.songs.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <SongCard song={song} variant="list" showRank={index + 1} />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromQuickPlaylist(song.id)}
                        className="mr-3 rounded-full p-2 text-muted-foreground hover:text-red-500"
                        disabled={isSaving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">My Playlists</h2>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
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
                  <p className="mb-4 text-muted-foreground">
                    Create a playlist and add songs from any track menu
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Create your first playlist
                  </button>
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
                            <p className="text-xs text-muted-foreground">
                              {playlist.songs.length} songs
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {playlist.songs.length > 0 && (
                            <button
                              type="button"
                              onClick={() => playSong(playlist.songs[0], playlist.songs)}
                              className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                            >
                              ▶ Play
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deletePlaylist(playlist.id)}
                            className="rounded-full p-2 text-muted-foreground hover:text-red-500"
                            disabled={isSaving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {playlist.songs.length === 0 ? (
                        <div className="rounded-xl border border-border py-8 text-center text-sm text-muted-foreground">
                          Empty playlist — add songs via &quot;Add to playlist&quot; on any song
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-card">
                          {playlist.songs.map((song, index) => (
                            <div
                              key={song.id}
                              className={`flex items-center ${
                                index < playlist.songs.length - 1 ? 'border-b border-border' : ''
                              }`}
                            >
                              <div className="flex-1">
                                <SongCard song={song} variant="list" showRank={index + 1} />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                                className="mr-3 rounded-full p-2 text-muted-foreground hover:text-red-500"
                                disabled={isSaving}
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
            </section>

          </>
        )}
      </main>
    </div>
  )
}
