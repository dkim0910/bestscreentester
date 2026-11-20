import SiteShell, { siteMetadata } from "@/components/layout/SiteShell";

// Root layout for /es/. One per language: see src/components/layout/SiteShell.tsx.
export const metadata = siteMetadata("es");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="es">{children}</SiteShell>;
}
