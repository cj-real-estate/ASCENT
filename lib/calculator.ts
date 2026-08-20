/*
 * Calculator math — §8 of the handoff, implemented exactly:
 *
 *   quotesWritten     = estimatesPerMonth × months
 *   valueQuoted       = quotesWritten × averageTicket
 *   valueUnclosed     = valueQuoted × (1 − closeRate)
 *   recoveryRate      = closeRate ÷ 2
 *   recoverableValue  = valueUnclosed × recoveryRate
 */

export interface CalculatorInputs {
  estimatesPerMonth: number;
  averageTicket: number;
  /** Fraction, 0–1 (the UI works in whole percent and divides by 100). */
  closeRate: number;
  months: number;
}

export interface CalculatorResult {
  quotesWritten: number;
  valueQuoted: number;
  valueUnclosed: number;
  recoveryRate: number;
  recoverableValue: number;
}

export function computeRecovery(inputs: CalculatorInputs): CalculatorResult {
  const quotesWritten = inputs.estimatesPerMonth * inputs.months;
  const valueQuoted = quotesWritten * inputs.averageTicket;
  const valueUnclosed = valueQuoted * (1 - inputs.closeRate);
  const recoveryRate = inputs.closeRate / 2;
  const recoverableValue = valueUnclosed * recoveryRate;
  return { quotesWritten, valueQuoted, valueUnclosed, recoveryRate, recoverableValue };
}

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Whole dollars with thousands separators: 226800 → "$226,800". */
export function formatDollars(value: number): string {
  return dollars.format(Math.round(value));
}
