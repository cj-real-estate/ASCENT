import type { Vertical } from "./types";

const fence: Vertical = {
  slug: "fence",
  path: "/fence",

  business: {
    name: "Ascent Client Acquisition Systems",
    shortName: "Ascent",
    url: "https://ascentcas.com",
    city: "Oklahoma City",
    region: "OK",
    areaServed: "Oklahoma City metro",
    // Supplied by the client 2026-08-21.
    phone: "580-304-8470",
    email: "info@ascentcas.com",
  },

  seo: {
    title:
      "Ascent Client Acquisition Systems | Growth Systems for Fence Companies in Oklahoma City",
    description:
      "Ascent installs its proprietary client acquisition system — lead follow-up, appointment setting, ads, and CRM — for fence companies in Oklahoma City. Book a free 30-minute strategy call.",
  },

  header: {
    cta: "Book a call",
  },

  hero: {
    eyebrow: "APPOINTMENT SETTING FOR FENCE COMPANIES · OKLAHOMA CITY",
    // Outcome first, in the trade's own word — estimates, not appointments.
    // The diagnosis stays in the problem section one screen down.
    h1: "Booked estimates, not just more leads.",
    // The orange lands on the promise, never on the problem.
    h1Highlight: "Booked estimates",
    sub: "Get estimate appointments on your calendar — from the quotes you already paid to generate and the new leads we bring in. Our proprietary system works every lead, a trained setter calls new ones within 10 minutes during business hours, and the estimate gets booked for you.",
    closingLine: "You run the estimates. We run the system.",
    cta: "Book a strategy call",
    // One offer now — the strategy call IS the primary path.
    secondaryCta: null,
    // Floated around the hero's calendar card. Practice claims only.
    chips: [
      "Every setter call recorded",
      "Cost per estimate appointment held",
      "Reporting in dollars",
    ],
    // Illustrative week — generic labels only, never names, addresses,
    // dollar figures, or counts presented as results.
    calendar: {
      title: "Your calendar — this week",
      days: ["Mon", "Tue", "Wed", "Thu"],
      times: ["9:00", "11:00", "1:00", "3:00"],
      blocks: [
        { day: 0, row: 1, label: "Estimate", time: "11:00", kind: "booked" },
        { day: 1, row: 0, label: "Setter call", time: "9:30 · REC", kind: "call" },
        { day: 1, row: 2, label: "Estimate", time: "1:00", kind: "booked" },
        { day: 2, row: 1, label: "Estimate", time: "11:30", kind: "booked" },
        { day: 2, row: 3, label: "Setter call", time: "3:15 · REC", kind: "call" },
        { day: 3, row: 0, label: "Estimate", time: "9:00", kind: "booked" },
        { day: 3, row: 2, label: "Estimate", time: "1:30", kind: "booked" },
      ],
      caption: "New leads called within 10 minutes during business hours, then booked straight onto your calendar.",
    },
    // Firm voice, never a personal name — the site speaks as "we".
    microcopy: "30 minutes. No cost, no obligation.",
  },

  calculator: {
    fields: {
      monthlyBudget: {
        label: "Monthly lead gen budget",
        min: 1000,
        max: 15000,
        step: 250,
        defaultValue: 3000,
        unit: "$",
        numberInput: true,
      },
      costPerAppointment: {
        label: "Cost per booked estimate appointment",
        min: 50,
        max: 1000,
        step: 25,
        defaultValue: 200,
        unit: "$",
        numberInput: true,
      },
      averageDealSize: {
        label: "Average job ticket",
        min: 500,
        max: 50000,
        step: 100,
        defaultValue: 4500,
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
        label: "Average time from estimate to signed job",
        min: 1,
        max: 12,
        step: 1,
        defaultValue: 1,
        unit: "months",
        numberInput: false,
      },
    },
    outputs: {
      appointments: "Estimate appointments / year",
      deals: "Jobs signed / year",
      revenue: "Projected revenue / year",
      roi: "ROI / year",
    },
    // A page addressed to fence companies already knows the industry.
    industries: null,
    assumptionLine:
      "Straight arithmetic on your inputs: budget ÷ cost per booked appointment, closed at your rate, counting only jobs that sign inside the year given your estimate-to-signed time. ROI after the budget. No multipliers, no “up to.”",
  },

  calculatorSection: {
    eyebrow: "RUN YOUR OWN NUMBERS",
    h2: "What would held estimate appointments return?",
    sub: "Set your budget and what a kept estimate appointment costs — the number we actually manage to — and see the year in appointments, signed jobs, and ROI.",
  },

  problem: {
    eyebrow: "THE ACTUAL PROBLEM",
    h2: "Your leads aren't the issue. What happens after them is.",
    paragraphs: [
      "You quote the job. He says he'll think about it. You call once, maybe twice, then the next job starts and he's gone.",
      "Nobody calls at week two. Nobody calls at month three when he finally has the money. The estimate quietly stops existing.",
      "That's not a marketing problem — it's a follow-up problem, and it's the cheapest revenue in your business, because you already paid for it.",
      "Ascent installs our own follow-up system — the sequences, the scripts, the CRM underneath them — and runs it for you. New leads come once the machine is running. In that order, deliberately.",
    ],
  },

  proof: {
    srHeading: "Results",
    // Same trade as the reader's — no framing needed.
    framingLine: null,
    stats: [
      {
        number: "$13.33",
        label: "Average cost per fence lead — Meta, OKC metro",
      },
      {
        number: "65 in 19 days",
        label: "Leads generated on $866 of ad spend",
      },
      {
        number: "$275K → $85K",
        label: "Quoted, then signed inside 30 days — from follow-up alone",
      },
    ],
    // Supplied by the client 2026-08-21. Keep it specific and checkable —
    // the named company, market, and dates are what make the three stats
    // above verifiable rather than assertions.
    attributionLine:
      "Results from Prestige Fence, Oklahoma City — August 1–30, 2026.",
    // Every value here is one of the attributed Prestige Fence numbers.
    reportCard: {
      title: "Campaign report — Prestige Fence, OKC",
      // Cost per lead runs last: the stated position is that cost per
      // appointment held is the metric that matters.
      rows: [
        { label: "Fence leads", value: "65" },
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

  services: {
    eyebrow: "WHAT WE DO",
    h2: "Everything that brings you work, in one system we build and run.",
    items: [
      {
        icon: "browser",
        title: "Website and landing page builds.",
        body: "Fast, mobile-first, and pointed at one action: a booked estimate.",
      },
      {
        icon: "pin",
        title: "SEO and local search strategy.",
        body: "Show up when your service area searches for what you do — listings, reviews, and pages built to rank.",
      },
      {
        icon: "cursor",
        title: "Google Ads.",
        body: "Paid search for people already typing what you sell, measured in booked estimates.",
      },
      {
        icon: "megaphone",
        title: "Meta Ads.",
        body: "Facebook and Instagram campaigns that reach homeowners before they start shopping.",
      },
      {
        icon: "loop",
        title: "Follow-up automations.",
        body: "Our sequences — texts and emails on a schedule, refined across every campaign we run — working every quote until it closes or dies for a real reason.",
      },
      {
        icon: "phone",
        title: "Appointment setting.",
        body: "A trained setter calls new leads within 10 minutes during business hours, vets them on the phone, and books the estimate appointment straight onto your calendar. Every call recorded and monitored.",
      },
      {
        icon: "stack",
        title: "A CRM that actually holds your pipeline.",
        body: "Our build, configured to your pipeline: every lead, every estimate, every outcome in one place instead of three phones and a notebook.",
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
    // The three steps live in the standalone section below on this page.
    ownerCard: null,
  },

  /*
   * The diagram. Stage copy describes what the system DOES — never counts,
   * rates, or dollars, which belong in `proof` with the attribution.
   */
  systemFlow: {
    eyebrow: "HOW THE SYSTEM WORKS",
    h2: "One machine, four moving parts.",
    sub: "Every lead runs the same path — the form fill that came in this morning and the quote that went cold two years ago. Nothing sits in a notebook waiting for somebody to remember it.",
    stages: [
      {
        icon: "megaphone",
        title: "Leads land in one place",
        body: "Ads, search, your website, and every old estimate you have — captured into one CRM instead of three phones and a notebook.",
        badge: null,
      },
      {
        icon: "phone",
        title: "A setter calls, fast",
        body: "A trained setter calls every new lead within 10 minutes during business hours, working from our scripts, and vets them on the phone.",
        badge: "Under 10 min",
      },
      {
        icon: "loop",
        title: "Our sequences keep working",
        body: "Texts and emails on a schedule pick up everyone who didn't answer, and keep going until they do or genuinely close the door.",
        badge: null,
      },
      {
        icon: "calendar",
        title: "The estimate is booked",
        body: "A vetted lead lands on your calendar with the context you need to show up and quote.",
        badge: null,
      },
    ],
    closing: "Four steps — and you're only in the last one.",
  },

  howItWorks: {
    eyebrow: "WHAT YOU ACTUALLY DO",
    h2: "Three things. That's your whole job.",
    steps: [
      {
        title: "Show up to booked estimates.",
        body: "The setter calls and books them; the sequences keep working everyone who didn't answer. Estimate appointments land on your calendar.",
      },
      {
        title: "Run the estimate.",
        body: "The part you're already good at, and the only part that needs you.",
      },
      {
        title: "Tap the outcome in the CRM.",
        body: "Won, lost, or think-about-it. Two seconds. It's what makes the follow-up smart.",
      },
    ],
    closing:
      "Everything else — the system, the sequences, the setter, the ad accounts, the reporting — is installed and operated by us.",
  },

  pricing: {
    // No eyebrow: this section sits on Surface, where Orange Deep is 4.43:1.
    eyebrow: null,
    h2: "What it costs",
    cards: [
      {
        name: "Strategy Call",
        price: "Free",
        line: "Thirty minutes on your numbers: where your leads stall, what an estimate appointment should cost you, and exactly which parts of our system we'd install — whether or not you hire us.",
      },
      {
        name: "30-Day Dead-Estimate Revival Sprint",
        price: "$2,500",
        priceNote: "one-time · billed at kickoff",
        line: "We install our CRM build and follow-up sequences, then put them to work on every old lead and unclosed estimate you have. Booked estimates in week one, from money you already spent.",
        dark: true,
      },
      {
        name: "Core Growth System",
        price: "$2,500/mo",
        line: "Our ads, lead capture, follow-up, and reporting, run monthly. Month to month.",
      },
      {
        name: "Full Revenue System",
        price: "$4,000/mo + ad spend",
        line: "Everything in Core, plus higher spend management and pipeline reporting.",
      },
    ],
    // Fence carries the full three-guarantee section instead.
    guaranteeLine: null,
    background: "surface",
    note: "Month to month, both retainers. Your number is priced off your market and ad budget, and you get it in writing after the strategy call — not before.",
  },

  guarantees: {
    eyebrow: "WHAT HAPPENS IF IT DOESN'T WORK",
    h2: "Three guarantees, in writing.",
    items: [
      {
        title: "Win your money back.",
        body: "If the Sprint doesn't book at least 5 estimate appointments from your dead list in 30 days, you get a full refund.",
      },
      {
        title: "14-day launch.",
        body: "Your system is live within 14 days of getting access and assets, or your next month of management is free.",
      },
      {
        title: "Qualified opportunities.",
        body: "A specific number of qualified opportunities in your first 60 days — written into your proposal, set from your own numbers — or we manage your campaigns free until you hit it.",
      },
    ],
    conditions:
      "Guarantees carry conditions, and they're the same things that make the work succeed: at least 150 contactable past leads, scripts approved within 48 hours, your team calls back the leads who reply, outcomes logged in the CRM, and one 20-minute review a week. All of it is spelled out in the proposal before you sign anything.",
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
        icon: "shield",
        title: "Every setter call, recorded and monitored.",
        body: "Any call a setter makes on your behalf is recorded and reviewed. Ask for any recording, any time — quality isn't asserted, it's auditable.",
      },
      {
        icon: "target",
        title: "Cost per appointment held, not cost per lead.",
        body: "Cheap leads that never answer aren't cheap. The number we optimize and report is what a kept estimate appointment actually costs.",
      },
      {
        icon: "chart",
        title: "Your numbers, in dollars.",
        body: "Spend, appointments held, jobs signed. You see the same report we look at — nothing summarized away.",
      },
    ],
  },

  /*
   * Every answer below restates facts already published on this page —
   * the four pricing tiers and the three written guarantees. Nothing new
   * is claimed here; if a fact changes above, change it here too.
   */
  faq: {
    eyebrow: "QUESTIONS OWNERS ACTUALLY ASK",
    h2: "Before you book.",
    items: [
      {
        q: "What actually happens on the strategy call?",
        a: "Thirty minutes on your real numbers: where your leads stall, what an estimate appointment should cost you, and exactly which parts of our system we’d install. No obligation either way.",
      },
      {
        q: "What does it cost?",
        a: "The strategy call is free. The 30-Day Dead-Estimate Revival Sprint is $2,500, one time. The Core Growth System runs $2,500 a month and the Full Revenue System $4,000 a month plus ad spend — month to month either way.",
      },
      {
        q: "What if it doesn’t work?",
        a: "Three guarantees, in writing: at least 5 booked estimate appointments from your dead list in 30 days or a full refund; live within 14 days of getting access and assets or your next month of management is free; and a qualified-opportunities number for your first 60 days, set from your own records, or we manage your campaigns free until you hit it. The conditions are spelled out in the proposal before you sign anything.",
      },
      {
        q: "How do I know the setter calls are any good?",
        a: "Every call a setter makes on your behalf is recorded and monitored, and you can ask for any recording. We also report cost per appointment held — not cost per lead — so the number you see is estimates that actually happened.",
      },
      {
        q: "How much of my time does this take?",
        a: "Three things: show up to the estimate appointments the setter books, run the estimate, and tap the outcome in the CRM. Everything else — the system, the sequences, the setter, the ad accounts, the reporting — is installed and operated by us.",
      },
    ],
  },

  booking: {
    eyebrow: "BOOK YOUR STRATEGY CALL",
    h2: "Let's look at your numbers.",
    body: "Thirty minutes: where your leads stall, what an estimate appointment should cost you, and exactly which parts of our system we'd install. No cost, no obligation.",
    // Calendly, supplied by the client 2026-08-21. The embed params drop
    // Calendly's own page chrome and the GDPR banner so it sits inside the
    // section rather than looking like a framed website.
    schedulingLink:
      "https://calendly.com/caleb-ascentcas/30min?hide_gdpr_banner=1&embed_domain=ascentcas.com&embed_type=Inline",
    form: {
      nameLabel: "Name",
      companyLabel: "Company",
      phoneLabel: "Phone",
      emailLabel: "Email",
      estimatesSelectLabel: "Roughly how many estimates do you write a month",
      tradeField: null,
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

  // The ICP gate that sits in front of the scheduler.
  //
  // A prospect qualifies only when EVERY option they choose carries
  // `qualifies: true` — one false answer anywhere routes them to the decline
  // copy instead of the calendar. Every threshold in here (the estimate
  // floor, the list size, the investment level) is tuned in this file and
  // nowhere else; the component only reads flags and counts them.
  //
  // One fewer question than general.ts, which opens with "what kind of business do
  // you run?" and this page cannot. Anyone reading a page addressed to fence
  // companies has already answered it, and asking again reads as broken.
  qualification: {
    nameLabel: "Name",
    companyLabel: "Company",
    phoneLabel: "Phone",
    emailLabel: "Email",
    questions: [
      {
        key: "estimatesPerMonth",
        label: "Roughly how many estimates do you write a month?",
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
        label: "How many past leads and old estimates do you have on record?",
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
      "Based on your answers, the system wouldn’t pay for itself yet — it runs on quote volume and a list of old estimates to work. Your answers still landed in front of our team; if we see something worth flagging, you’ll hear from us. The calculator on this page shows where the numbers start to work.",
    trustItems: [
      "30 minutes. No cost. No obligation.",
      "5 booked estimate appointments from your dead list in 30 days, or a full refund — in writing.",
      "65 fence leads in 19 days on $866 of ad spend — Prestige Fence, Oklahoma City.",
    ],
  },

  // /apply is the brand page — it runs on general.ts, not on this vertical.
  applyPage: null,

  thanks: {
    h1: "Your request is in.",
    body: [
      "You'll get a call or a text within one business day to set a time for your 30-minute strategy call.",
      "Before the call, round up whatever holds your estimates — spreadsheet, CRM export, even a text thread. Real numbers make it a better call.",
    ],
    backLabel: "Back to the site",
  },

  footer: {
    tagline: "Ascent Client Acquisition Systems",
    locationLine: "Oklahoma City, OK",
    privacyLabel: "Privacy",
  },
};

export default fence;
