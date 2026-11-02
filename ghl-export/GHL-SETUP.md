# Moving ascentforsponsors.com into GoHighLevel

This folder is the sponsor site as paste-ready code for a GHL website. Every
page looks the same as it does on Vercel today. The fonts, images and hero
video stay hosted on ascentcas.com, which is not moving.

Do the steps in order. The site keeps running on Vercel until step 8, so
nothing breaks while you build.

Already done for you in GHL (Ascent location):

- Five contact custom fields for the optional demo questions:
  - Demo: offering type
  - Demo: raise size
  - Demo: monthly ad budget
  - Demo: when to start
  - Demo: anything else we should know

## 1. The pages

Create one website in **Sites → Websites** with these pages. The folder name
is the page path.

| Page | GHL path | Folder |
| --- | --- | --- |
| Home | `/` (home page) | `home` |
| Guides | `/guides` | `guides` |
| Privacy | `/privacy` | `privacy` |
| Terms | `/terms` | `terms` |
| SMS opt-in | `/sms-opt-in` | `sms-opt-in` |
| Book a demo calendar | `/schedule` | `schedule` |
| 506(b) vs 506(c) | `/guide-506b-vs-506c-real-estate-marketing` | same name |
| Finding accredited investors | `/guide-how-to-find-accredited-investors-real-estate-syndication` | same name |
| Cost per investor lead | `/guide-cost-per-investor-lead-506c-benchmarks` | same name |
| Speed to lead | `/guide-speed-to-lead-investor-acquisition` | same name |
| Accredited investor verification | `/guide-accredited-investor-verification-506c` | same name |
| Placement agent vs flat fee | `/guide-placement-agent-vs-flat-fee-investor-acquisition` | same name |
| Glossary | `/guide-investor-acquisition-glossary` | same name |

GHL paths can't contain a slash, so the guides moved from `/guides/<name>`
to `/guide-<name>`. All links in the export already use the new paths. Step 9
redirects the old ones.

## 2. Build each page (same steps for all 13)

1. Open the page in the builder. Delete the template's default header,
   footer and sections. The export brings its own header and footer.
2. Add one **full-width section**. Set its padding and margin to 0 and its
   background to none. Add one row with one column, also with 0 padding.
3. Drop a **Custom JS/HTML** element into the column. Paste the entire
   `body.html` from the page's folder. Save.
4. Open the page's **Settings → Head tracking code** and paste the entire
   `head.html`. This carries the title, description, social preview and
   search data.
5. Preview at desktop and phone width. It should match the live site.

The home page body is about 118 KB. If GHL refuses to save that much in one
element, split it at `<section` boundaries across two or three Custom
JS/HTML elements in the same column. Keep the `<style>` block in the first
one.

## 3. The "Book a demo" form

Build it in **Sites → Forms** (or as a two-slide Survey if you want the
questions on their own step).

Fields, in this order:

1. First and last name (required)
2. Company (optional)
3. Email (required)
4. Phone (required)
5. Checkbox, **not required, not pre-checked**, placed directly under the
   phone field, with this exact text:

   > I consent to receive non-marketing text messages from ASCENT CLIENT
   > ACQUISITION SYSTEMS LLC about my scoping call, including confirmations,
   > reminders and scheduling updates, at the number provided. Msg frequency
   > varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out.

6. Checkbox, **not required, not pre-checked**, with this exact text:

   > By checking this box, I agree to receive marketing text messages from
   > ASCENT CLIENT ACQUISITION SYSTEMS LLC at the number provided, including
   > messages sent by autodialer. Consent is not a condition of purchase. Msg
   > & data rates may apply. Msg frequency varies. Reply HELP for help, STOP
   > to opt out.

7. A text line under both boxes with links to `/privacy` and `/terms`.
8. The five **Demo:** custom fields, all optional. Their answer choices are
   already set up in GHL.

Copy the two consent sentences character for character. They match your
A2P 10DLC registration, and carriers check the live wording against it.

Form settings:

- **On submit:** redirect to `/schedule`. That page shows the calendar with a
  "Not now" button.
- Style: dark background `#0d0d0d`, white text, orange button `#e2571d`,
  font IBM Plex Sans.

Then copy the form's **embed code** and paste it into the home page's
`body.html`. Replace this line inside the Booking section:

```html
<!-- PASTE THE GHL LEAD FORM EMBED CODE HERE (see GHL-SETUP.md) -->
```

Every "Book a demo" button on the site scrolls to that form.

