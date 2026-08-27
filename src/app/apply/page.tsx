import type { Metadata } from "next";
import Link from "next/link";
import type { ApplyPageContent } from "@content/verticals/types";
import general from "@content/verticals/general";
import { AscentLockup } from "@/components/Logo";
import QualifyFlow from "@/components/QualifyFlow";
import { toQualifyFlowProps } from "@/lib/qualify";

/*
 * /apply — the destination for paid and social traffic. Deliberately bare:
 * no header, no nav, no footer, no calculator. One offer, one form, one exit.
 * Anything else on the page is another place to leave from.
 *
 * It runs on the brand vertical, so a link from any channel lands somewhere
 * trade-agnostic; the questions inside QualifyFlow do the sorting.
 *
 * noindex on purpose — this is an ad destination, not an organic page, and it
 * would otherwise compete with "/" for the same intent.
 */

// `applyPage` is nullable on the interface because fence.ts sets it to null.
// This route is the one place that asserts the brand vertical has one, so the
// metadata and the page body below can both read it directly.
function requireApplyPage(): ApplyPageContent {
  const content = general.applyPage;
  if (!content) {
    throw new Error("general.applyPage must be set — /apply renders it.");
  }
  return content;
}

const applyPage = requireApplyPage();

export const metadata: Metadata = {
  // `absolute` because seoTitle already carries the business name — the root
  // layout's "%s | Ascent" template would otherwise say it twice.
  title: { absolute: applyPage.seoTitle },
  description: applyPage.seoDescription,
  robots: { index: false },
};

export default function ApplyPage() {
  const { business } = general;
  const lockupTagline = business.name.split(" ").slice(1).join(" ");

  return (
    <main data-dark className="min-h-dvh bg-ink py-10 md:py-16">
      <div className="section-shell">
        <Link
          href="/"
          aria-label={business.name}
          className="inline-flex min-h-[44px] items-center"
        >
          <AscentLockup
            variant="onDark"
            name={business.name}
            tagline={lockupTagline}
          />
        </Link>

        <p className="eyebrow mt-12 text-orange md:mt-16">{applyPage.eyebrow}</p>
        <h1 className="display mt-5 max-w-[24ch] text-[34px] text-paper min-[380px]:text-[40px] md:text-[54px] xl:text-[62px]">
          {applyPage.h1}
        </h1>
        <p className="mt-6 max-w-[68ch] text-[17px] text-on-dark">
          {applyPage.sub}
        </p>

        <div className="mt-12 md:mt-16">
          <QualifyFlow flow={toQualifyFlowProps(general)} />
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 border-t border-white/10 pt-4 text-[14px] text-fog">
          <p>
            © {new Date().getFullYear()} {business.name}
          </p>
          <Link
            href="/privacy"
            className="inline-flex min-h-[44px] items-center underline underline-offset-4 transition-colors hover:text-on-dark"
          >
            {general.footer.privacyLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
