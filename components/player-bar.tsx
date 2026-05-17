'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
} from 'lucide-react'
import { formatPlayerTime, usePlayer } from '@/hooks/use-player'
import { useLikedSongs } from '@/hooks/use-liked-songs'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

export function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
  } = usePlayer()

  const { isLiked, toggleLike } = useLikedSongs()

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const volumePercent = Math.round((isMuted ? 0 : volume) * 100)

  const handleProgressChange = (value: number[]) => {
    if (duration <= 0) return
    seek((value[0] / 100) * duration)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:h-24 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:w-72 sm:flex-none">
          {currentSong ? (
            <>
              <Link
                href={`/song/${currentSong.id}`}
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16"
              >
                <Image
                  src={currentSong.cover}
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/song/${currentSong.id}`}
                  className="block truncate font-medium text-foreground hover:underline"
                >
                  {currentSong.title}
                </Link>
                <Link
                  href={`/artist/${currentSong.artistId}`}
                  className="block truncate text-sm text-muted-foreground hover:underline"
                >
                  {currentSong.artist}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => toggleLike(currentSong.id)}
                className={cn(
                  'hidden shrink-0 rounded-full p-2 transition-colors sm:block',
                  isLiked(currentSong.id)
                    ? 'text-red-500'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label={isLiked(currentSong.id) ? 'Unlike song' : 'Like song'}
              >
                <Heart
                  className={cn('h-5 w-5', isLiked(currentSong.id) && 'fill-red-500')}
                />
              </button>
            </>
          ) : (
            <p className="min-w-0 text-sm text-muted-foreground">Select a song to play</p>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={playPrevious}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Previous song"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 sm:h-12 sm:w-12"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Play className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
              )}
            </button>
            <button
              type="button"
              onClick={playNext}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Next song"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
          </div>

          <div className="hidden w-full max-w-md items-center gap-2 sm:flex">
            <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
              {formatPlayerTime(currentTime)}
            </span>
            <Slider
              value={[progressPercent]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              disabled={!currentSong || duration <= 0}
              className="flex-1"
              aria-label="Seek"
            />
            <span className="w-10 text-xs tabular-nums text-muted-foreground">
              {formatPlayerTime(duration)}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex sm:w-40">
          <button
            type="button"
            onClick={toggleMute}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <Slider
            value={[volumePercent]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-24"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  )
}
