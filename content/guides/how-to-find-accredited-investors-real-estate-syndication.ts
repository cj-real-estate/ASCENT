import type { Guide } from "./types";

/*
 * The category's head query. Channels and mechanics, with the published
 * benchmarks attributed to GowerCrowd — never an Ascent result.
 */
const guide: Guide = {
  slug: "how-to-find-accredited-investors-real-estate-syndication",
  title: "How to find accredited investors for a real estate syndication or fund",
  seoTitle: "How to Find Accredited Investors for a Real Estate Syndication",
  description:
    "Where accredited investors for a real estate syndication actually come from — network, referral, content, paid media under Rule 506(c) — what each channel costs, and why most paid leads never become investors.",
  eyebrow: "Investor acquisition · Real estate",
  published: "2026-09-09",
  updated: "2026-09-09",
  answer:
    "Accredited investors for a real estate syndication come from five channels: the sponsor's own network and referrals, the existing investor list, content and audience (podcasts, newsletters, LinkedIn), registered intermediaries such as placement agents and broker-dealers, and paid investor acquisition — advertising on LinkedIn, Meta and Google, which is lawful only for offerings under Rule 506(c) or Regulation A+. Paid acquisition is the only channel that scales on demand, and its published economics are unforgiving: cost per investor lead of roughly $50 to $100 on Meta, about five times that on LinkedIn, and about two percent of investor leads becoming investors. The sponsors who make it work treat what happens in the first minutes after a lead arrives — the call-back, the confirmation, the meeting that is actually held — as the product, not the ad.",
  takeaways: [
    "Relationship-based raising fills the first few deals and then stops scaling. The moment a sponsor notices is usually mid-raise.",
    "Paid investor acquisition requires a Rule 506(c) (or Reg A+) offering. Under 506(b) a sponsor may market the brand but not the deal.",
    "Published category benchmarks (GowerCrowd): $50–$100 per investor lead on Meta, roughly 5× that on LinkedIn, ~2% lead-to-investor conversion, $3,500–$4,500 per funded investor.",
    "Sponsors budget marketing at roughly 3–4% of the target raise; published minimum media budgets of $3,000–$5,000 a month sit below what a statistically stable campaign needs.",
    "The lever most sponsors never pull is response: speed to first human touch, contact rate, and whether a booked meeting is held.",
    "Verification of accredited status is the issuer's job under 506(c), and it happens after the meeting — not on the ad.",
  ],
  sections: [
    {
      id: "who-counts",
      h2: "Who counts as an accredited investor",
      blocks: [
        {
          type: "p",
          text: "Rule 501(a) of Regulation D defines the term. For a natural person the common tests are income above $200,000 in each of the two most recent years ($300,000 jointly with a spouse or spousal equivalent) with a reasonable expectation of the same this year, or net worth above $1,000,000 excluding the primary residence. Since the SEC's 2020 amendments, holders in good standing of the Series 7, 65 or 82 licenses qualify regardless of wealth, as do “knowledgeable employees” of a private fund investing in that fund. Entities qualify on their own tests — for example, any entity with more than $5,000,000 in investments, or one owned entirely by accredited investors.",
        },
        {
          type: "p",
          text: "Estimates of the accredited population in the United States run into the millions of households. The problem for a sponsor was never that they are rare. It is that they are not labelled, they do not respond to a cold pitch, and — under 506(c) — the sponsor has to prove each one's status before taking the money.",
        },
      ],
    },
    {
      id: "channels",
      h2: "The five channels, and what each one is for",
      blocks: [
        { type: "h3", text: "1. Network and referral" },
        {
          type: "p",
          text: "Where nearly every sponsor's first raises come from: partners, colleagues, a country club, the investors in the last deal and the people they know. It is cheap, high-trust and fully compatible with 506(b). It is also finite. Sponsors describe the same inflection point — the third or fourth deal, or the first fund, where the warm list is spoken for and the raise stalls with capital still to place.",
        },
        { type: "h3", text: "2. The existing investor list" },
        {
          type: "p",
          text: "Re-investment from prior LPs is the highest-converting source any sponsor has, and it is the reason a list a sponsor owns — every lead, every recording, every note, in a CRM registered to the sponsor rather than a vendor — is worth more than any single raise. A fund or evergreen vehicle compounds this; a single-asset syndication starts over each time unless the list is kept and worked.",
        },
        { type: "h3", text: "3. Content and audience" },
        {
          type: "p",
          text: "Podcasts, newsletters, LinkedIn, webinars, a book. Slow to build, hard to attribute, and the most durable channel in the category because it creates the pre-existing relationships 506(b) needs and the warm demand that makes 506(c) advertising cheaper. Under 506(b) the content must never describe an open offering; under 506(c) it can, once counsel has approved it.",
        },
        { type: "h3", text: "4. Registered intermediaries" },
        {
          type: "p",
          text: "Placement agents and broker-dealers introduce investors for a share of capital raised, in a range commonly quoted at several percent of the raise — often 6–8% in private real estate — and generally serve larger, institutional-facing sponsors. Investor platforms and marketplaces occupy a related lane. The trade-off is [structural](/guides/placement-agent-vs-flat-fee-investor-acquisition): the fee comes out of equity and the investor relationship often belongs to the intermediary.",
        },
        { type: "h3", text: "5. Paid investor acquisition" },
        {
          type: "p",
          text: "Advertising to find investors directly — LinkedIn for accredited-investor quality, Meta for volume, Google for people already searching for real estate investments — on landing pages that carry counsel's legends, feeding a nurture sequence and a phone. It is the only channel that produces investor leads on demand, in proportion to budget, and it is lawful only for offerings under [Rule 506(c) or Regulation A+](/guides/506b-vs-506c-real-estate-marketing). Everything below is about this channel, because it is the one where sponsors lose the most money quietly.",
        },
      ],
    },
    {
      id: "economics",
      h2: "What paid investor acquisition costs",
      blocks: [
        {
          type: "p",
          text: "GowerCrowd, the category's most-cited publisher of 506(c) marketing guidance for real estate sponsors, puts the numbers roughly as follows. A cost per investor lead of $50 to $100 on Meta, and about five times that on LinkedIn. A lead-to-investor conversion rate of about two percent. A cost per funded investor of $3,500 to $4,500 within ninety days of first contact. Total marketing budgeted at three to four percent of the target raise, and minimum monthly media budgets of $3,000 to $5,000 — a floor that, in Ascent's view, sits below what a statistically stable campaign can run on.",
        },
        {
          type: "table",
          caption: "Published category benchmarks for real estate 506(c) investor marketing (GowerCrowd). Not Ascent results.",
          head: ["Measure", "Published figure"],
          rows: [
            ["Cost per investor lead — Meta", "$50–$100"],
            ["Cost per investor lead — LinkedIn", "Roughly 5× Meta"],
            ["Investor leads that become investors", "About 2%"],
            ["Cost per funded investor (within 90 days)", "$3,500–$4,500"],
            ["Marketing as a share of the target raise", "3–4%"],
            ["Published minimum media budget", "$3,000–$5,000 a month"],
          ],
        },
        {
          type: "p",
          text: "Run the arithmetic on a real raise and the shape of the problem appears. [The cost guide](/guides/cost-per-investor-lead-506c-benchmarks) walks through a $10 million example line by line; the short version is that a two-percent conversion rate means ninety-eight of every hundred leads a sponsor paid for do not invest, and almost nobody in the chain is paid to find out why.",
        },
      ],
    },
    {
      id: "why-leads-die",
      h2: "Why most investor leads never become investors",
      blocks: [
        {
          type: "p",
          text: "An accredited investor clicks an ad, reads a landing page and submits a form. What typically happens next: an email autoresponder, then silence, then a call from someone on the sponsor's team a day or three later — reading no script, on a line nobody records, with no record of whether the lead ever picked up. The agency reports the lead as delivered, which by its definition it was.",
        },
        {
          type: "p",
          text: "Three failures stack here, and the [speed-to-lead guide](/guides/speed-to-lead-investor-acquisition) treats each in detail:",
        },
        {
          type: "ol",
          items: [
            "**Speed.** The interval between the form and the first human touch is measured in days when it should be measured in minutes. Widely cited response-time research finds the odds of reaching and qualifying a lead fall steeply after the first hour.",
            "**Contact.** Nobody measures how many leads were actually reached, so the contact rate — the share of leads that get a connected conversation — is unknown, and unmanaged.",
            "**Held, not booked.** A $25,000 to $500,000 decision takes several conversations. Without confirmation, reschedules and a nurture sequence between touches, meetings that were booked quietly stop happening, and the report never says so.",
          ],
        },
        {
          type: "quote",
          text: "A sponsor's raise is rarely short on leads. It is short on the first ninety seconds after one arrives.",
        },
      ],
    },
    {
      id: "system",
      h2: "What a working investor-acquisition system looks like",
      blocks: [
        {
          type: "p",
          text: "The sponsors who make paid acquisition work run it as one system rather than a media buy with a CRM attached. The components, in the order they are built:",
        },
        {
          type: "ol",
          items: [
            "**A compliance gate that closes first.** Exemption confirmed as 506(c), a named approver at securities counsel, every legend and every script approved in writing before anything publishes or anyone dials.",
            "**A media lane per channel.** LinkedIn for accredited-investor quality, Meta for volume, Google for existing demand — every ad drafted against what counsel approved: no projected returns, no manufactured urgency.",
            "**Investor-grade assets the sponsor owns.** Landing pages with the specified legends verbatim, a CRM registered to the sponsor, source and creative recorded on every lead.",
            "**Instrumented lead response.** Acknowledgement within seconds by text and email; first touch and first human touch timestamped separately; contact rate and set rate bucketed by response time.",
            "**A live, scripted setter.** A person, calling as the sponsor from a number registered to the sponsor, within minutes of the lead — logistics only, never the offering — who confirms attendance and reschedules no-shows. Every call recorded for the sponsor and counsel.",
            "**Weekly reporting on four numbers.** Speed to first human touch, contact rate by response bucket, set-to-held rate, and cost per appointment held — the number that cannot be inflated by booking meetings nobody attends.",
          ],
        },
        {
          type: "p",
          text: "The sponsor's own role does not change: run the investor conversation, and verify accredited status before accepting a subscription. Everything before the meeting is the system's job. That is the division of labor [Ascent](/) is built around, on a flat monthly fee with nothing tied to capital raised.",
        },
      ],
    },
    {
      id: "checklist",
      h2: "Before you spend a dollar on investor ads",
      blocks: [
        {
          type: "ul",
          items: [
            "Confirm with counsel that the offering is under 506(c) or Reg A+, and that the Form D reflects it.",
            "Name the person at counsel who approves creative, and agree a turnaround — three business days is workable.",
            "Decide who calls a new lead, how fast, from what number, on what script, and whether the call is recorded.",
            "Make sure the CRM, the phone number and the ad accounts are registered to you, not to a vendor.",
            "Set the media budget from the raise, not from a vendor's minimum: at three to four percent of a $10 million target, that is $300,000 to $400,000 over the raise, or $15,000 a month and up.",
            "Decide the one number you will manage to. If it is cost per lead, expect two percent. If it is cost per appointment held, you will find out where the other ninety-eight percent went.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can I buy a list of accredited investors?",
      a: "Lists exist, but calling or emailing people who never asked to hear from you is both a poor channel for a $50,000 decision and a compliance and consumer-protection risk. Ascent never buys, scrapes or accepts an investor list, and its setters call only inbound leads the sponsor generated.",
    },
    {
      q: "Which advertising platform works best for finding accredited investors?",
      a: "Each does a different job. LinkedIn targets by title, industry and seniority and produces higher-quality investor leads at a materially higher cost per lead. Meta produces volume at the lowest cost per lead. Google captures people already searching for real estate investments. Most serious campaigns run all three and compare them on cost per appointment held, not cost per lead.",
    },
    {
      q: "How many investor leads does a $10 million raise need?",
      a: "At the published two-percent lead-to-investor rate and a $100,000 average investment, about 100 investors and therefore about 5,000 leads. The cost guide on this site works through the arithmetic and the levers that change it.",
    },
    {
      q: "Do I verify accredited status before or after the first meeting?",
      a: "After. Verification is part of the subscription process, once an investor has decided to invest. The ad, the landing page and the setter's call never ask about it — the sponsor and its counsel handle verification at the point of investment.",
    },
    {
      q: "Can a marketing agency be paid a percentage of what I raise?",
      a: "Transaction-based compensation is the hallmark of broker activity under the Exchange Act, and a vendor that takes it without being registered creates risk for the sponsor as well as itself. Ascent charges a flat monthly fee with nothing tied to capital raised, investors acquired or appointments held.",
    },
  ],
  sources: [
    { label: "GowerCrowd — published 506(c) marketing guidance for real estate sponsors: budgets, cost per lead by channel, lead-to-investor conversion and cost per investor", url: "https://gowercrowd.com" },
    { label: "U.S. Securities and Exchange Commission — Rule 501(a), definition of accredited investor (17 CFR 230.501)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174/section-230.501" },
    { label: "SEC — Accredited investor definition amendments, adopted August 2020", url: "https://www.sec.gov/newsroom/press-releases/2020-191" },
    { label: "SEC — Regulation D, Rule 506 (17 CFR 230.506)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174/section-230.506" },
    { label: "Oldroyd, McElheran and Elkington — “The Short Life of Online Sales Leads,” Harvard Business Review, March 2011", url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  ],
  related: [
    "cost-per-investor-lead-506c-benchmarks",
    "speed-to-lead-investor-acquisition",
    "506b-vs-506c-real-estate-marketing",
  ],
};

export default guide;
