import { Navigation } from '@/components/navigation'
import { SearchBar } from '@/components/search-bar'
import { SongCard } from '@/components/song-card'
import { ArtistCard } from '@/components/artist-card'
import { songs, artists } from '@/data/mockData'
import { Search, TrendingUp, Users, Music } from 'lucide-react'

export default function SearchPage() {
  const genres = [
    { name: 'Pop', color: 'from-pink-500 to-rose-500' },
    { name: 'Hip Hop', color: 'from-amber-500 to-orange-500' },
    { name: 'Rock', color: 'from-red-500 to-red-700' },
    { name: 'Electronic', color: 'from-cyan-500 to-blue-500' },
    { name: 'R&B', color: 'from-purple-500 to-violet-500' },
    { name: 'Jazz', color: 'from-yellow-500 to-amber-500' },
    { name: 'Classical', color: 'from-emerald-500 to-green-600' },
    { name: 'Country', color: 'from-orange-400 to-amber-600' },
  ]

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Header */}
        <section className="mb-12 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Search</h1>
          <p className="mb-8 text-muted-foreground">Find your favorite songs, artists, and albums</p>
          <div className="mx-auto max-w-xl">
            <SearchBar />
          </div>
        </section>

        {/* Browse Genres */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Browse Genres</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {genres.map((genre) => (
              <button
                key={genre.name}
                className={`group relative h-28 overflow-hidden rounded-xl bg-gradient-to-br ${genre.color} p-4 text-left transition-transform hover:scale-[1.02]`}
              >
                <span className="text-lg font-bold text-white">{genre.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Trending Searches */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Trending Searches</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {([...songs].sort((a,b)=>b.likes-a.likes)).slice(0, 5).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        {/* Popular Artists */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Popular Artists</h2>
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
