import type { Vertical } from "./types";

/*
 * The brand-level page at "/".
 *
 * Different job from the fence page: this one exists so an owner who has
 * heard the name — from a card, a signature, or a search — leaves believing
 * Ascent is a real firm with a real system, and books a strategy call. It is
 * deliberately shorter than /fence and never claims to be trade-specific.
 *
 * Outbound traffic should link to /fence, never here: the sharp, one-trade
 * pitch converts better than a trade-agnostic one. This page is the parent
 * brand, not the pitch.
 *
 * Copy is final per the general-landing-page handoff. `null` fields are
 * open client decisions and render as visible placeholders — never fill
 * them with plausible-sounding copy.
 */
const general: Vertical = {
  slug: "general",
  path: "/",

  business: {
    name: "Ascent Client Acquisition Systems",
    shortName: "Ascent",
    url: "https://ascentcas.com",
    city: "Oklahoma City",
    region: "OK",
    // DECISION #6 — "Oklahoma" vs "Oklahoma City metro" on this page. It
    // should read wider here than on the vertical page, but only as wide as
    // he'll actually travel.
    areaServed: "Oklahoma",
    phone: "580-304-8470",
    email: "caleb@ascentcas.com",
  },

  seo: {
    title:
      "Ascent Client Acquisition Systems | Turn Leads Into Revenue",
    description:
      "Ascent connects paid acquisition, CRM, and text and email follow-up for high-ticket businesses. See where your pipeline leaks and what to fix first.",
  },

  header: {
    cta: "Book a call",
  },

  hero: {
    eyebrow: "REVENUE SYSTEMS FOR HIGH-TICKET SALES",
    h1: "More leads won't fix a broken follow-up system.",
    h1Highlight: "broken follow-up system.",
    // Outcome-led: the hero sells the installed system; the calculator
    // makes its case further down the page.
    sub: "Ascent connects paid acquisition, CRM, and text and email follow-up so every inquiry gets a fast response, every open opportunity stays visible, and every reply reaches your team.",
    cta: "Audit my acquisition system",
    // One offer now — the strategy call IS the primary path.
    secondaryCta: null,
    microcopy: "30 minutes. Your numbers. A clear next move.",
  },

  calculator: {
    fields: {
      monthlyBudget: {
        label: "Monthly lead gen budget",
        min: 1000,
        max: 25000,
        step: 250,
        defaultValue: 4000,
        unit: "$",
        numberInput: true,
      },
      costPerAppointment: {
        label: "Cost per qualified lead",
        min: 50,
        max: 1000,
        step: 25,
        defaultValue: 250,
        unit: "$",
        numberInput: true,
      },
      averageDealSize: {
        label: "Average deal size",
        min: 1000,
        max: 100000,
        step: 500,
        defaultValue: 10000,
        unit: "$",
        numberInput: true,
      },
      closeRate: {
        label: "Your close rate",
        min: 5,
        max: 80,
        step: 1,
        defaultValue: 30,
        unit: "%",
        numberInput: false,
      },
    },
    outputs: {
      appointments: "Qualified leads / year",
      deals: "Deals closed / year",
      revenue: "Projected revenue / year",
      roi: "ROI / year",
    },
    assumptionLine:
      "Straight arithmetic on your inputs: budget ÷ cost per qualified lead, closed at your rate, with ROI calculated after ad spend. No multipliers and no “up to.”",
  },

  calculatorSection: {
    eyebrow: "RUN YOUR OWN NUMBERS",
    h2: "What should your lead flow produce?",
    sub: "Use your real acquisition cost, average sale, and close rate. The math shows what the funnel should produce — and how expensive weak follow-up becomes.",
  },

  problem: {
    eyebrow: "THE REVENUE LEAK",
    h2: "Revenue gets lost between the click and the close.",
    paragraphs: [
      "A lead comes in. The first response takes an hour. A proposal goes out. Follow-up stops after day three. Marketing reports clicks while sales works from memory.",
      "The opportunity never clearly dies — it simply disappears into an inbox, a spreadsheet, or the bottom of somebody's week.",
      "That is not just a lead problem. It is an operating-system problem, and it wastes the money you already spent to create demand.",
      "Ascent fixes the handoff first: one pipeline, fast text and email follow-up, clear ownership, and reporting tied to revenue. Then we add traffic to a system that can hold it.",
    ],
  },

  services: {
    eyebrow: "THE SYSTEM",
    h2: "One connected system from first click to closed revenue.",
    items: [
      {
        icon: "browser",
        title: "Conversion pages.",
        body: "Fast, mobile-first pages built around one clear next step — not a brochure with nowhere to go.",
      },
      {
        icon: "pin",
        title: "Search visibility.",
        body: "Local listings, reviews, and search pages that help qualified buyers find you when intent is already high.",
      },
      {
        icon: "cursor",
        title: "Google demand capture.",
        body: "Paid search for buyers already looking for what you sell, measured beyond the click.",
      },
      {
        icon: "megaphone",
        title: "Meta demand generation.",
        body: "Campaigns that put a clear offer in front of the right market before they start comparing vendors.",
      },
      {
        icon: "loop",
        title: "Speed-to-lead and follow-up.",
        body: "Texts and emails on a schedule, from your name and number, with every reply routed straight to your team.",
      },
      {
        icon: "phone",
        title: "Reply routing and ownership.",
        body: "The moment a prospect responds, the right person on your team knows who replied, what they saw, and what happens next.",
      },
      {
        icon: "stack",
        title: "A CRM your team will use.",
        body: "Every lead, proposal, reply, and outcome in one operating view instead of scattered inboxes and spreadsheets.",
      },
      {
        icon: "chart",
        title: "Revenue reporting.",
        body: "What you spent, what moved, what closed, and what is still open — without hiding behind vanity metrics.",
      },
    ],
    // The order argument. Without it a flat list implies we switch
    // everything on at once, which is not how any of this is sold.
    closing:
      "We install in the order that protects your money: pipeline and follow-up first, then more traffic once the system can hold what it catches.",
    ownerCard: {
      heading: "Your team owns three moments. We operate the system around them.",
      steps: [
        {
          title: "Take the conversation.",
          body: "When a reply routes in, your team responds while the intent is still warm.",
        },
        {
          title: "Run the sale.",
          body: "Hold the consultation, estimate, or proposal conversation — the part that needs your expertise.",
        },
        {
          title: "Tap the outcome in the CRM.",
          body: "Won, lost, or thinking about it. Two seconds, and it's what makes the follow-up smart.",
        },
      ],
      closing: "We never call your customers. Every automated touch goes out from your company, and every human conversation stays with your team.",
    },
  },

  // Folded into services.ownerCard on this page.
  howItWorks: null,

  proof: {
    srHeading: "Results",
    // Names the trade the case actually came from. Do NOT genericise this
    // into "a client" or "a service business" to make it feel broader — a
    // specific case an owner can picture persuades; hedging reads as
    // fabrication to exactly the skeptical reader this page is written for.
    framingLine:
      "Real numbers from Prestige Fence in the Oklahoma City metro. The industry is specific. The operating system is transferable.",
    // Cost per lead runs last so the revenue result remains the commercial
    // proof point instead of a disconnected media metric.
    stats: [
      {
        number: "65 in 19 days",
        label: "Leads generated on $866 of ad spend",
      },
      {
        number: "$275K → $85K",
        label: "Quoted → signed inside the same 30-day window",
      },
      {
        number: "$13.33",
        label: "Average cost per lead — Meta, OKC metro",
      },
    ],
    // Supplied by the client 2026-08-21. Keep it specific and checkable —
    // the named company, market, and dates are what make the three stats
    // above verifiable rather than assertions.
    attributionLine:
      "Results from Prestige Fence, Oklahoma City — August 1–30, 2026.",
    // Every value here is one of the attributed Prestige Fence numbers —
    // the dashboard styling is presentation, not new data.
    reportCard: {
      title: "Campaign report — Prestige Fence, OKC",
      rows: [
        { label: "Ad spend", value: "$866" },
        { label: "Leads", value: "65" },
        { label: "Cost per lead", value: "$13.33" },
        { label: "Days running", value: "19" },
      ],
      footerLabel: "Quoted → signed inside 30 days",
      footerValue: "$275K → $85K",
    },
    // DECISION #2 — ad-account screenshots, once cleared for publication.
    screenshots: [],
  },

  /*
   * Practice claims only — things a client can check (listen to a call, read
   * the report), never performance numbers. Numbers live in `proof`,
   * attributed.
   */
  transparency: {
    eyebrow: "HOW WE REPORT",
    h2: "You see the same funnel we see.",
    items: [
      {
        title: "Speed-to-lead, measured.",
        body: "See how quickly each inquiry received a response, which sequence it entered, and where the conversation moved next.",
      },
      {
        title: "Pipeline movement, not vanity metrics.",
        body: "Leads, replies, consultations, proposals, and wins. The report follows the sale instead of stopping at form fills.",
      },
      {
        title: "Revenue attribution you can inspect.",
        body: "Spend, open pipeline, and closed revenue stay connected so you can make the next decision from evidence.",
      },
    ],
  },

  pricing: {
    eyebrow: "WHERE TO START",
    h2: "Start with a strategy call. It costs nothing and it's useful either way.",
    cards: [
      {
        name: "Strategy Call",
        price: "Free",
        line: "Thirty minutes on your numbers: where the handoff breaks, what the leak is costing, and what to fix first — whether or not you hire us.",
      },
      {
        name: "30-Day Revival Sprint",
        price: "$1,500",
        priceNote: "founding rate · $2,500 after",
        line: "We install the CRM and follow-up, then reactivate your old leads and open proposals with scheduled text and email. Replies route directly to your team.",
        dark: true,
      },
    ],
    guaranteeLine:
      "If the Sprint doesn't produce at least 5 qualified sales opportunities from your old list in 30 days, you get a full refund.",
    note: "Ongoing systems run from $2,500/month, month to month, priced off your market and ad budget. We'll put a number in writing after the strategy call — not before. Founding rates hold until the fifth spot fills.",
    background: "paper",
    // DECISION #5 — whether the founding-spots line belongs on this page or
    // only on /fence. Shown here for now; the count is the same manually
    // maintained number, and it is omitted entirely at 0.
    showFoundingSpots: true,
    foundingSpotsSuffix: "of 5 founding spots remaining",
  },

  // This page carries the single guarantee line under the Sprint card
  // instead of the full three-guarantee section.
  guarantees: null,

  // The scarcity line lives in the pricing section on this page.
  foundingFive: null,


  /*
   * Every answer below restates facts already published on this page —
   * pricing cards, the guarantee line, the owner-card steps, the proof
   * attribution. Nothing new is claimed here; if a fact changes above,
   * change it here too.
   */
  faq: {
    eyebrow: "QUESTIONS OWNERS ACTUALLY ASK",
    h2: "Before you book.",
    items: [
      {
        q: "What actually happens on the strategy call?",
        a: "Thirty minutes on your real numbers: where the handoff breaks, what the leak is costing, and what we would fix first. No obligation either way.",
      },
      {
        q: "What does it cost?",
        a: "The strategy call is free. The 30-Day Revival Sprint is $1,500 at the founding rate ($2,500 after), and ongoing systems run from $2,500 a month, month to month. You get a number in writing after the call — not before.",
      },
      {
        q: "What if the Sprint doesn’t work?",
        a: "If it doesn’t produce at least 5 qualified sales opportunities from your old list in 30 days, you get a full refund. That’s in writing.",
      },
      {
        q: "Do you call my leads or customers?",
        a: "No. Ascent runs text and email follow-up from your company’s name and number. When someone replies, the conversation routes directly to your team.",
      },
      {
        q: "How much of my time does this take?",
        a: "Three things: take the conversation when a reply routes in, run the consultation or estimate, and tap the outcome in the CRM. Everything around those actions is installed and operated by us.",
      },
      {
        q: "Do you only work with fence companies?",
        a: "No — the published results are from Prestige Fence in Oklahoma City, but the mechanism runs for any business that quotes work before doing it.",
      },
    ],
  },

  booking: {
    eyebrow: "BOOK YOUR STRATEGY CALL",
    h2: "Let's look at your numbers.",
    h2Waitlist: "Join the waitlist for the next opening.",
    body: "Thirty minutes on where your acquisition system leaks, what that costs, and the clearest next fix. No cost and no obligation.",
    // Calendly, supplied by the client 2026-08-21. See fence.ts for the
    // reasoning behind the embed params.
    schedulingLink:
      "https://calendly.com/caleb-ascentcas/30min?hide_gdpr_banner=1&embed_domain=ascentcas.com&embed_type=Inline",
    form: {
      nameLabel: "Name",
      companyLabel: "Company",
      phoneLabel: "Phone",
      emailLabel: "Email",
      // Free text, not a dropdown — a dropdown is always missing someone's
      // trade, and what they type is useful market research.
      tradeField: {
        label: "What industry are you in",
        placeholder: "Construction, manufacturing, professional services…",
      },
      estimatesSelectLabel: "Roughly how many quotes do you send a month",
      estimatesSelectOptions: [
        "Fewer than 10",
        "10–25",
        "25–50",
        "50–100",
        "More than 100",
      ],
      submitLabel: "Request a call",
      submittingLabel: "Sending…",
    },
  },

  // The ICP gate that sits in front of the scheduler on /apply.
  //
  // A prospect qualifies only when EVERY option they choose carries
  // `qualifies: true` — one false answer anywhere routes them to the decline
  // copy instead of the calendar. Every threshold in here (the estimate
  // floor, the list size, the investment level) is tuned in this file and
  // nowhere else; the component only reads flags and counts them.
  qualification: {
    nameLabel: "Name",
    companyLabel: "Company",
    phoneLabel: "Phone",
    emailLabel: "Email",
    questions: [
      {
        key: "businessType",
        label: "What kind of business do you run?",
        // Asked but never gated: every option qualifies. It is here for the
        // answer in the lead email, not to sort anyone out — the size and
        // commitment questions below do the sorting. Do not set any of these
        // to false without deciding you want that whole category declined
        // outright, sight unseen.
        options: [
          {
            label:
              "A business that quotes or bids work before doing it — construction, industrial, commercial services, that world",
            qualifies: true,
          },
          {
            label: "A business with set prices — no quotes or proposals",
            qualifies: true,
          },
          {
            label: "Something else",
            qualifies: true,
          },
        ],
      },
      {
        key: "estimatesPerMonth",
        label: "Roughly how many quotes or proposals do you send a month?",
        options: [
          { label: "Fewer than 10", qualifies: false },
          { label: "10–25", qualifies: true },
          { label: "25–50", qualifies: true },
          { label: "50–100", qualifies: true },
          { label: "More than 100", qualifies: true },
        ],
      },
      {
        key: "leadHistory",
        label: "How many past leads and old quotes do you have on record?",
        options: [
          { label: "Under 50", qualifies: false },
          { label: "50–150", qualifies: true },
          { label: "150–500", qualifies: true },
          { label: "More than 500", qualifies: true },
        ],
      },
      {
        key: "monthlyRevenue",
        label: "Roughly how much revenue do you do a month?",
        // Under $20K/mo, a $2,500/mo system is more than a tenth of top-line
        // revenue — the audit wouldn’t pay for itself yet. Everything
        // above that passes; the investment question below does the rest.
        options: [
          { label: "Under $20K", qualifies: false },
          { label: "$20K–$50K", qualifies: true },
          { label: "$50K–$100K", qualifies: true },
          { label: "More than $100K", qualifies: true },
        ],
      },
      {
        key: "investment",
        label:
          "The Sprint is $1,500 and ongoing systems run $2,500–$4,000 a month. If the numbers work, is that something you could invest in?",
        options: [
          { label: "Yes — if the numbers make sense", qualifies: true },
          { label: "Not at that level right now", qualifies: false },
        ],
      },
      {
        key: "decisionMaker",
        label: "Are you the owner?",
        options: [
          { label: "Yes", qualifies: true },
          { label: "No — I work for the owner", qualifies: false },
        ],
      },
    ],
    stepLabel: "Step {n} of {total}",
    backLabel: "Back",
    continueLabel: "Continue",
    contactHeading: "Last step — how do we reach you?",
    contactSub: "If we’re a fit, your booking link is on the next screen.",
    submitLabel: "See if we’re a fit",
    submittingLabel: "Sending…",
    passHeading: "You’re a fit.",
    passBody:
      "Grab a time below — thirty minutes on your real numbers, no obligation.",
    // Used when booking.schedulingLink is null and there is no calendar to
    // put under the pass state.
    passFallbackBody:
      "Your request is in. You’ll get a call or a text within one business day to set a time.",
    declineHeading: "A call isn’t the right next step yet.",
    // Honest, not discouraging, and no fake encouragement. Someone who gets
    // this screen should be able to tell exactly what would change the answer.
    declineBody:
      "Based on your answers, the system wouldn’t pay for itself yet — it runs on quote volume and a list of past leads to work. Your answers still landed in front of Caleb; if he sees something worth flagging, you’ll hear from him. The calculator on ascentcas.com shows where the numbers start to work.",
    trustItems: [
      "30 minutes. Your numbers. A clear next move.",
      "5 qualified sales opportunities from your old list in 30 days, or a full refund — in writing.",
      "65 leads in 19 days on $866 of ad spend — Prestige Fence, Oklahoma City.",
    ],
  },

  applyPage: {
    seoTitle:
      "Book a Free Strategy Call | Ascent Client Acquisition Systems",
    seoDescription:
      "Answer a few questions, then book a free 30-minute acquisition-system audit on where leads stall, what the leak costs, and what to fix first.",
    eyebrow: "THE FREE STRATEGY CALL",
    h1: "Find out what your pipeline should be producing.",
    sub: "Six quick questions. If we’re a fit, you book your 30-minute strategy call on the next screen. No obligation.",
  },

  thanks: {
    h1: "Your request is in.",
    body: [
      "You'll get a call or a text within one business day to set a time for your 30-minute strategy call.",
      "Before the call, round up whatever holds your leads and quotes — spreadsheet, CRM export, even an email thread. Real numbers make it a better call.",
    ],
    backLabel: "Back to the site",
  },

  footer: {
    tagline: "Ascent Client Acquisition Systems",
    locationLine: "Oklahoma City, OK",
    privacyLabel: "Privacy",
  },
};

export default general;
