'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  fetchLocalRecommendations,
  MOODS,
} from '@/lib/recommendations/recommendationService'
import type { PlayerSong } from '@/hooks/use-player'
import type { artists } from '@/data/mockData'

type Artist = (typeof artists)[number]

export interface RecommendationBundle {
  recommendedForYou: PlayerSong[]
  becauseYouPlayed: PlayerSong[]
  similarArtists: Artist[]
  moodMix: PlayerSong[]
  recentlyPlayed: PlayerSong[]
  trendingNow: PlayerSong[]
}

export function useRecommendations(selectedMood: string | null = null) {
  const [data, setData] = useState<RecommendationBundle | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    const bundle = fetchLocalRecommendations(selectedMood)
    setData(bundle)
    setLoading(false)
  }, [selectedMood])

  useEffect(() => {
    refresh()

    const onUpdate = () => refresh()
    window.addEventListener('play-history-changed', onUpdate)
    window.addEventListener('liked-songs-changed', onUpdate)
    return () => {
      window.removeEventListener('play-history-changed', onUpdate)
      window.removeEventListener('liked-songs-changed', onUpdate)
    }
  }, [refresh])

  return { data, loading, refresh, moods: MOODS }
}
