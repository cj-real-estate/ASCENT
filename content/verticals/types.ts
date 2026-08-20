/*
 * The Vertical contract.
 *
 * Every vertical-specific string on the site — the trade, the city, the
 * examples, the eyebrow — lives in a module implementing this interface.
 * Components read from it and never hard-code a trade or market.
 * Adding a second trade = one new file implementing `Vertical` + a route.
 */

export interface CalculatorField {
  /** aria-label / visible label */
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  /** "$" prefixes the number input; "%" suffixes the readout */
  unit: "none" | "$" | "%";
  /** whether a number input accompanies the slider */
  numberInput: boolean;
}

export interface CalculatorContent {
  fields: {
    estimatesPerMonth: CalculatorField;
    averageTicket: CalculatorField;
    closeRate: CalculatorField;
    months: CalculatorField;
  };
  /** Mono label above the primary output */
  outputLabel: string;
  /** Template — "{valueUnclosed}" is replaced with the formatted dollar figure */
  secondaryLine: string;
  /** Permanent assumption line. Never hidden behind a toggle. */
  assumptionLine: string;
}

export interface Stat {
  number: string;
  label: string;
}

export interface PricingCard {
  name: string;
  price: string;
  /** e.g. "founding rate · $2,500 after" */
  priceNote?: string;
  line: string;
  /** exactly one card per vertical may set this — the single dark card */
  dark?: boolean;
}

export interface GuaranteeItem {
  title: string;
  body: string;
}

export interface HowItWorksStep {
  title: string;
  body: string;
}

export interface FormContent {
  nameLabel: string;
  companyLabel: string;
  phoneLabel: string;
  emailLabel: string;
  estimatesSelectLabel: string;
  estimatesSelectOptions: string[];
  submitLabel: string;
  submittingLabel: string;
}

export interface Vertical {
  slug: string;

  business: {
    /** Full legal-ish display name — "Ascent Client Acquisition Systems" */
    name: string;
    shortName: string;
    url: string;
    city: string;
    region: string;
    /** For LocalBusiness JSON-LD */
    areaServed: string;
    /** null until the client supplies it — renders a visible placeholder */
    phone: string | null;
    /** null until the client supplies it — renders a visible placeholder */
    email: string | null;
  };

  seo: {
    title: string;
    description: string;
  };

  header: {
    cta: string;
  };

  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    cta: string;
    microcopy: string;
  };

  calculator: CalculatorContent;

  problem: {
    eyebrow: string;
    h2: string;
    paragraphs: string[];
  };

  proof: {
    /** visually hidden heading for the document outline */
    srHeading: string;
    stats: Stat[];
    /**
     * DECISION #1 — exact attribution wording owed by the client.
     * null renders a visible [NEEDS ATTRIBUTION LINE] placeholder.
     * Do NOT fill with a vague line like "results from a recent client".
     */
    attributionLine: string | null;
    /**
     * DECISION #2 — ad-account screenshots, if cleared for publication.
     * Paths under /public. Empty until supplied.
     */
    screenshots: { src: string; alt: string }[];
  };

  howItWorks: {
    eyebrow: string;
    h2: string;
    steps: HowItWorksStep[];
    closing: string;
  };

  pricing: {
    h2: string;
    cards: PricingCard[];
    note: string;
  };

  guarantees: {
    eyebrow: string;
    h2: string;
    items: GuaranteeItem[];
    conditions: string;
  };

  foundingFive: {
    h2: string;
    body: string;
    capTotal: number;
    counterSuffix: string;
    /** Shown instead of the counter when spots hit 0 */
    filledLine: string;
  };

  booking: {
    eyebrow: string;
    h2: string;
    /** Waitlist framing used when foundingSpotsRemaining === 0 */
    h2Waitlist: string;
    body: string;
    /**
     * DECISION #4 — Cal.com (recommended) or Calendly embed link.
     * null renders the fallback form as the only path.
     */
    schedulingLink: string | null;
    form: FormContent;
  };

  thanks: {
    h1: string;
    body: string[];
    backLabel: string;
  };

  footer: {
    tagline: string;
    locationLine: string;
  };
}
