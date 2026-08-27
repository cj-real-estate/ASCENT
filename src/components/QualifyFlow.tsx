"use client";

import { useEffect, useRef, useState } from "react";
import type { QualifyFlowProps } from "@/lib/qualify";
import { trackLeadConversion } from "@/lib/conversion";
import CalendlyConversion from "./CalendlyConversion";

/*
 * The ICP gate. One form, three states: the questions, then either the
 * scheduler (pass) or the decline card.
 *
 * This component never sees the `qualifies` flags or the scheduling link —
 * its props come pre-stripped by toQualifyFlowProps (src/lib/qualify.ts),
 * because client props are serialized into the page source. The verdict and,
 * only on a pass, the scheduling link arrive in the /api/book response; the
 * server is the sole authority on who gets the calendar.
 *
 * Both branches POST the identical payload to /api/book, so the owner gets
 * the lead by email either way. The branch decides one thing only: whether
 * the calendar appears. Nothing in the questions hints at which answers
 * qualify — no markers, no colors, no reordering.
 *
 * Renders on dark (ink) sections only; the caller supplies `data-dark`.
 */

type Stage = "form" | "pass" | "declined";

type ContactField = "name" | "company" | "phone" | "email";

const CONTACT_ORDER: ContactField[] = ["name", "company", "phone", "email"];

// Same rules as /api/book — kept identical on purpose.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s()\-.]+$/;

function validateContact(field: ContactField, raw: string): string | null {
  const value = raw.trim();
  switch (field) {
    case "name":
      return value ? null : "Name is required.";
    case "company":
      return value ? null : "Company is required.";
    case "phone":
      if (!value) return "Phone is required.";
      if (!PHONE_CHARS_RE.test(value) || value.replace(/\D/g, "").length < 10) {
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

const inputBase =
  "mt-2 w-full min-h-[44px] rounded-md border bg-graphite px-4 py-2 text-[17px] text-paper";

export function QualifyFlow({ flow }: { flow: QualifyFlowProps }) {
  const questions = flow.questions;

  const [stage, setStage] = useState<Stage>("form");
  // Handed back by /api/book on a qualifying verdict; null otherwise. This is
  // the only way the URL ever reaches the page.
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
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
  const [answerErrors, setAnswerErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const contactRefs = useRef<Record<ContactField, HTMLInputElement | null>>({
    name: null,
    company: null,
    phone: null,
    email: null,
  });
  // First radio of each group — the focus target when a question is unanswered.
  const questionRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const resultRef = useRef<HTMLDivElement | null>(null);

  // trackLeadConversion polls for gtag and hands back a canceller; drop it if
  // the component unmounts before the tag shows up.
  const cancelConversion = useRef<() => void>(() => {});
  useEffect(() => () => cancelConversion.current(), []);

  // Move to the result the moment it replaces the form, so the answer isn't
  // sitting above the fold behind a scroll the visitor has to guess at.
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

  function handleContactChange(field: ContactField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleAnswer(key: string, label: string) {
    setAnswers((prev) => ({ ...prev, [key]: label }));
    setAnswerErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setServerError(null);

    const nextErrors: Partial<Record<ContactField, string>> = {};
    for (const field of CONTACT_ORDER) {
      const message = validateContact(field, values[field]);
      if (message) nextErrors[field] = message;
    }
    const nextAnswerErrors: Record<string, string> = {};
    for (const question of questions) {
      if (!answers[question.key]) {
        nextAnswerErrors[question.key] = "Choose an option.";
      }
    }

    const hasErrors =
      Object.keys(nextErrors).length > 0 ||
      Object.keys(nextAnswerErrors).length > 0;
    if (hasErrors) {
      setErrors(nextErrors);
      setAnswerErrors(nextAnswerErrors);
      // Focus the first problem in reading order: contact fields, then
      // questions in the order the content module lists them.
      const firstContact = CONTACT_ORDER.find((field) => nextErrors[field]);
      if (firstContact) {
        contactRefs.current[firstContact]?.focus();
      } else {
        const firstQuestion = questions.find(
          (question) => nextAnswerErrors[question.key],
        );
        if (firstQuestion) questionRefs.current[firstQuestion.key]?.focus();
      }
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
        // which screen the visitor lands on. If a mid-deploy response
        // carries no verdict, land on the pass fallback ("you'll hear from
        // us") — honest in both directions, and it leaks nothing.
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

  function textField(
    field: ContactField,
    label: string,
    type: "text" | "tel" | "email",
    autoComplete: string,
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
          value={values[field]}
          onChange={(e) => handleContactChange(field, e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} ${error ? "border-orange" : "border-white/15"}`}
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
                reports "form" above, and this reports "calendly" if they go
                on to book. They are separate actions on separate keys — if
                Google Ads should only ever count one per visitor, drop this
                line rather than the one in the submit handler, since the
                decline branch is a lead too. */}
            <CalendlyConversion />
            {/* 700px is Calendly's own minimum for the inline calendar —
                below it the widget scrolls internally on mobile. */}
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
        <p className="mt-4 text-[17px] text-on-dark">
          {flow.declineBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-[620px] space-y-10"
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

      <div className="grid gap-5 md:grid-cols-2">
        {textField("name", flow.nameLabel, "text", "name")}
        {textField("company", flow.companyLabel, "text", "organization")}
        {textField("phone", flow.phoneLabel, "tel", "tel")}
        {textField("email", flow.emailLabel, "email", "email")}
      </div>

      {questions.map((question) => {
        const error = answerErrors[question.key];
        const errorId = `qualify-${question.key}-error`;
        const legendId = `qualify-${question.key}-label`;
        return (
          /* The invalid state rides on the group, not on any one radio: a
             single option is never the thing that's missing, the answer is. */
          <fieldset
            key={question.key}
            role="radiogroup"
            aria-labelledby={legendId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="min-w-0 border-0 p-0"
          >
            <legend
              id={legendId}
              className="block max-w-[62ch] font-mono text-[15px] font-medium leading-[1.55] text-paper"
            >
              {question.label}
            </legend>
            {/* The rail is always in the layout so an error never shifts the
                options; it only gains color. Every option row is styled
                identically — nothing here betrays which answers qualify. */}
            <div
              className={`mt-4 space-y-3 border-l-2 pl-4 ${
                error ? "border-orange" : "border-transparent"
              }`}
            >
              {question.options.map((option, index) => {
                const id = `qualify-${question.key}-${index}`;
                const checked = answers[question.key] === option;
                return (
                  <label
                    key={option}
                    htmlFor={id}
                    className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md border bg-graphite px-4 py-3 text-[17px] text-paper transition-colors ${
                      checked
                        ? "border-orange"
                        : "border-white/15 hover:border-white/35"
                    }`}
                  >
                    <input
                      ref={(el) => {
                        if (index === 0) questionRefs.current[question.key] = el;
                      }}
                      id={id}
                      type="radio"
                      name={question.key}
                      value={option}
                      checked={checked}
                      onChange={() => handleAnswer(question.key, option)}
                      className="h-5 w-5 shrink-0 accent-orange"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
            {error ? (
              <p id={errorId} className="mt-2 text-[14px] text-orange">
                {error}
              </p>
            ) : null}
          </fieldset>
        );
      })}

      {serverError ? (
        <p role="alert" className="text-[14px] text-orange">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="min-h-[44px] w-full rounded-md bg-orange px-8 py-2 text-[17px] font-semibold text-ink hover:bg-orange-deep hover:text-paper disabled:opacity-70 md:w-auto"
      >
        {submitting ? flow.submittingLabel : flow.submitLabel}
      </button>
    </form>
  );
}

export default QualifyFlow;
