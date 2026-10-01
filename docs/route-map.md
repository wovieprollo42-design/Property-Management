# Route map

All 13 routes from the Master Brief (section 7) are built, plus a 404 page and one internal preview page.
Every route opens directly and survives a refresh in the preview.

| Page | Path | Main action | Source folder | In navigation | Indexing at launch |
| --- | --- | --- | --- | --- | --- |
| Home | `/` | Request a Management Quote | `pages/home` | Yes | index |
| Long-Term Rental Management | `/long-term-rental-management` | Owner quote | `pages/long-term-rental-management` | Management Services dropdown | index |
| Short-Term Rental Management | `/short-term-rental-management` | Owner quote | `pages/short-term-rental-management` | Management Services dropdown | index |
| About | `/about` | Owner quote | `pages/about` | Yes | index |
| FAQs | `/faqs` | Owner quote (plus renter and guest next steps) | `pages/faqs` | Yes | index |
| Management Quote | `/management-quote` | Owner form | `pages/management-quote` | Header button | index |
| Available Rentals | `/available-rentals` | Approved listing and prequalification | `pages/available-rentals` | Yes | index |
| Rental Prequalification | `/rental-prequalification` | Separate applicant form | `pages/rental-prequalification` | No (reached from rentals pages) | index |
| Vacation Rentals | `/vacation-rentals` | Approved property booking destination | `pages/vacation-rentals` | Yes | index |
| Owner Thank You | `/management-thank-you` | Return to services | `pages/thank-you/management-thank-you` | No | **noindex** |
| Applicant Thank You | `/prequalification-thank-you` | Return to listings | `pages/thank-you/prequalification-thank-you` | No | **noindex** |
| Privacy Policy | `/privacy-policy` | Read policy | `pages/legal/privacy-policy` | Footer | **noindex** until approved |
| Terms of Service | `/terms-of-service` | Read terms | `pages/legal/terms-of-service` | Footer | **noindex** until approved |
| Page not found | any unknown address (404 status) | Back to Home | `pages/not-found` | No | noindex |
| Card templates (internal) | `/preview-card-templates` | Review card layouts | `pages/card-templates` | No (preview bar link only) | never published |

## Navigation

**Desktop header (1240 px and wider):** Home · Management Services (dropdown: Long-Term Rental
Management, Short-Term Rental Management) · Available Rentals · Vacation Rentals · About · FAQs ·
**Request a Management Quote** button.

**Tablet and small laptop (440 to 1239 px):** wordmark, the quote button ("Request a Management Quote",
shortened to "Request a Quote" below 720 px) and a **Menu** button.

**Phone (below 440 px):** wordmark and **Menu** button. The menu lists every destination above, with the
quote button at the end; the quote button also appears in the first screen of the home and service pages.

**Footer:** For owners (Long-Term Management, Short-Term Management, Request a Quote, FAQs) ·
Renters and guests (Available Rentals, Vacation Rentals) · Company (About, Privacy Policy, Terms of
Service).

## Journeys

- **Owner:** any page → Request a Management Quote → `/management-quote` → owner form → `/management-thank-you`
  → GHL owner pipeline (not configured by this build).
- **Long-term renter:** Home or footer → `/available-rentals` → approved listing (none approved yet; honest
  empty state) → `/rental-prequalification` → applicant form → `/prequalification-thank-you`.
- **Vacation guest:** Home or footer → `/vacation-rentals` → each property's approved booking page (none
  approved yet; honest empty state). Owners of vacation homes are sent to `/short-term-rental-management`.

## Internal links

| From | Links to |
| --- | --- |
| Home | Both service pages, the quote page, Available Rentals, Vacation Rentals |
| Long-term page | Quote, FAQs, short-term page |
| Short-term page | Quote, Vacation Rentals, long-term page |
| About | Quote, both service pages, Property Maintenance Professionals (external, new tab) |
| FAQs | Quote (owners), Available Rentals (renters), Vacation Rentals (guests) |
| Management Quote | Available Rentals, Rental Prequalification (for renters who landed there) |
| Available Rentals | Rental Prequalification |
| Rental Prequalification | Available Rentals |
| Vacation Rentals | Short-term page (owner path); property booking pages once approved |
| Thank-you pages | Long-term page or Available Rentals, and Home |
