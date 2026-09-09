import type { Guide } from "./types";

/*
 * "What the two-percent conversion rate actually costs a sponsor" — the
 * business plan's third named content piece. Every figure is the
 * GowerCrowd benchmark set already on the sponsor page, and every worked
 * number is arithmetic on stated assumptions, labelled as such.
 */
const guide: Guide = {
  slug: "cost-per-investor-lead-506c-benchmarks",
  title: "What a real estate investor lead costs — and what the two-percent conversion rate really means",
  seoTitle: "Cost per Investor Lead: 506(c) Real Estate Benchmarks",
  description:
    "Published cost-per-lead and conversion benchmarks for real estate 506(c) investor marketing, worked through on a $10 million raise, and the two numbers that move cost per appointment held.",
  eyebrow: "Benchmarks · Investor acquisition",
  published: "2026-09-09",
  updated: "2026-09-09",
  answer:
    "Published category benchmarks for real estate 506(c) investor marketing put the cost of an investor lead at roughly $50 to $100 on Meta and about five times that on LinkedIn, with about two percent of investor leads becoming investors and a cost per funded investor of $3,500 to $4,500. On a $10 million raise with a $100,000 average investment, that arithmetic means about 5,000 leads and $300,000 to $400,000 of media — three to four percent of the raise — to find roughly 100 investors. The number that decides whether that budget works is not cost per lead. It is what share of those leads get a connected conversation, and how many of the meetings that get booked are actually held.",
  takeaways: [
    "Benchmarks (GowerCrowd): $50–$100 per investor lead on Meta; ~5× that on LinkedIn; ~2% lead-to-investor; $3,500–$4,500 per funded investor; marketing at 3–4% of the raise.",
    "A $10M raise at a $100K average check needs ~100 investors, so ~5,000 leads at 2% — about $375,000 of media at $75 a lead.",
    "At a 40% contact rate and a 20% held rate, those 5,000 leads become 400 meetings held at about $940 each. Raising contact to 60% makes it 600 meetings at about $625 each, on the same media budget.",
    "Cost per lead is the number agencies report because it is the number they control. Cost per appointment held is the number a raise is actually funded by.",
    "Media spend and vendor fees are separate lines. A cost-per figure that mixes them should say “fully loaded.”",
    "None of this projects capital raised. Conversion from a held meeting to a subscription belongs to the sponsor, the deal and counsel.",
  ],
  sections: [
    {
      id: "benchmarks",
      h2: "The published benchmarks",
      blocks: [
        {
          type: "p",
          text: "The most-cited public figures for this category come from GowerCrowd, which publishes 506(c) marketing guidance for real estate sponsors. Their numbers, which Ascent uses as the category baseline and which are not Ascent results:",
        },
        {
          type: "table",
          caption: "Published category benchmarks, real estate 506(c) investor marketing (GowerCrowd).",
          head: ["Measure", "Published figure", "What it tells you"],
          rows: [
            ["Cost per investor lead, Meta", "$50–$100", "The volume channel. Cheapest leads, widest quality range."],
            ["Cost per investor lead, LinkedIn", "About 5× Meta", "Title-and-industry targeting. Higher quality, far higher price."],
            ["Lead-to-investor conversion", "About 2%", "98 of 100 paid-for leads do not invest."],
            ["Cost per funded investor", "$3,500–$4,500 within 90 days", "What an investor actually costs when the funnel works."],
            ["Marketing as share of raise", "3–4% of target", "The budget line a sponsor should plan from."],
            ["Published minimum media budget", "$3,000–$5,000 a month", "A floor, and in Ascent's view below what a stable campaign needs."],
          ],
        },
        {
          type: "p",
          text: "Two cautions. Cost per lead depends on the offering, the creative, the geography and the season, and a single campaign will swing around these ranges. And the two-percent figure is a lead-to-investor rate across the whole funnel — it already includes every lead that was never called.",
        },
      ],
    },
    {
      id: "worked-example",
      h2: "A $10 million raise, worked through",
      blocks: [
        {
          type: "p",
          text: "Assume a $10 million Rule 506(c) raise, an average investment of $100,000, a blended cost per investor lead of $75 and the published two-percent conversion. This is arithmetic on stated assumptions, not a projection — change any input and the outputs move with it.",
        },
        {
          type: "table",
          caption: "Illustrative arithmetic. Assumptions: $10M target, $100K average investment, $75 per lead, 2% lead-to-investor.",
          head: ["Line", "Arithmetic", "Result"],
          rows: [
            ["Investors needed", "$10,000,000 ÷ $100,000", "100"],
            ["Leads needed at 2%", "100 ÷ 0.02", "5,000"],
            ["Media at $75 per lead", "5,000 × $75", "$375,000"],
            ["As a share of the raise", "$375,000 ÷ $10,000,000", "3.75%"],
            ["Cost per investor, media only", "$375,000 ÷ 100", "$3,750"],
          ],
        },
        {
          type: "p",
          text: "The result lands inside every published range at once — 3–4% of the raise, $3,500–$4,500 per investor — which is a reasonable sign the benchmarks describe the same funnel. It also shows why sponsors budgeting $3,000 a month for a $10 million raise stall: at that pace the media alone takes ten years.",
        },
      ],
    },
    {
      id: "the-other-98",
      h2: "Where the other 98 leads go",
      blocks: [
        {
          type: "p",
          text: "The two percent is what remains after a chain of drop-offs that most sponsors never measure. Put two of them in the model — the share of leads that get a connected conversation (the **contact rate**) and the share of contacted leads whose meeting is actually held (the **held rate**) — and cost per lead stops being the interesting number.",
        },
        {
          type: "table",
          caption: "Same 5,000 leads and $375,000 of media. Only the response assumptions change.",
          head: ["Scenario", "Contact rate", "Held rate", "Meetings held", "Cost per appointment held"],
          rows: [
            ["Typical: call-back in days, no confirmation", "40%", "20%", "400", "$938"],
            ["Faster call-back", "60%", "20%", "600", "$625"],
            ["Faster call-back, meetings confirmed", "60%", "30%", "900", "$417"],
          ],
        },
        {
          type: "p",
          text: "Nothing in the media changed between the rows. The same ads, the same landing pages, the same $375,000. The difference is whether a human reached the lead quickly and whether someone made sure the meeting happened — and it is worth more than any plausible improvement in cost per lead. A campaign that cut its cost per lead from $75 to $60 would save $75,000; a campaign that moved its contact rate from 40% to 60% produced 200 more meetings for nothing.",
        },
        {
          type: "quote",
          text: "Cost per lead is the number an agency controls. Cost per appointment held is the number a raise is funded by.",
        },
      ],
    },
    {
      id: "held-not-booked",
      h2: "Why “held,” not “booked”",
      blocks: [
        {
          type: "p",
          text: "A booked meeting is a calendar entry. A held meeting is one where the investor showed up and the sponsor made the case. For a $25,000 to $500,000 decision the gap between them is large: without a confirmation touch the day before, a reschedule process for no-shows and a nurture sequence between touches, booked meetings quietly stop happening. Any vendor can inflate a booked count; a held count can only be moved by doing the work. That is why Ascent reports cost per appointment held as the primary metric, and why the [calculator on the main page](/#calculator) asks for a held rate rather than a set rate.",
        },
      ],
    },
    {
      id: "fully-loaded",
      h2: "Keeping the fee out of the media number",
      blocks: [
        {
          type: "p",
          text: "Media spend is paid by the sponsor to the platform, on the sponsor's own account. A vendor's fee — whether a retainer, a flat monthly fee or, at a registered intermediary, a share of capital raised — is a separate line. Cost-per figures are cleaner when they are media-only and say so; when a report folds the fee in, it should be labelled fully loaded so two vendors' numbers can be compared. On a flat monthly fee the fully-loaded cost per appointment held falls as volume rises, which is the arithmetic that makes the model work for a sponsor and is the [reason Ascent prices that way](/guides/placement-agent-vs-flat-fee-investor-acquisition).",
        },
      ],
    },
    {
      id: "what-to-ask",
      h2: "What to ask any vendor about their numbers",
      blocks: [
        {
          type: "ul",
          items: [
            "Is that cost per lead media-only, or fully loaded with your fee?",
            "What share of leads got a connected conversation, and within how long?",
            "How many meetings were booked, and how many were held?",
            "Who called the leads, from what number, on what script — and is the call recorded?",
            "Is every figure from the ad account and the CRM, and can I see them there?",
            "Which of these numbers will you report to me every week without being asked?",
          ],
        },
        {
          type: "p",
          text: "A vendor who can answer all six runs a system. A vendor who can answer the first one sells media.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "What is a good cost per lead for real estate investor ads?",
      a: "Published benchmarks put Meta investor leads at roughly $50 to $100 and LinkedIn leads at about five times that. A lower cost per lead is not automatically better: LinkedIn leads cost more and are typically of higher quality, and the number that matters for a raise is cost per appointment held.",
    },
    {
      q: "How much should a sponsor budget to market a 506(c) raise?",
      a: "Published guidance puts total marketing at three to four percent of the target raise — $300,000 to $400,000 over a $10 million raise. Ascent's view is that a stable paid campaign needs at least $15,000 a month in media, separate from any vendor fee.",
    },
    {
      q: "What is cost per appointment held?",
      a: "Media spend divided by the number of investor meetings that actually took place in the period. Ascent reports it media-only unless a report is marked fully loaded, and treats it as the primary metric because it cannot be inflated by booking meetings that never happen.",
    },
    {
      q: "Does a two-percent conversion rate mean the ads are bad?",
      a: "Not necessarily. The two percent is measured across the whole funnel and includes every lead that was never called, called late, or booked and never held. Response-side improvements — faster first human touch, confirmation, reschedules — move it without touching the ads.",
    },
    {
      q: "Can Ascent project how much capital a campaign will raise?",
      a: "No, and nothing on this site does. Ascent's arithmetic stops at appointments held. Conversion from a held meeting to a subscription belongs to the sponsor, the offering and counsel.",
    },
  ],
  sources: [
    { label: "GowerCrowd — published 506(c) marketing guidance for real estate sponsors: cost per lead by channel, lead-to-investor conversion, cost per investor, budget share and minimum budgets", url: "https://gowercrowd.com" },
    { label: "Ascent metrics ontology — definitions of contact rate, set-to-held rate and cost per appointment held, as reported weekly to each sponsor", url: null },
  ],
  image: {
    src: "/guide-images/cost-per-investor-lead-506c-benchmarks.jpg",
    alt: "A calculator on a printed bar-chart report beside a laptop keyboard, in black and white.",
    credit: "Negative Space via StockSnap, CC0",
  },
  related: [
    "speed-to-lead-investor-acquisition",
    "how-to-find-accredited-investors-real-estate-syndication",
    "placement-agent-vs-flat-fee-investor-acquisition",
  ],
};

export default guide;
