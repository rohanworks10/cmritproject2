'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'

export interface MockArtist {
  id: string
  name: string
  bio: string
  verified: boolean
  genre: string
  image: string
}

interface ArtistCardProps {
  artist: MockArtist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group block rounded-xl bg-card p-4 transition-all duration-300 hover:bg-secondary"
    >
      <div className="relative mx-auto mb-4 aspect-square w-full max-w-40 overflow-hidden rounded-full">
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 160px"
        />
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <h3 className="truncate font-semibold text-foreground">{artist.name}</h3>
          {artist.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{artist.genre}</p>
      </div>
    </Link>
  )
}
