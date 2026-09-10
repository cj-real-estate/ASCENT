/*
 * Carrier-mandated compliance text for the SMS program.
 *
 * This is the one module in `content/` that is NOT per-vertical. Every
 * string here is fixed by A2P 10DLC campaign review (the carriers' vetting
 * of the business that sends the texts), not by brand or audience, and the
 * same wording has to appear identically on both domains — ascentcas.com
 * and ascentforsponsors.com. A reviewer compares the consent language on
 * the form against the language in the terms and the policy; if they differ,
 * the campaign is rejected. So they are written once and imported.
 *
 * TWO consents, collected separately, because they are two different
 * permissions under the TCPA and the carriers treat them differently:
 *
 *   - TRANSACTIONAL (non-marketing): confirmations, reminders, scheduling
 *     updates for a call the person asked for. This is the one that makes
 *     an appointment reminder lawful.
 *   - MARKETING: promotional messages. Never implied by the first, and a
 *     marketing workflow must filter on the marketing tag alone.
 *
 * Neither box is a condition of anything, and someone may tick one, both,
 * or neither. Collapsing them back into a single box would mean texting a
 * reminder on the strength of a marketing consent (or worse, the reverse),
 * so keep them apart.
 *
 * Rules that survived a rejection somewhere and must not be "improved":
 *
 *   - Both checkboxes start UNCHECKED and are NEVER required to submit.
 *     A pre-checked or mandatory box is a rejection on its own, and
 *     consent that is a condition of the form is not consent.
 *   - Each sentence names the LEGAL entity, in the registered spelling,
 *     and says "at the number provided".
 *   - Each carries its disclosures: rates, frequency, HELP/STOP — and, on
 *     the marketing one, autodialer and not-a-condition-of-purchase.
 *   - `MOBILE_DATA_NO_SHARING` appears verbatim in both privacy policies.
 *     Its absence is the single most common rejection cause.
 *   - Whatever the forms say, the terms page must repeat: program name,
 *     both consent types, frequency, rates, HELP/STOP, the minimum age and
 *     a support contact.
 *   - `DATA_SECURITY_CLAUSE` appears in both privacy policies.
 *
 * If a carrier asks for different wording, change it HERE and it changes on
 * every form, policy and terms page at once. See docs/A2P-10DLC.md.
 */

/** The registered entity, in the spelling the consent language must use. */
export const LEGAL_ENTITY = "ASCENT CLIENT ACQUISITION SYSTEMS LLC";

/** Program name, as registered with the carriers and shown in the terms. */
export const SMS_PROGRAM_NAME = "Ascent Client Acquisition Systems alerts";

/**
 * The transactional (non-marketing) consent sentence.
 *
 * `callName` is the only variable — the noun for the call the visitor is
 * actually booking, which each vertical supplies as `smsCallName` ("scoping
 * call" on the sponsor domain, "strategy call" on the brand site). Every
 * disclosure in the sentence is identical wherever it renders; only the
 * thing the messages are about changes, and it has to match what the form
 * above it is booking.
 */
export function smsTransactionalConsentLabel(callName: string): string {
  return (
    `I consent to receive non-marketing text messages from ${LEGAL_ENTITY} about my ` +
    `${callName}, including confirmations, reminders and scheduling updates, at the number ` +
    "provided. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out."
  );
}

/**
 * The marketing consent sentence, verbatim from the carrier template. The
 * "[Privacy Policy] | [Terms]" pair that closes the template is rendered as
 * real links under both boxes rather than pasted into this text — see
 * SmsConsentFields.
 */
export const SMS_MARKETING_CONSENT_LABEL =
  `By checking this box, I agree to receive marketing text messages from ${LEGAL_ENTITY} ` +
  "at the number provided, including messages sent by autodialer. Consent is not a condition " +
  "of purchase. Msg & data rates may apply. Msg frequency varies. Reply HELP for help, STOP to opt out.";

/**
 * The mobile-data clause, verbatim, for both privacy policies. Do not
 * paraphrase: reviewers search for this sentence.
 */
export const MOBILE_DATA_NO_SHARING =
  "No mobile information will be shared with third parties or affiliates for marketing or " +
  "promotional purposes. Text messaging originator opt-in data and consent will not be shared " +
  "with any third parties.";

/**
 * The minimum age to opt in. A2P 10DLC review asks for it, and it belongs
 * in the terms rather than in either consent sentence — the sentences are
 * quoted wording and do not get extended.
 */
