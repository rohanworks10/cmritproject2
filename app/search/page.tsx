import { Suspense } from 'react'
import { Navigation } from '@/components/navigation'
import SearchContent from './search-content'

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  return (
    <div className="min-h-screen pb-28">
      <Navigation />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent q={q} />
      </Suspense>
    </div>
  )
}