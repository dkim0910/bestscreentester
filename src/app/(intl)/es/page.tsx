import HomePage, { homeMetadata } from "@/components/pages/HomePage";

export const metadata = homeMetadata("es");

export default function Page() {
  return <HomePage lang="es" />;
}
