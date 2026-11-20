import SiteShell, { siteMetadata } from "@/components/layout/SiteShell";

// Root layout for /pt/. One per language: see src/components/layout/SiteShell.tsx.
export const metadata = siteMetadata("pt");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="pt">{children}</SiteShell>;
}
