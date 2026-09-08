/*
 * Calculator math — implemented exactly and exported so the numbers shown
 * are the numbers computed, in one place. Deliberately nothing but
 * arithmetic on the visitor's own inputs — no hidden multipliers, no
 * "up to" factors. Stating the math openly is part of the positioning
 * (see the transparency section).
 *
 * ROI (the trade pages):
 *
 *   annualBudget    = monthlyBudget × 12
 *   appointments    = floor(annualBudget ÷ costPerAppointment)   — booked, per year
 *   inYearShare     = (12 − salesCycleMonths) ÷ 12                — appointments
 *                     early enough in the year to close inside it
 *   deals           = round(appointments × closeRate × inYearShare)
 *   revenue         = deals × averageDealSize
 *   roi             = (revenue − annualBudget) ÷ annualBudget
 *
 * Appointments (the sponsor page) — the metrics ontology, per month:
 *
 *   leads           = mediaBudget ÷ costPerLead                   (CPL, inverted)
 *   contacted       = leads × contactRate                         (contact_rate)
 *   held            = contacted × heldRate
 *   costPerHeld     = mediaBudget ÷ held                          (CPA_held)
 *
 * CPA_held is media spend only — the fee never enters a cost-per metric
 * unless a report is explicitly labelled fully loaded.
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

export interface AppointmentInputs {
  mediaBudget: number;
  costPerLead: number;
  /** fraction, 0–1 */
  contactRate: number;
  /** fraction, 0–1, of contacted leads */
  heldRate: number;
}

export interface AppointmentResults {
  leads: number;
  contacted: number;
  uncontacted: number;
  held: number;
  /** Infinity when nothing is held — the UI renders that as a dash */
  costPerHeld: number;
}

export function computeAppointments(
  inputs: AppointmentInputs,
): AppointmentResults {
  const leads =
    inputs.costPerLead > 0 ? inputs.mediaBudget / inputs.costPerLead : 0;
  const contacted = leads * inputs.contactRate;
  const uncontacted = leads - contacted;
  const held = contacted * inputs.heldRate;
  const costPerHeld = held > 0 ? inputs.mediaBudget / held : Infinity;
  return { leads, contacted, uncontacted, held, costPerHeld };
}
