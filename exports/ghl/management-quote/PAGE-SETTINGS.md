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

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-intro.html` (full-width section, background `#FAF7F1`)
3. `02-owner-form.html` (full-width section, background `#FFFFFF`)
4. `03-what-happens-next.html` (full-width section, background `#26272C`)
5. `04-rental-instead.html` (full-width section, background `#FAF7F1`)
6. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-intro.html` | Ivory `#FAF7F1` |
| 2 | `02-owner-form.html` | White `#FFFFFF` |
| 3 | `03-what-happens-next.html` | Charcoal `#26272C` |
| 4 | `04-rental-instead.html` | Ivory `#FAF7F1` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
