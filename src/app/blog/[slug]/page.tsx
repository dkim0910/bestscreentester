import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getGuide, getAllGuideSlugs } from "@/lib/guides";
import { pageMetadata, articleJsonLd, absoluteUrl } from "@/lib/seo";

export const dynamicParams = false;

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

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: post.title,
              description: post.excerpt ?? post.title,
              url: absoluteUrl(`/blog/${post.slug}`),
            }),
          ),
        }}
      />
      <nav className="mb-4 text-sm text-foreground/50">
        <Link href="/blog" className="hover:text-foreground">
          ← All guides
        </Link>
      </nav>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
        <h1 className="text-3xl font-bold sm:text-4xl">{post.title}</h1>
        <div className="prose-content mt-6">
          <MDXRemote source={post.body} />
        </div>
      </div>
    </article>
  );
}
