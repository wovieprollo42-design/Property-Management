# Management Quote · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/management-quote` |
| Page title | Request a Property Management Quote | East Central MN |
| Meta description | Tell us about your long-term or short-term rental in East Central Minnesota and discuss management services for your property. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/management-quote` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-intro.html` (full-width section, background `#F8F5EC`)
3. `02-owner-form.html` (full-width section, background `#FFFEFB`)
4. `03-what-happens-next.html` (full-width section, background `#172D3B`)
5. `04-rental-instead.html` (full-width section, background `#F8F5EC`)
6. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-intro.html` | Warm ivory `#F8F5EC` |
| 2 | `02-owner-form.html` | Warm white `#FFFEFB` |
| 3 | `03-what-happens-next.html` | Deep navy `#172D3B` |
| 4 | `04-rental-instead.html` | Warm ivory `#F8F5EC` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
