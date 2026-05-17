import { Navigation } from '@/components/navigation'
import { SongCard } from '@/components/song-card'
import { ArtistCard } from '@/components/artist-card'
import { songs, artists } from '@/data/mockData'
import { TrendingUp, Sparkles, Users } from 'lucide-react'

export default function HomePage() {
  const trending = [...songs].sort((a, b) => b.likes - a.likes)
  const newReleases = songs.slice(0, 4)

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary to-card p-8 sm:p-12">
            <div className="relative z-10">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="text-balance">Discover Your</span>
                <br />
                <span className="text-primary">Sound</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground text-pretty">
                Stream millions of songs, discover new artists, and create the perfect playlist for every moment.
              </p>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        {/* Trending Songs */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
              <p className="text-sm text-muted-foreground">Most played tracks this week</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trending.slice(0, 5).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        {/* Top Charts */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Top Charts</h2>
              <p className="text-sm text-muted-foreground">This week&apos;s hottest tracks</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card">
            {trending.map((song, index) => (
              <div
                key={song.id}
                className={index < trending.length - 1 ? 'border-b border-border' : ''}
              >
                <SongCard song={song} variant="list" showRank={index + 1} />
              </div>
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">New Releases</h2>
              <p className="text-sm text-muted-foreground">Fresh tracks just for you</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {newReleases.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        {/* Popular Artists */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Popular Artists</h2>
              <p className="text-sm text-muted-foreground">Artists you might like</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
