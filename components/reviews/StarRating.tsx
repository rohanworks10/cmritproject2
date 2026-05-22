import React, { useEffect, useMemo, useState } from 'react'

export default function StarRating({
  rating = 0,
  onChange,
  size = 'md',
  showLabel = false,
  readonly = false,
}: {
  rating?: number
  onChange?: (n: number) => void
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  readonly?: boolean
}) {
  const [hover, setHover] = useState<number | null>(null)
  const [value, setValue] = useState<number>(rating)

  useEffect(() => setValue(rating), [rating])

  const px = size === 'sm' ? 14 : size === 'lg' ? 32 : 20

  const handleClick = (v: number) => {
    if (readonly) return
    if (!onChange) return
    if (value === v) {
      setValue(0)
      onChange(0)
    } else {
      setValue(v)
      onChange(v)
    }
  }

  const displayValue = hover ?? value

  const stars = useMemo(() => {
    const parts: number[] = []
    for (let i = 1; i <= 5; i++) {
      const diff = displayValue - i
      if (displayValue >= i) parts.push(100)
      else if (displayValue + 1 > i && displayValue < i) {
        // handle half steps if rating has .5
        const frac = Math.max(0, displayValue - Math.floor(displayValue))
        parts.push(Math.round(frac * 100))
      } else parts.push(0)
    }
    return parts
  }, [displayValue])

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center" role={onChange && !readonly ? 'slider' : undefined} tabIndex={onChange && !readonly ? 0 : undefined}
        onKeyDown={(e) => {
          if (readonly || !onChange) return
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            const next = Math.max(0, value - 1)
            setValue(next)
            onChange(next)
          }
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            const next = Math.min(5, value + 1)
            setValue(next)
            onChange(next)
          }
          if (e.key === 'Enter') {
            onChange(value)
          }
        }}
      >
        {stars.map((fill, idx) => (
          <button
            key={idx}
            type="button"
            onMouseEnter={() => !readonly && onChange && setHover(idx + 1)}
            onMouseLeave={() => !readonly && onChange && setHover(null)}
            onClick={() => handleClick(idx + 1)}
            aria-label={`${idx + 1} star`}
            className={`p-0 m-0 border-0 bg-transparent ${onChange && !readonly ? 'cursor-pointer' : ''}`}
            style={{ width: px, height: px }}
          >
            <svg viewBox="0 0 24 24" width={px} height={px} className="transition-colors duration-100">
              <defs>
                <linearGradient id={`g${idx}`} x1="0" x2="1">
                  <stop offset={`${fill}%`} stopColor="#F59E0B" />
                  <stop offset={`${fill}%`} stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              <path fill={`url(#g${idx})`} d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 20.012 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
            </svg>
          </button>
        ))}
      </div>
      {showLabel && (
        <div className="text-sm text-muted-foreground">
          {value > 0 ? `You rated: ${value}/5` : 'Click to rate'}
        </div>
      )}
    </div>
  )
}
