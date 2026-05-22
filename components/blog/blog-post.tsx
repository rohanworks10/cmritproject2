'use client'

export function BlogPost({ post }: { post: any }) {
  return (
    <article className="prose max-w-none prose-a:text-primary prose-img:rounded-3xl">
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

export default BlogPost
