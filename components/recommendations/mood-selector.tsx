'use client'

import { cn } from '@/lib/utils'

interface MoodSelectorProps {
  moods: string[]
  selected: string | null
  onSelect: (mood: string | null) => void
}

export function MoodSelector({ moods, selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
          selected === null
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
        )}
      >
        All moods
      </button>
      {moods.map((mood) => (
        <button
          key={mood}
          type="button"
          onClick={() => onSelect(mood === selected ? null : mood)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:scale-105',
            selected === mood
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
          )}
        >
          {mood}
        </button>
      ))}
    </div>
  )
}
