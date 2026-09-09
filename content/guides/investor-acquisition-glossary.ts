import type { Guide } from "./types";

/*
 * The glossary. One h3 per term with a one-paragraph definition, so each
 * term is a discrete, quotable answer; the route also emits a
 * DefinedTermSet from these sections.
 */
const term = (name: string, definition: string) => [
  { type: "h3" as const, text: name },
  { type: "p" as const, text: definition },
];

const guide: Guide = {
  slug: "investor-acquisition-glossary",
  title: "Investor acquisition glossary for real estate sponsors",
  seoTitle: "Investor Acquisition Glossary for Real Estate Sponsors",
  description:
    "Plain definitions of the terms in 506(c) investor acquisition — from accredited investor and general solicitation to speed to lead, set-to-held rate and cost per appointment held.",
  eyebrow: "Reference · Glossary",
  published: "2026-09-09",
  updated: "2026-09-09",
  answer:
    "Investor acquisition is the work of finding accredited investors for a private real estate offering and getting them into a held meeting with the sponsor, which under Regulation D is lawful through advertising only for Rule 506(c) and Regulation A+ offerings. The terms below cover the regulatory vocabulary a sponsor's counsel uses, the marketing vocabulary a media vendor uses, and the response metrics — speed to first human touch, contact rate, set-to-held rate and cost per appointment held — that Ascent reports to each sponsor weekly.",
  takeaways: [
    "Regulatory terms are summarised as the SEC publishes them; the definitions are for orientation, not legal advice.",
    "Ascent's own metric definitions are given exactly as they are reported, because the definition is the point.",
    "“Appointment held,” never booked or set. “Investor lead,” never prospect. “Flat monthly fee,” never a share of anything.",
  ],
  sections: [
    {
      id: "regulatory",
      h2: "Regulatory terms",
      blocks: [
        ...term("Accredited investor", "A person or entity meeting the tests in Rule 501(a) of Regulation D. For a natural person, commonly income above $200,000 in each of the last two years ($300,000 jointly) or net worth above $1,000,000 excluding the primary residence; since 2020, also holders of the Series 7, 65 or 82 licenses. Entities qualify on their own tests, such as more than $5,000,000 in investments."),
        ...term("Regulation D", "The SEC's set of rules under the Securities Act exempting certain private offerings from registration. Rule 506 is its most-used exemption, and nearly every real estate syndication and private real estate fund raises under one of its two paragraphs."),
        ...term("Rule 506(b)", "The Regulation D exemption that prohibits general solicitation. Unlimited accredited investors plus up to 35 non-accredited, sophisticated investors; the issuer's reasonable belief about accredited status is customarily based on self-certification. Investors come from pre-existing relationships."),
        ...term("Rule 506(c)", "The Regulation D exemption, created by the JOBS Act in 2013, that permits general solicitation. Every purchaser must be an accredited investor and the issuer must take reasonable steps to verify that status. The only exemption under which paid investor acquisition for a Rule 506 offering is lawful."),
        ...term("General solicitation", "Offering or advertising securities to the public — paid ads, a public offering page, social media, mass email, public events. Prohibited under 506(b), permitted under 506(c). The medium does not matter; describing an open offering to strangers is solicitation."),
        ...term("Reasonable steps to verify", "The 506(c) standard for confirming accredited status. Principles-based, with four non-exclusive safe harbors (income documents, net-worth documents, third-party confirmation, grandfathered investors) and, since the SEC staff's March 2025 no-action letter, a minimum-investment approach at $200,000 for natural persons and $1,000,000 for entities."),
        ...term("Form D", "The notice an issuer files with the SEC within 15 days of the first sale in a Regulation D offering, identifying the exemption relied on, the amount offered and sold, the minimum investment, and any sales compensation paid. Public on EDGAR."),
        ...term("Regulation A+", "An exemption allowing public offerings of up to $75 million (Tier 2) with an SEC-qualified offering statement, open to non-accredited investors within limits. Permits general solicitation and is, with 506(c), the other structure paid investor acquisition can serve."),
        ...term("Broker-dealer", "A person engaged in the business of effecting transactions in securities for others, required to register under Section 15(a) of the Exchange Act. Transaction-based compensation — a fee tied to capital raised — is the clearest indicator of broker activity."),
        ...term("Placement agent", "A registered broker-dealer engaged by an issuer to find and solicit investors for a share of capital raised, commonly quoted at several percent — 6–8% in private real estate. Lawful because registered; priced accordingly."),
        ...term("Finder", "An unregistered person paid to introduce investors. Where the fee depends on capital raised, the SEC generally treats the finder as an unregistered broker; a 2020 proposal to exempt certain finders was never adopted."),
        ...term("Transaction-based compensation", "Any fee that depends on whether or how much capital is raised, how many investors are introduced, or how many subscriptions close. Its absence — a flat fee for a defined service — is the term that keeps a marketing vendor on the vendor side of the broker line."),
        ...term("Rule 3a4-1", "An Exchange Act safe harbor under which certain associated persons of an issuer — employees or officers who are not paid commissions and meet the rule's other conditions — are deemed not to be brokers when they participate in selling the issuer's securities."),
        ...term("Bad-actor disqualification", "Rule 506(d). A disqualifying event — certain convictions, orders or bars — involving the issuer or a covered person, including anyone compensated to solicit investors, can make the Rule 506 exemption unavailable."),
        ...term("Sponsor / issuer / general partner", "The party organising the offering and selling the securities. On this site, sponsor is used for the operating business, issuer for the entity selling the securities, and the investors are always the sponsor's — never a vendor's."),
        ...term("Syndication", "A single-asset or small-portfolio real estate offering in which a sponsor raises equity from multiple investors for one deal. Each syndication is its own offering, so the investor list has to be rebuilt each time unless it is kept and worked."),
        ...term("Evergreen fund", "A vehicle that raises and invests continuously rather than closing on a fixed date. Because it is always open, it is the structure for which a standing investor-acquisition system is most valuable."),
      ],
    },
    {
      id: "marketing",
      h2: "Marketing and lead-response terms",
      blocks: [
        ...term("Investor acquisition", "Generating investor leads for a 506(c) or Reg A+ offering and working them until a meeting with the sponsor is actually held. Media, response and appointment setting as one system, reported as cost per appointment held."),
        ...term("Investor lead", "A person who responded to the sponsor's advertising and asked to hear more — a form submission, with consent to be contacted. Ascent never uses the word prospect for an inbound lead, and never calls anyone who did not ask."),
        ...term("Cost per investor lead", "Media spend divided by investor leads in the period. Published category benchmarks put it at $50–$100 on Meta and roughly five times that on LinkedIn. The number agencies report because it is the number they control."),
        ...term("Speed to lead", "The interval between a lead's form submission and the first outbound attempt by a live person. Ascent reports the median in minutes as speed to first human touch."),
        ...term("First touch / first human touch", "Two separately timestamped events: the instant automated acknowledgement (text and email) and the first attempt by a person. A CRM with a single field will report the autoresponder and call it speed."),
        ...term("Contact rate", "The share of investor leads that got a connected conversation — a live voice, not a voicemail. Ascent reports it bucketed by response time: under five minutes, five to sixty minutes, one to twenty-four hours, later."),
        ...term("Appointment set / booked", "A meeting placed on the sponsor's calendar. A count that any vendor can inflate, which is why it is never the metric Ascent manages to."),
        ...term("Appointment held", "A booked meeting that took place — the investor attended and the sponsor made the case. The unit of Ascent's reporting and of every written minimum in a proposal."),
        ...term("Set-to-held rate", "Of meetings booked, the share that were held. The metric that exposes no-shows; moved by confirmation the day before, reschedules and nurture between touches."),
        ...term("Cost per appointment held", "Media spend divided by appointments held in the period. Media-only unless a report says fully loaded. Ascent's primary metric because it cannot be inflated by booking meetings nobody attends."),
        ...term("Fully loaded", "A cost-per figure that includes the vendor's fee as well as media. Comparable across vendors only when both figures are labelled the same way."),
        ...term("Setter / appointment setter", "A live person, recruited, scripted and supervised, who calls inbound investor leads as the sponsor from a number registered to the sponsor, confirms that the lead asked to hear from the sponsor, and gets a meeting onto the calendar. Logistics only — never the offering — and every call recorded."),
        ...term("Compliance gate", "The set of written conditions — exemption confirmed, approver named at counsel, every legend and script approved — that must close before anything publishes or anyone dials. On an Ascent engagement it has nine conditions and one review deadline."),
        ...term("Legend", "Required disclosure language on an offering communication — the statements counsel specifies for an ad, a landing page or an email, carried verbatim."),
        ...term("Flat monthly fee", "A fixed fee for a defined service, scaling with media under management and with nothing tied to capital raised, investors acquired or appointments held. The fee model that lets a marketing vendor remain a vendor."),
        ...term("Media under management", "The monthly advertising spend a firm runs on the sponsor's behalf, paid by the sponsor to the platform on the sponsor's own account — never held, advanced or marked up by the vendor."),
      ],
    },
  ],
  faq: [
    {
      q: "What is the difference between an appointment set and an appointment held?",
      a: "A set (or booked) appointment is a calendar entry. A held appointment is one that took place. Ascent reports and guarantees held appointments because a booked count can be inflated by meetings nobody attends.",
    },
    {
      q: "What is investor acquisition?",
      a: "The work of generating accredited-investor leads for a 506(c) or Reg A+ offering and working them — response, nurture, setting and confirmation — until a meeting with the sponsor is actually held. Reported as cost per appointment held.",
    },
    {
      q: "Why does Ascent say investor lead rather than prospect?",
      a: "Because the word describes what happened: a person responded to the sponsor's advertising and asked to hear more. Ascent's setters call only those inbound leads, never a list, and never anyone who did not ask.",
    },
  ],
  sources: [
    { label: "U.S. Securities and Exchange Commission — Regulation D (17 CFR 230.500–230.508) and Rule 3a4-1 (17 CFR 240.3a4-1)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174" },
    { label: "SEC — Guide to Broker-Dealer Registration", url: "https://www.sec.gov/about/reports-publications/investor-publications/guide-broker-dealer-registration" },
    { label: "GowerCrowd — published 506(c) marketing benchmarks for real estate sponsors", url: "https://gowercrowd.com" },
    { label: "Ascent metrics ontology — the reported definitions of first touch, first human touch, contact rate, set-to-held rate and cost per appointment held", url: null },
  ],
  image: {
    src: "/guides/investor-acquisition-glossary.jpg",
    alt: "A hand writing notes with a pen on printed sheets beside a laptop and a coffee cup.",
    credit: "Green Chameleon via StockSnap, CC0",
  },
  related: [
    "506b-vs-506c-real-estate-marketing",
    "speed-to-lead-investor-acquisition",
    "cost-per-investor-lead-506c-benchmarks",
  ],
};

export default guide;
