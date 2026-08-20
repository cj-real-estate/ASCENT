import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";

export const metadata: Metadata = {
  title: "Request received | Ascent Client Acquisition Systems",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className="flex min-h-screen flex-col bg-ink">
      <Container className="flex flex-1 flex-col justify-center py-24">
        <Eyebrow tone="accent">Request received</Eyebrow>
        <h1 className="mt-5 font-display text-4xl leading-[1.04] text-white sm:text-5xl">
          Got it.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-on-dark">
          Your pipeline audit request is in. You’ll hear back within one
          business day to lock in a time.
        </p>
        <p className="mt-10">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center font-mono text-sm font-semibold uppercase tracking-[0.08em] text-accent underline underline-offset-4 hover:text-[#ff7a3d]"
          >
            ← Back to the site
          </Link>
        </p>
      </Container>
    </main>
  );
}
