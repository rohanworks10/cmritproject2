'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { SongCard } from '@/components/song-card'
import { usePlaylist } from '@/contexts/playlist-context'
import { CreatePlaylistDialog } from '@/components/playlists/create-playlist-dialog'
import { getPlayHistory } from '@/lib/play-history-storage'
import { getSongById } from '@/data/mockData'
import { useEffect, useState } from 'react'
import { Library, ListMusic, Clock, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PlayerSong } from '@/hooks/use-player'

export default function LibraryPage() {
  const { namedPlaylists, quickPlaylist, isLoading } = usePlaylist()
  const [recentSongs, setRecentSongs] = useState<PlayerSong[]>([])
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    const load = () => {
      const ids = getPlayHistory()
      setRecentSongs(
        ids.map((id) => getSongById(id)).filter((s): s is PlayerSong => Boolean(s))
      )
    }
    load()
    window.addEventListener('play-history-changed', load)
    return () => window.removeEventListener('play-history-changed', load)
  }, [])

  const allPlaylists = [
    {
      id: quickPlaylist.id,
      name: quickPlaylist.name,
      songs: quickPlaylist.songs,
      cover: quickPlaylist.songs[0]?.cover,
    },
    ...namedPlaylists.map((p) => ({
      id: p.id,
      name: p.name,
      songs: p.songs,
      cover: p.songs[0]?.cover,
    })),
  ]

  return (
    <div className="min-h-screen pb-28">
      <Navigation />
      <CreatePlaylistDialog open={showCreate} onOpenChange={setShowCreate} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Library className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Your Library</h1>
                <p className="text-muted-foreground">Playlists and recently played</p>
              </div>
            </div>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-4 w-4" />
              Create Playlist
            </Button>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ListMusic className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your Playlists</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : allPlaylists.length === 0 ? (
            <p className="text-muted-foreground">No playlists yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {allPlaylists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href="/playlist"
                  className="group rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-secondary">
                    {playlist.cover ? (
                      <Image
                        src={playlist.cover}
                        alt={playlist.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="200px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ListMusic className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="truncate font-semibold text-foreground">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">{playlist.songs.length} songs</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Recently Played</h2>
          </div>
          {recentSongs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
              Play songs to see them here
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card">
              {recentSongs.map((song, index) => (
                <div
                  key={song.id}
                  className={index < recentSongs.length - 1 ? 'border-b border-border' : ''}
                >
                  <SongCard song={song} variant="list" />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
