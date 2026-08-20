/*
 * Calculator math — brief §6a, implemented exactly and exported so the
 * numbers shown are the numbers computed, in one place.
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
  /** fraction, e.g. 0.30 */
  closeRate: number;
  months: number;
}

export interface CalculatorResults {
  quotesWritten: number;
  valueQuoted: number;
  valueUnclosed: number;
  recoveryRate: number;
  recoverableValue: number;
}

export function computePipeline(inputs: CalculatorInputs): CalculatorResults {
  const quotesWritten = inputs.estimatesPerMonth * inputs.months;
  const valueQuoted = quotesWritten * inputs.averageTicket;
  const valueUnclosed = valueQuoted * (1 - inputs.closeRate);
  const recoveryRate = inputs.closeRate / 2;
  const recoverableValue = valueUnclosed * recoveryRate;
  return { quotesWritten, valueQuoted, valueUnclosed, recoveryRate, recoverableValue };
}
