import SiteShell, { siteMetadata } from "@/components/layout/SiteShell";

// Root layout for /fr/. One per language: see src/components/layout/SiteShell.tsx.
export const metadata = siteMetadata("fr");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="fr">{children}</SiteShell>;
}
