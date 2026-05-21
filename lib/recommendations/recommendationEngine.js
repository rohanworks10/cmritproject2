import { songs, artists } from '@/data/mockData'

export const MOODS = [
  'Happy',
  'Sad',
  'Workout',
  'Chill',
  'Party',
  'Romantic',
  'Focus',
]

function parseDuration(duration) {
  const [m, s] = duration.split(':').map(Number)
  return (m || 0) * 60 + (s || 0)
}

function getArtistGenre(artistId) {
  return artists.find((a) => a.id === artistId)?.genre || 'Unknown'
}

function scoreSong(song, context) {
  const {
    likedIds = [],
    recentIds = [],
    recentArtistIds = [],
    preferredMoods = [],
    preferredGenres = [],
    excludeIds = [],
  } = context

  if (excludeIds.includes(song.id)) return -1

  let score = 0

  if (likedIds.includes(song.id)) score -= 50

  const songMoods = song.moods || []
  const songTags = song.tags || []
  const genre = song.genre || getArtistGenre(song.artistId)

  preferredMoods.forEach((m) => {
    if (songMoods.includes(m)) score += 12
  })

  preferredGenres.forEach((g) => {
    if (genre === g) score += 10
  })

  if (recentArtistIds.includes(song.artistId)) score += 18

  recentIds.forEach((id, index) => {
    const recent = songs.find((s) => s.id === id)
    if (!recent) return
    if (recent.artistId === song.artistId) score += 14 - index
    if (recent.genre === genre) score += 6 - index * 0.5
    const overlap = (recent.moods || []).filter((m) => songMoods.includes(m))
    score += overlap.length * 4
  })

  likedIds.forEach((id) => {
    const liked = songs.find((s) => s.id === id)
    if (!liked) return
    if (liked.artistId === song.artistId) score += 8
    if (liked.genre === genre) score += 5
    const overlap = (liked.moods || []).filter((m) => songMoods.includes(m))
    score += overlap.length * 3
  })

  score += Math.log10((song.likes || 1) + 1) * 2
  score += songTags.length * 0.5

  return score
}

function rankSongs(context, limit = 8) {
  return songs
    .map((song) => ({ song, score: scoreSong(song, context) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.song)
}

function buildContext({ likedIds, recentIds, selectedMood }) {
  const recentSongs = recentIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean)
  const likedSongs = likedIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean)

  const preferredMoods = selectedMood
    ? [selectedMood]
    : [...new Set([...recentSongs, ...likedSongs].flatMap((s) => s.moods || []))]

  const preferredGenres = [
    ...new Set(
      [...recentSongs, ...likedSongs].map(
        (s) => s.genre || getArtistGenre(s.artistId)
      )
    ),
  ]

  const recentArtistIds = [...new Set(recentSongs.map((s) => s.artistId))]

  return {
    likedIds,
    recentIds,
    recentArtistIds,
    preferredMoods,
    preferredGenres,
    excludeIds: [],
  }
}

export function getRecommendedForYou({ likedIds = [], recentIds = [], selectedMood = null }) {
  const context = buildContext({ likedIds, recentIds, selectedMood })
  if (recentIds.length === 0 && likedIds.length === 0) {
    return songs.slice().sort((a, b) => b.likes - a.likes).slice(0, 8)
  }
  return rankSongs(context, 8)
}

export function getBecauseYouPlayed({ recentIds = [], selectedMood = null }) {
  if (recentIds.length === 0) return []
  const lastId = recentIds[0]
  const last = songs.find((s) => s.id === lastId)
  if (!last) return []

  const context = buildContext({
    likedIds: [],
    recentIds: [lastId],
    selectedMood,
  })
  context.excludeIds = [lastId]
  return rankSongs(context, 6)
}

export function getSimilarArtists({ recentIds = [], likedIds = [] }) {
  const seedIds = [...recentIds, ...likedIds].slice(0, 3)
  const artistIds = [
    ...new Set(
      seedIds
        .map((id) => songs.find((s) => s.id === id)?.artistId)
        .filter(Boolean)
    ),
  ]
  if (artistIds.length === 0) {
    return artists.slice(0, 4)
  }

  const relatedSongs = songs.filter(
    (s) => artistIds.includes(s.artistId) === false &&
      artistIds.some((aid) => {
        const seedGenre = getArtistGenre(aid)
        return (s.genre || getArtistGenre(s.artistId)) === seedGenre
      })
  )

  const artistSet = new Map()
  relatedSongs.forEach((s) => {
    if (!artistSet.has(s.artistId)) {
      artistSet.set(s.artistId, artists.find((a) => a.id === s.artistId))
    }
  })

  return [...artistSet.values()].filter(Boolean).slice(0, 6)
}

export function getMoodMix(mood) {
  if (!mood) return []
  const matched = songs.filter((s) => (s.moods || []).includes(mood))
  return matched.sort((a, b) => b.likes - a.likes).slice(0, 10)
}

export function getRecentlyPlayed(recentIds = []) {
  return recentIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean)
    .slice(0, 10)
}

export function getTrendingNow() {
  return songs
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 8)
}

export function getAllRecommendations({
  likedIds = [],
  recentIds = [],
  selectedMood = null,
}) {
  const moodSongs = selectedMood ? getMoodMix(selectedMood) : getMoodMix('Chill')

  return {
    recommendedForYou: getRecommendedForYou({ likedIds, recentIds, selectedMood }),
    becauseYouPlayed: getBecauseYouPlayed({ recentIds, selectedMood }),
    similarArtists: getSimilarArtists({ recentIds, likedIds }),
    moodMix: moodSongs,
    recentlyPlayed: getRecentlyPlayed(recentIds),
    trendingNow: getTrendingNow(),
  }
}

export { parseDuration }
