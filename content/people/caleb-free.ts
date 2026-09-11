import type { PersonProfile } from "./types";

/*
 * Caleb Free — the authoritative profile, served at ascentcas.com/caleb-free.
 *
 * Sources: the Ascent business plan (RE sponsors, second edition, September
 * 2026), the Oklahoma formation filing of August 31 2026, and the results
 * already published with attribution on the brand page
 * (content/verticals/general.ts `proof`).
 *
 * Two rules this file keeps, deliberately:
 *
 *   1. Nothing here overclaims. The business plan states plainly that the
 *      founder has no securities background and that residential brokerage
 *      and team operations are adjacent to commercial syndication rather
 *      than inside it. This page says the same. It describes marketing and
 *      operations work, never regulated or advisory work.
 *   2. A figure appears only with the business it belongs to named, the
 *      window it came from stated, and his actual part in it stated too.
 *      The VA Home Team figures are a team's results over his tenure as
 *      its Director of Operations, and `trackRecord.attribution` says so
 *      rather than letting them read as his alone.
 *
 * `profiles.links` is empty until the owner supplies his own URLs. Do not
 * fill it with a guess — the whole purpose of the page is to tie this name
 * to the right person, and a wrong profile link ties it to the wrong one.
 *
 * Things that came off this page at the owner's instruction and must not
 * come back without his say: his Oklahoma real estate licence, which is no
 * longer current; Prestige Fence, in which he no longer holds an interest;
 * and every mention of Oklahoma City Community College, which also cost
 * the page its one piece of independent coverage (`press` is null as a
 * result). His street address stays off it too.
 */
