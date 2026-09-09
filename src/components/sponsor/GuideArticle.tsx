import type { Guide, GuideBlock } from "@content/guides/types";
import type { SponsorPageContent, Vertical } from "@content/verticals/types";
import Image from "next/image";
import ArrowRight from "@/components/ArrowRight";
import RichText from "./RichText";
import { Eyebrow, card, guidePath, shell, sponsorHref } from "./SponsorChrome";

/*
 * A guide, rendered. Answer first: the eyebrow, the h1, the byline, then
 * the direct answer set apart in a card, the takeaways, a contents list,
 * the sections, the FAQ (open <details>, so every answer is in the HTML),
 * the sources, the related guides and one CTA back to the sponsor page.
 *
 * Reading measure is capped at ~70ch; tables scroll inside their own
 * container so the page never scrolls sideways on a phone.
 */

const prose = "max-w-[70ch] text-[17px] leading-relaxed text-ash";
const h2 = "display mt-14 scroll-mt-20 max-w-[24ch] text-[26px] text-paper md:text-[34px]";
const h3 = "mt-8 text-[19px] font-semibold leading-snug text-paper";

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function Block({ block, base }: { block: GuideBlock; base: string }) {
  switch (block.type) {
    case "p":
      return (
        <p className={`${prose} mt-5`}>
          <RichText text={block.text} linkBase={base} />
        </p>
      );
    case "h3":
      return <h3 className={h3}>{block.text}</h3>;
    case "ul":
    case "ol": {
      const Tag = block.type;
      return (
        <Tag
          className={`${prose} mt-5 space-y-3 pl-6 ${
            block.type === "ol" ? "list-decimal marker:text-orange" : "list-disc marker:text-orange"
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <RichText text={item} linkBase={base} />
            </li>
          ))}
        </Tag>
      );
    }
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-xl border border-seam">
          <table className="w-full min-w-[560px] border-collapse text-left text-[15px] leading-snug">
            {block.caption ? (
              <caption className="border-b border-seam bg-coal px-4 py-3 text-left text-[13px] text-ash">
                {block.caption}
              </caption>
            ) : null}
            <thead>
              <tr>
                {block.head.map((cell, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="border-b border-seam bg-coal px-4 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-ash"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-seam last:border-b-0">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-4 py-3 align-top font-semibold text-paper">
                        <RichText text={cell} linkBase={base} />
                      </th>
                    ) : (
                      <td key={c} className="px-4 py-3 align-top text-ash">
                        <RichText text={cell} linkBase={base} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className={`${card} mt-6 max-w-[70ch] border-l-2 border-l-orange p-5 md:p-6`}>
          <p className="text-[15px] font-semibold text-paper">{block.title}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ash">
            <RichText text={block.text} linkBase={base} />
          </p>
        </aside>
      );
    case "quote":
      return (
        <p className="display mt-8 max-w-[28ch] border-l-2 border-orange pl-5 text-[22px] text-paper md:text-[28px]">
          {block.text}
        </p>
      );
  }
}

export default function GuideArticle({
  vertical,
  page,
  guide,
  related,
}: {
  vertical: Vertical;
  page: SponsorPageContent;
  guide: Guide;
  related: Guide[];
}) {
  const base = vertical.business.url;
  const { founder } = vertical.business;
  return (
    <article className="py-12 md:py-20">
      <div className={shell}>
        <nav aria-label="Breadcrumb" className="font-mono text-[12px] uppercase tracking-[0.14em] text-ash">
          <ol className="flex flex-wrap gap-2">
            <li>
              <a href={sponsorHref(vertical, "/")} className="hover:text-paper">
                Home
              </a>
              <span aria-hidden="true" className="ml-2">/</span>
            </li>
            <li>
              <a href={sponsorHref(vertical, "/guides")} className="hover:text-paper">
                Guides
              </a>
            </li>
          </ol>
        </nav>

        <header className="mt-8">
          <Eyebrow>{guide.eyebrow}</Eyebrow>
          <h1 className="display mt-4 max-w-[24ch] text-balance text-[34px] text-paper md:text-[52px]">
            {guide.title}
          </h1>
          <p className="mt-6 text-[14px] text-ash">
            {founder ? (
              <>
                By <span className="text-on-dark">{founder.name}</span>, {founder.title},{" "}
                {vertical.business.name}
                {" · "}
              </>
            ) : null}
            Published{" "}
            <time dateTime={guide.published}>{formatDate(guide.published)}</time>
            {guide.updated !== guide.published ? (
              <>
                {" · Updated "}
                <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
              </>
            ) : null}
          </p>
        </header>

        <figure className="mt-10 max-w-[80ch] overflow-hidden rounded-xl border border-seam">
          <Image
            src={guide.image.src}
            alt={guide.image.alt}
            width={960}
            height={540}
            priority
            sizes="(min-width: 960px) 880px, 100vw"
            className="block h-auto w-full"
          />
        </figure>

        {/* The direct answer — the first substantive text on the page. */}
        <div className={`${card} mt-10 max-w-[80ch] p-6 md:p-8`}>
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-orange">
            The short answer
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-on-dark md:text-[18px]">{guide.answer}</p>
        </div>

        <section aria-labelledby="takeaways" className="mt-10 max-w-[80ch]">
          <h2 id="takeaways" className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
            Key takeaways
          </h2>
          <ul className="mt-4 space-y-3">
            {guide.takeaways.map((t, i) => (
              <li key={i} className="flex gap-3 text-[16px] leading-relaxed text-ash">
                <span aria-hidden="true" className="readout mt-[2px] shrink-0 text-[14px] text-orange">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <RichText text={t} linkBase={base} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-labelledby="contents" className="mt-10 max-w-[80ch] border-t border-seam pt-6">
          <h2 id="contents" className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
            In this guide
          </h2>
          <ol className="mt-3 grid gap-x-8 gap-y-1 md:grid-cols-2">
            {guide.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex min-h-[32px] items-center text-[15px] text-on-dark hover:text-paper">
                  {s.h2}
                </a>
              </li>
            ))}
            {guide.faq.length > 0 ? (
              <li>
                <a href="#faq" className="inline-flex min-h-[32px] items-center text-[15px] text-on-dark hover:text-paper">
                  Frequently asked questions
                </a>
              </li>
            ) : null}
          </ol>
        </nav>

        {guide.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
            <h2 id={`${s.id}-h`} className={h2}>
              {s.h2}
            </h2>
            {s.blocks.map((b, i) => (
              <Block key={i} block={b} base={base} />
            ))}
          </section>
        ))}

        {guide.faq.length > 0 ? (
          <section id="faq" aria-labelledby="faq-h" className="scroll-mt-20">
            <h2 id="faq-h" className={h2}>
              Frequently asked questions
            </h2>
            <div className="mt-6 max-w-[80ch]">
              {guide.faq.map((item) => (
                <details key={item.q} open className="group border-t border-seam last:border-b">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-baseline justify-between gap-6 py-4 text-[17px] font-semibold text-paper [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden="true" className="readout shrink-0 text-[20px] text-orange group-open:hidden">
                      +
                    </span>
                    <span aria-hidden="true" className="readout hidden shrink-0 text-[20px] text-orange group-open:inline">
                      −
                    </span>
                  </summary>
                  <p className="max-w-[70ch] pb-5 text-[16px] leading-relaxed text-ash">
                    <RichText text={item.a} linkBase={base} />
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="sources-h" className="mt-14 max-w-[80ch] border-t border-seam pt-6">
          <h2 id="sources-h" className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
            Sources
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-[14px] leading-relaxed text-ash marker:text-orange">
            {guide.sources.map((s, i) => (
              <li key={i} className="pl-1">
                {s.url ? (
                  <a
                    href={s.url}
                    rel="noopener noreferrer"
                    className="underline decoration-seam underline-offset-4 hover:text-paper hover:decoration-orange"
                  >
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-[70ch] text-[13px] leading-relaxed text-ash/80">
            This guide describes rules and published figures for orientation. It is not legal, investment or
            tax advice, nothing in it is an offer to sell or a solicitation of an offer to buy any security,
            and every regulatory decision it mentions belongs to the issuer and its securities counsel.
          </p>
        </section>

        {related.length > 0 ? (
          <section aria-labelledby="related-h" className="mt-14">
            <h2 id="related-h" className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ash">
              Related guides
            </h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {related.map((g) => (
                <li key={g.slug}>
                  <a
                    href={sponsorHref(vertical, guidePath(g))}
                    className={`${card} flex h-full flex-col overflow-hidden motion-safe:transition-[border-color] hover:border-ash/40`}
                  >
                    <Image
                      src={g.image.src}
                      alt=""
                      width={960}
                      height={540}
                      sizes="(min-width: 768px) 380px, 100vw"
                      className="block aspect-video h-auto w-full object-cover"
                    />
                    <span className="flex flex-col p-5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
                        {g.eyebrow}
                      </span>
                      <span className="mt-2 text-[16px] font-semibold leading-snug text-paper">{g.title}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className={`${card} relative mt-14 overflow-hidden p-8 md:p-12`}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(50% 80% at 50% 100%, rgb(240 94 35 / 0.18), transparent 70%)",
            }}
          />
          <div className="relative max-w-[60ch]">
            <h2 className="display text-[26px] text-paper md:text-[36px]">{page.ctaBand.h2}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ash">{page.ctaBand.body}</p>
            <a href={sponsorHref(vertical, "/#book")} className="btn-primary mt-7 px-8 text-[16px]">
              {page.ctaBand.cta}
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
