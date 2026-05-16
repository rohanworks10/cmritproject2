import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { PlayerBar } from '@/components/player-bar'
import { SongCard } from '@/components/song-card'
import { artists, formatPlays } from '@/lib/music-data'
import { Play, Shuffle, Heart, Share2, MoreHorizontal, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArtistPageProps {
  params: Promise<{ id: string }>
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params
  const artist = artists.find((a) => a.id === id)

  if (!artist) {
    notFound()
  }

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 h-96 overflow-hidden">
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              className="object-cover opacity-30 blur-2xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
              <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full shadow-2xl ring-4 ring-primary/20 sm:h-56 sm:w-56">
                <Image
                  src={artist.imageUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="224px"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Verified Artist</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {artist.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {formatPlays(artist.monthlyListeners)} monthly listeners
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {artist.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="h-5 w-5 fill-current" />
                Play
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Shuffle className="h-5 w-5" />
                Shuffle
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-muted-foreground">
                <Heart className="h-5 w-5" />
                Follow
              </Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* About */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">About</h2>
            <div className="max-w-3xl rounded-xl border border-border bg-card p-6">
              <p className="leading-relaxed text-secondary-foreground">{artist.bio}</p>
            </div>
          </section>

          {/* Popular Songs */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Popular</h2>
            <div className="rounded-xl border border-border bg-card">
              {artist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className={index < artist.songs.length - 1 ? 'border-b border-border' : ''}
                >
                  <SongCard song={song} variant="list" showRank={index + 1} />
                </div>
              ))}
            </div>
          </section>

          {/* Discography */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">Discography</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {artist.songs.slice(0, 5).map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <PlayerBar />
    </div>
  )
}

export function generateStaticParams() {
  return artists.map((artist) => ({
    id: artist.id,
  }))
}
