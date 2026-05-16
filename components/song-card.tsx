'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react'
import { Song, formatPlays } from '@/lib/music-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SongCardProps {
  song: Song
  variant?: 'default' | 'compact' | 'list'
  showRank?: number
}

export function SongCard({ song, variant = 'default', showRank }: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{song.title}</p>
          <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="rounded-full bg-primary p-2 text-primary-foreground transition-transform hover:scale-105"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </button>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div
        className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-secondary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showRank !== undefined && (
          <span className="w-6 text-center text-lg font-bold text-muted-foreground">
            {showRank}
          </span>
        )}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="object-cover"
            sizes="56px"
          />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity',
              isHovered || isPlaying ? 'opacity-100' : 'opacity-0'
            )}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 fill-white text-white" />
            )}
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/song/${song.id}`} className="hover:underline">
            <p className="truncate font-medium text-foreground">{song.title}</p>
          </Link>
          <Link href={`/artist/${song.artistId}`} className="hover:underline">
            <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
          </Link>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:block">{song.album}</span>
        <span className="w-20 text-right text-sm text-muted-foreground">
          {formatPlays(song.plays)}
        </span>
        <span className="w-12 text-right text-sm text-muted-foreground">{song.duration}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              'rounded-full p-2 transition-colors',
              isLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Add to playlist</DropdownMenuItem>
              <DropdownMenuItem>Add to queue</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Go to artist</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group relative rounded-xl bg-card p-4 transition-all duration-300 hover:bg-secondary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
        <Image
          src={song.coverUrl}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            'absolute bottom-3 right-3 rounded-full bg-primary p-3.5 text-primary-foreground shadow-xl transition-all duration-300',
            isHovered || isPlaying
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0'
          )}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 fill-current" />
          )}
        </button>
      </div>
      <div className="space-y-1">
        <Link href={`/song/${song.id}`} className="hover:underline">
          <h3 className="truncate font-semibold text-foreground">{song.title}</h3>
        </Link>
        <Link href={`/artist/${song.artistId}`} className="hover:underline">
          <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
        </Link>
      </div>
    </div>
  )
}
