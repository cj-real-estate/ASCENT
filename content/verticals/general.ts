import type { Vertical } from "./types";

/*
 * The brand-level page at "/".
 *
 * Different job from the fence page: this one exists so an owner who has
 * heard the name — from a card, a signature, or a search — leaves believing
 * Ascent is a real firm with a real system, and books the audit. It is
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
      "Ascent Client Acquisition Systems | Lead Follow-Up Systems for Service Businesses",
    description:
      "Ascent installs CRM, follow-up, and lead generation systems for service businesses in Oklahoma. Free pipeline audit — find the quoted work sitting unclosed in your records.",
  },

  header: {
    cta: "Book the free audit",
  },

  hero: {
    eyebrow: "CLIENT ACQUISITION SYSTEMS · OKLAHOMA",
    h1: "You don't have a lead problem. You have a lead-handling problem.",
    h1Highlight: "lead-handling problem.",
    // Outcome-led: the hero sells the installed system; the audit and the
    // calculator make their case further down the page.
    sub: "Ascent installs the whole machine — the website, the ads, the CRM, and follow-up that runs on every quote until it closes or dies for a real reason. You run the estimates. We run everything else.",
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
    outputLabel: "SITTING IN YOUR OLD ESTIMATES",
    secondaryLine:
      "That's {valueUnclosed} of work you already quoted and never closed. The number above assumes you re-close it at half your normal rate.",
    assumptionLine:
      "Conservative by design. Half your close rate, applied only to work you already quoted. Your audit uses your real records, not these sliders.",
  },

  calculatorSection: {
    eyebrow: "RUN YOUR OWN NUMBERS",
    h2: "What’s sitting in your old estimates?",
    // Relocated hero copy — it was written for the calculator.
    sub: "Most service businesses are sitting on six figures of quoted work that never got a second call. Put your numbers in and see what yours looks like.",
  },

  problem: {
    eyebrow: "THE ACTUAL PROBLEM",
    h2: "Your leads aren't the issue. What happens after them is.",
    paragraphs: [
      "You quote the job. He says he'll think about it. You follow up once, maybe twice, then the next job starts and he's gone.",
      "Nobody calls him at week two. Nobody calls at month three when he finally has the money. The estimate sits in a folder or a text thread and quietly stops existing.",
      "That's not a marketing problem — you already paid to get that person. It's a follow-up problem, and it's the cheapest revenue in your business, because the cost of acquiring it is already spent.",
      "Ascent installs the system that does the following up. Then, once it's provably working, we add new leads on top of it. In that order, deliberately.",
    ],
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
    ownerCard: {
      heading: "Three things. That's your whole job.",
      steps: [
        {
          title: "Call the ones who reply.",
          body: "The follow-up keeps texting and emailing until someone answers. When they do, you make the call.",
        },
        {
          title: "Run the estimate.",
          body: "The part you're already good at, and the only part that needs you.",
        },
        {
          title: "Tap the outcome in the CRM.",
          body: "Won, lost, or thinking about it. Two seconds, and it's what makes the follow-up smart.",
        },
      ],
      closing: "Everything else is installed and operated by us.",
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
      "These came from a fence company in the Oklahoma City metro. Different trade than yours, most likely — the mechanism doesn't change.",
    stats: [
      {
        number: "$13.33",
        label: "Average cost per lead — Meta, OKC metro",
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

  pricing: {
    eyebrow: "WHERE TO START",
    h2: "Start with the audit. It costs nothing and it's useful either way.",
    cards: [
      {
        name: "Pipeline Audit",
        price: "Free",
        line: "We go through your leads and estimates and tell you exactly how much recoverable revenue is sitting in there, and how to go get it — whether or not you hire us.",
      },
      {
        name: "30-Day Revival Sprint",
        price: "$1,500",
        priceNote: "founding rate · $2,500 after",
        line: "We install the CRM and follow-up automations, then run a 30-day reactivation of every old lead and unclosed estimate you have. Booked estimates in week one, from money you already spent.",
        dark: true,
      },
    ],
    guaranteeLine:
      "If the Sprint doesn't book at least 5 estimate appointments from your old list in 30 days, you get a full refund.",
    note: "Ongoing systems run from $2,500/month, month to month, priced off your market and ad budget. We'll put a number in writing after the audit — not before. Founding rates hold until the fifth spot fills.",
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
        q: "What actually happens on the audit call?",
        a: "Thirty minutes. We go through your leads and estimates and tell you, in dollars, how much recoverable work is sitting in there and exactly how to go get it. You keep the report whether you hire us or not.",
      },
      {
        q: "What does it cost?",
        a: "The audit is free. The 30-Day Revival Sprint is $1,500 at the founding rate ($2,500 after), and ongoing systems run from $2,500 a month, month to month. You get a number in writing after the audit — not before.",
      },
      {
        q: "What if the Sprint doesn’t work?",
        a: "If it doesn’t book at least 5 estimate appointments from your old list in 30 days, you get a full refund. That’s in writing.",
      },
      {
        q: "How much of my time does this take?",
        a: "Three things: call the leads who reply, run the estimate, and tap the outcome in the CRM. Everything else is installed and operated by us.",
      },
      {
        q: "Do you only work with fence companies?",
        a: "No. The published results came from Prestige Fence in Oklahoma City, and the same mechanism runs for any business that quotes jobs before doing them — fencing, roofing, HVAC, concrete, remodeling, that world.",
      },
    ],
  },

  booking: {
    eyebrow: "THE FREE PIPELINE AUDIT",
    h2: "Find out what's actually in your pipeline.",
    h2Waitlist: "Join the waitlist for the next opening.",
    body: "Thirty minutes. I'll go through your leads and estimates and tell you, in dollars, how much recoverable work is sitting in there and exactly how to go get it. You keep the report whether you hire me or not.",
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
        label: "What trade are you in",
        placeholder: "Fencing, roofing, HVAC, concrete…",
      },
      estimatesSelectLabel: "Roughly how many estimates do you write a month",
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
              "A service business that quotes jobs before doing them — fencing, roofing, HVAC, concrete, remodeling, that world",
            qualifies: true,
          },
          {
            label: "A service business with set prices — no quotes or estimates",
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
      "Based on your answers, the audit wouldn’t pay for itself yet — the system runs on quote volume and a list of old estimates to work, and that’s where the money in it comes from. Your answers still landed in front of Caleb, and if he sees something worth flagging you’ll hear from him. In the meantime, the pipeline calculator at the top of ascentcas.com shows where the numbers start to work.",
    trustItems: [
      "30 minutes. No cost. You keep the report either way.",
      "5 booked estimate appointments from your old list in 30 days, or a full refund — in writing.",
      "65 leads in 19 days on $866 of ad spend — Prestige Fence, Oklahoma City.",
    ],
  },

  applyPage: {
    seoTitle:
      "Apply for the Free Pipeline Audit | Ascent Client Acquisition Systems",
    seoDescription:
      "Answer a few questions, and if we’re a fit, book a free 30-minute pipeline audit that finds the revenue sitting in your old estimates.",
    eyebrow: "THE FREE PIPELINE AUDIT",
    h1: "Find out how much revenue is sitting in your old estimates.",
    sub: "Answer six quick questions. If we’re a fit you’ll book your 30-minute audit on the next screen — and you keep the report either way.",
  },

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

export default general;
