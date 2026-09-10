"use client";

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
 *   1. Both start UNCHECKED. The caller owns the state and must initialise
 *      both to false — there is no `defaultChecked` here to get wrong.
 *   2. Neither is required. No `required`, and no caller validates either:
 *      the form submits identically whichever, or neither, is ticked.
 *   3. They are INDEPENDENT. Ticking the reminder box must never tick or
 *      imply the marketing one; they are separate permissions and are
 *      recorded and filtered on separately.
 *   4. Both sentences are quoted wording from content/compliance.ts, and
 *      the links close them as the carrier template requires.
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

function Box({
  id,
  label,
  checked,
  onChange,
  tone,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  tone: ConsentTone;
}) {
  const t = T[tone];
  return (
    <div className="flex gap-3">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
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
  values: SmsConsentValues;
  onChange: (next: SmsConsentValues) => void;
  tone?: ConsentTone;
}) {
  const t = T[tone];
  return (
    <div>
      <p className={`text-[12px] ${t.note}`}>{consent.optionalNote}</p>
      <div className="mt-4 space-y-4">
        <Box
          id={`${idPrefix}-sms-consent-transactional`}
          label={consent.transactionalLabel}
          checked={values.transactional}
          onChange={(next) => onChange({ ...values, transactional: next })}
          tone={tone}
        />
        <Box
          id={`${idPrefix}-sms-consent-marketing`}
          label={consent.marketingLabel}
          checked={values.marketing}
          onChange={(next) => onChange({ ...values, marketing: next })}
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
