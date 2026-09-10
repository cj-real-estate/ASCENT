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
 * Rules that survived a rejection somewhere and must not be "improved":
 *
 *   - The checkbox starts UNCHECKED and is NEVER required to submit.
 *     A pre-checked or mandatory box is a rejection on its own, and
 *     consent that is a condition of the form is not consent.
 *   - The consent sentence names the LEGAL entity, in the registered
 *     spelling, and says "at the number provided".
 *   - It carries all five disclosures: autodialer, not-a-condition,
 *     rates, frequency, HELP/STOP.
 *   - `MOBILE_DATA_NO_SHARING` appears verbatim in both privacy policies.
 *     Its absence is the single most common rejection cause.
 *   - Whatever the form says, the terms page must repeat: program name,
 *     frequency, rates, HELP/STOP and a support contact.
 *
 * If a carrier asks for different wording, change it HERE and it changes on
 * every form, policy and terms page at once. See docs/A2P-10DLC.md.
 */

/** The registered entity, in the spelling the consent language must use. */
export const LEGAL_ENTITY = "ASCENT CLIENT ACQUISITION SYSTEMS LLC";

/** Program name, as registered with the carriers and shown in the terms. */
export const SMS_PROGRAM_NAME = "Ascent Client Acquisition Systems alerts";

/**
 * The consent sentence, verbatim. The "[Privacy Policy] | [Terms]" pair
 * that closes the carrier's template is rendered as real links beside this
 * text rather than being pasted into it — see SmsConsentCheckbox.
 */
export const SMS_CONSENT_LABEL =
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

/** Link labels that close the consent line, per the carrier's template. */
export const SMS_CONSENT_PRIVACY_LINK_LABEL = "Privacy Policy";
export const SMS_CONSENT_TERMS_LINK_LABEL = "Terms";

/**
 * Said beside the box, never inside the consent sentence. The sentence is
 * quoted wording and does not get edited; this is the site telling a
 * visitor plainly that leaving the box alone costs them nothing.
 */
export const SMS_CONSENT_OPTIONAL_NOTE =
  "Optional. You can submit this form without checking it.";

/** What gets recorded alongside a lead as proof of consent. */
export const SMS_CONSENT_RECORD_LABEL = "SMS marketing consent";

/**
 * The SMS program, described for a terms page. Takes the domain's own
 * support contact so each site sends a reader to the mailbox that is
 * actually monitored for it.
 */
export interface SmsProgramTerms {
  programName: string;
  entity: string;
  items: { term: string; detail: string }[];
}

export function smsProgramTerms(support: {
  email: string | null;
  phone: string | null;
}): SmsProgramTerms {
  const contact = [support.email, support.phone].filter(Boolean).join(" or ");
  return {
    programName: SMS_PROGRAM_NAME,
    entity: LEGAL_ENTITY,
    items: [
      {
        term: "Program name",
        detail: `${SMS_PROGRAM_NAME}, operated by ${LEGAL_ENTITY}.`,
      },
      {
        term: "What you get",
        detail:
          "Marketing and informational text messages about the service you enquired about — " +
          "scheduling and confirming your call, following up on your enquiry, and occasional " +
          "offers. Messages may be sent by autodialer. Consent to receive them is not a " +
          "condition of any purchase.",
      },
      {
        term: "How you join",
        detail:
          "By checking the SMS consent box on a form on this site and submitting your mobile " +
          "number. The box is optional and starts unchecked — every form on this site can be " +
          "submitted without it, and we do not text a number that did not opt in.",
      },
      {
        term: "Message frequency",
        detail:
          "Message frequency varies. In practice this is a handful of messages around a " +
          "scheduled call and occasional messages after that.",
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
          "been unsubscribed, and no further marketing messages after it. Reply START to " +
          "rejoin, or opt in again through a form on this site.",
      },
      {
        term: "How to get help",
        detail: contact
          ? `Reply HELP to any message, or contact us at ${contact}.`
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
