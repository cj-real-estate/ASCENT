import type { Vertical } from "@content/verticals/types";
import QualifyFlow from "./QualifyFlow";
import { toQualifyFlowProps } from "@/lib/qualify";
import TrustBanner from "./TrustBanner";
import SectionIndex from "./SectionIndex";

/*
 * Booking section (§9) — dark (bg-ink), `data-dark` so the global focus ring
 * stays visible. Server component; QualifyFlow is the client island.
 *
 * There is no ungated calendar on this page any more. The ICP questions come
 * first: QualifyFlow renders the qualification form, and the scheduler is
 * revealed only after a submit where every chosen option carries
 * `qualifies: true`. A non-qualifying submit gets the decline copy instead of
 * a calendar — the lead still reaches the inbox, it just doesn't get a call.
 * Which answers pass is tuned in `vertical.qualification`, never here.
 *
 * Copy comes from the vertical content module verbatim.
 */
export function BookingSection({
  vertical,
  index,
}: {
  vertical: Vertical;
  index?: number;
}) {
  const { booking } = vertical;

  return (
    <section id="book" data-dark className="cv-auto bg-ink py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange">
          <SectionIndex n={index} dark />
          {booking.eyebrow}
        </p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-paper md:text-[46px]">
          {booking.h2}
        </h2>
        <p className="mt-8 max-w-[68ch] text-[17px] text-on-dark">
          {booking.body}
        </p>

        <div className="mt-10">
          <QualifyFlow flow={toQualifyFlowProps(vertical)} />
        </div>

        <TrustBanner items={vertical.qualification.trustItems} />
      </div>
    </section>
  );
}

export default BookingSection;
