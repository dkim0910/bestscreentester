import SiteShell, { siteMetadata } from "@/components/layout/SiteShell";

// Root layout for the English site. Each other language has its own root layout under
// src/app/(intl)/<lang>/ so that <html lang> is correct in the static HTML.
export const metadata = siteMetadata("en");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
