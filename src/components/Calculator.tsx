"use client";

import { useId, useState } from "react";
import ArrowRight from "./ArrowRight";
import type {
  CalculatorContent,
  CalculatorField,
} from "@content/verticals/types";
import { computeRoi } from "@/lib/calculator";
import { formatUSD, formatUSDCompact, formatPercent } from "@/lib/format";

/*
 * The ROI calculator, reference-site style: boxed fields in a card on the
 * left (industry picker first — it seeds the cost per booked appointment,
 * which stays editable), four per-year output tiles on the right. All math
 * lives in src/lib/calculator.ts — straight arithmetic on the visitor's
 * inputs, stated openly in the assumption line. Nothing is persisted or
 * sent anywhere.
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

/* One bordered field box: small label, the control, optional hint. */
function FieldBox({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-paper px-4 pb-2 pt-3">
      <label htmlFor={htmlFor} className="block text-[13px] text-slate">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 pb-1 text-[12px] leading-snug text-slate">{hint}</p> : null}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function NumberField({
  id,
  field,
  value,
  hint,
  onChange,
}: {
  id: string;
  field: CalculatorField;
  value: number;
  hint?: string;
  onChange: (v: number) => void;
}) {
  // Shown with thousands separators ("4,000"); typed digits stay raw until
  // blur so the caret never jumps mid-entry.
  const formatDraft = (n: number) => n.toLocaleString("en-US");
  const parseDraft = (text: string) => {
    const digits = text.replace(/[^\d]/g, "");
    return digits === "" ? NaN : Number(digits);
  };
  const [draft, setDraft] = useState(formatDraft(value));

  // Sync the draft when the slider, the industry picker, or a clamp moves
  // the committed value — done during render (React's sanctioned
  // derived-state pattern) rather than in an effect.
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(formatDraft(value));
  }

  const commit = () => {
    const parsed = parseDraft(draft);
    const next = Number.isFinite(parsed)
      ? clamp(parsed, field.min, field.max)
      : value;
    onChange(next);
    setDraft(formatDraft(next));
  };

  return (
    <FieldBox label={field.label} htmlFor={id} hint={hint}>
      <div className="flex items-center gap-1">
        {field.unit === "$" ? (
          <span aria-hidden="true" className="text-[17px] font-semibold text-slate">
            $
          </span>
        ) : null}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={draft}
          onChange={(e) => {
            const text = e.target.value;
            setDraft(text);
            const parsed = parseDraft(text);
            if (
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
          className="min-h-[36px] w-full bg-transparent text-[17px] font-semibold text-ink"
        />
      </div>
      <input
        type="range"
        aria-label={`${field.label} slider`}
        aria-valuetext={formatFieldValue(field, value)}
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="-mt-1 block w-full !h-8"
      />
    </FieldBox>
  );
}

function RangeField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: CalculatorField;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <FieldBox label={field.label} htmlFor={id}>
      <p className="min-h-[36px] text-[17px] font-semibold leading-[36px] text-ink">
        {formatFieldValue(field, value)}
      </p>
      <input
        id={id}
        type="range"
        aria-valuetext={formatFieldValue(field, value)}
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="-mt-1 block w-full !h-8"
      />
    </FieldBox>
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
  const { fields, industries, outputs, assumptionLine } = calculator;
  const uid = useId();

  const [industryIndex, setIndustryIndex] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(
    fields.monthlyBudget.defaultValue,
  );
  // Seeded by the industry picker when there is one; always editable.
  const [costPerAppointment, setCostPerAppointment] = useState(
    industries
      ? industries.options[0].costPerAppointment
      : fields.costPerAppointment.defaultValue,
  );
  const [averageDealSize, setAverageDealSize] = useState(
    fields.averageDealSize.defaultValue,
  );
  // Stored as a percentage number (30) — converted to a fraction for the math.
  const [closeRatePct, setCloseRatePct] = useState(
    fields.closeRate.defaultValue,
  );

  function chooseIndustry(index: number) {
    if (!industries) return;
    setIndustryIndex(index);
    setCostPerAppointment(
      clamp(
        industries.options[index].costPerAppointment,
        fields.costPerAppointment.min,
        fields.costPerAppointment.max,
      ),
    );
  }

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
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card md:p-5">
        {industries ? (
          <FieldBox label={industries.label} htmlFor={`${uid}-industry`}>
            <div className="relative">
              <select
                id={`${uid}-industry`}
                value={industryIndex}
                onChange={(e) => chooseIndustry(Number(e.target.value))}
                className="min-h-[36px] w-full appearance-none truncate bg-transparent pr-8 text-[15px] font-semibold text-ink md:text-[16px]"
              >
                {industries.options.map((option, i) => (
                  <option key={option.label} value={i}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </FieldBox>
        ) : null}
        <NumberField
          id={`${uid}-cpa`}
          field={fields.costPerAppointment}
          value={costPerAppointment}
          hint={industries?.note}
          onChange={setCostPerAppointment}
        />
        <NumberField
          id={`${uid}-budget`}
          field={fields.monthlyBudget}
          value={monthlyBudget}
          onChange={setMonthlyBudget}
        />
        <NumberField
          id={`${uid}-deal`}
          field={fields.averageDealSize}
          value={averageDealSize}
          onChange={setAverageDealSize}
        />
        <RangeField
          id={`${uid}-close`}
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
