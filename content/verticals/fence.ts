import type { Vertical } from "./types";

/*
 * ⚠️ PROVISIONAL CONTENT.
 *
 * The authoritative fence copy lives in `ascent-website-handoff.md`, which
 * was not in the repository when this vertical was rebuilt — the repo was
 * empty, so there was no fence page to move to /fence. This file is a
 * faithful adaptation of the final general-page copy with fence vocabulary,
 * using only the real numbers from the fence client's results. Nothing here
 * is invented — but before /fence takes outbound traffic, reconcile every
 * string in this file against the fence handoff (including the full
 * four-tier price grid that page specifies, which is represented here by the
 * same two-card offer as the general page until those tiers are supplied).
 */
export const fence: Vertical = {
  path: "/fence",
  slug: "fence",
  seo: {
    title:
      "Ascent Client Acquisition Systems | Lead Follow-Up Systems for Fence Companies",
    description:
      "Ascent installs CRM, follow-up, and lead generation systems for fence companies in Oklahoma. Free pipeline audit — find the quoted fence work sitting unclosed in your records.",
  },
  header: {
    ctaLabel: "Book the free audit",
  },
  hero: {
    eyebrow: "Client Acquisition Systems · Fence Companies · Oklahoma",
    headline: [
      "Your fence company doesn’t have a lead problem.",
      "It has a lead-handling problem.",
    ],
    sub: "Most fence companies are sitting on six figures of quoted work that never got a second call. Put your numbers in and see what yours looks like.",
    ctaLabel: "Book the free pipeline audit",
    microcopy: "30 minutes. No cost. You keep the report either way.",
  },
  calculator: {
    estimatesPerMonth: {
      label: "Fence estimates you write per month",
      defaultValue: 40,
      min: 5,
      max: 300,
      step: 1,
      format: "plain",
    },
    averageTicket: {
      label: "Average job ticket",
      defaultValue: 4500,
      min: 500,
      max: 50000,
      step: 100,
      format: "dollars",
    },
    closeRate: {
      label: "Your close rate",
      defaultValue: 30,
      min: 5,
      max: 80,
      step: 1,
      format: "percent",
    },
    months: {
      label: "Months of history in your system",
      defaultValue: 12,
      min: 3,
      max: 36,
      step: 1,
      format: "plain",
    },
    outputLabel: "Sitting in your old estimates",
    secondaryLine:
      "That’s {valueUnclosed} of fence work you already quoted and never closed. The number above assumes you re-close it at half your normal rate.",
    assumptionLine:
      "Conservative by design. Half your close rate, applied only to work you already quoted. Your audit uses your real records, not these sliders.",
  },
  problem: {
    eyebrow: "The actual problem",
    heading: "Your leads aren’t the issue. What happens after them is.",
    paragraphs: [
      "You quote the fence. He says he’ll think about it. You follow up once, maybe twice, then the next job starts and he’s gone.",
      "Nobody calls him at week two. Nobody calls at month three when he finally has the money. The estimate sits in a folder or a text thread and quietly stops existing.",
      "That’s not a marketing problem — you already paid to get that person. It’s a follow-up problem, and it’s the cheapest revenue in your business, because the cost of acquiring it is already spent.",
      "Ascent installs the system that does the following up. Then, once it’s provably working, we add new leads on top of it. In that order, deliberately.",
    ],
  },
  install: {
    eyebrow: "What we install",
    heading: "The system, and who operates it.",
    items: [
      {
        title: "A CRM that actually holds your pipeline.",
        body: "Every lead, every estimate, every outcome, in one place instead of three phones and a notebook.",
      },
      {
        title: "Follow-up that doesn’t depend on anyone remembering.",
        body: "Automated calls, texts, and emails on a schedule, running on every quote until it closes or dies for a real reason.",
      },
      {
        title: "Lead generation, once the follow-up works.",
        body: "Paid ads and lead capture, added after the machine can hold what it catches.",
      },
      {
        title: "Reporting in dollars.",
        body: "What you spent, what it produced, what’s still open. One number you can trust.",
      },
    ],
    ownerCard: {
      heading: "Three things. That’s your whole job.",
      steps: [
        {
          title: "Answer the call we transfer.",
          body: "We do the calling, texting, and chasing. You pick up when someone’s ready.",
        },
        {
          title: "Run the estimate.",
          body: "The part you’re already good at, and the only part that needs you.",
        },
        {
          title: "Tap the outcome in the CRM.",
          body: "Won, lost, or thinking about it. Two seconds, and it’s what makes the follow-up smart.",
        },
      ],
      closingLine: "Everything else is installed and operated by us.",
    },
  },
  proof: {
    framingLine:
      "These came from a fence company in the Oklahoma City metro — same trade as yours, same kind of market.",
    stats: [
      { value: "$13.33", label: "Average cost per lead — Meta, OKC metro" },
      { value: "65 in 19 days", label: "Leads generated on $866 of ad spend" },
      {
        value: "$275K → $85K",
        label: "Quoted, then signed inside 30 days — from follow-up alone",
      },
    ],
    // [DECISION] — same attribution sentence as the general page.
    attributionLine: null,
  },
  offer: {
    eyebrow: "Where to start",
    heading: "Start with the audit. It costs nothing and it’s useful either way.",
    cards: [
      {
        name: "Pipeline Audit",
        price: "Free",
        body: "We go through your leads and estimates and tell you exactly how much recoverable revenue is sitting in there, and how to go get it — whether or not you hire us.",
      },
      {
        name: "30-Day Revival Sprint",
        price: "$1,500",
        priceNote: "founding rate · $2,500 after",
        body: "We install the CRM and follow-up automations, then run a 30-day reactivation of every old lead and unclosed fence estimate you have. Booked estimates in week one, from money you already spent.",
        dark: true,
      },
    ],
    guaranteeLine:
      "If the Sprint doesn’t book at least 5 estimate appointments from your old list in 30 days, you get a full refund.",
    note: "Ongoing systems run from $2,500/month, month to month, priced off your market and ad budget. We’ll put a number in writing after the audit — not before. Founding rates hold until the fifth spot fills.",
    // Client-maintained count; null omits the line rather than showing a
    // stale or fake number.
    foundingSpotsRemaining: null,
    foundingSpotsTemplate: "{n} of 5 founding spots remaining",
  },
  booking: {
    eyebrow: "The free pipeline audit",
    heading: "Find out what’s actually in your pipeline.",
    body: "Thirty minutes. I’ll go through your leads and estimates and tell you, in dollars, how much recoverable fence work is sitting in there and exactly how to go get it. You keep the report whether you hire me or not.",
    calLink: null, // [DECISION]
    form: {
      estimatesSelectLabel: "Roughly how many estimates a month",
      estimatesOptions: ["Under 10", "10–25", "25–50", "50–100", "100+"],
      // A fence page already knows the trade.
      tradeField: null,
    },
  },
  footer: {
    businessName: "Ascent Client Acquisition Systems",
    location: "Oklahoma City, OK",
    phone: null, // [DECISION]
    email: null, // [DECISION]
  },
};
