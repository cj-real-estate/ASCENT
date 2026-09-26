import type { Vertical } from "@content/verticals/types";

/*
 * The registered postal address, formatted once.
 *
 * It renders in the footer of both sites and in the contact section of
 * /privacy and /terms because A2P 10DLC brand registration and the
 * carriers expect the sending business's address to be findable on its
 * site, and a reviewer comparing the site to the registration should find
 * the same street, city and ZIP. The same parts also feed `streetAddress`
 * and `postalCode` in the PostalAddress JSON-LD.
 *
 * Returns null when the vertical has no street on file, so a caller renders
 * nothing rather than a half address.
 */
export function formatAddress(business: Vertical["business"]): string | null {
  if (!business.street) return null;
  const cityLine = [business.city, business.region].filter(Boolean).join(", ");
  return [business.street, cityLine, business.postalCode]
    .filter(Boolean)
    .join(business.postalCode ? " " : ", ")
    .replace(`${business.street} `, `${business.street}, `);
}

/*
 * The phone number in E.164, and the `tel:` href built from it.
 *
 * The display string is written the way a reader expects to see it
 * ("405-563-7863"); a dialler wants the digits with a country code, and
 * `telephone` in the JSON-LD is best given the same way. A bare
 * ten-digit number dials correctly from a US handset but is ambiguous to
 * anything else, so the +1 is added when the content module has not
 * written one itself.
 *
 * Both return null when the vertical has no number on file, so a caller
 * renders its placeholder — or omits the property — rather than emitting
 * an empty one.
 */
export function telE164(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^+\d]/g, "");
  if (digits.startsWith("+")) return digits;
  return digits.length === 10 ? `+1${digits}` : digits;
}

export function telHref(phone: string | null): string | null {
  const e164 = telE164(phone);
  return e164 ? `tel:${e164}` : null;
}
