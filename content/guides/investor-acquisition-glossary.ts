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
    "Plain meanings of the words in 506(c) investor acquisition. It covers accredited investor and general solicitation. It also covers speed to lead, set-to-held rate and cost per appointment held.",
  eyebrow: "Reference · Glossary",
  published: "2026-09-09",
  updated: "2026-10-09",
  answer:
    "Investor acquisition means finding accredited investors for a private real estate offering. Then you get each one into a meeting with the sponsor. The work ends when that meeting is held. Under Regulation D, ads for this are lawful only in Rule 506(c) and Regulation A+ offerings. The terms below come in three kinds. Some are legal words a sponsor's counsel uses. Some are marketing words a media vendor uses. The rest are response numbers. Ascent reports them to each sponsor each week. They are speed to first human touch, contact rate, set-to-held rate and cost per appointment held.",
  takeaways: [
    "We sum up the legal terms the way the SEC publishes them. They help you get your bearings. They are not legal advice.",
    "Ascent's own metrics are defined just as Ascent reports them. The definition is the whole point.",
    "\"Appointment held,\" never booked or set. \"Investor lead,\" never prospect. \"Flat monthly fee,\" never a share of anything.",
  ],
  sections: [
    {
      id: "regulatory",
      h2: "Legal terms",
      blocks: [
        ...term("Accredited investor", "A person or entity that meets the tests in Rule 501(a) of Regulation D. For a natural person, the common tests look at income or net worth. Income must be above $200,000 in each of the last two years. Joint income must be above $300,000. Or net worth must be above $1,000,000, not counting the primary residence. Since 2020, holders of the Series 7, 65 or 82 licenses count too. Entities have their own tests. One is more than $5,000,000 in investments."),
        ...term("Regulation D", "The SEC's set of rules under the Securities Act. They let some private offerings skip registration. Rule 506 is the exemption used most. It has two paragraphs. Almost every real estate syndication raises money under one of them. So does almost every private real estate fund."),
        ...term("Rule 506(b)", "The Regulation D exemption that bans general solicitation. Any number of accredited investors may buy. So may up to 35 others. They are not accredited, but they must be sophisticated. The issuer must reasonably believe each buyer is accredited. That belief is usually based on self-certification. Buyers come from pre-existing relationships."),
        ...term("Rule 506(c)", "The Regulation D exemption that allows general solicitation. The JOBS Act made it in 2013. Each buyer must be an accredited investor. The issuer must take reasonable steps to verify that status. It is the only Rule 506 path where paid investor acquisition is lawful."),
        ...term("General solicitation", "Offering or advertising securities to the public. Paid ads count. So do a public offering page, social media, mass email and public events. Rule 506(b) bans it. Rule 506(c) allows it. The way you reach people does not matter. Telling strangers about an open offering is solicitation."),
        ...term("Reasonable steps to verify", "The 506(c) standard for checking that a buyer is accredited. It is based on principles. It names four safe harbors. Other ways can work too, since the four are non-exclusive. They are income documents, net-worth documents, third-party confirmation and grandfathered investors. In March 2025, an SEC staff no-action letter added a minimum-investment approach. It is set at $200,000 for natural persons and $1,000,000 for entities."),
        ...term("Form D", "The notice an issuer files with the SEC. It is due within 15 days of the first sale in a Regulation D offering. It names the exemption used. It shows the amount offered and sold. It shows the minimum investment. It lists any sales compensation paid. Anyone can see it on EDGAR."),
        ...term("Regulation A+", "An exemption for public offerings of up to $75 million (Tier 2). The SEC must qualify the offering statement. People who are not accredited can invest too, within limits. It allows general solicitation. Paid investor acquisition can serve two structures. Rule 506(c) is one. Regulation A+ is the other."),
        ...term("Broker-dealer", "A person engaged in the business of effecting transactions in securities for others. This person must register under Section 15(a) of the Exchange Act. The clearest sign of broker work is transaction-based compensation. That means a fee tied to capital raised."),
        ...term("Placement agent", "A registered broker-dealer an issuer hires to find and solicit investors. It is paid a share of the capital raised. The share is often quoted at several percent. In private real estate it is 6 to 8%. It is lawful because it is registered. It is priced to match."),
        ...term("Finder", "An unregistered person paid to introduce investors. Say the fee depends on the money raised. Then the SEC generally treats the finder as an unregistered broker. A 2020 proposal would have exempted some finders. It was never adopted."),
        ...term("Transaction-based compensation", "Any fee that depends on whether capital is raised, or how much. It also covers a fee tied to how many investors are introduced. Or one tied to how many subscriptions close. A flat fee for a defined service has none of this. That keeps a marketing vendor on the vendor side of the broker line."),
        ...term("Rule 3a4-1", "An Exchange Act safe harbor. It covers certain associated persons of an issuer. These are employees or officers who are not paid commissions. They must also meet the rule's other conditions. They may take part in selling the issuer's securities. If so, they are deemed not to be brokers."),
        ...term("Bad-actor disqualification", "Rule 506(d). A disqualifying event can mean the issuer cannot use Rule 506. Such events include certain convictions, orders or bars. The event must involve the issuer or a covered person. Covered persons include anyone paid to solicit investors."),
        ...term("Sponsor / issuer / general partner", "The party that sets up the offering and sells the securities. On this site, sponsor means the operating business. Issuer means the entity that sells the securities. The investors are always the sponsor's. They never belong to a vendor."),
        ...term("Syndication", "A real estate offering of one asset or a small portfolio. The sponsor raises equity from a group of investors for one deal. Each syndication is its own offering. So the investor list must be built again each time. That is, unless the sponsor keeps the list and works it."),
        ...term("Evergreen fund", "A fund that raises and invests money all the time. It does not close on a fixed date. It is always open. This is the structure where a standing investor acquisition system is worth the most."),
      ],
    },
    {
      id: "marketing",
      h2: "Marketing and lead response terms",
      blocks: [
        ...term("Investor acquisition", "Getting investor leads for a 506(c) or Reg A+ offering. Then you work each lead until a meeting with the sponsor is actually held. Media, response and appointment setting run as one system. It is reported as cost per appointment held."),
        ...term("Investor lead", "A person who answered the sponsor's ads and asked to hear more. They filled in a form and agreed to be contacted. Ascent never uses the word prospect for an inbound lead. Ascent never calls anyone who did not ask."),
        ...term("Cost per investor lead", "Media spend divided by the number of investor leads in the period. Published category benchmarks put it at $50 to $100 on Meta. On LinkedIn, they put it at about five times that. Agencies report this number. They do so because it is the number they control."),
        ...term("Speed to lead", "The time from a lead's form to the first outbound try by a live person. Ascent reports the median in minutes. It calls this speed to first human touch."),
        ...term("First touch / first human touch", "Two events, each with its own time stamp. The first is the instant automatic reply (text and email). The second is the first try by a person. A CRM with only one field will report the auto-reply and call it speed."),
        ...term("Contact rate", "The share of leads who had a connected conversation. That means a live voice, not a voicemail. Ascent reports it in buckets by response time. The buckets are under five minutes, five to sixty minutes, one to twenty-four hours, and later."),
        ...term("Appointment set / booked", "A meeting placed on the sponsor's calendar. Any vendor can inflate this count. That is why Ascent never manages to this number."),
        ...term("Appointment held", "A booked meeting that took place. The investor showed up and the sponsor made the case. It is the unit of Ascent's reporting. It is also the unit of every written minimum in a proposal."),
        ...term("Set-to-held rate", "Of the meetings booked, the share that were held. This number shows the no-shows. A confirmation the day before moves it. So do reschedules and nurture between touches."),
        ...term("Cost per appointment held", "Media spend divided by appointments held in the period. It counts media only, unless a report says fully loaded. Booking meetings nobody attends cannot inflate it. That is why it is Ascent's main metric."),
        ...term("Fully loaded", "A cost-per figure that counts the vendor's fee as well as media. Compare it across vendors only when both figures are labeled the same way."),
        ...term("Setter / appointment setter", "A live person who is recruited, scripted and supervised. They call inbound investor leads as the sponsor. The call comes from a number registered to the sponsor. They check that the lead asked to hear from the sponsor. Then they get a meeting onto the calendar. They handle logistics only, never the offering. Each call is recorded."),
        ...term("Compliance gate", "The written conditions that must be met before anything goes live or anyone dials. The exemption is confirmed. An approver at counsel is named. Every legend and script is approved. On an Ascent engagement, the gate has nine conditions and one review deadline."),
        ...term("Legend", "Required disclosure text on an offering communication. Counsel sets the words for an ad, a landing page or an email. They are used word for word."),
        ...term("Flat monthly fee", "A fixed fee for a defined service. It scales with media under management. Nothing in it is tied to capital raised, investors brought in or appointments held. This fee model lets a marketing vendor stay a vendor."),
        ...term("Media under management", "The monthly ad spend a firm runs for the sponsor. The sponsor pays it to the platform, on the sponsor's own account. The vendor never holds, advances or marks up this money."),
      ],
    },
  ],
  faq: [
    {
      q: "How is a set appointment different from a held one?",
      a: "A set (or booked) appointment is a calendar entry. A held appointment is one that took place. Ascent reports and guarantees held appointments. That is because meetings nobody attends can inflate a booked count.",
    },
    {
      q: "What is investor acquisition?",
      a: "It means getting accredited-investor leads for a 506(c) or Reg A+ offering. Then you work those leads until a meeting with the sponsor is actually held. The work is response, nurture, setting and confirmation. It is reported as cost per appointment held.",
    },
    {
      q: "Why does Ascent say investor lead and not prospect?",
      a: "Because the words say what happened. A person answered the sponsor's ads and asked to hear more. Ascent's setters call only those inbound leads. They never call from a list. They never call anyone who did not ask.",
    },
  ],
  sources: [
    { label: "U.S. Securities and Exchange Commission: Regulation D (17 CFR 230.500 to 230.508) and Rule 3a4-1 (17 CFR 240.3a4-1)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174" },
    { label: "SEC: Guide to Broker-Dealer Registration", url: "https://www.sec.gov/about/reports-publications/investor-publications/guide-broker-dealer-registration" },
    { label: "GowerCrowd: published 506(c) marketing benchmarks for real estate sponsors", url: "https://gowercrowd.com" },
    { label: "Ascent metrics ontology: how Ascent defines first touch, first human touch, contact rate, set-to-held rate and cost per appointment held", url: null },
  ],
  image: {
    src: "/guide-images/investor-acquisition-glossary.jpg",
    alt: "A hand writes notes with a pen on printed pages. A laptop and a coffee cup sit nearby.",
    credit: "Green Chameleon via StockSnap, CC0",
  },
  related: [
    "506b-vs-506c-real-estate-marketing",
    "speed-to-lead-investor-acquisition",
    "cost-per-investor-lead-506c-benchmarks",
  ],
};

export default guide;