export const SMS_AGE_REQUIREMENT =
  `You must be at least 18 years old to opt in to text messages from ${LEGAL_ENTITY}.`;

/**
 * The data-security paragraph, verbatim, for both privacy policies. It
 * describes safeguards rather than promising security — "no method of
 * transmission or storage is 100% secure" is part of the statement and
 * stays in it.
 */
export const DATA_SECURITY_CLAUSE =
  "We protect personal information, including mobile numbers and consent records, using " +
  "industry-standard safeguards: encryption in transit (HTTPS/TLS), access limited to " +
  "authorized personnel, and secure, access-controlled storage with our service providers. " +
  "No method of transmission or storage is 100% secure, but we take reasonable measures to " +
  "protect your information.";

/** Link labels that close the consent language, per the carrier's template. */
export const SMS_CONSENT_PRIVACY_LINK_LABEL = "Privacy Policy";
export const SMS_CONSENT_TERMS_LINK_LABEL = "Terms";

/**
 * Said above the boxes, never inside either consent sentence. The sentences
 * are quoted wording and do not get edited; this is the site telling a
 * visitor plainly that leaving both boxes alone costs them nothing.
 */
export const SMS_CONSENT_OPTIONAL_NOTE =
  "Both boxes are optional. You can submit this form without checking either.";

/**
 * The SMS program, described for a terms page. Takes the domain's own
 * support contact and the noun its forms use for the call, so each site
 * describes the program its own visitors are opting into.
 */
export interface SmsProgramTerms {
  programName: string;
  entity: string;
  items: { term: string; detail: string }[];
}

export function smsProgramTerms(support: {
  email: string | null;
  phone: string | null;
  /** Postal address, already formatted for display. */
  address: string | null;
  /** "scoping call" | "strategy call" — the vertical's `smsCallName`. */
  callName: string;
}): SmsProgramTerms {
  const reach = [support.email, support.phone].filter(Boolean).join(" or ");
  return {
    programName: SMS_PROGRAM_NAME,
    entity: LEGAL_ENTITY,
    items: [
      {
        term: "Program name",
        detail: `${SMS_PROGRAM_NAME}, operated by ${LEGAL_ENTITY}${
          support.address ? `, ${support.address}` : ""
        }.`,
      },
      {
        term: "Two consents, collected separately",
        detail:
          `Every form on this site carries two optional checkboxes, both unchecked. The first is ` +
          `non-marketing consent: texts about your ${support.callName} — confirmations, reminders and ` +
          "scheduling updates. The second is marketing consent: promotional texts. Ticking one " +
          "does not tick the other, and marketing messages only ever go to a number whose " +
          "marketing box was ticked.",
      },
      {
        term: "What the non-marketing messages are",
        detail:
          `Confirming the ${support.callName} you booked, reminding you of it, and telling you if the ` +
          "time changes. Nothing promotional.",
      },
      {
        term: "What the marketing messages are",
        detail:
          "Following up on your enquiry and occasional offers. These may be sent by autodialer. " +
          "Consent to receive them is not a condition of any purchase.",
      },
      {
        term: "How you join",
        detail:
          "By checking a box on a form on this site and submitting your mobile number. Both boxes " +
          "are optional and start unchecked — every form here can be submitted without either, " +
          "and we do not text a number that did not opt in.",
      },
      {
        term: "Age",
        detail: SMS_AGE_REQUIREMENT,
      },
      {
        term: "Message frequency",
        detail:
          "Message frequency varies. In practice this is a handful of messages around a " +
          "scheduled call and, if you opted into marketing, occasional messages after that.",
      },
      {
        term: "Cost",
        detail:
          "There is no charge from us for the messages. Message and data rates may apply — " +
          "your mobile carrier's plan governs what you pay to send and receive them.",
      },
      {
        term: "How to stop",
        detail:
          "Reply STOP to any message to opt out. You will get one confirmation that you have " +
          "been unsubscribed, and no further messages after it. Reply START to rejoin, or opt in " +
          "again through a form on this site.",
      },
      {
        term: "How to get help",
        detail: reach
          ? `Reply HELP to any message, or contact us at ${reach}.`
          : "Reply HELP to any message.",
      },
      {
        term: "Carriers",
        detail:
          "Supported on major U.S. carriers. Carriers are not liable for delayed or " +
          "undelivered messages, and delivery is not guaranteed.",
      },
      {
        term: "Your data",
        detail: MOBILE_DATA_NO_SHARING,
      },
    ],
  };
}
