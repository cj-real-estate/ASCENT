"use client";

import { useEffect, useId, useRef, useState } from "react";
import ArrowRight from "@/components/ArrowRight";
import type { SponsorPageContent } from "@content/verticals/types";
import { formatUSD, formatUSDCompact } from "@/lib/format";

/*
 * What the rest of a raise costs: raising direct with Ascent against a
 * typical retail broker-dealer load. The interactive version of the chart
 * in the Company Hub's ICP & Messaging Pillars.
 *
 *   x  share of met investors who commit, 5–100%
 *   y  cost to raise, % of capital = cost per meeting held ÷ commit ÷ check
 *
 * The Ascent line comes from the visitor's own inputs; the broker-dealer
 * load is the published 8.5–10% range, drawn as a band. The results panel
 * says the one thing the section is for, in dollars: what each path costs
 * on the capital left to raise, and the difference. When the visitor's
 * numbers make direct the dearer path it says that too, and where it
 * flips — the panel never claims a saving the arithmetic doesn't show.
 *
 * Copy guardrails from the same Notion page: "cost to raise", never "cost
 * of capital"; the broker-dealer figure is "a typical load", never the
 * sponsor's actual cost; no client figures (Westwin's need Ed's written
 * OK). Straight arithmetic, nothing persisted or sent.
 */

const COMMIT_MIN = 5;
const COMMIT_MAX = 100;
const X_TICKS = [5, 20, 40, 60, 80, 100];
const Y_MAX = 20;

