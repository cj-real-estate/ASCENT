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
    sub: "Most service businesses are sitting on six figures of quoted work that never got a second call. Put your numbers in and see what yours looks like.",
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
    // DECISION #1 — one sentence from the client: whose results, which
    // market, what period. Renders [NEEDS ATTRIBUTION LINE] until supplied.
    attributionLine: null,
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
  },
};

export default general;
