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
      "Ascent Client Acquisition Systems | CRM, Follow-Up, and Appointment Setting",
    description:
      "Ascent installs its proprietary client acquisition system — CRM, follow-up, appointment setting, and lead generation — for businesses in Oklahoma. Book a free 30-minute strategy call on your numbers.",
  },

  header: {
    cta: "Book a call",
  },

  hero: {
    eyebrow: "CLIENT ACQUISITION SYSTEMS",
    h1: "You don't have a lead problem. You have a lead-handling problem.",
    h1Highlight: "lead-handling problem.",
    // Outcome-led: the hero sells the installed system; the calculator
    // makes its case further down the page.
    sub: "Ascent installs our proprietary client acquisition system — website, ads, CRM, follow-up sequences, and a trained appointment setter booking qualified meetings on your calendar. You close the deals. We run the system.",
    cta: "Book a strategy call",
    // One offer now — the strategy call IS the primary path.
    secondaryCta: null,
    // Floated around the hero's calendar card. Practice claims only.
    chips: [
      "Every setter call recorded",
      "Cost per appointment held",
      "Reporting in dollars",
    ],
    // Illustrative week — generic labels only, never names, companies,
    // dollar figures, or counts presented as results.
    calendar: {
      title: "Your calendar — this week",
      days: ["Mon", "Tue", "Wed", "Thu"],
      times: ["9:00", "11:00", "1:00", "3:00"],
      blocks: [
        { day: 0, row: 1, label: "Appointment", time: "11:00", kind: "booked" },
        { day: 1, row: 0, label: "Setter call", time: "9:30 · REC", kind: "call" },
        { day: 1, row: 2, label: "Appointment", time: "1:00", kind: "booked" },
        { day: 2, row: 1, label: "Appointment", time: "11:30", kind: "booked" },
        { day: 2, row: 3, label: "Setter call", time: "3:15 · REC", kind: "call" },
        { day: 3, row: 0, label: "Appointment", time: "9:00", kind: "booked" },
        { day: 3, row: 2, label: "Appointment", time: "1:30", kind: "booked" },
      ],
      caption: "Appointments set by your setter, on your calendar. Every setter call recorded and monitored.",
    },
    microcopy: "30 minutes. No cost. No obligation.",
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
        label: "Cost per booked appointment",
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
      salesCycleMonths: {
        label: "Average sales cycle",
        min: 1,
        max: 12,
        step: 1,
        defaultValue: 2,
        unit: "months",
        numberInput: false,
      },
    },
    outputs: {
      appointments: "Appointments / year",
      deals: "Deals closed / year",
      revenue: "Projected revenue / year",
      roi: "ROI / year",
    },
    // Planning defaults, not published benchmarks — the note says so and
    // every seeded value stays editable. Tune these to real numbers as
    // client data comes in; the first option is what everyone sees first.
    // Columns: cost per booked appointment, average deal size, close rate
    // (percent of booked appointments), sales cycle in months.
    industries: {
      label: "Your industry",
      note: "Sets starting numbers for cost per booked appointment, deal size, close rate, and sales cycle from our planning assumptions. Adjust any of them to yours.",
      options: [
        { label: "Construction and commercial contractors", costPerAppointment: 450, averageDealSize: 25000, closeRate: 15, salesCycleMonths: 3 },
        { label: "Home services (roofing, HVAC, fencing)", costPerAppointment: 150, averageDealSize: 8000, closeRate: 30, salesCycleMonths: 1 },
        { label: "Industrial and manufacturing", costPerAppointment: 600, averageDealSize: 60000, closeRate: 12, salesCycleMonths: 6 },
        { label: "Professional services (legal, accounting, consulting)", costPerAppointment: 350, averageDealSize: 12000, closeRate: 25, salesCycleMonths: 2 },
        { label: "Real estate and property", costPerAppointment: 250, averageDealSize: 9000, closeRate: 15, salesCycleMonths: 3 },
        { label: "B2B services and agencies", costPerAppointment: 400, averageDealSize: 15000, closeRate: 20, salesCycleMonths: 2 },
        { label: "Healthcare and wellness", costPerAppointment: 250, averageDealSize: 3000, closeRate: 35, salesCycleMonths: 1 },
        { label: "SaaS and software", costPerAppointment: 500, averageDealSize: 20000, closeRate: 12, salesCycleMonths: 4 },
        { label: "Financial services and insurance", costPerAppointment: 350, averageDealSize: 6000, closeRate: 20, salesCycleMonths: 2 },
        { label: "Logistics and transportation", costPerAppointment: 400, averageDealSize: 30000, closeRate: 15, salesCycleMonths: 3 },
        { label: "Energy and utilities", costPerAppointment: 650, averageDealSize: 75000, closeRate: 10, salesCycleMonths: 6 },
        { label: "Automotive and equipment", costPerAppointment: 250, averageDealSize: 15000, closeRate: 25, salesCycleMonths: 1 },
        { label: "Education and training", costPerAppointment: 200, averageDealSize: 4000, closeRate: 25, salesCycleMonths: 1 },
        { label: "Something else", costPerAppointment: 300, averageDealSize: 10000, closeRate: 20, salesCycleMonths: 2 },
      ],
    },
    assumptionLine:
      "Straight arithmetic on your inputs: budget ÷ cost per booked appointment, closed at your rate, counting only deals that close inside the year given your sales cycle. ROI after the budget. No multipliers, no “up to.”",
  },

  calculatorSection: {
    eyebrow: "RUN YOUR OWN NUMBERS",
    h2: "What would held appointments return?",
    sub: "Set your budget and what a kept appointment costs — the number we actually manage to — and see the year in appointments, closed deals, and ROI.",
  },

  problem: {
    eyebrow: "THE ACTUAL PROBLEM",
    h2: "Your leads aren't the issue. What happens after them is.",
    paragraphs: [
      "You send the quote. They say they'll think about it. You follow up once, maybe twice, then the next deal takes over and they're gone.",
      "Nobody calls at week two. Nobody calls at month three when the budget finally clears. The quote quietly stops existing.",
      "That's not a marketing problem — it's a follow-up problem, and it's the cheapest revenue in your business, because you already paid for it.",
      "Ascent installs our own follow-up system — the sequences, the scripts, the CRM underneath them — and runs it for you. Once it's provably working, we add new leads on top. In that order, deliberately.",
    ],
  },

  services: {
    eyebrow: "WHAT WE DO",
    h2: "Everything that brings you work, in one system we build and run.",
    items: [
      {
        icon: "browser",
        title: "Website and landing page builds.",
        body: "Fast, mobile-first, and pointed at one action: a booked appointment.",
      },
      {
        icon: "pin",
        title: "SEO and local search strategy.",
        body: "Show up when your market searches for what you do — listings, reviews, and pages built to rank.",
      },
      {
        icon: "cursor",
        title: "Google Ads.",
        body: "Paid search for people already typing what you sell, measured in booked appointments.",
      },
      {
        icon: "megaphone",
        title: "Meta Ads.",
        body: "Facebook and Instagram campaigns that reach your buyers before they start shopping.",
      },
      {
        icon: "loop",
        title: "Follow-up automations.",
        body: "Our sequences — texts and emails on a schedule, refined across every campaign we run — working every quote until it closes or dies for a real reason.",
      },
      {
        icon: "phone",
        title: "Appointment setting.",
        body: "A trained setter works every reply from our scripts, vets them on the phone, and books the meeting straight onto your calendar. Every call recorded and monitored.",
      },
      {
        icon: "stack",
        title: "A CRM that actually holds your pipeline.",
        body: "Our build, configured to your pipeline: every lead, every quote, every outcome in one place instead of three inboxes and a spreadsheet.",
      },
      {
        icon: "chart",
        title: "Reporting in dollars.",
        body: "What you spent, what it produced, what\u2019s still open. One number you can trust.",
      },
    ],
    // The order argument. Without it a flat list implies we switch
    // everything on at once, which is not how any of this is sold.
    closing:
      "We don\u2019t switch all of it on at once. Our follow-up system goes in first, and traffic comes after the machine can hold what it catches.",
    ownerCard: {
      heading: "Three things. That's your whole job.",
      steps: [
        {
          title: "Show up to booked appointments.",
          body: "The follow-up warms them up and the setter books them. Qualified meetings land on your calendar.",
        },
        {
          title: "Run the sales conversation.",
          body: "The part you're already good at, and the only part that needs you.",
        },
        {
          title: "Tap the outcome in the CRM.",
          body: "Won, lost, or thinking about it. Two seconds, and it's what makes the follow-up smart.",
        },
      ],
      closing:
        "Everything else — the system, the sequences, the setter, the reporting — is installed and operated by us.",
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
      "From a fence company in the Oklahoma City metro. Different industry than yours, most likely — the system doesn't change.",
    // Cost per lead runs LAST on purpose: the site's stated position is
    // that cost per appointment held is the metric that matters, so the
    // lead-cost number is supporting evidence, not the headline.
    stats: [
      {
        number: "65 in 19 days",
        label: "Leads generated on $866 of ad spend",
      },
      {
        number: "$275K → $85K",
        label: "Quoted, then signed inside 30 days — from follow-up alone",
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
      // Cost per lead runs last here too (see the stats note above).
      rows: [
        { label: "Leads", value: "65" },
        { label: "Days running", value: "19" },
        { label: "Ad spend", value: "$866" },
        { label: "Cost per lead", value: "$13.33" },
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
    h2: "Transparent, down to the call recordings.",
    items: [
      {
        title: "Every setter call, recorded and monitored.",
        body: "Any call a setter makes on your behalf is recorded and reviewed. Ask for any recording, any time — quality isn't asserted, it's auditable.",
      },
      {
        title: "Cost per appointment held, not cost per lead.",
        body: "Cheap leads that never answer aren't cheap. The number we optimize and report is what a kept appointment on your calendar actually costs.",
      },
      {
        title: "Your numbers, in dollars.",
        body: "Spend, appointments held, deals closed. You see the same report we look at — nothing summarized away.",
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
        line: "Thirty minutes on your numbers: where your leads stall, what a held appointment should cost you, and exactly which parts of our system we’d install — whether or not you hire us.",
      },
      {
        name: "30-Day Revival Sprint",
        price: "$2,500",
        priceNote: "one-time · billed at kickoff",
        line: "We install our CRM build and follow-up sequences, then put them to work on every old lead and unclosed quote you have. Booked appointments in week one, from money you already spent.",
        dark: true,
      },
    ],
    guaranteeLine:
      "If the Sprint doesn't book at least 5 sales appointments from your old list in 30 days, you get a full refund.",
    note: "Ongoing management runs from $2,500/month, month to month, priced off your market and ad budget. We'll put a number in writing after the strategy call — not before.",
    background: "paper",
  },

  // This page carries the single guarantee line under the Sprint card
  // instead of the full three-guarantee section.
  guarantees: null,


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
        a: "Thirty minutes on your real numbers: where your leads stall, what a held appointment should cost you, and exactly which parts of our system we’d install. No obligation either way.",
      },
      {
        q: "What does it cost?",
        a: "The strategy call is free. The 30-Day Revival Sprint is $2,500, one time, and ongoing management runs from $2,500 a month, month to month. You get a number in writing after the call — not before.",
      },
      {
        q: "What if the Sprint doesn’t work?",
        a: "If it doesn’t book at least 5 sales appointments from your old list in 30 days, you get a full refund. That’s in writing.",
      },
      {
        q: "How do I know the setter calls are any good?",
        a: "Every call a setter makes on your behalf is recorded and monitored, and you can ask for any recording. We also report cost per appointment held — not cost per lead — so the number you see is meetings that actually happened.",
      },
      {
        q: "How much of my time does this take?",
        a: "Three things: show up to the appointments the setter books, run the sales conversation, and tap the outcome in the CRM. Everything else — the system, the sequences, the setter, the reporting — is installed and operated by us.",
      },
      {
        q: "Do you only work with fence companies?",
        a: "No — the published results are from Prestige Fence in Oklahoma City, but our system runs for any business that quotes work before doing it.",
      },
    ],
  },

  booking: {
    eyebrow: "BOOK YOUR STRATEGY CALL",
    h2: "Let's look at your numbers.",
    body: "Thirty minutes: where your leads stall, what a held appointment should cost you, and exactly which parts of our system we'd install. No cost, no obligation.",
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
          "The Sprint is $2,500 and ongoing management runs $2,500–$4,000 a month. If the numbers work, is that something you could invest in?",
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
      "30 minutes. No cost. No obligation.",
      "5 booked sales appointments from your old list in 30 days, or a full refund — in writing.",
      "65 leads in 19 days on $866 of ad spend — Prestige Fence, Oklahoma City.",
    ],
  },

  applyPage: {
    seoTitle:
      "Book a Free Strategy Call | Ascent Client Acquisition Systems",
    seoDescription:
      "Answer a few questions, and if we’re a fit, book a free 30-minute strategy call on your numbers — where leads stall, what an appointment should cost, and what to install.",
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
