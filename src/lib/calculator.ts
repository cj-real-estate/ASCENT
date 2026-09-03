/*
 * ROI calculator math — implemented exactly and exported so the numbers
 * shown are the numbers computed, in one place. Deliberately nothing but
 * arithmetic on the visitor's own inputs — no hidden multipliers, no
 * "up to" factors. Stating the math openly is part of the positioning
 * (see the transparency section).
 *
 *   annualBudget = monthlyBudget × 12
 *   appointments = floor(annualBudget ÷ costPerAppointment)   — held, per year
 *   deals        = round(appointments × closeRate)
 *   revenue      = deals × averageDealSize
 *   roi          = (revenue − annualBudget) ÷ annualBudget
 */

export interface RoiInputs {
  monthlyBudget: number;
  costPerAppointment: number;
  averageDealSize: number;
  /** fraction, e.g. 0.30 */
  closeRate: number;
}

export interface RoiResults {
  annualBudget: number;
  appointments: number;
  deals: number;
  revenue: number;
  /** fraction, e.g. 1.34 for 134% — can be negative */
  roi: number;
}

export function computeRoi(inputs: RoiInputs): RoiResults {
  const annualBudget = inputs.monthlyBudget * 12;
  const appointments =
    inputs.costPerAppointment > 0
      ? Math.floor(annualBudget / inputs.costPerAppointment)
      : 0;
  const deals = Math.round(appointments * inputs.closeRate);
  const revenue = deals * inputs.averageDealSize;
  const roi = annualBudget > 0 ? (revenue - annualBudget) / annualBudget : 0;
  return { annualBudget, appointments, deals, revenue, roi };
}
