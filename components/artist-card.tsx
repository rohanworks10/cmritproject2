'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Artist, formatPlays } from '@/lib/music-data'

interface ArtistCardProps {
  artist: Artist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group block rounded-xl bg-card p-4 transition-all duration-300 hover:bg-secondary"
    >
      <div className="relative mx-auto mb-4 aspect-square w-full max-w-40 overflow-hidden rounded-full">
        <Image
          src={artist.imageUrl}
          alt={artist.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 160px"
        />
      </div>
      <div className="text-center">
        <h3 className="truncate font-semibold text-foreground">{artist.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatPlays(artist.monthlyListeners)} monthly listeners
        </p>
      </div>
    </Link>
  )
}
