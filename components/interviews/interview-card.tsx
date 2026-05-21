'use client'

import Image from 'next/image'
import { Play, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InterviewCardData {
  id: string
  artistName: string
  interviewTitle: string
  thumbnail: string
  youtubeEmbedUrl: string
  watchUrl?: string
  duration: string
  category: string
  description: string
  publishedDate: string
}

interface InterviewCardProps {
  interview: InterviewCardData
  onClick?: () => void
  featured?: boolean
}

export function InterviewCard({ interview, onClick, featured }: InterviewCardProps) {
  const Wrapper = interview.watchUrl ? 'a' : 'button'
  const wrapperProps = interview.watchUrl
    ? {
        href: interview.watchUrl,
        target: '_blank',
        rel: 'noreferrer',
      }
    : {
        type: 'button',
        onClick,
      }

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group w-full overflow-hidden rounded-xl border border-border bg-card text-left transition-all duration-300',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10',
        featured && 'sm:col-span-2 lg:col-span-2'
      )}
    >
      <div className={cn('relative overflow-hidden', featured ? 'aspect-[21/9]' : 'aspect-video')}>
        <Image
          src={interview.thumbnail}
          alt={interview.interviewTitle}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
          {interview.category}
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur">
          <Clock className="h-3 w-3" />
          {interview.duration}
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-primary">{interview.artistName}</p>
        <h3 className={cn('mt-1 font-semibold text-foreground line-clamp-2', featured && 'text-lg')}>
          {interview.interviewTitle}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{interview.description}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          {new Date(interview.publishedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
    </Wrapper>
  )
}
