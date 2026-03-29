/** @Service.Blog */

import {
  Array as Arr,
  Context,
  Data,
  Effect,
  Layer,
  Order,
  pipe,
  Schema,
} from "effect"
import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Locales, type Locale } from "./I18n"

/** @Schema.Frontmatter */
const FrontmatterSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  author: Schema.String,
  date: Schema.Date,
  image: Schema.optional(Schema.String),
  tags: Schema.optional(Schema.Array(Schema.String)),
})

/** @Type.BlogFrontmatter */
export type BlogFrontmatter = typeof FrontmatterSchema.Type

/** @Domain.BlogPost */
export interface BlogPost {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly author: string
  readonly date: Date
  readonly image?: string
  readonly tags: readonly string[]
  readonly content: string
}

/** @Error.Blog */
export class BlogError extends Data.TaggedError("BlogError")<{
  readonly slug?: string
  readonly message: string
}> {}

/** @Parse.Regex */
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/

/** @Parse.StripQuotes */
const stripQuotes = (s: string): string => s.replace(/^["']|["']$/g, "").replace(/\\\\/g, "\\")

/** @Parse.Tokenize */
const tokenize = (raw: string): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key === "tags") {
      const m = value.match(/\[(.*)\]/)
      out[key] = m?.[1]
        ? m[1].split(",").map((t) => stripQuotes(t.trim()))
        : []
    } else {
      out[key] = stripQuotes(value)
    }
  }
  return out
}

/** @Parse.Decode */
const decodeFrontmatter = Schema.decodeUnknown(FrontmatterSchema)

/** @Parse.Frontmatter */
const parseFrontmatter = (
  source: string,
): Effect.Effect<
  { readonly meta: BlogFrontmatter; readonly body: string },
  BlogError
> =>
  Effect.gen(function* () {
    const match = source.match(FRONTMATTER_RE)
    if (!match?.[1]) {
      return yield* Effect.fail(new BlogError({
        message: "Missing or malformed frontmatter",
      }))
    }
    const body = source.slice(match[0].length).trim()
    const meta = yield* decodeFrontmatter(tokenize(match[1])).pipe(
      Effect.mapError(
        (e) =>
          new BlogError({
            message: `Frontmatter schema validation failed: ${String(e)}`,
          }),
      ),
    )
    return { meta, body } as const
  })

/** @Order.ByDateDesc */
const byDateDesc: Order.Order<BlogPost> = pipe(
  Order.Date,
  Order.mapInput((p: BlogPost) => p.date),
  Order.reverse,
)

/** @Map.ToBlogPost */
const toBlogPost = (
  slug: string,
  meta: BlogFrontmatter,
  content: string,
): BlogPost => ({
  slug,
  title: meta.title,
  description: meta.description,
  author: meta.author,
  date: meta.date,
  image: meta.image,
  tags: meta.tags ?? [],
  content,
})

/** @Service.Blog.Tag */
export class BlogService extends Context.Tag("@Service/Blog")<
  BlogService,
  {
    readonly getAllPosts: (locale: Locale) => Effect.Effect<readonly BlogPost[], BlogError>
    readonly getPostBySlug: (
      slug: string,
      locale: Locale
    ) => Effect.Effect<BlogPost, BlogError>
  }
>() {}

/** @Service.Blog.Accessor.GetAllPosts */
export const getAllPosts = (locale: Locale) => 
  Effect.flatMap(BlogService, (_) => _.getAllPosts(locale))

/** @Service.Blog.Accessor.GetPostBySlug */
export const getPostBySlug = (slug: string, locale: Locale) =>
  Effect.flatMap(BlogService, (_) => _.getPostBySlug(slug, locale))

/** @Service.Blog.Config */
const BLOG_DIR = "public/content/blog"

/** @Service.Blog.Live */
export const BlogLive = Layer.effect(
  BlogService,
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const pathSvc = yield* Path.Path
    const dir = pathSvc.join(process.cwd(), BLOG_DIR)

    /** @Service.Blog.Live.ReadPost */
    const readPost = (slug: string, locale: string, includeBody: boolean) =>
      pipe(
        fs.readFileString(pathSvc.join(dir, locale, `${slug}.mdx`)),
        Effect.flatMap(parseFrontmatter),
        Effect.map(({ meta, body }) =>
          toBlogPost(slug, meta, includeBody ? body : ""),
        ),
      )

    /** @Service.Blog.Live.SlugFromFile */
    const slugFromFile = (f: string) => f.replace(/\.mdx$/, "")

    return {
      getAllPosts: (locale: string) => Effect.gen(function* () {
        const localeDir = pathSvc.join(dir, locale)
        const entries = yield* fs.readDirectory(localeDir)
        const mdxFiles = Arr.filter(entries, (f) => f.endsWith(".mdx"))
        const posts = yield* Effect.forEach(
          mdxFiles,
          (file) => readPost(slugFromFile(file), locale, false),
          { concurrency: "unbounded" },
        )
        return Arr.sort(posts, byDateDesc)
      }).pipe(
        Effect.mapError(
          (e): BlogError =>
            e instanceof BlogError
              ? e
              : new BlogError({
                  message: `Failed to read blog directory for locale ${locale}: ${String(e)}`,
                }),
        ),
      ),

      getPostBySlug: (slug, locale) =>
        readPost(slug, locale, true).pipe(
          Effect.mapError(
            (e): BlogError =>
              e instanceof BlogError
                ? e
                : new BlogError({
                    slug,
                    message: `Post "${slug}" for locale "${locale}" not found`,
                  }),
          ),
        ),
    }
  }),
)

/** @Layer.Blog.Node */
export const BlogNode = BlogLive.pipe(Layer.provide(NodeContext.layer))

/** @Runtime.Blog.ResolveAllPosts */
export const resolveAllPosts = (locale: Locale = Locales.ES): Promise<readonly BlogPost[]> =>
  getAllPosts(locale).pipe(
    Effect.provide(BlogNode),
    Effect.catchAll(() => Effect.succeed([] as readonly BlogPost[])),
    Effect.runPromise,
  )

/** @Runtime.Blog.ResolvePostBySlug */
export const resolvePostBySlug = (slug: string, locale: Locale = Locales.ES): Promise<BlogPost | null> =>
  getPostBySlug(slug, locale).pipe(
    Effect.provide(BlogNode),
    Effect.map((p): BlogPost | null => p),
    Effect.catchAll(() => Effect.succeed(null as BlogPost | null)),
    Effect.runPromise,
  )
