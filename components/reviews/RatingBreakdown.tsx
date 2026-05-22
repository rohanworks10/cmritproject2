import React, { useEffect, useMemo, useState } from 'react'
import StarRating from './StarRating'

export default function RatingBreakdown({
  averageRating,
  totalCount,
  ratingBreakdown,
  onFilterByStars,
}: {
  averageRating: number
  totalCount: number
  ratingBreakdown: { 1: number; 2: number; 3: number; 4: number; 5: number }
  onFilterByStars?: (stars: number | null) => void
}) {
  const [animatedPercents, setAnimatedPercents] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    // animate bars
    const next: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (let i = 5; i >= 1; i--) {
      const count = ratingBreakdown[i as 1 | 2 | 3 | 4 | 5] || 0
      const pct = totalCount ? Math.max((count / totalCount) * 100, count > 0 ? 2 : 0) : 0
      next[i] = pct
    }
    // staggered
    const timers: number[] = []
    Object.keys(next).forEach((k, idx) => {
      const key = Number(k) as 1 | 2 | 3 | 4 | 5
      const t = window.setTimeout(() => {
        setAnimatedPercents((s) => ({ ...s, [key]: next[key] }))
      }, idx * 80)
      timers.push(t)
    })
    return () => timers.forEach((t) => clearTimeout(t))
  }, [ratingBreakdown, totalCount])

  const rows = useMemo(() => [5, 4, 3, 2, 1], [])

  const handleRowClick = (n: number) => {
    const next = active === n ? null : n
    setActive(next)
    onFilterByStars?.(next)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col items-start">
        <div className="text-4xl font-bold" style={{ fontSize: 48 }}>{Number(averageRating).toFixed(1)}</div>
        <div className="mt-2">
          <StarRating rating={averageRating} readonly size="md" />
        </div>
        <div className="mt-2 text-sm text-muted-foreground">Based on {totalCount} reviews</div>
      </div>
      <div className="space-y-2">
        {rows.map((n, idx) => {
          const count = ratingBreakdown[n as 1 | 2 | 3 | 4 | 5] || 0
          const pct = animatedPercents[n] || 0
          return (
            <div key={n} className={`flex items-center gap-3 ${onFilterByStars ? 'cursor-pointer hover:bg-secondary/50 rounded-md p-1' : ''}`} onClick={onFilterByStars ? () => handleRowClick(n) : undefined}>
              <div className="w-8 text-sm">{n} ★</div>
              <div className="flex-1">
                <div className="w-full rounded-full bg-border h-2">
                  <div className="h-2 rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%`, transitionDelay: `${idx * 80}ms` }} />
                </div>
              </div>
              <div className="w-12 text-right text-sm text-muted-foreground">{count}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
