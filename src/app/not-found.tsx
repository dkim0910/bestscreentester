import type { Metadata } from "next";
import Link from "next/link";

// Without its own metadata the 404 inherited the homepage title and the layout's
// `index, follow`, next to the `noindex` Next injects for 404s.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-foreground/60">
        That page doesn&apos;t exist. Try one of our screen tests instead.
      </p>
      <Link
        href="/tools"
        className="btn-primary mt-6"
      >
        Browse all tools
      </Link>
    </div>
  );
}
