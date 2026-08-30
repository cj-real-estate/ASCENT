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
      "Ascent installs lead follow-up and client acquisition systems for fence companies in Oklahoma City. Free pipeline audit — find the quoted work sitting unclosed in your records.",
  },

  header: {
    cta: "Book the free audit",
  },

  hero: {
    eyebrow: "GROWTH SYSTEMS FOR FENCE COMPANIES · OKLAHOMA CITY",
    h1: "You don't have a lead problem. You have a lead-handling problem.",
    sub: "Most fence companies in Oklahoma are sitting on six figures of quoted work that never got a second call. Put your numbers in and see what yours looks like.",
    cta: "Book the free pipeline audit",
    microcopy: "30 minutes. No cost. You keep the report either way.",
  },

  calculator: {
    fields: {
      estimatesPerMonth: {
        label: "Estimates you write per month",
        min: 5,
        max: 300,
        step: 1,
        defaultValue: 40,
        unit: "none",
        numberInput: true,
      },
      averageTicket: {
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
      months: {
        label: "Months of history in your system",
        min: 3,
        max: 36,
        step: 1,
        defaultValue: 12,
        unit: "none",
        numberInput: false,
      },
    },
    outputLabel: "SITTING IN YOUR DEAD ESTIMATE LIST",
    secondaryLine:
      "That's {valueUnclosed} of work you already quoted and never closed. The number above assumes you re-close it at half your normal rate.",
    assumptionLine:
      "Conservative by design. Half your close rate, applied only to work you already quoted. Your audit uses your real records, not these sliders.",
  },

  problem: {
    eyebrow: "THE ACTUAL PROBLEM",
    h2: "Your leads aren't the issue. What happens after them is.",
    paragraphs: [
      "You quote the job. He says he'll think about it. You call once, maybe twice, then the next job starts and he's gone.",
      "Nobody calls him at week two. Nobody calls at month three when he finally has the money. The estimate sits in a folder or a text thread and quietly stops existing.",
      "That's not a marketing problem — you already paid to get that person. It's a follow-up problem, and it's the cheapest revenue in your business because the cost of acquiring it is already sunk.",
      "Ascent installs the system that does the following up, then adds new leads on top of it once the machine is running. In that order, deliberately: fuel the engine after you've proven it runs.",
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
    // DECISION #2 — ad-account screenshots, once cleared for publication.
    screenshots: [],
  },

  services: {
    eyebrow: "WHAT WE DO",
    h2: "Everything that brings you work, in one system.",
    items: [
      {
        title: "Website and landing page builds.",
        body: "A site built to turn a click into a booked estimate — fast, mobile-first, and pointed at one action instead of ten.",
      },
      {
        title: "SEO and local search strategy.",
        body: "Show up when someone in your service area searches for the work you do. Local listings, reviews, and pages built to rank.",
      },
      {
        title: "Google Ads.",
        body: "Paid search in front of people already typing what you sell, measured in booked estimates rather than clicks.",
      },
      {
        title: "Meta Ads.",
        body: "Facebook and Instagram campaigns that put your work in front of homeowners in your service area before they start shopping.",
      },
      {
        title: "Follow-up automations.",
        body: "Texts and emails on a schedule, running on every quote until it closes or dies for a real reason.",
      },
      {
        title: "A CRM that actually holds your pipeline.",
        body: "Every lead, every estimate, every outcome, in one place instead of three phones and a notebook.",
      },
      {
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
        title: "Call the ones who reply.",
        body: "The follow-up keeps texting and emailing your old quotes until someone answers. When they do, you make the call.",
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
      "Everything else — the CRM, the automations, the ad accounts, the reporting — is installed and operated by us.",
  },

  pricing: {
    // No eyebrow: this section sits on Surface, where Orange Deep is 4.43:1.
    eyebrow: null,
    h2: "What it costs",
    cards: [
      {
        name: "Pipeline Audit",
        price: "Free",
        line: "We go through your records and tell you exactly how much recoverable revenue is in there, and how to get it — whether or not you hire us.",
      },
      {
        name: "30-Day Dead-Estimate Revival Sprint",
        price: "$1,500",
        priceNote: "founding rate · $2,500 after",
        line: "We install the CRM and follow-up automations, then run a 30-day reactivation of every old lead and unclosed estimate you have. Booked estimates in week one, from money you already spent.",
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
        q: "What actually happens on the audit call?",
        a: "Thirty minutes. We go through your leads and estimates and tell you, in dollars, how much recoverable work is sitting in there and exactly how to go get it. You keep the report whether you hire us or not.",
      },
      {
        q: "What does it cost?",
        a: "The audit is free. The 30-Day Dead-Estimate Revival Sprint is $1,500 at the founding rate ($2,500 after). The Core Growth System runs $2,500 a month and the Full Revenue System $4,000 a month plus ad spend — month to month, and founding rates hold until the fifth spot fills.",
      },
      {
        q: "What if it doesn’t work?",
        a: "Three guarantees, in writing: at least 5 booked estimate appointments from your dead list in 30 days or a full refund; live within 14 days of getting access and assets or your next month of management is free; and a qualified-opportunities number for your first 60 days, set from your own records, or we manage your campaigns free until you hit it. The conditions are spelled out in the proposal before you sign anything.",
      },
      {
        q: "How much of my time does this take?",
        a: "Three things: call the leads who reply, run the estimate, and tap the outcome in the CRM. Everything else — the CRM, the automations, the ad accounts, the reporting — is installed and operated by us.",
      },
      {
        q: "Why only five clients?",
        a: "One person runs the delivery, so five is the cap — not a marketing device. Founding clients get the discounted Sprint, a rate locked for as long as they stay, and more attention than anyone who signs later will get.",
      },
    ],
  },

  booking: {
    eyebrow: "THE FREE PIPELINE AUDIT",
    h2: "Find out what's actually in your pipeline.",
    h2Waitlist: "Join the waitlist for the next opening.",
    body: "Thirty minutes. I'll go through your leads and estimates and tell you, in dollars, how much recoverable work is sitting in there and exactly how to go get it. You keep the report whether you hire me or not.",
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
      submitLabel: "Request the free audit",
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
          "The Sprint is $1,500 and ongoing systems run $2,500–$4,000 a month. If your audit shows the numbers work, is that something you could invest in?",
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
    contactHeading: "Last step — where does the report go?",
    contactSub: "Your audit report and, if we’re a fit, your booking link.",
    submitLabel: "See if we’re a fit",
    submittingLabel: "Sending…",
    passHeading: "You’re a fit.",
    passBody:
      "Grab a time below — thirty minutes, your real numbers, and you keep the report either way.",
    // Used when booking.schedulingLink is null and there is no calendar to
    // put under the pass state.
    passFallbackBody:
      "Your request is in. You’ll get a call or a text within one business day to set a time.",
    declineHeading: "A call isn’t the right next step yet.",
    // Honest, not discouraging, and no fake encouragement. Someone who gets
    // this screen should be able to tell exactly what would change the answer.
    declineBody:
      "Based on your answers, the audit wouldn’t pay for itself yet — the system runs on quote volume and a list of old estimates to work, and that’s where the money in it comes from. Your answers still landed in front of Caleb, and if he sees something worth flagging you’ll hear from him. In the meantime, the calculator at the top of this page shows where the numbers start to work.",
    trustItems: [
      "30 minutes. No cost. You keep the report either way.",
      "5 booked estimate appointments from your dead list in 30 days, or a full refund — in writing.",
      "65 fence leads in 19 days on $866 of ad spend — Prestige Fence, Oklahoma City.",
    ],
  },

  // /apply is the brand page — it runs on general.ts, not on this vertical.
  applyPage: null,

  thanks: {
    h1: "Your request is in.",
    body: [
      "You'll get a call or a text within one business day to set a time for your 30-minute pipeline audit.",
      "Before the call, round up whatever holds your estimates — a spreadsheet, a CRM export, even a text thread. That's the record the audit runs on, and it's where the number comes from.",
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
