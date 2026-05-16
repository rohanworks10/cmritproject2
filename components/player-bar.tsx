'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  ListMusic,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

export function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([75])
  const [progress, setProgress] = useState([35])
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

  // Mock current song
  const currentSong = {
    title: 'Midnight Dreams',
    artist: 'Luna Nova',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:h-24 sm:px-6 lg:px-8">
        {/* Current Song Info */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none sm:w-72">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16">
            <Image
              src={currentSong.coverUrl}
              alt={currentSong.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{currentSong.title}</p>
            <p className="truncate text-sm text-muted-foreground">{currentSong.artist}</p>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              'hidden shrink-0 rounded-full p-2 transition-colors sm:block',
              isLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={cn(
                'hidden rounded-full p-2 transition-colors sm:block',
                shuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground">
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 sm:h-12 sm:w-12"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Play className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
              )}
            </button>
            <button className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground">
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={cn(
                'hidden rounded-full p-2 transition-colors sm:block',
                repeat ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="hidden w-full max-w-md items-center gap-2 sm:flex">
            <span className="w-10 text-right text-xs text-muted-foreground">1:18</span>
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="w-10 text-xs text-muted-foreground">3:42</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="hidden items-center gap-2 sm:flex sm:w-48">
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground">
            <ListMusic className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {isMuted || volume[0] === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <Slider
            value={isMuted ? [0] : volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  )
}
