import type { Guide } from "./types";

/*
 * Speed-to-lead economics in investor acquisition — the business plan's
 * first named content piece. The response-time research is the 2011
 * Harvard Business Review study, cited as such; the four metrics are the
 * firm's own definitions from the metrics ontology.
 */
const guide: Guide = {
  slug: "speed-to-lead-investor-acquisition",
  title: "Speed to lead in investor acquisition: the four numbers that decide a 506(c) raise",
  seoTitle: "Speed to Lead in Investor Acquisition: The 4 Numbers That Matter",
  description:
    "The first few minutes after an investor lead comes in decide a raise. Here is what the research on response time says. Here are the four numbers to ask for each week: speed to first human touch, contact rate, set-to-held rate and cost per appointment held.",
  eyebrow: "Lead response · Investor acquisition",
  published: "2026-09-09",
  updated: "2026-10-09",
  answer:
    "An investor sends in a form. Speed to lead is the time until the first human reaches them. Outside the ads, it is the biggest lever a sponsor controls in investor acquisition. The study people cite most came out in 2011. It ran in Harvard Business Review and looked at 2,241 U.S. companies. Some firms reached out to a lead within an hour. Their odds of qualifying it were about seven times those of firms that waited even one hour more. The average company took 42 hours to respond. Real estate sponsors are often slower. Almost none of them measure it. Four numbers let you see it and manage it: speed to first human touch, contact rate by response bucket, set-to-held rate, and cost per appointment held.",
  takeaways: [
    "Harvard Business Review, 2011: the average company took 42 hours to reply to a lead. Some replied within an hour. Their odds of qualifying the lead were ~7× those of firms that waited one more hour. Their odds were ~60× those of firms that waited 24 hours or more. 23% of companies never replied at all.",
    "An autoresponder is not a response. A quick text and email is the bare minimum. What counts is the minutes until the first live human reaches out.",
    "Give first touch and first human touch their own timestamps. First touch is any reply, even one a system sends on its own. First human touch is the first try by a live person. A CRM is the system that holds your leads. If yours has just one field, it hides the problem.",
    "Contact rate is the share of leads you actually talk to. Sort it by how fast you replied: under 5 minutes, 5 to 60 minutes, 1 to 24 hours, and later. Then speed stops being an opinion. It becomes a budget call.",
    "A booked meeting is just a spot on a calendar. Only held meetings count. The set-to-held rate is the share of booked meetings that took place. It is the number that shows no-shows.",
    "Cost per appointment held is the one number no one can pad. It should be reported each week. It counts media spend only, unless the report marks it fully loaded.",
  ],
  sections: [
    {
      id: "what-it-is",
      h2: "What speed to lead means for a sponsor",
      blocks: [
        {
          type: "p",
          text: "An accredited investor sees a LinkedIn ad for a multifamily fund. (An accredited investor meets the SEC's test to put money in deals like this.) It is 8:40 on a Tuesday evening. They read the landing page and send in the form. For the next few minutes, and maybe the next hour, their mind is on the sponsor. After that they close the tab. The evening moves on. Maybe they think about it again later. By then the sponsor is one of several things they looked at that week.",
        },
        {
          type: "p",
          text: "Speed to lead is how the sponsor answers that window. It means the time until a person, not a system, reaches them. Most sponsors would have to say, \"the next business day, if someone remembers.\" Most can't say for sure. Nothing records it. The vendor who got the lead was done once the form came in. The sponsor's team is busy running the deal. The CRM sent an email. The investor never heard a human voice.",
        },
      ],
    },
    {
      id: "research",
      h2: "What the research on response time says",
      blocks: [
        {
          type: "p",
          text: "The study people cite most is called \"The Short Life of Online Sales Leads.\" It ran in Harvard Business Review in March 2011. The authors were James Oldroyd, Kristina McElheran and David Elkington. They sent a web lead to each of 2,241 U.S. companies. Then they timed the reply. The average reply took 42 hours. Only 37% replied within an hour. 16% took between one and 24 hours. 24% took more than 24 hours. 23% never replied at all. The authors also used data from a firm that sells sales software. Some firms tried to reach a lead within an hour. Their odds of qualifying it were nearly seven times those of firms that tried an hour later. To qualify a lead here means to reach the person who decides. It also means having a real talk. The fast firms' odds were more than sixty times those of firms that waited a day or more.",
        },
        {
          type: "p",
          text: "The study looked at business-to-business web leads in general. It did not look at real estate investors. It is also fifteen years old now. We cite it here for the shape of the curve. Every sponsor who has tracked their own response time has seen that same shape. A connected conversation is a live talk, not a voicemail. With each minute you wait, the odds of one drop fast. They keep dropping, and there is no flat spot to hide on.",
        },
        {
          type: "callout",
          title: "Why the curve is steeper for investors",
          text: "An investor lead is not shopping for something they can get anywhere. They are deciding whether to trust a stranger with $50,000 or more. How the sponsor handles their form is the first proof they see. It shows how well the sponsor runs things. A call back the next day loses the window. Worse, the investor takes it as evidence.",
        },
      ],
    },
    {
      id: "four-numbers",
      h2: "The four numbers",
      blocks: [
        {
          type: "p",
          text: "Ascent manages every sponsor lane to four numbers. It reports them each week, from the first full week live. Each one is defined here just as it is reported. The definitions are the point.",
        },
        { type: "h3", text: "1. Speed to first human touch" },
        {
          type: "p",
          text: "Start when the form comes in. Count the minutes until a live person first tries to reach out. This number is the median of those times. The median is the middle value. It does not count the autoresponder. It does not count the text that says you got the form. Those are **first touch**. First touch gets its own time in its own field. That way no one can mix the two up. Some CRMs have just one \"first contact\" field. They will report the autoresponder and call it speed.",
        },
        { type: "h3", text: "2. Contact rate, by response bucket" },
        {
          type: "p",
          text: "Contact rate is the share of leads who had a connected conversation. That means a live voice on the line, not a voicemail. Sort the leads into buckets by how fast a human first tried them: under five minutes, five to sixty minutes, one to twenty-four hours, and later. The buckets are what turn speed into a budget case. Say the under-five-minute bucket has a contact rate that is a multiple of the next-day bucket's. Then the case for staffing the phone makes itself.",
        },
        { type: "h3", text: "3. Set-to-held rate" },
        {
          type: "p",
          text: "Of the meetings that were booked, this is the share that took place. It is the number that shows the no-shows. Most vendors do not report it. That is because it is the one their work affects least. Three things move it: a confirmation the day before, a way to reschedule no-shows, and a nurture sequence between touches. A nurture sequence is a set of planned follow-up messages. None of these is a media buy.",
        },
        { type: "h3", text: "4. Cost per appointment held" },
        {
          type: "p",
          text: "This is media spend divided by meetings held. It counts media only, unless the report says fully loaded. It is the main number because no one can game it. Booking a meeting nobody attends raises the count of meetings set. It does nothing to the count of meetings held. The [cost-to-raise chart on the main page](/#calculator) starts from this number. You enter your own cost per meeting held.",
        },
      ],
    },
    {
      id: "instrumenting",
      h2: "How to track it",
      blocks: [
        {
          type: "ol",
          items: [
            "**Reply at once, by text and email, from the sponsor's name.** Seconds, not minutes. This is the automated layer. It buys time, but it does not replace the call. The lead agrees to texts on the form.",
            "**Send the lead to a person, with a clock running.** That person is a live setter or a named member of the sponsor's team. A setter is the person who makes the first call and books the meeting. They should have the lead in front of them within a minute. They follow a set script.",
            "**Timestamp first touch and first human touch separately.** Use two fields. The system writes them, not the person who made the call.",
            "**Log each try and each result.** Was it connected, voicemail, no answer or a wrong number? Was it booked, rescheduled, held or a no-show? If it is not in the CRM, it did not happen.",
            "**Record each call.** This is for the sponsor's counsel and for coaching. The script tells the lead the call is recorded. That is because investor leads come from all over the country. Several states require consent from everyone on the call.",
            "**Confirm before every meeting. Reschedule every no-show.** You win the set-to-held rate in two places. One is the touch the day before. The other is the follow-up after a miss.",
            "**Report weekly, from the CRM and the ad account.** Spend fifteen minutes on the four numbers. Do longer reviews at thirty, sixty and ninety days.",
          ],
        },
      ],
    },
    {
      id: "compliance",
      h2: "What the person on the phone may and may not say",
      blocks: [
        {
          type: "p",
          text: "Speed raises a compliance question. A slow process never has to answer it. If someone will reach an investor lead in minutes, what may they say? On a regulated raise, the answer has to be narrow and written down. Ascent's setters call as the sponsor. They call from a number registered to the sponsor. They use a script the sponsor's securities counsel has approved. Securities counsel is the sponsor's lawyer for the raise. They talk about **logistics only**. They confirm that the lead asked to hear from the sponsor. Then they get a meeting onto the sponsor's calendar. They never talk about returns, valuation, merits, timing or terms. They never ask about or judge whether the lead is accredited. A breach stops the work. The calls are live and human. There is no prerecorded audio, no artificial voice and no robo-dialing. The calls go only to inbound leads the sponsor brought in. Those are people who asked to hear from the sponsor. The sponsor runs the talk with the investor. The setter's job ends when the meeting is on the calendar and confirmed.",
        },
        {
          type: "quote",
          text: "The setter's job is to get the meeting held. The sponsor's job is everything said in it.",
        },
      ],
    },
    {
      id: "checklist",
      h2: "A five-minute check of your last raise",
      blocks: [
        {
          type: "p",
          text: "Pull the leads from your last campaign into a spreadsheet. Then answer six questions. If any answer is \"we don't know,\" that is the finding.",
        },
        {
          type: "ul",
          items: [
            "What is the median time from form to first live call attempt?",
            "What share of leads ever talked with a live person?",
            "How many meetings were booked? How many were held?",
            "Who made the calls? From what number, and on what script?",
            "Are the calls recorded? Has counsel ever heard one?",
            "What did each held meeting cost in media?",
          ],
        },
        {
          type: "p",
          text: "A scoping call with [Ascent](/#book) works through those same questions. It puts them in dollars, using the sponsor's own numbers.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "How fast should a sponsor reply to an investor lead?",
      a: "Send a text and email within seconds. Then have a live person try to reach the lead within minutes. Research on lead response shows the odds of a connected conversation drop fast after the first hour. Speed to first human touch is the time until a live person tries to reach the lead. For that reason, Ascent reports it in minutes.",
    },
    {
      q: "Does an email auto-reply count as a reply?",
      a: "No. It is first touch, and it matters. But one number predicts whether a meeting happens. It is the time to the first live human attempt. Give the two their own timestamps in separate fields.",
    },
    {
      q: "Can a voice AI or a prerecorded message make the call-back?",
      a: "Not on any job Ascent runs. Calls are live and human. They go only to inbound leads. Under the TCPA (the Telephone Consumer Protection Act), some calls carry the most risk. Those are prerecorded calls, artificial-voice calls and robo-dialed calls. Ascent does not sell them, however they are framed.",
    },
    {
      q: "What is a good set-to-held rate?",
      a: "The set-to-held rate is the share of booked meetings that take place. No one has published a benchmark rate for this field. What matters is that you measure it at all. You also need steps to confirm and reschedule meetings, since those move it. Ascent reports it each week. Each proposal sets its guaranteed minimum in appointments held, not booked.",
    },
    {
      q: "Who should make the first call: the sponsor or a setter?",
      a: "Whoever can do it within minutes, every time. They should use a script counsel approved, on a recorded line. For most sponsors, that is not the principal. The principal's time belongs on the talk with the investor. A dedicated setter is there to make the first call reliable. The setter is supervised and uses a script.",
    },
  ],
  sources: [
    { label: "Oldroyd, McElheran and Elkington: \"The Short Life of Online Sales Leads,\" Harvard Business Review, March 2011", url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
    { label: "Ascent metrics ontology: definitions of first touch, first human touch, contact rate by response bucket, set-to-held rate and cost per appointment held", url: null },
    { label: "Federal Communications Commission: Telephone Consumer Protection Act rules (47 CFR 64.1200)", url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200" },
  ],
  image: {
    src: "/guide-images/speed-to-lead-investor-acquisition.jpg",
    alt: "A phone and an open notebook with a pen on a dark wood desk.",
    credit: "Negative Space via StockSnap, CC0",
  },
  related: [
    "cost-per-investor-lead-506c-benchmarks",
    "how-to-find-accredited-investors-real-estate-syndication",
    "investor-acquisition-glossary",
  ],
};

export default guide;
