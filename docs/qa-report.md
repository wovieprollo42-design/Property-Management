# QA report · design preview

Tested 2026-10-01 in Chrome (headless, current stable) against the local preview server, then run again
in full after the brand redesign (real logo, contact bar, navy heroes, new photo placeholders) the same day.
All checks below passed on the final build. "Not verified" items at the end were **not** tested and
should not be assumed to work.

## "Does it look AI-generated?" audit (design gate)

| Tell | Result | Evidence |
| --- | --- | --- |
| Purple or indigo default palette | Clean | 0 hits; palette is the brief's navy, ivory, muted gold, bronze, slate, warm white, sage |
| Gradients, gradient text, glass blur, grain | Clean | 0 gradients or `backdrop-filter` in source |
| Fade-in on scroll everywhere | Clean | No scroll animations; motion is limited to hover and focus states |
| Em dashes in visitor copy | Clean | 0 in the built pages |
| Self-praise ("trusted", "seamless", "premier"…) | Clean | 0 |
| Small label above every heading | **Fixed** | Was 38 (on every section); now 11, on page intros only, plus 8 ribbons in the logo's banner shape |
| Empty gray photo boxes | **Fixed** | Placeholders now carry a line drawing in the logo's spirit, an INSERT PHOTO tag and a caption bar |
| Generic type | Judgement: kept | Manrope and DM Sans are the brief's chosen pair, not a default |

Target size note: phone and email links that sit inside a sentence are exempt from the 24 px target rule
(WCAG 2.2, 2.5.8 inline exception); every standalone link and button meets it.

## Build checks (run on every `npm run build`)

- All 13 routes, the 404 page and the internal card-templates page assemble from their section files.
- Every section selector is scoped to its own section ID; every shared selector is scoped to `.pmp`.
- Every section, the header and the footer declare a solid background from the approved palette.
- Section scripts only touch their own section (no document-wide queries or listeners).
- Exactly one H1 per page, the H1 comes first, and no heading level is skipped.
- Every internal link and in-page anchor resolves; no empty `#` links; no duplicate IDs; every
  `aria-labelledby` / `aria-controls` target exists.
- No bracketed placeholder text outside the visible dashed "pending" boxes.
- Unique SEO title and meta description on every public page.

## Browser checks

| Check | Result |
| --- | --- |
| 14 routes × 4 widths (1440, 1024, 768, 390 px): direct load and refresh return 200 | Pass (56 loads, 56 reloads) |
| Unknown address returns a 404 status and the not-found page, not Home | Pass at all 4 widths |
| Horizontal overflow | None on any route at any width |
| Browser console errors, failed requests, HTTP errors | None |
| One H1 in the rendered main content | Pass on every route |
| `noindex, nofollow` robots tag on every preview page; server sends `X-Robots-Tag: noindex` | Pass |
| Solid (non-transparent) background on every section, header and footer | Pass |
| Links and buttons in main content and header at least 24 px tall (most are 44 to 48 px) | Pass |
| Web fonts (Manrope, DM Sans) load | Pass |
| Web fonts blocked: layout falls back to Arial with no overflow (4 key pages, 390 and 1440 px) | Pass |
| Reduced motion: transitions removed, no running animations | Pass |

## Keyboard, menu and focus

| Check | Result |
| --- | --- |
| First Tab reaches "Skip to main content", which appears and moves focus to the page content | Pass |
| Visible 2 px focus ring (navy on light surfaces, gold on navy) | Pass |
| Management Services dropdown: Enter opens, ArrowDown opens and focuses the first link, arrow keys move between links, Escape closes and returns focus, tabbing out closes | Pass |
| Mouse: hover opens; moving away closes; a click pins it open until clicking elsewhere | Pass |
| Open dropdown sits above page content | Pass |
| Current page marked (`aria-current`), including Management Services on the service pages | Pass |
| In-page jump links land below the sticky header | Pass |
| FAQ answers open and close with Enter and Space | Pass |
| Mobile menu (390 px): opens and closes, switches Menu/Close, lists all 8 destinations, marks the current page, Escape closes and returns focus, fits the screen | Pass |
| Header quote button hidden below 440 px (it is in the menu and the first screen), shown from 440 px without overflow | Pass |
| Resizing to desktop closes an open mobile menu | Pass |

## Color contrast (WCAG 2.1)

| Pairing | Ratio | Needs |
| --- | --- | --- |
| Navy on ivory / warm white / sage | 13.06 / 14.12 / 12.04 | 4.5 |
| Slate body text on ivory / warm white / sage | 7.33 / 7.93 / 6.76 | 4.5 |
| Bronze small text on ivory / warm white / sage | 6.31 / 6.82 / 5.81 | 4.5 |
| Warm white on navy | 14.12 | 4.5 |
| Gold numerals (large text) and gold focus ring on navy | 4.39 | 3 |

Gold on ivory is only 2.98:1, so gold is never used for text on light surfaces, only for lines, marks
and borders.

## GHL export isolation

Each of the 44 exported snippets (42 page sections plus header and footer) was rendered **alone** on a
test page with deliberately hostile host styles (Times New Roman, red and purple text, 60 px uppercase
green headings, paragraph margins and 3× line height, list bullets and indents, padded divs and sections,
yellow buttons, content-box sizing), at 1440 px and 390 px. For all 88 renders:

- the section's height matched the assembled preview (within 2 px), so host styles did not change it;
- the background stayed solid and the heading colors stayed on-brand;
- no overflow and no script errors;
- no snippet contains `<html>`, `<head>` or `<body>` tags.

The first run of this test found real leakage (host paragraph font size, line height and color), which
was fixed with a scoped low-specificity reset in `shared/base.css` before the final run.

## Not verified

- **Inside the actual GHL builder.** No GHL page was created or edited. GHL's own section, row and
  element wrappers, its theme styles and its sticky option were simulated, not tested.
- **Real form submissions and redirects.** No form is connected. Thank-you routing, pipeline, notes,
  notifications and consent handling must be tested after the forms are built.
- **Booking.** No PMS or booking page is connected.
- **Browsers other than Chrome.** Safari (macOS and iOS), Firefox and Edge were not tested. In Safari on
  macOS, clicking a button does not give it focus, so a click-pinned dropdown may stay open until Escape
  or another click on the menu; check this on a Mac.
- **Real phones.** Mobile was tested with Chrome device emulation at 390 px, not on physical devices.
- **Screen readers.** Semantics (landmarks, headings, labels, `aria-expanded`, `aria-current`) were checked
  in code; no screen reader session was run.
- **Live SEO.** Indexing, canonicals, sitemap, robots and rankings can only be checked on the published
  site.
- **Photos.** Image loading, compression and crops will need a new check once real photos replace the
  placeholders.
