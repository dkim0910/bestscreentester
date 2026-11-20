import SiteShell, { siteMetadata } from "@/components/layout/SiteShell";

// Root layout for /ko/. One per language: see src/components/layout/SiteShell.tsx.
export const metadata = siteMetadata("ko");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="ko">{children}</SiteShell>;
}
