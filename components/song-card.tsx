'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react'
import { formatLikes } from '@/data/mockData'
import { usePlayer, type PlayerSong } from '@/hooks/use-player'
import { useLikedSongs } from '@/hooks/use-liked-songs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SongCardProps {
  song: PlayerSong
  variant?: 'default' | 'compact' | 'list'
  showRank?: number
}

function LikeButton({ song }: { song: PlayerSong }) {
  const { isLiked, toggleLike } = useLikedSongs()
  const liked = isLiked(song.id)
  const displayLikes = song.likes + (liked ? 1 : 0)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleLike(song.id)
      }}
      className="flex items-center gap-1.5 rounded-full p-2 transition-colors"
      aria-label={liked ? 'Unlike song' : 'Like song'}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-colors',
          liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-foreground'
        )}
      />
      <span className="text-sm text-muted-foreground">{formatLikes(displayLikes)}</span>
    </button>
  )
}

export function SongCard({ song, variant = 'default', showRank }: SongCardProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer()
  const [isHovered, setIsHovered] = useState(false)

  const isCurrentSong = currentSong?.id === song.id
  const showAsPlaying = isCurrentSong && isPlaying

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrentSong) {
      togglePlay()
    } else {
      playSong(song)
    }
  }

  const handleCardClick = () => {
    playSong(song)
  }

  const stopNav = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (variant === 'compact') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
          <Image src={song.cover} alt={song.title} fill className="object-cover" sizes="48px" />
        </div>
        <div className="min-w-0 flex-1" onClick={stopNav}>
          <Link href={`/song/${song.id}`} className="block truncate font-medium text-foreground hover:underline">
            {song.title}
          </Link>
          <Link
            href={`/artist/${song.artistId}`}
            className="block truncate text-sm text-muted-foreground hover:underline"
          >
            {song.artist}
          </Link>
        </div>
        <button
          type="button"
          onClick={handlePlay}
          className="rounded-full bg-primary p-2 text-primary-foreground transition-transform hover:scale-105"
        >
          {showAsPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </button>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
        className="group flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors hover:bg-secondary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showRank !== undefined && (
          <span className="w-6 text-center text-lg font-bold text-muted-foreground">{showRank}</span>
        )}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
          <Image src={song.cover} alt={song.title} fill className="object-cover" sizes="56px" />
          <button
            type="button"
            onClick={handlePlay}
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity',
              isHovered || isCurrentSong ? 'opacity-100' : 'opacity-0'
            )}
          >
            {showAsPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 fill-white text-white" />
            )}
          </button>
        </div>
        <div className="min-w-0 flex-1" onClick={stopNav}>
          <Link href={`/song/${song.id}`} className="hover:underline">
            <p className="truncate font-medium text-foreground">{song.title}</p>
          </Link>
          <Link href={`/artist/${song.artistId}`} className="hover:underline">
            <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
          </Link>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:block">{song.album}</span>
        <div onClick={stopNav}>
          <LikeButton song={song} />
        </div>
        <span className="w-12 text-right text-sm text-muted-foreground">{song.duration}</span>
        <div onClick={stopNav}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/artist/${song.artistId}`}>Go to artist</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      className="group relative cursor-pointer rounded-xl bg-card p-4 transition-all duration-300 hover:bg-secondary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
        <Image
          src={song.cover}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <button
          type="button"
          onClick={handlePlay}
          className={cn(
            'absolute bottom-3 right-3 rounded-full bg-primary p-3.5 text-primary-foreground shadow-xl transition-all duration-300',
            isHovered || isCurrentSong ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          )}
        >
          {showAsPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
        </button>
      </div>
      <div className="space-y-2" onClick={stopNav}>
        <Link href={`/song/${song.id}`} className="hover:underline">
          <h3 className="truncate font-semibold text-foreground">{song.title}</h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <Link href={`/artist/${song.artistId}`} className="min-w-0 hover:underline">
            <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
          </Link>
          <LikeButton song={song} />
        </div>
      </div>
    </div>
  )
}