const calebFree: PersonProfile = {
  path: "/caleb-free",
  name: "Caleb Free",
  jobTitle: "Founder",
  /*
   * null on purpose. He goes by "Founder" — not "Founder and Managing
   * Member", not "CEO". `legalRole` exists for a person whose registered
   * title differs from the one they use, and his does not need to.
   */
  legalRole: null,

  seoTitle: "Caleb Free | Founder of Ascent",
  seoDescription:
    "Caleb Free is the founder of Ascent in Oklahoma City. He builds client acquisition systems for service businesses and runs investor acquisition for sponsors raising under Rule 506(c), after scaling a residential real estate team from roughly $40M to $60M a year as its Director of Operations.",

  eyebrow: "FOUNDER",
  tagline: "Founder of Ascent · Oklahoma City, Oklahoma",

  /* The one paragraph to be quoted whole. Facts in plain order, no pitch. */
  summary:
    "Caleb Free is an Oklahoma City entrepreneur and the founder of Ascent Client Acquisition Systems LLC, an Oklahoma company he formed in 2026 and trades as Ascent. Ascent builds and operates client acquisition systems — paid media, CRM and lead routing, instrumented lead response, and appointment setting — for service businesses, and investor acquisition for real estate syndicators and private real estate fund sponsors raising under Regulation D Rule 506(c). He came to the work through operations rather than advertising: as Director of Operations for VA Home Team OKC, a residential real estate team, he helped take it from roughly 145 closed transactions a year to 224, and from about $40 million in annual sales volume to $60 million. He has since built client acquisition for a number of local service businesses, and for Westwin Elements he runs the investor side of a Rule 506(c) raise \u2014 booking appointments with accredited investors for the capital behind its full-scale production facility. His work is marketing and operations: he is not a broker-dealer, a placement agent or an investment adviser, and does not give investment, legal or tax advice.",

  facts: [
    { label: "Role", value: "Founder, Ascent" },
    { label: "Based in", value: "Oklahoma City, Oklahoma" },
    { label: "Works on", value: "Client acquisition systems for service businesses; investor acquisition for Rule 506(c) sponsors" },
    { label: "Current work", value: "Investor acquisition for Westwin Elements' Rule 506(c) raise; client acquisition for Oklahoma service businesses" },
    { label: "Previously", value: "Director of Operations, VA Home Team OKC — 145 to 224 transactions a year, $40M to $60M in volume" },
    { label: "Also", value: "Founder, CJF Property Investments LLC" },
    { label: "Not", value: "A broker-dealer, placement agent, investment adviser or funding portal" },
  ],

  bio: [
    {
      h2: "What he does now",
      paragraphs: [
        "Caleb Free founded Ascent in Oklahoma City in 2026 and runs it as its sole member. The firm does one thing in two markets: it builds the machinery that turns advertising spend into booked, held appointments, then operates it — the media buying, the CRM and lead routing, the instant acknowledgement of a new lead, the follow-up on estimates and enquiries that would otherwise go quiet, and the calls that put a meeting on the calendar.",
        "The service-business side of that work runs on this site, and it is where most of the client roster sits — Oklahoma service businesses whose client acquisition he has built and now operates. The other side, at ascentforsponsors.com, is investor acquisition for real estate syndicators and private real estate fund sponsors raising under Regulation D Rule 506(c) — the same system, inside a compliance structure the sponsor's own securities counsel approves in writing before anything publishes or anyone dials.",
        "The current sponsor-side engagement is Westwin Elements, which is raising under Rule 506(c) to build a full-scale production facility. Ascent's part is the investor side of the funnel and nothing beyond it: the advertising, the response to every inbound enquiry, and the calls that put accredited investors on the calendar. The offering, the verification of accredited status and every decision about either belong to the issuer and its counsel.",
        "He runs every account personally rather than through a team of account managers, which is why the firm takes a small number of clients at a time.",
      ],
    },
    {
      h2: "Before Ascent",
      paragraphs: [
        "He came to marketing through real estate operations rather than through an agency. As Director of Operations for VA Home Team OKC, a residential real estate team, he built and ran the operational systems behind its transaction pipeline — the routing, the follow-up and the reporting that decide whether leads a team already paid for turn into closings. Over his tenure the team went from roughly 145 closed transactions a year to 224, and from about $40 million in annual sales volume to $60 million.",
        "That is the experience the firm is built on. A team at that size does not stall for want of leads; it stalls because nobody called the lead back, because the follow-up stopped after two attempts, and because no report told anyone either thing was happening. Fixing that is the same job whether the meeting being booked is a listing appointment or a call with an accredited investor.",
        "He is also the founder of CJF Property Investments LLC, an Oklahoma company through which he runs distressed-property marketing and assignment work. Having generated his own leads, worked his own follow-up and closed his own deals is why he reads a pipeline the way an operator does rather than the way a media buyer does.",
        "He states the limits of that background plainly: residential real estate operations are adjacent to commercial real estate syndication, not inside it, and he does not hold a securities licence. What the experience buys is fluency in how a deal-driven business actually operates, and firsthand knowledge of the failure Ascent is built to fix.",
      ],
    },
    {
      h2: "How he works",
      paragraphs: [
        "The consistent thread is measurement. Most marketing engagements report cost per lead and stop there. His reports carry the four numbers that decide whether the spend worked: how fast a human reached the lead, what share of leads were reached at all, how many booked meetings were actually held, and what each held meeting cost. On a capital raise that last figure, cost per appointment held, is the primary number, because unlike a booked count it cannot be inflated.",
        "The commercial terms follow from the same principle. Ascent charges a flat monthly fee, takes nothing tied to capital raised or revenue produced, and leaves the client owning everything built — the ad accounts, the CRM, the phone number, the recordings and the list.",
      ],
    },
  ],

  /*
   * The site's rule for a figure: name the business it belongs to, state
   * the window, and state his actual part in it. These are a team's
   * results over his tenure as its Director of Operations, which is what
   * `attribution` says — a page that let them read as one man's work
   * would be making a claim the sceptical reader is right to reject.
   *
   * Supplied by the owner from the team's own production reporting. They
   * are not audited, and the page does not imply they are.
   */
  trackRecord: {
    h2: "Operating track record",
    intro:
      "One engagement, with the business named and the role stated. These are VA Home Team OKC's results across his tenure as Director of Operations — a team's numbers, produced by a team, in a job whose whole remit was the systems behind them.",
    stats: [
      {
        number: "145",
        changeTo: "224",
        label: "Closed transactions a year, start of his tenure to end",
      },
      {
        number: "$40M",
        changeTo: "$60M",
        label: "Annual sales volume over the same period",
      },
    ],
    attribution:
      "Figures for VA Home Team OKC, Oklahoma City, across his tenure as its Director of Operations, supplied from the team's own production reporting and rounded. They are the team's results, not a personal attribution, and they are not audited. He was responsible for the operational systems behind the pipeline — routing, follow-up and reporting — not for the listings or the closings themselves.",
  },

  ventures: {
    h2: "Where to find the work",
    items: [
      {
        name: "Ascent",
        url: "https://ascentcas.com",
        role: "Founder",
        body: "Client acquisition systems for service businesses — paid media, CRM, lead response and appointment setting, installed and operated as one machine.",
      },
      {
        name: "Ascent for Sponsors",
        url: "https://ascentforsponsors.com",
        role: "Founder",
        body: "Investor acquisition for real estate syndicators and private real estate fund sponsors raising under Rule 506(c), inside a structure their securities counsel approves in writing.",
      },
      {
        name: "CJF Property Investments LLC",
        url: null,
        role: "Founder",
        body: "An Oklahoma company through which he runs distressed-property marketing and assignment work.",
      },
    ],
  },

  /*
   * null: the one piece of independent coverage this page carried was the
   * OCCC article, and the owner has asked for no mention of the college.
   * The section is worth refilling — third-party coverage is the part of
   * an identity page a search or answer engine can actually corroborate,
   * and everything else here is self-published. Add a podcast appearance,
   * a trade article or a local business feature when there is one; never
   * a directory listing or a page he wrote himself, which belong in
   * `profiles`.
   */
  press: null,

  profiles: {
    h2: "Profiles",
    intro:
      "The accounts that are actually his. Anything else using this name and photograph is not.",
    /*
     * EMPTY ON PURPOSE — awaiting the owner's own URLs. Paste them here
     * (LinkedIn personal profile first) and they render on the page and
     * become `sameAs` in the Person structured data, which is what tells
     * Google and the answer engines that those profiles and this page are
     * one entity. Never add a URL that has not been confirmed as his.
     */
    links: [],
  },

  /*
   * His own photograph, cropped from the full-resolution original he
   * supplied. Three shapes because three consumers want different ones:
   * the page wants a portrait, Person structured data wants a large
   * square, and a social card wants 1200×630. Regenerate with
   * scripts/build-person-assets.mjs if the source photo changes.
   */
  image: {
    alt: "Caleb Free, founder of Ascent, in a dark suit and open-collar white shirt.",
    page: { src: "/people/caleb-free.jpg", width: 720, height: 900 },
    square: { src: "/people/caleb-free-square.jpg", width: 1200, height: 1200 },
    og: "/people/caleb-free-og.jpg",
  },

  published: "2026-09-10",
  updated: "2026-09-10",
};

export default calebFree;
