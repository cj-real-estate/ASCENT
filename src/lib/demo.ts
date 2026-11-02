import type { DemoContent, Vertical } from "@content/verticals/types";
import { type SmsConsentProps, toSmsConsentProps } from "./consent";

/*
 * Props for the "Book a demo" funnel (src/components/DemoFlow.tsx), built on
 * the server. Unlike the qualification gate there is nothing to hide: no
 * answer gates the calendar, and the scheduling link still arrives from
 * /api/book after the contact step rather than in the page source, so the
 * lead is always captured before anyone can book.
 */
export type DemoFlowProps = Omit<DemoContent, "cta"> & {
  slug: string;
  smsConsent: SmsConsentProps;
  nameLabel: string;
  companyLabel: string;
  phoneLabel: string;
  emailLabel: string;
};

export function toDemoFlowProps(vertical: Vertical): DemoFlowProps | null {
  const demo = vertical.demo;
  if (!demo) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cta, ...copy } = demo;
  const q = vertical.qualification;
  return {
    ...copy,
    slug: vertical.slug,
    smsConsent: toSmsConsentProps(vertical),
    nameLabel: q.nameLabel,
    companyLabel: q.companyLabel,
    phoneLabel: q.phoneLabel,
    emailLabel: q.emailLabel,
  };
}
