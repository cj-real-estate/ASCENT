import general from "./general";
import fence from "./fence";
import sponsors from "./sponsors";
import type { Vertical } from "./types";

/*
 * Every live vertical, brand page first. The sitemap and the booking
 * route's slug lookup derive from this, so registering a new vertical here
 * is all it takes to get it indexed and gated by its own questions. A
 * vertical with `canonicalUrl` set is the root of its own domain and is
 * listed by that domain's sitemap rather than the primary one.
 */
export const verticals: Vertical[] = [general, fence, sponsors];

export { general, fence, sponsors };
export type { Vertical } from "./types";
