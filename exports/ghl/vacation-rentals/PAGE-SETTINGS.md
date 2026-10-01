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

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-hero.html` (full-width section, background `#FAF7F1`)
3. `02-property-cards.html` (full-width section, background `#FFFFFF`)
4. `03-before-you-book.html` (full-width section, background `#EFEAE0`)
5. `04-guest-updates.html` (full-width section, background `#26272C`)
6. `05-owner-path.html` (full-width section, background `#FFFFFF`)
7. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-hero.html` | Ivory `#FAF7F1` |
| 2 | `02-property-cards.html` | White `#FFFFFF` |
| 3 | `03-before-you-book.html` | Warm stone `#EFEAE0` |
| 4 | `04-guest-updates.html` | Charcoal `#26272C` |
| 5 | `05-owner-path.html` | White `#FFFFFF` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
