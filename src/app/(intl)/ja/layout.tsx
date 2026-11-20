import SiteShell, { siteMetadata } from "@/components/layout/SiteShell";

// Root layout for /ja/. One per language: see src/components/layout/SiteShell.tsx.
export const metadata = siteMetadata("ja");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="ja">{children}</SiteShell>;
}
