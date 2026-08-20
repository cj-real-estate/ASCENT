import type { OfferCard, Vertical } from "@/content/verticals/types";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

function Card({ card }: { card: OfferCard }) {
  if (card.dark) {
    return (
      <div className="bg-ink p-7 sm:p-9">
        <h3 className="font-display text-2xl leading-tight text-white">
          {card.name}
        </h3>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-4xl font-semibold tracking-tight tabular-nums text-accent">
            {card.price}
          </span>
          {card.priceNote && (
            <span className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-fog">
              {card.priceNote}
            </span>
          )}
        </p>
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-on-dark">
          {card.body}
        </p>
      </div>
    );
  }
  return (
    <div className="border border-ink bg-paper p-7 sm:p-9">
      <h3 className="font-display text-2xl leading-tight text-ink">
        {card.name}
      </h3>
      <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-4xl font-semibold tracking-tight tabular-nums text-accent-deep">
          {card.price}
        </span>
        {card.priceNote && (
          <span className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-slate">
            {card.priceNote}
          </span>
        )}
      </p>
      <p className="mt-5 text-[0.9375rem] leading-relaxed text-slate">
        {card.body}
      </p>
    </div>
  );
}

export function OfferSection({ vertical }: { vertical: Vertical }) {
  const { offer } = vertical;
  const showFoundingSpots =
    typeof offer.foundingSpotsRemaining === "number" &&
    offer.foundingSpotsRemaining > 0;

  return (
    <section className="bg-paper">
      <Container className="py-16 sm:py-24">
        <Eyebrow tone="deep">{offer.eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-3xl leading-[1.06] tracking-[-0.01em] text-ink sm:text-4xl">
          {offer.heading}
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
          {offer.cards.map((card) => (
            <div key={card.name}>
              <Card card={card} />
              {card.dark && (
                <p className="mt-4 font-mono text-sm font-semibold leading-relaxed text-accent-deep">
                  {offer.guaranteeLine}
                </p>
              )}
            </div>
          ))}
        </div>
        {showFoundingSpots && (
          <p className="mt-8 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-accent-deep">
            {offer.foundingSpotsTemplate.replace(
              "{n}",
              String(offer.foundingSpotsRemaining),
            )}
          </p>
        )}
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate">
          {offer.note}
        </p>
      </Container>
    </section>
  );
}
