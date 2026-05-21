import { getLikedSongIds } from '@/lib/likes-storage'
import { getPlayHistory } from '@/lib/play-history-storage'
import { getAllRecommendations, MOODS } from './recommendationEngine'

export { MOODS }

export function fetchLocalRecommendations(selectedMood = null) {
  const likedIds = typeof window !== 'undefined' ? getLikedSongIds() : []
  const recentIds = typeof window !== 'undefined' ? getPlayHistory() : []

  return getAllRecommendations({
    likedIds,
    recentIds,
    selectedMood,
  })
}
