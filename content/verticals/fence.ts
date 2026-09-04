import type { Vertical } from "./types";

/*
 * DECISION #5 — the live count of founding spots remaining, out of 5.
 *
 * MANUALLY MAINTAINED. Edit this number by hand when a founding client
 * signs; there is no timer, no randomization, no auto-decrement, on
 * purpose. If this number is wrong the whole site loses its credibility.
 * Set to 0 to switch the Founding Five section and booking headline to
 * the "filled / waitlist" framing.
 *
 * Count confirmed by the client 2026-08-21.
 */
export const foundingSpotsRemaining: number = 2;

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
    email: "caleb@ascentcas.com",
  },

  seo: {
    title:
      "Ascent Client Acquisition Systems | Growth Systems for Fence Companies in Oklahoma City",
    description:
      "Ascent installs CRM, text and email follow-up, and lead generation systems for fence companies in Oklahoma City. Book a free 30-minute strategy call.",
  },

  header: {
    cta: "Book a call",
  },

  hero: {
    eyebrow: "GROWTH SYSTEMS FOR FENCE COMPANIES · OKLAHOMA CITY",
    h1: "You don't have a lead problem. You have a lead-handling problem.",
    h1Highlight: "lead-handling problem.",
    // Outcome-led: the hero sells the installed system; the calculator
    // makes its case further down the page.
    sub: "Ascent connects your website, ads, CRM, and text and email follow-up so every fence lead gets a fast response, every open estimate stays visible, and every reply reaches your team.",
    cta: "Book a strategy call",
    // One offer now — the strategy call IS the primary path.
    secondaryCta: null,
    microcopy: "30 minutes. No cost. No obligation.",
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
        label: "Cost per qualified fence lead",
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
    },
    outputs: {
      appointments: "Qualified leads / year",
      deals: "Jobs signed / year",
      revenue: "Projected revenue / year",
      roi: "ROI / year",
    },
    assumptionLine:
      "Straight arithmetic on your inputs: budget ÷ cost per qualified lead, closed at your rate, with ROI calculated after ad spend. No multipliers and no “up to.”",
  },

  calculatorSection: {
    eyebrow: "RUN YOUR OWN NUMBERS",
    h2: "What should your fence lead flow produce?",
    sub: "Use your real lead cost, average job, and close rate. The math shows what the funnel should produce — and how expensive weak follow-up becomes.",
  },

  problem: {
    eyebrow: "THE ACTUAL PROBLEM",
    h2: "Your leads aren't the issue. What happens after them is.",
    paragraphs: [
      "You quote the job. He says he'll think about it. You call once, maybe twice, then the next job starts and he's gone.",
      "Nobody follows up at week two. Nobody checks back at month three when the budget finally clears. The estimate quietly stops existing.",
      "That's not a marketing problem — it's a follow-up problem, and it's the cheapest revenue in your business, because you already paid for it.",
      "Ascent installs the system that does the following up, then adds new leads once the machine is running. In that order, deliberately.",
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
        label: "Quoted → signed inside the same 30-day window",
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
      rows: [
        { label: "Ad spend", value: "$866" },
        { label: "Fence leads", value: "65" },
        { label: "Cost per lead", value: "$13.33" },
        { label: "Days running", value: "19" },
      ],
      footerLabel: "Quoted → signed inside 30 days",
      footerValue: "$275K → $85K",
    },
    // DECISION #2 — ad-account screenshots, once cleared for publication.
    screenshots: [],
  },

  services: {
    eyebrow: "WHAT WE DO",
    h2: "Everything that brings you work, in one system.",
    items: [
      {
        icon: "browser",
        title: "Website and landing page builds.",
        body: "Fast, mobile-first, and pointed at one action: requesting an estimate.",
      },
      {
        icon: "pin",
        title: "SEO and local search strategy.",
        body: "Show up when your service area searches for what you do — listings, reviews, and pages built to rank.",
      },
      {
        icon: "cursor",
        title: "Google Ads.",
        body: "Paid search for homeowners already looking for a fence contractor, measured beyond the click.",
      },
      {
        icon: "megaphone",
        title: "Meta Ads.",
        body: "Facebook and Instagram campaigns that reach homeowners before they start shopping.",
      },
      {
        icon: "loop",
        title: "Follow-up automations.",
        body: "Texts and emails on a schedule, running on every quote until it closes or dies for a real reason.",
      },
      {
        icon: "phone",
        title: "Reply routing and ownership.",
        body: "The moment a homeowner responds, the right person on your team knows who replied, what they saw, and what happens next.",
      },
      {
        icon: "stack",
        title: "A CRM that actually holds your pipeline.",
        body: "Every lead, every estimate, every outcome, in one place instead of three phones and a notebook.",
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
      "We don\u2019t switch all of it on at once. The follow-up goes in first, and traffic comes after the machine can hold what it catches.",
    // The three steps live in the standalone section below on this page.
    ownerCard: null,
  },

  howItWorks: {
    eyebrow: "WHAT YOU ACTUALLY DO",
    h2: "Three things. That's your whole job.",
    steps: [
      {
        title: "Take the conversation.",
        body: "When a homeowner replies, the conversation routes straight to your team while the intent is still warm.",
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
      "Everything around those three actions — the CRM, text and email follow-up, ad accounts, and reporting — is installed and operated by us. We never call your customers.",
  },

  pricing: {
    // No eyebrow: this section sits on Surface, where Orange Deep is 4.43:1.
    eyebrow: null,
    h2: "What it costs",
    cards: [
      {
        name: "Strategy Call",
        price: "Free",
        line: "Thirty minutes on your numbers: where leads stall, what the leak is costing, and exactly what we would fix first — whether or not you hire us.",
      },
      {
        name: "30-Day Dead-Estimate Revival Sprint",
        price: "$1,500",
        priceNote: "founding rate · $2,500 after",
        line: "We install the CRM and follow-up, then reactivate your old leads and unclosed estimates with scheduled text and email. Replies route directly to your team.",
        dark: true,
      },
      {
        name: "Core Growth System",
        price: "$2,500/mo",
        line: "Ads, lead capture, follow-up, and reporting, run monthly. Month to month.",
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
    // Fence has its own Founding Five section further down.
    showFoundingSpots: false,
    foundingSpotsSuffix: "of 5 founding spots remaining",
    note: "Founding rates hold until the fifth spot fills. After that the Sprint is $2,500 and retainers go up — founding clients keep their rate for as long as they stay.",
  },

  guarantees: {
    eyebrow: "WHAT HAPPENS IF IT DOESN'T WORK",
    h2: "Three guarantees, in writing.",
    items: [
      {
        title: "Win your money back.",
        body: "If the Sprint doesn't produce at least 5 qualified estimate opportunities from your old list in 30 days, you get a full refund.",
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
    h2: "You see the same funnel we see.",
    items: [
      {
        title: "Speed-to-lead, measured.",
        body: "See how quickly each fence inquiry received a response, which sequence it entered, and where the conversation moved next.",
      },
      {
        title: "Pipeline movement, not vanity metrics.",
        body: "Leads, replies, estimates, quotes, and signed jobs. The report follows the sale instead of stopping at form fills.",
      },
      {
        title: "Revenue attribution you can inspect.",
        body: "Spend, open estimates, and signed revenue stay connected so you can make the next decision from evidence.",
      },
    ],
  },

  foundingFive: {
    h2: "We take five clients.",
    body: "One person runs the delivery, so five is the cap — not a marketing device. Founding clients get the discounted Sprint, a rate locked for as long as they stay, and more of my week than anyone who signs later will get.",
    capTotal: 5,
    counterSuffix: "of 5 spots remaining",
    filledLine: "All five founding spots are filled",
  },


  /*
   * Every answer below restates facts already published on this page —
   * the four pricing tiers, the three written guarantees, the Founding
   * Five cap. Nothing new is claimed here; if a fact changes above,
   * change it here too.
   */
  faq: {
    eyebrow: "QUESTIONS OWNERS ACTUALLY ASK",
    h2: "Before you book.",
    items: [
      {
        q: "What actually happens on the strategy call?",
        a: "Thirty minutes on your real numbers: where leads stall, what the leak is costing, and exactly what we would fix first. No obligation either way.",
      },
      {
        q: "What does it cost?",
        a: "The strategy call is free. The 30-Day Dead-Estimate Revival Sprint is $1,500 at the founding rate ($2,500 after). The Core Growth System runs $2,500 a month and the Full Revenue System $4,000 a month plus ad spend — month to month, and founding rates hold until the fifth spot fills.",
      },
      {
        q: "What if it doesn’t work?",
        a: "Three guarantees, in writing: at least 5 qualified estimate opportunities from your old list in 30 days or a full refund; live within 14 days of getting access and assets or your next month of management is free; and a qualified-opportunities number for your first 60 days, set from your own records, or we manage your campaigns free until you hit it. The conditions are spelled out in the proposal before you sign anything.",
      },
      {
        q: "Do you call my leads or customers?",
        a: "No. Ascent runs text and email follow-up from your company’s name and number. When someone replies, the conversation routes directly to your team.",
      },
      {
        q: "How much of my time does this take?",
        a: "Three things: take the conversation when a reply routes in, run the estimate, and tap the outcome in the CRM. Everything around those actions is installed and operated by us.",
      },
      {
        q: "Why only five clients?",
        a: "One person runs the delivery, so five is the cap — not a marketing device. Founding clients get the discounted Sprint, a rate locked for as long as they stay, and more attention than anyone who signs later will get.",
      },
    ],
  },

  booking: {
    eyebrow: "BOOK YOUR STRATEGY CALL",
    h2: "Let's look at your numbers.",
    h2Waitlist: "Join the waitlist for the next opening.",
    body: "Thirty minutes: where your leads stall, what an estimate appointment should cost you, and what we'd install to fix it. No cost, no obligation.",
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
      "Based on your answers, the system wouldn’t pay for itself yet — it runs on quote volume and a list of old estimates to work. Your answers still landed in front of Caleb; if he sees something worth flagging, you’ll hear from him. The calculator on this page shows where the numbers start to work.",
    trustItems: [
      "30 minutes. No cost. No obligation.",
      "5 qualified estimate opportunities from your old list in 30 days, or a full refund — in writing.",
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
