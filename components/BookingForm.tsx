"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Vertical } from "@/content/verticals/types";
import { ctaButtonClasses } from "./CtaButton";

const labelClasses =
  "block font-mono text-xs font-medium uppercase tracking-[0.12em] text-on-dark";
const fieldClasses =
  "mt-2 block h-12 w-full border border-line-dark bg-field px-3.5 text-base text-white placeholder:text-fog";

export function BookingForm({
  slug,
  form,
  submitLabel,
}: {
  slug: string;
  form: Vertical["booking"]["form"];
  submitLabel: string;
}) {
  const baseId = useId();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("submitting");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          estimates: data.get("estimates"),
          trade: data.get("trade"),
          fax: data.get("fax"),
          vertical: slug,
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
      } | null;
      if (!res.ok || !body?.ok) throw new Error("send failed");
      router.push("/thanks");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-name`} className={labelClasses}>
            Name
          </label>
          <input
            id={`${baseId}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={200}
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor={`${baseId}-phone`} className={labelClasses}>
            Phone
          </label>
          <input
            id={`${baseId}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor={`${baseId}-email`} className={labelClasses}>
            Email <span className="normal-case text-fog">(optional)</span>
          </label>
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={200}
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor={`${baseId}-estimates`} className={labelClasses}>
            {form.estimatesSelectLabel}
          </label>
          <select
            id={`${baseId}-estimates`}
            name="estimates"
            className={fieldClasses}
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            {form.estimatesOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {form.tradeField && (
          <div className="sm:col-span-2">
            <label htmlFor={`${baseId}-trade`} className={labelClasses}>
              {form.tradeField.label}
            </label>
            {/* Free text on purpose — a dropdown is always missing someone's
                trade, and what people type is market research. */}
            <input
              id={`${baseId}-trade`}
              name="trade"
              type="text"
              placeholder={form.tradeField.placeholder}
              maxLength={200}
              className={fieldClasses}
            />
          </div>
        )}
      </div>
      {/* Honeypot — hidden from people, filled by bots. No CAPTCHA. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${baseId}-fax`}>Fax</label>
        <input
          id={`${baseId}-fax`}
          name="fax"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="mt-7">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`${ctaButtonClasses} w-full disabled:opacity-60 sm:w-auto`}
        >
          {status === "submitting" ? "Sending…" : submitLabel}
        </button>
        {status === "error" && (
          <p role="alert" className="mt-4 text-sm font-medium text-accent">
            That didn’t go through. Give it another try.
          </p>
        )}
      </div>
    </form>
  );
}
