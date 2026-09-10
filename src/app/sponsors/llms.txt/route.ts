import sponsors, { sponsorsPage, SPONSOR_PAGE_UPDATED } from "@content/verticals/sponsors";
import { guides } from "@content/guides";
import { plainText } from "@/components/sponsor/RichText";

/*
 * llms.txt, served at ascentforsponsors.com/llms.txt (via the host rewrite
 * in next.config.ts). A Markdown summary of the site for language-model
 * crawlers and answer engines, per the llms.txt convention: an h1, a
 * blockquote summary, then sections of links with one-line descriptions —
 * followed here by the facts an answer engine most often needs, so the
 * file stands alone. Built from the content modules, so it can never
 * drift from the pages.
 */
export const dynamic = "force-static";

export function GET() {
  const v = sponsors;
  const p = sponsorsPage;
  const base = v.business.url;
  const lines: string[] = [];

  lines.push(`# ${v.business.name}`);
  lines.push("");
  lines.push(`> ${p.glance.definition}`);
  lines.push("");
  lines.push(`Site: ${base} · Updated: ${SPONSOR_PAGE_UPDATED} · Contact: ${v.business.email ?? ""} · ${v.footer.locationLine}`);
  lines.push("");

  lines.push("## Key facts");
  lines.push("");
  for (const f of p.glance.facts) lines.push(`- **${f.label}:** ${f.value}`);
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  lines.push(`- [${v.seo.title}](${base}/): ${v.seo.description}`);
  lines.push(`- [Guides](${base}/guides): ${p.guides.sub}`);
  for (const g of guides) {
    lines.push(`- [${g.title}](${base}/guides/${g.slug}): ${g.description}`);
  }
  lines.push(`- [Privacy](${base}/privacy): How this site handles visitor data.`);
  lines.push(
    `- [Terms](${base}/terms): Website terms and the text message program terms.`,
  );
  lines.push("");

  lines.push("## What is included");
  lines.push("");
  for (const c of p.included.cards) {
    lines.push(`- **${c.title}.** ${c.bullets.join(". ")}.`);
  }
  lines.push("");

  lines.push("## How it works");
  lines.push("");
  p.process.steps.forEach((s, i) => lines.push(`${i + 1}. **${s.title}.** ${s.body}`));
  lines.push("");

  if (v.boundaries) {
    lines.push(`## ${v.boundaries.h2}`);
    lines.push("");
    for (const b of v.boundaries.items) lines.push(`- **${b.title}** ${b.body}`);
    lines.push("");
  }

  if (v.fit) {
    lines.push("## Who it is for");
    lines.push("");
    lines.push(`${v.fit.forYouHeading}:`);
    for (const f of v.fit.forYou) lines.push(`- ${f}`);
    lines.push("");
    lines.push(`${v.fit.notForYouHeading}:`);
    for (const f of v.fit.notForYou) lines.push(`- ${f}`);
    lines.push("");
  }

  if (v.faq) {
    lines.push("## Frequently asked questions");
    lines.push("");
    for (const q of v.faq.items) {
      lines.push(`### ${q.q}`);
      lines.push("");
      lines.push(plainText(q.a));
      lines.push("");
    }
  }

  lines.push("## Guide summaries");
  lines.push("");
  for (const g of guides) {
    lines.push(`### ${g.title}`);
    lines.push("");
    lines.push(`${base}/guides/${g.slug}`);
    lines.push("");
    lines.push(plainText(g.answer));
    lines.push("");
    for (const t of g.takeaways) lines.push(`- ${plainText(t)}`);
    lines.push("");
  }

  lines.push("## Legal");
  lines.push("");
  for (const para of p.legal.paragraphs) lines.push(para, "");
  if (v.footer.complianceLine) lines.push(v.footer.complianceLine, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
