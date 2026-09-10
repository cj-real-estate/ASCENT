import {
  SMS_CONSENT_LABEL,
  SMS_CONSENT_OPTIONAL_NOTE,
  SMS_CONSENT_PRIVACY_LINK_LABEL,
  SMS_CONSENT_TERMS_LINK_LABEL,
} from "@content/compliance";
import type { Vertical } from "@content/verticals/types";

/*
 * Props for the SMS consent checkbox, built on the server so every form on
 * either domain renders the identical sentence with working links.
 *
 * The hrefs are the only part that varies. A vertical that is the root of
 * its own domain (`canonicalUrl` set — the sponsor page) links ABSOLUTELY:
 * that page is also served under /sponsors on ascentcas.com, where a
 * relative "/terms" would resolve to the other domain's terms page. Every
 * other vertical links relatively, staying on whichever host served it.
 */
export interface SmsConsentProps {
  label: string;
  optionalNote: string;
  privacyHref: string;
  privacyLabel: string;
  termsHref: string;
  termsLabel: string;
}

export function toSmsConsentProps(vertical: Vertical): SmsConsentProps {
  const base = vertical.canonicalUrl ? vertical.business.url : "";
  return {
    label: SMS_CONSENT_LABEL,
    optionalNote: SMS_CONSENT_OPTIONAL_NOTE,
    privacyHref: `${base}/privacy`,
    privacyLabel: SMS_CONSENT_PRIVACY_LINK_LABEL,
    termsHref: `${base}/terms`,
    termsLabel: SMS_CONSENT_TERMS_LINK_LABEL,
  };
}
