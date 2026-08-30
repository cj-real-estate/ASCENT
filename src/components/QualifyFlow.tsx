"use client";

import { useEffect, useRef, useState } from "react";
import type { QualifyFlowProps } from "@/lib/qualify";
import { trackLeadConversion } from "@/lib/conversion";
import CalendlyConversion from "./CalendlyConversion";

/*
 * The ICP gate as a multi-step wizard: one card per question, contact
 * details on the final card, a progress bar throughout. Questions come
 * FIRST and contact LAST on purpose — painless multiple-choice builds
 * momentum before anyone is asked for a phone number.
 *
 * This component never sees the `qualifies` flags or the scheduling link —
 * its props come pre-stripped by toQualifyFlowProps (src/lib/qualify.ts),
 * because client props are serialized into the page source. The verdict
 * and, only on a pass, the scheduling link arrive in the /api/book
 * response; the server is the sole authority on who gets the calendar.
 *
 * Both branches POST the identical payload, so the owner gets the lead
 * either way; the verdict only decides whether the calendar appears.
 * Nothing in the cards hints at which answers qualify.
 *
 * Renders on dark (ink) sections only; the caller supplies `data-dark`.
 */

type Stage = "form" | "pass" | "declined";

type ContactField = "name" | "company" | "phone" | "email";

const CONTACT_ORDER: ContactField[] = ["name", "company", "phone", "email"];

// Same rules as /api/book — kept identical on purpose.
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
      if (value.replace(/\D/g, "").length < 10) {
        return "Enter a phone number with at least 10 digits.";
      }
      return null;
    case "email":
      if (!value) return "Email is required.";
      if (!EMAIL_RE.test(value)) {
        return "Enter an email address like name@company.com.";
      }
      return null;
  }
}

/*
 * Format-as-you-type US phone: digits in, "(405) 555-0123" out. An 11-digit
 * number starting with 1 drops the country code. Formatting is cosmetic —
 * the server only counts digits.
 */
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

