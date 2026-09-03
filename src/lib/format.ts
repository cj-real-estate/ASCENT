/** Whole dollars, thousands separators — "$182,250" */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/** Compact dollars for big output tiles — "$225K", "$1.2M"; exact under $10K */
export function formatUSDCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs < 10000) return formatUSD(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Whole-number percent with an explicit sign convention — "134%", "-18%" */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/** Replace {token} placeholders in content-module template strings */
export function interpolate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (m, key) => values[key] ?? m);
}
