"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { CalculatorContent, CalculatorField } from "@content/verticals/types";
import { computePipeline } from "@/lib/calculator";
import { formatUSD, interpolate } from "@/lib/format";

/*
 * The pipeline calculator — the signature element of the page.
 * All math lives in src/lib/calculator.ts; all copy comes from the
 * vertical content module. Nothing is persisted or sent anywhere.
 */

const TRACK_DARK = { "--track": "rgba(255,255,255,0.2)" } as CSSProperties;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** "$4,500" / "30%" / "12" per the field's unit */
function formatFieldValue(field: CalculatorField, value: number): string {
  if (field.unit === "$") return formatUSD(value);
  if (field.unit === "%") return `${value}%`;
  return String(value);
}

function NumberBox({
  field,
  value,
  onChange,
}: {
  field: CalculatorField;
  value: number;
  onChange: (v: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));

  // Sync the draft when the slider (or a clamp) moves the committed value —
  // done during render (React's sanctioned derived-state pattern) rather
  // than in an effect, so there's no cascading re-render.
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(String(value));
  }

  const commit = () => {
    const parsed = Number(draft);
    const next = Number.isFinite(parsed) && draft.trim() !== ""
      ? clamp(parsed, field.min, field.max)
      : value;
    onChange(next);
    setDraft(String(next));
  };

  return (
    <span className="flex min-h-[44px] items-center gap-1 rounded-md border border-white/15 bg-ink px-3">
      {field.unit === "$" ? (
        <span aria-hidden="true" className="font-mono text-[14px] text-fog">
          $
        </span>
      ) : null}
      <input
        type="number"
        inputMode="numeric"
        aria-label={field.label}
        min={field.min}
        max={field.max}
        step={field.step}
        value={draft}
        onChange={(e) => {
          const text = e.target.value;
          setDraft(text);
          const parsed = Number(text);
          if (
            text.trim() !== "" &&
            Number.isFinite(parsed) &&
            parsed >= field.min &&
            parsed <= field.max
          ) {
            onChange(parsed);
          }
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
        }}
        className="w-[7ch] bg-transparent text-right font-mono text-[14px] text-paper"
      />
    </span>
  );
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: CalculatorField;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow !text-[12px] text-on-dark">{field.label}</span>
        {field.numberInput ? (
          <NumberBox field={field} value={value} onChange={onChange} />
        ) : (
          <span className="readout text-[16px] text-paper">
            {formatFieldValue(field, value)}
          </span>
        )}
      </div>
      <input
        type="range"
        aria-label={field.label}
        aria-valuetext={
          field.unit === "none" ? undefined : formatFieldValue(field, value)
        }
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={TRACK_DARK}
        className="mt-1 block w-full"
      />
    </div>
  );
}

/*
 * Client props are serialized into the page source, so this component takes
 * only the slices it renders — never the whole Vertical, which would ship
 * the qualification gate's `qualifies` flags and the scheduling link to
 * every visitor in view-source.
 */
export default function Calculator({
  calculator,
  ctaLabel,
  ctaMicrocopy,
}: {
  calculator: CalculatorContent;
  ctaLabel: string;
  ctaMicrocopy: string;
}) {
  const { fields, outputLabel, secondaryLine, assumptionLine } = calculator;

  const [estimatesPerMonth, setEstimatesPerMonth] = useState(
    fields.estimatesPerMonth.defaultValue,
  );
  const [averageTicket, setAverageTicket] = useState(
    fields.averageTicket.defaultValue,
  );
  // Stored as a percentage number (30) — converted to a fraction for the math.
  const [closeRatePct, setCloseRatePct] = useState(
    fields.closeRate.defaultValue,
  );
  const [months, setMonths] = useState(fields.months.defaultValue);

  const results = computePipeline({
    estimatesPerMonth,
    averageTicket,
    closeRate: closeRatePct / 100,
    months,
  });
  const target = results.recoverableValue;

  // Count-up: visual only. Initialized from the same defaults the server
  // rendered, so there is no hydration mismatch; matchMedia is read only
  // inside the effect.
  const [displayValue, setDisplayValue] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    const from = displayRef.current;
    const to = target;
    if (from === to) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Snap straight to the final value — scheduled through rAF so the
      // effect never sets state synchronously.
      const raf = requestAnimationFrame(() => {
        displayRef.current = to;
        setDisplayValue(to);
      });
      return () => cancelAnimationFrame(raf);
    }

    const duration = 500;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      const next = t >= 1 ? to : from + (to - from) * eased;
      displayRef.current = next;
      setDisplayValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="rounded-lg border border-white/10 bg-graphite p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <FieldRow
          field={fields.estimatesPerMonth}
          value={estimatesPerMonth}
          onChange={setEstimatesPerMonth}
        />
        <FieldRow
          field={fields.averageTicket}
          value={averageTicket}
          onChange={setAverageTicket}
        />
        <FieldRow
          field={fields.closeRate}
          value={closeRatePct}
          onChange={setCloseRatePct}
        />
        <FieldRow field={fields.months} value={months} onChange={setMonths} />
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <div aria-live="polite" aria-atomic="true">
          <p className="eyebrow !text-[12px] text-on-dark">{outputLabel}</p>
          {/* Screen readers announce the final value, not animation frames */}
          <span className="sr-only">{formatUSD(target)}</span>
          <p
            aria-hidden="true"
            className="readout mt-2 text-[40px] leading-none text-orange min-[380px]:text-[46px] md:text-[62px]"
          >
            {formatUSD(displayValue)}
          </p>
        </div>
        <p className="mt-4 text-[16px] text-on-dark">
          {interpolate(secondaryLine, {
            valueUnclosed: formatUSD(results.valueUnclosed),
          })}
        </p>
        <p className="mt-3 font-mono text-[12px] text-fog">{assumptionLine}</p>
        <a
          href="#book"
          className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-orange px-6 font-semibold text-ink hover:bg-orange-deep hover:text-paper md:w-auto"
        >
          {ctaLabel}
        </a>
        {/* On mobile this card's CTA is the hero CTA, so the microcopy
            rides under it; on desktop it sits under the left-column CTA. */}
        <p className="eyebrow mt-4 !text-[12px] text-fog lg:hidden">
          {ctaMicrocopy}
        </p>
      </div>
    </div>
  );
}
