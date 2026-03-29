import type { MDXComponents } from 'mdx/types'

/** @Component.MDX */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
