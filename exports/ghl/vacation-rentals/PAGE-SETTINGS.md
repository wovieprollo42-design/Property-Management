# Vacation Rentals · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/vacation-rentals` |
| Page title | Vacation Rentals in East Central Minnesota |
| Meta description | Explore East Central Minnesota vacation properties, compare verified features, and use each property's booking link for current availability and rates. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/vacation-rentals` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-hero.html` (full-width section, background `#F8F5EC`)
3. `02-property-cards.html` (full-width section, background `#FFFEFB`)
4. `03-before-you-book.html` (full-width section, background `#E9EDE9`)
5. `04-guest-updates.html` (full-width section, background `#172D3B`)
6. `05-owner-path.html` (full-width section, background `#FFFEFB`)
7. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-hero.html` | Warm ivory `#F8F5EC` |
| 2 | `02-property-cards.html` | Warm white `#FFFEFB` |
| 3 | `03-before-you-book.html` | Pale sage gray `#E9EDE9` |
| 4 | `04-guest-updates.html` | Deep navy `#172D3B` |
| 5 | `05-owner-path.html` | Warm white `#FFFEFB` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
