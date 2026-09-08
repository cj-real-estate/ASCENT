import type { Vertical } from "./types";

/*
 * ascentforsponsors.com — investor acquisition for real estate syndicators
 * and private real estate fund sponsors raising under Reg D Rule 506(c).
 *
 * Served at /sponsors and, via the host rewrite in next.config.ts, as the
 * ROOT of ascentforsponsors.com. `business.url` and `canonicalUrl` point at
 * that domain, so the canonical, JSON-LD, robots and sitemap all describe
 * the sponsor site whichever host actually served the request.
 *
 * Sources: the Ascent business plan (RE sponsors, second edition, Sept
 * 2026), the Brand Style Guide v2.0, Delivery Boundaries v2.0, and the
 * metrics ontology. Several conventions here are compliance positions, not
 * style choices — keep them when editing:
 *
 *   - "appointment held", never set / booked / scheduled.
 *   - "investor lead", never prospect or qualified investor.
 *   - "flat monthly fee" — nothing tied to capital raised, investors
 *     acquired, or appointments held. NEVER a performance guarantee on this
 *     page: a guarantee belongs in a proposal, not in collateral, which is
 *     why `guarantees` and `pricing.guaranteeLine` are absent here.
 *   - "sponsor" / "issuer"; the investors are never Ascent's.
 *   - Live, human, scripted calls only. The automated channels are texts
 *     and emails — write the channel out; never "automated calls".
 *   - No pricing published. It is quoted in writing after the scoping call
 *     (`pricing: null`, `expectations` in its place).
 *   - Every number on the page traces to the metrics ontology or to a
 *     published, attributed category benchmark. No Ascent results are
 *     published until a sponsor agrees to a named, written case study.
 */
