import { Navigation } from '@/components/navigation'
import { SongCard } from '@/components/song-card'
import { songs } from '@/data/mockData'
import { Library, ListMusic, Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LibraryPage() {
  const playlists = [
    { name: 'Chill Vibes', songCount: 24, image: songs[0].cover },
    { name: 'Workout Mix', songCount: 18, image: songs[2].cover },
    { name: 'Late Night Jams', songCount: 32, image: songs[4].cover },
    { name: 'Road Trip', songCount: 45, image: songs[5].cover },
  ]

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Library className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Your Library</h1>
                <p className="text-muted-foreground">Your personal music collection</p>
              </div>
            </div>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Create Playlist
            </Button>
          </div>
        </section>

        {/* Playlists */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ListMusic className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your Playlists</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {playlists.map((playlist) => (
              <button
                key={playlist.name}
                className="group rounded-xl bg-card p-4 text-left transition-all hover:bg-secondary"
              >
                <div
                  className="mb-4 aspect-square w-full rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${playlist.image})` }}
                />
                <h3 className="truncate font-semibold text-foreground">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground">{playlist.songCount} songs</p>
              </button>
            ))}
          </div>
        </section>

        {/* Recently Played */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Recently Played</h2>
          </div>
          <div className="rounded-xl border border-border bg-card">
            {songs.slice(0, 6).map((song, index, arr) => (
              <div key={song.id} className={index < arr.length - 1 ? 'border-b border-border' : ''}>
                <SongCard song={song} variant="list" />
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  )
}
