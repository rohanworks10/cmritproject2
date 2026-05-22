"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { Navigation } from '@/components/navigation'
import { SongCard } from '@/components/song-card'
import { ArtistCard } from '@/components/artist-card'
import { RecommendedSection } from '@/components/recommended-section'
import { songs, artists } from '@/data/mockData'
import { TrendingUp, Sparkles, Users, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const searchQuery = search.trim().toLowerCase()

  const searchMatches = (song: { title: string; artist: string }) =>
    song.title.toLowerCase().includes(searchQuery) ||
    song.artist.toLowerCase().includes(searchQuery)

  const trending = useMemo(
    () => [...songs].sort((a, b) => b.likes - a.likes).filter(searchMatches),
    [searchQuery]
  )

  const newReleases = useMemo(
    () => songs.filter(searchMatches).slice(0, 4),
    [searchQuery]
  )

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
              <div className="mt-8 max-w-xl rounded-2xl bg-slate-950/90 p-3 shadow-xl shadow-black/20 ring-1 ring-white/10">
                <div className="relative flex items-center">
                  <Search className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search songs, artists, albums..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (!search.trim()) return
                        setIsSearching(true)
                        router.push(`/search?q=${encodeURIComponent(search.trim())}`)
                      }
                    }}
                    className="w-full rounded-full border border-white/10 bg-slate-900/95 px-12 py-3 text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {search && !isSearching && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-muted-foreground transition hover:bg-white/20"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {isSearching && (
                    <div className="absolute right-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-muted-foreground">
                      <Spinner className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        <RecommendedSection searchQuery={searchQuery} />

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
          {trending.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {trending.slice(0, 5).map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}
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
          {trending.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
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
          )}
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
          {newReleases.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {newReleases.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}
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