interface Field {
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

const FIELDS = {
  check: {
    label: "Average check",
    hint: "What a typical investor in this raise writes.",
    min: 10000,
    max: 5_000_000,
    step: 5000,
    prefix: "$",
  },
  meeting: {
    label: "All-in cost per meeting held",
    hint: "Media plus fees, divided by meetings that actually happen. Your assumption.",
    min: 100,
    max: 10000,
    step: 25,
    prefix: "$",
  },
  commit: {
    label: "Met investors who commit",
    hint: "Or drag across the chart.",
    min: COMMIT_MIN,
    max: COMMIT_MAX,
    step: 1,
    suffix: "%",
  },
  remaining: {
    label: "Capital left to raise",
    hint: "The dollar comparison runs on this.",
    min: 100_000,
    max: 1_000_000_000,
    step: 500_000,
    prefix: "$",
  },
} satisfies Record<string, Field>;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const grouped = (v: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(v);

/** Cost to raise as a percent of capital (e.g. 4.5). */
function costToRaise(meeting: number, commitPct: number, check: number): number {
  return (meeting / ((commitPct / 100) * check)) * 100;
}

function pct(v: number): string {
  return `${v < 10 ? v.toFixed(1) : Math.round(v)}%`;
}

function Chevron({ up }: { up?: boolean }) {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d={up ? "M2.5 7.5 6 4l3.5 3.5" : "M2.5 4.5 6 8l3.5-3.5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* A typed number box with up and down buttons beside it. The visitor can
 * type any value (commas and a $ are fine); it is clamped to the field's
 * range on Enter or blur. The arrow keys step it too. */
function Stepper({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: Field;
  value: number;
  onChange: (v: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const bump = (dir: 1 | -1) => onChange(clamp(value + dir * field.step, field.min, field.max));
  const commit = (raw: string) => {
    const n = Number(raw.replace(/[^0-9.]/g, ""));
    if (raw.trim() !== "" && Number.isFinite(n)) onChange(clamp(n, field.min, field.max));
    setDraft(null);
  };
  const btn =
    "flex h-[26px] w-11 items-center justify-center bg-coal text-on-dark transition-colors hover:bg-orange hover:text-ink disabled:opacity-40 disabled:hover:bg-coal disabled:hover:text-on-dark";

  return (
    <div className="rounded-lg border border-seam bg-night px-4 pb-3 pt-3">
      <label htmlFor={id} className="block text-[13px] text-ash">
        {field.label}
      </label>
      <div className="mt-2 flex items-stretch gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1 rounded-md border border-seam bg-coal px-3 focus-within:border-orange">
          {field.prefix ? <span className="text-[17px] font-semibold text-ash">{field.prefix}</span> : null}
          <input
            id={id}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={draft ?? grouped(value)}
            onFocus={() => setDraft(String(value))}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(e.currentTarget.value);
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                setDraft(null);
                bump(e.key === "ArrowUp" ? 1 : -1);
              }
            }}
            className="min-h-[50px] w-full min-w-0 bg-transparent text-[18px] font-semibold text-paper tabular-nums outline-none"
          />
          {field.suffix ? <span className="text-[17px] font-semibold text-ash">{field.suffix}</span> : null}
        </div>
        <div className="flex flex-col overflow-hidden rounded-md border border-seam">
          <button
            type="button"
            aria-label={`Increase ${field.label.toLowerCase()}`}
            disabled={value >= field.max}
            onClick={() => bump(1)}
            className={btn}
          >
            <Chevron up />
          </button>
          <button
            type="button"
            aria-label={`Decrease ${field.label.toLowerCase()}`}
            disabled={value <= field.min}
            onClick={() => bump(-1)}
            className={`${btn} border-t border-seam`}
          >
            <Chevron />
          </button>
        </div>
      </div>
      <p className="mt-2 text-[12px] leading-snug text-ash">{field.hint}</p>
    </div>
  );
}

export default function CostToRaiseChart({
  chart,
  ctaMicrocopy,
}: {
  chart: SponsorPageContent["costChart"];
  ctaMicrocopy: string;
}) {
  const uid = useId();
  const [check, setCheck] = useState(100000);
  const [meeting, setMeeting] = useState(900);
  const [commit, setCommit] = useState(20);
  const [remaining, setRemaining] = useState(10_000_000);

  // Draw at the real pixel width so the labels stay legible on a phone
  // instead of shrinking with a scaled viewBox.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { load } = chart;
  const typical = load.low; // the comparison uses the low end of the range

  const narrow = width < 480;
  const W = Math.max(280, width);
  const H = narrow ? 280 : 320;
  const m = { top: 14, right: 12, bottom: 40, left: 40 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;
  const x = (c: number) => m.left + ((c - COMMIT_MIN) / (COMMIT_MAX - COMMIT_MIN)) * plotW;
  const y = (p: number) => m.top + (1 - Math.min(p, Y_MAX + 2) / Y_MAX) * plotH;

  const points: string[] = [];
  for (let c = COMMIT_MIN; c <= COMMIT_MAX + 0.001; c += 0.5) {
    points.push(`${x(c).toFixed(1)},${y(costToRaise(meeting, c, check)).toFixed(1)}`);
  }

  const current = costToRaise(meeting, commit, check);
  const breakEven = (meeting / (typical * check)) * 100; // commit % where the line crosses the load
  const breakEvenOneIn = Math.max(1, Math.floor(100 / breakEven));
  const perInvestor = meeting / (commit / 100);
  const perInvestorLoad = check * typical;
  const ascentDollars = (remaining * current) / 100;
  const loadDollars = remaining * typical;
  const difference = loadDollars - ascentDollars;
  const ascentWins = difference > 0;
  const barMax = Math.max(ascentDollars, loadDollars);

  function commitFromPointer(e: React.PointerEvent<SVGRectElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const frac = clamp((e.clientX - box.left) / box.width, 0, 1);
    setCommit(Math.round(COMMIT_MIN + frac * (COMMIT_MAX - COMMIT_MIN)));
  }

  const markerClipped = current > Y_MAX;
  const markerY = markerClipped ? m.top : y(current);
  const labelLeft = x(commit) > W - 90;

  const rows = [
    { name: "Raising direct with Ascent", sub: `${pct(current)} of capital`, value: ascentDollars, accent: true },
    { name: load.label, sub: `at a typical ${typical * 100}% load`, value: loadDollars, accent: false },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:items-start">
      <div className="flex flex-col gap-3 rounded-2xl border border-seam bg-coal p-4 md:p-5">
        <Stepper id={`${uid}-check`} field={FIELDS.check} value={check} onChange={setCheck} />
        <Stepper id={`${uid}-meeting`} field={FIELDS.meeting} value={meeting} onChange={setMeeting} />
        <Stepper id={`${uid}-commit`} field={FIELDS.commit} value={commit} onChange={setCommit} />
        <Stepper id={`${uid}-remaining`} field={FIELDS.remaining} value={remaining} onChange={setRemaining} />
      </div>

      <div className="min-w-0">
        {/* The answer first: what the rest of the raise costs each way. */}
        <div aria-live="polite" aria-atomic="true" className="rounded-2xl border border-seam bg-coal p-5 md:p-7">
          <p className="eyebrow !text-[12px] text-ash">
            On {formatUSDCompact(remaining)} left to raise, at {commit}% commit
          </p>

          <dl className="mt-5 grid gap-5">
            {rows.map((row) => (
              <div key={row.name} className="grid gap-2 sm:grid-cols-[12rem_minmax(0,1fr)_10.5rem] sm:items-center sm:gap-4">
                <dt className={`text-[14px] font-semibold leading-snug ${row.accent ? "text-paper" : "text-on-dark"}`}>
                  {row.name}
                </dt>
                <dd className="h-3 overflow-hidden rounded-full bg-night">
                  <span
                    className={`block h-full rounded-full transition-[width] duration-300 ${row.accent ? "bg-orange" : "bg-paper/30"}`}
                    style={{ width: `${Math.max(2, (row.value / barMax) * 100)}%` }}
                  />
                </dd>
                <dd className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-1">
                  <span className={`readout text-[22px] leading-none tabular-nums md:text-[26px] ${row.accent ? "text-orange" : "text-paper"}`}>
                    {formatUSDCompact(row.value)}
                  </span>
                  <span className="text-[12px] text-ash">{row.sub}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-5 border-t border-seam pt-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-end">
            {ascentWins ? (
              <div>
                <p className="text-[15px] font-semibold text-on-dark">You keep</p>
                <p className="readout mt-1 text-[44px] leading-none text-orange tabular-nums md:text-[56px]">
                  {formatUSDCompact(difference)}
                </p>
                <p className="mt-3 max-w-[44ch] text-[14px] leading-relaxed text-ash">
                  more of this raise than a typical load would take, and every investor stays on your list for the next one. A broker-dealer charges again.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[15px] font-semibold text-on-dark">At these numbers</p>
                <p className="mt-1 text-[24px] font-semibold leading-snug text-paper md:text-[28px]">
                  a typical load costs <span className="tabular-nums">{formatUSDCompact(-difference)}</span> less
                </p>
                <p className="mt-3 max-w-[44ch] text-[14px] leading-relaxed text-ash">
                  Raising direct costs less once 1 in {breakEvenOneIn} met investors commit, and the list it builds is yours for the next raise.
                </p>
              </div>
            )}
            <dl className="grid gap-3 text-[14px] leading-snug">
              <div>
                <dt className="text-ash">Cost per investor</dt>
                <dd className="mt-0.5 text-on-dark">
                  <span className="font-semibold text-paper tabular-nums">{formatUSD(perInvestor)}</span> with Ascent, against about{" "}
                  <span className="tabular-nums">{formatUSD(perInvestorLoad)}</span> in load on a {formatUSDCompact(check)} check
                </dd>
              </div>
              <div>
                <dt className="text-ash">Break-even</dt>
                <dd className="mt-0.5 text-on-dark">
                  Ascent costs less once <span className="font-semibold text-paper">1 in {breakEvenOneIn}</span> met investors commit
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <figure className="mt-4 rounded-2xl border border-seam bg-coal p-4 md:p-6">
          <figcaption className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ash">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-[3px] w-5 rounded bg-orange" />
              Raising direct with Ascent, your numbers
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-5 rounded-sm bg-paper/15" />
              {load.label}
            </span>
          </figcaption>

          <div ref={wrapRef} className="mt-4 w-full">
            <svg
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              className="block max-w-full select-none"
              role="img"
              aria-label={`Cost to raise against commit rate. At ${commit}% of met investors committing, raising direct with Ascent costs ${pct(current)} of capital raised, against a typical broker-dealer load of ${load.low * 100} to ${load.high * 100}%.`}
            >
              <defs>
                <clipPath id={`${uid}-plot`}>
                  <rect x={m.left} y={m.top} width={plotW} height={plotH} />
                </clipPath>
              </defs>

              {[0, 5, 10, 15, 20].map((p) => (
                <g key={p}>
                  <line x1={m.left} x2={W - m.right} y1={y(p)} y2={y(p)} stroke="var(--seam)" />
                  <text x={m.left - 8} y={y(p) + 4} textAnchor="end" fontSize="12" fill="var(--ash)">
                    {`${p}%`}
                  </text>
                </g>
              ))}
              {X_TICKS.map((c, i) => (
                <text
                  key={c}
                  x={x(c)}
                  y={H - m.bottom + 18}
                  textAnchor={i === X_TICKS.length - 1 ? "end" : "middle"}
                  fontSize="12"
                  fill="var(--ash)"
                >
                  {`${c}%`}
                </text>
              ))}
              <text x={m.left + plotW / 2} y={H - 4} textAnchor="middle" fontSize="12" fill="var(--ash)">
                Share of met investors who commit
              </text>

              <rect
                x={m.left}
                width={plotW}
                y={y(load.high * 100)}
                height={y(load.low * 100) - y(load.high * 100)}
                fill="var(--paper)"
                fillOpacity="0.12"
              />
              <text x={W - m.right - 6} y={y(load.high * 100) - 6} textAnchor="end" fontSize="12" fill="var(--on-dark)">
                {narrow ? `Broker-dealer ${load.low * 100}–${load.high * 100}%` : `${load.label} ${load.low * 100}–${load.high * 100}%`}
              </text>

              <g clipPath={`url(#${uid}-plot)`}>
                <polyline
                  points={points.join(" ")}
                  fill="none"
                  stroke="var(--orange)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>

              {breakEven >= COMMIT_MIN && breakEven <= COMMIT_MAX ? (
                <g>
                  <circle cx={x(breakEven)} cy={y(typical * 100)} r="5" fill="var(--coal)" stroke="var(--paper)" strokeWidth="2" />
                  {/* Clear of the curve, which falls to the right: below-left when
                      there is room, otherwise above-right. */}
                  <text
                    x={x(breakEven) + (x(breakEven) < m.left + 120 ? 10 : -10)}
                    y={y(typical * 100) + (x(breakEven) < m.left + 120 ? -12 : 20)}
                    textAnchor={x(breakEven) < m.left + 120 ? "start" : "end"}
                    fontSize="12"
                    fill="var(--paper)"
                  >
                    {`break-even 1 in ${breakEvenOneIn}`}
                  </text>
                </g>
              ) : null}

              <line
                x1={x(commit)}
                x2={x(commit)}
                y1={m.top}
                y2={H - m.bottom}
                stroke="var(--orange)"
                strokeOpacity="0.45"
                strokeDasharray="3 3"
              />
              <circle cx={x(commit)} cy={markerY} r="6.5" fill="var(--orange)" stroke="var(--coal)" strokeWidth="2" />
              <text
                x={x(commit) + (labelLeft ? -12 : 12)}
                y={markerY - 10 < m.top + 10 ? markerY + 22 : markerY - 10}
                textAnchor={labelLeft ? "end" : "start"}
                fontSize="14"
                fontWeight="600"
                fill="var(--paper)"
              >
                {markerClipped ? `${pct(current)} ↑` : pct(current)}
              </text>

              <rect
                x={m.left}
                y={m.top}
                width={plotW}
                height={plotH}
                fill="transparent"
                style={{ touchAction: "pan-y", cursor: "ew-resize" }}
                onPointerDown={commitFromPointer}
                onPointerMove={(e) => {
                  if (e.pointerType === "mouse" || e.buttons > 0) commitFromPointer(e);
                }}
              />
            </svg>
          </div>
        </figure>

        <p className="mt-4 text-[13px] leading-relaxed text-ash">
          <span className="font-semibold text-on-dark">{load.label}.</span> {load.caveat}
        </p>
        <p className="mt-3 font-mono text-[12px] leading-relaxed text-ash">{chart.note}</p>

        <div className="mt-6 flex flex-col items-start gap-3">
          <a href="#book" data-open-lead-modal className="btn-primary w-full md:w-auto">
            {chart.cta}
            <ArrowRight />
          </a>
          <p className="eyebrow !text-[12px] text-ash">{ctaMicrocopy}</p>
        </div>
      </div>
    </div>
  );
}
