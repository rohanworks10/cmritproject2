import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { PlayerBar } from '@/components/player-bar'
import { getArtistById, getInterviewById, interviews } from '@/data/mockData'
import { ArrowLeft, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InterviewPageProps {
  params: Promise<{ id: string }>
}

export default async function InterviewDetailPage({ params }: InterviewPageProps) {
  const { id } = await params
  const interview = getInterviewById(id)

  if (!interview) {
    notFound()
  }

  const artist = getArtistById(interview.artistId)

  return (
    <div className="min-h-screen pb-28">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-6 gap-2 text-muted-foreground">
          <Link href="/interviews">
            <ArrowLeft className="h-4 w-4" />
            All interviews
          </Link>
        </Button>

        <article>
          {artist && (
            <Link
              href={`/artist/${artist.id}`}
              className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <Image src={artist.image} alt={artist.name} fill className="object-cover" sizes="56px" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">{artist.name}</span>
                  {artist.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-sm text-muted-foreground">{artist.genre}</span>
              </div>
            </Link>
          )}

          <p className="text-sm text-muted-foreground">
            {new Date(interview.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {interview.title}
          </h1>

          <div className="mt-8 space-y-6">
            {interview.content.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed text-secondary-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>

      <PlayerBar />
    </div>
  )
}

export function generateStaticParams() {
  return interviews.map((interview) => ({
    id: interview.id,
  }))
}
