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
      <div className="text-6xl">🔍</div>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-foreground/60">
        That page doesn&apos;t exist. Try one of our screen tests instead.
      </p>
      <Link
        href="/tools"
        className="mt-6 rounded-full bg-accent px-6 py-3 font-semibold text-black hover:opacity-90"
      >
        Browse all tools
      </Link>
    </div>
  );
}
