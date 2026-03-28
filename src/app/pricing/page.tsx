import type { Metadata } from 'next'
import MarkdownIt from 'markdown-it'
import fs from 'node:fs'
import path from 'node:path'
import { PricingContent } from './PricingContent'

export const dynamic = 'force-static'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export const metadata: Metadata = {
  title: 'Precios | PR\\AI',
  description: 'Compara nuestros planes y descubre el poder de PR\\AI.',
}

function getPricingContent(locale: string): string {
  const filePath = path.join(process.cwd(), 'public', 'content', 'pricing', `${locale}.md`)
  const content = fs.readFileSync(filePath, 'utf8')
  return md.render(content)
}

/** @Route.Pricing */
export default function PricingRoute() {
  const esContent = getPricingContent('es')
  const enContent = getPricingContent('en')

  return <PricingContent esContent={esContent} enContent={enContent} />
}
