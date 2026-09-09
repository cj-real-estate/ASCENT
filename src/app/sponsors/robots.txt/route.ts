import sponsors from "@content/verticals/sponsors";

/*
 * robots.txt served at ascentforsponsors.com/robots.txt (via the host
 * rewrite in next.config.ts). One project serves both domains, so the
 * other verticals are reachable on this host too; they are kept out of the
 * index here so the sponsor domain indexes as its own site — the sponsor
 * page at "/", the guides, privacy.
 *
 * The AI crawlers are named and allowed on purpose. "User-Agent: *" already
 * admits them, but several answer engines document that an explicit
 * allowance is read as consent to cite, and a named block is the one
 * place a future decision to exclude one of them would be made.
 */
export const dynamic = "force-static";

const DISALLOW = ["/api/", "/thanks", "/apply", "/fence", "/sponsors", "/indexnow/"];

const AI_CRAWLERS = [
  // Google's AI training and Gemini grounding (Search itself uses Googlebot).
  "Google-Extended",
  // OpenAI: ChatGPT search, training, and on-demand fetches for a user.
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  // Anthropic.
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Microsoft Bing / Copilot, Apple, Meta, Amazon, Common Crawl, DuckDuckGo, You.com, Mistral, Cohere.
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "CCBot",
  "DuckAssistBot",
  "YouBot",
  "MistralAI-User",
  "cohere-ai",
];

export function GET() {
  const rules = (agent: string) => [
    `User-Agent: ${agent}`,
    "Allow: /",
    ...DISALLOW.map((path) => `Disallow: ${path}`),
    "",
  ];
  const body = [
    ...rules("*"),
    ...AI_CRAWLERS.flatMap(rules),
    `Sitemap: ${sponsors.business.url}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
