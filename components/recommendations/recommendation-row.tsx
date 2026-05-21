'use client'

import { SongCard } from '@/components/song-card'
import type { PlayerSong } from '@/hooks/use-player'
import { Skeleton } from '@/components/ui/skeleton'

interface RecommendationRowProps {
  title: string
  subtitle?: string
  songs: PlayerSong[]
  loading?: boolean
  emptyMessage?: string
}

export function RecommendationRow({
  title,
  subtitle,
  songs,
  loading,
  emptyMessage = 'Nothing here yet — play or like songs to personalize',
}: RecommendationRowProps) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      {loading ? (
        <div className="flex gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex-1 min-w-0">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex gap-4">
          {songs.slice(0, 2).map((song) => (
            <div key={song.id} className="flex-1 min-w-0">
              <SongCard song={song} variant="compact" />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
