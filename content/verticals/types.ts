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

export interface ServiceItem {
  title: string;
  body: string;
  /** Line-icon key rendered beside the title (see ServiceIcon.tsx). */
  icon:
    | "browser"
    | "pin"
    | "cursor"
    | "megaphone"
    | "loop"
    | "stack"
    | "chart";
}

export interface ServicesContent {
  eyebrow: string;
  h2: string;
  /** Deliberately unnumbered — these are a menu, not a sequence. */
  items: ServiceItem[];
  /**
   * The order argument, below the grid: follow-up first, traffic after.
   * Without it a flat service list implies everything runs on day one.
   */
  closing: string;
  /**
   * The dark "what you actually do" card. null on verticals that carry the
   * same three steps in a standalone `howItWorks` section instead.
   */
  ownerCard: {
    heading: string;
    /** Numbered 1-3 in the UI. */
    steps: HowItWorksStep[];
    closing: string;
  } | null;
}

/**
 * Free-text trade input. Deliberately not a dropdown: a dropdown is always
 * missing someone's trade, and what people type is useful market research.
 * null omits the field on a vertical that already knows the trade.
 */
export interface TradeField {
  label: string;
  placeholder: string;
}

export interface FormContent {
  nameLabel: string;
  companyLabel: string;
  phoneLabel: string;
  emailLabel: string;
  estimatesSelectLabel: string;
  estimatesSelectOptions: string[];
  tradeField: TradeField | null;
  submitLabel: string;
  submittingLabel: string;
}

export interface QualifyOption {
  label: string;
  /** Choosing this option keeps the prospect inside the ICP. */
  qualifies: boolean;
}

export interface QualifyQuestion {
  /** Stable key used in the lead email, e.g. "estimatesPerMonth". */
  key: string;
  label: string;
  options: QualifyOption[];
}

export interface QualificationContent {
  nameLabel: string;
  companyLabel: string;
  phoneLabel: string;
  emailLabel: string;
  questions: QualifyQuestion[];
  /** Progress line above the card — "{n}" and "{total}" are replaced. */
  stepLabel: string;
  backLabel: string;
  continueLabel: string;
  /** Heading + line on the final (contact) card. Contact comes last on
   *  purpose: painless multiple-choice first, details once invested. */
  contactHeading: string;
  contactSub: string;
  submitLabel: string;
  submittingLabel: string;
  /** Shown above the scheduler after a qualifying submit. */
  passHeading: string;
  passBody: string;
  /** Pass state when booking.schedulingLink is null — no scheduler to show. */
  passFallbackBody: string;
  /** Shown instead of the scheduler after a non-qualifying submit. */
  declineHeading: string;
  declineBody: string;
  /**
   * The trust strip under the gate — short, checkable claims only (the
   * no-cost promise, the written guarantee, a real attributed result).
   * Never badges, logos, or anything the site can't back.
   */
  trustItems: string[];
}

export interface ApplyPageContent {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  h1: string;
  sub: string;
}

export interface Vertical {
  slug: string;
  /** Route this vertical is served at — used for canonicals and the sitemap. */
  path: string;

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
    /** Substring of h1 rendered in orange — the one load-bearing phrase.
     *  null renders the h1 in plain paper. Large text only (3:1 on ink). */
    h1Highlight: string | null;
    sub: string;
    cta: string;
    /** Lower-friction second path — same gate, tagged as its own interest.
     *  null renders only the primary CTA. */
    secondaryCta: string | null;
    microcopy: string;
  };

  calculator: CalculatorContent;

  /**
   * The section that hosts the calculator now that it no longer lives in
   * the hero — the hero sells the system, this section quantifies the
   * problem right after it's described.
   */
  calculatorSection: {
    eyebrow: string;
    h2: string;
    sub: string;
  };

  problem: {
    eyebrow: string;
    h2: string;
    paragraphs: string[];
  };

  proof: {
    /** visually hidden heading for the document outline */
    srHeading: string;
    /**
     * Ink semibold line above the stats. On a trade-agnostic page this
     * names the trade the results actually came from — never genericise a
     * real case into "a client", which reads as fabrication.
     * null renders no line (a vertical whose own trade matches the case).
     */
    framingLine: string | null;
    stats: Stat[];
    /**
     * DECISION #1 — exact attribution wording owed by the client.
     * null renders a visible [NEEDS ATTRIBUTION LINE] placeholder.
     * Do NOT fill with a vague line like "results from a recent client".
     */
    attributionLine: string | null;
    /**
     * The campaign-report card — a dashboard-styled graphic built ONLY from
     * the published, attributed numbers. Never invent a value to fill a
     * tile; null omits the card.
     */
    reportCard: {
      title: string;
      rows: { label: string; value: string }[];
      footerLabel: string;
      footerValue: string;
    } | null;
    /**
     * DECISION #2 — ad-account screenshots, if cleared for publication.
     * Paths under /public. Empty until supplied.
     */
    screenshots: { src: string; alt: string }[];
  };

  /**
   * Everything the firm sells, in one grid. null omits the section.
   * Claims here must match what is actually delivered — the follow-up is
   * texts and emails, not automated calling.
   */
  services: ServicesContent | null;

  /**
   * Standalone three-step section. null on verticals that carry the same
   * three steps inside `install.ownerCard` instead.
   */
  howItWorks: {
    eyebrow: string;
    h2: string;
    steps: HowItWorksStep[];
    closing: string;
  } | null;

  pricing: {
    /** Mono eyebrow. Only rendered on a `paper` background — Orange Deep
     *  measures 4.43:1 on Surface, under the 4.5 floor. */
    eyebrow: string | null;
    h2: string;
    cards: PricingCard[];
    /** Rendered beneath the dark card, mono and prominent. Used where the
     *  page carries a single guarantee instead of a `guarantees` section. */
    guaranteeLine: string | null;
    note: string;
    /** Section background. `surface` requires `eyebrow: null` (contrast). */
    background: "paper" | "surface";
    /** Render the manually-maintained founding-spots line in this section. */
    showFoundingSpots: boolean;
    /** e.g. "of 5 founding spots remaining" */
    foundingSpotsSuffix: string;
  };

  /** Full three-guarantee section. null where the page carries the single
   *  `pricing.guaranteeLine` instead. */
  guarantees: {
    eyebrow: string;
    h2: string;
    items: GuaranteeItem[];
    conditions: string;
  } | null;

  /** Standalone Founding Five section. null omits it entirely. */
  foundingFive: {
    h2: string;
    body: string;
    capTotal: number;
    counterSuffix: string;
    /** Shown instead of the counter when spots hit 0 */
    filledLine: string;
  } | null;

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

  /** ICP gate in front of the scheduler. A prospect qualifies only when every
   *  chosen option has qualifies: true. Thresholds are tuned here, in content,
   *  never in components. */
  qualification: QualificationContent;

  /** The standalone social-CTA page at /apply. null on verticals without one. */
  applyPage: ApplyPageContent | null;

  /**
   * Accordion FAQ, rendered before the booking section. Answers must be
   * assembled from facts already published on the page — pricing,
   * guarantees, the owner's three jobs — never new claims. null omits it.
   */
  faq: {
    eyebrow: string;
    h2: string;
    items: { q: string; a: string }[];
  } | null;

  thanks: {
    h1: string;
    body: string[];
    backLabel: string;
  };

  footer: {
    tagline: string;
    locationLine: string;
    /** Label of the /privacy link — rendered in the Footer and on /apply. */
    privacyLabel: string;
  };
}
