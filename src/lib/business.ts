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
