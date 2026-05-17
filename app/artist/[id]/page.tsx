import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { SongCard } from '@/components/song-card'
import { artists, getArtistById, getSongsByArtistId } from '@/data/mockData'
import { Play, Shuffle, Heart, Share2, MoreHorizontal, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArtistPageProps {
  params: Promise<{ id: string }>
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params
  const artist = getArtistById(id)

  if (!artist) {
    notFound()
  }

  const artistSongs = getSongsByArtistId(id)

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <main>
        <section className="relative">
          <div className="absolute inset-0 h-96 overflow-hidden">
            <Image
              src={artist.image}
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
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="224px"
                />
              </div>
              <div className="space-y-4">
                {artist.verified && (
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Verified Artist</span>
                  </div>
                )}
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {artist.name}
                </h1>
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                  {artist.genre}
                </span>
              </div>
            </div>

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

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">About</h2>
            <div className="max-w-3xl rounded-xl border border-border bg-card p-6">
              <p className="leading-relaxed text-secondary-foreground">{artist.bio}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">Popular</h2>
            {artistSongs.length > 0 ? (
              <div className="rounded-xl border border-border bg-card">
                {artistSongs.map((song, index) => (
                  <div
                    key={song.id}
                    className={index < artistSongs.length - 1 ? 'border-b border-border' : ''}
                  >
                    <SongCard song={song} variant="list" showRank={index + 1} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No songs available for this artist.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return artists.map((artist) => ({
    id: artist.id,
  }))
}
