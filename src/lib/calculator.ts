/*
 * ROI calculator math — implemented exactly and exported so the numbers
 * shown are the numbers computed, in one place. Deliberately nothing but
 * arithmetic on the visitor's own inputs — no hidden multipliers, no
 * "up to" factors. Stating the math openly is part of the positioning
 * (see the transparency section).
 *
 *   annualBudget    = monthlyBudget × 12
 *   appointments    = floor(annualBudget ÷ costPerAppointment)   — booked, per year
 *   inYearShare     = (12 − salesCycleMonths) ÷ 12                — appointments
 *                     early enough in the year to close inside it
 *   deals           = round(appointments × closeRate × inYearShare)
 *   revenue         = deals × averageDealSize
 *   roi             = (revenue − annualBudget) ÷ annualBudget
 */

export interface RoiInputs {
  monthlyBudget: number;
  costPerAppointment: number;
  averageDealSize: number;
  /** fraction, e.g. 0.30 */
  closeRate: number;
  /** months from appointment to close */
  salesCycleMonths: number;
}

export interface RoiResults {
  annualBudget: number;
  appointments: number;
  /** share of the year's appointments that can close inside the year */
  inYearShare: number;
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
  const inYearShare = Math.max(0, 12 - inputs.salesCycleMonths) / 12;
  const deals = Math.round(appointments * inputs.closeRate * inYearShare);
  const revenue = deals * inputs.averageDealSize;
  const roi = annualBudget > 0 ? (revenue - annualBudget) / annualBudget : 0;
  return { annualBudget, appointments, inYearShare, deals, revenue, roi };
}
