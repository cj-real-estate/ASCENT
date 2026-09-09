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
  /** "$" prefixes the number input; "%" and "months" suffix the readout */
  unit: "none" | "$" | "%" | "months";
  /** whether a number input accompanies the slider */
  numberInput: boolean;
}

/** The ROI calculator — budget ÷ cost per booked appointment → deals, revenue, ROI. */
export interface RoiCalculatorContent {
  kind: "roi";
  fields: {
    monthlyBudget: CalculatorField;
    costPerAppointment: CalculatorField;
    averageDealSize: CalculatorField;
    closeRate: CalculatorField;
    /** Months from appointment to close — only deals that close inside the
     *  year count toward revenue / year. */
    salesCycleMonths: CalculatorField;
  };
  /**
   * Industry picker that seeds cost per booked appointment, deal size,
   * close rate, and sales cycle with planning defaults — every one stays
   * adjustable afterwards. The defaults are Ascent's own planning
   * assumptions, not published benchmarks, and the `note` under the picker
   * says so. null omits the picker (a vertical page already knows the
   * industry).
   */
  industries: {
    label: string;
    note: string;
    options: {
      label: string;
      costPerAppointment: number;
      averageDealSize: number;
      /** percent, e.g. 25 */
      closeRate: number;
      salesCycleMonths: number;
    }[];
  } | null;
  /** Labels over the four output tiles (per-year figures). */
  outputs: {
    appointments: string;
    deals: string;
    revenue: string;
    roi: string;
  };
  /** Permanent line stating the arithmetic openly. Never hidden behind a
   *  toggle — transparency about the math IS the positioning. */
  assumptionLine: string;
}

/**
 * The appointments calculator — cost per appointment held from a media
 * budget, a cost per lead, and the two rates nobody tracks. Used where a
 * revenue projection would be a performance claim the page must not make
 * (a capital raise). Math in src/lib/calculator.ts `computeAppointments`;
 * the definitions mirror the metrics ontology (CPL, contact_rate,
 * lead_to_held, CPA_held). Media spend only — the fee never enters a
 * cost-per number.
 */
export interface AppointmentsCalculatorContent {
  kind: "appointments";
  fields: {
    mediaBudget: CalculatorField;
    costPerLead: CalculatorField;
    /** percent of leads that get a connected (two-way) touch */
    contactRate: CalculatorField;
    /** percent of contacted leads whose meeting is actually held */
    heldRate: CalculatorField;
  };
  /** Labels over the four output tiles (per-month figures). */
  outputs: {
    leads: string;
    costPerHeld: string;
    held: string;
    uncontacted: string;
  };
  /** Permanent, never behind a toggle. */
  assumptionLine: string;
}

export type CalculatorContent =
  | RoiCalculatorContent
  | AppointmentsCalculatorContent;

export interface Stat {
  number: string;
  label: string;
}

