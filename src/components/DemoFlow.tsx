"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Script from "next/script";
import type { DemoFlowProps } from "@/lib/demo";
import { trackLeadConversion } from "@/lib/conversion";
import type { SmsConsentValues } from "@/lib/consent";
import { readAttribution } from "@/lib/attributionClient";
import {
  schedulerEmbedScript,
  schedulerWidgetId,
  withSchedulerPrefill,
} from "@/lib/scheduler";
import BookingConversion from "./BookingConversion";
import SmsConsentFields from "./SmsConsentFields";

/*
 * The "Book a demo" funnel, in three steps:
 *
 *   1. contact  — name, company, email, phone, the two SMS consents. On
 *                 submit the lead is sent to the CRM at once, so someone who
 *                 stops after this step is still a lead.
 *   2. context  — optional multiple choice plus a free-text note. "Skip"
 *                 moves on without sending anything more.
 *   3. book     — the GHL calendar, prefilled, with a "Not now" way out.
 *
 * No answer gates anything; the calendar link comes back from the contact
 * post. Inputs keep their `name` attributes (name, company, email, phone):
 * GHL's external tracking script (GhlTracking.tsx) reads forms by them.
 *
 * Renders on dark sections only; the caller supplies `data-dark`.
 */

type Stage = "contact" | "context" | "book" | "later";
type ContactField = "name" | "company" | "phone" | "email";

