# Available Rentals · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/available-rentals` |
| Page title | Available Rentals in East Central Minnesota |
| Meta description | Explore current long-term rental listings in East Central Minnesota. Review property details and complete preliminary prequalification to get started. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/available-rentals` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-intro.html` (full-width section, background `#F8F5EC`)
3. `02-current-listings.html` (full-width section, background `#FFFEFB`)
4. `03-how-to-get-started.html` (full-width section, background `#E9EDE9`)
5. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-intro.html` | Warm ivory `#F8F5EC` |
| 2 | `02-current-listings.html` | Warm white `#FFFEFB` |
| 3 | `03-how-to-get-started.html` | Pale sage gray `#E9EDE9` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
