import type { ReactNode } from "react";

/*
 * Inline markup for guide copy — links as [text](href) and bold as
 * **text**. Nothing else: the content is typed, not markdown, and these
 * two are the only inline devices the guides use. A relative href
 * ("/guides/x", "/#book") is made absolute against `linkBase` so the link
 * lands on the sponsor domain whichever host served the page.
 */
const TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

export default function RichText({ text, linkBase }: { text: string; linkBase: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  const out: ReactNode[] = parts.map((part, i) => {
    const link = part.match(LINK);
    if (link) {
      const [, label, href] = link;
      const external = /^https?:\/\//.test(href);
      return (
        <a
          key={i}
          href={external ? href : `${linkBase}${href}`}
          className="text-paper underline decoration-orange/70 underline-offset-4 hover:decoration-orange"
          {...(external ? { rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-paper">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
  return <>{out}</>;
}

/** The same text with the markup stripped — for meta, JSON-LD and llms.txt. */
export function plainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}
