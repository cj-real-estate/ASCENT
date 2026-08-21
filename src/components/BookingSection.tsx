import type { Vertical } from "@content/verticals/types";
import BookingForm from "./BookingForm";

/*
 * Booking section (§9) — dark (bg-ink), `data-dark` so the global focus ring
 * stays visible. Server component; the form itself is the client island.
 *
 * Copy comes from the vertical content module verbatim. When
 * `spotsRemaining` is 0 the waitlist headline is used. When the vertical has
 * a scheduling link, the embed is the primary path and the form renders
 * beneath it; while the link is null (DECISION #4 pending) a visible mono
 * placeholder marks the gap and the form is the only path.
 */
export function BookingSection({
  vertical,
  spotsRemaining,
}: {
  vertical: Vertical;
  spotsRemaining: number;
}) {
  const { booking } = vertical;
  const heading = spotsRemaining === 0 ? booking.h2Waitlist : booking.h2;

  return (
    <section id="book" data-dark className="cv-auto bg-ink py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange">{booking.eyebrow}</p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-paper md:text-[46px]">
          {heading}
        </h2>
        <p className="mt-8 max-w-[68ch] text-[17px] text-on-dark">
          {booking.body}
        </p>

        {booking.schedulingLink ? (
          <>
            {/* 700px is Calendly's own minimum for the inline calendar —
                below it the widget scrolls internally on mobile. Lazy because
                the section sits well below the fold. */}
            <iframe
              src={booking.schedulingLink}
              title="Scheduling calendar"
              loading="lazy"
              className="mt-10 min-h-[700px] w-full rounded-md border border-white/15 bg-paper"
            />
            <div className="mt-12">
              <BookingForm form={booking.form} />
            </div>
          </>
        ) : (
          <>
            <p className="mt-10 font-mono text-[12px] text-fog">
              [SCHEDULING EMBED — Cal.com vs Calendly + link pending]
            </p>
            <div className="mt-6">
              <BookingForm form={booking.form} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default BookingSection;
