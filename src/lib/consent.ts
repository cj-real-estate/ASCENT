import {
  SMS_CONSENT_OPTIONAL_NOTE,
  SMS_CONSENT_PRIVACY_LINK_LABEL,
  SMS_CONSENT_TERMS_LINK_LABEL,
  SMS_MARKETING_CONSENT_LABEL,
  smsTransactionalConsentLabel,
} from "@content/compliance";
import type { Vertical } from "@content/verticals/types";

/*
 * Props for the pair of SMS consent checkboxes, built on the server so
 * every form on either domain renders the same two sentences with working
 * links.
 *
 * Two consents, never one: transactional (confirmations, reminders,
 * scheduling updates for the call the visitor booked) and marketing
 * (promotional). They are separate permissions and are collected, recorded
 * and filtered on separately — see content/compliance.ts.
 *
 * The hrefs are the only thing that varies by host. A vertical that is the
 * root of its own domain (`canonicalUrl` set — the sponsor page) links
 * ABSOLUTELY: that page is also served under /sponsors on ascentcas.com,
 * where a relative "/terms" would resolve to the other domain's terms page.
 * Every other vertical links relatively, staying on whichever host served
 * it.
 */
export interface SmsConsentProps {
  /** Non-marketing: confirmations, reminders, scheduling updates. */
  transactionalLabel: string;
  /** Promotional. Never implied by the transactional one. */
  marketingLabel: string;
  optionalNote: string;
  privacyHref: string;
  privacyLabel: string;
  termsHref: string;
  termsLabel: string;
}

export function toSmsConsentProps(vertical: Vertical): SmsConsentProps {
  const base = vertical.canonicalUrl ? vertical.business.url : "";
  return {
    transactionalLabel: smsTransactionalConsentLabel(vertical.smsCallName),
    marketingLabel: SMS_MARKETING_CONSENT_LABEL,
    optionalNote: SMS_CONSENT_OPTIONAL_NOTE,
    privacyHref: `${base}/privacy`,
    privacyLabel: SMS_CONSENT_PRIVACY_LINK_LABEL,
    termsHref: `${base}/terms`,
    termsLabel: SMS_CONSENT_TERMS_LINK_LABEL,
  };
}

/** What the two boxes came back as, as posted and recorded. */
export interface SmsConsentValues {
  transactional: boolean;
  marketing: boolean;
}