export interface PricingCard {
  name: string;
  price: string;
  /** e.g. "one-time · billed at kickoff" */
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

/** Line-icon keys drawn in ServiceIcon.tsx. Shared by every section that
 *  renders an icon so the set stays one closed list. */
export type IconName =
  | "browser"
  | "pin"
  | "cursor"
  | "megaphone"
  | "loop"
  | "phone"
  | "stack"
  | "chart"
  | "calendar"
  | "target"
  | "shield";

export interface ServiceItem {
  title: string;
  body: string;
  icon: IconName;
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

/**
 * Extra content for the dark sponsor template (src/components/sponsor).
 * It renders alongside a `Vertical` — the vertical still carries the gate,
 * booking, boundaries, fit, FAQ, footer and JSON-LD — and this holds only
 * what that template has and the light one doesn't. (`proof` is required by
 * the interface but the dark template does not render it.)
 *
 * Content rules carry over: the hero cards are statements of how the firm
 * operates, never results; nothing here is a performance promise.
 */
export interface SponsorPageContent {
  nav: {
    /** Header CTA — opens the qualification gate. */
    cta: string;
  };
  hero: {
    /** Small mono line above the h1, e.g. "Real Estate · Rule 506(c)". */
    kicker: string;
    h1: string;
    /** Substring of h1 rendered in orange. null renders plain. */
    h1Highlight: string | null;
    sub: string;
    /** Opens the gate. */
    primaryCta: string;
    /** In-page anchor. */
    secondaryCta: { label: string; href: string };
    /**
     * Small trust line under the CTAs, rendered with a flag icon
     * (e.g. "100% American owned & operated"). null renders neither.
     */
    patrioticLine: string | null;
    /**
     * Four commitment cards under the hero: a big label, a title, a body.
     * Practice commitments and written terms — what Ascent does and signs
     * — never a client result or a capital-raised claim.
     */
    cards: { icon: IconName; label: string; title: string; body: string }[];
    /** The line under the cards that says where the terms are set. */
    disclosure: string;
  };
  problems: {
    eyebrow: string;
    h2: string;
    sub: string;
    cards: { icon: IconName; title: string; body: string }[];
    /** Source line for any published figure quoted in the cards. */
    note: string | null;
  };
  /**
   * How Ascent's model compares to the alternatives a sponsor is weighing.
   * Structural comparison of fee models and scope only — never a claim that
   * Ascent performs better, and never a named competitor.
   */
  comparison: {
    eyebrow: string;
    h2: string;
    sub: string;
    /** `highlight` marks the Ascent row — exactly one. */
    rows: { name: string; cost: string; body: string; highlight?: boolean }[];
    note: string;
  };
  process: {
    eyebrow: string;
    h2: string;
    sub: string;
    /** Numbered 01–04 in the UI, each behind a large ghost numeral and an icon tile. */
    steps: { icon: IconName; title: string; body: string }[];
    cta: string;
  };
  included: {
    eyebrow: string;
    h2: string;
    sub: string;
    cards: { icon: IconName; title: string; bullets: string[] }[];
    /** The orange card that closes the grid. */
    ctaCard: { title: string; body: string; cta: string };
  };
  ctaBand: { h2: string; body: string; cta: string };
  /**
   * "At a glance" — the entity block. One definition sentence that stands
   * alone, then label/value facts. Written to be lifted whole by an answer
   * engine, so every value is a checkable fact about how the firm operates,
   * never an outcome.
   */
  glance: {
    eyebrow: string;
    h2: string;
    definition: string;
    facts: { label: string; value: string }[];
  };
  /** The guides strip — links into content/guides. */
  guides: {
    eyebrow: string;
    h2: string;
    sub: string;
    /** Label on the link to the guides index. */
    indexLabel: string;
  };
  /** The long-form disclosure block in the footer. */
  legal: { heading: string; paragraphs: string[] };
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
  /**
   * Absolute canonical URL when the vertical is the ROOT of its own domain
   * (e.g. "https://ascentforsponsors.com" — next.config.ts rewrites that
   * host's "/" to `path`). Omit for verticals that live on the primary
   * site; canonical is then derived from `path`. A vertical with this set
   * is listed by its own domain's sitemap, not the primary one.
   */
  canonicalUrl?: string;

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
    /**
     * Entity facts for the Organization JSON-LD on a vertical that is its
     * own domain. `legalName` is the registered name; `founder` is a named
     * person (Person schema, and the byline on the guides); `sameAs` is
     * the list of the firm's own profile URLs — LinkedIn company page and
     * the like — that tell search and answer engines the entity is the
     * same one. Leave `sameAs` empty rather than guess a URL.
     */
    legalName?: string;
    founder?: { name: string; title: string };
    sameAs?: string[];
  };

