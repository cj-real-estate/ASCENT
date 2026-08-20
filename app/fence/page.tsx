import { fence } from "@/content/verticals";
import { VerticalPage } from "@/components/VerticalPage";
import { verticalMetadata } from "@/lib/seo";

export const metadata = verticalMetadata(fence);

export default function FencePage() {
  return <VerticalPage vertical={fence} />;
}
