/*
 * Eyebrow text with rule citations preserved. `.eyebrow` uppercases via
 * CSS, which would print "506(c)" as "506(C)" — a different thing. The
 * "(c)" is wrapped so the transform skips it. Strings without a citation
 * render unchanged.
 */
const CITATION = /(\(c\))/g;

export default function EyebrowText({ text }: { text: string }) {
  if (!text.includes("(c)")) return <>{text}</>;
  return (
    <>
      {text.split(CITATION).map((part, i) =>
        part === "(c)" ? (
          <span key={i} className="normal-case">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
