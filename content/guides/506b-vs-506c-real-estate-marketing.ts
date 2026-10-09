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
    "How Rule 506(b) and 506(c) differ for a real estate deal or fund. Learn what counts as general solicitation and who can invest. See what it means to verify, and how to switch.",
  eyebrow: "Regulation D · Real estate",
  published: "2026-09-09",
  updated: "2026-10-09",
  answer:
    "Rule 506(b) and Rule 506(c) are two SEC rules. Each one lets a real estate sponsor raise money in private. Under Rule 506(b), you cannot advertise the deal at all. Your investors come from ties you already have. Up to 35 of them may be non-accredited. An accredited investor meets SEC tests, such as for income or net worth. Under Rule 506(c), you may advertise to the public. You can use paid ads and a public website. You can use social media and podcasts. But each buyer must be an accredited investor. You must also take reasonable steps to verify that. You can't just take the buyer's word for it. That is called a self-certification. Both rules are exemptions under Regulation D of the Securities Act. Regulation D is the SEC's set of rules for private deals. Both rules let you raise as much as you want. Both need a Form D filing within 15 days of the first sale. Form D is a short notice you file with the SEC. For marketing, the line is clear. Paid investor acquisition is only possible under 506(c).",
  takeaways: [
    "506(b): no general solicitation. That means no public ads or pitches for the deal. You can take any number of accredited investors. You can also take up to 35 who are not accredited. They must be sophisticated. Most investors fill out a form to vouch for their own status.",
    "506(c): general solicitation is allowed. Only accredited investors may buy. The issuer must take reasonable steps to verify their status. A form alone is not enough.",
    "General solicitation includes paid ads and a public deal page. It includes social posts about the deal. It also includes mass email to strangers. Talking about the deal at public events counts too.",
    "Both rules have you file Form D within 15 days of the first sale. Both fall under the Rule 506(d) bad-actor rule. That rule can disqualify a deal. Both make restricted securities.",
    "SEC staff guidance has let a 506(b) deal switch to 506(c). It allows this if no general solicitation has happened yet. You can't go the other way once you have run ads.",
    "Each vendor that runs paid investor acquisition works only on 506(c) or Regulation A+ deals. So does Ascent. Regulation A+ is a separate SEC path for raising money from the public. No vendor can make ads legal under 506(b).",
  ],
  sections: [
    {
      id: "what-they-share",
      h2: "What the two rules have in common",
      blocks: [
        {
          type: "p",
          text: "Rule 506 is the workhorse exemption of Regulation D. An exemption lets you sell securities without first registering them with the SEC. The SEC's own Regulation D numbers show how big it is. Each year, it carries the large majority of private capital raised in the United States. Almost all real estate syndications use one of its two paragraphs. In a syndication, a sponsor pools money from investors to buy property. So do almost all private real estate funds. Whichever one a sponsor picks:",
        },
        {
          type: "ul",
          items: [
            "There is **no cap on how much you can raise**.",
            "The securities are **restricted**. Investors can't freely sell them to others.",
            "The issuer files a **Form D** with the SEC within 15 days of the first sale. The issuer is the entity that sells the securities. It also makes the state notice filings that counsel names. These are called blue-sky filings. Rule 506 securities are \"covered securities.\" So a state may ask for a notice and a fee. But a state may not do its own merit review.",
            "The **bad-actor rule (506(d))** applies. A disqualifying event can cost you the exemption. That is true if the event involves the issuer or a covered person. Anyone paid to solicit investors is a covered person.",
            "The deal is made under **offering documents**. These are a private placement memo, a subscription agreement and an operating agreement. They are prepared under securities counsel. That is the lawyer who handles the legal side of your deal.",
          ],
        },
        {
          type: "p",
          text: "The whole difference comes down to two things. One is how a sponsor may find investors. The other is what the sponsor must know about them.",
        },
      ],
    },
    {
      id: "506b",
      h2: "Rule 506(b): relationships only",
      blocks: [
        {
          type: "p",
          text: "506(b) is the older, quieter path. The issuer may sell to any number of accredited investors. It may also sell to up to 35 who are not accredited. But those people must be sophisticated. That means they can judge the deal's merits and risks. They can do it alone or with a purchaser representative. They must also get the disclosure the rule calls for. The price of that freedom is a ban on **general solicitation and general advertising**. In plain words, you can't pitch the deal to the public.",
        },
        {
          type: "p",
          text: "In practice, investors come from **pre-existing, substantive relationships**. These are people the sponsor knows well. The sponsor knows enough to have a view on their finances and their sophistication. And the sponsor has that view before the deal comes up. The SEC staff has said a registered broker-dealer can form that tie for the issuer. A broker-dealer is a firm licensed to sell securities. A registered investment adviser can form it too. The staff has also said a tie formed before the deal starts can count. That is true even if it was formed online. But what about a stranger who clicks an ad and fills out a form? The staff has not said that person has one.",
        },
        {
          type: "callout",
          title: "What a 506(b) sponsor can still market",
          text: "The brand, not the deal. A sponsor raising under 506(b) can still build an audience. It can use a newsletter or a podcast. It can post content that teaches, or a track-record page. That is fine as long as none of it offers the securities being sold. None of it can describe them, either. Many sponsors use that audience to build ties. Later they raise money from those people. But once the content describes a specific open deal, it is a solicitation.",
        },
      ],
    },
    {
      id: "506c",
      h2: "Rule 506(c): advertise, but verify",
      blocks: [
        {
          type: "p",
          text: "The JOBS Act created 506(c). It took effect in September 2013. It lets an issuer solicit the general public. That can mean paid media, a public deal page or social media. It can also mean webinars, podcasts or direct mail. Two things must be true. First, **every buyer must be an accredited investor**. Second, the issuer must take **reasonable steps to verify** that status. Investors who are not accredited can't buy at all. That holds even if they are sophisticated.",
        },
        {
          type: "p",
          text: "Verifying is the part that changes how a sponsor works. Under 506(b), the investor most often checks a box on a form. That form is the usual basis for the issuer's reasonable belief. Under 506(c), that is not enough on its own. The rule gives you safe harbors. These are set ways to verify, but they are not the only ways. You can look at two years of tax forms to check income. To check net worth, you can look at recent bank and brokerage statements. You also pull a credit report. Or you can get a written confirmation from a pro. It can come from a registered broker-dealer or an SEC-registered investment adviser. It can also come from a licensed attorney or a CPA. Behind the safe harbors sits a principles-based standard. In March 2025 the SEC staff put out a no-action letter. It says a high minimum investment can count as reasonable steps in itself. It must come with specific written representations. The minimum is $200,000 for a natural person. It is $1,000,000 for an entity. The details are in [the verification guide](/guides/accredited-investor-verification-506c).",
        },
        {
          type: "p",
          text: "The other change is that the whole raise goes public. Each ad, landing page and email is a securities communication. The anti-fraud rules of the securities laws apply to all of it. So serious 506(c) sponsors show counsel each ad and post before it goes live. And a marketing vendor on a raise needs a written sign-off process. A style guide is not enough.",
        },
      ],
    },
    {
      id: "general-solicitation",
      h2: "What counts as general solicitation",
      blocks: [
        {
          type: "p",
          text: "Regulation D does not define the term with a list. The SEC's Rule 502(c) gives examples. Decades of staff guidance fill in the rest. Here is a list for a real estate sponsor. Each item is general solicitation if it describes or offers a specific deal:",
        },
        {
          type: "ul",
          items: [
            "Paid ads on LinkedIn, Meta, Google or YouTube. Ads on any other site count too.",
            "A public web page about the deal. A deal page counts too, unless a login limits it to people you already have a relationship with.",
            "Social posts, newsletters or podcast segments that name the deal.",
            "Mass email or direct mail to strangers. Here that means people the sponsor has no substantive tie with.",
            "Pitching the deal at a seminar, conference or webinar. This counts if the event is open to the public.",
            "Press releases or media interviews that lay out the deal's terms.",
          ],
        },
        {
          type: "p",
          text: "A common mistake is to think the medium matters. It does not. Say a sponsor is at a meetup. The sponsor describes an open 506(b) deal to a room of strangers. That sponsor has solicited generally. Now say a sponsor runs paid ads for a webinar. The webinar only teaches and never mentions a deal. That sponsor may not have. Counsel draws that line for each sponsor. Then the marketing team does its job. It makes sure nothing crosses that line until counsel has seen it.",
        },
      ],
    },
    {
      id: "side-by-side",
      h2: "Side by side",
      blocks: [
        {
          type: "table",
          caption: "How Rule 506(b) and Rule 506(c) compare for a sponsor's marketing.",
          head: ["", "Rule 506(b)", "Rule 506(c)"],
          rows: [
            ["General solicitation", "Not allowed", "Allowed"],
            ["Who may invest", "Accredited investors. Also up to 35 sophisticated people who are not accredited.", "Accredited investors only"],
            ["Accredited status", "The issuer's reasonable belief. Most investors just check a box.", "The issuer must take reasonable steps to verify"],
            ["Deal size", "No limit", "No limit"],
            ["Form D", "Within 15 days of first sale", "Within 15 days of first sale. The 506(c) box is checked."],
            ["Bad-actor disqualification", "Applies", "Applies"],
            ["Disclosure to investors who are not accredited", "Required if any take part", "Does not apply. None may take part."],
            ["Paid investor acquisition", "Not possible for the deal itself", "The reason the rule exists"],
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
          text: "Sponsors often start under 506(b) because they know it. Then, partway through the raise, they run out of people in their own network. SEC staff guidance speaks to this. You can find it in the staff's Securities Act Rules Compliance and Disclosure Interpretations. Say an issuer began a deal under 506(b). That guidance has let it go on under 506(c). Two things must be true. First, no general solicitation can have been used up to that point. Second, all sales after the switch must meet the 506(c) rules. That means you must verify each buyer from then on. The issuer amends its Form D to show the change. You can't go the other way. Once a deal has been generally solicited, it can't become a 506(b) deal.",
        },
        {
          type: "p",
          text: "This means two things in practice. First, say a sponsor may ever want to advertise a raise. The cleanest path is to set it up as 506(c) from the start. Then verify each investor, starting with the first check that comes in. That includes friends and family. Second, the switch is a call for counsel, and it comes with a filing. A marketing vendor can't make it for the sponsor. And no vendor should launch ads before it is made.",
        },
      ],
    },
    {
      id: "what-it-means-for-marketing",
      h2: "What it means for investor acquisition",
      blocks: [
        {
          type: "quote",
          text: "No investor acquisition vendor can make ads legal under 506(b). Paid investor acquisition exists only under 506(c).",
        },
        {
          type: "p",
          text: "That is why Ascent's screening asks about the exemption first. A 506(b) sponsor is turned away. Ascent does not sell that sponsor something close to it instead. For a sponsor already under 506(c), the rule shapes the whole system. The ads are written to fit what counsel has approved. The landing page carries the legends counsel names, word for word. Legends are required legal notices. The messages that reply to a new lead are a securities communication. Then an appointment setter calls the investor lead back. A setter is the caller who sets up the first meeting. The setter's script covers logistics only. The setter checks that the lead asked to hear from the sponsor. Then the setter puts a meeting on the calendar. The setter never talks about the deal's returns, terms or merits. Verifying accredited status stays with the issuer. That never changes. [See how the whole lane runs](/#process) on the main page.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can a sponsor run Facebook or LinkedIn ads for a 506(b) real estate deal?",
      a: "No. Paid ads that describe or offer the securities are general solicitation. Rule 506(b) bans it. A 506(b) sponsor can advertise its brand and content that teaches. It can't advertise the deal.",
    },
    {
      q: "Can investors who are not accredited buy into a 506(c) deal?",
      a: "No. Each buyer in a Rule 506(c) deal must be an accredited investor. The issuer must also take reasonable steps to verify that status.",
    },
    {
      q: "Does a 506(c) sponsor have to verify friends and family too?",
      a: "Yes. The duty to verify applies to each buyer in a 506(c) deal. It does not matter how well the sponsor knows them.",
    },
    {
      q: "Under 506(c), is it enough for investors to vouch for themselves on a form?",
      a: "On its own, no. The SEC has said that checking a box is not reasonable steps to verify. Counsel picks a method. It could be one of the safe harbors. It could be an outside firm that verifies. It could also be the minimum investment path in the SEC staff's March 2025 no-action letter.",
    },
    {
      q: "Can a deal switch from 506(b) to 506(c) after it starts?",
      a: "SEC staff guidance has allowed it if two things are true. No general solicitation has happened yet. And each buyer after the switch is verified as accredited. The Form D is amended. The switch is a call for the issuer's securities counsel.",
    },
    {
      q: "Does Ascent work with 506(b) sponsors?",
      a: "No. Ascent runs paid investor acquisition. That is only lawful under Rule 506(c) or Regulation A+. Say you plan a 506(c) filing within the next ninety days. You can book a scoping call before you file.",
    },
  ],
  sources: [
    { label: "U.S. Securities and Exchange Commission: Regulation D, Rules 501, 502, 506 (17 CFR 230.501 to 230.506)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174/section-230.506" },
    { label: "SEC: Securities Act Rules, Compliance and Disclosure Interpretations, Section 256 (Rule 506)", url: "https://www.sec.gov/rules-regulations/staff-guidance/compliance-disclosure-interpretations/securities-act-rules" },
    { label: "SEC: Form D and filing requirements", url: "https://www.sec.gov/resources-small-businesses/exempt-offerings/frequently-asked-questions-about-form-d" },
    { label: "SEC Division of Corporation Finance: no-action letter to Latham & Watkins LLP on Rule 506(c) verification, March 12, 2025", url: "https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-no-action-letters" },
    { label: "SEC Division of Economic and Risk Analysis: Regulation D offerings statistics", url: "https://www.sec.gov/dera" },
  ],
  image: {
    src: "/guide-images/506b-vs-506c-real-estate-marketing.jpg",
    alt: "Granite columns with long grooves. They stand on the front of a building that looks like a courthouse.",
    credit: "The Building Envelope via StockSnap, CC0",
  },
  related: [
    "accredited-investor-verification-506c",
    "how-to-find-accredited-investors-real-estate-syndication",
    "placement-agent-vs-flat-fee-investor-acquisition",
  ],
};

export default guide;
