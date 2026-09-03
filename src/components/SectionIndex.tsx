/*
 * The "(01) / " prefix on section eyebrows, reference-site style. Indexes
 * are assigned in VerticalPage in render order, counting only sections that
 * actually render on that vertical — never with CSS counters (cv-auto's
 * style containment scopes those per-section and breaks the sequence).
 * The index runs dimmer than the label: slate on light surfaces, fog on
 * dark — both pass 4.5:1.
 */
export default function SectionIndex({
  n,
  dark = false,
}: {
  n?: number;
  dark?: boolean;
}) {
  if (!n) return null;
  return (
    <span className={dark ? "text-fog" : "text-slate"}>
      ({String(n).padStart(2, "0")}) /{" "}
    </span>
  );
}
