/*
 * The content-module contract every vertical page is built from.
 *
 * The rule that makes this architecture work: every trade-specific string —
 * headlines, labels, proof, vocabulary — lives in a `Vertical` object
 * (`content/verticals/*.ts`). Components render whatever they are given and
 * must never contain a trade name. To add a vertical, add a content file and
 * a three-line route; if a new page genuinely needs a field that doesn't
 * exist yet, widen this interface and update every existing content file to
 * match — do not fork the components.
 */

export interface CalculatorField {
  /** Visible label, also used as the slider's aria-label. */
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  /** How the value reads next to the slider and in aria-valuetext. */
  format: "plain" | "dollars" | "percent";
}

export interface CalculatorContent {
  estimatesPerMonth: CalculatorField;
  averageTicket: CalculatorField;
  /** Percent as a whole number in the UI (30 = 30%). */
  closeRate: CalculatorField;
  months: CalculatorField;
  /** Mono label above the big number. */
  outputLabel: string;
  /** May contain `{valueUnclosed}`, replaced with the formatted dollar figure. */
  secondaryLine: string;
  /** Permanent, never behind a toggle. */
  assumptionLine: string;
}

export interface InstallItem {
  title: string;
  body: string;
}

export interface OwnerStep {
  title: string;
  body: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ProofScreenshot {
  /** Path under /public. */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface OfferCard {
  name: string;
  price: string;
  /** e.g. "founding rate · $2,500 after" */
  priceNote?: string;
  body: string;
  /** The emphasized Ink-background card. */
  dark?: boolean;
}

export interface Vertical {
  /** Route path, e.g. "/" or "/fence". */
  path: string;
  /** Used in analytics events and the booking payload, never rendered. */
  slug: string;
  seo: {
    title: string;
    description: string;
  };
  header: {
    ctaLabel: string;
  };
  hero: {
    /** Mono orange eyebrow, e.g. "CLIENT ACQUISITION SYSTEMS · OKLAHOMA". */
    eyebrow: string;
    /** One block per line of the H1. */
    headline: string[];
    sub: string;
    ctaLabel: string;
    /** Mono fog line under the CTA. */
    microcopy: string;
  };
  calculator: CalculatorContent;
  problem: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
  };
  install: {
    eyebrow: string;
    heading: string;
    /** Deliberately unnumbered — this isn't a sequence. */
    items: InstallItem[];
    ownerCard: {
      heading: string;
      /** Numbered 1–3 in the UI. */
      steps: OwnerStep[];
      closingLine: string;
    };
  };
  proof: {
    /** Ink semibold line above the stats. Names the trade — never genericized. */
    framingLine: string;
    stats: Stat[];
    /**
     * One sentence: whose results, what market, what period. `null` renders
     * the visible [NEEDS ATTRIBUTION LINE] placeholder — never fill this
     * with plausible-sounding copy.
     */
    attributionLine: string | null;
    /** Ad-account screenshots, if the client approves publishing them. */
    screenshots?: ProofScreenshot[];
  };
  offer: {
    eyebrow: string;
    heading: string;
    cards: OfferCard[];
    /** Rendered beneath the dark card, mono and prominent. */
    guaranteeLine: string;
    /** Small slate note under the grid. */
    note: string;
    /**
     * Maintained by hand by the client — never a timer, never
     * auto-decrementing. `null` or `0` omits the line entirely.
     */
    foundingSpotsRemaining: number | null;
    /** May contain `{n}`. */
    foundingSpotsTemplate: string;
  };
  booking: {
    eyebrow: string;
    heading: string;
    body: string;
    /**
     * Cal.com link like "ascent/pipeline-audit". `null` renders the fallback
     * form instead of the embed. [DECISION] — pending the client's choice of
     * scheduler and link.
     */
    calLink: string | null;
    form: {
      estimatesSelectLabel: string;
      estimatesOptions: string[];
      /**
       * Free-text trade input — deliberately not a dropdown; what people
       * type is market research. `null` omits the field (a single-trade
       * page already knows the answer).
       */
      tradeField: { label: string; placeholder: string } | null;
    };
  };
  footer: {
    businessName: string;
    location: string;
    /** `null` renders a visible pending placeholder. [DECISION] */
    phone: string | null;
    /** `null` renders a visible pending placeholder. [DECISION] */
    email: string | null;
  };
}
