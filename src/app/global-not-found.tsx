import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import NotFound from "./(en)/not-found";

// The 404 for URLs that match no route. The site has one root layout per language, so
// there is no single layout a plain not-found.tsx could render inside; this file renders
// the whole document itself (needs `experimental.globalNotFound` in next.config.ts).
// It becomes out/404.html, which GitHub Pages serves for every unknown path.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <SiteShell lang="en">
      <NotFound />
    </SiteShell>
  );
}
