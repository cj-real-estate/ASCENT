"use client";

import { useId, useState } from "react";
import type { SmsConsentProps } from "@/lib/consent";
import SmsConsentCheckbox from "./SmsConsentCheckbox";

/*
 * The form on /sms — a name, a mobile number, an optional email, and the
 * consent box. Deliberately one screen with the phone field visible on
 * arrival: the ICP gate collects a number too, but puts it behind six
 * question cards, and A2P 10DLC campaign review has to be able to SEE the
 * field and the consent language without clicking through a wizard.
 *
 * Light ground (this page is on paper, unlike the gate). Posts to
 * /api/sms-optin. The consent box is optional here as everywhere: an
 * unchecked submit is recorded as a contact request with consent explicitly
 * not given, and nothing texts that number.
 */

type Stage = "form" | "done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
  "mt-2 w-full min-h-[48px] rounded-md border bg-paper px-4 py-2 text-[17px] text-ink placeholder:text-fog";

function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function SmsOptInForm({
  consent,
  labels,
}: {
  consent: SmsConsentProps;
  labels: {
    name: string;
    phone: string;
    email: string;
    emailNote: string;
    submit: string;
    submitting: string;
    doneConsented: string;
    doneNotConsented: string;
  };
}) {
  const uid = useId();
  const [stage, setStage] = useState<Stage>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  /* Unchecked on arrival, and no submit path validates it. */
  const [smsConsent, setSmsConsent] = useState(false);
  const [consented, setConsented] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setServerError(null);

    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!phone.trim()) next.phone = "Mobile number is required.";
    else if (phone.replace(/\D/g, "").length < 10) {
      next.phone = "Enter a mobile number with at least 10 digits.";
    }
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      next.email = "Enter an email address like name@company.com.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/sms-optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          website,
          smsConsent,
        }),
      });
      if (res.ok) {
        setConsented(smsConsent);
        setStage("done");
        return;
      }
      let message = "Something went wrong on our end. Please try again.";
      try {
        const data: unknown = await res.json();
        if (
          data &&
          typeof data === "object" &&
          "message" in data &&
          typeof (data as { message: unknown }).message === "string"
        ) {
          message = (data as { message: string }).message;
        }
      } catch {
        // keep the fallback
      }
      setServerError(message);
      setSubmitting(false);
    } catch {
      setServerError("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  function field(
    id: string,
    label: string,
    type: "text" | "tel" | "email",
    value: string,
    onChange: (next: string) => void,
    autoComplete: string,
    error?: string,
    extra?: { placeholder?: string; inputMode?: "tel"; note?: string },
  ) {
    return (
      <div>
        <label htmlFor={id} className="eyebrow block text-[12px] text-slate">
          {label}
        </label>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          inputMode={extra?.inputMode}
          placeholder={extra?.placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : extra?.note ? `${id}-note` : undefined}
          className={`${inputBase} ${error ? "border-orange-deep" : "border-slate/30"}`}
        />
        {extra?.note && !error ? (
          <p id={`${id}-note`} className="mt-1.5 text-[13px] text-slate">
            {extra.note}
          </p>
        ) : null}
        {error ? (
          <p id={`${id}-error`} className="mt-1.5 text-[14px] text-orange-deep">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div
        role="status"
        className="max-w-[60ch] rounded-md border border-slate/25 bg-surface p-6 md:p-8"
      >
        <p className="text-[17px] leading-relaxed text-ink">
          {consented ? labels.doneConsented : labels.doneNotConsented}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-[560px]">
      {/* Honeypot — off-screen, not display:none */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="grid gap-5">
        {field(`${uid}-name`, labels.name, "text", name, setName, "name", errors.name)}
        {field(
          `${uid}-phone`,
          labels.phone,
          "tel",
          phone,
          (next) => setPhone(formatPhone(next)),
          "tel",
          errors.phone,
          { placeholder: "(405) 555-0123", inputMode: "tel" },
        )}
        {field(
          `${uid}-email`,
          labels.email,
          "email",
          email,
          setEmail,
          "email",
          errors.email,
          { placeholder: "name@company.com", note: labels.emailNote },
        )}
      </div>

      <div className="mt-6 border-t border-slate/20 pt-5">
        <SmsConsentCheckbox
          id={`${uid}-sms-consent`}
          consent={consent}
          checked={smsConsent}
          onChange={setSmsConsent}
          tone="light"
        />
      </div>

      {serverError ? (
        <p role="alert" className="mt-5 text-[14px] text-orange-deep">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mt-7 w-full px-8 text-[17px] disabled:opacity-70 sm:w-auto"
      >
        {submitting ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