const sponsors: Vertical = {
  slug: "sponsors",
  path: "/sponsors",
  canonicalUrl: "https://ascentforsponsors.com",

  business: {
    name: "Ascent Client Acquisition Systems",
    shortName: "Ascent",
    url: "https://ascentforsponsors.com",
    city: "Oklahoma City",
    region: "OK",
    // Delivery is entirely remote; the firm sells nationally.
    areaServed: "United States",
    phone: "580-304-8470",
    // The sponsor domain's own mailbox — footer, /privacy and JSON-LD pick
    // it up. It must exist and be monitored; nothing on the site sends to it.
    email: "info@ascentforsponsors.com",
  },

  seo: {
    // The root layout appends " | Ascent".
    title: "Investor Acquisition for 506(c) Real Estate Sponsors",
    description:
      "Paid media, instrumented lead response, and a live, scripted appointment setter for real estate syndicators and fund sponsors raising under Rule 506(c) — inside a structure your securities counsel approves in writing. Flat monthly fee. Cost per appointment held is the number.",
  },

  header: {
    cta: "Book a scoping call",
  },

  hero: {
    // The one eyebrow the brand guide mandates. "(c)" survives the CSS
    // uppercase via EyebrowText — it is a rule citation, not a letter.
    eyebrow: "INVESTOR ACQUISITION FOR 506(c) SPONSORS",
    h1: "Investor meetings held, not just investor leads.",
    // The orange lands on the promise, never on the problem.
    h1Highlight: "Investor meetings held",
    sub: "Roughly two percent of investor leads become investors. Most of the rest were never called, or were called days later by someone reading no script — and you paid to generate every one. Ascent works the other ninety-eight: a live setter calling as you, inside a structure your securities counsel approved in writing.",
    closingLine: "You run the investor conversation. We run everything before it.",
    cta: "Book a scoping call",
    secondaryCta: null,
    // Practice claims only — things a sponsor or their counsel can check.
    chips: [
      "Every setter call recorded",
      "Counsel-approved script",
      "Cost per appointment held",
    ],
    // Illustrative week — generic labels only, never names, funds, dollar
    // figures, or counts presented as results.
    calendar: {
      title: "Your calendar — this week",
      days: ["Mon", "Tue", "Wed", "Thu"],
      times: ["9:00", "11:00", "1:00", "3:00"],
      blocks: [
        { day: 0, row: 1, label: "Investor meeting", time: "11:00", kind: "booked" },
        { day: 1, row: 0, label: "Setter call", time: "9:30 · REC", kind: "call" },
        { day: 1, row: 2, label: "Investor meeting", time: "1:00", kind: "booked" },
        { day: 2, row: 1, label: "Investor meeting", time: "11:30", kind: "booked" },
        { day: 2, row: 3, label: "Setter call", time: "3:15 · REC", kind: "call" },
        { day: 3, row: 0, label: "Investor meeting", time: "9:00", kind: "booked" },
        { day: 3, row: 2, label: "Investor meeting", time: "1:30", kind: "booked" },
      ],
      caption:
        "Investor leads called back by a live setter, as you, on a script your counsel approved — then confirmed onto your calendar.",
    },
    microcopy: "30 minutes. No cost, no obligation. Counsel welcome.",
  },

  /*
   * Cost per appointment held — the primary metric — from the sponsor's own
   * assumptions. Deliberately NOT a revenue or capital-raised projection:
   * that would be a performance claim this page must not make.
   */
  calculator: {
    kind: "appointments",
    fields: {
      mediaBudget: {
        label: "Monthly media budget",
        min: 5000,
        max: 100000,
        step: 1000,
        defaultValue: 15000,
        unit: "$",
        numberInput: true,
      },
      costPerLead: {
        label: "Cost per investor lead",
        min: 25,
        max: 500,
        step: 5,
        defaultValue: 75,
        unit: "$",
        numberInput: true,
      },
      contactRate: {
        label: "Leads that get a connected touch",
        min: 10,
        max: 90,
        step: 1,
        defaultValue: 40,
        unit: "%",
        numberInput: false,
      },
      heldRate: {
        label: "Contacted leads whose meeting is held",
        min: 5,
        max: 60,
        step: 1,
        defaultValue: 20,
        unit: "%",
        numberInput: false,
      },
    },
    outputs: {
      leads: "Investor leads / month",
      costPerHeld: "Cost per appointment held",
      held: "Appointments held / month",
      uncontacted: "Leads never contacted / month",
    },
    assumptionLine:
      "Arithmetic on your assumptions, not a projection: budget ÷ cost per lead, × the share reached, × the share whose meeting is held. Cost per lead defaults to the published Meta benchmark for this category; the two rates are yours to set. Media spend only — the fee never enters a cost-per number unless a report says fully loaded.",
  },

  calculatorSection: {
    eyebrow: "RUN YOUR RAISE'S NUMBERS",
    h2: "What does one investor appointment held cost you?",
    sub: "Set your media budget and cost per lead, then the two rates nobody tracks — how many leads get a connected touch, and how many of those turn into a meeting that is actually held. That last number is the one we manage to.",
  },

  problem: {
    eyebrow: "THE ACTUAL PROBLEM",
    h2: "Your raise isn't short on leads. It's short on the first ninety seconds after one arrives.",
    paragraphs: [
      "An accredited investor fills out the form on your ad. They get an email autoresponder. A human calls them three days later, if at all, working from no script, on a line nobody records. Your agency reports the lead as delivered — and by its definition, it was.",
      "Every agency in this category sells the top of that funnel: targeting, landing pages, creative, nurture. Their published service lists contain no live calling, no appointment setting, and no investor-relations staffing. The published lead-to-investor rate is about two percent, and nobody in the chain is paid to move it.",
      "Capital-raise marketing sits in the gap between two professions. Marketing agencies write manufactured urgency into what is legally a securities communication. Securities lawyers know the rules and cannot run a media buy. Neither one measures speed to lead, contact rate, or whether a meeting that was booked was ever held.",
      "Ascent is built to sit in that gap on purpose. It runs the media, staffs the phone with a live setter calling as you, instruments every touch, and does all of it inside a structure your securities counsel has approved in writing before anything publishes.",
    ],
  },

  /*
   * The diagram. Stage copy describes what the system DOES — never counts,
   * rates, or dollars. Badges are statements of how the firm operates.
   */
  systemFlow: {
    eyebrow: "HOW THE SYSTEM WORKS",
    h2: "One machine, four stages. Your counsel signs before it starts.",
    sub: "Every investor lead runs the same path, timestamped at every step, so the report can say exactly where the ninety-eight percent went — and the conversation about your offering stays yours alone.",
    stages: [
      {
        icon: "megaphone",
        title: "An investor lead lands",
        body: "From LinkedIn, Meta, or search — into one CRM you own, timestamped the moment it arrives. Every ad was drafted against the metrics your counsel approved.",
        badge: null,
      },
      {
        icon: "loop",
        title: "Instant acknowledgement",
        body: "A text and an email go out from your name within seconds and the nurture sequence starts. First touch and first human touch are recorded as separate fields.",
        badge: "Texts and emails",
      },
      {
        icon: "phone",
        title: "A live setter calls, as you",
        body: "Under your name, from a number registered to you, on the script your counsel approved. Logistics only — never the offering. Every call recorded.",
        badge: "Live · scripted · recorded",
      },
      {
        icon: "calendar",
        title: "The meeting is held",
        body: "Attendance confirmed beforehand, no-shows rescheduled, the outcome logged. Cost per appointment held is media spend divided by meetings that happened.",
        badge: null,
      },
    ],
    closing: "Four stages — and the conversation about your offering is the only one that's yours.",
  },

  services: {
    eyebrow: "WHAT WE INSTALL AND OPERATE",
    h2: "One system, four parts. The value is in the handoffs.",
    items: [
      {
        icon: "shield",
        title: "A compliance gate that closes before anything runs.",
        body: "Nine conditions, in writing, before an ad publishes or a call is placed: your counsel confirms the exemption, names an approver of record, and approves every legend and the complete setter script.",
      },
      {
        icon: "megaphone",
        title: "A paid media lane your counsel already approved.",
        body: "LinkedIn for accredited-investor quality, Meta for volume, Google for existing demand. No projected returns, no guarantees, no manufactured urgency. Media is billed by the platform to your own account — Ascent never holds or marks it up.",
      },
      {
        icon: "loop",
        title: "Instrumented lead response.",
        body: "Instant acknowledgement of every lead by text and email, a staged nurture sequence, and the measurement layer missing everywhere else: first human touch timestamped, contact and set rates bucketed by response time.",
      },
      {
        icon: "phone",
        title: "A live setter, calling as you, from your number.",
        body: "Recruited, scripted, trained and supervised by Ascent. Calls your inbound investor leads under your name on a counsel-approved script. Every call recorded and available to you and to counsel. The setter never discusses the offering.",
      },
    ],
    closing:
      "Nothing is switched on out of order. The compliance gate closes first; the lane builds in fourteen days from access and approvals; the setter dials only inbound leads the lane produced — never a purchased list, never your old database without scoping it first.",
    ownerCard: {
      heading: "Three things. That's your whole job.",
      steps: [
        {
          title: "Approve the script and the creative.",
          body: "One complete package, one review deadline, three business days. Your counsel sees everything before the first dial.",
        },
        {
          title: "Run the investor meeting.",
          body: "The setter gets the meeting held. The conversation about your offering is yours, and only yours.",
        },
        {
          title: "Tap the outcome in the CRM.",
          body: "Held, rescheduled, committed, passed. Two seconds, and it's what keeps the reporting honest.",
        },
      ],
      closing:
        "Everything else — the gate, the lane, the setter's recruiting, training and supervision, the reporting — is installed and operated by Ascent. Everything built belongs to you: the number, the recordings, the list.",
    },
  },

  // Folded into services.ownerCard on this page.
  howItWorks: null,

  proof: {
    srHeading: "The category's published numbers",
    framingLine:
      "The category publishes its own failure rate. These are the published benchmarks for 506(c) investor acquisition — not Ascent's numbers, and the reason the setter exists.",
    stats: [
      { number: "~2%", label: "of investor leads become investors" },
      {
        number: "$50–$100",
        label: "cost per investor lead on Meta; LinkedIn runs roughly five times that",
      },
      {
        number: "$3.5K–4.5K",
        label: "cost per funded investor, within 90 days of first contact",
      },
    ],
    // A published source, not a client result. Ascent publishes none of its
    // own sponsor numbers until a sponsor agrees to a named, written case
    // study — never fill this with an unattributed figure.
    attributionLine:
      "Published category benchmarks for real estate 506(c) investor marketing (GowerCrowd). Ascent reports its own numbers to each sponsor weekly and publishes none of them without a named, written case study.",
    reportCard: null,
    screenshots: [],
  },

  /*
   * Practice claims only — what a sponsor or their counsel can check.
   * Numbers live in `proof`, attributed.
   */
  transparency: {
    eyebrow: "HOW WE REPORT",
    h2: "The four numbers your current vendor doesn't produce.",
    items: [
      {
        icon: "target",
        title: "Cost per appointment held — never per appointment set.",
        body: "Media spend divided by meetings that actually happened. It cannot be inflated by booking meetings nobody attends, which is why it is the number we manage to.",
      },
      {
        icon: "chart",
        title: "Speed to first human touch, in seconds.",
        body: "Median, not mean, and bucketed — contact rate and set rate by how fast the lead was reached, plus set-to-held rate. Weekly, in a fifteen-minute call; long-form at thirty, sixty and ninety days.",
      },
      {
        icon: "shield",
        title: "Every call recorded, available to you and to counsel.",
        body: "Ask for any recording, any time. Reviewed weekly against a call-quality rubric. Quality isn't asserted; it's auditable.",
      },
    ],
  },

  boundaries: {
    eyebrow: "WHAT WE NEVER DO",
    h2: "The terms on which Ascent is not a broker.",
    intro:
      "On a capital-raise engagement these are not scope decisions. They are absolute, they are in the contract, and they are the reason your securities counsel can approve the structure without redrafting it.",
    items: [
      {
        title: "Flat monthly fee. Nothing else.",
        body: "Nothing tied to capital raised, investors acquired, or appointments held. Never traded for upside, at any performance level. The CRM has no field for it, so it cannot be argued about.",
      },
      {
        title: "The setter never discusses the offering.",
        body: "No returns, valuation, merits, timing, or terms. Every touch is logistical. A breach is a stop-work event, not a coaching moment.",
      },
      {
        title: "Verification stays with you, permanently.",
        body: "Ascent never asks about, assesses, or verifies accredited-investor status. Ascent never touches funds and never gives investment advice.",
      },
      {
        title: "Nothing publishes and nobody dials without counsel approval.",
        body: "If an approval lapses, calling stops the same day, in writing. If your counsel raises a question, the lane pauses until it is answered.",
      },
      {
        title: "Live, human, scripted calls only.",
        body: "No prerecorded audio, no artificial voice, no robo-dialing. Only inbound leads you generated — never a purchased list, never a scraped number, never your old database without scoping it first.",
      },
      {
        title: "Everything built belongs to you.",
        body: "The phone number is registered to you. The recordings are yours. The investor list is yours at the end, whether or not you stay.",
      },
    ],
    closing:
      "Your counsel receives one complete package — the script, the legends, the approval workflow, and the express no-transaction-based-compensation clause — with one review deadline. The point is to remove work from their desk, not to argue with it.",
  },

  fit: {
    eyebrow: "WHO THIS IS FOR",
    h2: "Built for a narrow client. Deliberately.",
    forYouHeading: "This is for you if",
    forYou: [
      "You are a U.S. real estate sponsor — multifamily, industrial, self-storage, build-to-rent, opportunity zone, or real estate credit.",
      "You have a live Rule 506(c) offering of $10 million or more, or an evergreen vehicle that raises continuously.",
      "Securities counsel is already engaged, with a named approver who can turn a review in three business days.",
      "You can fund a media budget of at least $15,000 a month, paid by you to the platform on your own account.",
      "You have raised before, and relationship-based raising has stopped filling the deal.",
    ],
    notForYouHeading: "This is not for you if",
    notForYou: [
      "The offering is 506(b). General solicitation is prohibited there, and no vendor can change that.",
      "There is no securities counsel. The compliance gate never clears without one.",
      "It is a single-asset raise under $10 million with no fund program behind it. The arithmetic doesn't fund a stable campaign plus the fee.",
      "You are mid-capital-call, or distributions are paused.",
      "You want compensation tied to capital raised. That is the one term Ascent will never sign.",
    ],
    note: "Close but not there? Book the call anyway and say so. The answer might be “not yet,” and it will be a useful one.",
  },

  // No published pricing on this page — quoted in writing after the call.
  pricing: null,

  expectations: {
    eyebrow: "HOW AN ENGAGEMENT RUNS",
    h2: "Four expectations, in writing.",
    intro:
      "Pricing is a flat monthly fee, quoted in writing after the scoping call — once we have read your numbers, not before. Media spend is billed by the platform directly to you.",
    items: [
      {
        title: "Counsel signs before anything runs.",
        body: "The nine-condition compliance gate closes first, with a written record of every approval, in parallel with scoping. Nothing publishes and nobody dials until it does.",
      },
      {
        title: "Live in fourteen days from access and approvals.",
        body: "Campaign architecture, creative, CRM and pipeline, telephony registered in your name, instrumentation, and a setter rehearsed against the approved script. The clock starts when the gate closes.",
      },
      {
        title: "A weekly report with the four numbers.",
        body: "Median speed to first human touch, contact rate by response bucket, set-to-held rate, and cost per appointment held. Fifteen minutes on a call, every week. Long-form reviews at thirty, sixty and ninety days.",
      },
      {
        title: "A fee that scales with media under management, never with outcomes.",
        body: "Flat, monthly, month to month. Nothing tied to capital raised, investors acquired, or appointments held, at any performance level. Everything built stays with you if you leave.",
      },
    ],
  },

  // No performance guarantee ever attaches to a regulated raise.
  guarantees: null,

  /*
   * Every answer restates facts already published on this page — the
   * boundaries, the owner-card steps, the expectations. Nothing new is
   * claimed here; if a fact changes above, change it here too.
   */
  faq: {
    eyebrow: "QUESTIONS COUNSEL ACTUALLY ASKS",
    h2: "Before you book.",
    items: [
      {
        q: "Is Ascent a broker-dealer, finder, or placement agent?",
        a: "No. Compensation is a flat monthly fee — nothing tied to capital raised, investors acquired, or appointments held, at any performance level. Ascent never touches funds, never verifies accredited-investor status, and never gives investment advice. Those terms are in the contract, not in a policy.",
      },
      {
        q: "What does the setter actually say to an investor lead?",
        a: "Logistics only: confirming the lead asked to hear from you, and getting a meeting onto your calendar. The setter never discusses returns, valuation, merits, timing, or terms — a script your counsel approved holds that line, and every call is recorded so counsel can check it.",
      },
      {
        q: "Who verifies accredited-investor status?",
        a: "You do, permanently. Ascent never asks about, assesses, or verifies it, and the CRM Ascent operates has no field for it.",
      },
      {
        q: "What does it cost?",
        a: "A flat monthly fee that scales with media under management, quoted in writing after the scoping call — once we have read your numbers, not before. Media spend is billed by the platform directly to you, on your own account; Ascent never holds, advances, or marks it up.",
      },
      {
        q: "What if our counsel has questions or an approval lapses?",
        a: "Counsel gets one complete package — the script, the legends, the approval workflow, and the express no-transaction-based-compensation clause — with one review deadline of three business days. Nothing publishes and nobody dials without approval, and if an approval lapses, calling stops the same day, in writing. Bring counsel to the scoping call.",
      },
      {
        q: "Do you work with 506(b) offerings?",
        a: "No. General solicitation is prohibited under 506(b), and no vendor can change that. If you are filing a 506(c) offering in the next ninety days, the scoping call is still the right first step.",
      },
      {
        q: "What do we keep if we leave?",
        a: "Everything built: the phone number registered to you, every call recording, the investor list, and the setter scripts. Nothing is held hostage to the engagement.",
      },
    ],
  },

  booking: {
    eyebrow: "BOOK A SCOPING CALL",
    h2: "Find out where your last raise's leads went.",
    body: "Thirty minutes. Bring the numbers from your last raise — media spent, leads generated, meetings that actually happened. We'll tell you, in dollars, what the gap between the leads you paid for and the appointments you held is costing you, and whether this structure will clear your counsel. If it doesn't fit, we'll say so on the call.",
    // A dedicated Calendly event for sponsors, separate from the brand
    // page's strategy call, so bookings from this domain are their own
    // event type. The event MUST exist in Calendly under exactly this slug
    // (caleb-ascentcas → "Scoping call", URL slug "scoping-call", 30 min)
    // before the domain goes live — a qualified sponsor is shown this embed,
    // and a missing event renders Calendly's not-found page in its place.
    // Set-up steps are in CONNECT-ASCENTFORSPONSORS.md.
    schedulingLink:
      "https://calendly.com/caleb-ascentcas/scoping-call?hide_gdpr_banner=1&embed_domain=ascentforsponsors.com&embed_type=Inline",
    // Legacy form labels — the gate below is the live path.
    form: {
      nameLabel: "Name",
      companyLabel: "Sponsor or fund",
      phoneLabel: "Phone",
      emailLabel: "Email",
      estimatesSelectLabel: "Offering status",
      estimatesSelectOptions: [
        "Open 506(c) raise, advertising now",
        "Open 506(c) raise, not yet advertising",
        "Filing in the next 90 days",
        "506(b), or not sure",
      ],
      tradeField: null,
      submitLabel: "Request a call",
      submittingLabel: "Sending…",
    },
  },

  // The ICP gate in front of the scheduler. A prospect qualifies only when
  // EVERY chosen option carries `qualifies: true`. The thresholds are the
  // ideal-client definition from the business plan: a live 506(c) (or
  // Reg A+) offering of $10M+ or an evergreen vehicle, counsel engaged, a
  // media budget of $15K/month or more, a track record, and a buyer who
  // can actually say yes — the sponsor principal, head of IR, or the
  // compliance owner.
  qualification: {
    nameLabel: "Name",
    companyLabel: "Sponsor or fund",
    phoneLabel: "Phone",
    emailLabel: "Email",
    questions: [
      {
        key: "exemption",
        label: "Which exemption is the offering under?",
        options: [
          { label: "Rule 506(c) — we can advertise", qualifies: true },
          { label: "Regulation A+", qualifies: true },
          { label: "Rule 506(b)", qualifies: false },
          { label: "Not sure yet", qualifies: false },
        ],
      },
      {
        key: "raiseSize",
        label: "How large is the offering?",
        options: [
          { label: "Under $10 million", qualifies: false },
          { label: "$10–$25 million", qualifies: true },
          { label: "$25–$50 million", qualifies: true },
          { label: "More than $50 million", qualifies: true },
          { label: "Evergreen or continuously offered", qualifies: true },
        ],
      },
      {
        key: "counsel",
        label: "Is securities counsel engaged on this offering?",
        options: [
          { label: "Yes — engaged", qualifies: true },
          { label: "Not yet", qualifies: false },
        ],
      },
      {
        key: "mediaBudget",
        label:
          "What monthly media budget can the raise fund? Media is billed by the platform to you, separate from Ascent's flat fee.",
        options: [
          { label: "Under $15,000", qualifies: false },
          { label: "$15,000–$30,000", qualifies: true },
          { label: "$30,000–$50,000", qualifies: true },
          { label: "More than $50,000", qualifies: true },
        ],
      },
      {
        key: "trackRecord",
        label: "Have you raised before?",
        options: [
          { label: "Yes — this is not our first raise", qualifies: true },
          { label: "We operate an evergreen vehicle", qualifies: true },
          { label: "This is our first raise", qualifies: false },
        ],
      },
      {
        key: "role",
        label: "What's your role on the raise?",
        options: [
          { label: "Sponsor principal or head of investor relations", qualifies: true },
          { label: "Counsel, general counsel, or CFO", qualifies: true },
          { label: "Someone else on the team", qualifies: false },
        ],
      },
    ],
    stepLabel: "Step {n} of {total}",
    backLabel: "Back",
    continueLabel: "Continue",
    contactHeading: "Last step — how do we reach you?",
    contactSub: "If it fits, your booking link is on the next screen.",
    submitLabel: "See if it fits",
    submittingLabel: "Sending…",
    passHeading: "It fits.",
    passBody:
      "Grab a time below — thirty minutes on your last raise's numbers, in dollars, no obligation. Bring counsel if you like.",
    passFallbackBody:
      "Your request is in. You'll get a call or an email within one business day to set a time.",
    declineHeading: "A call isn't the right next step yet.",
    // Honest, not discouraging. Someone who gets this screen should be able
    // to tell exactly what would change the answer.
    declineBody:
      "Based on your answers, either the structure wouldn't clear or the arithmetic wouldn't fund a stable campaign plus the fee — usually a 506(b) offering, no securities counsel yet, or a raise under $10 million. Your answers still landed with us. If something changes — a 506(c) filing, counsel engaged, a larger vehicle — the answer changes with it.",
    // Practice claims only. No guarantee, no result, no number that isn't
    // on the page already.
    trustItems: [
      "30 minutes. No cost. No obligation.",
      "Flat monthly fee — nothing tied to capital raised, investors acquired, or appointments held.",
      "Every setter call recorded and available to you and your counsel.",
    ],
  },

  // /apply runs on the brand vertical.
  applyPage: null,

  thanks: {
    h1: "Your request is in.",
    body: [
      "You'll get a call or an email within one business day to set a time for the scoping call.",
      "Before the call, round up the numbers from your last raise — media spent, leads generated, meetings held. Real numbers make it a better call.",
    ],
    backLabel: "Back to the site",
  },

  footer: {
    tagline: "Investor acquisition for 506(c) real estate sponsors",
    locationLine: "Oklahoma City, OK · Delivery is remote, nationwide",
    privacyLabel: "Privacy",
    // The brand guide's compliance footer — on every sponsor-facing page.
    complianceLine:
      "Ascent is not a broker-dealer, finder or placement agent. Compensation is a flat monthly fee — nothing tied to capital raised, investors acquired, or appointments booked. Verification of accredited status remains with the issuer. Nothing on this page is an offer to sell or a solicitation of an offer to buy any security.",
  },
};

export default sponsors;
