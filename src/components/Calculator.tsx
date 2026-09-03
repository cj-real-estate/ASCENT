"use client";

import { useState } from "react";
import ArrowRight from "./ArrowRight";
import type {
  CalculatorContent,
  CalculatorField,
} from "@content/verticals/types";
import { computeRoi } from "@/lib/calculator";
import { formatUSD, formatUSDCompact, formatPercent } from "@/lib/format";

/*
 * The ROI calculator, reference-site style: inputs in a card on the left,
 * four per-year output tiles on the right (appointments, deals, revenue,
 * ROI). Light surfaces. All math lives in src/lib/calculator.ts — straight
 * arithmetic on the visitor's inputs, stated openly in the assumption line.
 * Nothing is persisted or sent anywhere.
 */

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
    const next =
      Number.isFinite(parsed) && draft.trim() !== ""
        ? clamp(parsed, field.min, field.max)
        : value;
    onChange(next);
    setDraft(String(next));
  };

  return (
    <span className="flex min-h-[44px] items-center gap-1 rounded-md border border-line bg-paper px-3">
      {field.unit === "$" ? (
        <span aria-hidden="true" className="font-mono text-[14px] text-slate">
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
        className="w-[7ch] bg-transparent text-right font-mono text-[14px] text-ink"
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
        <span className="eyebrow !text-[12px] text-slate">{field.label}</span>
        {field.numberInput ? (
          <NumberBox field={field} value={value} onChange={onChange} />
        ) : (
          <span className="readout text-[16px] text-ink">
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
  const { fields, outputs, assumptionLine } = calculator;

  const [monthlyBudget, setMonthlyBudget] = useState(
    fields.monthlyBudget.defaultValue,
  );
  const [costPerAppointment, setCostPerAppointment] = useState(
    fields.costPerAppointment.defaultValue,
  );
  const [averageDealSize, setAverageDealSize] = useState(
    fields.averageDealSize.defaultValue,
  );
  // Stored as a percentage number (30) — converted to a fraction for the math.
  const [closeRatePct, setCloseRatePct] = useState(
    fields.closeRate.defaultValue,
  );

  const r = computeRoi({
    monthlyBudget,
    costPerAppointment,
    averageDealSize,
    closeRate: closeRatePct / 100,
  });

  const tiles = [
    { label: outputs.appointments, value: String(r.appointments), accent: false },
    { label: outputs.revenue, value: formatUSDCompact(r.revenue), accent: true },
    { label: outputs.deals, value: String(r.deals), accent: false },
    { label: outputs.roi, value: formatPercent(r.roi), accent: true },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
      <div className="flex flex-col gap-6 rounded-2xl border border-line bg-paper p-6 shadow-card md:p-7">
        <FieldRow
          field={fields.monthlyBudget}
          value={monthlyBudget}
          onChange={setMonthlyBudget}
        />
        <FieldRow
          field={fields.costPerAppointment}
          value={costPerAppointment}
          onChange={setCostPerAppointment}
        />
        <FieldRow
          field={fields.averageDealSize}
          value={averageDealSize}
          onChange={setAverageDealSize}
        />
        <FieldRow
          field={fields.closeRate}
          value={closeRatePct}
          onChange={setCloseRatePct}
        />
      </div>

      <div>
        <dl
          aria-live="polite"
          aria-atomic="true"
          className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-paper shadow-card"
        >
          {tiles.map((tile, i) => (
            <div
              key={tile.label}
              className={`p-6 md:p-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${
                i >= 2 ? "border-t border-line" : ""
              }`}
            >
              <dt className="text-[15px] font-semibold leading-snug text-ink md:text-[17px]">
                {tile.label}
              </dt>
              <dd
                className={`readout mt-3 text-[30px] leading-none md:text-[44px] ${
                  tile.accent ? "text-orange" : "text-ink"
                }`}
              >
                {tile.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-[12px] leading-relaxed text-slate">
          {assumptionLine}
        </p>
        <div className="mt-6 flex flex-col items-start gap-3">
          <a
            href="#book"
            data-open-lead-modal
            className="btn-primary w-full md:w-auto"
          >
            {ctaLabel}
            <ArrowRight />
          </a>
          <p className="eyebrow !text-[12px] text-slate">{ctaMicrocopy}</p>
        </div>
      </div>
    </div>
  );
}
