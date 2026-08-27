import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getGuide, getAllGuideSlugs, getRelatedGuides } from "@/lib/guides";
import {
  pageMetadata,
  articleJsonLd,
  breadcrumbJsonLd,
  absoluteUrl,
  SITE_NAME,
} from "@/lib/seo";

export const dynamicParams = false;

// The site is exported with `trailingSlash: true`, so a slash-less in-body link like
// (/dead-pixel-test) costs a 301 on every click and leaks link equity through the
// redirect. Guide bodies contain ~100 of them, so normalise internal hrefs here
// rather than hand-editing every markdown link.
const mdxComponents = {
  a: ({ href = "", ...props }: React.ComponentProps<"a">) => {
    const isInternal = href.startsWith("/") && !href.includes("#") && !href.includes("?");
    const isFile = /\.[a-z0-9]+$/i.test(href);
    if (isInternal && !isFile) {
      return <Link href={href.endsWith("/") ? href : `${href}/`} {...props} />;
    }
    return <a href={href} {...props} />;
  },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getGuide(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt ?? post.title,
    path: `/blog/${post.slug}`,
    keywords: post.tags,
    images: [`/og/guides/${post.slug}.png`],
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getGuide(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);
  const updated = post.updatedAt ?? post.publishedAt;
  const related = getRelatedGuides(post.slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: post.title,
              description: post.excerpt ?? post.title,
              url,
              publishedAt: post.publishedAt,
              updatedAt: updated,
              image: absoluteUrl(`/og/guides/${post.slug}.png`),
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Guides", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ),
        }}
      />
      <nav className="mb-4 text-sm text-foreground/50">
        <Link href="/blog" className="hover:text-foreground">
          ← All guides
        </Link>
      </nav>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
        {/* Real, indexable page image — OG/Twitter/Article schema reference the same file. */}
        <Image
          src={`/og/guides/${post.slug}.png`}
          alt={`${post.title} — illustrated diagram`}
          width={1200}
          height={630}
          priority
          className="mb-6 w-full rounded-xl border border-border"
        />
        <h1 className="text-3xl font-bold sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-foreground/50">
          By {SITE_NAME} · Published{" "}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <>
              {" "}
              · Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </>
          )}
        </p>
        <div className="prose-content mt-6">
          <MDXRemote source={post.body} components={mdxComponents} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((g) => (
              <Link
                key={g.slug}
                href={`/blog/${g.slug}/`}
                className="flex flex-col rounded-lg border border-border bg-card p-4 transition hover:border-accent/50"
              >
                <span className="font-medium">{g.title}</span>
                <span className="mt-1 text-sm text-foreground/60">{g.excerpt}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
