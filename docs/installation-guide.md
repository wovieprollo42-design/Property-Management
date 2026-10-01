# GHL installation guide

For whoever installs the website in the Property Management Professionals GHL subaccount.
Install only after the items marked "before install" in `launch-checklist.md` are confirmed.

A local preview does not appear in GHL by itself. Every section has to be pasted into GHL as described
here, and the page settings (title, description, indexing) are set in GHL's page settings, not in the code.

---

## What you are installing

`exports/ghl/` holds one folder per page. Each `.html` file in a folder is **one section**, ready to
paste into one GHL **Custom JS/HTML** element (the builder may call it "Code" or "Custom Code").

- Each snippet is complete on its own: it carries the brand styles, the section's own styles and any
  script it needs. You can install, remove or reorder any section without breaking the others.
- Snippets have no `<html>`, `<head>` or `<body>` tags, and every style is scoped to the section, so
  they do not restyle other GHL elements.
- Each page folder also has a `PAGE-SETTINGS.md` with that page's path, SEO title, description,
  indexing setting, install order and section background colors.
- `exports/ghl/shared/header.html` and `footer.html` are the header and footer for every page.

Always regenerate the exports after editing a source file: run `npm run build`, then paste the new
snippet. Do not edit snippets inside GHL, or the preview and the live site will drift apart.

---

## Step 1 · Create the pages

Create one page per route, using exactly these paths (the snippets link to them):

| Page | Path |
| --- | --- |
| Home | `/` |
| Long-Term Rental Management | `/long-term-rental-management` |
| Short-Term Rental Management | `/short-term-rental-management` |
| About | `/about` |
| FAQs | `/faqs` |
| Management Quote | `/management-quote` |
| Owner Thank You | `/management-thank-you` |
| Available Rentals | `/available-rentals` |
| Rental Prequalification | `/rental-prequalification` |
| Applicant Thank You | `/prequalification-thank-you` |
| Vacation Rentals | `/vacation-rentals` |
| Privacy Policy | `/privacy-policy` |
| Terms of Service | `/terms-of-service` |

If GHL forces a different path format (for example funnel step paths), note the real paths and update
the links in the source files, then rebuild. Every link must point at a real page; never publish `#`
placeholders.

## Step 2 · Page settings (per page)

Open the page's `PAGE-SETTINGS.md` and copy into the GHL page settings:

1. **Title** and **meta description**.
2. **Indexing:** the thank-you pages and the legal review drafts stay **noindex**. The other public
   pages switch to indexable only at launch (see `seo-settings.md`).
3. **Canonical URL** on the confirmed HTTPS domain, if GHL offers the setting.
4. **Social preview image**, once approved photos exist.

Do not paste title, description or robots tags into any Custom JS/HTML element. Record any setting
GHL does not offer in `launch-checklist.md`.

## Step 3 · Add each section

For every snippet listed in the page's install order:

1. **Add a section.** Set it to **full width**, padding **0** on all sides, and its **background
   color** to the hex value shown in `PAGE-SETTINGS.md` (for example `#F8F5EC`). Never leave it
   transparent.
2. **Add a row** inside it with **one column**. Set the row to **full width**, padding **0**,
   margin **0**, and the **same background color** as the section.
3. **Add a Custom JS/HTML element** to the column. Set its padding and margin to **0**.
4. Open the snippet file in a text editor (VS Code or Notepad), select everything, copy, and paste
   it into the element. Save.

Background colors used by the sections:

| Color | Hex | Used for |
| --- | --- | --- |
| Warm ivory | `#F8F5EC` | Page background and main sections |
| Warm white | `#FFFEFB` | Header and light sections |
| Pale sage gray | `#E9EDE9` | Alternate sections |
| Deep navy | `#172D3B` | Footer and emphasis sections |

Also set the **page background** (page or site settings) to warm ivory `#F8F5EC`, so no gap between
GHL rows ever shows a different color.

## Step 4 · Header, footer, logo and favicon

1. On the first page, install `shared/header.html` as the **first** section (background `#FFFEFB`) and
   `shared/footer.html` as the **last** section (background `#172D3B`).
2. Save each as a **global section** if GHL offers it, then add the same global section to every
   other page. One edit then updates every page.
3. **Sticky header:** in the preview the header stays at the top while scrolling. Inside GHL, a code
   element cannot stick on its own; turn on GHL's own **sticky** option for the header section if you
   want it. Check that the sticky header does not cover the dropdown or jump links.
4. The header marks the current page automatically, and its dropdown and mobile menu work inside GHL
   with no extra setup.
5. **Logo:** the header and footer snippets already contain the logo, embedded in the code, so they show it
   with no upload. To make the pages lighter, you can upload `exports/ghl/brand/logo-full.webp` to the GHL media
   library and replace the long `data:image/webp;base64,…` value in each snippet's `src` with the media URL.
6. **Favicon:** in the site settings, upload `exports/ghl/brand/favicon-192.png` (or `favicon.ico`) as the
   favicon.

