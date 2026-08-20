import type { Vertical } from "@content/verticals/types";

/*
 * Guarantees section — dark (bg-ink, data-dark so the focus ring stays
 * visible). Server component. Orange titles pass contrast on ink at any
 * size; body copy in on-dark.
 */
export function GuaranteesSection({ vertical }: { vertical: Vertical }) {
  const { guarantees } = vertical;

  return (
    <section data-dark="" className="cv-auto bg-ink py-16 md:py-28">
      <div className="section-shell">
        <p className="eyebrow text-orange">{guarantees.eyebrow}</p>
        <h2 className="display mt-4 max-w-[20ch] text-[26px] text-paper md:text-[46px]">
          {guarantees.h2}
        </h2>

        <ul className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {guarantees.items.map((item) => (
            <li key={item.title}>
              <h3 className="text-[20px] font-semibold text-orange">
                {item.title}
              </h3>
              <p className="mt-2 text-[17px] text-on-dark">{item.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-[80ch] text-[14px] text-on-dark md:mt-14">
          {guarantees.conditions}
        </p>
      </div>
    </section>
  );
}

export default GuaranteesSection;
