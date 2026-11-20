import SiteShell, { siteMetadata } from "@/components/layout/SiteShell";

// Root layout for /de/. One per language: see src/components/layout/SiteShell.tsx.
export const metadata = siteMetadata("de");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="de">{children}</SiteShell>;
}
