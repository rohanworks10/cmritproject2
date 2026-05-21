'use client'

import { useMemo, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { InterviewCard } from '@/components/interviews/interview-card'
import { InterviewDetailModal } from '@/components/interviews/interview-detail-modal'
import {
  demoInterviews,
  getFeaturedInterviews,
  interviewCategories,
} from '@/data/interviewsData'
import { Mic2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function InterviewsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const featured = getFeaturedInterviews()

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return demoInterviews.filter((item) => {
      const matchesCategory = !category || item.category === category
      const matchesSearch =
        !q ||
        item.artistName.toLowerCase().includes(q) ||
        item.interviewTitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [search, category])

  const selected = demoInterviews.find((i) => i.id === selectedId) ?? null

  return (
    <div className="min-h-screen pb-28">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Mic2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Interviews</h1>
              <p className="text-muted-foreground">
                Exclusive conversations with the world&apos;s biggest artists
              </p>
            </div>
          </div>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by artist or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={cn(
                'rounded-full px-3 py-1 text-sm transition-colors',
                !category ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              All
            </button>
            {interviewCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === category ? null : cat)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm transition-colors',
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {featured.length > 0 && !search && !category && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-foreground">Featured</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  featured
                  onClick={interview.watchUrl ? undefined : () => setSelectedId(interview.id)}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {search || category ? 'Results' : 'All Interviews'}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filtered.length})
            </span>
          </h2>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
              No interviews match your search.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onClick={interview.watchUrl ? undefined : () => setSelectedId(interview.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <InterviewDetailModal
        interview={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  )
}
