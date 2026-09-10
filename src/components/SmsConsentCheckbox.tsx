"use client";

import type { SmsConsentProps } from "@/lib/consent";

/*
 * The SMS opt-in box that sits beside the phone field on every form.
 *
 * Three things about it are compliance, not design, and A2P 10DLC campaign
 * review rejects the campaign if any of them changes:
 *
 *   1. It starts UNCHECKED. The caller owns the state and must initialise
 *      it to false — there is no `defaultChecked` here to get wrong.
 *   2. It is NEVER required. No `required`, and no caller validates it:
 *      the form submits identically whether or not it is ticked.
 *   3. The sentence is quoted from the carrier template verbatim
 *      (content/compliance.ts) and closes with real Privacy Policy and
 *      Terms links, which must resolve on whichever host served the page.
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
  },
  dark: {
    box: "border-white/25 bg-graphite",
    text: "text-on-dark",
    link: "text-orange",
    note: "text-fog",
  },
} as const;

export type ConsentTone = keyof typeof T;

export default function SmsConsentCheckbox({
  id,
  consent,
  checked,
  onChange,
  tone = "dark",
}: {
  id: string;
  consent: SmsConsentProps;
  checked: boolean;
  onChange: (next: boolean) => void;
  tone?: ConsentTone;
}) {
  const t = T[tone];
  return (
    <div>
      <div className="flex gap-3">
        <input
          id={id}
          name="smsConsent"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className={`mt-[3px] h-5 w-5 shrink-0 cursor-pointer rounded border accent-orange ${t.box}`}
        />
        <label htmlFor={id} className={`cursor-pointer text-[13px] leading-relaxed ${t.text}`}>
          {consent.label}{" "}
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
        </label>
      </div>
      <p className={`mt-2 pl-8 text-[12px] ${t.note}`}>{consent.optionalNote}</p>
    </div>
  );
}
