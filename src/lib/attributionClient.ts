/*
 * Browser half of lead attribution (see lib/attribution.ts).
 *
 * On each full page load, work out how this visitor arrived — UTM tags and
 * ad click IDs from the URL, plus the referring site — and remember it in
 * localStorage for 90 days:
 *
 *   - `first` is written once and kept: the first arrival we know of.
 *   - `last` is overwritten by any arrival that carries a real signal (tags,
 *     a click ID, or an outside referrer). A plain direct revisit or an
 *     internal page load never erases a known source — standard
 *     "last non-direct click".
 *
 * Storage can be blocked (private mode, strict settings), so every access is
 * wrapped and the in-memory copy from this page load is the fallback: a
 * visitor who lands and converts on one page is still attributed.
 */

import {
  type Attribution,
  type Touch,
  MAX_ATTRIBUTION_VALUE,
  URL_PARAM_KEYS,
  referrerHost,
} from "./attribution";

const STORAGE_KEY = "ascent:attribution";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

let memory: Attribution | null = null;

function cut(v: string): string {
  return v.slice(0, MAX_ATTRIBUTION_VALUE);
}

function readStored(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution & { savedAt?: number };
    if (!parsed.savedAt || Date.now() - parsed.savedAt > TTL_MS) return null;
    return { first: parsed.first, last: parsed.last };
  } catch {
    return null;
  }
}

function writeStored(value: Attribution): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...value, savedAt: Date.now() }),
    );
  } catch {
    // Storage blocked — the in-memory copy still covers this page load.
  }
}

/** This page load's arrival, read off the URL and document.referrer. */
function currentTouch(): { touch: Touch; meaningful: boolean } {
  const touch: Touch = {
    landingPage: cut(window.location.pathname || "/"),
    at: new Date().toISOString(),
  };
  const params = new URLSearchParams(window.location.search);
  let tagged = false;
  for (const key of URL_PARAM_KEYS) {
    const v = params.get(key)?.trim();
    if (v) {
      touch[key] = cut(v);
      tagged = true;
    }
  }

  let external = false;
  const ref = document.referrer;
  if (ref) {
    try {
      const url = new URL(ref);
      // Our own pages (either brand domain) are navigation, not a source.
      const host = referrerHost(ref);
      const ours =
        url.host === window.location.host ||
        /(^|\.)(ascentforsponsors|ascentcas|growwithascent)\.com$/.test(host);
      if (!ours) {
        // Origin + path only: a referrer's query string can carry things
        // that are none of our business.
        touch.referrer = cut(`${url.origin}${url.pathname === "/" ? "" : url.pathname}`);
        external = true;
      }
    } catch {
      // Unparseable referrer — ignore it.
    }
  }
  return { touch, meaningful: tagged || external };
}

/** Run once per full page load (AttributionCapture does this). */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const stored = readStored() ?? {};
  const { touch, meaningful } = currentTouch();
  const next: Attribution = {
    first: stored.first ?? touch,
    last: meaningful || !stored.last ? touch : stored.last,
  };
  memory = next;
  writeStored(next);
}

/** What the forms send with a lead. Never throws. */
export function readAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  return readStored() ?? memory ?? undefined;
}
