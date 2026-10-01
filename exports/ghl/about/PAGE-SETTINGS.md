# About · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/about` |
| Page title | About Us | Property Management Professionals |
| Meta description | Meet Property Management Professionals and learn about our practical approach to rental management and property care in East Central Minnesota. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/about` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-hero.html` (full-width section, background `#FAF7F1`)
3. `02-leadership.html` (full-width section, background `#26272C`)
4. `03-principles.html` (full-width section, background `#EFEAE0`)
5. `04-related-business-and-cta.html` (full-width section, background `#FAF7F1`)
6. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-hero.html` | Ivory `#FAF7F1` |
| 2 | `02-leadership.html` | Charcoal `#26272C` |
| 3 | `03-principles.html` | Warm stone `#EFEAE0` |
| 4 | `04-related-business-and-cta.html` | Ivory `#FAF7F1` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
