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
import { songs as playlist } from '@/data/mockData'

export type PlayerSong = (typeof playlist)[number]

interface PlayerContextValue {
  currentSong: PlayerSong | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playSong: (song: PlayerSong) => void
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

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeBeforeMute = useRef(0.75)
  const currentSongRef = useRef<PlayerSong | null>(null)

  const [currentSong, setCurrentSong] = useState<PlayerSong | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.75)
  const [isMuted, setIsMuted] = useState(false)

  currentSongRef.current = currentSong

  const playNext = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    const index = currentSongRef.current
      ? playlist.findIndex((s) => s.id === currentSongRef.current!.id)
      : -1
    const nextIndex = index < playlist.length - 1 ? index + 1 : 0
    const nextSong = playlist[nextIndex]

    setCurrentSong(nextSong)
    audio.src = nextSong.audioUrl
    audio.currentTime = 0
    setCurrentTime(0)
    audio.play().catch(() => setIsPlaying(false))
  }, [])

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

  const playSong = useCallback((song: PlayerSong) => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentSong(song)
    audio.src = song.audioUrl
    audio.currentTime = 0
    setCurrentTime(0)
    audio.play().catch(() => setIsPlaying(false))
  }, [])

  const playPrevious = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentSongRef.current) {
      playSong(playlist[playlist.length - 1])
      return
    }

    if (audio.currentTime > 3) {
      audio.currentTime = 0
      setCurrentTime(0)
      return
    }

    const index = playlist.findIndex((s) => s.id === currentSongRef.current!.id)
    const prevIndex = index > 0 ? index - 1 : playlist.length - 1
    const prevSong = playlist[prevIndex]

    setCurrentSong(prevSong)
    audio.src = prevSong.audioUrl
    audio.currentTime = 0
    setCurrentTime(0)
    audio.play().catch(() => setIsPlaying(false))
  }, [playSong])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentSongRef.current) {
      playSong(playlist[0])
      return
    }

    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [playSong])

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
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
