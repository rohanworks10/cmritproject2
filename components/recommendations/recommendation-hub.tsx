'use client'

import { useState } from 'react'
import { Sparkles, Users } from 'lucide-react'
import { useRecommendations } from '@/hooks/use-recommendations'
import { MoodSelector } from '@/components/recommendations/mood-selector'
import { RecommendationRow } from '@/components/recommendations/recommendation-row'
import { ArtistCard } from '@/components/artist-card'
import Link from 'next/link'

interface RecommendationHubProps {
  searchQuery?: string
}

export function RecommendationHub({ searchQuery }: RecommendationHubProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const { data, loading, moods } = useRecommendations(selectedMood)

  return (
    <section className="mb-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Discover</h2>
          </div>
        </div>
        <MoodSelector moods={moods} selected={selectedMood} onSelect={setSelectedMood} />
      </div>

      <RecommendationRow
        title="Recommended For You"
        subtitle="Based on your likes and listening history"
        songs={data?.recommendedForYou ?? []}
        loading={loading}
        searchQuery={searchQuery}
      />

      <RecommendationRow
        title="Because You Played"
        subtitle="Songs similar to your latest track"
        songs={data?.becauseYouPlayed ?? []}
        loading={loading}
        searchQuery={searchQuery}
        emptyMessage="Play a song to unlock this row"
      />

      {data?.recentlyPlayed && data.recentlyPlayed.length > 0 && (
        <RecommendationRow
          title="Recently Played"
          songs={data.recentlyPlayed}
          loading={loading}
          searchQuery={searchQuery}
        />
      )}

      <RecommendationRow
        title={selectedMood ? `${selectedMood} Mood Mix` : 'Mood Mix'}
        subtitle="Curated by vibe"
        songs={data?.moodMix ?? []}
        loading={loading}
        searchQuery={searchQuery}
      />

      <RecommendationRow
        title="Trending Now"
        subtitle="Most loved on Soundwave"
        songs={data?.trendingNow ?? []}
        loading={loading}
        searchQuery={searchQuery}
      />

      {data?.similarArtists && data.similarArtists.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">Similar Artists</h2>
              <p className="text-sm text-muted-foreground">Based on genres you listen to</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.similarArtists.map((artist) => (
              <Link key={artist.id} href={`/artist/${artist.id}`} className="block transition-transform hover:scale-105">
                <ArtistCard artist={artist} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
