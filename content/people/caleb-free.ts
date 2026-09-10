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
 *   2. Every figure is one already published on this site with its client
 *      named and its window stated. The real-estate-team Google Ads case is
 *      described without figures because the site has never published those
 *      with an attribution line; add the numbers only together with one.
 *
 * `profiles.links` and `image` are empty/null until the owner supplies
 * them. Do not fill either with a guess — the whole purpose of the page is
 * to tie this name to the right person.
 */
const calebFree: PersonProfile = {
  path: "/caleb-free",
  name: "Caleb Free",
  jobTitle: "Founder",
  legalRole: "Founder and Managing Member",

  seoTitle: "Caleb Free | Founder of Ascent",
  seoDescription:
    "Caleb Free is the founder of Ascent Client Acquisition Systems LLC in Oklahoma City — paid media, lead response and appointment setting for service businesses and for real estate sponsors raising under Rule 506(c).",

  eyebrow: "FOUNDER",
  tagline:
    "Founder of Ascent Client Acquisition Systems LLC · Oklahoma City, Oklahoma",

  /* The one paragraph to be quoted whole. Facts in plain order, no pitch. */
  summary:
    "Caleb Free is an Oklahoma City entrepreneur and the founder and managing member of Ascent Client Acquisition Systems LLC, an Oklahoma company he formed in 2026. Ascent builds and operates client acquisition systems — paid media, CRM and lead routing, instrumented lead response, and appointment setting — for service businesses, and investor acquisition for real estate syndicators and private real estate fund sponsors raising under Regulation D Rule 506(c). He is a licensed Oklahoma real estate agent, was previously Director of Operations for VA Home Team OKC, and is a half owner of Prestige Fence LLC. His work is marketing and operations: he is not a broker-dealer, a placement agent or an investment adviser, and does not give investment, legal or tax advice.",

  facts: [
    { label: "Role", value: "Founder and Managing Member, Ascent Client Acquisition Systems LLC" },
    { label: "Based in", value: "Oklahoma City, Oklahoma" },
    { label: "Works on", value: "Client acquisition systems for service businesses; investor acquisition for Rule 506(c) real estate sponsors" },
    { label: "Licensed", value: "Oklahoma real estate agent" },
    { label: "Previously", value: "Director of Operations, VA Home Team OKC" },
    { label: "Also", value: "Half owner, Prestige Fence LLC; founder, CJF Property Investments LLC" },
    { label: "Not", value: "A broker-dealer, placement agent, investment adviser or funding portal" },
  ],

  bio: [
    {
      h2: "What he does now",
      paragraphs: [
        "Caleb Free founded Ascent Client Acquisition Systems LLC in Oklahoma City in 2026 and runs it as its sole member. The firm does one thing in two markets: it builds the machinery that turns advertising spend into booked, held appointments, then operates it — the media buying, the CRM and lead routing, the instant acknowledgement of a new lead, the follow-up on estimates and enquiries that would otherwise go quiet, and the calls that put a meeting on the calendar.",
        "The service-business side of that work runs on this site. The other side, at ascentforsponsors.com, is investor acquisition for real estate syndicators and private real estate fund sponsors raising under Regulation D Rule 506(c) — the same system, inside a compliance structure the sponsor's own securities counsel approves in writing before anything publishes or anyone dials.",
        "He runs every account personally rather than through a team of account managers, which is why the firm takes a small number of clients at a time.",
      ],
    },
    {
      h2: "Before Ascent",
      paragraphs: [
        "He came to marketing through real estate operations rather than through an agency. As Director of Operations for VA Home Team OKC, a real estate team, he built and ran the operational systems behind its transaction pipeline — the routing, the follow-up and the reporting that decide whether leads a team already paid for turn into closings.",
        "Oklahoma City Community College profiled him in March 2025, while he was studying business there and working as a real estate agent at Keller Williams Elite with first-time homebuyers. \u201cAs an entrepreneur at heart,\u201d he told the college, \u201cOCCC has helped provide me with the tools and knowledge to be successful.\u201d",
        "He is a licensed Oklahoma real estate agent, a half owner of Prestige Fence LLC, and the founder of CJF Property Investments LLC, an Oklahoma company through which he has run distressed-property marketing and assignment work. Having sold, quoted and closed work in the field is why he tends to diagnose a response failure — nobody called the lead back — before a lead-volume one.",
        "He states the limits of that background plainly: residential brokerage, team operations and contracting are adjacent to commercial real estate syndication, not inside it, and he does not hold a securities licence. What the experience buys is fluency in how a deal-driven business actually operates, and firsthand knowledge of the failure Ascent is built to fix.",
      ],
    },
    {
      h2: "How he works",
      paragraphs: [
        "The consistent thread is measurement. Most marketing engagements report cost per lead and stop there. His report the four numbers that decide whether the spend worked: how fast a human reached the lead, what share of leads were reached at all, how many booked meetings were actually held, and what each held meeting cost. On a capital raise that last figure, cost per appointment held, is the primary number, because unlike a booked count it cannot be inflated.",
        "The commercial terms follow from the same principle. Ascent charges a flat monthly fee, takes nothing tied to capital raised or revenue produced, and leaves the client owning everything built — the ad accounts, the CRM, the phone number, the recordings and the list.",
      ],
    },
  ],

  trackRecord: {
    h2: "Track record",
    intro:
      "One named, attributed case, published here with the client's agreement. The figures are the client's own, from the ad account and their quote tracker.",
    stats: [
      { number: "65 in 19 days", label: "Leads generated on $866 of Meta ad spend" },
      { number: "$275K → $85K", label: "Quoted, then signed inside 30 days — from follow-up alone" },
      { number: "$13.33", label: "Average cost per lead, Oklahoma City metro" },
    ],
    attribution:
      "Results from Prestige Fence, Oklahoma City — August 1–30, 2026. He has also run Google Ads and the follow-up system for an Oklahoma City real estate team; those figures are not published here because that client has not agreed to a named case study.",
  },

  ventures: {
    h2: "Where to find the work",
    items: [
      {
        name: "Ascent Client Acquisition Systems",
        url: "https://ascentcas.com",
        role: "Founder and Managing Member",
        body: "Client acquisition systems for service businesses — paid media, CRM, lead response and appointment setting, installed and operated as one machine.",
      },
      {
        name: "Ascent for Sponsors",
        url: "https://ascentforsponsors.com",
        role: "Founder",
        body: "Investor acquisition for real estate syndicators and private real estate fund sponsors raising under Rule 506(c), inside a structure their securities counsel approves in writing.",
      },
      {
        name: "Prestige Fence LLC",
        url: null,
        role: "Half owner",
        body: "An Oklahoma City fencing contractor, and the named client in the results published above.",
      },
      {
        name: "CJF Property Investments LLC",
        url: null,
        role: "Founder",
        body: "An Oklahoma company through which he has run distressed-property marketing and assignment work.",
      },
    ],
  },

  /*
   * Independent coverage. This is the corroboration a search or answer
   * engine weights most, because it is not self-published: a .edu
   * publisher writing about him by name. Add anything else of the same
   * kind here — a podcast appearance, a trade article — never a directory
   * listing or a page he wrote himself, which belong in `profiles`.
   */
  press: {
    h2: "In the news",
    intro:
      "Independent coverage that names him, with the publisher and date so it can be checked.",
    items: [
      {
        title:
          "Gaining title: Course flexibility helps OCCC student take on role in real estate market",
        publisher: "Oklahoma City Community College",
        date: "2025-03-12",
        url: "https://www.occc.edu/news/2025/gaining-title-course-flexibility-helps-occc-student-take-on-role-in-real-estate-market.html",
        note:
          "The college's profile of him as a business student working full-time as a real estate agent, a year before he founded Ascent.",
      },
    ],
  },

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
    alt: "Caleb Free, founder of Ascent Client Acquisition Systems, in a dark suit and open-collar white shirt.",
    page: { src: "/people/caleb-free.jpg", width: 720, height: 900 },
    square: { src: "/people/caleb-free-square.jpg", width: 1200, height: 1200 },
    og: "/people/caleb-free-og.jpg",
  },

  published: "2026-09-10",
  updated: "2026-09-10",
};

export default calebFree;