// Phone last: the SMS consent boxes must sit directly below the number.
const CONTACT_ORDER: ContactField[] = ["name", "company", "email", "phone"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(field: ContactField, raw: string): string | null {
  const value = raw.trim();
  switch (field) {
    case "name":
      return value ? null : "Name is required.";
    case "company":
      return value ? null : "Company is required.";
    case "phone":
      if (!value) return "Phone is required.";
      return value.replace(/\D/g, "").length < 10
        ? "Enter a phone number with at least 10 digits."
        : null;
    case "email":
      if (!value) return "Email is required.";
      return EMAIL_RE.test(value) ? null : "Enter an email address like name@company.com.";
  }
}

function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

const inputBase =
  "mt-2 w-full min-h-[44px] rounded-md border bg-graphite px-4 py-2 text-[17px] text-paper";
const card =
  "rounded-xl border border-white/15 bg-graphite p-6 outline-none motion-safe:animate-[qualify-card_240ms_ease-out] md:p-8";

export function DemoFlow({ flow }: { flow: DemoFlowProps }) {
  const uid = useId();
  const [stage, setStage] = useState<Stage>("contact");
  const [values, setValues] = useState<Record<ContactField, string>>({
    name: "",
    company: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [smsConsent, setSmsConsent] = useState<SmsConsentValues>({
    transactional: false,
    marketing: false,
  });
  const [website, setWebsite] = useState(""); // honeypot
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  const embedScript = useMemo(() => (link ? schedulerEmbedScript(link) : null), [link]);
  const widgetId = useMemo(() => (link ? schedulerWidgetId(link) : null), [link]);

  const refs = useRef<Record<ContactField, HTMLInputElement | null>>({
    name: null,
    company: null,
    phone: null,
    email: null,
  });
  const stageRef = useRef<HTMLDivElement | null>(null);
  const mounted = useRef(false);
  const cancelConversion = useRef<() => void>(() => {});
  useEffect(() => () => cancelConversion.current(), []);

  // Each new step takes focus (not on first mount: never steal it from the page).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const node = stageRef.current;
    if (!node) return;
    node.focus({ preventScroll: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }, [stage]);

  function payload(demoStage: "contact" | "context") {
    return {
      demoStage,
      name: values.name.trim(),
      company: values.company.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      vertical: flow.slug,
      website,
      smsConsentTransactional: smsConsent.transactional,
      smsConsentMarketing: smsConsent.marketing,
      attribution: readAttribution(),
      ...(demoStage === "context" ? { answers, notes: notes.trim() } : {}),
    };
  }

  async function post(body: object): Promise<{ ok: boolean; data: Record<string, unknown> }> {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let data: Record<string, unknown> = {};
    try {
      const parsed: unknown = await res.json();
      if (parsed && typeof parsed === "object") data = parsed as Record<string, unknown>;
    } catch {
      // keep the empty object
    }
    return { ok: res.ok, data };
  }

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setServerError(null);
    const next: Partial<Record<ContactField, string>> = {};
    for (const field of CONTACT_ORDER) {
      const message = validateContact(field, values[field]);
      if (message) next[field] = message;
    }
    if (Object.keys(next).length) {
      setErrors(next);
      const first = CONTACT_ORDER.find((field) => next[field]);
      if (first) refs.current[first]?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const { ok, data } = await post(payload("contact"));
      if (!ok) {
        setServerError(
          typeof data.message === "string" ? data.message : "Something went wrong on our end. Please try again.",
        );
        return;
      }
      cancelConversion.current = trackLeadConversion("form");
      const scheduling = typeof data.schedulingLink === "string" ? data.schedulingLink : null;
      setLink(
        scheduling
          ? withSchedulerPrefill(scheduling, { name: values.name, email: values.email, phone: values.phone })
          : null,
      );
      setStage("context");
    } catch {
      setServerError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitContext(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    // Nothing answered: nothing to send.
    if (!Object.keys(answers).length && !notes.trim()) {
      setStage("book");
      return;
    }
    setSubmitting(true);
    try {
      // Best effort: the lead is already in the CRM, so a failure here
      // never stops the visitor from booking.
      await post(payload("context"));
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
      setStage("book");
    }
  }

  function setContact(field: ContactField, value: string) {
    setValues((prev) => ({ ...prev, [field]: field === "phone" ? formatPhone(value) : value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function textField(
    field: ContactField,
    label: string,
    type: "text" | "tel" | "email",
    autoComplete: string,
    extra?: { inputMode?: "tel"; placeholder?: string },
  ) {
    const error = errors[field];
    const id = `${uid}-${field}`;
    return (
      <div>
        <label htmlFor={id} className="eyebrow block text-[12px] text-on-dark">
          {label}
        </label>
        <input
          ref={(el) => {
            refs.current[field] = el;
          }}
          id={id}
          name={field}
          type={type}
          autoComplete={autoComplete}
          inputMode={extra?.inputMode}
          placeholder={extra?.placeholder}
          value={values[field]}
          onChange={(e) => setContact(field, e.target.value)}
          onBlur={
            field === "email"
              ? () => setValues((prev) => ({ ...prev, email: prev.email.trim().toLowerCase() }))
              : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} placeholder:text-fog ${error ? "border-orange" : "border-white/15"}`}
        />
        {error ? (
          <p id={`${id}-error`} className="mt-1.5 text-[14px] text-orange">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const steps = ["contact", "context", "book"] as const;
  const stepIndex = stage === "later" ? 2 : steps.indexOf(stage);
  const progress = (
    <div aria-hidden="true" className="mb-6 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-orange motion-safe:transition-[width] motion-safe:duration-300"
        style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
      />
    </div>
  );

  if (stage === "book" || stage === "later") {
    return (
      <div ref={stageRef} tabIndex={-1} className="outline-none">
        {progress}
        {stage === "later" ? (
          <div className={card}>
            <h2 className="display text-[26px] text-paper md:text-[32px]">{flow.laterHeading}</h2>
            <p className="mt-3 max-w-[60ch] text-[17px] text-on-dark">{flow.laterBody}</p>
          </div>
        ) : link ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="display text-[26px] text-paper md:text-[32px]">{flow.bookHeading}</h2>
                <p className="mt-3 max-w-[60ch] text-[17px] text-on-dark">{flow.bookBody}</p>
              </div>
              <button
                type="button"
                onClick={() => setStage("later")}
                className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-6 text-[15px] font-medium text-on-dark hover:border-white/45 hover:text-paper"
              >
                {flow.notNowLabel}
              </button>
            </div>
            <BookingConversion schedulingLink={link} />
            <iframe
              id={widgetId ?? undefined}
              src={link}
              title="Scheduling calendar"
              loading="lazy"
              allow="payment"
              scrolling="no"
              className="mt-8 min-h-[700px] w-full rounded-md border border-white/15 bg-paper"
            />
            {embedScript ? <Script src={embedScript} strategy="afterInteractive" /> : null}
          </>
        ) : (
          <div className={card}>
            <p className="text-[17px] text-on-dark">{flow.fallbackBody}</p>
          </div>
        )}
      </div>
    );
  }

  if (stage === "context") {
    return (
      <form onSubmit={submitContext} noValidate className="max-w-[620px]">
        {progress}
        <div ref={stageRef} tabIndex={-1} className={card}>
          <h2 className="display text-[22px] text-paper md:text-[26px]">{flow.contextHeading}</h2>
          <p className="mt-2 text-[15px] text-on-dark">{flow.contextSub}</p>
          <div className="mt-6 space-y-6">
            {flow.questions.map((question) => (
              <fieldset key={question.key} className="min-w-0 border-0 p-0">
                <legend className="text-[16px] font-medium text-paper">{question.label}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.options.map((option, i) => {
                    const id = `${uid}-${question.key}-${i}`;
                    const checked = answers[question.key] === option;
                    return (
                      <label
                        key={option}
                        htmlFor={id}
                        className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-4 text-[15px] text-paper motion-safe:transition-colors ${
                          checked ? "border-orange bg-orange/15" : "border-white/15 bg-ink hover:border-white/40"
                        }`}
                      >
                        <input
                          id={id}
                          type="radio"
                          name={question.key}
                          value={option}
                          checked={checked}
                          onChange={() => setAnswers((prev) => ({ ...prev, [question.key]: option }))}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            <div>
              <label htmlFor={`${uid}-notes`} className="text-[16px] font-medium text-paper">
                {flow.notesLabel}
              </label>
              <textarea
                id={`${uid}-notes`}
                name="notes"
                rows={3}
                maxLength={1500}
                placeholder={flow.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`${inputBase} border-white/15 placeholder:text-fog`}
              />
            </div>
          </div>
          <div className="mt-7 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setStage("book")}
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-6 text-[15px] font-medium text-on-dark hover:border-white/45 hover:text-paper"
            >
              {flow.skipLabel}
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 text-[17px] disabled:opacity-70 md:flex-none">
              {submitting ? flow.submittingLabel : flow.contextSubmitLabel}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submitContact} noValidate className="max-w-[620px]">
      {/* Honeypot: off-screen, not display:none */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      {progress}
      <div ref={stageRef} tabIndex={-1} className={card}>
        <h2 className="display text-[22px] text-paper md:text-[26px]">{flow.contactHeading}</h2>
        <p className="mt-2 text-[15px] text-on-dark">{flow.contactSub}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {textField("name", flow.nameLabel, "text", "name")}
          {textField("company", flow.companyLabel, "text", "organization")}
          {textField("email", flow.emailLabel, "email", "email", { placeholder: "name@company.com" })}
          {textField("phone", flow.phoneLabel, "tel", "tel", { inputMode: "tel", placeholder: "(405) 555-0123" })}
        </div>
        {/* Directly below the phone field: carriers want the consent
            language where the number is typed. Neither box is required. */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <SmsConsentFields idPrefix={uid} consent={flow.smsConsent} values={smsConsent} onChange={setSmsConsent} tone="dark" />
        </div>
        {serverError ? (
          <p role="alert" className="mt-5 text-[14px] text-orange">
            {serverError}
          </p>
        ) : null}
        <div className="mt-7">
          <button type="submit" disabled={submitting} className="btn-primary w-full text-[17px] disabled:opacity-70 md:w-auto">
            {submitting ? flow.submittingLabel : flow.contactSubmitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export default DemoFlow;
