/*
 * Lead attribution — where a lead came from, carried WITH the lead.
 *
 * The GHL tracking script (components/GhlTracking.tsx) can attach a visit
 * to a contact, but only when it catches the form submit in the same
 * session, and Instagram's in-app browser often hides the referrer from it.
 * This is the belt to that suspenders: the browser remembers how the
 * visitor arrived (lib/attributionClient.ts), the forms post it alongside
 * the contact fields, and the API writes it into the contact note and a
 * "source: …" tag. So every lead says where it came from, whatever the
 * script managed.
 *
 * This module is shared by client and server: the type, the sanitiser the
 * API runs on whatever the browser sent, and the channel rules.
 */

/** One arrival on the site. Every field optional; all are short strings. */
export interface Touch {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** Google Ads click IDs (auto-tagging). */
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  /** Meta appends this to outbound links from Facebook and Instagram. */
  fbclid?: string;
  /** Microsoft Ads. */
  msclkid?: string;
  /** Referring page, origin + path only — never its query string. */
  referrer?: string;
  /** Path the visitor landed on, e.g. "/" or "/guides/form-d". */
  landingPage?: string;
  /** ISO time of the arrival. */
  at?: string;
}

/** first = the first arrival we remember; last = the one that converted. */
export interface Attribution {
  first?: Touch;
  last?: Touch;
}

export const URL_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;

const TOUCH_KEYS = [...URL_PARAM_KEYS, "referrer", "landingPage", "at"] as const;

export const MAX_ATTRIBUTION_VALUE = 200;

/* ---------- server-side sanitising ---------- */

function clean(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  // Strip control characters; they have no business in a CRM note.
  const v = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return v ? v.slice(0, MAX_ATTRIBUTION_VALUE) : undefined;
}

function sanitizeTouch(raw: unknown): Touch | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const source = raw as Record<string, unknown>;
  const touch: Touch = {};
  for (const key of TOUCH_KEYS) {
    const v = clean(source[key]);
    if (v) touch[key] = v;
  }
  if (touch.at && Number.isNaN(Date.parse(touch.at))) delete touch.at;
  return Object.keys(touch).length ? touch : undefined;
}

/**
 * Whatever the browser sent, reduced to known keys and short strings.
 * Never throws and never fails a submission — attribution is context,
 * not a gate.
 */
export function sanitizeAttribution(raw: unknown): Attribution | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const source = raw as Record<string, unknown>;
  const first = sanitizeTouch(source.first);
  const last = sanitizeTouch(source.last);
  if (!first && !last) return undefined;
  return { ...(first ? { first } : {}), ...(last ? { last } : {}) };
}

/* ---------- channel rules ---------- */

export interface Channel {
  /** Human name, e.g. "Instagram", "Google Ads", "Google Search". */
  name: string;
  /** Kind of traffic, e.g. "social", "paid", "organic search". */
  kind: string;
}

/* utm_source values → display name. Includes Meta's {{site_source_name}}
 * codes (fb, ig, an, msg) so one dynamic ad URL resolves per placement. */
const SOURCE_NAMES: Record<string, string> = {
  instagram: "Instagram",
  ig: "Instagram",
  facebook: "Facebook",
  fb: "Facebook",
  meta: "Meta",
  an: "Audience Network",
  msg: "Messenger",
  messenger: "Messenger",
  google: "Google",
  bing: "Bing",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "X",
  x: "X",
  email: "Email",
  newsletter: "Email",
};

const PAID_MEDIUMS = new Set([
  "cpc",
  "ppc",
  "paid",
  "paid_social",
  "paidsocial",
  "paid-social",
  "ads",
  "ad",
  "display",
  "cpm",
]);

const SEARCH_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)google\.[a-z.]+$/, "Google Search"],
  [/(^|\.)bing\.com$/, "Bing Search"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo Search"],
  [/(^|\.)search\.yahoo\.com$/, "Yahoo Search"],
  [/(^|\.)search\.brave\.com$/, "Brave Search"],
];

const SOCIAL_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)facebook\.com$|^fb\.me$/, "Facebook"],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, "LinkedIn"],
  [/^t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/, "X"],
  [/(^|\.)youtube\.com$|^youtu\.be$/, "YouTube"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
];

const AI_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$/, "Claude"],
  [/(^|\.)gemini\.google\.com$/, "Gemini"],
];

