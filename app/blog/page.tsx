import { Suspense } from 'react'
import { Navigation } from '@/components/navigation'
import BlogListing from '@/components/blog/blog-listing'

export default function BlogIndex() {
  return (
    <div className="min-h-screen pb-28">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <BlogListing />
        </Suspense>
      </main>
    </div>
  )
}
