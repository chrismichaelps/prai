import { resolveAllPosts } from '@/lib/effect/services/Blog'
import { Locales } from '@/lib/effect/services/I18n'
import { BlogList } from './BlogList'
import type { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  title: 'Blog | PR\\AI',
  description: 'Artículos y actualizaciones de PR\\AI - Tu asistente inteligente de turismo en Puerto Rico.',
}

/** @Page.Blog */
export default async function BlogPage() {
  const enPosts = await resolveAllPosts(Locales.EN)
  const esPosts = await resolveAllPosts(Locales.ES)
  
  return <BlogList enPosts={enPosts} esPosts={esPosts} />
}
