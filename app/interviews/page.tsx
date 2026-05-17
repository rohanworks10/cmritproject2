import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { interviews, getArtistById } from '@/data/mockData'
import { Mic2 } from 'lucide-react'

export default function InterviewsPage() {
  return (
    <div className="min-h-screen pb-28">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Mic2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Interviews</h1>
              <p className="text-muted-foreground">Conversations with your favorite artists</p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => {
            const artist = getArtistById(interview.artistId)
            return (
              <Link
                key={interview.id}
                href={`/interviews/${interview.id}`}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-secondary"
              >
                <p className="text-sm font-medium text-primary">{artist?.name ?? 'Artist'}</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary">
                  {interview.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {interview.content[0]}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {new Date(interview.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </Link>
            )
          })}
        </div>
      </main>

    </div>
  )
}
