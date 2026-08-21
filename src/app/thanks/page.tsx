import type { Metadata } from "next";
import Link from "next/link";
import general from "@content/verticals/general";
import LeadConversion from "@/components/LeadConversion";

/*
 * Post-submission confirmation. Dark full-height page, noindex — it only
 * exists as the form's success destination. All copy from the content module.
 */

export const metadata: Metadata = {
  title: `Request received | ${general.business.name}`,
  robots: { index: false },
};

export default function ThanksPage() {
  const { thanks } = general;

  return (
    <main
      data-dark
      className="flex min-h-dvh flex-col justify-center bg-ink py-16 md:py-28"
    >
      <LeadConversion />
      <div className="section-shell">
        <h1 className="display max-w-[20ch] text-[34px] text-paper xs:text-[40px] md:text-[62px]">
          {thanks.h1}
        </h1>
        <div className="mt-8 max-w-[68ch] space-y-6">
          {thanks.body.map((paragraph, i) => (
            <p key={i} className="text-[17px] text-on-dark">
              {paragraph}
            </p>
          ))}
        </div>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-[44px] items-center justify-center rounded-md bg-orange px-8 py-2 text-[17px] font-semibold text-ink hover:bg-orange-deep"
        >
          {thanks.backLabel}
        </Link>
      </div>
    </main>
  );
}