export function QualifyFlow({ flow }: { flow: QualifyFlowProps }) {
  const questions = flow.questions;
  // Steps: one per question, then the contact card.
  const totalSteps = questions.length + 1;
  const contactStep = questions.length;

  const [stage, setStage] = useState<Stage>("form");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<ContactField, string>>({
    name: "",
    company: "",
    phone: "",
    email: "",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>(
    {},
  );
  const [stepError, setStepError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Handed back by /api/book on a qualifying verdict; null otherwise. This
  // is the only way the URL ever reaches the page.
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);

  const contactRefs = useRef<Record<ContactField, HTMLInputElement | null>>({
    name: null,
    company: null,
    phone: null,
    email: null,
  });
  const cardRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  // trackLeadConversion polls for gtag and hands back a canceller; drop it
  // if the component unmounts before the tag shows up.
  const cancelConversion = useRef<() => void>(() => {});
  useEffect(
    () => () => {
      cancelConversion.current();
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  // Focus follows the wizard: each new card takes focus (after the mount
  // render, so the first card never steals it from the page).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (stage === "form") cardRef.current?.focus({ preventScroll: true });
  }, [step, stage]);

  // Move to the result the moment it replaces the form.
  useEffect(() => {
    if (stage === "form") return;
    const node = resultRef.current;
    if (!node) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    node.focus({ preventScroll: true });
    node.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [stage]);

  function goTo(next: number) {
    setStepError(null);
    setServerError(null);
    setStep(Math.max(0, Math.min(next, contactStep)));
  }

  function handleAnswer(key: string, label: string, index: number) {
    setAnswers((prev) => ({ ...prev, [key]: label }));
    setStepError(null);
    // Auto-advance, typeform-style: picking an answer moves the wizard on
    // after a beat. Back always returns; nothing is locked in until submit.
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      // Only advance if this card is still the one on screen.
      setStep((current) => (current === index ? current + 1 : current));
    }, 250);
  }

  function handleContactChange(field: ContactField, value: string) {
    setValues((prev) => ({
      ...prev,
      [field]: field === "phone" ? formatPhone(value) : value,
    }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validateEmailOnBlur() {
    const cleaned = values.email.trim().toLowerCase();
    if (cleaned !== values.email) {
      setValues((prev) => ({ ...prev, email: cleaned }));
    }
    if (cleaned && !EMAIL_RE.test(cleaned)) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter an email address like name@company.com.",
      }));
    }
  }

  async function submitLead() {
    setServerError(null);

    const nextErrors: Partial<Record<ContactField, string>> = {};
    for (const field of CONTACT_ORDER) {
      const message = validateContact(field, values[field]);
      if (message) nextErrors[field] = message;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const first = CONTACT_ORDER.find((field) => nextErrors[field]);
      if (first) contactRefs.current[first]?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          vertical: flow.slug,
          website,
          answers,
        }),
      });
      if (res.ok) {
        // The lead is away either way; the server's verdict only decides
        // which screen the visitor lands on. A verdict-less response (mid-
        // deploy) lands on the pass fallback — honest in both directions.
        let qualified = true;
        let link: string | null = null;
        try {
          const data: unknown = await res.json();
          if (data && typeof data === "object") {
            const d = data as { qualified?: unknown; schedulingLink?: unknown };
            if (d.qualified === false) qualified = false;
            if (typeof d.schedulingLink === "string") link = d.schedulingLink;
          }
        } catch {
          // keep the defaults
        }
        cancelConversion.current = trackLeadConversion("form");
        setSchedulingLink(qualified ? link : null);
        setStage(qualified ? "pass" : "declined");
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
        // keep the fallback message
      }
      setServerError(message);
      setSubmitting(false);
    } catch {
      setServerError(
        "Couldn't reach the server. Check your connection and try again.",
      );
      setSubmitting(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    // Enter on a question card advances; only the contact card submits.
    if (step < contactStep) {
      const question = questions[step];
      if (!answers[question.key]) {
        setStepError("Choose an option.");
        return;
      }
      goTo(step + 1);
      return;
    }
    void submitLead();
  }

  function textField(
    field: ContactField,
    label: string,
    type: "text" | "tel" | "email",
    autoComplete: string,
    extra?: { inputMode?: "tel"; placeholder?: string; onBlur?: () => void },
  ) {
    const error = errors[field];
    const id = `qualify-${field}`;
    return (
      <div>
        <label htmlFor={id} className="eyebrow block text-[12px] text-on-dark">
          {label}
        </label>
        <input
          ref={(el) => {
            contactRefs.current[field] = el;
          }}
          id={id}
          name={field}
          type={type}
          autoComplete={autoComplete}
          inputMode={extra?.inputMode}
          placeholder={extra?.placeholder}
          onBlur={extra?.onBlur}
          value={values[field]}
          onChange={(e) => handleContactChange(field, e.target.value)}
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

  /*
   * The pass and decline headings render as <h2>: the page that hosts this
   * flow owns its single <h1>.
   */
  if (stage === "pass") {
    return (
      <div ref={resultRef} tabIndex={-1} className="outline-none">
        <h2 className="display text-[26px] text-paper md:text-[34px]">
          {flow.passHeading}
        </h2>
        <p className="mt-4 max-w-[68ch] text-[17px] text-on-dark">
          {flow.passBody}
        </p>
        {schedulingLink ? (
          <>
            {/* Two conversion signals are live on this path: the gate submit
                reports "form", and this reports "calendly" if they go on to
                book. */}
            <CalendlyConversion />
            {/* 700px is Calendly's own minimum for the inline calendar. */}
            <iframe
              src={schedulingLink}
              title="Scheduling calendar"
              loading="lazy"
              className="mt-10 min-h-[700px] w-full rounded-md border border-white/15 bg-paper"
            />
          </>
        ) : (
          <p className="mt-6 max-w-[68ch] text-[17px] text-on-dark">
            {flow.passFallbackBody}
          </p>
        )}
      </div>
    );
  }

  if (stage === "declined") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        className="max-w-[68ch] rounded-md border border-white/15 bg-graphite p-6 outline-none md:p-8"
      >
        <h2 className="display text-[26px] text-paper md:text-[34px]">
          {flow.declineHeading}
        </h2>
        <p className="mt-4 text-[17px] text-on-dark">{flow.declineBody}</p>
      </div>
    );
  }

  const onContact = step === contactStep;
  const question = onContact ? null : questions[step];
  const progressText = flow.stepLabel
    .replace("{n}", String(step + 1))
    .replace("{total}", String(totalSteps));

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-[620px]"
    >
      {/* Honeypot — visually hidden off-screen, not display:none */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="qualify-website">Website</label>
        <input
          id="qualify-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Progress: mono step counter + orange bar. The bar is decorative;
          the counter carries the information and is announced on change. */}
      <div className="flex items-baseline justify-between gap-4">
        <p
          aria-live="polite"
          className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-fog"
        >
          {progressText}
        </p>
      </div>
      <div
        aria-hidden="true"
        className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-orange motion-safe:transition-[width] motion-safe:duration-300"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* The card. keyed by step so each card mounts fresh (and animates
          in where motion is allowed). */}
      <div
        key={step}
        ref={cardRef}
        tabIndex={-1}
        className="mt-6 rounded-xl border border-white/15 bg-graphite p-6 outline-none motion-safe:animate-[qualify-card_240ms_ease-out] md:p-8"
      >
        {onContact ? (
          <>
            <h3 className="display text-[22px] text-paper md:text-[26px]">
              {flow.contactHeading}
            </h3>
            <p className="mt-2 text-[15px] text-on-dark">{flow.contactSub}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {textField("name", flow.nameLabel, "text", "name")}
              {textField("company", flow.companyLabel, "text", "organization")}
              {textField("phone", flow.phoneLabel, "tel", "tel", {
                inputMode: "tel",
                placeholder: "(405) 555-0123",
              })}
              {textField("email", flow.emailLabel, "email", "email", {
                placeholder: "name@company.com",
                onBlur: validateEmailOnBlur,
              })}
            </div>
          </>
        ) : question ? (
          <fieldset
            role="radiogroup"
            aria-labelledby={`qualify-${question.key}-label`}
            aria-invalid={stepError ? true : undefined}
            aria-describedby={
              stepError ? `qualify-${question.key}-error` : undefined
            }
            className="min-w-0 border-0 p-0"
          >
            <legend
              id={`qualify-${question.key}-label`}
              className="block max-w-[62ch] font-mono text-[16px] font-medium leading-[1.55] text-paper md:text-[18px]"
            >
              {question.label}
            </legend>
            <div
              className={`mt-5 space-y-3 border-l-2 pl-4 ${
                stepError ? "border-orange" : "border-transparent"
              }`}
            >
              {question.options.map((option, optionIndex) => {
                const id = `qualify-${question.key}-${optionIndex}`;
                const checked = answers[question.key] === option;
                return (
                  <label
                    key={option}
                    htmlFor={id}
                    className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md border bg-ink px-4 py-3 text-[17px] text-paper motion-safe:transition-colors ${
                      checked
                        ? "border-orange"
                        : "border-white/15 hover:border-white/40"
                    }`}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={question.key}
                      value={option}
                      checked={checked}
                      onChange={() =>
                        handleAnswer(question.key, option, step)
                      }
                      className="h-5 w-5 shrink-0 accent-orange"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
            {stepError ? (
              <p
                id={`qualify-${question.key}-error`}
                className="mt-3 text-[14px] text-orange"
              >
                {stepError}
              </p>
            ) : null}
          </fieldset>
        ) : null}

        {serverError ? (
          <p role="alert" className="mt-5 text-[14px] text-orange">
            {serverError}
          </p>
        ) : null}

        <div className="mt-7 flex items-center gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-6 text-[15px] font-medium text-on-dark hover:border-white/45 hover:text-paper"
            >
              {flow.backLabel}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1 text-[17px] disabled:opacity-70 md:flex-none"
          >
            {onContact
              ? submitting
                ? flow.submittingLabel
                : flow.submitLabel
              : flow.continueLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export default QualifyFlow;
