'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { SongCard } from '@/components/song-card'
import { songs } from '@/data/mockData'
import { getLikedSongIds } from '@/lib/likes-storage'
import { Heart, Play, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LikedSongsPage() {
  const [likedIds, setLikedIds] = useState<string[]>([])

  useEffect(() => {
    const refresh = () => setLikedIds(getLikedSongIds())
    refresh()
    window.addEventListener('liked-songs-changed', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('liked-songs-changed', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const likedSongs = songs.filter((song) => likedIds.includes(song.id))

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/20 to-background">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
              <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/50 shadow-2xl sm:h-56 sm:w-56">
                <Heart className="h-24 w-24 fill-primary-foreground text-primary-foreground" />
              </div>
              <div className="space-y-4">
                <span className="text-sm font-medium text-muted-foreground">Playlist</span>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Liked Songs
                </h1>
                <p className="text-muted-foreground">
                  {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'} saved
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Play className="h-5 w-5 fill-current" />
                    Play All
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Shuffle className="h-5 w-5" />
                    Shuffle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {likedSongs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground">
              No liked songs yet. Tap the heart on any song card to save it here.
            </p>
          ) : (
            <div className="rounded-xl border border-border bg-card">
              {likedSongs.map((song, index) => (
                <div
                  key={song.id}
                  className={index < likedSongs.length - 1 ? 'border-b border-border' : ''}
                >
                  <SongCard song={song} variant="list" showRank={index + 1} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
