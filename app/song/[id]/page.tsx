import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { PlayerBar } from '@/components/player-bar'
import { ReviewsSection } from '@/components/reviews-section'
import { SongCard } from '@/components/song-card'
import { trendingSongs, newReleases, reviews, formatPlays } from '@/lib/music-data'
import { Play, Heart, Share2, MoreHorizontal, Clock, Music, Disc3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SongPageProps {
  params: Promise<{ id: string }>
}

export default async function SongPage({ params }: SongPageProps) {
  const { id } = await params
  const allSongs = [...trendingSongs, ...newReleases]
  const song = allSongs.find((s) => s.id === id)

  if (!song) {
    notFound()
  }

  // Get related songs (same artist or similar)
  const relatedSongs = allSongs.filter((s) => s.id !== song.id).slice(0, 4)

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 h-[28rem] overflow-hidden">
            <Image
              src={song.coverUrl}
              alt={song.title}
              fill
              className="object-cover opacity-40 blur-3xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-end">
              <div className="relative aspect-square w-64 shrink-0 overflow-hidden rounded-xl shadow-2xl sm:w-72">
                <Image
                  src={song.coverUrl}
                  alt={song.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="288px"
                />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Single
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {song.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground md:justify-start">
                  <Link
                    href={`/artist/${song.artistId}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {song.artist}
                  </Link>
                  <span>•</span>
                  <span>{song.album}</span>
                  <span>•</span>
                  <span>{formatPlays(song.plays)} plays</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {song.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Disc3 className="h-4 w-4" />
                    {song.album}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="h-5 w-5 fill-current" />
                Play
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Heart className="h-5 w-5" />
                Save
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
          {/* Lyrics Section */}
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Lyrics</h2>
            </div>
            <div className="max-w-2xl rounded-xl border border-border bg-card p-6">
              <p className="whitespace-pre-line leading-relaxed text-secondary-foreground">
{`In the midnight hour, when the world goes quiet
I find myself lost in your eyes
Dancing through the shadows, feeling so alive
Every beat of my heart tells no lies

We&apos;re chasing dreams under starlit skies
Where the music plays and never dies
Hold my hand, let&apos;s take this ride
Into the night, side by side

The rhythm flows through every vein
Washing away all the pain
In this moment, we are free
Just you and me, meant to be...`}
              </p>
              <Button variant="ghost" className="mt-4 text-primary">
                Show full lyrics
              </Button>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="mb-12">
            <ReviewsSection reviews={reviews} songTitle={song.title} />
          </section>

          {/* Related Songs */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">You might also like</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {relatedSongs.map((relatedSong) => (
                <SongCard key={relatedSong.id} song={relatedSong} />
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
  const allSongs = [...trendingSongs, ...newReleases]
  return allSongs.map((song) => ({
    id: song.id,
  }))
}
