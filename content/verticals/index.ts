import { general } from "./general";
import { fence } from "./fence";
import type { Vertical } from "./types";

/** Every live vertical. sitemap.ts derives its URL list from this. */
export const verticals: Vertical[] = [general, fence];

export { general, fence };
export type { Vertical } from "./types";
