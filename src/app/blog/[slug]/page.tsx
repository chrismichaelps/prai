import { resolveAllPosts, resolvePostBySlug } from '@/lib/effect/services/Blog'
import { BlogPostView } from './BlogPostView'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const posts = await resolveAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await resolvePostBySlug(slug, 'es')
  
  if (!post) {
    return {
      title: 'Post Not Found | PR\\AI',
    }
  }

  return {
    title: `${post.title} | PR\\AI Blog`,
    description: post.description,
  }
}

/** @Page.Blog.Slug */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const enPost = await resolvePostBySlug(slug, 'en')
  const esPost = await resolvePostBySlug(slug, 'es')
  
  if (!enPost || !esPost) {
    notFound()
  }

  return <BlogPostView enPost={enPost} esPost={esPost} />
}
