import { readEnv } from "@/lib/env";

/*
 * IndexNow key file. Bing (and through it, the engines that share its
 * index and the AI assistants that search with it) accepts instant URL
 * submissions signed by a key the site proves it owns by serving it at a
 * URL of its choosing. scripts/indexnow.mjs submits URLs with
 *   keyLocation = https://<host>/indexnow/<key>.txt
 * and this handler serves that file: the key, as plain text, only when the
 * requested name matches INDEXNOW_KEY. Anything else is a 404, so the
 * route cannot be used to probe for the key.
 */
export const dynamic = "force-dynamic";

export function GET(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  return ctx.params.then(({ key }) => {
    const expected = readEnv("INDEXNOW_KEY");
    const requested = key.endsWith(".txt") ? key.slice(0, -4) : "";
    if (!expected || !requested || requested !== expected) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(expected, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  });
}
