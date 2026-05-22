import { Navigation } from '@/components/navigation'
import BlogEditor from '@/components/blog/blog-editor'

export default function BlogNewPage() {
  return (
    <div className="min-h-screen pb-28">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Create post</p>
          <h1 className="mt-2 text-3xl font-bold">Tell your story</h1>
          <p className="mt-2 text-sm text-muted-foreground">Write and publish music blog posts for the community.</p>
        </div>
        <BlogEditor />
      </main>
    </div>
  )
}
