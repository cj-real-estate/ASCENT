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
    "Why the minutes after an investor lead arrives decide a raise, what the response-time research says, and the four metrics — speed to first human touch, contact rate, set-to-held rate, cost per appointment held — a sponsor should demand weekly.",
  eyebrow: "Lead response · Investor acquisition",
  published: "2026-09-09",
  updated: "2026-09-09",
  answer:
    "Speed to lead is the interval between an investor submitting a form and the first human reaching them, and in investor acquisition it is the single largest lever a sponsor controls that has nothing to do with the ads. The most-cited research on the subject, a 2011 Harvard Business Review study of 2,241 U.S. companies, found that firms contacting a lead within an hour were about seven times as likely to qualify it as firms that waited even an hour longer, and that the average company took 42 hours to respond. Real estate sponsors are typically slower, and almost none measure it. Four numbers make the problem visible and manageable: speed to first human touch, contact rate by response bucket, set-to-held rate, and cost per appointment held.",
  takeaways: [
    "Harvard Business Review, 2011: average lead response of 42 hours; responding within an hour made a company ~7× as likely to qualify the lead as waiting an additional hour, and ~60× as likely as waiting 24 hours or more. 23% of companies never responded at all.",
    "An autoresponder is not a response. Instant acknowledgement by text and email is table stakes; the number that matters is minutes to the first live human.",
    "Measure first touch and first human touch as separate timestamps. If the CRM has one field, it is hiding the problem.",
    "Contact rate bucketed by response time (under 5 minutes, 5–60 minutes, 1–24 hours, later) turns speed from an opinion into a budget decision.",
    "A booked meeting is a calendar entry. Only held meetings count, so the set-to-held rate is the metric that exposes no-shows.",
    "Cost per appointment held is the one number that cannot be inflated, and it should be reported weekly, media-only unless marked fully loaded.",
  ],
  sections: [
    {
      id: "what-it-is",
      h2: "What speed to lead means for a sponsor",
      blocks: [
        {
          type: "p",
          text: "An accredited investor sees a LinkedIn ad for a multifamily fund at 8:40 on a Tuesday evening, reads the landing page, and submits the form. Their attention is on the sponsor for the next few minutes, and possibly the next hour. After that the tab is closed, the evening moves on, and the next time they think about it — if they do — the sponsor is one of several things they looked at that week.",
        },
        {
          type: "p",
          text: "Speed to lead is the sponsor's answer to that window: how long until a person, not a system, reaches the investor. Most sponsors' honest answer is “the next business day, if someone remembers,” and most cannot say precisely because nothing records it. The lead-generation vendor's obligation ended at the form submission. The sponsor's team is running the deal. The CRM sent an email. The investor never heard a human voice.",
        },
      ],
    },
    {
      id: "research",
      h2: "What the response-time research says",
      blocks: [
        {
          type: "p",
          text: "The most-cited study is “The Short Life of Online Sales Leads,” published in Harvard Business Review in March 2011 by James Oldroyd, Kristina McElheran and David Elkington. The researchers audited 2,241 U.S. companies by submitting a web lead to each and timing the response. The average response was 42 hours. Only 37% responded within an hour; 16% took between one and 24 hours; 24% took more than 24 hours; and 23% never responded. Separately, using data from a sales-software provider, they found that companies attempting contact within an hour were nearly seven times as likely to qualify the lead — reach a decision-maker and have a meaningful conversation — as those that tried an hour later, and more than sixty times as likely as those that waited a day or more.",
        },
        {
          type: "p",
          text: "The study was of business-to-business web leads generally, not of real estate investors specifically, and it is now fifteen years old. It is cited here for the shape of the curve, which every sponsor who has instrumented their own response has seen reproduced: the odds of a connected conversation fall steeply and continuously with every minute of delay, and there is no plateau to hide on.",
        },
        {
          type: "callout",
          title: "Why the curve is steeper for investors",
          text: "An investor lead is not shopping for a commodity. They are deciding whether to trust a stranger with $50,000 or more, and the first proof of the sponsor's operational competence they will ever see is how the sponsor handled their form. A next-day call-back is not just a lost window; it is evidence.",
        },
      ],
    },
    {
      id: "four-numbers",
      h2: "The four numbers",
      blocks: [
        {
          type: "p",
          text: "Ascent manages every sponsor lane to four metrics, reported weekly from the first full week live. They are defined here exactly as they are reported, because the definitions are the point.",
        },
        { type: "h3", text: "1. Speed to first human touch" },
        {
          type: "p",
          text: "Median minutes from form submission to the first outbound attempt by a live person. Not the autoresponder, not the text acknowledgement — those are **first touch**, timestamped in a separate field so the two can never be confused. A CRM with a single “first contact” field will report the autoresponder and call it speed.",
        },
        { type: "h3", text: "2. Contact rate, by response bucket" },
        {
          type: "p",
          text: "The share of leads that got a connected conversation — a live voice on the line, not a voicemail — bucketed by how quickly the first human attempt was made: under five minutes, five to sixty minutes, one to twenty-four hours, and later. Bucketing is what turns speed into a budget argument. When the under-five-minute bucket contacts at a multiple of the next-day bucket, the case for staffing the phone writes itself.",
        },
        { type: "h3", text: "3. Set-to-held rate" },
        {
          type: "p",
          text: "Of the meetings that were booked, the share that took place. This is the metric that exposes no-shows, and the one most vendors do not report because it is the one their work affects least. Confirmation the day before, a reschedule process for no-shows and a nurture sequence between touches all move it; none of them are a media buy.",
        },
        { type: "h3", text: "4. Cost per appointment held" },
        {
          type: "p",
          text: "Media spend divided by meetings held. Media-only unless the report says fully loaded. It is the primary metric because it cannot be gamed: booking a meeting nobody attends raises the set count and does nothing to the held count. It is also the number the [calculator on the main page](/#calculator) produces from a sponsor's own assumptions.",
        },
      ],
    },
    {
      id: "instrumenting",
      h2: "How to instrument it",
      blocks: [
        {
          type: "ol",
          items: [
            "**Acknowledge instantly, by text and email, from the sponsor's name.** Seconds, not minutes. This is the automated layer; it buys time, it does not replace the call. Consent for texts is captured on the form.",
            "**Route the lead to a person with a clock running.** A live setter or a named member of the sponsor's team, with the lead in front of them within a minute, and a defined script.",
            "**Timestamp first touch and first human touch separately.** Two fields, written by the system, not by the person who made the call.",
            "**Log every attempt and every outcome.** Connected, voicemail, no answer, wrong number, booked, rescheduled, held, no-show. If it is not in the CRM, it did not happen.",
            "**Record every call.** For the sponsor's counsel and for coaching. Recording disclosure is scripted, because investor leads are national and several states require all-party consent.",
            "**Confirm before every meeting, and reschedule every no-show.** The day-before touch and the follow-up on a miss are where the set-to-held rate is won.",
            "**Report weekly, from the CRM and the ad account.** Fifteen minutes on the four numbers. Long-form reviews at thirty, sixty and ninety days.",
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
          text: "Speed creates a compliance question that a slow process never has to answer: if someone is going to reach an investor lead in minutes, what are they allowed to say? On a regulated raise the answer has to be narrow and written down. Ascent's setters call as the sponsor, from a number registered to the sponsor, on a script the sponsor's securities counsel has approved, and they discuss **logistics only** — confirming the lead asked to hear from the sponsor, and getting a meeting onto the sponsor's calendar. They never discuss returns, valuation, merits, timing or terms, never ask about or assess accredited status, and a breach is a stop-work event. The calls are live and human — no prerecorded audio, no artificial voice, no robo-dialing — and only to inbound leads the sponsor generated. The sponsor runs the investor conversation; the setter's job ends when the meeting is on the calendar and confirmed.",
        },
        {
          type: "quote",
          text: "The setter's job is to get the meeting held. The sponsor's job is everything said in it.",
        },
      ],
    },
    {
      id: "checklist",
      h2: "A five-minute audit of your last raise",
      blocks: [
        {
          type: "p",
          text: "Pull the leads from your last campaign into a spreadsheet and answer six questions. If any answer is “we don't know,” that is the finding.",
        },
        {
          type: "ul",
          items: [
            "How long, on median, from form to first live call attempt?",
            "What share of leads ever had a connected conversation?",
            "How many meetings were booked? How many were held?",
            "Who made the calls, from what number, on what script?",
            "Are the calls recorded, and has counsel ever heard one?",
            "What did each held meeting cost in media?",
          ],
        },
        {
          type: "p",
          text: "Those are the questions a scoping call with [Ascent](/#book) works through, in dollars, from the sponsor's own numbers.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "How fast should a sponsor respond to an investor lead?",
      a: "Acknowledge within seconds by text and email, and have a live person attempt contact within minutes. The research on lead response shows the odds of a connected conversation falling steeply after the first hour, and Ascent reports speed to first human touch in minutes for that reason.",
    },
    {
      q: "Does an email autoresponder count as a response?",
      a: "No. It is first touch, and it matters, but the number that predicts whether a meeting happens is the time to the first live human attempt. The two should be timestamped in separate fields.",
    },
    {
      q: "Can the call-back be automated with a voice AI or a prerecorded message?",
      a: "Not on an engagement Ascent runs. Calls are live and human, to inbound leads only. Prerecorded, artificial-voice and robo-dialed calls carry the heaviest consumer-protection exposure under the TCPA and are not sold under any framing.",
    },
    {
      q: "What is a good set-to-held rate?",
      a: "There is no published category benchmark. What matters is that it is measured at all, and that confirmation and reschedule processes exist to move it. Ascent reports it weekly and sets each proposal's guaranteed minimum in appointments held, not booked.",
    },
    {
      q: "Who should make the first call — the sponsor or a setter?",
      a: "Whoever can do it within minutes, every time, on a script counsel approved, on a recorded line. For most sponsors that is not the principal, whose time is on the investor conversation itself. A dedicated setter, supervised and scripted, exists to make the first call reliable.",
    },
  ],
  sources: [
    { label: "Oldroyd, McElheran and Elkington — “The Short Life of Online Sales Leads,” Harvard Business Review, March 2011", url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
    { label: "Ascent metrics ontology — definitions of first touch, first human touch, contact rate by response bucket, set-to-held rate and cost per appointment held", url: null },
    { label: "Federal Communications Commission — Telephone Consumer Protection Act rules (47 CFR 64.1200)", url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200" },
  ],
  image: {
    src: "/guides/speed-to-lead-investor-acquisition.jpg",
    alt: "A smartphone and an open notebook with a pen on a dark wooden desk.",
    credit: "Negative Space via StockSnap, CC0",
  },
  related: [
    "cost-per-investor-lead-506c-benchmarks",
    "how-to-find-accredited-investors-real-estate-syndication",
    "investor-acquisition-glossary",
  ],
};

export default guide;
