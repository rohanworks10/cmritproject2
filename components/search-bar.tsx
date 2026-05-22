"use client"

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { songs } from '@/data/mockData'
import { SongCard } from './song-card'
import { cn } from '@/lib/utils'

type SearchBarProps = {
  initialQuery?: string
  onSubmit?: (query: string) => void
}

export function SearchBar({ initialQuery, onSubmit }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery ?? '')

  useEffect(() => {
    if (typeof initialQuery === 'string') setQuery(initialQuery)
  }, [initialQuery])
  const [isFocused, setIsFocused] = useState(false)

  const allSongs = songs
  const filteredSongs = query
    ? allSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase()) ||
          song.album.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="relative w-full max-w-xl">
      <div
        className={cn(
          'relative flex items-center rounded-full border border-border bg-secondary transition-all duration-200',
          isFocused && 'border-primary ring-2 ring-primary/20'
        )}
      >
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSubmit?.(query)
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="h-12 w-full rounded-full border-0 bg-transparent pl-12 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 rounded-full p-1 hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {query && filteredSongs.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-border bg-card p-2 shadow-2xl">
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {filteredSongs.slice(0, 5).map((song) => (
              <SongCard key={song.id} song={song} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {query && filteredSongs.length === 0 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-border bg-card p-6 text-center shadow-2xl">
          <p className="text-muted-foreground">No results found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  )
}
