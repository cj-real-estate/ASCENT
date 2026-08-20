import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy | ${SITE_NAME}`,
  description: `How ${SITE_NAME} handles the information visitors share.`,
  alternates: { canonical: "/privacy" },
};

/*
 * Plain-language policy describing what the site actually does. Have the
 * client (and counsel, if he wants) review before launch; the contact line
 * fills in once the [DECISION] email exists.
 */
export default function PrivacyPage() {
  return (
    <main className="bg-paper">
      <Container className="max-w-3xl py-16 sm:py-24">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Privacy</h1>
        <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-ink">
          <p>
            {SITE_NAME} is a client acquisition firm in Oklahoma City, OK. This
            site exists to explain what we do and let you book a pipeline
            audit. Here is what happens with your information when you use it.
          </p>
          <p>
            <strong>What we collect.</strong> If you submit the booking form,
            we receive what you type: your name, phone number, email if you
            include it, and the business details you share. We use it to
            respond to your request and run your audit — nothing else. We
            don’t sell it, rent it, or share it with anyone outside the firm.
          </p>
          <p>
            <strong>Scheduling.</strong> If you book through an embedded
            scheduling widget, that scheduling provider processes the details
            you enter there under its own privacy policy.
          </p>
          <p>
            <strong>Analytics.</strong> We use Vercel Web Analytics, which
            reports aggregate, anonymized page statistics. It does not use
            cookies and does not track you across other sites.
          </p>
          <p>
            <strong>Removal.</strong> If you’ve sent us your information and
            want it deleted, ask and we’ll delete it.
          </p>
          <p className="font-mono text-sm text-slate">
            Questions: [Email — pending]
          </p>
        </div>
        <p className="mt-12">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center font-mono text-sm font-semibold uppercase tracking-[0.08em] text-accent-deep underline underline-offset-4"
          >
            ← Back to the site
          </Link>
        </p>
      </Container>
    </main>
  );
}
