# A2P 10DLC — what the site does, and what you submit

A2P 10DLC is the carriers' registration for business texting from a normal
10-digit number. GoHighLevel resells it: you register the business (a brand)
and then the messaging program (a campaign), and a third-party reviewer
reads your website before approving the campaign. Almost every rejection is
the website, not the paperwork.

This file records what is built into the site, so the answers on the form
match what a reviewer will actually find, and what only you can do.

---

## The one URL to submit

**Opt-in URL: `https://ascentcas.com/sms`**

That page exists for the review. It is one screen with the mobile-number
field and both consent checkboxes visible on arrival, it names the
registered entity and its address, and it links to the privacy policy and
the terms. Every other form
on the site collects a number too, but they all sit behind the ICP gate's
question cards — a reviewer who lands on the homepage cannot see a phone
field without clicking through a wizard, and "no visible opt-in form" is a
rejection.

Use the `ascentcas.com` domain when a field asks for the website: the
registered entity is **Ascent Client Acquisition Systems LLC** and that
domain is the one whose name matches it. `ascentforsponsors.com` is the same
company and carries the same consent boxes, policy and terms, but a reviewer
comparing a name to a domain should be given the easy match.

## What is on the site already

| Requirement | Where it is | File |
|---|---|---|
| Phone field on a live, public URL | `/sms`, plus the contact step of every gate form — the phone is the LAST field in both, so the boxes sit directly below it | `src/components/SmsOptInForm.tsx`, `src/components/QualifyFlow.tsx` |
| Two consent checkboxes, unchecked, not required | Directly below the phone field on both | `src/components/SmsConsentFields.tsx` |
| The exact consent wording | Two constants, imported by both forms | `content/compliance.ts` |
| Privacy policy linked from the forms | One links row under both boxes, plus every footer | `src/app/privacy`, `src/app/sponsors/privacy` |
| The mobile-data no-sharing clause | In both policies, verbatim | `MOBILE_DATA_NO_SHARING` in `content/compliance.ts` |
| Terms page covering the SMS program | Both domains | `src/app/terms`, `src/app/sponsors/terms` |
| Program name, both consent types, frequency, rates, HELP/STOP, support contact | The terms page's program table | `smsProgramTerms()` in `content/compliance.ts` |
| The registered postal address | Both footers, and the contact section of both policies and both terms pages | `business.street` / `postalCode`, rendered by `formatAddress()` in `src/lib/business.ts` |

## Two consents, not one

Every form collects two separate permissions, in this order, directly below
the phone field:

1. **Transactional (non-marketing)** — confirmations, reminders and
   scheduling updates for the call the person booked. This is the consent
   that makes an appointment reminder lawful.
2. **Marketing** — promotional messages. Never implied by the first.

They are independent: someone may tick one, both or neither, and each is
recorded and filtered on separately. Collapsing them back into one box
would mean sending a reminder on the strength of a marketing consent, or
worse, marketing on the strength of a reminder consent.

The transactional sentence names the call the form is actually booking —
"scoping call" on ascentforsponsors.com, "strategy call" on ascentcas.com,
from each vertical's `smsCallName`. Every disclosure in it (frequency,
rates, HELP/STOP) is identical wherever it renders; only that noun changes.

Four properties of the boxes are compliance rather than design, and
changing any one of them is a rejection on its own:

1. **Both start unchecked.** The caller owns the state and initialises both
   to `false`; there is no `defaultChecked` in the component to get wrong.
2. **Neither is required.** Nothing validates either — every form on the
   site submits identically whichever, or neither, is ticked.
3. **They are independent.** Ticking one never sets the other.
4. **Both sentences are quoted** and name the legal entity. They live in
   one module so the forms, the policies and the terms can never drift
   apart, which is the other thing reviewers check.

## Where consent is recorded

A ticked box is proof only if you can produce it later. On submit:

