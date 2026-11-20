import HomePage, { homeMetadata } from "@/components/pages/HomePage";

export const metadata = homeMetadata("de");

export default function Page() {
  return <HomePage lang="de" />;
}
