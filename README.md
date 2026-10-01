# Property Management Professionals · website preview and GHL exports

The complete design preview of the Property Management Professionals website (13 pages), built from
the *Website Master Brief* (September 30, 2026, in `docs/`), plus separately installable GHL
Custom JS/HTML section snippets generated from the same files.

This is a **design build**. Nothing here is published, no form or booking system is connected, and
no GHL setting has been changed.

---

## 1. Open the preview

You need [Node.js](https://nodejs.org) 18 or newer (no other installs, no `npm install`).

**Easiest (Windows):** double-click `Open preview.cmd`. It builds the site, opens your browser, and
keeps running until you close the window.

**From a terminal (VS Code: Terminal → New Terminal):**

```
npm run preview
```

Then open **http://localhost:4321**. Stop it with `Ctrl + C`.

Every page opens directly by its address (for example http://localhost:4321/faqs) and survives a
refresh. An unknown address shows a real "page not found" page with a 404 status.

The whole preview is kept out of search engines (a `noindex` tag on every page plus a `noindex`
header from the preview server).

---

## 2. How the project is organized

```
shared/                         used by every page
  tokens.css                    brand colors, fonts, sizes, spacing (change a brand value here)
  base.css                      scoped type, layout and backgrounds
  components.css                buttons, photo placeholders, form slots, FAQ accordion, wordmark
  header.html                   header, Management Services dropdown, mobile menu
  footer.html                   footer
  preview/preview.css           preview-only page shell (not exported)

pages/                          one folder per page, one file per section
  home/
    page.json                   the page's assembly file: route, SEO title, description, section order
    01-hero.html                one section = its markup + its own scoped styles
    02-management-services.html
    ...
  long-term-rental-management/  short-term-rental-management/  about/  faqs/
  management-quote/  available-rentals/  rental-prequalification/  vacation-rentals/
  thank-you/management-thank-you/  thank-you/prequalification-thank-you/
  legal/privacy-policy/  legal/terms-of-service/
  not-found/                    the 404 page
  card-templates/               internal preview of listing cards (not a public page)

exports/ghl/                    GENERATED paste-ready GHL snippets, one folder per page
docs/                           brief, route map, inventories, install guide, launch checklist
dist/                           GENERATED preview site (not stored in git)
build.mjs                       builds dist/, exports/ghl/ and the generated docs, and checks everything
serve.mjs                       the local preview server
```

## 3. How to edit

1. Find the section in `pages/<page>/`. Each file starts with a note saying what it is, its
   background color, any photo slot, and how to replace it.
2. Edit the text or layout. Styles at the bottom of a section file only affect that section,
   because every rule starts with the section's own ID (for example `#pmp-home-hero`).
3. Run `npm run build` (or re-run `Open preview.cmd`) and refresh the browser.

The build **refuses to finish** if something is wrong and tells you exactly what: an unscoped style,
a missing background, two H1s on a page, a skipped heading level, a broken internal link or anchor,
a duplicate ID, unmarked `[bracket]` text, an image without alt text or dimensions, or a repeated
page title.

- **Change the order of sections:** edit the `sections` list in that page's `page.json`.
- **Change a brand color or font size everywhere:** edit `shared/tokens.css`.
- **Change the menu or footer:** edit `shared/header.html` or `shared/footer.html`.
- **Add a photo:** follow the `Replace the placeholder with:` note at the top of the section file.
- **Add a rental listing or vacation property:** see the note at the top of
  `pages/available-rentals/02-current-listings.html` or `pages/vacation-rentals/02-property-cards.html`.
  Preview the card design at http://localhost:4321/preview-card-templates.

Details still waiting for confirmation appear in **dashed gold boxes** (for example
`[Confirmed management phone]`). Form, booking and signup areas are marked
**"not connected"**. Both are intentional and listed in `docs/launch-checklist.md`.

## 4. Documents

| File | What it is |
| --- | --- |
| `docs/Property_Management_Website_Master_Brief.pdf` | The source of truth |
| `docs/route-map.md` | Every page, its address, main action and indexing plan |
| `docs/section-inventory.md` | Every section of every page, its background, photo and form slots, and its GHL export file (generated) |
| `docs/installation-guide.md` | Step-by-step GHL installation |
| `docs/seo-settings.md` | Titles, descriptions, H1s, launch indexing and canonicals (generated) |
| `docs/sitemap-template.xml` | Production sitemap template (generated) |
| `docs/image-inventory.md` | Every photo slot with size, ratio and crop guidance (generated) |
| `docs/launch-checklist.md` | Everything still needed before launch, and who confirms it |
| `docs/qa-report.md` | What was tested, the results, and what remains unverified |
