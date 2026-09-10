import type { SmsConsentProps, SmsConsentValues } from "@/lib/consent";

/*
 * The two SMS consent boxes that sit directly below the phone field on
 * every form: non-marketing first (confirmations, reminders, scheduling
 * updates), marketing second. The Privacy Policy and Terms links render
 * once beneath the pair and apply to both.
 *
 * Four things here are compliance, not design, and A2P 10DLC campaign
 * review rejects the campaign if any of them changes:
 *
 *   1. Both start UNCHECKED — controlled callers must initialise both to
 *      false, and the uncontrolled mode below renders no `checked` at all.
 *   2. Neither is required. No `required`, and no caller validates either:
 *      the form submits identically whichever, or neither, is ticked.
 *   3. They are INDEPENDENT. Ticking the reminder box must never tick or
 *      imply the marketing one; they are separate permissions and are
 *      recorded and filtered on separately.
 *   4. Both sentences are quoted wording from content/compliance.ts, and
 *      the links close them as the carrier template requires.
 *
 * TWO MODES, one markup. Pass `onChange` and the boxes are controlled, for
 * the JavaScript forms (the gate, /sms). Omit it and they are plain
 * uncontrolled inputs carrying the canonical field names, which is what
 * /sms-opt-in needs: that page is server-rendered and its form posts
 * natively, so the boxes have to work with no JavaScript at all. Keeping
 * one component means the wording, order and links cannot drift between
 * the two.
 *
 * Deliberately NOT marked "use client": a client component may import this
 * (it then compiles into that bundle), and a server component may render
 * it as long as no handler is passed.
 *
 * Renders on both grounds — the gate is on ink, /sms is on paper — so the
 * two palettes are a lookup rather than two components.
 */

const T = {
  light: {
    box: "border-slate/40 bg-paper",
    text: "text-slate",
    link: "text-orange-deep",
    note: "text-slate",
    rule: "border-slate/20",
  },
  dark: {
    box: "border-white/25 bg-graphite",
    text: "text-on-dark",
    link: "text-orange",
    note: "text-fog",
    rule: "border-white/10",
  },
} as const;

export type ConsentTone = keyof typeof T;

/** The names the API reads, native form post or JSON alike. */
export const CONSENT_FIELD_NAMES = {
  transactional: "smsConsentTransactional",
  marketing: "smsConsentMarketing",
} as const;

/** The value a ticked box submits natively; the API tests for presence. */
export const CONSENT_CHECKED_VALUE = "yes";

function Box({
  id,
  name,
  label,
  checked,
  onChange,
  tone,
}: {
  id: string;
  name: string;
  label: string;
  /** Controlled mode only — omitted together with `onChange`. */
  checked?: boolean;
  onChange?: (next: boolean) => void;
  tone: ConsentTone;
}) {
  const t = T[tone];
  /* Controlled only when a handler came with it: React warns about a
   * `checked` input with no `onChange`, and an uncontrolled box needs a
   * `value` instead so a native post is readable. Nothing else differs. */
  const control =
    onChange !== undefined
      ? {
          checked: checked === true,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.checked),
        }
      : { value: CONSENT_CHECKED_VALUE };
  return (
    <div className="flex gap-3">
      <input
        id={id}
        name={name}
        type="checkbox"
        {...control}
        className={`mt-[3px] h-5 w-5 shrink-0 cursor-pointer rounded border accent-orange ${t.box}`}
      />
      <label htmlFor={id} className={`cursor-pointer text-[13px] leading-relaxed ${t.text}`}>
        {label}
      </label>
    </div>
  );
}

export default function SmsConsentFields({
  idPrefix,
  consent,
  values,
  onChange,
  tone = "dark",
}: {
  /** Unique per form instance — the gate renders twice per page. */
  idPrefix: string;
  consent: SmsConsentProps;
  /** Controlled mode only. */
  values?: SmsConsentValues;
  /** Omit for uncontrolled, no-JavaScript native submission. */
  onChange?: (next: SmsConsentValues) => void;
  tone?: ConsentTone;
}) {
  const t = T[tone];
  const current = values ?? { transactional: false, marketing: false };
  return (
    <div>
      <p className={`text-[12px] ${t.note}`}>{consent.optionalNote}</p>
      <div className="mt-4 space-y-4">
        <Box
          id={`${idPrefix}-sms-consent-transactional`}
          name={CONSENT_FIELD_NAMES.transactional}
          label={consent.transactionalLabel}
          {...(onChange
            ? {
                checked: current.transactional,
                onChange: (next: boolean) => onChange({ ...current, transactional: next }),
              }
            : {})}
          tone={tone}
        />
        <Box
          id={`${idPrefix}-sms-consent-marketing`}
          name={CONSENT_FIELD_NAMES.marketing}
          label={consent.marketingLabel}
          {...(onChange
            ? {
                checked: current.marketing,
                onChange: (next: boolean) => onChange({ ...current, marketing: next }),
              }
            : {})}
          tone={tone}
        />
      </div>
      {/* One links row under both boxes — it closes both consent
          sentences, per the carrier template. */}
      <p className={`mt-4 border-t pt-3 pl-8 text-[12px] ${t.rule} ${t.note}`}>
        <a
          href={consent.privacyHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 ${t.link}`}
        >
          {consent.privacyLabel}
        </a>
        <span aria-hidden="true"> | </span>
        <a
          href={consent.termsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 ${t.link}`}
        >
          {consent.termsLabel}
        </a>
      </p>
    </div>
  );
}
