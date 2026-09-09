import type { Guide } from "./types";

/*
 * The alternatives a sponsor is choosing between, compared structurally —
 * fee model, who owns the investor, and where the broker line sits. Never
 * a claim that one outperforms another, and never a named competitor.
 */
const guide: Guide = {
  slug: "placement-agent-vs-flat-fee-investor-acquisition",
  title: "Placement agent, finder, in-house IR or flat-fee investor acquisition: how sponsors pay to fill a raise",
  seoTitle: "Placement Agent vs Flat-Fee Investor Acquisition for Sponsors",
  description:
    "The four ways a real estate sponsor pays to find investors — placement agent, finder, in-house investor relations, and flat-fee investor acquisition — compared on cost, ownership and the broker-dealer line.",
  eyebrow: "Fee models · Compliance",
  published: "2026-09-09",
  updated: "2026-09-09",
  answer:
    "A real estate sponsor filling a raise has four ways to pay for investors. A registered placement agent or broker-dealer charges a share of capital raised — commonly quoted at several percent, often 6 to 8 percent in private real estate — and the relationship with the investor frequently stays with the agent. An unregistered finder paid on the same basis is, in the SEC's view, usually acting as an unregistered broker, which exposes the sponsor as well as the finder. An in-house investor-relations hire is a fixed salary, commonly $90,000 to $140,000 a year fully loaded, whether or not a raise is open. A flat-fee investor-acquisition firm charges a monthly fee for media, response and appointment setting, with nothing tied to capital raised, so the sponsor keeps the equity and owns the investor list. The difference is not only price; it is who owns the investor and which side of the broker-dealer line the vendor sits on.",
  takeaways: [
    "Transaction-based compensation — a fee tied to capital raised or investors introduced — is the hallmark of broker activity under Section 15(a) of the Exchange Act. Only registered broker-dealers may lawfully take it.",
    "Using an unregistered finder can expose the sponsor: potential rescission rights for investors, Form D disclosure issues, and questions about the exemption itself.",
    "Placement agents are registered and priced accordingly. On a $10 million raise, 6–8% is $600,000 to $800,000, paid out of equity rather than the marketing budget.",
    "An in-house IR hire is a fixed cost that does not scale down between raises, and the sponsor still buys the media and builds the compliance workflow.",
    "A flat monthly fee keeps a marketing vendor on the right side of the line, keeps the investor list with the sponsor, and makes the fully-loaded cost per appointment held fall as volume rises.",
    "Rule 3a4-1 offers a safe harbor for the issuer's own associated persons who sell without commission-based pay — a structure counsel sometimes prefers for the person making the calls.",
  ],
  sections: [
    {
      id: "the-line",
      h2: "The line every option is measured against",
      blocks: [
        {
          type: "p",
          text: "Section 15(a) of the Securities Exchange Act of 1934 makes it unlawful for a broker — any person engaged in the business of effecting transactions in securities for the account of others — to do so without registering. The statute does not define “engaged in the business” with a checklist, but the SEC and courts look at a familiar set of factors: whether the person solicits investors, participates in negotiations, advises on the merits, handles investor funds, and, above all, whether they receive **transaction-based compensation** — a fee that depends on whether or how much capital is raised.",
        },
        {
          type: "p",
          text: "That last factor matters most because it is the one that cannot be argued around. A person paid a percentage of what investors invest has a salesman's stake in the outcome, and the SEC has consistently treated that stake as the clearest indicator of broker activity. A person paid a flat fee for a defined service, who never discusses the offering and never touches funds, has a much stronger claim to be a vendor rather than a broker.",
        },
        {
          type: "callout",
          title: "Why the sponsor should care about the vendor's status",
          text: "The consequences of an unregistered broker in the chain do not stop with the vendor. Investors sold securities through an unregistered broker may have rescission rights in some states; the arrangement must be disclosed on Form D; and a bad-actor event involving a compensated solicitor can cost the issuer its Rule 506 exemption. A marketing failure costs a media budget. A compliance failure can attach to the whole raise.",
        },
      ],
    },
    {
      id: "placement-agent",
      h2: "Placement agents and broker-dealers",
      blocks: [
        {
          type: "p",
          text: "A placement agent is a registered broker-dealer, or a person associated with one, engaged by an issuer to find and solicit investors. The agent may lawfully take a success fee because it is registered, supervised and subject to FINRA rules; the fee is disclosed in the offering documents and on Form D. Ranges commonly quoted for private real estate raises run to several percent of capital raised, and the comparison on Ascent's main page uses 6–8% as the published industry range. On a $10 million raise that is $600,000 to $800,000, generally structured as a cost of the offering and therefore borne by the equity rather than the sponsor's operating budget.",
        },
        {
          type: "p",
          text: "Placement agents serve a real function for larger, institutional-facing sponsors, and their investors are frequently institutions and family offices rather than individual accredited investors reached through advertising. The trade-offs for a sponsor raising from individuals are the price, the minimum raise size an agent will take on, and the question of whose investor it is afterwards — an agent's relationships are the agent's asset.",
        },
      ],
    },
    {
      id: "finders",
      h2: "Finders",
      blocks: [
        {
          type: "p",
          text: "A “finder” is an unregistered person who introduces investors to an issuer for a fee. The idea that a finder may take a percentage of capital raised as long as they only make introductions is widespread in real estate and is not supported by the SEC's position. In 2020 the Commission proposed a conditional exemption for certain finders raising capital from accredited investors for private companies; it was never adopted. Staff no-action letters over the years have allowed very narrow finder arrangements and refused most. The general rule stands: a person paid transaction-based compensation to solicit investors is acting as a broker and must be registered or associated with a registered broker-dealer.",
        },
        {
          type: "p",
          text: "The practical version for a sponsor: if a vendor of any kind — a marketing agency, a consultant, a friend with a network — proposes to be paid on capital raised, the question to ask is where they are registered. If the answer is nowhere, the risk is the sponsor's as much as the vendor's.",
        },
      ],
    },
    {
      id: "in-house",
      h2: "An in-house investor-relations hire",
      blocks: [
        {
          type: "p",
          text: "Many sponsors solve the response problem by hiring for it: an investor-relations manager or associate whose job is to call leads, run follow-up and manage the investor list. Published ranges for the role, fully loaded with benefits and overhead, run roughly $90,000 to $140,000 a year, and the cost is fixed whether a raise is open this quarter or not. The hire also does not solve the rest of the system: the sponsor still buys and manages the media, builds the compliance approval workflow, sets up the CRM and telephony, writes the scripts and supervises the calls. For a sponsor with a fund program that raises continuously, an in-house hire can be the right long-term answer — and a well-run outsourced lane hands over a documented process for that hire to take on.",
        },
        {
          type: "p",
          text: "One structural point counsel sometimes raises: an employee of the issuer who sells its securities can rely on the Rule 3a4-1 safe harbor from broker registration if, among other conditions, they are not compensated by commissions or other transaction-based pay and either restrict their activity as the rule describes or perform substantial other duties for the issuer. That is one reason a sponsor's own people should never be paid a percentage of what they raise either.",
        },
      ],
    },
    {
      id: "flat-fee",
      h2: "Flat-fee investor acquisition",
      blocks: [
        {
          type: "p",
          text: "The fourth model is a firm that runs the media, the lead response and the appointment setting for a **flat monthly fee** — nothing tied to capital raised, investors acquired or appointments held, at any performance level. The fee scales with the media under management, it is an operating expense rather than a slice of the deal, the sponsor keeps 100% of what is raised, and everything built — the CRM, the phone number, the recordings, the investor list — is registered to and stays with the sponsor.",
        },
        {
          type: "p",
          text: "The model has a compliance logic as much as a commercial one. A vendor on a flat fee that never discusses the offering, never handles funds, never verifies status and never gives advice sits on the vendor side of the broker line by design. Written into the contract as an express no-transaction-based-compensation clause, it is also the term that lets securities counsel approve the structure without redrafting it. The limitation is equally structural: a flat-fee firm cannot promise capital. What it can put in writing is a minimum number of investor appointments held, and a remedy — Ascent's is to keep working at no fee until the minimum is met.",
        },
        {
          type: "quote",
          text: "A flat fee is the only fee model that lets a marketing vendor stay a vendor.",
        },
      ],
    },
    {
      id: "side-by-side",
      h2: "Side by side",
      blocks: [
        {
          type: "table",
          caption: "Four ways to pay for investors. Ranges are published industry figures, not quotes; Ascent's fee is quoted in writing after a scoping call.",
          head: ["", "Placement agent", "Unregistered finder", "In-house IR hire", "Flat-fee acquisition"],
          rows: [
            ["Fee basis", "% of capital raised (often 6–8%)", "% of capital raised", "Salary, ~$90K–$140K fully loaded", "Flat monthly fee"],
            ["Paid from", "Offering proceeds / equity", "Offering proceeds", "Operating budget", "Operating budget"],
            ["Registration", "Registered broker-dealer", "None — the problem", "Issuer's employee (Rule 3a4-1 may apply)", "Not required; no broker activity"],
            ["Scales with", "Capital raised", "Capital raised", "Nothing — fixed", "Media under management"],
            ["Owns the investor relationship", "Often the agent", "Unclear", "The sponsor", "The sponsor"],
            ["Covers media, response and setting", "Rarely", "No", "Response only", "All three"],
            ["Can promise capital", "No", "No", "No", "No — appointments held, in writing"],
          ],
        },
      ],
    },
    {
      id: "choosing",
      h2: "Choosing",
      blocks: [
        {
          type: "p",
          text: "A sponsor raising institutional money at scale should talk to a placement agent. A sponsor with a continuous fund program and a proven lead flow may be ready for an in-house hire. A sponsor raising from individual accredited investors under Rule 506(c), with counsel engaged and a media budget of $15,000 a month or more, is the sponsor a flat-fee investor-acquisition firm is built for — and the [fit check on Ascent's main page](/#book) says so in both directions. Whatever the choice, the one term a sponsor should never sign with a marketing vendor is a fee tied to capital raised.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can a marketing agency be paid a percentage of capital raised?",
      a: "Not lawfully, unless it is a registered broker-dealer. Transaction-based compensation for soliciting investors is the clearest indicator of broker activity under Section 15(a) of the Exchange Act, and an unregistered vendor taking it creates risk for the sponsor as well as the vendor.",
    },
    {
      q: "What does a placement agent charge for a real estate raise?",
      a: "Published ranges for private real estate run to several percent of capital raised, commonly cited at 6–8%. On a $10 million raise that is $600,000 to $800,000, usually treated as an offering cost borne by the equity.",
    },
    {
      q: "Is a finder's fee legal for introducing investors?",
      a: "Generally not for an unregistered person paid on capital raised. The SEC proposed a limited finder exemption in 2020 and never adopted it. Very narrow arrangements have been permitted by staff no-action letters; most are not. Counsel should review any finder proposal before it is signed.",
    },
    {
      q: "Is Ascent a broker-dealer, finder or placement agent?",
      a: "No. Ascent is a marketing, lead-response, appointment-setting and reporting vendor on a flat monthly fee, with an express no-transaction-based-compensation clause. It never discusses the offering, handles funds, verifies accredited status or gives investment advice.",
    },
    {
      q: "What can a flat-fee firm guarantee if it cannot guarantee capital?",
      a: "A minimum number of investor appointments held in a defined period, set in writing from the sponsor's media budget and history, with a remedy if it is missed. Ascent's remedy is to keep working at no fee until the minimum is met. No result about capital is promised anywhere.",
    },
  ],
  sources: [
    { label: "Securities Exchange Act of 1934, Section 15(a) — registration of brokers and dealers", url: "https://www.law.cornell.edu/uscode/text/15/78o" },
    { label: "SEC — Guide to Broker-Dealer Registration, including the discussion of finders and transaction-based compensation", url: "https://www.sec.gov/about/reports-publications/investor-publications/guide-broker-dealer-registration" },
    { label: "SEC — Proposed exemptive order for certain finders, Release No. 34-90112 (October 2020), not adopted", url: "https://www.sec.gov/newsroom/press-releases/2020-248" },
    { label: "Exchange Act Rule 3a4-1 — associated persons of an issuer deemed not to be brokers (17 CFR 240.3a4-1)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.3a4-1" },
    { label: "SEC — Regulation D, Rule 506(d) bad-actor disqualification, and Form D Item 12 (sales compensation)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174/section-230.506" },
    { label: "Published industry ranges for placement-agent fees in private real estate and for fully-loaded investor-relations salaries, as summarised in Ascent's business plan (September 2026)", url: null },
  ],
  image: {
    src: "/guides/placement-agent-vs-flat-fee-investor-acquisition.jpg",
    alt: "Two people shaking hands across a desk over a notebook and a cup of coffee.",
    credit: "Kristin Hardwick via StockSnap, CC0",
  },
  related: [
    "cost-per-investor-lead-506c-benchmarks",
    "506b-vs-506c-real-estate-marketing",
    "accredited-investor-verification-506c",
  ],
};

export default guide;
