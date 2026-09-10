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
 *   2. A figure appears only with its client named and its window stated.
 *      `trackRecord` is null because the one attributed case this page had
 *      is a client the owner has asked not to mention; an unnamed version
 *      of the same numbers is not a substitute.
 *
 * `profiles.links` is empty until the owner supplies his own URLs. Do not
 * fill it with a guess — the whole purpose of the page is to tie this name
 * to the right person, and a wrong profile link ties it to the wrong one.
 *
 * Two things came off this page at the owner's instruction and must not
 * come back without his say: his Oklahoma real estate licence, which is no
 * longer current, and Prestige Fence, in which he no longer holds an
 * interest. His street address stays off it too.
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
    "Caleb Free is the founder of Ascent, an Oklahoma City firm running paid media, lead response and appointment setting for service businesses and for real estate sponsors raising under Rule 506(c).",

  eyebrow: "FOUNDER",
  tagline: "Founder of Ascent · Oklahoma City, Oklahoma",

  /* The one paragraph to be quoted whole. Facts in plain order, no pitch. */
  summary:
    "Caleb Free is an Oklahoma City entrepreneur and the founder of Ascent Client Acquisition Systems LLC, an Oklahoma company he formed in 2026 and trades as Ascent. Ascent builds and operates client acquisition systems — paid media, CRM and lead routing, instrumented lead response, and appointment setting — for service businesses, and investor acquisition for real estate syndicators and private real estate fund sponsors raising under Regulation D Rule 506(c). He is a graduate of Oklahoma City Community College in business and was previously Director of Operations for VA Home Team OKC, a residential real estate team. His work is marketing and operations: he is not a broker-dealer, a placement agent or an investment adviser, and does not give investment, legal or tax advice.",

  facts: [
    { label: "Role", value: "Founder, Ascent" },
    { label: "Based in", value: "Oklahoma City, Oklahoma" },
    { label: "Works on", value: "Client acquisition systems for service businesses; investor acquisition for Rule 506(c) real estate sponsors" },
    { label: "Education", value: "Oklahoma City Community College — business" },
    { label: "Previously", value: "Director of Operations, VA Home Team OKC" },
    { label: "Also", value: "Founder, CJF Property Investments LLC" },
    { label: "Not", value: "A broker-dealer, placement agent, investment adviser or funding portal" },
  ],

  bio: [
    {
      h2: "What he does now",
      paragraphs: [
        "Caleb Free founded Ascent in Oklahoma City in 2026 and runs it as its sole member. The firm does one thing in two markets: it builds the machinery that turns advertising spend into booked, held appointments, then operates it — the media buying, the CRM and lead routing, the instant acknowledgement of a new lead, the follow-up on estimates and enquiries that would otherwise go quiet, and the calls that put a meeting on the calendar.",
        "The service-business side of that work runs on this site. The other side, at ascentforsponsors.com, is investor acquisition for real estate syndicators and private real estate fund sponsors raising under Regulation D Rule 506(c) — the same system, inside a compliance structure the sponsor's own securities counsel approves in writing before anything publishes or anyone dials.",
        "He runs every account personally rather than through a team of account managers, which is why the firm takes a small number of clients at a time.",
      ],
    },
    {
      h2: "Before Ascent",
      paragraphs: [
        "He came to marketing through real estate operations rather than through an agency. As Director of Operations for VA Home Team OKC, a real estate team, he built and ran the operational systems behind its transaction pipeline — the routing, the follow-up and the reporting that decide whether leads a team already paid for turn into closings.",
        "He studied business at Oklahoma City Community College while working full-time in real estate, and graduated. The college profiled him partway through, in March 2025, for doing both at once.",
        "He is also the founder of CJF Property Investments LLC, an Oklahoma company through which he runs distressed-property marketing and assignment work. Having generated his own leads, worked his own follow-up and closed his own deals is why he tends to diagnose a response failure — nobody called the lead back — before a lead-volume one.",
        "He states the limits of that background plainly: residential real estate operations are adjacent to commercial real estate syndication, not inside it, and he does not hold a securities licence. What the experience buys is fluency in how a deal-driven business actually operates, and firsthand knowledge of the failure Ascent is built to fix.",
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

  /*
   * Removed, not emptied by accident: the only attributed case this page
   * carried was Prestige Fence, which the owner has asked not to mention.
   * The site's rule is that a figure appears only with its client named
   * and its window stated, so an unnamed version of the same numbers is
   * not an option — it reads as fabrication to exactly the sceptical
   * reader this page is for. Restore this with a client who has agreed to
   * be named, and put the attribution line back with it.
   */
  trackRecord: null,

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
          "The college's profile of him as a business student working full-time in real estate, a year before he founded Ascent.",
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
    alt: "Caleb Free, founder of Ascent, in a dark suit and open-collar white shirt.",
    page: { src: "/people/caleb-free.jpg", width: 720, height: 900 },
    square: { src: "/people/caleb-free-square.jpg", width: 1200, height: 1200 },
    og: "/people/caleb-free-og.jpg",
  },

  published: "2026-09-10",
  updated: "2026-09-10",
};

export default calebFree;