- The contact in GoHighLevel gets **one tag per consent**:
  `sms consent: transactional` and/or `sms consent: marketing`. Only a
  ticked box earns its own tag. **Filter your reminder workflows on the
  transactional tag and your promotional ones on the marketing tag** — then
  neither can reach a number that only agreed to the other kind of message.
- A note on the contact records both permissions separately, each with its
  timestamp and the exact wording that was on screen:

  ```
  SMS transactional consent: GIVEN 2026-09-10T…
  Consent shown: "I consent to receive non-marketing text messages from …"
  SMS marketing consent: NOT GIVEN — do not send marketing texts.
  ```

- The inbound-webhook payload carries six flat fields —
  `sms_consent_transactional`, `_at`, `_text` and `sms_consent_marketing`,
  `_at`, `_text` — so each can be mapped to its own custom field.
- The Google Sheet backstop gets both booleans as columns.
- The forms post `smsConsentTransactional` and `smsConsentMarketing`. A page
  cached from before the split posts the old single `smsConsent`, which is
  read as the marketing consent (it was); that fallback can be removed once
  no deployment serves the old bundle.

See `src/lib/ghl.ts` and `src/app/api/book/route.ts`.

## What you still have to do

1. **Register the brand** in GoHighLevel (Settings → Phone Numbers → Trust
   Center). Use the registered name **Ascent Client Acquisition Systems
   LLC**, the EIN exactly as it appears on the IRS letter, and the business
   address on the Oklahoma filing. A name or EIN that does not match the
   IRS record is the other common rejection, and it is not something the
   website can fix.
2. **Register the campaign.** Use-case: mixed or marketing. Describe it in
   the words the terms page uses — messages to people who submitted a form
   asking for a call, about scheduling and following up on that call.
3. **Paste the opt-in URL** above, and paste the consent sentences into the
   "how do subscribers opt in" field **exactly** as they appear on the site
   — both of them, labelled, since the form collects two permissions. Copy
   them from `content/compliance.ts` rather than retyping. For a
   marketing-use-case campaign the marketing sentence is the one being
   registered; include the transactional one so the reviewer sees why there
   are two boxes.
4. **Provide two sample messages** that match the program you described.
   Include the business name in the first message and an opt-out in it, e.g.

   > Ascent Client Acquisition Systems: Hi {name}, this is Caleb — you asked
   > about a strategy call. Are you free Thursday at 2pm? Reply STOP to opt
   > out.

   > Ascent Client Acquisition Systems: reminder of your call tomorrow at
   > 10am CT. Reply HELP for help, STOP to opt out.
5. **Confirm HELP and STOP actually work on the number.** GoHighLevel
   handles STOP automatically; check that a HELP reply gets an auto-response
   naming the business and a support contact.
6. **Make sure `info@ascentcas.com` and `info@ascentforsponsors.com` are
   real, monitored mailboxes.** The terms and privacy pages give them as the
   support contact, and a reviewer may email one.
7. **Check the address matches.** The site publishes
   1424 Highland Park Blvd, Oklahoma City, OK 73114 in both footers and in
   the contact section of both policies and both terms pages. It must be the
   same address as the brand registration and the state filing.

## If it is rejected

The rejection names a reason. Map it before changing anything:

- *No opt-in form / cannot find consent* → they landed somewhere other than
  `/sms`. Resubmit with that URL exactly.
- *Consent language mismatch* → the sentences in the form field must match
  the site character for character, and the site shows two. Copy from
  `content/compliance.ts`.
- *Privacy policy missing required clause* → confirm the policy still
  contains `MOBILE_DATA_NO_SHARING` verbatim; it is imported, so it is on
  both domains or neither.
- *Business information mismatch* → brand-level, not website. Compare to the
  IRS letter.
- *Website is a placeholder* → not applicable here, but do not point the
  registration at a domain that is parked or under construction.

Change wording in `content/compliance.ts` only. It is imported by both
forms, both policies and both terms pages, so a carrier-mandated edit lands
everywhere at once and nothing drifts.
