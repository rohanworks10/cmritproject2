'use client'

import Image from 'next/image'
import { Clock } from 'lucide-react'
import type { InterviewCardData } from '@/components/interviews/interview-card'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

interface InterviewDetailModalProps {
  interview: InterviewCardData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InterviewDetailModal({
  interview,
  open,
  onOpenChange,
}: InterviewDetailModalProps) {
  if (!interview) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">{interview.interviewTitle}</DialogTitle>

        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={interview.youtubeEmbedUrl}
            title={interview.interviewTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <Image
                src={interview.thumbnail}
                alt={interview.artistName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">{interview.artistName}</p>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                {interview.interviewTitle}
              </h2>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-secondary px-2 py-0.5">{interview.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {interview.duration}
                </span>
                <span>
                  {new Date(interview.publishedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <p className="leading-relaxed text-muted-foreground">{interview.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