## 4. The SMS opt-in form

Build a second form with name, phone and the same two checkboxes, word for
word. Paste its embed code into `sms-opt-in/body.html`, replacing the
`SMS OPT-IN FORM EMBED CODE` comment.

## 5. Tags and the owner alert

Your owner alert workflow fires on the **website lead** tag. Forms don't add
tags by themselves, so add one workflow:

- **Trigger:** Form submitted, filtered to the Book a demo form
- **Action:** Add tags `website lead`, `page: sponsors`, `demo`
- **If/else:** transactional box checked → add tag `sms consent: transactional`
- **If/else:** marketing box checked → add tag `sms consent: marketing`

Do the same for the SMS opt-in form with `page: sms opt-in`.

Reminder and promo texts must keep filtering on those two consent tags, so a
number only gets the kind of text it agreed to.

## 6. Tracking

In **Sites → Websites → (this site) → Settings → Head tracking code**, paste:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18403357820"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18403357820');
</script>
```

On the `/schedule` page only, add this to its head tracking code so Google
Ads counts a lead when someone reaches the calendar:

```html
<script>
  gtag('event', 'conversion', { send_to: 'AW-18403357820/CG1nCJmW2eUcEPzos8dE' });
</script>
```

GHL's own page tracking works on its own. You don't need the external
tracking script on GHL-hosted pages.

## 7. Check everything on the GHL preview link

Before moving the domain:

- Every page loads with the right fonts, and the hero video plays.
- Every "Book a demo" button reaches the form.
- A test submission redirects to `/schedule`, shows up in Contacts with the
  right tags and Demo fields, and triggers the owner alert.
- Delete the test contact afterward.

## 8. Move the domain

1. In GHL: **Settings → Domains → Add domain** → `ascentforsponsors.com`. Also
   add `www`. Link it to this website and set Home as the root page.
2. GHL shows the DNS records it needs (an A record for the root, a CNAME for
   `www`). At your domain registrar, replace the current Vercel records with
   those. Leave `links.ascentforsponsors.com` alone. It already points at
   GHL for the calendar.
3. In Vercel, remove `ascentforsponsors.com` and `www.ascentforsponsors.com`
   from the project. **Do not remove ascentcas.com.** The site's fonts,
   images and video load from it.
4. Wait for GHL to issue SSL. This usually takes minutes but can take up to a
   few hours. Then open the site and check that the padlock shows.

## 9. Redirects

Once the domain is live in GHL, add these in **Settings → Domains → URL
redirects** (301). Claude can create them through the GHL connector if you
ask:

| From | To |
| --- | --- |
| `/guides/506b-vs-506c-real-estate-marketing` | `/guide-506b-vs-506c-real-estate-marketing` |
| `/guides/how-to-find-accredited-investors-real-estate-syndication` | `/guide-how-to-find-accredited-investors-real-estate-syndication` |
| `/guides/cost-per-investor-lead-506c-benchmarks` | `/guide-cost-per-investor-lead-506c-benchmarks` |
| `/guides/speed-to-lead-investor-acquisition` | `/guide-speed-to-lead-investor-acquisition` |
| `/guides/accredited-investor-verification-506c` | `/guide-accredited-investor-verification-506c` |
| `/guides/placement-agent-vs-flat-fee-investor-acquisition` | `/guide-placement-agent-vs-flat-fee-investor-acquisition` |
| `/guides/investor-acquisition-glossary` | `/guide-investor-acquisition-glossary` |

Then resubmit the sitemap GHL generates in Google Search Console.

## What doesn't carry over

- `llms.txt`, the hand-built sitemap and robots rules. GHL makes its own
  sitemap.
- The site's own lead capture code: first-touch source tags (`source:
  google ads` and so on), the sheet webhook copy of each lead, and the
  in-page conversion ping. GHL's form attribution and the `/schedule`
  conversion replace these.
- Vercel Analytics for this domain. Use GHL's site stats instead.
- Changes to the site's copy. Edits are made in GHL from now on, or in this
  repo, followed by a re-export (below) and a re-paste.

## Undo

Point the DNS records back to Vercel and re-add the domain in the Vercel
project. The Vercel site stays deployed, so it comes back as soon as DNS
updates.

## Re-exporting after a change

With the site built and running locally on port 3251:

```sh
node scripts/build-ghl-export.mjs
node scripts/build-ghl-schedule.mjs
```

Re-paste the page's `body.html`. If you do, put the form embed code back.