  seo: {
    title: string;
    description: string;
    /** Path under /public for the social card. Defaults to /og-image.png. */
    ogImage?: string;
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
    /** The division-of-labor line, set on its own in ink under the sub so
     *  it lands as a beat instead of dying at the end of a paragraph.
     *  Short and parallel ("You close the deals. We run the system.").
     *  null renders nothing. */
    closingLine: string | null;
    cta: string;
    /** Lower-friction second path — same gate, tagged as its own interest.
     *  null renders only the primary CTA. */
    secondaryCta: string | null;
    /** Practice-claim chips floated around the hero graphic — short, true,
     *  checkable ("Every setter call recorded"). Never numbers. An empty
     *  array renders none. */
    chips: string[];
    /**
     * The hero object: an illustrative week of appointments landing on the
     * owner's calendar. Generic labels only ("Booked", "Setter call") —
     * never names, companies, dollar figures, or counts presented as
     * results. null falls back to the three-stat strip.
     */
    calendar: {
      /** Mono title on the card chrome */
      title: string;
      /** Column labels, in order */
      days: string[];
      /** Row labels, in order */
      times: string[];
      blocks: {
        /** index into `days` */
        day: number;
        /** index into `times` */
        row: number;
        label: string;
        time: string;
        /** "booked" = an appointment block; "call" = a recorded setter call */
        kind: "booked" | "call";
      }[];
      /** Practice-claim line under the grid */
      caption: string;
    } | null;
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
   * The mechanism, drawn — the page's one real diagram. Four stages from a
   * raw lead to an appointment on the calendar, so "our system" is shown
   * rather than asserted. Stage copy describes what the system DOES; never
   * put counts, rates, or dollars in here — those belong in `proof`,
   * attributed. null omits the section.
   */
  systemFlow: {
    eyebrow: string;
    h2: string;
    sub: string;
    stages: {
      icon: IconName;
      title: string;
      body: string;
      /** Prominent pill on the card — the one standard that makes this
       *  stage concrete ("Under 10 min"). A statement of how the firm
       *  operates, never a measured result. null renders none. */
      badge: string | null;
    }[];
    closing: string;
  } | null;

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

  /**
   * Price grid. null on a vertical that publishes no pricing and carries an
   * `expectations` section in its place.
   */
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
  } | null;

  /**
   * How an engagement runs, numbered — the section a page uses INSTEAD of
   * a price grid when pricing is quoted after a call rather than published.
   * Practice commitments only; never a performance promise. null omits it.
   */
  expectations: {
    eyebrow: string;
    h2: string;
    intro: string | null;
    items: { title: string; body: string }[];
  } | null;

  /**
   * Standing limits — what the firm will not do. Written for the buyer who
   * has veto power and no upside from saying yes (counsel, the CFO). Dark
   * section. null omits it.
   */
  boundaries: {
    eyebrow: string;
    h2: string;
    intro: string;
    items: { title: string; body: string }[];
    closing: string;
  } | null;

  /** Qualifiers and disqualifiers side by side. null omits it. */
  fit: {
    eyebrow: string;
    h2: string;
    forYouHeading: string;
    forYou: string[];
    notForYouHeading: string;
    notForYou: string[];
    note: string | null;
  } | null;

  /** Full three-guarantee section. null where the page carries the single
   *  `pricing.guaranteeLine` instead. */
  guarantees: {
    eyebrow: string;
    h2: string;
    items: GuaranteeItem[];
    conditions: string;
  } | null;

  booking: {
    eyebrow: string;
    h2: string;
    body: string;
    /**
     * DECISION #4 — Cal.com (recommended) or Calendly embed link.
     * null renders the fallback form as the only path.
     */
    schedulingLink: string | null;
    form: FormContent;
  };

  /**
   * How the firm reports — recorded and monitored setter calls, cost per
   * appointment held over cost per lead, plain-dollar reporting. Practice
   * claims only (things the firm does), never performance claims (numbers
   * belong in `proof`, attributed). null omits the section.
   */
  transparency: {
    eyebrow: string;
    h2: string;
    items: { icon: IconName; title: string; body: string }[];
  } | null;

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
    /**
     * Standing regulatory line, e.g. the not-a-broker-dealer statement that
     * goes on every sponsor-facing document. null renders nothing.
     */
    complianceLine: string | null;
  };
}
