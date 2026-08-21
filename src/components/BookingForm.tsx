"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormContent } from "@content/verticals/types";

/*
 * Booking fallback form — client island inside the dark booking section.
 * Collects exactly five fields (name, company, phone, email, estimates
 * volume) plus a honeypot, validates inline, POSTs JSON to /api/book, and
 * routes to /thanks on success. No other data is collected.
 */

type FieldName = "name" | "company" | "phone" | "email" | "trade" | "estimates";

const FIELD_ORDER: FieldName[] = [
  "name",
  "company",
  "phone",
  "email",
  "trade",
  "estimates",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s()\-.]+$/;

function validateField(field: FieldName, raw: string): string | null {
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
    // Optional: it's market research, not a qualifier. Never block on it.
    case "trade":
      return null;
    case "estimates":
      return value ? null : "Choose an option.";
  }
}

const inputBase =
  "mt-2 w-full min-h-[44px] rounded-md border bg-graphite px-4 py-2 text-[17px] text-paper";

export function BookingForm({ form }: { form: FormContent }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    company: "",
    phone: "",
    email: "",
    trade: "",
    estimates: "",
  });
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fieldRefs = useRef<
    Record<FieldName, HTMLInputElement | HTMLSelectElement | null>
  >({
    name: null,
    company: null,
    phone: null,
    email: null,
    trade: null,
    estimates: null,
  });

  function handleChange(field: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setServerError(null);

    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const field of FIELD_ORDER) {
      const message = validateField(field, values[field]);
      if (message) nextErrors[field] = message;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
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
          trade: values.trade.trim(),
          estimates: values.estimates,
          website,
        }),
      });
      if (res.ok) {
        router.push("/thanks");
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
    field: Exclude<FieldName, "estimates">,
    label: string,
    type: "text" | "tel" | "email",
    autoComplete: string,
  ) {
    const error = errors[field];
    const id = `book-${field}`;
    return (
      <div>
        <label htmlFor={id} className="eyebrow block text-[12px] text-on-dark">
          {label}
        </label>
        <input
          ref={(el) => {
            fieldRefs.current[field] = el;
          }}
          id={id}
          name={field}
          type={type}
          autoComplete={autoComplete}
          value={values[field]}
          onChange={(e) => handleChange(field, e.target.value)}
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

  const estimatesError = errors.estimates;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-[620px] space-y-5"
    >
      {/* Honeypot — visually hidden off-screen, not display:none */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="book-website">Website</label>
        <input
          id="book-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {textField("name", form.nameLabel, "text", "name")}
        {textField("company", form.companyLabel, "text", "organization")}
        {textField("phone", form.phoneLabel, "tel", "tel")}
        {textField("email", form.emailLabel, "email", "email")}
      </div>

      {/* Free text, not a dropdown — a dropdown is always missing someone's
          trade, and what they type is useful market research. Omitted on a
          vertical that already knows the answer. */}
      {form.tradeField && (
        <div>
          <label
            htmlFor="book-trade"
            className="eyebrow block text-[12px] text-on-dark"
          >
            {form.tradeField.label}
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.trade = el;
            }}
            id="book-trade"
            name="trade"
            type="text"
            placeholder={form.tradeField.placeholder}
            value={values.trade}
            onChange={(e) => handleChange("trade", e.target.value)}
            className={`${inputBase} border-white/15 placeholder:text-fog`}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="book-estimates"
          className="eyebrow block text-[12px] text-on-dark"
        >
          {form.estimatesSelectLabel}
        </label>
        <select
          ref={(el) => {
            fieldRefs.current.estimates = el;
          }}
          id="book-estimates"
          name="estimates"
          value={values.estimates}
          onChange={(e) => handleChange("estimates", e.target.value)}
          aria-invalid={estimatesError ? true : undefined}
          aria-describedby={estimatesError ? "book-estimates-error" : undefined}
          className={`${inputBase} ${
            estimatesError ? "border-orange" : "border-white/15"
          } ${values.estimates ? "text-paper" : "text-fog"}`}
        >
          <option value="" disabled>
            Select one
          </option>
          {form.estimatesSelectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {estimatesError ? (
          <p
            id="book-estimates-error"
            className="mt-1.5 text-[14px] text-orange"
          >
            {estimatesError}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p role="alert" className="text-[14px] text-orange">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="min-h-[44px] w-full rounded-md bg-orange px-8 py-2 text-[17px] font-semibold text-ink hover:bg-orange-deep disabled:opacity-70 md:w-auto"
      >
        {submitting ? form.submittingLabel : form.submitLabel}
      </button>
    </form>
  );
}

export default BookingForm;
