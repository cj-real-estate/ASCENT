import type { Guide } from "./types";

/*
 * The alternatives a sponsor is choosing between, compared structurally —
 * fee model, who owns the investor, and where the broker line sits. Never
 * a claim that one outperforms another, and never a named competitor.
 */
const guide: Guide = {
  slug: "placement-agent-vs-flat-fee-investor-acquisition",
  title: "Placement agent, finder, in-house IR or flat-fee investor acquisition: how sponsors pay to fill a raise",
  seoTitle: "Placement Agent vs. Flat Fee: How Sponsors Pay for Investors",
  description:
    "A real estate sponsor has four ways to pay to find investors. They are a placement agent, a finder, an in-house hire and a flat-fee firm. Here is how they compare. We look at cost. We look at who owns the investor. We also look at the broker-dealer line.",
  eyebrow: "Fee models · Compliance",
  published: "2026-09-09",
  updated: "2026-10-09",
  answer:
    "A real estate sponsor can pay for investors in four ways. First is a registered placement agent or broker-dealer. That is a firm registered to sell securities. It takes a share of the money raised. People often quote several percent. In private real estate it is often 6 to 8 percent. And the agent often keeps the tie to the investor. Second is an unregistered finder paid the same way. The SEC most often sees that finder as an unregistered broker. That puts you at risk, not just the finder. Third is your own investor relations hire. That is a fixed salary. It often runs $90,000 to $140,000 a year fully loaded. That counts benefits and overhead. You pay it whether or not a raise is open. Fourth is a flat-fee investor acquisition firm. It charges a monthly fee. The fee pays for ads, lead response and appointment setting. None of it is tied to the money raised. So you keep the equity. You own the investor list, too. Price is only part of the gap. The rest is who owns the investor. And it is which side of the broker-dealer line the vendor is on.",
  takeaways: [
    "Transaction-based compensation is a fee tied to money raised or investors brought in. It is the classic sign of a broker. That comes from Section 15(a) of the Exchange Act. Only registered broker-dealers may take it under the law.",
    "An unregistered finder can put you at risk. Investors may get rescission rights. That is a right to undo the deal. There can be Form D disclosure issues. And the exemption itself can come into doubt.",
    "Placement agents are registered, and they charge for it. On a $10 million raise, 6 to 8% is $600,000 to $800,000. That comes out of the equity. It does not come out of the marketing budget.",
    "An in-house IR hire is a fixed cost. (IR stands for investor relations.) It does not shrink between raises. And you still buy the ads. You still build the compliance workflow, too.",
    "A flat monthly fee keeps a marketing vendor on the right side of the line. The investor list stays with you. And as volume goes up, the fully loaded cost per appointment held goes down.",
    "Rule 3a4-1 offers a safe harbor. It covers the issuer's own associated persons. They must sell without pay based on commissions. Counsel sometimes likes this setup for the person who makes the calls.",
  ],
  sections: [
    {
      id: "the-line",
      h2: "The line you hold each option up to",
      blocks: [
        {
          type: "p",
          text: "Section 15(a) of the Securities Exchange Act of 1934 is about brokers. Here is how the law defines a broker. It is any person engaged in the business of effecting transactions in securities for the account of others. Put simply, it is someone whose job is making securities deals for others. Section 15(a) says a broker must register. It is against the law to do this work without it. The law gives no checklist for \"engaged in the business.\" But the SEC and the courts look at the same things. Does the person solicit investors? Do they take part in deal talks? Do they give advice on the merits? Do they handle the funds? Above all, how are they paid? Do they get **transaction-based compensation**? That is a fee that depends on whether money is raised. Or it depends on how much.",
        },
        {
          type: "p",
          text: "That last factor matters most. It is the one you cannot argue around. Say a person gets a cut of what investors put in. That person has a salesman's stake in the result. The SEC has seen that stake as the clearest sign of a broker. It has done so time after time. Now take a person paid a flat fee for a set job. They never talk about the deal. They never touch the money. That person has a much better claim to be a vendor and not a broker.",
        },
        {
          type: "callout",
          title: "Why you should care if your vendor is registered",
          text: "Say an unregistered broker is in the chain. The harm does not stop with the vendor. Some investors may have bought through that broker. In some states, they may have rescission rights. That is a right to undo the deal. The setup must be disclosed on Form D. And a paid solicitor might have a bad-actor event. That can cost the issuer its Rule 506 exemption. A marketing failure costs a media budget. A compliance failure can attach to the whole raise.",
        },
      ],
    },
    {
      id: "placement-agent",
      h2: "Placement agents and broker-dealers",
      blocks: [
        {
          type: "p",
          text: "A placement agent is a registered broker-dealer. Or it is a person associated with one. The issuer hires the agent to find and solicit investors. (The issuer is the company selling the deal.) The agent may take a success fee under the law. That is a fee based on what it raises. It can do this because it is registered and supervised. It must also follow FINRA rules. FINRA is the group that oversees broker-dealers. The fee is disclosed in the deal papers. It is also disclosed on Form D. For private real estate, quotes run to several percent of the money raised. The published industry range is 6 to 8%. On a $10 million raise, that is $600,000 to $800,000. It is most often set up as a cost of the offering. So the equity pays it. The sponsor's own budget does not.",
        },
        {
          type: "p",
          text: "Placement agents fill a real need. They serve larger sponsors who deal with big funds and firms. Their investors are often institutions and family offices. They are less often single accredited investors found through ads. (An accredited investor is a person who meets the SEC's income or net worth test.) Say you raise from single people. Then there are trade-offs. One is the price. Another is the smallest raise an agent will take on. The last is whose investor it is when the raise is done. The agent's ties to its investors are the agent's to keep.",
        },
      ],
    },
    {
      id: "finders",
      h2: "Finders",
      blocks: [
        {
          type: "p",
          text: "A \"finder\" is an unregistered person. They bring investors to an issuer for a fee. Many in real estate think a finder may take a cut of the raise. They think it is fine if the finder only makes intros. The SEC's view does not back that up. In 2020 the SEC put forward an exemption for certain finders. It came with conditions. It was for finders who raise money from accredited investors. The money had to be for private firms. It was never adopted. Over the years, SEC staff have sent no-action letters. A few let very narrow finder setups go ahead. Most said no. The general rule still stands. Say a person is paid transaction-based compensation to solicit investors. That person is acting as a broker. They must be registered. Or they must be associated with a registered broker-dealer.",
        },
        {
          type: "p",
          text: "Here is what that means for you. Say any kind of vendor wants a cut of the raise. It could be a marketing agency or a consultant. It could be a friend with a network. Ask where they are registered. If the answer is nowhere, the risk is yours as much as theirs.",
        },
      ],
    },
    {
      id: "in-house",
      h2: "Hiring your own IR person",
      blocks: [
        {
          type: "p",
          text: "Many sponsors fix the response problem by hiring for it. They hire an investor relations manager or associate. That person calls leads and runs follow-up. They also keep the investor list. Published ranges for the job run about $90,000 to $140,000 a year. That is fully loaded, with benefits and overhead. The cost is fixed. You pay it whether a raise is open this quarter or not. And the hire does not fix the rest of the system. You still buy and run the ads. You still build the compliance approval workflow. You still set up the CRM and the phones. (A CRM is the software that tracks your leads.) And you still write the scripts and oversee the calls. Some sponsors have a fund program that raises all the time. For them, an in-house hire can be the right long-term answer. And a well-run outside team hands over a written process. The new hire can then take it on.",
        },
        {
          type: "p",
          text: "Counsel sometimes raises one point about how this is set up. Rule 3a4-1 gives a safe harbor from broker registration. A safe harbor is a set of conditions. If you meet them, you are clear of the rule. Take an employee of the issuer who sells its securities. They can rely on it, but they must meet its conditions. Here is one. They are not compensated by commissions or other transaction-based pay. They must also do one of two things. They can limit their work in the ways the rule describes. Or they can do substantial other duties for the issuer. That is one reason you should never pay your own people a cut of what they raise, either.",
        },
      ],
    },
    {
      id: "flat-fee",
      h2: "Flat-fee investor acquisition",
      blocks: [
        {
          type: "p",
          text: "The fourth model is a firm that runs the ads. It also runs lead response and appointment setting. It charges a **flat monthly fee**. No part is tied to money raised, investors won or appointments held. That is true at any level of results. The fee scales with the ad spend it manages. It is a running cost, not a slice of the deal. You keep 100% of what is raised. And all that gets built is registered to you. It stays with you. That means the CRM and the phone number. It means the recordings and the investor list, too.",
        },
        {
          type: "p",
          text: "There is a compliance reason for this model, as well as a business one. Picture a vendor on a flat fee. It never talks about the deal. It never handles funds. It never checks accredited status. It never gives advice. By design, that vendor sits on the vendor side of the broker line. The contract can spell this out in an express clause. The clause says: no transaction-based compensation. That is also the term that lets securities counsel sign off. Your securities lawyer can approve the setup as it is, with no redraft. The limit is just as built in. A flat-fee firm cannot promise capital. What can it put in writing? A minimum number of investor appointments held. It can also put a fix in writing, called a remedy. Ascent's remedy is to keep working at no fee until it hits the minimum.",
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
          caption: "Four ways to pay for investors. The ranges are published industry figures, not quotes. Ascent gives its fee in writing after a scoping call.",
          head: ["", "Placement agent", "Unregistered finder", "In-house IR hire", "Flat-fee acquisition"],
          rows: [
            ["Fee basis", "% of money raised (often 6 to 8%)", "% of money raised", "Salary, about $90K to $140K fully loaded", "Flat monthly fee"],
            ["Paid from", "Offering proceeds (equity)", "Offering proceeds", "Operating budget", "Operating budget"],
            ["Registration", "Registered broker-dealer", "None. That is the problem.", "Issuer's employee (Rule 3a4-1 may apply)", "Not required. No broker activity."],
            ["Scales with", "Money raised", "Money raised", "Nothing. It is fixed.", "Media under management"],
            ["Owns the investor relationship", "Often the agent", "Unclear", "The sponsor", "The sponsor"],
            ["Covers media, response and setting", "Rarely", "No", "Response only", "All three"],
            ["Can promise capital", "No", "No", "No", "No. Appointments held, in writing."],
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
          text: "Are you raising money from institutions at scale? Then talk to a placement agent. Does your fund program raise all the time? Do you have a proven lead flow? Then you may be ready for an in-house hire. Now say you raise from single accredited investors under Rule 506(c). That rule lets you advertise a private raise. But every buyer must be accredited. And you must take reasonable steps to check. Say you also have counsel engaged. And your ad budget is $15,000 a month or more. A flat-fee investor acquisition firm is built for that sponsor. The [fit check on Ascent's main page](/#book) will tell you if you fit. It will also tell you if you don't. Whatever you choose, there is one term to never sign with a marketing vendor. It is a fee tied to money raised.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can a marketing agency take a cut of the money raised?",
      a: "Not under the law, unless it is a registered broker-dealer. Transaction-based compensation is pay tied to the money raised. Say it is paid for soliciting investors. Then it is the clearest sign of a broker. That comes from Section 15(a) of the Exchange Act. Say an unregistered vendor takes it. That is a risk for the sponsor. It is a risk for the vendor, too.",
    },
    {
      q: "What does a placement agent charge for a real estate raise?",
      a: "For private real estate, published ranges run to several percent of what is raised. A common figure is 6 to 8%. On a $10 million raise, that is $600,000 to $800,000. It is most often treated as an offering cost. That means the equity pays it.",
    },
    {
      q: "Is a finder's fee legal for bringing in investors?",
      a: "Most of the time, no. Not for an unregistered person paid on money raised. The SEC put forward a limited finder exemption in 2020. It never adopted it. SEC staff no-action letters have let some very narrow setups go ahead. Most setups are not allowed. Counsel should look at any finder offer before it is signed.",
    },
    {
      q: "Is Ascent a broker-dealer, finder or placement agent?",
      a: "No. Ascent is a vendor paid a flat monthly fee. It does marketing and lead response. It also sets appointments and reports. Its contract has an express clause: no transaction-based compensation. Ascent never talks about the offering. It never handles funds. It never checks accredited status. It never gives advice on what to invest in.",
    },
    {
      q: "A flat-fee firm can't guarantee capital. So what can it guarantee?",
      a: "It can guarantee a minimum number of investor appointments held. That is for a set span of time. The number is put in writing. It is based on your ad budget and past results. If the firm misses it, there is a remedy. Ascent's is to keep working at no fee until it hits the minimum. No result about money raised is promised anywhere.",
    },
  ],
  sources: [
    { label: "Securities Exchange Act of 1934, Section 15(a): registration of brokers and dealers", url: "https://www.law.cornell.edu/uscode/text/15/78o" },
    { label: "SEC, Guide to Broker-Dealer Registration. See the part on finders and on transaction-based compensation.", url: "https://www.sec.gov/about/reports-publications/investor-publications/guide-broker-dealer-registration" },
    { label: "SEC, proposed exemptive order for certain finders, Release No. 34-90112 (October 2020), not adopted", url: "https://www.sec.gov/newsroom/press-releases/2020-248" },
    { label: "Exchange Act Rule 3a4-1: associated persons of an issuer deemed not to be brokers (17 CFR 240.3a4-1)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.3a4-1" },
    { label: "SEC, Regulation D: Rule 506(d) bad-actor rule, and Form D Item 12 (sales compensation)", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e651a4c86c0174/section-230.506" },
    { label: "Published industry ranges for placement agent fees in private real estate. Also, ranges for fully loaded IR pay. Both as summed up in Ascent's business plan (September 2026).", url: null },
  ],
  image: {
    src: "/guide-images/placement-agent-vs-flat-fee-investor-acquisition.jpg",
    alt: "Two people shake hands across a desk. A notebook and a cup of coffee sit between them.",
    credit: "Kristin Hardwick via StockSnap, CC0",
  },
  related: [
    "cost-per-investor-lead-506c-benchmarks",
    "506b-vs-506c-real-estate-marketing",
    "accredited-investor-verification-506c",
  ],
};

export default guide;
