# Short-Term Rental Management · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/short-term-rental-management` |
| Page title | Short-Term Rental Management | East Central Minnesota |
| Meta description | Get support with vacation rental listings, guest communication, pricing, and turnovers in East Central Minnesota. Discuss your property with our team. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/short-term-rental-management` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-hero.html` (full-width section, background `#26272C`)
3. `02-service-scope.html` (full-width section, background `#EFEAE0`)
4. `03-plan-and-guest-experience.html` (full-width section, background `#FFFFFF`)
5. `04-final-action.html` (full-width section, background `#FAF7F1`)
6. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-hero.html` | Charcoal `#26272C` |
| 2 | `02-service-scope.html` | Warm stone `#EFEAE0` |
| 3 | `03-plan-and-guest-experience.html` | White `#FFFFFF` |
| 4 | `04-final-action.html` | Ivory `#FAF7F1` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