## Step 5 · Replacement points

These are the only places that need real content. Everything else is final design.

### Photos (40 photo slots including the card templates; see `image-inventory.md`)

The preview shows sample stock photos so the design looks real. **They are not in the exports and must not be
used on the live site as if they were Bob's properties.** The exports keep the placeholders below.

Each placeholder is a `<div class="pmp-ph ..." data-photo-slot="...">` block. The comment at the top of
each section file gives the exact `<img>` tag to use instead. Upload the approved photo to the GHL
media library, copy its URL, and replace the whole placeholder `div` with:

```html
<img class="pmp-photo pmp-photo--4x3" src="PHOTO-URL" alt="Describe the actual scene"
     width="1200" height="900" loading="lazy" decoding="async">
```

Use the ratio class of the slot (`--8x5`, `--4x3` or `--4x5`) and its source width and height.

**Photo bands** (`pmp-ph--bg`, on navy sections such as Home "Getting started", Quote "What happens next"
and Vacation "Hear about future stays") take a wide photo toned into the navy. Replace the placeholder with:

```html
<img class="pmp-photo" src="PHOTO-URL" alt="" width="1920" height="1080" loading="lazy" decoding="async"
     style="position:absolute;inset:0;z-index:-1;width:100%;height:100%;object-fit:cover;opacity:.22;mix-blend-mode:luminosity">
```

Keep `alt=""` there: the photo is decorative behind text. Check that the white text stays easy to read.
**Photo cards** (`pmp-pcard`) use the normal 4:3 replacement inside the link. The
first photo on each page (the hero) uses `fetchpriority="high"` instead of `loading="lazy"`. Compress
photos before uploading. Write alt text that describes what is really in the photo, without adding
towns or claims that are not confirmed. Then rebuild and re-paste the section.

### Owner form (`management-quote/02-owner-form.html`, slot `ghl-owner-form`)

1. Build a **new, dedicated** property-owner form in GHL. Required: name, email, property city/state,
   rental type, support needed. Optional: phone, property address, number of units/properties,
   occupancy, desired start timing, preferred contact method.
2. Keep any text or email **opt-in separate** from submitting the inquiry, with wording that matches
   the real messaging program.
3. Set the form's **on-submit action** to redirect to `/management-thank-you`.
4. In the section file, replace the whole `<div class="pmp-slot" data-slot="ghl-owner-form">…</div>`
   block with the form's **embed code** (from the form's share or integrate options). Or delete the
   block and place GHL's native **Form** element directly under that section, in a row with the same
   `#FFFEFB` background.
5. Test a real submission: exactly one contact, one opportunity, one note, one internal notification,
   the right acknowledgment, and the thank-you page appearing only after success.

### Applicant form (`rental-prequalification/02-applicant-form.html`, slot `applicant-form`)

Use only the approved applicant form (see `launch-checklist.md`): the existing GHL form after review,
or the DoorLoop preliminary form if Bob chooses it. Replace the slot block with its embed code (or a
native Form element), keep the form's own submit button, and redirect success to
`/prequalification-thank-you`. Applicant submissions must stay out of owner and guest campaigns.

### Booking destination (`vacation-rentals/02-property-cards.html`, slot `pms-booking`)

Leave the slot out of the live page until the PMS booking flow is tested. At launch the site only links
to each property's approved booking page from its card. Never show "Book Direct" or live rates before
the direct booking flow works. Do not build a calendar, price calculator or checkout in GHL.

### Guest updates signup (`vacation-rentals/04-guest-updates.html`, slot `guest-email-signup`)

Add a separate guest email signup form only when sender identity and unsubscribe handling are ready.
Until then, **do not install this section**.

### Listings (`available-rentals/02-current-listings.html` and `vacation-rentals/02-property-cards.html`)

Follow the note at the top of each file: paste one card template per approved property between the
`CARDS` markers, fill in verified details, and delete the empty-state block. Until then the honest empty
state stays.

### Pending details (dashed gold boxes)

Search the source for `pmp-pending`. Replace each box, and the `<span class="pmp-pending">` around
it, with the confirmed wording: the legal identity and DBA wording (footer) and the remaining items in the
legal drafts (effective date, operator, mailing address and the policy details). The phone number and email
are already in place.

## Step 6 · Check the installed page

- [ ] Every section shows its solid background, with no white or transparent gaps between rows.
- [ ] The header dropdown opens with a mouse and with the keyboard (Tab, Enter, arrow keys, Escape).
- [ ] The mobile menu opens, lists every page, and closes with Escape.
- [ ] No sideways scrolling at phone width; forms are comfortable on a phone.
- [ ] Every button and link goes to the right page.
- [ ] Only one H1 per page (the GHL page itself must not add another heading styled as H1).
- [ ] The live page source has the right title, description and robots setting.
- [ ] No dashed pending boxes, "INSERT PHOTO" labels or "not connected" slots remain on a live page.
