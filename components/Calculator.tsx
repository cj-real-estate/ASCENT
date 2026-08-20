"use client";

import { useEffect, useId, useRef, useState } from "react";
import type {
  CalculatorContent,
  CalculatorField,
} from "@/content/verticals/types";
import { computeRecovery, formatDollars } from "@/lib/calculator";

function formatFieldValue(field: CalculatorField, value: number): string {
  switch (field.format) {
    case "dollars":
      return formatDollars(value);
    case "percent":
      return `${value}%`;
    default:
      return String(value);
  }
}

function SliderRow({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: CalculatorField;
  value: number;
  onChange: (value: number) => void;
}) {
  const formatted = formatFieldValue(field, value);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={id}
          className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-on-dark"
        >
          {field.label}
        </label>
        <span className="font-mono text-sm font-semibold tabular-nums text-white">
          {formatted}
        </span>
      </div>
      <input
        type="range"
        id={id}
        className="slider mt-1 block"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        aria-valuetext={formatted}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function Calculator({ content }: { content: CalculatorContent }) {
  const baseId = useId();
  const [inputs, setInputs] = useState({
    estimatesPerMonth: content.estimatesPerMonth.defaultValue,
    averageTicket: content.averageTicket.defaultValue,
    closeRate: content.closeRate.defaultValue,
    months: content.months.defaultValue,
  });

  const result = computeRecovery({
    estimatesPerMonth: inputs.estimatesPerMonth,
    averageTicket: inputs.averageTicket,
    closeRate: inputs.closeRate / 100,
    months: inputs.months,
  });
  const target = result.recoverableValue;

  // Count-up toward the current target, ~500ms, ease-out. Reduced motion
  // jumps straight to the value. Defaults render server-side, so the number
  // is live before any JavaScript runs.
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  useEffect(() => {
    const from = displayRef.current;
    if (from === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      displayRef.current = target;
      setDisplay(target);
      return;
    }
    const start = performance.now();
    const duration = 500;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + (target - from) * eased;
      displayRef.current = value;
      setDisplay(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  // Screen readers get the settled value through a debounced live region;
  // the animated number itself is aria-hidden so a drag doesn't announce
  // every frame.
  const finalAnnouncement = `${formatDollars(target)} — ${content.outputLabel}`;
  const [announced, setAnnounced] = useState(finalAnnouncement);
  useEffect(() => {
    const timer = setTimeout(() => setAnnounced(finalAnnouncement), 600);
    return () => clearTimeout(timer);
  }, [finalAnnouncement]);

  const [secondaryBefore, secondaryAfter] =
    content.secondaryLine.split("{valueUnclosed}");

  const fields: Array<{
    key: keyof typeof inputs;
    field: CalculatorField;
  }> = [
    { key: "estimatesPerMonth", field: content.estimatesPerMonth },
    { key: "averageTicket", field: content.averageTicket },
    { key: "closeRate", field: content.closeRate },
    { key: "months", field: content.months },
  ];

  return (
    <div className="border border-line-dark bg-panel">
      <div className="space-y-4 p-5 sm:p-7">
        {fields.map(({ key, field }) => (
          <SliderRow
            key={key}
            id={`${baseId}-${key}`}
            field={field}
            value={inputs[key]}
            onChange={(value) =>
              setInputs((prev) => ({ ...prev, [key]: value }))
            }
          />
        ))}
      </div>
      <div className="border-t border-line-dark p-5 sm:p-7">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-on-dark">
          {content.outputLabel}
        </p>
        <p
          aria-hidden="true"
          className={`mt-3 font-mono font-semibold leading-none tracking-tight tabular-nums text-accent ${
            // Longest realistic outputs still fit the panel at 320px.
            formatDollars(display).length > 10
              ? "text-3xl sm:text-5xl"
              : "text-5xl sm:text-6xl"
          }`}
        >
          {formatDollars(display)}
        </p>
        <div aria-live="polite" className="sr-only">
          {announced}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-on-dark">
          {secondaryBefore}
          <span className="font-semibold tabular-nums text-white">
            {formatDollars(result.valueUnclosed)}
          </span>
          {secondaryAfter}
        </p>
        {/* Permanent by design — never behind a toggle. */}
        <p className="mt-4 font-mono text-xs font-medium leading-relaxed text-fog">
          {content.assumptionLine}
        </p>
      </div>
    </div>
  );
}
