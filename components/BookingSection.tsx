import type { Vertical } from "@/content/verticals/types";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { BookingForm } from "./BookingForm";
import { CalEmbed } from "./CalEmbed";

export function BookingSection({ vertical }: { vertical: Vertical }) {
  const { booking } = vertical;
  return (
    /* scroll-mt offsets the sticky header when #book anchors here. */
    <section id="book" className="scroll-mt-16 bg-ink">
      <Container className="py-16 sm:py-24 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          <Eyebrow tone="accent">{booking.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl leading-[1.06] tracking-[-0.01em] text-white sm:text-4xl">
            {booking.heading}
          </h2>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-on-dark">
            {booking.body}
          </p>
        </div>
        <div className="mt-10 lg:col-span-7 lg:mt-0">
          {booking.calLink ? (
            <CalEmbed calLink={booking.calLink} />
          ) : (
            <BookingForm
              slug={vertical.slug}
              form={booking.form}
              submitLabel={vertical.hero.ctaLabel}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
