import general from "./general";
import fence from "./fence";
import type { Vertical } from "./types";

/*
 * Every live vertical, brand page first. The sitemap derives from this, so
 * registering a new vertical here is all it takes to get it indexed.
 */
export const verticals: Vertical[] = [general, fence];

export { general, fence };
export type { Vertical } from "./types";
