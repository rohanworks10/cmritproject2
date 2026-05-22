'use client'

export function TagBadge({ tag }: { tag: string }) {
  return <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{tag}</span>
}

export default TagBadge
