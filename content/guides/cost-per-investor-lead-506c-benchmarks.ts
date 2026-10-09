import type { Guide } from "./types";

/*
 * "What the two-percent conversion rate actually costs a sponsor" — the
 * business plan's third named content piece. Every figure is the
 * GowerCrowd benchmark set already on the sponsor page, and every worked
 * number is arithmetic on stated assumptions, labelled as such.
 */
const guide: Guide = {
  slug: "cost-per-investor-lead-506c-benchmarks",
  title: "What does a real estate investor lead cost? And what does the two-percent conversion rate really mean?",
  seoTitle: "Cost per Investor Lead: 506(c) Real Estate Benchmarks",
  description:
    "Published cost per lead and conversion benchmarks for real estate 506(c) investor marketing. We run them on a $10 million raise. Then we show the two numbers that move cost per appointment held.",
  eyebrow: "Benchmarks · Investor acquisition",
  published: "2026-09-09",
  updated: "2026-10-09",
  answer:
    "Here is what published benchmarks for real estate 506(c) investor marketing say. An investor lead costs about $50 to $100 on Meta. On LinkedIn it costs about five times that. About two percent of investor leads become investors. Each funded investor costs $3,500 to $4,500. Now take a $10 million raise where the average investment is $100,000. The math says you need about 5,000 leads. You also need $300,000 to $400,000 of media (ad spend). That is three to four percent of the raise. It finds you about 100 investors. Cost per lead is not the number that decides if that budget works. Two other numbers do. First, what share of those leads get a real, connected conversation? Second, how many of the booked meetings are actually held?",
  takeaways: [
    "Benchmarks from GowerCrowd: $50 to $100 per investor lead on Meta. About 5 times that on LinkedIn. About 2% of leads become investors. $3,500 to $4,500 per funded investor. Marketing at 3 to 4% of the raise.",
    "A $10M raise at a $100K average check needs about 100 investors. At 2%, that takes about 5,000 leads. At $75 a lead, that is about $375,000 of media.",
    "Say your contact rate is 40% and your held rate is 20%. Then those 5,000 leads turn into 400 meetings held. Each one costs about $940. Raise the contact rate to 60% and you get 600 meetings. Each one costs about $625. The media budget stays the same.",
    "Agencies report cost per lead because it is the number they control. But a raise is really funded by cost per appointment held.",
    "Media spend and vendor fees are separate lines. If a cost figure mixes them, it should say \"fully loaded.\"",
    "None of this predicts capital raised. A held meeting may or may not turn into a subscription (an investment). That part is up to the sponsor, the deal and counsel.",
  ],
  sections: [
    {
      id: "benchmarks",
      h2: "The published benchmarks",
      blocks: [
        {
          type: "p",
          text: "The public numbers people quote most for this field come from GowerCrowd. GowerCrowd publishes 506(c) marketing advice for real estate sponsors. (Rule 506(c) is the SEC rule that lets you advertise a raise to accredited investors.) Ascent uses GowerCrowd's numbers as the baseline for this field. They are not Ascent results. Here they are.",
        },
        {
          type: "table",
          caption: "The numbers GowerCrowd has published. They cover real estate 506(c) investor marketing.",
          head: ["Measure", "Published figure", "What it tells you"],
          rows: [
            ["Cost per investor lead, Meta", "$50 to $100", "This is the volume channel. Leads cost the least here, but their quality varies the most."],
            ["Cost per investor lead, LinkedIn", "About 5 times Meta", "You can target by job title and industry. Quality is higher, but so is the price, by a lot."],
            ["Lead-to-investor conversion", "About 2%", "98 of 100 paid-for leads do not invest."],
            ["Cost per funded investor", "$3,500 to $4,500 within 90 days", "What one investor really costs when the funnel works."],
            ["Marketing as share of raise", "3 to 4% of the target", "The budget line a sponsor should plan from."],
            ["Published minimum media budget", "$3,000 to $5,000 a month", "This is a floor. In Ascent's view, it is below what a steady campaign needs."],
          ],
        },
        {
          type: "p",
          text: "Keep two warnings in mind. First, cost per lead depends on the offering, the ad itself, the place and the season. One campaign will swing around these ranges. Second, the two-percent figure is a lead-to-investor rate across the whole funnel. It already counts every lead that was never called.",
        },
      ],
    },
    {
      id: "worked-example",
      h2: "A $10 million raise, step by step",
      blocks: [
        {
          type: "p",
          text: "Let's say you run a $10 million Rule 506(c) raise. The average investment is $100,000. Your blended cost per investor lead is $75. (Blended means the average across all your ad channels.) You use the published two-percent conversion. This is just math on those guesses. It is not a forecast. Change any input and the results change with it.",
        },
        {
          type: "table",
          caption: "Example math only. We assume a $10M goal and a $100K average investment. We also assume $75 per lead and 2% lead-to-investor.",
          head: ["Line", "Math", "Result"],
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
          text: "The result lands inside every published range at once. It is 3 to 4% of the raise. It is $3,500 to $4,500 per investor. That is a fair sign the benchmarks describe the same funnel. It also shows why some raises stall. Some sponsors budget $3,000 a month for a $10 million raise. At that pace, the media alone takes ten years.",
        },
      ],
    },
    {
      id: "the-other-98",
      h2: "Where the other 98 leads go",
      blocks: [
        {
          type: "p",
          text: "The two percent is what is left after a chain of drop-offs. Most sponsors never measure them. Add two of them to the model. The first is the **contact rate**. That is the share of leads you reach for a real, connected conversation. The second is the **held rate**. That is the share of contacted leads whose meeting actually happens. Once you add these, cost per lead stops being the number that matters most.",
        },
        {
          type: "table",
          caption: "Same 5,000 leads and $375,000 of media. Only the follow-up assumptions change.",
          head: ["Scenario", "Contact rate", "Held rate", "Meetings held", "Cost per appointment held"],
          rows: [
            ["Typical: call back takes days, no confirmation", "40%", "20%", "400", "$938"],
            ["Faster call back", "60%", "20%", "600", "$625"],
            ["Faster call back, meetings confirmed", "60%", "30%", "900", "$417"],
          ],
        },
        {
          type: "p",
          text: "Nothing about the media changed between the rows. Same ads, same landing pages, same $375,000. Two things made the difference. Did a real person reach the lead fast? Did someone make sure the meeting happened? That is worth more than any likely drop in cost per lead. Say a campaign cut its cost per lead from $75 to $60. It would save $75,000. Now say a campaign raised its contact rate from 40% to 60%. It got 200 more meetings for nothing.",
        },
        {
          type: "quote",
          text: "Cost per lead is the number an agency controls. Cost per appointment held is the number a raise is funded by.",
        },
      ],
    },
    {
      id: "held-not-booked",
      h2: "Why \"held\" and not \"booked\"",
      blocks: [
        {
          type: "p",
          text: "A booked meeting is just a spot on a calendar. A held meeting is one where the investor showed up and the sponsor made the case. The investor is deciding on $25,000 to $500,000, so the gap between the two is big. You need a confirmation the day before. You need a way to reschedule no-shows. You need a nurture sequence (follow-up messages) between touches. Without these, booked meetings quietly stop happening. Any vendor can pump up a booked count. Only real work can move a held count. That is why Ascent reports cost per appointment held as its main number. It is also why the [cost-to-raise chart on the main page](/#calculator) asks for your cost per meeting held, not per meeting booked.",
        },
      ],
    },
    {
      id: "fully-loaded",
      h2: "Keeping the fee out of the media number",
      blocks: [
        {
          type: "p",
          text: "The sponsor pays for media straight to the ad platform, on the sponsor's own account. A vendor's fee is a separate line. That fee might be a retainer or a flat monthly fee. At a registered intermediary, it might be a share of capital raised. Cost figures are cleaner when they count media only and say so. Some reports fold the fee in. Those should be labeled fully loaded, so you can compare two vendors' numbers. With a flat monthly fee, the fully loaded cost per appointment held drops as volume goes up. That math is what makes the model work for a sponsor. It is also the [reason Ascent prices that way](/guides/placement-agent-vs-flat-fee-investor-acquisition).",
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
            "Is that cost per lead media only? Or is it fully loaded with your fee?",
            "What share of leads got a connected conversation? How soon?",
            "How many meetings were booked? How many were held?",
            "Who called the leads? From what number, and with what script? Is the call recorded?",
            "Does every figure come from the ad account and the CRM (the system that tracks each lead)? Can I see them there?",
            "Which of these numbers will you send me every week without being asked?",
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
      a: "Published benchmarks put Meta investor leads at about $50 to $100. LinkedIn leads cost about five times that. A lower cost per lead does not make it better on its own. LinkedIn leads cost more, and they are usually higher quality. And the number that matters for a raise is cost per appointment held.",
    },
    {
      q: "How much should a sponsor budget to market a 506(c) raise?",
      a: "Published advice puts total marketing at three to four percent of the target raise. On a $10 million raise, that is $300,000 to $400,000. In Ascent's view, a steady paid campaign needs at least $15,000 a month in media. That is separate from any vendor fee.",
    },
    {
      q: "What is cost per appointment held?",
      a: "It is media spend divided by the number of investor meetings that actually took place in the period. Ascent reports it as media only, unless a report is marked fully loaded. Ascent treats it as the main number. Why? Because no one can pump it up by booking meetings that never happen.",
    },
    {
      q: "Does a two-percent conversion rate mean the ads are bad?",
      a: "Not necessarily. The two percent is measured over the whole funnel. It counts every lead that was never called or was called late. It also counts every lead that booked a meeting and never held it. Better follow-up can move it without touching the ads. That means a faster first human touch, confirmations and reschedules.",
    },
    {
      q: "Can Ascent tell you how much capital a campaign will raise?",
      a: "No, and nothing on this site does. Ascent's math stops at appointments held. A held meeting may or may not turn into a subscription. That part is up to the sponsor, the offering and counsel.",
    },
  ],
  sources: [
    { label: "GowerCrowd. It publishes 506(c) marketing advice for real estate sponsors. It covers cost per lead by channel and lead-to-investor conversion. It also covers cost per investor, budget share and minimum budgets.", url: "https://gowercrowd.com" },
    { label: "Ascent metrics ontology (our list of terms). It defines contact rate, set-to-held rate and cost per appointment held. Each sponsor gets these in a weekly report.", url: null },
  ],
  image: {
    src: "/guide-images/cost-per-investor-lead-506c-benchmarks.jpg",
    alt: "A calculator on a printed bar chart report next to a laptop keyboard. The photo is black and white.",
    credit: "Negative Space via StockSnap, CC0",
  },
  related: [
    "speed-to-lead-investor-acquisition",
    "how-to-find-accredited-investors-real-estate-syndication",
    "placement-agent-vs-flat-fee-investor-acquisition",
  ],
};

export default guide;
