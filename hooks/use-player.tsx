'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { songs as allSongs } from '@/data/mockData'
import { loadAllPlaylists } from '@/lib/playlist/playlistService'
import { recordPlay } from '@/lib/play-history-storage'

export type PlayerSong = (typeof allSongs)[number]

interface PlayerContextValue {
  currentSong: PlayerSong | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playSong: (song: PlayerSong, queue?: PlayerSong[]) => void
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function formatPlayerTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function findQueueForSong(songId: string): PlayerSong[] | null {
  const { namedPlaylists, quickPlaylist } = loadAllPlaylists()

  const namedMatch = namedPlaylists.find((p) => p.songs.some((s) => s.id === songId))
  if (namedMatch && namedMatch.songs.length > 0) return namedMatch.songs

  if (quickPlaylist.songs.some((s) => s.id === songId) && quickPlaylist.songs.length > 0) {
    return quickPlaylist.songs
  }

  return null
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeBeforeMute = useRef(0.75)
  const currentSongRef = useRef<PlayerSong | null>(null)
  const playbackQueueRef = useRef<PlayerSong[]>(allSongs)

  const [currentSong, setCurrentSong] = useState<PlayerSong | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.75)
  const [isMuted, setIsMuted] = useState(false)

  currentSongRef.current = currentSong

  const playSongAt = useCallback((song: PlayerSong) => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentSong(song)
    audio.src = song.audioUrl
    audio.currentTime = 0
    setCurrentTime(0)
    recordPlay(song.id)
    audio.play().catch(() => setIsPlaying(false))
  }, [])

  const playNext = useCallback(() => {
    const queue = playbackQueueRef.current
    if (queue.length === 0) return

    const index = currentSongRef.current
      ? queue.findIndex((s) => s.id === currentSongRef.current!.id)
      : -1
    const nextIndex = index < queue.length - 1 ? index + 1 : 0
    playSongAt(queue[nextIndex])
  }, [playSongAt])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = 0.75
    audioRef.current = audio

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => playNext()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [playNext])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const playSong = useCallback(
    (song: PlayerSong, queue?: PlayerSong[]) => {
      if (queue && queue.length > 0) {
        playbackQueueRef.current = queue
      } else {
        const detected = findQueueForSong(song.id)
        const { quickPlaylist } = loadAllPlaylists()
        playbackQueueRef.current =
          detected && detected.length > 0
            ? detected
            : quickPlaylist.songs.length > 0
              ? quickPlaylist.songs
              : allSongs
      }
      playSongAt(song)
    },
    [playSongAt]
  )

  const playPrevious = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    const queue = playbackQueueRef.current
    if (queue.length === 0) return

    if (!currentSongRef.current) {
      playSongAt(queue[queue.length - 1])
      return
    }

    if (audio.currentTime > 3) {
      audio.currentTime = 0
      setCurrentTime(0)
      return
    }

    const index = queue.findIndex((s) => s.id === currentSongRef.current!.id)
    const prevIndex = index > 0 ? index - 1 : queue.length - 1
    playSongAt(queue[prevIndex])
  }, [playSongAt])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentSongRef.current) {
      const { quickPlaylist } = loadAllPlaylists()
      const startQueue = quickPlaylist.songs.length > 0 ? quickPlaylist.songs : allSongs
      playbackQueueRef.current = startQueue
      playSongAt(startQueue[0])
      return
    }

    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [playSongAt])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    const clamped = Math.max(0, Math.min(time, audio.duration || time))
    audio.currentTime = clamped
    setCurrentTime(clamped)
  }, [])

  const setVolume = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(1, value))
    setVolumeState(clamped)
    if (clamped > 0) {
      volumeBeforeMute.current = clamped
      setIsMuted(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((muted) => {
      if (muted) {
        setVolumeState(volumeBeforeMute.current || 0.75)
        return false
      }
      volumeBeforeMute.current = volume
      return true
    })
  }, [volume])

  const value: PlayerContextValue = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider')
  return context
}
