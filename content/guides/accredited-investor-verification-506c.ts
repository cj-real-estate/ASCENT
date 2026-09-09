import type { Guide } from "./types";

/*
 * Verification after the March 2025 no-action letter — the business
 * plan's second named content piece. Describes the rule and the letter as
 * published; every choice of method is counsel's. Ascent never verifies.
 */
const guide: Guide = {
  slug: "accredited-investor-verification-506c",
  title: "Accredited investor verification under Rule 506(c), after the SEC's March 2025 guidance",
  seoTitle: "Accredited Investor Verification Under 506(c) — 2025 Guidance",
  description:
    "What “reasonable steps to verify” means under Rule 506(c): the safe-harbor methods, third-party verification, and the SEC staff's March 2025 no-action letter allowing a minimum-investment approach.",
  eyebrow: "Regulation D · Verification",
  published: "2026-09-09",
  updated: "2026-09-09",
  answer:
    "Rule 506(c) requires an issuer to take reasonable steps to verify that every purchaser is an accredited investor — a self-certification alone is not enough. The rule gives four non-exclusive safe harbors: reviewing two years of tax forms for income, reviewing recent account statements and a credit report for net worth, obtaining a written confirmation from a registered broker-dealer, SEC-registered investment adviser, licensed attorney or CPA, or a certification from an existing investor who bought before September 2013. On March 12, 2025, SEC staff issued a no-action letter treating a minimum investment of $200,000 for natural persons or $1,000,000 for entities, combined with written representations that the purchaser is accredited and that the investment is not financed by a third party for that purpose, as reasonable steps in itself, absent knowledge to the contrary. Which method to use is a decision for the issuer's securities counsel, and verification always happens at subscription — never on the ad or the first call.",
  takeaways: [
    "506(c) sets a principles-based standard: reasonable steps, judged by the nature of the purchaser, the information the issuer has, and the offering's terms — including its minimum investment.",
    "Safe harbors: income (two years of W-2, 1099, K-1 or 1040 plus a representation for the current year); net worth (recent bank, brokerage and asset statements, a credit report for liabilities); third-party written confirmation within the prior three months; grandfathered existing investors.",
    "March 2025 no-action letter: a $200,000 (natural person) or $1,000,000 (entity) minimum investment plus specified written representations can be reasonable steps, with no additional documentation, if the issuer has no reason to believe otherwise.",
    "Third-party verification services fit the safe harbors and keep investor financial documents out of the sponsor's own files.",
    "Verification happens at the subscription stage, by the issuer under counsel's process. An investor-acquisition vendor should never ask about, assess or verify accredited status.",
    "Keep the record. If the exemption is ever questioned, the documentation of the steps taken is the defence.",
  ],
  sections: [
    {
      id: "the-standard",
      h2: "What the rule requires",
      blocks: [
        {
          type: "p",
          text: "Rule 506(c) permits general solicitation on two conditions: every purchaser is an accredited investor, and the issuer takes **reasonable steps to verify** that they are. The SEC deliberately did not define reasonable steps as a checklist. The adopting release describes a principles-based inquiry that turns on three things — the nature of the purchaser and the category of accredited investor they claim, the amount and type of information the issuer already has about them, and the nature and terms of the offering, such as how investors were solicited and the minimum investment required. The more an issuer already knows, and the higher the minimum, the less additional verification is reasonable to require.",
        },
        {
          type: "p",
          text: "What the SEC has said is not sufficient on its own is the customary 506(b) approach: a subscription questionnaire in which the investor represents that they are accredited, with nothing behind it.",
        },
      ],
    },
    {
      id: "safe-harbors",
      h2: "The four safe-harbor methods",
      blocks: [
        {
          type: "p",
          text: "Rule 506(c)(2)(ii) lists four methods that are deemed to satisfy the requirement for natural persons. They are non-exclusive — an issuer may use other reasonable methods — but they are the ones counsel reaches for first.",
        },
        {
          type: "table",
          caption: "The Rule 506(c)(2)(ii) safe harbors, summarised. Counsel applies the actual text.",
          head: ["Method", "What is reviewed", "Notes"],
          rows: [
            ["Income", "IRS forms reporting income for the two most recent years — W-2, 1099, K-1, Form 1040 — plus a written representation that the purchaser reasonably expects to reach the threshold in the current year", "$200,000 individually or $300,000 jointly with a spouse or spousal equivalent"],
            ["Net worth", "Assets: bank, brokerage and other statements, certificates of deposit, tax assessments or appraisals, dated within the prior three months. Liabilities: a consumer credit report from a nationwide agency, plus a representation that all liabilities are disclosed", "Net worth above $1,000,000 excluding the primary residence"],
            ["Third-party confirmation", "A written confirmation from a registered broker-dealer, an SEC-registered investment adviser, a licensed attorney or a CPA that they have taken reasonable steps to verify within the prior three months", "The basis for most third-party verification services"],
            ["Existing investor", "A certification from a person who invested in the issuer's 506(b) offering as an accredited investor before September 23, 2013 and remains an investor", "Rarely relevant to a new sponsor"],
          ],
        },
      ],
    },
    {
      id: "march-2025",
      h2: "The March 2025 no-action letter",
      blocks: [
        {
          type: "p",
          text: "On March 12, 2025, the SEC's Division of Corporation Finance responded to a request from Latham & Watkins LLP with a no-action letter that has changed how many sponsors approach verification. The staff agreed that an issuer could reasonably conclude it had taken reasonable steps to verify where three conditions were met together:",
        },
        {
          type: "ol",
          items: [
            "A **minimum investment** of at least $200,000 for a natural person, or at least $1,000,000 for an entity (with related rules for entities whose status depends on their owners).",
            "**Written representations** from the purchaser that they are an accredited investor, and that the minimum investment is not being financed in whole or in part by a third party for the specific purpose of making the investment.",
            "The issuer has **no actual knowledge** of facts indicating that the purchaser is not accredited or that the investment is financed by a third party.",
        ],
        },
        {
          type: "p",
          text: "The letter is staff guidance about one set of facts, not a rule change, and it is expressly limited to the representations described. For sponsors whose minimums already sit at or above those thresholds it can remove the document-collection step entirely; for sponsors with a $25,000 or $50,000 minimum it changes nothing. Whether to rely on it, and how to word the representations, is counsel's call.",
        },
        {
          type: "callout",
          title: "What the letter did not do",
          text: "It did not lower the accredited-investor thresholds, did not eliminate the verification requirement, and did not bless self-certification at lower minimums. An issuer that relies on it still needs the written representations, still needs to have no contrary knowledge, and still needs to keep the record.",
        },
      ],
    },
    {
      id: "third-party",
      h2: "Third-party verification services",
      blocks: [
        {
          type: "p",
          text: "Several specialist services verify investors on the issuer's behalf, typically by collecting the documents described in the income and net-worth safe harbors and issuing a letter under the third-party confirmation method, signed by an attorney or CPA. Investor portals and fund-administration platforms often integrate one. The practical advantages are that the investor's tax returns and account statements never sit in the sponsor's own files, the letter is dated and standardised, and the three-month clock is tracked by someone whose job it is.",
        },
        {
          type: "p",
          text: "The practical cost is friction at the subscription stage — an investor asked for two years of tax returns by a sponsor they met three weeks ago sometimes stops there. Sponsors manage that with the sequence: verification is raised after the investor has decided, explained as a requirement of the exemption rather than of the sponsor, and handled by a named service with a short form.",
        },
      ],
    },
    {
      id: "where-it-sits",
      h2: "Where verification sits in the investor-acquisition process",
      blocks: [
        {
          type: "p",
          text: "Verification is a subscription-stage event, and it belongs to the issuer. It is not something the ad asks about, not something the landing page assesses, and not something the person who calls the lead back should ever raise. Three reasons:",
        },
        {
          type: "ul",
          items: [
            "**It is the issuer's obligation under the rule**, judged on the issuer's knowledge and the issuer's process. Delegating the judgement to a marketing vendor muddles who took the reasonable steps.",
            "**It is the wrong moment.** An investor who has read one landing page has not decided anything. Asking about their net worth before they have heard the sponsor's case costs the meeting.",
            "**It keeps the vendor out of broker territory.** A vendor that assesses investor suitability, discusses the offering and is paid by results looks like an unregistered broker. A vendor that handles logistics on a flat fee and never touches status does not.",
          ],
        },
        {
          type: "p",
          text: "That is why Ascent's setters are scripted to logistics only, why the CRM Ascent operates for a sponsor has no field for accredited status, and why the [terms on which Ascent is not a broker](/#included) say that verification stays with the issuer, permanently.",
        },
        {
          type: "quote",
          text: "Verification happens when an investor decides to invest — by the issuer, under counsel's process — never on the ad and never on the first call.",
        },
      ],
    },
    {
      id: "checklist",
      h2: "A verification checklist for a 506(c) sponsor",
      blocks: [
        {
          type: "ul",
          items: [
            "Counsel has chosen the method — safe harbor, third-party service, minimum-investment reliance under the 2025 letter, or a combination — and documented why it is reasonable for this offering.",
            "The subscription documents carry the written representations counsel specified.",
            "The three-month window on statements and third-party letters is tracked.",
            "Every purchaser, including friends, family and repeat investors, goes through the process.",
            "The record of steps taken for each purchaser is kept with the offering file.",
            "Nobody upstream of subscription — ads, landing pages, nurture, setters — asks about, assesses or verifies status.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is a signed questionnaire enough to verify accredited status under 506(c)?",
      a: "On its own, no. The SEC has said a check-the-box representation without more is not reasonable steps. It can be part of a method — the March 2025 no-action letter, for example, relies on written representations together with a high minimum investment.",
    },
    {
      q: "What minimum investment lets a sponsor rely on the March 2025 letter?",
      a: "At least $200,000 for a natural person and at least $1,000,000 for an entity, combined with the specified written representations and no contrary knowledge on the issuer's part. Counsel decides whether and how to rely on it.",
    },
    {
      q: "How recent do the documents have to be?",
      a: "Under the net-worth safe harbor, statements and the credit report must be dated within the prior three months; under the third-party method, the confirmation must be within the prior three months. Income verification uses the two most recent years of IRS forms.",
    },
    {
      q: "Does the sponsor have to see an investor's tax returns?",
      a: "Not necessarily. A third-party verification service or a qualifying professional can review the documents and issue a written confirmation, so the sponsor's files hold the letter rather than the returns.",
    },
    {
      q: "Does Ascent verify accredited investors?",
      a: "No. Ascent never asks about, assesses or verifies accredited-investor status, and the CRM it operates for a sponsor has no field for it. Verification remains with the issuer under counsel's process.",
    },
  ],
  sources: [
    { label: "U.S. Securities and Exchange Commission — Rule 506(c) (17 CFR 230.506(c)), including the verification safe harbors at 506(c)(2)(ii)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174/section-230.506" },
    { label: "SEC — Eliminating the Prohibition Against General Solicitation and General Advertising in Rule 506 and Rule 144A Offerings, Release No. 33-9415 (July 2013)", url: "https://www.sec.gov/rules-regulations/2013/07/eliminating-prohibition-against-general-solicitation-general-advertising-rule-506-rule-144a-offerings" },
    { label: "SEC Division of Corporation Finance — no-action letter to Latham & Watkins LLP, March 12, 2025, regarding Rule 506(c) verification", url: "https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-no-action-letters" },
    { label: "SEC — Rule 501(a), definition of accredited investor, as amended August 2020", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174/section-230.501" },
  ],
  image: {
    src: "/guides/accredited-investor-verification-506c.jpg",
    alt: "A pen resting on the signature line of a printed contract.",
    credit: "rawpixel, CC0",
  },
  related: [
    "506b-vs-506c-real-estate-marketing",
    "placement-agent-vs-flat-fee-investor-acquisition",
    "investor-acquisition-glossary",
  ],
};

export default guide;
