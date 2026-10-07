"use client";

import { useEffect, useId, useRef, useState } from "react";
import ArrowRight from "@/components/ArrowRight";
import type { SponsorPageContent } from "@content/verticals/types";
import { formatUSD, formatUSDCompact } from "@/lib/format";

/*
 * What the rest of a raise costs, three ways — the interactive version of
 * the chart in the Company Hub's ICP & Messaging Pillars.
 *
 *   x  share of met investors who commit, 5–25%
 *   y  cost to raise, % of capital = cost per meeting held ÷ commit ÷ check
 *
 * The direct line is drawn from the visitor's own two inputs; the other
 * paths are published fee ranges, drawn as bands. Break-even against an
 * 8.5% load is where the line crosses 8.5%. Dragging (or hovering) across
 * the chart moves the commit rate, and so does its slider, which is the
 * keyboard and screen-reader route to the same readout.
 *
 * Straight arithmetic, nothing persisted or sent. Never seeded with a
 * client's numbers: Westwin's stay off the public site until Ed's
 * written OK.
 */

const COMMIT_MIN = 5;
const COMMIT_MAX = 25;
const Y_MAX = 20;
const TYPICAL_LOAD = 0.085;

interface Field {
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const FIELDS = {
  check: {
    label: "Average check",
    hint: "What a typical investor in this raise writes.",
    min: 25000,
    max: 250000,
    step: 5000,
    format: formatUSD,
  },
  meeting: {
    label: "All-in cost per meeting held",
    hint: "Media plus fees, divided by meetings that actually happen. Your assumption.",
    min: 300,
    max: 1500,
    step: 25,
    format: formatUSD,
  },
  remaining: {
    label: "Capital left to raise",
    hint: "Used for the dollar comparison only.",
    min: 1_000_000,
    max: 50_000_000,
    step: 500_000,
    format: formatUSDCompact,
  },
  commit: {
    label: "Met investors who commit",
    hint: "Or drag across the chart.",
    min: COMMIT_MIN,
    max: COMMIT_MAX,
    step: 0.5,
    format: (v: number) => `${v}%`,
  },
} satisfies Record<string, Field>;

/** Cost to raise as a percent of capital (e.g. 6.2). */
function costToRaise(meeting: number, commitPct: number, check: number): number {
  return (meeting / ((commitPct / 100) * check)) * 100;
}

function pct(v: number): string {
  return `${v < 10 ? v.toFixed(1) : Math.round(v)}%`;
}

function Slider({
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
  return (
    <div className="rounded-lg border border-seam bg-night px-4 pb-2 pt-3">
      <label htmlFor={id} className="block text-[13px] text-ash">
        {field.label}
      </label>
      <p className="min-h-[36px] text-[17px] font-semibold leading-[36px] text-paper tabular-nums">
        {field.format(value)}
      </p>
      <input
        id={id}
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        aria-valuetext={field.format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="-mt-1 block w-full !h-8"
      />
      <p className="mt-1 pb-1 text-[12px] leading-snug text-ash">{field.hint}</p>
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
  const [remaining, setRemaining] = useState(10_000_000);
  const [commit, setCommit] = useState(10);

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

  const narrow = width < 480;
  const W = Math.max(280, width);
  const H = narrow ? 290 : 340;
  const m = { top: 14, right: 12, bottom: 40, left: 40 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;
  const x = (c: number) => m.left + ((c - COMMIT_MIN) / (COMMIT_MAX - COMMIT_MIN)) * plotW;
  const y = (p: number) => m.top + (1 - Math.min(p, Y_MAX + 2) / Y_MAX) * plotH;

  const points: string[] = [];
  for (let c = COMMIT_MIN; c <= COMMIT_MAX + 0.001; c += 0.25) {
    points.push(`${x(c).toFixed(1)},${y(costToRaise(meeting, c, check)).toFixed(1)}`);
  }

  const current = costToRaise(meeting, commit, check);
  const breakEven = (meeting / (TYPICAL_LOAD * check)) * 100; // commit %, crossing 8.5%
  const breakEvenOneIn = Math.max(1, Math.floor(100 / breakEven));
  const perInvestor = meeting / (commit / 100);
  const directDollars = (remaining * current) / 100;
  const loadDollars = remaining * TYPICAL_LOAD;

  function commitFromPointer(e: React.PointerEvent<SVGRectElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    const raw = COMMIT_MIN + frac * (COMMIT_MAX - COMMIT_MIN);
    setCommit(Math.round(raw * 2) / 2);
  }

  const bd = chart.bands.find((b) => b.key === "bd");
  const pa = chart.bands.find((b) => b.key === "pa");
  const markerY = y(current);
  const markerClipped = current > Y_MAX;
  const labelLeft = x(commit) > W - 110;

  const tiles = [
    { label: `Cost to raise at ${commit}% commit`, value: pct(current), accent: true, sub: null },
    { label: "Cost per investor", value: formatUSD(perInvestor), accent: false, sub: null },
    {
      label: "Break-even vs. an 8.5% load",
      value: breakEven <= 100 ? `1 in ${breakEvenOneIn}` : "—",
      accent: false,
      sub: "met investors committing",
    },
    {
      label: `On ${formatUSDCompact(remaining)} left to raise`,
      value: formatUSDCompact(directDollars),
      accent: false,
      sub: `vs. about ${formatUSDCompact(loadDollars)} at a typical 8.5% load`,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:items-start">
      <div className="flex flex-col gap-3 rounded-2xl border border-seam bg-coal p-4 md:p-5">
        <Slider id={`${uid}-check`} field={FIELDS.check} value={check} onChange={setCheck} />
        <Slider id={`${uid}-meeting`} field={FIELDS.meeting} value={meeting} onChange={setMeeting} />
        <Slider id={`${uid}-commit`} field={FIELDS.commit} value={commit} onChange={setCommit} />
        <Slider id={`${uid}-remaining`} field={FIELDS.remaining} value={remaining} onChange={setRemaining} />
      </div>

      <div className="min-w-0">
        <figure className="rounded-2xl border border-seam bg-coal p-4 md:p-6">
          <figcaption className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ash">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-[3px] w-5 rounded bg-orange" />
              Direct paid media, your numbers
            </span>
            {bd ? (
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="h-3 w-5 rounded-sm bg-paper/15" />
                {bd.label}
              </span>
            ) : null}
            {pa ? (
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="h-3 w-5 rounded-sm border border-dashed border-ash/70" />
                {pa.label}
              </span>
            ) : null}
          </figcaption>

          <div ref={wrapRef} className="mt-4 w-full">
            <svg
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              className="block max-w-full select-none"
              role="img"
              aria-label={`Cost to raise against commit rate. At ${commit}% of met investors committing, direct paid media costs ${pct(current)} of capital raised, against a typical broker-dealer load of 8.5 to 10%.`}
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
                    {p}%
                  </text>
                </g>
              ))}
              {[5, 10, 15, 20, 25].map((c) => (
                <text key={c} x={x(c)} y={H - m.bottom + 18} textAnchor="middle" fontSize="12" fill="var(--ash)">
                  {c}%
                </text>
              ))}
              <text x={m.left + plotW / 2} y={H - 4} textAnchor="middle" fontSize="12" fill="var(--ash)">
                Share of met investors who commit
              </text>

              {bd ? (
                <g>
                  <rect
                    x={m.left}
                    width={plotW}
                    y={y(bd.high * 100)}
                    height={y(bd.low * 100) - y(bd.high * 100)}
                    fill="var(--paper)"
                    fillOpacity="0.12"
                  />
                  <text x={W - m.right - 6} y={y(bd.high * 100) - 6} textAnchor="end" fontSize="12" fill="var(--on-dark)">
                    {narrow ? "Broker-dealer 8.5–10%" : `${bd.label} ${bd.low * 100}–${bd.high * 100}%`}
                  </text>
                </g>
              ) : null}
              {pa ? (
                <g>
                  <rect
                    x={m.left}
                    width={plotW}
                    y={y(pa.high * 100)}
                    height={y(pa.low * 100) - y(pa.high * 100)}
                    fill="none"
                    stroke="var(--ash)"
                    strokeOpacity="0.6"
                    strokeDasharray="4 4"
                  />
                  <text x={m.left + 6} y={y(pa.high * 100) - 6} textAnchor="start" fontSize="12" fill="var(--ash)">
                    {narrow ? "Placement agent 1.5–3%" : `${pa.label} ${pa.low * 100}–${pa.high * 100}% (institutional)`}
                  </text>
                </g>
              ) : null}

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
                  <circle cx={x(breakEven)} cy={y(TYPICAL_LOAD * 100)} r="5" fill="var(--coal)" stroke="var(--paper)" strokeWidth="2" />
                  {/* Below and to the left: under the curve, which falls to the right. */}
                  <text
                    x={x(breakEven) + (x(breakEven) < m.left + 120 ? 10 : -10)}
                    y={y(TYPICAL_LOAD * 100) + 20}
                    textAnchor={x(breakEven) < m.left + 120 ? "start" : "end"}
                    fontSize="12"
                    fill="var(--paper)"
                  >
                    break-even 1 in {breakEvenOneIn}
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
              <circle
                cx={x(commit)}
                cy={markerClipped ? m.top : markerY}
                r="6.5"
                fill="var(--orange)"
                stroke="var(--coal)"
                strokeWidth="2"
              />
              <text
                x={x(commit) + (labelLeft ? -12 : 12)}
                y={(markerClipped ? m.top : markerY) - 10 < m.top + 10 ? (markerClipped ? m.top : markerY) + 22 : (markerClipped ? m.top : markerY) - 10}
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

        <dl aria-live="polite" aria-atomic="true" className="mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border border-seam bg-coal md:grid-cols-4">
          {tiles.map((tile, i) => (
            <div
              key={tile.label}
              className={`p-5 md:p-6 ${i % 2 === 1 ? "border-l border-seam" : ""} ${i >= 2 ? "border-t border-seam md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
            >
              <dt className="text-[14px] font-semibold leading-snug text-paper">{tile.label}</dt>
              <dd className={`readout mt-3 text-[28px] leading-none tabular-nums md:text-[32px] ${tile.accent ? "text-orange" : "text-paper"}`}>
                {tile.value}
              </dd>
              {tile.sub ? <dd className="mt-2 text-[12px] leading-snug text-ash">{tile.sub}</dd> : null}
            </div>
          ))}
        </dl>

        <ul className="mt-4 grid gap-2 text-[13px] leading-relaxed text-ash md:grid-cols-2 md:gap-6">
          {chart.bands.map((b) => (
            <li key={b.key}>
              <span className="font-semibold text-on-dark">{b.label}.</span> {b.caveat}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[12px] leading-relaxed text-ash">{chart.note}</p>

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
