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
field and the consent checkbox visible on arrival, it names the registered
entity, and it links to the privacy policy and the terms. Every other form
on the site collects a number too, but they all sit behind the ICP gate's
question cards — a reviewer who lands on the homepage cannot see a phone
field without clicking through a wizard, and "no visible opt-in form" is a
rejection.

Use the `ascentcas.com` domain when a field asks for the website: the
registered entity is **Ascent Client Acquisition Systems LLC** and that
domain is the one whose name matches it. `ascentforsponsors.com` is the same
company and carries the same consent box, policy and terms, but a reviewer
comparing a name to a domain should be given the easy match.

## What is on the site already

| Requirement | Where it is | File |
|---|---|---|
| Phone field on a live, public URL | `/sms`, plus the contact step of every gate form | `src/components/SmsOptInForm.tsx`, `src/components/QualifyFlow.tsx` |
| Consent checkbox, unchecked, not required | Beside the phone field on both | `src/components/SmsConsentCheckbox.tsx` |
| The exact consent wording | One constant, imported by both forms | `content/compliance.ts` |
| Privacy policy linked from the form | The consent line's own link, plus every footer | `src/app/privacy`, `src/app/sponsors/privacy` |
| The mobile-data no-sharing clause | In both policies, verbatim | `MOBILE_DATA_NO_SHARING` in `content/compliance.ts` |
| Terms page covering the SMS program | Both domains | `src/app/terms`, `src/app/sponsors/terms` |
| Program name, frequency, rates, HELP/STOP, support contact | The terms page's program table | `smsProgramTerms()` in `content/compliance.ts` |

Three properties of the checkbox are compliance rather than design, and
changing any one of them is a rejection on its own:

1. **It starts unchecked.** The caller owns the state and initialises it to
   `false`; there is no `defaultChecked` in the component to get wrong.
2. **It is never required.** Nothing validates it — every form on the site
   submits identically whether or not it is ticked.
3. **The sentence is quoted verbatim** from the carrier template and names
   the legal entity. It lives in one constant so the form, the policy and
   the terms can never drift apart, which is the other thing reviewers
   check.

## Where consent is recorded

A ticked box is proof only if you can produce it later. On submit:

- The contact in GoHighLevel gets the tag **`sms consent`**. Only a ticked
  box earns it, so a texting workflow filtered on that tag can never reach a
  number that did not opt in. **Build your SMS workflows on that filter.**
- A note on the contact records the verdict, the timestamp, and the exact
  wording that was shown: `SMS consent: GIVEN <ISO time>` followed by
  `Consent shown: "<the sentence>"`. An unchecked submit says
  `SMS consent: NOT GIVEN — do not send marketing texts.`
- The inbound-webhook payload carries `sms_consent`, `sms_consent_at` and
  `sms_consent_text` as flat fields, so they can be mapped to custom fields
  in a workflow.
- The Google Sheet backstop gets the same two values as columns.

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
3. **Paste the opt-in URL** above, and paste the consent sentence into the
   "how do subscribers opt in" field **exactly** as it appears on the site.
   Copy it from `content/compliance.ts` rather than retyping it.
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

## If it is rejected

The rejection names a reason. Map it before changing anything:

- *No opt-in form / cannot find consent* → they landed somewhere other than
  `/sms`. Resubmit with that URL exactly.
- *Consent language mismatch* → the sentence in the form field must match
  the site character for character. Copy from `content/compliance.ts`.
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
