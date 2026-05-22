import { notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import BlogDetail from '@/components/blog/blog-detail'
import { getBlogPostBySlug, incrementBlogViews } from '@/lib/blog-storage'

interface Props {
  params: { slug: string }
}

export default function BlogSlug({ params }: Props) {
  const post = getBlogPostBySlug(params.slug)
  if (!post || post.status !== 'published') return notFound()

  incrementBlogViews(params.slug)

  return (
    <div className="min-h-screen pb-28">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BlogDetail post={post} />
        <div className="mt-8">
          <a href="/blog" className="text-primary">← Back to blog</a>
        </div>
      </main>
    </div>
  )
}