export function referrerHost(referrer?: string): string {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Classify one arrival. Tags beat click IDs beat the referrer. */
export function channelOf(touch: Touch | undefined): Channel {
  if (!touch) return { name: "Unknown", kind: "unknown" };
  const host = referrerHost(touch.referrer);
  const src = touch.utm_source?.toLowerCase();
  const medium = touch.utm_medium?.toLowerCase() ?? "";

  if (src) {
    const base = SOURCE_NAMES[src] ?? titleCase(touch.utm_source as string);
    if (PAID_MEDIUMS.has(medium)) return { name: `${base} Ads`, kind: "paid" };
    if (medium === "email" || base === "Email") return { name: base, kind: "email" };
    if (medium.includes("social") || ["Instagram", "Facebook", "LinkedIn", "X", "TikTok", "YouTube", "Messenger"].includes(base)) {
      return { name: base, kind: "social" };
    }
    return { name: base, kind: medium || "campaign" };
  }
  if (touch.gclid || touch.gbraid || touch.wbraid) return { name: "Google Ads", kind: "paid" };
  if (touch.msclkid) return { name: "Microsoft Ads", kind: "paid" };
  if (touch.fbclid) {
    // Meta adds fbclid to every outbound click — posts, bios and ads alike.
    return { name: /instagram\.com$/.test(host) ? "Instagram" : "Facebook", kind: "social" };
  }
  if (host) {
    // AI before search: gemini.google.com would otherwise read as Google Search.
    for (const [re, name] of AI_HOSTS) if (re.test(host)) return { name, kind: "AI assistant" };
    for (const [re, name] of SEARCH_HOSTS) if (re.test(host)) return { name, kind: "organic search" };
    for (const [re, name] of SOCIAL_HOSTS) if (re.test(host)) return { name, kind: "social" };
    return { name: host, kind: "referral" };
  }
  return { name: "Direct", kind: "direct" };
}

/* ---------- CRM output ---------- */

function touchDetail(touch: Touch): string[] {
  const lines: string[] = [];
  const utm = (["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const)
    .filter((k) => touch[k])
    .map((k) => `${k.replace("utm_", "")}=${touch[k]}`);
  if (utm.length) lines.push(`  UTM: ${utm.join(" · ")}`);
  const ids = (["gclid", "gbraid", "wbraid", "fbclid", "msclkid"] as const)
    .filter((k) => touch[k])
    .map((k) => `${k}=${touch[k]}`);
  if (ids.length) lines.push(`  Click ID: ${ids.join(" · ")}`);
  if (touch.referrer) lines.push(`  Referrer: ${touch.referrer}`);
  else if (!utm.length && !ids.length) {
    lines.push("  Referrer: none — typed or bookmarked, or the app hid it (Instagram often does)");
  }
  if (touch.landingPage) lines.push(`  Landing page: ${touch.landingPage}`);
  if (touch.at) lines.push(`  Arrived: ${touch.at}`);
  return lines;
}

function sameTouch(a?: Touch, b?: Touch): boolean {
  return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});
}

/** The "how they found us" block for the contact note. */
export function attributionNoteLines(attribution: Attribution | undefined): string[] {
  if (!attribution || (!attribution.last && !attribution.first)) {
    return ["Lead source: not captured (the form was sent without it)"];
  }
  const last = attribution.last ?? attribution.first;
  const ch = channelOf(last);
  const lines = [`Lead source: ${ch.name} (${ch.kind})`, ...touchDetail(last as Touch)];
  if (attribution.first && !sameTouch(attribution.first, last)) {
    const fc = channelOf(attribution.first);
    lines.push(`First visit: ${fc.name} (${fc.kind})`, ...touchDetail(attribution.first));
  }
  return lines;
}

/** "source: instagram" — one tag per lead, from the converting arrival. */
export function attributionTag(attribution: Attribution | undefined): string | null {
  if (!attribution) return null;
  const ch = channelOf(attribution.last ?? attribution.first);
  return `source: ${ch.name.toLowerCase()}`;
}

/** Flat key/values for the inbound-webhook payload (mappable fields). */
export function attributionFlat(attribution: Attribution | undefined): Record<string, string> {
  const last = attribution?.last ?? attribution?.first;
  const out: Record<string, string> = {
    lead_source: last ? channelOf(last).name : "",
    lead_source_kind: last ? channelOf(last).kind : "",
    first_touch_source: attribution?.first ? channelOf(attribution.first).name : "",
  };
  for (const key of TOUCH_KEYS) {
    const k = key === "landingPage" ? "landing_page" : key === "at" ? "arrived_at" : key;
    out[k] = last?.[key] ?? "";
  }
  return out;
}
