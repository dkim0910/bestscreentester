import HomePage, { homeMetadata } from "@/components/pages/HomePage";

export const metadata = homeMetadata("ja");

export default function Page() {
  return <HomePage lang="ja" />;
}
