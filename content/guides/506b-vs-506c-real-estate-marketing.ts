import type { Guide } from "./types";

/*
 * Rule 506(b) vs 506(c) from the marketing side. The rules are described
 * as the SEC publishes them and every regulatory statement sends the
 * reader to counsel — this is a guide to what a sponsor can and cannot
 * DO to find investors under each exemption, not legal advice.
 */
const guide: Guide = {
  slug: "506b-vs-506c-real-estate-marketing",
  title: "Rule 506(b) vs 506(c): what a real estate sponsor can and cannot do to find investors",
  seoTitle: "506(b) vs 506(c): Marketing Rules for Real Estate Sponsors",
  description:
    "The practical difference between Rule 506(b) and 506(c) for a real estate syndication or fund: what counts as general solicitation, who can invest, what verification means, and how sponsors switch.",
  eyebrow: "Regulation D · Real estate",
  published: "2026-09-09",
  updated: "2026-09-09",
  answer:
    "Under Rule 506(b) a real estate sponsor cannot advertise the offering at all — investors come from pre-existing relationships, and up to 35 of them may be non-accredited. Under Rule 506(c) the sponsor may advertise publicly (paid ads, a public website, social media, podcasts), but every purchaser must be an accredited investor and the sponsor must take reasonable steps to verify that status rather than accept a self-certification. Both are exemptions under Regulation D of the Securities Act, both allow an unlimited raise, and both require a Form D filing within 15 days of the first sale. The marketing consequence is binary: paid investor acquisition is only possible under 506(c).",
  takeaways: [
    "506(b): no general solicitation. Unlimited accredited investors plus up to 35 non-accredited, sophisticated investors. Self-certification questionnaires are customary.",
    "506(c): general solicitation permitted. Accredited investors only, and the issuer must take reasonable steps to verify — a questionnaire alone is not enough.",
    "General solicitation includes paid ads, a public offering page, social posts about the deal, mass email to strangers and speaking about the offering at public events.",
    "Both file Form D within 15 days of the first sale; both are subject to the Rule 506(d) bad-actor disqualification; both produce restricted securities.",
    "SEC staff guidance has allowed a 506(b) offering to convert to 506(c) if no general solicitation has yet occurred. The reverse is not available once you have advertised.",
    "Every paid investor-acquisition vendor, Ascent included, works only on 506(c) (or Regulation A+) offerings. No vendor can make advertising legal under 506(b).",
  ],
  sections: [
    {
      id: "what-they-share",
      h2: "What the two exemptions share",
      blocks: [
        {
          type: "p",
          text: "Rule 506 is the workhorse exemption of Regulation D. The SEC's own Regulation D statistics show it carries the large majority of private capital raised in the United States each year, and nearly every real estate syndication and private real estate fund uses one of its two paragraphs. Whichever one a sponsor picks:",
        },
        {
          type: "ul",
          items: [
            "There is **no cap on the amount raised**.",
            "The securities are **restricted** — investors cannot freely resell them.",
            "The issuer files a **Form D** with the SEC within 15 days of the first sale, and makes the state notice filings (blue-sky filings) counsel specifies. Rule 506 securities are “covered securities,” so states may require notice and a fee but may not impose their own merit review.",
            "The **bad-actor rule (506(d))** applies: a disqualifying event involving the issuer or a covered person — including anyone paid to solicit investors — can cost the exemption.",
            "The offering is made under **offering documents** — a private placement memorandum, subscription agreement and operating agreement — prepared under securities counsel.",
          ],
        },
        {
          type: "p",
          text: "The difference is entirely about how a sponsor is allowed to find investors, and what the sponsor must know about them.",
        },
      ],
    },
    {
      id: "506b",
      h2: "Rule 506(b): relationships only",
      blocks: [
        {
          type: "p",
          text: "506(b) is the older, quieter path. The issuer may sell to an unlimited number of accredited investors and to up to 35 non-accredited investors, provided those non-accredited investors are sophisticated — able, alone or with a purchaser representative, to evaluate the merits and risks — and receive the disclosure the rule requires. The price of that flexibility is a prohibition on **general solicitation and general advertising**.",
        },
        {
          type: "p",
          text: "In practice that means investors come from **pre-existing, substantive relationships** — people the sponsor already knows well enough to have a view on their financial circumstances and sophistication before the offering is discussed. The SEC staff has said that relationship can be formed by a registered broker-dealer or investment adviser on the issuer's behalf, and that a relationship formed before the offering begins can qualify even if it was formed online. What the staff has not said is that a stranger who clicks an ad and fills out a form has one.",
        },
        {
          type: "callout",
          title: "What a 506(b) sponsor can still market",
          text: "The brand, not the deal. A sponsor raising under 506(b) can build an audience — a newsletter, a podcast, educational content, a track-record page — as long as none of it offers or describes the securities being sold. Many sponsors use that audience to form relationships they later raise from. The moment the content describes a specific open offering, it is a solicitation.",
        },
      ],
    },
    {
      id: "506c",
      h2: "Rule 506(c): advertise, but verify",
      blocks: [
        {
          type: "p",
          text: "506(c) was created by the JOBS Act and took effect in September 2013. It lets an issuer solicit the general public — paid media, a public offering page, social media, webinars, podcasts, direct mail — on two conditions: **every purchaser must be an accredited investor**, and the issuer must take **reasonable steps to verify** that status. Non-accredited investors are not permitted at all, sophisticated or otherwise.",
        },
        {
          type: "p",
          text: "Verification is the part that changes a sponsor's operation. Under 506(b), a subscription questionnaire in which the investor checks a box is the customary basis for the issuer's reasonable belief. Under 506(c) that is not sufficient on its own. The rule offers non-exclusive safe harbors — reviewing two years of tax forms for income, reviewing recent bank and brokerage statements plus a credit report for net worth, or obtaining a written confirmation from a registered broker-dealer, SEC-registered investment adviser, licensed attorney or CPA — and a principles-based standard behind them. In March 2025 the SEC staff issued a no-action letter that treats a high minimum investment ($200,000 for a natural person, $1,000,000 for an entity) combined with specific written representations as reasonable steps in itself. The details are in [the verification guide](/guides/accredited-investor-verification-506c).",
        },
        {
          type: "p",
          text: "The other operational change is that the whole raise becomes a **public communication**. Every ad, landing page and email is a securities communication, and the anti-fraud provisions of the securities laws apply to all of it. That is why serious 506(c) sponsors run every piece of creative past counsel before it publishes, and why a marketing vendor working on a raise needs a written approval workflow rather than a style guide.",
        },
      ],
    },
    {
      id: "general-solicitation",
      h2: "What counts as general solicitation",
      blocks: [
        {
          type: "p",
          text: "Regulation D does not define the term with a list; the SEC's Rule 502(c) gives examples, and decades of staff guidance fill in the rest. For a real estate sponsor, the following are general solicitation when they describe or offer a specific offering:",
        },
        {
          type: "ul",
          items: [
            "Paid advertising on LinkedIn, Meta, Google, YouTube or any other platform.",
            "A public web page describing the offering, or a deal page reachable without a login gated on a pre-existing relationship.",
            "Social media posts, newsletters or podcast segments that mention the offering.",
            "Mass email or direct mail to people the sponsor has no substantive relationship with.",
            "Presenting the offering at a seminar, conference or webinar open to the public.",
            "Press releases or media interviews that describe the offering's terms.",
          ],
        },
        {
          type: "p",
          text: "The common misunderstanding is that the medium matters. It does not. A sponsor who describes an open 506(b) offering to an audience of strangers at a meetup has solicited generally, and a sponsor who runs paid ads for an educational webinar that never mentions a deal may not have. Counsel draws that line for each sponsor; the marketing team's job is to make sure nothing crosses it without counsel having seen it first.",
        },
      ],
    },
    {
      id: "side-by-side",
      h2: "Side by side",
      blocks: [
        {
          type: "table",
          caption: "Rule 506(b) and Rule 506(c) compared, from the sponsor's marketing seat.",
          head: ["", "Rule 506(b)", "Rule 506(c)"],
          rows: [
            ["General solicitation", "Prohibited", "Permitted"],
            ["Who may invest", "Accredited investors, plus up to 35 non-accredited sophisticated investors", "Accredited investors only"],
            ["Accredited status", "Issuer's reasonable belief — self-certification is customary", "Issuer must take reasonable steps to verify"],
            ["Offering size", "Unlimited", "Unlimited"],
            ["Form D", "Within 15 days of first sale", "Within 15 days of first sale — 506(c) box checked"],
            ["Bad-actor disqualification", "Applies", "Applies"],
            ["Disclosure to non-accredited investors", "Required if any are included", "Not applicable — none permitted"],
            ["Paid investor acquisition", "Not possible for the offering itself", "The reason the rule exists"],
          ],
        },
      ],
    },
    {
      id: "switching",
      h2: "Switching from 506(b) to 506(c)",
      blocks: [
        {
          type: "p",
          text: "Sponsors often start under 506(b) because it is familiar, then discover mid-raise that the personal network has been exhausted. SEC staff guidance in its Securities Act Rules Compliance and Disclosure Interpretations has allowed an issuer that began an offering under 506(b) to continue it under 506(c), provided no general solicitation had been used up to that point and all sales after the switch meet 506(c)'s requirements — including verification of every purchaser going forward. The issuer amends its Form D to reflect the change. Going the other way is not available: once an offering has been generally solicited, it cannot become a 506(b) offering.",
        },
        {
          type: "p",
          text: "Two practical consequences. First, if a sponsor thinks it may ever want to advertise a raise, the cleanest path is to structure it as 506(c) from the start and verify every investor, including friends and family, from the first check. Second, the switch is a counsel decision with a filing attached — not something a marketing vendor can make on the sponsor's behalf, and not something any vendor should be launching ads ahead of.",
        },
      ],
    },
    {
      id: "what-it-means-for-marketing",
      h2: "What it means for investor acquisition",
      blocks: [
        {
          type: "quote",
          text: "No investor-acquisition vendor can make advertising legal under 506(b). Paid investor acquisition exists only under 506(c).",
        },
        {
          type: "p",
          text: "That is why Ascent's qualification gate asks about the exemption before anything else, and why a 506(b) sponsor is turned away rather than sold something adjacent. For a sponsor already under 506(c), the rule shapes the whole system: the creative is drafted against what counsel has approved, the landing page carries the legends counsel specifies verbatim, the lead-response sequence is a securities communication, and the appointment setter who calls an investor lead back is scripted to logistics only — confirming the lead asked to hear from the sponsor and getting a meeting onto the calendar — never the offering's returns, terms or merits. Verification of accredited status stays with the issuer, permanently. [How the whole lane runs](/#process) is on the main page.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can a real estate sponsor run Facebook or LinkedIn ads for a 506(b) offering?",
      a: "No. Paid advertising that describes or offers the securities is general solicitation, which Rule 506(b) prohibits. A 506(b) sponsor can advertise its brand and educational content, but not the offering.",
    },
    {
      q: "Can non-accredited investors participate in a 506(c) offering?",
      a: "No. Every purchaser in a Rule 506(c) offering must be an accredited investor, and the issuer must take reasonable steps to verify that status.",
    },
    {
      q: "Does a 506(c) sponsor have to verify friends and family too?",
      a: "Yes. The verification requirement applies to every purchaser in a 506(c) offering, regardless of the sponsor's relationship with them.",
    },
    {
      q: "Is a self-certification questionnaire enough under 506(c)?",
      a: "On its own, no. The SEC has said that a check-the-box representation is not reasonable steps to verify. Counsel chooses a method — the safe harbors, a third-party verifier, or the minimum-investment approach described in the SEC staff's March 2025 no-action letter.",
    },
    {
      q: "Can an offering switch from 506(b) to 506(c) after it starts?",
      a: "SEC staff guidance has allowed it, provided no general solicitation has occurred and all purchasers after the switch are verified as accredited. The Form D is amended. The switch is a decision for the issuer's securities counsel.",
    },
    {
      q: "Does Ascent work with 506(b) sponsors?",
      a: "No. Ascent runs paid investor acquisition, which is only lawful under Rule 506(c) or Regulation A+. A sponsor planning a 506(c) filing within the next ninety days can book a scoping call ahead of it.",
    },
  ],
  sources: [
    { label: "U.S. Securities and Exchange Commission — Regulation D, Rules 501, 502, 506 (17 CFR 230.501–230.506)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174/section-230.506" },
    { label: "SEC — Securities Act Rules: Compliance and Disclosure Interpretations, Section 256 (Rule 506)", url: "https://www.sec.gov/rules-regulations/staff-guidance/compliance-disclosure-interpretations/securities-act-rules" },
    { label: "SEC — Form D and filing requirements", url: "https://www.sec.gov/resources-small-businesses/exempt-offerings/frequently-asked-questions-about-form-d" },
    { label: "SEC Division of Corporation Finance — no-action letter to Latham & Watkins LLP regarding Rule 506(c) verification, March 12, 2025", url: "https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-no-action-letters" },
    { label: "SEC Division of Economic and Risk Analysis — Regulation D offerings statistics", url: "https://www.sec.gov/dera" },
  ],
  image: {
    src: "/guide-images/506b-vs-506c-real-estate-marketing.jpg",
    alt: "Fluted granite columns on the facade of a courthouse-style building.",
    credit: "The Building Envelope via StockSnap, CC0",
  },
  related: [
    "accredited-investor-verification-506c",
    "how-to-find-accredited-investors-real-estate-syndication",
    "placement-agent-vs-flat-fee-investor-acquisition",
  ],
};

export default guide;
